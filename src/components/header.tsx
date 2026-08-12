import { BasketButton } from "./basket-button";
import AstroLogo from "@/assets/astro-logo.svg";
import kukala_logo from "@/assets/black_logo.png";

export const Header = () => {
    return (
        <header className="container flex justify-between mx-auto py-10 w-full">
            <a href="/" title="AstroJS">
                <img src={kukala_logo.src} alt="Dount and Astro logo" className="w-24" />
            </a>
            <a href="/cart" title="Your cart">
                <BasketButton />
            </a>
        </header>
    );
};
