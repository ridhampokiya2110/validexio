import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://dummy.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "dummy-anon-key";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "dummy-service-key";

// Client for browser/frontend use
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
  },
});

// Admin client for server-side operations
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export default supabase;

/**
 * Generates a short-lived signed URL for a secure Supabase asset
 * @param bucket - The storage bucket
 * @param path - The file path
 * @param expiresIn - Expiration time in seconds (default 15 mins)
 */
export async function getSignedUrl(bucket: string, path: string, expiresIn: number = 900) {
  if (!supabaseAdmin) {
    console.warn("supabaseAdmin not initialized");
    return null;
  }
  
  const { data, error } = await supabaseAdmin.storage
    .from(bucket)
    .createSignedUrl(path, expiresIn);

  if (error || !data) {
    console.error("Failed to generate signed URL:", error);
    return null;
  }

  return data.signedUrl;
}
