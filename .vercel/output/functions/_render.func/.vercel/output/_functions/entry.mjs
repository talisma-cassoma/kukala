import { renderers } from './renderers.mjs';
import { c as createExports } from './chunks/entrypoint_CGeuGeoh.mjs';
import { manifest } from './manifest_GPMyuvyO.mjs';

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/admin/edit-product.astro.mjs');
const _page2 = () => import('./pages/api/frontpage.astro.mjs');
const _page3 = () => import('./pages/api/orders/_id_.astro.mjs');
const _page4 = () => import('./pages/api/products/_slug_.astro.mjs');
const _page5 = () => import('./pages/api/products.astro.mjs');
const _page6 = () => import('./pages/api/webhook.astro.mjs');
const _page7 = () => import('./pages/cart.astro.mjs');
const _page8 = () => import('./pages/checkout.astro.mjs');
const _page9 = () => import('./pages/order/create.astro.mjs');
const _page10 = () => import('./pages/order/_id_.astro.mjs');
const _page11 = () => import('./pages/shop/_product_.astro.mjs');
const _page12 = () => import('./pages/index.astro.mjs');

const pageMap = new Map([
    ["node_modules/.pnpm/astro@4.16.19_@types+node@26.0.0_rollup@4.61.1_typescript@6.0.3/node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/admin/edit-product.astro", _page1],
    ["src/pages/api/frontpage.ts", _page2],
    ["src/pages/api/orders/[id].ts", _page3],
    ["src/pages/api/products/[slug].ts", _page4],
    ["src/pages/api/products.ts", _page5],
    ["src/pages/api/webhook.ts", _page6],
    ["src/pages/cart.astro", _page7],
    ["src/pages/checkout.astro", _page8],
    ["src/pages/order/create.ts", _page9],
    ["src/pages/order/[id].astro", _page10],
    ["src/pages/shop/[product].astro", _page11],
    ["src/pages/index.astro", _page12]
]);
const serverIslandMap = new Map();
const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "65166877-8a2b-44be-998a-8513d04fa1a0",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;

export { __astrojsSsrVirtualEntry as default, pageMap };
