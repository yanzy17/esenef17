# Affiliate Promo Assistant

Affiliate Promo Assistant adalah web app static untuk membantu affiliator pemula mengubah produk atau link affiliate menjadi bahan promosi yang lebih menarik, natural, dan siap diposting.

Project ini dibuat dengan **HTML, CSS, dan JavaScript vanilla**. Tidak ada backend, tidak ada API, tidak ada database server, dan tidak memakai framework berat. Aplikasi bisa langsung dibuka dari browser serta siap deploy ke GitHub Pages atau Netlify.

## Target User

Tools ini dibuat untuk:

- Affiliator pemula yang sudah punya produk atau link affiliate.
- Kreator kecil yang ingin membuat konten promosi lebih konsisten.
- Seller atau affiliator yang bingung memilih angle jualan.
- Orang yang caption, hook, CTA, dan script videonya sering terasa kaku.
- Pengguna yang butuh output praktis, bukan teori panjang tentang affiliate marketing.

## Masalah yang Diselesaikan

Affiliate Promo Assistant membantu saat user:

- Bingung memulai promosi dari produk yang sudah dimiliki.
- Sulit membuat angle promosi yang tidak terlihat maksa.
- Caption promosi terasa kaku, terlalu hard selling, atau kurang relate.
- Hook konten kurang kuat untuk menghentikan scroll.
- CTA tidak jelas atau terlalu agresif.
- Stuck membuat script video pendek untuk TikTok, Reels, Shorts, dan Threads.
- Bingung membalas komentar atau DM seperti “linknya mana?”, “harga berapa?”, “worth it ga?”, dan “mahal”.
- Butuh ide konten harian agar promosi affiliate lebih konsisten.
- Ingin menghitung target komisi dan jumlah order yang realistis.

## Fitur Lengkap

1. **Dashboard**
   - Ringkasan manfaat tools.
   - Quick access ke semua fitur.
   - Cara pakai 3 langkah.
   - Badge: No API, Bisa dari HP, Affiliate Friendly, Siap Posting, 100% Static.
   - Section “Cocok untuk siapa?”.

2. **Product Angle Finder**
   - Generate 10 angle promosi produk.
   - Menampilkan pain point pembeli, alasan produk menarik, cara positioning, ide konten, CTA, dan catatan angle termudah untuk pemula.

3. **Affiliate Hook Generator**
   - Generate 30 hook affiliate.
   - Kategori hook: problem aware, curiosity, before-after, review style, soft selling, social proof, beginner friendly, dan clickbait halus.

4. **Caption Affiliate Generator**
   - Generate caption pendek, panjang, soft selling, review jujur, storytelling, Threads, dan TikTok/IG.
   - Tone tersedia: santai, Gen Z, edukatif, soft selling, dan review jujur.

5. **CTA Affiliate Generator**
   - Generate 20 CTA siap pakai.
   - Variasi CTA: halus, direct, Gen Z, urgent tapi tidak maksa, komentar Threads, cek bio, checkout, dan follow up.

6. **Script Video Affiliate**
   - Generate 5 script video pendek.
   - Output mencakup opening 3 detik pertama, alur scene, teks overlay, voice over, CTA akhir, ide visual/B-roll, dan caption pendukung.

7. **Ide Konten Affiliate 30 Hari**
   - Kalender konten hari ke-1 sampai 30.
   - Setiap hari berisi tema, hook, format, caption singkat, CTA, tujuan konten, dan platform.

8. **Komentar & DM Reply Assistant**
   - Template balasan untuk komentar “mau”, pertanyaan harga, pertanyaan link, keberatan mahal, rekomendasi, keraguan produk, cara beli, follow up, closing komentar, closing DM, dan after sales.

9. **Komisi & Target Calculator**
   - Menghitung komisi per order.
   - Menghitung target order harian, mingguan, dan bulanan.
   - Menghitung estimasi penghasilan harian, mingguan, dan bulanan.
   - Memberikan catatan strategi serta saran produk low ticket, mid ticket, dan high ticket.

10. **Product Review Builder**
    - Generate review pendek dan panjang.
    - Menampilkan poin plus, poin minus, siapa yang cocok beli, siapa yang kurang cocok, kesimpulan review, CTA soft selling, versi Threads, dan versi TikTok/IG caption.

11. **Riwayat**
    - Menyimpan hasil generate ke localStorage.
    - Menampilkan nama fitur, tanggal, dan preview hasil.
    - Bisa copy ulang, export ulang ke `.txt`, hapus satu item, atau hapus semua.

## Fitur Global

- 100% static dan berjalan langsung di browser.
- Mobile-first dengan bottom navigation untuk HP.
- Sidebar dashboard untuk desktop.
- Output tampil dalam card rapi.
- Tombol copy di setiap hasil.
- Tombol export `.txt` di setiap hasil.
- Toast notification untuk copy, export, generate, dan hapus riwayat.
- Empty state saat belum ada hasil.
- Loading state singkat saat generate.
- Validasi input kosong dengan pesan yang jelas.
- Semua output dibuat dinamis dari template JavaScript.

## Cara Pakai

1. Buka `index.html` di browser.
2. Pilih tools yang dibutuhkan dari dashboard, sidebar, atau bottom navigation.
3. Isi input seperti nama produk, target pembeli, masalah pembeli, benefit, harga, atau link affiliate.
4. Klik tombol **Generate Hasil Siap Pakai**.
5. Copy hasil atau export ke file `.txt`.
6. Gunakan output untuk konten TikTok, Reels, Shorts, Threads, caption, komentar, atau DM.

## Deploy ke GitHub Pages

1. Push project ke repository GitHub.
2. Buka menu **Settings** repository.
3. Pilih **Pages**.
4. Pada bagian **Build and deployment**, pilih source dari branch utama, misalnya `main`.
5. Pilih folder root `/` karena file `index.html` berada di root repository.
6. Simpan konfigurasi dan tunggu GitHub Pages membuat URL publik.

## Deploy ke Netlify

1. Login ke Netlify.
2. Pilih **Add new site** lalu **Import an existing project**.
3. Hubungkan repository GitHub yang berisi project ini.
4. Untuk build command, kosongkan saja karena project ini static vanilla.
5. Untuk publish directory, isi dengan root project atau `.`.
6. Klik **Deploy**.

## Catatan Teknis

- Tools ini **100% static**.
- Tidak menggunakan backend.
- Tidak menggunakan API.
- Tidak menggunakan database server.
- Riwayat hanya disimpan di `localStorage` browser user.
- Cocok untuk deployment statis seperti GitHub Pages, Netlify, Vercel static hosting, atau hosting file biasa.
