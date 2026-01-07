'use client'
import React, { useEffect } from 'react';
import { 
  Landmark, Plus, ArrowRight, ShieldCheck, CreditCard
} from 'lucide-react';
import { Button } from '../Button';
import { SearchableSelect } from '../SearchableSelect';
import { FormField } from '../FormField';
import { useCreateBankAccountStore } from '@/store/bankAccount/create_bank_account_store';
import { useBankDataStore } from '@/store/bankAccount/bank_account_store';
import { useLoading } from '@/components/AppLoading';
import { formatUtils } from '@/lib/formatUtils';
import { DrawerWrapper } from '@/components/drawer/DrawerWrapper';

interface AddAccountDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

export function AddBankAccountDrawer({ isOpen, onClose, onSave }: AddAccountDrawerProps) {
  const { formData, errors, isLoading, setField } = useCreateBankAccountStore();
  const { availableBanks, fetchAvailableBanks } = useBankDataStore();
  const { startLoading, stopLoading } = useLoading();  

  useEffect(() => {
    if (isOpen && availableBanks.length === 0) {
      startLoading("Sincronizando contas...");
      fetchAvailableBanks().finally(() => stopLoading());
    }
  }, [isOpen]);

  // Se o store estiver em loading, mostramos um estado de espera dentro do drawer ou nem abrimos
  // Aqui optei por deixar o DrawerWrapper lidar com a visibilidade
  
  return (
    <DrawerWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="Vincular Nova Conta"
      subtitle="Setup de Instituição"
      maxWidth="max-w-[500px]"
      icon={<Plus size={18} className="text-blue-600" />}
      footer={
        <Button 
          onClick={() => onSave(formData)}
          className="w-full flex items-center justify-center gap-2 px-4 py-4 bg-gray-900 dark:bg-white dark:text-black text-white text-[11px] font-black uppercase rounded-2xl hover:scale-[1.02] transition-all shadow-xl active:scale-95"
        >
          Confirmar e Gerar Card <ArrowRight size={16} />
        </Button>
      }
    >
      <div className="space-y-8">
        
        {/* SEÇÃO 1: SELEÇÃO DO BANCO */}
        <div className="space-y-4">
          <h4 className="text-[11px] font-black text-blue-600 uppercase tracking-[0.2em] flex items-center gap-2">
            <Landmark size={16} /> Instituição Financeira
          </h4>
          <SearchableSelect 
            options={availableBanks.map((bank) => ({
               label: bank.name, value: bank.id 
            }))} 
            value={formData.bankId} 
            onChange={(value) => setField('bankId', value)}   
            error={Array.isArray(errors.bankId) ? errors.bankId[0] : (errors.bankId)}
          />
        </div>

        {/* SEÇÃO 2: DADOS DO CARD */}
        <div className="space-y-4">
          <h4 className="text-[11px] font-black text-blue-600 uppercase tracking-[0.2em] flex items-center gap-2">
            <CreditCard size={16} /> Personalização do Card
          </h4>
          <div className="grid grid-cols-1 gap-4 bg-gray-50 dark:bg-white/[0.02] p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800">
            <FormField 
              label="Apelido da Conta (Ex: Principal PJ)"
              type="text"
              placeholder='Ex: Banco do Brasil - Principal'
              // value={formData.nickname || ''}
              // onChange={(e) => setField('nickname', e.target.value)}
              error={Array.isArray(errors.nickname) ? errors.nickname[0] : (errors.nickname)}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField 
                as="select" 
                label="Tipo"
                // value={formData.accountType || 'Corrente'} 
                options={[
                  { label: 'Corrente', value: 'Corrente' }, 
                  { label: 'Poupança', value: 'Poupança' }
                ]} 
                // onChange={(e) => setField('accountType', e.target.value)} 
                error={Array.isArray(errors.accountType) ? errors.accountType[0] : (errors.accountType)}
              />

              <FormField 
                label="Saldo Inicial"
                placeholder="0,00"
                value={
                  new Intl.NumberFormat("pt-BR", { 
                    minimumFractionDigits: 2 
                  }).format(Number(formData.balance ?? 0))
                }
                onChange={(e) => {
                  const formatted = formatUtils.currency(e.target.value ?? 0);
                  setField('balance', formatted);
                }}
                error={Array.isArray(errors.balance) ? errors.balance[0] : (errors.balance)}
              />
            </div>
          </div>
        </div>

        {/* SEÇÃO 3: SEGURANÇA E DOCUMENTAÇÃO */}
        <div className="space-y-4">
          <h4 className="text-[11px] font-black text-blue-600 uppercase tracking-[0.2em] flex items-center gap-2">
            <ShieldCheck size={16} /> Verificação Técnica
          </h4>
          
          <div className="space-y-4">
            <div className='grid grid-cols-2 gap-4'>
              <FormField 
                label="Agência"
                type="text"
                value={formData.agency || ''}
                placeholder='0001'
                onChange={(e) => setField('agency', e.target.value)}
                error={Array.isArray(errors.agency) ? errors.agency[0] : (errors.agency)}
              />

              <FormField 
                label="Conta"
                type="text"
                value={formData.account || ''}
                placeholder='00000-0'
                onChange={(e) => setField('account', e.target.value)}
                error={Array.isArray(errors.account) ? errors.account[0] : (errors.account)}
              />
            </div>

             <div className="bg-blue-50/50 dark:bg-blue-500/5 p-5 rounded-[1.5rem] border border-blue-100 dark:border-blue-500/10">
               <FormField 
                  label='CPF/CNPJ do Titular'
                  type="text"
                  placeholder='00.000.000/0001-00'
                  value={formData.cnpj || ''}
                  onChange={(e) => setField('cnpj', e.target.value)}
                  error={Array.isArray(errors.cnpj) ? errors.cnpj[0] : (errors.cnpj)}
                />
               <p className="text-[10px] font-bold text-blue-400 uppercase mt-3 flex items-center gap-1.5 italic">
                 <span className="w-1 h-1 bg-blue-400 rounded-full" />
                 Obrigatório para conciliação bancária automática
               </p>
             </div>
          </div>
        </div>
      </div>
    </DrawerWrapper>
  );
}