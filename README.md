# MTM Solusindo — Technology Product Catalog

## Milestone 2 (v0.2)

MTM Solusindo melanjutkan prototipe v0.1 menjadi katalog produk persisten.
Produk dan ulasan kini disimpan di PostgreSQL melalui Prisma ORM 7. Server
Actions menangani create, read, update, dan delete untuk kedua entitas,
sementara Zod memvalidasi data di server dan menampilkan galat pada field.

Relasi data adalah satu produk ke banyak ulasan. Pengelola dapat menambah,
mengubah, dan menghapus produk serta mengubah atau menghapus ulasan; pengunjung
dapat membaca katalog dan mengirim ulasan. Data seed bersifat sintetis.

### Menjalankan Aplikasi

Prasyarat: Node.js, npm, dan PostgreSQL yang dapat diakses melalui
`DATABASE_URL`.

```bash
cp .env.example .env
npm install
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

Isi `DATABASE_URL`, `DEMO_EMAIL`, dan `DEMO_KATA_SANDI` di `.env` lokal. Jangan
commit `.env` atau kredensial database. Prisma 7 membaca koneksi dari
`prisma.config.ts`; `npm run db:seed` menjalankan seeding secara eksplisit.

```bash
npm test
npm run db:test
```

`npm test` menjalankan tes unit dan melewati tes PostgreSQL. `npm run db:test`
menjalankan 11 skenario integrasi dengan data sintetis serta membersihkan data
uji setelah selesai. Skenario, hasil aktual, dan bukti UI/validasi ada di
[`docs/pengujian-milestone-2.md`](docs/pengujian-milestone-2.md).

### Perkembangan v0.1 ke v0.2

- v0.1: katalog antarmuka responsif dengan data contoh dan validasi formulir
	kontak di sisi klien.
- v0.2: Next.js App Router, Server Actions, validasi Zod server-side,
	PostgreSQL/Prisma ORM 7, migration, seed sintetis, relasi Produk–Ulasan,
	CRUD kedua entitas, serta tes unit dan integrasi.

## 1. Deskripsi Proyek

MTM Solusindo Technology Product Catalog merupakan website katalog produk
teknologi untuk kebutuhan bisnis, dilanjutkan dari produk Milestone 1 v0.1.

Website membantu calon pelanggan mengenali kategori dan detail produk,
membaca serta mengirim ulasan, dan menyampaikan kebutuhan konsultasi.
Informasi produk dan ulasan disimpan secara persisten di PostgreSQL.

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
- Pengelolaan produk dan ulasan melalui Server Actions dengan validasi Zod.
- Penyimpanan data produk dan ulasan secara persisten di PostgreSQL.
- Navigasi ant halaman.
- Komponen UI yang dapat digunakan kembali.
- Validasi formulir pada sisi klien.
- Pemilihan kategori otomatis melalui tautan dari katalog.
- Tampilan responsif untuk perangkat mobile, tablet, dan desktop.
- Elemen HTML semantik dan label formulir untuk mendukung aksesibilitas.

## 4. Teknologi

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- PostgreSQL
- Prisma ORM 7
- Zod
- Vitest
- ESLint

## 5. Halaman Website

### Beranda
Memperkenalkan website, kategori teknologi, dan manfaat produk.

### Katalog
Membaca produk aktif dari PostgreSQL dan menyediakan halaman detail produk
beserta ulasan yang terkait.

### Kontak
Menyediakan formulir konsultasi dengan validasi nama, email,
perusahaan, kategori kebutuhan, dan deskripsi kebutuhan.

## 6. Data Produk
Produk awal disiapkan sebagai data sintetis melalui `prisma/seed.ts`. Seluruh
nama, deskripsi, dan fitur ditujukan untuk demonstrasi, bukan konfirmasi SKU,
harga, atau ketersediaan resmi MTM Solusindo.

## 7. Validasi Formulir

Formulir melakukan pemeriksaan berikut:
- Nama wajib diisi.
- Email wajib diisi dan harus memiliki format yang valid.
- Nama perusahaan wajib diisi.
- Kategori kebutuhan wajib dipilih.
- Deskripsi kebutuhan wajib diisi dengan minimal 10 karakter.

Pesan validasi kontak tampil pada kolom terkait. Formulir kontak masih berupa
simulasi sisi klien dan belum disimpan. Formulir produk dan ulasan menggunakan
validasi Zod di Server Actions; skenario dan bukti penolakannya tersedia pada
[`docs/pengujian-milestone-2.md`](docs/pengujian-milestone-2.md).

## 8. Struktur Proyek
Komponen utama Milestone 2:

- `app/katalog/`: halaman produk, formulir, dan Server Actions.
- `components/`: komponen UI produk dan ulasan.
- `lib/skema.ts`: skema validasi Zod.
- `prisma/`: skema, migrasi, serta data seed sintetis.
- `tests/`: tes unit dan integrasi PostgreSQL.
- `docs/pengujian-milestone-2.md`: skenario uji dan tautan bukti.

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
