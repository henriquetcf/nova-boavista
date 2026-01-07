"use client"

import { ClipboardList, FileCheck, Moon, ShieldCheck, Sun } from "lucide-react"
import { useTheme } from "next-themes";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { setTheme, resolvedTheme } = useTheme();

  const toggleTheme = () => {
    const target = resolvedTheme === "dark" ? "light" : "dark"
    if (!document.startViewTransition) {
      setTheme(target)
      return
    }
    document.startViewTransition(() => setTheme(target))
  }

  return (
    <div className="flex min-h-screen bg-white dark:bg-[#121212] transition-colors duration-500">
      
      {/* LADO ESQUERDO: CONTEÚDO DINÂMICO (Login, Registro, etc) */}
      <div className="flex-1 flex flex-col justify-center px-8 lg:px-24 py-12">
        {children}
      </div>

      {/* LADO DIREITO: VISUAL DESPACHANTE */}
      <div className="hidden lg:flex flex-1 relative bg-[#ededed] dark:bg-[#1a1a1a] items-center justify-center overflow-hidden">
        {/* BOTÃO DE TEMA (DISCRETO NO CANTO SUPERIOR DIREITO) */}
        <button 
          onClick={toggleTheme}
          className="absolute top-8 right-8 p-3 rounded-2xl bg-white/50 dark:bg-white/5 backdrop-blur-md border border-white/20 dark:border-white/10 hover:scale-110 active:scale-95 transition-all z-50 shadow-sm"
        >
          <div className="w-5 h-5 flex items-center justify-center">
            <Sun className="hidden dark:block text-yellow-400" strokeWidth={1.5} />
            <Moon className="block dark:hidden text-[#800020]" strokeWidth={1.5} />
          </div>
        </button>

        {/* Grid Sutil */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.07] pointer-events-none" 
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M60 60H0V0h60v60zM1 59h58V1H1v58z' fill='%23000' fill-rule='evenodd'/%3E%3C/svg%3E")` }} 
        />
        
        <div className="relative z-10 w-full max-w-lg p-8">
          {/* Card Flutuante (Efeito Documento/Dashboard) */}
          <div className="bg-white/80 dark:bg-[#121212]/50 backdrop-blur-xl border border-white dark:border-white/5 rounded-[2.5rem] shadow-2xl p-8 transition-all">
            
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-[#800020] rounded-2xl flex items-center justify-center shadow-lg shadow-[#800020]/30">
                <ClipboardList className="text-white w-6 h-6" strokeWidth={1.5} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white leading-none">Processos Ativos</h2>
                <p className="text-sm text-gray-500 mt-1">Status em tempo real</p>
              </div>
            </div>

            {/* Lista de Mockup (Remete a Documentos de Carros) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <FileCheck className="w-5 h-5 text-green-600" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 uppercase">ABC-1234</p>
                    <p className="text-[10px] text-gray-500 uppercase">Transferência concluída</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold py-1 px-2 bg-green-500/10 text-green-600 rounded-md">OK</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-amber-600" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 uppercase">DCA-9876</p>
                    <p className="text-[10px] text-gray-500 uppercase">Licenciamento em análise</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold py-1 px-2 bg-amber-500/10 text-amber-600 rounded-md animate-pulse">PENDENTE</span>
              </div>

              <div className="pt-4">
                <div className="flex justify-between text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-tighter">
                  <span>Meta mensal de emissões</span>
                  <span>78%</span>
                </div>
                <div className="h-2 w-full bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full w-[78%] bg-[#800020] transition-all duration-1000" />
                </div>
              </div>
            </div>
          </div>

          {/* Círculos de luz decorativos em Vinho */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#800020]/20 rounded-full blur-[80px]" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/10 rounded-full blur-[80px]" />
        </div>
      </div>
    </div>
  )
}