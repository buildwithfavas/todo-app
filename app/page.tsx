import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import DashboardContainer from "@/components/dashboard-container";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 via-slate-100 to-zinc-50 text-zinc-900 py-12 px-4 sm:px-6 lg:px-8">
      <DashboardContainer user={session.user} />
    </div>
  );
}
