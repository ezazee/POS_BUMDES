# DESIGN.md

## 1. Project Overview

**Nama Project:** POS BUMDes  
**Tujuan:** Membuat sistem POS sederhana untuk kebutuhan operasional BUMDes.

Sistem difokuskan hanya pada 4 modul utama:

1. Kasir / POS
2. Produk
3. Transaksi
4. Laporan

Target utama adalah aplikasi yang:

- sederhana
- cepat digunakan
- mudah dipahami kasir
- mudah dikembangkan
- tidak terlalu banyak fitur
- cocok untuk desktop maupun tablet

---

# 2. Design Principles

Desain aplikasi mengikuti prinsip:

### Simple
Hindari terlalu banyak menu, tabel, tombol, dan informasi.

### Fast
Aktivitas kasir harus dapat dilakukan dalam sedikit klik.

### Clear
Harga, total, stok, dan status transaksi harus mudah terlihat.

### Consistent
Semua halaman menggunakan komponen, warna, spacing, dan typography yang konsisten.

### Responsive
Prioritas desktop dan tablet, tetapi tetap dapat digunakan melalui mobile.

---

# 3. Visual Style

## Style

Modern dashboard / POS interface.

Karakter desain:

- clean
- minimal
- modern
- profesional
- tidak terlalu corporate
- mudah digunakan pengguna non-teknis

---

# 4. Color Palette

Gunakan warna netral sebagai dasar.

### Primary

```text
Primary: #2563EB
Primary Hover: #1D4ED8
Primary Light: #EFF6FF
```

### Neutral

```text
Background: #F8FAFC
Card: #FFFFFF
Border: #E2E8F0

Text Primary: #0F172A
Text Secondary: #64748B
Text Muted: #94A3B8
```

### Status

```text
Success: #16A34A
Warning: #F59E0B
Danger: #DC2626
```

Warna primary nantinya dapat diganti mengikuti identitas BUMDes.

---

# 5. Typography

Gunakan:

**Plus Jakarta Sans**

Fallback:

```css
font-family:
  "Plus Jakarta Sans",
  sans-serif;
```

Ukuran dasar:

```text
Page Title      24px / Semibold
Section Title   18px / Semibold
Card Title      14px / Medium
Body            14px / Regular
Small           12px / Regular
Button          14px / Medium
```

---

# 6. Layout

Layout utama:

```text
┌─────────────────────────────────────────────────────────┐
│ Sidebar │ Header                                        │
│         ├───────────────────────────────────────────────┤
│         │                                               │
│         │                Main Content                   │
│         │                                               │
│         │                                               │
│         │                                               │
└─────────────────────────────────────────────────────────┘
```

Desktop:

```text
Sidebar Width : 240px
Header Height : 64px
Content Padding : 24px
```

Tablet:

Sidebar dapat di-collapse.

Mobile:

Sidebar berubah menjadi drawer.

---

# 7. Navigation

Sidebar hanya berisi:

```text
Dashboard

Kasir
Produk
Transaksi
Laporan

──────────

Pengaturan
Logout
```

Tidak perlu submenu kompleks.

---

# 8. Dashboard

Dashboard dibuat sederhana.

## Layout

```text
Dashboard

┌─────────────────┐
│ Omzet Hari Ini  │
│ Rp 5.250.000    │
└─────────────────┘

┌─────────────────┐
│ Transaksi       │
│ 48              │
└─────────────────┘

┌─────────────────┐
│ Produk          │
│ 124             │
└─────────────────┘

┌─────────────────┐
│ Stok Menipis    │
│ 7 Produk        │
└─────────────────┘
```

Di bawah summary:

### Penjualan Terbaru

```text
Invoice        Waktu       Total

INV-00125      10:32       Rp125.000
INV-00124      10:15       Rp85.000
INV-00123      09:58       Rp220.000
```

Tidak perlu chart kompleks pada MVP.

---

# 9. POS / Kasir

Ini adalah halaman paling penting.

Layout desktop:

