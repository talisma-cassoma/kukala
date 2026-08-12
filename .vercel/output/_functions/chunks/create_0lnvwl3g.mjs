import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import { createClient } from "@crystallize/js-api-client";
//#region src/use-cases/shared.ts
var apiClient = createClient({
	tenantIdentifier: "dounot",
	accessTokenId: void 0,
	accessTokenSecret: void 0,
	tenantId: void 0
});
//#endregion
//#region src/use-cases/mutations/create-order.ts
async function createOrder(orderInput) {
	return await apiClient.orderApi(`#graphql
      mutation($input: CreateOrderInput!) {
        orders {
          create(input: $input) {
            id
          }
        }
      }
    `, { input: orderInput });
}
//#endregion
//#region src/pages/order/create.ts
var create_exports = /* @__PURE__ */ __exportAll({ POST: () => POST });
var POST = async ({ request }) => {
	let data = await request.json();
	const createNewOrder = await createOrder({
		cart: data.basketModel.map((item) => {
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
		}),
		customer: data.customer,
		total: data.total,
		payment: data.payment
	});
	return new Response(JSON.stringify(createNewOrder), { headers: { "content-type": "application/json;charset=UTF-8" } });
};
//#endregion
//#region \0virtual:astro:page:src/pages/order/create@_@ts
var page = () => create_exports;
//#endregion
export { page };
