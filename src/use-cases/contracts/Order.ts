export type OrderProps = {
    order: {
        id: string;
       customer?: {
                firstName: string;
                lastName: string;
                email: string;
                phone: string;
                street: string;
                city: string;
                postalCode: string;
            },

        cart: {
            name: string;
            quantity: number;
            price: {
                gross: number;
                net: number;
            };
        }[];
        total: {
            gross: number;
            net: number;
        };
    };
};
