# Buku Keuangan Digital

**Buku Keuangan Digital** adalah aplikasi web/PWA pure frontend untuk mencatat pemasukan atau penjualan manual dari HP. Aplikasi ini cocok untuk produk digital, APK premium, affiliate, jasa, Lynk ID, WhatsApp, QRIS, transfer, marketplace, dan sumber penjualan lain.

Aplikasi tidak menarik data otomatis dari platform mana pun. Semua transaksi diinput manual, lalu aplikasi menghitung omzet, modal, keuntungan, status pembayaran, target bulanan, dan rekap laporan secara otomatis.

## Teknologi

- `index.html`
- `style.css`
- `script.js`
- `manifest.json`
- `service-worker.js`
- `localStorage` browser

Tidak memakai React, Node.js, backend, framework berat, atau database server.

## Fungsi Aplikasi

- Dashboard ringkasan bulan aktif.
- Tambah transaksi lengkap dan mode **Tambah Cepat** untuk HP.
- Sistem bulan otomatis berdasarkan tanggal transaksi.
- Tabel transaksi seperti spreadsheet di desktop dan card transaksi di HP.
- Edit, hapus, dan duplikat transaksi.
- Rekap otomatis per bulan dan semua waktu.
- Target omzet bulanan dengan progress, persentase, dan sisa target.
- Daftar produk cepat agar harga dan modal default bisa terisi otomatis.
- Search, filter, dan sortir transaksi.
- Export/import backup JSON.
- Export CSV untuk bulan aktif atau semua transaksi.
- Copy ringkasan bulan ke clipboard.
- Dark mode, bottom navigation mobile, sidebar desktop, toast notification, dan empty state.
- PWA offline setelah pertama kali dibuka.

## Cara Pakai

1. Buka `index.html` di browser modern atau upload folder ini ke hosting static.
2. Pilih bulan aktif dari dropdown di kanan atas.
3. Tekan **Tambah Transaksi** atau menu **Tambah**.
4. Isi data transaksi manual.
5. Simpan transaksi.
6. Buka **Dashboard**, **Transaksi**, atau **Rekap** untuk melihat hasil otomatis.

## Cara Input Transaksi

Menu **Tambah** menyediakan dua mode:

### Form Lengkap

Isi field berikut:

- Tanggal
- Nama produk
- Kategori produk
- Platform / sumber penjualan
- Jumlah terjual
- Modal
- Harga jual
- Diskon
- Biaya admin / fee
- Metode pembayaran
- Status
- Catatan

Rumus yang dipakai:

```text
Total harga jual = jumlah terjual x harga jual
Keuntungan = total harga jual - modal - diskon - biaya admin
```

Jika status transaksi adalah **Refund**, transaksi tetap muncul di riwayat tetapi tidak dihitung ke omzet, modal aktif, dan keuntungan aktif.

### Tambah Cepat

Mode ini untuk input cepat dari HP. Field yang tersedia:

- Tanggal otomatis hari ini
- Nama produk
- Harga jual
- Modal
- Metode pembayaran
- Tombol simpan

## Cara Lihat Rekap Bulan

1. Pilih bulan aktif di dropdown kanan atas, misalnya **JUN 2026**.
2. Dashboard akan menampilkan ringkasan bulan tersebut.
3. Menu **Transaksi** menampilkan transaksi sesuai bulan aktif dan filter yang dipilih.
4. Menu **Rekap** menampilkan total semua waktu dan tabel omzet/keuntungan per bulan.

Transaksi otomatis masuk ke bulan sesuai tanggal input. Contoh:

- `15-06-2026` masuk ke **Juni 2026**.
- `20-05-2026` masuk ke **Mei 2026**.

## Target Bulanan

1. Buka **Dashboard**.
2. Isi target omzet pada kartu **Target Bulanan**.
3. Tekan **Simpan Target**.
4. Aplikasi akan menampilkan progress, persentase target tercapai, dan sisa target.
5. Jika target sudah tercapai, aplikasi menampilkan pesan positif.

## Produk Cepat / Daftar Produk

1. Buka menu **Produk**.
2. Tambahkan nama produk, kategori, harga default, modal default, dan catatan.
3. Saat membuat transaksi lengkap, pilih produk dari dropdown **Pilih produk cepat**.
4. Nama produk, kategori, harga jual, dan modal akan terisi otomatis.

## Filter dan Pencarian

Menu **Transaksi** mendukung:

- Search nama produk.
- Filter kategori.
- Filter metode pembayaran.
- Filter status.
- Sortir tanggal terbaru.
- Sortir keuntungan terbesar.

## Export / Import Backup

Buka menu **Pengaturan** atau **Rekap**.

### Export JSON

Tekan **Export JSON** untuk mengunduh seluruh data aplikasi, termasuk transaksi, produk cepat, target bulanan, dan pengaturan.

### Import JSON

Tekan **Import JSON**, lalu pilih file backup JSON yang pernah diexport dari aplikasi ini.

### Export CSV

- **Export CSV Bulan Aktif**: mengunduh transaksi sesuai bulan yang sedang dipilih.
- **Export Semua CSV**: mengunduh semua transaksi sepanjang waktu.

### Reset Data

Tekan **Reset Semua Data**, lalu ketik `RESET` pada prompt konfirmasi. Semua transaksi, produk, target, dan pengaturan akan dihapus.

## Copy Ringkasan Bulan

Tekan tombol **Copy Ringkasan** di header hero atau menu **Rekap**. Formatnya seperti:

```text
Rekap Juni 2026:
Omzet: Rp362.000
Modal: Rp0
Keuntungan: Rp362.000
Total transaksi: 11
Produk terlaris: Gemini Pro 6 B
Metode pembayaran utama: QRIS DANA
```

## Cara Upload ke GitHub Pages

1. Buat repository baru di GitHub.
2. Upload semua file aplikasi ke repository.
3. Masuk ke **Settings** → **Pages**.
4. Pada bagian **Build and deployment**, pilih **Deploy from a branch**.
5. Pilih branch utama, biasanya `main`, dan folder `/root`.
6. Simpan dan tunggu URL GitHub Pages aktif.

## Cara Upload ke Netlify

1. Login ke Netlify.
2. Pilih **Add new site** → **Deploy manually**.
3. Drag & drop folder aplikasi ini ke Netlify.
4. Netlify akan memberi URL website otomatis.
5. Karena aplikasi pure static, tidak perlu build command.

## Cara Install ke Layar Utama HP

### Android / Chrome

1. Buka URL aplikasi di Chrome.
2. Tekan menu titik tiga.
3. Pilih **Add to Home screen** atau **Install app**.
4. Aplikasi akan muncul seperti aplikasi native.

### iPhone / Safari

1. Buka URL aplikasi di Safari.
2. Tekan tombol **Share**.
3. Pilih **Add to Home Screen**.
4. Simpan.

## Catatan Penyimpanan Data

Semua data tersimpan di browser menggunakan `localStorage`. Artinya:

- Data tersimpan di perangkat dan browser yang sama.
- Data tidak otomatis tersinkron ke perangkat lain.
- Jika cache/data browser dihapus, data aplikasi bisa ikut hilang.
- Lakukan **Export JSON** secara rutin untuk backup.
