import { t as fetchFrontPage } from "./frontpage_VQDErFNl.mjs";
import { n as cart, t as addItemToCart } from "./cartStore_jGT4BXup.mjs";
import clsx$1 from "clsx";
import { useEffect, useState } from "react";
import { useStore } from "@nanostores/react";
import "@crystallize/reactjs-components";
import ReactPlayer from "react-player";
import { Fragment as Fragment$1, jsx, jsxs } from "react/jsx-runtime";
//#region src/components/product-body.tsx
var ProductBody = ({ body, table }) => {
	return /* @__PURE__ */ jsxs("div", {
		className: "flex flex-col gap-3 my-10 lg:w-9/12 w-full mx-auto z-10",
		children: [body?.paragraphs.map((paragraph, index) => /* @__PURE__ */ jsxs("div", {
			className: "flex flex-col justify-between",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "my-3 text-text md:px-20",
					children: [paragraph.title && /* @__PURE__ */ jsx("h2", {
						className: "font-semibold text-2xl mb-4",
						children: paragraph.title?.text
					}), /* @__PURE__ */ jsx("p", { children: paragraph.text })]
				}),
				paragraph.images && /* @__PURE__ */ jsx("div", {
					className: "my-5 mx-auto",
					children: paragraph?.images?.map((image, index) => /* @__PURE__ */ jsx("img", {
						src: image.url,
						alt: image.altText,
						sizes: "200px",
						className: "rounded-xl overflow-hidden aspect-448/404 m-10 w-180",
						loading: "lazy"
					}))
				}),
				paragraph.videos && paragraph.videos?.length > 0 && /* @__PURE__ */ jsx("div", {
					className: "my-5",
					children: /* @__PURE__ */ jsx(ReactPlayer, {
						controls: true,
						url: paragraph?.videos[0]?.playlists?.[1],
						width: "100%",
						height: "400px",
						light: paragraph?.videos && paragraph?.videos.length > 0 && paragraph?.videos[0].thumbnails && paragraph?.videos[0].thumbnails.length > 0 && paragraph?.videos[0].thumbnails[0].url,
						playing: true
					})
				})
			]
		}, index)), table?.sections.map((section, index) => /* @__PURE__ */ jsxs("div", {
			className: "flex lg:flex-row flex-col justify-between text-text my-20",
			children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
				className: "font-bold text-2xl py-2",
				children: section?.title
			}), /* @__PURE__ */ jsx("p", {
				className: "italic",
				children: "per 50 g"
			})] }), /* @__PURE__ */ jsx("div", {
				className: "lg:w-7/12 w-full",
				children: section.properties.map((property, index) => /* @__PURE__ */ jsxs("div", {
					className: "flex justify-between my-3 even:bg-grey px-5 py-2",
					children: [/* @__PURE__ */ jsx("p", { children: property.key }), /* @__PURE__ */ jsx("p", { children: property.value })]
				}, index))
			})]
		}, index))]
	});
};
//#endregion
//#region src/components/variant-selector.tsx
var productOptions = [{
	id: "Volume",
	name: "Volume",
	required: true,
	options: [{
		id: "100ml",
		label: "100ml",
		price: 0,
		available: true
	}, {
		id: "50ml",
		label: "50ml",
		price: 2,
		available: false
	}]
}, {
	id: "delivery",
	name: "delivery",
	required: true,
	options: [{
		id: "in-store",
		label: "in-store",
		price: 0,
		available: true
	}, {
		id: "home-delivery",
		label: "home",
		price: 5,
		available: true
	}]
}];
function VariantSelector({ groups, selected, onChange }) {
	return /* @__PURE__ */ jsx("div", {
		className: "space-y-6 max-w-100 min-w-60",
		children: groups.map((group) => /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
			className: "mb-3 font-semibold text-text",
			children: group.name
		}), /* @__PURE__ */ jsx("div", {
			className: "flex flex-wrap gap-3",
			children: group.options.map((option) => {
				const active = selected[group.id] === option.id;
				return /* @__PURE__ */ jsxs("button", {
					type: "button",
					disabled: !option.available,
					onClick: () => onChange(group.id, option),
					className: clsx$1("rounded-md border px-4 py-2 transition", active ? "border-[#373567] bg-white" : "border-transparent bg-white", !option.available && "cursor-not-allowed opacity-40"),
					children: [/* @__PURE__ */ jsx("div", {
						className: "font-medium",
						children: option.label
					}), option.price > 0 && /* @__PURE__ */ jsxs("div", {
						className: "text-xs text-gray-500",
						children: ["+$", option.price]
					})]
				}, option.id);
			})
		})] }, group.id))
	});
}
//#endregion
//#region src/components/related-products.tsx
var RelatedProducts = () => {
	const [catalog, setCatalog] = useState(null);
	useEffect(() => {
		const loadData = async () => {
			const data = await fetchFrontPage(window.location.origin);
			setCatalog(data);
		};
		loadData();
	}, []);
	if (!catalog) return /* @__PURE__ */ jsx("div", { children: "Loading related products..." });
	const allProducts = catalog.retailProducts;
	return /* @__PURE__ */ jsx("div", {
		className: "flex flex-row justify-around w-full max-w-100 h-fit items-start gap-2",
		children: allProducts.map((item, index) => /* @__PURE__ */ jsxs("a", {
			href: item.path,
			className: "bg-primary px-4 py-3 rounded-xl border-2 border-grey  flex flex-col",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "flex justify-between",
					children: [/* @__PURE__ */ jsx("div", {
						className: "flex gap-1",
						children: item.topics?.map((topic) => /* @__PURE__ */ jsx("div", {
							className: "text-sm bg-grey px-2 py-1 rounded-2xl",
							children: topic.name
						}, topic.name))
					}), /* @__PURE__ */ jsxs("div", { children: ["$", item.price] })]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "flex justify-center items-center h-64 w-56 rounded-xl overflow-hidden box-border",
					children: /* @__PURE__ */ jsx("img", {
						src: item.image?.url,
						alt: item.image?.altText,
						className: "w-full h-full object-contain",
						loading: "lazy"
					})
				}),
				/* @__PURE__ */ jsx("h2", {
					className: "text-l text-center m-auto self-end truncate",
					children: item.name
				})
			]
		}, index))
	});
};
//#endregion
//#region src/components/product.tsx
var ProductView = ({ product }) => {
	const [selectedVariant, setSelectedVariant] = useState(product);
	const [selectedOptions, setSelectedOptions] = useState({
		fragrance: "lavender",
		"bag-size": "small",
		delivery: "normal",
		gift: "none",
		eco: "no"
	});
	const defaultPrice = product.price;
	useStore(cart);
	const [buttonText, setButtonText] = useState("Add to Cart");
	const handleAddToCart = () => {
		setButtonText("Adding...");
		const cartItem = {
			productId: product.id,
			sku: product.name,
			name: product.name,
			price: selectedVariant.price,
			quantity: 1,
			imageUrl: product.image?.url
		};
		addItemToCart(cartItem);
		setButtonText("Added 🎉");
		setTimeout(() => setButtonText("Add to Cart"), 1e3);
	};
	return /* @__PURE__ */ jsxs(Fragment$1, { children: [
		/* @__PURE__ */ jsxs("div", {
			className: "flex lg:flex-row gap-2 w-full items-center flex-col",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "flex flex-col text-text w-100",
					children: [/* @__PURE__ */ jsx("h1", {
						className: "font-extrabold text-5xl mb-3",
						children: product.name
					}), /* @__PURE__ */ jsx("p", { children: product?.summary })]
				}),
				/* @__PURE__ */ jsx("figure", {
					className: "rounded-sm overflow-hidden mx-auto",
					children: /* @__PURE__ */ jsx("img", {
						src: product.image?.url,
						alt: product.image?.altText,
						loading: "lazy",
						className: "w-88 aspect-448/404 object-contain"
					})
				}),
				/* @__PURE__ */ jsx("div", {
					className: "lg:mb-0 mb-5",
					children: /* @__PURE__ */ jsx(VariantSelector, {
						groups: productOptions,
						selected: selectedOptions,
						onChange: (groupId, option) => {
							setSelectedOptions((prev) => ({
								...prev,
								[groupId]: option.id
							}));
						}
					})
				})
			]
		}),
		/* @__PURE__ */ jsxs("div", {
			className: "flex z-10 justify-between lg:w-5/12 w-8/12 mx-auto bg-white p-5 text-text rounded-xl border border-gray-100",
			children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
				className: "font-semibold text-sm",
				children: "Total price"
			}), /* @__PURE__ */ jsx("p", {
				className: "font-bold text-lg",
				children: defaultPrice ?? 0
			})] }), /* @__PURE__ */ jsx("button", {
				className: "bg-[#c5dedd] px-4 rounded-xl",
				onClick: handleAddToCart,
				children: buttonText
			})]
		}),
		/* @__PURE__ */ jsx(ProductBody, {
			body: product.body,
			table: product.table
		}),
		/* @__PURE__ */ jsx("p", {
			className: "text-text mb-4 font-semibold",
			children: "Related Products"
		}),
		/* @__PURE__ */ jsx(RelatedProducts, {})
	] });
};
//#endregion
export { ProductView as t };
