import { createClient } from "@supabase/supabase-js";

// Create Supabase client
const supabaseUrl = "https://bvyvuajzkofjrzxnoowq.supabase.co"; //process.env.SUPABASE_URL;
const supabaseServiceKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2eXZ1YWp6a29manJ6eG5vb3dxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwMTE4NDEsImV4cCI6MjA2ODU4Nzg0MX0.rHIPVNi4tiZIq4SlTNt4pbziGQxoDsqvTWW5nSVtvxE"; //process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseServiceKey);
