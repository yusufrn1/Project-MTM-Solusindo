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
npm run security:hash-demo
# Atur PRODUCT_INTEGRITY_KEY sesuai bagian 9.3 sebelum melanjutkan.
npm run db:generate
npm run db:migrate
npm run security:sign-products -- --trust-current-data
npm run db:seed
npm run dev
```

Isi `DATABASE_URL` dan `DEMO_EMAIL` pada `.env` lokal. Jalankan
`npm run security:hash-demo`, lalu simpan hasil hash sebagai
`DEMO_KATA_SANDI_HASH`; jangan simpan password plaintext. Jangan commit `.env`
atau kredensial database. Prisma 7 membaca koneksi dari `prisma.config.ts`;
`npm run db:seed` menjalankan seeding secara eksplisit. Buat dan simpan
`PRODUCT_INTEGRITY_KEY` sebelum migrasi, backfill, seed, dan menjalankan aplikasi.
Backfill hanya diperlukan bila database sudah berisi produk yang telah ditinjau.

```bash
npm test
npm run db:test
npm run security:test
```

`npm test` menjalankan tes unit dan melewati tes PostgreSQL. `npm run db:test`
menjalankan 11 skenario integrasi dengan data sintetis serta membersihkan data
uji setelah selesai. Skenario, hasil aktual, dan bukti UI/validasi ada di
[`docs/pengujian-milestone-2.md`](docs/pengujian-milestone-2.md).
Kontrol akses, hashing password, serta status hardening Tugas 2 Keamanan ada di
[`security/README.md`](security/README.md).

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

Proyek MTM Solusindo merupakan prototipe katalog produk teknologi. Data produk
diberi tag HMAC saat dibuat atau diubah, lalu tag diverifikasi sebelum produk
dikeluarkan dari lapisan data.

Komponen yang dibuat adalah Product Integrity menggunakan HMAC-SHA-256. Rincian
keputusan dan parameter ada di [`KEPUTUSAN.md`](KEPUTUSAN.md).

### 9.2 Kebutuhan Keamanan

| Data | Tujuan Keamanan | Prioritas |
|---|---|---|
| Nama, kategori, deskripsi, fitur, status, dan gambar produk | Mendeteksi perubahan pada field katalog yang ditandatangani | Tinggi |
| ID dan timestamp database | Tidak termasuk payload HMAC saat ini | Sedang |
| Informasi kontak pelanggan jika kelak disimpan | Memerlukan kontrol kerahasiaan terpisah; HMAC tidak mengenkripsi | Tinggi |

### 9.3 Desain Komponen

**Mekanisme:** HMAC-SHA-256 dari modul bawaan `node:crypto`. Kunci berupa
Base64 kanonis yang mendekode tepat menjadi 32 byte. Gunakan
`generateProductIntegrityKey()` atau Node.js `randomBytes(32)` untuk membuat
kunci dengan CSPRNG.

Buat kunci sekali, lalu simpan sebagai `PRODUCT_INTEGRITY_KEY` di `.env` lokal
atau secret manager deployment. `.env*` diabaikan Git; jangan menaruh nilai
kunci pada `.env.example`, log, browser, atau payload request. Contoh pembuatan
kunci tanpa menambahkannya ke repository; atur nilai hasilnya di environment
server:

```bash
node -e "process.stdout.write(require('node:crypto').randomBytes(32).toString('base64') + '\\n')"
```

| Parameter | Nilai |
|---|---|
| Panjang kunci | 32 byte (256 bit), Base64 kanonis |
| Nonce/IV | Tidak berlaku; HMAC deterministik dan tidak memakai nonce |
| AAD | Tidak berlaku; seluruh data yang perlu diautentikasi harus dimasukkan ke payload UTF-8 |
| Tag | HMAC-SHA-256 penuh, 32 byte atau 64 karakter heksadesimal |
| Perbandingan | `timingSafeEqual` setelah validasi format dan panjang |

Payload harus diserialisasi konsisten, misalnya JSON dengan urutan field tetap.
Fungsi pembuat menolak payload kosong dan kunci dengan encoding/panjang salah.
Fungsi verifikasi gagal tertutup dengan `false` untuk payload, tag, atau kunci
yang tidak valid, termasuk ketika data atau tag dimodifikasi atau kunci berbeda.
Tag disimpan pada kolom `Product.integrityTag`. Payload kanonis memuat nama,
kategori, deskripsi, fitur, status aktif, path gambar, dan teks alternatif.
Aksi create/update menandatangani nilai sebelum simpan; lapisan baca memverifikasi
tag dan melempar error, tanpa mengembalikan produk, jika tag tidak ada atau gagal.

Untuk database yang sudah berisi produk, tinjau dulu datanya, jalankan migrasi,
lalu buat tag dengan perintah backfill yang eksplisit di atas. Perintah ini
menandatangani nilai database saat ini; jangan gunakan untuk mengesahkan perubahan
yang belum dipercaya. Baris lama tanpa tag tidak ditampilkan sampai proses ini
berhasil.

### 9.4 Batasan Keamanan

HMAC memberikan integritas dan autentikasi, bukan kerahasiaan: payload tetap
terbaca. Informasi katalog yang perlu dirahasiakan memerlukan enkripsi AEAD
terpisah. Kunci yang hilang atau berubah juga membuat tag lama tidak dapat
diverifikasi.

HMAC tidak mengenkripsi record database. Kunci yang hilang atau berubah membuat
verifikasi gagal; rotasi kunci memerlukan penandatanganan ulang semua produk
setelah datanya dipercaya. Integritas tag juga tidak melindungi dari kompromi
server aplikasi yang memiliki akses ke kunci.

### 9.5 Pengujian Otomatis

Tes kriptografi mencakup pembuatan dan pemuatan kunci, serialisasi payload,
format dan determinisme tag, verifikasi data asli, serta penolakan data/tag yang
diubah, format salah, payload kosong, kunci salah, dan kunci tidak valid. Tes
aksi memastikan tag disimpan bersama perubahan produk. Jalankan dengan:

```bash
npx vitest run tests/crypto/product-integrity.test.ts tests/ubah-produk-action.test.ts
```
