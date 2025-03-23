// This is a sample Express.js code to connect to the Python API
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3005;
const PYTHON_API_URL = 'http://localhost:5000';

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Proxy endpoint for Risk Score
app.post('/risk-score', async (req, res) => {
  try {
    const response = await axios.post(`${PYTHON_API_URL}/api/risk-score`, req.body);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.response?.data?.error || 'Failed to calculate risk score'
    });
  }
});

// Proxy endpoint for Efficiency Score
app.post('/efficiency-score', async (req, res) => {
  try {
    const response = await axios.post(`${PYTHON_API_URL}/api/efficiency-score`, req.body);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.response?.data?.error || 'Failed to calculate efficiency score'
    });
  }
});

// Proxy endpoint for Impact Score
app.post('/impact-score', async (req, res) => {
  try {
    const response = await axios.post(`${PYTHON_API_URL}/api/impact-score`, req.body);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.response?.data?.error || 'Failed to calculate impact score'
    });
  }
});

// Proxy endpoint for Goal Alignment
app.post('/goal-alignment', async (req, res) => {
  try {
    const response = await axios.post(`${PYTHON_API_URL}/api/goal-alignment`, req.body);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.response?.data?.error || 'Failed to calculate goal alignment'
    });
  }
});

// Proxy endpoint for Location Match
app.post('/location-match', async (req, res) => {
  try {
    const response = await axios.post(`${PYTHON_API_URL}/api/location-match`, req.body);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.response?.data?.error || 'Failed to calculate location match'
    });
  }
});

// Proxy endpoint for Funding Capability Match
app.post('/funding-capability-match', async (req, res) => {
  try {
    const response = await axios.post(`${PYTHON_API_URL}/api/funding-capability-match`, req.body);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.response?.data?.error || 'Failed to calculate funding capability match'
    });
  }
});

// Calculate all scores at once
app.post('/calculate-all-scores', async (req, res) => {
  try {
    const { 
      trial_data, 
      total_credits, 
      expected_credits, 
      amount_invested,
      funder_description,
      fundee_description,
      funder_location,
      fundee_location,
      funder_capability,
      fundee_needs
    } = req.body;
    
    // Make parallel requests to all endpoints
    const [
      riskResponse, 
      efficiencyResponse, 
      impactResponse,
      alignmentResponse,
      locationResponse,
      capabilityResponse
    ] = await Promise.all([
      axios.post(`${PYTHON_API_URL}/api/risk-score`, { trial_data }),
      axios.post(`${PYTHON_API_URL}/api/efficiency-score`, { total_credits, expected_credits, amount_invested }),
      axios.post(`${PYTHON_API_URL}/api/impact-score`, { total_credits }),
      axios.post(`${PYTHON_API_URL}/api/goal-alignment`, { funder_description, fundee_description }),
      axios.post(`${PYTHON_API_URL}/api/location-match`, { funder_location, fundee_location }),
      axios.post(`${PYTHON_API_URL}/api/funding-capability-match`, { funder_capability, fundee_needs })
    ]);
    
    // Combine all results
    res.json({
      success: true,
      risk_score: riskResponse.data.risk_score,
      efficiency_score: efficiencyResponse.data.efficiency_score,
      impact_score: impactResponse.data.impact_score,
      goal_alignment_score: alignmentResponse.data.goal_alignment_score,
      location_match_score: locationResponse.data.location_match_score,
      funding_capability_match_score: capabilityResponse.data.funding_capability_match_score
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.response?.data?.error || 'Failed to calculate scores'
    });
  }
});

app.listen(port, () => {
  console.log(`Express server listening at http://localhost:${port}`);
});