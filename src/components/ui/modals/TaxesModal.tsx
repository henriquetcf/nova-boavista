'use client'
import { useEffect } from 'react';
import { ReceiptText, Check, Save } from 'lucide-react';
import { FormField } from '../FormField';
import { Button } from '../Button';
import { ModalWrapper } from './wrapper/ModalWrapper';
import { useTransactionStore } from '@/store/transaction/transaction_store';
import { useBankDataStore } from '@/store/bankAccount/bank_account_store';
import { SearchableSelect } from '../SearchableSelect';
import { ProcessEntity } from '@/domain/entities/process.entity';

interface TaxesModalProps {
  isOpen: boolean;
  onClose: () => void;
  process: ProcessEntity | null;
  onSave: (data: any) => void;
}

export function TaxesModal({ isOpen, onClose, process, onSave }: TaxesModalProps) {

  const { formData, isLoading, errors, execute, setType, setField, reset } = useTransactionStore();
  const { accounts, fetchAccounts } = useBankDataStore();

  useEffect(() => {
    fetchAccounts();
    setType('TAX_OUT');
    setField('method', 'DEPOSIT');
  }, []);

  if (!process) return null;
  if (isLoading) return <div>Loading...</div>;

  const totalToPay = process.services
    ?.filter((s) => formData.services?.includes(s.id))
    .reduce((acc: number, curr) => acc + Number(curr.baseValue), 0) || 0;

  const services = process.services
    ?.filter((s) => s.isPaid === false);

  console.log('process', process);
  console.log('services', services);

  const handleClose = () => {
    reset();
    onClose();
  };
  
  const handleServiceSelect = (serviceId: string) => {
    if (!formData.services?.includes(serviceId)) {
      setField('services', [...formData.services || [], serviceId]);
      console.log('services', formData.services);
    } else {
      // setSelectedServices([...selectedServices, serviceId]);
      setField('services', formData.services?.filter((id) => id !== serviceId));
    }
  };

  const handleConfirm = async () => {
    setType('TAX_OUT');
    setField('method', 'DEPOSIT');
    setField('value', totalToPay.toString());
    console.log('data', formData);
    if (formData.services?.length === 0) return;

    await execute();
    onSave({
      serviceIds: formData.services,
      totalAmount: totalToPay,
      bankId: formData.originAccountId,
      type: 'TAX_OUT'
    });
  };

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={handleClose}
      title="Liquidar Taxas / Custos"
      subtitle="Pagamento de taxas e custos"
      maxWidth="max-w-xl"
      icon={<ReceiptText className="text-orange-600" size={20} />}
      footer={
        <div className="flex w-full gap-3">
          <Button 
            variant="ghost" 
            onClick={handleClose}
            className="flex-1 py-4 text-gray-400 font-black uppercase text-[10px]"
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleConfirm}
            disabled={formData.services?.length === 0 || formData.originAccountId === ''}
            className="flex-[2] py-4 bg-orange-600 hover:bg-orange-700 text-white font-black uppercase rounded-2xl shadow-xl shadow-orange-600/20 disabled:opacity-50 disabled:grayscale transition-all flex items-center justify-center gap-2"
          >
            <Save size={18} />
            Confirmar Pagamento
          </Button>
        </div>
      }
    >
      <div className="space-y-8">
        
        {/* DISPLAY DE VALOR TOTAL (ESTILIZADO ORANGE) */}
        <div className="space-y-3">
          <label className="text-[11px] font-black text-orange-600 uppercase tracking-[0.2em] ml-1">
            Total Selecionado
          </label>
          <div className="relative group">
            <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-orange-300 italic text-2xl">
              R$
            </span>
            <input 
              type="text" 
              readOnly
              value={totalToPay.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              className="w-full pl-16 pr-8 py-7 bg-orange-50/30 dark:bg-orange-500/5 border border-orange-100 dark:border-orange-500/10 rounded-[2rem] font-black text-4xl outline-none text-orange-700 dark:text-orange-400 tabular-nums"
            />
          </div>
        </div>

        {/* CONTA DE ORIGEM */}
        <div className="space-y-3">
          <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">
            Conta de Origem (Saída)
          </label>
          <SearchableSelect 
            value={formData.originAccountId}
            onChange={(e) => setField('originAccountId', e)}
            options={accounts.map((a) => ({ value: a.id, label: a.bank?.name ?? '' }))}
          />
        </div>

        {/* CHECKLIST DE TAXAS */}
        <div className="space-y-4">
          <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1 flex justify-between">
            <span>Itens Disponíveis</span>
            <span className="text-[9px] text-orange-500">{services?.length} selecionados</span>
          </label>
          
          <div className="grid grid-cols-1 gap-2 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
            {services?.map((s) => {
              const isSelected = formData.services?.includes(s.id);
              console.log('isSelected', isSelected);
              return (
                <button 
                  key={s.id}
                  onClick={() => handleServiceSelect(s.id)}
                  className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all active:scale-[0.98] ${
                    isSelected 
                      ? 'border-orange-500 bg-orange-500/5 shadow-sm' 
                      : 'border-gray-50 dark:border-white/5 hover:border-gray-200 dark:hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center border-2 transition-colors ${
                      isSelected ? 'bg-orange-500 border-orange-500 text-white' : 'border-gray-200 dark:border-gray-800 text-transparent'
                    }`}>
                      <Check size={14} strokeWidth={4} />
                    </div>
                    <span className={`text-sm font-black uppercase tracking-tight transition-colors ${
                      isSelected ? 'text-gray-900 dark:text-white' : 'text-gray-500'
                    }`}>
                      {s.name}
                    </span>
                  </div>
                  <span className={`text-sm font-bold tabular-nums italic ${
                    isSelected ? 'text-orange-600' : 'text-gray-400'
                  }`}>
                    R$ {Number(s.baseValue).toFixed(2)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
}