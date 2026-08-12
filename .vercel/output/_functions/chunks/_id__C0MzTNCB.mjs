import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import { i as renderComponent, m as maybeRenderHead, u as renderTemplate, w as createAstro } from "./server_Rimude6d.mjs";
import { t as createComponent } from "./compiler_BMqcdPqr.mjs";
import { t as $$Layout } from "./Layout_DyREIpbh.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
//#region src/components/order.tsx
var Order = ({ order }) => {
	const { total, cart } = order;
	return /* @__PURE__ */ jsx("div", {
		className: "lg:w-auth lg:p-20 bg-background3 mx-auto mt-20 text-text w-full p-10",
		children: /* @__PURE__ */ jsxs("div", { children: [
			/* @__PURE__ */ jsx("h1", {
				className: "font-bold text-3xl mb-6",
				children: "Order Confirmation"
			}),
			/* @__PURE__ */ jsxs("p", {
				className: "mb-5",
				children: [
					"We have received your order #",
					order.id,
					"."
				]
			}),
			/* @__PURE__ */ jsxs("div", { children: [cart?.map((item, index) => {
				return /* @__PURE__ */ jsxs("div", {
					className: "flex justify-between mb-4",
					children: [/* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("p", { children: [
						item.name,
						" x ",
						item.quantity
					] }) }), /* @__PURE__ */ jsxs("p", { children: ["$", item.price.gross * item.quantity] })]
				}, index);
			}), /* @__PURE__ */ jsxs("div", {
				className: "flex flex-col gap-3 border-t-2 pt-5",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex justify-between",
						children: [/* @__PURE__ */ jsx("p", { children: "Subtotal" }), /* @__PURE__ */ jsxs("p", { children: ["$", total.gross] })]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex justify-between",
						children: [/* @__PURE__ */ jsx("p", { children: "Tax" }), /* @__PURE__ */ jsxs("p", { children: ["$", (total.net - total.gross).toFixed(2)] })]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex justify-between",
						children: [/* @__PURE__ */ jsx("p", {
							className: "font-bold",
							children: "Total"
						}), /* @__PURE__ */ jsxs("p", { children: ["$", total.net] })]
					})
				]
			})] }),
			/* @__PURE__ */ jsx("a", {
				href: "/",
				title: "AstroJS",
				className: "flex w-full my-10 justify-center",
				children: /* @__PURE__ */ jsx("button", {
					className: "bg-[#f0efeb] py-2 px-4 rounded hover:bg-primary-dark",
					children: "retourner a la page d'accueil"
				})
			})
		] })
	});
};
//#endregion
//#region src/pages/order/[id].astro
var _id__exports = /* @__PURE__ */ __exportAll({
	default: () => $$Id,
	file: () => $$file,
	url: () => $$url
});
createAstro("https://astro.build");
var $$Id = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Id;
	const { id } = Astro.params;
	async function getOrderById(orderId, baseUrl) {
		const url = new URL(`/api/orders/${orderId}`, baseUrl);
		const res = await fetch(url.toString());
		if (!res.ok) {
			console.error(`Failed to fetch order: ${res.status} ${res.statusText}`);
			return null;
		}
		return res.json();
	}
	const order = await getOrderById(id, Astro.url.origin);
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
		"title": "Order Confirmation",
		"description": "Order confirmation page"
	}, { "default": ($$result) => renderTemplate`${order ? renderTemplate`${renderComponent($$result, "Order", Order, { "order": order })}` : renderTemplate`${maybeRenderHead($$result)}<p>Order not found.</p>`}` })}`;
}, "/Users/talisma/github-projects/kukala/src/pages/order/[id].astro", void 0);
var $$file = "/Users/talisma/github-projects/kukala/src/pages/order/[id].astro";
var $$url = "/order/[id]";
//#endregion
//#region \0virtual:astro:page:src/pages/order/[id]@_@astro
var page = () => _id__exports;
//#endregion
export { page };
