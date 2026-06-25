import { a as loadMockProduct } from '../../../chunks/mock-data_CWkcQsZE.mjs';
export { renderers } from '../../../renderers.mjs';

const GET = async ({ params }) => {
  const slug = params.slug;
  const pathName = slug ? `/shop/${slug}` : "";
  const data = await loadMockProduct(pathName);
  if (!data) {
    return new Response(JSON.stringify({ error: "Product not found" }), {
      status: 404,
      headers: { "content-type": "application/json" }
    });
  }
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      "content-type": "application/json"
    }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
