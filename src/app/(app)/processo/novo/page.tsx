'use client'
import React, { useState, useMemo, useEffect, useTransition } from "react";
import { FormField } from "@/components/ui/FormField";
import { SearchableSelect } from "@/components/ui/SearchableSelect";
import { Button } from "@/components/ui/Button";
import { QuickClientModal } from "@/components/ui/modals/QuickClientModal";
import { Plus, Trash2, User, ReceiptText, FileText } from "lucide-react";
import { useProcessStore } from "@/store/process/create_process_store";
import { useRouter } from "next/navigation";
import { formatUtils } from "@/lib/formatUtils";
import { PlatePreview } from "@/components/ui/PlatePreview";
import { PageHeader } from "@/components/ui/header/PageHeader";
import { useServiceDataStore } from "@/store/services/service_store";
import { useClientDataStore } from "@/store/client/client_store";

export default function NewProcessPage() {
  
  const { formData, addService, removeService, updateServicePrice, setField, errors, setErrors, isLoading, create } = useProcessStore();
  const { services, fetchServicesForSelect } = useServiceDataStore();
  const { clients, fetchClientForSelect, addClient } = useClientDataStore();

  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      await fetchServicesForSelect();
      await fetchClientForSelect();
    })();
  }, []);

  // Adiciona um serviço à lista e atualiza o valor total
  const handleAddService = (serviceId: string) => {
    if (!serviceId) return;

    const service = services?.find(s => s.id === serviceId);
    if (service) {
      addService(service);

      // Se havia um erro, a gente limpa ele agora
      if (errors.services) {
        setErrors({ ...errors, services: undefined });
      }
    }
  };

  console.log('services', services);
  const [ isPending, startTransition ] = useTransition();

  const selectedClient = useMemo(() => 
    clients?.find(c => c.id === formData.clientId),
  [formData.clientId, clients]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // const result2 = ProcessSchema.safeParse(formData);

    // if (!result2.success) {
    //   // Isso vai te mostrar exatamente qual campo o Zod reprovou
    //   console.error("ERRO DE VALIDAÇÃO ZOD:", result2.error.format());
    //   setErrors(result2.error.flatten().fieldErrors);
    //   return;
    // }

    startTransition(async () => {
      const result = await create();

      if (!result.success) {
        // toast.success("Processo criado com sucesso!");
        console.error(result.error);
        return;
      }
      router.push("/processo"); // Redireciona para a listagem
    });
  }

  return (
    <div className="p-8 max-w-full animate-in fade-in duration-500">
      <PageHeader title="Abertura de" highlight="Processo" subtitle="Gerencie múltiplos serviços para um único veículo e cliente." icon={FileText} />
      {/* <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Abertura de Processo</h1>
        <p className="text-gray-500 mt-1">Gerencie múltiplos serviços para um único veículo e cliente.</p>
      </div> */}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* COLUNA DA ESQUERDA: FORMULÁRIO */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* CARD: CLIENTE E VEÍCULO */}
            <section className="bg-white dark:bg-[#1a1a1a] p-8 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <User className="text-[#800020] w-5 h-5" />
                <h2 className="font-bold text-lg dark:text-white">Identificação</h2>
              </div>

              <div className="flex items-start gap-2">
                <div className="flex-1">
                  <SearchableSelect 
                    label="Cliente Responsável"
                    placeholder="Selecione o cliente..."
                    options={clients?.map(c => ({ label: c.name, value: c.id }))}
                    value={formData.clientId}
                    onChange={(val) => setField('clientId', val)}
                    error={Array.isArray(errors.clientId) ? errors.clientId[0] : errors.clientId}
                  />
                </div>
                <button 
                  type="button"
                  onClick={() => setIsClientModalOpen(true)}
                  className="mt-6 p-3.5 bg-[#800020]/10 text-[#800020] rounded-xl hover:bg-[#800020]/20 transition-colors"
                  title="Novo Cliente"
                >
                  <Plus size={20} strokeWidth={3} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField 
                  label="Placa do Veículo" 
                  placeholder="ABC1D23"
                  value={formData.plate}
                  onChange={(e) => {
                    const formatted = formatUtils.plate(e.target.value);
                    setField('plate', formatted);
                  }}
                  maxLength={7}
                  error={Array.isArray(errors.plate) ? errors.plate[0] : errors.plate}
                />
                <FormField 
                  label="RENAVAM" 
                  placeholder="00000000000"
                  value={formData.renavam}
                  onChange={(e) => {
                    const formatted = formatUtils.renavam(e.target.value);
                    setField('renavam', formatted);
                  }}
                  error={Array.isArray(errors.renavam) ? errors.renavam[0] : errors.renavam}
                  maxLength={11}
                />
                {/* Preview da Placa centralizado */}
                {
                  formData.plate != '' &&
                    <PlatePreview plate={formData.plate} />
                }
              </div>
            </section>

            {/* CARD: SERVIÇOS */}
            <section className="bg-white dark:bg-[#1a1a1a] p-8 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
              <div className="flex items-start gap-2 mb-2">
                <ReceiptText className="text-[#800020] w-5 h-5" />
                <h2 className="font-bold text-lg dark:text-white">Serviços Solicitados</h2>
              </div>

              <SearchableSelect 
                label="Adicionar Serviço"
                placeholder="Busque um serviço para adicionar à lista..."
                options={services?.map((svc) => ({ label: svc.name, value: svc.id })) ?? []}
                value="" // Sempre vazio para permitir múltiplas adições
                onChange={handleAddService}
                error={Array.isArray(errors.services  ) ? errors.services[0] : errors.services}
              />

              {/* Lista de serviços adicionados */}
              <div className="mt-4 space-y-2">
                {formData.services.map((svc) => (
                  <div key={svc.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#222] rounded-xl border border-gray-100 dark:border-gray-800 transition-all hover:border-[#800020]/30">
                    <div className="flex-1 mr-4">
                      <p className="font-bold text-sm dark:text-white mb-1">{svc.name}</p>
                      
                      {/* Input de Valor Customizado */}
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-bold text-[#800020]">R$</span>
                        <input 
                          type="text"
                          value={
                            new Intl.NumberFormat("pt-BR", { 
                              minimumFractionDigits: 2 
                            }).format(Number(svc.finalValue ?? 0))
                          }
                          onChange={(e) => {
                            const formatted = formatUtils.currency(e.target.value ?? 0);
                            updateServicePrice(svc.id, formatted);
                          }}
                          className="bg-transparent border-b border-dashed border-gray-300 dark:border-gray-600 focus:border-[#800020] outline-none text-sm font-medium text-[#800020] w-24 transition-colors"
                        />
                        <span className="text-[10px] text-gray-400 ml-2 italic">(ajustável)</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => removeService(svc.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
                {formData.services.length === 0 && (
                  <div className="text-center py-6 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-xl text-gray-400 text-sm">
                    Nenhum serviço selecionado ainda.
                  </div>
                )}
              </div>

              <FormField 
                label="Valor Final do Processo (R$)"
                // type="number"
                step="0.01"
                value={
                  new Intl.NumberFormat("pt-BR", { 
                    minimumFractionDigits: 2 
                  }).format(Number(formData.totalValue ?? 0))
                }
                onChange={(e) => setField('totalValue', formatUtils.currency(e.target.value ?? 0))}
                error={errors.totalValue?.[0]}
              />
            </section>
          </div>

          {/* COLUNA DA DIREITA: RESUMO FIXO */}
          <div className="space-y-6">
            <div className="bg-[#800020]/5 dark:bg-[#800020]/10 p-6 rounded-2xl border border-[#800020]/20 sticky top-6">
              <h3 className="font-bold text-[#800020] mb-6 flex items-center gap-2 uppercase text-xs tracking-widest">
                Resumo do Atendimento
              </h3>
              
              {/* Informações do Cliente no Resumo */}
              <div className="mb-6 space-y-3">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Cliente</span>
                  <span className="text-sm font-bold dark:text-white truncate">
                    {selectedClient ? selectedClient.name : 'Não selecionado'}
                  </span>
                  {selectedClient && <span className="text-xs text-gray-500">{selectedClient.document}</span>}
                </div>
                
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Veículo</span>
                  <span className="text-sm font-bold dark:text-white">
                    {formData.plate ? `Placa: ${formData.plate}` : 'Placa não informada'}
                  </span>
                </div>
              </div>

              {/* Listagem de itens no Resumo */}
              <div className="space-y-3 pt-4 border-t border-[#800020]/10">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Itens do Processo</span>
                {formData.services.map(svc => (
                  <div key={svc.id} className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">{svc.name}</span>
                    <span className="font-medium dark:text-white">R$ {svc.finalValue}</span>
                  </div>
                ))}
                {formData.services.length === 0 && <p className="text-xs italic text-gray-400">Aguardando serviços...</p>}
              </div>

              {/* Valor Total */}
              <div className="mt-8 pt-4 border-t-2 border-dashed border-[#800020]/20 flex justify-between items-end">
                <span className="font-bold text-gray-600 dark:text-gray-400">Total</span>
                <div className="text-right">
                  <p className="text-2xl font-black text-[#800020]">R$ {new Intl.NumberFormat("pt-BR", { 
                    minimumFractionDigits: 2 
                  }).format(Number(formData.totalValue ?? 0))}</p>
                </div>
              </div>

              <Button 
                type="submit"
                isLoading={isPending || isLoading}
                className="w-full mt-8 py-7 shadow-xl shadow-[#800020]/20"
              >
                Finalizar Cadastro
              </Button>

              {/* <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancelar
            </Button> */}
            {/* <Button type="submit" y */}
            </div>
          </div>
        </div>
      </form>

      <QuickClientModal 
        isOpen={isClientModalOpen} 
        onClose={() => setIsClientModalOpen(false)}
        onSuccess={(newClient) => {
          addClient(newClient); // Adiciona na lista global
          setField('clientId', newClient.value); // Seleciona ele no formulário
          setField('clientName', newClient.label);
        }}
      />
    </div>
  );
}