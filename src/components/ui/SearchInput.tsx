// components/ui/SearchInput.tsx
'use client'
import { Search } from 'lucide-react';

interface SearchInputProps {
  placeholder?: string;
  className?: string;
  onChange?: (value: string) => void;
  value?: string;
}

export function SearchInput({ placeholder, className, onChange, value }: SearchInputProps) {
  return (
    <div className={`relative group ${className}`}>
      <Search 
        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#800020] transition-colors" 
        size={18} 
      />
      <input 
        type="text" 
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder?.toUpperCase() || "BUSCAR..."} 
        className="w-full h-14 pl-12 pr-6 bg-gray-50 dark:bg-white/5 border border-transparent focus:border-gray-200 dark:focus:border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none transition-all shadow-sm"
      />
    </div>
  );
}