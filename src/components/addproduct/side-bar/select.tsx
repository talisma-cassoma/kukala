"use client"

import React, { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldContent, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

interface SelectOptionsProps extends React.ComponentProps<"div"> {
    title: string
    items: string[]
    selectedItems: string[]
    onSelectionChange: (selected: string[]) => void
    onAddItem?: (newItem: string) => void
}

export function SelectOptions({
    title,
    items,
    selectedItems,
    onSelectionChange,
    onAddItem,
    className,
    ...props
}: SelectOptionsProps) {
    const [newItemText, setNewItemText] = useState("")

    const handleToggle = (item: string) => {
        const isSelected = selectedItems.includes(item)
        if (isSelected) {
            onSelectionChange(selectedItems.filter((i) => i !== item))
        } else {
            onSelectionChange([...selectedItems, item])
        }
    }

    const handleAdd = () => {
        const trimmed = newItemText.trim()
        if (!trimmed) return
        
        // Evita adicionar duplicados na lista
        if (!items.includes(trimmed)) {
            onAddItem?.(trimmed)
            // Opcional: já marca o novo item como selecionado
            onSelectionChange([...selectedItems, trimmed])
        }
        
        setNewItemText("")
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault()
            handleAdd()
        }
    }

    return (
        <section className="flex flex-col gap-4 border-t border-black pt-4">
            <h2 className="text-lg font-semibold capitalize">Selecione os {title}</h2>
            
            <FieldGroup className={className ?? "max-w-sm"} {...props}>
                {items.map((item, index) => {
                    const id = `checkbox-${index}-${item}`
                    const isChecked = selectedItems.includes(item)

                    return (
                        <Field key={item} orientation="horizontal">
                            <Checkbox
                                id={id}
                                checked={isChecked}
                                onCheckedChange={() => handleToggle(item)}
                            />
                            <FieldContent>
                                <FieldLabel htmlFor={id} className="cursor-pointer">
                                    {item}
                                </FieldLabel>
                            </FieldContent>
                        </Field>
                    )
                })}
            </FieldGroup>

            {/* Form de Adição */}
            <div className="flex items-center gap-2 max-w-sm">
                <Input
                    type="text"
                    placeholder={`Adicionar novo ${title.toLowerCase()}...`}
                    value={newItemText}
                    onChange={(e) => setNewItemText(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <Button type="button" onClick={handleAdd} size="icon" variant="outline">
                    <Plus className="h-4 w-4" />
                </Button>
            </div>
        </section>
    )
}