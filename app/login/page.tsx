import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import LoginForm from "@/components/login-form";

export default async function LoginPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (session) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-tr from-indigo-50 via-purple-50 to-slate-100 px-4 py-12">
      <LoginForm />
    </div>
  );
}
