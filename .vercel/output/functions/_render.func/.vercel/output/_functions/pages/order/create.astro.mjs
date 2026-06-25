import { createClient } from '@crystallize/js-api-client';
export { renderers } from '../../renderers.mjs';

const apiClient = createClient({
  tenantIdentifier: "dounot",
  accessTokenId: undefined                                           ,
  accessTokenSecret: undefined                                               ,
  tenantId: undefined                                     
});

async function createOrder(orderInput) {
  return await apiClient.orderApi(
    `#graphql
      mutation($input: CreateOrderInput!) {
        orders {
          create(input: $input) {
            id
          }
        }
      }
    `,
    {
      input: orderInput
    }
  );
}

const POST = async ({ request }) => {
  let data = await request.json();
  let cart = data.basketModel.map(
    (item) => {
      return {
        sku: item.sku,
        quantity: item.quantity,
        name: item.name,
        imageUrl: item.image,
        price: {
          gross: item.price,
          net: item.price,
          currency: "USD",
          tax: {
            name: "No Tax",
            percent: 0
          }
        }
      };
    }
  );
  let body = {
    cart,
    customer: data.customer,
    total: data.total,
    payment: data.payment
  };
  const createCrystallizeOrder = await createOrder(body);
  return new Response(JSON.stringify(createCrystallizeOrder), {
    headers: {
      "content-type": "application/json;charset=UTF-8"
    }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
