import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import { i as renderComponent, m as maybeRenderHead, u as renderTemplate } from "./server_Rimude6d.mjs";
import { t as createComponent } from "./compiler_BMqcdPqr.mjs";
import { t as $$Layout } from "./Layout_DyREIpbh.mjs";
import { i as clearCart, n as cart } from "./cartStore_jGT4BXup.mjs";
import { useState } from "react";
import { useStore } from "@nanostores/react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region src/components/checkout.tsx
var CheckoutForm = () => {
	const [state, setState] = useState({
		firstName: "",
		lastName: "",
		email: "",
		street: "",
		city: "",
		postalCode: ""
	});
	const { items: cartItems, total } = useStore(cart);
	const { firstName, lastName, email, street, city, postalCode } = state;
	const checkoutModel = {
		basketModel: { items: cartItems },
		customer: {
			firstName,
			lastName,
			email,
			street,
			city,
			postalCode
		},
		total: {
			currency: "USD",
			gross: total,
			net: total,
			tax: {
				name: "No Ttax",
				percent: 0
			}
		}
	};
	const handleClick = async () => {
		const { customer, basketModel, total: orderTotal } = checkoutModel;
		try {
			const res = await fetch("/api/orders", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(checkoutModel)
			});
			if (!res.ok) throw new Error(`Failed to create order: ${res.status} ${res.statusText}`);
			const response = await res.json();
			if (response?.id) {
				clearCart();
				window.location.href = `/order/${response.id}`;
			}
		} catch (error) {
			console.error("Checkout error:", error);
		}
		const itemsSummary = basketModel.items.map((item) => `- ${item.name} (x${item.quantity})`).join("\n");
		const message = `New Order Details:\n\nCustomer: ${customer.firstName} ${customer.lastName} (${customer.email})\nAddress: ${customer.street}, ${customer.city}, ${customer.postalCode}\n\nItems:\n${itemsSummary}\n\nTotal: $${orderTotal.gross}`;
		const whatsappUrl = `https://wa.me/212613363308?text=${encodeURIComponent(message)}`;
		window.open(whatsappUrl, "_blank");
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "p-10 mx-auto bg-background1 w-lg mt-20",
		children: [/* @__PURE__ */ jsx("h1", {
			className: "text-text text-3xl font-bold mb-10 text-center",
			children: "Checkout"
		}), /* @__PURE__ */ jsxs("div", {
			className: "mx-auto",
			children: [/* @__PURE__ */ jsxs("form", {
				method: "post",
				className: "flex flex-wrap gap-5",
				children: [
					/* @__PURE__ */ jsx("input", {
						type: "text",
						name: "First Name",
						placeholder: "First name",
						className: "w-full p-3 border border-text",
						required: true,
						onChange: (e) => setState({
							...state,
							firstName: e.target.value
						})
					}),
					/* @__PURE__ */ jsx("input", {
						type: "text",
						name: "Last Name",
						required: true,
						placeholder: "Last name",
						className: "w-full  p-3 border border-text",
						onChange: (e) => setState({
							...state,
							lastName: e.target.value
						})
					}),
					/* @__PURE__ */ jsx("input", {
						type: "text",
						name: "Email",
						required: true,
						placeholder: "Email",
						className: "w-full  p-3 border border-text",
						onChange: (e) => setState({
							...state,
							email: e.target.value
						})
					}),
					/* @__PURE__ */ jsx("input", {
						type: "text",
						name: "Street",
						placeholder: "Street",
						className: "w-full  p-3 border border-text",
						onChange: (e) => setState({
							...state,
							street: e.target.value
						})
					}),
					/* @__PURE__ */ jsx("input", {
						type: "text",
						name: "City",
						placeholder: "City",
						className: "w-full  p-3 border border-text",
						onChange: (e) => setState({
							...state,
							city: e.target.value
						})
					}),
					/* @__PURE__ */ jsx("input", {
						type: "text",
						name: "Postal Code",
						placeholder: "Postal Code",
						className: "w-full p-3 border border-text",
						onChange: (e) => setState({
							...state,
							postalCode: e.target.value
						})
					})
				]
			}), /* @__PURE__ */ jsx("button", {
				className: "w-full bg-green text-black p-3 mt-10 rounded font-semibold text-center",
				onClick: handleClick,
				children: "Pay Now"
			})]
		})]
	});
};
//#endregion
//#region src/pages/checkout.astro
var checkout_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Checkout,
	file: () => $$file,
	url: () => $$url
});
var $$Checkout = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
		"title": "Checkout",
		"description": "Checkout using a dummy method."
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<div class="lg:container mx-auto w-full lg:px-0 px-4">${renderComponent($$result, "CheckoutForm", CheckoutForm, {
		"client:load": true,
		"client:component-hydration": "load",
		"client:component-path": "@/components/checkout",
		"client:component-export": "CheckoutForm"
	})}</div>` })}`;
}, "/Users/talisma/github-projects/kukala/src/pages/checkout.astro", void 0);
var $$file = "/Users/talisma/github-projects/kukala/src/pages/checkout.astro";
var $$url = "/checkout";
//#endregion
//#region \0virtual:astro:page:src/pages/checkout@_@astro
var page = () => checkout_exports;
//#endregion
export { page };
