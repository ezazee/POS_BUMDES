"use client";

import { useState, useMemo } from "react";
import { formatCurrency } from "@/lib/utils";
import { Icon } from "@/components/ui/icon";

export interface CatalogProduct {
  id: string;
  name: string;
  sku: string;
  barcode: string | null;
  category: string;
  purchasePrice: number;
  sellingPrice: number;
  stock: number;
  isActive: boolean;
  createdAt: Date | string;
}

const CATEGORIES = [
  "Sembako",
  "Minuman",
  "Makanan Ringan",
  "Kebersihan",
  "Energi",
  "Pertanian",
];

export function ProductsClient({ initialProducts }: { initialProducts: CatalogProduct[] }) {
  const [products, setProducts] = useState<CatalogProduct[]>(initialProducts);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Drawer / Modal state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<CatalogProduct | null>(null);

  // Custom Category state
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategoryInput, setCustomCategoryInput] = useState("");

  // Dynamic Categories from existing products + defaults
  const allCategories = useMemo(() => {
    const list = ["Sembako", "Minuman", "Makanan Ringan", "Kebersihan", "Energi", "Pertanian"];
    const seen = new Set(list);
    for (const p of products) {
      if (p.category && !seen.has(p.category)) {
        seen.add(p.category);
        list.push(p.category);
      }
    }
    return list;
  }, [products]);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    barcode: "",
    category: "Sembako",
    purchasePrice: 0,
    sellingPrice: 0,
    stock: 0,
    isActive: true,
  });
  const [formError, setFormError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  // Stats calculation
  const stats = useMemo(() => {
    const total = products.length;
    const aman = products.filter((p) => p.stock > 5).length;
    const rendah = products.filter((p) => p.stock > 0 && p.stock <= 5).length;
    const habis = products.filter((p) => p.stock === 0).length;
    return { total, aman, rendah, habis };
  }, [products]);

  // Filtered table rows
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCategory = selectedCategory === "all" || p.category === selectedCategory;
      let matchStatus = true;
      if (selectedStatus === "aman") matchStatus = p.stock > 5;
      else if (selectedStatus === "rendah") matchStatus = p.stock > 0 && p.stock <= 5;
      else if (selectedStatus === "habis") matchStatus = p.stock === 0;

      const q = search.trim().toLowerCase();
      const matchSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        (p.barcode && p.barcode.toLowerCase().includes(q));

      return matchCategory && matchStatus && matchSearch;
    });
  }, [products, selectedCategory, selectedStatus, search]);

  const openAddModal = () => {
    setEditingProduct(null);
    setIsCustomCategory(false);
    setCustomCategoryInput("");
    setFormData({
      name: "",
      sku: "",
      barcode: "",
      category: "Sembako",
      purchasePrice: 0,
      sellingPrice: 0,
      stock: 10,
      isActive: true,
    });
    setFormError("");
    setDrawerOpen(true);
  };

  const openEditModal = (p: CatalogProduct) => {
    setEditingProduct(p);
    setIsCustomCategory(false);
    setCustomCategoryInput("");
    setFormData({
      name: p.name,
      sku: p.sku,
      barcode: p.barcode || "",
      category: p.category,
      purchasePrice: p.purchasePrice,
      sellingPrice: p.sellingPrice,
      stock: p.stock,
      isActive: p.isActive,
    });
    setFormError("");
    setDrawerOpen(true);
  };

  const handleToggleActive = async (p: CatalogProduct) => {
    try {
      const newStatus = !p.isActive;
      const res = await fetch(`/api/products/${p.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: newStatus }),
      });
      if (res.ok) {
        setProducts((prev) =>
          prev.map((item) => (item.id === p.id ? { ...item, isActive: newStatus } : item))
        );
      }
    } catch (err) {
      console.error("Toggle active error:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFormError("");

    const finalCategory = isCustomCategory ? customCategoryInput.trim() : formData.category.trim();

    try {
      const payload = {
        name: formData.name.trim(),
        sku: formData.sku.trim(),
        barcode: formData.barcode.trim() || null,
        category: finalCategory,
        purchasePrice: Number(formData.purchasePrice),
        sellingPrice: Number(formData.sellingPrice),
        stock: Number(formData.stock),
        isActive: formData.isActive,
      };

      if (!payload.name || !payload.sku) {
        setFormError("Nama produk dan SKU wajib diisi.");
        setIsSaving(false);
        return;
      }

      if (!finalCategory) {
        setFormError("Kategori produk wajib diisi.");
        setIsSaving(false);
        return;
      }

      if (payload.sellingPrice < 0 || payload.purchasePrice < 0) {
        setFormError("Harga tidak boleh bernilai negatif.");
        setIsSaving(false);
        return;
      }

      const url = editingProduct ? `/api/products/${editingProduct.id}` : "/api/products";
      const method = editingProduct ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setFormError(data.message || "Gagal menyimpan data produk.");
        setIsSaving(false);
        return;
      }

      if (editingProduct) {
        setProducts((prev) =>
          prev.map((item) => (item.id === editingProduct.id ? data.product : item))
        );
      } else {
        setProducts((prev) => [data.product, ...prev]);
      }

      setDrawerOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Kesalahan koneksi.";
      setFormError(msg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-space-xl">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
        <div>
          <div className="flex items-center gap-space-xs text-text-secondary font-caption-medium text-caption-medium mb-1">
            <span>Manajemen Stok</span>
            <Icon name="chevron_right" className="w-3.5 h-3.5 text-text-muted" />
            <span className="text-primary font-semibold">Katalog & Inventaris</span>
          </div>
          <h1 className="font-headline-page text-headline-page text-text-primary tracking-tight">
            Katalog Produk BUMDes
          </h1>
          <p className="font-body-regular text-body-regular text-text-secondary mt-0.5">
            Kelola katalog, pembaruan stok real-time, margin keuntungan, dan ketersediaan barang unit usaha desa.
          </p>
        </div>

        <div className="flex items-center gap-space-sm flex-wrap">
          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center gap-space-xs px-space-md py-space-sm rounded-xl bg-primary-container text-on-primary font-label-button text-label-button shadow-sm hover:bg-primary-hover transition-all cursor-pointer"
          >
            <Icon name="add_circle" className="w-4 h-4 text-on-primary" />
            <span>Tambah Produk</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-space-sm sm:gap-space-md">
        {/* Card 1: Total Katalog */}
        <div className="bg-surface rounded-2xl p-3 sm:p-space-lg shadow-sm border border-border-subtle flex items-center justify-between">
          <div>
            <span className="font-caption-medium text-caption-medium text-text-secondary uppercase tracking-wider block">
              Total Katalog
            </span>
            <span className="font-display-currency text-[28px] leading-tight font-bold text-text-primary mt-1 block">
              {stats.total}
            </span>
            <span className="font-caption-small text-caption-small text-text-secondary mt-1 inline-flex items-center gap-1">
              <Icon name="category" className="w-3.5 h-3.5 text-primary" />
              Semua produk terdata
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center text-primary">
            <Icon name="inventory_2" className="w-6 h-6 text-primary" />
          </div>
        </div>

        {/* Card 2: Stok Aman */}
        <div className="bg-surface rounded-2xl p-3 sm:p-space-lg shadow-sm border border-border-subtle flex items-center justify-between">
          <div>
            <span className="font-caption-medium text-caption-medium text-text-secondary uppercase tracking-wider block">
              Stok Aman
            </span>
            <span className="font-display-currency text-[28px] leading-tight font-bold text-status-success mt-1 block">
              {stats.aman}
            </span>
            <span className="font-caption-small text-caption-small text-text-secondary mt-1 inline-flex items-center gap-1">
              <span className="inline-block w-2 h-2 rounded-full bg-status-success" /> Di atas ambang minimum (&gt;5)
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-surface-container-low flex items-center justify-center text-status-success">
            <Icon name="check_circle" className="w-6 h-6 text-status-success" />
          </div>
        </div>

        {/* Card 3: Stok Rendah */}
        <div className="bg-surface rounded-2xl p-3 sm:p-space-lg shadow-sm border border-border-subtle flex items-center justify-between">
          <div>
            <span className="font-caption-medium text-caption-medium text-text-secondary uppercase tracking-wider block">
              Stok Rendah
            </span>
            <span className="font-display-currency text-[28px] leading-tight font-bold text-status-warning mt-1 block">
              {stats.rendah}
            </span>
            <span className="font-caption-small text-caption-small text-status-warning font-medium mt-1 inline-flex items-center gap-1">
              <Icon name="warning" className="w-3.5 h-3.5 text-status-warning" /> Perlu order ulang (≤5)
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-status-warning/15 flex items-center justify-center text-status-warning">
            <Icon name="warning" className="w-6 h-6 text-status-warning" />
          </div>
        </div>

        {/* Card 4: Stok Kosong */}
        <div className="bg-surface rounded-2xl p-3 sm:p-space-lg shadow-sm border border-border-subtle flex items-center justify-between">
          <div>
            <span className="font-caption-medium text-caption-medium text-text-secondary uppercase tracking-wider block">
              Stok Kosong
            </span>
            <span className="font-display-currency text-[28px] leading-tight font-bold text-status-danger mt-1 block">
              {stats.habis}
            </span>
            <span className="font-caption-small text-caption-small text-status-danger font-medium mt-1 inline-flex items-center gap-1">
              <Icon name="error" className="w-3.5 h-3.5 text-status-danger" /> Terhenti di kasir
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-status-danger/15 flex items-center justify-center text-status-danger">
            <Icon name="block" className="w-6 h-6 text-status-danger" />
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
            placeholder="Cari produk berdasarkan nama, SKU, atau barcode..."
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
          {/* Category Filter */}
          <div className="relative min-w-[170px]">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full h-10 appearance-none bg-surface-container-low px-space-md pr-8 rounded-xl font-body-medium text-body-medium text-text-primary focus:outline-none focus:bg-surface border border-transparent focus:border-border-subtle cursor-pointer"
            >
              <option value="all">Semua Kategori</option>
              {allCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <Icon name="expand_more" className="w-4 h-4 pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-text-secondary" />
          </div>

          {/* Status Filter */}
          <div className="relative min-w-[170px]">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full h-10 appearance-none bg-surface-container-low px-space-md pr-8 rounded-xl font-body-medium text-body-medium text-text-primary focus:outline-none focus:bg-surface border border-transparent focus:border-border-subtle cursor-pointer"
            >
              <option value="all">Semua Ketersediaan</option>
              <option value="aman">Stok Tersedia (&gt;5)</option>
              <option value="rendah">Stok Rendah (≤5)</option>
              <option value="habis">Stok Habis (0)</option>
            </select>
            <Icon name="expand_more" className="w-4 h-4 pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-text-secondary" />
          </div>
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-surface rounded-2xl shadow-sm border border-border-subtle overflow-hidden">
        {filteredProducts.length === 0 ? (
          <div className="py-16 text-center flex flex-col items-center justify-center text-text-secondary">
            <Icon name="inventory_2" className="w-12 h-12 text-text-muted mb-2" />
            <p className="font-body-medium text-body-medium">Tidak ada produk ditemukan</p>
            <p className="font-caption-small text-caption-small text-text-muted mt-0.5">
              Sesuaikan kata kunci pencarian atau filter yang dipilih.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low text-text-secondary font-caption-medium text-caption-small border-b border-border-subtle">
                  <th className="py-3 px-space-md font-semibold">Produk & SKU</th>
                  <th className="py-3 px-space-md font-semibold">Barcode</th>
                  <th className="py-3 px-space-md font-semibold text-right">Harga Beli</th>
                  <th className="py-3 px-space-md font-semibold text-right">Harga Jual</th>
                  <th className="py-3 px-space-md font-semibold text-right">Margin / Laba</th>
                  <th className="py-3 px-space-md font-semibold text-center">Stok</th>
                  <th className="py-3 px-space-md font-semibold text-center">Status</th>
                  <th className="py-3 px-space-md font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle font-body-regular text-body-regular">
                {filteredProducts.map((p) => {
                  const margin = p.sellingPrice - p.purchasePrice;
                  const isOutOfStock = p.stock === 0;
                  const isLowStock = p.stock > 0 && p.stock <= 5;

                  return (
                    <tr key={p.id} className="hover:bg-surface-container-low/50 transition-colors">
                      <td className="py-3.5 px-space-md">
                        <div className="flex flex-col">
                          <span className="font-title-card text-body-medium text-text-primary font-semibold">
                            {p.name}
                          </span>
                          <span className="font-caption-small text-[11px] text-text-secondary">
                            {p.category} • SKU: <span className="font-mono-tabular">{p.sku}</span>
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-space-md font-mono-tabular text-caption-medium text-text-secondary">
                        {p.barcode ? (
                          <span className="inline-flex items-center gap-1">
                            <Icon name="barcode" className="w-4 h-4 text-text-muted" />
                            {p.barcode}
                          </span>
                        ) : (
                          <span className="text-text-muted">-</span>
                        )}
                      </td>
                      <td className="py-3.5 px-space-md font-mono-tabular text-right text-text-secondary">
                        {formatCurrency(p.purchasePrice)}
                      </td>
                      <td className="py-3.5 px-space-md font-mono-tabular text-right font-semibold text-text-primary">
                        {formatCurrency(p.sellingPrice)}
                      </td>
                      <td className="py-3.5 px-space-md font-mono-tabular text-right text-status-success font-medium">
                        +{formatCurrency(margin)}
                      </td>
                      <td className="py-3.5 px-space-md text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full font-mono-tabular text-caption-small font-bold ${
                            isOutOfStock
                              ? "bg-status-danger/15 text-status-danger"
                              : isLowStock
                              ? "bg-status-warning/20 text-status-warning"
                              : "bg-status-success/15 text-status-success"
                          }`}
                        >
                          {p.stock}
                        </span>
                      </td>
                      <td className="py-3.5 px-space-md text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleActive(p)}
                          className={`inline-block px-2.5 py-0.5 rounded-full text-caption-small font-medium transition-colors cursor-pointer ${
                            p.isActive
                              ? "bg-primary-light text-primary hover:bg-primary-hover hover:text-on-primary"
                              : "bg-surface-container text-text-muted hover:bg-surface-container-high"
                          }`}
                          title="Klik untuk ubah status aktif/nonaktif"
                        >
                          {p.isActive ? "Aktif di POS" : "Nonaktif"}
                        </button>
                      </td>
                      <td className="py-3.5 px-space-md text-right">
                        <button
                          type="button"
                          onClick={() => openEditModal(p)}
                          className="px-3 py-1.5 rounded-lg bg-surface border border-border-subtle text-primary hover:bg-primary-light font-label-button text-caption-medium transition-colors cursor-pointer"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ADD / EDIT DRAWER / MODAL */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-text-primary/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-surface rounded-2xl shadow-xl max-w-lg w-full flex flex-col overflow-hidden border border-border-subtle">
            {/* Modal Header */}
            <div className="px-space-xl py-space-lg bg-surface-container-low flex items-center justify-between border-b border-border-subtle">
              <div className="flex items-center gap-space-xs">
                <Icon name={editingProduct ? "edit_note" : "add_box"} className="w-6 h-6 text-primary-container" />
                <div>
                  <h3 className="font-headline-section text-headline-section text-text-primary font-bold">
                    {editingProduct ? "Edit Data Produk" : "Tambah Produk Baru"}
                  </h3>
                  <p className="font-caption-small text-caption-small text-text-secondary">
                    {editingProduct
                      ? "Perbarui rincian harga, stok, atau kategori produk."
                      : "Isi data produk baru untuk ditambahkan ke katalog BUMDes."}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="w-8 h-8 rounded-lg bg-surface hover:bg-surface-container text-text-secondary flex items-center justify-center"
              >
                <Icon name="close" className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSubmit} className="p-space-xl flex flex-col gap-space-md overflow-y-auto max-h-[520px]">
              {formError && (
                <div className="p-3 rounded-xl bg-status-danger/10 border border-status-danger/30 text-status-danger text-caption-medium flex items-center gap-2">
                  <Icon name="error" className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Nama Produk */}
              <div className="flex flex-col gap-1">
                <label className="font-title-card text-caption-medium text-text-primary font-semibold">
                  Nama Produk <span className="text-status-danger">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Beras Premium Rojolele 5kg"
                  className="w-full h-10 px-3 rounded-xl bg-surface-container-low text-text-primary border border-border-subtle focus:outline-none focus:ring-2 focus:ring-primary-container font-body-regular text-body-regular"
                />
              </div>

              {/* SKU & Barcode 2-Col */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
                <div className="flex flex-col gap-1">
                  <label className="font-title-card text-caption-medium text-text-primary font-semibold">
                    SKU Kode Barang <span className="text-status-danger">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    placeholder="BR-001"
                    className="w-full h-10 px-3 rounded-xl bg-surface-container-low text-text-primary font-mono-tabular border border-border-subtle focus:outline-none focus:ring-2 focus:ring-primary-container text-body-regular"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-title-card text-caption-medium text-text-primary font-semibold">
                    Barcode (Opsional)
                  </label>
                  <input
                    type="text"
                    value={formData.barcode}
                    onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                    placeholder="899100100101"
                    className="w-full h-10 px-3 rounded-xl bg-surface-container-low text-text-primary font-mono-tabular border border-border-subtle focus:outline-none focus:ring-2 focus:ring-primary-container text-body-regular"
                  />
                </div>
              </div>

              {/* Kategori */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <label className="font-title-card text-caption-medium text-text-primary font-semibold">
                    Kategori Produk <span className="text-status-danger">*</span>
                  </label>
                  {isCustomCategory && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsCustomCategory(false);
                        setFormData({ ...formData, category: allCategories[0] || "Sembako" });
                      }}
                      className="text-[11px] text-primary hover:underline cursor-pointer"
                    >
                      Pilih dari daftar
                    </button>
                  )}
                </div>

                {!isCustomCategory ? (
                  <select
                    value={formData.category}
                    onChange={(e) => {
                      if (e.target.value === "__custom__") {
                        setIsCustomCategory(true);
                        setCustomCategoryInput("");
                      } else {
                        setFormData({ ...formData, category: e.target.value });
                      }
                    }}
                    className="w-full h-10 px-3 rounded-xl bg-surface-container-low text-text-primary border border-border-subtle focus:outline-none focus:ring-2 focus:ring-primary-container text-body-regular cursor-pointer"
                  >
                    {allCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                    <option value="__custom__" className="text-primary font-semibold">
                      + Tambah Kategori Baru...
                    </option>
                  </select>
                ) : (
                  <div className="flex flex-col gap-1">
                    <input
                      type="text"
                      required
                      autoFocus
                      value={customCategoryInput}
                      onChange={(e) => setCustomCategoryInput(e.target.value)}
                      placeholder="Ketik nama kategori baru (contoh: ATK, Obat, Bibit, Elektronik)"
                      className="w-full h-10 px-3 rounded-xl bg-surface text-text-primary border-2 border-primary-container focus:outline-none focus:ring-2 focus:ring-primary-container text-body-regular"
                    />
                    <span className="text-[11px] text-text-secondary">
                      Kategori baru akan otomatis tersimpan dan tersedia pada filter & kasir POS.
                    </span>
                  </div>
                )}
              </div>
              {/* Harga Beli & Harga Jual */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
                <div className="flex flex-col gap-1">
                  <label className="font-title-card text-caption-medium text-text-primary font-semibold">
                    Harga Beli (Rp) <span className="text-status-danger">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    required
                    value={formData.purchasePrice || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, purchasePrice: parseInt(e.target.value, 10) || 0 })
                    }
                    placeholder="65000"
                    className="w-full h-10 px-3 rounded-xl bg-surface-container-low text-text-primary font-mono-tabular border border-border-subtle focus:outline-none focus:ring-2 focus:ring-primary-container text-body-regular"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-title-card text-caption-medium text-text-primary font-semibold">
                    Harga Jual Kasir (Rp) <span className="text-status-danger">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    required
                    value={formData.sellingPrice || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, sellingPrice: parseInt(e.target.value, 10) || 0 })
                    }
                    placeholder="75000"
                    className="w-full h-10 px-3 rounded-xl bg-surface-container-low text-text-primary font-mono-tabular border border-border-subtle focus:outline-none focus:ring-2 focus:ring-primary-container text-body-regular"
                  />
                </div>
              </div>

              {/* Stok & Status Aktif */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm items-center">
                <div className="flex flex-col gap-1">
                  <label className="font-title-card text-caption-medium text-text-primary font-semibold">
                    Jumlah Stok <span className="text-status-danger">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({ ...formData, stock: parseInt(e.target.value, 10) || 0 })
                    }
                    className="w-full h-10 px-3 rounded-xl bg-surface-container-low text-text-primary font-mono-tabular border border-border-subtle focus:outline-none focus:ring-2 focus:ring-primary-container text-body-regular"
                  />
                </div>
                <div className="flex items-center gap-2 pt-5">
                  <input
                    type="checkbox"
                    id="isActiveToggle"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 rounded text-primary-container focus:ring-0 cursor-pointer accent-primary-container"
                  />
                  <label htmlFor="isActiveToggle" className="text-body-medium text-text-primary cursor-pointer">
                    Tampilkan di Kasir POS
                  </label>
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-space-sm pt-4 border-t border-border-subtle">
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  className="px- space-md h-10 px-4 rounded-xl bg-surface-container-low hover:bg-surface-container text-text-primary font-label-button text-caption-medium transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="h-10 px-6 rounded-xl bg-primary-container hover:bg-primary-hover text-on-primary font-label-button text-caption-medium shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                >
                  {isSaving ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <Icon name="save" className="w-4 h-4" />
                      <span>Simpan Produk</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
