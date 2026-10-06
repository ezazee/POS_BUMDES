"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/icon";

interface SettingData {
  bumdesName: string;
  address: string;
  phone: string;
  receiptFooter: string;
}

export function SettingsClient({ initialSettings }: { initialSettings: SettingData }) {
  const [formData, setFormData] = useState<SettingData>(initialSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setStatusMessage(null);

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setStatusMessage({ type: "error", text: data.message || "Gagal menyimpan pengaturan." });
        setIsSaving(false);
        return;
      }

      setStatusMessage({ type: "success", text: "Pengaturan berhasil diperbarui." });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Kesalahan koneksi.";
      setStatusMessage({ type: "error", text: msg });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-space-xl">
      {/* Top Bar Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
        <div className="flex flex-col gap-space-xs">
          <div className="flex items-center gap-space-xs text-text-secondary font-caption-medium text-caption-medium">
            <span>Pengaturan</span>
            <Icon name="chevron_right" className="w-3.5 h-3.5" />
            <span className="text-primary font-semibold">Umum & Toko</span>
          </div>
          <h1 className="font-headline-page text-headline-page text-text-primary tracking-tight">
            Pengaturan Sistem BUMDes POS
          </h1>
          <p className="font-body-regular text-body-regular text-text-secondary max-w-2xl">
            Konfigurasi informasi unit usaha desa, preferensi struk thermal kasir, dan identitas operasional.
          </p>
        </div>

        <div className="flex items-center gap-space-sm self-start lg:self-center">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSaving}
            className="h-10 px-space-lg bg-primary-container hover:bg-primary-hover text-on-primary font-label-button text-label-button rounded-xl shadow-sm transition-all flex items-center gap-space-xs cursor-pointer disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <Icon name="save" className="w-4 h-4" />
                <span>Simpan Perubahan</span>
              </>
            )}
          </button>
        </div>
      </div>

      {statusMessage && (
        <div
          className={`p-3.5 rounded-xl border flex items-center gap-2 ${
            statusMessage.type === "success"
              ? "bg-status-success/10 border-status-success/30 text-status-success"
              : "bg-status-danger/10 border-status-danger/30 text-status-danger"
          }`}
        >
          <Icon name={statusMessage.type === "success" ? "check_circle" : "error"} className="w-5 h-5 shrink-0" />
          <span className="font-caption-medium text-body-regular">{statusMessage.text}</span>
        </div>
      )}

      {/* Main Grid: Form Sections */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
        {/* Left Column: Form Panels (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-space-lg">
          {/* Card 1: Identitas Unit Usaha */}
          <div className="bg-surface rounded-2xl p-space-xl shadow-sm border border-border-subtle flex flex-col gap-space-md">
            <div className="flex items-center justify-between pb-space-sm border-b border-border-subtle">
              <div className="flex items-center gap-space-sm">
                <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center text-primary">
                  <Icon name="corporate_fare" className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="font-headline-section text-headline-section text-text-primary font-bold">
                    Identitas Unit Usaha Desa
                  </h2>
                  <p className="font-caption-small text-caption-small text-text-secondary">
                    Informasi ini dicetak pada bagian atas (kop) struk pembayaran.
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-caption-small font-caption-medium bg-primary-light text-primary flex items-center gap-1">
                <Icon name="verified" className="w-3.5 h-3.5 text-primary" /> Terverifikasi
              </span>
            </div>

            <div className="flex flex-col gap-space-sm">
              <div className="flex flex-col gap-1">
                <label className="font-title-card text-caption-medium text-text-primary font-semibold">
                  Nama Badan Usaha (BUMDes) <span className="text-status-danger">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.bumdesName}
                  onChange={(e) => setFormData({ ...formData, bumdesName: e.target.value })}
                  placeholder="Contoh: BUMDes Mandiri Sejahtera"
                  className="w-full h-11 px-3.5 rounded-xl bg-surface-container-low text-text-primary border border-border-subtle focus:outline-none focus:ring-2 focus:ring-primary-container text-body-regular"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-title-card text-caption-medium text-text-primary font-semibold">
                  Nomor Telepon / WhatsApp <span className="text-status-danger">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="0812-3456-7890"
                  className="w-full h-11 px-3.5 rounded-xl bg-surface-container-low text-text-primary border border-border-subtle focus:outline-none focus:ring-2 focus:ring-primary-container text-body-regular font-mono-tabular"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-title-card text-caption-medium text-text-primary font-semibold">
                  Alamat Lengkap Toko Desa <span className="text-status-danger">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Jl. Raya Desa Karangsari No. 12, Jawa Tengah"
                  className="w-full p-3 rounded-xl bg-surface-container-low text-text-primary border border-border-subtle focus:outline-none focus:ring-2 focus:ring-primary-container text-body-regular resize-none"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Pengaturan Struk & Thermal Printer */}
          <div className="bg-surface rounded-2xl p-space-xl shadow-sm border border-border-subtle flex flex-col gap-space-md">
            <div className="flex items-center gap-space-sm pb-space-sm border-b border-border-subtle">
              <div className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center text-primary">
                <Icon name="receipt_long" className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="font-headline-section text-headline-section text-text-primary font-bold">
                  Preferensi Struk & Printer Kasir
                </h2>
                <p className="font-caption-small text-caption-small text-text-secondary">
                  Konfigurasi format cetak struk kasir 80mm thermal printer.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-space-sm">
              <div className="p-space-md rounded-xl bg-surface-container-low border border-border-subtle flex items-center justify-between">
                <div className="flex items-center gap-space-sm">
                  <Icon name="print" className="w-6 h-6 text-primary" />
                  <div>
                    <span className="font-title-card text-body-medium text-text-primary block font-semibold">
                      Standar Kertas Thermal: 80mm
                    </span>
                    <span className="font-caption-small text-caption-small text-text-secondary">
                      Didukung otomatis oleh dialog cetak peramban bawaan sistem
                    </span>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-status-success/15 text-status-success font-caption-medium text-caption-small font-semibold">
                  Aktif
                </span>
              </div>

              <div className="flex flex-col gap-1 mt-1">
                <label className="font-title-card text-caption-medium text-text-primary font-semibold">
                  Teks Catatan Kaki Struk (Receipt Footer) <span className="text-status-danger">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  value={formData.receiptFooter}
                  onChange={(e) => setFormData({ ...formData, receiptFooter: e.target.value })}
                  placeholder="Terima kasih atas kunjungan Anda..."
                  className="w-full p-3 rounded-xl bg-surface-container-low text-text-primary border border-border-subtle focus:outline-none focus:ring-2 focus:ring-primary-container text-body-regular resize-none"
                />
                <span className="font-caption-small text-[11px] text-text-secondary">
                  Pesan ucapan terima kasih atau slogan desa yang tercetak di bagian terbawah struk.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Information Preview & Roles (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-space-lg">
          {/* Preview Card */}
          <div className="bg-surface rounded-2xl p-space-lg shadow-sm border border-border-subtle flex flex-col gap-space-sm">
            <h3 className="font-title-card text-title-card text-text-primary font-bold">
              Pratinjau Kop Struk
            </h3>
            <div className="p-4 rounded-xl bg-white text-black font-mono text-center text-xs border border-dashed border-gray-300">
              <p className="font-bold uppercase text-[12px]">{formData.bumdesName || "BUMDes POS"}</p>
              <p className="text-[10px] text-gray-700 mt-0.5">{formData.address || "-"}</p>
              <p className="text-[10px] text-gray-700">Telp: {formData.phone || "-"}</p>
              <div className="my-2 border-b border-dashed border-gray-300" />
              <p className="text-[10px] italic text-gray-600 leading-tight">
                {formData.receiptFooter || "Terima kasih..."}
              </p>
            </div>
          </div>

          {/* User Management Overview */}
          <div className="bg-surface rounded-2xl p-space-lg shadow-sm border border-border-subtle flex flex-col gap-space-sm">
            <div className="flex items-center gap-space-xs">
              <Icon name="badge" className="w-5 h-5 text-primary" />
              <h3 className="font-title-card text-title-card text-text-primary font-bold">
                Pengguna & Peran
              </h3>
            </div>
            <p className="font-caption-small text-caption-small text-text-secondary">
              Akses sistem terbagi menjadi dua peran:
            </p>
            <div className="flex flex-col gap-2 mt-1">
              <div className="p-2.5 rounded-xl bg-surface-container-low flex items-center justify-between border border-border-subtle/50">
                <div className="flex flex-col">
                  <span className="font-body-medium text-caption-medium font-semibold text-text-primary">
                    ADMIN
                  </span>
                  <span className="font-caption-small text-[11px] text-text-secondary">
                    Akses Dashboard, Produk, Transaksi, Laporan, Pengaturan
                  </span>
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-surface-container-low flex items-center justify-between border border-border-subtle/50">
                <div className="flex flex-col">
                  <span className="font-body-medium text-caption-medium font-semibold text-text-primary">
                    CASHIER
                  </span>
                  <span className="font-caption-small text-[11px] text-text-secondary">
                    Akses Kasir POS & Transaksi
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
