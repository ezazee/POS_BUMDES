# TECH_STACK.md

# BUMDes POS Tech Stack

## Application

Framework:

Next.js 16

Language:

TypeScript

Gunakan:

- App Router
- Server Components jika sesuai
- Client Components hanya ketika dibutuhkan
- Route Handlers / Server Actions sesuai kebutuhan

Tidak menggunakan backend Express terpisah.

---

# UI

- Tailwind CSS
- shadcn/ui
- Lucide Icons
- Plus Jakarta Sans

Referensi UI utama:

`/stitch_bumdes_pos_ui_app`

Design specification:

`DESIGN.md`

Jangan redesign UI tanpa alasan.

---

# Database

PostgreSQL

ORM:

Prisma

Development maupun production tetap menggunakan PostgreSQL.

---

# Authentication

Gunakan:

Better Auth

Roles:

- ADMIN
- CASHIER

Session harus aman dan server-side validated.

---

# Validation

Gunakan:

Zod

Semua input penting harus divalidasi di server.

Client validation hanya untuk UX.

---

# Forms

Boleh menggunakan:

React Hook Form

jika memang mempermudah form.

Jangan menambahkan library form jika tidak diperlukan.

---

# State Management

Tidak menggunakan Redux.

Untuk cart POS:

gunakan React state/context sederhana jika diperlukan.

Server state tetap berasal dari database/API.

---

# Currency

Semua nilai rupiah menggunakan integer.

Contoh:

Rp 125.000

database:

125000

Gunakan helper formatCurrency untuk display.

---

# Date

Timezone bisnis:

Asia/Jakarta

Tampilkan tanggal dan waktu dalam format Indonesia.

---

# Printing

Receipt:

HTML + CSS

Target:

80mm thermal printer

Gunakan:

window.print()

atau print-specific page.

Tidak perlu SDK printer.

---

# Deployment

Supported:

- Vercel
- VPS

Database:

- Neon PostgreSQL

atau

- PostgreSQL sendiri

---

# Package Policy

Jangan menambahkan dependency tanpa alasan.

Sebelum menambahkan package:

1. cek apakah fitur bisa dilakukan dengan dependency yang sudah ada
2. gunakan library populer dan maintained
3. hindari package redundant

---

# Code Quality

Wajib:

- TypeScript strict
- jangan gunakan `any`
- ESLint bersih
- build berhasil
- typecheck berhasil

Gunakan reusable component jika memang digunakan berulang.

Jangan melakukan abstraction berlebihan.

---

# Architecture Principle

Keep it simple.

Aplikasi ini adalah POS sederhana.

Jangan membuat:

- microservices
- Redis
- message queue
- event bus
- CQRS
- repository pattern kompleks
- dependency injection framework
- distributed architecture

Gunakan arsitektur Next.js sederhana dan maintainable.