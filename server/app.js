import express from "express";
import cors from "cors";
import { sequelize } from "./config/database.js";
import { supabase } from "./config/database.js";
import fundeeRoutes from "./routes/fundeeRoutes.js";
import funderRoutes from "./routes/funderRoutes.js";
import mcdrRoutes from "./routes/mcdrRoutes.js";

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
