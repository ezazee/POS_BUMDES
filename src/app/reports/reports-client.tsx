"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { formatCurrency } from "@/lib/utils";
import { Icon } from "@/components/ui/icon";
import type { ReportData } from "@/lib/services/reports";

export function ReportsClient({ initialData }: { initialData: ReportData }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentFilter = searchParams.get("filter") || "month";
  const [filter, setFilter] = useState(currentFilter);
  const [customStart, setCustomStart] = useState(searchParams.get("start") || "");
  const [customEnd, setCustomEnd] = useState(searchParams.get("end") || "");

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
    if (newFilter !== "custom") {
      router.push(`/reports?filter=${newFilter}`);
    }
  };

  const handleApplyCustomDate = (e: React.FormEvent) => {
    e.preventDefault();
    if (customStart && customEnd) {
      router.push(`/reports?filter=custom&start=${customStart}&end=${customEnd}`);
    }
  };

  return (
    <div className="flex flex-col gap-space-xl">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
        <div>
          <div className="flex items-center gap-space-xs text-text-secondary text-caption-medium font-caption-medium mb-1">
            <span>Laporan</span>
            <Icon name="chevron_right" className="w-3.5 h-3.5" />
            <span className="text-text-primary font-semibold">Keuangan Ringkas</span>
          </div>
          <h1 className="font-headline-page text-headline-page text-text-primary tracking-tight">
            Laporan Penjualan & Keuangan
          </h1>
          <p className="font-body-regular text-body-regular text-text-secondary mt-0.5">
            Ringkasan performa omzet harian, laba kotor sederhana, dan volume penjualan unit usaha BUMDes.
          </p>
        </div>

        <div className="flex items-center gap-space-sm flex-wrap">
          <button
            type="button"
            onClick={() => window.print()}
            className="h-10 px-space-md bg-primary-container text-on-primary rounded-xl shadow-sm hover:bg-primary-hover transition-colors font-label-button text-label-button flex items-center gap-space-xs cursor-pointer"
          >
            <Icon name="print" className="w-4 h-4" />
            <span>Cetak Laporan</span>
          </button>
        </div>
      </div>

      {/* Date Range Filter Bar */}
      <div className="bg-surface rounded-2xl p-space-md shadow-xs border border-border-subtle flex flex-col gap-space-sm">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => handleFilterChange("today")}
            className={`px-space-md py-1.5 rounded-full text-caption-medium font-caption-medium transition-colors whitespace-nowrap cursor-pointer ${
              filter === "today"
                ? "bg-primary-container text-on-primary shadow-xs font-semibold"
                : "bg-surface-container-low text-text-secondary hover:bg-surface-container"
            }`}
          >
            Hari Ini
          </button>
          <button
            type="button"
            onClick={() => handleFilterChange("7days")}
            className={`px-space-md py-1.5 rounded-full text-caption-medium font-caption-medium transition-colors whitespace-nowrap cursor-pointer ${
              filter === "7days"
                ? "bg-primary-container text-on-primary shadow-xs font-semibold"
                : "bg-surface-container-low text-text-secondary hover:bg-surface-container"
            }`}
          >
            7 Hari Terakhir
          </button>
          <button
            type="button"
            onClick={() => handleFilterChange("month")}
            className={`px-space-md py-1.5 rounded-full text-caption-medium font-caption-medium transition-colors whitespace-nowrap cursor-pointer ${
              filter === "month"
                ? "bg-primary-container text-on-primary shadow-xs font-semibold"
                : "bg-surface-container-low text-text-secondary hover:bg-surface-container"
            }`}
          >
            Bulan Ini
          </button>
          <button
            type="button"
            onClick={() => setFilter("custom")}
            className={`px-space-md py-1.5 rounded-full text-caption-medium font-caption-medium transition-colors flex items-center gap-1 whitespace-nowrap cursor-pointer ${
              filter === "custom"
                ? "bg-primary-container text-on-primary shadow-xs font-semibold"
                : "bg-surface-container-low text-text-secondary hover:bg-surface-container"
            }`}
          >
            <Icon name="calendar_month" className="w-4 h-4" />
            <span>Kustom Tanggal</span>
          </button>
        </div>

        {/* Custom date range picker if active */}
        {filter === "custom" && (
          <form onSubmit={handleApplyCustomDate} className="flex flex-wrap items-center gap-space-sm pt-2 border-t border-border-subtle">
            <div className="flex items-center gap-2">
              <label className="text-caption-small text-text-secondary font-medium">Dari:</label>
              <input
                type="date"
                required
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
                className="h-9 px-3 rounded-xl bg-surface-container-low border border-border-subtle text-caption-medium text-text-primary focus:outline-none focus:ring-1 focus:ring-primary-container"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-caption-small text-text-secondary font-medium">Sampai:</label>
              <input
                type="date"
                required
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
                className="h-9 px-3 rounded-xl bg-surface-container-low border border-border-subtle text-caption-medium text-text-primary focus:outline-none focus:ring-1 focus:ring-primary-container"
              />
            </div>
            <button
              type="submit"
              className="h-9 px-4 rounded-xl bg-primary text-on-primary text-caption-medium font-semibold hover:bg-primary-hover transition-colors cursor-pointer"
            >
              Terapkan Filter
            </button>
          </form>
        )}
      </div>

      {/* 4 Metrics Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-space-sm sm:gap-space-md">
        {/* Card 1: Omzet */}
        <div className="bg-surface rounded-2xl p-3 sm:p-space-lg shadow-sm border border-border-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-caption-medium text-caption-medium text-text-secondary uppercase tracking-wider">
              Total Omzet Penjualan
            </span>
            <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center text-primary-container">
              <Icon name="payments" className="w-6 h-6 text-primary-container" />
            </div>
          </div>
          <div className="mt-space-md">
            <span className="font-display-currency text-headline-page lg:text-[28px] font-bold text-text-primary tracking-tight font-mono-tabular">
              {formatCurrency(initialData.metrics.totalRevenue)}
            </span>
            <div className="flex items-center gap-1 mt-1 text-caption-small text-status-success font-medium">
              <Icon name="trending_up" className="w-4 h-4 text-status-success" />
              <span>Total omzet periode ini</span>
            </div>
          </div>
        </div>

        {/* Card 2: Laba Kotor */}
        <div className="bg-surface rounded-2xl p-3 sm:p-space-lg shadow-sm border border-border-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-caption-medium text-caption-medium text-text-secondary uppercase tracking-wider">
              Laba Kotor Sederhana
            </span>
            <div className="w-10 h-10 rounded-xl bg-status-success/10 flex items-center justify-center text-status-success">
              <Icon name="query_stats" className="w-6 h-6 text-status-success" />
            </div>
          </div>
          <div className="mt-space-md">
            <span className="font-display-currency text-headline-page lg:text-[28px] font-bold text-status-success tracking-tight font-mono-tabular">
              {formatCurrency(initialData.metrics.grossProfit)}
            </span>
            <div className="flex items-center gap-1 mt-1 text-caption-small text-text-secondary">
              <Icon name="price_check" className="w-4 h-4 text-secondary" />
              <span>Harga Jual - Harga Beli</span>
            </div>
          </div>
        </div>

        {/* Card 3: Jumlah Transaksi */}
        <div className="bg-surface rounded-2xl p-3 sm:p-space-lg shadow-sm border border-border-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-caption-medium text-caption-medium text-text-secondary uppercase tracking-wider">
              Jumlah Transaksi
            </span>
            <div className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center text-primary">
              <Icon name="receipt_long" className="w-6 h-6 text-primary" />
            </div>
          </div>
          <div className="mt-space-md">
            <span className="font-display-currency text-headline-page lg:text-[28px] font-bold text-text-primary tracking-tight font-mono-tabular">
              {initialData.metrics.transactionsCount}
            </span>
            <div className="flex items-center gap-1 mt-1 text-caption-small text-text-secondary">
              <Icon name="check_circle" className="w-4 h-4 text-secondary" />
              <span>Nota berhasil diselesaikan</span>
            </div>
          </div>
        </div>

        {/* Card 4: Total Produk Terjual */}
        <div className="bg-surface rounded-2xl p-3 sm:p-space-lg shadow-sm border border-border-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-caption-medium text-caption-medium text-text-secondary uppercase tracking-wider">
              Total Barang Terjual
            </span>
            <div className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center text-secondary">
              <Icon name="shopping_cart" className="w-6 h-6 text-secondary" />
            </div>
          </div>
          <div className="mt-space-md">
            <span className="font-display-currency text-headline-page lg:text-[28px] font-bold text-text-primary tracking-tight font-mono-tabular">
              {initialData.metrics.productsSoldCount}
            </span>
            <div className="flex items-center gap-1 mt-1 text-caption-small text-text-secondary">
              <Icon name="inventory" className="w-4 h-4 text-secondary" />
              <span>Total unit item terjual</span>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Breakdown Table */}
      <div className="bg-surface rounded-2xl shadow-sm border border-border-subtle overflow-hidden">
        <div className="px-space-xl py-space-md border-b border-border-subtle flex items-center justify-between">
          <div>
            <h2 className="font-headline-section text-headline-section text-text-primary font-bold">
              Rekapitulasi Harian
            </h2>
            <p className="font-caption-small text-caption-small text-text-secondary">
              Rincian omzet, laba kotor, dan jumlah transaksi per tanggal
            </p>
          </div>
        </div>

        {initialData.dailyBreakdown.length === 0 ? (
          <div className="py-16 text-center flex flex-col items-center justify-center text-text-secondary">
            <Icon name="bar_chart" className="w-12 h-12 text-text-muted mb-2" />
            <p className="font-body-medium text-body-medium">Belum ada data penjualan pada rentang waktu ini</p>
            <p className="font-caption-small text-caption-small text-text-muted mt-0.5">
              Pilih rentang tanggal lain atau proses transaksi di kasir.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low text-text-secondary font-caption-medium text-caption-small border-b border-border-subtle">
                  <th className="py-3 px-space-md font-semibold">Tanggal</th>
                  <th className="py-3 px-space-md font-semibold text-center">Jumlah Transaksi</th>
                  <th className="py-3 px-space-md font-semibold text-right">Omzet Penjualan</th>
                  <th className="py-3 px-space-md font-semibold text-right">Laba Kotor</th>
                  <th className="py-3 px-space-md font-semibold text-right">Rata-rata Nota</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle font-body-regular text-body-regular">
                {initialData.dailyBreakdown.map((row) => (
                  <tr key={row.dateKey} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="py-3.5 px-space-md font-medium text-text-primary">
                      {row.formattedDate}
                    </td>
                    <td className="py-3.5 px-space-md text-center font-mono-tabular">
                      {row.transactionsCount} nota
                    </td>
                    <td className="py-3.5 px-space-md text-right font-mono-tabular font-bold text-text-primary">
                      {formatCurrency(row.revenue)}
                    </td>
                    <td className="py-3.5 px-space-md text-right font-mono-tabular font-semibold text-status-success">
                      +{formatCurrency(row.grossProfit)}
                    </td>
                    <td className="py-3.5 px-space-md text-right font-mono-tabular text-text-secondary">
                      {formatCurrency(row.averageTransaction)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
