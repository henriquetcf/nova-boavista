'use client'

import { Dropdown, DropdownOption } from "@/components/ui/Dropdown";
import { ArrowLeftOnRectangleIcon, ChevronDownIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { Cog8ToothIcon, UserIcon } from "@heroicons/react/24/outline";
import { signOut } from "next-auth/react";

interface UserMenuProps {
  user?: { name?: string | null; role?: string | null };
}
export function UserMenu({ user }: UserMenuProps) {
  const menuOptions: DropdownOption[] = [
    { label: "Perfil", icon: UserIcon, href: "/perfil" },
    { label: "Configurações", icon: Cog8ToothIcon, href: "/settings" },
    { label: "Sair", icon: ArrowLeftOnRectangleIcon, onClick: () => signOut(), variant: "danger" },
  ];

  return (
    <Dropdown
      type="menu"
      options={menuOptions}
      trigger={(open) => (
        <div className={`flex items-center gap-3 p-1.5 pl-3 rounded-xl transition-all ${open ? 'bg-[#E8DEF8] dark:bg-[#3d334d]' : 'hover:bg-[#E8DEF8] dark:hover:bg-[#3d334d]'}`}>
          <div className="text-right hidden sm:block leading-tight">
            <p className="text-xs font-bold text-[#49454F] dark:text-gray-200">{user?.name}</p>
            <p className="text-[10px] opacity-70 text-[#49454F] dark:text-gray-200">ADMIN</p>
          </div>
          <UserCircleIcon className="h-9 w-9 text-[#49454F] dark:text-gray-200" />
          <ChevronDownIcon className={`h-4 w-4 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
        </div>
      )}
    />
  );
}