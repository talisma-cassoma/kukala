import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient | null = null;
function getPrisma() {
  if (!prisma) {
    try {
      prisma = new PrismaClient();
    } catch {
      prisma = null;
    }
  }
  return prisma;
}

export async function getOrderById(id: string, origin?: string) {
  const client = getPrisma();
  if (client) {
    try {
      const order = await client.order.findUnique({
        where: { id },
        include: {
          items: true,
        },
      });

      if (order) {
        return {
          id: order.id,
          status: order.status,
          customer: {
            firstName: order.firstName,
            lastName: order.lastName,
            email: order.email,
            phone: order.phone,
            street: order.street,
            city: order.city,
            postalCode: order.postalCode,
          },
          total: {
            net: order.totalNet.toNumber(),
            gross: order.totalGross.toNumber(),
            currency: 'USD',
          },
          createdAt: order.createdAt,
          cart: order.items.map((item) => ({
            quantity: item.quantity,
            name: item.name,
            price: {
              net: item.unitPrice.toNumber(),
              gross: item.totalPrice.toNumber(),
            },
          })),
        };
      }
    } catch (error) {
      console.warn('Database fetch order failed:', error);
    }
  }

  if (origin || typeof window !== 'undefined') {
    const baseUrl = origin || (typeof window !== 'undefined' ? window.location.origin : '');
    try {
      const response = await fetch(`${baseUrl}/api/orders/${id}`);
      if (response.ok) {
        return await response.json();
      }
    } catch {
      return null;
    }
  }

  return null;
}
