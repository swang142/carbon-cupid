import { createClient } from 'jsr:@supabase/supabase-js@2'

const supabaseUrl = process.env.DB_URL
const supabaseKey = process.env.DB_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase


