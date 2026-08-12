import { ComboBoxes } from "./comboBoxes";
import { DiscountedBundles } from "./discountedBundles"
import { relative } from "node:path";
import type { ProductsType } from "@/use-cases/contracts/Cell"




export const Kits = ({ products }: { products: ProductsType }) => {
    // Desestruturação direta dos dados necessários vindos da API
    const { comboboxes, discountedBundles } = products
    //console.log("produtos: ", JSON.stringify(products))

    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1, 1fr)",
                gap: "1rem",
                justifyContent: "center"
            }}
        >
            <div className="flex flex-col w-full gap-12 justify-between">
                {/* <p>Page menos e leve mais</p> */}
                <div className="flex flex-col gap-8 w-full items-stretch">
                    {[comboboxes[0]].map((comboboxes, index) => {
                        return (
                            <div
                                className="flex-1 flex flex-col min-w-0 justify-center"
                                key={index}
                            >
                                <ComboBoxes cell={comboboxes} />
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="flex flex-col w-full gap-12 justify-between">
                <p>Page menos e leve mais</p>
                <div className="flex lg:flex-row gap-12 md:flex-wrap w-full items-stretch">
                    {discountedBundles.map((discountedBundle, index) => {

                        return (
                            <div
                                className="flex-col"
                                key={index}
                            >
                                <DiscountedBundles cell={discountedBundle} />
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

