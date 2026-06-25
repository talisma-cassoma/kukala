import 'cookie';
import 'kleur/colors';
import { N as NOOP_MIDDLEWARE_FN } from './chunks/astro-designed-error-pages_C6b6bnxc.mjs';
import 'es-module-lexer';
import { e as decodeKey } from './chunks/astro/server_COnj2GrK.mjs';
import 'clsx';

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///Users/talisma/github-projects/kukala/","adapterName":"@astrojs/vercel/serverless","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/.pnpm/astro@4.16.19_@types+node@26.0.0_rollup@4.61.1_typescript@6.0.3/node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/edit-product.BIrl9G6i.css"}],"routeData":{"route":"/admin/edit-product","isIndex":false,"type":"page","pattern":"^\\/admin\\/edit-product\\/?$","segments":[[{"content":"admin","dynamic":false,"spread":false}],[{"content":"edit-product","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/admin/edit-product.astro","pathname":"/admin/edit-product","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/frontpage","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/frontpage\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"frontpage","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/frontpage.ts","pathname":"/api/frontpage","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/orders/[id]","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/orders\\/([^/]+?)\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"orders","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}]],"params":["id"],"component":"src/pages/api/orders/[id].ts","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/products/[slug]","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/products\\/([^/]+?)\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"products","dynamic":false,"spread":false}],[{"content":"slug","dynamic":true,"spread":false}]],"params":["slug"],"component":"src/pages/api/products/[slug].ts","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/products","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/products\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"products","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/products.ts","pathname":"/api/products","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/webhook","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/webhook\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"webhook","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/webhook.ts","pathname":"/api/webhook","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.BScVxmeO.js"}],"styles":[{"type":"external","src":"/_astro/edit-product.BIrl9G6i.css"},{"type":"inline","content":".astro-route-announcer{position:absolute;left:0;top:0;clip:rect(0 0 0 0);clip-path:inset(50%);overflow:hidden;white-space:nowrap;width:1px;height:1px}@media screen and (max-width: 768px){.crystallize-grid{display:flex!important;flex-direction:column!important}.bg-fixed{display:none}}.bg-fixed{background-attachment:fixed;background-position:center;background-repeat:no-repeat;background-size:cover}\n"}],"routeData":{"route":"/cart","isIndex":false,"type":"page","pattern":"^\\/cart\\/?$","segments":[[{"content":"cart","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/cart.astro","pathname":"/cart","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.BScVxmeO.js"}],"styles":[{"type":"external","src":"/_astro/edit-product.BIrl9G6i.css"},{"type":"inline","content":".astro-route-announcer{position:absolute;left:0;top:0;clip:rect(0 0 0 0);clip-path:inset(50%);overflow:hidden;white-space:nowrap;width:1px;height:1px}@media screen and (max-width: 768px){.crystallize-grid{display:flex!important;flex-direction:column!important}.bg-fixed{display:none}}.bg-fixed{background-attachment:fixed;background-position:center;background-repeat:no-repeat;background-size:cover}\n"}],"routeData":{"route":"/checkout","isIndex":false,"type":"page","pattern":"^\\/checkout\\/?$","segments":[[{"content":"checkout","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/checkout.astro","pathname":"/checkout","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/order/create","isIndex":false,"type":"endpoint","pattern":"^\\/order\\/create\\/?$","segments":[[{"content":"order","dynamic":false,"spread":false}],[{"content":"create","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/order/create.ts","pathname":"/order/create","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.BScVxmeO.js"}],"styles":[{"type":"external","src":"/_astro/edit-product.BIrl9G6i.css"},{"type":"inline","content":".astro-route-announcer{position:absolute;left:0;top:0;clip:rect(0 0 0 0);clip-path:inset(50%);overflow:hidden;white-space:nowrap;width:1px;height:1px}@media screen and (max-width: 768px){.crystallize-grid{display:flex!important;flex-direction:column!important}.bg-fixed{display:none}}.bg-fixed{background-attachment:fixed;background-position:center;background-repeat:no-repeat;background-size:cover}\n"}],"routeData":{"route":"/order/[id]","isIndex":false,"type":"page","pattern":"^\\/order\\/([^/]+?)\\/?$","segments":[[{"content":"order","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}]],"params":["id"],"component":"src/pages/order/[id].astro","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.BScVxmeO.js"}],"styles":[{"type":"external","src":"/_astro/edit-product.BIrl9G6i.css"},{"type":"inline","content":".astro-route-announcer{position:absolute;left:0;top:0;clip:rect(0 0 0 0);clip-path:inset(50%);overflow:hidden;white-space:nowrap;width:1px;height:1px}@media screen and (max-width: 768px){.crystallize-grid{display:flex!important;flex-direction:column!important}.bg-fixed{display:none}}.bg-fixed{background-attachment:fixed;background-position:center;background-repeat:no-repeat;background-size:cover}\n"}],"routeData":{"route":"/shop/[product]","isIndex":false,"type":"page","pattern":"^\\/shop\\/([^/]+?)\\/?$","segments":[[{"content":"shop","dynamic":false,"spread":false}],[{"content":"product","dynamic":true,"spread":false}]],"params":["product"],"component":"src/pages/shop/[product].astro","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.BScVxmeO.js"}],"styles":[{"type":"external","src":"/_astro/edit-product.BIrl9G6i.css"},{"type":"inline","content":".astro-route-announcer{position:absolute;left:0;top:0;clip:rect(0 0 0 0);clip-path:inset(50%);overflow:hidden;white-space:nowrap;width:1px;height:1px}@media screen and (max-width: 768px){.crystallize-grid{display:flex!important;flex-direction:column!important}.bg-fixed{display:none}}.bg-fixed{background-attachment:fixed;background-position:center;background-repeat:no-repeat;background-size:cover}\n"}],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}}],"site":"https://dounut-astro.vercel.app","base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["/Users/talisma/github-projects/kukala/src/pages/admin/edit-product.astro",{"propagation":"none","containsHead":true}],["/Users/talisma/github-projects/kukala/src/pages/cart.astro",{"propagation":"none","containsHead":true}],["/Users/talisma/github-projects/kukala/src/pages/checkout.astro",{"propagation":"none","containsHead":true}],["/Users/talisma/github-projects/kukala/src/pages/index.astro",{"propagation":"none","containsHead":true}],["/Users/talisma/github-projects/kukala/src/pages/order/[id].astro",{"propagation":"none","containsHead":true}],["/Users/talisma/github-projects/kukala/src/pages/shop/[product].astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(o,t)=>{let i=async()=>{await(await o())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var s=(i,t)=>{let a=async()=>{await(await i())()};if(t.value){let e=matchMedia(t.value);e.matches?a():e.addEventListener(\"change\",a,{once:!0})}};(self.Astro||(self.Astro={})).media=s;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var l=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let a of e)if(a.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=l;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000noop-middleware":"_noop-middleware.mjs","\u0000@astro-page:src/pages/api/frontpage@_@ts":"pages/api/frontpage.astro.mjs","\u0000@astro-page:src/pages/api/orders/[id]@_@ts":"pages/api/orders/_id_.astro.mjs","\u0000@astro-page:src/pages/api/products/[slug]@_@ts":"pages/api/products/_slug_.astro.mjs","\u0000@astro-page:src/pages/api/products@_@ts":"pages/api/products.astro.mjs","\u0000@astro-page:src/pages/api/webhook@_@ts":"pages/api/webhook.astro.mjs","\u0000@astro-page:src/pages/cart@_@astro":"pages/cart.astro.mjs","\u0000@astro-page:src/pages/checkout@_@astro":"pages/checkout.astro.mjs","\u0000@astro-page:src/pages/shop/[product]@_@astro":"pages/shop/_product_.astro.mjs","\u0000@astro-page:src/pages/admin/edit-product@_@astro":"pages/admin/edit-product.astro.mjs","\u0000@astro-page:src/pages/order/[id]@_@astro":"pages/order/_id_.astro.mjs","\u0000@astro-page:src/pages/order/create@_@ts":"pages/order/create.astro.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astro-page:node_modules/.pnpm/astro@4.16.19_@types+node@26.0.0_rollup@4.61.1_typescript@6.0.3/node_modules/astro/dist/assets/endpoint/generic@_@js":"pages/_image.astro.mjs","/Users/talisma/github-projects/kukala/node_modules/.pnpm/astro@4.16.19_@types+node@26.0.0_rollup@4.61.1_typescript@6.0.3/node_modules/astro/dist/env/setup.js":"chunks/astro/env-setup_Cr6XTFvb.mjs","\u0000@astrojs-manifest":"manifest_GPMyuvyO.mjs","/Users/talisma/github-projects/kukala/src/components/checkout":"_astro/checkout.haoN2K2y.js","/Users/talisma/github-projects/kukala/src/components/local-cart.tsx":"_astro/local-cart.CO3IMeni.js","/Users/talisma/github-projects/kukala/src/components/ProductRegistrationWizard":"_astro/ProductRegistrationWizard.acZ4wjk4.js","/Users/talisma/github-projects/kukala/src/components/header":"_astro/header.CMzkGYnY.js","/astro/hoisted.js?q=0":"_astro/hoisted.BScVxmeO.js","@astrojs/react/client.js":"_astro/client.DrE9CFQR.js","/Users/talisma/github-projects/kukala/src/components/product":"_astro/product.Vl8XNIhC.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[],"assets":["/_astro/black_logo.1-unkKMi.png","/_astro/astro-logo.D23cMVHt.svg","/_astro/edit-product.BIrl9G6i.css","/favicon.png","/_astro/DailyMotion.KvUAwyQy.js","/_astro/Facebook.DEu7yTAM.js","/_astro/FilePlayer.DqsN57nz.js","/_astro/Kaltura.69XDfCuo.js","/_astro/Mixcloud.DmPekyns.js","/_astro/Mux.RThWQtKi.js","/_astro/Preview.DX4yFIZE.js","/_astro/ProductRegistrationWizard.acZ4wjk4.js","/_astro/SoundCloud.CG_GO5PA.js","/_astro/Streamable.CvVVsJIF.js","/_astro/Twitch.BSItw6gZ.js","/_astro/Vidyard.BqL2eMjJ.js","/_astro/Vimeo.c3Q_g8sV.js","/_astro/Wistia.B78S4L0M.js","/_astro/YouTube.BPd5Rr-t.js","/_astro/checkout.haoN2K2y.js","/_astro/client.DrE9CFQR.js","/_astro/header.CMzkGYnY.js","/_astro/hoisted.BScVxmeO.js","/_astro/index.CVf8TyFT.js","/_astro/jsx-runtime.TBa3i5EZ.js","/_astro/local-cart.CO3IMeni.js","/_astro/product.Baoc0z4b.js","/_astro/product.Vl8XNIhC.js"],"buildFormat":"directory","checkOrigin":false,"serverIslandNameMap":[],"key":"xa1kFEt7GMSP4UqRa7Ora2i4OueqZeUDUmzgBZd1Ztk=","experimentalEnvGetSecretEnabled":false});

export { manifest };
