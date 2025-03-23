import { Sequelize } from "sequelize";
import { createClient } from "@supabase/supabase-js";

const sequelize = new Sequelize(process.env.DB_URI);

// Use consistent environment variable names with the frontend
const supabaseUrl =
	process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
// Use service role key for administrative operations
const supabaseKey =
	process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
	console.warn("Supabase credentials are missing or incomplete");
}

console.log("Using Supabase URL:", supabaseUrl);
console.log(
	"Using Supabase key type:",
	supabaseKey?.includes("service_role") ? "service role key" : "anonymous key"
);

const supabase = createClient(supabaseUrl || "", supabaseKey || "");

export { sequelize, supabase };
