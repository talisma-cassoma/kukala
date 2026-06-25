import { l as loadMockFrontPage } from '../../chunks/mock-data_CWkcQsZE.mjs';
export { renderers } from '../../renderers.mjs';

const GET = async () => {
  const data = await loadMockFrontPage();
  const products = data?.donuts?.children ?? [];
  return new Response(JSON.stringify(products), {
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
