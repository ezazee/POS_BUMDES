"use client";

import { useState } from "react";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { Icon } from "@/components/ui/icon";
import type { TransactionDetail } from "@/lib/services/transactions";

export function TransactionDetailActions({ tx }: { tx: TransactionDetail }) {
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setShowReceiptModal(true)}
        className="px-4 py-2 rounded-xl bg-primary-container hover:bg-primary-hover text-on-primary font-label-button text-caption-medium flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
      >
        <Icon name="print" className="w-4 h-4" />
        <span>Cetak Struk (80mm)</span>
      </button>

      {showReceiptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-text-primary/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-surface rounded-2xl shadow-2xl max-w-sm w-full flex flex-col overflow-hidden border border-border-subtle">
            <div className="px-space-md py-space-sm bg-surface-container-low flex items-center justify-between border-b border-border-subtle">
              <div className="flex items-center gap-1.5">
                <Icon name="receipt" className="w-5 h-5 text-primary" />
                <span className="font-caption-medium text-caption-medium text-text-primary font-bold">
                  Struk Pembayaran
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowReceiptModal(false)}
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
                    <span className="font-bold">{tx.invoiceNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Waktu:</span>
                    <span>{formatDateTime(tx.createdAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Kasir:</span>
                    <span>{tx.cashierName}</span>
                  </div>
                </div>
                <div className="w-full my-2 border-b border-dashed border-gray-400" />

                <div className="w-full text-left space-y-1.5 text-[11px]">
                  {tx.items.map((item) => (
                    <div key={item.id} className="flex flex-col">
                      <span className="font-semibold">{item.productName}</span>
                      <div className="flex justify-between text-gray-700">
                        <span>
                          {item.quantity} x {item.sellingPrice.toLocaleString("id-ID")}
                        </span>
                        <span className="font-bold text-black">
                          {item.subtotal.toLocaleString("id-ID")}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="w-full my-2 border-b border-dashed border-gray-400" />

                <div className="w-full text-left text-[11px] space-y-0.5">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(tx.subtotal)}</span>
                  </div>
                  {tx.discount > 0 && (
                    <div className="flex justify-between">
                      <span>Diskon:</span>
                      <span>-{formatCurrency(tx.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-xs pt-1 border-t border-gray-300">
                    <span>TOTAL:</span>
                    <span>{formatCurrency(tx.total)}</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span>Bayar ({tx.paymentMethod}):</span>
                    <span>{formatCurrency(tx.paidAmount)}</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>Kembalian:</span>
                    <span>{formatCurrency(tx.changeAmount)}</span>
                  </div>
                </div>
                <div className="w-full my-2 border-b border-dashed border-gray-400" />

                <p className="text-[10px] text-gray-600 italic leading-tight text-center mt-1">
                  Terima kasih atas kunjungan Anda.
                  <br />
                  Belanja di BUMDes membangun kemandirian desa.
                </p>
              </div>
            </div>

            <div className="p-space-md bg-surface-container-low flex items-center justify-end gap-space-sm border-t border-border-subtle">
              <button
                type="button"
                onClick={() => setShowReceiptModal(false)}
                className="px-4 h-10 rounded-xl bg-surface hover:bg-surface-container text-text-primary font-label-button text-caption-medium border border-border-subtle transition-colors cursor-pointer"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="px-5 h-10 rounded-xl bg-primary-container text-on-primary font-label-button text-caption-medium flex items-center gap-1.5 shadow-sm hover:bg-primary-hover transition-colors cursor-pointer"
              >
                <Icon name="print" className="w-4 h-4" />
                <span>Cetak (80mm)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
