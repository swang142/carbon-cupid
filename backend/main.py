from flask import Flask, request, jsonify
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import math
import pandas as pd
from flask_cors import CORS
import time
from dotenv import load_dotenv
import os

# Update your imports
from google import genai  # This is the correct import


# Load environment variables first
load_dotenv(dotenv_path='secret.env')


# Get the API key
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
print(f"API Key loaded: {'Yes' if GEMINI_API_KEY else 'No'}")

# Import Gemini and initialize client (only once)
from google import genai
client = genai.Client(api_key=GEMINI_API_KEY)


app = Flask(__name__)
CORS(app)  # Enable CORS for Express.js frontend integration

# Set your Gemini API key
# IMPORTANT: For production, use environment variables instead of hardcoding
GEMINI_API_KEY = os.getenv(GEMINI_API_KEY)

# # Configure the Gemini API with your key
# genai.configure(api_key=GEMINI_API_KEY)

# Initialize the Gemini client
client = genai.Client(api_key="GEMINI_API_KEY")  # Replace with your actual API key


# Initialize the embedding model
def initialize_gemini():
    try:
        # Check if the model is accessible
        genai.get_model("models/embedding-001")
        print("Gemini API connection successful")
        return True
    except Exception as e:
        print(f"Error initializing Gemini API: {str(e)}")
        return False

# 1) Risk Score Calculation based on MCDR Trials data
def calculate_risk_score(trial_data):
    print("\n===== RISK SCORE CALCULATION =====")
    print(f"Input trial data: {trial_data}")
    
    # Start with baseline risk
    risk_score = 50
    print(f"Starting with baseline risk score: {risk_score}")
    
    # Status factor (more established = less risky)
    status_risk = {
        'Operating': -15,
        'Completed': -20,
        'In Progress': -10,
        'Planned': 10,
        'Proposed': 15
    }
    status = trial_data.get('Status', '')
    status_adjustment = status_risk.get(status, 0)
    risk_score += status_adjustment
    print(f"Status: '{status}' → Adjustment: {status_adjustment} → New score: {risk_score}")
    
    # Organization type factor
    org_risk = {
        'Start-up': 10,
        'Academic': 0,
        'Government': -5,
        'Established Company': -10,
        'Non-profit': 5
    }
    org_type = trial_data.get('Organization Type', '')
    org_adjustment = org_risk.get(org_type, 5)
    risk_score += org_adjustment
    print(f"Organization Type: '{org_type}' → Adjustment: {org_adjustment} → New score: {risk_score}")
    
    # CDR Method factor (some methods might be more proven than others)
    cdr_risk = {
        'Direct Air Capture': 0,
        'Enhanced Weathering': 5,
        'Afforestation': -10,
        'Ocean Alkalinity Enhancement': 10,
        'Biomass Carbon Removal and Storage': 0,
        'Direct Ocean Capture': 10
    }
    cdr_method = trial_data.get('Primary CDR Method', '')
    cdr_adjustment = cdr_risk.get(cdr_method, 5)
    risk_score += cdr_adjustment
    print(f"CDR Method: '{cdr_method}' → Adjustment: {cdr_adjustment} → New score: {risk_score}")
    
    # Duration factor (longer duration = more data = less risk)
    duration = trial_data.get('Duration of Pilot', '')
    duration_adjustment = 0
    if 'Years' in str(duration):
        duration_adjustment = -10
    elif 'Months' in str(duration):
        duration_adjustment = -5
    risk_score += duration_adjustment
    print(f"Duration: '{duration}' → Adjustment: {duration_adjustment} → New score: {risk_score}")
    
    # MRV factor (better measurement = less risk)
    mrv_provider = trial_data.get('MRV Provider')
    mrv_strategy = trial_data.get('MRV Strategy')
    mrv_adjustment = 0
    if mrv_provider and mrv_strategy:
        mrv_adjustment = -15
    risk_score += mrv_adjustment
    print(f"MRV: Provider: '{mrv_provider}', Strategy: '{mrv_strategy}' → Adjustment: {mrv_adjustment} → New score: {risk_score}")
    
    # Sequestration scale factor
    seq_adjustment = 0
    try:
        seq_value = float(trial_data.get('Sequestration per year (tons CO2/year)', 0))
        print(f"Sequestration value: {seq_value} tons CO2/year")
        if seq_value > 10000:
            seq_adjustment = -15
            print(f"  > 10,000 tons → Adjustment: {seq_adjustment}")
        elif seq_value > 1000:
            seq_adjustment = -10
            print(f"  > 1,000 tons → Adjustment: {seq_adjustment}")
        elif seq_value > 100:
            seq_adjustment = -5
            print(f"  > 100 tons → Adjustment: {seq_adjustment}")
        else:
            seq_adjustment = 5
            print(f"  ≤ 100 tons → Adjustment: {seq_adjustment}")
    except (ValueError, TypeError):
        seq_adjustment = 5
        print(f"  Invalid or missing sequestration data → Adjustment: {seq_adjustment}")
    
    risk_score += seq_adjustment
    print(f"After sequestration adjustment → New score: {risk_score}")
    
    # Partners factor (more partners = more oversight = less risk)
    partners_adjustment = 0
    if trial_data.get('Partners or Collaborator'):
        partners = str(trial_data.get('Partners or Collaborator')).split(',')
        print(f"Partners count: {len(partners)}")
        if len(partners) > 3:
            partners_adjustment = -10
            print(f"  > 3 partners → Adjustment: {partners_adjustment}")
        elif len(partners) > 1:
            partners_adjustment = -5
            print(f"  > 1 partner → Adjustment: {partners_adjustment}")
    
    risk_score += partners_adjustment
    print(f"After partners adjustment → New score: {risk_score}")
    
    # Normalize to 0-100 range
    original_score = risk_score
    risk_score = max(0, min(100, risk_score))
    if original_score != risk_score:
        print(f"Normalizing score from {original_score} to {risk_score} (0-100 range)")
    
    print(f"FINAL RISK SCORE: {risk_score}")
    print("===================================\n")
    
    return risk_score

