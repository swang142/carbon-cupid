import express from "express";
import cors from "cors";
import { supabase } from "./config/database.js";
import fundeeRoutes from "./routes/fundeeRoutes.js";

const app = express();

app.use( cors());
app.use(express.json());

app.use("/api/fundees", fundeeRoutes);

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

// Get all rows from a table
app.get("/api/:tableName", async (req, res) => {
	try {
		const { tableName } = req.params;

		// You can add query parameters for filtering, pagination, etc.
		const { limit, offset, sort } = req.query;

		let query = supabase.from(tableName).select("*");

		// Apply pagination if provided
		if (limit) query = query.limit(parseInt(limit));
		if (offset)
			query = query.range(
				parseInt(offset),
				parseInt(offset) + (parseInt(limit) || 10) - 1
			);

		// Apply sorting if provided (format: column:asc or column:desc)
		if (sort) {
			const [column, order] = sort.split(":");
			query = query.order(column, { ascending: order !== "desc" });
		}

		const { data, error } = await query;

		if (error) throw error;

		res.json({
			success: true,
			data,
			count: data.length,
		});
	} catch (err) {
		console.error("Error fetching data:", err);
		res.status(500).json({
			success: false,
			error: err.message || "Failed to fetch data",
		});
	}
});

export default app;
