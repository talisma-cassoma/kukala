import { apiClient } from "@/use-cases/shared";

export async function createOrder(orderInput: any) {
    return await apiClient.orderApi(
        `#graphql
      mutation($input: CreateOrderInput!) {
        orders {
          create(input: $input) {
            id
          }
        }
      }
    `,
        {
            input: orderInput,
        }
    );
}
