import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import { PrismaClient } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
//#region src/pages/api/products/[slug].ts
var _slug__exports = /* @__PURE__ */ __exportAll({ GET: () => GET });
var prisma = new PrismaClient();
function mapProductToContract(product) {
	const price = product.optionGroups.flatMap((g) => g.options).reduce((min, p) => p.price < min ? p.price : min, new Decimal(Infinity)).toNumber();
	return {
		id: product.id,
		name: product.name,
		path: product.path,
		__typename: "Product",
		topics: product.topics.map((t) => ({ name: t.name })),
		image: product.mainImage ? {
			url: product.mainImage.url,
			altText: product.mainImage.altText ?? ""
		} : null,
		price: isFinite(price) ? price : 0,
		summary: product.summary ?? "",
		body: { paragraphs: product.bodyParagraphs.map((p) => ({
			title: { text: p.title ?? "" },
			body: { json: p.body },
			images: p.images.map((img) => ({
				url: img.url,
				altText: img.altText ?? ""
			}))
		})) },
		table: { sections: product.tableSections.map((s) => ({
			title: s.title,
			properties: s.properties.map((p) => ({
				key: p.key,
				value: p.value
			}))
		})) },
		productOptions: product.optionGroups.map((g) => ({
			id: g.id,
			name: g.name,
			required: g.required,
			options: g.options.map((o) => ({
				id: o.id,
				label: o.label,
				price: o.price.toNumber(),
				available: o.available
			}))
		})),
		related: { items: product.relatedTo.map((r) => ({
			id: r.to.id,
			name: r.to.name,
			path: r.to.path,
			__typename: "Product",
			image: r.to.mainImage ? {
				url: r.to.mainImage.url,
				altText: r.to.mainImage.altText ?? ""
			} : null,
			topics: r.to.topics.map((t) => ({ name: t.name })),
			price: 0
		})) }
	};
}
var GET = async ({ params }) => {
	const { slug } = params;
	if (!slug) return new Response(JSON.stringify({ message: "Product slug is required" }), {
		status: 400,
		headers: { "content-type": "application/json" }
	});
	try {
		const productFromDb = await prisma.product.findUnique({
			where: {
				slug,
				published: true
			},
			include: {
				mainImage: true,
				topics: true,
				bodyParagraphs: {
					orderBy: { order: "asc" },
					include: { images: true }
				},
				tableSections: {
					orderBy: { order: "asc" },
					include: { properties: { orderBy: { order: "asc" } } }
				},
				optionGroups: { include: { options: true } },
				relatedTo: { include: { to: { include: {
					mainImage: true,
					topics: true
				} } } }
			}
		});
		if (!productFromDb) return new Response(JSON.stringify({ message: "Product not found" }), {
			status: 404,
			headers: { "content-type": "application/json" }
		});
		const productForFrontend = mapProductToContract(productFromDb);
		return new Response(JSON.stringify({ product: productForFrontend }), {
			status: 200,
			headers: { "content-type": "application/json" }
		});
	} catch (error) {
		console.error(error);
		const errorMessage = error.message;
		return new Response(JSON.stringify({
			message: "An error occurred.",
			error: errorMessage
		}), {
			status: 500,
			headers: { "content-type": "application/json" }
		});
	}
};
//#endregion
//#region \0virtual:astro:page:src/pages/api/products/[slug]@_@ts
var page = () => _slug__exports;
//#endregion
export { page };
