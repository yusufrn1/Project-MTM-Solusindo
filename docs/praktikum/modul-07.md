# Dokumen Teknis Modul 7 — Debugging dan Security Hardening

**Nama/NIM:** Yusuf Rizky Nugroho / 105224012  
**Repositori:** https://github.com/yusufrn1/Project-MTM-Solusindo  
**Branch kerja:** `week-7`  
**Tanggal pengerjaan:** 26 November 2026

> Status pengerjaan: implementasi Product Integrity HMAC-SHA-256 telah dilakukan. Seluruh 65 tes otomatis lulus, pemeriksaan TypeScript berhasil, dan status migrasi Prisma menunjukkan database up to date. Dokumentasi debugging dan code review dilengkapi berdasarkan bukti aktual.

## 1. Environment Pengembangan

| Komponen | Versi/Konfigurasi |
|---|---|
| Sistem operasi | Lubuntu / Linux x64 |
| Node.js | v24.22.3 |
| npm | 11.19.1 |
| Visual Studio Code | 1.139.1 |
| Next.js | 16.4.0 |
| Prisma | 7.10.1 |
| PostgreSQL | 18.6 |
| Vitest | 3.2.7 |

Pemeriksaan environment dilakukan menggunakan:

```bash
node -v
npm -v
code --version
```

## 2. Konfigurasi Debugger

Konfigurasi debugger disimpan pada `.vscode/launch.json`.

Terdapat tiga konfigurasi:

| Konfigurasi | Tipe | Fungsi |
|---|---|---|
| Next.js: Debug Server | node-terminal | Menjalankan dan melakukan debugging proses Next.js |
| Next.js: Debug Client | pwa-chrome | Melakukan debugging aplikasi melalui Chrome |
| Next.js: Debug Full Stack | node-terminal | Menjalankan server dan membuka Chrome melalui serverReadyAction |

