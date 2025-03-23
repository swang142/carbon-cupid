// server/routes/flaskApi.js
import express from "express";
import axios from "axios";

const router = express.Router();

// Flask API URL - change to your Flask server URL
const FLASK_API_URL = process.env.FLASK_API_URL || "http://localhost:5000/api";

/**
 * Calculate match score between a funder and fundee
 */
router.post("/calculate-match", async (req, res) => {
  try {
    const { funder_id, fundee_id } = req.body;
    
    if (!funder_id || !fundee_id) {
      return res.status(400).json({ 
        success: false, 
        error: "Missing funder_id or fundee_id" 
      });
    }

    // Forward the request to the Flask API
    const response = await axios.post(`${FLASK_API_URL}/calculate-match`, req.body);
    
    // Return the Flask API response
    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Error calculating match:", error);
    return res.status(500).json({ 
      success: false, 
      error: error.response?.data?.error || "Failed to calculate match score" 
    });
  }
});

/**
 * Calculate efficiency score
 */
router.post("/efficiency-score", async (req, res) => {
  try {
    const response = await axios.post(`${FLASK_API_URL}/efficiency-score`, req.body);
    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Error calculating efficiency score:", error);
    return res.status(500).json({ 
      success: false, 
      error: error.response?.data?.error || "Failed to calculate efficiency score" 
    });
  }
});

/**
 * Calculate impact score
 */
router.post("/impact-score", async (req, res) => {
  try {
    const response = await axios.post(`${FLASK_API_URL}/impact-score`, req.body);
    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Error calculating impact score:", error);
    return res.status(500).json({ 
      success: false, 
      error: error.response?.data?.error || "Failed to calculate impact score" 
    });
  }
});

/**
 * Health check endpoint
 */
router.get("/health", async (req, res) => {
  try {
    const response = await axios.get(FLASK_API_URL.replace('/api', '/'));
    return res.json({
      success: true,
      message: "Flask API is running",
      status: response.data
    });
  } catch (error) {
    console.error("Error connecting to Flask API:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to connect to Flask API"
    });
  }
});

export default router;