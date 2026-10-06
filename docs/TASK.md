# TASK.md

# BUMDes POS — Development Checklist

Kerjakan seluruh MVP sampai selesai.

Referensi wajib:

- `docs/PROJECT.md`
- `docs/DESIGN.md`
- `docs/TECH-STACK.md`
- `docs/DATABASE.md`
- `stitch_bumdes_pos_ui_app/`

Folder Stitch merupakan referensi visual utama.

Jangan mengubah atau menimpa folder Stitch.

---

# 1. Project Foundation

- [X] Audit existing repository
- [X] Setup Next.js 16
- [X] Setup TypeScript strict
- [X] Setup Tailwind CSS
- [X] Setup shadcn/ui
- [X] Setup Plus Jakarta Sans
- [X] Setup Lucide Icons
- [X] Implement global layout
- [X] Implement sidebar
- [X] Implement header
- [X] Implement responsive layout

---

# 2. Database

- [X] Setup PostgreSQL
- [X] Setup Prisma
- [X] Create User model
- [X] Create Product model
- [X] Create Transaction model
- [X] Create TransactionItem model
- [X] Create StockMovement model
- [X] Create relations
- [X] Create migration
- [X] Create development seed

Seed:

- 1 admin
- 1 cashier
- 15–20 sample products

---

# 3. Authentication

- [X] Setup Better Auth
- [X] Login
- [X] Logout
- [X] Session validation
- [X] Protected routes
- [X] ADMIN role
- [X] CASHIER role
- [X] Role-based navigation
- [X] Role-based route protection

---

# 4. Dashboard

Implement `/dashboard`.

- [X] Omzet hari ini
- [X] Jumlah transaksi hari ini
- [X] Total produk
- [X] Stok menipis
- [X] Transaksi terbaru

Semua data harus berasal dari database.

Tidak boleh menggunakan mock data pada final implementation.

---

# 5. Produk

Implement `/products`.

Features:

- [X] Product list
- [X] Search product
- [X] Add product
- [X] Edit product
- [X] Activate/deactivate product
- [X] Stock display
- [X] Stock status
- [X] Product validation

Fields:

- name
- sku
- barcode
- category
- purchasePrice
- sellingPrice
- stock
- isActive

Rules:

- SKU unique
- barcode unique jika tersedia
- currency menggunakan integer
- stok tidak boleh negatif

---

# 6. POS / Kasir

Implement `/pos`.

Product area:

- [X] Product grid
- [X] Search by name
- [X] Search by SKU
- [X] Search by barcode
- [X] Product stock display
- [X] Out-of-stock state

Cart:

- [X] Add product
- [X] Increase quantity
- [X] Decrease quantity
- [X] Remove item
- [X] Subtotal
- [X] Discount
- [X] Total

Payment:

- [X] Cash
- [X] Transfer
- [X] QRIS
- [X] Input cash received
- [X] Calculate change
- [X] Payment validation
- [X] Payment confirmation

UI harus mengikuti referensi Stitch.

---

# 7. Checkout Logic

Checkout harus server-side dan atomic.

Flow:

- [X] Validate cart
- [X] Read latest products from database
- [X] Validate stock
- [X] Read price from database
- [X] Calculate subtotal server-side
- [X] Calculate discount
- [X] Calculate total
- [X] Create Transaction
- [X] Create TransactionItem
- [X] Reduce Product stock
- [X] Create StockMovement
- [X] Commit transaction

Jika satu proses gagal:

ROLLBACK seluruh checkout.

Jangan percaya nilai harga atau total dari frontend.

Frontend hanya boleh mengirim data yang dibutuhkan seperti:

- productId
- quantity
- discount
- paymentMethod
- paidAmount

---

# 8. Transactions

Implement:

`/transactions`

dan

`/transactions/[id]`

Transaction list:

- [X] Invoice number
- [X] Date/time
- [X] Items
- [X] Cashier
- [X] Payment method
- [X] Total
- [X] Search invoice
- [X] Date filter

Transaction detail:

- [X] Invoice
- [X] Date
- [X] Cashier
- [X] Items
- [X] Quantity
- [X] Selling price
- [X] Subtotal
- [X] Discount
- [X] Total
- [X] Payment method
- [X] Paid amount
- [X] Change

---

# 9. Receipt

- [X] Receipt page/component
- [X] 80mm thermal layout
- [X] Print CSS
- [X] Print button
- [X] Reprint from transaction detail

Gunakan browser printing.

Tidak perlu printer SDK.

---

# 10. Reports

Implement `/reports`.

Date filters:

- [X] Today
- [X] Last 7 days
- [X] Current month
- [X] Custom date

Metrics:

- [X] Revenue
- [X] Transaction count
- [X] Products sold
- [X] Gross profit

Sales summary:

- [X] Date
- [X] Transactions
- [X] Revenue
- [X] Gross profit

Semua report membaca data asli dari database.

---

# 11. Settings

Implement `/settings`.

Cukup sederhana:

- [X] Nama BUMDes
- [X] Alamat
- [X] Nomor telepon
- [X] Receipt footer

Jangan membuat configuration engine kompleks.

---

# 12. UI / UX

Audit semua halaman terhadap:

`docs/DESIGN.md`

dan

`stitch_bumdes_pos_ui_app/`

Pastikan:

- [X] typography konsisten
- [X] spacing konsisten
- [X] warna konsisten
- [X] button states
- [X] loading states
- [X] empty states
- [X] error states
- [X] disabled states
- [X] hover states
- [X] focus states
- [X] responsive desktop
- [X] responsive tablet
- [X] usable mobile fallback

Jangan redesign tanpa alasan.

---

# 13. Security & Data Integrity

- [X] Server-side validation menggunakan Zod
- [X] Auth validated server-side
- [X] Role validated server-side
- [X] Checkout protected
- [X] Product mutation protected
- [X] Report protected
- [X] No negative stock
- [X] No frontend price trust
- [X] Atomic checkout
- [X] Unique invoice
- [X] Unique SKU
- [X] Unique barcode jika tersedia

---

# 14. Code Quality

- [X] TypeScript strict
- [X] No `any`
- [X] Tidak ada dead code signifikan
- [X] Tidak ada placeholder functionality
- [X] Tidak ada mock data pada production flow
- [X] Tidak ada TODO critical
- [X] Dependency tidak berlebihan

Jangan over-engineer.

Tidak menggunakan:

- Express backend terpisah
- Redis
- microservices
- message queue
- CQRS
- complex repository pattern
- unnecessary state management library

---

# 15. Final QA

Test complete flow:

Admin Login

→ Create Product

→ Product appears in POS

→ Add Product to Cart

→ Checkout

→ Transaction saved

→ Stock reduced

→ StockMovement created

→ Receipt displayed

→ Transaction appears in history

→ Dashboard updated

→ Report updated

Test edge cases:

- [X] invalid login
- [X] cashier accessing admin page
- [X] duplicate SKU
- [X] duplicate barcode
- [X] zero stock
- [X] insufficient stock
- [X] invalid quantity
- [X] invalid discount
- [X] insufficient cash
- [X] direct protected URL access
- [X] browser refresh
- [X] empty cart checkout

---

# 16. Final Verification

Sebelum menyatakan project selesai:

- [X] lint berhasil
- [X] typecheck berhasil
- [X] production build berhasil
- [X] database migration berhasil
- [X] seed berhasil
- [X] seluruh route dapat digunakan
- [X] seluruh core flow berfungsi
- [X] TASK.md diperbarui sesuai kondisi sebenarnya

Project hanya dianggap selesai jika aplikasi benar-benar runnable dan core flow bekerja end-to-end.