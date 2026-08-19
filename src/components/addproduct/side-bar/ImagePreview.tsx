"use client"

import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Image as ImageIcon, Upload, X } from "lucide-react"

interface ImagePreviewProps {
  onChange?: (file: File | null) => void
  initialImage?: string
  title?: string
  url: string | null
  setUrl: React.Dispatch<React.SetStateAction<string | null>>
}

export function ImagePreview({
  onChange,
  initialImage,
  title,
}: ImagePreviewProps) {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(
    initialImage ?? null
  )

  useEffect(() => {
    if (!file) return

    const objectUrl = URL.createObjectURL(file)
    setPreview(objectUrl)

    return () => {
      URL.revokeObjectURL(objectUrl)
    }
  }, [file])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] ?? null

    setFile(selectedFile)
    onChange?.(selectedFile)
  }

  const handleRemove = () => {
    setFile(null)
    setPreview(null)
    onChange?.(null)
  }

  return (
    <section
      className={`flex flex-col gap-4 border-t pt-4 ${title ? "border-b" : ""}`}
    >
     {
     title && <h2 className="text-lg font-semibold capitalize">Selecione a {title}</h2>
     } 

      <div className="flex flex-col gap-3 max-w-sm justify-center">
        {preview ? (
          <div className="relative w-fit">
            <img
              src={preview}
              alt="Preview"
              className="h-48 w-48 rounded-md object-cover border border-gray-300"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleRemove}
              className="absolute -top-2 -right-2 h-7 w-7 rounded-full bg-background shadow-sm"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex h-48 w-48 flex-col items-center justify-center gap-2 rounded-md border border-dashed border-black/40 bg-muted/20 text-muted-foreground">
            <ImageIcon className="h-8 w-8" />
            <span className="text-xs">Nenhuma imagem selecionada</span>
          </div>
        )}

        <div className="flex items-center gap-2">
          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={handleChange}
              className="hidden"
            />
            <Button type="button" variant="outline" className="pointer-events-none flex items-center gap-2">
              <Upload className="h-4 w-4" />
              <span>{preview ? "Alterar imagem" : "Carregar imagem"}</span>
            </Button>
          </label>
        </div>
      </div>
    </section>
  )
}