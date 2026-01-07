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
      {/* <div className="relative w-96 group"> */}
        <NavbarSearch />
        {/* <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-[#49454F]/50 group-focus-within:text-[#49454F] dark:group-focus-within:text-white transition-colors" />
        </span>
        <input
          type="search"
          className="block w-full py-2 pl-10 pr-3 text-sm bg-white dark:bg-[#2d2d2d] border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#49454F] dark:text-white placeholder:text-gray-400"
          placeholder="Pesquisar..."
        /> */}
      {/* </div> */}

      {/* Ações da Direita */}
      <div className="flex items-center gap-4">
        {/* Toggle Dark Mode */}
        <ThemeToggle />
        
        {/* Notificações */}
        <NotificationMenu />
        {/* <div className="relative">
          <button className="p-2 rounded-lg hover:bg-[#E8DEF8] dark:hover:bg-[#3d334d] transition-colors text-[#49454F] dark:text-gray-300">
            <BellIcon className="h-6 w-6" />
          </button>
          <span className="absolute top-2 right-2 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
        </div> */}

        <div className="w-[1px] h-8 bg-gray-300 dark:bg-gray-600 mx-2" />

        {/* <GlobalSearch /> */}

        {/* Perfil com Dropdown */}
        <UserMenu user={session?.user}/>
      </div>
    </nav>
  );
}