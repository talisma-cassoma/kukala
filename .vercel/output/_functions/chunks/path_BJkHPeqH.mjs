import { N as NoImageMetadata, Q as AstroError, V as RemoteImageNotAllowed, u as FailedToFetchRemoteImageDimensions } from "./errors-data_BWcDjAR-.mjs";
import { t as imageMetadata } from "./metadata_DaiqHSLN.mjs";
//#region node_modules/.pnpm/@astrojs+internal-helpers@0.10.2/node_modules/@astrojs/internal-helpers/dist/remote.js
function matchPattern(url, remotePattern) {
	return matchProtocol(url, remotePattern.protocol) && matchHostname(url, remotePattern.hostname, true) && matchPort(url, remotePattern.port) && matchPathname(url, remotePattern.pathname, true);
}
function matchPort(url, port) {
	return !port || port === url.port;
}
function matchProtocol(url, protocol) {
	return !protocol || protocol === url.protocol.slice(0, -1);
}
function matchHostname(url, hostname, allowWildcard = false) {
	if (!hostname) return true;
	else if (!allowWildcard || !hostname.startsWith("*")) return hostname === url.hostname;
	else if (hostname.startsWith("**.")) {
		const slicedHostname = hostname.slice(2);
		return slicedHostname !== url.hostname && url.hostname.endsWith(slicedHostname);
	} else if (hostname.startsWith("*.")) {
		const slicedHostname = hostname.slice(1);
		if (!url.hostname.endsWith(slicedHostname)) return false;
		const subdomainWithDot = url.hostname.slice(0, -(slicedHostname.length - 1));
		return subdomainWithDot.endsWith(".") && !subdomainWithDot.slice(0, -1).includes(".");
	}
	return false;
}
function matchPathname(url, pathname, allowWildcard = false) {
	if (!pathname) return true;
	else if (!allowWildcard || !pathname.endsWith("*")) return pathname === url.pathname;
	else if (pathname.endsWith("/**")) {
		const slicedPathname = pathname.slice(0, -2);
		return slicedPathname !== url.pathname && url.pathname.startsWith(slicedPathname);
	} else if (pathname.endsWith("/*")) {
		const slicedPathname = pathname.slice(0, -1);
		if (!url.pathname.startsWith(slicedPathname)) return false;
		return url.pathname.slice(slicedPathname.length).split("/").filter(Boolean).length === 1;
	}
	return false;
}
function isRemoteAllowed(src, { domains, remotePatterns }) {
	if (!URL.canParse(src)) return false;
	const url = new URL(src);
	if (![
		"http:",
		"https:",
		"data:"
	].includes(url.protocol)) return false;
	return domains.some((domain) => matchHostname(url, domain)) || remotePatterns.some((remotePattern) => matchPattern(url, remotePattern));
}
//#endregion
//#region node_modules/.pnpm/astro@7.1.6_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@types+node@26.1.2_@vercel+funct_a7bf5dddaa36fd295a2729af9a65e75d/node_modules/astro/dist/assets/utils/redirectValidation.js
async function fetchWithRedirects(options) {
	const { url, headers, imageConfig, fetchFn = globalThis.fetch, redirectLimit = 10, onMaxRedirectsExceeded = (_u) => /* @__PURE__ */ new Error("Maximum redirect depth exceeded"), onMissingLocationHeader = (_s, _u) => /* @__PURE__ */ new Error(`Redirect response ${_s} missing Location header`), onDisallowedRedirect = (_current, _target) => /* @__PURE__ */ new Error(`The image at ${_current} redirected to ${_target}, which is not an allowed remote location.`) } = options;
	if (redirectLimit <= 0) throw onMaxRedirectsExceeded(typeof url === "string" ? url : url.toString());
	const urlString = typeof url === "string" ? url : url.toString();
	const res = await fetchFn(new Request(url, { headers }), { redirect: "manual" });
	if ([
		301,
		302,
		303,
		307,
		308
	].includes(res.status)) {
		const location = res.headers.get("Location");
		if (!location) throw onMissingLocationHeader(res.status, urlString);
		const redirectUrl = new URL(location, urlString).toString();
		if (!isRemoteAllowed(redirectUrl, {
			domains: imageConfig.domains ?? [],
			remotePatterns: imageConfig.remotePatterns ?? []
		})) throw onDisallowedRedirect(urlString, redirectUrl);
		return fetchWithRedirects({
			url: redirectUrl,
			headers,
			imageConfig,
			fetchFn,
			redirectLimit: redirectLimit - 1,
			onMaxRedirectsExceeded,
			onMissingLocationHeader,
			onDisallowedRedirect
		});
	}
	return res;
}
//#endregion
//#region node_modules/.pnpm/astro@7.1.6_@emnapi+core@1.11.1_@emnapi+runtime@1.11.3_@types+node@26.1.2_@vercel+funct_a7bf5dddaa36fd295a2729af9a65e75d/node_modules/astro/dist/assets/utils/remoteProbe.js
async function inferRemoteSize(url, imageConfig) {
	if (!URL.canParse(url)) throw new AstroError({
		...FailedToFetchRemoteImageDimensions,
		message: FailedToFetchRemoteImageDimensions.message(url)
	});
	const allowlistConfig = imageConfig ? {
		domains: imageConfig.domains ?? [],
		remotePatterns: imageConfig.remotePatterns ?? []
	} : void 0;
	if (!allowlistConfig) {
		const parsedUrl = new URL(url);
		if (!["http:", "https:"].includes(parsedUrl.protocol)) throw new AstroError({
			...FailedToFetchRemoteImageDimensions,
			message: FailedToFetchRemoteImageDimensions.message(url)
		});
	}
	if (allowlistConfig && !isRemoteAllowed(url, allowlistConfig)) throw new AstroError({
		...RemoteImageNotAllowed,
		message: RemoteImageNotAllowed.message(url)
	});
	let response;
	try {
		response = await fetchWithRedirects({
			url,
			onMaxRedirectsExceeded: (u) => new AstroError({
				...FailedToFetchRemoteImageDimensions,
				message: FailedToFetchRemoteImageDimensions.message(u)
			}),
			onMissingLocationHeader: (_status, u) => new AstroError({
				...FailedToFetchRemoteImageDimensions,
				message: FailedToFetchRemoteImageDimensions.message(u)
			}),
			imageConfig: imageConfig ?? {
				remotePatterns: [],
				domains: []
			}
		});
	} catch (_err) {
		throw new AstroError({
			...FailedToFetchRemoteImageDimensions,
			message: FailedToFetchRemoteImageDimensions.message(url)
		});
	}
	if (allowlistConfig && !isRemoteAllowed(response.url, allowlistConfig)) throw new AstroError({
		...RemoteImageNotAllowed,
		message: RemoteImageNotAllowed.message(url)
	});
	if (!response.body || !response.ok) throw new AstroError({
		...FailedToFetchRemoteImageDimensions,
		message: FailedToFetchRemoteImageDimensions.message(url)
	});
	const reader = response.body.getReader();
	let done, value;
	let accumulatedChunks = /* @__PURE__ */ new Uint8Array();
	while (!done) {
		const readResult = await reader.read();
		done = readResult.done;
		if (done) break;
		if (readResult.value) {
			value = readResult.value;
			let tmp = new Uint8Array(accumulatedChunks.length + value.length);
			tmp.set(accumulatedChunks, 0);
			tmp.set(value, accumulatedChunks.length);
			accumulatedChunks = tmp;
			try {
				const dimensions = await imageMetadata(accumulatedChunks, url);
				if (dimensions) {
					await reader.cancel();
					return dimensions;
				}
			} catch {}
		}
	}
	throw new AstroError({
		...NoImageMetadata,
		message: NoImageMetadata.message(url)
	});
}
//#endregion
//#region node_modules/.pnpm/@astrojs+internal-helpers@0.10.2/node_modules/@astrojs/internal-helpers/dist/path.js
function appendForwardSlash(path) {
	return path.endsWith("/") ? path : path + "/";
}
function prependForwardSlash(path) {
	return path[0] === "/" ? path : "/" + path;
}
var MANY_LEADING_SLASHES = /^\/{2,}/;
function collapseDuplicateLeadingSlashes(path) {
	if (!path) return path;
	return path.replace(MANY_LEADING_SLASHES, "/");
}
var MANY_SLASHES = /\/{2,}/g;
function collapseDuplicateSlashes(path) {
	if (!path) return path;
	return path.replace(MANY_SLASHES, "/");
}
var MANY_TRAILING_SLASHES = /\/{2,}$/g;
function collapseDuplicateTrailingSlashes(path, trailingSlash) {
	if (!path) return path;
	return path.replace(MANY_TRAILING_SLASHES, trailingSlash ? "/" : "") || "/";
}
function removeTrailingForwardSlash(path) {
	return path.endsWith("/") ? path.slice(0, path.length - 1) : path;
}
function removeLeadingForwardSlash(path) {
	return path.startsWith("/") ? path.substring(1) : path;
}
function trimSlashes(path) {
	return path.replace(/^\/|\/$/g, "");
}
function isString(path) {
	return typeof path === "string" || path instanceof String;
}
var INTERNAL_PREFIXES = /* @__PURE__ */ new Set([
	"/_",
	"/@",
	"/.",
	"//"
]);
var JUST_SLASHES = /^\/{2,}$/;
function isInternalPath(path) {
	const prefix = path.slice(0, 2).replace(/\\/g, "/");
	return INTERNAL_PREFIXES.has(prefix) && !JUST_SLASHES.test(path);
}
function joinPaths(...paths) {
	return paths.filter(isString).map((path, i) => {
		if (i === 0) return removeTrailingForwardSlash(path);
		else if (i === paths.length - 1) return removeLeadingForwardSlash(path);
		else return trimSlashes(path);
	}).join("/");
}
function removeQueryString(path) {
	const index = path.lastIndexOf("?");
	return index > 0 ? path.substring(0, index) : path;
}
function isRemotePath(src) {
	if (!src) return false;
	const trimmed = src.trim();
	if (!trimmed) return false;
	let decoded = trimmed;
	let previousDecoded = "";
	let maxIterations = 10;
	while (decoded !== previousDecoded && maxIterations > 0) {
		previousDecoded = decoded;
		try {
			decoded = decodeURIComponent(decoded);
		} catch {
			break;
		}
		maxIterations--;
	}
	if (/^[a-zA-Z]:/.test(decoded)) return false;
	if (decoded[0] === "/" && /^\/[\w.@-]/.test(decoded)) return false;
	if (decoded[0] === "\\") return true;
	if (decoded.startsWith("//")) return true;
	try {
		const url = new URL(decoded, "http://n");
		if (url.username || url.password) return true;
		if (decoded.includes("@") && !url.pathname.includes("@") && !url.search.includes("@")) return true;
		if (url.origin !== "http://n") {
			if (url.protocol.toLowerCase() === "file:") return false;
			return true;
		}
		if (URL.canParse(decoded)) return true;
		return false;
	} catch {
		return true;
	}
}
function slash(path) {
	return path.replace(/\\/g, "/");
}
function fileExtension(path) {
	const ext = path.split(".").pop();
	return ext !== path ? `.${ext}` : "";
}
var WITH_FILE_EXT = /\/[^/]+\.\w+$/;
function hasFileExtension(path) {
	return WITH_FILE_EXT.test(path);
}
//#endregion
export { fetchWithRedirects as _, fileExtension as a, isRemotePath as c, removeLeadingForwardSlash as d, removeQueryString as f, inferRemoteSize as g, trimSlashes as h, collapseDuplicateTrailingSlashes as i, joinPaths as l, slash as m, collapseDuplicateLeadingSlashes as n, hasFileExtension as o, removeTrailingForwardSlash as p, collapseDuplicateSlashes as r, isInternalPath as s, appendForwardSlash as t, prependForwardSlash as u, isRemoteAllowed as v, matchPattern as y };