# 2) Efficiency Score Calculation
def calculate_efficiency_score(total_credits, expected_credits, amount_invested):
    print("\n===== EFFICIENCY SCORE CALCULATION =====")
    print(f"Input: total_credits={total_credits}, expected_credits={expected_credits}, amount_invested={amount_invested}")
    
    # Default values based on historical data
    defaults = {
        'total_credits': 500,  # tons CO2
        'expected_credits': 1000,  # tons CO2
        'amount_invested': 100000  # dollars
    }
    
    # Use provided values or defaults
    tc = total_credits if total_credits is not None else defaults['total_credits']
    if total_credits is None:
        print(f"Using default value for total_credits: {tc}")
    
    ec = expected_credits if expected_credits is not None else defaults['expected_credits']
    if expected_credits is None:
        print(f"Using default value for expected_credits: {ec}")
    
    ai = amount_invested if amount_invested is not None else defaults['amount_invested']
    if amount_invested is None:
        print(f"Using default value for amount_invested: {ai}")
    
    # Avoid division by zero
    if ai <= 0:
        print(f"Amount invested is {ai} (≤ 0), returning efficiency score of 0")
        return 0
    
    # Calculate efficiency (credit per dollar)
    total_credits_sum = tc + ec
    print(f"Total credits sum (total + expected): {tc} + {ec} = {total_credits_sum}")
    
    efficiency = total_credits_sum / ai
    print(f"Raw efficiency (credits per dollar): {total_credits_sum} / {ai} = {efficiency}")
    
    # Normalize to 0-100 scale
    # Assuming efficiency of 1 ton/$100 (0.01) is excellent
    normalized_efficiency = min(100, efficiency * 10000)
    print(f"Normalized efficiency score (0-100): {efficiency} * 10000 = {efficiency * 10000}")
    if normalized_efficiency == 100:
        print("Efficiency score capped at maximum (100)")
    
    print(f"FINAL EFFICIENCY SCORE: {normalized_efficiency}")
    print("========================================\n")
    
    return normalized_efficiency

