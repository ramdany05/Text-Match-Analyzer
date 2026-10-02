# Express + TypeScript Boilerplate

Boilerplate API dengan **Express 5**, **TypeScript (strict)** dan **Prisma 7**.
Database bisa diganti antara **PostgreSQL** dan **MySQL/MariaDB** tanpa menjalankan
`prisma init` lagi — semua konfigurasi Prisma sudah ikut di repo ini.

## Persyaratan

- Node.js 20 atau lebih baru
- Docker (opsional — hanya untuk menjalankan database lokal)

## Setup cepat

```bash
npm install
cp .env.example .env          # default sudah menunjuk ke PostgreSQL lokal
docker compose up -d --wait   # jalankan PostgreSQL
npm run db:generate           # WAJIB: Prisma Client tidak ikut di-commit
npm run db:migrate            # buat tabel
npm run dev
```

Cek berjalan: `GET http://localhost:3000/api/users` → `{"success":true,"data":[]}`

> `npm run db:generate` wajib dijalankan sekali setelah clone, karena folder
> `src/generated/` ada di `.gitignore` (hasil generate, bukan source).

## Struktur

```
src/
  app.ts              # setup Express (middleware, router, error handler)
  server.ts           # bootstrap + graceful shutdown
  config/env.ts       # pembacaan environment variable
  lib/prisma.ts       # Prisma Client + pemilihan driver adapter
  middleware/error.ts # 404 handler & error handler global
  routes/             # definisi endpoint
prisma/
  schema.prisma       # model + provider database
prisma.config.ts      # konfigurasi Prisma 7 (url, lokasi migration)
docker-compose.yml    # PostgreSQL (default) + MySQL (profil opsional)
```

## Environment variable

| Variabel       | Default       | Keterangan                                        |
| -------------- | ------------- | ------------------------------------------------- |
| `DATABASE_URL` | —             | Wajib. Skema URL menentukan provider (lihat bawah) |
| `PORT`         | `3000`        | Port HTTP server                                  |
| `NODE_ENV`     | `development` | Di `production`, detail error tidak dikirim ke client |

Semua variabel divalidasi dengan **zod** di `src/config/env.ts` saat startup.
Nilai yang tidak valid membuat proses berhenti dengan pesan per-variabel — bukan
error acak di tengah request.

---

## Mengganti database

### Bagaimana provider ditentukan

Ada **dua tempat** yang harus sinkron, dan keduanya diubah manual:

| Tempat                        | Isi                                   |
| ----------------------------- | ------------------------------------- |
| `prisma/schema.prisma`        | `provider = "postgresql"` \| `"mysql"` |
| `.env` → `DATABASE_URL`       | skema URL menentukan adapter mana yang dipakai saat runtime |

`src/lib/prisma.ts` membaca skema URL dan memilih driver adapter:

| Skema `DATABASE_URL`            | Adapter yang dipakai     | Status              |
| ------------------------------- | ------------------------ | ------------------- |
| `postgresql://`, `postgres://`  | `@prisma/adapter-pg`     | sudah terpasang     |
| `mysql://`, `mariadb://`        | `@prisma/adapter-mariadb`| install on demand   |

Skema URL yang tidak dikenal akan langsung menolak dengan pesan yang jelas saat
server start — bukan error samar di tengah request.

### Default: PostgreSQL

```bash
docker compose up -d --wait
# .env
DATABASE_URL="postgresql://db_user:my_password@localhost:5432/boiler_plate?schema=public"
```

### Pindah ke MySQL / MariaDB

1. Jalankan MySQL lokal (service ini ada di balik profil agar tidak ikut jalan
   saat kamu hanya butuh Postgres):

   ```bash
   docker compose --profile mysql up -d --wait
   ```

2. Pasang adapter MySQL (paket ini sudah membawa driver `mariadb`-nya sendiri,
   jadi tidak perlu install driver terpisah):

   ```bash
   npm install @prisma/adapter-mariadb
   ```

3. Ubah provider di `prisma/schema.prisma`:

   ```prisma
   datasource db {
     provider = "mysql"
   }
   ```

4. Ubah `DATABASE_URL` di `.env` (comment baris Postgres, aktifkan baris MySQL):

   ```bash
   DATABASE_URL="mysql://db_user:my_password@localhost:3306/boiler_plate"
   ```

5. Generate ulang client dan buat migrasi:

   ```bash
   npm run db:generate
   npm run db:migrate
   ```

> **Penting soal migrasi.** Isi `prisma/migrations/` berisi SQL yang spesifik
> untuk satu provider. Saat pindah provider, migrasi lama tidak bisa dipakai
> ulang — hapus folder `prisma/migrations/` lalu jalankan `npm run db:migrate`
> untuk membuat ulang dari nol. Kalau database sudah berisi data produksi,
> perpindahan provider bukan sekadar ubah dua baris: perlu ekspor–impor data
> secara manual.

### Kembali dari MySQL ke PostgreSQL

Kebalikan dari langkah di atas: ubah `provider = "postgresql"`, kembalikan
`DATABASE_URL`, lalu `npm run db:generate` dan `npm run db:migrate`.

### Menghapus adapter yang tidak dipakai

Boilerplate ini sengaja hanya memasang adapter PostgreSQL. Kalau projectmu
murni MySQL dan ingin menghemat dependency, buang adapter Postgres:

