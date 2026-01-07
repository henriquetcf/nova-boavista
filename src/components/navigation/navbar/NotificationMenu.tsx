'use client'

import { Dropdown } from "@/components/ui/Dropdown";
import { BellIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

interface NotificationOptions {
  label: string;
  description?: string;
  time?: string;
  icon?: React.ElementType;
  onClick?: () => void;
  href?: string;
  variant?: "default" | "danger";
  showBadge?: boolean
}
// Dentro da sua Navbar ou componente de notificações
export function NotificationMenu() {
  const [hasUnread, setHasUnread] = useState(true); // Isso viria do seu banco/contexto

  const notificacoes: NotificationOptions[] = [
    { 
      label: "Processo Atualizado", 
      description: "O processo #4502 teve uma nova movimentação da Receita Federal.",
      time: "2 min atrás",
      showBadge: true 
    },
    { 
      label: "Mensagem do Cliente", 
      description: "João enviou os documentos pendentes para a análise de fluxo.",
      time: "1h atrás" 
    },
  ];  

  return (
    <Dropdown 
      type="notification"
      options={notificacoes}
      trigger={(isOpen) => {
        // Se o dropdown abriu, marcamos como lido (remove o badge)
        if (isOpen && hasUnread) setHasUnread(false);

        return (
          <div className={`relative p-2 rounded-lg transition-colors ${isOpen ? 'bg-[#E8DEF8] dark:bg-[#3d334d]' : 'hover:bg-[#E8DEF8] dark:hover:bg-[#3d334d]'}`}>
            <BellIcon className="h-6 w-6 text-[#49454F] dark:text-gray-300" />
            
            {/* O Badge só aparece se houver unread E o dropdown estiver fechado */}
            {hasUnread && !isOpen && (
              <span className="absolute top-2 right-2 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
              </span>
            )}
          </div>
        );
      }}
    />
  );
}