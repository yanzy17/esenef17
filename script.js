const STORAGE_KEY = "digitalSellerSuperToolsHistoryV2";
let currentExport = { feature: "Dashboard", title: "Digital Seller Super Tools", text: "Belum ada hasil aktif." };
let toastTimer;

const tools = [
  { id: "dashboard", icon: "🏠", title: "Dashboard", desc: "Ringkasan, cara pakai, dan quick action." },
  { id: "product", icon: "💡", title: "Product Idea", desc: "10 ide produk digital lengkap dengan offer angle." },
  { id: "affiliate", icon: "🤝", title: "Affiliate Content", desc: "Hook, caption, CTA, video, Threads, dan angle." },
  { id: "hook", icon: "🪝", title: "Hook", desc: "30+ hook casual untuk IG, TikTok, Threads." },
  { id: "caption", icon: "✍️", title: "Caption + CTA", desc: "Caption multi-platform dan variasi CTA." },
  { id: "dm", icon: "💬", title: "DM Reply", desc: "Template balasan DM realistis dan ramah." },
  { id: "pricing", icon: "💸", title: "Pricing", desc: "Profit, target, range harga, dan diskon." },
  { id: "calendar", icon: "🗓️", title: "Calendar", desc: "Kalender konten 30 hari yang niat." },
  { id: "offer", icon: "🧲", title: "Offer", desc: "Halaman penawaran mini yang siap pakai." },
  { id: "license", icon: "🛡️", title: "License", desc: "Teks lisensi produk digital yang rapi." },
  { id: "description", icon: "🛍️", title: "Description", desc: "Deskripsi produk untuk Lynk ID/Gumroad." },
  { id: "threads", icon: "🧵", title: "Threads", desc: "Post Threads, komentar, CTA, hook aman." },
  { id: "history", icon: "🗃️", title: "Riwayat", desc: "Copy, export, dan hapus hasil tersimpan." }
];
const bottomIds = ["dashboard", "product", "affiliate", "threads", "history"];
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const clean = value => String(value || "").trim();
const escapeHtml = value => String(value).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[c]));
const rupiah = value => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Number(value) || 0);
const pick = array => array[Math.floor(Math.random() * array.length)];
const cycle = (array, index) => array[index % array.length];

const banks = {
  formats: ["ebook praktis", "template Canva", "Notion dashboard", "mini course video", "workbook interaktif", "spreadsheet otomatis", "bundle prompt", "audio class", "challenge 7 hari", "starter kit digital"],
  platforms: ["Lynk ID", "Gumroad", "Karyakarsa", "Instagram DM", "WhatsApp Catalog", "Shopee digital", "Google Drive + payment link", "Notion marketplace", "landing page Netlify", "bio link"],
  bonuses: ["checklist eksekusi", "template caption", "mini video tutorial", "prompt bonus", "contoh studi kasus", "tracker progres", "swipe file DM", "akses update 30 hari", "worksheet validasi", "script konten"],
  goals: ["edukasi", "trust", "promosi", "storytelling", "engagement"],
  contentFormats: ["carousel", "video 30 detik", "screen record", "talking head", "Threads pendek", "before-after", "mini tutorial", "checklist post"],
  ctas: ["Ketik MAU kalau mau detailnya.", "DM aku kata INFO biar aku kirim preview.", "Cek link di bio, baca dulu detailnya.", "Save dulu kalau belum sempat eksekusi.", "Komentar PRODUK kalau mau aku bantu arahkan.", "Share ke teman yang butuh ini juga.", "Ambil sekarang kalau sudah cocok dengan kebutuhanmu.", "Tanya dulu boleh, nggak harus langsung beli.", "Klik link bio sebelum bonusnya ditutup.", "Balas postingan ini kalau mau versi checklist."],
  tones: ["jujur", "santai", "nggak maksa", "to the point", "pemula friendly", "lebih rapi", "lebih hemat waktu"]
};

function init() {
  renderNav();
  bindGlobalClicks();
  bindForms();
  renderAllEmptyStates();
}

function renderNav() {
  const navHtml = tools.map(t => `<button class="nav-btn${t.id === "dashboard" ? " active" : ""}" data-tab="${t.id}" type="button"><span>${t.icon}</span><span class="nav-label">${t.title}</span></button>`).join("");
  $("#sideNav").innerHTML = navHtml;
  $("#bottomNav").innerHTML = tools.filter(t => bottomIds.includes(t.id)).map(t => `<button class="nav-btn${t.id === "dashboard" ? " active" : ""}" data-tab="${t.id}" type="button"><span>${t.icon}</span><span class="nav-label">${t.title}</span></button>`).join("");
  $("#quickActions").innerHTML = tools.filter(t => !["dashboard", "history"].includes(t.id)).map(t => `
    <article class="feature-card">
      <span class="card-icon">${t.icon}</span>
      <h3>${t.title}</h3>
      <p>${t.desc}</p>
      <span class="mini-badge">Buka tool</span>
      <button class="card-link" data-tab="${t.id}" type="button" aria-label="Buka ${t.title}"></button>
    </article>`).join("");
}

