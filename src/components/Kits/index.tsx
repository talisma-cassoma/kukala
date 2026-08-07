import { ComboBoxes } from "./comboBoxes";
import { DiscountedBundles } from "./discountedBundles"
import { relative } from "node:path";
import type {ProductsType} from "@/use-cases/contracts/Cell"




export const Kits = ({ products }: { products: ProductsType }) => {
    // Desestruturação direta dos dados necessários vindos da API
    const { comboboxes, discountedBundles } = products
    //console.log("produtos: ", JSON.stringify(products))

    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "repeat(3,1, 1fr)",
                gap: "1rem",
                justifyContent: "center"
            }}
        >
            <ComboBoxes cell={comboboxes[0]} />XX
            <div className="flex gap-2 max-w-216 justify-between">
                {discountedBundles.map((discountedBundle, index) => {

                    return (
                        <div
                            className="flex gap-2 w-full"
                            key={index}
                        >
                            <DiscountedBundles cell={discountedBundle} />
                        </div>
                    );
                })}
            </div>


        </div>
    );
};

