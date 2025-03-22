import express from "express";
import cors from "cors";
// import supabase from "./config/database.js";

const app = express();

app.use(cors());
app.use(express.json());

// try {
// 	const { data, error } = await supabase
// 		.from("your_table_name")
// 		.select("count(*)")
// 		.limit(1);
// 	if (error) throw error;
// 	console.log("Connection established successfully");
// } catch (err) {
// 	console.error("Database connection error:", err);
// }

export default app;