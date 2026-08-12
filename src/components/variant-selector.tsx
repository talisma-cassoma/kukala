

import type { ProductOptionGroup, ProductOptionItem } from "@/use-cases/contracts/ProductContent";
import clsx from "clsx";

export interface SelectedOptions {
  [groupId: string]: string;
}

export interface ProductOptionsProps {
  groups: ProductOptionGroup[];
  selected: SelectedOptions;
  onChange: (
    groupId: string,
    option: ProductOptionItem
  ) => void;
}
export const productOptions: ProductOptionGroup[] = [
  {
    id: "Volume",
    name: "Volume",
    required: true,
    options: [
      {
        id: "100ml",
        label: "100ml",
        price: 0,
        available: true,
      },
      {
        id: "50ml",
        label: "50ml",
        price: 2,
        available: false,
      },
    ],
  },

  {
    id: "delivery",
    name: "delivery",
    required: true,
    options: [
      {
        id: "in-store",
        label: "in-store",
        price: 0,
        available: true,
      },
      {
        id: "home-delivery",
        label: "home",
        price: 5,
        available: true,
      },
    ],
  }
];

export function VariantSelector({
  groups,
  selected,
  onChange,
}: ProductOptionsProps) {
  return (
    <div className="space-y-6 max-w-100 min-w-60">
      {groups.map((group) => (
        <div key={group.id}>
          <p className="mb-3 font-semibold text-text">
            {group.name}
          </p>

          <div className="flex flex-wrap gap-3">
            {group.options.map((option) => {
              const active =
                selected[group.id] === option.id;

              return (
                <button
                  key={option.id}
                  type="button"
                  disabled={!option.available}
                  onClick={() =>
                    onChange(group.id, option)
                  }
                  className={clsx(
                    "rounded-md border px-4 py-2 transition",
                    active
                      ? "border-[#373567] bg-white"
                      : "border-transparent bg-white",
                    !option.available &&
                      "cursor-not-allowed opacity-40"
                  )}
                >
                  <div className="font-medium">
                    {option.label}
                  </div>

                  {option.price > 0 && (
                    <div className="text-xs text-gray-500">
                      +${option.price}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}