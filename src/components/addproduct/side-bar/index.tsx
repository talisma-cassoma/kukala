"use client"
import { useState } from "react"
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
import { TableFilds } from "@/components/addproduct/side-bar/table"
import { Store } from "lucide-react"

const topicsList = ["new", "promo", "solde"]
const Volumelist = ["100ml", "50ml"]
const DeliveryList = ["in-Store", "home-delivery"]


export interface TableOption {
  props: string
  value: string
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { product } = useProduct();
  const [name, setName] = useState(product.name)
  const [description, setDescription] = useState(product.summary)
  const [price, setPrice] = useState<number>(product.price)
  const [selectedTags, setSelectedTags] = useState<string[]>(["promo"])
  const [selectedVolume, setSelectedVolume] = useState<string[]>(["100ml"])
  const [selectedDelivery, setSelectedDelivery] = useState<string[]>(["in-Store"])
  const [table, setTable] = useState<TableOption[]>([{ props: "", value: "100mg" }])




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
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Camiseta Oversized"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="prod-description">description do Produto</Label>
            <Input
              id="prod-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="descreva o produto"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="prod-price">Preço (DH)</Label>
            <Input
              id="prod-price"
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              placeholder="99.90"
            />
          </div>

          <SelectOptions
            title="Tags"
            items={topicsList}
            selectedItems={selectedTags}
            onSelectionChange={setSelectedTags}
          />
          <SelectOptions
            title="Volume"
            items={Volumelist}
            selectedItems={selectedVolume}
            onSelectionChange={setSelectedVolume}
          />

          <SelectOptions
            title="delivery"
            items={DeliveryList}
            selectedItems={selectedDelivery}
            onSelectionChange={setSelectedDelivery}
          />

          {/* <TableFilds
            title="tabela"
            table={table}
            setTable={setTable}
          /> */}
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