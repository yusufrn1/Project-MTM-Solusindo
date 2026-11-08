# Tugas 2 Keamanan `sec-0.2`

## Status

| Rubrik | Implementasi/bukti | Status saat ini | Risiko Tugas 1 |
|---|---|---|---|
| Matriks akses dan tes positif/negatif | [access-tests.md](access-tests.md), `tests/access-control.test.ts` | 5 akses diizinkan + 5 ditolak lulus sebagai unit tests | R-01, R-02, R-04 |
| Password slow hash | `lib/crypto/password.ts`, `tests/password.test.ts`, `npm run security:hash-demo` | scrypt salted diuji; plaintext tidak lagi dipakai oleh login action | R-03 |
| VM, SSH key-only, Lynis >=70 | [system-hardening.md](system-hardening.md) | Belum dijalankan; perlu VM Linux | R-04, R-05 |
| Container non-root, capabilities, port | [container-hardening.md](container-hardening.md), `Dockerfile`, `compose.yaml` | Konfigurasi dibuat dan YAML diperiksa; image belum dibangun | R-01, R-03, R-05 |
| Before/after image scan dan SBOM | `image-scan-before.txt`, `image-scan-after.txt`, `sbom.cdx.json` | Belum dibuat; perlu Docker, Trivy, dan Syft | R-04, R-05 |
| Demonstrasi | langkah pada dokumen hardening di atas | Perlu direkam dari VM/container berjalan | R-01, R-04, R-05 |

## File Bukti yang Masih Harus Dihasilkan

Jangan membuat file kosong atau mengisi hasil perkiraan. Setelah pengujian VM/image selesai, simpan output aktual berikut di folder ini:

- `lynis-before.txt`
- `lynis-after.txt`
- `image-scan-before.txt`
- `image-scan-after.txt`
- `sbom.cdx.json`

Host workspace saat ini tidak memiliki hypervisor, Docker/Podman, `sshd`, Lynis, Trivy, atau Syft. Oleh sebab itu skor Lynis, konfigurasi SSH efektif, hasil scan CRITICAL, dan SBOM belum dapat diklaim lulus.
