"use server"

import { prisma } from "@/lib/prisma/prisma"
import { RegisterInput, AuthResponse, RegisterSchema } from "@/models/auth/auth.model"
import bcrypt from "bcryptjs"

export async function registerAction(data: RegisterInput): Promise<AuthResponse> {
  try {
    // Validação no servidor (segurança extra)
    const result = RegisterSchema.safeParse(data);
    
    if (!result.success) {
      // Junta todos os erros em uma string só ou mapeia para um objeto
      const errorMessage = result.error.issues
        .map((issue) => issue.message)
        .join(", ");

      return { 
        success: false, 
        message: errorMessage
      };
    }
    const { name, email, password } = result.data;
    console.log(email);
    const userExists = await prisma.user.findUnique({ where: { email: email } });
    console.log(userExists);
    
    if (userExists) return { success: false, message: "E-mail já cadastrado" }

    console.log('uouououou');

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword,
      }
    })

    return { success: true, message: "Usuário criado!", user: { id: user.id, email: user.email } }
  } catch (error) {
    console.error(error);
    return { success: false, message: "Erro interno no servidor" }
  }
}