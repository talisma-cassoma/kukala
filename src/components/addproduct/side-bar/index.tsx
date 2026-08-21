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
import { TableField, type TableOption } from "@/components/addproduct/side-bar/table"
import { Store } from "lucide-react"
import { ImagePreview } from "@/components/addproduct/side-bar/ImagePreview"
import { Paragraphes } from "@/components/addproduct/side-bar/paragraph"
import { getSupabaseClient } from "@/lib/supabase"
import { toast } from "sonner"
import { uploadImage } from "@/lib/uploadImage"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const topicsList = ["new", "promo", "solde"]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { product, setProduct } = useProduct();
  const [productUrl, setProductUrl] = useState<string | null>(product.image?.url ?? null)
  const [mainImageFile, setMainImageFile] = useState<File | null>(null)
  const [paragraphImageFiles, setParagraphImageFiles] = useState<(File | null)[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>(topicsList)
  const [tables, setTables] = useState<TableOption[][]>(product.table.sections.map((section) =>
    (section.properties || []).map((property) => ({
      title: section.title,
      props: property.key,
      value: property.value,
    }))
  ));


  useEffect(() => {
    setProduct((prev) => ({
      ...prev,
      image: {
        ...prev.image,
        url: productUrl ?? "",
        altText: prev.image?.altText || `${prev.name || "product"} image`,
      },
    }))
  }, [productUrl])

  useEffect(() => {
    //fill product
    setProduct((prev) => ({
      ...prev,
      topics: selectedTags.map((tag) => ({ name: tag })),
    }))
  }, [selectedTags])

  useEffect(() => {
    if (!tables || tables.length === 0) return;

    setProduct((prev) => ({
      ...prev,
      table: {
        ...prev?.table,
        sections: tables.map((table, index) => ({
          // Preserva o título existente da seção se houver, ou usa o padrão
          title: prev?.table?.sections?.[index]?.title || "Détails sur l'emballage",
          properties: table.map((item) => ({
            key: item.props,
            value: item.value,
          })),
        })),
      },
    }));
  }, [tables]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const supabase = getSupabaseClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const productSlug = product.name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "_")
        .replace(/[^a-z0-9_]/g, "")
        .replace(/_+/g, "_")
        .replace(/^_|_$/g, "");

      const uploadedProduct = structuredClone(product);

      if (mainImageFile) {
        uploadedProduct.image.url = await uploadImage(
          mainImageFile,
          productSlug,
          "",
          `thumbnail${mainImageFile.name.slice(mainImageFile.name.lastIndexOf("."))}`,
        );

        console.log("image URL: ",  uploadedProduct.image.url)
      }

      

      for (const [index, file] of paragraphImageFiles.entries()) {
        if (!file || !uploadedProduct.body.paragraphs[index]) continue;

        uploadedProduct.body.paragraphs[index].images[0].url = await uploadImage(
          file,
          productSlug,
          "body",
          `${index}-${file.name}`,
        );
      }

      const response = await fetch("/api/products/admin/add-product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ product: uploadedProduct }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update order: ${response.statusText}`);
      }

      toast.success("Order updated successfully.");
    } catch (error) {
      toast.error("Failed to update order.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
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
           <div className="flex flex-col gap-3">
                                          <Label htmlFor="status">Status</Label>
                                          <Select
                                              value={product.__typename}
                                              onValueChange={(value) => {
                                                  setProduct((prev) => ({
                                                      ...prev,
                                                      __typename: value,
                                                  }));
                                              }}
                                          >
                                              <SelectTrigger id="status" className="w-full">
                                                  <SelectValue placeholder="Select a status" />
                                              </SelectTrigger>
                                              <SelectContent>
                                                  <SelectGroup>
                                                      <SelectItem value="COMBOBOX">COMBOBOX
    
    </SelectItem>
                                                      <SelectItem value="RETAIL">RETAIL</SelectItem>
                                                      <SelectItem value="FULFILLED">DISCOUNTED</SelectItem>
                                                    
                                                  </SelectGroup>
                                              </SelectContent>
                                          </Select>
                                      </div>
          
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
          <ImagePreview
            url={productUrl}
            setUrl={setProductUrl}
            onChange={setMainImageFile}
          />

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

          <Paragraphes
            onFileChange={(index, file) => {
              setParagraphImageFiles((prev) => {
                const next = [...prev]
                next[index] = file
                return next
              })
            }}
          />

          {tables.map((table, index) => (
            <TableField
              key={index}
              title={product.table.sections[index]?.title ?? "Détails sur l'emballage"}
              tableFild={table}
              setTableFild={(action) => {
                setTables((prevTables) =>
                  prevTables.map((prevTable, sectionIndex) => {
                    if (sectionIndex !== index) return prevTable;

                    // Se 'action' for uma função, executa passando a tabela atual
                    return typeof action === "function" ? action(prevTable) : action;
                  })
                );
              }}
            />
          ))}

          <div className="flex w-full justify-center">

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Registrando..." : "Registrar produto"}
            </Button>
          </div>
        </form>
      </SidebarContent>
      {/* Rodapé fixo para ações/botões de envio */}
      <SidebarFooter className="border-t p-4 flex gap-2">
      </SidebarFooter>
    </Sidebar>
  )
}