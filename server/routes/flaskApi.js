import express from "express";
import axios from "axios";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const router = express.Router();

// Configuration for the Flask API
const FLASK_API_URL = process.env.FLASK_API_URL || "http://localhost:5000/api";

/**
 * Calculate match score between a funder and fundee
 * This endpoint forwards the request to the Flask API
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
 * Calculate goal alignment score
 */
router.post("/goal-alignment", async (req, res) => {
  try {
    const response = await axios.post(`${FLASK_API_URL}/goal-alignment`, req.body);
    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Error calculating goal alignment:", error);
    return res.status(500).json({ 
      success: false, 
      error: error.response?.data?.error || "Failed to calculate goal alignment score" 
    });
  }
});

/**
 * Calculate location match score
 */
router.post("/location-match", async (req, res) => {
  try {
    const response = await axios.post(`${FLASK_API_URL}/location-match`, req.body);
    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Error calculating location match:", error);
    return res.status(500).json({ 
      success: false, 
      error: error.response?.data?.error || "Failed to calculate location match score" 
    });
  }
});

/**
 * Calculate funding capability match score
 */
router.post("/funding-capability-match", async (req, res) => {
  try {
    const response = await axios.post(`${FLASK_API_URL}/funding-capability-match`, req.body);
    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Error calculating funding capability match:", error);
    return res.status(500).json({ 
      success: false, 
      error: error.response?.data?.error || "Failed to calculate funding capability match score" 
    });
  }
});

/**
 * Check if the Flask API is running
 */
router.get("/health", async (req, res) => {
  try {
    const response = await axios.get(`${FLASK_API_URL.replace("/api", "")}/`);
    return res.status(200).json({
      success: true,
      message: "Flask API is running",
      flask_status: response.data
    });
  } catch (error) {
    console.error("Error connecting to Flask API:", error);
    return res.status(500).json({ 
      success: false, 
      error: "Failed to connect to Flask API" 
    });
  }
});

/**
 * Test Gemini API connection
 */
router.get("/test-gemini", async (req, res) => {
  try {
    const response = await axios.get(`${FLASK_API_URL}/test-gemini`);
    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Error testing Gemini API:", error);
    return res.status(500).json({ 
      success: false, 
      error: error.response?.data?.error || "Failed to test Gemini API connection" 
    });
  }
});

export default router;