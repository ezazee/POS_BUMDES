import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function RootPage() {
  const { user } = await getCurrentSession();

  if (!user || !user.isActive) {
    redirect("/login");
  }

  if (user.role === "CASHIER") {
    redirect("/pos");
  }

  redirect("/dashboard");
}
