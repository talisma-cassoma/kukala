import type { ProductTable } from './ProductContent';
import type { Paragraph } from './Paragraph';
import type { RelatedItem } from './RelatedItem';
import type { ProductType } from "@/use-cases/contracts/ProductCard";


export type Product = ProductType & {
    related: { items: RelatedItem[] };
    table: ProductTable;
    body: { paragraphs: Paragraph[] };
    summary:string;
};
