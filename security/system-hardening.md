# System Hardening `sec-0.2`

**Status:** runbook only; OS controls and score are not yet verified. Risk mapping: SSH access -> R-04; firewall/availability -> R-05; evidence integrity -> R-04.

## Disposable VM

Tugas ini perlu Linux VM (atau VM yang disediakan kampus). Mesin kerja ini tidak memiliki hypervisor, `sshd`, atau Lynis; jangan menerapkan konfigurasi SSH ke laptop/host. Buat VM Ubuntu Server LTS khusus pengujian dengan snapshot dan jaringan NAT, bukan bridge ke jaringan publik. Contoh minimum untuk demo: 2 vCPU, 4 GB RAM, 20 GB disk.

## Bukti Sebelum Hardening

Di VM, install alat audit sebelum perubahan dan simpan hasil mentah:

```bash
sudo apt update
sudo apt install -y openssh-server lynis ufw
mkdir -p security
sudo lynis audit system --quick --no-colors 2>&1 | tee security/lynis-before.txt
```

Catat indeks awal dan saran Lynis. Jangan membuat atau mengisi file bukti dengan hasil perkiraan.

## SSH Key-Only dan Firewall

1. Buat key Ed25519 sintetis di mesin operator, lalu pasang public key pada akun non-root VM:

```bash
ssh-keygen -t ed25519 -a 64 -f ~/.ssh/sec-0.2-vm
ssh-copy-id -i ~/.ssh/sec-0.2-vm.pub <user-uji>@<alamat-vm>
ssh -i ~/.ssh/sec-0.2-vm <user-uji>@<alamat-vm>
```

2. Pastikan login key berhasil dan pertahankan sesi konsol/sesi SSH aktif sebelum mengubah daemon. Buat `/etc/ssh/sshd_config.d/99-sec-0.2.conf`:

```text
PermitRootLogin no
PasswordAuthentication no
KbdInteractiveAuthentication no
PubkeyAuthentication yes
AuthenticationMethods publickey
```

3. Uji sintaks dan konfigurasi efektif. Reload hanya setelah `sshd -t` berhasil; jangan tutup sesi key yang sudah aktif sebelum tes koneksi key baru berhasil.

```bash
sudo sshd -t
sudo sshd -T | grep -E '^(passwordauthentication|permitrootlogin) '
sudo systemctl reload ssh
```

Hasil yang diwajibkan: `passwordauthentication no` dan `permitrootlogin no`.

4. Dari mesin operator, pastikan login key berhasil dan login password ditolak:

```bash
ssh -i ~/.ssh/sec-0.2-vm <user-uji>@<alamat-vm>
ssh -o PreferredAuthentications=password -o PubkeyAuthentication=no <user-uji>@<alamat-vm>
```

Koneksi kedua harus gagal dengan `Permission denied`; simpan hasilnya dalam laporan demo tanpa private key. Aktifkan firewall setelah memastikan akses SSH diizinkan:

```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow OpenSSH
sudo ufw enable
sudo ufw status verbose
```

Kontrol SSH/firewall merujuk R-04 dan R-05.

## Audit Sesudah Hardening

Ikuti saran Lynis yang relevan untuk VM demo, jalankan pembaruan keamanan, lalu simpan keluaran akhir:

```bash
sudo apt upgrade -y
sudo lynis audit system --quick --no-colors 2>&1 | tee security/lynis-after.txt
sudo grep -E 'Hardening index|Warnings|Suggestions' /var/log/lynis.log
```

Syarat rubrik adalah indeks minimal 70. Simpan output perintah SSH efektif bersama bukti demonstrasi. Nilai akhir belum bisa dinyatakan lulus sampai file bukti aktual menunjukkan nilai tersebut.
