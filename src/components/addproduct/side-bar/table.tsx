"use client"

import React, { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Field,
    FieldContent,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export interface SelectOption {
    props: string
    value: string
}

interface SelectOptionsProps extends React.ComponentProps<"div"> {
    title: string

    table: SelectOption[]
    setTable: React.Dispatch<React.SetStateAction<SelectOption[]>>

    selectedItems: string[]
    onSelectionChange: (selected: string[]) => void
}

export function TableFilds({
    title,
    table,
    setTable,
    selectedItems,
    onSelectionChange,
    className,
    ...props
}: SelectOptionsProps) {
    const [newItemText, setNewItemText] = useState("")

    const handleToggle = (value: string) => {
        const isSelected = selectedItems.includes(value)

        if (isSelected) {
            onSelectionChange(
                selectedItems.filter((item) => item !== value)
            )
        } else {
            onSelectionChange([
                ...selectedItems,
                value,
            ])
        }
    }

    const handleAdd = () => {
        const trimmed = newItemText.trim()

        if (!trimmed) return

        // Prevent duplicate values
        const alreadyExists = table.some(
            (item) => item.value === trimmed
        )

        if (alreadyExists) return

        const newItem: SelectOption = {
            props: trimmed,
            value: trimmed,
        }

        // Update the parent's state
        setTable((currentTable) => [
            ...currentTable,
            newItem,
        ])

        // Automatically select the new item
        onSelectionChange([
            ...selectedItems,
            newItem.value,
        ])

        setNewItemText("")
    }

    const handleKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement>
    ) => {
        if (e.key === "Enter") {
            e.preventDefault()
            handleAdd()
        }
    }

    return (
        <section className="flex flex-col gap-4 border-t border-black pt-4">
            <h2 className="text-lg font-semibold capitalize">
                Selecione os {title}
            </h2>

            <FieldGroup
                className={className ?? "max-w-sm"}
                {...props}
            >
                {table.map((item, index) => {
                    const id = `checkbox-${index}-${item.value}`

                    const isChecked =
                        selectedItems.includes(item.value)

                    return (
                        <Field
                            key={item.value}
                            orientation="horizontal"
                        >
                            <Checkbox
                                id={id}
                                checked={isChecked}
                                onCheckedChange={() =>
                                    handleToggle(item.value)
                                }
                            />

                            <FieldContent>
                                <FieldLabel
                                    htmlFor={id}
                                    className="cursor-pointer"
                                >
                                    {item.props}
                                </FieldLabel>
                            </FieldContent>
                        </Field>
                    )
                })}
            </FieldGroup>

            {/* Add new item */}
            <div className="flex items-center gap-2 max-w-sm">
                <Input
                    type="text"
                    placeholder={`Adicionar novo ${title.toLowerCase()}...`}
                    value={newItemText}
                    onChange={(e) =>
                        setNewItemText(e.target.value)
                    }
                    onKeyDown={handleKeyDown}
                />

                <Button
                    type="button"
                    onClick={handleAdd}
                    size="icon"
                    variant="outline"
                >
                    <Plus className="h-4 w-4" />
                </Button>
            </div>
        </section>
    )
}