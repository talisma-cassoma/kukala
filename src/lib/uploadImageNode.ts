import { getSupabaseClient, supabaseAdmin  } from "./supabase";
import { readdir, readFile } from "fs/promises";
import { join, extname } from "path";

const BUCKET = "kukala";

function getContentType(fileName: string) {
  switch (extname(fileName).toLowerCase()) {
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".png":
      return "image/png";
    case ".gif":
      return "image/gif";
    case ".svg":
      return "image/svg+xml";
    case ".webp":
      return "image/webp";
    case ".avif":
      return "image/avif";
    case ".json":
      return "application/json";
    case ".pdf":
      return "application/pdf";
    case ".txt":
      return "text/plain";
    default:
      return "application/octet-stream";
  }
}

export async function uploadImage(dirPath: string) {
  const supabase = supabaseAdmin ;

// const { data, error } = await supabase.storage.listBuckets();

// const { data, error } = await supabase.storage
//   .from("kukala")
//   .list();

// console.log(data);
// console.log(error);

  const productSlug = dirPath.split("/").pop() as string;
  const uploads: { [key: string]: string | string[] } = {
    thumbnail: "",
    body: [],
    variants: [],
  };

  const publicUrl = supabase.storage.from(BUCKET).getPublicUrl("").data.publicUrl;

  const entries = await readdir(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dirPath, entry.name);
    if (entry.isFile()) {
      if (entry.name.startsWith("thumbnail.")) {
        const file = await readFile(fullPath);
        const path = `${productSlug}/${entry.name}`;
        const { error } = await supabase.storage
          .from(BUCKET)
          .upload(path, file, {
            cacheControl: "3600",
            upsert: true,
            contentType: getContentType(entry.name),
          });
        if (error) throw error;
        uploads.thumbnail = `${publicUrl}/${path}`;
      }
    } else if (entry.isDirectory()) {
      if (entry.name === "body") {
        const bodyDirPath = fullPath;
        const bodyEntries = await readdir(bodyDirPath, { withFileTypes: true });
        const bodyUploads: string[] = [];
        for (const bodyEntry of bodyEntries) {
          if (bodyEntry.isFile()) {
            const bodyFilePath = join(bodyDirPath, bodyEntry.name);
            const file = await readFile(bodyFilePath);
            const path = `${productSlug}/body/${bodyEntry.name}`;
            const { error } = await supabase.storage
              .from(BUCKET)
              .upload(path, file, {
                cacheControl: "3600",
                upsert: true,
                contentType: getContentType(bodyEntry.name),
              });
            if (error) throw error;
            bodyUploads.push(`${publicUrl}/${path}`);
          }
        }
        uploads.body = bodyUploads;
      } else if (entry.name === "variants") {
        // The logic for variants can be added here if needed.
        // For now, it is an empty array.
      }
    }
  }

  return uploads;
}
