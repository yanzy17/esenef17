# Kasir Sederhana — Panduan Setup

> Aplikasi POS / kasir ringan yang berjalan di browser (offline-friendly) dan otomatis menyimpan transaksi ke Google Sheets melalui Google Apps Script.
>
> Aplikasi ini hidup di `/esenef17/kasir/` — terpisah dari **Buku Keuangan Digital** (App 1) yang ada di root `/esenef17/`. Data lokal masing-masing aplikasi disimpan di **localStorage** dengan _namespace_ yang berbeda, jadi tidak saling tabrakan.

URL aplikasi (jika di-host di GitHub Pages):
- App 1 — Buku Keuangan: `https://yanzy17.github.io/esenef17/`
- App 2 — Kasir Sederhana: `https://yanzy17.github.io/esenef17/kasir/`

---

## Install sebagai PWA terpisah

Aplikasi ini bisa di-install sebagai PWA terpisah dari Buku Keuangan. Buka URL `/kasir/` di Chrome/Safari → menu titik tiga → **"Install app"** / **"Tambah ke Layar Utama"**. Setelah patch ini, Kasir akan muncul sebagai aplikasi tersendiri di home screen (ikon, nama, dan jendela aplikasinya sendiri), bukan menyatu dengan Buku Keuangan. Dua aplikasi tetap independen — masing-masing punya `manifest.id`, `scope`, dan service worker sendiri, sehingga browser memperlakukannya sebagai dua PWA berbeda.

---

## 1. Apa yang Akan Kita Setup

1. Buat satu Google Sheet kosong sebagai database transaksi.
2. Tempel kode `apps-script.gs` ke editor Apps Script milik Sheet itu.
3. Deploy sebagai **Web App** untuk dapat URL endpoint.
4. Tempel URL itu ke aplikasi Kasir → Pengaturan.
5. Selesai. Setiap transaksi otomatis muncul sebagai baris baru di Sheet.

---

## 2. Bikin Google Sheet & Apps Script

### Langkah 2.1 — Bikin Sheet baru

