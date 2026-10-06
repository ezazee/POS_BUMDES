import { AppShell } from "@/components/layout/app-shell";
import { requireRole } from "@/lib/session";
import { getReportData } from "@/lib/services/reports";
import { ReportsClient } from "./reports-client";

export const dynamic = "force-dynamic";

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string; start?: string; end?: string }>;
}) {
  const user = await requireRole(["ADMIN"]);
  const { filter, start, end } = await searchParams;

  const data = await getReportData(filter || "month", start, end);

  return (
    <AppShell userRole={user.role} userName={user.name}>
      <ReportsClient initialData={data} />
    </AppShell>
  );
}
