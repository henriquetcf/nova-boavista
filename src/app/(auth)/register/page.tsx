"use client"

import { RegisterInput } from "@/models/auth/auth.model";
import { useAuthStore } from "@/store/auth/useAuthStore"
import { UserPlus, Mail, Lock, User } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation";

export default function RegisterPage() {

  const { register, isLoading, errors, clearErrors } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData) as unknown as RegisterInput
    console.log(data);
    
    const success = await register(data)
    console.log(success);
    if (success) {
      //  window.location.href = "/login"
      router.push('/login');
    }
  }

  return (
    <div className="flex min-h-screen bg-white dark:bg-[#121212] transition-colors duration-500">
      
      {/* LADO ESQUERDO: REGISTRO */}
        <div className="w-full max-w-sm mx-auto">
          <div className="inline-flex items-center justify-center p-2.5 bg-[#800020]/10 dark:bg-[#800020]/20 rounded-xl mb-6">
            <UserPlus className="w-6 h-6 text-[#800020]" strokeWidth={1.5} />
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Criar conta
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Preencha os dados para acessar o painel Boa Vista.
          </p>

          <form onSubmit={handleSubmit} onChange={clearErrors} className="mt-8 space-y-4">
            {/* Nome Completo */}
            <div>
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase ml-1">Nome Completo</label>
              <div className="relative mt-1">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  name="name"
                  className={`w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-[#1a1a1a] border border ${errors.name ? 'border-red-500 bg-red-50/50' : 'border-gray-200'} dark:border-gray-800 rounded-xl outline-none focus:ring-2 focus:ring-[#800020]/40 focus:border-[#800020] transition-all`}
                  placeholder="Seu nome"
                />
                {errors.name && <span className="flex-inline text-xs text-red-500 font-medium">{errors.name}</span>}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase ml-1">E-mail Profissional</label>
              <div className="relative mt-1">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="email" 
                  name="email"
                  className={`w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-[#1a1a1a] border border ${errors.email ? 'border-red-500 bg-red-50/50' : 'border-gray-200'} dark:border-gray-800 rounded-xl outline-none focus:ring-2 focus:ring-[#800020]/40 focus:border-[#800020] transition-all`}
                  placeholder="nome@empresa.com"
                />
                {errors.email && <span className="text-xs text-red-500 font-medium">{errors.email}</span>}
              </div>
            </div>

            {/* Senha */}
            <div>
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase ml-1">Senha</label>
              <div className="relative mt-1">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="password" 
                  name="password"
                  className={`w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-[#1a1a1a] border border ${errors.password ? 'border-red-500 bg-red-50/50' : 'border-gray-200'} dark:border-gray-800 rounded-xl outline-none focus:ring-2 focus:ring-[#800020]/40 focus:border-[#800020] transition-all`}
                  placeholder="••••••••"
                />
                {errors.password && <span className="text-xs text-red-500 font-medium">{errors.password}</span>}
              </div>
            </div>

            <button disabled={isLoading} className="w-full py-4 bg-[#800020] hover:bg-[#66001a] text-white font-bold rounded-xl shadow-lg shadow-[#800020]/20 active:scale-[0.98] transition-all uppercase tracking-wider text-sm mt-4">
              Finalizar Cadastro
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500">
            Já possui uma conta?{" "}
            <Link href="/login" className="text-[#800020] font-bold hover:underline">
              Fazer Login
            </Link>
          </p>
        </div>
      </div>
  )
}