Konfigurasi yang digunakan:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: Debug Server",
      "type": "node-terminal",
      "request": "launch",
      "command": "npm run dev"
    },
    {
      "name": "Next.js: Debug Client",
      "type": "pwa-chrome",
      "request": "launch",
      "url": "http://localhost:3000"
    },
    {
      "name": "Next.js: Debug Full Stack",
      "type": "node-terminal",
      "request": "launch",
      "command": "npm run dev",
      "serverReadyAction": {
        "pattern": "- Local: (https?://\\S+)",
        "uriFormat": "%s",
        "action": "debugWithChrome"
      }
    }
  ]
}
```

**Bukti:** tangkapan layar konfigurasi debugger dan proses debugging akan dilengkapi setelah pengambilan screenshot.

## 3. Implementasi Product Integrity

### 3.1 Tujuan

Product Integrity diterapkan untuk memastikan data produk tidak berubah tanpa terdeteksi.

Mekanisme yang digunakan adalah HMAC-SHA-256 dari modul bawaan Node.js `node:crypto`.

### 3.2 Konfigurasi Kunci

Kunci disimpan pada environment server melalui variabel:

`PRODUCT_INTEGRITY_KEY`

Ketentuan:
- Panjang kunci 32 byte atau 256 bit.
- Encoding menggunakan Base64 kanonis.
- Kunci dibuat menggunakan CSPRNG.
- Kunci tidak disimpan di repository.
- Kunci tidak ditampilkan pada browser, payload request, atau log.

Pembuatan kunci dilakukan menggunakan:

```bash
node -e "console.log(require('node:crypto').randomBytes(32).toString('base64'))"
```

Nilai kunci disimpan secara lokal pada `.env`.

### 3.3 Payload dan Tag

Payload kanonis mencakup:

| Field | Keterangan |
|---|---|
| name | Nama produk |
| category | Kategori produk |
| description | Deskripsi |
| features | Daftar fitur |
| active | Status aktif |
| image | Path gambar |
| imageAlt | Teks alternatif gambar |

Tag menggunakan HMAC-SHA-256 penuh dengan panjang 32 byte atau 64 karakter hexadecimal.

Verifikasi menggunakan `timingSafeEqual` setelah validasi format dan panjang tag.

### 3.4 Integrasi dengan CRUD

Implementasi berada pada:

- `lib/crypto/product-integrity.ts`
- `lib/data.ts`
- `app/katalog/actions.ts`
- `prisma/schema.prisma`

Alur implementasi:

1. Data produk disusun dalam payload dengan urutan field konsisten.
2. Server membuat HMAC menggunakan kunci rahasia.
3. Tag disimpan bersama data produk.
4. Ketika produk dibaca, sistem menghitung dan memverifikasi kembali tag.
5. Jika tag tidak tersedia atau tidak valid, sistem menolak mengembalikan data produk.

Kolom penyimpanan:

```prisma
integrityTag String?
```

Kolom masih nullable untuk mengakomodasi struktur database, tetapi lapisan baca mewajibkan tag valid sebelum produk dikembalikan.

### 3.5 Penanganan Data Lama

Produk yang sudah ada di database diperiksa melalui Prisma Studio.

Hasil pemeriksaan:
- Seluruh produk yang diperiksa memiliki `integrityTag`.
- Tidak ditemukan produk dengan tag kosong.
- Tidak dilakukan backfill tambahan karena seluruh produk sudah memiliki tag.

Nilai kunci rahasia tidak dicantumkan dalam dokumentasi.

## 4. Pengujian Otomatis

### 4.1 Pengujian Kriptografi

File pengujian:

`tests/crypto/product-integrity.test.ts`

Pengujian mencakup enam tes, yaitu:

- Pembuatan dan validasi kunci.
- Serialisasi payload.
- Pembuatan tag.
- Verifikasi data asli.
- Penolakan data atau tag yang dimodifikasi.
- Penolakan kunci atau format yang tidak valid.

Hasil:

**6/6 tes lulus.**

### 4.2 Pengujian Server Action

File:

`tests/ubah-produk-action.test.ts`

Pengujian memastikan Server Action `ubahProduk` menangani kondisi produk yang tidak ditemukan (`P2025`) dengan pesan yang sesuai.

Environment test menyediakan kunci HMAC tersendiri melalui `vi.stubEnv`.

Hasil:

**1/1 tes lulus.**

### 4.3 Pengujian Keseluruhan

Perintah:

```bash
RUN_DB_TESTS=1 npm test
```

Hasil aktual:

| File pengujian | Jumlah tes |
|---|---:|
| access-control.test.ts | 11 |
| password.test.ts | 5 |
| prisma-crud.integration.test.ts | 11 |
| skema.test.ts | 4 |
| product-integrity.test.ts | 6 |
| ubah-ulasan-action.test.ts | 4 |
| session-store.test.ts | 5 |
| produk-validation.test.ts | 18 |
| ubah-produk-action.test.ts | 1 |
| **Total** | **65** |

**Hasil akhir:**
- Test Files: 9 passed (9).
- Tests: 65 passed (65).
- Durasi: 2,70 detik.

### 4.4 Pemeriksaan TypeScript

Perintah:

```bash
npx tsc --noEmit
```

Hasil aktual: tidak menghasilkan pesan error.

### 4.5 Pemeriksaan Migrasi Prisma

Perintah:

```bash
npx prisma migrate status
```

Hasil aktual:

```text
2 migrations found in prisma/migrations

