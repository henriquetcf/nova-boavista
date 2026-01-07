'use client'

import React, { ComponentType, SVGProps } from "react";
import Link from "next/link";
import { Cog6ToothIcon, HomeModernIcon, UserCircleIcon, ListBulletIcon, FilmIcon } from "@heroicons/react/24/solid";
import { SIDEBAR_CONFIG } from "@/lib/constants";
import { Banknote } from "lucide-react";

interface NavItemProps {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  label: string;
  href: string;
  expanded: boolean;
  active: boolean;
}

const NavItem = ({ icon: Icon, label, href, expanded, active }: NavItemProps) => {
  const iconContainerSize = SIDEBAR_CONFIG.closedWidth - (SIDEBAR_CONFIG.padding * 2);

  return (
    <Link href={href} className="w-full block" prefetch={false}>
      <div className={`
        group relative flex h-10 w-full cursor-pointer items-center rounded-lg transition-all duration-300
        ${active ? "bg-[#E8DEF8] text-[#1D192B]" : "hover:bg-[#E8DEF8]/50 text-[#49454F]"}
      `}>
        
        {/* Container do Ícone */}
        <div 
          style={{ width: `${iconContainerSize}px` }}
          className="flex flex-shrink-0 items-center justify-center transition-all duration-300"
        >
          <Icon className={`h-6 w-6 transition-colors ${active ? "text-[#1D192B]" : "text-[#49454F]"}`} />
        </div>
        
        {/* Label */}
        <div className={`
          ml-2 overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
          ${expanded ? "max-w-[150px] opacity-100" : "max-w-0 opacity-0"}
        `}>
          <span className={`whitespace-nowrap text-xs font-semibold ${active ? "text-[#1D192B]" : "text-[#49454F]"}`}>
            {label}
          </span>
        </div>

        {/* Indicador Ativo - Colado na direita com arredondamento para a esquerda */}
        <div 
          className={`
            absolute right-0 w-1.5 bg-[#49454F]
            transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
            /* Arredonda apenas os cantos da ESQUERDA para encaixar no item */
            rounded-r-md
            ${active && expanded ? "h-full opacity-100" : "h-0 opacity-0"}
          `}
        />

        {/* Tooltip */}
        {!expanded && (
          <div className="absolute left-[calc(100%+16px)] z-50 invisible opacity-0 group-hover:visible group-hover:opacity-100 bg-[#49454F] text-white text-[14px] px-2 py-1 rounded-lg layout-transition shadow-md whitespace-nowrap pointer-events-none">
            {label}
          </div>
        )}
      </div>
    </Link>
  );
};

const Sidebar = ({ expanded, setExpanded, currentPath }: { 
  expanded: boolean; 
  setExpanded: (v: boolean) => void;
  currentPath: string;
}) => {
  
  const navItems = [
    { icon: HomeModernIcon, label: "Home", href: "/" },
    { icon: UserCircleIcon, label: "Usuário", href: "/user" },
    { icon: UserCircleIcon, label: "Cliente", href: "/clientes" },
    { icon: FilmIcon, label: "Processos", href: "/processo" },
    { icon: FilmIcon, label: "Serviços", href: "/servicos" },
    { icon: Banknote, label: "Financeiro", href: "/financeiro" },
  ];

  const actionSize = SIDEBAR_CONFIG.closedWidth - (SIDEBAR_CONFIG.padding * 2);

  return (
    <aside 
      style={{ width: 'var(--sidebar-width)', padding: `${SIDEBAR_CONFIG.padding}px`, backdropFilter: 'none' }}
      className="fixed left-2 top-1 z-30 flex h-[calc(100vh-32px)] flex-col bg-[#ededed] dark:bg-[#1a1a1a] layout-transition theme-sync"
    >
      {/* Header */}
      <div className="mb-8 flex w-full items-center overflow-hidden" style={{ height: `${actionSize}px` }}>
        <button
          onClick={() => setExpanded(!expanded)}
          style={{ width: `${actionSize}px`, height: `${actionSize}px` }}
          className="flex flex-shrink-0 items-center justify-center rounded-xl bg-[#49454F] shadow-md transition-all duration-300 hover:bg-[#36333b]"
        >
          <ListBulletIcon className={`h-5 w-5 text-white transition-transform duration-500 ${expanded ? "rotate-90" : ""}`} />
        </button>
        
        <div className={`ml-3 overflow-hidden transition-all duration-500 ${expanded ? "max-w-[140px] opacity-100" : "max-w-0 opacity-0"}`}>
          <span className="whitespace-nowrap text-sm font-bold leading-tight text-[#49454F] block">
            Nova <br/> Boa Vista
          </span>
        </div>
      </div>

      <nav className="flex w-full flex-col gap-2">
        {navItems.map((item) => (
          <NavItem 
            key={item.href} 
            {...item} 
            expanded={expanded} 
            active={currentPath === item.href}
          />
        ))}
      </nav>

      <div className="mt-auto w-full pt-4">
        <NavItem 
          icon={Cog6ToothIcon} 
          label="Ajustes" 
          href="/settings" 
          expanded={expanded} 
          active={currentPath === "/settings"}
        />
      </div>
    </aside>
  );
};

export default Sidebar;