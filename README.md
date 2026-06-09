# Buku Keuangan Digital

**Buku Keuangan Digital** adalah aplikasi web/PWA pure frontend untuk catatan pemasukan, catatan penjualan, buku keuangan digital, dan sales tracker manual dari HP. Aplikasi tetap fokus pada pencatatan transaksi manual, bukan login, backend, database online, atau tool promosi.

Aplikasi tidak menarik data otomatis dari platform mana pun. Semua transaksi diinput manual, lalu aplikasi menghitung omzet, modal, profit, status pembayaran, nominal belum lunas, target bulanan, insight produk/sumber/pembayaran, dan rekap laporan secara otomatis.

## Teknologi

- `index.html`
- `style.css`
- `script.js`
- `manifest.json`
- `service-worker.js`
- `localStorage` browser

Tidak memakai React, Node.js, backend, framework berat, atau database server. Aplikasi bisa langsung berjalan di hosting static seperti GitHub Pages.

## Fungsi Aplikasi

- Dashboard compact dengan ringkasan omzet, profit, modal, dan transaksi bulan aktif.
- Ringkasan cepat hari ini: omzet, profit, dan transaksi hari ini.
- Ringkasan minggu ini: omzet, profit, dan total transaksi minggu ini.
- Margin profit bulan ini dalam persen.
- Ringkasan transaksi belum lunas: jumlah transaksi dan estimasi nominal belum lunas.
- Target omzet bulanan dengan progress bar, sisa target, dan persentase tercapai.
- Insight simpel: produk terlaris, sumber terbesar, pembayaran utama, kategori terbesar, dan margin profit.
- Tambah transaksi lengkap dan mode **Tambah Cepat** untuk HP.
- Tombol floating **+ Catat Penjualan** untuk langsung masuk ke tambah cepat.
- Tabel transaksi modern di desktop dan card transaksi di HP.
- Badge kategori kecil di card transaksi.
- Edit, hapus, dan duplikat transaksi.
- Produk cepat sederhana: nama produk, kategori, harga jual default, dan modal default.
- Search, filter kategori, filter sumber penjualan, filter pembayaran, filter status, dan sortir transaksi.
- Sortir tanggal terbaru, omzet terbesar, dan profit terbesar.
- Rekap otomatis per bulan dan semua waktu.
- Export/import backup JSON.
- Export CSV untuk bulan aktif atau semua transaksi.
- Copy ringkasan bulan dengan format laporan rapi.
- Dark mode, bottom navigation mobile, sidebar desktop, toast notification clean, dan empty state.
- PWA offline setelah pertama kali dibuka.

## Kategori Produk

Kategori produk yang tersedia:

- Produk Digital
- APK Premium
- Langganan Pro / Premium AI
- Akses AI
- Tools Digital
- Affiliate
- Jasa
- E-book
- Template Notion
- Spreadsheet / Tracker
- Canva / Design Asset
- Video Editing / Preset
- Kelas / Mentoring
- Bundle Produk
- Lainnya

Kategori muncul di form transaksi, tambah cepat, filter transaksi, produk cepat, dan rekap/insight kategori.

## Sumber Penjualan

Sumber penjualan/platform yang tersedia:

- Lynk ID
- WhatsApp
- Threads
- Instagram
- TikTok
- Shopee
- Telegram
- QRIS Manual
- Transfer Manual
- Marketplace
- Repeat Order
- Referral
- Langganan Pro / Premium AI
- Lainnya

Sumber penjualan muncul di form transaksi, tambah cepat, filter transaksi, rekap sumber, dan dashboard insight.

## Metode Pembayaran

Metode pembayaran yang tersedia:

- QRIS DANA
- QRIS GoPay
- QRIS OVO
- QRIS ShopeePay
- Transfer Bank
- DANA
- GoPay
- OVO
- ShopeePay
- Cash
- Lynk ID Web
- Lainnya

## Cara Pakai

