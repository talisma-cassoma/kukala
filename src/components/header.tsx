import { BasketButton } from "./basket-button";
import kukala_logo from "@/assets/black_logo.png";

export const Header = () => {
    return (
        <header className="container flex justify-between mx-auto py-10 w-full">
            <a href="/" title="Kukala Shop">
                <img src={kukala_logo.src} alt="Kukala logo" className="w-24" />
            </a>
            <a href="/cart" title="Your cart">
                <BasketButton />
            </a>
        </header>
    );
};
