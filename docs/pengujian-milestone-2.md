# Pengujian Milestone 2

Tanggal pengujian: 8 November 2026. Data uji bersifat sintetis. UI CRUD dijalankan pada aplikasi lokal; relasi dan transaksi diverifikasi melalui `npm run db:test` terhadap PostgreSQL lokal. Seluruh 11 tes integrasi lulus.

## Skenario CRUD

| No. | Tujuan | Langkah pengujian | Hasil yang diharapkan | Hasil aktual | Status |
|---|---|---|---|---|---|
| 1 | Membuat produk | Masuk sebagai pengelola, buka **Kelola katalog**, isi nama, kategori, deskripsi, dan fitur sintetis, lalu simpan. | Produk baru tersimpan dan halaman detail produk terbuka. | Produk uji antarmuka dibuat; detail memuat nama dan data yang dikirim. | Lulus |
| 2 | Membaca produk | Muat ulang katalog, lalu buka detail produk yang baru dibuat. | Produk tampil di katalog dan detailnya sesuai dengan database. | Produk terlihat di daftar dan halaman detail setelah navigasi ulang. | Lulus |
| 3 | Memperbarui produk | Dari detail, pilih **Ubah produk**, ubah deskripsi, simpan, lalu muat ulang detail. | Nilai baru tersimpan dan tetap tampil setelah dimuat ulang. | Deskripsi baru tampil setelah aksi dan pembacaan ulang detail. | Lulus |
| 4 | Menghapus produk | Dari detail produk uji, pilih **Hapus produk**, lalu periksa katalog. | Produk tidak ada lagi di katalog maupun database. | Aksi kembali ke katalog dan produk uji tidak terlihat; skenario transaksi penghapusan juga lulus pada tes integrasi. | Lulus |
| 5 | Membuat ulasan | Pada detail produk, kirim ulasan dengan nama, rating, dan komentar sintetis yang valid. | Ulasan tersimpan dengan foreign key ke produk yang sedang dibuka. | Ulasan sintetis tampil pada detail produk setelah Server Action berhasil. | Lulus |
| 6 | Membaca ulasan | Muat ulang detail produk yang memiliki ulasan. | Ulasan tampil di bawah produk yang sesuai. | Relasi `Product.reviews` terbaca; ulasan tampil setelah detail dibuka ulang. | Lulus |
| 7 | Memperbarui ulasan | Masuk sebagai pengelola, ubah rating atau komentar pada formulir ulasan, lalu simpan. | Perubahan ulasan tersimpan dan tampil pada detail. | Komentar uji berubah dan hasil baru tampil setelah aksi Server Action. | Lulus |
| 8 | Menghapus ulasan | Pada detail produk, pilih **Hapus ulasan** untuk ulasan uji. | Ulasan terhapus tanpa menghapus produknya. | Ulasan hilang dari halaman; produk tetap terdaftar. | Lulus |

## Skenario Relasi

| No. | Tujuan | Langkah pengujian | Hasil yang diharapkan | Hasil aktual | Status |
|---|---|---|---|---|---|
| 9 | Menolak foreign key yang tidak valid | Jalankan skenario integrasi yang membuat ulasan dengan `productId` yang tidak ada. | Database menolak ulasan dan Prisma mengembalikan P2003. | Tes integrasi 8 lulus; tidak ada ulasan yatim. | Lulus |
| 10 | Menjaga konsistensi saat produk dihapus | Buat produk dengan ulasan, coba hapus langsung, lalu uji transaksi aplikasi yang menghapus ulasan dan produk bersama-sama. | Hapus langsung ditolak oleh `RESTRICT`; transaksi aplikasi menghapus keduanya secara atomik. | Tes integrasi 9 menegaskan P2003, tes 10 menegaskan rollback, dan tes 11 menegaskan produk serta ulasan terhapus bersama. | Lulus |

## Validasi Server

Kasus berikut dikirim ke Server Action setelah batas validasi browser dilewati. Pesan tampil pada field yang bersangkutan dan data tidak disimpan:

| Masukan sintetis | Hasil aktual | Bukti |
|---|---|---|
| Nama produk `AB` | Ditolak: “Nama produk minimal 3 karakter.” | [Validasi nama produk](evidence/milestone-2-validasi-nama-produk.png) |
| Kategori produk `Palsu` | Ditolak: “Pilih kategori produk yang tersedia.” | [Validasi kategori](evidence/milestone-2-validasi-kategori.png) |
| Rating ulasan `6` | Ditolak: “Nilai maksimal 5.”; nilai yang ditolak tetap tampil untuk diperbaiki. | [Validasi rating ulasan](evidence/milestone-2-validasi-ulasan-rating.png) |

## Bukti Persistensi

- [CRUD Produk dan Ulasan melalui antarmuka](evidence/milestone-2-ui-crud-relasi.png) memperlihatkan data sintetis setelah perubahan tersimpan.
- [Data ulasan pada Prisma Studio](evidence/modul-06-prisma-studio.png) memperlihatkan data relasi yang tersimpan di PostgreSQL.
- Perintah `npm run db:test` menyelesaikan seluruh 11 skenario integrasi dengan status lulus. Tes membuat data acak sintetis dan membersihkannya setelah selesai.
