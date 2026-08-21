import { getSupabaseClient } from "@/lib/supabase";

const BUCKET = "kukala";

async function uploadSingleImage(
  file: File,
  productSlug: string,
  directory = "",
  fileName = file.name,
): Promise<string> {
  const supabase = getSupabaseClient();
  
  // 1. Limpa barras e espaços das partes da rota
  const cleanSlug = productSlug.trim().replace(/^\/+|\/+$/g, "");
  const cleanDirectory = directory.trim().replace(/^\/+|\/+$/g, "");
  
  // 2. Remove acentos, espaços e caracteres especiais do nome do arquivo
  const safeFileName = fileName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove acentos
    .replace(/[^a-zA-Z0-9._-]/g, "-") // Substitui espaços e especiais por hífens
    .replace(/-+/g, "-"); // Evita hífens duplicados

  // 3. Monta o caminho final limpo (ex: "hydratation-profonde/body/0.webp")
  const path = [cleanSlug, cleanDirectory, safeFileName]
    .filter(Boolean)
    .join("/");

  const mimeType = file.type || getFallbackMimeType(safeFileName);

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, {
      cacheControl: "3600",
      upsert: true,
      contentType: mimeType,
    });

  if (error) {
    console.error("Erro detalhado no upload para a rota:", path, error);
    throw error;
  }

  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}
// Auxiliar para inferir o MIME type pela extensão do arquivo
function getFallbackMimeType(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "webp": return "image/webp";
    case "png": return "image/png";
    case "jpg":
    case "jpeg": return "image/jpeg";
    case "svg": return "image/svg+xml";
    default: return "application/octet-stream";
  }
}

export async function uploadImage(
  file: File,
  productSlug: string,
  directory?: string,
  fileName?: string,
): Promise<string>;
export async function uploadImage(
  dir: FileSystemDirectoryHandle,
): Promise<string[]>;
export async function uploadImage(
  source: File | FileSystemDirectoryHandle,
  productSlug?: string,
  directory = "",
  fileName?: string,
): Promise<string | string[]> {
  if (source instanceof File) {
    if (!productSlug) throw new Error("productSlug é obrigatório para upload de arquivo único.");
    return uploadSingleImage(source, productSlug, directory, fileName);
  }

  const dir = source;
  const directoryProductSlug = dir.name;
  const uploads: string[] = [];

  const entries: [string, FileSystemHandle][] = [];
  for await (const entry of dir.entries()) {
    entries.push(entry);
  }

  // 1. Upload do thumbnail na raiz (ex: thumbnail.webp)
  for (const [name, handle] of entries) {
    if (handle.kind === "file" && name.startsWith("thumbnail.")) {
      const fileHandle = handle as FileSystemFileHandle;
      const file = await fileHandle.getFile();
      const url = await uploadSingleImage(file, directoryProductSlug, "", name);
      uploads.push(url);
    }
  }

  // 2. Upload da pasta body (renomeando para 0, 1, 2...)
  const bodyHandleEntry = entries.find(
    ([name, handle]) => handle.kind === "directory" && name === "body"
  );

  if (bodyHandleEntry) {
    const bodyDir = bodyHandleEntry[1] as FileSystemDirectoryHandle;
    let index = 0;

    for await (const [originalFileName, fileHandle] of bodyDir.entries()) {
      // Ignora subpastas ou arquivos ocultos do sistema (como .DS_Store)
      if (fileHandle.kind !== "file" || originalFileName.startsWith(".")) continue;

      try {
        const file = await (fileHandle as FileSystemFileHandle).getFile();

        // Extrai a extensão original do arquivo (ex: "webp", "png", "jpg")
        const ext = originalFileName.split(".").pop()?.toLowerCase() || "webp";

        // Cria o novo nome formatado numericamente (ex: "0.webp", "1.webp")
        const newFileName = `${index}.${ext}`;

        const url = await uploadSingleImage(
          file,
          directoryProductSlug,
          "body",
          newFileName
        );

        uploads.push(url);
        index++; // Incrementa para a próxima imagem do body
      } catch (err) {
        console.error(`Erro ao subir imagem do body index ${index}:`, err);
      }
    }
  }

  return uploads;
}