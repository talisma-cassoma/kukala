

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
    id: "fragrance",
    name: "Fragrance",
    required: true,
    options: [
      {
        id: "lavender",
        label: "Lavender",
        price: 0,
        available: true,
      },
      {
        id: "vanilla",
        label: "Vanilla",
        price: 2,
        available: true,
      },
      {
        id: "rose",
        label: "Rose",
        price: 4,
        available: false,
      },
    ],
  },

  {
    id: "bag-size",
    name: "Package Size",
    required: true,
    options: [
      {
        id: "small",
        label: "Small",
        price: 0,
        available: true,
      },
      {
        id: "medium",
        label: "Medium",
        price: 5,
        available: true,
      },
      {
        id: "large",
        label: "Large",
        price: 10,
        available: false,
      },
    ],
  },

  {
    id: "delivery",
    name: "Delivery",
    required: true,
    options: [
      {
        id: "normal",
        label: "2-3 days",
        price: 0,
        available: true,
      },
      {
        id: "express",
        label: "Same day",
        price: 15,
        available: true,
      },
    ],
  },

  {
    id: "gift",
    name: "Gift Wrap",
    options: [
      {
        id: "none",
        label: "No",
        price: 0,
        available: true,
      },
      {
        id: "premium",
        label: "Premium",
        price: 8,
        available: true,
      },
    ],
  },

  {
    id: "eco",
    name: "Eco Package",
    options: [
      {
        id: "no",
        label: "Standard",
        price: 0,
        available: true,
      },
      {
        id: "yes",
        label: "Eco",
        price: 3,
        available: true,
    },
],
},
];

export function VariantSelector({
  groups,
  selected,
  onChange,
}: ProductOptionsProps) {
  return (
    <div className="space-y-6">
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