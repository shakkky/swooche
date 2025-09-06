import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://bvyvuajzkofjrzxnoowq.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2eXZ1YWp6a29manJ6eG5vb3dxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwMTE4NDEsImV4cCI6MjA2ODU4Nzg0MX0.rHIPVNi4tiZIq4SlTNt4pbziGQxoDsqvTWW5nSVtvxE";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
