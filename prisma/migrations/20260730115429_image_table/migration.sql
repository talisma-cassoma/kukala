/*
  Warnings:

  - The `status` column on the `Order` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `createdAt` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `variantId` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `body` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `defaultVariantId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `isBundle` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `nutritionJson` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `pageId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `relatedProductIds` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the `GridItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Page` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductImage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductVariant` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Section` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_GridItemToTopic` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `customerEmail` on table `Order` required. This step will fail if there are existing NULL values in that column.
  - Made the column `productId` on table `OrderItem` required. This step will fail if there are existing NULL values in that column.
  - Changed the type of `type` on the `Product` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."ProductType" AS ENUM ('COMBOBOX', 'RETAIL', 'DISCOUNTED');

-- CreateEnum
CREATE TYPE "public"."OrderStatus" AS ENUM ('PENDING', 'PAID', 'FULFILLED', 'CANCELLED');

-- DropForeignKey
ALTER TABLE "public"."GridItem" DROP CONSTRAINT "GridItem_pageId_fkey";

-- DropForeignKey
ALTER TABLE "public"."OrderItem" DROP CONSTRAINT "OrderItem_productId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Product" DROP CONSTRAINT "Product_defaultVariantId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Product" DROP CONSTRAINT "Product_pageId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ProductImage" DROP CONSTRAINT "ProductImage_productId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ProductImage" DROP CONSTRAINT "ProductImage_variantId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ProductVariant" DROP CONSTRAINT "ProductVariant_productId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Section" DROP CONSTRAINT "Section_pageId_fkey";

-- DropForeignKey
ALTER TABLE "public"."_GridItemToTopic" DROP CONSTRAINT "_GridItemToTopic_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_GridItemToTopic" DROP CONSTRAINT "_GridItemToTopic_B_fkey";

-- AlterTable
ALTER TABLE "public"."Order" DROP COLUMN "status",
ADD COLUMN     "status" "public"."OrderStatus" NOT NULL DEFAULT 'PENDING',
ALTER COLUMN "customerEmail" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."OrderItem" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
DROP COLUMN "variantId",
ALTER COLUMN "productId" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."Product" DROP COLUMN "body",
DROP COLUMN "defaultVariantId",
DROP COLUMN "isBundle",
DROP COLUMN "nutritionJson",
DROP COLUMN "pageId",
DROP COLUMN "relatedProductIds",
ADD COLUMN     "mainImageId" TEXT,
DROP COLUMN "type",
ADD COLUMN     "type" "public"."ProductType" NOT NULL,
ALTER COLUMN "published" SET DEFAULT false;

-- DropTable
DROP TABLE "public"."GridItem";

-- DropTable
DROP TABLE "public"."Page";

-- DropTable
DROP TABLE "public"."ProductImage";

-- DropTable
DROP TABLE "public"."ProductVariant";

-- DropTable
DROP TABLE "public"."Section";

-- DropTable
DROP TABLE "public"."_GridItemToTopic";

-- CreateTable
CREATE TABLE "public"."Paragraph" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "body" JSONB NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "productId" TEXT NOT NULL,

    CONSTRAINT "Paragraph_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Image" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "altText" TEXT,
    "key" TEXT,
    "productId" TEXT,
    "paragraphId" TEXT,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TableSection" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "productId" TEXT NOT NULL,

    CONSTRAINT "TableSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TableProperty" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "sectionId" TEXT NOT NULL,

    CONSTRAINT "TableProperty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ProductOptionGroup" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "productId" TEXT NOT NULL,

    CONSTRAINT "ProductOptionGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ProductOption" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "available" BOOLEAN NOT NULL DEFAULT true,
    "groupId" TEXT NOT NULL,

    CONSTRAINT "ProductOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."OrderItemOption" (
    "id" TEXT NOT NULL,
    "orderItemId" TEXT NOT NULL,
    "productOptionId" TEXT NOT NULL,
    "groupName" TEXT NOT NULL,
    "optionLabel" TEXT NOT NULL,
    "priceAtPurchase" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "OrderItemOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ProductRelationship" (
    "fromId" TEXT NOT NULL,
    "toId" TEXT NOT NULL,

    CONSTRAINT "ProductRelationship_pkey" PRIMARY KEY ("fromId","toId")
);

-- CreateTable
CREATE TABLE "public"."Admin" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Paragraph_productId_idx" ON "public"."Paragraph"("productId");

-- CreateIndex
CREATE INDEX "Image_productId_idx" ON "public"."Image"("productId");

-- CreateIndex
CREATE INDEX "Image_paragraphId_idx" ON "public"."Image"("paragraphId");

-- CreateIndex
CREATE INDEX "TableSection_productId_idx" ON "public"."TableSection"("productId");

-- CreateIndex
CREATE INDEX "TableProperty_sectionId_idx" ON "public"."TableProperty"("sectionId");

-- CreateIndex
CREATE INDEX "ProductOptionGroup_productId_idx" ON "public"."ProductOptionGroup"("productId");

-- CreateIndex
CREATE INDEX "ProductOption_groupId_idx" ON "public"."ProductOption"("groupId");

-- CreateIndex
CREATE INDEX "OrderItemOption_orderItemId_idx" ON "public"."OrderItemOption"("orderItemId");

-- CreateIndex
CREATE INDEX "OrderItemOption_productOptionId_idx" ON "public"."OrderItemOption"("productOptionId");

-- CreateIndex
CREATE UNIQUE INDEX "OrderItemOption_orderItemId_productOptionId_key" ON "public"."OrderItemOption"("orderItemId", "productOptionId");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "public"."Admin"("email");

-- CreateIndex
CREATE INDEX "OrderItem_orderId_idx" ON "public"."OrderItem"("orderId");

-- CreateIndex
CREATE INDEX "Product_slug_idx" ON "public"."Product"("slug");

-- CreateIndex
CREATE INDEX "Product_type_idx" ON "public"."Product"("type");

-- CreateIndex
CREATE INDEX "Topic_slug_idx" ON "public"."Topic"("slug");

-- AddForeignKey
ALTER TABLE "public"."Product" ADD CONSTRAINT "Product_mainImageId_fkey" FOREIGN KEY ("mainImageId") REFERENCES "public"."Image"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Paragraph" ADD CONSTRAINT "Paragraph_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Image" ADD CONSTRAINT "Image_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Image" ADD CONSTRAINT "Image_paragraphId_fkey" FOREIGN KEY ("paragraphId") REFERENCES "public"."Paragraph"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TableSection" ADD CONSTRAINT "TableSection_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TableProperty" ADD CONSTRAINT "TableProperty_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "public"."TableSection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProductOptionGroup" ADD CONSTRAINT "ProductOptionGroup_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProductOption" ADD CONSTRAINT "ProductOption_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "public"."ProductOptionGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OrderItem" ADD CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OrderItemOption" ADD CONSTRAINT "OrderItemOption_orderItemId_fkey" FOREIGN KEY ("orderItemId") REFERENCES "public"."OrderItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OrderItemOption" ADD CONSTRAINT "OrderItemOption_productOptionId_fkey" FOREIGN KEY ("productOptionId") REFERENCES "public"."ProductOption"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProductRelationship" ADD CONSTRAINT "ProductRelationship_fromId_fkey" FOREIGN KEY ("fromId") REFERENCES "public"."Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProductRelationship" ADD CONSTRAINT "ProductRelationship_toId_fkey" FOREIGN KEY ("toId") REFERENCES "public"."Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