# 3) Impact Score Calculation
def calculate_impact_score(total_credits):
    print("\n===== IMPACT SCORE CALCULATION =====")
    print(f"Input: total_credits={total_credits}")
    
    # Default value
    tc = total_credits if total_credits is not None else 500
    if total_credits is None:
        print(f"Using default value for total_credits: {tc}")
    
    # Logarithmic scaling for better distribution
    # 100 credits -> ~46 score
    # 1000 credits -> ~69 score
    # 10000 credits -> ~92 score
    if tc <= 0:
        print(f"Total credits is {tc} (≤ 0), returning impact score of 0")
        return 0
    
    log_value = math.log10(tc)
    print(f"log10({tc}) = {log_value}")
    
    impact_score = min(100, 23 * log_value)
    print(f"Raw impact score: 23 * {log_value} = {23 * log_value}")
    
    if impact_score == 100:
        print("Impact score capped at maximum (100)")
    
    print(f"FINAL IMPACT SCORE: {impact_score}")
    print("===================================\n")
    
    return impact_score

# Update the get_embedding function to use the latest API
def get_embedding(text):
    """Generate embeddings using Google's Gemini embedding model"""
    print(f"Generating embedding for text: '{text[:50]}...' (truncated)")
    start_time = time.time()

    try:
        # Use the current recommended Gemini embedding model
        result = client.models.embed_content(
            model="gemini-embedding-exp-03-07",  # Latest experimental embedding model
            contents=text
        )

        # Access the embeddings from the result
        embedding = np.array(result.embeddings)
        elapsed = time.time() - start_time
        print(f"Embedding generated successfully (time: {elapsed:.2f}s, dimensions: {embedding.shape})")
        
        return embedding
    except Exception as e:
        print(f"Error generating embedding: {str(e)}")
        print("Returning fallback embedding")
        
        # Create deterministic fallback embedding
        import hashlib
        hash_obj = hashlib.md5(text.encode())
        seed = int(hash_obj.hexdigest(), 16) % (2**32)
        np.random.seed(seed)
        
        # Create normalized random vector
        embedding = np.random.randn(768)
        embedding = embedding / np.linalg.norm(embedding)
        
        return embedding

def calculate_goal_alignment(funder_description, fundee_description):
    """Calculate alignment between funder and fundee based on their descriptions"""
    print("\n===== GOAL ALIGNMENT CALCULATION =====")
    print(f"Funder description: '{funder_description}'")
    print(f"Fundee description: '{fundee_description}'")
    
    # Get embeddings from descriptions using Gemini
    print("\nGenerating funder embedding...")
    funder_embedding = get_embedding(funder_description)
    
    print("\nGenerating fundee embedding...")
    fundee_embedding = get_embedding(fundee_description)
    
    # Calculate cosine similarity between embeddings
    print("\nCalculating cosine similarity between embeddings...")
    similarity = cosine_similarity([funder_embedding], [fundee_embedding])[0][0]
    print(f"Raw cosine similarity: {similarity}")
    
    # Convert to 0-100 scale
    alignment_score = (similarity + 1) / 2 * 100
    print(f"Normalized score (0-100): ({similarity} + 1) / 2 * 100 = {alignment_score}")
    
    print(f"FINAL GOAL ALIGNMENT SCORE: {alignment_score}")
    print("======================================\n")
    
    return alignment_score

# 5) Location Match Score (Haversine distance for accurate geographic calculation)
def haversine_distance(lat1, lon1, lat2, lon2):
    print(f"Calculating Haversine distance between ({lat1}, {lon1}) and ({lat2}, {lon2})")
    
    # Convert latitude and longitude from degrees to radians
    lat1_rad, lon1_rad, lat2_rad, lon2_rad = map(math.radians, [lat1, lon1, lat2, lon2])
    print(f"Converting to radians: ({lat1_rad}, {lon1_rad}) and ({lat2_rad}, {lon2_rad})")
    
    # Haversine formula
    dlon = lon2_rad - lon1_rad
    dlat = lat2_rad - lat1_rad
    print(f"Delta latitude: {dlat}, Delta longitude: {dlon}")
    
    a = math.sin(dlat/2)**2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(dlon/2)**2
    print(f"Haversine formula 'a' component: {a}")
    
    c = 2 * math.asin(math.sqrt(a))
    print(f"Haversine formula 'c' component: {c}")
    
    r = 6371  # Radius of Earth in kilometers
    distance = c * r
    print(f"Final distance: {distance} km")
    
    return distance

