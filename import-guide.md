# Import Guide — Digital Seller OS ke Notion

Panduan ini dibuat supaya kamu bisa memindahkan semua database CSV ke Notion, lalu menyusunnya jadi dashboard siap duplicate dan siap dijual.

## 1. Persiapan File

Pastikan folder `csv/` berisi 10 file:

- `produk-digital.csv`
- `ide-produk.csv`
- `content-planner.csv`
- `hook-library.csv`
- `cta-library.csv`
- `affiliate-tracker.csv`
- `order-testimoni.csv`
- `income-tracker.csv`
- `prompt-ai-library.csv`
- `action-plan-30-hari.csv`

## 2. Step by Step Import CSV ke Notion

1. Buka workspace Notion.
2. Buat page baru dengan nama **Digital Seller OS**.
3. Klik menu **Import** di sidebar.
4. Pilih **CSV**.
5. Upload satu file CSV dari folder `csv/`.
6. Setelah masuk, rename database sesuai nama database.
7. Ulangi sampai semua CSV berhasil di-import.

## 3. Cara Bikin Database dari CSV

- Untuk setiap CSV, Notion otomatis membuat table database.
- Rename title column agar sesuai header utama, misalnya `Nama Produk` untuk Produk Digital.
- Pindahkan database ke dalam page utama atau buat linked database di dashboard.
- Tambahkan icon sederhana untuk tiap database agar mudah dibaca.

## 4. Cara Rename dan Atur Tipe Kolom

Rekomendasi tipe kolom:

| Kolom | Tipe Notion |
|---|---|
| Tanggal / Tanggal Upload | Date |
| Harga / Nominal / Pemasukan / Biaya / Profit | Number |
| Link File / Link Jualan / Link Post / Link Konten | URL |
| Status | Select |
| Platform | Select / Multi-select |
| Catatan | Text |

## 5. Cara Bikin View

### Table View

Cocok untuk edit data cepat. Gunakan di semua database.

### Board View

Cocok untuk:

- Produk Digital by Status.
- Content Planner by Status.
- Affiliate Tracker by Status Konten.
- 30 Hari Action Plan by Status.

### Calendar View

Cocok untuk:

- Content Planner by Tanggal.
- Produk Digital by Tanggal Upload.
- Income Tracker by Tanggal.

### Gallery View

Cocok untuk:

- Produk Digital dengan preview cover.
- Ide Produk berdasarkan niche.
- Prompt AI Library untuk swipe cepat.

## 6. Cara Bikin Dashboard Utama

1. Copy isi `notion-template.md` ke page utama Notion.
2. Buat heading: Produk Saya, Ide Produk, Content Planner, Affiliate Tracker, Order, Income, Prompt, Action Plan.
3. Di bawah tiap heading, ketik `/linked database`.
4. Pilih database yang sesuai.
5. Tambahkan filter dan view agar dashboard terasa rapi.

## 7. Cara Pakai di HP

- Gunakan view Table untuk input cepat.
- Pakai Calendar untuk cek jadwal posting.
- Simpan Quick Links di bagian atas.
- Hindari terlalu banyak kolom di satu view; buat view “Input Cepat” yang hanya berisi kolom penting.

## 8. Formula Income Tracker

Di database **Income Tracker**, ubah kolom Profit menjadi Formula jika ingin otomatis:

```notion
prop("Pemasukan") - prop("Biaya")
```

Untuk total bulanan:

1. Buat view baru bernama `Bulan Ini`.
2. Filter `Tanggal` berada dalam bulan ini.
3. Pada kolom `Pemasukan`, pilih `Calculate → Sum`.
4. Pada kolom `Profit`, pilih `Calculate → Sum`.

## 9. Cara Duplicate Template Setelah Jadi

1. Pastikan page utama sudah rapi dan semua database ada.
2. Klik **Share**.
3. Aktifkan **Publish** jika ingin share via link publik.
4. Aktifkan opsi **Allow duplicate as template**.
5. Test pakai akun lain atau workspace lain.
6. Setelah aman, masukkan link duplicate ke Lynk ID/Gumroad/marketplace digital.
