"use client";

import React, { useState } from 'react';
import { Copy, Hash, Edit3, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import * as SI from 'simple-icons';
import { Bank } from '@prisma/client';
import { BankHistoryDrawer } from './BankHistoryDrawer';

interface BankCardProps {
  // bankName: "Nubank" | "Bradesco" | "Daycoval";
  id: string;
  cnpj: string;
  agency: string;
  account: string;
  balance: string; // Adicionado
  bank: Bank;
}

const bankConfigs = {
  Nubank: {
    color: `#${SI.siNubank.hex}`,
    logo: (
      <svg viewBox="0 0 24 24" className="w-9 h-9 fill-white" xmlns="http://www.w3.org/2000/svg">
        <path d={SI.siNubank.path} />
      </svg>
    )
  },
  Bradesco: {
    color: "#cc092f",
    logo: (
      <svg viewBox="0 0 25 22" className="w-9 h-9" xmlns="http://www.w3.org/2000/svg">
        <path 
          d="M11.6,16.4l-1.4,0.8c-0.2,0.1-0.2,0.2-0.2,0.4v5.1c0,0.2,0.1,0.3,0.2,0.3h1.4V16.4ZM14.2,14.9c-1.8,1-1.8,1-1.8,1h-0.1v6.9h2c0.2,0,0.4-0.2,0.4-0.4V15.2C14.7,15,14.4,14.8,14.2,14.9ZM11.4,4.9A22.5,22.5,0,0,0,7,5.3a8.2,8.2,0,0,1,6.6-3.2A9,9,0,0,1,19,3.9c0.2,0.2,0.4,0.3,0.6,0.1a0.4,0.4,0,0,0,0-0.6A9.3,9.3,0,0,0,12.2,0,9.5,9.5,0,0,0,3.5,6.1L0.3,7.4q-0.4,0.3-0.3,0.6a0.4,0.4,0,0,0,0.6,0.2,18.3,18.3,0,0,1,2.5-0.6A6.1,6.1,0,0,0,3,9a9.3,9.3,0,0,0,4.3,8c0.2,0.1,0.5,0.1,0.6-0.1s0.1-0.4-0.1-0.6a7.9,7.9,0,0,1-2.6-6,6.4,6.4,0,0,1,0.7-3.1L8.7,7C15.5,7,21.3,9.3,21.3,12.2s-1.9,3-4.2,4c-0.5,0.2-0.5,0.4-0.5,0.6s0.3,0.3,0.6,0.2c4-1.2,6.9-3.4,6.9-5.9S18.5,4.9,11.4,4.9Z" 
          fill="white"
        />
      </svg>
    )
  },
  Daycoval: {
    color: "#003399",
    logo: (
      <div className="flex items-center justify-center font-black italic mb-1">
        <span className="text-3xl text-white tracking-tighter uppercase">D</span>
        <div className="w-2 h-2 rounded-full bg-[#ff8a00] ml-0.5 mt-3" />
      </div>
    )
  }
};

export const BankCard = ({ bank, cnpj, agency, account, balance = '1000' }: BankCardProps) => {
  const [showBalance, setShowBalance] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState<boolean>(false);
  const bankName = bank?.name as keyof typeof bankConfigs;
  const config = bankConfigs?.[bankName];
  
  const copyToClipboard = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, text: string, label: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    toast.success(`${label} copiado!`);
  };

  if (!config) return null;

  return (
    <>
      <div 
        onClick={(e) => {e.stopPropagation(); setSelectedHistory(true);}}
        className="group relative bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-white/5 rounded-[24px] p-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 overflow-hidden h-[260px] flex flex-col justify-between"
      >
        
        {/* MANTIDO: SEUS EFEITOS ORIGINAIS */}
        <div className="absolute inset-0 bg-white/40 dark:bg-black/20 backdrop-blur-xl border border-white/40 dark:border-white/10 z-0" />
        <div className="absolute top-0 left-0 w-full h-1 opacity-80" style={{ backgroundColor: config?.color }} />
        <div className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full blur-[80px] opacity-10 group-hover:opacity-20 transition-opacity" style={{ backgroundColor: config?.color }} />
        <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity duration-700" style={{ backgroundColor: config?.color }} />

        <div className="relative z-10">
          <div className="flex justify-between items-start">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110" style={{ backgroundColor: config?.color }}>
              <div className="flex items-center justify-center w-full h-full">
                {config?.logo}
              </div>
            </div>
            
            <div className="text-right flex flex-col items-end">
              <div className="flex items-center gap-2 group/edit">
                {/* Botão de Editar no Hover */}
                <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded-md transition-all text-gray-400 cursor-pointer">
                  <Edit3 size={14} />
                </button>
                <h3 className="text-lg font-black text-gray-800 dark:text-gray-100 uppercase tracking-tighter leading-none">
                  {bankName}
                </h3>
              </div>
              <div className="flex items-center justify-end gap-1.5 mt-1">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: config?.color }} />
                <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">CÓD {bank.code}</span>
              </div>
            </div>
          </div>

          <div className="mt-2 grid grid-cols-2 gap-4">
            <div onClick={(e) => copyToClipboard(e, agency, 'Agência')} className="cursor-pointer group/item">
              <p className="inline-flex text-[9px] font-black text-gray-400 uppercase mb-0.5 group-hover/item:text-gray-600 transition-colors mr-1">Agência</p>
              <Copy size={10} className="inline-flex text-gray-300 group-hover:text-gray-500 transition-colors" />
              <p className="text-xl font-black text-gray-700 dark:text-gray-200 tabular-nums tracking-tighter">{agency}</p>
            </div>
            <div onClick={(e) => copyToClipboard(e, account, 'Conta')} className="cursor-pointer group/item text-right">
              <p className="inline-flex text-[9px] font-black text-gray-400 uppercase mb-0.5 group-hover/item:text-gray-600 transition-colors mr-1">Conta</p>
              <Copy size={10} className="inline-flex text-gray-300 group-hover:text-gray-500 transition-colors" />
              <p className="text-xl font-black text-gray-700 dark:text-gray-200 tabular-nums tracking-tighter">{account}</p>
            </div>
          </div>
        </div>

        {/* ÁREA DE SALDO E CNPJ */}
        <div className="relative z-10 space-y-2">
          {/* Saldo que "brota" no hover ou fixa se você preferir */}
          <div 
            className="flex justify-between items-center opacity-40 group-hover:opacity-100 transition-opacity cursor-pointer mt-2  mb-4"
            onClick={(e) => {e.stopPropagation(); setShowBalance(!showBalance);}}
          >
            <span className="text-[12px] font-black text-gray-400 uppercase tracking-widest">Saldo em conta</span>
            <div className="flex items-center gap-1.5">
              <span className={`text-[19px] font-black tabular-nums ${showBalance ? 'text-emerald-500' : 'text-gray-300 dark:text-gray-700 blur-[3px]'}`}>
                R$ {balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
              {showBalance ? <EyeOff size={14} className="text-gray-400" /> : <Eye size={14} className="text-gray-400" />}
            </div>
          </div>

          <div 
            onClick={(e) => copyToClipboard(e, cnpj, 'CNPJ')}
            className="flex items-center justify-between p-3 mb-2 bg-gray-50 dark:bg-white/[0.03] rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-all border border-gray-100 dark:border-white/5"
          >
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-white dark:bg-[#222] shadow-sm">
                <Hash size={12} className="text-gray-400" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">CNPJ / PIX</span>
                <span className="text-[11px] font-bold text-gray-600 dark:text-gray-300 tabular-nums">{cnpj}</span>
              </div>
            </div>
            <Copy size={14} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
          </div>
        </div>
      </div>
      <BankHistoryDrawer 
        isOpen={!!selectedHistory}
        onClose={() => setSelectedHistory(false)}
        accountId={account || ''}
        bankName={bank?.name || ''}
      />
    </>
  );
};