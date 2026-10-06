"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { Icon } from "@/components/ui/icon";

export interface TransactionRow {
  id: string;
  invoiceNumber: string;
  createdAt: string;
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod: string;
  paidAmount: number;
  changeAmount: number;
  cashierName: string;
  itemsCount: number;
  itemsSummary: string;
}

export function TransactionsClient({ initialTransactions }: { initialTransactions: TransactionRow[] }) {
  const [transactions] = useState<TransactionRow[]>(initialTransactions);
  const [search, setSearch] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("all");
  const [selectedDate, setSelectedDate] = useState("all");

  // Selected detail modal
  const [activeTx, setActiveTx] = useState<TransactionRow | null>(null);

  // Stats calculation
  const stats = useMemo(() => {
    const totalCount = transactions.length;
    const totalRevenue = transactions.reduce((acc, t) => acc + t.total, 0);
    const avgTicket = totalCount > 0 ? Math.round(totalRevenue / totalCount) : 0;
    const totalItems = transactions.reduce((acc, t) => acc + t.itemsCount, 0);

    return { totalCount, totalRevenue, avgTicket, totalItems };
  }, [transactions]);

  // Filtered rows
  const filtered = useMemo(() => {
    return transactions.filter((tx) => {
      const matchMethod = selectedMethod === "all" || tx.paymentMethod === selectedMethod;
      const q = search.trim().toLowerCase();
      const matchSearch =
        !q ||
        tx.invoiceNumber.toLowerCase().includes(q) ||
        tx.cashierName.toLowerCase().includes(q) ||
        tx.itemsSummary.toLowerCase().includes(q);

      return matchMethod && matchSearch;
    });
  }, [transactions, selectedMethod, search]);

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div className="flex flex-col gap-space-xl">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
        <div>
          <div className="flex items-center gap-space-xs text-caption-medium font-caption-medium text-text-secondary uppercase tracking-wider">
            <span>Unit Usaha Perdagangan</span>
            <span>•</span>
            <span className="text-primary font-body-medium">Laporan Real-time</span>
          </div>
          <h1 className="font-headline-page text-headline-page text-text-primary mt-space-xs tracking-tight">
            Riwayat Transaksi
          </h1>
          <p className="font-body-regular text-body-regular text-text-secondary">
            Semua catatan penjualan kasir BUMDes secara real-time dan terdata aman.
          </p>
        </div>

        <div className="flex items-center gap-space-sm self-start lg:self-auto flex-wrap">
          <Link
            href="/pos"
            className="flex items-center gap-space-xs px-space-md py-2.5 rounded-xl bg-primary-container text-on-primary shadow-sm hover:bg-primary-hover transition-colors font-label-button text-label-button cursor-pointer"
          >
            <Icon name="point_of_sale" className="w-4 h-4 text-on-primary" />
            <span>Buka Kasir POS</span>
          </Link>
        </div>
      </div>

      {/* Mini Stats Summary Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-space-sm sm:gap-space-md">
        {/* Stat 1: Total Transaksi */}
        <div className="flex flex-col p-3 sm:p-space-lg rounded-2xl bg-surface shadow-sm border border-border-subtle relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="font-caption-medium text-caption-medium text-text-secondary">
              Total Transaksi
            </span>
            <span className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-primary">
              <Icon name="receipt" className="w-5 h-5 text-primary" />
            </span>
          </div>
          <div className="mt-space-sm flex items-baseline gap-space-xs">
            <span className="font-display-currency text-headline-page font-bold text-text-primary tracking-tight">
              {stats.totalCount}
            </span>
            <span className="font-caption-medium text-caption-medium text-text-secondary">
              Nota Selesai
            </span>
          </div>
          <div className="mt-space-xs flex items-center gap-space-xs text-status-success font-caption-medium text-caption-small">
            <Icon name="check_circle" className="w-4 h-4 text-status-success" />
            <span>Data penjualan tersimpan</span>
          </div>
        </div>

        {/* Stat 2: Total Penjualan */}
        <div className="flex flex-col p-3 sm:p-space-lg rounded-2xl bg-surface shadow-sm border border-border-subtle relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="font-caption-medium text-caption-medium text-text-secondary">
              Total Penjualan Kotor
            </span>
            <span className="w-8 h-8 rounded-lg bg-primary-light flex items-center justify-center text-primary-container">
              <Icon name="payments" className="w-5 h-5 text-primary-container" />
            </span>
          </div>
          <div className="mt-space-sm">
            <span className="font-display-currency text-headline-page font-bold text-text-primary tracking-tight font-mono-tabular">
              {formatCurrency(stats.totalRevenue)}
            </span>
          </div>
          <div className="mt-space-xs flex items-center gap-space-xs text-status-success font-caption-medium text-caption-small">
            <Icon name="verified" className="w-4 h-4 text-status-success" />
            <span>Semua metode pembayaran</span>
          </div>
        </div>

        {/* Stat 3: Rata-rata per Transaksi */}
        <div className="flex flex-col p-3 sm:p-space-lg rounded-2xl bg-surface shadow-sm border border-border-subtle relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="font-caption-medium text-caption-medium text-text-secondary">
              Rata-rata Nota
            </span>
            <span className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-secondary">
              <Icon name="calculate" className="w-5 h-5 text-secondary" />
            </span>
          </div>
          <div className="mt-space-sm">
            <span className="font-display-currency text-headline-page font-bold text-text-primary tracking-tight font-mono-tabular">
              {formatCurrency(stats.avgTicket)}
            </span>
          </div>
          <div className="mt-space-xs flex items-center gap-space-xs text-text-secondary font-caption-medium text-caption-small">
            <Icon name="trending_flat" className="w-4 h-4 text-text-secondary" />
            <span>Rerata belanja per struk</span>
          </div>
        </div>

        {/* Stat 4: Total Produk Terjual */}
        <div className="flex flex-col p-3 sm:p-space-lg rounded-2xl bg-surface shadow-sm border border-border-subtle relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="font-caption-medium text-caption-medium text-text-secondary">
              Total Barang Terjual
            </span>
            <span className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-secondary">
              <Icon name="shopping_cart" className="w-5 h-5 text-secondary" />
            </span>
          </div>
          <div className="mt-space-sm flex items-baseline gap-space-xs">
            <span className="font-display-currency text-headline-page font-bold text-text-primary tracking-tight font-mono-tabular">
              {stats.totalItems}
            </span>
            <span className="font-caption-medium text-caption-medium text-text-secondary">
              Pcs / Unit
            </span>
          </div>
          <div className="mt-space-xs flex items-center gap-space-xs text-status-success font-caption-medium text-caption-small">
            <Icon name="inventory_2" className="w-4 h-4 text-status-success" />
            <span>Stok berkurang otomatis</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-surface rounded-2xl p-space-md shadow-xs border border-border-subtle flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-space-md">
        <div className="relative flex-1">
          <Icon name="search" className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nomor invoice, nama kasir, atau nama item..."
            className="w-full h-10 pl-10 pr-10 bg-surface-container-low rounded-xl font-body-regular text-body-regular text-text-primary placeholder:text-text-muted focus:outline-none focus:bg-surface focus:ring-2 focus:ring-primary-container border border-transparent transition-all"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
            >
              <Icon name="close" className="w-4 h-4 text-text-muted hover:text-text-primary" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-space-sm flex-wrap">
          {/* Payment Method Filter */}
          <div className="relative min-w-[170px]">
            <select
              value={selectedMethod}
              onChange={(e) => setSelectedMethod(e.target.value)}
              className="w-full h-10 appearance-none bg-surface-container-low px-space-md pr-8 rounded-xl font-body-medium text-body-medium text-text-primary focus:outline-none focus:bg-surface border border-transparent focus:border-border-subtle cursor-pointer"
            >
              <option value="all">Semua Metode</option>
              <option value="CASH">Tunai / Cash</option>
              <option value="QRIS">QRIS Desa</option>
              <option value="TRANSFER">Transfer Bank</option>
            </select>
            <Icon name="expand_more" className="w-4 h-4 pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-text-secondary" />
          </div>

          {/* Date Filter */}
          <div className="relative min-w-[170px]">
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full h-10 appearance-none bg-surface-container-low px-space-md pr-8 rounded-xl font-body-medium text-body-medium text-text-primary focus:outline-none focus:bg-surface border border-transparent focus:border-border-subtle cursor-pointer"
            >
              <option value="all">Semua Waktu</option>
              <option value="today">Hari Ini</option>
              <option value="7days">7 Hari Terakhir</option>
            </select>
            <Icon name="expand_more" className="w-4 h-4 pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-text-secondary" />
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-surface rounded-2xl shadow-sm border border-border-subtle overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center flex flex-col items-center justify-center text-text-secondary">
            <Icon name="receipt_long" className="w-12 h-12 text-text-muted mb-2" />
            <p className="font-body-medium text-body-medium">Belum ada transaksi ditemukan</p>
            <p className="font-caption-small text-caption-small text-text-muted mt-0.5">
              Transaksi yang diproses di kasir POS akan otomatis tercatat di sini.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low text-text-secondary font-caption-medium text-caption-small border-b border-border-subtle">
                  <th className="py-3 px-space-md font-semibold">No. Invoice</th>
                  <th className="py-3 px-space-md font-semibold">Waktu & Tanggal</th>
                  <th className="py-3 px-space-md font-semibold">Kasir</th>
                  <th className="py-3 px-space-md font-semibold">Item & Rincian</th>
                  <th className="py-3 px-space-md font-semibold text-center">Metode</th>
                  <th className="py-3 px-space-md font-semibold text-right">Total Transaksi</th>
                  <th className="py-3 px-space-md font-semibold text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle font-body-regular text-body-regular">
                {filtered.map((tx) => (
                  <tr key={tx.id} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="py-3.5 px-space-md font-mono-tabular font-bold text-primary">
                      <Link href={`/transactions/${tx.id}`} className="hover:underline">
                        {tx.invoiceNumber}
                      </Link>
                    </td>
                    <td className="py-3.5 px-space-md text-text-secondary text-caption-medium">
                      {formatDateTime(tx.createdAt)}
                    </td>
                    <td className="py-3.5 px-space-md text-text-primary text-body-medium">
                      {tx.cashierName}
                    </td>
                    <td className="py-3.5 px-space-md">
                      <div className="flex flex-col">
                        <span className="text-text-primary font-medium">{tx.itemsCount} Item</span>
                        <span className="text-caption-small text-text-secondary truncate max-w-xs">
                          {tx.itemsSummary}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-space-md text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-semibold ${
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
                    <td className="py-3.5 px-space-md text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <Link
                          href={`/transactions/${tx.id}`}
                          className="px-2.5 py-1 rounded-lg bg-surface border border-border-subtle hover:bg-surface-container text-primary font-caption-medium text-caption-small transition-colors"
                        >
                          Rincian
                        </Link>
                        <button
                          type="button"
                          onClick={() => setActiveTx(tx)}
                          className="p-1 rounded-lg hover:bg-surface-container text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                          title="Cetak Ulang Struk"
                        >
                          <Icon name="print" className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* QUICK REPRINT MODAL (80mm) */}
      {activeTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-text-primary/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-surface rounded-2xl shadow-2xl max-w-sm w-full flex flex-col overflow-hidden border border-border-subtle">
            <div className="px-space-md py-space-sm bg-surface-container-low flex items-center justify-between border-b border-border-subtle">
              <div className="flex items-center gap-1.5">
                <Icon name="receipt" className="w-5 h-5 text-primary" />
                <span className="font-caption-medium text-caption-medium text-text-primary font-bold">
                  Cetak Ulang Struk
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActiveTx(null)}
                className="w-7 h-7 rounded bg-surface hover:bg-surface-container text-text-secondary flex items-center justify-center"
              >
                <Icon name="close" className="w-4 h-4 text-text-secondary" />
              </button>
            </div>

            <div className="p-4 bg-white text-black font-mono text-xs overflow-y-auto max-h-[460px]">
              <div id="printable-receipt" className="w-full flex flex-col items-center text-center">
                <h2 className="text-sm font-bold uppercase tracking-wider">
                  BUMDES MANDIRI SEJAHTERA
                </h2>
                <p className="text-[11px] leading-tight text-gray-700 mt-0.5">
                  Jl. Raya Desa Karangsari No. 12, Jawa Tengah
                </p>
                <p className="text-[11px] text-gray-700">Telp: 0812-3456-7890</p>
                <div className="w-full my-2 border-b border-dashed border-gray-400" />

                <div className="w-full text-left text-[11px] space-y-0.5">
                  <div className="flex justify-between">
                    <span>No. Nota:</span>
                    <span className="font-bold">{activeTx.invoiceNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Waktu:</span>
                    <span>{formatDateTime(activeTx.createdAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Kasir:</span>
                    <span>{activeTx.cashierName}</span>
                  </div>
                </div>
                <div className="w-full my-2 border-b border-dashed border-gray-400" />

                <div className="w-full text-left text-[11px] py-1">
                  <span>Ringkasan Item: {activeTx.itemsSummary}</span>
                </div>
                <div className="w-full my-2 border-b border-dashed border-gray-400" />

                <div className="w-full text-left text-[11px] space-y-0.5">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>Rp{activeTx.subtotal.toLocaleString("id-ID")}</span>
                  </div>
                  {activeTx.discount > 0 && (
                    <div className="flex justify-between">
                      <span>Diskon:</span>
                      <span>-Rp{activeTx.discount.toLocaleString("id-ID")}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-xs pt-1 border-t border-gray-300">
                    <span>TOTAL:</span>
                    <span>Rp{activeTx.total.toLocaleString("id-ID")}</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span>Bayar ({activeTx.paymentMethod}):</span>
                    <span>Rp{activeTx.paidAmount.toLocaleString("id-ID")}</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>Kembalian:</span>
                    <span>Rp{activeTx.changeAmount.toLocaleString("id-ID")}</span>
                  </div>
                </div>
                <div className="w-full my-2 border-b border-dashed border-gray-400" />

                <p className="text-[10px] text-gray-600 italic leading-tight text-center mt-1">
                  (SALINAN STRUK)
                  <br />
                  Terima kasih atas kunjungan Anda.
                  <br />
                  Belanja di BUMDes membangun kemandirian desa.
                </p>
              </div>
            </div>

            <div className="p-space-md bg-surface-container-low flex items-center justify-end gap-space-sm border-t border-border-subtle">
              <button
                type="button"
                onClick={() => setActiveTx(null)}
                className="px-4 h-10 rounded-xl bg-surface hover:bg-surface-container text-text-primary font-label-button text-caption-medium border border-border-subtle transition-colors cursor-pointer"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={handlePrintReceipt}
                className="px-5 h-10 rounded-xl bg-primary-container text-on-primary font-label-button text-caption-medium flex items-center gap-1.5 shadow-sm hover:bg-primary-hover transition-colors cursor-pointer"
              >
                <Icon name="print" className="w-4 h-4" />
                <span>Cetak (80mm)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
