# Container Hardening `sec-0.2`

Risk mapping: perubahan katalog dan hak database -> R-01; password/hash -> R-03; dependency/source image -> R-04; isolasi jaringan/availability -> R-05.

## Kontrol Konfigurasi

- `Dockerfile` memakai build multi-stage dan Next.js standalone; runtime berjalan sebagai UID/GID `10001`, bukan root.
- Service `app` menggunakan root filesystem read-only, tmpfs terbatas untuk `/tmp` dan cache, `cap_drop: ALL`, serta `no-new-privileges:true`.
- Service `db` berjalan sebagai user `postgres`, tidak mempublikasikan port, membuang capability, dan hanya berada pada Compose network internal.
- Service app juga tidak mempublikasikan port. App menggunakan role PostgreSQL `mtm_runtime` yang hanya memperoleh DML pada schema; migrasi menggunakan role bootstrap `mtm_owner` melalui service satu-kali `migrate`.
- `.dockerignore` mengecualikan `.env`, `.git`, generated output lokal, dan bukti security dari build context. Build menggunakan URL database dummy hanya untuk `prisma generate`, bukan kredensial runtime.

## Jalankan pada VM

Prasyarat: Docker Engine dan Compose plugin pada VM disposable; isi `.env` dengan secret sintetis yang tidak dipakai di tempat lain. `APP_DB_PASSWORD` harus hex 64 karakter; gunakan `openssl rand -hex 32`. Buat hash demo melalui `npm run security:hash-demo` dan simpan hasilnya sebagai `DEMO_KATA_SANDI_HASH`.

```bash
cp .env.example .env
# Isi POSTGRES_ADMIN_PASSWORD, APP_DB_PASSWORD, DEMO_EMAIL,
# DEMO_KATA_SANDI_HASH, dan DATABASE_URL pada .env lokal.
docker compose config --quiet
docker compose build app migrate
docker compose up -d db
docker compose --profile ops run --rm migrate
docker compose up -d app
docker compose ps
```

Compose tidak memiliki `ports:` untuk `app` maupun `db`, sesuai batasan tugas. Jangan menambah port mapping saat demonstrasi. Karena itu browser host tidak dapat membuka aplikasi langsung; probe dari dalam app container:

```bash
docker compose exec app id
docker compose exec app node -e "fetch('http://127.0.0.1:3000').then(r=>console.log(r.status))"
docker compose exec db id
docker compose exec db psql -U mtm_owner -d mtm_solusindo -c '\du mtm_runtime'
docker compose config
```

Pastikan `id` app bukan UID 0, `id` DB menunjukkan user `postgres`, role `mtm_runtime` bukan superuser, dan `docker compose config` tidak menampilkan daftar `ports` pada kedua service. Untuk inspeksi capability, security options, dan user container:

```bash
docker inspect --format '{{.Config.User}} {{.HostConfig.CapDrop}} {{.HostConfig.SecurityOpt}}' "$(docker compose ps -q app)"
docker inspect --format '{{.Config.User}} {{.HostConfig.CapDrop}} {{.HostConfig.SecurityOpt}}' "$(docker compose ps -q db)"
```

## Scan Image dan SBOM

Simpan hasil aktual dari baseline sebelum perbaikan sebagai `security/image-scan-before.txt`; simpan hasil image final sebagai `security/image-scan-after.txt`. Jangan membandingkan hasil dari image/base yang berbeda tanpa mencatat identitas image dan tanggal scan.

```bash
trivy image --format table --output security/image-scan-before.txt mtm-solusindo:before-sec-0.2
trivy image --format table --output security/image-scan-after.txt mtm-solusindo:sec-0.2
trivy image --severity CRITICAL --exit-code 1 mtm-solusindo:sec-0.2
syft mtm-solusindo:sec-0.2 -o cyclonedx-json=security/sbom.cdx.json
```

Perintah Trivy critical harus exit code 0 untuk menyatakan tidak ada temuan CRITICAL. Tinjau fixed/unfixed findings lain dan catat alasan bila ada yang tersisa. File scan dan SBOM hanya dianggap bukti setelah dihasilkan dari image yang benar-benar dibangun dan diperiksa.

**Status lokal:** YAML Compose lolos parse; assertion memverifikasi user app `10001:10001`, `cap_drop: ALL`, network internal, dan tidak adanya `ports`. Image/container runtime belum dibangun atau dijalankan karena Docker/Podman tidak tersedia pada host ini. Hasil Trivy/Syft belum dibuat.
