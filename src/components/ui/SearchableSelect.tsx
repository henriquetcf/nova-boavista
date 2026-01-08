'use client'
import React, { useState, useRef, useEffect, useMemo } from "react";
import { ChevronDown, Check } from "lucide-react";

interface Option {
  label: string;
  value: string;
}

interface SearchableSelectProps {
  label?: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
}

export function SearchableSelect({ 
  label, 
  options, 
  value, 
  onChange, 
  placeholder = "Selecione...", 
  error 
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  // Encontra a label da opção selecionada para mostrar no input
  const selectedOption = useMemo(() => 
    options.find(opt => opt.value === value), 
  [options, value]);

  // Filtra as opções conforme o que o usuário digita
  const filteredOptions = useMemo(() => 
    options.filter(opt => 
      opt.label.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  [options, searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm(""); // Limpa a busca ao fechar
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`w-full space-y-1.5 relative ${error ? "mb-5" : ""}`} ref={containerRef}>
      {label && (
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">
          {label}
        </label>
      )}

      {/* Input de Busca / Gatilho */}
      <div className="relative group">
        <input
          type="text"
          className={`
            w-full px-4 py-3 rounded-xl border bg-white dark:bg-[#1a1a1a] 
            text-gray-900 dark:text-gray-100 transition-all outline-none pr-10
            focus:ring-2 focus:ring-[#800020]/40 focus:border-[#800020]
            ${isOpen ? "border-[#800020]" : "border-gray-200 dark:border-gray-700"}
            ${error ? "border-red-500" : ""}
            cursor-pointer
          `}
          placeholder={selectedOption ? selectedOption.label : placeholder}
          value={isOpen ? searchTerm : (selectedOption?.label || "")}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
        />
        
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-[#800020] transition-colors">
          <ChevronDown size={18} className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
        </div>
      </div>

      {/* Menu Dropdown - Colado no Input */}
      {isOpen && (
        <div className="absolute z-[60] w-full -mt-1 bg-white dark:bg-[#1e1e1e] rounded-xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          <div className="max-h-60 overflow-y-auto custom-scrollbar">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => (
                <div
                  key={opt.value}
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                    setSearchTerm("");
                  }}
                  className={`
                    px-4 py-3 text-sm flex items-center justify-between cursor-pointer transition-colors
                    ${value === opt.value ? "bg-[#800020]/5 text-[#800020] font-bold" : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#2d2d2d]"}
                  `}
                >
                  {opt.label}
                  {value === opt.value && <Check size={14} />}
                </div>
              ))
            ) : (
              <div className="px-4 py-6 text-center text-xs text-gray-400">
                Nenhum resultado para &quot;{searchTerm}&quot;
              </div>
            )}
          </div>
        </div>
      )}

      {error && <p className="absolute text-xs text-red-500 font-medium ml-1">{error}</p>}
    </div>
  );
}