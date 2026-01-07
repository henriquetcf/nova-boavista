'use client'
import React, { useEffect } from 'react';
import { Landmark, DollarSign, ArrowRightLeft, ArrowDownLeft } from 'lucide-react';
import { Button } from '../Button';
import { FormField } from '../FormField';
import { SearchableSelect } from '../SearchableSelect';
import { useTransactionStore } from '@/store/transaction/transaction_store';
import { DrawerWrapper } from '@/components/drawer/DrawerWrapper';
import { formatUtils } from '@/lib/formatUtils';

interface TransactionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: () => void;
  type: 'DEPOSIT' | 'TRANSFER';
  accounts: any[];
}

export default function TransactionDrawer({ isOpen, onClose, onSave, type = 'TRANSFER', accounts }: TransactionDrawerProps) {
  const { formData, isLoading, errors, execute, setType, setField, reset } = useTransactionStore();

  useEffect(() => {
    if (isOpen) setType(type);
  }, [isOpen, type, setType]);

  const isTransfer = type === 'TRANSFER';
  const selectOptions = accounts.map((account: any) => ({ 
    value: account.id, 
    label: account.bank.name 
  }));


  const handleClose = () => {
    reset();
    onClose();
  };

  const handleConfirm = async () => {
    const result = await execute(); 
    if (result.success) {
      onClose();
      reset();
      onSave?.();
    } else {
      console.error('[TRANSACTION DRAWER] Error handle confirm:', result.error);
    }
  };

  return (
    <DrawerWrapper
      isOpen={isOpen}
      onClose={handleClose}
      title={isTransfer ? 'Transferir Saldo' : 'Novo Depósito'}
      subtitle="Movimentação de Caixa"
      maxWidth="max-w-[500px]"
      icon={isTransfer ? <ArrowRightLeft size={20} className="text-blue-600" /> : <ArrowDownLeft size={20} className="text-emerald-600" />}
      footer={
        <Button 
          onClick={handleConfirm}
          className={`w-full py-5 rounded-3xl font-black uppercase tracking-[0.2em] text-[11px] shadow-xl transition-all active:scale-95 ${
            isTransfer ? 'bg-blue-600 hover:bg-blue-700' : 'bg-emerald-600 hover:bg-emerald-700'
          } text-white`}
        >
          Confirmar {isTransfer ? 'Transferência' : 'Depósito'}
        </Button>
      }
    >
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-40 space-y-3">
          <div className="w-6 h-6 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
          <p className="font-black text-[10px] text-gray-400 uppercase tracking-widest">Processando...</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* SEÇÃO 1: ORIGEM E DESTINO */}
          <div className="space-y-6">
            <h4 className="text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
              <Landmark size={14} /> Fluxo do Dinheiro
            </h4>

            <div className="grid grid-cols-1 gap-6 bg-gray-50 dark:bg-white/[0.02] p-6 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 relative">
              {isTransfer && (
                <>
                  <SearchableSelect 
                    label="Conta de Origem" 
                    options={selectOptions?.filter((opt: any) => opt.value !== formData?.destinationAccountId) || []} 
                    onChange={(id) => setField('originAccountId', id)} 
                    value={formData.originAccountId} 
                    error={Array.isArray(errors.originAccountId) ? errors.originAccountId[0] : errors.originAccountId}
                  />
                  
                  {/* Conexão Visual */}
                  <div className="absolute left-1/2 -translate-x-1/2 top-[45%] z-10 bg-white dark:bg-[#161616] p-2 rounded-full border border-gray-100 dark:border-gray-800 text-blue-500 shadow-sm">
                    <ArrowDownLeft size={16} />
                  </div>
                  <div className='py-1'></div>
                </>
              )}

              <SearchableSelect 
                label={isTransfer ? "Conta de Destino" : "Conta para Depósito"} 
                options={selectOptions?.filter((opt: any) => opt.value !== formData?.originAccountId) || []} 
                onChange={(id) => setField('destinationAccountId', id)} 
                value={formData.destinationAccountId} 
                error={Array.isArray(errors.destinationAccountId) ? errors.destinationAccountId[0] : errors.destinationAccountId}
              />
            </div>
          </div>

          {/* SEÇÃO 2: VALORES */}
          <div className="space-y-6">
            <h4 className="text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
              <DollarSign size={14} /> Detalhes do Lançamento
            </h4>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField 
                label="Valor (R$)"
                type="number" 
                placeholder="0,00"
                // value={formData.value || ''}
                // onChange={(e) => setField('value', e.target.value)}
                value={
                  new Intl.NumberFormat("pt-BR", { 
                    minimumFractionDigits: 2 
                  }).format(Number(formData.value ?? 0))
                }
                onChange={(e) => {
                  const formatted = formatUtils.currency(e.target.value ?? 0);
                  setField('value', formatted);
                }}
                error={Array.isArray(errors.value) ? errors.value[0] : errors.value}
              />
              <FormField 
                label="Data"
                type="date" 
                value={formData.date || ''}
                onChange={(e) => setField('date', e.target.value)}
                error={Array.isArray(errors.date) ? errors.date[0] : errors.date}
              />
            </div>

            <FormField 
              label="Observação / Descrição"
              type="text" 
              placeholder="Ex: Reembolso de taxas"
              value={formData.description || ''}
              onChange={(e) => setField('description', e.target.value)}
            />
          </div>
        </div>
      )}
    </DrawerWrapper>
  );
}