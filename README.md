# Text Match Analyzer

Aplikasi web *Fullstack* (Express.js & React) untuk menganalisis persentase kecocokan karakter antara dua buah teks. Proyek ini dibangun sebagai bagian dari *Coding Selection Test* Hashmicro.

---

## 🌐 Arsitektur Deployment & Infrastruktur Produksi

Aplikasi ini dideploy dengan arsitektur modern yang memisahkan layer antarmuka dan layanan API:

```
┌─────────────────────────────────┐           ┌─────────────────────────────────────────┐
│        Frontend (React)         │  HTTPS    │          Backend (Express.js)           │
│         Dihosting di            │ ────────> │      Dihosting di VPS Tencent Cloud     │
│            Netlify              │  Requests │      Database PostgreSQL Terisolasi     │
│   (Edge CDN & SPA Redirects)    │           │ (Terekspos Aman via Cloudflare Tunnel)  │
└─────────────────────────────────┘           └─────────────────────────────────────────┘
```

- **Frontend (Netlify):** Dihosting di platform global Netlify Edge CDN dengan konfigurasi *SPA rewrites* (`netlify.toml`) untuk performa rendering dan routing instan.
- **Backend (VPS Tencent Cloud):** Dijalankan pada server VPS Tencent Cloud dengan manajemen proses dan kontainer database PostgreSQL.
- **Keamanan Jaringan (Cloudflare Tunnel):** Backend dihubungkan ke internet secara aman melalui **Cloudflare Tunnel**. Keuntungan:
  - Tidak memerlukan pembukaan port publik (Zero open inbound ports).
  - Sertifikat SSL/TLS HTTPS otomatis terkelola tanpa risiko expired.
  - Proteksi otomatis dari ancaman serangan DDoS dan bot pada layer edge Cloudflare.
- **Database (PostgreSQL):** Berjalan di lingkungan internal VPS dan hanya dapat diakses secara privat oleh service backend.

---

## 🚀 Fitur Utama & User Stories

Pengembangan fitur aplikasi ini terbagi ke dalam 5 *User Stories* utama beserta peningkatan UI/UX:

### **US1: Autentikasi Pengguna (Login & Session)**
- **User Story:** Sebagai pengguna/penguji, saya ingin dapat login agar data riwayat pengecekan tersimpan secara pribadi dan aman.
- **Kriteria Penerimaan & Implementasi:**
  - Login menggunakan *username* dan *password* mengembalikan token otentikasi JWT (kadaluarsa 24 jam).
  - Password tersimpan dalam database dalam bentuk hash `bcrypt`.
  - Halaman dan API riwayat tidak dapat diakses tanpa token (mengembalikan HTTP 401).
  - Akun demo (`tester`) sudah otomatis terisi di database via seeder.
  - Halaman login didesain dengan layout split-screen modern dan ilustrasi SVG bertema *Notion Line Art*.

### **US2: Algoritma Pencocokan Teks & Mode Sensitivitas**
- **User Story:** Sebagai pengguna, saya ingin memasukkan dua teks bebas dan memilih mode (Case Sensitive / Insensitive) untuk mengetahui persentase kemunculan karakter Input 1 pada Input 2.
- **Kriteria Penerimaan & Implementasi:**
  - **Mode Sensitive:** `A` dan `a` diperlakukan sebagai karakter berbeda.
  - **Mode Insensitive:** Perbedaan huruf besar dan kecil diabaikan.
  - **Karakter Duplikat:** Tetap dihitung sesuai panjang string Input 1.
  - **Formula:** `(Jumlah Karakter Input 1 yang Ditemukan di Input 2 / Total Karakter Input 1) × 100%`, dibulatkan 2 desimal.
  - **Contoh Uji Wajib Lulus:** 
    - Input 1: `ABBCD`, Input 2: `Gallant Duck` -> Mode Sensitive: **20.00%**, Mode Insensitive: **60.00%**.
  - **Live Split-Panel Workspace:** Panel input di sebelah kiri langsung menghitung dan memvisualisasikan mapping kecocokan karakter per-huruf di panel kanan secara instan (*real-time*) sebelum disimpan.

### **US3: Label Hasil Pintar & Rekomendasi (Hint)**
- **User Story:** Sebagai pengguna, saya ingin melihat label klasifikasi hasil dan rekomendasi jika mode sensitif memberikan hasil yang jauh lebih rendah.
- **Kriteria Penerimaan:**
  - `0%`: "Tidak ada kecocokan"
  - `1% - 49%`: "Rendah"
  - `50% - 99%`: "Sedang"
  - `100%`: "Penuh"
  - **Rekomendasi Pintar (Hint):** Jika mode `SENSITIVE` dipilih dan hasilnya terpaut selisih ≥ 20% lebih rendah dibanding mode `INSENSITIVE`, sistem otomatis menampilkan saran: *"Coba mode non-sensitive, hasilnya mungkin lebih baik."*

