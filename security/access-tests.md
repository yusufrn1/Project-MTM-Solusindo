# Kontrol Akses `sec-0.2`

Tanggal: 8 November 2026. Data uji sintetis; tidak ada akun atau data pengguna nyata yang dipakai.

## Peran dan Matriks Akses

Aplikasi saat ini memiliki dua tingkat akses, bukan sistem multi-role yang disimpan di database:

- **Publik/pengunjung:** tidak memiliki sesi; dapat membaca katalog dan ulasan serta mengirim ulasan.
- **Pengelola demo:** sesi valid dibuat setelah login memakai `DEMO_EMAIL` dan `DEMO_KATA_SANDI_HASH`; dapat mengelola produk dan mengubah/menghapus ulasan.

| Aksi | Publik/pengunjung | Pengelola demo | Risiko Tugas 1 |
|---|---|---|---|
| Baca produk dan ulasan | Izinkan | Izinkan | R-01 |
| Buat ulasan | Izinkan, validasi Zod | Izinkan, validasi Zod | R-02 |
| Buat produk | Tolak | Izinkan | R-01, R-04 |
| Ubah produk | Tolak | Izinkan | R-01, R-04 |
| Hapus produk | Tolak | Izinkan melalui transaksi | R-01, R-04 |
| Ubah ulasan | Tolak | Izinkan | R-02, R-04 |
| Hapus ulasan | Tolak | Izinkan | R-02, R-04 |
| Login | Hash scrypt dibandingkan; jangan simpan kata sandi mentah | Hash scrypt dibandingkan | R-03 |

## Akun Uji dan Metode

- `pengunjung-uji`: konteks tanpa cookie sesi; bukan akun pengguna tersimpan.
- `pengelola-uji`: sesi sintetis `admin@uji.invalid` pada unit test. Untuk demonstrasi UI gunakan akun demo lokal yang dibuat sendiri, bukan kredensial pengguna nyata.
- Tes akses memanggil Server Actions dengan sesi kosong atau sesi pengelola sintetis. Tes hash menggunakan kata sandi sintetis dan tidak mencatat plaintext/hash akun nyata.

Jalankan `npm run security:test`. Suite berisi lima skenario akses yang diizinkan dan lima skenario penolakan. Penolakan memeriksa bahwa mutasi Prisma tidak dipanggil.

| Skenario | Hasil yang diharapkan | Hasil aktual | Status | Risiko |
|---|---|---|---|---|
| Publik membaca katalog dan relasi ulasan | Data aktif dan ulasan terkait terbaca | Test `akses yang diizinkan > 1` lulus | Lulus | R-01 |
| Publik mengirim ulasan valid | Ulasan tersimpan pada produk | Test `akses yang diizinkan > 2` lulus | Lulus | R-02 |
| Pengelola membuat produk | Create berhasil, redirect ke detail | Test `akses yang diizinkan > 3` lulus | Lulus | R-01 |
| Pengelola mengubah produk dan ulasan | Update hanya dengan sesi | Test `akses yang diizinkan > 4` lulus | Lulus | R-01, R-02 |
| Pengelola menghapus produk dan ulasan | Delete hanya dengan sesi; produk memakai transaksi | Test `akses yang diizinkan > 5` lulus | Lulus | R-01 |
| Publik membuat produk | Pesan login; Prisma tidak dipanggil | Test `akses yang harus ditolak > 1` lulus | Lulus | R-01 |
| Publik mengubah produk | Pesan login; Prisma tidak dipanggil | Test `akses yang harus ditolak > 2` lulus | Lulus | R-01 |
| Publik menghapus produk | Redirect ke login; transaksi tidak dipanggil | Test `akses yang harus ditolak > 3` lulus | Lulus | R-01 |
| Publik mengubah ulasan | Pesan login; Prisma tidak dipanggil | Test `akses yang harus ditolak > 4` lulus | Lulus | R-02 |
| Publik menghapus ulasan | Redirect ke login; Prisma tidak dipanggil | Test `akses yang harus ditolak > 5` lulus | Lulus | R-02 |

## Password

Password demo diverifikasi dengan scrypt (`N=32768`, `r=8`, `p=1`), salt acak 16 byte, output 64 byte, dan perbandingan `timingSafeEqual`. Konfigurasi hanya menyimpan `DEMO_KATA_SANDI_HASH`; variabel plaintext lama tidak lagi digunakan oleh action login. Tes `tests/password.test.ts` membuktikan hash valid, password salah, dan format hash rusak.

Untuk membuat hash akun demo sintetis, jalankan `npm run security:hash-demo` dan simpan hasilnya hanya pada `.env` lokal sebagai `DEMO_KATA_SANDI_HASH`. Jangan masukkan plaintext atau hash akun ke dokumentasi, screenshot, atau repository.

## Batasan Bukti

Tes akses otomatis menguji guard Server Action dengan sesi sintetis. Uji login UI dengan VM dan kredensial demo lokal, screenshot demonstrasi, serta pemeriksaan Lynis/SSH/image belum direkam dari mesin ini. Jangan tandai bukti tersebut lulus sebelum menjalankan prosedur di `security/system-hardening.md` dan `security/container-hardening.md` pada VM sendiri.
