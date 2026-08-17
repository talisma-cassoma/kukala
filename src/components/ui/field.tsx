import * as React from "react"
import { cn } from "@/lib/utils"

export function Field({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field"
      className={cn("grid items-center gap-2", className)}
      {...props}
    />
  )
}

export function FieldGroup({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div data-slot="field-group" className={cn("grid gap-4", className)} {...props} />
  )
}