1. Buka `index.html` di browser modern atau upload folder ini ke hosting static.
2. Pilih bulan aktif dari dropdown kanan atas.
3. Tekan **+ Catat Penjualan**, **Tambah Transaksi**, atau menu **Tambah**.
4. Isi data transaksi manual.
5. Simpan transaksi.
6. Buka **Dashboard**, **Transaksi**, atau **Rekap** untuk melihat hasil otomatis.

## Cara Input Transaksi

Menu **Tambah** menyediakan dua mode.

### Form Lengkap

Field utama di bagian atas:

- Tanggal
- Nama produk
- Kategori
- Sumber penjualan
- Harga jual
- Modal

Field tambahan di bawah:

- Jumlah
- Diskon
- Biaya admin
- Metode pembayaran
- Status
- Catatan

Rumus yang dipakai:

```text
Total harga jual = jumlah terjual x harga jual
Profit = total harga jual - modal - diskon - biaya admin
Margin profit = profit / omzet x 100
```

Jika status transaksi adalah **Refund**, transaksi tetap muncul di riwayat tetapi tidak dihitung ke omzet, modal aktif, dan profit aktif.

### Tambah Cepat

Mode ini untuk input cepat dari HP. Field yang tersedia:

- Tanggal otomatis hari ini
- Nama produk
- Kategori
- Sumber penjualan
- Harga jual
- Modal
- Metode pembayaran
- Tombol simpan

## Cara Lihat Rekap Bulan

1. Pilih bulan aktif di dropdown kanan atas, misalnya **JUN 2026**.
2. Dashboard akan menampilkan ringkasan bulan tersebut.
3. Menu **Transaksi** menampilkan transaksi sesuai bulan aktif dan filter yang dipilih.
4. Menu **Rekap** menampilkan total semua waktu dan tabel omzet/profit per bulan.

Transaksi otomatis masuk ke bulan sesuai tanggal input. Contoh:

- `15-06-2026` masuk ke **Juni 2026**.
- `20-05-2026` masuk ke **Mei 2026**.

## Target Bulanan

1. Buka **Dashboard**.
2. Isi target omzet pada kartu **Target Bulanan**.
3. Tekan **Simpan**.
4. Aplikasi akan menampilkan progress, persentase target tercapai, dan sisa target.
5. Jika target sudah tercapai, aplikasi menampilkan pesan positif.

## Produk Cepat / Daftar Produk

1. Buka menu **Produk**.
2. Tambahkan nama produk, kategori, harga jual default, dan modal default.
3. Saat membuat transaksi lengkap, pilih produk dari dropdown **Pilih produk cepat**.
4. Nama produk, kategori, harga jual, dan modal akan terisi otomatis.

Produk lama yang pernah punya catatan tetap aman saat import/export karena struktur data lama tetap dibaca, tetapi form produk cepat dibuat lebih simpel.

## Filter dan Pencarian

Menu **Transaksi** mendukung:

- Search nama produk.
- Filter kategori.
- Filter sumber penjualan/platform.
- Filter metode pembayaran.
- Filter status.
- Sortir tanggal terbaru.
- Sortir omzet terbesar.
- Sortir profit terbesar.

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

Tekan tombol **Copy Ringkasan** di hero atau menu **Rekap**. Formatnya seperti:

```text
Rekap Juni 2026
Omzet: Rp362.000
Modal: Rp0
Profit: Rp362.000
Margin: 100%
Transaksi: 11
Belum lunas: 2 transaksi · Rp80.000
Produk terlaris: Gemini Pro 6 B
Sumber terbesar: Lynk ID
Pembayaran utama: QRIS DANA
```

## Kompatibilitas Data Lama

Data tetap disimpan memakai key localStorage yang sama (`bukuKeuanganDigital:v1`) agar transaksi lama, produk lama, target lama, export/import JSON, export CSV, dan pengaturan tetap terbaca setelah update.

Field baru seperti sumber penjualan yang lebih lengkap, margin, ringkasan hari ini/minggu ini, dan belum lunas dihitung dari data transaksi yang sudah ada tanpa menghapus data lama.

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
