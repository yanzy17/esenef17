const HISTORY_KEY = "digitalSellerSuperToolsHistory";

const tools = [
  { id: "product-idea", icon: "💡", title: "Product Idea Generator", badge: "10 ide detail", desc: "Ubah niche atau skill menjadi ide produk digital yang siap divalidasi.", fields: [
    { id: "niche", label: "Niche / skill", placeholder: "Contoh: desain Canva, parenting, Excel, affiliate TikTok" },
    { id: "audience", label: "Target audiens", placeholder: "Contoh: ibu rumah tangga pemula bisnis online" },
    { id: "level", label: "Level user", type: "select", options: ["Pemula", "Menengah", "Advanced", "Campuran"] }
  ], generate: generateProductIdeas },
  { id: "affiliate-content", icon: "🤝", title: "Affiliate Content Generator", badge: "Hook + caption", desc: "Buat bahan promosi affiliate yang natural, variatif, dan tidak terasa maksa.", fields: [
    { id: "product", label: "Nama produk", placeholder: "Contoh: kelas editing video HP" },
    { id: "buyer", label: "Target pembeli", placeholder: "Contoh: creator pemula yang mau jualan lewat konten" },
    { id: "problem", label: "Masalah pembeli", placeholder: "Contoh: bingung bikin konten promosi yang tidak cringe" },
    { id: "benefit", label: "Benefit produk", placeholder: "Contoh: template, panduan step-by-step, contoh caption", full: true },
    { id: "tone", label: "Tone", type: "select", options: ["Santai Gen Z", "Warm mentor", "Profesional ringan", "Lucu tipis", "Urgent natural"] }
  ], generate: generateAffiliateContent },
  { id: "hook", icon: "🧲", title: "Hook Generator", badge: "30+ hook", desc: "Kumpulan hook casual untuk Threads, TikTok, dan Instagram.", fields: [
    { id: "topic", label: "Topik / produk", placeholder: "Contoh: ebook budgeting untuk freelancer" },
    { id: "audience", label: "Audiens", placeholder: "Contoh: freelancer pemula" },
    { id: "problem", label: "Masalah utama", placeholder: "Contoh: penghasilan bocor dan sulit nabung", full: true }
  ], generate: generateHooks },
  { id: "caption-cta", icon: "✍️", title: "Caption + CTA Generator", badge: "Multi platform", desc: "Buat caption Threads, Instagram, TikTok, dan CTA dengan beberapa gaya.", fields: [
    { id: "product", label: "Produk", placeholder: "Contoh: template Notion content planner" },
    { id: "problem", label: "Masalah audiens", placeholder: "Contoh: ide konten berantakan" },
    { id: "solution", label: "Solusi", placeholder: "Contoh: planner 30 hari siap isi" },
    { id: "promo", label: "Promo / harga", placeholder: "Contoh: promo Rp49.000 sampai Minggu" }
  ], generate: generateCaptionCta },
  { id: "dm-reply", icon: "💬", title: "DM Reply Assistant", badge: "Template chat", desc: "Balasan santai untuk komentar, tanya harga, objection, follow up, dan after sales.", fields: [
    { id: "product", label: "Produk", placeholder: "Contoh: mini course affiliate pemula" },
    { id: "price", label: "Harga", placeholder: "Contoh: Rp79.000" },
    { id: "bonus", label: "Bonus / benefit utama", placeholder: "Contoh: checklist posting, contoh skrip DM, update materi", full: true }
  ], generate: generateDmReplies },
  { id: "pricing", icon: "🧮", title: "Pricing Calculator", badge: "Profit & BEP", desc: "Hitung omzet, profit, BEP, target penjualan, dan strategi harga.", fields: [
    { id: "cost", label: "Modal", type: "number", placeholder: "Contoh: 250000" },
    { id: "price", label: "Harga jual", type: "number", placeholder: "Contoh: 99000" },
    { id: "fee", label: "Biaya platform (%)", type: "number", placeholder: "Contoh: 5" },
    { id: "targetProfit", label: "Target profit", type: "number", placeholder: "Contoh: 3000000" },
    { id: "sales", label: "Jumlah target penjualan", type: "number", placeholder: "Contoh: 50" }
  ], generate: generatePricing },
  { id: "content-calendar", icon: "🗓️", title: "Content Calendar Generator", badge: "30 hari", desc: "Kalender konten 30 hari lengkap dengan hook, format, CTA, dan tujuan.", fields: [
    { id: "niche", label: "Niche", placeholder: "Contoh: jualan template Canva" },
    { id: "product", label: "Produk utama", placeholder: "Contoh: bundle template promosi UMKM" },
    { id: "platform", label: "Platform", type: "select", options: ["Threads", "TikTok", "Instagram", "Semua platform"] }
  ], generate: generateCalendar },
  { id: "offer", icon: "🎁", title: "Offer Builder", badge: "Halaman penawaran", desc: "Susun offer stack, value breakdown, urgency, garansi, dan copywriting.", fields: [
    { id: "product", label: "Produk utama", placeholder: "Contoh: kelas Canva jualan digital" },
    { id: "bonus", label: "Bonus", placeholder: "Contoh: template konten, checklist launch, grup support" },
    { id: "normal", label: "Harga normal", placeholder: "Contoh: Rp299.000" },
    { id: "promo", label: "Harga promo", placeholder: "Contoh: Rp99.000" },
    { id: "audience", label: "Target audiens", placeholder: "Contoh: pemula yang mau punya produk digital pertama", full: true }
  ], generate: generateOffer },
  { id: "license", icon: "📄", title: "License Text Generator", badge: "4 lisensi", desc: "Buat teks lisensi personal, resell, master resell, atau larangan resale.", fields: [
    { id: "product", label: "Nama produk", placeholder: "Contoh: 100 Template Caption Affiliate" },
    { id: "license", label: "Pilihan lisensi", type: "select", options: ["Personal Use", "Resell Rights", "Master Resell Rights", "Tidak boleh dijual ulang"] }
  ], generate: generateLicense },
  { id: "description", icon: "🛒", title: "Product Description Generator", badge: "Lynk ID/Gumroad", desc: "Deskripsi produk pendek, panjang, benefit, isi paket, dan CTA siap tempel.", fields: [
    { id: "product", label: "Nama produk", placeholder: "Contoh: Ebook Launch Produk Digital 7 Hari" },
    { id: "buyer", label: "Target pembeli", placeholder: "Contoh: pemula yang belum pernah jualan ebook" },
    { id: "problem", label: "Masalah pembeli", placeholder: "Contoh: bingung mulai dari ide, konten, dan offer" },
    { id: "content", label: "Isi produk", placeholder: "Contoh: modul PDF, checklist, template caption", full: true },
    { id: "bonus", label: "Bonus", placeholder: "Contoh: swipe file hook dan pricing worksheet" },
    { id: "price", label: "Harga", placeholder: "Contoh: Rp59.000" }
  ], generate: generateDescription },
  { id: "threads", icon: "🧵", title: "Threads Post Generator", badge: "Post + komentar", desc: "Ide post utama, komentar lanjutan, CTA komentar, dan hook clickbait aman.", fields: [
    { id: "topic", label: "Topik", placeholder: "Contoh: cara mulai affiliate tanpa followers besar" },
    { id: "product", label: "Produk", placeholder: "Contoh: panduan affiliate organik" },
    { id: "audience", label: "Target audiens", placeholder: "Contoh: mahasiswa dan karyawan sampingan" },
    { id: "problem", label: "Masalah audiens", placeholder: "Contoh: takut promosi karena belum punya personal brand", full: true }
  ], generate: generateThreads }
];

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
const choice = (items) => items[Math.floor(Math.random() * items.length)];
const money = (value) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Number(value) || 0);
const clean = (value) => String(value || "").trim();
const todayText = () => new Date().toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });

