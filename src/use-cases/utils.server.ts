import fs from 'fs/promises';

//importar dados do JSON
export async function importJSON(path: string) {
  try {
    const data = await fs.readFile(path, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Erro ao importar JSON:", err);
    return null;
  }
}