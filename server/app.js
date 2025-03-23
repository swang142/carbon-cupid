import express from "express";
import cors from "cors";
import { sequelize } from "./config/database.js";
import { supabase } from "./config/database.js";
import fundeeRoutes from "./routes/fundeeRoutes.js";
import funderRoutes from "./routes/funderRoutes.js";
import mcdrRoutes from "./routes/mcdrRoutes.js";
import { Fundee } from "./models/models.js";
import axios from "axios";

const app = express();

app.use(cors());
app.use(express.json());


app.use("/api/fundees", fundeeRoutes);
app.use("/api/funders", funderRoutes);
app.use("/api/mcdrs", mcdrRoutes);

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
            fundee_location: [fundee.dataValues.longitude, fundee.dataValues.latitude],
            fundee_needs: fundee.dataValues.current_funding,
            "trial_data": {
                "Status": "Operating",
                "Organization Type": "Start-up",
                "Primary CDR Method": "Direct Ocean Capture",
                "Duration of Pilot": "Months",
                "MRV Provider": "Carbon Plan",
                "MRV Strategy": "Direct measurement",
                "Sequestration per year (tons CO2/year)": 500,
                "Partners or Collaborator": "University of California, NREL"
            },
        }
        const risk_score_data = await axios.post("http://127.0.0.1:5000/api/risk-score", fundee_reformatted)
        const efficiency_score_data = await axios.post("http://127.0.0.1:5000/api/efficiency-score", fundee_reformatted)
        const impact_score = await axios.post("http://127.0.0.1:5000/api/impact-score", fundee_reformatted)
        res.status(200).send([risk_score_data.data, efficiency_score_data.data, impact_score.data])
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Failed to fetch base scores" });
    }
});

// //called when funder makes query
// app.get("/api/risk-score", async (req, res) => {

// })


sequelize.authenticate()
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
