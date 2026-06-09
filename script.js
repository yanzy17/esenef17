const STORAGE_KEY = "bukuKeuanganDigital:v1";
const MONTH_NAMES = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
const CATEGORIES = ["Produk Digital", "APK Premium", "Langganan Pro / Premium AI", "Akses AI", "Tools Digital", "Affiliate", "Jasa", "E-book", "Template Notion", "Spreadsheet / Tracker", "Canva / Design Asset", "Video Editing / Preset", "Kelas / Mentoring", "Bundle Produk", "Lainnya"];
const PLATFORMS = ["Lynk ID", "WhatsApp", "Threads", "Instagram", "TikTok", "Shopee", "Telegram", "QRIS Manual", "Transfer Manual", "Marketplace", "Repeat Order", "Referral", "Langganan Pro / Premium AI", "Lainnya"];
const PAYMENTS = ["QRIS DANA", "QRIS GoPay", "QRIS OVO", "QRIS ShopeePay", "Transfer Bank", "DANA", "GoPay", "OVO", "ShopeePay", "Cash", "Lynk ID Web", "Lainnya"];
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
  if (f.search) list = list.filter((tx) => String(tx.name || "").toLowerCase().includes(f.search.toLowerCase()));
  if (f.category !== "Semua") list = list.filter((tx) => tx.category === f.category);
  if (f.platform !== "Semua") list = list.filter((tx) => tx.platform === f.platform);
  if (f.payment !== "Semua") list = list.filter((tx) => tx.payment === f.payment);
  if (f.status !== "Semua") list = list.filter((tx) => tx.status === f.status);
  if (f.sort === "omzet") list.sort((a, b) => calcTotal(b) - calcTotal(a));
  else if (f.sort === "profit") list.sort((a, b) => calcProfit(b) - calcProfit(a));
  else list.sort((a, b) => new Date(b.date) - new Date(a.date) || number(b.createdAt) - number(a.createdAt));
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
    topPlatform: topBy(active, "platform", calcTotal),
    topCategory: topBy(active, "category", calcTotal),
    unpaidAmount: items.filter((tx) => tx.status === "Belum Lunas").reduce((total, tx) => total + calcTotal(tx), 0),
    margin: active.reduce((total, tx) => total + calcTotal(tx), 0) ? (active.reduce((total, tx) => total + calcProfit(tx), 0) / active.reduce((total, tx) => total + calcTotal(tx), 0)) * 100 : 0
  };
}

function isSameDate(date, ref = today()) {
  return (date || today()).slice(0, 10) === ref;
}

function startOfWeek(date = new Date()) {
  const d = new Date(date);
  const day = d.getDay() || 7;
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - day + 1);
  return d;
}

function isThisWeek(date) {
  const d = new Date(`${date || today()}T00:00:00`);
  const start = startOfWeek();
  const end = new Date(start);
  end.setDate(start.getDate() + 7);
  return d >= start && d < end;
}

