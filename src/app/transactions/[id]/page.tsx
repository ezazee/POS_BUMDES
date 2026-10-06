import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { requireAuth } from "@/lib/session";
import { getTransactionById } from "@/lib/services/transactions";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { TransactionDetailActions } from "./detail-actions";
import { Icon } from "@/components/ui/icon";

export const dynamic = "force-dynamic";

export default async function TransactionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireAuth();
  const { id } = await params;
  const tx = await getTransactionById(id);

  if (!tx) {
    notFound();
  }

  return (
    <AppShell userRole={user.role} userName={user.name}>
      <div className="flex flex-col gap-space-xl max-w-4xl mx-auto">
        {/* Breadcrumb & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md">
          <div className="flex items-center gap-space-xs text-caption-medium font-caption-medium text-text-secondary">
            <Link href="/transactions" className="hover:text-primary transition-colors">
              Riwayat Transaksi
            </Link>
            <Icon name="chevron_right" className="w-3.5 h-3.5" />
            <span className="text-text-primary font-semibold">{tx.invoiceNumber}</span>
          </div>

          <div className="flex items-center gap-space-sm">
            <Link
              href="/transactions"
              className="px-4 py-2 rounded-xl bg-surface border border-border-subtle hover:bg-surface-container-low text-text-primary font-label-button text-caption-medium transition-colors"
            >
              Kembali
            </Link>
            <TransactionDetailActions tx={tx} />
          </div>
        </div>

        {/* Invoice Card */}
        <div className="bg-surface rounded-2xl shadow-sm border border-border-subtle overflow-hidden">
          {/* Card Header */}
          <div className="px-space-xl py-space-lg bg-surface-container-low border-b border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
            <div className="flex items-center gap-space-sm">
              <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center text-primary-container">
                <Icon name="receipt_long" className="w-6 h-6 text-primary-container" />
              </div>
              <div>
                <h1 className="font-headline-section text-headline-section text-text-primary font-bold">
                  {tx.invoiceNumber}
                </h1>
                <p className="font-caption-small text-caption-small text-text-secondary">
                  Waktu: {formatDateTime(tx.createdAt)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-status-success/15 text-status-success font-caption-medium text-caption-small font-semibold">
                Selesai & Lunas
              </span>
              <span className="px-3 py-1 rounded-full bg-surface-container text-text-primary font-caption-medium text-caption-small">
                {tx.paymentMethod}
              </span>
            </div>
          </div>

          {/* Meta Info Grid */}
          <div className="p-space-xl grid grid-cols-1 sm:grid-cols-3 gap-space-md border-b border-border-subtle">
            <div className="flex flex-col">
              <span className="font-caption-small text-caption-small text-text-muted">Kasir Bertugas</span>
              <span className="font-body-medium text-body-medium text-text-primary font-semibold mt-0.5">
                {tx.cashierName}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-caption-small text-caption-small text-text-muted">Unit Usaha</span>
              <span className="font-body-medium text-body-medium text-text-primary font-semibold mt-0.5">
                Toko BUMDes Karangsari
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-caption-small text-caption-small text-text-muted">Metode Pembayaran</span>
              <span className="font-body-medium text-body-medium text-text-primary font-semibold mt-0.5">
                {tx.paymentMethod === "CASH" ? "Tunai / Cash" : tx.paymentMethod}
              </span>
            </div>
          </div>

          {/* Purchased Items Table */}
          <div className="p-space-xl">
            <h2 className="font-title-card text-title-card text-text-primary font-semibold mb-space-sm">
              Daftar Barang Belanja
            </h2>
            <div className="overflow-x-auto border border-border-subtle rounded-xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low text-text-secondary font-caption-medium text-caption-small border-b border-border-subtle">
                    <th className="py-2.5 px-space-md font-semibold">Nama Produk</th>
                    <th className="py-2.5 px-space-md font-semibold text-center">Jumlah</th>
                    <th className="py-2.5 px-space-md font-semibold text-right">Harga Satuan</th>
                    <th className="py-2.5 px-space-md font-semibold text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle font-body-regular text-body-regular">
                  {tx.items.map((item) => (
                    <tr key={item.id} className="hover:bg-surface-container-low/50">
                      <td className="py-3 px-space-md font-medium text-text-primary">
                        {item.productName}
                      </td>
                      <td className="py-3 px-space-md text-center font-mono-tabular">
                        {item.quantity}
                      </td>
                      <td className="py-3 px-space-md text-right font-mono-tabular text-text-secondary">
                        {formatCurrency(item.sellingPrice)}
                      </td>
                      <td className="py-3 px-space-md text-right font-mono-tabular font-bold text-text-primary">
                        {formatCurrency(item.subtotal)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Financial Totals Breakdown */}
            <div className="mt-space-md flex flex-col items-end">
              <div className="w-full sm:w-80 flex flex-col gap-1.5 p-space-md rounded-xl bg-surface-container-low border border-border-subtle">
                <div className="flex justify-between text-body-regular text-text-secondary">
                  <span>Subtotal</span>
                  <span className="font-mono-tabular font-semibold text-text-primary">
                    {formatCurrency(tx.subtotal)}
                  </span>
                </div>
                {tx.discount > 0 && (
                  <div className="flex justify-between text-body-regular text-status-success">
                    <span>Diskon</span>
                    <span className="font-mono-tabular font-semibold">
                      -{formatCurrency(tx.discount)}
                    </span>
                  </div>
                )}
                <div className="my-1 h-[1px] bg-border-subtle" />
                <div className="flex justify-between font-headline-section font-bold text-text-primary">
                  <span>TOTAL</span>
                  <span className="font-mono-tabular text-headline-page text-primary-container">
                    {formatCurrency(tx.total)}
                  </span>
                </div>
                <div className="flex justify-between text-caption-medium text-text-secondary pt-1">
                  <span>Nominal Diterima ({tx.paymentMethod})</span>
                  <span className="font-mono-tabular font-semibold text-text-primary">
                    {formatCurrency(tx.paidAmount)}
                  </span>
                </div>
                <div className="flex justify-between text-caption-medium text-text-secondary">
                  <span>Kembalian</span>
                  <span className="font-mono-tabular font-semibold text-status-success">
                    {formatCurrency(tx.changeAmount)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
