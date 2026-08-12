import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import { i as renderComponent, m as maybeRenderHead, u as renderTemplate, w as createAstro } from "./server_Rimude6d.mjs";
import { t as createComponent } from "./compiler_BMqcdPqr.mjs";
import { t as $$Layout } from "./Layout_DyREIpbh.mjs";
import { t as fetchFrontPage } from "./frontpage_VQDErFNl.mjs";
import { Image } from "@crystallize/reactjs-components";
import { jsx, jsxs } from "react/jsx-runtime";
//#region src/components/kits/comboBoxes.tsx
function ComboBoxes({ cell }) {
	const product = cell;
	const image = product.image;
	const price = product.price;
	return /* @__PURE__ */ jsx("a", {
		href: product.path,
		className: "block w-full min-w-200 py-6 lg:py-10 relative",
		children: /* @__PURE__ */ jsxs("div", {
			className: "flex flex-row items-center lg:items-stretch w-full",
			children: [/* @__PURE__ */ jsx("div", {
				className: "w-full lg:w-full flex flex-col justify-center rounded-xl bg-[#f0efeb] p-6 lg:pr-10 box-border mt-0 lg:mt-24 border border-gray-200 z-0",
				children: /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
					className: "text-xl sm:text-2xl font-bold text-gray-900 wrap-normalbreak-words max-w-full lg:max-w-[80%]",
					children: product.name
				}), /* @__PURE__ */ jsxs("p", {
					className: "text-base sm:text-lg font-semibold mt-2",
					children: ["$", price]
				})] })
			}), /* @__PURE__ */ jsx("div", {
				className: "w-full lg:w-3/4 z-10 -mt-12 lg:mt-0 lg:-ml-60 rounded-xl overflow-hidden flex justify-center pl-0 lg:pl-10",
				children: /* @__PURE__ */ jsx("img", {
					src: image.url,
					alt: image.altText,
					className: "w-full h-auto object-contain aspect-1366/745"
				})
			})]
		})
	});
}
//#endregion
//#region src/components/topics-displayer.tsx
var TopicsDisplayer = ({ topics }) => {
	return /* @__PURE__ */ jsx("div", {
		className: "flex gap-1",
		children: topics?.map((topic) => /* @__PURE__ */ jsx("div", {
			className: "text-sm bg-grey px-3 py-1 rounded-xl",
			children: topic.name
		}, topic.name))
	});
};
//#endregion
//#region src/components/kits/discountedBundles.tsx
function DiscountedBundles({ cell }) {
	const product = cell;
	const image = product.image;
	const price = product.price;
	return /* @__PURE__ */ jsx("a", {
		href: product.path,
		className: "flex flex-col p-8 bg-[#d6e2e9] rounded-xl lg:h-96 lg:w-[300px w-full box-border",
		children: /* @__PURE__ */ jsxs("div", {
			className: "grid grid-rows-[auto_1fr_auto] h-full gap-4",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "flex justify-between items-start",
					children: [/* @__PURE__ */ jsx(TopicsDisplayer, { topics: product?.topics }), /* @__PURE__ */ jsxs("p", {
						className: "font-bold",
						children: ["$", price]
					})]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "flex items-center justify-center min-h-0 w-full",
					children: /* @__PURE__ */ jsx("img", {
						src: image.url,
						alt: image.altText,
						loading: "lazy",
						className: "w-full h-full aspect-448/404 object-contain"
					})
				}),
				/* @__PURE__ */ jsx("h2", {
					className: "text-xl font-bold text-center mx-auto max-w-54 truncate",
					children: product?.name
				})
			]
		})
	});
}
//#endregion
//#region src/components/kits/index.tsx
var Kits = ({ products }) => {
	const { comboboxes, discountedBundles } = products;
	return /* @__PURE__ */ jsxs("div", {
		style: {
			display: "grid",
			gridTemplateColumns: "repeat(2, 1, 1fr)",
			gap: "1rem",
			justifyContent: "center"
		},
		children: [/* @__PURE__ */ jsx("div", {
			className: "flex flex-col w-full gap-12 justify-between",
			children: /* @__PURE__ */ jsx("div", {
				className: "flex flex-col gap-8 w-full items-stretch",
				children: [comboboxes[0]].map((comboboxes, index) => {
					return /* @__PURE__ */ jsx("div", {
						className: "flex-1 flex flex-col min-w-0 justify-center",
						children: /* @__PURE__ */ jsx(ComboBoxes, { cell: comboboxes })
					}, index);
				})
			})
		}), /* @__PURE__ */ jsxs("div", {
			className: "flex flex-col w-full gap-12 justify-between",
			children: [/* @__PURE__ */ jsx("p", { children: "Page menos e leve mais" }), /* @__PURE__ */ jsx("div", {
				className: "flex lg:flex-row gap-12 md:flex-wrap w-full items-stretch",
				children: discountedBundles.map((discountedBundle, index) => {
					return /* @__PURE__ */ jsx("div", {
						className: "flex-col",
						children: /* @__PURE__ */ jsx(DiscountedBundles, { cell: discountedBundle })
					}, index);
				})
			})]
		})]
	});
};
//#endregion
//#region src/components/product-card.tsx
var ProductCard = ({ product }) => {
	const priceVariant = {
		price: product?.price,
		currency: "USD"
	};
	const image = product?.image;
	return /* @__PURE__ */ jsx("a", {
		href: product?.path,
		className: "flex overflow-hidden lg:bg-[#d6e2e9] rounded-xl lg:h-96 p-5 lg:w-75 bg-background2 w-full",
		children: /* @__PURE__ */ jsxs("div", {
			className: "flex flex-col gap-4",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "flex justify-between items-start",
					children: [/* @__PURE__ */ jsx(TopicsDisplayer, { topics: product?.topics }), /* @__PURE__ */ jsxs("p", {
						className: "self-end",
						children: [priceVariant?.currency === "USD" ? "$" : priceVariant?.currency, priceVariant?.price]
					})]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "flex justify-center box-border overflow-hidden w-full h-56 rounded-xl",
					children: /* @__PURE__ */ jsx(Image, {
						...image,
						sizes: "(max-width: 700px) 200px, 300px",
						loading: "lazy",
						className: "mx-auto"
					})
				}),
				/* @__PURE__ */ jsx("h2", {
					className: "text-xl font-bold text-center mx-auto max-w-54 truncate",
					children: product?.name
				})
			]
		})
	});
};
//#endregion
//#region src/components/products.tsx
var Products = ({ elements }) => {
	return /* @__PURE__ */ jsxs("div", {
		style: {
			display: "grid",
			gridTemplateColumns: "repeat(2, 1, 1fr)",
			gap: "1rem",
			justifyContent: "center"
		},
		children: [/* @__PURE__ */ jsx("p", {
			className: "text-lg font-semibold my-10",
			children: "outras ofertas"
		}), /* @__PURE__ */ jsx("div", {
			className: "flex flex-wrap justify-between self-center gap-8 w-full",
			children: elements?.children?.map((element, index) => /* @__PURE__ */ jsx(ProductCard, { product: element }, index))
		})]
	});
};
//#endregion
//#region src/pages/index.astro
var pages_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Index,
	file: () => $$file,
	url: () => ""
});
createAstro("https://astro.build");
var $$Index = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Index;
	const catalog = await fetchFrontPage(Astro.url.origin);
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
		"title": "Kulala shop",
		"description": "One stop shop for buying cosmetxic & personal care online."
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<div class="py-10 lg:container mx-auto w-full md:px-0 px-3">${renderComponent($$result, "Kits", Kits, { "products": catalog })}${renderComponent($$result, "Products", Products, { "elements": { children: catalog.retailProducts } })}</div>` })}`;
}, "/Users/talisma/github-projects/kukala/src/pages/index.astro", void 0);
var $$file = "/Users/talisma/github-projects/kukala/src/pages/index.astro";
//#endregion
//#region \0virtual:astro:page:src/pages/index@_@astro
var page = () => pages_exports;
//#endregion
export { page };
