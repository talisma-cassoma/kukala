import * as React from "react"
import { useIsMobile } from "@/hooks/use-mobile"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer"
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
import { toast } from "sonner"
import { getSupabaseClient } from "@/lib/supabase"
import { schema } from "@/components/data-table"
import { z } from "zod"


export function TableCellViewer({
    item,
    open,
    onOpenChange,
}: {
    item: z.infer<typeof schema>;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const isMobile = useIsMobile();
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [formData, setFormData] = React.useState(item);

    const handleInputChange = (field: keyof typeof formData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

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
            onOpenChange(false);
        } catch (error) {
            toast.error("Failed to update order.");
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Drawer direction={isMobile ? "bottom" : "right"} open={open} onOpenChange={onOpenChange}>
            <DrawerContent>
                <DrawerHeader className="gap-1">
                    <DrawerTitle>{item.order}</DrawerTitle>
                    <DrawerDescription>
                        Details for order #{item.id}
                    </DrawerDescription>
                </DrawerHeader>
                <form onSubmit={handleSubmit} className="flex flex-1 flex-col">
                    <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
                        <Separator />
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="header">Order</Label>
                            <Input id="header" value={formData.order} onChange={(e) => handleInputChange('order', e.target.value)} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-3">
                                <Label htmlFor="type">Quantity</Label>
                                <Input id="quantity" value={formData.quantity} onChange={(e) => handleInputChange('quantity', e.target.value)} />
                            </div>
                            <div className="flex flex-col gap-3">
                                <Label htmlFor="status">Status</Label>
                                <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                                    <SelectTrigger id="status" className="w-full">
                                        <SelectValue placeholder="Select a status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="Completed">Completed</SelectItem>
                                            <SelectItem value="Pending">Pending</SelectItem>
                                            <SelectItem value="Cancelled">Cancelled</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-3">
                                <Label htmlFor="target">Price (DH)</Label>
                                <Input id="target" value={formData.price} onChange={(e) => handleInputChange('price', e.target.value)} />
                            </div>
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="reviewer">Client Name</Label>
                            <Input id="name" value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} />
                        </div>
                    </div>
                    <DrawerFooter>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Submitting..." : "Submit"}
                        </Button>
                        <DrawerClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </form>
            </DrawerContent>
        </Drawer>
    )
}