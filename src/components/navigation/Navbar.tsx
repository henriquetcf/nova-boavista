import { 
  MagnifyingGlassIcon, 
  BellIcon, 
} from "@heroicons/react/24/outline";
import { ThemeToggle } from "../theme/ThemeToggle";
import { UserMenu } from "./navbar/UserMenu";
import { auth } from "@/auth";
import { NotificationMenu } from "./navbar/NotificationMenu";
import { GlobalSearch } from "./GlobalSearch";
import { NavbarSearch } from "./navbar/NavbarSearch";

export default async function Navbar() {
  const session = await auth();
  return (
    <nav 
      style={{ left: 'var(--sidebar-width)', backdropFilter: 'none' }}
      className="fixed top-0 right-0 z-30 h-16 bg-[#ededed]/80 dark:bg-[#1a1a1a]/80 backdrop-blur-md dark:border-gray-700/50 flex items-center justify-between px-8 layout-transition theme-sync"
    >
      {/* Barra de Busca */}
      <NavbarSearch />

      {/* Ações da Direita */}
      <div className="flex items-center gap-4">
        {/* Toggle Dark Mode */}
        <ThemeToggle />
        
        {/* Notificações */}
        <NotificationMenu />

        <div className="w-[1px] h-8 bg-gray-300 dark:bg-gray-600 mx-2" />

        {/* Perfil com Dropdown */}
        <UserMenu user={session?.user}/>
      </div>
    </nav>
  );
}