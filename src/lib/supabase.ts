import { createClient } from "@supabase/supabase-js";

// These variables must be set in Netlify Environment Settings for production,
// or in a local .env file for development (prefixed with VITE_).
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY). " +
      "For local development add them to .env. " +
      "For production add them in Netlify → Site settings → Environment variables.",
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