```text
┌──────────────────────────────────────────────────────────┐
│ Kasir                                                    │
│                                                          │
│ ┌───────────────────────────────┐ ┌─────────────────────┐ │
│ │ Cari produk / barcode        │ │ Keranjang           │ │
│ ├───────────────────────────────┤ │                     │ │
│ │                               │ │ Beras      x2       │ │
│ │ Product     Product           │ │ Rp150.000           │ │
│ │                               │ │                     │ │
│ │ Product     Product           │ │ Minyak     x1       │ │
│ │                               │ │ Rp36.000            │ │
│ │ Product     Product           │ │                     │ │
│ │                               │ │ ------------------  │ │
│ │                               │ │ Total Rp186.000     │ │
│ │                               │ │                     │ │
│ │                               │ │ [ BAYAR ]           │ │
│ └───────────────────────────────┘ └─────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

---

# 10. Product Card

Product card dibuat sederhana:

```text
┌───────────────────┐
│                   │
│    Product Img    │
│                   │
├───────────────────┤
│ Beras Premium     │
│ Rp75.000          │
│ Stok: 20          │
└───────────────────┘
```

Jika tidak ada gambar, tampilkan placeholder.

Informasi:

- nama
- harga
- stok

Klik card langsung memasukkan produk ke keranjang.

---

# 11. Search Produk

Search bar selalu berada di atas daftar produk.

Placeholder:

```text
Cari nama produk atau scan barcode...
```

Search berdasarkan:

- nama
- SKU
- barcode

---

# 12. Cart / Keranjang

Item keranjang:

```text
Beras Premium

[-] 2 [+]

Rp150.000

[hapus]
```

Cart menampilkan:

```text
Subtotal
Diskon
Total
```

CTA utama:

```text
BAYAR
```

Button pembayaran harus paling dominan secara visual.

---

# 13. Payment Modal

Saat klik **Bayar**:

```text
┌───────────────────────────────┐
│ Pembayaran                    │
│                               │
│ Total                         │
│ Rp186.000                     │
│                               │
│ Metode Pembayaran             │
│                               │
│ [ Cash ]                      │
│ [ Transfer ]                  │
│ [ QRIS ]                      │
│                               │
│ Uang Diterima                 │
│ [ Rp200.000              ]    │
│                               │
│ Kembalian                     │
│ Rp14.000                      │
│                               │
│ [ Konfirmasi Pembayaran ]     │
└───────────────────────────────┘
```

Cash menampilkan input uang diterima.

Transfer / QRIS tidak perlu input uang diterima.

---

# 14. Payment Success

Setelah transaksi berhasil:

```text
✓ Transaksi Berhasil

INV-2026-000125

Total
Rp186.000

Cash
Rp200.000

Kembalian
Rp14.000

[ Cetak Struk ]

[ Transaksi Baru ]
```

---

# 15. Produk

Halaman Produk:

```text
Produk

[ Cari Produk ]                  [+ Tambah Produk]

----------------------------------------------------

Produk        SKU        Harga       Stok      Aksi

Beras         BR001      75.000      20        Edit
Minyak        MN001      36.000      15        Edit
Telur         TL001      30.000      50        Edit
```

Fitur:

- search
- tambah
- edit
- hapus / nonaktifkan

---

# 16. Tambah Produk

Gunakan modal atau drawer.

Field:

```text
Nama Produk *
SKU
Barcode
Kategori
Harga Beli *
Harga Jual *
Stok Awal
```

CTA:

```text
Batal

Simpan Produk
```

Tidak perlu form terlalu panjang.

---

# 17. Stock Indicator

Gunakan badge:

```text
Stok 20

Stok Rendah

Habis
```

Rule:

```text
stok > 5
Normal

stok 1–5
Stok Rendah

stok = 0
Habis
```

Angka threshold nantinya dapat dikembangkan.

---

# 18. Transaksi

Halaman transaksi:

```text
Transaksi

[ Search Invoice ]      [ Tanggal ]

--------------------------------------------------------

Invoice      Waktu      Item      Payment      Total

INV-0125     10:32      3         Cash         186.000
INV-0124     10:15      2         QRIS         125.000
INV-0123     09:58      5         Transfer     250.000
```

Klik transaksi membuka detail.

---

# 19. Detail Transaksi

```text
INV-2026-000125

06 Oktober 2026
10:32

