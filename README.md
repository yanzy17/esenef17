# Digital Seller Super Tools

**Digital Seller Super Tools** adalah website/PWA static berisi kumpulan tools ringan untuk penjual digital, affiliate, dan kreator jualan online. Project ini tidak memakai backend, database server, React, Node.js, atau framework berat. Semua berjalan di browser.

## Daftar Halaman

- `index.html` — landing page utama untuk memilih tools.
- `tools-affiliate.html` — halaman **Tools Affiliate / Tools Jualan** lama yang tetap dipertahankan.
- `buku-keuangan.html` — halaman baru **Buku Keuangan Digital** untuk mencatat pemasukan/penjualan manual.
- `manifest.json` dan `service-worker.js` — konfigurasi PWA agar website bisa di-install dan tetap bisa dibuka offline setelah pertama kali dimuat.

## Fitur Utama

### 1. Landing Page

Landing page berisi:

- Hero section modern dan premium.
- Penjelasan singkat bahwa project ini adalah kumpulan tools untuk digital seller.
- Card pilihan tools.
- Tombol masuk ke Tools Affiliate.
- Tombol masuk ke Buku Keuangan Digital.

### 2. Tools Affiliate / Tools Jualan

Tools lama tetap tersedia di `tools-affiliate.html` dan tidak dihapus. Fitur yang dipertahankan mencakup:

- Dashboard Affiliate Promo Assistant.
- Angle Finder / riset angle promosi produk.
- Hook Generator.
- Caption Affiliate Generator.
- CTA Generator.
- Script Video untuk TikTok/Reels/Shorts.
- Ide Konten Affiliate 30 Hari.
- Reply komentar dan DM.
- Kalkulator komisi affiliate.
- Review Builder.
- Riwayat hasil generate, copy, export, dan hapus riwayat.

Cara pakai Tools Affiliate:

1. Buka `tools-affiliate.html`.
2. Pilih tools dari sidebar desktop atau bottom navigation HP.
3. Isi form sesuai kebutuhan produk/target pembeli.
4. Klik tombol generate.
5. Copy atau export hasil yang sudah dibuat.

### 3. Buku Keuangan Digital

Buku Keuangan Digital ada di `buku-keuangan.html`. Tools ini dipakai untuk mencatat pemasukan dan penjualan secara manual dari banyak sumber, seperti:

- Produk Digital.
- APK Premium.
- Affiliate.
- Jasa.
- Langganan Pro / Premium AI.
- Akses AI.
- Tools Digital.
- Lynk ID.
- WhatsApp.
- QRIS manual.
- Transfer manual.
- Marketplace.
- Lainnya.

Data transaksi tidak ditarik otomatis dari platform mana pun. User tetap input manual, lalu aplikasi menghitung rekap otomatis.

## Cara Input Transaksi Buku Keuangan

1. Buka `buku-keuangan.html`.
2. Pilih menu **Tambah**.
3. Pilih **Form Lengkap** atau **Tambah Cepat**.
4. Isi field transaksi.
5. Klik simpan.

Field transaksi lengkap:

- Tanggal.
- Nama produk.
- Kategori produk.
- Sumber penjualan / platform.
- Jumlah terjual.
- Modal.
- Harga jual.
- Diskon.
- Biaya admin / fee.
- Keuntungan otomatis.
- Metode pembayaran.
- Status: Lunas, Belum Lunas, Refund.
- Catatan.

Rumus:

```text
Total harga jual = jumlah terjual x harga jual
Keuntungan = total harga jual - modal - diskon - biaya admin
```

Jika status transaksi adalah **Refund**, transaksi tetap tampil di riwayat tetapi tidak dihitung ke total omzet aktif dan total keuntungan aktif.

## Dashboard dan Rekap Bulan

Buku Keuangan Digital memiliki sistem bulan otomatis:

- Transaksi tanggal `15-06-2026` masuk ke **Juni 2026**.
- Transaksi tanggal `20-05-2026` masuk ke **Mei 2026**.

Cara melihat rekap bulan:

1. Pilih bulan aktif dari dropdown kanan atas.
2. Gunakan tab/chip bulan untuk berpindah bulan cepat.
3. Dashboard akan memperbarui total omzet, modal, keuntungan, transaksi, produk terjual, produk terlaris, sumber terbesar, metode pembayaran utama, transaksi belum lunas, dan refund.
4. Buka menu **Rekap** untuk melihat ringkasan semua waktu dan omzet/keuntungan per bulan.

## Target Bulanan

1. Buka Dashboard Buku Keuangan.
2. Isi target omzet bulan aktif.
3. Klik **Simpan Target**.
4. Progress bar, persentase target, dan sisa target akan diperbarui otomatis.
5. Jika target tercapai, aplikasi menampilkan pesan positif.

## Produk Cepat

1. Buka menu **Produk**.
2. Tambahkan nama produk, kategori, harga default, modal default, dan catatan.
3. Saat menambah transaksi lengkap, pilih produk dari dropdown **Pilih produk cepat**.
4. Harga jual dan modal akan otomatis terisi.

## Filter, Search, dan Sortir

Menu **Transaksi** mendukung:

- Search nama produk.
- Filter kategori.
- Filter sumber penjualan.
- Filter metode pembayaran.
- Filter status.
- Sortir tanggal terbaru.
- Sortir keuntungan terbesar.

## Backup, Export, Import

Buka menu **Pengaturan** atau **Rekap** di Buku Keuangan.

- **Export JSON**: mengunduh semua data transaksi, produk cepat, target bulanan, dan pengaturan.
- **Import JSON**: mengembalikan data dari file backup JSON.
- **Export CSV Bulan Aktif**: mengunduh transaksi sesuai bulan yang dipilih.
- **Export Semua CSV**: mengunduh semua transaksi sepanjang waktu.
- **Copy Ringkasan**: menyalin ringkasan bulan aktif ke clipboard.
- **Reset Semua Data**: menghapus semua data setelah user mengetik konfirmasi kuat `RESET`.

Semua data Buku Keuangan tersimpan di browser menggunakan `localStorage`, jadi lakukan export JSON secara rutin untuk backup.

## Cara Upload ke GitHub Pages

1. Buat repository baru di GitHub.
2. Upload semua file project ke repository.
3. Masuk ke **Settings** → **Pages**.
4. Pilih **Deploy from a branch**.
5. Pilih branch utama, biasanya `main`, dan folder `/root`.
6. Simpan dan tunggu URL GitHub Pages aktif.

## Cara Upload ke Netlify

1. Login ke Netlify.
2. Pilih **Add new site** → **Deploy manually**.
3. Drag & drop folder project ini ke Netlify.
4. Tidak perlu build command karena project ini pure static.
5. Buka URL yang diberikan Netlify.

## Cara Install ke Layar Utama HP

### Android / Chrome

1. Buka URL project di Chrome.
2. Tekan menu titik tiga.
3. Pilih **Add to Home screen** atau **Install app**.
4. Aplikasi akan muncul di layar utama HP.

### iPhone / Safari

1. Buka URL project di Safari.
2. Tekan tombol **Share**.
3. Pilih **Add to Home Screen**.
4. Simpan.

## Catatan Teknis

- Project ini pure frontend.
- Tidak ada backend dan database server.
- PWA cache mencakup `index.html`, `tools-affiliate.html`, `buku-keuangan.html`, `style.css`, `script.js`, `manifest.json`, dan `icon.svg`.
- Logic JavaScript dipisahkan berdasarkan atribut halaman (`data-page`) agar Tools Affiliate lama dan Buku Keuangan Digital tidak saling mengganggu.
