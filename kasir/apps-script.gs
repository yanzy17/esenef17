/**
 * Kasir Sederhana — Google Apps Script backend (Web App).
 *
 * Cara pakai (singkat — selengkapnya di SETUP.md):
 *  1. Buka Google Sheet baru, beri nama (mis. "Kasir Toko Saya").
 *  2. Extensions ▸ Apps Script.
 *  3. Hapus isi default Code.gs, tempel SELURUH file ini, lalu Save (💾).
 *  4. Run ▸ pilih fungsi `setupSheet` ▸ Run. Authorize jika diminta:
 *     - Klik "Review permissions" ▸ pilih akun Google ▸ "Advanced" ▸
 *       "Go to (unsafe)" ▸ Allow. Ini hanya satu kali.
 *  5. Deploy ▸ New deployment ▸ ⚙️ Web app.
 *     - Description: bebas
 *     - Execute as: **Me**
 *     - Who has access: **Anyone**  (penting agar app web bisa POST)
 *     - Klik Deploy ▸ Authorize access ▸ Done.
 *  6. Copy URL Web App (yang berakhiran `/exec`).
 *  7. Buka aplikasi Kasir ▸ Pengaturan ▸ tempel URL ▸ Test Koneksi ▸ Simpan.
 *
 * Catatan penting:
 *  - Setiap kali kamu mengubah kode di sini, jalankan Deploy ▸ Manage
 *    deployments ▸ ✏️ ▸ Version: New version ▸ Deploy. URL tidak berubah.
 *  - Fungsi doPost membaca body sebagai TEXT (bukan JSON header), agar
 *    klien web tidak terkena CORS preflight ke domain Google.
 */

const SHEET_NAME = "Transaksi";
const HEADERS = [
  "Waktu", "ID Transaksi", "Customer", "Metode Bayar",
  "Subtotal", "Diskon", "Total",
  "Tunai Diterima", "Kembalian",
  "Items", "Catatan", "Sumber"
];

/**
 * Endpoint GET — membantu user memverifikasi URL aktif.
 * Buka URL Web App di browser; harusnya muncul JSON status.
 */
function doGet(e) {
  return jsonOut({ ok: true, app: "Kasir Sederhana", version: 1 });
}

/**
 * Endpoint POST — menerima JSON dari aplikasi Kasir.
 * Klien mengirim body sebagai plain text (tanpa Content-Type header
 * agar tidak memicu CORS preflight). Body dibaca dari e.postData.contents.
 */
function doPost(e) {
  try {
    const raw = (e && e.postData && e.postData.contents) ? e.postData.contents : "{}";
    const payload = JSON.parse(raw);

    if (payload.type === "ping") {
      return jsonOut({ ok: true, message: "connected" });
    }

    // Default: anggap ini transaksi
    const trx = payload.transaction || payload;
    const items = Array.isArray(trx.items) ? trx.items : [];
    const itemsString = items.map(function (it) {
      return (it.name || "") + " x" + (it.qty || 0) + " @" + (it.price || 0);
    }).join(" | ");

    const sheet = ensureSheet_();
    sheet.appendRow([
      formatTime_(trx.datetime || new Date().toISOString()),
      trx.id || "",
      trx.customer || "",
      trx.payment || "",
      Number(trx.subtotal || 0),
      Number(trx.discount || 0),
      Number(trx.total || 0),
      Number(trx.cashReceived || 0),
      Number(trx.change || 0),
      itemsString,
      trx.note || "",
      payload.source || "Kasir Sederhana Web"
    ]);

    return jsonOut({ ok: true, id: trx.id || "" });
  } catch (err) {
    return jsonOut({ ok: false, error: String(err) });
  }
}

/**
 * Buat sheet "Transaksi" + header row jika belum ada.
 * Jalankan dari editor Apps Script: Run ▸ setupSheet.
 */
function setupSheet() {
  const sheet = ensureSheet_();
  SpreadsheetApp.flush();
  return "Sheet siap. Header row: " + HEADERS.join(", ");
}

/* ----------------------------- helpers --------------------------------- */

function ensureSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  // Pastikan header row ada
  const firstRow = sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0];
  const empty = firstRow.every(function (v) { return v === "" || v == null; });
  if (empty) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function jsonOut(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function formatTime_(iso) {
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    // Format: dd/MM/yyyy HH:mm:ss (zona waktu sheet)
    return Utilities.formatDate(d, Session.getScriptTimeZone(), "dd/MM/yyyy HH:mm:ss");
  } catch (e) {
    return iso;
  }
}
