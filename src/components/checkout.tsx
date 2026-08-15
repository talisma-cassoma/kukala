import { useState } from "react";
import { useStore } from '@nanostores/react';
import { cart as cartStore, clearCart } from '@/pages/shop/cartStore';

export const CheckoutForm = () => {
    const [state, setState] = useState({
        firstName: "",
        lastName: "",
        email: "",
        street: "",
        city: "",
        postalCode: "",
    });

    const { items: cartItems, total } = useStore(cartStore);
    const { firstName, lastName, email, street, city, postalCode } = state;

    const checkoutModel: any = {
        basketModel: { items: cartItems },
        customer: {
            firstName,
            lastName,
            email,
            street,
            city,
            postalCode,
        },
        total: {
            currency: "USD",
            gross: total,
            net: total,
            tax: {
                name: "No Ttax",
                percent: 0,
            },
        },
    };

    const handleClick = async () => {
        

        // 1. Save the order to the database
        try {
            const res = await fetch("/api/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(checkoutModel),
            });

            if (!res.ok) {
                // If the server response is not OK, throw an error with the status
                throw new Error(`Failed to create order: ${res.status} ${res.statusText}`);
            }

            const response = await res.json();

            // 5. If successful, clear the cart and redirect to the order page
            if (response?.id) {
                clearCart();
                window.location.href = `/order/${response.id}`;
            }
        } catch (error) {
            console.error("Checkout error:", error);
            // Here you could update the UI to show an error message to the user
        }
     

    };

    return (
        <div className="p-10 mx-auto bg-background1 w-lg mt-20">
            <h1 className="text-text text-3xl font-bold mb-10 text-center">
                Checkout
            </h1>
            <div className="mx-auto">
                <form method="post" className="flex flex-wrap gap-5">
                    <input
                        type="text"
                        name="First Name"
                        placeholder="First name"
                        className="w-full p-3 border border-text"
                        required
                        onChange={(e) =>
                            setState({ ...state, firstName: e.target.value })
                        }
                    />
                    <input
                        type="text"
                        name="Last Name"
                        required
                        placeholder="Last name"
                        className="w-full  p-3 border border-text"
                        onChange={(e) =>
                            setState({ ...state, lastName: e.target.value })
                        }
                    />
                    <input
                        type="text"
                        name="Email"
                        required
                        placeholder="Email"
                        className="w-full  p-3 border border-text"
                        onChange={(e) =>
                            setState({ ...state, email: e.target.value })
                        }
                    />
                    <input
                        type="text"
                        name="Street"
                        placeholder="Street"
                        className="w-full  p-3 border border-text"
                        onChange={(e) =>
                            setState({ ...state, street: e.target.value })
                        }
                    />
                    <input
                        type="text"
                        name="City"
                        placeholder="City"
                        className="w-full  p-3 border border-text"
                        onChange={(e) =>
                            setState({ ...state, city: e.target.value })
                        }
                    />
                    <input
                        type="text"
                        name="Postal Code"
                        placeholder="Postal Code"
                        className="w-full p-3 border border-text"
                        onChange={(e) =>
                            setState({ ...state, postalCode: e.target.value })
                        }
                    />
                </form>
                <button
                    className="w-full bg-green text-black p-3 mt-10 rounded font-semibold text-center"
                    onClick={handleClick}
                >
                    Commender
                </button>
            </div>
        </div>
    );
};
