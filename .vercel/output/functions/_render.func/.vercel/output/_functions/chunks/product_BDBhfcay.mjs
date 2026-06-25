import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import { createElement, useState, useEffect } from 'react';
import { ContentTransformer, Image } from '@crystallize/reactjs-components';
import ReactPlayer from 'react-player';

const ProductBody = ({ body, table }) => {
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 my-10 lg:w-9/12 w-full mx-auto z-10", children: [
    body?.content?.paragraphs.map((paragraph, index) => /* @__PURE__ */ jsxs("div", { className: "flex flex-col justify-between", children: [
      /* @__PURE__ */ jsxs("div", { className: "my-3 text-text md:px-20", children: [
        paragraph.title && /* @__PURE__ */ jsx("h2", { className: "font-semibold text-2xl mb-4", children: paragraph.title?.text }),
        paragraph.body && /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
          ContentTransformer,
          {
            json: paragraph.body?.json
          }
        ) })
      ] }),
      paragraph.images && /* @__PURE__ */ jsx("div", { className: "my-5 mx-auto", children: paragraph?.images?.map((image, index2) => /* @__PURE__ */ createElement(
        Image,
        {
          ...image,
          sizes: "200px",
          className: "rounded-xl overflow-hidden",
          loading: "lazy",
          key: index2
        }
      )) }),
      paragraph.videos && paragraph.videos?.length > 0 && /* @__PURE__ */ jsx("div", { className: "my-5", children: /* @__PURE__ */ jsx(
        ReactPlayer,
        {
          controls: true,
          url: paragraph?.videos[0]?.playlists?.[1],
          width: "100%",
          height: "400px",
          light: paragraph?.videos && paragraph?.videos.length > 0 && paragraph?.videos[0].thumbnails && paragraph?.videos[0].thumbnails.length > 0 && paragraph?.videos[0].thumbnails[0].url,
          playing: true
        }
      ) })
    ] }, index)),
    table?.content?.sections.map((section, index) => /* @__PURE__ */ jsxs(
      "div",
      {
        className: "flex lg:flex-row flex-col justify-between text-text my-20",
        children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "font-bold text-2xl py-2", children: section?.title }),
            /* @__PURE__ */ jsx("p", { className: "italic", children: "per 50 g" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "lg:w-7/12 w-full", children: section.properties.map((property, index2) => /* @__PURE__ */ jsxs(
            "div",
            {
              className: "flex justify-between my-3 even:bg-grey px-5 py-2",
              children: [
                /* @__PURE__ */ jsx("p", { children: property.key }),
                /* @__PURE__ */ jsx("p", { children: property.value })
              ]
            },
            index2
          )) })
        ]
      },
      index
    ))
  ] });
};

function isEqual(a, b) {
  if (a === b) {
    return true;
  }
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) {
      return false;
    }
    for (let i = 0; i < a.length; i++) {
      if (!isEqual(a[i], b[i])) {
        return false;
      }
    }
    return true;
  }
  if (typeof a === "object" && typeof b === "object") {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) {
      return false;
    }
    for (const key of keysA) {
      if (!isEqual(a[key], b[key])) {
        return false;
      }
    }
    return true;
  }
  return false;
}
const getCurrencySymbol = (code, price) => {
  const symbol = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: code
  });
  return symbol.format(price);
};
const getDefaultPriceVariant = (variants) => {
  return variants?.find((variant) => variant.identifier === "default");
};
const variantToCartItem = (variant) => {
  const defaultPrice = getDefaultPriceVariant(variant.priceVariants || []);
  return {
    sku: variant.sku,
    name: variant.name,
    quantity: 1,
    price: defaultPrice?.price,
    image: variant.images?.[0].url,
    attributes: variant.attributes
  };
};

