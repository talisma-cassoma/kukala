import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import { i as renderComponent, m as maybeRenderHead, u as renderTemplate, w as createAstro } from "./server_Rimude6d.mjs";
import { t as createComponent } from "./compiler_BMqcdPqr.mjs";
import { t as $$Layout } from "./Layout_DyREIpbh.mjs";
import { t as ProductView } from "./product_BwzCcv1E.mjs";
//#region src/use-cases/queries/product.ts
async function fetchProduct(path, origin) {
	try {
		const slug = path.replace("/shop/", "");
		const response = await fetch(`${origin}/api/products/${slug}`);
		if (!response.ok) return null;
		return await response.json();
	} catch (error) {
		throw error;
	}
}
//#endregion
//#region src/pages/shop/[product].astro
var _product__exports = /* @__PURE__ */ __exportAll({
	default: () => $$Product,
	file: () => $$file,
	prerender: () => false,
	url: () => $$url
});
createAstro("https://astro.build");
var $$Product = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Product;
	const { product } = Astro.params;
	const previewMode = Astro.url.searchParams.get("preview") === "1";
	const previewData = Astro.url.searchParams.get("previewData");
	let productData;
	if (previewMode && previewData) try {
		productData = { product: JSON.parse(decodeURIComponent(previewData)) };
	} catch {
		productData = null;
	}
	else productData = await fetchProduct(`/shop/${product}`, Astro.url.origin);
	const pageTitle = productData?.product?.name ?? "Product";
	const pageDescription = productData?.product?.description ?? "Product";
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
		"title": pageTitle,
		"description": pageDescription
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<div class="lg:container mx-auto w-screenWidth lg:px-0 px-5">${productData ? renderTemplate`${renderComponent($$result, "ProductView", ProductView, {
		"product": productData.product,
		"client:load": true,
		"client:component-hydration": "load",
		"client:component-path": "@/components/product",
		"client:component-export": "ProductView"
	})}` : renderTemplate`<p>Product not found</p>`}</div>` })}`;
}, "/Users/talisma/github-projects/kukala/src/pages/shop/[product].astro", void 0);
var $$file = "/Users/talisma/github-projects/kukala/src/pages/shop/[product].astro";
var $$url = "/shop/[product]";
//#endregion
//#region \0virtual:astro:page:src/pages/shop/[product]@_@astro
var page = () => _product__exports;
//#endregion
export { page };
