import type { APIRoute } from "astro";
import { PrismaClient, type OrderStatus } from "@prisma/client";
import { requireAdmin } from "@/lib/auth";

const prisma = new PrismaClient();

export const GET: APIRoute = async (context) => {

    //console.log("Dashboard API Called")

    try {
        // 1. Authenticate and authorize the administrator
        const adminUserOrResponse = await requireAdmin(context);
        if (adminUserOrResponse instanceof Response) {
            return adminUserOrResponse;
        }

        // 1. Fetch aggregated statistics
        const totalOrders = await prisma.order.count();
        const pendingOrders = await prisma.order.count({ where: { status: 'PENDING' } });
        const completedOrders = await prisma.order.count({ where: { status: 'FULFILLED' } });
        const cancelledOrders = await prisma.order.count({ where: { status: 'CANCELLED' } });

        const revenue = await prisma.order.aggregate({
            _sum: {
                totalGross: true,
            },
            where: {
                status: 'FULFILLED',
            },
        });

        // 2. Fetch recent orders (e.g., last 10)
        const recentOrdersRaw = await prisma.order.findMany({
            take: 10,
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                items: true,
            }
        });

        // 3. Map Prisma Order to the data structure expected by the dashboard
        const recentOrders = recentOrdersRaw.map(order => ({
            id: order.id,
            order: `Order #${order.id.substring(0, 8)}...`,
            quantity:order.items.length,
            status: order.status,
            price: order.totalGross.toString(), // Representing gross total as 'target'
            //limit: order.items.reduce((sum, item) => sum + item.quantity, 0).toString(), // Representing item count as 'limit'
            name: `${order.firstName} ${order.lastName}`, // Using customer name as 'reviewer'
        }));

        const response = {
            statistics: {
                totalOrders,
                pendingOrders,
                completedOrders,
                cancelledOrders,
                revenue: revenue._sum.totalGross ?? 0,
            },
            recentOrders,
        };

        return new Response(JSON.stringify(response), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (error) {
        console.error("Dashboard API Error:", error);
        return new Response(
            JSON.stringify({
                message: "An error occurred while fetching dashboard data.",
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