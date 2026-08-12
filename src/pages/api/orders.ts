import type { APIRoute } from 'astro';
import { PrismaClient } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

const prisma = new PrismaClient();

interface OrderItemOptionInput {
  productOptionId: string;
  groupName: string;
  optionLabel: string;
  price: string | number;
}

interface BasketItemInput {
  productId: string;
  name: string;
  quantity: number;
  price: string | number;
  selectedOptions?: OrderItemOptionInput[];
}

interface CustomerInput {
  firstName: string;
  lastName: string;
  email: string;
  street: string;
  city: string;
  postalCode: string;
}

interface Order {
  firstName: string;
  lastName: string;
  email: string;
  street: string;
  city: string;
  postalCode: string;
  totalGross: Decimal;
  totalNet: Decimal;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();

    // Basic validation
    if (!body.customer || !body.basketModel || !body.total) {
      return new Response(
        JSON.stringify({
          message: "Missing required order data.",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const { customer, basketModel, total } = body;

    // Validate customer data
    const requiredCustomerFields = [
      "firstName",
      "lastName",
      "email",
      "street",
      "city",
      "postalCode",
    ];

    for (const field of requiredCustomerFields) {
      if (!customer[field]) {
        return new Response(
          JSON.stringify({
            message: `Missing customer field: ${field}`,
          }),
          {
            status: 400,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }
    }

    // Validate basket
    if (
      !Array.isArray(basketModel.items) ||
      basketModel.items.length === 0
    ) {
      return new Response(
        JSON.stringify({
          message: "The basket is empty.",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const newOrder = await prisma.$transaction(async (tx) => {
      // 1. Create the order.
      //
      // There is no Customer/User relation.
      // Customer information is stored directly on the order
      // as a snapshot of the information used at checkout.
      const order = await tx.order.create({
        data: {
          firstName: customer.firstName,
          lastName: customer.lastName,
          email: customer.email,
          street: customer.street,
          city: customer.city,
          postalCode: customer.postalCode,

          totalGross: new Decimal(total.gross),
          totalNet: new Decimal(total.net),
        } as Order,
      });

      // 2. Create all order items
      for (const item of basketModel.items as BasketItemInput[]) {
        if (!item.productId) {
          throw new Error(
            `Missing productId for basket item: ${item.name}`
          );
        }

        const quantity = Number(item.quantity);
        const unitPrice = new Decimal(item.price);
        const totalPrice = unitPrice.mul(quantity);

        const orderItem = await tx.orderItem.create({
          data: {
            orderId: order.id,
            productId: item.productId,

            // Snapshot of the product information
            // at the moment of purchase.
            name: item.name,
            quantity,
            unitPrice,
            totalPrice,
          },
        });

        // 3. Save selected product options
        if (
          Array.isArray(item.selectedOptions) &&
          item.selectedOptions.length > 0
        ) {
          await tx.orderItemOption.createMany({
            data: item.selectedOptions.map((option) => ({
              orderItemId: orderItem.id,
              productOptionId: option.productOptionId,
              groupName: option.groupName,
              optionLabel: option.optionLabel,
              priceAtPurchase: new Decimal(option.price),
            })),
          });
        }
      }

      return order;
    });

    // 4. Return the newly created order
    return new Response(
      JSON.stringify({
        id: newOrder.id,
      }),
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error: any) {
    console.error("Order creation error:", error);

    // Prisma unique constraint
    if (error?.code === "P2002") {
      return new Response(
        JSON.stringify({
          message: "A database conflict occurred.",
          target: error.meta?.target,
        }),
        {
          status: 409,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    return new Response(
      JSON.stringify({
        message: "An error occurred while creating the order.",
        error:
          process.env.NODE_ENV === "development"
            ? error?.message
            : undefined,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};