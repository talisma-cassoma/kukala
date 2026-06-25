export { renderers } from '../../../renderers.mjs';

const GET = async ({ params }) => {
  const id = params.id;
  return new Response(
    JSON.stringify({
      id,
      orders: {
        get: {
          id,
          cart: [],
          total: { net: 0, gross: 0 }
        }
      }
    }),
    {
      status: 200,
      headers: {
        "content-type": "application/json"
      }
    }
  );
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