### **US4: Pengelolaan Riwayat (CRUD History) & Halaman Riwayat Lengkap**
- **User Story:** Sebagai pengguna, saya ingin mengelola riwayat pengecekan (Create, Read, Update, Delete) milik saya sendiri secara terorganisir.
- **Kriteria Penerimaan & Implementasi:**
  - **Create:** Setiap pengecekan pada workspace dapat disimpan langsung ke database.
  - **Read:** Menampilkan 5 riwayat terbaru di halaman Workspace dan daftar riwayat lengkap pada rute dedicated `/history` dalam format tabel Notion yang rapi.
  - **Search & Filter:** Pencarian teks bebas pada Input 1/Input 2/Label, filter dropdown mode, dan filter rentang tanggal (*Date Range Picker*).
  - **Bulk Delete:** Fitur multi-select baris data dengan konfirmasi modal untuk menghapus banyak catatan sekaligus.
  - **Ekspor CSV:** Fitur unduh seluruh data riwayat yang terfilter ke format file `.csv`.
  - **Update:** Input teks atau mode dapat dimuat ulang ke workspace untuk diedit dan dihitung ulang secara otomatis.
  - **Delete:** Menerapkan *Soft Delete* (`deletedAt`), data hilang dari daftar tampilan namun tidak dihapus permanen dari basis data.
  - **Otorisasi Data:** Pengguna hanya dapat mengakses dan mengedit datanya sendiri (akses ke data orang lain menghasilkan HTTP 403 Forbidden).

### **US5: Dashboard Ringkasan Statistik**
- **User Story:** Sebagai pengguna, saya ingin melihat ringkasan statistik dari seluruh riwayat pengecekan yang pernah saya lakukan.
- **Kriteria Penerimaan:**
  - Menampilkan rata-rata persentase (*Average*).
  - Menampilkan nilai persentase tertinggi (*Max*).
  - Menampilkan jumlah total pengecekan berdasarkan masing-masing mode (*Sensitive Count* & *Insensitive Count*) beserta rasio persentasenya.
  - Statistik otomatis ter-*refresh* secara *real-time* saat terjadi penambahan, pengubahan, atau penghapusan riwayat.

---

## 🎨 Desain & UI/UX (Notion-Inspired Brutalist)

Antarmuka pengguna dirancang dengan estetika **Notion-Inspired Brutalist Minimalism**:
- **Typography:** Kombinasi **JetBrains Mono** untuk token karakter, formula, dan data numerik, dipadukan dengan **Inter** untuk keterbacaan antarmuka yang bersih.
- **Visual Palette:** Palet warna monokrom netral (`#191919`, `#787774`, `#F7F7F5`) dengan aksen garis tepi tegas (hard borders).
- **Custom Line Art SVG:** Ilustrasi vektor custom untuk *Login Hero Illustration*, *Empty Workspace State*, dan *Empty History State*.
- **Feedback & Micro-interactions:** Notifikasi toast via Sonner, skeleton loading state, animasi transisi halaman dengan Framer Motion, serta tombol salin ringkasan hasil (*copy to clipboard*).

---

## 🏗️ Arsitektur & Teknologi

Proyek ini dibangun berdasarkan pola **MVC (Model-View-Controller)** yang terdistribusi:

### Stack Backend (Node.js)
- **TypeScript & Express.js**
- **TypeORM & PostgreSQL:** Layer persistensi dan manipulasi *database* dengan dukungan *class-based entity* dan relasi terisolasi.
- **Zod:** Validasi input *runtime* (*Request validation*).
- **Bcrypt & JSON Web Token:** Hashing kata sandi dan proteksi otorisasi.
- **Vitest & Supertest:** Eksekusi unit test dan integration test.

### Stack Frontend (React)
- **Vite & React 19:** *Build tool* super cepat dan library UI modern.
- **TypeScript:** Proteksi tipe (*Type Safety*) yang ketat.
- **React Router v7:** Navigasi SPA dengan pemisahan rute (`/` Workspace dan `/history` Riwayat).
- **TanStack React Query v5:** Manajemen data server, caching, dan sinkronisasi otomatis.
- **Tailwind CSS v4 & Radix UI (shadcn):** Komponen UI yang aksesibel dan ringan.
- **Framer Motion & Lucide Icons:** Animasi interaktif dan ikon vektor.
- **Axios:** Klien HTTP terkonfigurasi dengan interceptor JWT otomatis.

