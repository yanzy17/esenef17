# Digital Seller Super Tools

**Digital Seller Super Tools** adalah web app static premium untuk pemula produk digital dan affiliate yang ingin membuat ide produk, hook, caption, CTA, template DM, pricing, kalender konten, offer, lisensi, deskripsi produk, dan Threads post dari satu dashboard.

Aplikasi ini dibuat dengan **HTML, CSS, dan JavaScript vanilla**. Tidak ada backend, tidak ada database server, tidak ada framework berat, dan tidak memakai API berbayar. Semua generator berjalan langsung di browser menggunakan template JavaScript dinamis, sedangkan riwayat disimpan di `localStorage` browser pengguna.

## Kenapa Project Ini Berguna?

Banyak pemula jualan produk digital atau affiliate stuck bukan karena tidak punya produk, tapi karena bingung:

- produk apa yang bisa dibuat,
- angle promosi apa yang cocok,
- caption apa yang terasa natural,
- bagaimana membalas calon pembeli di DM,
- berapa harga yang masuk akal,
- konten apa yang harus diposting selama 30 hari,
- bagaimana menulis offer dan lisensi yang rapi.

Digital Seller Super Tools menyatukan kebutuhan tersebut dalam satu tempat yang ringan, cepat, mobile friendly, dan bisa langsung di-deploy.

## Fitur Lengkap

- **Dashboard utama** dengan hero section, quick action, tools unggulan, cara pakai, dan rekomendasi target pengguna.
- **Product Idea Generator** untuk membuat 10 ide produk digital lengkap dengan nama catchy, format, target, masalah, solusi, isi produk, bonus, estimasi harga, tingkat kesulitan, platform, angle promosi, dan alasan berpotensi laku.
- **Affiliate Content Generator** untuk membuat 15 hook, 10 caption pendek, caption storytelling, caption soft selling, hard selling natural, CTA, ide video pendek, Threads post, komentar lanjutan, dan angle konten.
- **Hook Generator** untuk menghasilkan 30+ hook casual ala Gen Z Indonesia dengan kategori problem aware, curiosity, result based, FOMO, storytelling, social proof, soft clickbait, dan beginner friendly.
- **Caption + CTA Generator** untuk membuat caption Threads pendek, utas, caption IG, TikTok, CTA komentar, CTA DM, CTA cek bio, CTA soft, CTA direct, versi santai, urgent, dan tanpa terkesan jualan.
- **DM Reply Assistant** untuk template balasan komentar “mau”, tanya harga, bilang mahal, minta bukti, cuma tanya-tanya, follow up, closing halus, belum transfer, setelah bayar, dan after sales.
- **Pricing Calculator** untuk menghitung omzet, profit bersih, profit per order, break even point, target harian/mingguan, saran harga bawah/ideal/premium, strategi diskon, dan catatan agar tidak menjual terlalu murah.
- **Content Calendar Generator** untuk membuat kalender konten 30 hari berisi tema, hook, isi caption singkat, format, CTA, tujuan konten, dan platform yang cocok.
- **Offer Builder** untuk menyusun headline, subheadline, pain point, solusi, benefit, isi paket, bonus stack, value breakdown, harga normal vs promo, urgency, risk reversal, CTA, copywriting pendek, dan copywriting panjang.
- **License Text Generator** untuk lisensi Personal Use, Resell Rights, Master Resell Rights, dan Tidak Boleh Dijual Ulang dengan versi singkat, lengkap, hak pembeli, larangan, catatan penggunaan, dan disclaimer sederhana.
- **Product Description Generator** untuk membuat judul produk, deskripsi pendek, deskripsi panjang, bullet benefit, isi paket, cocok untuk siapa, CTA beli, versi Lynk ID, dan versi Gumroad/website.
- **Threads Post Generator** untuk membuat 5 post utama, 5 komentar lanjutan, 5 CTA komentar, dan 5 hook clickbait yang tetap aman.
- **Riwayat** untuk menyimpan hasil generate di browser, menampilkan nama fitur, tanggal, preview hasil, copy ulang, export ulang, hapus satu item, dan hapus semua.
- **Copy & Export** di setiap hasil output dengan toast notification.

## Cara Pakai

1. Buka `index.html` langsung di browser atau deploy ke hosting static.
2. Pilih tool dari sidebar desktop, bottom navigation mobile, atau card quick action di dashboard.
3. Isi semua field pada form.
4. Klik tombol generate.
5. Copy hasil yang dibutuhkan atau export ke file `.txt`.
6. Buka menu **Riwayat** jika ingin melihat, copy ulang, export, atau menghapus hasil sebelumnya.

## Cara Menjalankan Lokal

Cara paling sederhana:

```bash
python3 -m http.server 4173
```

Lalu buka:

```text
http://127.0.0.1:4173/index.html
```

Karena ini project static, kamu juga bisa membuka `index.html` langsung dari file browser.

## Deploy ke GitHub Pages

1. Push repository ke GitHub.
2. Buka **Settings** repository.
3. Masuk ke **Pages**.
4. Pada bagian **Build and deployment**, pilih deploy dari branch utama.
5. Pilih folder root (`/`).
6. Simpan dan tunggu GitHub Pages membuat URL publik.

Tidak perlu build command karena aplikasi ini static.

## Deploy ke Netlify

### Opsi Drag & Drop

1. Login ke Netlify.
2. Pilih **Add new site**.
3. Pilih **Deploy manually**.
4. Drag and drop folder project ini.
5. Netlify akan langsung mem-publish website.

### Opsi Import dari Git

1. Push project ke GitHub/GitLab/Bitbucket.
2. Di Netlify, pilih **Import from Git**.
3. Pilih repository project.
4. Kosongkan build command.
5. Publish directory: `/` atau root repository.
6. Klik **Deploy**.

## Catatan Static Tanpa API

- 100% static HTML/CSS/JS.
- Tidak memakai backend.
- Tidak memakai API berbayar.
- Tidak memerlukan database server.
- Tidak memakai framework berat.
- Aman untuk GitHub Pages dan Netlify.
- Riwayat hanya tersimpan di browser pengguna melalui `localStorage`.