function escapeHtml(text) {
  return String(text).replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]));
}
function list(items) { return `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`; }
function ordered(items) { return `<ol>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ol>`; }
function card(title, content) { return `<article class="output-card"><h3>${escapeHtml(title)}</h3>${content}</article>`; }
function miniGrid(items) { return `<div class="mini-grid">${items.map(([k, v]) => `<div class="mini"><strong>${escapeHtml(k)}</strong><p>${escapeHtml(v)}</p></div>`).join("")}</div>`; }
function sectionList(title, items, orderedList = false) { return card(title, orderedList ? ordered(items) : list(items)); }

function init() {
  renderNavigation();
  renderQuickGrid();
  renderToolTabs();
  renderToolWorkspace(tools[0].id);
  renderHistory();
  $("#scrollHistoryBtn").addEventListener("click", () => scrollToId("history"));
  $("#clearHistoryBtn").addEventListener("click", clearHistory);
  document.addEventListener("click", handleGlobalClick);
}

function renderNavigation() {
  const sideNav = $("#sideNav");
  const bottomNav = $("#bottomNav");
  const navItems = [{ id: "dashboard", icon: "🏠", title: "Dashboard" }, ...tools.slice(0, 8), { id: "history", icon: "🕘", title: "Riwayat" }];
  sideNav.innerHTML = navItems.map((item) => `<button class="nav-link" data-tool-link="${item.id}"><span>${item.icon}</span>${item.title}</button>`).join("");
  bottomNav.innerHTML = [navItems[0], tools[0], tools[1], tools[6], navItems.at(-1)].map((item) => `<button class="mobile-link" data-tool-link="${item.id}"><span>${item.icon}</span>${item.title.split(" ")[0]}</button>`).join("");
}
function renderQuickGrid() {
  $("#quickGrid").innerHTML = tools.map((tool) => `<button class="feature-card" data-tool-link="${tool.id}"><span class="icon">${tool.icon}</span><h3>${tool.title}</h3><p>${tool.desc}</p><span class="badge">${tool.badge}</span></button>`).join("");
}
function renderToolTabs() {
  $("#toolTabs").innerHTML = tools.map((tool) => `<button class="tool-tab" data-tool-id="${tool.id}"><strong>${tool.icon} ${tool.title}</strong><span>${tool.badge}</span></button>`).join("");
  $$(".tool-tab").forEach((button) => button.addEventListener("click", () => renderToolWorkspace(button.dataset.toolId)));
}
function renderToolWorkspace(toolId) {
  const tool = tools.find((item) => item.id === toolId) || tools[0];
  $$(".tool-tab").forEach((tab) => tab.classList.toggle("active", tab.dataset.toolId === tool.id));
  const fields = tool.fields.map((field) => {
    const input = field.type === "select"
      ? `<select id="${field.id}" name="${field.id}">${field.options.map((option) => `<option value="${escapeHtml(option)}">${escapeHtml(option)}</option>`).join("")}</select>`
      : field.type === "number"
        ? `<input id="${field.id}" name="${field.id}" type="number" min="0" placeholder="${escapeHtml(field.placeholder || "")}" />`
        : `<textarea id="${field.id}" name="${field.id}" placeholder="${escapeHtml(field.placeholder || "")}"></textarea>`;
    return `<div class="field-card ${field.full ? "full" : ""}"><label for="${field.id}">${field.label}</label>${input}</div>`;
  }).join("");
  $("#toolWorkspace").innerHTML = `
    <div class="tool-header"><div><p class="eyebrow">${tool.badge}</p><h2>${tool.icon} ${tool.title}</h2><p>${tool.desc}</p></div></div>
    <form id="toolForm" novalidate><div class="form-grid">${fields}</div><div class="error-box" id="errorBox"></div><div class="generate-row"><button class="primary-btn" type="submit">Generate Sekarang</button><button class="ghost-btn" type="button" id="resetBtn">Reset Form</button></div></form>
    <div class="output-area" id="outputArea"><div class="empty-state"><strong>Belum ada hasil generate</strong><p>Isi form di atas, lalu klik generate. Hasil akan tampil dengan format rapi dan bisa langsung dicopy atau export TXT.</p></div></div>`;
  $("#toolForm").addEventListener("submit", (event) => submitTool(event, tool));
  $("#resetBtn").addEventListener("click", () => renderToolWorkspace(tool.id));
  scrollToId("tools-unggulan", false);
}
function submitTool(event, tool) {
  event.preventDefault();
  const form = event.currentTarget;
  const values = Object.fromEntries(tool.fields.map((field) => [field.id, clean(form.elements[field.id]?.value)]));
  const missing = tool.fields.filter((field) => !values[field.id]);
  const errorBox = $("#errorBox");
  if (missing.length) {
    errorBox.textContent = `Isi dulu: ${missing.map((field) => field.label).join(", ")}. Biar hasilnya tidak generic dan lebih siap dipakai.`;
    errorBox.classList.add("show");
    return;
  }
  errorBox.classList.remove("show");
  const output = $("#outputArea");
  output.innerHTML = `<div class="loading"><span class="spinner"></span>Lagi meracik hasil yang natural dan siap jual...</div>`;
  setTimeout(() => {
    const html = tool.generate(values);
    const text = htmlToText(html);
    output.innerHTML = `<div class="result-actions"><button class="secondary-btn" data-copy-result>Copy Hasil</button><button class="ghost-btn" data-export-result>Export .txt</button></div>${html}`;
    output.dataset.resultText = text;
    output.dataset.resultTitle = tool.title;
    addHistory(tool.title, text);
  }, 450);
}
function handleGlobalClick(event) {
  const link = event.target.closest("[data-tool-link]");
  if (link) {
    const id = link.dataset.toolLink;
    if (tools.some((tool) => tool.id === id)) renderToolWorkspace(id);
    scrollToId(id === "dashboard" || id === "history" ? id : "tools-unggulan");
  }
  if (event.target.matches("[data-copy-result]")) copyText($("#outputArea").dataset.resultText || "");
  if (event.target.matches("[data-export-result]")) exportText($("#outputArea").dataset.resultTitle, $("#outputArea").dataset.resultText || "");
  const historyCopy = event.target.closest("[data-history-copy]");
  if (historyCopy) copyText(getHistory()[Number(historyCopy.dataset.historyCopy)]?.text || "");
  const historyDelete = event.target.closest("[data-history-delete]");
  if (historyDelete) deleteHistory(Number(historyDelete.dataset.historyDelete));
}
function scrollToId(id, smooth = true) { document.getElementById(id)?.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" }); }

function htmlToText(html) {
  const box = document.createElement("div"); box.innerHTML = html;
  box.querySelectorAll("h3,h4").forEach((el) => { el.textContent = `\n${el.textContent}\n`; });
  box.querySelectorAll("li").forEach((el) => { el.textContent = `• ${el.textContent}\n`; });
  return box.textContent.replace(/\n{3,}/g, "\n\n").trim();
}
async function copyText(text) {
  if (!text) return;
  try { await navigator.clipboard.writeText(text); }
  catch { const area = document.createElement("textarea"); area.value = text; document.body.append(area); area.select(); document.execCommand("copy"); area.remove(); }
  showToast("Berhasil disalin");
}
function exportText(title, text) {
  const content = `${title || "Digital Seller Super Tools"}\nTanggal: ${todayText()}\n\n${text}`;
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = `${(title || "hasil-generate").toLowerCase().replace(/[^a-z0-9]+/g, "-")}.txt`; a.click(); URL.revokeObjectURL(url);
  showToast("Export .txt berhasil");
}
function showToast(message) { const toast = $("#toast"); toast.textContent = message; toast.classList.add("show"); setTimeout(() => toast.classList.remove("show"), 2200); }
function getHistory() { return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]"); }
function saveHistory(items) { localStorage.setItem(HISTORY_KEY, JSON.stringify(items)); renderHistory(); }
function addHistory(feature, text) { saveHistory([{ feature, date: todayText(), text }, ...getHistory()].slice(0, 30)); }
function deleteHistory(index) { const items = getHistory(); items.splice(index, 1); saveHistory(items); showToast("Riwayat dihapus"); }
function clearHistory() { saveHistory([]); showToast("Semua riwayat dihapus"); }
function renderHistory() {
  const items = getHistory();
  $("#historyList").innerHTML = items.length ? items.map((item, index) => `<article class="history-item"><div class="history-meta"><strong>${escapeHtml(item.feature)}</strong><span>${escapeHtml(item.date)}</span></div><p class="history-preview">${escapeHtml(item.text)}</p><div class="history-actions"><button class="secondary-btn" data-history-copy="${index}">Copy ulang</button><button class="danger-btn" data-history-delete="${index}">Hapus</button></div></article>`).join("") : `<div class="empty-state"><strong>Riwayat masih kosong</strong><p>Setiap hasil generate akan tersimpan otomatis di browser ini memakai localStorage.</p></div>`;
}

const mentorTips = ["Pakai bahasa audiens, bukan bahasa teknis penjual.", "Jual perubahan yang mereka rasakan, bukan cuma file yang mereka dapat.", "Mulai validasi dengan konten ringan sebelum membuat launch besar.", "Beri bonus yang mengurangi rasa bingung setelah membeli."];
const platforms = ["Lynk ID", "Gumroad", "Karyakarsa", "Tokopedia Digital", "Instagram DM", "WhatsApp katalog", "Website landing page"];
const formats = ["ebook ringkas", "template siap pakai", "mini course video", "workbook interaktif", "bundle swipe file", "checklist premium", "kelas rekaman", "paket Notion/Canva"];

function generateProductIdeas(v) {
  const ideas = Array.from({ length: 10 }, (_, i) => {
    const format = choice(formats), platform = choice(platforms);
    return card(`${i + 1}. ${choice(["Starter Kit", "Shortcut", "Blueprint", "Playbook", "Sprint", "Template Pack"])} ${v.niche} untuk ${v.audience}`, miniGrid([
      ["Format produk", format], ["Target pembeli", `${v.audience} level ${v.level}`], ["Masalah utama", `Mereka ingin hasil dari ${v.niche}, tapi belum punya urutan langkah, contoh, dan standar eksekusi yang jelas.`], ["Solusi", `Produk ini memberi jalur praktis dari nol sampai bisa mencoba sendiri tanpa merasa sendirian.`], ["Isi produk", `Modul pembuka, contoh nyata, checklist harian, template eksekusi, dan studi kasus sederhana.`], ["Bonus", `Swipe file caption, worksheet validasi, mini audit mandiri, dan checklist launch 7 hari.`], ["Estimasi harga", choice(["Rp39.000 - Rp79.000", "Rp79.000 - Rp149.000", "Rp149.000 - Rp299.000"])], ["Tingkat kesulitan", choice(["Mudah dibuat dalam 3-5 hari", "Sedang, butuh contoh visual", "Sedang, perlu validasi kecil dulu"])], ["Platform cocok", platform], ["Angle promosi", `Bantu ${v.audience} menghindari trial-error saat memulai ${v.niche}.`], ["Potensi laku", `Masalahnya spesifik, hasilnya mudah dibayangkan, dan format ${format} terasa cepat dipakai oleh pemula.`]
    ]));
  }).join("");
  return card("Arahan mentor sebelum memilih ide", `<p>Ambil 2-3 ide yang paling gampang dibuat minggu ini. Validasi dengan posting edukasi, polling, atau DM ringan. ${choice(mentorTips)}</p>`) + ideas;
}
function generateAffiliateContent(v) {
  const hooks = Array.from({ length: 15 }, (_, i) => `${i + 1}. Kalau kamu ${v.buyer} dan masih ${v.problem}, coba lihat ${v.product} dari angle ini: ${choice(["lebih hemat waktu", "lebih jelas langkahnya", "lebih minim trial-error", "lebih gampang konsisten"])}.`);
  const short = Array.from({ length: 10 }, () => `${v.product} cocok buat kamu yang pengin ${v.benefit}. Bukan magic, tapi bantu langkah awal jadi lebih kebayang.`);
  const story = Array.from({ length: 5 }, () => `Dulu aku kira masalah ${v.problem} selesai kalau nonton banyak tips. Ternyata yang dibutuhkan adalah panduan yang rapi. ${v.product} bisa jadi shortcut buat ${v.buyer} yang mau mulai lebih terarah.`);
  const soft = Array.from({ length: 5 }, () => `Kalau lagi cari referensi yang praktis, ${v.product} menarik buat dicek. Benefit utamanya: ${v.benefit}. Ambil kalau memang relate dengan kebutuhanmu.`);
  const hard = Array.from({ length: 5 }, () => `Kalau ${v.problem} sudah bikin kamu stuck terlalu lama, jangan nunggu perfect. Cek ${v.product}, pelajari, lalu praktikkan hari ini juga.`);
  return sectionList("15 Hook", hooks) + sectionList("10 Caption Pendek", short) + sectionList("5 Caption Storytelling", story) + sectionList("5 Caption Soft Selling", soft) + sectionList("5 Caption Hard Selling Natural", hard) + sectionList("10 CTA", Array.from({ length: 10 }, () => choice(["Komen ‘mau’ kalau mau aku kirim detailnya.", "DM aku kata ‘INFO’ biar aku jelasin versi singkat.", "Cek link bio kalau kamu mau lihat isi produknya.", "Simpan dulu kalau belum siap beli hari ini."]))) + sectionList("10 Ide Video Pendek", Array.from({ length: 10 }, (_, i) => `Video ${i + 1}: buka dengan masalah “${v.problem}”, tunjukkan before-after, lalu arahkan ke benefit ${v.benefit}.`)) + sectionList("10 Ide Threads Post", Array.from({ length: 10 }, (_, i) => `Thread ${i + 1}: pelajaran kecil untuk ${v.buyer} yang ingin mengatasi ${v.problem} dengan bantuan ${v.product}.`)) + sectionList("5 Komentar Lanjutan/Utas", Array.from({ length: 5 }, () => `Tambahan: jangan fokus beli produknya saja, fokus pakai ${v.product} untuk membangun kebiasaan eksekusi.`)) + sectionList("5 Angle Masalah Audiens", Array.from({ length: 5 }, () => choice([`Takut mulai karena merasa belum ahli.`, `Bingung membedakan info penting dan noise.`, `Sudah belajar banyak tapi belum punya sistem.`, `Butuh contoh yang bisa ditiru dulu sebelum improvisasi.`])));
}
function generateHooks(v) {
  const cats = ["Problem aware", "Curiosity", "Result based", "Fear of missing out", "Storytelling", "Social proof", "Soft clickbait", "Beginner friendly"];
  return cats.map((cat) => sectionList(cat, Array.from({ length: cat === "Problem aware" ? 5 : 4 }, () => choice([
    `Kamu bukan malas, mungkin cara mulai ${v.topic} aja yang belum dibuat simpel.`,
    `Yang jarang dibahas soal ${v.topic}: pemula sering gagal karena ${v.problem}.`,
    `Aku baru sadar, ${v.audience} nggak butuh motivasi lagi, tapi butuh langkah kecil yang jelas.`,
    `Kalau kamu pengin hasil dari ${v.topic}, stop mulai dari hal yang terlalu rumit.`,
    `Ini cara mikir yang bikin ${v.audience} lebih berani mulai meski belum perfect.`
  ])))).join("");
}
function generateCaptionCta(v) {
  return card("Caption Multi Platform", miniGrid([
    ["Threads pendek", `${v.problem} sering bikin orang nunda. ${v.product} bantu kamu mulai dari ${v.solution}. ${v.promo}.`],
    ["Threads versi utas", `1/ Banyak yang stuck bukan karena nggak mampu, tapi karena ${v.problem}.\n2/ Solusi paling aman: mulai dengan sistem kecil.\n3/ ${v.product} dibuat untuk bantu ${v.solution}.\n4/ ${v.promo}.`],
    ["Instagram", `Kalau selama ini ${v.problem}, kamu butuh pegangan yang praktis. ${v.product} bantu lewat ${v.solution}. Simpan postingan ini dan cek detailnya kalau sudah siap mulai.`],
    ["TikTok", `POV: kamu capek ${v.problem}, lalu nemu ${v.product} yang bantu ${v.solution} tanpa harus bingung dari nol.`]
  ])) + card("CTA per Kebutuhan", miniGrid([
    ["CTA komentar", "Komen ‘mau’ kalau mau aku kirim detail dan preview isinya."],
    ["CTA DM", "DM kata ‘START’ biar aku bantu jelasin apakah ini cocok buat kebutuhanmu."],
    ["CTA cek bio", "Cek link di bio untuk lihat isi lengkap, bonus, dan cara aksesnya."],
    ["CTA soft", "Simpan dulu kalau belum siap beli hari ini, yang penting kamu punya referensinya."],
    ["CTA direct", `Kalau kamu memang butuh solusi untuk ${v.problem}, ambil ${v.product} selagi ${v.promo}.`]
  ])) + sectionList("Variasi Gaya", [`Versi lebih santai: ${v.product} ini kayak teman jalan buat kamu yang masih ${v.problem}.`, `Versi lebih urgent: ${v.promo} dan cocok kalau kamu mau mulai minggu ini, bukan nanti-nanti.`, `Versi tanpa terkesan jualan: aku cuma share resource yang menurutku membantu buat ${v.solution}.`]);
}
function generateDmReplies(v) {
  const rows = [["Orang komen mau", `Siap, aku kirim ya. Ini ${v.product}, harganya ${v.price}, sudah termasuk ${v.bonus}. Kalau mau aku jelasin singkat dulu juga boleh.`], ["Tanya harga", `Harganya ${v.price}. Di dalamnya kamu dapat ${v.bonus}. Cocok kalau kamu pengin mulai lebih rapi tanpa ngumpulin info random lagi.`], ["Bilang mahal", `Paham kok. Kalau dibanding file biasa mungkin terasa lumayan, tapi value-nya ada di arahan + contoh pakai. Kalau belum prioritas, boleh save dulu ya.`], ["Minta bukti", `Boleh. Aku kirim preview isi dan contoh hasilnya ya, biar kamu bisa nilai sendiri apakah cocok dengan kebutuhanmu.`], ["Cuma tanya-tanya", `Santai, tanya aja. Aku bantu jelasin dulu, nggak harus langsung ambil kalau memang belum cocok.`], ["Follow up 1", `Hai, aku follow up pelan-pelan ya. Kemarin kamu sempat tertarik ${v.product}. Masih mau aku bantu jelasin bagian yang paling relevan buat kamu?`], ["Follow up 2", `Aku cek lagi ya, promo/aksesnya masih bisa dipakai. Kalau belum jadi juga nggak apa-apa, cuma takut chatnya ketimbun.`], ["Closing halus", `Kalau kamu merasa ini pas buat kebutuhan sekarang, boleh langsung aku bantu proses. Kalau masih ragu, aku bisa bantu bandingin dulu dengan kebutuhanmu.`], ["Belum transfer", `Aku reminder halus ya, order ${v.product}-nya belum masuk. Kalau masih mau, silakan lanjut. Kalau batal juga kabari aja, aman kok.`], ["Setelah bayar", `Makasih ya, pembayaran sudah masuk. Ini akses produknya. Saran aku mulai dari bagian awal dulu, lalu praktikkan satu langkah kecil hari ini.`], ["After sales", `Gimana sejauh ini, sudah sempat buka materinya? Kalau ada bagian yang bingung, chat aja. Aku bantu arahkan biar nggak berhenti di download doang.`]];
  return card("Template DM Reply Realistis", miniGrid(rows));
}
function generatePricing(v) {
  const cost = Number(v.cost), price = Number(v.price), fee = Number(v.fee), target = Number(v.targetProfit), sales = Number(v.sales);
  const netPerOrder = price - (price * fee / 100); const profit = (netPerOrder * sales) - cost; const bep = Math.ceil(cost / Math.max(netPerOrder, 1));
  return card("Hasil Pricing Calculator", miniGrid([
    ["Omzet", money(price * sales)], ["Profit bersih", money(profit)], ["Profit per order", money(netPerOrder)], ["Break even point", `${bep} order`], ["Target harian", `${Math.ceil(sales / 30)} order/hari untuk 30 hari`], ["Target mingguan", `${Math.ceil(sales / 4)} order/minggu`], ["Saran harga bawah", money(Math.max(netPerOrder * 0.75, cost / Math.max(sales, 1)))], ["Saran harga ideal", money(Math.max(price, target / Math.max(sales, 1) + (price * fee / 100)))], ["Saran harga premium", money(price * 1.8)], ["Strategi diskon", `Buat anchor harga normal lebih tinggi, lalu promo terbatas dengan bonus. Jangan diskon terus-menerus agar value tidak turun.`], ["Catatan mentor", `Jangan terlalu murah kalau produkmu menghemat waktu, memberi contoh, dan mengurangi kebingungan pembeli. Harga rendah boleh untuk validasi, bukan identitas selamanya.`]
  ]));
}
function generateCalendar(v) {
  const goals = ["edukasi", "trust", "promosi", "storytelling", "engagement"];
  return card("Kalender Konten 30 Hari", `<ol>${Array.from({ length: 30 }, (_, i) => `<li><strong>Hari ke-${i + 1}</strong><br>Tema: ${choice(["kesalahan pemula", "before-after", "tips praktis", "cerita proses", "bongkar mitos", "soft promo"])} seputar ${escapeHtml(v.niche)}.<br>Hook: ${escapeHtml(choice([`Masih bingung mulai ${v.niche}?`, `Ini alasan ${v.product} bisa bantu pemula.`, `Stop lakukan ini kalau mau hasil lebih rapi.`]))}<br>Caption: Bahas satu masalah kecil, beri contoh, lalu arahkan ke langkah praktis yang bisa dilakukan hari itu.<br>Format: ${escapeHtml(choice(["single post", "carousel", "video pendek", "thread", "story Q&A"]))}. CTA: ${escapeHtml(choice(["Simpan dulu", "Komen mau", "DM INFO", "Cek bio", "Share ke teman"] ))}. Tujuan: ${escapeHtml(goals[i % goals.length])}. Platform: ${escapeHtml(v.platform)}.</li>`).join("")}</ol>`);
}
function generateOffer(v) {
  return card("Offer Page Siap Pakai", miniGrid([
    ["Headline", `Punya ${v.product} yang membantu ${v.audience} mulai lebih cepat tanpa kebingungan dari nol.`], ["Subheadline", `Di dalamnya ada panduan, contoh, dan bonus yang membuat proses belajar terasa lebih ringan.`], ["Pain point", `${v.audience} sering stuck karena terlalu banyak info, tidak tahu urutan, dan takut salah mulai.`], ["Solusi", `${v.product} menyederhanakan proses menjadi langkah yang bisa langsung dipraktikkan.`], ["Benefit utama", `Lebih hemat waktu, lebih percaya diri, punya contoh, dan tahu apa yang harus dilakukan setelah membeli.`], ["Apa saja didapat", `Materi utama ${v.product}, template pendukung, checklist eksekusi, dan contoh penerapan.`], ["Bonus stack", v.bonus], ["Value breakdown", `Produk utama ${v.normal}, bonus ${v.bonus}, value total terasa lebih tinggi dari harga promo.`], ["Harga", `Normal ${v.normal} → promo ${v.promo}`], ["Urgency", `Promo bisa ditutup kapan saja agar pembeli tidak menunda terlalu lama.`], ["Risk reversal", `Kalau isi produk tidak sesuai deskripsi, pembeli bisa menghubungi penjual untuk solusi yang fair.`], ["CTA", `Ambil ${v.product} sekarang dan mulai praktik dari langkah pertama hari ini.`]
  ])) + sectionList("Copywriting Pendek", [`Kalau kamu ${v.audience} dan ingin mulai lebih rapi, ${v.product} bisa jadi shortcut. Normal ${v.normal}, hari ini ${v.promo} plus bonus ${v.bonus}.`]) + sectionList("Copywriting Panjang", [`Bayangkan kamu tidak perlu lagi mengumpulkan tips random. ${v.product} memberi arahan dari masalah awal sampai eksekusi. Cocok untuk ${v.audience} yang butuh pegangan praktis. Dengan bonus ${v.bonus}, kamu bukan cuma membeli materi, tapi membeli sistem sederhana untuk bergerak lebih cepat.`]);
}
function generateLicense(v) {
  const rights = { "Personal Use": "Pembeli boleh memakai produk untuk kebutuhan pribadi atau internal bisnis sendiri.", "Resell Rights": "Pembeli boleh menjual ulang produk akhir sesuai ketentuan tanpa mengubah klaim lisensi.", "Master Resell Rights": "Pembeli boleh menjual ulang produk dan menawarkan hak jual ulang kepada pembeli berikutnya.", "Tidak boleh dijual ulang": "Pembeli hanya boleh menggunakan produk, bukan menjual, membagikan, atau mengklaim ulang." };
  return card(`${v.license} - ${v.product}`, miniGrid([
    ["Versi singkat", `${v.product} menggunakan lisensi ${v.license}. ${rights[v.license]}`], ["Versi lengkap", `Dengan membeli ${v.product}, pembeli memahami bahwa hak penggunaan mengikuti tipe lisensi ${v.license}. Produk harus digunakan secara etis dan tidak boleh melanggar hak cipta pihak lain.`], ["Hak pembeli", rights[v.license]], ["Larangan", `Dilarang membagikan file secara gratis di grup publik, mengklaim sebagai karya original jika tidak diizinkan, atau memakai produk untuk aktivitas ilegal.`], ["Catatan penggunaan", `Simpan bukti pembelian dan baca instruksi pemakaian sebelum menjual atau mengedit produk.`], ["Disclaimer", `Teks ini bersifat template sederhana. Untuk kebutuhan legal yang kompleks, konsultasikan dengan profesional hukum.`]
  ]));
}
function generateDescription(v) {
  return card("Deskripsi Produk Siap Tempel", miniGrid([
    ["Judul produk", `${v.product} untuk ${v.buyer}`], ["Deskripsi pendek", `${v.product} membantu ${v.buyer} mengatasi ${v.problem} dengan isi praktis: ${v.content}.`], ["Deskripsi panjang", `Kalau kamu ${v.buyer} dan sering merasa ${v.problem}, produk ini dibuat sebagai panduan yang lebih rapi. Kamu tidak hanya mendapat file, tapi juga arah eksekusi supaya tahu mulai dari mana dan apa yang harus dilakukan setelahnya.`], ["Bullet benefit", `Lebih jelas langkahnya; punya contoh; hemat waktu riset; cocok untuk pemula; bisa langsung dipraktikkan.`], ["Isi paket", v.content], ["Cocok untuk siapa", `${v.buyer} yang mau belajar praktis tanpa kebanyakan teori.`], ["CTA beli", `Ambil sekarang seharga ${v.price} dan mulai dari langkah pertama hari ini.`], ["Versi Lynk ID", `${v.product}\nUntuk: ${v.buyer}\nIsi: ${v.content}\nBonus: ${v.bonus}\nHarga: ${v.price}\nKlik beli kalau kamu siap mulai lebih rapi.`], ["Versi Gumroad/Website", `${v.product} adalah resource praktis untuk ${v.buyer}. Di dalamnya kamu mendapat ${v.content}, bonus ${v.bonus}, dan arahan agar masalah ${v.problem} tidak terus menghambat eksekusi.`]
  ]));
}
function generateThreads(v) {
  return sectionList("5 Post Utama", Array.from({ length: 5 }, () => `Kalau kamu ${v.audience} dan masih ${v.problem}, topik ${v.topic} ini penting. Mulai dari langkah kecil, bukan dari target besar. ${v.product} bisa jadi pegangan kalau kamu butuh contoh yang lebih jelas.`)) + sectionList("5 Komentar Lanjutan", Array.from({ length: 5 }, () => `Tambahan: jangan tunggu percaya diri dulu. Biasanya percaya diri muncul setelah kamu punya struktur dan mulai posting beberapa kali.`)) + sectionList("5 CTA Komentar", ["Komen ‘mau’ kalau mau aku kirim detailnya.", "Mau aku bikinin versi checklist?", "DM aku kalau mau lihat isi produknya.", "Save dulu, besok praktikkan satu poin.", "Cek bio kalau mau mulai dari panduan lengkap."]) + sectionList("5 Hook Clickbait Aman", Array.from({ length: 5 }, () => choice([`Aku nyesel baru paham ini soal ${v.topic}.`, `Pemula sering salah mulai dari sini.`, `Ini bukan rahasia, tapi jarang dipraktikkan.`, `Kalau followers kecil, justru mulai dari cara ini.`, `Stop promosi sebelum kamu beresin 1 hal ini.`])));
}

document.addEventListener("DOMContentLoaded", init);
