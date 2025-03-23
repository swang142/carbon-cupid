from flask import Flask, request, jsonify
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import math
import pandas as pd
from flask_cors import CORS
import torch
from transformers import AutoTokenizer, AutoModel

app = Flask(__name__)
CORS(app)  # Enable CORS for Express.js frontend integration

# Load pre-trained model and tokenizer for embeddings
model_name = "sentence-transformers/all-MiniLM-L6-v2"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModel.from_pretrained(model_name)

# 1) Risk Score Calculation based on MCDR Trials data
def calculate_risk_score(trial_data):
    # Start with baseline risk
    risk_score = 50
    
    # Status factor (more established = less risky)
    status_risk = {
        'Operating': -15,
        'Completed': -20,
        'In Progress': -10,
        'Planned': 10,
        'Proposed': 15
    }
    risk_score += status_risk.get(trial_data.get('Status', ''), 0)
    
    # Organization type factor
    org_risk = {
        'Start-up': 10,
        'Academic': 0,
        'Government': -5,
        'Established Company': -10,
        'Non-profit': 5
    }
    risk_score += org_risk.get(trial_data.get('Organization Type', ''), 5)
    
    # CDR Method factor (some methods might be more proven than others)
    cdr_risk = {
        'Direct Air Capture': 0,
        'Enhanced Weathering': 5,
        'Afforestation': -10,
        'Ocean Alkalinity Enhancement': 10,
        'Biomass Carbon Removal and Storage': 0,
        'Direct Ocean Capture': 10
    }
    risk_score += cdr_risk.get(trial_data.get('Primary CDR Method', ''), 5)
    
    # Duration factor (longer duration = more data = less risk)
    duration = trial_data.get('Duration of Pilot', '')
    if 'Years' in str(duration):
        risk_score -= 10
    elif 'Months' in str(duration):
        risk_score -= 5
    
    # MRV factor (better measurement = less risk)
    if trial_data.get('MRV Provider') and trial_data.get('MRV Strategy'):
        risk_score -= 15
    
    # Sequestration scale factor
    try:
        seq_value = float(trial_data.get('Sequestration per year (tons CO2/year)', 0))
        if seq_value > 10000:
            risk_score -= 15
        elif seq_value > 1000:
            risk_score -= 10
        elif seq_value > 100:
            risk_score -= 5
        else:
            risk_score += 5
    except (ValueError, TypeError):
        risk_score += 5  # Penalty for missing/invalid data
    
    # Partners factor (more partners = more oversight = less risk)
    if trial_data.get('Partners or Collaborator'):
        partners = str(trial_data.get('Partners or Collaborator')).split(',')
        if len(partners) > 3:
            risk_score -= 10
        elif len(partners) > 1:
            risk_score -= 5
    
    # Normalize to 0-100 range
    risk_score = max(0, min(100, risk_score))
    return risk_score

# 2) Efficiency Score Calculation
def calculate_efficiency_score(total_credits, expected_credits, amount_invested):
    # Default values based on historical data
    defaults = {
        'total_credits': 500,  # tons CO2
        'expected_credits': 1000,  # tons CO2
        'amount_invested': 100000  # dollars
    }
    
    # Use provided values or defaults
    tc = total_credits if total_credits is not None else defaults['total_credits']
    ec = expected_credits if expected_credits is not None else defaults['expected_credits']
    ai = amount_invested if amount_invested is not None else defaults['amount_invested']
    
    # Avoid division by zero
    if ai <= 0:
        return 0
    
    # Calculate efficiency (credit per dollar)
    efficiency = (tc + ec) / ai
    
    # Normalize to 0-100 scale
    # Assuming efficiency of 1 ton/$100 (0.01) is excellent
    normalized_efficiency = min(100, efficiency * 10000)
    
    return normalized_efficiency

# 3) Impact Score Calculation
def calculate_impact_score(total_credits):
    # Default value
    tc = total_credits if total_credits is not None else 500
    
    # Logarithmic scaling for better distribution
    # 100 credits -> ~46 score
    # 1000 credits -> ~69 score
    # 10000 credits -> ~92 score
    if tc <= 0:
        return 0
    
    impact_score = min(100, 23 * math.log10(tc))
    
    return impact_score

# 4) Goal Alignment Score (Cosine Similarity)
def get_embedding(text):
    """Generate embeddings for a given text using the pre-trained model"""
    # Tokenize and prepare for the model
    inputs = tokenizer(text, padding=True, truncation=True, return_tensors="pt", max_length=512)
    
    # Get model output
    with torch.no_grad():
        outputs = model(**inputs)
    
    # Use mean pooling to get sentence embedding
    token_embeddings = outputs.last_hidden_state
    attention_mask = inputs['attention_mask']
    
    # Mask padding tokens
    input_mask_expanded = attention_mask.unsqueeze(-1).expand(token_embeddings.size()).float()
    
    # Sum the masked embeddings and normalize
    sum_embeddings = torch.sum(token_embeddings * input_mask_expanded, 1)
    sum_mask = torch.clamp(input_mask_expanded.sum(1), min=1e-9)
    embedding = sum_embeddings / sum_mask
    
    # Convert to numpy for compatibility with sklearn
    return embedding.numpy()[0]

