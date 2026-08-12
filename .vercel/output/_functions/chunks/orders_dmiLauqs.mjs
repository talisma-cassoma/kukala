import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import { PrismaClient } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
//#region src/pages/api/orders.ts
var orders_exports = /* @__PURE__ */ __exportAll({ POST: () => POST });
var prisma = new PrismaClient();
var POST = async ({ request }) => {
	try {
		const body = await request.json();
		if (!body.customer || !body.basketModel || !body.total) return new Response(JSON.stringify({ message: "Missing required order data." }), {
			status: 400,
			headers: { "Content-Type": "application/json" }
		});
		const { customer, basketModel, total } = body;
		for (const field of [
			"firstName",
			"lastName",
			"email",
			"street",
			"city",
			"postalCode"
		]) if (!customer[field]) return new Response(JSON.stringify({ message: `Missing customer field: ${field}` }), {
			status: 400,
			headers: { "Content-Type": "application/json" }
		});
		if (!Array.isArray(basketModel.items) || basketModel.items.length === 0) return new Response(JSON.stringify({ message: "The basket is empty." }), {
			status: 400,
			headers: { "Content-Type": "application/json" }
		});
		const newOrder = await prisma.$transaction(async (tx) => {
			const order = await tx.order.create({ data: {
				firstName: customer.firstName,
				lastName: customer.lastName,
				email: customer.email,
				street: customer.street,
				city: customer.city,
				postalCode: customer.postalCode,
				totalGross: new Decimal(total.gross),
				totalNet: new Decimal(total.net)
			} });
			for (const item of basketModel.items) {
				if (!item.productId) throw new Error(`Missing productId for basket item: ${item.name}`);
				const quantity = Number(item.quantity);
				const unitPrice = new Decimal(item.price);
				const totalPrice = unitPrice.mul(quantity);
				const orderItem = await tx.orderItem.create({ data: {
					orderId: order.id,
					productId: item.productId,
					name: item.name,
					quantity,
					unitPrice,
					totalPrice
				} });
				if (Array.isArray(item.selectedOptions) && item.selectedOptions.length > 0) await tx.orderItemOption.createMany({ data: item.selectedOptions.map((option) => ({
					orderItemId: orderItem.id,
					productOptionId: option.productOptionId,
					groupName: option.groupName,
					optionLabel: option.optionLabel,
					priceAtPurchase: new Decimal(option.price)
				})) });
			}
			return order;
		});
		return new Response(JSON.stringify({ id: newOrder.id }), {
			status: 201,
			headers: { "Content-Type": "application/json" }
		});
	} catch (error) {
		console.error("Order creation error:", error);
		if (error?.code === "P2002") return new Response(JSON.stringify({
			message: "A database conflict occurred.",
			target: error.meta?.target
		}), {
			status: 409,
			headers: { "Content-Type": "application/json" }
		});
		return new Response(JSON.stringify({
			message: "An error occurred while creating the order.",
			error: process.env.NODE_ENV === "development" ? error?.message : void 0
		}), {
			status: 500,
			headers: { "Content-Type": "application/json" }
		});
	}
};
//#endregion
//#region \0virtual:astro:page:src/pages/api/orders@_@ts
var page = () => orders_exports;
//#endregion
export { page };
