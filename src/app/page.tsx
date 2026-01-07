import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function IndexPage() {
  const session = await auth();

  // Se não estiver logado, manda pro login
  if (!session) {
    redirect("/login");
  }

  // Se estiver logado, manda pro dashboard que está dentro de (app)
  redirect("/dashboard");
}