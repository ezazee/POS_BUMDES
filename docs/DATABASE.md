# DATABASE.md

# Database Design

Database:

PostgreSQL

ORM:

Prisma

Tujuan desain database:

- sederhana
- cukup untuk MVP
- transaction-safe
- mudah dikembangkan

---

# 1. User

Fields:

id

name

email

password / auth identity

role

isActive

createdAt

updatedAt

Role:

ADMIN

CASHIER

---

# 2. Product

Fields:

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

Rules:

- sku unique
- barcode nullable
- barcode unique jika tersedia
- purchasePrice integer
- sellingPrice integer
- stock integer
- stock tidak boleh negatif

---

# 3. Transaction

Fields:

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

updatedAt

Payment Method:

CASH

TRANSFER

QRIS

Rules:

invoiceNumber unique.

---

# 4. TransactionItem

Fields:

id

transactionId

productId

productName

quantity

purchasePrice

sellingPrice

subtotal

createdAt

Important:

Snapshot berikut harus disimpan:

productName

purchasePrice

sellingPrice

Jangan hanya membaca harga terbaru dari Product.

Transaksi lama tidak boleh berubah jika harga produk berubah.

---

# 5. StockMovement

Gunakan model sederhana untuk histori stok.

Fields:

id

productId

type

quantity

stockBefore

stockAfter

referenceId

note

createdAt

Types:

SALE

MANUAL

ADJUSTMENT

Contoh:

SALE

quantity = -2

stockBefore = 20

stockAfter = 18

referenceId = transactionId

---

# Relations

User

1 → N Transaction

Product

1 → N TransactionItem

Product

1 → N StockMovement

Transaction

1 → N TransactionItem

---

# Transaction Safety

Checkout WAJIB dilakukan dalam satu database transaction.

Proses:

1. validasi cart
2. ambil produk terbaru dari database
3. validasi stok
4. hitung ulang harga di server
5. create Transaction
6. create TransactionItem
7. kurangi Product.stock
8. create StockMovement

Semua operasi harus atomic.

Jika salah satu gagal:

rollback semuanya.

---

# Important Security Rule

JANGAN percaya:

- total dari frontend
- sellingPrice dari frontend
- purchasePrice dari frontend
- stock dari frontend

Frontend hanya mengirim:

- productId
- quantity
- discount
- paymentMethod
- paidAmount jika cash

Backend mengambil product dan harga asli dari database.

Backend menghitung:

subtotal

discount

total

change

---

# Stock Rule

Sebelum checkout:

product.stock >= requested quantity

Jika tidak:

reject transaction.

Jangan izinkan stok negatif.

---

# Gross Profit

Gross profit transaction:

sum:

(sellingPrice - purchasePrice) × quantity

dikurangi discount transaksi jika diperlukan pada report total.

Tidak perlu membuat tabel accounting.

---

# Reports

Report tidak membutuhkan tabel khusus.

Gunakan agregasi dari:

Transaction

TransactionItem

Product

---

# Seed Data

Buat:

1 admin

1 cashier

dan sekitar 15-20 dummy products.

Contoh:

- Beras Premium 5kg
- Beras Medium 5kg
- Minyak Goreng 1L
- Minyak Goreng 2L
- Gula Pasir 1kg
- Telur Ayam 1kg
- Tepung Terigu 1kg
- Mie Instan
- Kopi
- Teh
- Susu
- Air Mineral
- Sabun
- Detergen
- Gas LPG

Berikan harga dan stok yang masuk akal untuk development.

Seed hanya digunakan development.