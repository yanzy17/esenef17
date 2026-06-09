(() => {
  if (document.body.dataset.page !== "affiliate") return;
const badges = ["No API", "Bisa dari HP", "Affiliate Friendly", "Siap Posting", "100% Static"];
const navItems = [
  { id: "dashboard", label: "Dashboard", icon: "🏠", desc: "Ringkasan, quick access, dan cara pakai." },
  { id: "angle", label: "Angle Finder", icon: "🎯", desc: "Cari sudut promosi yang natural dan relate." },
  { id: "hook", label: "Hook Generator", icon: "🧲", desc: "Bikin orang berhenti scroll dari 3 detik pertama." },
  { id: "caption", label: "Caption", icon: "✍️", desc: "Caption pendek, panjang, soft selling, dan review." },
  { id: "cta", label: "CTA", icon: "📣", desc: "Ajak audiens komentar, DM, cek bio, atau checkout." },
  { id: "script", label: "Script Video", icon: "🎬", desc: "Script TikTok, Reels, Shorts yang siap direkam." },
  { id: "calendar", label: "30 Hari Konten", icon: "📅", desc: "Kalender konten harian biar nggak stuck." },
  { id: "reply", label: "Reply DM", icon: "💬", desc: "Balasan komentar dan DM yang ramah." },
  { id: "calculator", label: "Kalkulator Komisi", icon: "🧮", desc: "Hitung target order dan target komisi realistis." },
  { id: "review", label: "Review Builder", icon: "⭐", desc: "Review produk yang jujur, natural, dan siap posting." },
  { id: "history", label: "Riwayat", icon: "🗂️", desc: "Simpan, copy ulang, export, atau hapus hasil." }
];

const toolMeta = {
  angle: { title: "Product Angle Finder", eyebrow: "Tool 01", desc: "Ubah produk biasa jadi angle promosi yang lebih enak dibahas dan nggak terasa maksa." },
  hook: { title: "Affiliate Hook Generator", eyebrow: "Tool 02", desc: "Kumpulan hook pendek untuk TikTok, Reels, Shorts, dan Threads dengan bahasa casual." },
  caption: { title: "Caption Affiliate Generator", eyebrow: "Tool 03", desc: "Bikin caption affiliate yang natural, soft selling, review jujur, storytelling, sampai Threads." },
  cta: { title: "CTA Affiliate Generator", eyebrow: "Tool 04", desc: "Pilih CTA yang halus, direct, Gen Z, urgent secukupnya, dan cocok buat closing." },
  script: { title: "Script Video Affiliate", eyebrow: "Tool 05", desc: "Generate script video pendek lengkap dengan opening, scene, overlay, VO, B-roll, dan CTA." },
  calendar: { title: "Ide Konten Affiliate 30 Hari", eyebrow: "Tool 06", desc: "Kalender konten 30 hari supaya promosi nggak cuma jualan terus dan audiens nggak bosan." },
  reply: { title: "Komentar & DM Reply Assistant", eyebrow: "Tool 07", desc: "Template balasan untuk komentar dan DM yang sering muncul saat promosi affiliate." },
  calculator: { title: "Komisi & Target Calculator", eyebrow: "Tool 08", desc: "Hitung komisi, target order, dan estimasi penghasilan agar target affiliate lebih kebayang." },
  review: { title: "Product Review Builder", eyebrow: "Tool 09", desc: "Bikin review pendek, panjang, plus-minus, siapa yang cocok, dan CTA soft selling." }
};

const formSchemas = {
  angle: [
    ["product", "Nama produk", "input", "Contoh: Mini blender portable"], ["category", "Kategori produk", "input", "Contoh: alat dapur"],
    ["target", "Target pembeli", "input", "Contoh: anak kos dan pekerja sibuk"], ["problem", "Masalah utama pembeli", "textarea", "Contoh: pengen hidup sehat tapi males ribet"],
    ["benefit", "Benefit produk", "textarea", "Contoh: bikin jus cepat, gampang dibawa, mudah dibersihkan"]
  ],
  hook: [
    ["product", "Nama produk", "input", "Nama produk affiliate"], ["problem", "Masalah audiens", "textarea", "Masalah yang paling sering mereka rasain"],
    ["benefit", "Benefit utama", "textarea", "Hasil yang mereka pengen dapat"], ["platform", "Platform", "select", ["TikTok", "IG Reels", "YouTube Shorts", "Threads"]]
  ],
  caption: [
    ["product", "Nama produk", "input", "Nama produk affiliate"], ["target", "Target pembeli", "input", "Siapa yang paling cocok"],
    ["problem", "Masalah pembeli", "textarea", "Masalah harian mereka"], ["benefit", "Benefit produk", "textarea", "Benefit paling menarik"],
    ["tone", "Tone", "select", ["santai", "Gen Z", "edukatif", "soft selling", "review jujur"]]
  ],
  cta: [
    ["product", "Produk", "input", "Nama produk"], ["goal", "Tujuan CTA", "select", ["komentar", "DM", "klik link", "cek bio", "checkout"]],
    ["keyword", "Kata kunci CTA jika ada", "input", "Contoh: MAU, LINK, CEK"]
  ],
  script: [
    ["product", "Nama produk", "input", "Nama produk"], ["problem", "Masalah pembeli", "textarea", "Masalah yang mau diangkat"],
    ["benefit", "Benefit produk", "textarea", "Benefit utama"], ["duration", "Durasi", "select", ["15 detik", "30 detik", "60 detik"]],
    ["style", "Style", "select", ["review", "storytelling", "problem solution", "listicle"]]
  ],
  calendar: [
    ["niche", "Niche produk", "input", "Contoh: skincare, gadget, rumah tangga"], ["product", "Produk utama", "input", "Nama produk"],
    ["target", "Target pembeli", "input", "Target audiens"], ["platform", "Platform", "select", ["TikTok", "IG Reels", "YouTube Shorts", "Threads", "Campuran"]]
  ],
  reply: [
    ["product", "Nama produk", "input", "Nama produk"], ["price", "Harga produk", "input", "Contoh: Rp129.000"],
    ["link", "Link affiliate/link bio", "input", "Contoh: link di bio / bit.ly/..."], ["tone", "Tone", "select", ["santai", "ramah", "semi profesional"]]
  ],
  calculator: [
    ["price", "Harga produk", "number", "Contoh: 129000"], ["commission", "Persentase komisi", "number", "Contoh: 10"],
    ["targetIncome", "Target penghasilan", "number", "Contoh: 3000000"], ["dailySales", "Estimasi penjualan per hari", "number", "Contoh: 3"]
  ],
  review: [
    ["product", "Nama produk", "input", "Nama produk"], ["category", "Kategori produk", "input", "Kategori"],
    ["pros", "Kelebihan produk", "textarea", "Apa yang bagus dari produk ini"], ["cons", "Kekurangan produk jika ada", "textarea", "Isi '-' kalau belum tahu"],
    ["fit", "Cocok untuk siapa", "textarea", "Target pembeli paling cocok"], ["price", "Harga", "input", "Contoh: Rp129.000"]
  ]
};

const state = { current: "dashboard", toastTimer: null };
const $ = (selector) => document.querySelector(selector);
const view = $("#viewContainer");

function escapeHTML(value = "") {
  return String(value).replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]));
}
function slug(text) { return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""); }
function money(value) { return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Number(value || 0)); }
function nowLabel() { return new Date().toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" }); }
function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(state.toastTimer);
  state.toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}
function textFromHTML(html) {
  const temp = document.createElement("div");
  temp.innerHTML = html;
  return temp.innerText.trim();
}

