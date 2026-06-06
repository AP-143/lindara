# Lindara — Lindungi yang Berharga.

Platform asuransi digital full-stack berbasis Node.js + Express + SQLite.

## Cara Menjalankan

**Requirement:** [Bun](https://bun.sh) v1.1+

```bash
cd lindara
bun install
bun start
```

Buka **http://localhost:3000**

> `bun:sqlite` digunakan sebagai database driver (built-in, tidak butuh kompilasi native). Jika Anda menggunakan npm/node standar, ganti `bun:sqlite` di `src/db/database.js` dengan `better-sqlite3` dan jalankan `npm install`.

---

## Akun Seed (bawaan)

| Role     | Email                | Password      |
|----------|----------------------|---------------|
| Admin    | admin@lindara.id     | admin123      |
| Nasabah  | budi@example.com     | customer123   |

---

## Alur Utama

1. **Register/Login** — `/register` atau `/login`
2. **Katalog** — `/katalog` (filter per kategori)
3. **Detail & Simulasi Premi** — klik produk → isi usia/nilai/durasi → hitung
4. **Beli Polis** — klik "Beli Polis Sekarang" setelah simulasi
5. **Dashboard Nasabah** — `/dashboard` — lihat semua polis & klaim
6. **Ajukan Klaim** — `/klaim` — pilih polis aktif → isi form
7. **Admin Panel** — `/admin` — approve/reject klaim, CRUD produk, lihat semua polis

---

## Ringkasan Endpoint API

### Auth
| Method | Path | Akses |
|--------|------|-------|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET  | `/api/auth/me` | Auth |

### Produk
| Method | Path | Akses |
|--------|------|-------|
| GET  | `/api/products` | Public |
| GET  | `/api/products/:id` | Public |
| POST | `/api/products/:id/quote` | Public |
| POST | `/api/products` | Admin |
| PUT  | `/api/products/:id` | Admin |
| DELETE | `/api/products/:id` | Admin |

### Polis
| Method | Path | Akses |
|--------|------|-------|
| GET  | `/api/policies` | Auth (nasabah: milik sendiri; admin: semua) |
| POST | `/api/policies` | Auth (nasabah) |

### Klaim
| Method | Path | Akses |
|--------|------|-------|
| GET  | `/api/claims` | Auth (nasabah: milik sendiri; admin: semua) |
| POST | `/api/claims` | Auth (nasabah) |
| PATCH | `/api/claims/:id` | Admin |

---

## Struktur Proyek

```
lindara/
├── server.js              # Entry point
├── .env                   # JWT_SECRET, PORT
├── .env.example
├── src/
│   ├── db/database.js     # Schema, seed, SQLite (bun:sqlite)
│   ├── middleware/auth.js  # JWT + role guard
│   └── routes/
│       ├── auth.js
│       ├── products.js
│       ├── policies.js
│       └── claims.js
└── public/
    ├── index.html          # SPA shell
    ├── css/main.css        # Design system lengkap
    └── js/
        ├── app.js          # Router, Auth, Toast, utilities
        └── pages/
            ├── home.js     # Landing page
            ├── katalog.js  # Katalog + filter
            ├── product-detail.js  # Detail + kalkulator premi
            ├── auth.js     # Login + Register
            ├── dashboard.js # Dashboard nasabah
            ├── klaim.js    # Form & riwayat klaim
            └── admin.js    # Admin panel
```

---

## Produk Seed (8 produk, 4 kategori)

| Kategori | Produk | Premi Dasar |
|----------|--------|-------------|
| Jiwa | Lindara Jiwa Prima | Rp 150.000/bln |
| Jiwa | Lindara Jiwa Keluarga | Rp 250.000/bln |
| Kesehatan | Lindara Sehat Plus | Rp 350.000/bln |
| Kesehatan | Lindara Sehat Eksekutif | Rp 750.000/bln |
| Kendaraan | Lindara Auto Proteksi | Rp 200.000/bln |
| Kendaraan | Lindara Motor Guard | Rp 80.000/bln |
| Properti | Lindara Hunian Aman | Rp 180.000/bln |
| Properti | Lindara Bisnis Properti | Rp 500.000/bln |

---

## Variabel Lingkungan

```env
JWT_SECRET=lindara_jwt_secret_key_2024_secure
PORT=3000
NODE_ENV=development
```
