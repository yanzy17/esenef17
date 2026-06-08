const STORAGE_KEY = "digitalSellerSuperToolsHistory";
let currentExport = { title: "Digital Seller Super Tools", text: "Belum ada hasil yang digenerate." };

const tools = [
  ["product", "Product Idea", "Temukan 10 ide produk digital lengkap dengan format, harga, kesulitan, dan platform jualan."],
  ["affiliate", "Affiliate Content", "Bikin hook, caption, CTA, video pendek, dan ide Threads untuk promosi affiliate."],
  ["hook", "Hook Generator", "Generate minimal 20 hook sesuai kategori awareness dan angle konten."],
  ["caption", "Caption + CTA", "Siapkan caption Threads, IG, TikTok, soft selling, direct, dan variasi CTA."],
  ["dm", "DM Reply", "Template balasan santai untuk komen mau, tanya harga, keberatan mahal, bukti, follow up, dan closing."],
  ["pricing", "Pricing", "Hitung profit, omzet, break even, saran harga, dan catatan strategi."],
  ["calendar", "Content Calendar", "Buat kalender konten 30 hari dengan tema, hook, caption, CTA, dan format."],
  ["offer", "Offer Builder", "Rangkai headline, benefit, bonus stack, urgency, guarantee, dan CTA jualan."],
  ["license", "License Text", "Buat teks lisensi personal use, resell rights, MRR, atau larangan jual ulang."],
  ["history", "Riwayat", "Lihat, copy ulang, export, atau hapus hasil generate yang tersimpan di browser."]
];

const productFormats = ["ebook praktis", "template siap edit", "mini course video", "workbook interaktif", "checklist premium", "bundle prompt", "spreadsheet otomatis", "audio class", "challenge 7 hari", "starter kit digital"];
const platforms = ["Gumroad", "Lynk.id", "Karyakarsa", "Tokopedia Digital", "Shopee Digital", "Instagram DM", "WhatsApp Catalog", "Notion marketplace", "Google Drive + payment link", "Landing page sederhana"];
const difficulties = ["Mudah", "Mudah-menengah", "Menengah", "Butuh validasi", "Cepat dibuat"];
const themes = ["edukasi", "problem aware", "mistake", "story", "tutorial", "comparison", "myth busting", "before-after", "checklist", "mini case study"];

