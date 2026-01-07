"use client"
import { LucideIcon } from "lucide-react";

interface PageHeaderProps {
  title: string;
  highlight?: string; // Parte do texto em Bordo (#800020)
  subtitle: string;
  icon: LucideIcon;
}

export function PageHeader({ title, highlight, subtitle, icon: Icon }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8 animate-in fade-in slide-in-from-left duration-500">
      <div>
        <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight uppercase">
          {title} {highlight && <span className="text-[#800020]">{highlight}</span>}
        </h1>
        <p className="text-gray-500 text-sm mt-1 font-medium">{subtitle}</p>
      </div>
      <div className="h-12 w-12 bg-[#800020]/10 rounded-2xl flex items-center justify-center text-[#800020] shadow-sm">
        <Icon size={24} />
      </div>
    </div>
  );
}