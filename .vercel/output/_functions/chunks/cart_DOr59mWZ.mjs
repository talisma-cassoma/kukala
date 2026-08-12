import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import { i as renderComponent, m as maybeRenderHead, u as renderTemplate } from "./server_Rimude6d.mjs";
import { t as createComponent } from "./compiler_BMqcdPqr.mjs";
import { t as $$Layout } from "./Layout_lmUAwAOc.mjs";
import { a as deleteItemOnCart, n as cart } from "./cartStore_jGT4BXup.mjs";
import { useStore } from "@nanostores/react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region src/components/local-cart.tsx
var LocalCart = () => {
	const { items, total, itemCount } = useStore(cart);
	return /* @__PURE__ */ jsxs("div", {
		className: "py-20 text-text lg:w-auth mx-auto w-full",
		children: [/* @__PURE__ */ jsxs("h1", {
			className: "text-4xl font-bold  mb-10",
			children: [
				"Your shopping cart (",
				itemCount,
				")"
			]
		}), /* @__PURE__ */ jsxs("div", {
			className: "flex flex-col gap-5 bg-background1 p-20",
			children: [
				items.map((item, index) => /* @__PURE__ */ jsxs("div", {
					className: "flex justify-between items-center",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex flex-col",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex gap-2 items-center",
							children: [/* @__PURE__ */ jsx("img", {
								src: item.imageUrl || "",
								alt: item.name,
								className: "size-12 rounded-xl object-contain bg-gray-200"
							}), /* @__PURE__ */ jsxs("p", {
								className: "font-semibold text-xl",
								children: [
									item.name,
									" × ",
									item.quantity
								]
							})]
						}), /* @__PURE__ */ jsx("div", {
							className: "flex gap-3",
							children: item.attributes?.map((attr, index) => /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("p", { children: attr.value }) }, index))
						})]
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex gap-20",
						children: [/* @__PURE__ */ jsxs("p", { children: ["$", item.price * item.quantity] }), /* @__PURE__ */ jsx("button", {
							className: "bg-background2 px-4 rounded-xl",
							onClick: () => deleteItemOnCart(item),
							children: "x"
						})]
					})]
				}, index)),
				/* @__PURE__ */ jsxs("div", {
					className: "flex justify-between items-center border-t-2 border-text pt-4",
					children: [/* @__PURE__ */ jsx("p", {
						className: "font-semibold text-xl",
						children: "Total"
					}), /* @__PURE__ */ jsxs("p", { children: ["$", total] })]
				}),
				/* @__PURE__ */ jsx("a", {
					href: "/checkout",
					className: "bg-red text-black p-3 mt-10 rounded font-semibold text-center",
					children: "Checkout"
				})
			]
		})]
	});
};
//#endregion
//#region src/pages/cart.astro
var cart_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Cart,
	file: () => $$file,
	url: () => $$url
});
var $$Cart = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
		"title": "Cart",
		"description": "Dounut | Cart"
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<div class="lg:container mx-auto w-full lg:px-0 px-5">${renderComponent($$result, "LocalCart", LocalCart, {
		"client:visible": true,
		"client:component-hydration": "visible",
		"client:component-path": "@/components/local-cart.tsx",
		"client:component-export": "LocalCart"
	})}</div>` })}`;
}, "/Users/talisma/github-projects/kukala/src/pages/cart.astro", void 0);
var $$file = "/Users/talisma/github-projects/kukala/src/pages/cart.astro";
var $$url = "/cart";
//#endregion
//#region \0virtual:astro:page:src/pages/cart@_@astro
var page = () => cart_exports;
//#endregion
export { page };
