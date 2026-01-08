'use client'
import { useState } from "react";
import { UserPlus, ShieldCheck, Smartphone, Fingerprint, Save } from "lucide-react";
import { FormField } from "../FormField";
import { Button } from "../Button";
import { ModalWrapper } from "./wrapper/ModalWrapper";
import { formatUtils } from "@/lib/formatUtils";
import { useCreateClientStore } from "@/store/client/create_client_store";

interface QuickClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (client: { value: string, label: string }) => void;
}

export function QuickClientModal({ isOpen, onClose, onSuccess }: QuickClientModalProps) {
  const [loading, setLoading] = useState(false);
  // const [formData, setFormData] = useState({ name: '', document: '', phone: '' });
  const { formData, setField, create, reset } = useCreateClientStore();

  function handleClose() {
    reset();
    onClose();
  }

  async function handleSubmit() {
    if (!formData.name) return;
    
    setLoading(true);
    try {
      // const result = await createClientAction(formData);
      const result = await create();

      if (result.success && result.client) {
        onSuccess({ 
          value: result.client.id, 
          label: result.client.name 
        });
        
        onClose();
        onSuccess({ value: result.client.id, label: result.client.name });
        reset();
      }
    } catch (error) {
      console.error("Erro ao salvar:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={handleClose}
      title="Novo Cliente Rápido"
      subtitle="Entrada de Dados"
      maxWidth="max-w-md"
      icon={<UserPlus size={20} className="text-[#800020]" />}
      footer={
        <div className="flex w-full gap-3">
          <Button 
            variant="ghost" 
            className="flex-1 py-4 font-black uppercase text-[10px] text-gray-400 tracking-widest"
            onClick={handleClose}
          >
            Cancelar
          </Button>
          <Button 
            variant="primary" 
            className="flex-[2] py-4 bg-[#800020] hover:bg-[#600018] text-white font-black uppercase rounded-2xl shadow-xl shadow-[#800020]/20 flex items-center justify-center gap-2"
            isLoading={loading}
            onClick={handleSubmit}
          >
            <Save size={18} />
            Salvar Cliente
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Nome do Cliente */}
        <div className="space-y-2">
          <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
            <Fingerprint size={14} className="text-[#800020]" /> Identificação Nominal
          </label>
          <FormField 
            placeholder="NOME COMPLETO OU RAZÃO SOCIAL"
            value={formData.name} 
            onChange={e => setField('name', e.target.value.toUpperCase())} 
          />
        </div>

        <div className="grid grid-cols-1 gap-5">
          {/* Documento */}
          <div className="space-y-2">
            <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
              <ShieldCheck size={14} className="text-[#800020]" /> CPF / CNPJ
            </label>
            <FormField 
              placeholder="000.000.000-00"
              value={formData.document}
              // onChange={e => setFormData({...formData, document: e.target.value})} 
              onChange={(e) => {
                const formatted = e.target.value.length > 14 ? formatUtils.cnpj(e.target.value) : formatUtils.cpf(e.target.value);
                setField('document', formatted);
              }}
            />
          </div>

          {/* Telefone */}
          <div className="space-y-2">
            <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
              <Smartphone size={14} className="text-[#800020]" /> Contato Direto
            </label>
            <FormField 
              placeholder="(00) 0 0000-0000"
              value={formData.phone ?? ''} 
              // onChange={e => setFormData({...formData, phone: e.target.value})} 
              onChange={(e) => {
                const formatted = formatUtils.phone(e.target.value);
                setField('phone', formatted);
              }}
            />
          </div>
        </div>

        {/* Info Box Estilizada em Vinho */}
        <div className="p-4 bg-[#800020]/5 dark:bg-[#800020]/10 rounded-2xl border border-[#800020]/10">
          <p className="text-[10px] text-[#800020] dark:text-[#a04050] font-bold uppercase leading-relaxed text-center tracking-tight">
            Este cadastro permite o faturamento imediato e a vinculação de novos processos.
          </p>
        </div>
      </div>
    </ModalWrapper>
  );
} 