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
