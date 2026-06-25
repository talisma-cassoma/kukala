import { createClient } from '@supabase/supabase-js';
export { renderers } from '../../renderers.mjs';

const supabaseAdmin = createClient(
  "",
  ""
);
const POST = async ({ request }) => {
  try {
    const formData = await request.formData();
    const product = JSON.parse(formData.get("product") || "{}");
    const files = formData.getAll("images");
    if (!files.length) {
      return new Response(JSON.stringify({ error: "No images supplied" }), { status: 400 });
    }
    const uploadResults = await Promise.all(
      files.map(async (file, index) => {
        const safeName = `${product.slug || "product"}-${Date.now()}-${index}-${file.name.replace(/\s+/g, "-")}`;
        const { error } = await supabaseAdmin.storage.from("products").upload(safeName, file, { upsert: true, contentType: file.type });
        if (error) {
          throw error;
        }
        const { data } = supabaseAdmin.storage.from("products").getPublicUrl(safeName);
        return data.publicUrl;
      })
    );
    return new Response(JSON.stringify({ ok: true, urls: uploadResults, product }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