1. Buka [sheets.new](https://sheets.new) (atau Google Drive → Baru → Spreadsheet).
2. Beri nama, mis. **"Kasir Toko Saya"**.

### Langkah 2.2 — Buka editor Apps Script

1. Di Sheet, klik menu **Extensions** → **Apps Script**.
2. Tab baru terbuka berisi file `Code.gs` default berisi `function myFunction() {}`.

### Langkah 2.3 — Tempel kode

1. Hapus seluruh isi `Code.gs`.
2. Buka file `apps-script.gs` dari folder ini, **copy semua** isinya, lalu **paste** ke editor.
3. Klik ikon 💾 (Save). Kalau diminta nama project, isi mis. **"Kasir Sederhana"**.

### Langkah 2.4 — Authorize & buat sheet header

1. Di editor Apps Script, di toolbar atas, pilih fungsi **`setupSheet`** dari dropdown.
2. Klik **Run** (▶).
3. Akan muncul dialog "Authorization required".

   ```
   ┌─────────────────────────────────────┐
   │ Authorization required              │
   │                                     │
   │ This project requires permission... │
   │                                     │
   │ [Cancel]      [Review permissions]  │
   └─────────────────────────────────────┘
   ```

4. Klik **Review permissions** → pilih akun Google kamu.
5. Akan muncul layar peringatan **"Google hasn't verified this app"**. Ini normal untuk Apps Script pribadi.

   - Klik **Advanced** (kiri bawah).
   - Klik **Go to "Kasir Sederhana" (unsafe)**.
   - Klik **Allow**.

6. Tab eksekusi akan menulis log seperti `Sheet siap. Header row: Waktu, ID Transaksi, ...`.

7. Buka tab Sheet kamu → harusnya sekarang ada sheet bernama **"Transaksi"** dengan baris header.

---

## 3. Deploy sebagai Web App

### Langkah 3.1 — Mulai deploy

1. Di editor Apps Script, klik tombol **Deploy** (kanan atas) → **New deployment**.
2. Klik ikon ⚙️ (gear) di samping "Select type" → pilih **Web app**.

### Langkah 3.2 — Konfigurasi

```
Description     : Kasir Sederhana v1            (bebas)
Execute as      : Me (email kamu)               <-- WAJIB
Who has access  : Anyone                        <-- WAJIB
```

> ⚠️ **"Who has access" harus "Anyone"**. Kalau di-set ke "Anyone with Google account" atau "Only myself", aplikasi web tidak akan bisa POST tanpa login Google.
>
> Endpoint hanya menerima JSON dari aplikasi kamu — Google tidak meng-_index_ URL ini, dan tidak mengekspos data Sheet kamu.

### Langkah 3.3 — Authorize lagi

1. Klik **Deploy**.
2. Akan muncul lagi authorization. Ulangi: **Advanced** → **Go to (unsafe)** → **Allow**.

### Langkah 3.4 — Copy URL

1. Setelah selesai, dialog menampilkan **Web app URL** seperti:

   ```
   https://script.google.com/macros/s/AKfycbx................../exec
   ```

2. Klik **Copy**, lalu klik **Done**.

### Langkah 3.5 — Verifikasi (opsional)

Buka URL itu di browser. Harusnya muncul JSON kecil:

```json
{"ok":true,"app":"Kasir Sederhana","version":1}
```

Kalau muncul layar login Google atau error, berarti **"Who has access"** belum di-set ke "Anyone" — ulangi langkah 3.2.

---

## 4. Sambungkan ke Aplikasi Kasir

1. Buka aplikasi Kasir di browser (`/kasir/`).
2. Pergi ke menu **Pengaturan** (⚙️).
3. Di section **Sinkronisasi Google Sheets**, paste URL `/exec` tadi ke kolom **Apps Script Web App URL**.
4. Klik **Simpan URL**.
5. Klik **Test Koneksi** → harusnya muncul toast "Terhubung ✓".
6. (Opsional) isi **Profil Toko** untuk header struk.

Selesai. Coba catat satu transaksi dummy, lalu cek Sheet — baris baru harus muncul dalam ±2 detik.

---

## 5. Bagaimana Sinkronisasi Bekerja

- Setiap transaksi yang kamu **Catat** disimpan dulu ke `localStorage` (offline-first).
- Kalau ada koneksi internet **dan** URL Apps Script sudah disetel, aplikasi akan POST transaksi itu ke Apps Script. Kalau berhasil, transaksi ditandai `synced ✓`.
- Kalau gagal (offline / URL salah / belum di-deploy), transaksi tetap aman di lokal dan muncul sebagai **`⟳ Pending`** di Riwayat.
- Saat browser kembali online, atau saat kamu menekan **Sinkron Sekarang** di Pengaturan / Dashboard, semua transaksi pending dikirim berurutan.

Indikator status di pojok kanan atas menunjukkan jumlah pending real-time.

---

## 6. Troubleshooting

### "Test Koneksi" muncul error / toast merah

| Gejala | Kemungkinan penyebab | Solusi |
|---|---|---|
| `HTTP 401` / `403` | "Who has access" bukan "Anyone" | Deploy ulang dengan setting yang benar (langkah 3.2). |
| `HTTP 404` | URL salah ketik atau bukan `/exec` | Pastikan URL diakhiri `/exec`, bukan `/dev`. |
| Toast merah `Failed to fetch` | Offline atau URL diblokir jaringan | Cek koneksi. Beberapa kantor mem-blokir `script.google.com`. |
| Toast merah `Gagal: ...CORS...` | Kamu menambahkan header `Content-Type` di kode kustom | Aplikasi default sudah aman. Jangan tambahkan header `Content-Type` saat fetch — itu memicu preflight yang Apps Script tidak bisa balas. |

### Transaksi tidak muncul di Sheet

1. Cek Riwayat — apakah transaksi tercatat lokal? Kalau iya, ini murni masalah sync.
2. Cek apakah indikator atas menunjukkan "X belum sinkron".
3. Pengaturan → klik **Sinkron Sekarang** → lihat toast hasilnya.
4. Buka URL Web App di browser secara langsung. Harus return JSON status.
5. Kalau perlu, di Apps Script → **Executions** (ikon jam) — kamu bisa lihat log POST yang masuk plus error-nya.

### Saya update kode Apps Script tapi perilaku tidak berubah

Kamu harus **redeploy** setelah edit:

1. Apps Script → **Deploy** → **Manage deployments**.
2. Klik ikon ✏️ (Edit) di deployment yang aktif.
3. Di "Version" pilih **New version**.
4. Klik **Deploy**.

URL tetap sama. Versi lama otomatis ditimpa.

### Saya kena "Authorization required" lagi

Itu normal kalau scope berubah (mis. kamu menambah API baru). Klik **Review permissions** → **Advanced** → **Go to (unsafe)** → **Allow**.

### Reset semuanya

- Aplikasi Kasir → Pengaturan → **Reset Semua Data** (ketik `RESET` untuk konfirmasi). Hanya menghapus data **lokal** — Sheet di Google tidak ikut terhapus.
- Untuk hapus Sheet: hapus manual dari Google Drive.

---

## 7. Format kolom Sheet

Sheet **"Transaksi"** punya kolom:

| Kolom | Isi |
|---|---|
| `Waktu` | `dd/MM/yyyy HH:mm:ss` zona waktu skrip |
| `ID Transaksi` | UUID lokal (mis. `trx-1730000000000-xxxxx`) |
| `Customer` | Nama pelanggan (boleh kosong) |
| `Metode Bayar` | `Cash`, `QRIS`, `Transfer Bank`, `GoPay`, dll. |
| `Subtotal` | Total sebelum diskon |
| `Diskon` | Nilai diskon (rupiah) |
| `Total` | `Subtotal − Diskon` |
| `Tunai Diterima` | Untuk metode Cash |
| `Kembalian` | Untuk metode Cash |
| `Items` | `Nama xQty @Price` digabung dengan ` \| ` |
| `Catatan` | Bebas |
| `Sumber` | `Kasir Sederhana Web` |

Kamu bebas menambahkan formula / pivot / chart di tab lain di Sheet yang sama tanpa mengganggu skrip.

---

## 8. Backup

- Pengaturan → **Export JSON** → simpan satu file backup penuh (produk + transaksi + pengaturan).
- Pengaturan → **Export CSV** → CSV transaksi (untuk Excel / Numbers / Sheets).
- Sheet sendiri sudah berfungsi sebagai cloud backup live.

---

## 9. FAQ

**Apakah aman menyimpan URL Apps Script di browser?**
URL itu hanya menulis ke Sheet milik kamu sendiri. Kalau URL bocor, orang lain bisa mengirim row sampah ke Sheet kamu — tidak bisa membacanya. Mitigasi paling sederhana: redeploy untuk dapat URL baru.

**Apakah perlu service worker / PWA?**
Tidak wajib. Aplikasi sudah bekerja offline lewat localStorage. Kamu boleh "Add to Home Screen" di Android/iOS untuk pengalaman aplikasi penuh.

**Bisa multi-device?**
Bisa — tiap device punya data lokal masing-masing, dan semuanya menulis ke Sheet yang sama. Untuk membaca dari Sheet ke device baru, fitur "import" belum tersedia di v1; gunakan Export JSON untuk pindah data lokal.

**Bisa pakai bersama App 1 (Buku Keuangan)?**
Tentu — keduanya independen. Buku Keuangan untuk catatan keuangan harian, Kasir untuk transaksi POS. Dua-duanya simpan data di browser yang sama tapi key terpisah.