--------------------------------

Beras Premium
2 × Rp75.000
Rp150.000

Minyak
1 × Rp36.000
Rp36.000

--------------------------------

Subtotal
Rp186.000

Total
Rp186.000

Payment
Cash

Bayar
Rp200.000

Kembalian
Rp14.000

[ Cetak Struk ]
```

---

# 20. Laporan

Laporan tetap sederhana.

Filter:

```text
Hari Ini

7 Hari

Bulan Ini

Custom
```

Summary:

```text
Omzet

Jumlah Transaksi

Produk Terjual

Laba Kotor
```

---

# 21. Laporan Penjualan

Table:

```text
Tanggal         Transaksi       Omzet

06 Okt 2026     48              Rp5.250.000
05 Okt 2026     51              Rp5.870.000
04 Okt 2026     39              Rp4.250.000
```

---

# 22. Laba Kotor

Perhitungan sederhana:

```text
Profit =
Harga Jual - Harga Beli
```

Contoh:

```text
Harga beli:
Rp60.000

Harga jual:
Rp75.000

Profit:
Rp15.000
```

Jika quantity 2:

```text
Rp30.000
```

Tidak masuk ke sistem accounting.

---

# 23. Header

Header:

```text
Nama Halaman

                         User Avatar
                         Admin
```

Optional:

```text
Tanggal
Jam
```

Tidak perlu notification center pada MVP.

---

# 24. Sidebar

Contoh:

```text
┌─────────────────────┐
│                     │
│     BUMDes POS      │
│                     │
├─────────────────────┤
│                     │
│ Dashboard           │
│                     │
│ Kasir               │
│                     │
│ Produk              │
│                     │
│ Transaksi           │
│                     │
│ Laporan             │
│                     │
│                     │
│ Pengaturan          │
│                     │
├─────────────────────┤
│ Admin               │
│ Logout              │
└─────────────────────┘
```

---

# 25. Components

Komponen utama:

```text
AppSidebar

AppHeader

PageHeader

StatCard

DataTable

SearchInput

ProductCard

Cart

CartItem

PaymentModal

ProductForm

Badge

EmptyState

ConfirmDialog

Receipt
```

---

# 26. Button Style

## Primary

Digunakan untuk CTA utama.

Contoh:

```text
Bayar

Tambah Produk

Simpan
```

## Secondary

Contoh:

```text
Cetak Struk

Edit
```

## Danger

Contoh:

```text
Hapus
```

---

# 27. Input Style

Semua input menggunakan:

```text
Height: 40px

Border Radius: 8px

Border: 1px solid #E2E8F0

Padding: 12px
```

Focus menggunakan primary color.

---

# 28. Border Radius

Gunakan radius konsisten:

```text
Input      8px

Button     8px

Card       12px

Modal      16px
```

---

# 29. Spacing

Gunakan sistem:

```text
4px

8px

12px

16px

24px

32px
```

Default card padding:

```text
20–24px
```

---

# 30. Empty State

Contoh Produk:

```text
Belum ada produk.

Tambahkan produk pertama untuk mulai menggunakan POS.

[ Tambah Produk ]
```

Contoh transaksi:

```text
Belum ada transaksi.
```

---

# 31. Loading State

Gunakan skeleton.

Contoh:

```text
████████████

████████
████████████

████████
████████████
```

Hindari loading spinner besar untuk seluruh halaman.

---

# 32. Error State

Error harus sederhana:

```text
Gagal memuat data.

[ Coba Lagi ]
```

Error form:

```text
Nama produk wajib diisi.
```

---

# 33. Responsive Design

## Desktop

```text
Sidebar + Content
```

POS:

```text
65% Produk

35% Cart
```

## Tablet

```text
60% Produk

40% Cart
```

## Mobile

POS menjadi:

```text
Produk

↓

Floating Cart Button
```

Cart muncul sebagai drawer.

---

# 34. Receipt Design

Format awal:

**80mm Thermal**

```text
        BUMDes Desa XXX

        Jl. XXXXXXXX

--------------------------------

INV-2026-000125

06/10/2026 10:32

--------------------------------

Beras Premium

2 x 75.000
150.000

Minyak