function bindGlobalClicks() {
  document.addEventListener("click", event => {
    const tabTarget = event.target.closest("[data-tab]");
    if (tabTarget) switchTab(tabTarget.dataset.tab);

    const copyTarget = event.target.closest("[data-copy]");
    if (copyTarget && !copyTarget.matches("[data-export-single]")) copyText(decodeURIComponent(copyTarget.dataset.copy));

    const exportTarget = event.target.closest("[data-export-single]");
    if (exportTarget) exportText(exportTarget.dataset.feature, exportTarget.dataset.title, decodeURIComponent(exportTarget.dataset.copy));

    const deleteTarget = event.target.closest("[data-delete-history]");
    if (deleteTarget) deleteHistoryItem(deleteTarget.dataset.deleteHistory);
  });
  $("#exportBtn").addEventListener("click", () => exportText(currentExport.feature, currentExport.title, currentExport.text));
  $("#clearHistory").addEventListener("click", () => { setHistory([]); renderHistory(); showToast("Semua riwayat dihapus"); });
}

function switchTab(tabId) {
  $$(".tab-panel").forEach(panel => panel.classList.toggle("active", panel.id === tabId));
  $$(".nav-btn").forEach(btn => btn.classList.toggle("active", btn.dataset.tab === tabId));
  const tool = tools.find(t => t.id === tabId) || tools[0];
  $("#pageTitle").textContent = tool.title;
  if (tabId === "history") renderHistory();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function bindForms() {
  $$(".tool-form").forEach(form => {
    form.addEventListener("submit", event => {
      event.preventDefault();
      const { data, missing } = getFormData(form);
      if (missing) return showError(form, "Isi semua kolom dulu ya. Makin jelas inputnya, makin siap pakai hasilnya.");
      clearError(form);
      const type = form.dataset.generator;
      const output = $(`[data-output="${type}"]`);
      output.innerHTML = loadingState("Lagi nyusun hasil yang lebih niat...");
      setTimeout(() => {
        const result = generators[type](data);
        currentExport = { feature: getToolTitle(type), title: result.title, text: result.text };
        output.innerHTML = resultCard({ ...result, feature: getToolTitle(type) });
        saveHistory({ id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()), type, feature: getToolTitle(type), ...result, createdAt: new Date().toISOString() });
        showToast("Hasil berhasil dibuat");
        output.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 420);
    });
  });
}

function getFormData(form) {
  const data = Object.fromEntries(new FormData(form).entries());
  const missing = Object.keys(data).find(key => !clean(data[key]));
  return { data, missing };
}
function showError(form, message) { clearError(form); form.insertAdjacentHTML("afterbegin", `<div class="form-error">${message}</div>`); }
function clearError(form) { form.querySelector(".form-error")?.remove(); }
function getToolTitle(id) { return tools.find(t => t.id === id)?.title || id; }

function renderAllEmptyStates() {
  $$(".output-wrap").forEach(wrap => wrap.innerHTML = emptyState("Belum ada hasil", "Isi form di atas lalu klik generate. Hasilnya akan muncul di sini dengan format yang rapi."));
}
function emptyState(title, desc) { return `<div class="empty-state"><div class="card-icon" style="margin:0 auto 12px">✨</div><strong>${title}</strong><p>${desc}</p></div>`; }
function loadingState(text) { return `<div class="loading-state"><div class="spinner"></div>${text}</div>`; }

function resultCard(result) {
  return `<article class="result-card">
    <div class="result-top">
      <div class="result-title"><span class="mini-badge">${escapeHtml(result.feature)}</span><h3>${escapeHtml(result.title)}</h3><p>${new Date().toLocaleString("id-ID")} • siap copy & export</p></div>
      <div class="result-actions">
        <button class="copy-btn" type="button" data-copy="${encodeURIComponent(result.text)}">Copy hasil</button>
        <button class="copy-btn" type="button" data-export-single data-feature="${escapeHtml(result.feature)}" data-title="${escapeHtml(result.title)}" data-copy="${encodeURIComponent(result.text)}">Export .txt</button>
      </div>
    </div>
    <div class="result-grid">${result.html}</div>
  </article>`;
}

function sectionCard(title, items, ordered = false) {
  const tag = ordered ? "ol" : "ul";
  return `<section class="mini-card"><h4>${escapeHtml(title)}</h4><${tag}>${items.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</${tag}></section>`;
}
function textSections(sections) { return sections.map(s => `${s.title}\n${s.items.map((item, i) => `${i + 1}. ${item}`).join("\n")}`).join("\n\n"); }
function cardsResult(title, sections) { return { title, html: sections.map(s => sectionCard(s.title, s.items, s.ordered)).join(""), text: textSections(sections) }; }
function tableResult(title, columns, rows) {
  const html = `<section class="mini-card"><h4>${escapeHtml(title)}</h4><table class="data-table"><thead><tr>${columns.map(c => `<th>${escapeHtml(c)}</th>`).join("")}</tr></thead><tbody>${rows.map(r => `<tr>${r.map(c => `<td>${escapeHtml(c)}</td>`).join("")}</tr>`).join("")}</tbody></table></section>`;
  const text = rows.map((row, i) => `${i + 1}. ${columns.map((c, j) => `${c}: ${row[j]}`).join(" | ")}`).join("\n");
  return { title, html, text };
}

const generators = {
  product(data) {
    const niche = clean(data.niche), audience = clean(data.audience), level = clean(data.level);
    const rows = Array.from({ length: 10 }, (_, i) => {
      const format = cycle(banks.formats, i), base = level === "expert" ? 89000 : level === "intermediate" ? 59000 : 39000;
      return [
        `${niche} ${cycle(["Shortcut Kit", "Profit Blueprint", "Starter Vault", "Action Pack", "Mini OS"], i)}`,
        format,
        `${audience} level ${level} yang mau hasil praktis tanpa mulai dari nol.`,
        cycle(["bingung mulai", "proses masih berantakan", "konten tidak konsisten", "belum punya sistem", "takut salah langkah"], i),
        `Memberi alur step-by-step agar ${audience} bisa memakai ${niche} untuk progres yang lebih rapi.`,
        `Panduan utama, contoh nyata, worksheet, template, dan checklist eksekusi ${niche}.`,
        cycle(banks.bonuses, i), rupiah(base + i * 18000), cycle(["Mudah", "Mudah-menengah", "Menengah", "Butuh riset contoh", "Cepat dibuat"], i), cycle(banks.platforms, i),
        cycle(["hemat waktu", "pemula friendly", "hasil cepat terlihat", "anti bingung", "dari HP"], i),
        `Potensial karena ${audience} biasanya butuh solusi yang langsung bisa dipakai, bukan teori panjang.`
      ];
    });
    const cols = ["Nama catchy", "Format", "Target", "Masalah", "Solusi", "Isi produk", "Bonus", "Harga", "Kesulitan", "Platform", "Angle", "Alasan laku"];
    return tableResult(`10 Ide Produk Digital untuk ${niche}`, cols, rows);
  },

  affiliate(data) {
    const p = clean(data.productName), buyer = clean(data.buyer), problem = clean(data.problem), benefit = clean(data.benefit), tone = clean(data.tone);
    const lead = { santai: "Santai aja", "gen z": "No debat", edukatif: "Kalau dibedah", "soft selling": "Kalau kamu lagi cari cara ringan", urgent: "Sebelum waktumu makin kebuang" }[tone] || "Jujur";
    const make = (n, fn) => Array.from({ length: n }, (_, i) => fn(i));
    return cardsResult(`Paket Konten Affiliate - ${p}`, [
      { title: "15 Hook", items: make(15, i => `${lead}, ${cycle(["ini alasan", "ternyata", "banyak yang belum sadar", "cara paling realistis", "kesalahan kecil"], i)} ${buyer} masih stuck karena ${problem}.`) },
      { title: "10 Caption Pendek", items: make(10, i => `${cycle(["Reminder", "Quick note", "Jujur aja", "Kalau relate", "Biar nggak muter-muter"], i)}: ${p} bantu ${buyer} ${benefit}. Cocok buat yang mau mulai lebih rapi.`) },
      { title: "5 Caption Storytelling", items: make(5, i => `Dulu banyak ${buyer} mikir masalahnya kurang niat. Padahal seringnya karena belum punya panduan. Saat ${problem}, ${p} bisa jadi jalan pintas yang tetap masuk akal karena ${benefit}.`) },
      { title: "5 Caption Soft Selling", items: make(5, i => `Kalau kamu lagi cari cara yang lebih ringan buat lepas dari ${problem}, coba cek ${p}. Nggak harus langsung beli, baca dulu detailnya dan lihat apakah cocok.`) },
      { title: "5 Caption Hard Selling Natural", items: make(5, i => `Kalau targetmu adalah ${benefit}, ${p} worth dicoba sekarang. Jangan tunggu makin lama stuck di ${problem}. Klik link bio atau DM INFO.`) },
      { title: "10 CTA", items: make(10, i => cycle(banks.ctas, i)) },
      { title: "10 Ide Video Pendek", items: make(10, i => `${cycle(["POV", "Before-after", "3 kesalahan", "Mini tutorial", "Review jujur", "Screen record"], i)}: ${buyer} dari ${problem} ke ${benefit} pakai ${p}.`) },
      { title: "10 Ide Threads Post", items: make(10, i => `${cycle(["Thread checklist", "Hot take", "Cerita singkat", "Step by step", "Mitos vs fakta"], i)} tentang ${problem}, lalu bridge halus ke ${p}.`) },
      { title: "5 Komentar Lanjutan / Utas", items: make(5, i => `Tambahan: bagian paling penting bukan beli produknya dulu, tapi paham kenapa ${problem} terjadi dan bagaimana ${p} membantu prosesnya.`) },
      { title: "5 Angle Berdasarkan Masalah", items: make(5, i => `${cycle(["waktu habis", "takut gagal", "bingung mulai", "hasil belum rapi", "butuh sistem"], i)} → posisikan ${p} sebagai solusi praktis untuk ${buyer}.`) }
    ]);
  },

  hook(data) {
    const topic = clean(data.topic), audience = clean(data.audience), situation = clean(data.situation);
    const categories = ["Problem aware", "Curiosity", "Result based", "Fear of missing out", "Storytelling", "Social proof", "Soft clickbait", "Beginner friendly"];
    const items = categories.map((cat, ci) => ({ title: cat, items: Array.from({ length: ci < 6 ? 4 : 3 }, (_, i) => {
      const patterns = [
        `Kalau kamu ${audience} dan masih ${situation}, mungkin masalahnya bukan di niat.`,
        `Aku baru sadar ${topic} jadi lebih gampang setelah stop ngelakuin hal ini.`,
        `Cara bikin ${topic} lebih rapi tanpa harus jago dulu.`,
        `Jangan tunggu semua sempurna buat mulai ${topic}.`,
        `Dulu aku kira ${topic} ribet, ternyata yang ribet itu alurnya.`,
        `Banyak ${audience} mulai kebantu setelah punya sistem kecil buat ${topic}.`,
        `Ini bukan trik sulap, tapi bisa bikin ${topic} terasa jauh lebih ringan.`,
        `Versi pemula: mulai ${topic} dari bagian yang paling gampang dulu.`
      ];
      return `${patterns[ci]} ${cycle(["Simpan dulu.", "Coba cek ini.", "Relate nggak?", "Bisa mulai dari HP.", "Nggak perlu overthinking."], i)}`;
    }) }));
    return cardsResult(`30+ Hook untuk ${topic}`, items);
  },

  caption(data) {
    const product = clean(data.product), problem = clean(data.problem), solution = clean(data.solution), promo = clean(data.promo);
    return cardsResult(`Caption + CTA untuk ${product}`, [
      { title: "Caption Threads Pendek", items: [`${problem} sering bikin progress kelihatan lambat. ${product} bantu kamu ${solution}. ${promo}.`] },
      { title: "Caption Threads Versi Utas", items: [`1/ Banyak yang stuck bukan karena malas, tapi karena belum punya sistem.`, `2/ Kalau masalahmu: ${problem}, coba pakai cara yang lebih praktis.`, `3/ ${product} dibuat untuk ${solution}.`, `4/ ${promo}. Kalau mau detail, komentar MAU.`] },
      { title: "Caption IG", items: [`Kalau kamu sering ngerasa ${problem}, mungkin yang kamu butuhkan bukan motivasi tambahan, tapi alat yang jelas. ${product} bantu kamu ${solution}. ${promo}. Cek bio untuk detailnya.`] },
      { title: "Caption TikTok", items: [`POV: kamu stop ribet karena akhirnya punya ${product}. Dari ${problem} jadi lebih kebantu karena ${solution}. ${promo}.`] },
      { title: "CTA Komentar", items: ["Komentar MAU kalau mau aku kirim detail.", "Tulis INFO, nanti aku bantu jelasin cocok atau nggaknya.", "Balas PRODUK kalau mau lihat preview."] },
      { title: "CTA DM", items: ["DM aku kata MAU ya.", "Kalau mau tanya dulu, DM aja. Santai.", "Kirim pesan 'DETAIL' buat lihat isi produknya."] },
      { title: "CTA Cek Bio", items: ["Link akses ada di bio.", "Cek bio buat detail harga dan bonus.", "Aku taruh previewnya di link bio."] },
      { title: "CTA Soft", items: ["Kalau belum butuh sekarang, save dulu aja.", "Cek dulu, siapa tahu cocok buat kebutuhanmu."] },
      { title: "CTA Direct", items: [`Ambil ${product} sekarang kalau kamu mau ${solution}. ${promo}.`] },
      { title: "Versi Lebih Santai", items: [`Kalau kamu capek sama ${problem}, ${product} bisa jadi shortcut yang lumayan ngebantu. Nggak ribet, tinggal pakai dan sesuaikan.`] },
      { title: "Versi Lebih Urgent", items: [`Jangan tunggu makin lama stuck di ${problem}. ${promo}, dan bonus bisa berubah kapan aja.`] },
      { title: "Versi Tanpa Terkesan Jualan", items: [`Aku bikin ${product} karena banyak yang ngalamin ${problem}. Isinya fokus ke ${solution}, jadi bisa dipakai sebagai pegangan praktis.`] }
    ]);
  },

  dm(data) {
    const product = clean(data.product), price = clean(data.price), benefit = clean(data.benefit);
    return cardsResult(`Template DM untuk ${product}`, [
      { title: "Balasan orang komen “mau”", items: [`Hai kak, makasih ya. Ini detail ${product}: ${benefit}. Saat ini ${price}. Mau aku kirim preview isinya juga?`] },
      { title: "Balasan orang tanya harga", items: [`Harganya ${price}, kak. Sudah termasuk akses ${product} dan panduan pakainya. Kalau kebutuhan kakak adalah ${benefit}, ini cocok banget buat mulai.`] },
      { title: "Balasan orang bilang mahal", items: [`Paham kak, tiap orang punya budget beda. Boleh dipikir dulu. Yang bikin worth it, ${product} bantu ${benefit} jadi kakak nggak perlu mulai dari nol terus.`] },
      { title: "Balasan orang minta bukti", items: [`Bisa kak. Aku kirim preview/testimoni yang tersedia ya, biar kakak bisa lihat format ${product} sebelum ambil.`] },
      { title: "Balasan orang cuma nanya doang", items: [`Santai kak, tanya dulu juga nggak apa-apa. Biar aku bantu, kendala terbesar kakak sekarang di bagian apa?`] },
      { title: "Follow up 1", items: [`Hai kak, aku follow up pelan-pelan ya. Kemarin sempat tertarik sama ${product}. Ada yang masih mau ditanyakan?`] },
      { title: "Follow up 2", items: [`Kak, aku info sekali lagi ya. Promo ${price} masih bisa dicek sekarang. Kalau belum cocok, no worries banget.`] },
      { title: "Closing halus", items: [`Kalau kakak merasa ${product} pas buat bantu ${benefit}, boleh langsung ambil sekarang. Nanti kalau bingung mulai dari mana, kabari aku.`] },
      { title: "Pembeli belum transfer", items: [`Hai kak, aku cek pembayaran untuk ${product} belum masuk. Kalau masih jadi ambil, bisa lanjut transfer ya. Kalau ada kendala, bilang aja.`] },
      { title: "Setelah pembeli bayar", items: [`Pembayarannya sudah masuk kak, makasih ya. Ini akses ${product}. Coba cek dulu, kalau link/file bermasalah kabari aku.`] },
      { title: "After sales", items: [`Gimana kak, sudah sempat buka ${product}? Kalau bingung mulai dari bagian mana, saran aku mulai dari bagian yang paling dekat dengan kebutuhan kakak dulu.`] }
    ]);
  },

  pricing(data) {
    const cost = Number(data.cost), price = Number(data.price), fee = Number(data.fee), targetProfit = Number(data.targetProfit), targetSales = Number(data.targetSales);
    const profitPerOrder = price - cost - fee;
    const omzet = price * targetSales, profit = profitPerOrder * targetSales;
    const bep = profitPerOrder > 0 ? Math.ceil(cost / profitPerOrder) : 0;
    const daily = Math.ceil(targetSales / 30), weekly = Math.ceil(targetSales / 4);
    const bottom = Math.ceil((cost + fee + targetProfit / targetSales * .7) / 1000) * 1000;
    const ideal = Math.ceil((cost + fee + targetProfit / targetSales) / 1000) * 1000;
    const premium = Math.ceil(ideal * 1.65 / 1000) * 1000;
    return cardsResult("Hasil Pricing Calculator", [
      { title: "Ringkasan angka", items: [`Omzet: ${rupiah(omzet)}`, `Profit bersih: ${rupiah(profit)}`, `Profit per order: ${rupiah(profitPerOrder)}`, `Break even point: ${bep} order`, `Target harian: ${daily} order/hari`, `Target mingguan: ${weekly} order/minggu`] },
      { title: "Saran range harga", items: [`Harga bawah: ${rupiah(bottom)} — untuk validasi awal.`, `Harga ideal: ${rupiah(ideal)} — lebih sehat untuk target profit.`, `Harga premium: ${rupiah(premium)} — gunakan kalau value, bonus, dan proof sudah kuat.`] },
      { title: "Strategi diskon", items: [`Pakai harga normal sebagai anchor, lalu promo terbatas 20–40%.`, `Diskon jangan terlalu sering; lebih baik tambah bonus daripada perang harga.`, `Buat bundle 2–3 produk agar average order value naik.`] },
      { title: "Catatan agar tidak terlalu murah", items: [profitPerOrder <= 0 ? "Harga sekarang belum sehat. Naikkan harga atau kurangi biaya karena profit per order minus/nol." : "Jangan cuma hitung biaya file. Hitung waktu riset, support buyer, revisi, dan value yang pembeli dapat.", "Produk digital murah boleh untuk entry, tapi tetap siapkan versi premium/bundle untuk profit yang lebih layak."] }
    ]);
  },

  calendar(data) {
    const niche = clean(data.niche), product = clean(data.product), platform = clean(data.platform);
    const rows = Array.from({ length: 30 }, (_, i) => [
      `Hari ${i + 1}`, cycle(["Edukasi dasar", "Kesalahan umum", "Cerita personal", "Checklist", "Mini tutorial", "Before-after", "FAQ", "Soft promo", "Proof", "Engagement"], i),
      `${cycle(["Kenapa", "Cara", "3 tanda", "Checklist", "POV"], i)} ${niche} sering bikin pemula stuck`,
      `Bahas satu insight tentang ${niche}, beri contoh simpel, lalu hubungkan halus ke ${product}.`,
      cycle(banks.contentFormats, i), cycle(banks.ctas, i), cycle(banks.goals, i), platform
    ]);
    return tableResult(`Kalender Konten 30 Hari - ${platform}`, ["Hari", "Tema", "Hook", "Isi caption singkat", "Format", "CTA", "Tujuan", "Platform"], rows);
  },

  offer(data) {
    const product = clean(data.product), bonus = clean(data.bonus), normal = clean(data.normalPrice), promo = clean(data.promoPrice), audience = clean(data.audience);
    const bonusItems = bonus.split(/,|\n/).map(x => x.trim()).filter(Boolean);
    return cardsResult(`Offer Builder - ${product}`, [
      { title: "Headline", items: [`Mulai jualan/eksekusi lebih rapi dengan ${product}, bahkan kalau kamu masih pemula.`] },
      { title: "Subheadline", items: [`Dibuat untuk ${audience} yang butuh panduan praktis, bukan teori panjang yang akhirnya cuma disimpan.`] },
      { title: "Pain point", items: [`Bingung mulai dari mana`, `Takut konten/produk terlihat amatir`, `Waktu habis buat riset ulang`, `Belum punya sistem yang gampang diikuti`] },
      { title: "Solusi", items: [`${product} memberi alur siap pakai agar ${audience} bisa eksekusi lebih cepat dan percaya diri.`] },
      { title: "Benefit utama", items: [`Lebih hemat waktu`, `Lebih jelas langkahnya`, `Bisa dipakai dari HP`, `Cocok untuk validasi dan jualan pertama`] },
      { title: "Apa saja yang didapat", items: [`Akses produk utama`, `Panduan penggunaan`, `Contoh penerapan`, `File/asset siap edit`, `Checklist eksekusi`] },
      { title: "Bonus stack", items: bonusItems.length ? bonusItems : ["Bonus pendukung"] },
      { title: "Value breakdown", items: [`Produk utama: ${normal}`, `Bonus pendukung: bernilai tambahan untuk mempercepat eksekusi`, `Harga promo hari ini: ${promo}`] },
      { title: "Urgency", items: [`Promo ${promo} bisa ditutup saat kuota bonus terpenuhi atau periode campaign selesai.`] },
      { title: "Risk reversal / garansi sederhana", items: [`Kalau setelah akses kamu bingung mulai dari mana, hubungi aku dan aku bantu arahkan langkah pertamanya.`] },
      { title: "CTA", items: [`Ambil ${product} sekarang di harga ${promo}. Klik link bio atau DM kata MAU.`] },
      { title: "Copywriting pendek", items: [`Capek mulai dari nol? ${product} bantu ${audience} eksekusi lebih rapi. Normal ${normal}, hari ini ${promo}.`] },
      { title: "Copywriting panjang", items: [`Kalau kamu ${audience} dan sering stuck karena belum punya arahan, ${product} dibuat untuk jadi pegangan praktis. Di dalamnya ada produk utama, contoh, checklist, dan bonus: ${bonusItems.join(", ")}. Normalnya ${normal}, tapi sekarang bisa ambil di ${promo}.`] }
    ]);
  },

  license(data) {
    const product = clean(data.product), brand = clean(data.brand), type = clean(data.licenseType);
    const map = {
      "Personal Use": { rights: "Menggunakan produk untuk kebutuhan pribadi/internal sendiri.", bans: "Tidak boleh dijual ulang, dibagikan gratis, diunggah publik, atau diklaim sebagai karya sendiri." },
      "Resell Rights": { rights: "Menggunakan dan menjual ulang produk final sesuai ketentuan seller.", bans: "Tidak boleh memberikan hak jual ulang lanjutan, membagikan file sumber gratis, atau mengubah klaim kepemilikan brand." },
      "Master Resell Rights": { rights: "Menggunakan, menjual ulang, dan memberikan hak jual ulang kepada pembeli berikutnya sesuai batasan lisensi.", bans: "Tidak boleh menjual dengan klaim palsu, membagikan gratis massal, atau menghapus atribusi/kebijakan penting jika diwajibkan." },
      "Tidak boleh dijual ulang": { rights: "Menggunakan produk hanya untuk kebutuhan pribadi atau operasional sendiri.", bans: "Tidak boleh dijual ulang dalam bentuk utuh, sebagian, bundle, modifikasi ringan, maupun bonus produk lain." }
    }[type];
    return cardsResult(`Teks Lisensi - ${type}`, [
      { title: "Versi singkat", items: [`${product} oleh ${brand}: ${map.rights} ${map.bans}`] },
      { title: "Versi lengkap", items: [`Dengan membeli atau mengakses ${product}, pembeli setuju mengikuti lisensi ${type}. Hak penggunaan: ${map.rights} Larangan: ${map.bans} Semua materi, template, file, dan bonus tetap mengikuti ketentuan dari ${brand}.`] },
      { title: "Hak pembeli", items: [map.rights, "Mendapat akses produk sesuai paket pembelian.", "Menghubungi seller jika ada kendala akses file."] },
      { title: "Larangan", items: [map.bans, "Tidak boleh menyebarkan link download publik tanpa izin.", "Tidak boleh memakai produk untuk aktivitas ilegal atau menyesatkan."] },
      { title: "Catatan penggunaan", items: ["Tempelkan lisensi di halaman checkout, PDF produk, atau folder download.", "Sesuaikan bagian refund, support, dan batas distribusi sesuai kebijakan brand."] },
      { title: "Disclaimer sederhana", items: ["Teks ini adalah template praktis, bukan nasihat hukum. Untuk kebutuhan legal yang spesifik, konsultasikan dengan profesional terkait."] }
    ]);
  },

  description(data) {
    const product = clean(data.product), buyer = clean(data.buyer), problem = clean(data.problem), content = clean(data.content), bonus = clean(data.bonus), price = clean(data.price);
    return cardsResult(`Deskripsi Produk - ${product}`, [
      { title: "Judul produk", items: [`${product} — Shortcut praktis untuk ${buyer}`] },
      { title: "Deskripsi pendek", items: [`Bantu ${buyer} mengatasi ${problem} dengan isi produk yang praktis: ${content}. Harga: ${price}.`] },
      { title: "Deskripsi panjang", items: [`${product} dibuat untuk ${buyer} yang ingin mulai lebih rapi tanpa harus riset dari nol. Kalau selama ini kendalanya ${problem}, paket ini memberi pegangan yang lebih jelas lewat ${content}. Kamu juga dapat bonus: ${bonus}.`] },
      { title: "Bullet benefit", items: [`Lebih hemat waktu`, `Lebih mudah mulai`, `Materi/asset siap dipakai`, `Cocok untuk pemula`, `Bisa dipakai dari HP`] },
      { title: "Isi paket", items: content.split(/,|\n/).map(x => x.trim()).filter(Boolean) },
      { title: "Cocok untuk siapa", items: [`${buyer}`, `Pemula yang butuh contoh praktis`, `Orang yang ingin mulai jualan/eksekusi lebih cepat`] },
      { title: "CTA beli", items: [`Ambil ${product} sekarang seharga ${price}. Klik beli atau DM kalau mau tanya dulu.`] },
      { title: "Versi deskripsi Lynk ID", items: [`${product} untuk ${buyer}. Cocok kalau kamu lagi ${problem}. Isi: ${content}. Bonus: ${bonus}. Harga ${price}. Klik beli untuk akses instan.`] },
      { title: "Versi Gumroad / Website", items: [`A practical digital kit for ${buyer}. This product helps you solve: ${problem}. Inside: ${content}. Bonuses included: ${bonus}. Get it today for ${price} and start with a clearer system.`] }
    ]);
  },

  threads(data) {
    const topic = clean(data.topic), product = clean(data.product), audience = clean(data.audience), problem = clean(data.problem);
    const make = (n, fn) => Array.from({ length: n }, (_, i) => fn(i));
    return cardsResult(`Threads Post - ${topic}`, [
      { title: "5 Post Utama", items: make(5, i => `${cycle(["Jujur", "Hot take", "Reminder", "POV", "Catatan kecil"], i)}: ${topic} nggak harus kelihatan spam. Kalau ${audience} masih ${problem}, mulai dari edukasi kecil lalu bridge ke ${product}.`) },
      { title: "5 Komentar Lanjutan", items: make(5, i => `Tambahan ${i + 1}: jangan langsung jualan di kalimat pertama. Validasi dulu masalahnya, beri contoh, baru tawarkan ${product} sebagai opsi.`) },
      { title: "5 CTA Komentar", items: make(5, i => cycle(["Komentar MAU kalau mau contoh formatnya.", "Balas INFO kalau mau aku kirim detail.", "Save dulu buat contekan posting.", "DM aku kalau mau lihat preview.", "Cek bio kalau mau akses produknya."], i)) },
      { title: "5 Hook Clickbait Aman", items: make(5, i => `${cycle(["Aku nyesel baru tahu", "Jangan mulai", "Ini yang jarang dibahas", "Ternyata bukan algoritma", "Cara halus"], i)} soal ${topic}: ${problem} bisa dibenerin tanpa harus maksa orang beli.`) }
    ]);
  }
};

function getHistory() { try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch { return []; } }
function setHistory(items) { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); }
function saveHistory(item) { setHistory([item, ...getHistory()].slice(0, 40)); }
function deleteHistoryItem(id) { setHistory(getHistory().filter(item => item.id !== id)); renderHistory(); showToast("Satu riwayat dihapus"); }
function renderHistory() {
  const list = $("#historyList"), items = getHistory();
  if (!items.length) { list.innerHTML = emptyState("Riwayat masih kosong", "Setelah generate, hasil akan muncul di sini dengan nama fitur, tanggal, dan preview."); return; }
  list.innerHTML = items.map(item => {
    const preview = item.text.split("\n").filter(Boolean).slice(0, 4).join(" • ");
    return `<article class="history-card">
      <div class="history-meta"><strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(item.feature)}</span><span>${new Date(item.createdAt).toLocaleString("id-ID")}</span></div>
      <p class="preview-text">${escapeHtml(preview)}</p>
      <div class="result-actions">
        <button class="copy-btn" type="button" data-copy="${encodeURIComponent(item.text)}">Copy ulang</button>
        <button class="copy-btn" type="button" data-export-single data-feature="${escapeHtml(item.feature)}" data-title="${escapeHtml(item.title)}" data-copy="${encodeURIComponent(item.text)}">Export .txt</button>
        <button class="danger-btn" type="button" data-delete-history="${item.id}">Hapus</button>
      </div>
    </article>`;
  }).join("");
}

async function copyText(text) {
  try { await navigator.clipboard.writeText(text); }
  catch {
    const textarea = document.createElement("textarea");
    textarea.value = text; document.body.appendChild(textarea); textarea.select(); document.execCommand("copy"); textarea.remove();
  }
  showToast("Berhasil disalin");
}
function exportText(feature, title, text) {
  const date = new Date().toLocaleString("id-ID");
  const content = `Digital Seller Super Tools\nFitur: ${feature}\nJudul: ${title}\nTanggal export: ${date}\n${"=".repeat(48)}\n\n${text}`;
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${feature}-${title}`.toLowerCase().replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "") + ".txt";
  document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
  showToast("File .txt berhasil diexport");
}
function showToast(message) {
  clearTimeout(toastTimer);
  const toast = $("#toast");
  toast.textContent = message; toast.classList.add("show");
  toastTimer = setTimeout(() => toast.classList.remove("show"), 1900);
}

document.addEventListener("DOMContentLoaded", init);