def calculate_location_match(funder_location, fundee_location):
    print("\n===== LOCATION MATCH CALCULATION =====")
    print(f"Funder location: {funder_location}")
    print(f"Fundee location: {fundee_location}")
    
    try:
        # Extract latitude and longitude
        funder_lat, funder_lon = funder_location
        fundee_lat, fundee_lon = fundee_location
        
        # Calculate distance using Haversine formula
        distance = haversine_distance(funder_lat, funder_lon, fundee_lat, fundee_lon)
        print(f"Distance between locations: {distance:.2f} km")
        
        # Convert to score (closer = higher score)
        # 20000 km is approximately half the Earth's circumference
        location_score = max(0, 100 - (distance / 200))  # Normalize to 0-100
        print(f"Location score formula: max(0, 100 - ({distance} / 200)) = {location_score}")
        
        print(f"FINAL LOCATION MATCH SCORE: {location_score}")
        print("=====================================\n")
        
        return location_score
    except Exception as e:
        print(f"Error calculating location match: {str(e)}")
        print("Using default score of 50")
        # Return default score if calculation fails
        return 50

# 6) Funding Capability Match Score
def calculate_funding_capability_match(funder_capability, fundee_needs):
    print("\n===== FUNDING CAPABILITY MATCH CALCULATION =====")
    print(f"Funder capability: {funder_capability}")
    print(f"Fundee needs: {fundee_needs}")
    
    # Simple comparison check
    if fundee_needs <= 0:
        print(f"Fundee needs is {fundee_needs} (≤ 0), returning perfect match score of 100")
        return 100  # No needs means perfect match
    
    if funder_capability >= fundee_needs:
        match_score = 100  # Can fully fund the needs
        print(f"Funder can fully meet fundee needs ({funder_capability} ≥ {fundee_needs}), score = 100")
    else:
        # Partial match percentage
        match_score = (funder_capability / fundee_needs) * 100
        print(f"Partial funding match: ({funder_capability} / {fundee_needs}) * 100 = {match_score}")
    
    print(f"FINAL FUNDING CAPABILITY MATCH SCORE: {match_score}")
    print("==============================================\n")
    
    return match_score

