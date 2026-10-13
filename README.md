# MTM Solusindo — Technology Product Catalog

## 1. Deskripsi Proyek

MTM Solusindo Technology Product Catalog merupakan prototipe antarmuka
website katalog produk teknologi untuk kebutuhan bisnis.

Website ini dirancang untuk membantu calon pelanggan mengenali kategori
produk, melihat informasi produk, dan menyampaikan kebutuhan teknologi
melalui formulir konsultasi.

Proyek ini dibuat sebagai pemenuhan tugas Milestone 1 mata kuliah
Pengembangan Aplikasi Web.

## 2. Tujuan dan Target Pengguna

Tujuan:
- Menampilkan katalog produk teknologi dalam antarmuka yang responsif.
- Mempermudah pengguna menemukan kategori produk yang relevan.
- Menyediakan formulir konsultasi dengan validasi di sisi klien.
- Menerapkan komponen antarmuka yang dapat digunakan kembali.

Target pengguna:
- Perusahaan yang membutuhkan perangkat teknologi.
- Tim operasional dan pengadaan.
- Calon pelanggan yang mencari informasi produk teknologi.

## 3. Fitur Utama

- Halaman Beranda untuk memperkenalkan katalog dan kategori produk.
- Halaman Katalog untuk melihat informasi produk.
- Halaman Kontak untuk menyampaikan kebutuhan melalui formulir.
- Navigasi ant halaman.
- Komponen UI yang dapat digunakan kembali.
- Validasi formulir pada sisi klien.
- Pemilihan kategori otomatis melalui tautan dari katalog.
- Tampilan responsif untuk perangkat mobile, tablet, dan desktop.
- Elemen HTML semantik dan label formulir untuk mendukung aksesibilitas.

## 4. Teknologi

- Next.js
- React
- TypeScript
- Tailwind CSS
- ESLint

## 5. Halaman Website

### Beranda
Memperkenalkan website, kategori teknologi, dan manfaat produk.

### Katalog
Menampilkan enam contoh produk teknologi yang dikelompokkan
berdasarkan kategori.

### Kontak
Menyediakan formulir konsultasi dengan validasi nama, email,
perusahaan, kategori kebutuhan, dan deskripsi kebutuhan.

## 6. Data Produk

Data produk dalam proyek ini merupakan data contoh untuk kebutuhan
prototipe antarmuka. Nama, deskripsi, fitur, dan ID produk tidak
dimaksudkan sebagai konfirmasi SKU resmi, harga, atau ketersediaan
produk dari MTM Solusindo.

## 7. Validasi Formulir

Formulir melakukan pemeriksaan berikut:
- Nama wajib diisi.
- Email wajib diisi dan harus memiliki format yang valid.
- Nama perusahaan wajib diisi.
- Kategori kebutuhan wajib dipilih.
- Deskripsi kebutuhan wajib diisi dengan minimal 10 karakter.

Pesan kesalahan ditampilkan pada kolom yang memerlukan perbaikan.
Jika semua input valid, website menampilkan pesan keberhasilan validasi.

**Catatan:** Formulir masih berupa simulasi antarmuka. Data belum
dikirim atau disimpan ke server.

## 8. Struktur Proyek

```text
mtm-solusindo/
├── app/
│   ├── katalog/
│   │   └── page.tsx
│   ├── kontak/
│   │   └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── Button.tsx
│   ├── CategoryCard.tsx
│   ├── Footer.tsx
│   ├── Navbar.tsx
│   └── ProductCard.tsx
├── public/
├── package.json
├── README.md
└── tsconfig.json

## 9. Fondasi Kriptografi

### 9.1 Deskripsi dan Tujuan Keamanan

Proyek MTM Solusindo merupakan prototipe katalog produk teknologi.
Fondasi kriptografi dikembangkan sebagai langkah awal untuk membantu
mendeteksi perubahan data produk yang tidak sah.

Komponen yang dibuat adalah Product Integrity menggunakan HMAC-SHA-256.

### 9.2 Kebutuhan Keamanan

| Data | Tujuan Keamanan | Prioritas |
|---|---|---|
| ID dan nama produk | Mendeteksi perubahan identitas atau informasi produk | Tinggi |
| Harga produk | Mendeteksi perubahan harga yang tidak sah | Tinggi |
| Informasi kontak pelanggan jika kelak disimpan | Menjaga kerahasiaan data pelanggan | Tinggi |

### 9.3 Desain Komponen

**Algoritma:** HMAC-SHA-256  
**Library:** `node:crypto` bawaan Node.js.

#### Input
- Payload berupa string yang berisi data produk.
- Kunci rahasia untuk membuat atau memverifikasi tanda tangan.

#### Proses
1. Data produk direpresentasikan sebagai string JSON.
2. HMAC-SHA-256 dihitung menggunakan payload dan kunci rahasia.
3. Hasil HMAC dikembalikan dalam format heksadesimal.
4. Proses verifikasi menghitung ulang HMAC dan membandingkannya dengan tanda tangan yang diberikan.
5. Perbandingan menggunakan `timingSafeEqual` setelah format dan panjang tanda tangan diperiksa.

#### Output
- String heksadesimal sepanjang 64 karakter untuk tanda tangan.
- `true` jika tanda tangan valid.
- `false` jika verifikasi gagal.
- Error jika payload atau kunci kosong ketika membuat tanda tangan.

#### Representasi Data
Payload berupa string dengan encoding UTF-8. Data JSON perlu diserialisasi secara konsisten agar representasi input yang sama menghasilkan HMAC yang sama.

#### Sumber Randomness
HMAC-SHA-256 bersifat deterministik. Komponen ini tidak membutuhkan randomness dalam proses pembuatan atau verifikasi tanda tangan. Input dan kunci yang sama menghasilkan HMAC yang sama.

### 9.4 Batasan Keamanan

HMAC membantu mendeteksi perubahan data dan memverifikasi bahwa pembuat tanda tangan mengetahui kunci rahasia. HMAC tidak mengenkripsi data.

Kunci rahasia harus dikelola di sisi server dan tidak boleh diekspos ke browser atau disimpan sebagai kredensial produksi dalam repositori.

Komponen ini saat ini merupakan modul yang diuji secara terpisah. Komponen belum terintegrasi dengan proses penyimpanan atau perubahan data produk pada aplikasi.

### 9.5 Pengujian Otomatis

Pengujian menggunakan Vitest dan dapat dijalankan dengan:

```bash
npm test
