'use client'

import { SIDEBAR_CONFIG } from "@/lib/constants";
import { useSidebar } from "@/store/sidebar/useSideBar";
import { usePathname } from "next/navigation";
import { CSSProperties } from "react";
import Sidebar from "../navigation/Sidebar";

interface SidebarStyles extends CSSProperties {
  '--sidebar-width': string;
  '--sidebar-transition': string;
}
export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { expanded, setExpanded } = useSidebar();
  const pathname = usePathname();

  const containerStyle: SidebarStyles = {
    '--sidebar-width': expanded ? `${SIDEBAR_CONFIG.openWidth}px` : `${SIDEBAR_CONFIG.closedWidth}px`,
    '--sidebar-transition': SIDEBAR_CONFIG.transition,
  };

  return (
    <div className="flex min-h-screen bg-[#ededed] dark:bg-[#1a1a1a]" style={containerStyle}>
      {/* 1. Sidebar fixa na esquerda */}
      <Sidebar expanded={expanded} setExpanded={setExpanded} currentPath={pathname} />
      
      {/* 2. Container da Direita: Ele precisa ocupar o resto da largura e ser uma coluna flex */}
      <div className="flex flex-col flex-1 min-h-screen relative">
         {children}
      </div>
    </div>
  );
}