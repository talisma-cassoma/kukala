"use client"
import { useState, useEffect } from "react"
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useProduct } from "../AddPodructProvider";
import { SelectOptions } from "@/components/addproduct/side-bar/select"
import { TableField } from "@/components/addproduct/side-bar/table"
import { Store } from "lucide-react"
import { ImagePreview } from "@/components/addproduct/side-bar/ImagePreview"
import { Paragraphes } from "@/components/addproduct/side-bar/paragraph"


const topicsList = ["new", "promo", "solde"]
const Volumelist = ["100ml", "50ml"]
const DeliveryList = ["in-Store", "home-delivery"]


export interface TableOption {
  props: string
  value: string
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { product, setProduct } = useProduct();
  const [productUrl, setProductUrl] = useState<string | null>(product.image?.url ?? null)
  const [selectedTags, setSelectedTags] = useState<string[]>(topicsList)
  const [table, setTable] = useState<TableOption[]>([{ props: "", value: "100mg" }])

  useEffect(() => {
    setProduct((prev) => ({
      ...prev,
      image: {
        ...prev.image,
        url: productUrl ?? "",
        altText: prev.image?.altText || `${prev.name || "product"} image`,
      },
    }))
  }, [productUrl, setProduct])

  useEffect(() => {
    //fill product
    setProduct((prev) => ({
      ...prev,
      topics: selectedTags.map((tag) => ({ name: tag })),
    }))
  }, [selectedTags])

  useEffect(() => {
    if (!table || table.length === 0) return;

    setProduct((prev) => ({
      ...prev,
      table: {
        ...prev?.table,
        sections: [
          {
            title: "Details sur l'emballage",
            // Mapeia o estado `table` para a estrutura de `properties`
            properties: table.map((item) => ({
              key: item.props,
              value: item.value,
            })),
          },
          // Mantenha outras seções existentes se houver, ou adicione conforme a necessidade
          ...(prev?.table?.sections?.slice(1) || []),
        ],
      },
    }));
  }, [table]);

  const handleSubmit = (formData: any) => {
    console.log("Dados salvos a partir da Sidebar:", formData);
    // Aqui você chama sua API ou Supabase para atualizar o produto
  };


  return (
    <Sidebar {...props} >
      {/* Cabeçalho do Formulário */}
      <SidebarHeader className="border-b p-4">
        <h2 className="text-lg font-semibold">Editar Produto</h2>
        <p className="text-xs text-muted-foreground">Altere os detalhes abaixo</p>
      </SidebarHeader>

      {/* Corpinho com campos (com rolagem automática se o form for longo) */}
      <SidebarContent className="p-4 space-y-4 overflow-scroll">
        <form id="sidebar-form" onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="prod-name">Nome do Produto</Label>
            <Input
              id="prod-name"
              value={product.name}
              onChange={(e) => {
                setProduct((prev) => ({
                  ...prev,
                  name: String(e.target.value),
                }))
              }}
              placeholder="Ex: Camiseta Oversized"
            />
          </div>
          <ImagePreview url={productUrl} setUrl={setProductUrl} />

          <div className="space-y-2">
            <Label htmlFor="prod-description">description do Produto</Label>
            <Input
              id="prod-description"
              value={product.summary}
              onChange={(e) => {
                setProduct((prev) => ({
                  ...prev,
                  summary: String(e.target.value),
                }))
              }}
              placeholder="descreva o produto"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="prod-price">Preço (DH)</Label>
            <Input
              id="prod-price"
              type="number"
              value={product.price}
              onChange={(e) => {
                setProduct((prev) => ({
                  ...prev,
                  price: Number(e.target.value),
                }))
              }}
              placeholder="99.90"
            />
          </div>

          <SelectOptions
            title="Tags"
            itemList={topicsList}
            selectedItems={selectedTags}
            setSelectedItems={setSelectedTags}
          />
          {/* <SelectOptions
            title="Volume"
            itemList={selectedVolume}
            selectedItems={selectedVolume}
            setSelectedItems={setSelectedVolume}
          />

          <SelectOptions
            title="delivery"
            itemList={selectedDelivery}
            selectedItems={selectedDelivery}
            setSelectedItems={setSelectedDelivery}

          /> */}

          <Paragraphes/>

          <TableField
            title="tabela"
            tableFild={table}
            setTableFild={setTable}
          />


        </form>
      </SidebarContent>

      {/* Rodapé fixo para ações/botões de envio */}
      <SidebarFooter className="border-t p-4 flex gap-2">
        <Button type="submit" form="sidebar-form" className="w-full">
          Salvar Alterações
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}