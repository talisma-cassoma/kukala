import { GridItem } from "@/components/Kits/grid-item";

type Topic = {
    name: string;
};

type Image = {
    url: string;
    altText: string;
    variants: unknown[];
};

type Variant = {
    images: Image[];
    price: number;
};

type ProductItem = {
    name: string;
    path: string;
    topics: Topic[];
    variants: Variant[];
};

type GridColumn = {
    layout: {
        rowspan: number;
        colspan: number;
    };
    item: ProductItem;
};

type GridRow = {
    columns: GridColumn[];
};

type GridDefinition = {
    rows: GridRow[];
};

export type GridData = {
    content: {
        grids: GridDefinition[];
    };
};

export const Kits = ({ grid }: { grid: { content: { products: any[] } } }) => {
    // Desestruturação direta dos dados necessários vindos da API
    const { products = [] } = grid.content;

    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "1rem",
            }}
        >
            {products.map((product, index) => {
                // Decisão Exclusiva do Frontend: o primeiro elemento é o destaque
                const isFeatured = index === 0;

                // Criamos o objeto virtual apenas para manter o GridItem antigo funcionando por enquanto
                const virtualCell = {
                    item: product,
                    layout: {
                        colspan: isFeatured ? 3 : 1,
                        rowspan: 1
                    }
                };

                return (
                    <div
                        key={index}
                        style={{
                            gridColumn: `span ${virtualCell.layout.colspan}`,
                            gridRow: `span ${virtualCell.layout.rowspan}`,
                        }}
                    >
                        <GridItem cell={virtualCell} />
                    </div>
                );
            })}
        </div>
    );
};

