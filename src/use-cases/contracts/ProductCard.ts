import type { Image } from "./Image";

export type ProductType = {
    id?: string;
    __typename?: string;
    name: string;
    path: string;
    topics: { name: string }[];
    bundle?: {
        content?: {
            value?: boolean;
        } | null;
    };
    image: Image;
    price: number;
};

