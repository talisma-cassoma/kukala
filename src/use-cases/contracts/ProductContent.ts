import type { Paragraph } from "./Paragraph";

export interface ProductOptionItem {
    id: string;
    label: string;
    price: number;
    available: boolean;
}

export interface ProductOptionGroup {
    id: string;
    name: string;
    required?: boolean;
    options: ProductOptionItem[];
}

export type ProductTable = {
    sections: {
        title: string;
        properties: {
            key: string;
            value: string;
        }[];
    }[];
};

export type ProductBodyType = {
    body: {
        paragraphs: Paragraph[];
    };
    table: ProductTable;
   
    productOptions?: ProductOptionGroup[];
};