def calculate_goal_alignment(funder_description, fundee_description):
    """Calculate alignment between funder and fundee based on their descriptions"""
    # Get embeddings from descriptions
    funder_embedding = get_embedding(funder_description)
    fundee_embedding = get_embedding(fundee_description)
    
    # Calculate cosine similarity between embeddings
    similarity = cosine_similarity([funder_embedding], [fundee_embedding])[0][0]
    
    # Convert to 0-100 scale
    alignment_score = (similarity + 1) / 2 * 100
    
    return alignment_score

# 5) Location Match Score (Haversine distance for accurate geographic calculation)
def haversine_distance(lat1, lon1, lat2, lon2):
    # Convert latitude and longitude from degrees to radians
    lat1, lon1, lat2, lon2 = map(math.radians, [lat1, lon1, lat2, lon2])
    
    # Haversine formula
    dlon = lon2 - lon1
    dlat = lat2 - lat1
    a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2
    c = 2 * math.asin(math.sqrt(a))
    r = 6371  # Radius of Earth in kilometers
    
    return c * r

def calculate_location_match(funder_location, fundee_location):
    try:
        # Extract latitude and longitude
        funder_lat, funder_lon = funder_location
        fundee_lat, fundee_lon = fundee_location
        
        # Calculate distance using Haversine formula
        distance = haversine_distance(funder_lat, funder_lon, fundee_lat, fundee_lon)
        
        # Convert to score (closer = higher score)
        # 20000 km is approximately half the Earth's circumference
        location_score = max(0, 100 - (distance / 200))  # Normalize to 0-100
        
        return location_score
    except Exception as e:
        # Return default score if calculation fails
        return 50

# 6) Funding Capability Match Score
def calculate_funding_capability_match(funder_capability, fundee_needs):
    # Simple comparison check
    if fundee_needs <= 0:
        return 100  # No needs means perfect match
    
    if funder_capability >= fundee_needs:
        match_score = 100  # Can fully fund the needs
    else:
        # Partial match percentage
        match_score = (funder_capability / fundee_needs) * 100
    
    return match_score

# API Endpoints
@app.route('/api/risk-score', methods=['POST'])
def risk_score_endpoint():
    try:
        data = request.json
        if not data or 'trial_data' not in data:
            return jsonify({'error': 'Missing trial_data field'}), 400
        
        trial_data = data['trial_data']
        risk_score = calculate_risk_score(trial_data)
        
        return jsonify({
            'success': True,
            'risk_score': risk_score
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/efficiency-score', methods=['POST'])
def efficiency_score_endpoint():
    try:
        data = request.json
        total_credits = data.get('total_credits')
        expected_credits = data.get('expected_credits')
        amount_invested = data.get('amount_invested')
        
        efficiency_score = calculate_efficiency_score(total_credits, expected_credits, amount_invested)
        
        return jsonify({
            'success': True,
            'efficiency_score': efficiency_score
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/impact-score', methods=['POST'])
def impact_score_endpoint():
    try:
        data = request.json
        total_credits = data.get('total_credits')
        
        impact_score = calculate_impact_score(total_credits)
        
        return jsonify({
            'success': True,
            'impact_score': impact_score
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/goal-alignment', methods=['POST'])
def goal_alignment_endpoint():
    try:
        data = request.json
        if not data or 'funder_description' not in data or 'fundee_description' not in data:
            return jsonify({'error': 'Missing description data'}), 400
        
        funder_description = data['funder_description']
        fundee_description = data['fundee_description']
        
        alignment_score = calculate_goal_alignment(funder_description, fundee_description)
        
        return jsonify({
            'success': True,
            'goal_alignment_score': alignment_score
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/location-match', methods=['POST'])
def location_match_endpoint():
    try:
        data = request.json
        if not data or 'funder_location' not in data or 'fundee_location' not in data:
            return jsonify({'error': 'Missing location data'}), 400
        
        funder_location = data['funder_location']
        fundee_location = data['fundee_location']
        
        location_score = calculate_location_match(funder_location, fundee_location)
        
        return jsonify({
            'success': True,
            'location_match_score': location_score
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/funding-capability-match', methods=['POST'])
def funding_capability_match_endpoint():
    try:
        data = request.json
        if not data or 'funder_capability' not in data or 'fundee_needs' not in data:
            return jsonify({'error': 'Missing capability/needs data'}), 400
        
        funder_capability = data['funder_capability']
        fundee_needs = data['fundee_needs']
        
        match_score = calculate_funding_capability_match(funder_capability, fundee_needs)
        
        return jsonify({
            'success': True,
            'funding_capability_match_score': match_score
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)