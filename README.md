# Digital Seller Super Tools

**Digital Seller Super Tools** adalah web app 100% static untuk membantu pemula produk digital dan affiliate di Indonesia membuat bahan jualan dari satu dashboard: ide produk, konten promosi, hook, caption, CTA, DM reply, pricing, kalender konten, offer, lisensi, deskripsi produk, dan Threads post.

Project ini dibuat dengan **HTML, CSS, dan JavaScript vanilla** saja. Tidak ada backend, tidak ada database server, dan tidak menggunakan API berbayar, sehingga bisa langsung di-deploy ke GitHub Pages, Netlify, atau hosting static lain.

## Kenapa project ini berguna?

Banyak pemula sudah punya skill atau produk affiliate, tetapi stuck di bagian eksekusi: bingung bikin ide produk, takut promosi terlihat kaku, tidak tahu menyusun harga, atau belum punya copywriting penawaran. Tools ini membantu membuat draft yang lebih natural, detail, dan siap dipakai untuk jualan harian.

## Fitur Lengkap

- **Dashboard utama** dengan quick action ke semua tool.
- **Product Idea Generator** untuk membuat minimal 10 ide produk digital lengkap dengan format, target pembeli, masalah, solusi, bonus, harga, platform, angle promosi, dan potensi laku.
- **Affiliate Content Generator** untuk membuat hook, caption pendek, caption storytelling, soft selling, hard selling natural, CTA, ide video pendek, ide Threads, komentar lanjutan, dan angle masalah audiens.
- **Hook Generator** dengan kategori problem aware, curiosity, result based, FOMO, storytelling, social proof, soft clickbait, dan beginner friendly.
- **Caption + CTA Generator** untuk Threads, Instagram, TikTok, CTA komentar, CTA DM, cek bio, versi santai, urgent, dan tanpa terasa jualan.
- **DM Reply Assistant** untuk komentar “mau”, tanya harga, objection mahal, minta bukti, follow up, closing, reminder transfer, setelah bayar, dan after sales.
- **Pricing Calculator** untuk menghitung omzet, profit bersih, profit per order, break even point, target harian, target mingguan, saran harga, strategi diskon, dan catatan pricing.
- **Content Calendar Generator** untuk membuat kalender konten 30 hari lengkap dengan tema, hook, caption singkat, format, CTA, tujuan konten, dan platform.
- **Offer Builder** untuk menyusun headline, subheadline, pain point, solusi, benefit, offer stack, bonus, value breakdown, urgency, garansi sederhana, dan CTA.
- **License Text Generator** dengan pilihan Personal Use, Resell Rights, Master Resell Rights, dan Tidak boleh dijual ulang.
- **Product Description Generator** untuk membuat deskripsi pendek, deskripsi panjang, bullet benefit, isi paket, CTA beli, versi Lynk ID, dan versi Gumroad/website.
- **Threads Post Generator** untuk membuat post utama, komentar lanjutan, CTA komentar, dan hook clickbait aman.
- **Riwayat generate** memakai localStorage di browser.
- **Copy hasil** ke clipboard dengan toast notification.
- **Export hasil** ke file `.txt` dengan format rapi.
- **Responsive UI** dengan sidebar desktop dan bottom navigation mobile.

## Cara Pakai

1. Buka `index.html` di browser atau akses URL deployment.
2. Pilih tool yang ingin digunakan dari sidebar, bottom navigation, atau card quick action.
3. Isi semua input yang diminta agar hasil generate lebih spesifik.
4. Klik **Generate Sekarang**.
5. Gunakan tombol **Copy Hasil** atau **Export .txt**.
6. Cek bagian **Riwayat** untuk melihat hasil generate sebelumnya.

## Struktur File

```text
.
├── index.html   # Struktur halaman dan konten utama app
├── style.css    # Styling dashboard SaaS modern dan responsive layout
├── script.js    # Logic generator, validasi form, copy, export, dan localStorage
└── README.md    # Dokumentasi project
```

## Deploy ke GitHub Pages

1. Push repository ini ke GitHub.
2. Buka halaman repository di GitHub.
3. Masuk ke **Settings** → **Pages**.
4. Pada bagian **Build and deployment**, pilih **Deploy from a branch**.
5. Pilih branch `main` dan folder `/root`.
6. Klik **Save**.
7. Tunggu beberapa saat sampai GitHub Pages memberikan URL website.

Karena project ini static, tidak diperlukan build command.

## Deploy ke Netlify

### Opsi 1: Drag & Drop

1. Login ke Netlify.
2. Buka menu **Sites**.
3. Drag folder project ini ke area deploy Netlify.
4. Netlify akan langsung membuat website static.

### Opsi 2: Connect Repository

1. Login ke Netlify.
2. Klik **Add new site** → **Import an existing project**.
3. Pilih repository GitHub project ini.
4. Kosongkan build command.
5. Isi publish directory dengan root project, atau biarkan default jika Netlify mendeteksi file static.
6. Klik **Deploy**.

## Catatan Teknis

- Project ini **100% static**.
- Tidak memakai backend.
- Tidak memakai database server.
- Tidak memakai API berbayar.
- Semua hasil generator dibuat di browser memakai JavaScript vanilla.
- Riwayat tersimpan di localStorage pengguna, sehingga data tetap berada di browser masing-masing.

## Lisensi Penggunaan Project

Silakan gunakan, modifikasi, dan deploy project ini sesuai kebutuhan. Jika ingin menjadikan tools ini sebagai produk komersial, pastikan copy, brand, dan template output disesuaikan dengan kebutuhan audiens kamu.
