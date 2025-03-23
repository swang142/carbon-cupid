import requests
import json
import time
import sys

BASE_URL = "http://localhost:5001"
TIMEOUT = 15  # seconds

def print_separator():
    print("\n" + "="*60 + "\n")

def test_endpoint(name, url, method="GET", data=None, expected_status=200):
    """Test an API endpoint and report results"""
    print(f"Testing {name}...")
    start_time = time.time()
    
    try:
        if method.upper() == "GET":
            response = requests.get(url, timeout=TIMEOUT)
        else:  # POST
            response = requests.post(url, json=data, timeout=TIMEOUT)
        
        elapsed = time.time() - start_time
        
        # Print response details
        print(f"Status: {response.status_code} (expected: {expected_status})")
        print(f"Time: {elapsed:.2f} seconds")
        
        try:
            json_response = response.json()
            print(f"Response: {json.dumps(json_response, indent=2)}")
            
            # Check success status
            success = response.status_code == expected_status
            if success:
                print(f"✅ {name}: SUCCESS")
            else:
                print(f"❌ {name}: FAILED - Status code {response.status_code} != {expected_status}")
            
            return success
            
        except ValueError:
            print(f"Response is not JSON: {response.text}")
            print(f"❌ {name}: FAILED - Not a valid JSON response")
            return False
            
    except requests.exceptions.Timeout:
        print(f"❌ {name}: FAILED - Request timed out after {TIMEOUT} seconds")
        return False
    except requests.exceptions.ConnectionError:
        print(f"❌ {name}: FAILED - Connection error. Is the server running?")
        return False
    except Exception as e:
        print(f"❌ {name}: FAILED - Unexpected error: {str(e)}")
        return False

# Test data for each endpoint
test_data = {
    "risk-score": {
        "trial_data": {
            "Status": "Completed",
            "Organization Type": "Start-up",
            "Primary CDR Method": "Direct Ocean Capture",
            "Duration of Pilot": "Months",
            "MRV Provider": "Carbon Plan",
            "MRV Strategy": "Direct measurement",
            "Sequestration per year (tons CO2/year)": 500,
            "Partners or Collaborator": "University of California, NREL"
        }
    },
    "efficiency-score": {
        "total_credits": 300,
        "expected_credits": 1200,
        "amount_invested": 50000
    },
    "impact-score": {
        "total_credits": 1000
    },
    "goal-alignment": {
        "funder_description": "We fund innovative direct air capture technologies focused on scalable solutions.",
        "fundee_description": "Our startup develops direct ocean capture technology to remove CO2 from seawater."
    },
    "location-match": {
        "funder_location": [37.7749, -122.4194],
        "fundee_location": [37.8719, -122.2585]
    },
    "funding-capability-match": {
        "funder_capability": 750000,
        "fundee_needs": 500000
    }
}

def main():
    print("\n🔍 CARBON API TESTING TOOL 🔍\n")
    
    # Step 1: Test health endpoint
    print_separator()
    print("STEP 1: Checking if server is running...\n")
    server_ok = test_endpoint("Health Check", f"{BASE_URL}/", "GET")
    
    if not server_ok:
        print("\n❌ Server health check failed. Exiting tests.")
        sys.exit(1)
    
    # Step 2: Test Gemini API connection
    print_separator()
    print("STEP 2: Testing Gemini API connection...\n")
    gemini_ok = test_endpoint("Gemini API Connection", f"{BASE_URL}/api/test-gemini", "GET")
    
    if not gemini_ok:
        print("\n⚠️ Gemini API test failed. Continuing with other tests, but embeddings may not work.")
    
    # Step 3: Test simple endpoints
    print_separator()
    print("STEP 3: Testing simple calculation endpoints...\n")
    
    simple_endpoints = [
        ("Funding Capability Match", "funding-capability-match", test_data["funding-capability-match"]),
        ("Efficiency Score", "efficiency-score", test_data["efficiency-score"]),
        ("Impact Score", "impact-score", test_data["impact-score"]),
        ("Location Match", "location-match", test_data["location-match"])
    ]
    
    simple_results = []
    for name, endpoint, data in simple_endpoints:
        result = test_endpoint(name, f"{BASE_URL}/api/{endpoint}", "POST", data)
        simple_results.append(result)
        print()  # Add spacing
    
    # Step 4: Test risk score endpoint
    print_separator()
    print("STEP 4: Testing risk score calculation...\n")
    risk_result = test_endpoint("Risk Score", f"{BASE_URL}/api/risk-score", "POST", test_data["risk-score"])
    
    # Step 5: Test goal alignment (embeddings)
    print_separator()
    print("STEP 5: Testing goal alignment (embeddings)...\n")
    alignment_result = test_endpoint("Goal Alignment", f"{BASE_URL}/api/goal-alignment", "POST", test_data["goal-alignment"])
    
    # Summary
    print_separator()
    print("TEST SUMMARY\n")
    
    total_tests = len(simple_endpoints) + 3  # health, risk, goal alignment
    successful_tests = sum([1 for result in [server_ok, risk_result, alignment_result] + simple_results if result])
    
    print(f"Total tests: {total_tests}")
    print(f"Successful: {successful_tests}")
    print(f"Failed: {total_tests - successful_tests}")
    
    if successful_tests == total_tests:
        print("\n✅ ALL TESTS PASSED! Your API is working correctly.")
    else:
        print(f"\n⚠️ {total_tests - successful_tests} test(s) failed. Review the output above for details.")

if __name__ == "__main__":
    main()