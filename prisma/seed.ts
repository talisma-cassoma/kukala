import { PrismaClient, ProductType } from '@prisma/client';
import { uploadImage } from '../src/lib/uploadImageNode.js';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const prisma = new PrismaClient();

async function main() {
    console.log("Cleaning database...");
    // await prisma.product.deleteMany();
    // await prisma.topic.deleteMany();
    await prisma.$executeRawUnsafe(`
    TRUNCATE TABLE
        "Product",
        "Topic",
        "Order",
        "Admin"
    CASCADE
    `);
    console.log("Database cleaned.");

    console.log("Seeding database...");

    const __filename = fileURLToPath(import.meta.url);
    const currentDir = dirname(__filename);

    const mockProducts = JSON.parse(readFileSync(join(currentDir, '../src/mock/products.json'), 'utf-8'));

    for (const product of mockProducts) {
        const productSlug = product.path.split('/').pop();
        const imagePath = join(currentDir, '../src/assets/products', productSlug);
        const images = await uploadImage(imagePath);

        const createdProduct = await prisma.product.create({
            data: {
                name: product.name,
                slug: productSlug,
                path: product.path,
                type: product.type as ProductType,
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
                                altText: p.images[0]?.altText || 'Product image'
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
            },
        });
        console.log(`Created product with slug: ${createdProduct.slug}`);
    }

    console.log("Done!");
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });