import { AppShell } from "@/components/layout/app-shell";
import { requireAuth } from "@/lib/session";
import { getTransactionsList } from "@/lib/services/transactions";
import { TransactionsClient } from "./transactions-client";

export const dynamic = "force-dynamic";

export default async function TransactionsPage() {
  const user = await requireAuth();
  const rawTxs = await getTransactionsList();

  const transactions = rawTxs.map((t) => ({
    id: t.id,
    invoiceNumber: t.invoiceNumber,
    createdAt: t.createdAt.toISOString(),
    subtotal: t.subtotal,
    discount: t.discount,
    total: t.total,
    paymentMethod: t.paymentMethod,
    paidAmount: t.paidAmount,
    changeAmount: t.changeAmount,
    cashierName: t.cashierName,
    itemsCount: t.itemsCount,
    itemsSummary: t.itemsSummary,
  }));

  return (
    <AppShell userRole={user.role} userName={user.name}>
      <TransactionsClient initialTransactions={transactions} />
    </AppShell>
  );
}