function pctValue(value) {
  return `${Math.round(number(value) * 10) / 10}%`;
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
  $("#quickAddFab")?.addEventListener("click", () => { state.route = "tambah"; location.hash = "tambah"; render(); setTimeout(() => document.querySelector('[data-tab="quick"]')?.click(), 0); });
  $("#importFile").addEventListener("change", handleImportFile);
  window.addEventListener("hashchange", () => {
    const next = location.hash.replace("#", "") || "dashboard";
    if (next !== state.route) {
      state.route = next;
      render();
    }
  });
  if ("serviceWorker" in navigator) navigator.serviceWorker.register("service-worker.js").catch(console.warn);
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
  const todaySum = summarize(monthTx.filter((tx) => isSameDate(tx.date)));
  const weekSum = summarize(monthTx.filter((tx) => isThisWeek(tx.date)));
  const target = number(db.targets[state.activeMonth]);
  const pct = target ? Math.min(100, Math.round((sum.omzet / target) * 100)) : 0;
  const remaining = Math.max(0, target - sum.omzet);
  const lastTx = [...monthTx].sort((a, b) => new Date(b.date) - new Date(a.date) || number(b.createdAt) - number(a.createdAt)).slice(0, 4);
  view.innerHTML = `
    <div class="month-chips">${allMonthKeys().slice(0, 12).map((key) => `<button class="chip ${key === state.activeMonth ? "active" : ""}" data-month="${key}" type="button">${shortMonthLabel(key)}</button>`).join("")}</div>
    <div class="grid four compact-metrics" style="margin-top:12px">
      ${metric("Omzet bulan ini", money(sum.omzet), monthLabel(state.activeMonth), "good")}
      ${metric("Profit bulan ini", money(sum.profit), `${sum.total} transaksi`, sum.profit >= 0 ? "good" : "bad")}
      ${metric("Modal bulan ini", money(sum.modal), "Refund tidak dihitung")}
      ${metric("Transaksi bulan ini", sum.total, `${sum.lunas} lunas · ${sum.refund} refund`)}
    </div>
    <div class="grid four mini-metrics" style="margin-top:12px">
      ${metric("Omzet hari ini", money(todaySum.omzet), `${todaySum.total} transaksi`, "good")}
      ${metric("Profit hari ini", money(todaySum.profit), "Hari ini", todaySum.profit >= 0 ? "good" : "bad")}
      ${metric("Omzet minggu ini", money(weekSum.omzet), `Profit ${money(weekSum.profit)} · ${weekSum.total} tx`)}
      ${metric("Belum lunas", money(sum.unpaidAmount), `${sum.belum} transaksi`, "warn")}
    </div>
    <div class="grid two" style="margin-top:12px">
      <section class="card target-card">
        <div class="card-header"><div><h3>Target Bulanan</h3><p class="muted">Progress ${monthLabel(state.activeMonth)}.</p></div><strong class="target-pct">${pct}%</strong></div>
        <form id="targetForm" class="inline-target">
          <input name="target" inputmode="numeric" type="number" min="0" value="${target || ""}" placeholder="Target omzet">
          <button class="btn primary" type="submit">Simpan</button>
        </form>
        <div style="margin-top:14px" class="progress"><span style="width:${pct}%"></span></div>
        <p class="muted" style="margin:10px 0 0">Sisa target: <strong>${target ? money(remaining) : "Belum diisi"}</strong>. ${target && remaining === 0 ? "🎉 Target tercapai." : ""}</p>
      </section>
      <section class="card kv insight-card">
        <div class="card-header"><div><h3>Insight Simpel</h3><p class="muted">Berdasarkan transaksi aktif non-refund.</p></div></div>
        ${kv("Produk terlaris", sum.topProduct.label)}${kv("Sumber terbesar", `${sum.topPlatform.label} · ${money(sum.topPlatform.value)}`)}${kv("Pembayaran utama", sum.topPayment.label)}${kv("Margin profit", pctValue(sum.margin))}
      </section>
    </div>
    <section class="card" style="margin-top:12px">
      <div class="card-header"><div><h3>Transaksi Terbaru</h3><p class="muted">4 transaksi terakhir bulan aktif.</p></div><button class="btn secondary small" data-route="transaksi">Lihat Semua</button></div>
      ${lastTx.length ? renderTransactionCards(lastTx) : emptyState("Belum ada transaksi", "Mulai dari tombol + Catat Penjualan untuk mencatat pemasukan pertama.")}
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
    <div class="card-header"><div><h3>${tx?.id ? "Edit Transaksi" : "Tambah Transaksi Manual"}</h3><p class="muted">Field utama ada di atas. Keuntungan otomatis = total harga jual - modal - diskon - biaya admin.</p></div></div>
    <form id="transactionForm" class="form-grid transaction-form">
      ${input("date", "Tanggal", "date", tx.date || today())}
      <div class="field"><label>Pilih produk cepat</label><select id="productPicker"><option value="">Tidak pakai produk cepat</option>${db.products.map((p) => `<option value="${p.id}">${escapeHTML(p.name)}</option>`).join("")}</select></div>
      ${input("name", "Nama produk", "text", tx.name || "", "Contoh: Paket akses AI") }
      ${selectField("category", "Kategori", CATEGORIES, tx.category || CATEGORIES[0])}
      ${selectField("platform", "Sumber penjualan", PLATFORMS, tx.platform || PLATFORMS[0])}
      ${input("price", "Harga jual", "number", tx.price || 0)}
      ${input("modal", "Modal", "number", tx.modal || 0)}
      <div class="field profit-preview"><label>Keuntungan otomatis</label><input id="profitPreview" readonly value="${money(tx.id ? calcProfit(tx) : 0)}"></div>
      <div class="field full subform-title"><span>Detail tambahan</span></div>
      ${input("qty", "Jumlah", "number", tx.qty || 1, "", "1")}
      ${input("discount", "Diskon", "number", tx.discount || 0)}
      ${input("fee", "Biaya admin", "number", tx.fee || 0)}
      ${selectField("payment", "Metode pembayaran", PAYMENTS, tx.payment || PAYMENTS[0])}
      ${selectField("status", "Status", STATUSES, tx.status || STATUSES[0])}
      <div class="field full"><label>Catatan</label><textarea name="note" placeholder="Catatan tambahan">${escapeHTML(tx.note || "")}</textarea></div>
      <div class="field full form-actions"><button class="btn primary big-action" type="submit">${tx?.id ? "Update Transaksi" : "Simpan Transaksi"}</button>${tx?.id ? `<button class="btn ghost" type="button" id="cancelEdit">Batal Edit</button>` : ""}</div>
    </form>`;
}

