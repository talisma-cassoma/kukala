import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import { PrismaClient } from "@prisma/client";
import "@prisma/client/runtime/library";
//#region src/pages/api/orders/[id].ts
var _id__exports = /* @__PURE__ */ __exportAll({ GET: () => GET });
var prisma = new PrismaClient();
var GET = async ({ params }) => {
	const { id } = params;
	if (!id) return new Response(JSON.stringify({ message: "Order ID is required" }), {
		status: 400,
		headers: { "content-type": "application/json" }
	});
	try {
		const order = await prisma.order.findUnique({
			where: { id },
			include: { items: { include: { product: { include: { images: { take: 1 } } } } } }
		});
		if (!order) return new Response(JSON.stringify({ message: "Order not found" }), {
			status: 404,
			headers: { "content-type": "application/json" }
		});
		const response = {
			id: order?.id,
			status: order?.status,
			email: order?.email,
			total: {
				net: order?.totalNet,
				gross: order?.totalGross,
				currency: "USD"
			},
			createdAt: order?.createdAt,
			cart: order?.items.map((item) => ({
				quantity: item.quantity,
				price: {
					net: item.unitPrice,
					gross: item.unitPrice
				},
				product: {
					id: item.productId,
					name: item.name,
					path: item.product?.path,
					image: item.product?.images?.[0] ?? null
				}
			}))
		};
		return new Response(JSON.stringify(response), {
			status: 200,
			headers: { "content-type": "application/json" }
		});
	} catch (error) {
		console.error(error);
		return new Response(JSON.stringify({
			message: "An error occurred.",
			error: error.message
		}), {
			status: 500,
			headers: { "content-type": "application/json" }
		});
	}
};
//#endregion
//#region \0virtual:astro:page:src/pages/api/orders/[id]@_@ts
var page = () => _id__exports;
//#endregion
export { page };
