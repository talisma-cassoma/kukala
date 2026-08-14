import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
    let data = await request.json();
    let cart = data.basketModel.map(
        (item: {
            sku: string;
            quantity: number;
            name: string;
            image: string;
            price: number;
        }) => {
            return {
                sku: item.sku,
                quantity: item.quantity,
                name: item.name,
                imageUrl: item.image,
                price: {
                    gross: item.price,
                    net: item.price,
                    currency: "USD",
                    tax: {
                        name: "No Tax",
                        percent: 0,
                    },
                },
            };
        }
    );

    let body = {
        cart,
        customer: data.customer,
        total: data.total,
        payment: data.payment,
    };


    return new Response(JSON.stringify(body), {
        headers: {
            "content-type": "application/json;charset=UTF-8",
        },
    });
};
