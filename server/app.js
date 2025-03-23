// server/app.js
import express from "express";
import cors from "cors";
import { sequelize } from "./config/database.js";
import { supabase } from "./config/database.js";
import fundeeRoutes from "./routes/fundeeRoutes.js";
import funderRoutes from "./routes/funderRoutes.js";
import mcdrRoutes from "./routes/mcdrRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import { Fundee, Funders } from "./models/models.js";

import axios from "axios";
import path from "path";
import { fileURLToPath } from "url";

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// API routes
app.use("/api/fundees", fundeeRoutes);
app.use("/api/funders", funderRoutes);
app.use("/api/mcdrs", mcdrRoutes);
app.use("/api/upload", uploadRoutes);

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
		const risk_score_data = await axios.post(
			"http://127.0.0.1:5001/api/risk-score",
			fundee_reformatted
		);
		const efficiency_score_data = await axios.post(
			"http://127.0.0.1:5001/api/efficiency-score",
			fundee_reformatted
		);
		const impact_score = await axios.post(
			"http://127.0.0.1:5001/api/impact-score",
			fundee_reformatted
		);

		await fundee.update({
			risk_score: risk_score_data.data.risk_score,
			efficiency_score: efficiency_score_data.data.efficiency_score,
			impact_score: impact_score.data.impact_score,
		});

		res.status(200).send([
			risk_score_data.data,
			efficiency_score_data.data,
			impact_score.data,
		]);
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: "Failed to fetch base scores" });
	}
});

// //called when funder makes query
app.post("/api/calc-dynamic-scores", async (req, res) => {
	const { fundee_id, funder_id, funder_query } = req.body;
	try {
		const fundee = await Fundee.findByPk(fundee_id);
		const funder = await Funders.findByPk(funder_id);
		const data_reformatted = {
			fundee_description: fundee.dataValues.company_description,
			funder_description:
				funder.dataValues.company_description + funder_query,
			fundee_location: [
				fundee.dataValues.longitude,
				fundee.dataValues.latitude,
			],
			funder_location: [
				funder.dataValues.longitude,
				funder.dataValues.latitude,
			],
			funder_capability:
				fundee.dataValues.funding_requested -
				funder.dataValues.current_funding,
			fundee_needs: fundee.dataValues.current_funding,
		};

		const goal_alignment = await axios.post(
			"http://127.0.0.1:5001/api/goal-alignment",
			data_reformatted
		);
		const location_match = await axios.post(
			"http://127.0.0.1:5001/api/location-match",
			data_reformatted
		);
		const funding_capability_match = await axios.post(
			"http://127.0.0.1:5001/api/funding-capability-match",
			data_reformatted
		);

		res.status(200).send([
			goal_alignment.data,
			location_match.data,
			funding_capability_match.data,
		]);
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: "Failed to fetch dynamic scores" });
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

export default app;
