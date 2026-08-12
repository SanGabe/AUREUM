import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  throw new Error("Defina NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY.");
}

const supabase = createClient(url, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const options = {
  public: false,
  fileSizeLimit: 20 * 1024 * 1024,
  allowedMimeTypes: [
    "text/csv",
    "text/plain",
    "application/pdf",
    "application/x-ofx",
    "application/vnd.intu.qfx",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "image/jpeg",
    "image/png",
    "image/webp",
  ],
};

const { data: existing } = await supabase.storage.getBucket("financial-imports");
const operation = existing
  ? supabase.storage.updateBucket("financial-imports", options)
  : supabase.storage.createBucket("financial-imports", options);
const { error } = await operation;

if (error) throw error;
console.log("Bucket privado financial-imports configurado com limite de 20 MB.");
