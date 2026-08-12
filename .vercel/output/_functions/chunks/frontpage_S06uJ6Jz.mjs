import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import { PrismaClient, ProductType } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
//#region src/pages/api/frontpage.ts
var frontpage_exports = /* @__PURE__ */ __exportAll({ GET: () => GET });
var prisma = new PrismaClient();
function hasImage(product) {
	return product.mainImage !== null;
}
function mapProductToCard(product) {
	const price = product.optionGroups.flatMap((g) => g.options).reduce((min, p) => p.price.lt(min) ? p.price : min, new Decimal(Infinity)).toNumber();
	return {
		id: product.id,
		__typename: "Product",
		name: product.name,
		path: product.path,
		topics: product.topics.map((t) => ({ name: t.name })),
		bundle: null,
		image: {
			url: product.mainImage.url,
			altText: product.mainImage.altText ?? ""
		},
		price: isFinite(price) ? price : 0
	};
}
var GET = async () => {
	try {
		const validProducts = (await prisma.product.findMany({
			where: { published: true },
			include: {
				mainImage: true,
				topics: true,
				optionGroups: { include: { options: true } }
			}
		})).filter(hasImage);
		const response = {
			comboboxes: validProducts.filter((p) => p.type === ProductType.COMBOBOX).map(mapProductToCard),
			discountedBundles: validProducts.filter((p) => p.type === ProductType.DISCOUNTED).map(mapProductToCard),
			retailProducts: validProducts.filter((p) => p.type === ProductType.RETAIL).map(mapProductToCard)
		};
		return new Response(JSON.stringify(response), {
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
//#endregion
//#region \0virtual:astro:page:src/pages/api/frontpage@_@ts
var page = () => frontpage_exports;
//#endregion
export { page };