---

## 🧩 Konsep OOP & Design Pattern

Sesuai persyaratan, proyek ini memaksimalkan praktik pemrograman berorientasi objek (OOP) di TypeScript.

1. **Abstract Base Entity & Inheritance**
   Terdapat `BaseEntity` (abstract class) yang menyimpan properti `id` (UUID), `createdAt`, `updatedAt`, dan `deletedAt`. Class ini diwarisi oleh entitas lain seperti `User` dan `Comparison`, sehingga mengefisienkan duplikasi kode pada *database mapping* (TypeORM).

2. **Strategy Pattern (Open/Closed Principle)**
   Terdapat interface `MatchStrategy` dengan abstraksi fungsi `normalize(input: string)`.
   Hal ini diimplementasikan oleh dua class konkret: `CaseSensitiveStrategy` dan `CaseInsensitiveStrategy`. 
   Service tidak perlu tahu secara detail cara teks diubah—ia hanya memanggil `normalize()`. Jika di masa mendatang dibutuhkan mode pencocokan baru (misal: "Abaikan Angka"), kita cukup menambahkan kelas Strategy baru tanpa memodifikasi kode inti Service.

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

## 🐳 Menjalankan Menggunakan Docker Compose (Direkomendasikan)

Anda dapat menjalankan seluruh ekosistem aplikasi (PostgreSQL, Backend API, dan Frontend) secara instan menggunakan satu perintah:

```bash
# Clone repository
git clone https://github.com/ramdany05/Text-Match-Analyzer.git
cd Text-Match-Analyzer

# Jalankan seluruh stack
docker compose up --build -d
```

- **Frontend:** Akses di `http://localhost:5173`
- **Backend API:** Akses di `http://localhost:3000`
- **Database PostgreSQL:** Port `5432`

---

## 🛠️ Panduan Menjalankan Secara Lokal (Manual)

Pastikan Anda memiliki *Node.js (v20+)* dan *PostgreSQL* lokal / Docker.

### 1. Database Setup
Buka folder `backend`, persiapkan file environment, dan jalankan database:
```bash
cd backend
cp .env.example .env
docker compose up -d
```
*(Menjalankan PostgreSQL pada port `5433`)*

### 2. Jalankan Backend (API)
Install dependensi dan jalankan backend:
```bash
npm install
npm run dev
```
- Backend berjalan di `http://localhost:3000`.
- Saat pertama kali dijalankan, sistem otomatis memasukkan (Seed) data akun Demo.

### 3. Jalankan Frontend (UI)
Buka terminal baru, masuk ke folder `frontend`:
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```
- Frontend berjalan di `http://localhost:5173` (atau port yang dialokasikan Vite).

---

## 🔑 Kredensial Akun Demo

Aplikasi sengaja didesain **tanpa registrasi publik terbuka**. Gunakan akun demo berikut untuk masuk:

- **Username:** `tester`
- **Password:** `inipasswordnya`

---

## 🧪 Panduan Testing & Postman Collection

### 1. Eksekusi Unit & Integration Tests (Vitest)
Testing terbagi menjadi Unit Test dan Integration Test (Supertest).

Jalankan perintah ini di dalam direktori `backend/`:
```bash
# Menjalankan seluruh unit & integration test
npm run test

# Menjalankan test coverage report
npm run test:coverage
```
Semua endpoint CRUD (Create, Read, Update, Delete) hingga fungsi Otorisasi dan Pagination memiliki tingkat kelulusan **100%**.

### 2. Postman API Collection
Tersedia file koleksi Postman yang siap diimpor untuk memudahkan pengujian seluruh endpoint API backend:
- **File Lokasi:** `postman_collection.json` (di root direktori proyek).
- **Fitur Otomatis:** Menjalankan request *Login (Seed Account)* akan otomatis menyimpan JWT Token ke variabel koleksi Postman (`{{token}}`), sehingga seluruh endpoint terproteksi lainnya dapat langsung dijalankan tanpa perlu copy-paste token manual.

---

## 👨‍💻 Developer & Watermark

- **Author:** Ramdany Suhandi
- **GitHub:** [https://github.com/ramdany05/Text-Match-Analyzer](https://github.com/ramdany05/Text-Match-Analyzer)
- **LinkedIn:** [https://www.linkedin.com/in/suhandi-ramdany/](https://www.linkedin.com/in/suhandi-ramdany/)
