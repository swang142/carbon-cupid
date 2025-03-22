import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.DB_URL;
const supabaseKey = process.env.DB_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
