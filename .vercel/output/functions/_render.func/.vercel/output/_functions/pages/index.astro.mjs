/* empty css                                        */
import { b as createAstro, c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_COnj2GrK.mjs';
import 'kleur/colors';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { Image } from '@crystallize/reactjs-components';
import { $ as $$Layout } from '../chunks/Layout_5G4BMRzr.mjs';
export { renderers } from '../renderers.mjs';

function GridItem({ cell }) {
  const product = cell.item;
  const image = product.variants?.[0]?.images?.[0];
  const price = product.variants?.[0]?.price;
  if (cell.layout.colspan === 3) {
    return /* @__PURE__ */ jsx("a", { href: product.path, children: /* @__PURE__ */ jsxs("div", { className: "flex relative lg:flex-row flex-col", children: [
      /* @__PURE__ */ jsx(
        "img",
        {
          src: image.url,
          alt: image.altText,
          className: "lg:absolute right-0 bottom-0 lg:w-6/12 rounded-r-xl"
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col w-full justify-evenly h-80 p-5 rounded-xl bg-background1", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold", children: product.name }),
          /* @__PURE__ */ jsxs("p", { children: [
            "$",
            price
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex gap-1", children: product.topics?.map((topic) => /* @__PURE__ */ jsx(
          "span",
          {
            className: "text-sm bg-grey px-3 py-1 rounded-xl",
            children: topic.name
          },
          topic.name
        )) })
      ] })
    ] }) });
  }
  return /* @__PURE__ */ jsx("a", { href: product.path, children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col rounded-xl p-5 bg-background3 min-h-[400px]", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
      /* @__PURE__ */ jsx("div", { className: "flex gap-1", children: product.topics?.map((topic) => /* @__PURE__ */ jsx(
        "span",
        {
          className: "text-sm bg-grey px-3 py-1 rounded-xl",
          children: topic.name
        },
        topic.name
      )) }),
      /* @__PURE__ */ jsxs("p", { children: [
        "$",
        price
      ] })
    ] }),
    /* @__PURE__ */ jsx(
      "img",
      {
        src: image.url,
        alt: image.altText,
        className: "mx-auto"
      }
    ),
    /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-center mt-auto", children: product.name })
  ] }) });
}

const Grid = ({ grid }) => {
  const currentGrid = grid.content.grids[0];
  const cells = currentGrid?.rows.flatMap((row) => row.columns) ?? [];
  return /* @__PURE__ */ jsx(
    "div",
    {
      style: {
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "1rem"
      },
      children: cells.map((cell, index) => /* @__PURE__ */ jsx(
        "div",
        {
          style: {
            gridColumn: `span ${cell.layout.colspan}`,
            gridRow: `span ${cell.layout.rowspan}`
          },
          children: /* @__PURE__ */ jsx(GridItem, { cell })
        },
        index
      ))
    }
  );
};

const TopicsDisplayer = ({
  topics
}) => {
  return /* @__PURE__ */ jsx("div", { className: "flex gap-1", children: topics?.map((topic) => /* @__PURE__ */ jsx(
    "div",
    {
      className: "text-sm bg-grey px-3 py-1 rounded-xl",
      children: topic.name
    },
    topic.name
  )) });
};

const ProductCard = ({ product }) => {
  const isBundle = product?.bundle?.content?.value;
  const priceVariant = {
    price: product?.defaultVariant.priceVariant.price,
    currency: product?.defaultVariant.priceVariant.currency
  };
  const image = product?.defaultVariant.firstImage;
  return /* @__PURE__ */ jsx(Fragment, { children: !isBundle && /* @__PURE__ */ jsx(
    "a",
    {
      href: product?.path,
      className: "flex flex-col lg:bg-primary rounded-xl lg:h-96 p-5 lg:w-[300px] bg-background2 w-full",
      children: /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start", children: [
          /* @__PURE__ */ jsx(TopicsDisplayer, { topics: product?.topics }),
          /* @__PURE__ */ jsxs("p", { className: "self-end", children: [
            priceVariant?.currency === "USD" ? "$" : priceVariant?.currency,
            priceVariant?.price
          ] })
        ] }),
        /* @__PURE__ */ jsx(
          Image,
          {
            ...image,
            sizes: "(max-width: 700px) 200px, 300px",
            loading: "lazy",
            className: "mx-auto"
          }
        ),
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-center m-auto w-40", children: product?.name })
      ] })
    }
  ) });
};

const Products = ({
  donuts
}) => {
  return /* @__PURE__ */ jsxs("div", { className: "mt-20", children: [
    /* @__PURE__ */ jsx("p", { className: "text-lg font-semibold mb-10", children: "Our donuts" }),
    /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-5", children: donuts?.children?.map((donut, index) => /* @__PURE__ */ jsx(ProductCard, { product: donut }, index)) })
  ] });
};

async function fetchFrontPage(origin) {
  try {
    const response = await fetch(`${origin}/api/frontpage`);
    if (!response.ok) {
      throw new Error("Failed to fetch frontpage from API");
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
}

const $$Astro = createAstro("https://dounut-astro.vercel.app");
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const data = await fetchFrontPage(Astro2.url.origin);
  const { page, catalog, products } = data;
  const { grid } = catalog;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": page?.title ?? "Kulala", "description": page?.description ?? "One stop shop for buying cosmetic & personal care online." }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="py-10 lg:container mx-auto w-full md:px-0 px-3"> ${renderComponent($$result2, "Grid", Grid, { "grid": grid })} ${renderComponent($$result2, "Products", Products, { "donuts": { children: products } })} </div> ` })}`;
}, "/Users/talisma/github-projects/kukala/src/pages/index.astro", void 0);

const $$file = "/Users/talisma/github-projects/kukala/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
