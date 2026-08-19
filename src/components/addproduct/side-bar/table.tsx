"use client"

import React, { useState } from "react"
import { Field, FieldContent, FieldLabel, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from "lucide-react"

export interface TableOption {
    props: string
    value: string
}

interface TableFieldProps {
    title: string
    tableFild: TableOption[]
    setTableFild: React.Dispatch<React.SetStateAction<TableOption[]>>
}

export function TableField({
    tableFild,
    setTableFild,
}: TableFieldProps) {
    const [props, setProps] = useState("")
    const [value, setValue] = useState("")
    const [title, setTitle] = useState("")

    const handleAdd = () => {
        if (!props.trim() || !value.trim()) return

        setTableFild((current) => [
            ...current,
            {
                props: props.trim(),
                value: value.trim(),
            },
        ])

        setProps("")
        setValue("")
    }

    const handleDelete = (indexToDelete: number) => {
        setTableFild((current) => current.filter((_, index) => index !== indexToDelete))
    }

    return (
        <section className="flex flex-col gap-4 border-t border-black pt-4">
            {/* Campo do Título */}
            <div className="max-w-sm">
                <Input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Título da Tabela"
                    className="text-lg font-semibold capitalize border-none p-0 focus-visible:ring-0"
                />
            </div>

            {/* Inputs de Propriedade e Valor */}
            <div className="flex items-center gap-2 max-w-sm">
                <Input
                    type="text"
                    value={props}
                    onChange={(e) => setProps(e.target.value)}
                    placeholder="Props..."
                />
                <Input
                    type="text"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="Value..."
                />
                <Button type="button" onClick={handleAdd} size="icon" variant="outline">
                    <Plus className="h-4 w-4" />
                </Button>
            </div>

            {/* Lista dos Itens Adicionados em Linha */}
            <FieldGroup className="max-w-sm space-y-2">
                {tableFild.map((item, index) => (
                    <Field key={index} orientation="horizontal" className="justify-between">
                        <FieldContent className="flex flex-row items-center justify-between w-full gap-2">
                            <div className="flex items-center gap-2 truncate">
                                <FieldLabel className="font-medium">{item.props}:</FieldLabel>
                                <span className="text-sm text-muted-foreground truncate">{item.value}</span>
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(index)}
                                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                                x
                            </Button>
                        </FieldContent>
                    </Field>
                ))}
            </FieldGroup>
        </section>
    )
}