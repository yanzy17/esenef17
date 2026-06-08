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
