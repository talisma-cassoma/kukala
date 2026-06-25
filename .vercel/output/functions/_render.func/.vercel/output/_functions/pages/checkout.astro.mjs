/* empty css                                        */
import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_COnj2GrK.mjs';
import 'kleur/colors';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState } from 'react';
import { $ as $$Layout } from '../chunks/Layout_5G4BMRzr.mjs';
export { renderers } from '../renderers.mjs';

const CheckoutForm = () => {
  const [state, setState] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    postalCode: ""
  });
  const { firstName, lastName, email, street, city, postalCode } = state;
  const cart = typeof window !== "undefined" && localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart") || "{}") : [];
  const total = cart?.reduce(
    (amount, item) => item.price + amount,
    0
  );
  const checkoutModel = {
    basketModel: cart,
    customer: {
      firstName,
      lastName,
      identifier: email,
      addresses: [
        { type: "billing", email },
        {
          type: "delivery",
          street,
          city,
          postalCode
        }
      ]
    },
    total: {
      currency: "USD",
      gross: total,
      net: total,
      tax: {
        name: "No Ttax",
        percent: 0
      }
    },
    payment: {
      provider: "custom",
      custom: {
        properties: {
          property: "payment_method",
          value: "Crystal Coin"
        }
      }
    }
  };
  const handleClick = async () => {
    let response = await fetch("/order/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(checkoutModel)
    }).then((res) => res.json());
    if (response?.orders?.create?.id) {
      localStorage.removeItem("cart");
      window.location.href = `/order/${response.orders.create.id}`;
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "p-10 mx-auto bg-background1 w-128 mt-20", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-text text-3xl font-bold mb-10 text-center", children: "Checkout" }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto", children: [
      /* @__PURE__ */ jsxs("form", { method: "post", className: "flex flex-wrap gap-5", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            name: "First Name",
            placeholder: "First name",
            className: "w-full p-3 border border-text",
            required: true,
            onChange: (e) => setState({ ...state, firstName: e.target.value })
          }
        ),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            name: "Last Name",
            required: true,
            placeholder: "Last name",
            className: "w-full  p-3 border border-text",
            onChange: (e) => setState({ ...state, lastName: e.target.value })
          }
        ),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            name: "Email",
            required: true,
            placeholder: "Email",
            className: "w-full  p-3 border border-text",
            onChange: (e) => setState({ ...state, email: e.target.value })
          }
        ),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            name: "Street",
            placeholder: "Street",
            className: "w-full  p-3 border border-text",
            onChange: (e) => setState({ ...state, street: e.target.value })
          }
        ),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            name: "City",
            placeholder: "City",
            className: "w-full  p-3 border border-text",
            onChange: (e) => setState({ ...state, city: e.target.value })
          }
        ),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            name: "Postal Code",
            placeholder: "Postal Code",
            className: "w-full p-3 border border-text",
            onChange: (e) => setState({ ...state, postalCode: e.target.value })
          }
        )
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          className: "w-full bg-text text-primary p-3 mt-10 rounded font-semibold text-center",
          onClick: handleClick,
          children: "Pay Now"
        }
      )
    ] })
  ] });
};

const $$Checkout = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Checkout", "description": "Checkout using a dummy method." }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="lg:container mx-auto w-full lg:px-0 px-4"> ${renderComponent($$result2, "CheckoutForm", CheckoutForm, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/talisma/github-projects/kukala/src/components/checkout", "client:component-export": "CheckoutForm" })} </div> ` })}`;
}, "/Users/talisma/github-projects/kukala/src/pages/checkout.astro", void 0);

const $$file = "/Users/talisma/github-projects/kukala/src/pages/checkout.astro";
const $$url = "/checkout";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Checkout,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
