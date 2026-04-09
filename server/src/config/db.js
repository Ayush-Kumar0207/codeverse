// config/db.js
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn("⚠️ Supabase credentials missing from .env");
}

const supabase = createClient(supabaseUrl, supabaseKey);

const connectDB = async () => {
  // Test connection or just log readiness
  if (supabaseUrl && supabaseKey) {
    console.log("✅ Supabase Client Initialized");
  } else {
    console.error("❌ Supabase Initialization Failed: Missing credentials");
  }
};

module.exports = { supabase, connectDB };