```bash
npm uninstall @prisma/adapter-pg
```

Lalu hapus dua bagian di `src/lib/prisma.ts`:

```ts
import { PrismaPg } from "@prisma/adapter-pg";   // 1. hapus import ini

// 2. hapus blok ini di dalam createAdapter()
if (provider === "postgresql") {
  return new PrismaPg({ connectionString: url });
}
```

Selama kode itu belum dihapus, `tsc` akan memberi error
`Cannot find module '@prisma/adapter-pg'` — ini disengaja supaya ketahuan,
bukan gagal diam-diam saat server jalan.

<details>
<summary>Alternatif: bikin PostgreSQL juga on-demand, supaya uninstall tidak perlu ubah kode</summary>

Ganti import statis `PrismaPg` dengan `require` di dalam `createAdapter()`:

```ts
const { PrismaPg } = require("@prisma/adapter-pg") as {
  PrismaPg: new (config: { connectionString: string }) => DriverAdapter;
};
return new PrismaPg({ connectionString: url });
```

Konsekuensinya: tidak ada lagi pengecekan tipe saat compile untuk adapter
Postgres, dan salah tulis nama opsi baru ketahuan saat runtime.
</details>

### Database lain (SQLite, libSQL, Neon, Prisma Postgres)

Pola yang sama bisa dipakai: tambahkan cabang baru di `createAdapter()` dan
sesuaikan `provider` di schema. Paket adapter yang tersedia di seri 7:

| Database          | Paket                              |
| ----------------- | ---------------------------------- |
| SQLite            | `@prisma/adapter-better-sqlite3`   |
| Turso / libSQL    | `@prisma/adapter-libsql`           |
| Neon (serverless) | `@prisma/adapter-neon`             |
| Prisma Postgres   | `@prisma/adapter-ppg`              |

---

## Script npm

| Script              | Fungsi                                              |
| ------------------- | --------------------------------------------------- |
| `npm run dev`       | Jalankan server dengan hot reload (`tsx watch`)     |
| `npm run build`     | Compile TypeScript ke `dist/`                       |
| `npm start`         | Jalankan hasil build (`node dist/server.js`)        |
| `npm run db:generate` | Generate Prisma Client ke `src/generated/prisma`  |
| `npm run db:migrate`  | Buat & terapkan migration (development)           |
| `npm run db:deploy`   | Terapkan migration yang sudah ada (production)    |
| `npm run db:studio`   | Buka Prisma Studio                                |

## Endpoint

| Method | Path            | Keterangan         |
| ------ | --------------- | ------------------ |
| GET    | `/api`          | Info API           |
| GET    | `/api/users`    | Daftar user        |
| GET    | `/api/users/:id`| Detail user        |
| POST   | `/api/users`    | Tambah user        |
| DELETE | `/api/users/:id`| Hapus user         |

---

## Troubleshooting

**`PrismaConfigEnvError: Cannot resolve environment variable: DATABASE_URL`**
`.env` belum ada. Jalankan `cp .env.example .env`. Perintah Prisma membaca env
lewat `prisma.config.ts`, yang gagal cepat kalau variabelnya kosong.

**`DATABASE_URL belum diisi.`**
Server dijalankan tanpa `DATABASE_URL`. Sama seperti di atas, isi `.env` dulu.

**`Skema DATABASE_URL harus salah satu dari: postgresql, postgres, mysql, mariadb`**
`DATABASE_URL` memakai skema yang tidak dikenal. Divalidasi zod saat startup,
jadi proses berhenti sebelum server jalan. Perbaiki `DATABASE_URL` di `.env`.

**`The Driver Adapter '@prisma/adapter-mariadb', based on 'mysql', is not compatible with the provider 'postgres' specified in the Prisma schema.`**
`DATABASE_URL` sudah MySQL tapi `provider` di `prisma/schema.prisma` masih
`postgresql` (atau sebaliknya, misalnya karena lupa `npm run db:generate`
setelah mengubah provider). Samakan keduanya, lalu generate ulang.

**`DATABASE_URL memakai MySQL, tetapi adapter-nya belum terpasang.`**
Adapter MySQL tidak ada di `node_modules`. Jalankan
`npm install @prisma/adapter-mariadb`.

**Error koneksi (`P1001`, `ECONNREFUSED`)**
Database belum jalan atau password/port tidak cocok. Cek dengan
`docker compose ps`, lalu `docker compose up -d`.

**`service "postgres" refers to undefined volume postgres_data`**
Ini bug dari versi `docker-compose.yml` yang lama (blok `volumes:` belum ada).
Versi di repo sudah diperbaiki.

---

## Catatan

- **`prisma init` tidak diperlukan.** `prisma/schema.prisma`, `prisma.config.ts`,
  `.env`, dan script npm sudah ada di repo ini. Menjalankannya lagi hanya akan
  membuat file kembar.
- Perintah `prisma init` versi baru otomatis menanam *agent skills* ke folder
  `.agents/`, `.claude/`, `.cursor/`, dan `.devin/`. Kalau tidak diinginkan,
  jalankan `npx prisma init --no-skills`.
- Repo ini **tidak** memakai script `postinstall`. Sebelumnya sempat ada
  `prisma skills sync`, tetapi perintah itu **tidak valid** di Prisma 7
  (`Unknown command "skills"`) dan sudah dihapus.
