'use client'
import React from 'react';
import { 
  Phone, MapPin, Calendar, Briefcase, 
  Edit3, Fingerprint, ShieldCheck, 
  ArrowUpRight, Globe, UserCheck,
  Hash,
  Copy
} from 'lucide-react';
import { Button } from '../Button';
import { DrawerWrapper } from '@/components/drawer/DrawerWrapper';

interface ClientDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  client: any;
}

export function ClientDetailsDrawer({ isOpen, onClose, client }: ClientDetailsDrawerProps) {
  if (!client) return null;

  const initials = client.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <DrawerWrapper
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-6 py-2">
           <div className="relative">
              <div className="w-16 h-16 bg-[#800020] rounded-full flex items-center justify-center text-white text-2xl font-black shadow-2xl shadow-[#800020]/30 border-4 border-white dark:border-[#0f0f0f]">
                {initials}
              </div>
              <div className="absolute -bottom-1 -right-1 bg-green-500 w-5 h-5 rounded-full border-4 border-white dark:border-[#0f0f0f]" />
           </div>
           <div className="space-y-1">
              <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter italic leading-none">
                {client.name}
              </h2>
              <div className="flex items-center gap-2">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Registro Ativo</p>
                <span className="w-1 h-1 rounded-full bg-gray-300" />
                <p className="text-[10px] font-bold text-[#800020] uppercase tracking-[0.2em]">Prioridade Máxima</p>
              </div>
           </div>
        </div>
      }
      maxWidth="max-w-[500px]"
      footer={
        <div className="flex w-full gap-4 p-4">
          <Button variant="ghost" className="flex-1 h-14 font-black uppercase text-[11px] tracking-widest text-gray-400 hover:text-[#800020]">
            <Edit3 size={16} className="mr-2" /> Editar Perfil
          </Button>
          <Button className="flex-[2] h-14 bg-[#800020] text-white font-black uppercase tracking-widest rounded-full shadow-2xl shadow-[#800020]/30 group">
            Extrair Relatório <ArrowUpRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      }
    >
      <div className="space-y-10 py-6 px-2">
        
        {/* SEÇÃO 1: SMART CARD - VERSÃO GOLD PREMIUM REFINADA */}
        <div className="relative group">
          {/* Glow periférico dourado que reage ao mouse */}
          <div className="absolute -inset-1 bg-gradient-to-r from-[#d4af37]/20 to-[#800020]/10 rounded-[2.7rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          
          <div className="relative bg-[#fdfbf7] dark:bg-[#1a1814] rounded-[2.5rem] p-8 border-2 border-[#d4af37]/20 shadow-[0_30px_60px_-15px_rgba(212,175,55,0.15)] overflow-hidden transition-all duration-500 group-hover:border-[#d4af37]/40 group-hover:-translate-y-1">
            
            {/* EFEITO SHINE VINHO NO FINGERPRINT */}
            <div className="absolute -right-10 -bottom-10 select-none pointer-events-none opacity-[0.08] dark:opacity-[0.15] group-hover:opacity-30 transition-all duration-700 rotate-12">
              <Fingerprint size={240} strokeWidth={1} className="text-[#800020]" />
              {/* O "Shine" que passa por cima do fingerprint */}
              <div className="absolute top-0 -inset-full h-full w-full bg-gradient-to-r from-transparent via-[#800020]/40 to-transparent skew-x-[-20deg] group-hover:animate-[shine_3s_ease-in-out_infinite]" />
            </div>

            {/* HEADER DO CARD */}
            <div className="flex justify-between items-start mb-12 relative z-10">
              <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-[#d4af37]/10 rounded-lg">
                      <ShieldCheck size={18} className="text-[#d4af37]" />
                    </div>
                    <span className="text-[10px] font-black text-[#d4af37] uppercase tracking-[0.3em]">Registro</span>
                  </div>
                  <p className="text-[8px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Documento Auditado Internamente</p>
              </div>
              
              {/* Badge de Status Dinâmico */}
              <div className={`px-4 py-1.5 rounded-full border shadow-sm transition-all duration-500 ${
                client.active !== false 
                ? 'bg-green-50 dark:bg-green-500/5 border-green-100 dark:border-green-500/20' 
                : 'bg-red-50 dark:bg-red-500/5 border-red-100 dark:border-red-500/20'
              }`}>
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${client.active !== false ? 'bg-green-500' : 'bg-red-500'}`} />
                    <p className={`text-[9px] font-black uppercase tracking-tighter ${client.active !== false ? 'text-green-600' : 'text-red-600'}`}>
                        {client.active !== false ? 'Cadastro Ativo' : 'Cadastro Inativo'}
                    </p>
                  </div>
              </div>
            </div>

            {/* CONTEÚDO CENTRAL: TAX ID */}
            <div className="relative z-10 flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <p className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.5em]">Documento</p>
                <div className="h-[1px] flex-1 bg-gradient-to-r from-[#d4af37]/30 to-transparent" />
              </div>
              
              <div className="flex items-center justify-between group/id mt-1">
                <p className="text-3xl font-black tracking-widest text-gray-800 dark:text-white italic font-mono uppercase bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-300 dark:to-white bg-clip-text">
                  {client.cpf || client.cnpj || '000.000.000-00'}
                </p>
                <button className="p-2 hover:bg-[#d4af37]/10 rounded-xl transition-all active:scale-90 group-hover/id:translate-x-1">
                  <Copy size={16} className="text-[#d4af37]" />
                </button>
              </div>
            </div>

            {/* INFO ÚTIL EXTRA: SCORE OU CATEGORIA NO RODAPÉ */}
            <div className="mt-10 pt-6 border-t border-[#d4af37]/10 flex justify-between items-end relative z-10">
              <div className="grid grid-cols-2 gap-8">
                  <div>
                    <p className="text-[7px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1.5 italic">Nível de Acesso</p>
                    <p className="text-[10px] font-black text-gray-700 dark:text-gray-300 uppercase italic flex items-center gap-1">
                      Cliente <div className="w-1 h-1 rounded-full bg-[#d4af37]" />
                    </p>
                  </div>
                  <div>
                    <p className="text-[7px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1.5 italic">Registrado em</p>
                    <p className="text-[10px] font-black text-gray-700 dark:text-gray-300 uppercase tracking-tighter">
                      {client.updatedAt ? new Date(client.updatedAt).toLocaleDateString() : 'Sem registros'}
                    </p>
                  </div>
              </div>

              <div className="flex flex-col items-end">
                  <div className="flex gap-1 mb-1">
                    {[1,2,3].map(i => <div key={i} className="w-4 h-1 rounded-full bg-[#d4af37]" />)}
                  </div>
                  <p className="text-[7px] font-black text-[#d4af37] uppercase tracking-[0.3em]">Prioridade</p>
              </div>
            </div>
          </div>
        </div>

        {/* SEÇÃO 2: DADOS TIPO LISTA EXECUTIVA (Menos quadrada) */}
        <div className="space-y-6">
          <div className="flex items-center gap-4">
             <span className="text-[10px] font-black text-[#800020] uppercase tracking-[0.3em] whitespace-nowrap">Informações de Contato</span>
             <div className="h-[1px] w-full bg-gray-100 dark:bg-white/5" />
          </div>

          <div className="grid grid-cols-1 gap-6">
             <div className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-5">
                   <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-2xl group-hover:bg-[#800020]/10 transition-colors">
                      <Phone size={18} className="text-gray-400 group-hover:text-[#800020]" />
                   </div>
                   <div>
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Linha Direta</p>
                      <p className="font-bold text-gray-800 dark:text-white uppercase italic text-base">{client.phone || '---'}</p>
                   </div>
                </div>
                <ArrowUpRight size={16} className="text-gray-200 opacity-0 group-hover:opacity-100 transition-all" />
             </div>

             <div className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-5">
                   <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-2xl group-hover:bg-[#800020]/10 transition-colors">
                      <MapPin size={18} className="text-gray-400 group-hover:text-[#800020]" />
                   </div>
                   <div>
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Endereço Fiscal</p>
                      <p className="font-bold text-gray-800 dark:text-white uppercase italic text-sm">{client.address || 'Não informado'}</p>
                   </div>
                </div>
                <ArrowUpRight size={16} className="text-gray-200 opacity-0 group-hover:opacity-100 transition-all" />
             </div>
          </div>
        </div>

        {/* SEÇÃO 3: MÉTRICAS FLUTUANTES */}
        <div className="pt-6 border-t border-gray-100 dark:border-white/5 grid grid-cols-3 gap-8">
           <div className="text-center">
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Processos</p>
              <p className="text-3xl font-black text-gray-900 dark:text-white italic leading-none">{client.processes?.length || 0}</p>
           </div>
           <div className="text-center border-x border-gray-100 dark:border-white/5">
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Desde</p>
              <p className="text-xl font-black text-gray-900 dark:text-white italic leading-none mt-1">
                 {new Date(client.createdAt).getFullYear()}
              </p>
           </div>
           <div className="text-center">
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Rating</p>
              <div className="flex justify-center gap-0.5 mt-1">
                 {[1,2,3,4,5].map(i => <div key={i} className={`h-1 w-3 rounded-full ${i < 4 ? 'bg-[#800020]' : 'bg-gray-200 dark:bg-white/10'}`} />)}
              </div>
           </div>
        </div>

        {/* INFO EXTRA: TIPO CARIMBO */}
        <div className="bg-[#800020]/5 rounded-3xl p-6 flex items-center gap-4 border border-[#800020]/10">
           <UserCheck size={20} className="text-[#800020]" />
           <p className="text-[10px] font-bold text-[#800020] uppercase leading-relaxed tracking-tight">
              Este cliente possui documentação verificada e histórico de pagamentos pontuais no último semestre.
           </p>
        </div>
      </div>
    </DrawerWrapper>
  );
}