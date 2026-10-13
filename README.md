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
│   └── ProductCard.tsxx
├── public/
├── package.json
├── README.md
└── tsconfig.json
