import { Sequelize } from "sequelize";
import { createClient } from "@supabase/supabase-js";

const sequelize = new Sequelize(process.env.DB_URI);

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export { sequelize, supabase };
