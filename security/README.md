# Tugas 2 Keamanan `sec-0.2`

## Status

| Rubrik | Implementasi/bukti | Status saat ini | Risiko Tugas 1 |
|---|---|---|---|
| Matriks akses dan tes positif/negatif | [access-tests.md](access-tests.md), `tests/access-control.test.ts` | 5 akses diizinkan + 5 ditolak lulus sebagai unit tests | R-01, R-02, R-04 |
| Password slow hash | `lib/crypto/password.ts`, `tests/password.test.ts`, `npm run security:hash-demo` | scrypt salted diuji; plaintext tidak lagi dipakai oleh login action | R-03 |
| VM, SSH key-only, Lynis >=70 | `lynis-before.txt`, `lynis-after.txt`, `ssh-effective.txt`, `ssh-password-denied.txt` | Lynis 56 -> 70; password auth `no`, root login `no`; tes key positif dan password-only ditolak | R-04, R-05 |
| Container non-root, capabilities, port | `container-checks.txt`, `Dockerfile`, `compose.yaml` | App UID 10001, DB user postgres, `cap_drop=ALL`, app read-only, no-new-privileges; port mapping null | R-01, R-03, R-05 |
| Before/after image scan dan SBOM | `image-scan-before.txt`, `image-scan-after.txt`, `sbom.cdx.json` | Before Next.js 16.4.0: 2 CRITICAL; after Next.js 16.4.1: 0 CRITICAL; SBOM CycloneDX dibuat | R-04, R-05 |
| Demonstrasi | log bukti pada folder ini dan langkah pada dokumen hardening | VM serta container app/db berjalan dan pemeriksaan runtime disimpan | R-01, R-04, R-05 |

## File Bukti

File berikut berisi output aktual dari VM dan image yang diuji:

- `lynis-before.txt`
- `lynis-after.txt`
- `image-scan-before.txt`
- `image-scan-after.txt`
- `sbom.cdx.json`

Catatan: output Lynis menunjukkan Ubuntu 26.04 belum dikenali dalam database end-of-life Lynis 3.1.6. Scan final tidak menemukan CRITICAL, namun laporan masih memiliki temuan HIGH/MEDIUM/LOW yang tercantum di `image-scan-after.txt` dan harus dijelaskan saat demonstrasi.
