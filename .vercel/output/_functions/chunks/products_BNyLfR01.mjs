import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import { t as getSupabaseClient } from "./supabase_DDJ74Baw.mjs";
import { PrismaClient, ProductType } from "@prisma/client";
//#region src/pages/api/products.ts
var products_exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	POST: () => POST
});
var prisma = new PrismaClient();
function mapProductToCard(product) {
	const firstImage = product.defaultVariant?.images?.[0] ?? product.images?.[0] ?? null;
	return {
		id: product.id,
		__typename: "Product",
		name: product.name,
		path: product.path,
		topics: product.topics ?? [],
		bundle: { content: product.isBundle ? { value: true } : null },
		defaultVariant: {
			firstImage: firstImage ? {
				url: firstImage.url,
				altText: firstImage.altText,
				variants: []
			} : null,
			priceVariant: {
				price: product.defaultVariant?.price ?? 0,
				currency: product.defaultVariant?.currency ?? "USD"
			}
		}
	};
}
var GET = async () => {
	try {
		const productCards = (await prisma.product.findMany({
			where: { published: true },
			include: {
				topics: true,
				images: { take: 1 },
				defaultVariant: { include: { images: { take: 1 } } }
			}
		})).map(mapProductToCard);
		return new Response(JSON.stringify(productCards), {
			status: 200,
			headers: { "content-type": "application/json" }
		});
	} catch (error) {
		console.error(error);
		return new Response(JSON.stringify({
			message: "An error occurred.",
			error: error.message
		}), {
			status: 500,
			headers: { "content-type": "application/json" }
		});
	}
};
var POST = async ({ request }) => {
	try {
		const authHeader = request.headers.get("Authorization");
		if (!authHeader) return new Response(JSON.stringify({ message: "Authorization header missing" }), { status: 401 });
		const token = authHeader.split(" ")[1];
		if (!token) return new Response(JSON.stringify({ message: "Token missing" }), { status: 401 });
		const { data: { user }, error: userError } = await getSupabaseClient().auth.getUser(token);
		if (userError || !user) return new Response(JSON.stringify({
			message: "Invalid or expired token",
			error: userError?.message
		}), { status: 401 });
		if (user.email !== "talisma63@gmail.com") return new Response(JSON.stringify({ message: "Forbidden: User is not an admin" }), { status: 403 });
		const body = await request.json();
		if (!body.name || !body.slug || !body.path || !body.type) return new Response(JSON.stringify({ message: "Missing required fields: name, slug, path, type" }), { status: 400 });
		if (!Object.values(ProductType).includes(body.type)) return new Response(JSON.stringify({ message: `Invalid product type. Must be one of: ${Object.values(ProductType).join(", ")}` }), { status: 400 });
		const newProduct = await prisma.product.create({
			data: {
				name: body.name,
				slug: body.slug,
				path: body.path,
				type: body.type,
				summary: body.summary || null,
				published: body.published !== void 0 ? body.published : false,
				mainImage: body.mainImage ? { create: {
					url: body.mainImage.url,
					altText: body.mainImage.altText
				} } : void 0,
				topics: body.topics ? { connect: body.topics.map((topic) => ({ id: topic.id })) } : void 0,
				bodyParagraphs: body.bodyParagraphs ? { create: body.bodyParagraphs.map((p, index) => ({
					title: p.title,
					body: p.body,
					order: p.order ?? index,
					images: p.images ? { create: p.images.map((img) => ({
						url: img.url,
						altText: img.altText
					})) } : void 0
				})) } : void 0,
				tableSections: body.tableSections ? { create: body.tableSections.map((s, index) => ({
					title: s.title,
					order: s.order ?? index,
					properties: s.properties ? { create: s.properties.map((prop, propIndex) => ({
						key: prop.key,
						value: prop.value,
						order: prop.order ?? propIndex
					})) } : void 0
				})) } : void 0,
				optionGroups: body.optionGroups ? { create: body.optionGroups.map((group) => ({
					name: group.name,
					required: group.required,
					options: group.options ? { create: group.options.map((option) => ({
						label: option.label,
						price: option.price,
						available: option.available
					})) } : void 0
				})) } : void 0,
				relatedTo: body.relatedProducts ? { create: body.relatedProducts.map((relatedId) => ({ to: { connect: { id: relatedId } } })) } : void 0
			},
			include: {
				mainImage: true,
				topics: true,
				bodyParagraphs: { include: { images: true } },
				tableSections: { include: { properties: true } },
				optionGroups: { include: { options: true } },
				relatedTo: { include: { to: true } }
			}
		});
		return new Response(JSON.stringify(newProduct), {
			status: 201,
			headers: { "content-type": "application/json" }
		});
	} catch (error) {
		console.error(error);
		if (error.code === "P2002") {
			const target = error.meta?.target;
			return new Response(JSON.stringify({ message: `A product with this ${target?.join(", ") ?? "value"} already exists.` }), {
				status: 409,
				headers: { "content-type": "application/json" }
			});
		}
		return new Response(JSON.stringify({
			message: "An error occurred while creating the product.",
			error: error.message
		}), {
			status: 500,
			headers: { "content-type": "application/json" }
		});
	}
};
//#endregion
//#region \0virtual:astro:page:src/pages/api/products@_@ts
var page = () => products_exports;
//#endregion
export { page };
