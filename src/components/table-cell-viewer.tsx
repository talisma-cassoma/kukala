import * as React from "react"
import { getSupabaseClient } from "@/lib/supabase"

import {
    columnFilteringFeature,
    columnVisibilityFeature,
    createColumnHelper,
    createFilteredRowModel,
    createPaginatedRowModel,
    createSortedRowModel,

    rowPaginationFeature,
    rowSelectionFeature,
    rowSortingFeature,
    tableFeatures,
} from "@tanstack/react-table"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { toast } from "sonner"
import { z } from "zod"

import { useIsMobile } from "@/hooks/use-mobile"

import { Button } from "@/components/ui/button"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart"

import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import {
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

import { TrendingUpIcon } from "lucide-react"
import { useDashboard } from "./dashboard-provider"

// New in v9: declare the features this table uses — anything you don't
// register is tree-shaken out of the bundle.
const features = tableFeatures({
    columnFilteringFeature,
    columnVisibilityFeature,
    rowPaginationFeature,
    rowSelectionFeature,
    rowSortingFeature,
    filteredRowModel: createFilteredRowModel(),
    paginatedRowModel: createPaginatedRowModel(),
    sortedRowModel: createSortedRowModel(),
})

export const schema = z.object({
    id: z.number(),
    order: z.string(),
    quantity: z.number(),
    status: z.string(),
    price: z.number(),
    //limit: z.string(),
    name: z.string(),
})

const chartData = [
    { month: "January", desktop: 186, mobile: 80 },
    { month: "February", desktop: 305, mobile: 200 },
    { month: "March", desktop: 237, mobile: 120 },
    { month: "April", desktop: 73, mobile: 190 },
    { month: "May", desktop: 209, mobile: 130 },
    { month: "June", desktop: 214, mobile: 140 },
]

const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "var(--primary)",
    },
    mobile: {
        label: "Mobile",
        color: "var(--primary)",
    },
} satisfies ChartConfig




export function TableCellViewer({
    item,
    isEdit = false,
}: {
    item: z.infer<typeof schema>
    isEdit?: boolean
}) {
    const isMobile = useIsMobile()
    const [isSubmitting, setIsSubmitting] = React.useState(false)
    const [formData, setFormData] = React.useState(item);
    const { fetchOrders } = useDashboard();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const supabase = getSupabaseClient();
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) throw new Error("Not authenticated");

            const response = await fetch(`/api/orders/admin/${item.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session.access_token}`,
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error(`Failed to update order: ${response.statusText}`);
            }

            toast.success("Order updated successfully.");
            fetchOrders();

        } catch (error) {
            toast.error("Failed to update order.");
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Drawer direction={isMobile ? "bottom" : "right"}>
            <DrawerTrigger asChild>
                {isEdit ? (
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        Edit
                    </DropdownMenuItem>
                ) : (
                    <Button variant="link" className="w-fit px-0 text-left text-foreground">
                        {item.order}
                    </Button>
                )}
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader className="gap-1">
                    <DrawerTitle>{item.order}</DrawerTitle>
                    <DrawerDescription>
                        Showing total visitors for the last 6 months
                    </DrawerDescription>
                </DrawerHeader>
                <form onSubmit={handleSubmit} className="flex flex-1 flex-col justify-between">
                    <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
                    {!isMobile && (
                        <>
                            <ChartContainer config={chartConfig}>
                                <AreaChart
                                    accessibilityLayer
                                    data={chartData}
                                    margin={{
                                        left: 0,
                                        right: 10,
                                    }}
                                >
                                    <CartesianGrid vertical={false} />
                                    <XAxis
                                        dataKey="month"
                                        tickLine={false}
                                        axisLine={false}
                                        tickMargin={8}
                                        tickFormatter={(value) => value.slice(0, 3)}
                                        hide
                                    />
                                    <ChartTooltip
                                        cursor={false}
                                        content={<ChartTooltipContent indicator="dot" />}
                                    />
                                    <Area
                                        dataKey="mobile"
                                        type="natural"
                                        fill="var(--color-mobile)"
                                        fillOpacity={0.6}
                                        stroke="var(--color-mobile)"
                                        stackId="a"
                                    />
                                    <Area
                                        dataKey="desktop"
                                        type="natural"
                                        fill="var(--color-desktop)"
                                        fillOpacity={0.4}
                                        stroke="var(--color-desktop)"
                                        stackId="a"
                                    />
                                </AreaChart>
                            </ChartContainer>
                            <Separator />
                            <div className="grid gap-2">
                                <div className="flex gap-2 leading-none font-medium">
                                    Trending up by 5.2% this month{" "}
                                    <TrendingUpIcon className="size-4" />
                                </div>
                                <div className="text-muted-foreground">
                                    Showing total visitors for the last 6 months. This is just
                                    some random text to test the layout. It spans multiple lines
                                    and should wrap around.
                                </div>
                            </div>
                            <Separator />
                        </>
                    )}
                        <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="header">Order</Label>
                            <p> {item.order}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-3">
                                <Label htmlFor="type">Quantity</Label>
                                <Input id="quantity"
                                    value={formData.quantity}
                                    onChange={(e) => {
                                        setFormData((prev) => ({
                                            ...prev,
                                            quantity: Number(e.target.value),
                                        }));
                                    }} />
                            </div>
                            <div className="flex flex-col gap-3">
                                <Label htmlFor="status">Status</Label>
                                <Select
                                    value={formData.status}
                                    onValueChange={(value) => {
                                        setFormData((prev) => ({
                                            ...prev,
                                            status: value,
                                        }));
                                    }}
                                >
                                    <SelectTrigger id="status" className="w-full">
                                        <SelectValue placeholder="Select a status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="PENDING">in Progress</SelectItem>
                                            <SelectItem value="PAID">PAID</SelectItem>
                                            <SelectItem value="FULFILLED">FULFILLED</SelectItem>
                                            <SelectItem value="CANCELLED">Cancelled</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-3">
                                <Label htmlFor="price">Price</Label>
                                <Input id="price" value={formData.price}
                                    onChange={(e) => {
                                        setFormData((prev) => ({
                                            ...prev,
                                            price: Number(e.target.value),
                                        }));
                                    }} />
                            </div>
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" value={formData.name}
                                onChange={(e) => {
                                    setFormData((prev) => ({
                                        ...prev,
                                        name: String(e.target.value),
                                    }));
                                }} />
                        </div>
                        </div>
                    </div>
                    <DrawerFooter>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Submitting..." : "Submit"}
                        </Button>
                        <DrawerClose asChild>
                            <Button variant="outline">Done</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </form>
            </DrawerContent>
        </Drawer>
    )
}