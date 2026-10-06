import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { requireRole } from "@/lib/session";
import { getDashboardData } from "@/lib/services/dashboard";
import { formatCurrency, formatTimeOnly } from "@/lib/utils";
import { Icon } from "@/components/ui/icon";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await requireRole(["ADMIN"]);
  const data = await getDashboardData();

  return (
    <AppShell userRole={user.role} userName={user.name}>
      <div className="flex flex-col gap-space-xl">
        {/* Top Header & Breadcrumb */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md">
          <div className="flex flex-col gap-space-xs">
            <div className="flex items-center gap-space-sm">
              <h1 className="font-headline-page text-headline-page text-text-primary tracking-tight">
                Dashboard Ringkasan Operasional
              </h1>
              <div className="flex items-center gap-space-xs bg-surface-container-low px-space-sm py-0.5 rounded-full">
                <span className="w-2 h-2 rounded-full bg-status-success animate-pulse" />
                <span className="font-caption-medium text-caption-medium text-text-secondary">
                  Kasir Aktif: Shift 1
                </span>
              </div>
            </div>
            <p className="font-body-regular text-body-regular text-text-secondary">
              Pantau performa penjualan, ketersediaan stok produk desa, dan aktivitas transaksi hari ini.
            </p>
          </div>

          <div className="flex items-center gap-space-sm flex-wrap">
            <Link
              href="/products"
              className="inline-flex items-center gap-space-xs px-space-md py-2.5 rounded-xl bg-surface border border-border-subtle text-text-primary font-label-button text-label-button shadow-xs hover:bg-surface-container-low transition-all"
            >
              <Icon name="inventory" className="w-4 h-4 text-text-secondary" />
              <span>Kelola Produk</span>
            </Link>
            <Link
              href="/pos"
              className="inline-flex items-center gap-space-xs px-space-lg py-2.5 rounded-xl bg-primary-container text-on-primary font-label-button text-label-button shadow-sm hover:bg-primary-hover transition-all"
            >
              <Icon name="point_of_sale" className="w-5 h-5 text-on-primary" />
              <span>Buka Kasir POS</span>
            </Link>
          </div>
        </div>

        {/* 4 Metric Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-space-sm sm:gap-space-md">
          {/* Card 1: Omzet Hari Ini */}
          <div className="bg-surface rounded-2xl p-3 sm:p-space-lg shadow-sm border border-border-subtle flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="font-caption-medium text-caption-medium text-text-secondary uppercase tracking-wider">
                Omzet Hari Ini
              </span>
              <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center text-primary-container">
                <Icon name="payments" className="w-6 h-6 text-primary-container" />
              </div>
            </div>
            <div className="mt-space-md">
              <div className="font-display-currency text-headline-page lg:text-[28px] font-bold text-text-primary tracking-tight">
                {formatCurrency(data.todayRevenue)}
              </div>
              <div className="flex items-center gap-1 mt-1 text-caption-small font-caption-medium text-status-success">
                <Icon name="trending_up" className="w-4 h-4 text-status-success" />
                <span>Penjualan unit usaha toko desa</span>
              </div>
            </div>
          </div>

          {/* Card 2: Transaksi Hari Ini */}
          <div className="bg-surface rounded-2xl p-3 sm:p-space-lg shadow-sm border border-border-subtle flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="font-caption-medium text-caption-medium text-text-secondary uppercase tracking-wider">
                Transaksi Hari Ini
              </span>
              <div className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center text-primary">
                <Icon name="receipt_long" className="w-6 h-6 text-primary" />
              </div>
            </div>
            <div className="mt-space-md">
              <div className="font-display-currency text-headline-page lg:text-[28px] font-bold text-text-primary tracking-tight">
                {data.todayTransactionsCount}
              </div>
              <div className="flex items-center gap-1 mt-1 text-caption-small font-caption-medium text-text-secondary">
                <Icon name="check_circle" className="w-4 h-4 text-secondary" />
                <span>Nota transaksi tersimpan</span>
              </div>
            </div>
          </div>

          {/* Card 3: Total Produk */}
          <div className="bg-surface rounded-2xl p-3 sm:p-space-lg shadow-sm border border-border-subtle flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="font-caption-medium text-caption-medium text-text-secondary uppercase tracking-wider">
                Total Produk
              </span>
              <div className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center text-secondary">
                <Icon name="inventory_2" className="w-6 h-6 text-secondary" />
              </div>
            </div>
            <div className="mt-space-md">
              <div className="font-display-currency text-headline-page lg:text-[28px] font-bold text-text-primary tracking-tight">
                {data.totalProductsCount}
              </div>
              <div className="flex items-center gap-1 mt-1 text-caption-small font-caption-medium text-text-secondary">
                <Icon name="category" className="w-4 h-4 text-secondary" />
                <span>Item aktif di katalog POS</span>
              </div>
            </div>
          </div>

          {/* Card 4: Stok Menipis */}
          <div className="bg-surface rounded-2xl p-3 sm:p-space-lg shadow-sm border border-border-subtle flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="font-caption-medium text-caption-medium text-text-secondary uppercase tracking-wider">
                Stok Menipis
              </span>
              <div className="w-10 h-10 rounded-xl bg-status-warning/10 flex items-center justify-center text-status-warning">
                <Icon name="warning" className="w-6 h-6 text-status-warning" />
              </div>
            </div>
            <div className="mt-space-md">
              <div className="font-display-currency text-headline-page lg:text-[28px] font-bold text-status-warning tracking-tight">
                {data.lowStockProductsCount} Produk
              </div>
              <div className="flex items-center gap-1 mt-1 text-caption-small font-caption-medium text-status-warning">
                <Icon name="warning" className="w-4 h-4 text-status-warning" />
                <span>Stok ≤ 5 perlu pengadaan</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main 2-Column Split: Recent Transactions + Low Stock List */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
          {/* Recent Transactions (~65% width) */}
          <div className="lg:col-span-8 bg-surface rounded-2xl shadow-sm border border-border-subtle overflow-hidden">
            <div className="px-space-xl py-space-lg border-b border-border-subtle flex items-center justify-between">
              <div>
                <h2 className="font-headline-section text-headline-section text-text-primary">
                  Transaksi Penjualan Terbaru
                </h2>
                <p className="font-caption-small text-caption-small text-text-secondary">
                  Aktivitas kasir dan struk yang baru saja diselesaikan
                </p>
              </div>
              <Link
                href="/transactions"
                className="text-primary hover:text-primary-hover font-label-button text-caption-medium flex items-center gap-1"
              >
                <span>Lihat Semua</span>
                <Icon name="arrow_forward" className="w-4 h-4" />
              </Link>
            </div>

            {data.recentTransactions.length === 0 ? (
              <div className="p-space-2xl text-center flex flex-col items-center justify-center text-text-secondary">
                <Icon name="receipt_long" className="w-12 h-12 text-text-muted mb-2" />
                <p className="font-body-medium text-body-medium">Belum ada transaksi hari ini</p>
                <p className="font-caption-small text-caption-small text-text-muted mt-1">
                  Buka kasir untuk mulai melayani transaksi penjualan desa.
                </p>
                <Link
                  href="/pos"
                  className="mt-4 px-space-md py-2 bg-primary-container text-on-primary font-label-button text-caption-medium rounded-lg"
                >
                  Mulai Kasir POS
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-low text-text-secondary font-caption-medium text-caption-small border-b border-border-subtle">
                      <th className="py-3 px-space-md font-semibold">No. Invoice</th>
                      <th className="py-3 px-space-md font-semibold">Waktu</th>
                      <th className="py-3 px-space-md font-semibold">Kasir</th>
                      <th className="py-3 px-space-md font-semibold">Jumlah Item</th>
                      <th className="py-3 px-space-md font-semibold">Metode</th>
                      <th className="py-3 px-space-md font-semibold text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle font-body-regular text-body-regular">
                    {data.recentTransactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-surface-container-low/50 transition-colors">
                        <td className="py-3.5 px-space-md font-mono-tabular font-medium text-primary">
                          <Link href={`/transactions/${tx.id}`} className="hover:underline">
                            {tx.invoiceNumber}
                          </Link>
                        </td>
                        <td className="py-3.5 px-space-md text-text-secondary text-caption-medium">
                          {formatTimeOnly(tx.createdAt)}
                        </td>
                        <td className="py-3.5 px-space-md text-text-primary text-body-medium">
                          {tx.cashierName}
                        </td>
                        <td className="py-3.5 px-space-md text-text-secondary">
                          {tx.itemsCount} item
                        </td>
                        <td className="py-3.5 px-space-md">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                              tx.paymentMethod === "CASH"
                                ? "bg-status-success/15 text-status-success"
                                : tx.paymentMethod === "QRIS"
                                ? "bg-primary-light text-primary"
                                : "bg-surface-container text-text-secondary"
                            }`}
                          >
                            {tx.paymentMethod}
                          </span>
                        </td>
                        <td className="py-3.5 px-space-md font-mono-tabular font-bold text-text-primary text-right">
                          {formatCurrency(tx.total)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Right Column: Low Stock Alerts (~35% width) */}
          <div className="lg:col-span-4 bg-surface rounded-2xl shadow-sm border border-border-subtle overflow-hidden">
            <div className="px-space-lg py-space-md border-b border-border-subtle flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <Icon name="warning" className="w-5 h-5 text-status-warning" />
                <h3 className="font-title-card text-title-card text-text-primary">
                  Peringatan Stok Tipis
                </h3>
              </div>
              <Link
                href="/products"
                className="text-primary hover:text-primary-hover font-caption-medium text-caption-small"
              >
                Katalog
              </Link>
            </div>

            <div className="p-space-md flex flex-col gap-space-sm">
              {data.lowStockItems.length === 0 ? (
                <div className="py-8 text-center flex flex-col items-center justify-center text-text-secondary">
                  <Icon name="check_circle" className="w-9 h-9 text-status-success mb-1" />
                  <p className="font-caption-medium text-caption-medium">Semua stok dalam kondisi aman</p>
                  <p className="font-caption-small text-caption-small text-text-muted mt-0.5">
                    Tidak ada produk di bawah ambang minimum.
                  </p>
                </div>
              ) : (
                data.lowStockItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-space-sm rounded-xl bg-surface-container-low flex items-center justify-between border border-border-subtle/50"
                  >
                    <div className="flex flex-col min-w-0 pr-2">
                      <span className="font-title-card text-body-medium text-text-primary truncate">
                        {item.name}
                      </span>
                      <span className="font-caption-small text-[11px] text-text-secondary">
                        SKU: {item.sku} • {item.category}
                      </span>
                    </div>
                    <div className="flex flex-col items-end shrink-0">
                      <span
                        className={`px-2 py-0.5 rounded-full font-mono-tabular font-bold text-caption-small ${
                          item.stock === 0
                            ? "bg-status-danger/15 text-status-danger"
                            : "bg-status-warning/20 text-status-warning"
                        }`}
                      >
                        {item.stock === 0 ? "Habis (0)" : `Sisa ${item.stock}`}
                      </span>
                      <span className="font-caption-small text-caption-small text-text-muted mt-0.5 font-mono-tabular">
                        {formatCurrency(item.sellingPrice)}
                      </span>
                    </div>
                  </div>
                ))
              )}

              <div className="mt-space-xs p-space-sm rounded-xl bg-primary-light/50 border border-primary-light flex items-center gap-space-xs text-text-secondary text-caption-small">
                <Icon name="help" className="w-4 h-4 text-primary shrink-0" />
                <span>Segera lakukan pengadaan untuk produk yang stoknya habis agar kasir tetap lancar.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