function setupChrome() {
  $("#heroBadges").innerHTML = badges.map((badge) => `<span class="badge">${badge}</span>`).join("");
  const navHTML = navItems.map((item) => navButton(item)).join("");
  $("#sideNav").innerHTML = navHTML;
  $("#bottomNav").innerHTML = navItems.slice(0, 4).concat(navItems.find((x) => x.id === "history")).map((item) => navButton(item)).join("");
  document.body.addEventListener("click", handleGlobalClick);
  window.addEventListener("hashchange", route);
}
function navButton(item) {
  return `<button class="nav-link" data-route="${item.id}" type="button"><span class="nav-icon">${item.icon}</span><span>${item.label}</span></button>`;
}
function setActiveNav() {
  document.querySelectorAll("[data-route]").forEach((el) => el.classList.toggle("active", el.dataset.route === state.current));
  $("#heroSection").style.display = state.current === "dashboard" ? "grid" : "none";
}
function route() {
  state.current = (location.hash || "#dashboard").replace("#", "");
  if (!navItems.some((item) => item.id === state.current)) state.current = "dashboard";
  setActiveNav();
  if (state.current === "dashboard") renderDashboard();
  else if (state.current === "history") renderHistory();
  else renderTool(state.current);
  window.scrollTo({ top: 0, behavior: "smooth" });
}
function handleGlobalClick(event) {
  const routeEl = event.target.closest("[data-route]");
  if (routeEl) {
    event.preventDefault();
    location.hash = routeEl.dataset.route;
    return;
  }
  const copyEl = event.target.closest("[data-copy]");
  if (copyEl) copyText(decodeURIComponent(copyEl.dataset.copy));
  const exportEl = event.target.closest("[data-export]");
  if (exportEl) exportText(decodeURIComponent(exportEl.dataset.export), exportEl.dataset.filename || "affiliate-output.txt");
  const deleteEl = event.target.closest("[data-delete]");
  if (deleteEl) deleteHistory(deleteEl.dataset.delete);
  if (event.target.matches("#clearHistory")) clearHistory();
}
async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch (error) {
    const helper = document.createElement("textarea");
    helper.value = text;
    helper.setAttribute("readonly", "");
    helper.style.position = "fixed";
    helper.style.opacity = "0";
    document.body.appendChild(helper);
    helper.select();
    document.execCommand("copy");
    helper.remove();
  }
  showToast("Berhasil disalin");
}
function exportText(text, filename) {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
  showToast("Berhasil diexport");
}

function renderHeader(title, eyebrow, desc) {
  return `<div class="view-header"><span class="eyebrow">${eyebrow}</span><h2>${title}</h2><p>${desc}</p></div>`;
}
function renderDashboard() {
  view.innerHTML = `${renderHeader("Dashboard Affiliate Promo Assistant", "Mini SaaS Dashboard", "Pilih tools sesuai kebutuhan promosi kamu: mau cari angle, bikin hook, caption, CTA, script video, sampai balas DM juga bisa.")}
  <div class="view-body grid">
    <div class="badge-row">${badges.map((badge) => `<span class="badge light">${badge}</span>`).join("")}</div>
    <div class="grid three">
      <div class="stat-card"><p>Fokus tools</p><strong>Siap Posting</strong><p>Output dibuat biar bisa langsung dicopy ke konten, bukan teori panjang.</p></div>
      <div class="stat-card"><p>Mode kerja</p><strong>Tanpa API</strong><p>Semua template berjalan di browser dan bisa dipakai dari HP.</p></div>
      <div class="stat-card"><p>Target</p><strong>Pemula</strong><p>Cocok buat yang sudah punya link tapi bingung mulai promosi.</p></div>
    </div>
    <div class="grid two">
      <div class="form-panel"><h3>Cara pakai 3 langkah</h3><div class="grid steps"><div class="step"><div><strong>Masukkan produk dan target pembeli</strong><p>Tulis produk, masalah audiens, benefit, harga, atau link sesuai tools yang dipilih.</p></div></div><div class="step"><div><strong>Klik generate</strong><p>Tools akan bikin output dengan bahasa casual, natural, dan nggak terlalu hard selling.</p></div></div><div class="step"><div><strong>Copy hasil dan pakai</strong><p>Pakai buat caption, video pendek, komentar, DM, Threads, atau evaluasi target komisi.</p></div></div></div></div>
      <div class="form-panel"><h3>Cocok untuk siapa?</h3><ul><li>Affiliator pemula yang udah punya link tapi bingung promosi.</li><li>Kreator kecil yang ingin konten lebih relate dan nggak kaku.</li><li>Seller yang susah bikin angle konten harian.</li><li>Orang yang postingnya sepi klik, komentar, dan pembeli.</li></ul></div>
    </div>
    <div><h3>Quick Access Tools</h3><div class="grid three">${navItems.filter((item) => !["dashboard", "history"].includes(item.id)).map((item) => `<article class="feature-card" data-route="${item.id}"><div class="icon">${item.icon}</div><h3>${item.label}</h3><p>${item.desc}</p></article>`).join("")}</div></div>
  </div>`;
}
function renderTool(id) {
  const meta = toolMeta[id];
  view.innerHTML = `${renderHeader(meta.title, meta.eyebrow, meta.desc)}<div class="view-body"><form class="form-panel" id="toolForm"><div class="error-box" id="errorBox"></div><div class="form-grid two">${formSchemas[id].map(fieldHTML).join("")}</div><button class="btn primary full" type="submit">✨ Generate Hasil Siap Pakai</button></form><div class="output-area" id="outputArea">${emptyState("Isi form dulu, nanti hasil generate muncul dalam card rapi di sini.")}</div></div>`;
  $("#toolForm").addEventListener("submit", (event) => handleGenerate(event, id));
}
function fieldHTML([name, label, type, data]) {
  if (type === "select") return `<div class="field"><label for="${name}">${label}</label><select id="${name}" name="${name}">${data.map((option) => `<option>${option}</option>`).join("")}</select></div>`;
  if (type === "textarea") return `<div class="field"><label for="${name}">${label}</label><textarea id="${name}" name="${name}" placeholder="${data}"></textarea></div>`;
  return `<div class="field"><label for="${name}">${label}</label><input id="${name}" name="${name}" type="${type}" placeholder="${data}" /></div>`;
}
function emptyState(message) { return `<div class="empty-state"><div class="empty-icon">🌱</div><h3>Belum ada hasil</h3><p>${message}</p></div>`; }
function handleGenerate(event, id) {
  event.preventDefault();
  const form = new FormData(event.target);
  const data = Object.fromEntries(form.entries());
  const missing = formSchemas[id].filter(([name]) => !String(data[name] || "").trim()).map(([, label]) => label);
  const errorBox = $("#errorBox");
  if (missing.length) {
    errorBox.textContent = `Isi dulu: ${missing.join(", ")}. Biar outputnya nggak ngawang dan lebih siap dipakai.`;
    errorBox.classList.add("show");
    return;
  }
  errorBox.classList.remove("show");
  const outputArea = $("#outputArea");
  outputArea.innerHTML = `<div class="loading"><div class="spinner"></div><span>Lagi ngeracik output yang nggak kaku...</span></div>`;
  setTimeout(() => {
    const results = generators[id](cleanData(data));
    outputArea.innerHTML = results.map((result, index) => resultCard(result.title, result.html, `${id}-${index}`)).join("");
    saveHistory(id, toolMeta[id].title, results.map((item) => `${item.title}\n${textFromHTML(item.html)}`).join("\n\n---\n\n"));
    showToast("Hasil berhasil dibuat");
  }, 650);
}
function cleanData(data) {
  return Object.fromEntries(Object.entries(data).map(([key, value]) => [key, escapeHTML(String(value).trim())]));
}
function resultCard(title, html, filenameSeed) {
  const plain = textFromHTML(`<h3>${title}</h3>${html}`);
  return `<article class="result-card"><div class="result-head"><h3>${title}</h3><div class="result-actions"><button class="icon-btn" type="button" data-copy="${encodeURIComponent(plain)}">Copy</button><button class="icon-btn" type="button" data-export="${encodeURIComponent(plain)}" data-filename="${slug(filenameSeed)}.txt">Export</button></div></div><div class="result-content">${html}</div></article>`;
}

const list = (items) => `<ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul>`;
const sections = (items) => items.map(([title, body]) => {
  const content = Array.isArray(body) ? list(body) : String(body).trim().startsWith("<") ? body : `<p>${body}</p>`;
  return `<div class="result-section"><strong>${title}</strong>${content}</div>`;
}).join("");
const pick = (arr, i) => arr[i % arr.length];

