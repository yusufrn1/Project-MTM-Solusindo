# Inventaris Aset — MTM Solusindo
Versi: sec-0.1 (draft) · Tanggal: 14 Oktober 2026

**Ruang lingkup:** prototipe katalog Next.js dengan Beranda, Katalog, dan Kontak. Formulir hanya divalidasi di browser, tidak dikirim/disimpan server. Produk ditulis statis di source. Modul HMAC terpisah dan belum melindungi katalog runtime.

| ID | Aset | Lokasi | Data | Kebutuhan keamanan | Prioritas dan alasan |
|---|---|---|---|---|---|
| A-01 | Source code aplikasi | Repo GitHub, folder proyek | Next.js/React/TypeScript, komponen | Integritas, ketersediaan | Tinggi; perubahan kode memengaruhi perilaku aplikasi. |
| A-02 | Data katalog | `app/katalog/page.tsx` | ID, nama, kategori, deskripsi, fitur produk contoh | Integritas, ketersediaan | Tinggi; katalog adalah fungsi utama. |
| A-03 | Data formulir sementara | React state di browser pada `app/kontak/page.tsx` | Nama, email, perusahaan, kategori, pesan | Kerahasiaan, integritas | Tinggi jika data nyata dimasukkan; saat ini tidak dikirim/disimpan server. |
| A-04 | Aturan validasi formulir | `validateForm()` di `app/kontak/page.tsx` | Kolom wajib, format email, panjang pesan | Integritas | Sedang; validasi hanya client-side dan dapat dilewati. |
| A-05 | UI dan navigasi | `app/`, `components/` | Halaman, tautan, komponen reusable | Integritas, ketersediaan | Sedang; kerusakan mengganggu akses. |
| A-06 | Modul HMAC | `lib/crypto/product-integrity.ts` | Payload, signature HMAC | Integritas, autentikasi | Tinggi untuk penggunaan masa depan; belum terintegrasi ke runtime. |
| A-07 | Kunci HMAC | Parameter fungsi/test, belum ada secret produksi | Secret key | Kerahasiaan | Tinggi jika digunakan; kebocoran memungkinkan pemalsuan HMAC. |
| A-08 | Dependensi/toolchain | `package.json`, lockfile, Node.js, Next.js, Vitest | Paket dan versi | Integritas, ketersediaan | Sedang; paket rentan dapat memengaruhi build/runtime. |
| A-09 | Dokumentasi dan bukti | README, `docs/evidence/`, dokumen keamanan | Screenshot, deskripsi, analisis | Integritas | Sedang; dokumentasi salah memicu keputusan keliru. |
| A-10 | Lingkungan pengembangan/build | Komputer pengembang dan proses build | Source lokal, hasil build, konfigurasi | Kerahasiaan, integritas, ketersediaan | Sedang; akses tak sah memengaruhi source/rilis. |

## Klasifikasi data
- **Publik:** data produk contoh yang memang tampil di katalog.
- **Internal:** source dan dokumentasi pengembangan.
- **Berpotensi pribadi/rahasia:** nama, email, perusahaan, pesan jika data nyata dimasukkan. Hindari data sensitif pada demo.
- **Rahasia:** kunci HMAC bila kelak digunakan; jangan simpan di repo atau browser.

## Aset yang dilindungi kriptografi
A-06 dirancang memakai HMAC-SHA-256 untuk mendeteksi perubahan payload produk jika kunci tetap rahasia. Namun, modul masih terpisah dan **katalog runtime belum dilindungi HMAC**. HMAC bukan enkripsi dan tidak memberikan kerahasiaan. Data formulir tidak dikirim/disimpan backend pada implementasi sekarang.

## Asumsi
Tidak ditemukan backend API, database, login/admin, atau penyimpanan formulir pada alur yang diperiksa. Perbarui analisis jika komponen-komponen tersebut ditambahkan.
