# AI Usage Log

## Penggunaan AI

AI digunakan sebagai alat bantu dalam pengerjaan tugas fondasi kriptografi untuk:
- Memahami perbedaan SHA-256, HMAC-SHA-256, AES, dan Argon2id.
- Membantu merancang komponen pemeriksaan integritas data produk.
- Membantu menyusun implementasi awal HMAC-SHA-256 menggunakan Node.js.
- Membantu menyusun skenario pengujian otomatis menggunakan Vitest.
- Membantu menyusun dokumentasi teknis.

## Keputusan Implementasi

- Algoritma: HMAC-SHA-256.
- Library: modul `node:crypto` bawaan Node.js.
- Tujuan: mendeteksi perubahan data dan memverifikasi autentikasi menggunakan kunci rahasia.
- Pengujian: Vitest.
- Jumlah skenario pengujian: 6.

## Verifikasi

Pengujian otomatis dijalankan menggunakan perintah `npm test`.
Pada pengujian terakhir, seluruh 6 skenario berhasil.

Implementasi dan hasil pengujian tetap perlu dipahami serta diperiksa oleh pengembang sebelum digunakan.

## Keamanan

Kunci dalam pengujian menggunakan data sintetis.
Tidak ada kunci produksi, token, password, atau kredensial pribadi yang dicantumkan dalam dokumentasi.

# Addendum AI Usage Log — Tugas 1 Keamanan Siber

- **Alat:** ChatGPT (OpenAI).
- **Tujuan:** membantu menyusun draf inventaris aset, DFD, ancaman STRIDE, register risiko, dan kontrol berdasarkan implementasi repo.
- **Ringkasan prompt:** pengguna memberikan instruksi tugas/rubrik serta meminta analisis ancaman dan risiko spesifik pada produk MTM Solusindo.
- **Bagian yang dibantu AI:** struktur awal Markdown untuk `asset-inventory.md`, `dfd.md`, `threat-model.md`, `risk-register.md`; konsistensi ID aset/DFD/threat/risiko; usulan skor dan kontrol.
- **Verifikasi/edit oleh pengembang:** periksa diagram terhadap source terbaru; pastikan skor dan alasan sesuai pemahaman sendiri; verifikasi kontrol yang akan dipetakan ke Tugas 2/Tugas 3; render diagram Mermaid dan cocokkan dengan instruksi dosen.
- **Verifikasi sumber:** meninjau repository dan `app/katalog/page.tsx`, `app/kontak/page.tsx`, `lib/crypto/product-integrity.ts`, serta README untuk membedakan fitur runtime dari modul HMAC terpisah.
- **Batasan:** ini analisis awal prototipe, bukan audit keamanan atau penetration test. Kontrol yang direncanakan belum diklaim sudah diterapkan.
- **Keamanan:** jangan masukkan password, token, kunci produksi, atau data pribadi ke repo. Data formulir dalam dokumen adalah jenis data yang mungkin diinput, bukan data pribadi aktual.
