# Text Match Analyzer

Aplikasi web *Fullstack* (Express.js & React) untuk menganalisis persentase kecocokan karakter antara dua buah teks. Proyek ini dibangun sebagai bagian dari *Coding Selection Test* Hashmicro.

## 🚀 Fitur Utama

- **Pencocokan Teks (Strategy Pattern):**
  - **SENSITIVE:** Membedakan huruf besar & kecil (`A` ≠ `a`).
  - **INSENSITIVE:** Mengabaikan kapitalisasi (`A` = `a`).
- **Autentikasi:** Login menggunakan JSON Web Token (JWT).
- **History CRUD:** Simpan, baca, edit, dan hapus (soft-delete) riwayat analisis teks.
- **Statistik:** Dashboard menampilkan rata-rata kecocokan, persentase tertinggi, dan penggunaan mode tiap pengguna.
- **Label Pintar:** Pemberian label berdasarkan persentase (Rendah, Sedang, Penuh), beserta fitur pemberitahuan (Hint) untuk mencoba mode lain apabila selisihnya jauh.

---

## 🏗️ Arsitektur & Teknologi

Proyek ini dibangun berdasarkan pola **MVC (Model-View-Controller)** yang terdistribusi:
- **Backend (Model & Controller):** Menangani logika bisnis, persistensi data, dan akses API.
- **Frontend (View):** Aplikasi Single-Page (SPA) sebagai antarmuka interaktif pengguna.

### Stack Backend (Node.js)
- **TypeScript & Express.js**
- **TypeORM & PostgreSQL:** Sebagai layer persistensi dan manipulasi *database* dengan dukungan *class-based entity*.
- **Zod:** Validasi input *runtime* (*Request validation*).
- **Bcrypt & JSON Web Token:** Hashing kata sandi dan proteksi otorisasi.
- **Vitest & Supertest:** Eksekusi unit tes dan integrasi.

### Stack Frontend (React)
- **Vite & React 19:** *Build tool* super cepat dan library UI modern.
- **TypeScript:** Proteksi tipe (*Type Safety*) yang kuat.
- **React Router v7:** Sistem navigasi aplikasi (SPA Routing).
- **TanStack React Query:** *State management* handal untuk sinkronisasi, antrian, dan pengembalian (caching) data dari server (API).
- **Tailwind CSS v4 & shadcn/ui:** Styling *utility-first* dengan komponen antarmuka yang bersih (Radix UI).
- **Axios:** Klien HTTP untuk komunikasi dengan backend secara mulus (termasuk injeksi otomatis header *Bearer token* JWT).

---

## 🧩 Konsep OOP & Design Pattern

Sesuai persyaratan, proyek ini memaksimalkan praktik pemrograman berorientasi objek (OOP) di TypeScript.

1. **Abstract Base Entity & Inheritance**
   Terdapat `BaseEntity` (abstract class) yang menyimpan properti `id` (UUID), `createdAt`, `updatedAt`, dan `deletedAt`. Class ini diwarisi oleh entitas lain seperti `User` dan `Comparison`, sehingga mengefisienkan duplikasi kode pada *database mapping* (TypeORM).

2. **Strategy Pattern (Open/Closed Principle)**
   Terdapat interface `MatchStrategy` dengan abstraksi fungsi `normalize(input: string)`.
   Hal ini diimplementasikan oleh dua class konkret: `CaseSensitiveStrategy` dan `CaseInsensitiveStrategy`. 
   Service tidak perlu tahu secara detail cara teks diubah—ia hanya memanggil `normalize()`. Jika besok dibutuhkan mode pencocokan baru (misal: "Abaikan Angka"), kita cukup menambahkan kelas Strategy baru tanpa memodifikasi kode inti Service.

3. **Repository Pattern & Dependency Injection**
   Semua komunikasi ke TypeORM diabstraksi ke dalam class *Repository* (contoh: `ComparisonRepository`). Layanan (*Service*) tidak bergantung langsung ke konfigurasi *database*, melainkan Repository tersebut "disuntikkan" (*Injected*) via constructor ke dalam Service, dan Service disuntikkan ke Controller. Pattern ini sangat memudahkan proses *Unit Testing* melalui teknik *Mocking*.

---

## 💡 Algoritma Pencarian & Asumsi

**Kompleksitas Algoritma: O(n + m)**
Pencarian karakter Input 1 ke dalam Input 2 dikembangkan menggunakan struktur data **`Set`**. 
1. Teks Input 2 dimasukkan ke dalam kumpulan `Set` unik. Proses ini memakan waktu `O(m)` di mana `m` adalah panjang Input 2.
2. Setiap karakter pada Input 1 diiterasi dan dicocokkan (apakah eksis di dalam `Set` tersebut?). Operasi `has()` pada struktur `Set` memakan kompleksitas konstan `O(1)`. Total iterasi ini `O(n)` di mana `n` adalah panjang Input 1.
3. Kompleksitas total menjadi `O(n + m)`.

**Asumsi Penting:**
- **Spasi dihitung sebagai karakter.** Sesuai pedoman pengujian (karena tidak disinggung eksplisit untuk dibuang), spasi `" "` dianggap sebagai entitas karakter valid (mirip huruf/angka). Spasi di *Input 1* akan ikut mencari eksistensi spasi di *Input 2*.

---

## 🛠️ Panduan Menjalankan Secara Lokal

Pastikan Anda memiliki *Node.js (v20+)* dan *Docker* di komputer Anda.

### 1. Kloning & Database Setup
Buka terminal dan unduh repositori ini:
```bash
git clone https://github.com/ramdany05/Text-Match-Analyzer.git
cd Text-Match-Analyzer
```

Buka folder `backend`, persiapkan konfigurasi lingkungan, lalu nyalakan Docker untuk membuat kontainer PostgreSQL lokal.
```bash
cd backend
cp .env.example .env
docker compose up -d
```
*(Proses ini akan menjalankan PostgreSQL lokal pada port `5433`)*

### 2. Jalankan Backend (API)
Install semua dependensi backend, lalu jalankan mode *development*.
```bash
npm install
npm run dev
```
- Backend berjalan pada `http://localhost:3000`.
- **Note:** Saat pertama kali backend dijalankan, sistem akan mendeteksi koneksi dan otomatis memasukkan (Seed) data akun Demo.

### 3. Jalankan Frontend (UI)
Buka tab terminal yang baru, masuk ke folder `frontend`.
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```
- Frontend berjalan secara otomatis (biasanya di `http://localhost:5173` atau `5174`).
- Buka URL tersebut di browser.

---

## 🔑 Kredensial Akun Demo

Aplikasi sengaja didesain **tanpa halaman registrasi**. Gunakan akun demo berikut untuk masuk (login) ke dalam aplikasi. Akun ini disiapkan (di-hash) otomatis ke dalam database saat backend dinyalakan pertama kali.

- **Username:** `penguji`
- **Password:** `password123`

---

## 🧪 Panduan Testing

Testing dibagi menjadi Unit Test dan Integration Test (Supertest).

Jalankan perintah ini di dalam direktori `backend/`:
```bash
# Menjalankan seluruh test file
npm run test

# Menjalankan test dan melihat cakupan kodenya (Coverage)
npm run test:coverage
```
Semua endpoint CRUD (Create, Read, Update, Delete) hingga fungsi Otorisasi dan Pagination sudah terlingkupi dalam rangkaian integrasi tes dengan tingkat passing **100%**.
