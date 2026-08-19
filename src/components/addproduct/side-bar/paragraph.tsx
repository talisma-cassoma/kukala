import React, { useEffect, useState } from "react"
interface paragraphesProps {
    paragraphTitle: string
}
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ImagePreview } from "./ImagePreview"
import {useProduct} from "@/components/addproduct/AddPodructProvider"

export function Paragraphes(){
  const { product, setProduct } = useProduct();
const [title, setTitle] = useState(product.body.paragraphs[0].title.text)
const [text, setText] = useState(product.body.paragraphs[0].text)
const [url, setUrl] = useState<string | null>(null)

  useEffect(() => {
    setProduct((prev) => ({
      ...prev,
      body: {
        ...prev?.body,
        paragraphs: [
          {
            title: { text: title },
            text,
            images: [
              {
                url: url ?? "",
                altText: `${title || "product"} image`,
              },
            ],
          },
          ...(prev?.body?.paragraphs?.slice(1) || []),
        ],
      },
    }));
  }, [title, text, url]);


  
    return (
    <section className="flex flex-col gap-4 border-t border-black pt-4">
      <h2 className="text-lg font-semibold capitalize">
        De um titulo ao paragrafo
      </h2>
       <div className="space-y-2">
            <Label htmlFor="prod-name">titulo</Label>
            <Input
              id="prod-name"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: oleo kukula"
            />
          </div>
           <div className="space-y-2">
            <Label htmlFor="prod-text">Texto</Label>
            <Input
              id="prod-name"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="esse oleo é maravailhoso"
            />
          </div>
          <ImagePreview url={url} setUrl={setUrl} />

    </section>
  )

}