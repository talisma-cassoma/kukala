import { atom, map, onSet } from 'nanostores';

export interface CartItem {
    sku: string;
    name: string;
    quantity: number;
    price: number;
    imageUrl?: string;
    [key: string]: any; // Allow other properties
}
 
export interface variantToCartItemType {   
    productId: string;
        sku:   string // Using product name as SKU for now, adjust if you have a specific SKU field
        name: string
        quantity: number,
        price: number,
        image: string,
        attributes: any,
} 

export interface Cart {
    items: CartItem[];
    total: number;
    itemCount: number;
}

interface ProductForCartConversion {
    id: string;
    name: string;
    price: number; // Assuming a single price or a default variant price
    productId: string;
    sku: string;
    quantity: number;
    image?: string;
    attributes?: any;
}

export interface Cart {
    items: CartItem[];
    total: number;
    itemCount: number;
}



const INITIAL_STATE: Cart = {
    items: [],
    total: 0,
    itemCount: 0,
};


export const variantToCartItem = (product: ProductForCartConversion) => {
    return {
        productId: product.id,
        sku: product.name, // Using product name as SKU for now, adjust if you have a specific SKU field
        name: product.name,
        quantity: 1,
        price: product.price,
        image: product.image,
        attributes: product.attributes,
    } as variantToCartItemType;
};

const isBrowser = typeof window !== 'undefined';

// Create the atom store.
// We initialize with an empty state and load from localStorage on the client.
export const cart = atom<Cart>(INITIAL_STATE);

// Function to calculate totals
const calculateTotals = (items: CartItem[]): { total: number; itemCount: number } => {
    let total = 0;
    let itemCount = 0;
    for (const item of items) {
        total += item.price * item.quantity;
        itemCount += item.quantity;
    }
    return { total, itemCount };
};

// This function should be called once from a client-side script or component effect.
export function setupCartListener() {
    // Listen for changes and persist to localStorage
    onSet(cart, ({ newValue }) => {
        // This check is redundant if setupCartListener is called correctly, but safe to keep.
        if (isBrowser) {
        localStorage.setItem('cart', JSON.stringify(newValue));
        }
    });
}

// --- Store Actions ---

export function initializeCart() {
    if (isBrowser) {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
            try {
                cart.set(JSON.parse(storedCart));
            } catch (e) {
                console.error("Failed to parse cart from localStorage", e);
                localStorage.removeItem('cart');
            }
        }
        setupCartListener();
    }
}

export function addItemToCart(item: CartItem) {
    
    console.log("item on cart:", item);
    
    const currentCart = cart.get();
    const existingItemIndex = currentCart.items.findIndex(i => i.sku === item.sku);
    let newItems = [...currentCart.items];
    

    if (existingItemIndex > -1) {
        // Update quantity if item exists
        const existingItem = newItems[existingItemIndex];
        newItems[existingItemIndex] = { ...existingItem, quantity: existingItem.quantity + (item.quantity ?? 1) };
    } else {
        // Add new item
        const newItem: CartItem = {
            ...item,
            productId: item.productId ?? "", // Ensure productId is set, default to empty string if not provided
            sku: item.sku,
            name: item.name,
            price: item.price ?? 75,
            quantity: item.quantity ?? 1,
            imageUrl: item.imageUrl
        };
        newItems.push(newItem);
    }

    const { total, itemCount } = calculateTotals(newItems);
    cart.set({ items: newItems, total, itemCount });
}

export function updateItemQuantity(sku: string, quantity: number) {
    const currentCart = cart.get();
    let newItems = [...currentCart.items];

    if (quantity <= 0) {
        // Remove item if quantity is 0 or less
        newItems = newItems.filter(item => item.sku !== sku);
    } else {
        const itemIndex = newItems.findIndex(item => item.sku === sku);
        if (itemIndex > -1) {
            newItems[itemIndex] = { ...newItems[itemIndex], quantity };
        }
    }

    const { total, itemCount } = calculateTotals(newItems);
    cart.set({ items: newItems, total, itemCount });
}

export function clearCart() {
    cart.set(INITIAL_STATE);
}

export function deleteItemOnCart(item: CartItem) {
    
    console.log("item on cart:", item);
    
    const currentCart = cart.get();
    const existingItemIndex = currentCart.items.findIndex(i => i.sku === item.sku);
    let currentitems = [...currentCart.items];
    

    if (existingItemIndex > -1) {
        // delete quantity if item exists
         currentitems = currentCart.items.filter(i => i.sku !== item.sku)
        
    } else {
        // do nothing
       return
    }

    const { total, itemCount } = calculateTotals(currentitems);
    cart.set({ items: currentitems, total, itemCount });
}