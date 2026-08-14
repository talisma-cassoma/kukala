import { useStore } from '@nanostores/react';
import { cart, deleteItemOnCart, initializeCart } from '@/pages/shop/cartStore';
import { useEffect } from 'react';

export const LocalCart = () => {
    const { items, total, itemCount } = useStore(cart);
    
    useEffect(() => {initializeCart()}, []);

    return (
        <div className="py-20 text-text lg:w-auth mx-auto w-full">
            <h1 className="text-4xl font-bold  mb-10">
                Your shopping cart ({itemCount})
            </h1>
            <div className="flex flex-col gap-5 bg-background1 p-20">
                {items.map((item, index: number) => (
                    <div
                        key={index}
                        className="flex justify-between items-center"
                    >
                        <div className="flex flex-col">
                            <div className='flex gap-2 items-center'>
                            <img src={item.imageUrl || ''} alt={item.name} className='size-12 rounded-xl object-contain bg-gray-200'></img>
                            <p className="font-semibold text-xl">
                                {item.name} × {item.quantity}
                            </p>
                            </div>
                            <div className="flex gap-3">
                                {item.attributes?.map(
                                    (
                                        attr: { key: string; value: string },
                                        index: number
                                    ) => (
                                        <div
                                            //className="even:after:content-['\\00a0-'] even:before:content-['-\\00a0']"
                                            key={index}
                                        >
                                            <p>{attr.value}</p>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                        <div className='flex gap-20'>
                        <p>{item.price * item.quantity} DH</p>
                         <button
                    className="bg-background2 px-4 rounded-xl"
                    onClick={() => deleteItemOnCart(item)}
                >
                    x
                </button>
                        </div>
                    </div>
                ))}
                <div className="flex justify-between items-center border-t-2 border-text pt-4">
                    <p className="font-semibold text-xl">Total</p>
                    <p>{total} DH</p>
                </div>
                <a
                    href="/checkout"
                    className="bg-red text-black p-3 mt-10 rounded font-semibold text-center"
                >
                    Checkout
                </a>
            </div>
        </div>
    );
};