# API Endpoints
@app.route('/api/risk-score', methods=['POST'])
def risk_score_endpoint():
    try:
        print("\n[ENDPOINT] Processing /api/risk-score request")
        data = request.json
        if not data or 'trial_data' not in data:
            print("Error: Missing trial_data field")
            return jsonify({'error': 'Missing trial_data field'}), 400
        
        trial_data = data['trial_data']
        risk_score = calculate_risk_score(trial_data)
        
        print(f"[ENDPOINT] Returning risk score: {risk_score}")
        return jsonify({
            'success': True,
            'risk_score': risk_score
        })
    except Exception as e:
        print(f"[ERROR] Risk score calculation failed: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/efficiency-score', methods=['POST'])
def efficiency_score_endpoint():
    try:
        print("\n[ENDPOINT] Processing /api/efficiency-score request")
        data = request.json
        total_credits = data.get('total_credits')
        expected_credits = data.get('expected_credits')
        amount_invested = data.get('amount_invested')
        
        efficiency_score = calculate_efficiency_score(total_credits, expected_credits, amount_invested)
        
        print(f"[ENDPOINT] Returning efficiency score: {efficiency_score}")
        return jsonify({
            'success': True,
            'efficiency_score': efficiency_score
        })
    except Exception as e:
        print(f"[ERROR] Efficiency score calculation failed: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/impact-score', methods=['POST'])
def impact_score_endpoint():
    try:
        print("\n[ENDPOINT] Processing /api/impact-score request")
        data = request.json
        total_credits = data.get('total_credits')
        
        impact_score = calculate_impact_score(total_credits)
        
        print(f"[ENDPOINT] Returning impact score: {impact_score}")
        return jsonify({
            'success': True,
            'impact_score': impact_score
        })
    except Exception as e:
        print(f"[ERROR] Impact score calculation failed: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/goal-alignment', methods=['POST'])
def goal_alignment_endpoint():
    try:
        print("\n[ENDPOINT] Processing /api/goal-alignment request")
        data = request.json
        if not data or 'funder_description' not in data or 'fundee_description' not in data:
            print("Error: Missing description data")
            return jsonify({'error': 'Missing description data'}), 400
        
        funder_description = data['funder_description']
        fundee_description = data['fundee_description']
        
        alignment_score = calculate_goal_alignment(funder_description, fundee_description)
        
        print(f"[ENDPOINT] Returning goal alignment score: {alignment_score}")
        return jsonify({
            'success': True,
            'goal_alignment_score': alignment_score
        })
    except Exception as e:
        print(f"[ERROR] Goal alignment calculation failed: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/location-match', methods=['POST'])
def location_match_endpoint():
    try:
        print("\n[ENDPOINT] Processing /api/location-match request")
        data = request.json
        if not data or 'funder_location' not in data or 'fundee_location' not in data:
            print("Error: Missing location data")
            return jsonify({'error': 'Missing location data'}), 400
        
        funder_location = data['funder_location']
        fundee_location = data['fundee_location']
        
        location_score = calculate_location_match(funder_location, fundee_location)
        
        print(f"[ENDPOINT] Returning location match score: {location_score}")
        return jsonify({
            'success': True,
            'location_match_score': location_score
        })
    except Exception as e:
        print(f"[ERROR] Location match calculation failed: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/funding-capability-match', methods=['POST'])
def funding_capability_match_endpoint():
    try:
        print("\n[ENDPOINT] Processing /api/funding-capability-match request")
        data = request.json
        if not data or 'funder_capability' not in data or 'fundee_needs' not in data:
            print("Error: Missing capability/needs data")
            return jsonify({'error': 'Missing capability/needs data'}), 400
        
        funder_capability = data['funder_capability']
        fundee_needs = data['fundee_needs']
        
        match_score = calculate_funding_capability_match(funder_capability, fundee_needs)
        
        print(f"[ENDPOINT] Returning funding capability match score: {match_score}")
        return jsonify({
            'success': True,
            'funding_capability_match_score': match_score
        })
    except Exception as e:
        print(f"[ERROR] Funding capability match calculation failed: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/', methods=['GET'])
def health_check():
    print("\n[ENDPOINT] Health check requested")
    return jsonify({"status": "API is running"})

# Add debugging for incoming requests
@app.before_request
def log_request_info():
    print(f"\n[REQUEST] {request.method} {request.path}")
    if request.headers:
        print(f"[HEADERS] Content-Type: {request.headers.get('Content-Type')}")
    if request.is_json:
        print(f"[DATA] JSON data received: {request.json}")

# Add a test endpoint for checking Gemini connectivity
@app.route('/api/test-gemini', methods=['GET'])
def test_gemini():
    try:
        print("\n[ENDPOINT] Testing Gemini API connection")
        result = initialize_gemini()
        if result:
            return jsonify({
                'success': True,
                'message': 'Gemini API connection successful'
            })
        else:
            return jsonify({
                'success': False,
                'message': 'Failed to connect to Gemini API'
            }), 500
    except Exception as e:
        print(f"[ERROR] Gemini API test failed: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    print("\n====== STARTING CARBON API SERVER ======")
    print("Starting Flask server...")
    print("Testing Gemini API connection...")
    if initialize_gemini():
        print("Gemini API connection successful!")
    else:
        print("Warning: Could not connect to Gemini API. Please check your API key and internet connection.")
    
    print("\nServer is ready to accept requests")
    print("======================================\n")
    app.run(debug=True, host='0.0.0.0', port=5000)