import { getSupabaseClient } from "@/lib/supabase";


const BUCKET = "kukala";

export async function uploadImage(dir: FileSystemDirectoryHandle) {
  const supabase = getSupabaseClient();

  const productSlug = dir.name;

  const uploads: string[] = [];

/*A estrutura esperada seria:
iphone-17-pro/
├── thumbnail.webp
├── body/
│   ├── camera.webp
│   └── screen.webp
└── variants/
    ├── BLACK-128/
    │   ├── front.webp
    │   └── back.webp
    └── WHITE-256/
        ├── front.webp
        └── back.webp
*/
  for await (const [name, handle] of dir.entries()) {
    if (handle.kind === "file") {
      // thumbnail.webp
      if (name.startsWith("thumbnail.")) {
        const file = await handle.getFile();

        const path = `${productSlug}/${name}`;

        const { error } = await supabase.storage
          .from(BUCKET)
          .upload(path, file, {
            cacheControl: "3600",
            upsert: true,
          });

        if (error) throw error;

        uploads.push(path);
      }
    }

    if (handle.kind === "directory") {
      //
      // body/
      //
      if (handle.name === "body") {
        for await (const [, fileHandle] of handle.entries()) {
          if (fileHandle.kind !== "file") continue;

          const file = await fileHandle.getFile();

          const path = `${productSlug}/body/${file.name}`;

          const { error } = await supabase.storage
            .from(BUCKET)
            .upload(path, file, {
              cacheControl: "3600",
              upsert: true,
            });

          if (error) throw error;

          uploads.push(path);
        }
      }

      //
      // variants/
      //
      if (handle.name === "variants") {
        for await (const [, variantDir] of handle.entries()) {
          if (variantDir.kind !== "directory") continue;

          const sku = variantDir.name;

          for await (const [, fileHandle] of variantDir.entries()) {
            if (fileHandle.kind !== "file") continue;

            const file = await fileHandle.getFile();

            const path = `${productSlug}/variants/${sku}/${file.name}`;

            const { error } = await supabase.storage
              .from(BUCKET)
              .upload(path, file, {
                cacheControl: "3600",
                upsert: true,
              });

            if (error) throw error;

            uploads.push(path);
          }
        }
      }
    }
  }

  return uploads;
}