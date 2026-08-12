import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import { atom, onSet } from "nanostores";
//#region src/pages/shop/cartStore.ts
var cartStore_exports = /* @__PURE__ */ __exportAll({
	addItemToCart: () => addItemToCart,
	cart: () => cart,
	clearCart: () => clearCart,
	deleteItemOnCart: () => deleteItemOnCart,
	initializeCart: () => initializeCart,
	updateItemQuantity: () => updateItemQuantity
});
var INITIAL_STATE = {
	items: [],
	total: 0,
	itemCount: 0
};
var isBrowser = typeof window !== "undefined";
var cart = atom(INITIAL_STATE);
var calculateTotals = (items) => {
	let total = 0;
	let itemCount = 0;
	for (const item of items) {
		total += item.price * item.quantity;
		itemCount += item.quantity;
	}
	return {
		total,
		itemCount
	};
};
onSet(cart, ({ newValue }) => {
	if (isBrowser) localStorage.setItem("cart", JSON.stringify(newValue));
});
function initializeCart() {
	if (isBrowser) {
		const storedCart = localStorage.getItem("cart");
		if (storedCart) try {
			cart.set(JSON.parse(storedCart));
		} catch (e) {
			console.error("Failed to parse cart from localStorage", e);
			localStorage.removeItem("cart");
		}
	}
}
function addItemToCart(item) {
	console.log("item on cart:", item);
	const currentCart = cart.get();
	const existingItemIndex = currentCart.items.findIndex((i) => i.sku === item.sku);
	let newItems = [...currentCart.items];
	if (existingItemIndex > -1) {
		const existingItem = newItems[existingItemIndex];
		newItems[existingItemIndex] = {
			...existingItem,
			quantity: existingItem.quantity + (item.quantity ?? 1)
		};
	} else {
		const newItem = {
			...item,
			productId: item.productId ?? "",
			sku: item.sku,
			name: item.name,
			price: item.price ?? 75,
			quantity: item.quantity ?? 1,
			imageUrl: item.imageUrl
		};
		newItems.push(newItem);
	}
	const { total, itemCount } = calculateTotals(newItems);
	cart.set({
		items: newItems,
		total,
		itemCount
	});
}
function updateItemQuantity(sku, quantity) {
	let newItems = [...cart.get().items];
	if (quantity <= 0) newItems = newItems.filter((item) => item.sku !== sku);
	else {
		const itemIndex = newItems.findIndex((item) => item.sku === sku);
		if (itemIndex > -1) newItems[itemIndex] = {
			...newItems[itemIndex],
			quantity
		};
	}
	const { total, itemCount } = calculateTotals(newItems);
	cart.set({
		items: newItems,
		total,
		itemCount
	});
}
function clearCart() {
	cart.set(INITIAL_STATE);
}
function deleteItemOnCart(item) {
	console.log("item on cart:", item);
	const currentCart = cart.get();
	const existingItemIndex = currentCart.items.findIndex((i) => i.sku === item.sku);
	let currentitems = [...currentCart.items];
	if (existingItemIndex > -1) currentitems = currentCart.items.filter((i) => i.sku !== item.sku);
	else return;
	const { total, itemCount } = calculateTotals(currentitems);
	cart.set({
		items: currentitems,
		total,
		itemCount
	});
}
//#endregion
export { deleteItemOnCart as a, clearCart as i, cart as n, cartStore_exports as r, addItemToCart as t };