const generators = {
  angle: (d) => {
    const bases = ["problem harian", "hemat waktu", "pemula friendly", "hasil kecil yang kelihatan", "anti ribet", "upgrade rutinitas", "budget sadar", "review jujur", "before-after", "rekomendasi teman"];
    const angleItems = bases.map((base, i) => `<li><strong>${i + 1}. Angle ${base}:</strong> posisikan ${d.product} sebagai solusi buat ${d.target} yang lagi ngalamin ${d.problem}. Ide konten: buka dengan situasi real, tunjukin momen pakai produk, lalu tutup dengan CTA “kalau mau linknya, aku taruh di bio/DM ya”.</li>`).join("");
    return [
      { title: "10 Angle Promosi Produk", html: `<ol>${angleItems}</ol>` },
      { title: "Pemetaan Promosi yang Enak Dipakai", html: sections([["Pain point pembeli", `${d.target} biasanya nggak butuh penjelasan panjang. Mereka butuh merasa, “iya nih, ini masalah gue.” Angkat masalah: ${d.problem}.`], ["Alasan produk menarik", `${d.product} menarik karena benefit utamanya jelas: ${d.benefit}. Fokuskan konten ke perubahan kecil yang terasa setelah produk dipakai.`], ["Cara memposisikan produk", `Jangan langsung bilang “beli sekarang”. Posisikan sebagai rekomendasi ringan di kategori ${d.category}: “aku nemu yang lumayan ngebantu buat masalah ini.”`], ["Angle paling mudah buat pemula", `Mulai dari angle problem harian + review jujur. Ini paling natural karena kamu cukup cerita masalah, tunjukin produk, lalu kasih pendapat singkat.`]]) }
    ];
  },
  hook: (d) => {
    const cats = ["Problem aware", "Curiosity", "Before-after", "Review style", "Soft selling", "Social proof", "Beginner friendly", "Clickbait halus"];
    let count = 0;
    return [{ title: "30 Hook Affiliate Siap Pakai", html: cats.map((cat, catIndex) => `<div class="result-section"><strong>${cat}</strong><ol>${Array.from({ length: catIndex < 6 ? 4 : 3 }, () => { count += 1; return `<li>${pick([`Kalau kamu lagi ${d.problem}, ${d.product} ini worth buat dilirik dulu.`, `Aku kira ${d.benefit} itu ribet, ternyata ada cara yang lebih simpel.`, `Stop scroll bentar, ini buat kamu yang pengen ${d.benefit} tanpa drama.`, `Jujur, aku baru ngeh kenapa banyak pemula suka mulai dari ${d.product}.`, `Sebelum beli ${d.product}, coba cek ini biar nggak salah ekspektasi.`], count)} Cocok buat ${d.platform}.</li>`; }).join("")}</ol></div>`).join("") }];
  },
  caption: (d) => {
    const make = (type, n, long = false) => Array.from({ length: n }, (_, i) => `<li><strong>${type} ${i + 1}:</strong> ${long ? `Aku paham banget kalau ${d.target} sering ngerasa ${d.problem}. Makanya ${d.product} bisa jadi opsi yang masuk akal buat dicoba pelan-pelan. Benefit yang paling kerasa: ${d.benefit}. Bukan berarti wajib beli sekarang, tapi kalau kamu lagi cari solusi yang nggak ribet, ini boleh banget masuk wishlist.` : `Buat ${d.target} yang lagi ${d.problem}, ${d.product} ini bisa jadi shortcut kecil buat ${d.benefit}.`}</li>`).join("");
    return [{ title: `Caption Affiliate Tone ${d.tone}`, html: sections([["5 caption pendek", `<ol>${make("Pendek", 5)}</ol>`], ["5 caption panjang", `<ol>${make("Panjang", 5, true)}</ol>`], ["5 caption soft selling", `<ol>${make("Soft selling", 5)}</ol>`], ["5 caption review jujur", `<ol>${make("Review jujur", 5, true)}</ol>`], ["5 caption storytelling", `<ol>${make("Storytelling", 5, true)}</ol>`], ["5 caption Threads", `<ol>${make("Threads", 5)}</ol>`], ["5 caption TikTok/IG", `<ol>${make("TikTok/IG", 5)}</ol>`]]) }];
  },
  cta: (d) => {
    const keyword = d.keyword || "MAU";
    const groups = ["CTA halus", "CTA direct", "CTA Gen Z", "CTA urgent tapi tidak maksa", "CTA komentar Threads", "CTA cek bio", "CTA checkout", "CTA follow up"];
    return [{ title: "20 CTA Affiliate Siap Pakai", html: sections(groups.map((group, i) => [group, Array.from({ length: i < 4 ? 3 : 2 }, (_, j) => pick([`Kalau kamu mau aku kirimin detail ${d.product}, komen “${keyword}” ya.`, `Linknya aku taruh di bio, cek pelan-pelan dulu biar cocok sama kebutuhan kamu.`, `Kalau masih ragu, DM aja. Aku bantu jelasin yang paling relevan tanpa maksa checkout.`, `Buat yang pengen langsung coba, bisa klik link dan cek varian yang paling pas.`, `Simpan dulu postingan ini, nanti pas butuh ${d.product} kamu nggak perlu cari dari nol.`], i + j))])) }];
  },
  script: (d) => Array.from({ length: 5 }, (_, i) => ({ title: `Script Video ${i + 1} - ${d.duration}`, html: sections([["Opening 3 detik pertama", pick([`“Kamu juga sering ${d.problem}? Aku nemu cara yang lebih simpel.”`, `“Ini bukan produk ajaib, tapi lumayan ngebantu kalau kamu pengen ${d.benefit}.”`, `“Sebelum beli ${d.product}, lihat ini dulu biar ekspektasinya pas.”`], i)], ["Alur scene", [`Scene 1: tunjukin masalah nyata yang sering dialami audiens.`, `Scene 2: masukin ${d.product} sebagai solusi, jangan terlalu jualan.`, `Scene 3: tunjukin benefit: ${d.benefit}.`, `Scene 4: kasih opini singkat ala ${d.style}.`]], ["Teks overlay", [`Masalah: ${d.problem}`, `Solusi simpel: ${d.product}`, `Benefit: ${d.benefit}`, `Cek link kalau cocok sama kebutuhanmu`]], ["Voice over", `“Awalnya aku juga mikir ini bakal ribet, tapi ternyata ${d.product} cukup membantu buat ${d.benefit}. Kalau kamu lagi ngalamin ${d.problem}, produk ini bisa jadi opsi yang worth dicek dulu.”`], ["CTA akhir", `“Kalau mau linknya, cek bio atau komen ‘mau’. Aku bantu arahin biar nggak salah pilih.”`], ["Ide visual/B-roll", [`Close up produk`, `Momen sebelum pakai`, `Cara pakai singkat`, `Hasil atau perubahan kecil`, `Screenshot komentar/pertanyaan audiens`]], ["Caption singkat pendukung", `Buat kamu yang lagi ${d.problem}, ini salah satu opsi yang bisa dicoba tanpa harus ribet. Link ada di bio ya.`]]) })),
  calendar: (d) => [{ title: "Kalender Konten Affiliate 30 Hari", html: `<ol>${Array.from({ length: 30 }, (_, i) => { const goals = ["edukasi", "trust", "review", "promosi", "engagement"]; const formats = ["video pendek", "carousel", "Threads", "story", "review singkat"]; const goal = pick(goals, i); return `<li><strong>Hari ke-${i + 1}:</strong> Tema: ${pick([`masalah umum di niche ${d.niche}`, `cara memilih ${d.product}`, `review jujur pemakaian`, `kesalahan pemula`, `tips hemat sebelum beli`], i)}. Hook: “Kalau kamu ${d.target}, jangan skip ini dulu.” Format: ${pick(formats, i)}. Caption: “Ini insight kecil buat yang lagi cari ${d.product}.” CTA: “Komen kalau mau link/rekomendasi.” Tujuan: ${goal}. Platform: ${d.platform}.</li>`; }).join("")}</ol>` }],
  reply: (d) => [{ title: `Template Balasan Komentar & DM (${d.tone})`, html: sections([["Orang komen “mau”", `Mauu, aku kirimin ya. Ini link/detailnya: ${d.link}. Coba cek dulu variannya, kalau bingung pilih yang mana boleh tanya aku.`], ["Orang tanya harga", `Harganya sekitar ${d.price}. Menurutku worth dicek kalau kamu memang lagi butuh ${d.product}, tapi tetap sesuaikan sama budget ya.`], ["Orang tanya link", `Linknya di sini ya: ${d.link}. Aku saranin cek detail produk dan review pembeli dulu biar makin yakin.`], ["Orang bilang mahal", `Iya, kalau dilihat sekilas memang berasa lumayan. Tapi coba bandingin sama benefit dan seberapa sering bakal dipakai. Kalau belum urgent, wishlist dulu juga nggak apa-apa.`], ["Orang minta rekomendasi", `Kalau kebutuhanmu mirip sama yang aku bahas, ${d.product} bisa jadi opsi. Tapi kalau kamu ceritain kebutuhanmu, aku bantu arahin yang paling pas.`], ["Orang ragu produk", `Wajar kok ragu. Coba cek dulu review pembeli, bahan/spesifikasi, dan kebijakan toko. Jangan checkout kalau belum cocok.`], ["Orang tanya cara beli", `Klik link ${d.link}, pilih varian, masukin alamat, lalu checkout seperti biasa. Kalau mentok di bagian pilihan, kabarin aku ya.`], ["Follow up halus", `Hai, kemarin sempat nanya ${d.product}. Masih butuh dibantu pilih atau udah aman? Aku bantu kalau masih bingung.`], ["Closing komentar", `Aku taruh linknya ya. Semoga cocok sama kebutuhan kamu, jangan lupa cek detail produknya dulu.`], ["Closing DM", `Makasih udah nanya. Semoga rekomendasinya membantu, dan semoga kamu dapat pilihan yang paling pas.`], ["After sales", `Kalau produknya udah sampai, cobain pelan-pelan dulu ya. Kalau ada yang bikin bingung, boleh cerita. Semoga kepakai banget!`]]) }],
  calculator: (d) => {
    const price = Number(d.price), rate = Number(d.commission) / 100, target = Number(d.targetIncome), daily = Number(d.dailySales);
    const perOrder = price * rate;
    const dailyTarget = Math.ceil(target / 30 / perOrder), weeklyTarget = Math.ceil(target / 4 / perOrder), monthlyTarget = Math.ceil(target / perOrder);
    const statHTML = `<div class="grid three"><div class="stat-card"><p>Komisi per order</p><strong>${money(perOrder)}</strong></div><div class="stat-card"><p>Target order harian</p><strong>${dailyTarget} order</strong></div><div class="stat-card"><p>Target order bulanan</p><strong>${monthlyTarget} order</strong></div></div>`;
    const detailHTML = sections([
      ["Target order", [`Harian: ${dailyTarget} order`, `Mingguan: ${weeklyTarget} order`, `Bulanan: ${monthlyTarget} order`]],
      ["Estimasi penghasilan", [`Harian dari ${daily} penjualan: ${money(perOrder * daily)}`, `Mingguan: ${money(perOrder * daily * 7)}`, `Bulanan: ${money(perOrder * daily * 30)}`]],
      ["Catatan strategi", `Kalau target terasa berat, jangan cuma tambah posting. Perbaiki hook, ulangi angle yang dapat komentar, dan pakai produk mid ticket dengan komisi sehat.`],
      ["Saran level produk", [`Low ticket: mudah closing, cocok buat latihan volume.`, `Mid ticket: paling seimbang untuk pemula yang mulai serius.`, `High ticket: komisi besar, tapi butuh trust dan review lebih kuat.`]]
    ]);
    return [{ title: "Ringkasan Target Komisi", html: `${statHTML}${detailHTML}` }];
  },
  review: (d) => [{ title: `Review Builder - ${d.product}`, html: sections([["Review pendek", `${d.product} adalah produk ${d.category} yang cocok buat kamu yang butuh solusi praktis. Plus utamanya: ${d.pros}. Kekurangannya: ${d.cons}.`], ["Review panjang", `Kalau kamu lagi cari ${d.category}, ${d.product} cukup menarik buat dicek karena punya beberapa kelebihan yang relevan: ${d.pros}. Tapi biar fair, bagian yang perlu dipertimbangkan adalah ${d.cons}. Dengan harga ${d.price}, produk ini paling masuk akal buat ${d.fit}.`], ["Poin plus", d.pros.split(",").map((x) => x.trim()).filter(Boolean)], ["Poin minus", d.cons === "-" ? ["Belum ada catatan minus spesifik. Tetap cek review pembeli sebelum checkout."] : d.cons.split(",").map((x) => x.trim()).filter(Boolean)], ["Siapa yang cocok beli", d.fit], ["Siapa yang kurang cocok", `Kurang cocok buat orang yang belum butuh ${d.category} atau masih cari opsi paling murah tanpa peduli fitur.`], ["Kesimpulan review", `Worth dicek kalau benefitnya sesuai kebutuhanmu. Jangan beli karena FOMO, beli kalau memang problem kamu nyambung.`], ["CTA soft selling", `Kalau mau cek detail dan harga terbaru, linknya bisa kamu lihat di bio/DM aku ya.`], ["Versi Threads", `${d.product} ini menarik karena ${d.pros}. Tapi tetap ada catatan: ${d.cons}. Cocok buat ${d.fit}. Menurutku cek detail dulu sebelum checkout biar nggak salah ekspektasi.`], ["Versi TikTok/IG caption", `Review singkat ${d.product}: plusnya ${d.pros}. Minusnya ${d.cons}. Kalau kamu termasuk ${d.fit}, ini boleh masuk wishlist.`]]) }]
};