function $(selector, root = document) { return root.querySelector(selector); }
function $$(selector, root = document) { return [...root.querySelectorAll(selector)]; }
function clean(value) { return String(value || "").trim(); }
function rupiah(number) { return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Number(number) || 0); }
function esc(text) {
  return String(text).replace(/[&<>'"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#039;", '"': "&quot;" }[char]));
}
function pick(array, index) { return array[index % array.length]; }

function initNavigation() {
  const quickActions = $("#quickActions");
  quickActions.innerHTML = tools.slice(0, 9).map(([id, title, desc]) => `
    <article class="tool-card">
      <h4>${title}</h4>
      <p>${desc}</p>
      <button class="secondary-btn jump" data-tab="${id}" type="button">Buka tool</button>
    </article>`).join("");

  document.addEventListener("click", event => {
    const jump = event.target.closest(".jump, .tab-btn");
    if (jump?.dataset.tab) switchTab(jump.dataset.tab);
  });
}

function switchTab(tabId) {
  $$(".tab-panel").forEach(panel => panel.classList.toggle("active", panel.id === tabId));
  $$(".tab-btn").forEach(button => button.classList.toggle("active", button.dataset.tab === tabId));
  const activeLabel = tools.find(([id]) => id === tabId)?.[1] || "Dashboard";
  $("#pageTitle").textContent = tabId === "dashboard" ? "Dashboard Utama" : activeLabel;
  if (tabId === "history") renderHistory();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function getFormData(form) {
  const data = Object.fromEntries(new FormData(form).entries());
  const empty = Object.entries(data).find(([, value]) => !clean(value));
  return { data, emptyName: empty?.[0] };
}

function showError(form, message) {
  form.querySelector(".error-message")?.remove();
  const error = document.createElement("div");
  error.className = "error-message";
  error.textContent = message;
  form.prepend(error);
}

function clearError(form) { form.querySelector(".error-message")?.remove(); }

function initForms() {
  $$(".tool-form").forEach(form => {
    form.addEventListener("submit", event => {
      event.preventDefault();
      const { data, emptyName } = getFormData(form);
      if (emptyName) {
        showError(form, "Mohon lengkapi semua input dulu ya, biar hasilnya lebih relevan.");
        return;
      }
      clearError(form);
      const type = form.dataset.generator;
      const result = generators[type](data);
      renderOutput(type, result.title, result.html, result.text);
      saveHistory({ type, title: result.title, html: result.html, text: result.text, createdAt: new Date().toISOString() });
    });
  });
}

function renderOutput(type, title, html, text) {
  const output = $(`[data-output="${type}"]`);
  currentExport = { title, text };
  output.innerHTML = resultCard(title, html, text);
  output.scrollIntoView({ behavior: "smooth", block: "start" });
}

function resultCard(title, html, text, historyIndex = null) {
  const indexAttr = historyIndex === null ? "" : `data-history-index="${historyIndex}"`;
  return `
    <article class="result-card">
      <div class="result-header">
        <div><h4>${esc(title)}</h4><p class="mini-note">Gunakan sebagai draft, lalu sesuaikan dengan suara brand kamu.</p></div>
        <div class="result-actions">
          <button class="copy-btn" type="button" data-copy="${encodeURIComponent(text)}">Copy</button>
          <button class="copy-btn export-single" type="button" ${indexAttr} data-title="${esc(title)}" data-copy="${encodeURIComponent(text)}">Export .txt</button>
        </div>
      </div>
      <div class="result-content">${html}</div>
    </article>`;
}

function listHtml(items) { return `<ul>${items.map(item => `<li>${item}</li>`).join("")}</ul>`; }
function numbered(items) { return `<ol>${items.map(item => `<li>${item}</li>`).join("")}</ol>`; }

const generators = {
  product(data) {
    const niche = clean(data.niche), audience = clean(data.audience), level = clean(data.level);
    const rows = Array.from({ length: 10 }, (_, i) => {
      const format = pick(productFormats, i);
      const price = 29000 + (i * 17000) + (level === "expert" ? 70000 : level === "intermediate" ? 30000 : 0);
      return {
        name: `${niche} ${pick(["Starter Kit", "Shortcut Pack", "Blueprint", "Template Vault", "Action Plan"], i)} untuk ${audience}`,
        format,
        problem: `Membantu ${audience} mengatasi ${pick(["bingung mulai", "proses yang masih manual", "konten tidak konsisten", "hasil yang belum rapi", "kurang percaya diri"], i)} di niche ${niche}.`,
        buyer: `${audience} level ${level} yang ingin hasil praktis tanpa belajar terlalu lama.`,
        price: rupiah(price),
        difficulty: pick(difficulties, i),
        platform: pick(platforms, i)
      };
    });
    const html = `<table><thead><tr><th>Nama produk</th><th>Format</th><th>Masalah</th><th>Cocok untuk</th><th>Harga</th><th>Kesulitan</th><th>Platform</th></tr></thead><tbody>${rows.map(r => `<tr><td>${esc(r.name)}</td><td>${esc(r.format)}</td><td>${esc(r.problem)}</td><td>${esc(r.buyer)}</td><td>${r.price}</td><td>${r.difficulty}</td><td>${r.platform}</td></tr>`).join("")}</tbody></table>`;
    const text = rows.map((r, i) => `${i + 1}. ${r.name}\nFormat: ${r.format}\nMasalah: ${r.problem}\nPembeli cocok: ${r.buyer}\nEstimasi harga: ${r.price}\nKesulitan: ${r.difficulty}\nPlatform: ${r.platform}`).join("\n\n");
    return { title: `10 Ide Produk Digital - ${niche}`, html, text };
  },

  affiliate(data) {
    const p = clean(data.productName), buyer = clean(data.buyer), problem = clean(data.problem), benefit = clean(data.benefit), tone = clean(data.tone);
    const toneLead = { santai: "Santai aja,", "gen z": "No debat,", edukatif: "Kalau dilihat dari prosesnya,", "soft selling": "Buat kamu yang lagi cari cara lebih ringan,", urgent: "Sebelum makin banyak waktu kebuang," }[tone] || "";
    const hooks = Array.from({ length: 10 }, (_, i) => `${toneLead} ${pick(["ini alasan", "ternyata", "banyak yang belum sadar", "cara simpel", "kesalahan kecil"], i)} ${buyer} susah lepas dari masalah: ${problem}.`);
    const shortCaps = Array.from({ length: 5 }, (_, i) => `${pick(["Reminder", "Quick note", "Jujur", "Kalau kamu", "Biar nggak muter-muter"], i)}: ${p} bantu ${buyer} ${benefit}. Cocok kalau kamu pengin mulai lebih rapi.`);
    const longCaps = Array.from({ length: 5 }, (_, i) => `Banyak ${buyer} stuck bukan karena malas, tapi karena belum punya panduan yang jelas. Masalahnya: ${problem}. ${p} dibuat untuk bantu kamu ${benefit}, dengan langkah yang lebih gampang diikuti dari HP. ${pick(["Mulai dari bagian paling kecil dulu.", "Coba cek apakah ini sesuai kebutuhanmu.", "Kalau relate, simpan dulu postingan ini.", "Jangan tunggu semuanya sempurna.", "Yang penting mulai pakai sistem."], i)}`);
    const ctas = ["Ketik MAU kalau mau aku kirim detailnya.", "Cek link di bio sebelum promonya selesai.", "DM aku kata INFO kalau mau lihat isinya.", "Save dulu, nanti cek produknya pas sempat.", "Komentar 'produk' kalau mau rekomendasinya."].map(x => `${x}`);
    const videos = Array.from({ length: 5 }, (_, i) => `${pick(["POV", "Before-after", "3 kesalahan", "Mini tutorial", "Review jujur"], i)}: ${buyer} dari ${problem} ke ${benefit} pakai ${p}.`);
    const threads = Array.from({ length: 5 }, (_, i) => `${pick(["Thread pendek", "Checklist", "Cerita personal", "Hot take", "Step by step"], i)} tentang kenapa ${problem} bisa diatasi lebih cepat dengan ${p}.`);
    const sections = [["10 Hook", hooks], ["5 Caption Pendek", shortCaps], ["5 Caption Panjang", longCaps], ["5 CTA", ctas], ["5 Ide Video Pendek", videos], ["5 Ide Threads Post", threads]];
    return sectionResult(`Konten Affiliate - ${p}`, sections);
  },

  hook(data) {
    const topic = clean(data.topic), audience = clean(data.audience), category = clean(data.category);
    const patterns = {
      "Clickbait halus": ["Aku nyesel baru tahu cara ini buat {topic}", "Jangan beli {topic} sebelum paham hal ini", "Ini yang biasanya nggak diceritain soal {topic}"],
      "Problem aware": ["Kalau kamu {audience} dan masih stuck, mungkin ini penyebabnya", "Masalahnya bukan kamu malas, tapi sistem {topic}-mu belum kebentuk", "Tanda kamu butuh cara baru untuk {topic}"],
      Curiosity: ["Satu trik kecil yang bikin {topic} terasa lebih gampang", "Kenapa orang lain lebih cepat progres di {topic}?", "Coba cek bagian ini sebelum kamu lanjut"],
      Storytelling: ["Dulu aku pikir {topic} harus ribet, sampai sadar satu hal", "Awalnya cuma coba-coba, tapi hasilnya lumayan ngubah cara kerja", "Cerita singkat kenapa {audience} sering stuck"],
      "Pain point": ["Capek mulai dari nol terus setiap mau {topic}?", "Kalau {topic} bikin kamu overthinking, baca ini", "Kesalahan yang bikin {audience} buang waktu"],
      "Result based": ["Cara bikin {topic} lebih rapi dalam 30 menit", "Dari bingung ke punya sistem: ini alurnya", "Hasil kecil yang bisa kamu kejar minggu ini"]
    };
    const base = patterns[category] || patterns.Curiosity;
    const hooks = Array.from({ length: 20 }, (_, i) => pick(base, i).replaceAll("{topic}", topic).replaceAll("{audience}", audience) + ` ${pick(["Versi simpel.", "Tanpa harus jago dulu.", "Bisa mulai dari HP.", "Cocok buat pemula.", "Simpan biar nggak lupa."], i)}`);
    return sectionResult(`20 Hook - ${category}`, [["Hook siap copy", hooks]]);
  },

  caption(data) {
    const product = clean(data.product), problem = clean(data.problem), solution = clean(data.solution), promo = clean(data.promo);
    const sections = [
      ["Caption Threads", [`${problem} itu sering kelihatan sepele, sampai akhirnya bikin progres berhenti. ${product} bantu dengan ${solution}. ${promo}.`]],
      ["Caption IG", [`Kalau kamu sering ngerasa ${problem}, mungkin yang kamu butuhkan bukan motivasi lagi, tapi sistem yang lebih gampang dipakai.\n\n${product} dibuat untuk bantu kamu ${solution}.\n\n${promo}. Cek detailnya di bio ya.`]],
      ["Caption TikTok", [`POV: kamu berhenti ribet karena akhirnya pakai ${product}. Masalah: ${problem}. Solusi: ${solution}. ${promo}.`]],
      ["CTA Komentar", ["Komentar MAU kalau mau aku kirim detailnya.", "Tulis INFO, nanti aku bantu jelasin isinya."]],
      ["CTA DM", ["DM kata PRODUK kalau mau lihat preview.", "DM aku kalau mau tanya cocok atau nggak buat kebutuhanmu."]],
      ["CTA Cek Bio", ["Cek link di bio buat lihat detail dan bonusnya.", "Aku taruh aksesnya di bio, silakan cek dulu."]],
      ["Versi Soft Selling", [`Kalau kamu lagi cari cara lebih ringan buat mengatasi ${problem}, ${product} bisa jadi opsi yang worth to try.`]],
      ["Versi Lebih Direct", [`Ambil ${product} sekarang kalau kamu mau ${solution}. ${promo}. Klik link bio atau DM aku kata MAU.`]]
    ];
    return sectionResult(`Caption + CTA - ${product}`, sections);
  },

  dm(data) {
    const product = clean(data.product), price = clean(data.price), benefit = clean(data.benefit);
    const templates = [
      ["Orang komen “mau”", `Hai kak, makasih ya. Ini detail ${product}: ${benefit}. Saat ini ${price}. Mau aku kirim preview isinya juga?`],
      ["Orang tanya harga", `Harganya ${price}, kak. Sudah termasuk akses ${product} dan panduan pakainya. Kalau kebutuhan kakak adalah ${benefit}, ini cukup cocok.`],
      ["Orang bilang mahal", `Paham kak, tiap orang punya budget beda-beda. Boleh dipikir dulu ya. Biasanya yang bikin worth it adalah karena ${product} bisa bantu ${benefit}, jadi nggak mulai dari nol terus.`],
      ["Orang minta bukti", `Bisa kak. Aku kirim preview/testimoni yang tersedia ya. Jadi kakak bisa lihat dulu apakah format ${product} sesuai kebutuhan.`],
      ["Orang cuma tanya-tanya", `Santai kak, tanya dulu juga nggak apa-apa. Biar aku bantu, sekarang kendala terbesarnya di bagian apa?`],
      ["Follow up 1", `Hai kak, aku follow up pelan-pelan ya. Kemarin sempat tertarik sama ${product}. Ada yang masih mau ditanyakan sebelum ambil?`],
      ["Follow up 2", `Kak, aku info sekali lagi ya. Promo/bonus ${price} masih bisa dicek sekarang. Kalau belum cocok, no worries banget.`],
      ["Closing halus", `Kalau kakak merasa ${product} pas buat bantu ${benefit}, boleh langsung ambil sekarang. Nanti kalau sudah akses dan bingung mulai dari mana, kabari aku ya.`]
    ];
    return sectionResult(`Template DM - ${product}`, templates.map(([title, copy]) => [title, [copy]]));
  },

  pricing(data) {
    const cost = Number(data.cost), price = Number(data.price), fee = Number(data.fee), targetProfit = Number(data.targetProfit), targetSales = Number(data.targetSales);
    const profitPerProduct = price - cost - fee;
    const revenue = price * targetSales;
    const totalProfit = profitPerProduct * targetSales;
    const bep = profitPerProduct > 0 ? Math.ceil(cost / profitPerProduct) : 0;
    const suggested = Math.ceil((cost + fee + (targetProfit / targetSales)) / 1000) * 1000;
    const html = `<table><tbody>
      <tr><th>Profit per produk</th><td>${rupiah(profitPerProduct)}</td></tr>
      <tr><th>Total omzet</th><td>${rupiah(revenue)}</td></tr>
      <tr><th>Total profit</th><td>${rupiah(totalProfit)}</td></tr>
      <tr><th>Saran harga</th><td>${rupiah(suggested)}</td></tr>
      <tr><th>Break even point</th><td>${bep} penjualan</td></tr>
      <tr><th>Catatan strategi harga</th><td>${profitPerProduct <= 0 ? "Harga sekarang belum sehat. Naikkan harga atau turunkan biaya platform/modal." : "Gunakan harga normal lebih tinggi, lalu promo terbatas. Tambahkan bonus agar value terasa lebih besar tanpa memangkas profit."}</td></tr>
    </tbody></table>`;
    const text = `Profit per produk: ${rupiah(profitPerProduct)}\nTotal omzet: ${rupiah(revenue)}\nTotal profit: ${rupiah(totalProfit)}\nSaran harga: ${rupiah(suggested)}\nBreak even point: ${bep} penjualan\nCatatan: ${profitPerProduct <= 0 ? "Harga sekarang belum sehat. Naikkan harga atau turunkan biaya." : "Pakai anchor harga normal, promo terbatas, dan bonus untuk menaikkan perceived value."}`;
    return { title: "Hasil Pricing Calculator", html, text };
  },

  calendar(data) {
    const niche = clean(data.niche), product = clean(data.product), platform = clean(data.platform);
    const rows = Array.from({ length: 30 }, (_, i) => {
      const theme = pick(themes, i);
      return `<tr><td>Hari ${i + 1}</td><td>${theme}</td><td>${pick(["Kenapa", "Cara", "Kesalahan", "Checklist", "Cerita"], i)} ${niche} yang sering dialami pemula</td><td>Bahas satu insight ${theme} dan hubungkan pelan-pelan ke ${product}.</td><td>${pick(["Komentar MAU", "Save dulu", "Cek bio", "DM INFO", "Share ke teman"], i)}</td><td>${platform === "Threads" ? "Thread pendek" : pick(["Video 30 detik", "Carousel", "Talking head", "Screen record", "Before-after"], i)}</td></tr>`;
    });
    const html = `<table><thead><tr><th>Hari</th><th>Tema</th><th>Hook</th><th>Ide caption</th><th>CTA</th><th>Format</th></tr></thead><tbody>${rows.join("")}</tbody></table>`;
    const text = rows.map((row, i) => `Hari ${i + 1}: ${row.replace(/<[^>]*>/g, " | ").replace(/\s+\|\s+/g, " | ").trim()}`).join("\n");
    return { title: `Kalender Konten 30 Hari - ${platform}`, html, text };
  },

  offer(data) {
    const product = clean(data.product), bonus = clean(data.bonus), normal = clean(data.normalPrice), promo = clean(data.promoPrice), audience = clean(data.audience);
    const sections = [
      ["Struktur penawaran", [`Produk utama: ${product}`, `Target: ${audience}`, `Harga normal: ${normal}`, `Harga promo: ${promo}`]],
      ["Headline", [`Bantu ${audience} mulai lebih cepat dengan ${product}, tanpa harus bingung dari nol.`]],
      ["Benefit", [`Lebih hemat waktu`, `Punya panduan/asset siap pakai`, `Bisa dipakai dari HP`, `Cocok untuk validasi jualan pertama`]],
      ["Bonus stack", bonus.split(/,|\n/).map(item => item.trim()).filter(Boolean)],
      ["Urgency", [`Promo ${promo} bisa ditutup kapan saja saat kuota bonus terpenuhi.`]],
      ["Guarantee statement sederhana", [`Kalau setelah akses kamu bingung mulai dari mana, hubungi aku dan aku bantu arahkan langkah pertamanya.`]],
      ["CTA penjualan", [`Ambil ${product} sekarang di harga ${promo}. DM kata MAU atau klik link bio untuk akses.`]]
    ];
    return sectionResult(`Offer Builder - ${product}`, sections);
  },

  license(data) {
    const product = clean(data.product), brand = clean(data.brand), type = clean(data.licenseType);
    const rules = {
      "Personal use": "Produk hanya boleh digunakan untuk kebutuhan pribadi/personal pembeli dan tidak boleh dijual, dibagikan, atau diklaim ulang sebagai milik sendiri.",
      "Resell rights": "Pembeli boleh menjual ulang produk final sesuai ketentuan, tetapi tidak boleh mengubah lisensi menjadi master resell rights atau membagikan file sumber secara gratis.",
      "Master resell rights": "Pembeli boleh memakai, menjual ulang, dan memberikan hak jual ulang kepada pembeli berikutnya sesuai aturan yang disertakan.",
      "Tidak boleh dijual ulang": "Produk tidak boleh dijual ulang dalam bentuk apa pun, baik utuh, sebagian, maupun hasil modifikasi yang sangat mirip."
    };
    const short = `${product} by ${brand}: ${rules[type]}`;
    const full = `Lisensi ${type} untuk ${product}\n\nDengan membeli atau mengakses produk ini, pengguna setuju bahwa ${rules[type]} File, materi, template, dan bonus tetap merupakan karya/produk dari ${brand}. Pengguna wajib menjaga akses produk dan tidak menyebarkan link download publik tanpa izin tertulis. Pelanggaran lisensi dapat membuat akses dibatalkan.`;
    const sections = [["Versi singkat", [short]], ["Versi lengkap", [full]], ["Catatan penggunaan", ["Tempelkan teks ini di halaman checkout, file PDF produk, atau folder download.", "Sesuaikan lagi jika kamu punya aturan refund, support, atau batas wilayah penjualan."]]];
    return sectionResult(`Teks Lisensi - ${type}`, sections);
  }
};

function sectionResult(title, sections) {
  const html = sections.map(([heading, items]) => `<h5>${esc(heading)}</h5>${listHtml(items.map(esc))}`).join("");
  const text = sections.map(([heading, items]) => `${heading}\n${items.map((item, i) => `${i + 1}. ${item}`).join("\n")}`).join("\n\n");
  return { title, html, text };
}

function getHistory() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { return []; }
}
function setHistory(items) { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); }
function saveHistory(item) {
  const next = [item, ...getHistory()].slice(0, 30);
  setHistory(next);
}
function renderHistory() {
  const list = $("#historyList");
  const items = getHistory();
  if (!items.length) {
    list.innerHTML = `<div class="empty-state">Belum ada riwayat. Generate salah satu tool dulu ya.</div>`;
    return;
  }
  list.innerHTML = items.map((item, index) => resultCard(`${item.title} • ${new Date(item.createdAt).toLocaleString("id-ID")}`, item.html, item.text, index)).join("");
}

function initActions() {
  document.addEventListener("click", event => {
    const copyButton = event.target.closest("[data-copy]");
    if (copyButton && !copyButton.classList.contains("export-single")) {
      copyText(decodeURIComponent(copyButton.dataset.copy));
    }
    if (copyButton?.classList.contains("export-single")) {
      exportText(copyButton.dataset.title || "digital-seller-result", decodeURIComponent(copyButton.dataset.copy));
    }
  });
  $("#exportBtn").addEventListener("click", () => exportText(currentExport.title, currentExport.text));
  $("#clearHistory").addEventListener("click", () => {
    setHistory([]);
    renderHistory();
    showToast("Riwayat dihapus");
  });
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch (error) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
  }
  showToast("Berhasil disalin");
}

function exportText(title, text) {
  const blob = new Blob([`${title}\n${"=".repeat(title.length)}\n\n${text}`], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${title.toLowerCase().replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "") || "digital-seller-result"}.txt`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 1800);
}

document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  initForms();
  initActions();
});
