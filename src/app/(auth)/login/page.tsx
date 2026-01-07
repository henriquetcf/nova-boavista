"use client"

import { LoginInput } from "@/models/auth/auth.model";
import { useAuthStore } from "@/store/auth/useAuthStore";
import { Car, ClipboardList, FileCheck, ShieldCheck } from "lucide-react"
import { useRouter } from "next/navigation";

// import { Car, FileCheck, ShieldCheck, ClipboardList } from 

export default function LoginPage() {

  const { login, isLoading, errors } = useAuthStore();
  const route = useRouter();
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData) as unknown as LoginInput;
    // console.log(data);
    const success = await login(data);
    console.log(success);
    if (success) {
      route.push('/');
    }
  }
  return (
    <div className="flex min-h-screen bg-white dark:bg-[#121212] transition-colors duration-500">
      
      {/* LADO ESQUERDO: LOGIN */}
      <div className="w-full max-w-sm m-auto">
        {/* Logo / Badge em Vinho */}
        <div className="inline-flex items-center justify-center p-2.5 bg-[#800020]/10 dark:bg-[#800020]/20 rounded-xl mb-8">
          <Car className="w-8 h-8 text-[#800020]" strokeWidth={1.5} />
        </div>
        <div className="inline-flex">
          <h2><span className="text-[#800020] font-bold text-4xl ml-4">Nova Boa Vista</span></h2>
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Sistema de Gestão
        </h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400 font-light">
          Acesse para gerenciar documentos e processos.
        </p>

        <form onSubmit={handleLogin} className="mt-10 space-y-5">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Usuário ou Email</label>
            <input 
              type="email" 
              name="email"
              className="w-full mt-1.5 px-4 py-3.5 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl outline-none focus:ring-2 focus:ring-[#800020]/40 focus:border-[#800020] transition-all text-gray-900 dark:text-white"
              placeholder="ex: joao.despachante"
            />
            {errors.email && <span className="text-xs text-red-500 font-medium">{errors.email}</span>}
          </div>

          <div>
            <div className="flex justify-between items-center ml-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Senha</label>
              <a href="#" className="text-xs text-[#800020] hover:underline font-medium">Esqueceu a senha?</a>
            </div>
            <input 
              type="password" 
              name='password'
              className="w-full mt-1.5 px-4 py-3.5 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl outline-none focus:ring-2 focus:ring-[#800020]/40 focus:border-[#800020] transition-all text-gray-900 dark:text-white"
              placeholder="••••••••"
            />
            {errors.password && <span className="text-xs text-red-500 font-medium">{errors.password}</span>}
          </div>

          <button disabled={isLoading} className="w-full py-4 bg-[#800020] hover:bg-[#66001a] text-white font-bold rounded-xl shadow-lg shadow-[#800020]/20 active:scale-[0.98] transition-all uppercase tracking-wider text-sm">
            Entrar
          </button>
        </form>

        <footer className="mt-12 text-center text-xs text-gray-400 dark:text-gray-600 uppercase tracking-widest">
          © 2025 Nova Boa Vista Despachante
        </footer>
      </div>
    </div>
  )
}