1 x 36.000
36.000

--------------------------------

TOTAL
186.000

CASH
200.000

KEMBALIAN
14.000

--------------------------------

Terima kasih
```

Versi 58mm dapat ditambahkan kemudian.

---

# 35. User Roles

MVP cukup:

## Admin

Bisa:

```text
Dashboard

Kasir

Produk

Transaksi

Laporan

Pengaturan
```

## Kasir

Bisa:

```text
Kasir

Transaksi
```

Permission tidak perlu dibuat terlalu kompleks.

---

# 36. Page Routes

```text
/login

/dashboard

/pos

/products

/transactions

/transactions/[id]

/reports

/settings
```

---

# 37. Technology Design

Frontend & Backend:

```text
Next.js 16

TypeScript

Tailwind CSS

shadcn/ui
```

Database:

```text
PostgreSQL

Prisma ORM
```

Authentication:

```text
Better Auth
```

Deployment:

```text
Vercel / VPS
```

Database dapat menggunakan:

```text
Neon PostgreSQL
```

atau PostgreSQL sendiri.

---

# 38. Data Model Overview

MVP membutuhkan model utama:

```text
User

Product

Transaction

TransactionItem
```

Optional:

```text
StockMovement
```

---

# 39. Product

```text
Product

id
name
sku
barcode
category
purchasePrice
sellingPrice
stock
isActive
createdAt
updatedAt
```

---

# 40. Transaction

```text
Transaction

id
invoiceNumber
subtotal
discount
total
paymentMethod
paidAmount
changeAmount
cashierId
createdAt
```

---

# 41. Transaction Item

```text
TransactionItem

id
transactionId
productId
productName
quantity
purchasePrice
sellingPrice
subtotal
```

Harga produk disimpan juga di TransactionItem supaya transaksi lama tidak berubah ketika harga produk berubah.

---

# 42. POS Transaction Flow

```text
Kasir membuka POS

↓

Cari / pilih produk

↓

Tambah produk ke cart

↓

Atur quantity

↓

Klik Bayar

↓

Pilih metode pembayaran

↓

Konfirmasi

↓

Transaction dibuat

↓

TransactionItem dibuat

↓

Stok produk berkurang

↓

Receipt muncul

↓

Transaksi selesai
```

---

# 43. Product Flow

```text
Admin

↓

Produk

↓

Tambah Produk

↓

Input data

↓

Simpan

↓

Produk langsung tersedia di POS
```

---

# 44. Reporting Flow

Laporan membaca data dari:

```text
Transaction

+

TransactionItem
```

Tidak perlu tabel laporan khusus.

---

# 45. Out of Scope

Untuk menjaga aplikasi tetap sederhana, fitur berikut belum dibuat:

```text
Supplier Management

Purchase Order

Customer Management

Piutang

Hutang

Accounting

Multi Warehouse

Multi Outlet

Stock Transfer

Advanced Inventory

Batch

Expired Date

Loyalty Point

Promo Engine

Approval System

MBG Module

Online Store

Marketplace Integration
```

Fitur tersebut dapat dikembangkan kemudian jika benar-benar dibutuhkan.

---

# 46. MVP Definition

Aplikasi dianggap MVP selesai jika:

1. Admin dapat membuat produk.
2. Produk dapat muncul di POS.
3. Kasir dapat melakukan transaksi.
4. Pembayaran dapat dicatat.
5. Transaksi otomatis mengurangi stok.
6. Receipt dapat dicetak.
7. Riwayat transaksi dapat dilihat.
8. Dashboard dapat menampilkan omzet.
9. Laporan sederhana dapat dilihat.

---

# 47. Final Navigation

Versi final MVP:

```text
BUMDes POS

├── Dashboard
│
├── Kasir
│
├── Produk
│
├── Transaksi
│
├── Laporan
│
└── Pengaturan
```

Walaupun secara bisnis hanya ada **4 modul inti**, Dashboard dan Pengaturan tetap tersedia sebagai halaman pendukung.

Fokus utama aplikasi tetap:

```text
PRODUCT

↓

POS

↓

TRANSACTION

↓

REPORT
```

Tidak lebih dari itu untuk versi pertama.