function reduceAttributes(variants) {
  return variants.reduce((acc, variant) => {
    const attrs = acc;
    variant.attributes.forEach(
      ({ attribute, value }) => {
        const currentAttribute = attrs[attribute];
        if (!currentAttribute) {
          attrs[attribute] = [value];
          return;
        }
        const valueExists = currentAttribute.find(
          (str) => str === value
        );
        if (!valueExists) {
          attrs[attribute].push(value);
        }
      }
    );
    return attrs;
  }, {});
}
function attributesToObject({ attributes }) {
  return Object.assign(
    {},
    ...attributes.map(
      ({ attribute, value }) => ({
        [attribute]: value
      })
    )
  );
}
const VariantSelector = ({
  variants,
  selectedVariant,
  onVariantChange
}) => {
  const attributes = reduceAttributes(variants);
  function onAttributeSelect({
    attribute,
    value,
    e
  }) {
    const selectedAttributes = attributesToObject(selectedVariant);
    selectedAttributes[attribute] = value;
    let variant = variants.find((variant2) => {
      if (isEqual(selectedAttributes, attributesToObject(variant2))) {
        return true;
      }
      return false;
    });
    if (variant) {
      onVariantChange(variant);
    }
  }
  return /* @__PURE__ */ jsx("div", { children: Object.keys(attributes).map((attribute) => {
    const attr = attributes[attribute];
    const selectedAttr = selectedVariant.attributes?.find(
      (a) => a.attribute === attribute
    );
    if (!selectedAttr) {
      return null;
    }
    return /* @__PURE__ */ jsxs("div", { className: "w-40", children: [
      /* @__PURE__ */ jsx("p", { className: "my-3 text-text font-semibold", children: attribute }),
      /* @__PURE__ */ jsx("div", { className: "flex justify-between mb-5", children: attr.map((value) => /* @__PURE__ */ jsx(
        "button",
        {
          onClick: (e) => onAttributeSelect({
            attribute,
            value,
            e
          }),
          type: "button",
          className: "bg-white drop-shadow-sm w-30 px-3 py-2 rounded-sm text-text font-semibold",
          style: {
            border: value === selectedAttr.value ? "3px solid #373567" : "3px solid transparent"
          },
          children: value
        },
        value
      )) })
    ] }, attribute);
  }) });
};

const RelatedProducts = ({
  related
}) => {
  return /* @__PURE__ */ jsx("div", { className: "flex w-full items-start flex-wrap gap-1", children: related?.content?.items.map((item, index) => /* @__PURE__ */ jsxs(
    "a",
    {
      href: item.path,
      className: "bg-primary px-4 py-3 rounded-xl border-2 border-grey  flex flex-col lg:bg-primary  lg:h-96 p-5 lg:w-[300px]  w-full",
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
          /* @__PURE__ */ jsx("div", { className: "flex gap-1", children: item.topics?.map((topic) => /* @__PURE__ */ jsx(
            "div",
            {
              className: "text-sm bg-grey px-2 py-1 rounded-2xl",
              children: topic.name
            },
            topic.name
          )) }),
          /* @__PURE__ */ jsxs("div", { children: [
            "$",
            item.defaultVariant?.price
          ] })
        ] }),
        /* @__PURE__ */ jsx(
          Image,
          {
            ...item.defaultVariant?.firstImage,
            sizes: "300px",
            loading: "lazy"
          }
        ),
        /* @__PURE__ */ jsx("h2", { className: "text-l text-center m-auto self-end", children: item.name })
      ]
    },
    index
  )) });
};

const Product = ({ product }) => {
  const [selectedVariant, setSelectedVariant] = useState(
    product?.variants?.[0]
  );
  const onVariantChange = (variant) => setSelectedVariant(variant);
  const defaultPrice = getDefaultPriceVariant(selectedVariant?.priceVariants);
  const [cart, setCart] = useState([]);
  const [buttonText, setButtonText] = useState("Add to Cart");
  const addToCart = (product2) => {
    setButtonText("Adding...");
    const newCart = [...cart, variantToCartItem(product2)];
    setCart(newCart);
    setButtonText("Added 🎉");
    setTimeout(() => setButtonText("Add to Cart"), 1e3);
  };
  useEffect(() => {
    const cart2 = localStorage.getItem("cart");
    if (cart2) {
      setCart(JSON.parse(cart2));
    }
  }, []);
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("div", { className: "flex lg:flex-row gap-2 w-full items-center flex-col", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col text-text w-[400px]", children: [
        /* @__PURE__ */ jsx("h1", { className: "font-extrabold text-5xl mb-3", children: product.name }),
        /* @__PURE__ */ jsx(
          ContentTransformer,
          {
            json: product?.summary?.content?.json
          }
        )
      ] }),
      /* @__PURE__ */ jsx(
        Image,
        {
          ...product.defaultVariant?.firstImage,
          sizes: "500px",
          className: "rounded-sm mx-auto"
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "lg:mb-0 mb-5", children: /* @__PURE__ */ jsx(
        VariantSelector,
        {
          variants: product.variants,
          selectedVariant,
          onVariantChange
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex z-10 justify-between lg:w-5/12 w-8/12 mx-auto bg-white p-5 text-text rounded-xl", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "font-semibold text-sm", children: "Total price" }),
        /* @__PURE__ */ jsx("p", { className: "font-bold text-lg", children: getCurrencySymbol(
          defaultPrice?.currency ?? "EUR",
          defaultPrice?.price ?? 0
        ) })
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          className: "bg-background2 px-4 rounded-xl",
          onClick: () => addToCart(selectedVariant),
          children: buttonText
        }
      )
    ] }),
    /* @__PURE__ */ jsx(ProductBody, { body: product.body, table: product.table }),
    /* @__PURE__ */ jsx("p", { className: "text-text mb-4 font-semibold", children: "Related do(u)nuts" }),
    /* @__PURE__ */ jsx(RelatedProducts, { related: product.related })
  ] });
};

export { Product as P };
