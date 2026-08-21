"use client"

import React, { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ImagePreview } from "./ImagePreview"
import { useProduct } from "@/components/addproduct/AddPodructProvider"

interface ParagraphItem {
  title: string
  text: string
  url: string | null
}

export function Paragraphes({
  onFileChange,
}: {
  onFileChange?: (index: number, file: File | null) => void
}) {
  const { product, setProduct } = useProduct()

  // Inicializa o estado com todos os parágrafos vindos do produto
  const [paragraphs, setParagraphs] = useState<ParagraphItem[]>(() => {
    if (!product?.body?.paragraphs || product.body.paragraphs.length === 0) {
      return [{ title: "", text: "", url: null }]
    }

    return product.body.paragraphs.map((p) => ({
      title: p.title?.text || "",
      text: p.text || "",
      url: p.images?.[0]?.url || null,
    }))
  })

  // Atualiza um campo específico de um determinado parágrafo pelo índice
  const handleChange = (
    index: number,
    field: keyof ParagraphItem,
    value: string | null
  ) => {
    setParagraphs((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    )
  }

  // Sincroniza as alterações do estado local com o Provider global
  useEffect(() => {
    setProduct((prev) => ({
      ...prev,
      body: {
        ...prev?.body,
        paragraphs: paragraphs.map((p) => ({
          title: { text: p.title },
          text: p.text,
          images: [
            {
              url: p.url || "",
              altText: `${p.title || "product"} image`,
            },
          ],
        })),
      },
    }))
  }, [paragraphs, setProduct])

  return (
    <div className="space-y-6">
      {paragraphs.map((paragraph, index) => (
        <section
          key={index}
          className="flex flex-col gap-4 border-t border-black pt-4"
        >
          <h2 className="text-lg font-semibold capitalize">
            De um título ao parágrafo {index + 1}
          </h2>

          <div className="space-y-2">
            <Label htmlFor={`prod-title-${index}`}>Título</Label>
            <Input
              id={`prod-title-${index}`}
              value={paragraph.title}
              onChange={(e) => handleChange(index, "title", e.target.value)}
              placeholder="Ex: óleo kukula"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`prod-text-${index}`}>Texto</Label>
            <Input
              id={`prod-text-${index}`}
              value={paragraph.text}
              onChange={(e) => handleChange(index, "text", e.target.value)}
              placeholder="Esse óleo é maravilhoso"
            />
          </div>

          <ImagePreview
            url={paragraph.url}
            onChange={(file) => onFileChange?.(index, file)}
            setUrl={(newUrl) =>
              handleChange(
                index,
                "url",
                typeof newUrl === "function" ? newUrl(paragraph.url) : newUrl
              )
            }
          />
        </section>
      ))}
    </div>
  )
}