function getHistory() { return JSON.parse(localStorage.getItem("affiliatePromoHistory") || "[]"); }
function setHistory(items) { localStorage.setItem("affiliatePromoHistory", JSON.stringify(items)); }
function saveHistory(toolId, feature, content) {
  const items = getHistory();
  items.unshift({ id: crypto.randomUUID(), toolId, feature, date: nowLabel(), content, preview: content.slice(0, 180) });
  setHistory(items.slice(0, 60));
}
function renderHistory() {
  const items = getHistory();
  view.innerHTML = `${renderHeader("Riwayat Generate", "LocalStorage", "Semua hasil tersimpan di browser kamu. Bisa copy ulang, export ulang, hapus satu item, atau hapus semua.")}<div class="view-body"><div class="history-toolbar"><strong>${items.length} hasil tersimpan</strong><button class="btn danger" id="clearHistory" type="button">Hapus Semua</button></div>${items.length ? `<div class="history-list">${items.map(historyItem).join("")}</div>` : emptyState("Belum ada riwayat. Generate salah satu tools dulu, nanti otomatis tersimpan di sini.")}</div>`;
}
function historyItem(item) {
  return `<article class="history-item"><h3>${escapeHTML(item.feature)}</h3><div class="history-meta">${escapeHTML(item.date)}</div><div class="history-preview">${escapeHTML(item.preview)}...</div><div class="result-actions"><button class="icon-btn" data-copy="${encodeURIComponent(item.content)}" type="button">Copy ulang</button><button class="icon-btn" data-export="${encodeURIComponent(item.content)}" data-filename="${slug(item.feature)}.txt" type="button">Export ulang</button><button class="icon-btn" data-delete="${item.id}" type="button">Hapus</button></div></article>`;
}
function deleteHistory(id) { setHistory(getHistory().filter((item) => item.id !== id)); renderHistory(); showToast("Riwayat dihapus"); }
function clearHistory() { setHistory([]); renderHistory(); showToast("Semua riwayat dihapus"); }

setupChrome();
route();
})();

(() => {
  if (document.body.dataset.page !== "finance") return;
const STORAGE_KEY = "bukuKeuanganDigital:v1";
const MONTH_NAMES = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
const CATEGORIES = ["Produk Digital", "APK Premium", "Affiliate", "Jasa", "Langganan Pro / Premium AI", "Akses AI", "Tools Digital", "Lainnya"];
const PLATFORMS = ["Lynk ID", "WhatsApp", "Threads", "Instagram", "TikTok", "Shopee", "Telegram", "Langganan Pro / Premium AI", "QRIS Manual", "Transfer Manual", "Marketplace", "Lainnya"];
const PAYMENTS = ["QRIS DANA", "QRIS GoPay", "Transfer Bank", "E-wallet", "Cash", "Lynk ID Web", "Lainnya"];
const STATUSES = ["Lunas", "Belum Lunas", "Refund"];
const navItems = [
  { id: "dashboard", label: "Dashboard", icon: "🏠" },
  { id: "tambah", label: "Tambah", icon: "➕" },
  { id: "transaksi", label: "Transaksi", icon: "📒" },
  { id: "produk", label: "Produk", icon: "📦" },
  { id: "rekap", label: "Rekap", icon: "📊" },
  { id: "pengaturan", label: "Atur", icon: "⚙️" }
];

let db = loadDB();
let state = {
  route: location.hash.replace("#", "") || "dashboard",
  activeMonth: currentMonthKey(),
  editingId: null,
  productEditingId: null,
  filters: { search: "", category: "Semua", platform: "Semua", payment: "Semua", status: "Semua", sort: "newest" },
  toastTimer: null
};

const $ = (selector) => document.querySelector(selector);
const view = $("#viewContainer");

function defaultDB() {
  return { transactions: [], products: [], targets: {}, settings: { theme: "light" } };
}

function loadDB() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...defaultDB(), ...JSON.parse(raw) } : defaultDB();
  } catch (error) {
    console.warn(error);
    return defaultDB();
  }
}

function saveDB() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

function uid(prefix = "id") {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function escapeHTML(value = "") {
  return String(value).replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]));
}

function number(value) {
  return Number(String(value ?? "").replace(/[^0-9.-]/g, "")) || 0;
}

function money(value) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(number(value));
}

function formatDate(value) {
  if (!value) return "-";
  return new Date(`${value}T00:00:00`).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
}

function currentMonthKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function previousMonthKey(key) {
  const [year, month] = key.split("-").map(Number);
  const d = new Date(year, month - 2, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function getMonthKey(date) {
  return (date || new Date().toISOString().slice(0, 10)).slice(0, 7);
}

function monthLabel(key) {
  const [year, month] = key.split("-").map(Number);
  return `${MONTH_NAMES[month - 1]} ${year}`;
}

function shortMonthLabel(key) {
  const [year, month] = key.split("-").map(Number);
  return `${MONTH_NAMES[month - 1].slice(0, 3).toUpperCase()} ${year}`;
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function options(items, selected = "") {
  return items.map((item) => `<option value="${escapeHTML(item)}" ${item === selected ? "selected" : ""}>${escapeHTML(item)}</option>`).join("");
}

function calcTotal(tx) {
  return number(tx.qty) * number(tx.price);
}

function calcProfit(tx) {
  return calcTotal(tx) - number(tx.modal) - number(tx.discount) - number(tx.fee);
}

function isActive(tx) {
  return tx.status !== "Refund";
}

function getTransactionsForMonth(monthKey = state.activeMonth) {
  return db.transactions.filter((tx) => getMonthKey(tx.date) === monthKey);
}

function applyFilters(items) {
  const f = state.filters;
  let list = [...items];
  if (f.search) list = list.filter((tx) => tx.name.toLowerCase().includes(f.search.toLowerCase()));
  if (f.category !== "Semua") list = list.filter((tx) => tx.category === f.category);
  if (f.platform !== "Semua") list = list.filter((tx) => tx.platform === f.platform);
  if (f.payment !== "Semua") list = list.filter((tx) => tx.payment === f.payment);
  if (f.status !== "Semua") list = list.filter((tx) => tx.status === f.status);
  if (f.sort === "profit") list.sort((a, b) => calcProfit(b) - calcProfit(a));
  else list.sort((a, b) => new Date(b.date) - new Date(a.date) || b.createdAt - a.createdAt);
  return list;
}

function topBy(items, key, valueGetter = () => 1) {
  const map = new Map();
  items.forEach((item) => {
    const label = item[key] || "-";
    map.set(label, (map.get(label) || 0) + valueGetter(item));
  });
  const sorted = [...map.entries()].sort((a, b) => b[1] - a[1]);
  return sorted[0] ? { label: sorted[0][0], value: sorted[0][1] } : { label: "-", value: 0 };
}

function summarize(items) {
  const active = items.filter(isActive);
  return {
    omzet: active.reduce((sum, tx) => sum + calcTotal(tx), 0),
    modal: active.reduce((sum, tx) => sum + number(tx.modal), 0),
    profit: active.reduce((sum, tx) => sum + calcProfit(tx), 0),
    total: items.length,
    sold: active.reduce((sum, tx) => sum + number(tx.qty), 0),
    lunas: items.filter((tx) => tx.status === "Lunas").length,
    belum: items.filter((tx) => tx.status === "Belum Lunas").length,
    refund: items.filter((tx) => tx.status === "Refund").length,
    topProduct: topBy(active, "name", (tx) => number(tx.qty)),
    topPayment: topBy(active, "payment"),
    topPlatform: topBy(active, "platform", calcTotal)
  };
}

function allMonthKeys() {
  const set = new Set([currentMonthKey(), state.activeMonth, ...db.transactions.map((tx) => getMonthKey(tx.date)), ...Object.keys(db.targets)]);
  for (let i = -5; i <= 6; i++) {
    const d = new Date();
    d.setMonth(d.getMonth() + i, 1);
    set.add(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  }
  return [...set].sort().reverse();
}

function toast(message) {
  const el = $("#toast");
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(state.toastTimer);
  state.toastTimer = setTimeout(() => el.classList.remove("show"), 2600);
}

function setRoute(route) {
  state.route = route;
  location.hash = route;
  state.editingId = null;
  state.productEditingId = null;
  render();
}

function setupShell() {
  document.documentElement.dataset.theme = db.settings.theme || "light";
  [$("#bottomNav"), $("#sideNav")].forEach((nav) => {
    if (!nav) return;
    nav.innerHTML = navItems.map((item) => `
      <button type="button" class="nav-link" data-route="${item.id}">
        <span class="ico">${item.icon}</span><span>${item.label}</span>
      </button>`).join("");
  });
  document.body.addEventListener("click", (event) => {
    const routeBtn = event.target.closest("[data-route]");
    if (routeBtn) {
      event.preventDefault();
      setRoute(routeBtn.dataset.route);
    }
  });
  $("#themeToggle").addEventListener("click", toggleTheme);
  $("#monthSelect").addEventListener("change", (event) => {
    state.activeMonth = event.target.value;
    render();
  });
  $("#copySummaryBtn").addEventListener("click", copyMonthSummary);
  $("#importFile").addEventListener("change", handleImportFile);
  window.addEventListener("hashchange", () => {
    const next = location.hash.replace("#", "") || "dashboard";
    if (next !== state.route) {
      state.route = next;
      render();
    }
  });
}

function syncNav() {
  $("#pageTitle").textContent = navItems.find((item) => item.id === state.route)?.label || "Dashboard";
  document.querySelectorAll(".nav-link").forEach((link) => link.classList.toggle("active", link.dataset.route === state.route));
  $("#themeToggle").textContent = db.settings.theme === "dark" ? "☀️" : "🌙";
}

function renderMonthSelect() {
  const select = $("#monthSelect");
  select.innerHTML = allMonthKeys().map((key) => `<option value="${key}" ${key === state.activeMonth ? "selected" : ""}>${shortMonthLabel(key)}</option>`).join("");
}

function render() {
  renderMonthSelect();
  syncNav();
  const routes = { dashboard: renderDashboard, tambah: renderAdd, transaksi: renderTransactions, produk: renderProducts, rekap: renderRecap, pengaturan: renderSettings };
  (routes[state.route] || renderDashboard)();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function metric(label, value, hint = "", cls = "") {
  return `<article class="card metric ${cls}"><span class="label">${label}</span><span class="value">${value}</span>${hint ? `<span class="hint">${hint}</span>` : ""}</article>`;
}

function renderDashboard() {
  const monthTx = getTransactionsForMonth();
  const sum = summarize(monthTx);
  const prevKey = previousMonthKey(state.activeMonth);
  const prevSum = summarize(getTransactionsForMonth(prevKey));
  const deltaProfit = sum.profit - prevSum.profit;
  const target = number(db.targets[state.activeMonth]);
  const pct = target ? Math.min(100, Math.round((sum.omzet / target) * 100)) : 0;
  const remaining = Math.max(0, target - sum.omzet);
  const lastTx = applyFilters(monthTx).slice(0, 4);
  view.innerHTML = `
    <div class="month-chips">${allMonthKeys().slice(0, 12).map((key) => `<button class="chip ${key === state.activeMonth ? "active" : ""}" data-month="${key}" type="button">${shortMonthLabel(key)}</button>`).join("")}</div>
    <div class="grid four" style="margin-top:12px">
      ${metric("Omzet bulan ini", money(sum.omzet), monthLabel(state.activeMonth), "good")}
      ${metric("Modal bulan ini", money(sum.modal), "Refund tidak dihitung")}
      ${metric("Keuntungan", money(sum.profit), `${sum.total} transaksi tercatat`, sum.profit >= 0 ? "good" : "bad")}
      ${metric("Produk terjual", sum.sold, `${sum.lunas} lunas · ${sum.refund} refund`)}
    </div>
    <div class="grid two" style="margin-top:12px">
      <section class="card">
        <div class="card-header"><div><h3>Target ${monthLabel(state.activeMonth)}</h3><p class="muted">Isi target omzet bulanan dan pantau progress otomatis.</p></div></div>
        <form id="targetForm" class="form-grid">
          <div class="field"><label>Target omzet</label><input name="target" inputmode="numeric" type="number" min="0" value="${target || ""}" placeholder="Contoh: 1000000"></div>
          <button class="btn primary" type="submit">Simpan Target</button>
        </form>
        <div style="margin-top:14px" class="progress"><span style="width:${pct}%"></span></div>
        <p class="muted" style="margin:10px 0 0">Target bulan ${MONTH_NAMES[Number(state.activeMonth.slice(5)) - 1]} sudah tercapai <strong>${pct}%</strong>. ${target ? `Sisa target: <strong>${money(remaining)}</strong>.` : "Belum ada target."} ${target && remaining === 0 ? "🎉 Target tercapai, pertahankan ritmenya!" : ""}</p>
      </section>
      <section class="card kv">
        <div class="card-header"><div><h3>Insight Bulan Aktif</h3><p class="muted">Rekap otomatis dari transaksi non-refund.</p></div></div>
        ${kv("Transaksi lunas", sum.lunas)}${kv("Belum lunas", sum.belum)}${kv("Refund", sum.refund)}${kv("Produk paling sering", sum.topProduct.label)}${kv("Pembayaran utama", sum.topPayment.label)}${kv("Sumber paling menghasilkan", `${sum.topPlatform.label} · ${money(sum.topPlatform.value)}`)}${kv("Insight produk", sum.topProduct.label !== "-" ? `Produk paling laris bulan ini adalah ${sum.topProduct.label}` : "Belum ada data")}${kv("Insight sumber", sum.topPlatform.label !== "-" ? `Sumber pemasukan terbesar bulan ini dari ${sum.topPlatform.label}` : "Belum ada data")}${kv("Piutang", `Kamu masih punya ${sum.belum} transaksi belum lunas`)}${kv("Perbandingan profit", prevSum.total ? `Keuntungan bulan ini ${deltaProfit >= 0 ? "naik" : "turun"} ${money(Math.abs(deltaProfit))} dibanding ${monthLabel(prevKey)}` : "Belum ada data bulan sebelumnya")}
      </section>
    </div>
    <section class="card" style="margin-top:12px">
      <div class="card-header"><div><h3>Transaksi Terbaru</h3><p class="muted">Riwayat terbaru untuk ${monthLabel(state.activeMonth)}.</p></div><button class="btn secondary small" data-route="transaksi">Lihat Semua</button></div>
      ${lastTx.length ? renderTransactionCards(lastTx) : emptyState("Belum ada transaksi", "Tambahkan transaksi pertama untuk bulan ini.")}
    </section>`;
  view.querySelectorAll("[data-month]").forEach((btn) => btn.addEventListener("click", () => { state.activeMonth = btn.dataset.month; render(); }));
  $("#targetForm").addEventListener("submit", (event) => {
    event.preventDefault();
    db.targets[state.activeMonth] = number(new FormData(event.target).get("target"));
    saveDB(); toast("Target bulanan disimpan"); render();
  });
}

function kv(label, value) {
  return `<div class="kv-row"><span>${label}</span><strong>${escapeHTML(value)}</strong></div>`;
}

function renderAdd() {
  const editing = db.transactions.find((tx) => tx.id === state.editingId);
  view.innerHTML = `
    <div class="tabs"><button class="chip active" type="button" data-tab="full">Form Lengkap</button><button class="chip" type="button" data-tab="quick">Tambah Cepat</button></div>
    <section class="card" style="margin-top:12px" id="addPanel">${renderTransactionForm(editing)}</section>`;
  bindTransactionForm(editing);
  view.querySelectorAll("[data-tab]").forEach((btn) => btn.addEventListener("click", () => {
    view.querySelectorAll(".chip").forEach((c) => c.classList.remove("active"));
    btn.classList.add("active");
    $("#addPanel").innerHTML = btn.dataset.tab === "quick" ? renderQuickForm() : renderTransactionForm(editing);
    btn.dataset.tab === "quick" ? bindQuickForm() : bindTransactionForm(editing);
  }));
}

function renderTransactionForm(tx = {}) {
  return `
    <div class="card-header"><div><h3>${tx?.id ? "Edit Transaksi" : "Tambah Transaksi Manual"}</h3><p class="muted">Keuntungan dihitung otomatis: total harga jual - modal - diskon - biaya admin.</p></div></div>
    <form id="transactionForm" class="form-grid">
      ${input("date", "Tanggal", "date", tx.date || today())}
      <div class="field"><label>Pilih produk cepat</label><select id="productPicker"><option value="">Tidak pakai produk cepat</option>${db.products.map((p) => `<option value="${p.id}">${escapeHTML(p.name)}</option>`).join("")}</select></div>
      ${input("name", "Nama produk", "text", tx.name || "", "Contoh: Gemini Pro 6 B")}
      ${selectField("category", "Kategori produk", CATEGORIES, tx.category || CATEGORIES[0])}
      ${selectField("platform", "Platform / sumber penjualan", PLATFORMS, tx.platform || PLATFORMS[0])}
      ${input("qty", "Jumlah terjual", "number", tx.qty || 1, "", "1")}
      ${input("modal", "Modal", "number", tx.modal || 0)}
      ${input("price", "Harga jual", "number", tx.price || 0)}
      ${input("discount", "Diskon", "number", tx.discount || 0)}
      ${input("fee", "Biaya admin / fee", "number", tx.fee || 0)}
      <div class="field"><label>Keuntungan otomatis</label><input id="profitPreview" readonly value="${money(tx.id ? calcProfit(tx) : 0)}"></div>
      ${selectField("payment", "Metode pembayaran", PAYMENTS, tx.payment || PAYMENTS[0])}
      ${selectField("status", "Status", STATUSES, tx.status || STATUSES[0])}
      <div class="field full"><label>Catatan</label><textarea name="note" placeholder="Catatan tambahan">${escapeHTML(tx.note || "")}</textarea></div>
      <div class="field full form-actions"><button class="btn primary" type="submit">${tx?.id ? "Update Transaksi" : "Simpan Transaksi"}</button>${tx?.id ? `<button class="btn ghost" type="button" id="cancelEdit">Batal Edit</button>` : ""}</div>
    </form>`;
}

function renderQuickForm() {
  return `
    <div class="card-header"><div><h3>Tambah Cepat</h3><p class="muted">Untuk input cepat dari HP. Tanggal otomatis hari ini.</p></div></div>
    <form id="quickForm" class="form-grid">
      ${input("date", "Tanggal", "date", today())}
      ${input("name", "Nama produk", "text", "")}
      ${input("price", "Harga jual", "number", 0)}
      ${input("modal", "Modal", "number", 0)}
      ${selectField("platform", "Sumber penjualan", PLATFORMS, PLATFORMS[0])}
      ${selectField("payment", "Metode pembayaran", PAYMENTS, PAYMENTS[0])}
      <div class="field full form-actions"><button class="btn primary" type="submit">Simpan Cepat</button></div>
    </form>`;
}

function input(name, label, type, value = "", placeholder = "", min = "0") {
  return `<div class="field"><label>${label}</label><input name="${name}" type="${type}" ${type === "number" ? `min="${min}" inputmode="numeric"` : ""} value="${escapeHTML(value)}" placeholder="${escapeHTML(placeholder)}"></div>`;
}

function selectField(name, label, items, selected) {
  return `<div class="field"><label>${label}</label><select name="${name}">${options(items, selected)}</select></div>`;
}

function bindTransactionForm(editing) {
  const form = $("#transactionForm");
  const updateProfit = () => {
    const data = Object.fromEntries(new FormData(form));
    $("#profitPreview").value = money(calcProfit(data));
  };
  ["qty", "price", "modal", "discount", "fee"].forEach((name) => form.elements[name].addEventListener("input", updateProfit));
  $("#productPicker").addEventListener("change", (event) => {
    const p = db.products.find((item) => item.id === event.target.value);
    if (!p) return;
    form.elements.name.value = p.name;
    form.elements.category.value = p.category;
    form.elements.price.value = p.price;
    form.elements.modal.value = p.modal;
    updateProfit();
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const tx = normalizeTransaction(Object.fromEntries(new FormData(form)), editing?.id);
    if (!tx.name.trim()) return toast("Nama produk wajib diisi");
    if (editing?.id) db.transactions = db.transactions.map((item) => item.id === editing.id ? tx : item);
    else db.transactions.push(tx);
    state.activeMonth = getMonthKey(tx.date);
    state.editingId = null;
    saveDB(); toast(editing?.id ? "Transaksi diperbarui" : "Transaksi tersimpan"); setRoute("transaksi");
  });
  $("#cancelEdit")?.addEventListener("click", () => { state.editingId = null; render(); });
}

function bindQuickForm() {
  $("#quickForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.target));
    const tx = normalizeTransaction({ ...data, qty: 1, discount: 0, fee: 0, category: "Lainnya", platform: data.platform || "Lainnya", status: "Lunas", note: "Input cepat" });
    if (!tx.name.trim()) return toast("Nama produk wajib diisi");
    db.transactions.push(tx);
    state.activeMonth = getMonthKey(tx.date);
    saveDB(); toast("Transaksi cepat tersimpan"); setRoute("transaksi");
  });
}

function normalizeTransaction(data, id = null) {
  const existing = db.transactions.find((tx) => tx.id === id) || {};
  return {
    id: id || uid("tx"), createdAt: existing.createdAt || Date.now(), updatedAt: Date.now(),
    date: data.date || today(), name: String(data.name || "").trim(), category: data.category || "Lainnya", platform: data.platform || "Manual",
    qty: number(data.qty) || 1, modal: number(data.modal), price: number(data.price), discount: number(data.discount), fee: number(data.fee),
    payment: data.payment || "Lainnya", status: data.status || "Lunas", note: String(data.note || "").trim()
  };
}

function renderTransactions() {
  const monthTx = applyFilters(getTransactionsForMonth());
  view.innerHTML = `
    <section class="card">
      <div class="card-header"><div><h3>Filter & Pencarian</h3><p class="muted">Cari, filter, dan sortir transaksi bulan aktif.</p></div><button class="btn primary small" data-route="tambah">+ Tambah</button></div>
      <div class="form-grid">
        <div class="field"><label>Search nama produk</label><input id="filterSearch" value="${escapeHTML(state.filters.search)}" placeholder="Cari produk..."></div>
        ${filterSelect("filterCategory", "Filter kategori", ["Semua", ...CATEGORIES], state.filters.category)}
        ${filterSelect("filterPlatform", "Filter sumber penjualan", ["Semua", ...PLATFORMS], state.filters.platform)}
        ${filterSelect("filterPayment", "Filter pembayaran", ["Semua", ...PAYMENTS], state.filters.payment)}
        ${filterSelect("filterStatus", "Filter status", ["Semua", ...STATUSES], state.filters.status)}
        ${filterSelect("filterSort", "Sortir", [["newest", "Tanggal terbaru"], ["profit", "Keuntungan terbesar"]], state.filters.sort)}
      </div>
    </section>
    <section class="card" style="margin-top:12px">
      <div class="card-header"><div><h3>Transaksi ${monthLabel(state.activeMonth)}</h3><p class="muted">Desktop tampil tabel, HP tampil card agar nyaman dibaca.</p></div></div>
      <div class="hide-mobile">${monthTx.length ? renderTransactionTable(monthTx) : emptyState("Belum ada transaksi", "Belum ada data untuk filter ini.")}</div>
      <div class="hide-desktop">${monthTx.length ? renderTransactionCards(monthTx) : emptyState("Belum ada transaksi", "Belum ada data untuk filter ini.")}</div>
    </section>`;
  bindFilters(); bindTxActions();
}

function filterSelect(id, label, items, selected) {
  const html = items.map((item) => Array.isArray(item)
    ? `<option value="${item[0]}" ${item[0] === selected ? "selected" : ""}>${item[1]}</option>`
    : `<option value="${item}" ${item === selected ? "selected" : ""}>${item}</option>`).join("");
  return `<div class="field"><label>${label}</label><select id="${id}">${html}</select></div>`;
}

function bindFilters() {
  const map = { filterSearch: "search", filterCategory: "category", filterPlatform: "platform", filterPayment: "payment", filterStatus: "status", filterSort: "sort" };
  Object.entries(map).forEach(([id, key]) => $("#" + id).addEventListener(id === "filterSearch" ? "input" : "change", (event) => { state.filters[key] = event.target.value; renderTransactions(); }));
}

function renderTransactionTable(items) {
  return `<div class="table-wrap"><table><thead><tr><th>No</th><th>Tanggal</th><th>Nama Produk</th><th>Kategori</th><th>Sumber Penjualan</th><th>Modal</th><th>Harga Jual</th><th>Keuntungan</th><th>Metode Pembayaran</th><th>Status</th><th>Aksi</th></tr></thead><tbody>${items.map((tx, i) => `
    <tr><td>${i + 1}</td><td>${formatDate(tx.date)}</td><td><strong>${escapeHTML(tx.name)}</strong><br><span class="muted">${tx.qty} pcs</span></td><td>${escapeHTML(tx.category)}</td><td>${escapeHTML(tx.platform)}</td><td><span class="amount-chip modal">${money(tx.modal)}</span></td><td><span class="amount-chip jual">${money(calcTotal(tx))}</span></td><td><span class="amount-chip profit">${money(calcProfit(tx))}</span></td><td><span class="amount-chip pay">${escapeHTML(tx.payment)}</span></td><td>${statusPill(tx.status)}</td><td>${txActions(tx.id)}</td></tr>`).join("")}</tbody></table></div>`;
}

function renderTransactionCards(items) {
  return `<div class="tx-card-list">${items.map((tx) => `<article class="tx-card"><div class="tx-top"><div><div class="tx-title">${escapeHTML(tx.name)}</div><p class="muted">${formatDate(tx.date)} · ${escapeHTML(tx.category)} · ${escapeHTML(tx.platform)}</p></div>${statusPill(tx.status)}</div><div class="tx-meta"><div><span>Harga Jual</span><strong class="amount-chip jual">${money(calcTotal(tx))}</strong></div><div><span>Keuntungan</span><strong class="amount-chip profit">${money(calcProfit(tx))}</strong></div><div><span>Modal</span><strong class="amount-chip modal">${money(tx.modal)}</strong></div><div><span>Pembayaran</span><strong class="amount-chip pay">${escapeHTML(tx.payment)}</strong></div></div>${txActions(tx.id)}</article>`).join("")}</div>`;
}

function statusPill(status) {
  const cls = status === "Lunas" ? "status-lunas" : status === "Refund" ? "status-refund" : "status-belum-lunas";
  return `<span class="status-pill ${cls}">${escapeHTML(status)}</span>`;
}

function txActions(id) {
  return `<div class="actions"><button class="btn ghost small" data-edit="${id}">Edit</button><button class="btn secondary small" data-duplicate="${id}">Duplikat</button><button class="btn danger small" data-delete="${id}">Hapus</button></div>`;
}

function bindTxActions() {
  view.querySelectorAll("[data-edit]").forEach((btn) => btn.addEventListener("click", () => { state.editingId = btn.dataset.edit; setRoute("tambah"); }));
  view.querySelectorAll("[data-duplicate]").forEach((btn) => btn.addEventListener("click", () => {
    const tx = db.transactions.find((item) => item.id === btn.dataset.duplicate);
    db.transactions.push({ ...tx, id: uid("tx"), createdAt: Date.now(), updatedAt: Date.now(), date: today(), note: `${tx.note || ""} (duplikat)`.trim() });
    saveDB(); toast("Transaksi diduplikat"); renderTransactions();
  }));
  view.querySelectorAll("[data-delete]").forEach((btn) => btn.addEventListener("click", () => {
    if (!confirm("Hapus transaksi ini?")) return;
    db.transactions = db.transactions.filter((tx) => tx.id !== btn.dataset.delete);
    saveDB(); toast("Transaksi dihapus"); renderTransactions();
  }));
}

function renderProducts() {
  const editing = db.products.find((p) => p.id === state.productEditingId);
  view.innerHTML = `
    <div class="grid two">
      <section class="card"><div class="card-header"><div><h3>${editing ? "Edit Produk Cepat" : "Tambah Produk Cepat"}</h3><p class="muted">Produk sering dijual bisa dipilih saat tambah transaksi.</p></div></div>${renderProductForm(editing)}</section>
      <section class="card"><div class="card-header"><div><h3>Daftar Produk</h3><p class="muted">${db.products.length} produk tersimpan.</p></div></div>${renderProductList()}</section>
    </div>`;
  bindProductForm(); bindProductActions();
}

function renderProductForm(p = {}) {
  return `<form id="productForm" class="form-grid">
    ${input("name", "Nama produk", "text", p?.name || "")}
    ${selectField("category", "Kategori", CATEGORIES, p?.category || CATEGORIES[0])}
    ${input("price", "Harga default", "number", p?.price || 0)}
    ${input("modal", "Modal default", "number", p?.modal || 0)}
    <div class="field full"><label>Catatan</label><textarea name="note">${escapeHTML(p?.note || "")}</textarea></div>
    <div class="field full form-actions"><button class="btn primary" type="submit">${p?.id ? "Update Produk" : "Simpan Produk"}</button>${p?.id ? `<button class="btn ghost" type="button" id="cancelProductEdit">Batal</button>` : ""}</div>
  </form>`;
}

function renderProductList() {
  if (!db.products.length) return emptyState("Belum ada produk cepat", "Tambahkan produk yang sering dijual agar form transaksi lebih cepat.");
  return `<div class="tx-card-list">${db.products.map((p) => `<article class="tx-card"><div class="tx-top"><div><div class="tx-title">${escapeHTML(p.name)}</div><p class="muted">${escapeHTML(p.category)} · ${money(p.price)} · Modal ${money(p.modal)}</p></div></div>${p.note ? `<p class="muted">${escapeHTML(p.note)}</p>` : ""}<div class="actions"><button class="btn ghost small" data-product-edit="${p.id}">Edit</button><button class="btn danger small" data-product-delete="${p.id}">Hapus</button></div></article>`).join("")}</div>`;
}

function bindProductForm() {
  $("#productForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.target));
    const product = { id: state.productEditingId || uid("prd"), name: String(data.name || "").trim(), category: data.category, price: number(data.price), modal: number(data.modal), note: String(data.note || "").trim(), updatedAt: Date.now() };
    if (!product.name) return toast("Nama produk wajib diisi");
    if (state.productEditingId) db.products = db.products.map((p) => p.id === state.productEditingId ? product : p);
    else db.products.push(product);
    state.productEditingId = null; saveDB(); toast("Produk cepat disimpan"); renderProducts();
  });
  $("#cancelProductEdit")?.addEventListener("click", () => { state.productEditingId = null; renderProducts(); });
}

function bindProductActions() {
  view.querySelectorAll("[data-product-edit]").forEach((btn) => btn.addEventListener("click", () => { state.productEditingId = btn.dataset.productEdit; renderProducts(); }));
  view.querySelectorAll("[data-product-delete]").forEach((btn) => btn.addEventListener("click", () => {
    if (!confirm("Hapus produk cepat ini?")) return;
    db.products = db.products.filter((p) => p.id !== btn.dataset.productDelete);
    saveDB(); toast("Produk dihapus"); renderProducts();
  }));
}

function renderRecap() {
  const all = summarize(db.transactions);
  const monthly = [...new Set(db.transactions.map((tx) => getMonthKey(tx.date)))].sort().reverse();
  const monthlyRows = monthly.map((key) => ({ key, ...summarize(getTransactionsForMonth(key)) }));
  const highestOmzet = [...monthlyRows].sort((a, b) => b.omzet - a.omzet)[0];
  const highestProfit = [...monthlyRows].sort((a, b) => b.profit - a.profit)[0];
  view.innerHTML = `
    <div class="grid four">
      ${metric("Total omzet semua waktu", money(all.omzet), "Refund tidak dihitung", "good")}
      ${metric("Total keuntungan", money(all.profit), "Semua bulan", all.profit >= 0 ? "good" : "bad")}
      ${metric("Total modal", money(all.modal), "Semua bulan")}
      ${metric("Total transaksi", all.total, `${all.sold} produk terjual`)}
    </div>
    <div class="grid two" style="margin-top:12px">
      <section class="card kv"><div class="card-header"><div><h3>Highlight Semua Bulan</h3><p class="muted">Ringkasan performa sepanjang waktu.</p></div></div>
        ${kv("Bulan omzet tertinggi", highestOmzet ? `${monthLabel(highestOmzet.key)} · ${money(highestOmzet.omzet)}` : "-")}
        ${kv("Bulan keuntungan tertinggi", highestProfit ? `${monthLabel(highestProfit.key)} · ${money(highestProfit.profit)}` : "-")}
        ${kv("Produk terlaris", all.topProduct.label)}${kv("Metode pembayaran tersering", all.topPayment.label)}
      </section>
      <section class="card"><div class="card-header"><div><h3>Backup Cepat</h3><p class="muted">Export laporan dari halaman rekap.</p></div></div><div class="form-actions"><button class="btn secondary" id="exportMonthCsv">Export CSV Bulan Aktif</button><button class="btn secondary" id="exportAllCsv">Export Semua CSV</button><button class="btn ghost" id="copySummaryRecap">Copy Ringkasan</button></div></section>
    </div>
    <section class="card" style="margin-top:12px"><div class="card-header"><div><h3>Rekap Omzet & Keuntungan per Bulan</h3><p class="muted">Klik bulan di header untuk melihat detail transaksi.</p></div></div>${monthlyRows.length ? renderMonthlyTable(monthlyRows) : emptyState("Belum ada rekap", "Input transaksi untuk membuat laporan bulanan otomatis.")}</section>`;
  $("#exportMonthCsv").addEventListener("click", () => exportCSV(getTransactionsForMonth(), `rekap-${state.activeMonth}.csv`));
  $("#exportAllCsv").addEventListener("click", () => exportCSV(db.transactions, "semua-transaksi.csv"));
  $("#copySummaryRecap").addEventListener("click", copyMonthSummary);
}

function renderMonthlyTable(rows) {
  return `<div class="table-wrap"><table><thead><tr><th>Bulan</th><th>Omzet</th><th>Modal</th><th>Keuntungan</th><th>Transaksi</th><th>Produk Terjual</th></tr></thead><tbody>${rows.map((r) => `<tr><td><strong>${monthLabel(r.key)}</strong></td><td>${money(r.omzet)}</td><td>${money(r.modal)}</td><td><strong>${money(r.profit)}</strong></td><td>${r.total}</td><td>${r.sold}</td></tr>`).join("")}</tbody></table></div>`;
}

function renderSettings() {
  view.innerHTML = `
    <div class="grid two">
      <section class="card"><div class="card-header"><div><h3>Export & Import Backup</h3><p class="muted">Simpan cadangan data secara rutin karena data utama ada di browser/localStorage.</p></div></div><div class="form-actions"><button class="btn primary" id="exportJson">Export JSON</button><button class="btn ghost" id="importJson">Import JSON</button><button class="btn secondary" id="exportMonthCsv">Export CSV Bulan Aktif</button><button class="btn secondary" id="exportAllCsv">Export Semua CSV</button></div></section>
      <section class="card"><div class="card-header"><div><h3>Preferensi</h3><p class="muted">Atur tampilan dan keamanan data.</p></div></div><div class="setting-row"><div><strong>Dark mode</strong><p class="muted">Mode gelap nyaman dipakai malam hari.</p></div><button class="btn ghost" id="settingsTheme">${db.settings.theme === "dark" ? "Pakai Light Mode" : "Pakai Dark Mode"}</button></div><hr style="border:0;border-top:1px solid var(--line);margin:16px 0"><button class="btn danger" id="resetAll">Reset Semua Data</button></section>
    </div>`;
  $("#exportJson").addEventListener("click", exportJSON);
  $("#importJson").addEventListener("click", () => $("#importFile").click());
  $("#exportMonthCsv").addEventListener("click", () => exportCSV(getTransactionsForMonth(), `rekap-${state.activeMonth}.csv`));
  $("#exportAllCsv").addEventListener("click", () => exportCSV(db.transactions, "semua-transaksi.csv"));
  $("#settingsTheme").addEventListener("click", toggleTheme);
  $("#resetAll").addEventListener("click", resetAllData);
}

function toggleTheme() {
  db.settings.theme = db.settings.theme === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = db.settings.theme;
  saveDB(); render(); toast(db.settings.theme === "dark" ? "Dark mode aktif" : "Light mode aktif");
}

function exportJSON() {
  download(`buku-keuangan-backup-${today()}.json`, JSON.stringify(db, null, 2), "application/json");
  toast("Backup JSON diunduh");
}

function handleImportFile(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const imported = JSON.parse(reader.result);
      if (!imported || !Array.isArray(imported.transactions)) throw new Error("Format tidak valid");
      db = { ...defaultDB(), ...imported, settings: { ...defaultDB().settings, ...(imported.settings || {}) } };
      saveDB(); toast("Data backup berhasil diimport"); render();
    } catch (error) { toast("Import gagal: file JSON tidak valid"); }
    event.target.value = "";
  };
  reader.readAsText(file);
}

function exportCSV(items, filename) {
  const rows = [["Tanggal", "Nama Produk", "Kategori", "Platform", "Jumlah", "Modal", "Harga Jual", "Total Harga Jual", "Diskon", "Biaya Admin", "Keuntungan", "Metode Pembayaran", "Status", "Catatan"]];
  items.forEach((tx) => rows.push([tx.date, tx.name, tx.category, tx.platform, tx.qty, tx.modal, tx.price, calcTotal(tx), tx.discount, tx.fee, calcProfit(tx), tx.payment, tx.status, tx.note]));
  const csv = rows.map((row) => row.map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
  download(filename, csv, "text/csv;charset=utf-8");
  toast("CSV diunduh");
}

function download(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url; link.download = filename; link.click();
  URL.revokeObjectURL(url);
}

async function copyMonthSummary() {
  const sum = summarize(getTransactionsForMonth());
  const text = `Rekap ${monthLabel(state.activeMonth)}:\nOmzet: ${money(sum.omzet)}\nModal: ${money(sum.modal)}\nKeuntungan: ${money(sum.profit)}\nTotal transaksi: ${sum.total}\nProduk terlaris: ${sum.topProduct.label}\nSumber terbesar: ${sum.topPlatform.label}\nMetode pembayaran utama: ${sum.topPayment.label}`;
  try { await navigator.clipboard.writeText(text); toast("Ringkasan bulan disalin"); }
  catch { prompt("Copy ringkasan manual:", text); }
}

function resetAllData() {
  const ok = prompt("Ketik RESET untuk menghapus semua transaksi, produk, target, dan pengaturan.");
  if (ok !== "RESET") return toast("Reset dibatalkan");
  db = defaultDB(); saveDB(); state.activeMonth = currentMonthKey(); toast("Semua data direset"); render();
}

function emptyState(title, desc) {
  return `<div class="empty"><span class="emoji">📝</span><strong>${title}</strong><p>${desc}</p></div>`;
}

setupShell();
render();
})();

(() => {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => navigator.serviceWorker.register("service-worker.js").catch(console.warn));
  }
})();
