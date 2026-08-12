import { file } from 'node_modules/astro/dist/content/loaders/file';
import React, { useState } from 'react';
import { type UseFormReturn, useFieldArray } from 'react-hook-form';
import type{ ProductFormData } from '@/components/addProduct/form/schema';

// Tipamos a prop para receber os métodos do useForm vindo do pai
interface CreateProductFormProps {
    formMethods: UseFormReturn<ProductFormData>;
}

export function CreateProductForm({ formMethods }: CreateProductFormProps) {
    // Desestruturamos as funções necessárias de dentro do formMethods recebido
    const { register, handleSubmit, control, formState: { errors }, watch, setValue } = formMethods;
    const [imageFile, setImageFile] = useState<File | null>(null);

    
    
    const mainImagePreview = watch('mainImage.url');
    
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
         
        console.log("CHANGE");

        const file = e.target.files?.[0];
        if (file) {
            // 1. Cria uma URL temporária local para visualização instantânea
            const localUrl = URL.createObjectURL(file);
            
            // 2. Salva ambos os dados no estado do formulário
            setImageFile(file);// Arquivo binário para o upload depois
            setValue('mainImage.url', localUrl); // String blob:// para os previews lerem
        }
    };

    const { fields: paragraphFields, append: appendParagraph, remove: removeParagraph } = useFieldArray({
        control,
        name: "bodyParagraphs"
    });

    const onSubmit = async (data: ProductFormData) => {

        console.log('Dados do formulário enviados:', JSON.stringify(data));

        // try {
        //     const response = await fetch('/api/products', {
        //         method: 'POST',
        //         headers: { 'Content-Type': 'application/json' },
        //         body: JSON.stringify(data),
        //     });
        //     if (!response.ok) throw new Error('Erro ao salvar');
        //     alert('Produto criado com sucesso!');
        // } catch (error) {
        //     console.error(error);
        // }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-white p-6 shadow-sm border border-gray-100 rounded-xl h-full overflow-y-auto max-w-4xl mx-auto">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Dados do Produto</h2>
                <p className="text-sm text-gray-500 mt-1">Preencha as informações detalhadas para o cadastro do produto.</p>
            </div>

            <div className="space-y-5">
                {/* --- Campo: Nome --- */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Nome do Produto</label>
                    <input
                        {...register('name')}
                        className="w-full border border-gray-300 p-2.5 rounded-lg text-sm bg-white shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="Ex: Smartphone XYZ"
                    />
                </div>

                {/* --- Campo: Resumo --- */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Resumo (Summary)</label>
                    <textarea
                        {...register('summary')}
                        className="w-full border border-gray-300 p-2.5 rounded-lg text-sm bg-white shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        rows={3}
                        placeholder="Breve descrição comercial do produto..."
                    />
                </div>

                {/* --- Campo: Publicado --- */}
                <div className="flex items-center gap-3 py-2">
                    <input
                        type="checkbox"
                        {...register('published')}
                        id="published"
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 accent-blue-600 cursor-pointer"
                    />
                    <label htmlFor="published" className="text-sm font-medium text-gray-700 cursor-pointer select-none">
                        Publicar imediatamente?
                    </label>
                </div>

                <hr className="border-gray-200 my-6" />

                {/* --- Seção: Imagem Principal --- */}
                <div>
                    <h3 className="text-base font-semibold text-gray-800 mb-3">Imagem Principal</h3>
                    <div>
                        <label className="block text-sm font-medium mb-1">Selecionar Imagem</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Texto Alternativo (Alt)</label>
                        <input
                            {...register('mainImage.altText')}

                            placeholder="Ex: Foto de close do Donut de chocolate"
                            className="w-full border p-2 rounded bg-white mt-1"
                        />
                    </div>

                    {mainImagePreview && (
                        <div className="mt-2">
                            <p className="text-xs text-gray-500 mb-1">Preview interno do Form:</p>
                            <img src={mainImagePreview} alt="Preview" className="h-20 w-20 object-contain rounded border" />
                        </div>
                    )}
                </div>

                <hr className="border-gray-200 my-6" />

                {/* --- Seção Dinâmica: Parágrafos --- */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="text-base font-semibold text-gray-800">Parágrafos de Conteúdo</h3>
                            <p className="text-xs text-gray-500">Adicione blocos de texto dinâmicos para a página.</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => appendParagraph({ title: '', text: '', images: [] })}
                            className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border border-blue-200/50"
                        >
                            <span>+</span> Adicionar Parágrafo
                        </button>
                    </div>

                    {paragraphFields.map((field, index) => (
                        <div key={field.id} className="border border-gray-200 p-5 rounded-xl space-y-4 bg-gray-50/50 relative shadow-sm group">
                            <button
                                type="button"
                                onClick={() => removeParagraph(index)}
                                className="absolute top-4 right-4 text-xs font-semibold text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-2 py-1 rounded transition-colors"
                            >
                                Remover
                            </button>

                            <div className="pr-16"> {/* Evita que o título sobreponha o botão de remover */}
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Título do Parágrafo</label>
                                <input
                                    {...register(`bodyParagraphs.${index}.title` as const)}
                                    className="w-full border border-gray-300 p-2.5 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    placeholder="Título da seção"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Conteúdo (Texto)</label>
                                <textarea
                                    {...register(`bodyParagraphs.${index}.text` as const)}
                                    className="w-full border border-gray-300 p-2.5 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    rows={3}
                                    placeholder="Digite o texto aqui..."
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <hr className="border-gray-200 mt-8" />

            <button
                type="submit"
                className="w-full bg-green-500 p-3 rounded-xl font-semibold hover:bg-green-600 focus:outline-none focus:ring-4 focus:ring-blue-500/20 active:bg-blue-800 transition-all shadow-md shadow-blue-500/10"
            >
                Salvar e Enviar Produto
            </button>
        </form>
    );
}