"use client";

import React, { useEffect } from 'react';
import { ArrowRight, Plus } from 'lucide-react';
import { BankCard } from '@/components/ui/banks/BankCard';
import { AddBankAccountDrawer } from '@/components/ui/banks/AddBankAccountDrawer';
import { Button } from '@/components/ui/Button';
import TransactionDrawer from '@/components/ui/banks/TransactionDrawer';
import { useBankDataStore } from '@/store/bankAccount/bank_account_store';
import { useLoading } from '@/components/AppLoading';
import { useCreateBankAccountStore } from '@/store/bankAccount/create_bank_account_store';

export default function BancosPage() {

  const [isOpen, setIsOpen] = React.useState(false);
  const [isTransactionOpen, setIsTransactionOpen] = React.useState(false);
  const [type, setType] = React.useState<'DEPOSIT' | 'TRANSFER'>('DEPOSIT');

  const { accounts, fetchAccounts, isLoading } = useBankDataStore();
  const { create } = useCreateBankAccountStore();
  const { startLoading, stopLoading } = useLoading();

  const handleCreate = async () => {
    setIsOpen(true);
    create();
    fetchAccounts();
  }

  const refreshList = async () => {
    // Remova o IF. Queremos atualizar SEMPRE que houver sucesso.
    startLoading("Sincronizando contas...");
    console.log('Sincronizando saldos atualizados...');
    
    try {
      await fetchAccounts();
    } finally {
      stopLoading();
    }
  }
  useEffect(() => {
    refreshList();
  }, []);

  if (isLoading) return <div className="h-screen" />

  return (
    <>
      <div className="p-8 max-w-[1400px] mx-auto space-y-8">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black text-gray-900 dark:text-white uppercase tracking-[ -0.05em]">
              Bancos <span className="text-[#800020] text-xl ml-2 opacity-50">/ Gestão</span>
            </h1>
            <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.3em] mt-1">
              Contas de recebimento e taxas
            </p>
          </div>

          <div className="flex gap-3">
            {/* Botão de Entrada */}
            <Button 
              variant='ghost'
              onClick={() => {setIsTransactionOpen(true); setType('DEPOSIT')}} 
              // className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500/10 text-emerald-600 rounded-2xl border border-emerald-500/20 hover:bg-emerald-500 hover:text-white transition-all font-black uppercase text-[10px] tracking-widest"
            >
              <Plus size={16} strokeWidth={3} /> Depósito
            </Button>

            {/* Botão de Transferência / Saída */}
            <Button 
              variant='ghost' 
              onClick={() => {setIsTransactionOpen(true); setType('TRANSFER')}} 
              // className="flex items-center gap-2 px-5 py-2.5 bg-blue-500/10 text-blue-600 rounded-2xl border border-blue-500/20 hover:bg-blue-500 hover:text-white transition-all font-black uppercase text-[10px] tracking-widest"
            >
              <ArrowRight size={16} strokeWidth={3} /> Transferir
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accounts.map((banco, index) => (
            <BankCard key={index} {...banco} />
          ))}

          {/* Card de Adicionar (Estilo Mobile/Desktop) */}
          <button onClick={() => setIsOpen(true)} className="rounded-[24px] border-2 border-dashed border-gray-200 dark:border-white/10 flex flex-col items-center justify-center p-8 text-gray-400 hover:border-[#800020] hover:text-[#800020] hover:bg-[#800020]/5 transition-all group min-h-[260px] cursor-pointer">
            <div className="w-14 h-14 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center mb-4 group-hover:bg-[#800020]/10 transition-colors">
              <Plus size={28} strokeWidth={3} />
            </div>
            <span className="font-black uppercase text-[11px] tracking-[0.2em]">Adicionar Banco</span>
          </button>
        </div>
      </div>

      <AddBankAccountDrawer 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        onSave={handleCreate} 
      />
      <TransactionDrawer 
        isOpen={isTransactionOpen} 
        onClose={() => setIsTransactionOpen(false)} 
        onSave={refreshList} 
        type={type} 
        accounts={accounts}
      />
    </>
  );
}