Database schema is up to date!
```

## 5. Konfigurasi Logging

File konfigurasi:

`lib/prisma.ts`

Konfigurasi:

```ts
log: ["warn", "error"],
```

Logging hanya mengaktifkan peringatan dan error. Logging query tidak diaktifkan agar query database tidak tercatat melalui logger Prisma.

## 6. Keputusan Teknis

Bagian ini mendokumentasikan alasan pemilihan pendekatan teknis selama pengembangan.

| Topik | Keputusan teknis | Alasan |
|---|---|---|
| Validasi boolean | Menggunakan `z.stringbool` | Mengonversi input string formulir menjadi boolean secara konsisten |
| Penghapusan produk | Menggunakan transaksi database | Menjaga konsistensi penghapusan produk dan ulasan |
| Penghapusan ulasan | Menggunakan Server Action dengan pemeriksaan sesi dan ID produk | Membatasi operasi sesuai hak akses |
| Derived state | Mengutamakan nilai turunan daripada state duplikat | Menghindari inkonsistensi state |
| Penanganan error | Menggunakan Server Action untuk error operasi yang dapat ditangani; error boundary untuk error render yang tidak tertangani | Memisahkan validasi dan kegagalan operasi dari error rendering |

**Catatan:** keputusan teknis di atas perlu dicocokkan kembali dengan implementasi aktual dan dilengkapi bukti kode yang relevan.

## 7. Debugging dan Error Trace

Bagian ini digunakan untuk mencatat minimal tiga kasus error yang dianalisis menggunakan debugger.

| No. | Kasus | Penyebab | Penyelesaian | Bukti |
|---|---|---|---|---|
| 1 | Belum dilengkapi | Menunggu hasil debugging | Menunggu | Screenshot dan trace |
| 2 | Belum dilengkapi | Menunggu hasil debugging | Menunggu | Screenshot dan trace |
| 3 | Belum dilengkapi | Menunggu hasil debugging | Menunggu | Screenshot dan trace |

Bukti debugging yang diperlukan:
- Breakpoint pada Server Component.
- Debugger dalam kondisi paused.
- Variabel dan call stack yang relevan.
- Error trace dari tiga kasus yang diuji.

## 8. Code Review

Bagian ini mencatat proses code review melalui Pull Request.

| Kriteria | Bukti |
|---|---|
| Link Pull Request | Belum dilengkapi |
| Minimal tiga komentar review | Belum dilengkapi |
| Saran perbaikan kode | Belum dilengkapi |
| Komentar kategori Nit | Belum dilengkapi |
| Approval atau Request Changes | Belum dilengkapi |
| Respons terhadap komentar | Belum dilengkapi |

Bukti yang akan dilampirkan:
- Tampilan Pull Request.
- Komentar review.
- Respons terhadap komentar.
- Status approval atau Request Changes.

## 9. Kendala dan Penyelesaian

Kendala yang ditemukan selama pengerjaan:

1. **Environment pengujian HMAC**

   Pengujian `ubahProduk` sebelumnya gagal karena `PRODUCT_INTEGRITY_KEY` belum tersedia pada environment test. Penyelesaian dilakukan dengan menyediakan kunci pengujian melalui `vi.stubEnv`.

2. **Sinkronisasi migrasi Prisma**

   Database memiliki catatan migrasi `20261108150000_add_product_integrity_tag`, tetapi direktori migrasi belum tersedia pada branch kerja. File migrasi dipulihkan dari proyek sumber dan checksum diverifikasi sebelum digunakan.

   Setelah pemulihan, `npx prisma migrate status` menunjukkan database up to date.

3. **Pemeriksaan TypeScript**

   Terdapat ketidaksesuaian tipe `LayoutProps` pada root layout. Penyelesaian menggunakan tipe `ReactNode` untuk properti `children`.

4. **Pemeriksaan data lama**

   Seluruh produk diperiksa untuk memastikan `integrityTag` tersedia. Tidak ditemukan produk tanpa tag sehingga tidak diperlukan backfill tambahan.

## 10. Catatan Pemanfaatan AI

ChatGPT digunakan sebagai asisten untuk:
- Membantu menganalisis kegagalan pengujian.
- Meninjau implementasi HMAC dan validasi kunci.
- Membantu mengidentifikasi penyebab kegagalan test.
- Memberikan arahan pemeriksaan migrasi Prisma.
- Membantu menyusun dokumentasi teknis.

Seluruh perubahan kode dan hasil pengujian tetap diperiksa serta dijalankan pada workspace lokal.

Perintah verifikasi yang telah dijalankan:

```bash
npx vitest run tests/ubah-produk-action.test.ts
RUN_DB_TESTS=1 npm test
npx tsc --noEmit
npx prisma migrate status
```

Hasil akhir pengujian otomatis: 65/65 tes lulus.

## 11. Ringkasan Bukti

| No. | Bukti | Status |
|---|---|---|
| 1 | Konfigurasi `.vscode/launch.json` | [x] Tersedia |
| 2 | Versi environment pengembangan | [x] Tersedia |
| 3 | Pengujian HMAC | [x] Lulus |
| 4 | Pengujian keseluruhan 65 tes | [x] Lulus |
| 5 | Pemeriksaan TypeScript | [x] Lulus |
| 6 | Status migrasi Prisma | [x] Up to date |
| 7 | Produk memiliki integrityTag | [x] Diperiksa |
| 8 | Debugger paused di Server Component | [ ] Belum |
| 9 | Tiga error trace | [ ] Belum |
| 10 | Bukti code review Pull Request | [ ] Belum |
| 11 | Bukti respons komentar review | [ ] Belum |

Dokumen ini akan diperbarui setelah seluruh bukti debugging dan code review tersedia.
