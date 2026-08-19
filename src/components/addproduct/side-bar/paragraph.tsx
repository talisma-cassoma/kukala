import React, { useState } from "react" 
interface paragraphesProps {
    paragraphTitle: string
}
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ImagePreview } from "./ImagePreview"

export function Paragraphes({paragraphTitle}: paragraphesProps){
const [title, setTitle] = useState(paragraphTitle)
const [text, setText] = useState("")
const [url, setUrl]= useState<string | null >("")

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
              placeholder="Ex: Camiseta Oversized"
            />
          </div>
           <div className="space-y-2">
            <Label htmlFor="prod-text">Texto</Label>
            <Input
              id="prod-name"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Ex: Camiseta Oversized"
            />
          </div>
          <ImagePreview url={url} setUrl={setUrl} />

    </section>
  )

}