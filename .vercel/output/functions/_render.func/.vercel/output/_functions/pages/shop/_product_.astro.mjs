/* empty css                                           */
import { b as createAstro, c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_COnj2GrK.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../../chunks/Layout_5G4BMRzr.mjs';
import { P as Product } from '../../chunks/product_BDBhfcay.mjs';
export { renderers } from '../../renderers.mjs';

async function fetchProduct(path, origin) {
  try {
    const slug = path.replace("/shop/", "");
    const response = await fetch(`${origin}/api/products/${slug}`);
    if (!response.ok) {
      throw new Error("Failed to fetch product from API");
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
}

const $$Astro = createAstro("https://dounut-astro.vercel.app");
const prerender = false;
const $$product = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$product;
  const { product } = Astro2.params;
  const previewMode = Astro2.url.searchParams.get("preview") === "1";
  const previewData = Astro2.url.searchParams.get("previewData");
  let productData;
  if (previewMode && previewData) {
    try {
      productData = { product: JSON.parse(decodeURIComponent(previewData)) };
    } catch {
      productData = null;
    }
  } else {
    productData = await fetchProduct(
      `/shop/${product}`,
      Astro2.url.origin
    );
  }
  const pageTitle = productData?.product?.name ?? "Product";
  const pageDescription = productData?.product?.name ?? "Product";
  console.log("pageTitle", JSON.stringify(pageTitle));
  console.log("pageDescription", JSON.stringify(pageDescription));
  console.log("productData", JSON.stringify(productData));
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": pageTitle, "description": pageDescription }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="lg:container mx-auto w-full lg:px-0 px-5"> ${productData ? renderTemplate`${renderComponent($$result2, "CrystallizeProduct", Product, { "product": productData.product, "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/talisma/github-projects/kukala/src/components/product", "client:component-export": "Product" })}` : renderTemplate`<p>Product not found</p>`} </div> ` })}`;
}, "/Users/talisma/github-projects/kukala/src/pages/shop/[product].astro", void 0);

const $$file = "/Users/talisma/github-projects/kukala/src/pages/shop/[product].astro";
const $$url = "/shop/[product]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$product,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
