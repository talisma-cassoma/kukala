import { b as createAstro, c as createComponent, f as addAttribute, a as renderTemplate, r as renderComponent, d as renderHead, g as renderSlot } from './astro/server_COnj2GrK.mjs';
import 'kleur/colors';
import 'clsx';
/* empty css                        */
import { jsxs, jsx } from 'react/jsx-runtime';

const $$Astro$1 = createAstro("https://dounut-astro.vercel.app");
const $$ViewTransitions = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$ViewTransitions;
  const { fallback = "animate" } = Astro2.props;
  return renderTemplate`<meta name="astro-view-transitions-enabled" content="true"><meta name="astro-view-transitions-fallback"${addAttribute(fallback, "content")}>`;
}, "/Users/talisma/github-projects/kukala/node_modules/.pnpm/astro@4.16.19_@types+node@26.0.0_rollup@4.61.1_typescript@6.0.3/node_modules/astro/components/ViewTransitions.astro", void 0);

const BasketButton = () => {
  const basket = typeof window !== "undefined" && localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart") || "{}") : [];
  return /* @__PURE__ */ jsxs("div", { className: "relative", children: [
    /* @__PURE__ */ jsxs(
      "svg",
      {
        width: "46",
        height: "41",
        viewBox: "0 0 46 41",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
        children: [
          /* @__PURE__ */ jsx(
            "path",
            {
              d: "M39.5255 7.38001H24.4309C23.8251 7.38001 23.2441 7.59599 22.8157 7.98044C22.3873 8.36489 22.1467 8.88631 22.1467 9.43C22.1467 9.9737 22.3873 10.4951 22.8157 10.8796C23.2441 11.264 23.8251 11.48 24.4309 11.48H39.5255C39.7149 11.4785 39.9025 11.5146 40.0746 11.5856C40.2468 11.6566 40.3994 11.7608 40.5216 11.8908C40.6438 12.0207 40.7325 12.1733 40.7814 12.3376C40.8303 12.5019 40.8383 12.6738 40.8047 12.8412L37.3417 27.7406C37.29 28.0092 37.1342 28.2528 36.9018 28.4284C36.6694 28.6039 36.3754 28.7001 36.0716 28.7H21.2695C20.9657 28.7001 20.6717 28.6039 20.4393 28.4284C20.2069 28.2528 20.0511 28.0092 19.9994 27.7406L14.9466 1.64001C14.8448 1.17693 14.5667 0.760047 14.1599 0.46083C13.7532 0.161613 13.2431 -0.00130406 12.7171 7.86192e-06H2.28254C1.93447 0.000245256 1.59105 0.0718674 1.27853 0.209404C0.96601 0.346941 0.692643 0.546755 0.479311 0.793586C0.265979 1.04042 0.118323 1.32774 0.0476204 1.6336C-0.0230824 1.93947 -0.0149621 2.25579 0.0713611 2.55841C0.210204 3.01137 0.514338 3.40944 0.935098 3.68893C1.35586 3.96842 1.86892 4.11316 2.39219 4.10001H10.8532L15.5314 28.4376C15.7668 29.6528 16.4703 30.7553 17.519 31.5526C18.5677 32.3498 19.8951 32.7913 21.2695 32.8H36.0716C37.4523 32.799 38.7884 32.361 39.8446 31.5631C40.9009 30.7651 41.6097 29.6584 41.8463 28.4376L45.3093 13.53C45.4529 12.7745 45.411 12 45.1866 11.2606C44.9621 10.5212 44.5604 9.83463 44.0096 9.24896C43.4588 8.66329 42.7722 8.19261 41.9977 7.86979C41.2231 7.54698 40.3794 7.37983 39.5255 7.38001V7.38001Z",
              fill: "#373567"
            }
          ),
          /* @__PURE__ */ jsx(
            "path",
            {
              d: "M33.2367 18.8599C33.8425 18.8599 34.4235 18.6439 34.8519 18.2595C35.2803 17.875 35.521 17.3536 35.521 16.8099C35.521 16.2662 35.2803 15.7448 34.8519 15.3603C34.4235 14.9759 33.8425 14.7599 33.2367 14.7599H25.927C25.3212 14.7599 24.7401 14.9759 24.3118 15.3603C23.8834 15.7448 23.6427 16.2662 23.6427 16.8099C23.6427 17.3536 23.8834 17.875 24.3118 18.2595C24.7401 18.6439 25.3212 18.8599 25.927 18.8599H33.2367Z",
              fill: "#373567"
            }
          ),
          /* @__PURE__ */ jsx(
            "path",
            {
              d: "M22.2723 41.0001C24.0385 41.0001 25.4703 39.7152 25.4703 38.1301C25.4703 36.5451 24.0385 35.2601 22.2723 35.2601C20.5061 35.2601 19.0743 36.5451 19.0743 38.1301C19.0743 39.7152 20.5061 41.0001 22.2723 41.0001Z",
              fill: "#373567"
            }
          ),
          /* @__PURE__ */ jsx(
            "path",
            {
              d: "M35.0643 41.0001C36.8305 41.0001 38.2623 39.7152 38.2623 38.1301C38.2623 36.5451 36.8305 35.2601 35.0643 35.2601C33.2981 35.2601 31.8663 36.5451 31.8663 38.1301C31.8663 39.7152 33.2981 41.0001 35.0643 41.0001Z",
              fill: "#373567"
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "w-5 h-5 absolute bg-text rounded-full text-primary text-center -right-2 -top-2 text-sm", children: basket.length })
  ] });
};

new Proxy({"src":"/_astro/astro-logo.D23cMVHt.svg","width":66,"height":53,"format":"svg"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/Users/talisma/github-projects/kukala/src/assets/astro-logo.svg";
							}
							
							return target[name];
						}
					});

const black_logo = new Proxy({"src":"/_astro/black_logo.1-unkKMi.png","width":364,"height":191,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/Users/talisma/github-projects/kukala/src/assets/black_logo.png";
							}
							
							return target[name];
						}
					});

