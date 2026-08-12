import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import { createClient } from "@supabase/supabase-js";
import { PrismaClient } from "@prisma/client";
//#region src/pages/api/webhook.ts
var webhook_exports = /* @__PURE__ */ __exportAll({ POST: () => POST });
var prisma = new PrismaClient();
var supabaseAdmin = createClient("https://rqbegbvangiegbnrgxrv.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxYmVnYnZhbmdpZWdibnJneHJ2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjQ2OTIzOSwiZXhwIjoyMDk4MDQ1MjM5fQ.cy32qLEsrxnnmtcKlmfY0Ld_3zc5Ic-_I_Jcg1ipPZE");
var WEBHOOK_SECRET = "YOUR_SECRET_TOKEN";
var POST = async ({ request }) => {
	if (request.headers.get("x-webhook-secret") !== WEBHOOK_SECRET) return new Response(JSON.stringify({ error: "Unauthorized: Invalid secret token" }), { status: 401 });
	try {
		const formData = await request.formData();
		const productPayload = JSON.parse(formData.get("product") || "{}");
		const relatedProductSlugs = productPayload.relatedProducts || [];
		if (!productPayload.slug) return new Response(JSON.stringify({ error: "Product slug is required" }), { status: 400 });
		const files = formData.getAll("images");
		const imageUrls = await Promise.all(files.map(async (file, index) => {
			const safeName = `${productPayload.slug}-${Date.now()}-${index}-${file.name.replace(/\s+/g, "-")}`;
			const { error } = await supabaseAdmin.storage.from("products").upload(safeName, file, {
				upsert: true,
				contentType: file.type
			});
			if (error) throw error;
			const { data } = supabaseAdmin.storage.from("products").getPublicUrl(safeName);
			return {
				id: safeName,
				url: data.publicUrl,
				altText: productPayload.name
			};
		}));
		const productData = {
			name: productPayload.name,
			slug: productPayload.slug,
			path: productPayload.path || `/shop/${productPayload.slug}`,
			published: productPayload.published ?? true,
			type: productPayload.type || "product",
			summary: productPayload.summary || void 0,
			body: productPayload.body || void 0
		};
		const relatedProductIds = (await prisma.product.findMany({
			where: { slug: { in: relatedProductSlugs } },
			select: { id: true }
		})).map((p) => p.id);
		const savedProduct = await prisma.$transaction(async (tx) => {
			const product = await tx.product.upsert({
				where: { slug: productPayload.slug },
				update: {
					...productData,
					images: {
						deleteMany: {},
						create: imageUrls
					},
					mainImage: imageUrls.length > 0 ? { connect: { id: imageUrls[0].id } } : void 0
				},
				create: {
					...productData,
					images: { create: imageUrls },
					mainImage: imageUrls.length > 0 ? { connect: { id: imageUrls[0].id } } : void 0
				}
			});
			await tx.productRelationship.deleteMany({ where: { fromId: product.id } });
			if (relatedProductIds.length > 0) await tx.productRelationship.createMany({ data: relatedProductIds.map((relatedId) => ({
				fromId: product.id,
				toId: relatedId
			})) });
			return product;
		});
		return new Response(JSON.stringify({
			message: "Webhook processed successfully",
			product: savedProduct
		}), {
			status: 200,
			headers: { "Content-Type": "application/json" }
		});
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unexpected error";
		console.error("Webhook Error:", error);
		return new Response(JSON.stringify({ error: message }), { status: 500 });
	}
};
//#endregion
//#region \0virtual:astro:page:src/pages/api/webhook@_@ts
var page = () => webhook_exports;
//#endregion
export { page };
