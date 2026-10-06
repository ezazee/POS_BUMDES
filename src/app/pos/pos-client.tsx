"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { Icon } from "@/components/ui/icon";

export interface PosProduct {
  id: string;
  name: string;
  sku: string;
  barcode: string | null;
  category: string;
  sellingPrice: number;
  stock: number;
  isActive: boolean;
}

export interface CartItem {
  product: PosProduct;
  quantity: number;
}

interface CompletedTransaction {
  id: string;
  invoiceNumber: string;
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod: string;
  paidAmount: number;
  changeAmount: number;
  cashierName: string;
  createdAt: string;
  items: Array<{
    id: string;
    productName: string;
    quantity: number;
    sellingPrice: number;
    subtotal: number;
  }>;
}

// Dynamic categories will be computed from products state

const CATEGORY_ICONS: Record<string, string> = {
  Sembako: "shopping_bag",
  Minuman: "coffee",
  "Makanan Ringan": "cookie",
  Kebersihan: "clean_hands",
  Energi: "bolt",
  Pertanian: "agriculture",
};

export function PosClient({ initialProducts, cashierName }: { initialProducts: PosProduct[]; cashierName: string }) {
  const [products, setProducts] = useState<PosProduct[]>(initialProducts);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua Produk");
  const [discount, setDiscount] = useState<number>(0);
  const [discountInput, setDiscountInput] = useState<string>("0");

  // Dynamically compute unique categories from active products
  const availableCategories = useMemo(() => {
    const list = ["Semua Produk"];
    const seen = new Set<string>();
    for (const p of products) {
      if (p.category && !seen.has(p.category)) {
        seen.add(p.category);
        list.push(p.category);
      }
    }
    return list;
  }, [products]);

  // Payment modal state
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"CASH" | "TRANSFER" | "QRIS">("CASH");
  const [paidAmount, setPaidAmount] = useState<number>(0);
  const [cashInput, setCashInput] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  // Receipt modal state
  const [completedTx, setCompletedTx] = useState<CompletedTransaction | null>(null);
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filtered products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCat =
        selectedCategory === "Semua Produk" || p.category.toLowerCase() === selectedCategory.toLowerCase();
      const q = search.trim().toLowerCase();
      const matchSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        (p.barcode && p.barcode.toLowerCase().includes(q));
      return matchCat && matchSearch;
    });
  }, [products, selectedCategory, search]);

  // Cart calculations
  const cartSubtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.product.sellingPrice * item.quantity, 0);
  }, [cart]);

  const safeDiscount = Math.min(discount, cartSubtotal);
  const grandTotal = Math.max(0, cartSubtotal - safeDiscount);
  const totalItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Cash change calculation
  const changeAmount = paymentMethod === "CASH" ? Math.max(0, paidAmount - grandTotal) : 0;
  const isCashInsufficient = paymentMethod === "CASH" && paidAmount < grandTotal;

  // Add to cart
  const addToCart = (product: PosProduct) => {
    if (product.stock <= 0) return;

    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) return prev;
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  // Update quantity
  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            if (newQty > item.product.stock) return item;
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null);
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
    setDiscount(0);
    setDiscountInput("0");
  };

  // Barcode / Enter search
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const q = search.trim().toLowerCase();
      if (!q) return;

      const exactMatch = products.find(
        (p) =>
          (p.barcode && p.barcode.toLowerCase() === q) ||
          p.sku.toLowerCase() === q ||
          p.name.toLowerCase() === q
      );

      if (exactMatch && exactMatch.stock > 0) {
        addToCart(exactMatch);
        setSearch("");
      }
    }
  };

  // Open Payment Modal
  const openPaymentModal = () => {
    if (cart.length === 0 || grandTotal <= 0) return;
    setPaymentMethod("CASH");
    setPaidAmount(grandTotal);
    setCashInput(new Intl.NumberFormat("id-ID").format(grandTotal));
    setPaymentError("");
    setPaymentModalOpen(true);
  };

  // Quick cash chips
  const handleQuickCash = (amount: number) => {
    setPaidAmount(amount);
    setCashInput(new Intl.NumberFormat("id-ID").format(amount));
  };

  const handleCashInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawDigits = e.target.value.replace(/\D/g, "");
    const val = rawDigits ? parseInt(rawDigits, 10) : 0;
    setPaidAmount(val);
    setCashInput(rawDigits ? new Intl.NumberFormat("id-ID").format(val) : "");
  };

  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawDigits = e.target.value.replace(/\D/g, "");
    const val = rawDigits ? parseInt(rawDigits, 10) : 0;
    setDiscount(val);
    setDiscountInput(rawDigits ? new Intl.NumberFormat("id-ID").format(val) : "0");
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "F2") {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === "F4") {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === "F9") {
        e.preventDefault();
        if (cart.length > 0 && !paymentModalOpen) {
          openPaymentModal();
        }
      } else if (e.key === "Escape") {
        if (paymentModalOpen) setPaymentModalOpen(false);
        if (receiptModalOpen) setReceiptModalOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [cart, paymentModalOpen, receiptModalOpen, grandTotal]);

  // Submit Checkout
  const handleProcessPayment = async () => {
    if (cart.length === 0) return;
    if (paymentMethod === "CASH" && paidAmount < grandTotal) {
      setPaymentError("Nominal uang tunai kurang dari total tagihan.");
      return;
    }

    setIsSubmitting(true);
    setPaymentError("");

    try {
      const payload = {
        items: cart.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
        discount: safeDiscount,
        paymentMethod,
        paidAmount: paymentMethod === "CASH" ? paidAmount : grandTotal,
      };

      const res = await fetch("/api/pos/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setPaymentError(data.message || "Gagal memproses transaksi.");
        setIsSubmitting(false);
        return;
      }

      // Update local product stocks
      const updatedProducts = products.map((prod) => {
        const itemInCart = cart.find((c) => c.product.id === prod.id);
        if (itemInCart) {
          return { ...prod, stock: Math.max(0, prod.stock - itemInCart.quantity) };
        }
        return prod;
      });
      setProducts(updatedProducts);

      // Set completed transaction and open receipt
      setCompletedTx(data.transaction);
      setPaymentModalOpen(false);
      setReceiptModalOpen(true);
      clearCart();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Kesalahan koneksi saat checkout.";
      setPaymentError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const handleNewTransaction = () => {
    setReceiptModalOpen(false);
    setCompletedTx(null);
    clearCart();
    searchInputRef.current?.focus();
  };

  return (
    <div className="flex flex-col gap-space-lg w-full">
      {/* POS Workspace: Left Catalog + Right Sticky Cart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg w-full items-start">
        {/* LEFT COLUMN: Product Catalog (~65% width) */}
        <div className="lg:col-span-8 flex flex-col gap-space-md">
          {/* Search bar & Category chips */}
          <div className="bg-surface rounded-2xl p-space-md shadow-xs border border-border-subtle flex flex-col gap-space-md">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-space-sm">
              <div className="relative flex-1">
                <Icon name="search" className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  placeholder="Cari nama produk, SKU, atau scan barcode... (F2)"
                  className="w-full h-11 pl-11 pr-10 rounded-xl bg-surface-container-low text-text-primary font-body-regular text-body-regular focus:outline-none focus:bg-surface focus:ring-2 focus:ring-primary-container border border-transparent focus:border-transparent transition-all"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary p-1"
                  >
                    <Icon name="close" className="w-4 h-4 text-text-muted hover:text-text-primary" />
                  </button>
                )}
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-space-xs overflow-x-auto pb-1 scrollbar-none">
              {availableCategories.map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-full font-label-button text-caption-medium shrink-0 transition-all cursor-pointer ${
                      isSelected
                        ? "bg-primary-container text-on-primary shadow-xs font-semibold"
                        : "bg-surface-container-low hover:bg-surface-container text-text-secondary"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Product Cards Grid */}
          {filteredProducts.length === 0 ? (
            <div className="bg-surface rounded-2xl p-12 text-center border border-border-subtle flex flex-col items-center justify-center text-text-secondary">
              <Icon name="inventory_2" className="w-12 h-12 text-text-muted mb-2" />
              <p className="font-body-medium text-body-medium">Tidak ada produk ditemukan</p>
              <p className="font-caption-small text-caption-small text-text-muted mt-1">
                Coba sesuaikan kata kunci pencarian atau kategori produk.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-space-sm sm:gap-space-md pb-20 lg:pb-0">
              {filteredProducts.map((product) => {
                const isOutOfStock = product.stock <= 0;
                const isLowStock = product.stock > 0 && product.stock <= 5;
                const iconName = CATEGORY_ICONS[product.category] || "inventory_2";
                return (
                  <div
                    key={product.id}
                    onClick={() => !isOutOfStock && addToCart(product)}
                    className={`group bg-surface rounded-2xl p-space-md shadow-xs border border-border-subtle transition-all flex flex-col justify-between ${
                      isOutOfStock
                        ? "opacity-60 cursor-not-allowed bg-surface-container-low/40"
                        : "cursor-pointer hover:shadow-md hover:-translate-y-0.5 active:scale-[0.99]"
                    }`}
                  >
                    <div className="flex flex-col gap-space-sm">
                      {/* Product Thumbnail / Category badge */}
                      <div className="relative w-full h-24 sm:h-28 rounded-xl bg-surface-container-low overflow-hidden flex items-center justify-center text-secondary border border-border-subtle/50">
                        <Icon name={iconName} className="w-10 h-10 opacity-70" />
                        <span
                          className={`absolute top-2 right-2 px-2 py-0.5 rounded-full font-caption-medium text-caption-small ${
                            isOutOfStock
                              ? "bg-status-danger/15 text-status-danger"
                              : isLowStock
                              ? "bg-status-warning/20 text-status-warning"
                              : "bg-status-success/15 text-status-success"
                          }`}
                        >
                          {isOutOfStock ? "Habis" : `Stok: ${product.stock}`}
                        </span>
                      </div>

                      <div>
                        <p className="font-caption-small text-caption-small text-text-secondary">
                          {product.category} • {product.sku}
                        </p>
                        <h3 className="font-title-card text-title-card text-text-primary line-clamp-2 group-hover:text-primary-container transition-colors mt-0.5">
                          {product.name}
                        </h3>
                      </div>
                    </div>

                    <div className="mt-space-md pt-space-xs flex items-center justify-between border-t border-border-subtle/50">
                      <div className="flex flex-col">
                        <span className="font-caption-small text-caption-small text-text-muted">
                          Harga
                        </span>
                        <span className="font-title-card text-[15px] sm:text-headline-section text-primary-container font-mono-tabular leading-tight font-bold">
                          {formatCurrency(product.sellingPrice)}
                        </span>
                      </div>
                      <button
                        type="button"
                        disabled={isOutOfStock}
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(product);
                        }}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                          isOutOfStock
                            ? "bg-surface-container text-text-muted"
                            : "bg-primary-light text-primary-container group-hover:bg-primary-container group-hover:text-on-primary"
                        }`}
                        aria-label={`Tambah ${product.name}`}
                      >
                        <Icon name="add" className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Quick Action Keyboard Shortcuts Bar */}
          <div className="bg-surface-container-low rounded-xl p-space-md flex flex-wrap items-center justify-between gap-space-md text-text-secondary border border-border-subtle/40">
            <div className="flex items-center gap-space-md flex-wrap font-caption-medium text-caption-medium">
              <span className="flex items-center gap-1">
                <kbd className="px-2 py-0.5 bg-surface border border-border-subtle rounded text-text-primary font-mono-tabular text-caption-small">
                  F2
                </kbd>
                Cari Produk
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-2 py-0.5 bg-surface border border-border-subtle rounded text-text-primary font-mono-tabular text-caption-small">
                  Enter
                </kbd>
                Scan Barcode
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-2 py-0.5 bg-surface border border-border-subtle rounded text-text-primary font-mono-tabular text-caption-small">
                  F9
                </kbd>
                Buka Bayar
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-2 py-0.5 bg-surface border border-border-subtle rounded text-text-primary font-mono-tabular text-caption-small">
                  ESC
                </kbd>
                Tutup Modal
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-status-success font-caption-medium text-caption-medium">
              <Icon name="wifi" className="w-4 h-4 text-status-success" />
              <span>Terhubung POS BUMDes</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Sticky Shopping Cart (~35% width) */}
        <div className="lg:col-span-4 sticky top-20 flex flex-col">
          <div id="cart-section" className="bg-surface rounded-2xl p-4 sm:p-space-xl shadow-sm border border-border-subtle flex flex-col gap-space-md">
            {/* Cart Header */}
            <div className="flex items-center justify-between pb-space-sm border-b border-border-subtle">
              <div className="flex items-center gap-space-xs">
                <Icon name="shopping_cart" className="w-6 h-6 text-primary-container" />
                <h2 className="font-headline-section text-headline-section text-text-primary font-bold">
                  Keranjang
                </h2>
                <span className="bg-primary-light text-primary-container font-caption-medium text-caption-small px-2 py-0.5 rounded-full">
                  {totalItemsCount} item
                </span>
              </div>
              {cart.length > 0 && (
                <button
                  type="button"
                  onClick={clearCart}
                  className="text-status-danger hover:text-error font-caption-medium text-caption-medium hover:underline flex items-center gap-0.5 cursor-pointer"
                >
                  <Icon name="delete_sweep" className="w-4 h-4" />
                  <span>Kosongkan</span>
                </button>
              )}
            </div>

            {/* Customer Pill */}
            <div className="bg-surface-container-low rounded-xl p-space-sm flex items-center justify-between border border-border-subtle/50">
              <div className="flex items-center gap-space-xs">
                <Icon name="person" className="w-4 h-4 text-text-muted" />
                <div className="flex flex-col">
                  <span className="font-caption-small text-caption-small text-text-muted leading-none">
                    Pelanggan
                  </span>
                  <span className="font-body-medium text-body-medium text-text-primary">
                    Umum / Warga Desa
                  </span>
                </div>
              </div>
              <span className="text-caption-small font-caption-medium px-2 py-0.5 bg-surface text-text-secondary rounded">
                Kasir: {cashierName}
              </span>
            </div>

            {/* Cart Items List */}
            {cart.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center text-center text-text-secondary">
                <Icon name="shopping_basket" className="w-11 h-11 text-text-muted mb-2" />
                <p className="font-body-medium text-body-medium text-text-primary">
                  Keranjang masih kosong
                </p>
                <p className="font-caption-small text-caption-small text-text-muted mt-0.5">
                  Pilih produk dari katalog di samping atau scan barcode.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-space-sm max-h-[320px] overflow-y-auto pr-1 divide-y divide-surface-container">
                {cart.map((item) => (
                  <div key={item.product.id} className="pt-space-sm first:pt-0 flex flex-col gap-space-xs">
                    <div className="flex items-start justify-between gap-space-xs">
                      <div className="flex flex-col min-w-0 pr-1">
                        <span className="font-title-card text-title-card text-text-primary truncate font-semibold">
                          {item.product.name}
                        </span>
                        <span className="font-caption-small text-caption-small text-text-secondary font-mono-tabular">
                          {formatCurrency(item.product.sellingPrice)} / item
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-text-muted hover:text-status-danger p-1 rounded transition-colors"
                        title="Hapus item"
                      >
                        <Icon name="delete" className="w-4 h-4 text-text-muted hover:text-status-danger" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-1">
                      {/* Quantity Stepper */}
                      <div className="flex items-center bg-surface-container-low rounded-lg p-0.5 border border-border-subtle/50">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, -1)}
                          className="w-7 h-7 rounded bg-surface text-text-secondary hover:text-text-primary flex items-center justify-center transition-colors"
                        >
                          <Icon name="remove" className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-mono-tabular text-body-medium text-text-primary font-bold">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, 1)}
                          disabled={item.quantity >= item.product.stock}
                          className="w-7 h-7 rounded bg-primary-light text-primary-container hover:bg-primary-container hover:text-on-primary flex items-center justify-center transition-colors disabled:opacity-40"
                        >
                          <Icon name="add" className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Line Total */}
                      <span className="font-title-card text-title-card text-text-primary font-mono-tabular font-bold">
                        {formatCurrency(item.product.sellingPrice * item.quantity)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Breakdown & Grand Total */}
            <div className="bg-surface-container-low rounded-xl p-space-md flex flex-col gap-space-xs mt-space-xs border border-border-subtle/50">
              <div className="flex items-center justify-between font-body-regular text-body-regular text-text-secondary">
                <span>Subtotal</span>
                <span className="font-mono-tabular text-text-primary font-semibold">
                  {formatCurrency(cartSubtotal)}
                </span>
              </div>

              {/* Discount Input Row */}
              <div className="flex items-center justify-between font-body-regular text-body-regular text-text-secondary py-1">
                <span>Diskon (Rp)</span>
                <div className="relative w-32">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-caption-small text-text-muted">
                    Rp
                  </span>
                  <input
                    type="text"
                    value={discountInput}
                    onChange={handleDiscountChange}
                    className="w-full h-8 pl-7 pr-2 text-right bg-surface border border-border-subtle rounded-md text-caption-medium font-mono-tabular text-status-success font-semibold focus:outline-none focus:ring-1 focus:ring-primary-container"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between font-body-regular text-body-regular text-text-secondary">
                <span>Pajak (PPN Bebas BUMDes)</span>
                <span className="font-mono-tabular text-text-primary">Rp0</span>
              </div>

              <div className="my-space-xs h-[1px] bg-border-subtle" />

              <div className="flex items-baseline justify-between">
                <span className="font-title-card text-headline-section text-text-primary font-bold">
                  TOTAL
                </span>
                <span className="font-display-currency text-headline-page font-bold text-text-primary font-mono-tabular tracking-tight">
                  {formatCurrency(grandTotal)}
                </span>
              </div>
            </div>

            {/* Big Checkout Action Button */}
            <button
              type="button"
              disabled={cart.length === 0}
              onClick={openPaymentModal}
              className="w-full bg-primary-container hover:bg-primary-hover active:bg-primary text-on-primary font-label-button text-headline-section py-4 px-space-md rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-space-sm disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <Icon name="payments" className="w-6 h-6" />
              <span>BAYAR (F9) • {formatCurrency(grandTotal)}</span>
              <Icon name="arrow_forward" className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {paymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-text-primary/60 backdrop-blur-xs p-3 sm:p-4 animate-in fade-in duration-150">
          <div className="bg-surface rounded-2xl shadow-xl max-w-lg w-full flex flex-col overflow-hidden border border-border-subtle max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="px-space-xl py-space-lg bg-surface-container-low flex items-center justify-between border-b border-border-subtle">
              <div className="flex items-center gap-space-xs">
                <Icon name="account_balance_wallet" className="w-6 h-6 text-primary-container" />
                <div>
                  <h3 className="font-headline-section text-headline-section text-text-primary font-bold leading-tight">
                    Konfirmasi Pembayaran
                  </h3>
                  <p className="font-caption-small text-caption-small text-text-secondary">
                    Pilih metode tender & masukkan nominal bayar
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPaymentModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-surface hover:bg-surface-container text-text-secondary hover:text-text-primary flex items-center justify-center"
              >
                <Icon name="close" className="w-5 h-5 text-text-secondary hover:text-text-primary" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-space-xl flex flex-col gap-space-lg">
              {paymentError && (
                <div className="p-3 rounded-xl bg-status-danger/10 border border-status-danger/30 text-status-danger text-caption-medium flex items-center gap-2">
                  <Icon name="error" className="w-4 h-4 shrink-0" />
                  <span>{paymentError}</span>
                </div>
              )}

              {/* Tagihan Akhir Banner */}
              <div className="bg-surface-container-low p-space-md rounded-xl flex items-center justify-between border border-border-subtle/50">
                <span className="font-title-card text-title-card text-text-secondary font-medium">
                  Tagihan Akhir
                </span>
                <span className="font-display-currency text-headline-page font-bold text-primary-container font-mono-tabular">
                  {formatCurrency(grandTotal)}
                </span>
              </div>

              {/* Payment Method Tabs */}
              <div className="flex flex-col gap-space-xs">
                <label className="font-title-card text-title-card text-text-primary font-semibold">
                  Metode Pembayaran
                </label>
                <div className="grid grid-cols-3 gap-space-sm">
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod("CASH");
                      setPaidAmount(grandTotal);
                      setCashInput(new Intl.NumberFormat("id-ID").format(grandTotal));
                    }}
                    className={`flex flex-col items-center justify-center p-space-md rounded-xl font-label-button text-caption-medium gap-1 transition-all ${
                      paymentMethod === "CASH"
                        ? "bg-primary-container text-on-primary shadow-sm"
                        : "bg-surface-container-low text-text-secondary hover:bg-surface-container"
                    }`}
                  >
                    <Icon name="payments" className="w-5 h-5" />
                    <span>Tunai / Cash</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod("QRIS");
                      setPaidAmount(grandTotal);
                    }}
                    className={`flex flex-col items-center justify-center p-space-md rounded-xl font-label-button text-caption-medium gap-1 transition-all ${
                      paymentMethod === "QRIS"
                        ? "bg-primary-container text-on-primary shadow-sm"
                        : "bg-surface-container-low text-text-secondary hover:bg-surface-container"
                    }`}
                  >
                    <Icon name="qr_code_2" className="w-5 h-5" />
                    <span>QRIS Desa</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod("TRANSFER");
                      setPaidAmount(grandTotal);
                    }}
                    className={`flex flex-col items-center justify-center p-space-md rounded-xl font-label-button text-caption-medium gap-1 transition-all ${
                      paymentMethod === "TRANSFER"
                        ? "bg-primary-container text-on-primary shadow-sm"
                        : "bg-surface-container-low text-text-secondary hover:bg-surface-container"
                    }`}
                  >
                    <Icon name="account_balance" className="w-5 h-5" />
                    <span>Transfer Bank</span>
                  </button>
                </div>
              </div>

              {/* Cash Input & Chips (Only for Cash) */}
              {paymentMethod === "CASH" ? (
                <div className="flex flex-col gap-space-sm">
                  <div className="flex items-center justify-between">
                    <label className="font-title-card text-title-card text-text-primary font-semibold">
                      Nominal Uang Diterima
                    </label>
                    <span className="font-caption-small text-caption-small text-text-secondary">
                      Ketik atau klik cepat
                    </span>
                  </div>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-title-card text-title-card text-text-secondary font-bold">
                      Rp
                    </span>
                    <input
                      type="text"
                      value={cashInput}
                      onChange={handleCashInputChange}
                      placeholder="0"
                      className="w-full h-14 pl-12 pr-4 text-2xl font-mono-tabular font-bold rounded-xl bg-surface-container-low text-text-primary border border-border-subtle focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-transparent"
                    />
                  </div>

                  {/* Quick Cash Chips */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleQuickCash(grandTotal)}
                      className="px-3 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-text-primary font-mono-tabular text-caption-medium font-semibold border border-border-subtle/50"
                    >
                      Uang Pas ({new Intl.NumberFormat("id-ID").format(grandTotal)})
                    </button>
                    {[50000, 100000, 200000, 500000].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => handleQuickCash(preset)}
                        className={`px-3 py-1.5 rounded-lg font-mono-tabular text-caption-medium font-semibold border border-border-subtle/50 ${
                          paidAmount === preset
                            ? "bg-primary-light text-primary border-primary"
                            : "bg-surface-container-low hover:bg-surface-container text-text-primary"
                        }`}
                      >
                        {new Intl.NumberFormat("id-ID").format(preset)}
                      </button>
                    ))}
                  </div>

                  {/* Kembalian Box */}
                  <div
                    className={`p-space-md rounded-xl flex items-center justify-between border ${
                      isCashInsufficient
                        ? "bg-status-danger/10 border-status-danger/30"
                        : "bg-status-success/10 border-status-success/30"
                    }`}
                  >
                    <div className="flex flex-col">
                      <span
                        className={`font-caption-medium text-caption-medium font-semibold ${
                          isCashInsufficient ? "text-status-danger" : "text-status-success"
                        }`}
                      >
                        {isCashInsufficient ? "Uang Kurang" : "Uang Kembalian"}
                      </span>
                      <span className="font-caption-small text-caption-small text-text-secondary">
                        {isCashInsufficient
                          ? "Masukkan nominal minimal sama dengan total"
                          : "Harus diserahkan ke pelanggan"}
                      </span>
                    </div>
                    <span
                      className={`font-display-currency text-headline-page font-mono-tabular font-bold ${
                        isCashInsufficient ? "text-status-danger" : "text-status-success"
                      }`}
                    >
                      {formatCurrency(changeAmount)}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-space-md rounded-xl bg-surface-container-low border border-border-subtle flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-primary font-body-medium">
                    <Icon name={paymentMethod === "QRIS" ? "qr_code_2" : "receipt"} className="w-5 h-5" />
                    <span className="font-semibold">
                      {paymentMethod === "QRIS" ? "Pembayaran QRIS Desa" : "Transfer Bank Rekening Desa"}
                    </span>
                  </div>
                  <p className="font-caption-small text-caption-small text-text-secondary">
                    {paymentMethod === "QRIS"
                      ? "Minta pelanggan memindai QRIS BUMDes di meja kasir. Setelah notifikasi masuk, klik tombol proses pembayaran."
                      : "Verifikasi mutasi rekening kas BUMDes. Nominal otomatis tercatat lunas tanpa kembalian."}
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-space-xl pt-0 flex items-center justify-end gap-space-sm border-t border-border-subtle/50 mt-2">
              <button
                type="button"
                onClick={() => setPaymentModalOpen(false)}
                className="px-space-xl h-12 rounded-xl bg-surface-container-low hover:bg-surface-container text-text-primary font-label-button text-label-button transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isSubmitting || (paymentMethod === "CASH" && isCashInsufficient)}
                onClick={handleProcessPayment}
                className="px-space-xl h-12 rounded-xl bg-primary-container hover:bg-primary-hover text-on-primary font-label-button text-label-button shadow-md flex items-center gap-space-xs transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Memproses...</span>
                  </>
                ) : (
                  <>
                    <Icon name="check_circle" className="w-5 h-5" />
                    <span>Proses & Simpan Transaksi</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 80mm THERMAL RECEIPT MODAL */}
      {receiptModalOpen && completedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-text-primary/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-surface rounded-2xl shadow-2xl max-w-sm w-full flex flex-col overflow-hidden border border-border-subtle">
            {/* Modal Header & Action Controls */}
            <div className="px-space-md py-space-sm bg-surface-container-low flex items-center justify-between border-b border-border-subtle">
              <div className="flex items-center gap-1.5">
                <Icon name="verified" className="w-5 h-5 text-status-success" />
                <span className="font-caption-medium text-caption-medium text-text-primary font-bold">
                  Transaksi Berhasil
                </span>
              </div>
              <button
                type="button"
                onClick={() => setReceiptModalOpen(false)}
                className="w-7 h-7 rounded bg-surface hover:bg-surface-container text-text-secondary flex items-center justify-center"
              >
                <Icon name="close" className="w-4 h-4 text-text-secondary" />
              </button>
            </div>

            {/* Printable Thermal Receipt Paper Container */}
            <div className="p-4 bg-white text-black font-mono text-xs overflow-y-auto max-h-[480px]">
              <div id="printable-receipt" className="w-full flex flex-col items-center text-center">
                {/* Kop Struk */}
                <h2 className="text-sm font-bold uppercase tracking-wider">
                  BUMDES MANDIRI SEJAHTERA
                </h2>
                <p className="text-[11px] leading-tight text-gray-700 mt-0.5">
                  Jl. Raya Desa Karangsari No. 12, Jawa Tengah
                </p>
                <p className="text-[11px] text-gray-700">Telp: 0812-3456-7890</p>
                <div className="w-full my-2 border-b border-dashed border-gray-400" />

                {/* Metadata */}
                <div className="w-full text-left text-[11px] space-y-0.5">
                  <div className="flex justify-between">
                    <span>No. Nota:</span>
                    <span className="font-bold">{completedTx.invoiceNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Waktu:</span>
                    <span>{formatDateTime(completedTx.createdAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Kasir:</span>
                    <span>{completedTx.cashierName}</span>
                  </div>
                </div>
                <div className="w-full my-2 border-b border-dashed border-gray-400" />

                {/* Line Items */}
                <div className="w-full text-left space-y-1.5 text-[11px]">
                  {completedTx.items.map((item, idx) => (
                    <div key={idx} className="flex flex-col">
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

                {/* Totals */}
                <div className="w-full text-left text-[11px] space-y-0.5">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>Rp{completedTx.subtotal.toLocaleString("id-ID")}</span>
                  </div>
                  {completedTx.discount > 0 && (
                    <div className="flex justify-between">
                      <span>Diskon:</span>
                      <span>-Rp{completedTx.discount.toLocaleString("id-ID")}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-xs pt-1 border-t border-gray-300">
                    <span>TOTAL:</span>
                    <span>Rp{completedTx.total.toLocaleString("id-ID")}</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span>Bayar ({completedTx.paymentMethod}):</span>
                    <span>Rp{completedTx.paidAmount.toLocaleString("id-ID")}</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>Kembalian:</span>
                    <span>Rp{completedTx.changeAmount.toLocaleString("id-ID")}</span>
                  </div>
                </div>
                <div className="w-full my-2 border-b border-dashed border-gray-400" />

                {/* Footer Message */}
                <p className="text-[10px] text-gray-600 italic leading-tight text-center mt-1">
                  Terima kasih atas kunjungan Anda.
                  <br />
                  Belanja di BUMDes membangun kemandirian desa.
                </p>
              </div>
            </div>

            {/* Modal Buttons */}
            <div className="p-space-md bg-surface-container-low flex flex-col sm:flex-row items-center gap-space-sm border-t border-border-subtle">
              <button
                type="button"
                onClick={handlePrintReceipt}
                className="w-full sm:flex-1 h-11 rounded-xl bg-primary-container text-on-primary font-label-button text-caption-medium flex items-center justify-center gap-1.5 shadow-sm hover:bg-primary-hover transition-colors cursor-pointer"
              >
                <Icon name="print" className="w-4 h-4" />
                <span>Cetak Struk (80mm)</span>
              </button>
              <button
                type="button"
                onClick={handleNewTransaction}
                className="w-full sm:flex-1 h-11 rounded-xl bg-surface hover:bg-surface-container text-text-primary font-label-button text-caption-medium border border-border-subtle flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Icon name="add_circle" className="w-4 h-4" />
                <span>Transaksi Baru</span>
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Mobile Floating Cart Summary Bar */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-3 bg-surface/95 backdrop-blur-md border-t border-border-subtle shadow-2xl z-40 lg:hidden flex items-center justify-between gap-2">
          <div className="flex flex-col min-w-0">
            <span className="text-[11px] text-text-secondary truncate">{totalItemsCount} item di keranjang</span>
            <span className="font-bold text-headline-section text-primary-container font-mono-tabular leading-tight">
              {formatCurrency(grandTotal)}
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById("cart-section");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-3 py-2 rounded-xl bg-surface-container-low text-text-primary text-caption-small font-semibold border border-border-subtle"
            >
              Keranjang
            </button>
            <button
              type="button"
              onClick={openPaymentModal}
              className="px-4 py-2 rounded-xl bg-primary-container text-on-primary text-caption-medium font-bold shadow-sm flex items-center gap-1 cursor-pointer"
            >
              <span>Bayar</span>
              <Icon name="arrow_forward" className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