const Header = () => {
  return /* @__PURE__ */ jsxs("header", { className: "container flex justify-between mx-auto py-10 w-full", children: [
    /* @__PURE__ */ jsx("a", { href: "/", title: "AstroJS", children: /* @__PURE__ */ jsx("img", { src: black_logo.src, alt: "Dount and Astro logo", className: "w-24" }) }),
    /* @__PURE__ */ jsx("a", { href: "/cart", title: "Your cart", children: /* @__PURE__ */ jsx(BasketButton, {}) })
  ] });
};

const Background = () => {
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      width: "100%",
      height: "100%",
      viewBox: "0 0 2035 3000",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      className: "w-full h-full",
      children: [
        /* @__PURE__ */ jsx("rect", { y: "1017", width: "2035", height: "100%", fill: "#FEE8F0" }),
        /* @__PURE__ */ jsx(
          "path",
          {
            d: "M2034.81 1017.41C2034.81 747.573 1927.62 488.792 1736.82 297.991C1546.02 107.191 1287.24 2.03718e-05 1017.41 0C747.573 -2.03718e-05 488.792 107.191 297.991 297.991C107.191 488.792 4.07436e-05 747.573 0 1017.41L1017.41 1017.41H2034.81Z",
            fill: "#FEE8F0"
          }
        )
      ]
    }
  );
};

const CrystallizeLogo = "data:image/svg+xml,%3csvg%20width='15'%20height='23'%20viewBox='0%200%2015%2023'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20clip-path='url(%23clip0_1613_149)'%3e%3cpath%20d='M11.9496%209.78688L8.70777%2022.3362L4.52246%2019.6662L7.76465%200L12.4946%207.68281L11.9496%209.78688Z'%20fill='%23BFF6F8'/%3e%3cpath%20d='M2.98219%2010.1663L1.86531%2017.9688L1.23656%2017.5685L0%208.49414L2.98219%2010.1663Z'%20fill='%23DFFAFB'/%3e%3cpath%20d='M6.52409%204.97727L4.14315%2019.4232L2.24878%2018.2141L4.57284%201.97852L6.52409%204.97727Z'%20fill='%23CFF8FA'/%3e%3cpath%20d='M15.0535%209.22314L12.371%2019.5616L10.5938%2021.0328L9.17725%2022.1769L12.2057%2010.4535L15.0535%209.22314Z'%20fill='%23ACF3F6'/%3e%3c/g%3e%3cdefs%3e%3cclipPath%20id='clip0_1613_149'%3e%3crect%20width='15'%20height='22.1875'%20fill='white'/%3e%3c/clipPath%3e%3c/defs%3e%3c/svg%3e";

const $$Astro = createAstro("https://dounut-astro.vercel.app");
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Layout;
  const { title, description } = Astro2.props;
  const { pathname } = Astro2.url;
  return renderTemplate`<html lang="en"> <head><meta charset="UTF-8"><meta name="description"${addAttribute(description, "content")}><meta name="viewport" content="width=device-width"><link rel="icon" type="image/png" href="/favicon.png"><meta name="generator"${addAttribute(Astro2.generator, "content")}><title>${title}</title>${renderComponent($$result, "ViewTransitions", $$ViewTransitions, {})}${renderHead()}</head> <body class="relative text-text bg-primary"> ${renderComponent($$result, "Header", Header, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/talisma/github-projects/kukala/src/components/header", "client:component-export": "Header" })} ${renderSlot($$result, $$slots["default"])} ${pathname === "/cart" || pathname === "/checkout" || pathname.startsWith("/order") ? null : renderTemplate`<div class="absolute inset-0 bg-fixed -z-10"> ${renderComponent($$result, "Background", Background, {})} </div>`} <footer class="container mt-40 mx-auto pb-10"> <div class="flex mt-10  w-full text-center justify-end"> <div class="flex items-center gap-1 mt-10"> <img${addAttribute(CrystallizeLogo, "src")} alt="Crystallize" class="w-5">
Powered by <a href="https://crystallize.com" class="underline">
Crystallize</a> + <a href="https://astro.build" class="underline">Astro</a> </div> </div> </footer>  </body> </html>`;
}, "/Users/talisma/github-projects/kukala/src/layouts/Layout.astro", void 0);

export { $$Layout as $ };
