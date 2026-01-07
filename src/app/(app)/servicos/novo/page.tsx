"use client"
import { useState, useTransition } from "react";
import { X, Save, FileText, Info, Check, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { createServiceAction } from "@/services/services/service.service";
import { FormField } from "@/components/ui/FormField";
import { DEFAULT_DOCUMENTS, useServiceStore } from "@/store/services/create_service_store";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/header/PageHeader";
import { DocumentChecklist } from "@/components/ui/document/DocumentCheckList";
import { formatUtils } from "@/lib/formatUtils";

export default function NewServicePage() {
  const { formData, isLoading, errors, setField, create } = useServiceStore();
  // const [currentDoc, setCurrentDoc] = useState("");
  const [ isPending, startTransition ] = useTransition();
  const router = useRouter();

  // const handleAddDoc = (e: React.KeyboardEvent) => {
  //   if (e.key === 'Enter' && currentDoc.trim()) {
  //     e.preventDefault();
  //     addDocument(currentDoc.trim().toUpperCase());
  //     setCurrentDoc("");
  //   }
  // };

  const handleSubmit = async () => {
    startTransition(async () => {
      const result = await create();

      if (result.success) {
        router.push("/servicos");
      } else if (result.error) {
        console.error(result.error);
        alert("Erro ao criar serviço.");
      }
    })
  };

  return (
    <div className="p-8 max-w-full animate-in fade-in duration-500">
      {/* Header com o layout original */}
      <PageHeader title="Configurar" highlight="Serviço" subtitle="Defina os valores padrão e a lista de documentos necessários." icon={FileText} />
      
      <div className="bg-white dark:bg-[#1a1a1a] rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 p-8 space-y-8">
        
        {/* Seção: Informações Básicas usando FormField */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <FormField 
              label="Nome do Serviço"
              placeholder="Ex: Transferência de Propriedade"
              value={formData.name}
              onChange={(e) => setField('name', e.target.value)}
              error={Array.isArray(errors.name) ? errors.name[0] : (errors.name)}
              // O FormField já cuida do label uppercase e estilo do input
            />
          </div>
          
          <div className="space-y-2">
            <FormField 
              label="Taxa do Estado (Custo)"
              placeholder="0.00"
              // value={formData.baseValue}
              // onChange={(e) => setField('baseValue', e.target.value)}
              value={
                new Intl.NumberFormat("pt-BR", { 
                  minimumFractionDigits: 2 
                }).format(Number(formData.baseValue ?? 0))
              }
              onChange={(e) => {
                const formatted = formatUtils.currency(e.target.value ?? 0);
                setField('baseValue', formatted);
              }}
              error={Array.isArray(errors.baseValue) ? errors.baseValue[0] : (errors.baseValue)}
              // O FormField já cuida do label uppercase e estilo do input
            />
          </div>

          <div className="space-y-2">
            <FormField 
              label="Valor de Venda Padrão"
              placeholder="0.00"
              // value={formData.finalValue}
              // onChange={(e) => setField('finalValue', e.target.value)}
              value={
                new Intl.NumberFormat("pt-BR", { 
                  minimumFractionDigits: 2 
                }).format(Number(formData.finalValue ?? 0))
              }
              onChange={(e) => {
                const formatted = formatUtils.currency(e.target.value ?? 0);
                setField('finalValue', formatted);
              }}
              error={Array.isArray(errors.finalValue) ? errors.finalValue[0] : (errors.finalValue)}
              // O FormField já cuida do label uppercase e estilo do input
            />
          </div>
        </div>

        {/* Seção: Documentos com Badges (Mantendo o estilo Card que você curtiu) */}
        <div className="space-y-4">
          <DocumentChecklist   />
        </div>

        {/* Campo de Observação original */}
        <div className="space-y-2">
          <label className="text-md font-bold text-gray-400 uppercase mb-3 ml-1">Observações Internas (Opcional)</label>
          <textarea 
            // value={store.notes}
            // onChange={(e) => store.setNotes(e.target.value)}
            className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-[#222] border-2 border-transparent focus:border-[#800020] outline-none transition-all text-sm min-h-[100px] resize-none"
            placeholder="Algum detalhe técnico sobre este serviço..."
          />
        </div>

        {/* Botão de Ação mantendo o design Save size 22 */}
        <Button 
          type="submit"
          isLoading={isPending || isLoading}
          className="w-full mt-8 py-5 shadow-xl shadow-[#800020]/20"
          onClick={handleSubmit}
        >
          <Save size={22} />&nbsp;
          Salvar Configuração
        </Button>
      </div>
    </div>
  );
}