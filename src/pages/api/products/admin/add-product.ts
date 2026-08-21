import type { APIRoute } from "astro";
import { PrismaClient, type ProductType } from "@prisma/client";
import { requireAdmin } from "@/lib/auth";

const prisma = new PrismaClient();

function createProductPath(name: string): string {
    return `/shop/${name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "_")
        .replace(/[^a-z0-9_]/g, "")
        .replace(/_+/g, "_")
        .replace(/^_|_$/g, "")}`;
}

export const POST: APIRoute = async (context) => {

    const { params, request } = context;
    const body = await request.json();
    //console.log("Dashboard API Called")
    const { product } = body

    //console.log("produt: ", JSON.stringify(product))

    const images = {
        thumbnail: product?.image?.url ?? "",
        body: product?.body?.paragraphs?.flatMap((paragraph: any) =>
            paragraph.images?.map((image: any) => image.url).filter(Boolean) ?? []
        ) ?? [],
    };

    try {
        // 1. Authenticate and authorize the administrator
        const adminUserOrResponse = await requireAdmin(context);
        if (adminUserOrResponse instanceof Response) {
            return adminUserOrResponse;
        }


        if (!product.name) {
            return new Response(
                JSON.stringify({
                    message: "An error occurred while fetching dashboard data.",
                }),
                {
                    status: 500,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
        }
        const path = createProductPath(product.name)
        const createdProduct = await prisma.product.create({
            data: {
                name: product.name,
                path: path,
                slug: path.split('/').pop() ?? "",
                type: product.__typename as ProductType,
                published: true,
                summary: product.summary,
                mainImage: {
                    create: {
                        url: images.thumbnail as string,
                        altText: product.image.altText,
                    },
                },
                bodyParagraphs: {
                    create: product.body.paragraphs.map((p: any, index: number) => ({
                        title: p.title?.text,
                        body: p.text,
                        order: index,
                        images: {
                            create: (images.body as string[]).map((url: string) => ({
                                url,
                                altText: `${product.name} image`
                            }))
                        }
                    }))
                },
                tableSections: {
                    create: product.table.sections.map((section: any, index: number) => ({
                        title: section.title,
                        order: index,
                        properties: {
                            create: section.properties.map((prop: any, propIndex: number) => ({
                                key: prop.key,
                                value: prop.value,
                                order: propIndex,
                            }))
                        }
                    }))
                },
                topics: {
                    connectOrCreate: product.topics.map((topic: any) => ({
                        where: { name: topic.name },
                        create: { name: topic.name, slug: topic.name.toLowerCase().replace(/ /g, '-') },
                    })),
                },
                optionGroups: {
                    create: product.productOptions?.map((group: any) => ({
                        name: group.name,
                        required: group.required,
                        options: {
                            create: group.options?.map((option: any) => ({
                                label: option.label,
                                price: option.price,
                                available: option.available,
                            }))
                        }
                    }))
                },
            },
        });
        console.log(`Created product with slug: ${createdProduct.slug}`);
        return new Response(null, {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
    catch (error) {
        console.error("Dashboard API Error:", error);
        return new Response(
            JSON.stringify({
                message: "An error occurred while fetching dashboard data.",
            }),
            {
                status: 500,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
    }
};