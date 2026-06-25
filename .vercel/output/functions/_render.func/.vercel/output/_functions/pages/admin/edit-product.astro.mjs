/* empty css                                           */
import { c as createComponent, d as renderHead, r as renderComponent, a as renderTemplate } from '../../chunks/astro/server_COnj2GrK.mjs';
import 'kleur/colors';
import { jsx, jsxs } from 'react/jsx-runtime';
import { useState } from 'react';
import { P as Product } from '../../chunks/product_BDBhfcay.mjs';
export { renderers } from '../../renderers.mjs';

function ProductPreview({ productData }) {
  return /* @__PURE__ */ jsx("div", { className: "lg:container mx-auto w-full lg:px-0 px-5", children: productData ? /* @__PURE__ */ jsx(Product, { product: productData.product }) : /* @__PURE__ */ jsx("p", { children: "Product not found" }) });
}

const createEmptyProduct = () => ({
  pageTitle: "Fresh product draft",
  pageDescription: "Create a rich product experience with flexible content sections.",
  product: {
    id: "product-draft",
    __typename: "Product",
    name: "Chocolate Dream",
    path: "/shop/chocolate-dream",
    topics: [{ name: "new" }, { name: "limited-edition" }],
    bundle: { content: null },
    summary: {
      content: {
        json: [
          {
            kind: "block",
            type: "paragraph",
            metadata: {},
            children: [
              {
                kind: "inline",
                metadata: {},
                textContent: "A rich chocolate experience with a soft crumb and a glossy finish."
              }
            ]
          }
        ]
      }
    },
    body: {
      content: {
        paragraphs: [
          {
            title: { text: "Our signature donut" },
            body: {
              json: [
                {
                  kind: "block",
                  type: "paragraph",
                  metadata: {},
                  children: [
                    {
                      kind: "inline",
                      metadata: {},
                      textContent: "Bake fresh, glaze generously, and serve with a smile."
                    }
                  ]
                }
              ]
            },
            images: []
          }
        ]
      }
    },
    table: {
      content: {
        sections: [
          {
            title: "Nutrition",
            properties: [
              { key: "Calories", value: "143 kj" },
              { key: "Protein", value: "2.4 g" }
            ]
          }
        ]
      }
    },
    related: {
      content: {
        items: [
          {
            id: "related-product-1",
            __typename: "Product",
            name: "Strawberry blast",
            path: "/shop/strawberry-blast",
            topics: [{ name: "limited-edition" }, { name: "glazed" }],
            bundle: { content: null },
            defaultVariant: {
              firstImage: {
                url: "https://crystallize.com",
                altText: "Strawberry donut",
                variants: []
              },
              priceVariant: { price: 6, currency: "USD" }
            }
          }
        ]
      }
    },
    defaultVariant: {
      firstImage: {
        url: "https://crystallize.com",
        altText: "Chocolate donut",
        variants: []
      },
      priceVariant: { price: 8, currency: "USD" }
    },
    variants: [
      {
        id: "variant-1",
        name: "Chocolate Dream",
        sku: "chocolate-dream-1",
        price: 8,
        priceVariants: [
          { identifier: "default", name: "Default", price: 8, currency: "USD" }
        ],
        stock: 37,
        isDefault: true,
        attributes: [{ attribute: "Donut size", value: "M" }],
        images: []
      }
    ]
  }
});
const buildParagraphJson = (text) => [
  {
    kind: "block",
    type: "paragraph",
    metadata: {},
    children: [
      {
        kind: "inline",
        metadata: {},
        textContent: text
      }
    ]
  }
];
const SectionCard = ({ title, description, children }) => /* @__PURE__ */ jsxs("section", { className: "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm", children: [
  /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
    /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-slate-900", children: title }),
    description ? /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-slate-500", children: description }) : null
  ] }),
  /* @__PURE__ */ jsx("div", { className: "space-y-4", children })
] });
const TextField = ({ label, value, onChange, placeholder, required = false, type = "text", min, step }) => /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
  /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-slate-700", children: label }),
  /* @__PURE__ */ jsx(
    "input",
    {
      type,
      value,
      onChange: (event) => onChange(event.target.value),
      placeholder,
      min,
      step,
      required,
      className: "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
    }
  )
] });
const TextAreaField = ({ label, value, onChange, placeholder, rows = 4 }) => /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
  /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-slate-700", children: label }),
  /* @__PURE__ */ jsx(
    "textarea",
    {
      value,
      onChange: (event) => onChange(event.target.value),
      placeholder,
      rows,
      className: "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
    }
  )
] });
function ProductRegistrationWizard() {
  const [productData, setProductData] = useState(createEmptyProduct());
  const [mainImageFile, setMainImageFile] = useState(null);
  const [paragraphImageFiles, setParagraphImageFiles] = useState({});
  const getValue = (path, source = productData) => path.split(".").reduce((accumulator, key) => accumulator?.[key], source);
  const setValue = (path, value) => {
    setProductData((previous) => {
      const next = structuredClone(previous);
      const segments = path.split(".");
      let cursor = next;
      segments.slice(0, -1).forEach((segment) => {
        if (cursor[segment] === void 0 || cursor[segment] === null) {
          cursor[segment] = {};
        }
        cursor = cursor[segment];
      });
      cursor[segments[segments.length - 1]] = value;
      return next;
    });
  };
  const getParagraphTitleText = (paragraph) => typeof paragraph.title === "string" ? paragraph.title : paragraph.title?.text ?? "";
  const updateSummary = (value) => {
    setValue("product.summary.content.json", buildParagraphJson(value));
  };
  const handleMainImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    const previewUrl = URL.createObjectURL(file);
    setMainImageFile(file);
    setValue("product.defaultVariant.firstImage", {
      url: previewUrl,
      altText: file.name,
      variants: []
    });
  };
  const handleParagraphImageChange = (paragraphIndex, event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    const previewUrl = URL.createObjectURL(file);
    setParagraphImageFiles((previous) => ({ ...previous, [paragraphIndex]: file }));
    setValue(`product.body.content.paragraphs.${paragraphIndex}.images`, [
      {
        url: previewUrl,
        altText: file.name,
        variants: []
      }
    ]);
  };
  const addParagraph = () => {
    const paragraphs = getValue("product.body.content.paragraphs");
    setValue("product.body.content.paragraphs", [
      ...paragraphs,
      {
        title: { text: "New section" },
        body: { json: buildParagraphJson("Describe this section.") },
        images: []
      }
    ]);
  };
  const removeParagraph = (index) => {
    const paragraphs = getValue("product.body.content.paragraphs");
    setValue("product.body.content.paragraphs", paragraphs.filter((_, paragraphIndex) => paragraphIndex !== index));
  };
  const addNutritionRow = () => {
    const sections = getValue("product.table.content.sections");
    const nextSections = [...sections];
    nextSections[0] = {
      ...nextSections[0],
      properties: [...nextSections[0].properties, { key: "New field", value: "Value" }]
    };
    setValue("product.table.content.sections", nextSections);
  };
  const removeNutritionRow = (index) => {
    const sections = getValue("product.table.content.sections");
    const nextSections = [...sections];
    nextSections[0] = {
      ...nextSections[0],
      properties: nextSections[0].properties.filter((_, propertyIndex) => propertyIndex !== index)
    };
    setValue("product.table.content.sections", nextSections);
  };
  const addVariant = () => {
    const variants = getValue("product.variants");
    const nextVariant = {
      id: `variant-${variants.length + 1}`,
      name: "New variant",
      sku: `new-variant-${variants.length + 1}`,
      price: 0,
      priceVariants: [{ identifier: "default", name: "Default", price: 0, currency: "USD" }],
      stock: 0,
      isDefault: false,
      attributes: [{ attribute: "Size", value: "M" }],
      images: []
    };
    setValue("product.variants", [...variants, nextVariant]);
  };
  const removeVariant = (index) => {
    const variants = getValue("product.variants");
    setValue("product.variants", variants.filter((_, variantIndex) => variantIndex !== index));
  };
  const addRelatedProduct = () => {
    const relatedItems = getValue("product.related.content.items");
    setValue("product.related.content.items", [
      ...relatedItems,
      {
        id: `related-${relatedItems.length + 1}`,
        __typename: "Product",
        name: "New related product",
        path: "/shop/new-related-product",
        topics: [{ name: "trending" }],
        bundle: { content: null },
        defaultVariant: {
          firstImage: null,
          priceVariant: { price: 0, currency: "USD" }
        }
      }
    ]);
  };
  const removeRelatedProduct = (index) => {
    const relatedItems = getValue("product.related.content.items");
    setValue("product.related.content.items", relatedItems.filter((_, relatedIndex) => relatedIndex !== index));
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Ready to save product:", JSON.stringify(productData, null, 2));
  };
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-slate-50 px-4 py-8 text-slate-900", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.1fr_0.9fr]", children: [
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [
      /* @__PURE__ */ jsxs(
        SectionCard,
        {
          title: "General information",
          description: "Set the core product metadata and storefront fields.",
          children: [
            /* @__PURE__ */ jsx(
              TextField,
              {
                label: "Product name",
                value: getValue("product.name"),
                onChange: (value) => setValue("product.name", value),
                placeholder: "Chocolate Dream",
                required: true
              }
            ),
            /* @__PURE__ */ jsx(
              TextField,
              {
                label: "Path / slug",
                value: getValue("product.path"),
                onChange: (value) => setValue("product.path", value),
                placeholder: "/shop/chocolate-dream",
                required: true
              }
            ),
            /* @__PURE__ */ jsx(
              TextField,
              {
                label: "Page title",
                value: productData.pageTitle,
                onChange: (value) => setValue("pageTitle", value),
                placeholder: "Chocolate Dream"
              }
            ),
            /* @__PURE__ */ jsx(
              TextField,
              {
                label: "Page description",
                value: productData.pageDescription,
                onChange: (value) => setValue("pageDescription", value),
                placeholder: "A rich chocolate experience for your storefront."
              }
            ),
            /* @__PURE__ */ jsx(
              TextField,
              {
                label: "Topics",
                value: getValue("product.topics").map((topic) => topic.name).join(", "),
                onChange: (value) => setValue("product.topics", value.split(",").map((topic) => topic.trim()).filter(Boolean).map((name) => ({ name }))),
                placeholder: "new, limited-edition"
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        SectionCard,
        {
          title: "Image",
          description: "Upload a main image and keep the file object separate from the preview payload.",
          children: [
            /* @__PURE__ */ jsxs("label", { className: "block space-y-2", children: [
              /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-slate-700", children: "Main image" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "file",
                  accept: "image/*",
                  onChange: handleMainImageChange,
                  className: "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                }
              )
            ] }),
            mainImageFile ? /* @__PURE__ */ jsxs("p", { className: "text-sm text-slate-500", children: [
              "Selected file: ",
              mainImageFile.name
            ] }) : null,
            getValue("product.defaultVariant.firstImage") ? /* @__PURE__ */ jsx(
              "img",
              {
                src: getValue("product.defaultVariant.firstImage")?.url,
                alt: getValue("product.defaultVariant.firstImage")?.altText ?? "Product preview",
                className: "h-48 w-full rounded-xl object-cover"
              }
            ) : null
          ]
        }
      ),
      /* @__PURE__ */ jsx(
        SectionCard,
        {
          title: "Summary",
          description: "The summary is converted to the nested JSON shape expected by the renderer.",
          children: /* @__PURE__ */ jsx(
            TextAreaField,
            {
              label: "Summary text",
              value: getValue("product.summary.content.json")[0]?.children?.[0]?.textContent ?? "",
              onChange: (value) => updateSummary(value),
              placeholder: "Describe the product in a short, polished way.",
              rows: 6
            }
          )
        }
      ),
      /* @__PURE__ */ jsxs(
        SectionCard,
        {
          title: "Body",
          description: "Compose paragraphs, update their text, and add images per section.",
          children: [
            getValue("product.body.content.paragraphs").map((paragraph, index) => /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-slate-200 p-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "mb-3 flex items-center justify-between", children: [
                /* @__PURE__ */ jsxs("h4", { className: "font-medium text-slate-900", children: [
                  "Paragraph ",
                  index + 1
                ] }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => removeParagraph(index),
                    className: "text-sm text-rose-600 hover:text-rose-700",
                    children: "Remove"
                  }
                )
              ] }),
              /* @__PURE__ */ jsx(
                TextField,
                {
                  label: "Title",
                  value: getParagraphTitleText(paragraph),
                  onChange: (value) => setValue(`product.body.content.paragraphs.${index}.title`, { text: value })
                }
              ),
              /* @__PURE__ */ jsx(
                TextAreaField,
                {
                  label: "Body",
                  value: paragraph.body.json[0]?.children?.[0]?.textContent ?? "",
                  onChange: (value) => setValue(`product.body.content.paragraphs.${index}.body.json`, buildParagraphJson(value)),
                  rows: 5
                }
              ),
              /* @__PURE__ */ jsxs("label", { className: "block space-y-2", children: [
                /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-slate-700", children: "Paragraph image" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "file",
                    accept: "image/*",
                    onChange: (event) => handleParagraphImageChange(index, event),
                    className: "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  }
                )
              ] }),
              paragraphImageFiles[index] ? /* @__PURE__ */ jsxs("p", { className: "text-sm text-slate-500", children: [
                "Selected file: ",
                paragraphImageFiles[index]?.name
              ] }) : null,
              paragraph.images[0] ? /* @__PURE__ */ jsx("img", { src: paragraph.images[0].url, alt: paragraph.images[0].altText, className: "mt-3 h-40 w-full rounded-lg object-cover" }) : null
            ] }, `${getParagraphTitleText(paragraph)}-${index}`)),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: addParagraph,
                className: "rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100",
                children: "Add paragraph"
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        SectionCard,
        {
          title: "Nutrition",
          description: "Maintain the nutrition table as dynamic key/value rows.",
          children: [
            getValue("product.table.content.sections")[0]?.properties.map((property, index) => /* @__PURE__ */ jsxs("div", { className: "grid gap-3 md:grid-cols-[1fr_1fr_auto]", children: [
              /* @__PURE__ */ jsx(
                TextField,
                {
                  label: "Key",
                  value: property.key,
                  onChange: (value) => setValue(`product.table.content.sections.0.properties.${index}.key`, value)
                }
              ),
              /* @__PURE__ */ jsx(
                TextField,
                {
                  label: "Value",
                  value: property.value,
                  onChange: (value) => setValue(`product.table.content.sections.0.properties.${index}.value`, value)
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => removeNutritionRow(index),
                  className: "self-end rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-600",
                  children: "Remove"
                }
              )
            ] }, `${property.key}-${index}`)),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: addNutritionRow,
                className: "rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100",
                children: "Add row"
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        SectionCard,
        {
          title: "Variants",
          description: "Manage price, stock, and attributes in a dynamic array of variants.",
          children: [
            getValue("product.variants").map((variant, index) => /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-slate-200 p-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "mb-3 flex items-center justify-between", children: [
                /* @__PURE__ */ jsxs("h4", { className: "font-medium text-slate-900", children: [
                  "Variant ",
                  index + 1
                ] }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => removeVariant(index),
                    className: "text-sm text-rose-600 hover:text-rose-700",
                    children: "Remove"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid gap-3 md:grid-cols-2", children: [
                /* @__PURE__ */ jsx(TextField, { label: "Name", value: variant.name, onChange: (value) => setValue(`product.variants.${index}.name`, value) }),
                /* @__PURE__ */ jsx(TextField, { label: "SKU", value: variant.sku, onChange: (value) => setValue(`product.variants.${index}.sku`, value) }),
                /* @__PURE__ */ jsx(TextField, { label: "Price", value: String(variant.price), onChange: (value) => setValue(`product.variants.${index}.price`, Number(value)), type: "number", min: "0", step: "0.01" }),
                /* @__PURE__ */ jsx(TextField, { label: "Stock", value: String(variant.stock), onChange: (value) => setValue(`product.variants.${index}.stock`, Number(value)), type: "number", min: "0", step: "1" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "mt-3 space-y-2", children: [
                /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-slate-700", children: "Attributes" }),
                variant.attributes.map((attribute, attributeIndex) => /* @__PURE__ */ jsxs("div", { className: "grid gap-3 md:grid-cols-2", children: [
                  /* @__PURE__ */ jsx(
                    TextField,
                    {
                      label: "Attribute",
                      value: attribute.attribute,
                      onChange: (value) => setValue(`product.variants.${index}.attributes.${attributeIndex}.attribute`, value)
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    TextField,
                    {
                      label: "Value",
                      value: attribute.value,
                      onChange: (value) => setValue(`product.variants.${index}.attributes.${attributeIndex}.value`, value)
                    }
                  )
                ] }, `${attribute.attribute}-${attributeIndex}`))
              ] })
            ] }, `${variant.sku}-${index}`)),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: addVariant,
                className: "rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100",
                children: "Add variant"
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        SectionCard,
        {
          title: "Related products",
          description: "List products that should appear alongside this product in the storefront.",
          children: [
            getValue("product.related.content.items").map((item, index) => /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-slate-200 p-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "mb-3 flex items-center justify-between", children: [
                /* @__PURE__ */ jsxs("h4", { className: "font-medium text-slate-900", children: [
                  "Related product ",
                  index + 1
                ] }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => removeRelatedProduct(index),
                    className: "text-sm text-rose-600 hover:text-rose-700",
                    children: "Remove"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid gap-3 md:grid-cols-2", children: [
                /* @__PURE__ */ jsx(
                  TextField,
                  {
                    label: "Name",
                    value: item.name,
                    onChange: (value) => setValue(`product.related.content.items.${index}.name`, value)
                  }
                ),
                /* @__PURE__ */ jsx(
                  TextField,
                  {
                    label: "Path",
                    value: item.path,
                    onChange: (value) => setValue(`product.related.content.items.${index}.path`, value)
                  }
                )
              ] })
            ] }, `${item.name}-${index}`)),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: addRelatedProduct,
                className: "rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100",
                children: "Add related product"
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "submit",
          className: "w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700",
          children: "Generate final JSON"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("aside", { className: "space-y-6", children: [
      /* @__PURE__ */ jsx(SectionCard, { title: "Live preview", description: "The preview renders from the same product object used for submission.", children: /* @__PURE__ */ jsx("div", { className: "rounded-2xl border border-slate-200 bg-slate-50 p-4", children: /* @__PURE__ */ jsx(ProductPreview, { productData }) }) }),
      /* @__PURE__ */ jsx(SectionCard, { title: "Final JSON payload", description: "This object is ready to save to your database.", children: /* @__PURE__ */ jsx("pre", { className: "max-h-[32rem] overflow-auto whitespace-pre-wrap break-words rounded-xl bg-slate-950 p-4 text-xs text-slate-100", children: JSON.stringify(productData, null, 2) }) })
    ] })
  ] }) });
}

const $$EditProduct = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`<html lang="en"> <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Edit product</title>${renderHead()}</head> <body> ${renderComponent($$result, "ProductRegistrationWizard", ProductRegistrationWizard, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/talisma/github-projects/kukala/src/components/ProductRegistrationWizard", "client:component-export": "ProductRegistrationWizard" })} </body></html>`;
}, "/Users/talisma/github-projects/kukala/src/pages/admin/edit-product.astro", void 0);

const $$file = "/Users/talisma/github-projects/kukala/src/pages/admin/edit-product.astro";
const $$url = "/admin/edit-product";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$EditProduct,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
