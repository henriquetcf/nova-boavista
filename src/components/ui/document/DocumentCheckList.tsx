"use client"
import { useState, useMemo } from "react";
import { X, Plus, Info, Check, FileText } from "lucide-react";
import { DEFAULT_DOCUMENTS } from "@/lib/constants";
import { useServiceStore } from "@/store/services/create_service_store";

export function DocumentChecklist() {
  const { formData, addDocument, errors } = useServiceStore();
  const [customDoc, setCustomDoc] = useState("");

  const stats = useMemo(() => {
    return {
      selected: formData.requiredDocuments.length,
      total: DEFAULT_DOCUMENTS.length
    };
  }, [formData.requiredDocuments]);

  const handleCustomDoc = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && customDoc.trim()) {
      e.preventDefault();
      addDocument(customDoc.trim().toUpperCase());
      setCustomDoc("");
    }
  };

  return (
    <div className="space-y-5">
      {/* Header Alinhado */}
      <div className="flex items-end justify-between border-b border-gray-100 dark:border-gray-800 pb-4 ml-1">
        <div className="space-y-1">
          {/* <label className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">
            Documentos do Serviço
          </label> */}
          <label className="text-md font-bold text-gray-400 uppercase mb-3 tracking-tight">Documentos do Serviço</label>
          <p className="text-[11px] text-gray-400 font-medium">Selecione os itens obrigatórios para este checklist</p>
        </div>
        
        <div className="flex items-center gap-2 bg-gray-50 dark:bg-[#222] px-4 py-2 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Selecionados</span>
          <div className="flex items-center gap-1.5">
            <span className="text-lg font-black text-emerald-600 leading-none">{stats.selected}</span>
            <span className="text-xs font-bold text-gray-300 leading-none">/</span>
            <span className="text-xs font-bold text-gray-400 leading-none">{stats.total}</span>
          </div>
        </div>
      </div>

      {errors.requiredDocuments && (
        <p className="text-xs text-red-500 font-medium mt-1 ml-1 animate-in fade-in slide-in-from-top-1">
          {Array.isArray(errors.requiredDocuments) ? errors.requiredDocuments[0] : errors.requiredDocuments}
        </p>
      )}

      {/* Grid de Cards Premium Minimalistas */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {DEFAULT_DOCUMENTS.map((doc) => {
          const isSelected = formData.requiredDocuments.includes(doc);
          return (
            <button
              key={doc}
              type="button"
              onClick={() => addDocument(doc)}
              className={`
                group relative flex flex-col justify-between p-3.5 min-h-[110px] w-full 
                rounded-tr-[1.7rem] rounded-bl-xl rounded-br-xl rounded-tl-xl border-2 transition-all duration-300
                ${isSelected 
                  ? "bg-emerald-50/40 dark:bg-emerald-500/10 border-emerald-500 shadow-lg shadow-emerald-500/5 -translate-y-1" 
                  : "bg-gray-50/50 dark:bg-[#1a1a1a]/40 border-gray-100 dark:border-gray-800 text-gray-400 hover:border-gray-200"
                }
              `}
            >
              {/* Aba de Pasta (Pasta Suspensa) */}
              <div className={`
                absolute -top-[2px] left-6 h-1.5 w-12 rounded-b-full transition-all duration-300
                ${isSelected 
                  ? "bg-emerald-500 shadow-[0_2px_8px_rgba(16,185,129,0.4)] w-16" 
                  : "bg-gray-200 dark:bg-gray-700"
                }
              `} />

              {/* Cabeçalho da Ficha */}
              <div className="flex justify-between items-start w-full">
                <div className={`
                  p-1.5 rounded-lg transition-colors
                  ${isSelected ? "bg-emerald-500 text-white" : "bg-gray-100 dark:bg-[#222] text-gray-400"}
                `}>
                  <FileText size={20} />
                </div>
                
                <div className={`
                  w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
                  ${isSelected ? "bg-emerald-500 border-emerald-500 scale-100" : "bg-transparent border-gray-200 dark:border-gray-700 opacity-50"}
                `}>
                  {isSelected && <Check size={12} strokeWidth={4} className="text-white" />}
                </div>
              </div>

              {/* Rótulo do Documento */}
              <div className="mt-3 text-left">
                <span className={`
                  text-[16px] font-black uppercase tracking-tight leading-none transition-colors block mb-1.5
                  ${isSelected ? "text-emerald-900 dark:text-emerald-400" : "text-gray-500"}
                `}>
                  {doc}
                </span>
                
                {/* Linha de preenchimento (estilo formulário) */}
                <div className="relative h-[2px] w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div className={`
                    absolute inset-y-0 left-0 bg-emerald-500 transition-all duration-500 ease-out
                    ${isSelected ? "w-full" : "w-6"}
                  `} />
                </div>
              </div>

              {/* Marca d'água decorativa sutil no fundo do card */}
              <div className={`
                absolute right-2 bottom-6 opacity-[0.03] dark:opacity-[0.05] pointer-events-none transition-transform duration-500
                ${isSelected ? "scale-110 rotate-12" : "rotate-0"}
              `}>
                <FileText size={48} />
              </div>
            </button>
          );
        })}

        {/* Input de Customizado - Estilo Clean */}
        <div className="col-span-full pt-2">
          <div className="relative group">
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#800020] transition-all">
              <Plus size={20} strokeWidth={3} />
            </div>
            <input
              value={customDoc}
              onChange={(e) => setCustomDoc(e.target.value)}
              onKeyDown={handleCustomDoc}
              placeholder="ADICIONAR DOCUMENTO EXTRA..."
              className="w-full p-4 pl-14 rounded-2xl bg-gray-50 dark:bg-[#222] border-2 border-dashed border-gray-200 dark:border-gray-800 focus:border-[#800020] focus:bg-white dark:focus:bg-[#1a1a1a] outline-none transition-all text-[11px] font-bold uppercase tracking-widest"
            />
          </div>
        </div>
      </div>

      {/* Documentos Adicionais (Mini Fichas Clean) */}
      {formData.requiredDocuments.some(d => !DEFAULT_DOCUMENTS.includes(d)) && (
        <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-gray-800">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 opacity-70">
            Documentos Adicionais inseridos
          </p>
          
          <div className="flex flex-wrap gap-3">
            {formData.requiredDocuments
              .filter(d => !DEFAULT_DOCUMENTS.includes(d))
              .map((doc, index) => (
                <div 
                  key={index}
                  className="group relative flex items-center gap-3 px-3 py-2 min-w-[120px]
                            bg-emerald-50/40 dark:bg-emerald-500/10 border-2 border-emerald-500
                            rounded-tr-2xl rounded-bl-xl rounded-br-xl rounded-tl-md 
                            animate-in zoom-in duration-300 shadow-sm"
                >
                  {/* Aba de Pasta (Versão Mini) */}
                  <div className="absolute -top-[2px] left-4 h-1 w-8 bg-emerald-500 rounded-b-full shadow-[0_1px_4px_rgba(16,185,129,0.3)]" />
                  
                  {/* Ícone sutil */}
                  <div className="p-1 bg-emerald-500 rounded-md">
                    <FileText size={12} className="text-white" />
                  </div>
                  
                  <div className="flex flex-col flex-1">
                    <span className="text-[11px] font-black uppercase tracking-tight text-emerald-900 dark:text-emerald-400 leading-none">
                      {doc}
                    </span>
                    {/* Mini linha de formulário para manter o estilo ficha */}
                    <div className="h-[1.5px] w-full bg-emerald-500/20 mt-1 rounded-full overflow-hidden">
                      <div className="h-full w-full bg-emerald-500" />
                    </div>
                  </div>

                  <button 
                    onClick={() => addDocument(doc)} 
                    className="ml-1 p-1 hover:bg-emerald-500/10 rounded-lg transition-colors text-emerald-600 dark:text-emerald-400"
                  >
                    <X size={14} strokeWidth={3} />
                  </button>
                </div>
              ))
            }
          </div>
        </div>
      )}
      <div className="flex items-center gap-2 mt-4 px-2 py-3 bg-gray-50/50 dark:bg-[#1a1a1a]/40 rounded-xl border border-gray-100 dark:border-gray-800">
        <Info className="text-[#800020]" size={16} />
        <p className="text-[12px] text-gray-500 font-medium italic">
          Estes documentos serão exigidos automaticamente para cada novo processo deste serviço.
        </p>
      </div>
    </div>
  );
}