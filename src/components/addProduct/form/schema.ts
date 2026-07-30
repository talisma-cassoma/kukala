import { z } from 'zod';

export const productFormSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  slug: z.string().min(1, 'Slug é obrigatório'),
  path: z.string().min(1, 'Caminho é obrigatório'),
  type: z.string(),
  summary: z.string().nullable().optional(),
  published: z.boolean(),
  
 mainImage: z.object({
    file: z.any().optional(), // Aqui vai o arquivo real para o upload posterior
    url: z.string(),          // Aqui vai o blob temporário e depois a URL real
    altText: z.string().min(1, 'Texto alternativo é obrigatório'),
  }).optional(),

  // Array de IDs para conectar tópicos existentes
  topics: z.array(z.object({ id: z.string() })),

  bodyParagraphs: z.array(z.object({
    title: z.string().min(1, 'Título do parágrafo é obrigatório'),
    //body: z.any(), // Pode mapear para o seu JSON de rich text posterior
    text: z.string().min(1, 'Texto do parágrafo é obrigatório'),
    order: z.number().optional(),
    images: z.array(z.object({
      url: z.string().url(),
      altText: z.string()
    }))
  })),

  tableSections: z.array(z.object({
    title: z.string().min(1, 'Título da seção é obrigatório'),
    order: z.number().optional(),
    properties: z.array(z.object({
      key: z.string().min(1, 'Chave obrigatória'),
      value: z.string().min(1, 'Valor obrigatório'),
      order: z.number().optional()
    }))
  })),

  optionGroups: z.array(z.object({
    name: z.string().min(1, 'Nome do grupo obrigatório'),
    required: z.boolean(),
    options: z.array(z.object({
      label: z.string().min(1, 'Label obrigatório'),
      price: z.coerce.number().min(0, 'Preço inválido'),
      available: z.boolean()
    }))
  })),

  // Array de IDs de produtos relacionados
  relatedProducts: z.array(z.string())
});

export type ProductFormData = z.input<typeof productFormSchema>;