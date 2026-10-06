# PROJECT.md

# BUMDes POS

## 1. Overview

BUMDes POS adalah aplikasi Point of Sale sederhana untuk operasional BUMDes.

Aplikasi ini sengaja dibuat sebagai POS sederhana, bukan ERP.

Prioritas utama:
- mudah digunakan
- cepat
- UI sederhana
- sedikit menu
- mudah dirawat
- cocok untuk kasir non-teknis

Referensi desain UI tersedia di:

`/stitch_bumdes_pos_ui_app`

Gunakan hasil Stitch tersebut sebagai referensi visual utama.

Detail design system dan UI terdapat pada:

`DESIGN.md`

---

## 2. MVP Scope

MVP hanya memiliki 4 modul utama:

1. Produk
2. Kasir / POS
3. Transaksi
4. Laporan

Halaman pendukung:

- Login
- Dashboard
- Pengaturan sederhana

---

# 3. Modul Produk

Fungsi:

- melihat produk
- mencari produk
- tambah produk
- edit produk
- nonaktifkan produk

Data produk:

- nama
- SKU
- barcode
- kategori
- harga beli
- harga jual
- stok
- status aktif

Produk yang aktif otomatis tersedia pada halaman POS.

---

# 4. Modul Kasir / POS

Kasir dapat:

- mencari produk
- search berdasarkan nama
- search berdasarkan SKU
- scan/input barcode
- menambahkan produk ke cart
- menambah/mengurangi quantity
- menghapus item dari cart
- memberi diskon transaksi
- melihat subtotal
- melihat total
- melakukan pembayaran

Metode pembayaran MVP:

- Cash
- Transfer
- QRIS

Untuk Cash:

- input uang diterima
- sistem menghitung kembalian

Setelah pembayaran:

- transaksi disimpan
- stok berkurang
- receipt ditampilkan
- receipt dapat dicetak

---

# 5. Modul Transaksi

Menampilkan:

- nomor invoice
- waktu
- jumlah item
- metode pembayaran
- total
- kasir

User dapat membuka detail transaksi.

Detail transaksi menampilkan:

- nomor invoice
- tanggal
- kasir
- item transaksi
- quantity
- harga
- subtotal
- diskon
- total
- metode pembayaran
- uang diterima
- kembalian

Receipt dapat dicetak kembali.

---

# 6. Modul Laporan

Laporan dibuat sederhana.

Filter:

- hari ini
- 7 hari
- bulan ini
- custom date

Summary:

- omzet
- jumlah transaksi
- produk terjual
- laba kotor

Laba kotor:

Selling Price - Purchase Price

Laporan tidak termasuk sistem accounting.

---

# 7. Dashboard

Dashboard hanya berupa summary sederhana:

- omzet hari ini
- jumlah transaksi
- total produk
- stok menipis

Tambahkan daftar transaksi terbaru.

Dashboard tidak perlu analytics kompleks.

---

# 8. User Role

Hanya terdapat dua role:

## Admin

Akses:

- Dashboard
- POS
- Produk
- Transaksi
- Laporan
- Pengaturan

## Kasir

Akses:

- POS
- Transaksi

Tidak perlu permission system kompleks.

---

# 9. Business Flow

## Produk

Admin
→ Tambah Produk
→ Produk tersimpan
→ Produk muncul di POS

## Penjualan

Kasir
→ Pilih produk
→ Cart
→ Bayar
→ Transaction dibuat
→ TransactionItem dibuat
→ Stok berkurang
→ Receipt
→ Selesai

## Laporan

Transaction + TransactionItem
→ Report
→ Dashboard

---

# 10. Invoice

Format:

INV-YYYYMMDD-XXXX

Contoh:

INV-20261006-0001

Nomor harus unik.

---

# 11. Currency

Currency:

IDR

Harga disimpan sebagai integer.

Contoh:

Rp15.000

disimpan sebagai:

15000

Jangan menggunakan floating point untuk harga.

---

# 12. Barcode

Barcode disimpan sebagai string.

Search POS harus mendukung:

- product name
- SKU
- barcode

MVP tidak membutuhkan integrasi khusus barcode scanner.

USB barcode scanner dapat dianggap sebagai keyboard input.

---

# 13. Receipt

MVP menggunakan HTML/CSS print.

Target utama:

80mm thermal printer.

Gunakan browser print.

Tidak perlu printer SDK khusus.

---

# 14. Out of Scope

JANGAN implementasikan:

- Supplier
- Purchase Order
- Pembelian
- Customer Management
- Hutang
- Piutang
- Accounting
- Multi Warehouse
- Multi Outlet
- Stock Transfer
- Advanced Inventory
- Batch
- Expired Date
- Loyalty
- Promo Engine
- Approval System
- MBG Module khusus
- Online Store
- Marketplace Integration

Jangan menambahkan fitur di luar MVP tanpa instruksi.

---

# 15. MVP Completion Criteria

MVP dianggap selesai ketika:

- login bekerja
- admin dapat mengelola produk
- produk tampil di POS
- kasir dapat membuat cart
- pembayaran bekerja
- transaksi tersimpan
- stok berkurang otomatis
- transaksi dapat dilihat kembali
- receipt dapat dicetak
- laporan membaca data transaksi asli
- dashboard membaca data transaksi asli
- role Admin/Kasir bekerja
- UI sesuai referensi Stitch
- tidak ada data mock pada production flow