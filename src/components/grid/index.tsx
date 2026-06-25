import { GridItem } from "@/components/grid/grid-item";

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

export const Grid = ({ grid }: { grid: GridData }) => {
    const currentGrid = grid.content.grids[0];

    const cells =
        currentGrid?.rows.flatMap((row) => row.columns) ?? [];

    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "1rem",
            }}
        >
            {cells.map((cell, index) => (
                <div
                    key={index}
                    style={{
                        gridColumn: `span ${cell.layout.colspan}`,
                        gridRow: `span ${cell.layout.rowspan}`,
                    }}
                >
                    <GridItem cell={cell} />
                </div>
            ))}
        </div>
    );
};