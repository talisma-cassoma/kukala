import { ComboBoxes } from "./comboBoxes";
import { DiscountedBundles } from "./discountedBundles";
import type { ProductsType } from "@/use-cases/contracts/Cell";

export const Kits = ({ products }: { products?: ProductsType | null }) => {
    const { comboboxes = [], discountedBundles = [] } = products || {};

    if ((!comboboxes || comboboxes.length === 0) && (!discountedBundles || discountedBundles.length === 0)) {
        return null;
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 justify-center mb-12">
            {comboboxes && comboboxes.length > 0 && (
                <div className="flex flex-col w-full gap-8 justify-between">
                    <div className="flex flex-col gap-8 w-full items-stretch">
                        {comboboxes.slice(0, 1).map((combobox, index) => (
                            <div
                                className="flex-1 flex flex-col min-w-0 justify-center"
                                key={combobox?.id || index}
                            >
                                <ComboBoxes cell={combobox} />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {discountedBundles && discountedBundles.length > 0 && (
                <div className="flex flex-col w-full gap-6 justify-between">
                    <p className="text-xl font-bold text-text">Payez moins et obtenez plus</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full items-stretch">
                        {discountedBundles.map((discountedBundle, index) => (
                            <div
                                className="flex flex-col"
                                key={discountedBundle?.id || index}
                            >
                                <DiscountedBundles cell={discountedBundle} />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
