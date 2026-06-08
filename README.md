# Digital Seller Super Tools

Digital Seller Super Tools adalah web app static berbasis HTML, CSS, dan JavaScript vanilla untuk membantu pemula produk digital dan affiliate membuat ide produk, konten promosi, hook, caption, CTA, template DM, pricing, kalender konten, offer, dan teks lisensi dari satu tempat.

Aplikasi ini berjalan sepenuhnya di browser tanpa backend, tanpa database server, dan tanpa API berbayar. Riwayat hasil generate disimpan di `localStorage` browser pengguna.

## Fitur

- **Dashboard utama** dengan ringkasan fitur, quick action, dan panduan singkat cara pakai.
- **Product Idea Generator** untuk membuat 10 ide produk digital lengkap dengan nama, format, masalah, target pembeli, estimasi harga, tingkat kesulitan, dan platform jualan.
- **Affiliate Content Generator** untuk membuat hook, caption pendek, caption panjang, CTA, ide video pendek, dan ide Threads post.
- **Hook Generator** dengan kategori clickbait halus, problem aware, curiosity, storytelling, pain point, dan result based.
- **Caption + CTA Generator** untuk Threads, Instagram, TikTok, CTA komentar, CTA DM, CTA cek bio, soft selling, dan direct selling.
- **DM Reply Assistant** untuk membalas komentar “mau”, pertanyaan harga, keberatan mahal, permintaan bukti, follow up, dan closing halus.
- **Pricing Calculator** untuk menghitung profit per produk, omzet, total profit, saran harga, break even point, dan strategi harga.
- **Content Calendar Generator** untuk membuat kalender konten 30 hari berdasarkan niche, produk utama, dan platform.
- **Offer Builder** untuk menyusun struktur penawaran, headline, benefit, bonus stack, urgency, guarantee statement, dan CTA penjualan.
- **License Text Generator** untuk lisensi personal use, resell rights, master resell rights, dan larangan jual ulang.
- **Saved History** yang menyimpan hasil generate terakhir ke browser dan bisa dihapus kapan saja.
- **Copy Button** di setiap output dengan toast notification “Berhasil disalin”.
- **Export ke `.txt`** untuk mengunduh hasil yang sedang tampil atau hasil dari riwayat.

## Cara Pakai

1. Buka `index.html` langsung di browser, atau deploy folder ini ke hosting static seperti Netlify/GitHub Pages.
2. Pilih menu tool dari sidebar atau quick action di dashboard.
3. Isi semua input yang diminta.
4. Klik tombol generate.
5. Copy output yang dibutuhkan atau export ke file `.txt`.
6. Buka menu **Riwayat** untuk melihat hasil generate sebelumnya di browser yang sama.

## Cara Deploy ke Netlify

1. Login ke [Netlify](https://www.netlify.com/).
2. Pilih **Add new site** → **Deploy manually**.
3. Drag and drop folder project ini ke area deploy Netlify.
4. Netlify akan otomatis mem-publish karena project ini hanya berisi file static.
5. Tidak perlu mengatur build command. Jika diminta, kosongkan build command dan gunakan root folder sebagai publish directory.

Alternatif via Git:

1. Push repository ini ke GitHub/GitLab/Bitbucket.
2. Di Netlify, pilih **Import from Git**.
3. Pilih repository.
4. Build command: kosongkan.
5. Publish directory: `/` atau root repository.
6. Klik **Deploy**.

## Cara Deploy ke GitHub Pages

1. Push repository ke GitHub.
2. Buka **Settings** repository.
3. Masuk ke **Pages**.
4. Pada bagian **Build and deployment**, pilih source dari branch utama.
5. Pilih folder root (`/`).
6. Simpan, lalu tunggu GitHub Pages membuat URL publik.

## Catatan Teknis

- Dibuat dengan HTML, CSS, dan JavaScript vanilla.
- Tidak menggunakan framework berat.
- Tidak menggunakan backend.
- Tidak menggunakan API berbayar.
- Output dibuat dari template JavaScript yang dinamis dan bervariasi berdasarkan input pengguna.
- Data riwayat disimpan lokal di browser menggunakan `localStorage`, sehingga riwayat tidak berpindah antar perangkat atau browser.
