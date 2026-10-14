# Risk Register — MTM Solusindo
Versi: sec-0.1 (draft). Risiko inheren = likelihood × impact, skala 1–5. 1–4 rendah, 5–9 sedang, 10–14 tinggi, 15–25 kritis.

| ID | Threat | Risiko/aset | Likelihood dan alasan | Impact dan alasan | L | I | Skor | Prioritas | Kontrol yang direncanakan | Pemetaan |
|---|---|---|---|---|---:|---:|---:|---|---|---|
| R-01 | T-07 | Data katalog diubah tanpa izin; A-01/A-02 | **3:** data produk ada di source; perubahan source yang tidak ditinjau dapat mengubah katalog dan belum ada verifikasi HMAC runtime. | **4:** konten palsu dapat menyesatkan calon pelanggan dan merusak kepercayaan; data saat ini masih contoh. | 3 | 4 | 12 | Tinggi | Proteksi branch/review, tes perubahan data; jika HMAC diintegrasikan, verifikasi di server dan simpan kunci aman. | T2 integritas/tes; T3 kontrol repo |
| R-02 | T-02 | Validasi form dilewati; A-03/A-04 | **4:** pengguna mengontrol browser, sehingga validasi client-side mudah dilewati. | **3:** saat ini dampak langsung terbatas karena tidak ada endpoint; jika backend ditambahkan, input buruk dapat mencemari proses bisnis. | 4 | 3 | 12 | Tinggi | Validasi server-side, batas panjang, encoding output, dan tes negatif bila backend ditambahkan. | T2 validasi aman |
| R-03 | T-09 | Secret HMAC bocor; A-06/A-07 | **2:** belum ada kunci produksi; risiko naik saat integrasi jika secret disimpan di source/log/browser. | **5:** pemegang kunci dapat membuat HMAC valid untuk payload yang diubah, sehingga pemeriksaan integritas tidak dipercaya. | 2 | 5 | 10 | Tinggi | Simpan secret hanya di environment server/secret manager, batasi akses, rotasi bila bocor, cek agar tidak masuk bundle/log. | T2 pengelolaan kunci |
| R-04 | T-06 | Akun repo diambil alih dan source/rilis diubah; A-01/A-10 | **2:** perubahan memerlukan hak tulis atau kompromi akun; repo publik sendiri hanya memberi akses baca. | **4:** perubahan berbahaya dapat merusak konten/build atau memasukkan kode berbahaya. | 2 | 4 | 8 | Sedang | MFA, jaga token, batasi collaborator, review diff, proteksi branch bila tersedia. | T3 pengamanan repo |
| R-05 | T-05 | Halaman tidak tersedia akibat request berlebihan pada deployment publik; A-05/A-08/A-10 | **2:** bergantung deployment dan kapasitas hosting; belum ada backend/API form. | **3:** pengguna tidak dapat melihat katalog/kontak; tidak ada transaksi atau data tersimpan yang hilang pada prototipe. | 2 | 3 | 6 | Sedang | Hosting dengan proteksi trafik/cache, monitoring, dan prosedur rollback/pemulihan. | T3 deployment/monitoring |

## Risiko lain yang dipantau
- **T-01:** identitas pengisi tidak terverifikasi; relevan jika form menjadi alur bisnis.
- **T-03:** tidak ada bukti pengajuan server karena form hanya simulasi.
- **T-04:** data input dapat terlihat di perangkat bersama.
- **T-08:** atribusi perubahan source memerlukan akun individual dan review.
- **T-10:** payload HMAC perlu canonicalization konsisten.
- **T-11:** pengguna dapat mengakses situs/domain tiruan.
- **T-12:** input sangat panjang; dampak sekarang terutama pada browser.

## Asumsi dan tindak lanjut
Skor adalah penilaian awal sebelum kontrol baru diterapkan, bukan statistik insiden. Penilaian perlu diperbarui jika aplikasi menambahkan backend, database, login/admin, penyimpanan data pelanggan, atau integrasi HMAC runtime. Kontrol di atas adalah rencana, bukan klaim sudah diterapkan.
