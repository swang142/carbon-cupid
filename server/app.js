// server/app.js
import express from "express";
import cors from "cors";
import { sequelize } from "./config/database.js";
import { supabase } from "./config/database.js";
import fundeeRoutes from "./routes/fundeeRoutes.js";
import funderRoutes from "./routes/funderRoutes.js";
import mcdrRoutes from "./routes/mcdrRoutes.js";
import flaskApiRoutes from "./routes/flaskApi.js"; // Import Flask API routes

const app = express();

app.use(cors());
app.use(express.json());

// API routes
app.use("/api/fundees", fundeeRoutes);
app.use("/api/funders", funderRoutes);
app.use("/api/mcdrs", mcdrRoutes);
app.use("/api/flask", flaskApiRoutes); // Add Flask API routes

// Basic connection test
app.get("/api/health", async (req, res) => {
	try {
		const { data, error } = await supabase
			.from("health")
			.select("*")
			.limit(1);
		if (error) throw error;
		res.json({ status: "Connected to Supabase successfully" });
	} catch (err) {
		console.error("Database connection error:", err);
		res.status(500).json({ error: "Failed to connect to database" });
	}
});

sequelize
	.authenticate()
	.then(() => {
		console.log("Connection established successfully");
		return sequelize.sync({ alter: true }); // This will create/update tables
	})
	.then(() => {
		console.log("Database synchronized successfully");
	})
	.catch((err) => {
		console.error("Database connection/sync error:", err);
	});


// call kenny apis
// called whem fundee signs up
app.get("/api/calc-base-scores/:id", async (req, res) => {
	try {
		const fundee = await Fundee.findByPk(req.params.id);

		if (!fundee) {
			return res.status(404).json({ error: "Fundee not found" });
		}

		console.log("Calculating scores for fundee ID:", req.params.id);

		const fundee_reformatted = {
			expected_credits: fundee.dataValues.expected_credits,
			amount_invested: fundee.dataValues.current_funding,
			total_credits: fundee.dataValues.total_credits_issued,
			fundee_description: fundee.dataValues.company_description,
			fundee_location: [
				fundee.dataValues.longitude,
				fundee.dataValues.latitude,
			],
			fundee_needs: fundee.dataValues.current_funding,
		};

		console.log("Reformatted fundee data:", fundee_reformatted);

		try {
			// Call risk score endpoint
			const risk_score_data = await axios.post(
				"http://127.0.0.1:5001/api/risk-score",
				fundee_reformatted
			);
			console.log("Risk score response:", risk_score_data.data);

			// Call efficiency score endpoint
			const efficiency_score_data = await axios.post(
				"http://127.0.0.1:5001/api/efficiency-score",
				fundee_reformatted
			);
			console.log(
				"Efficiency score response:",
				efficiency_score_data.data
			);

			// Call impact score endpoint
			const impact_score_data = await axios.post(
				"http://127.0.0.1:5001/api/impact-score",
				fundee_reformatted
			);
			console.log("Impact score response:", impact_score_data.data);

			// Update the fundee with scores
			await fundee.update({
				risk_score: risk_score_data.data.risk_score || 0,
				efficiency_score:
					efficiency_score_data.data.efficiency_score || 0,
				impact_score: impact_score_data.data.impact_score || 0,
			});

			// Return the scores in a format the front-end expects
			res.status(200).json([
				{ risk_score: risk_score_data.data.risk_score || 0 },
				{
					efficiency_score:
						efficiency_score_data.data.efficiency_score || 0,
				},
				{ impact_score: impact_score_data.data.impact_score || 0 },
			]);
		} catch (apiError) {
			console.error("Error calling score APIs:", apiError);

			// Set default scores if API calls fail
			const defaultRiskScore = 0;
			const defaultEfficiencyScore = 0;
			const defaultImpactScore = 0;

			// Still update the fundee with default scores
			await fundee.update({
				risk_score: defaultRiskScore,
				efficiency_score: defaultEfficiencyScore,
				impact_score: defaultImpactScore,
			});

			// Return default scores
			res.status(200).json([
				{ risk_score: defaultRiskScore },
				{ efficiency_score: defaultEfficiencyScore },
				{ impact_score: defaultImpactScore },
			]);
		}
	} catch (error) {
		console.error("Score calculation error:", error);
		res.status(500).json({ error: "Failed to fetch base scores" });
	}
});

// //called when funder makes query
// app.get("/api/risk-score", async (req, res) => {

// })

sequelize
	.authenticate()
	.then(() => {
		console.log("Connection established successfully");
		return sequelize.sync({ alter: true }); // This will create/update tables
	})
	.then(() => {
		console.log("Database synchronized successfully");
	})
	.catch((err) => {
		console.error("Database connection/sync error:", err);
	});

export default app;
