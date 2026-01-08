'use client'
import { useEffect } from 'react';
import { CreditCard, Landmark, Banknote, Save } from 'lucide-react';
import { FormField } from '../FormField';
import { Button } from '../Button';
import { ModalWrapper } from './wrapper/ModalWrapper';
import { formatUtils } from '@/lib/formatUtils';
import { useTransactionStore } from '@/store/transaction/transaction_store';
import { useBankDataStore } from '@/store/bankAccount/bank_account_store';
import { SearchableSelect } from '../SearchableSelect';
import { ProcessEntity } from '@/domain/entities/process.entity';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  process: ProcessEntity | null;
  onSave: (data: any) => void;
}

export function PaymentModal({ isOpen, onClose, process, onSave }: PaymentModalProps) {

  const methods = [
    { id: 'PIX', icon: <div className="w-4 h-4 rounded-full bg-cyan-500" />, label: 'PIX' },
    { id: 'CASH', icon: <Banknote size={18} className="text-emerald-500" />, label: 'Dinheiro' },
    { id: 'DEBIT_CARD', icon: <CreditCard size={18} className="text-green-500" />, label: 'Cartão de Débito' },
    { id: 'CREDIT_CARD', icon: <CreditCard size={18} className="text-blue-500" />, label: 'Cartão de Crédito' },
    { id: 'BANK_TRANSFER', icon: <Landmark size={18} className="text-purple-500" />, label: 'TED' },
    { id: 'BANK_DOC', icon: <Landmark size={18} className="text-gray-500" />, label: 'DOC' },
    // { id: 'BANK_TRANSFER', icon: <Landmark size={18} className="text-purple-500" />, label: 'Transferência' },
  ];

  const { formData, isLoading, errors, execute, setType, setField, reset } = useTransactionStore();
  const { accounts, fetchAccounts } = useBankDataStore();

  useEffect(() => {
    fetchAccounts();
  }, []);

  if (!process) return null;
  if (isLoading) return <div>Loading...</div>;

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleConfirm = async () => {
    setType('CLIENT_INCOME');
    setField('processId', process.id);
    // setField('method', method);
    // setField('value', amount);
    // setField('destinationAccountId', bank);

    await execute();

    onSave({
      amount: formData.value,
      method: formData.method,
      bankId: formData.destinationAccountId,
      date: new Date().toISOString()
    });
  };

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={handleClose}
      title="Registrar Pagamento"
      subtitle="Baixa de Título"
      maxWidth="max-w-xl"
      icon={<CreditCard className="text-[#800020]" size={20} />}
      footer={
        <div className="flex w-full gap-3">
          <Button 
            variant="ghost" 
            onClick={handleClose}
            className="flex-1 py-4 text-gray-400 font-black uppercase tracking-widest text-[10px]"
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleConfirm}
            className="flex-[2] py-4 bg-[#800020] hover:bg-[#600018] text-white font-black uppercase rounded-2xl shadow-xl shadow-[#800020]/20 flex items-center justify-center gap-2"
          >
            <Save size={18} />
            Salvar Pagamento
          </Button>
        </div>
      }
    >
      <div className="space-y-8">
        {/* VALOR PRINCIPAL */}
        <div className="space-y-3">
          <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">
            Valor do Pagamento
          </label>
          <div className="relative group">
            <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-gray-300 italic text-2xl group-focus-within:text-[#800020] transition-colors">
              R$
            </span>
            <input  
              type="text"
              // value={amount}
              // onChange={(e) => setAmount(Number(e.target.value))}
              value={
                new Intl.NumberFormat("pt-BR", { 
                  minimumFractionDigits: 2 
                }).format(Number(formData.value ?? 0))
              }
              onChange={(e) => {
                const formatted = formatUtils.currency(e.target.value ?? 0);
                // setAmount(formatted);
                setField('value', formatted);
              }}
              className="w-full pl-16 pr-8 py-7 bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-gray-800 rounded-[2rem] font-black text-4xl outline-none focus:border-[#800020] transition-all tabular-nums"
              placeholder="0,00"
            />
          </div>
        </div>

        {/* CONTA DE DESTINO */}
        <div className="space-y-3">
          <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">
            Conta de Destino
          </label>
          <SearchableSelect 
            value={formData.destinationAccountId} 
            onChange={(e) => setField('destinationAccountId', e)}
            options={accounts?.map(b => ({ label: b.bank?.name ?? '', value: b.id }))}
          />
        </div>

        {/* MÉTODOS DE PAGAMENTO */}
        <div className="space-y-4">
          <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">
            Forma de Pagamento
          </label>
          <div className="grid grid-cols-2 gap-3">
            {methods.map((m) => (
              <Button 
                key={m.id}
                type="button"
                variant='outline'
                value={formData.method}
                // onClick={() => setMethod(m.id)}
                onClick={() => setField('method', m.id)}
                className={`flex items-center gap-3 p-3.5 rounded-[1.25rem] border-2 transition-all active:scale-95 ${
                  formData.method === m.id 
                    ? 'border-emerald-500 bg-emerald-500/5 shadow-lg shadow-emerald-500/10' 
                    : 'border-gray-50 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.01]'
                }`}
              >
                <div className={`${formData.method === m.id ? 'scale-110' : 'opacity-70'} transition-transform`}>
                  {m.icon}
                </div>
                <span className={`text-sm font-black uppercase tracking-tight ${
                  formData.method === m.id ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-500'
                }`}>
                  {m.label}
                </span>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
}