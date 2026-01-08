"use client";

import React, { useEffect } from 'react';
import { ArrowUpCircle, ArrowDownCircle, ArrowRightLeft, Landmark, File } from 'lucide-react';
import { useTransactionDataStore } from '@/store/transactionMoviment/transaction_moviment_store';
import { DrawerWrapper } from '@/components/drawer/DrawerWrapper';
import { Button } from '../Button';

interface BankHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  accountId: string;
  bankName: string;
}

const typeConfig = {
  DEPOSIT: { label: 'Entrada', color: 'text-emerald-500', icon: <ArrowUpCircle size={18} /> },
  TRANSFER: { label: 'Transf.', color: 'text-blue-500', icon: <ArrowRightLeft size={18} /> },
  TAX_OUT: { label: 'Saída', color: 'text-red-500', icon: <ArrowDownCircle size={18} /> },
  CLIENT_INCOME: { label: 'Cliente', color: 'text-emerald-600', icon: <File size={18} /> },
};

// const methodConfig = {
//   PIX: { label: 'PIX', color: 'text-cyan-500' },
//   CASH: { label: 'Dinheiro', color: 'text-emerald-500' },
//   DEBIT_CARD: { label: 'Cartão de Débito', color: 'text-green-500' },
//   CREDIT_CARD: { label: 'Cartão de Crédito', color: 'text-blue-500' },
//   BANK_TRANSFER: { label: 'TED', color: 'text-purple-500' },
// }

export const BankHistoryDrawer = ({ isOpen, onClose, accountId, bankName }: BankHistoryDrawerProps) => {
  const { movements, fetchMovements, isLoading } = useTransactionDataStore();

  useEffect(() => {
    if (isOpen) fetchMovements();
  }, [isOpen, fetchMovements]);

  // Filtra movimentos (Ajustado para comparar com IDs UUID se necessário)
  const accountMovements = movements
    .filter(m => m.originAccount?.account === accountId || m.destinationAccount?.account === accountId)
    .slice(0, 15);
  
  //TODO - Arrumar pra pegar o banco real selecionado
  const bankAccount = accountMovements[0]?.originAccount || accountMovements[0]?.destinationAccount;

  if (!isOpen) return null;

  return (
    <DrawerWrapper
      isOpen={isOpen}
      onClose={onClose}
      title={bankName}
      subtitle="Extrato de Movimentações"
      icon={<Landmark size={20} />}
      maxWidth="max-w-[420px]"
      footer={
        <>
          <div className="flex justify-between items-center mb-6 px-2">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Saldo do Período</span>
              <span className="text-sm font-black dark:text-white tabular-nums">R$ {bankAccount?.balance}</span>
          </div>
          <div className='grid grid-cols-2 gap-2'>
            <Button className="py-4 bg-gray-950 dark:bg-white text-white dark:text-black font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl">
              Ver Extrato Completo
            </Button>
            <Button className="py-4 bg-gray-950 dark:bg-white text-white dark:text-black font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl hover:opacity-90 transition-all active:scale-[0.98]">
                Exportar PDF
            </Button>
          </div>
        </>
      }
    >
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-40">
          <div className="w-6 h-6 border-2 border-t-blue-500 rounded-full animate-spin" />
        </div>
      ) : accountMovements.length === 0 ? (
        <div className="text-center py-20 opacity-40">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Sem movimentações</p>
        </div>
      ) : (
        <div className="relative border-l-[1px] border-gray-100 dark:border-white/5 ml-3 pl-6 space-y-6">
          {accountMovements.map((m) => {
            const isOut = m.originAccount?.account === accountId;
            const config = typeConfig[m.type as keyof typeof typeConfig] || typeConfig.DEPOSIT;

            return (
              <div key={m.id} className="relative group">
                {/* Indicador de Status na Linha */}
                <div className={`absolute -left-[31px] top-1 p-1 rounded-full bg-white dark:bg-[#0c0c0c] border-2 shadow-sm transition-transform group-hover:scale-110 ${isOut ? 'border-red-500/50 text-red-500' : 'border-emerald-500/50 text-emerald-500'}`}>
                  {/* {React.cloneElement(config.icon as React.ReactElement, { size: 12 })} */}
                  {React.cloneElement(config.icon as React.ReactElement)}
                </div>

                <div className="flex items-center justify-between p-4 rounded-[20px] bg-gray-50 dark:bg-white/[0.03] border border-transparent hover:border-gray-200 dark:hover:border-white/10 transition-all">
                  <div className="flex flex-col gap-1">
                    <p className="text-[13px] font-black text-gray-800 dark:text-gray-100 leading-none uppercase tracking-tight">
                      {m.description || config.label}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-[9px] font-bold text-gray-400 uppercase">
                        {new Date(m.date).toLocaleDateString('pt-BR')}
                      </p>
                      <span className="w-1 h-1 bg-gray-300 dark:bg-white/10 rounded-full" />
                      <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest">
                        {m.method}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className={`text-[15px] font-black tabular-nums tracking-tighter ${isOut ? 'text-red-500' : 'text-emerald-500'}`}>
                      {isOut ? '-' : '+'} R$ {parseFloat(m.value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </DrawerWrapper>
  );
};