function renderQuickForm() {
  return `
    <div class="card-header"><div><h3>Tambah Cepat</h3><p class="muted">Tanggal otomatis hari ini. Cocok untuk catat penjualan dari HP.</p></div></div>
    <form id="quickForm" class="form-grid">
      ${input("date", "Tanggal", "date", today())}
      ${input("name", "Nama produk", "text", "", "Contoh: Template Notion") }
      ${selectField("category", "Kategori", CATEGORIES, CATEGORIES[0])}
      ${selectField("platform", "Sumber penjualan", PLATFORMS, PLATFORMS[0])}
      ${input("price", "Harga jual", "number", 0)}
      ${input("modal", "Modal", "number", 0)}
      ${selectField("payment", "Metode pembayaran", PAYMENTS, PAYMENTS[0])}
      <div class="field full form-actions"><button class="btn primary big-action" type="submit">Simpan Cepat</button></div>
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
    const tx = normalizeTransaction({ ...data, qty: 1, discount: 0, fee: 0, status: "Lunas", note: "Input cepat" });
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
    date: data.date || today(), name: String(data.name || "").trim(), category: data.category || "Lainnya", platform: data.platform || "Lainnya",
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
        ${filterSelect("filterPlatform", "Filter sumber", ["Semua", ...PLATFORMS], state.filters.platform)}
        ${filterSelect("filterPayment", "Filter pembayaran", ["Semua", ...PAYMENTS], state.filters.payment)}
        ${filterSelect("filterStatus", "Filter status", ["Semua", ...STATUSES], state.filters.status)}
        ${filterSelect("filterSort", "Sortir", [["newest", "Tanggal terbaru"], ["omzet", "Omzet terbesar"], ["profit", "Profit terbesar"]], state.filters.sort)}
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
  return `<div class="table-wrap"><table><thead><tr><th>No</th><th>Tanggal</th><th>Nama Produk</th><th>Modal</th><th>Harga Jual</th><th>Keuntungan</th><th>Metode Pembayaran</th><th>Status</th><th>Aksi</th></tr></thead><tbody>${items.map((tx, i) => `
    <tr><td>${i + 1}</td><td>${formatDate(tx.date)}</td><td><strong>${escapeHTML(tx.name)}</strong><br><span class="muted">${escapeHTML(tx.category)} · ${escapeHTML(tx.platform)} · ${tx.qty} pcs</span></td><td>${money(tx.modal)}</td><td>${money(calcTotal(tx))}</td><td><strong>${money(calcProfit(tx))}</strong></td><td>${escapeHTML(tx.payment)}</td><td>${statusPill(tx.status)}</td><td>${txActions(tx.id)}</td></tr>`).join("")}</tbody></table></div>`;
}

function renderTransactionCards(items) {
  return `<div class="tx-card-list">${items.map((tx) => `<article class="tx-card"><div class="tx-top"><div><div class="tx-title">${escapeHTML(tx.name)}</div><p class="muted">${formatDate(tx.date)} · ${escapeHTML(tx.platform)}</p><span class="category-badge">${escapeHTML(tx.category || "Lainnya")}</span></div>${statusPill(tx.status)}</div><div class="tx-meta"><div><span>Harga Jual</span><strong>${money(calcTotal(tx))}</strong></div><div><span>Keuntungan</span><strong>${money(calcProfit(tx))}</strong></div><div><span>Modal</span><strong>${money(tx.modal)}</strong></div><div><span>Pembayaran</span><strong>${escapeHTML(tx.payment)}</strong></div></div>${txActions(tx.id)}</article>`).join("")}</div>`;
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
    const existingProduct = db.products.find((p) => p.id === state.productEditingId) || {};
    const product = { ...existingProduct, id: state.productEditingId || uid("prd"), name: String(data.name || "").trim(), category: data.category, price: number(data.price), modal: number(data.modal), updatedAt: Date.now() };
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
        ${kv("Produk terlaris", all.topProduct.label)}${kv("Sumber terbesar", all.topPlatform.label)}${kv("Kategori terbesar", all.topCategory.label)}${kv("Metode pembayaran tersering", all.topPayment.label)}
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
  const text = `Rekap ${monthLabel(state.activeMonth)}\nOmzet: ${money(sum.omzet)}\nModal: ${money(sum.modal)}\nProfit: ${money(sum.profit)}\nMargin: ${pctValue(sum.margin)}\nTransaksi: ${sum.total}\nBelum lunas: ${sum.belum} transaksi · ${money(sum.unpaidAmount)}\nProduk terlaris: ${sum.topProduct.label}\nSumber terbesar: ${sum.topPlatform.label}\nPembayaran utama: ${sum.topPayment.label}`;
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
