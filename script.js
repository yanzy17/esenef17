const STORAGE_KEY = "bukuKeuanganDigital:v1";
const MONTH_NAMES = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
const CATEGORIES = ["Produk Digital", "APK Premium", "Langganan Pro / Premium AI", "Akses AI", "Tools Digital", "Affiliate", "Jasa", "E-book", "Template Notion", "Spreadsheet / Tracker", "Canva / Design Asset", "Video Editing / Preset", "Kelas / Mentoring", "Bundle Produk", "Lainnya"];
const PLATFORMS = ["Lynk ID", "WhatsApp", "Threads", "Instagram", "TikTok", "Shopee", "Telegram", "QRIS Manual", "Transfer Manual", "Marketplace", "Repeat Order", "Referral", "Langganan Pro / Premium AI", "Lainnya"];
const PAYMENTS = ["QRIS DANA", "QRIS GoPay", "QRIS OVO", "QRIS ShopeePay", "Transfer Bank", "DANA", "GoPay", "OVO", "ShopeePay", "Cash", "Lynk ID Web", "Lainnya"];
const STATUSES = ["Lunas", "Belum Lunas", "Refund"];
const EXPENSE_CATEGORIES = ["Iklan/Ads", "Langganan Tools", "Kuota/Internet", "Listrik", "Operasional", "Fee Platform", "Gaji/Komisi", "Lainnya"];
const navItems = [
  { id: "dashboard", label: "Dashboard", icon: "🏠", primary: true },
  { id: "tambah", label: "Tambah", icon: "➕", primary: true },
  { id: "transaksi", label: "Transaksi", icon: "📒", primary: true },
  { id: "pengeluaran", label: "Keluar", icon: "💸", primary: true },
  { id: "cashflow", label: "Cashflow", icon: "💵", primary: true },
  { id: "anggaran", label: "Anggaran", icon: "🎯" },
  { id: "produk", label: "Produk", icon: "📦" },
  { id: "rekap", label: "Rekap", icon: "📊", primary: true },
  { id: "pengaturan", label: "Atur", icon: "⚙️" }
];

let db = loadDB();
let state = {
  route: (typeof location !== "undefined" ? location.hash.replace("#", "") : "") || "dashboard",
  activeMonth: currentMonthKey(),
  editingId: null,
  productEditingId: null,
  filters: { search: "", category: "Semua", platform: "Semua", payment: "Semua", status: "Semua", sort: "newest" },
  expenseFilters: { search: "", category: "Semua", payment: "Semua", sort: "newest" },
  toastTimer: null
};

const $ = (selector) => (typeof document !== "undefined" ? document.querySelector(selector) : null);
const view = $("#viewContainer");

function defaultDB() {
  return { transactions: [], products: [], targets: {}, expenses: [], budgets: {}, settings: { theme: "light" } };
}

function loadDB() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultDB();
    const parsed = JSON.parse(raw);
    return {
      ...defaultDB(),
      ...parsed,
      expenses: Array.isArray(parsed.expenses) ? parsed.expenses : [],
      budgets: (parsed.budgets && typeof parsed.budgets === "object" && !Array.isArray(parsed.budgets)) ? parsed.budgets : {},
      settings: { ...defaultDB().settings, ...(parsed.settings || {}) }
    };
  } catch (error) {
    console.warn(error);
    return defaultDB();
  }
}

function saveDB() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    return true;
  } catch (error) {
    console.warn(error);
    toast("Penyimpanan penuh, export & hapus data lama");
    return false;
  }
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

/* ---------- Expense / bookkeeping data layer ---------- */

function firstDayOf(monthKey) {
  return `${monthKey}-01`;
}

function normalizeExpense(data, id = null) {
  const existing = db.expenses.find((e) => e.id === id) || {};
  const category = EXPENSE_CATEGORIES.includes(data.category) ? data.category : "Lainnya";
  const expense = {
    id: id || existing.id || uid("exp"),
    createdAt: existing.createdAt || Date.now(),
    updatedAt: Date.now(),
    date: data.date || today(),
    name: String(data.name || "").trim(),
    category,
    amount: number(data.amount),
    payment: data.payment || PAYMENTS[0],
    recurring: data.recurring === true || data.recurring === "on" || data.recurring === "true",
    note: String(data.note || "").trim()
  };
  if (data.recurringFrom || existing.recurringFrom) expense.recurringFrom = data.recurringFrom || existing.recurringFrom;
  return expense;
}

function isValidExpense(expense) {
  return !!expense.name.trim() && number(expense.amount) > 0;
}

function getExpensesForMonth(monthKey = state.activeMonth) {
  return db.expenses.filter((e) => getMonthKey(e.date) === monthKey);
}

function summarizeExpenses(expenses) {
  const byCategory = {};
  let total = 0;
  expenses.forEach((e) => {
    const amount = number(e.amount);
    total += amount;
    byCategory[e.category] = (byCategory[e.category] || 0) + amount;
  });
  let topCategory = { label: "-", value: 0 };
  Object.entries(byCategory).forEach(([label, value]) => {
    if (value > topCategory.value) topCategory = { label, value };
  });
  return { total, count: expenses.length, byCategory, topCategory };
}

function netProfit(monthKey = state.activeMonth) {
  const income = summarize(getTransactionsForMonth(monthKey));
  const expenses = summarizeExpenses(getExpensesForMonth(monthKey)).total;
  const grossProfit = income.profit;
  const net = grossProfit - expenses;
  return { income: income.omzet, grossProfit, expenses, net, isProfit: net >= 0 };
}

function buildCashflow(monthKey = state.activeMonth, granularity = "day") {
  const tx = granularity === "day" ? getTransactionsForMonth(monthKey) : db.transactions;
  const exp = granularity === "day" ? getExpensesForMonth(monthKey) : db.expenses;
  const keyOf = (date) => granularity === "day" ? (date || today()) : getMonthKey(date);
  const points = {};
  const ensure = (key) => (points[key] = points[key] || { key, in: 0, out: 0, net: 0 });
  tx.filter(isActive).forEach((t) => { ensure(keyOf(t.date)).in += calcTotal(t); });
  exp.forEach((e) => { ensure(keyOf(e.date)).out += number(e.amount); });
  return Object.values(points)
    .map((p) => ({ ...p, net: p.in - p.out }))
    .sort((a, b) => (a.key < b.key ? -1 : a.key > b.key ? 1 : 0));
}

function budgetVsActual(monthKey = state.activeMonth) {
  const planned = (db.budgets && db.budgets[monthKey]) || {};
  const actual = summarizeExpenses(getExpensesForMonth(monthKey)).byCategory;
  const categories = new Set([...Object.keys(planned), ...Object.keys(actual)]);
  const rows = [];
  categories.forEach((category) => {
    const p = number(planned[category]);
    const a = number(actual[category]);
    const pct = p > 0 ? (a / p) * 100 : 0;
    let level;
    if (p === 0) level = "none";
    else if (a > p) level = "over";
    else if (pct >= 80 && pct <= 100) level = "warn";
    else level = "ok";
    rows.push({ category, planned: p, actual: a, pct, level });
  });
  return rows.sort((a, b) => b.actual - a.actual);
}

function carryOverRecurring(monthKey = state.activeMonth) {
  const templates = db.expenses.filter((e) => e.recurring === true && !e.recurringFrom);
  let created = 0;
  templates.forEach((tpl) => {
    let existsThisMonth = getMonthKey(tpl.date) === monthKey;
    if (!existsThisMonth) {
      existsThisMonth = db.expenses.some((e) => e.recurringFrom === tpl.id && getMonthKey(e.date) === monthKey);
    }
    if (!existsThisMonth) {
      db.expenses.push({
        ...tpl,
        id: uid("exp"),
        date: firstDayOf(monthKey),
        recurring: true,
        recurringFrom: tpl.id,
        createdAt: Date.now(),
        updatedAt: Date.now()
      });
      created++;
    }
  });
  if (created > 0) saveDB();
  return created;
}

function applyExpenseFilters(items) {
  const f = state.expenseFilters;
  let list = [...items];
  if (f.search) list = list.filter((e) => String(e.name || "").toLowerCase().includes(f.search.toLowerCase()));
  if (f.category !== "Semua") list = list.filter((e) => e.category === f.category);
  if (f.payment !== "Semua") list = list.filter((e) => e.payment === f.payment);
  if (f.sort === "amount") list.sort((a, b) => number(b.amount) - number(a.amount));
  else list.sort((a, b) => new Date(b.date) - new Date(a.date) || number(b.createdAt) - number(a.createdAt));
  return list;
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
  if (!el) return;
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

function navLinkHTML(item) {
  return `<button type="button" class="nav-link" data-route="${item.id}"><span class="ico">${item.icon}</span><span>${item.label}</span></button>`;
}

function closeNavMore() {
  const sheet = $("#navMoreSheet");
  if (sheet) sheet.setAttribute("hidden", "");
  $("#navMoreBtn")?.setAttribute("aria-expanded", "false");
}

function setupShell() {
  document.documentElement.dataset.theme = db.settings.theme || "light";
  // Desktop sidebar shows every route; mobile bottom nav keeps the primary
  // actions prominent and groups the less-used ones under a tidy "Lainnya" sheet.
  const sideNav = $("#sideNav");
  if (sideNav) sideNav.innerHTML = navItems.map(navLinkHTML).join("");
  const bottomNav = $("#bottomNav");
  if (bottomNav) {
    const primary = navItems.filter((item) => item.primary);
    const secondary = navItems.filter((item) => !item.primary);
    bottomNav.innerHTML = primary.map(navLinkHTML).join("") +
      `<button type="button" class="nav-link nav-more-btn" id="navMoreBtn" aria-haspopup="true" aria-expanded="false"><span class="ico">⋯</span><span>Lainnya</span></button>` +
      `<div class="nav-more-sheet" id="navMoreSheet" role="menu" hidden>${secondary.map(navLinkHTML).join("")}</div>`;
  }
  document.body.addEventListener("click", (event) => {
    const routeBtn = event.target.closest("[data-route]");
    if (routeBtn) {
      event.preventDefault();
      setRoute(routeBtn.dataset.route);
      closeNavMore();
    }
  });
  $("#navMoreBtn")?.addEventListener("click", (event) => {
    event.stopPropagation();
    const sheet = $("#navMoreSheet");
    const btn = $("#navMoreBtn");
    if (!sheet) return;
    const willOpen = sheet.hasAttribute("hidden");
    sheet.toggleAttribute("hidden", !willOpen);
    btn.setAttribute("aria-expanded", String(willOpen));
  });
  document.addEventListener("click", (event) => {
    const sheet = $("#navMoreSheet");
    if (!sheet || sheet.hasAttribute("hidden")) return;
    if (event.target.closest("#navMoreSheet") || event.target.closest("#navMoreBtn")) return;
    closeNavMore();
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
  setupServiceWorker();
}

// Register the service worker and auto-reload ONCE when a new version takes control,
// so the newest assets are used without any manual hard refresh. This is purely
// client-side cache/asset handling and NEVER clears or modifies localStorage —
// the user's saved data (key "bukuKeuanganDigital:v1") is left completely untouched.
function setupServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  let refreshing = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    // Guard against reload loops: only reload once when control passes to a new SW.
    if (refreshing) return;
    refreshing = true;
    window.location.reload();
  });
  navigator.serviceWorker
    .register("service-worker.js")
    .then((registration) => {
      // When an update is found, the new worker calls skipWaiting() + clients.claim()
      // in service-worker.js, which fires "controllerchange" and triggers the single auto-reload above.
      registration.addEventListener("updatefound", () => {
        const installing = registration.installing;
        if (!installing) return;
        installing.addEventListener("statechange", () => {
          if (installing.state === "installed" && navigator.serviceWorker.controller) {
            // A newer version is ready and will take control automatically.
          }
        });
      });
      // Proactively check for a newer service worker whenever we come back online / regain focus.
      const checkForUpdate = () => registration.update().catch(() => {});
      window.addEventListener("online", checkForUpdate);
      window.addEventListener("focus", checkForUpdate);
    })
    .catch(console.warn);
}

function syncNav() {
  const titles = { "tambah-pengeluaran": "Tambah Pengeluaran" };
  $("#pageTitle").textContent = navItems.find((item) => item.id === state.route)?.label || titles[state.route] || "Dashboard";
  document.querySelectorAll(".nav-link").forEach((link) => link.classList.toggle("active", link.dataset.route === state.route));
  const activeItem = navItems.find((item) => item.id === state.route);
  $("#navMoreBtn")?.classList.toggle("active", !!activeItem && !activeItem.primary);
  $("#themeToggle").textContent = db.settings.theme === "dark" ? "☀️" : "🌙";
}

function renderMonthSelect() {
  const select = $("#monthSelect");
  select.innerHTML = allMonthKeys().map((key) => `<option value="${key}" ${key === state.activeMonth ? "selected" : ""}>${shortMonthLabel(key)}</option>`).join("");
}

function render() {
  renderMonthSelect();
  syncNav();
  if (state.activeMonth <= currentMonthKey()) carryOverRecurring(state.activeMonth);
  const routes = { dashboard: renderDashboard, tambah: renderAdd, transaksi: renderTransactions, "tambah-pengeluaran": renderAddExpense, pengeluaran: renderExpenses, cashflow: renderCashflow, anggaran: renderBudgets, produk: renderProducts, rekap: renderRecap, pengaturan: renderSettings };
  (routes[state.route] || renderDashboard)();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function metric(label, value, hint = "", cls = "") {
  return `<article class="card metric ${cls}"><span class="label">${label}</span><span class="value">${value}</span>${hint ? `<span class="hint">${hint}</span>` : ""}</article>`;
}

// Compact secondary statistic, grouped inside a single card to reduce visual density.
function stat(label, value, hint = "", cls = "") {
  return `<div class="stat ${cls}"><span class="stat-label">${label}</span><span class="stat-value">${value}</span>${hint ? `<span class="stat-hint">${hint}</span>` : ""}</div>`;
}

function renderDashboard() {
  const monthTx = getTransactionsForMonth();
  const sum = summarize(monthTx);
  const np = netProfit(state.activeMonth);
  const expSum = summarizeExpenses(getExpensesForMonth(state.activeMonth));
  const expenseRatio = np.income ? (expSum.total / np.income) * 100 : 0;
  const todaySum = summarize(monthTx.filter((tx) => isSameDate(tx.date)));
  const weekSum = summarize(monthTx.filter((tx) => isThisWeek(tx.date)));
  const target = number(db.targets[state.activeMonth]);
  const pct = target ? Math.min(100, Math.round((sum.omzet / target) * 100)) : 0;
  const remaining = Math.max(0, target - sum.omzet);
  const lastTx = [...monthTx].sort((a, b) => new Date(b.date) - new Date(a.date) || number(b.createdAt) - number(a.createdAt)).slice(0, 4);
  view.innerHTML = `
    <div class="month-chips">${allMonthKeys().slice(0, 12).map((key) => `<button class="chip ${key === state.activeMonth ? "active" : ""}" data-month="${key}" type="button">${shortMonthLabel(key)}</button>`).join("")}</div>
    <div class="grid three primary-metrics" style="margin-top:14px">
      ${metric("Omzet", money(sum.omzet), monthLabel(state.activeMonth), "good")}
      ${metric("Net Profit", money(np.net), np.isProfit ? `<span class="dot good"></span>Untung bersih` : `<span class="dot bad"></span>Rugi bersih`, np.isProfit ? "good" : "bad")}
      ${metric("Pengeluaran", money(np.expenses), `${expSum.count} catatan`, "bad")}
    </div>
    <section class="card stat-group" style="margin-top:12px">
      <div class="stat-grid">
        ${stat("Gross profit", money(sum.profit), `${sum.total} transaksi`, sum.profit < 0 ? "neg" : "")}
        ${stat("Modal", money(sum.modal), "Refund tidak dihitung")}
        ${stat("Transaksi", sum.total, `${sum.lunas} lunas · ${sum.refund} refund`)}
        ${stat("Belum lunas", money(sum.unpaidAmount), `${sum.belum} transaksi`)}
        ${stat("Omzet hari ini", money(todaySum.omzet), `${todaySum.total} transaksi`)}
        ${stat("Profit hari ini", money(todaySum.profit), "Hari ini", todaySum.profit < 0 ? "neg" : "")}
        ${stat("Omzet minggu ini", money(weekSum.omzet), `Profit ${money(weekSum.profit)} · ${weekSum.total} tx`)}
      </div>
    </section>
    <section class="card" style="margin-top:12px">
      <div class="card-header"><div><h3>Tren Cashflow Bulanan</h3><p class="muted">Net, uang masuk, dan keluar sepanjang waktu.</p></div><button class="btn secondary small" data-route="cashflow">Detail</button></div>
      ${cashflowChart(buildCashflow(state.activeMonth, "month"), (key) => shortMonthLabel(key))}
    </section>
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
        ${kv("Produk terlaris", sum.topProduct.label)}${kv("Sumber terbesar", `${sum.topPlatform.label} · ${money(sum.topPlatform.value)}`)}${kv("Pembayaran utama", sum.topPayment.label)}${kv("Margin profit", pctValue(sum.margin))}${kv("Kategori pengeluaran terbesar", expSum.topCategory.label)}${kv("Rasio pengeluaran vs omzet", pctValue(expenseRatio))}
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

/* ---------- Expense views ---------- */

function renderAddExpense() {
  const editing = db.expenses.find((e) => e.id === state.editingId);
  view.innerHTML = `
    <section class="card" id="addExpensePanel">
      <div class="card-header"><div><h3>${editing ? "Edit Pengeluaran" : "Tambah Pengeluaran"}</h3><p class="muted">Catat biaya operasional di luar modal produk: iklan, langganan tools, listrik, fee platform, dll.</p></div></div>
      <form id="expenseForm" class="form-grid">
        ${input("date", "Tanggal", "date", editing?.date || today())}
        ${input("name", "Deskripsi pengeluaran", "text", editing?.name || "", "Contoh: Iklan Meta campaign Juni")}
        ${selectField("category", "Kategori", EXPENSE_CATEGORIES, editing?.category || EXPENSE_CATEGORIES[0])}
        ${input("amount", "Jumlah (Rp)", "number", editing?.amount || 0)}
        ${selectField("payment", "Metode pembayaran", PAYMENTS, editing?.payment || PAYMENTS[0])}
        <div class="field"><label>Berulang tiap bulan?</label><label class="check-row"><input type="checkbox" name="recurring" ${editing?.recurring ? "checked" : ""}> Jadikan pengeluaran rutin bulanan</label></div>
        <div class="field full"><label>Catatan</label><textarea name="note" placeholder="Catatan tambahan">${escapeHTML(editing?.note || "")}</textarea></div>
        <div class="field full form-actions"><button class="btn primary big-action" type="submit">${editing ? "Update Pengeluaran" : "Simpan Pengeluaran"}</button>${editing ? `<button class="btn ghost" type="button" id="cancelExpenseEdit">Batal Edit</button>` : ""}</div>
      </form>
    </section>`;
  $("#expenseForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.target));
    data.recurring = event.target.elements.recurring.checked;
    const expense = normalizeExpense(data, editing?.id);
    if (!isValidExpense(expense)) return toast("Jumlah & deskripsi pengeluaran wajib diisi");
    if (editing?.id) db.expenses = db.expenses.map((e) => e.id === editing.id ? expense : e);
    else db.expenses.push(expense);
    state.activeMonth = getMonthKey(expense.date);
    state.editingId = null;
    saveDB(); toast(editing?.id ? "Pengeluaran diperbarui" : "Pengeluaran tersimpan"); setRoute("pengeluaran");
  });
  $("#cancelExpenseEdit")?.addEventListener("click", () => { state.editingId = null; render(); });
}

function renderExpenses() {
  const monthExp = applyExpenseFilters(getExpensesForMonth());
  const sum = summarizeExpenses(getExpensesForMonth());
  view.innerHTML = `
    <div class="grid three" style="margin-bottom:12px">
      ${metric("Total pengeluaran", money(sum.total), monthLabel(state.activeMonth), "bad")}
      ${metric("Jumlah catatan", sum.count, "Bulan aktif")}
      ${metric("Kategori terbesar", sum.topCategory.label, money(sum.topCategory.value))}
    </div>
    <section class="card">
      <div class="card-header"><div><h3>Filter & Pencarian</h3><p class="muted">Cari, filter, dan sortir pengeluaran bulan aktif.</p></div><button class="btn primary small" data-route="tambah-pengeluaran">+ Tambah</button></div>
      <div class="form-grid">
        <div class="field"><label>Search deskripsi</label><input id="expFilterSearch" value="${escapeHTML(state.expenseFilters.search)}" placeholder="Cari pengeluaran..."></div>
        ${filterSelect("expFilterCategory", "Filter kategori", ["Semua", ...EXPENSE_CATEGORIES], state.expenseFilters.category)}
        ${filterSelect("expFilterPayment", "Filter pembayaran", ["Semua", ...PAYMENTS], state.expenseFilters.payment)}
        ${filterSelect("expFilterSort", "Sortir", [["newest", "Tanggal terbaru"], ["amount", "Jumlah terbesar"]], state.expenseFilters.sort)}
      </div>
    </section>
    <section class="card" style="margin-top:12px">
      <div class="card-header"><div><h3>Pengeluaran ${monthLabel(state.activeMonth)}</h3><p class="muted">Desktop tampil tabel, HP tampil card.</p></div></div>
      <div class="hide-mobile">${monthExp.length ? renderExpenseTable(monthExp) : emptyState("Belum ada pengeluaran", "Belum ada data untuk filter ini.")}</div>
      <div class="hide-desktop">${monthExp.length ? renderExpenseCards(monthExp) : emptyState("Belum ada pengeluaran", "Belum ada data untuk filter ini.")}</div>
    </section>`;
  bindExpenseFilters(); bindExpenseActions();
}

function bindExpenseFilters() {
  const map = { expFilterSearch: "search", expFilterCategory: "category", expFilterPayment: "payment", expFilterSort: "sort" };
  Object.entries(map).forEach(([id, key]) => $("#" + id).addEventListener(id === "expFilterSearch" ? "input" : "change", (event) => { state.expenseFilters[key] = event.target.value; renderExpenses(); }));
}

function renderExpenseTable(items) {
  return `<div class="table-wrap"><table><thead><tr><th>No</th><th>Tanggal</th><th>Deskripsi</th><th>Kategori</th><th>Jumlah</th><th>Pembayaran</th><th>Berulang</th><th>Aksi</th></tr></thead><tbody>${items.map((e, i) => `
    <tr><td>${i + 1}</td><td>${formatDate(e.date)}</td><td><strong>${escapeHTML(e.name)}</strong>${e.note ? `<br><span class="muted">${escapeHTML(e.note)}</span>` : ""}</td><td><span class="category-badge expense">${escapeHTML(e.category)}</span></td><td><strong>${money(e.amount)}</strong></td><td>${escapeHTML(e.payment)}</td><td>${e.recurring ? "🔁 Ya" : "Tidak"}</td><td>${expenseActions(e.id)}</td></tr>`).join("")}</tbody></table></div>`;
}

function renderExpenseCards(items) {
  return `<div class="tx-card-list">${items.map((e) => `<article class="tx-card expense-card"><div class="tx-top"><div><div class="tx-title">${escapeHTML(e.name)}</div><p class="muted">${formatDate(e.date)} · ${escapeHTML(e.payment)}</p><span class="category-badge expense">${escapeHTML(e.category)}</span> ${e.recurring ? `<span class="category-badge recurring">🔁 Rutin</span>` : ""}</div><strong class="expense-amount">${money(e.amount)}</strong></div>${e.note ? `<p class="muted">${escapeHTML(e.note)}</p>` : ""}${expenseActions(e.id)}</article>`).join("")}</div>`;
}

function expenseActions(id) {
  return `<div class="actions"><button class="btn ghost small" data-exp-edit="${id}">Edit</button><button class="btn secondary small" data-exp-duplicate="${id}">Duplikat</button><button class="btn danger small" data-exp-delete="${id}">Hapus</button></div>`;
}

function bindExpenseActions() {
  view.querySelectorAll("[data-exp-edit]").forEach((btn) => btn.addEventListener("click", () => { state.editingId = btn.dataset.expEdit; setRoute("tambah-pengeluaran"); }));
  view.querySelectorAll("[data-exp-duplicate]").forEach((btn) => btn.addEventListener("click", () => {
    const e = db.expenses.find((item) => item.id === btn.dataset.expDuplicate);
    if (!e) return;
    const clone = { ...e, id: uid("exp"), createdAt: Date.now(), updatedAt: Date.now(), date: today(), note: `${e.note || ""} (duplikat)`.trim() };
    delete clone.recurringFrom;
    db.expenses.push(clone);
    saveDB(); toast("Pengeluaran diduplikat"); renderExpenses();
  }));
  view.querySelectorAll("[data-exp-delete]").forEach((btn) => btn.addEventListener("click", () => {
    if (!confirm("Hapus pengeluaran ini?")) return;
    db.expenses = db.expenses.filter((e) => e.id !== btn.dataset.expDelete);
    saveDB(); toast("Pengeluaran dihapus"); renderExpenses();
  }));
}

function compactRupiah(value) {
  const n = number(value);
  const abs = Math.abs(n);
  const sign = n < 0 ? "-" : "";
  if (abs >= 1e9) return `${sign}${Math.round(abs / 1e8) / 10} M`;
  if (abs >= 1e6) return `${sign}${Math.round(abs / 1e5) / 10} jt`;
  if (abs >= 1e3) return `${sign}${Math.round(abs / 1e2) / 10} rb`;
  return `${sign}${abs}`;
}

// Dependency-free inline SVG line/area chart for cashflow trend.
// Reads points from buildCashflow output: [{ key, in, out, net }]
function cashflowChart(points, labelFn = (k) => k) {
  if (!Array.isArray(points) || points.length === 0) {
    return emptyState("Belum ada grafik", "Grafik tren akan muncul setelah ada pemasukan atau pengeluaran.");
  }
  const W = 720, H = 240;
  const padL = 52, padR = 16, padT = 16, padB = 34;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;
  const n = points.length;

  const values = [];
  points.forEach((p) => { values.push(number(p.in), number(p.out), number(p.net)); });
  let max = Math.max(0, ...values);
  let min = Math.min(0, ...values);
  if (max === min) { max = max + 1; min = min - 1; }
  const range = max - min;

  const x = (i) => padL + (n === 1 ? plotW / 2 : (i / (n - 1)) * plotW);
  const y = (v) => padT + plotH - ((number(v) - min) / range) * plotH;

  // Horizontal gridlines (5 levels) with compact labels
  const gridCount = 4;
  let grid = "";
  for (let g = 0; g <= gridCount; g++) {
    const val = min + (range * g) / gridCount;
    const gy = y(val);
    grid += `<line class="cf-grid" x1="${padL}" y1="${gy.toFixed(1)}" x2="${(W - padR).toFixed(1)}" y2="${gy.toFixed(1)}"></line>`;
    grid += `<text class="cf-axis-label" x="${padL - 8}" y="${(gy + 3).toFixed(1)}" text-anchor="end">${escapeHTML(compactRupiah(val))}</text>`;
  }

  const lineFor = (getter) => points.map((p, i) => `${x(i).toFixed(1)},${y(getter(p)).toFixed(1)}`).join(" ");
  const netPts = lineFor((p) => p.net);
  const inPts = lineFor((p) => p.in);
  const outPts = lineFor((p) => p.out);

  // Area under net line down to baseline (zero or chart bottom)
  const baseY = y(Math.max(min, 0));
  const areaPath = `${x(0).toFixed(1)},${baseY.toFixed(1)} ${netPts} ${x(n - 1).toFixed(1)},${baseY.toFixed(1)}`;

  // X axis labels: show up to ~6 evenly spaced to avoid clutter
  const maxLabels = 6;
  const step = Math.max(1, Math.ceil(n / maxLabels));
  let xLabels = "";
  points.forEach((p, i) => {
    if (i % step !== 0 && i !== n - 1) return;
    const anchor = i === 0 ? "start" : (i === n - 1 ? "end" : "middle");
    xLabels += `<text class="cf-axis-label" x="${x(i).toFixed(1)}" y="${H - 10}" text-anchor="${anchor}">${escapeHTML(labelFn(p.key))}</text>`;
  });

  // Dots for net at each point
  const dots = points.map((p, i) => `<circle class="cf-dot" cx="${x(i).toFixed(1)}" cy="${y(p.net).toFixed(1)}" r="${n > 20 ? 1.6 : 3}"></circle>`).join("");

  return `
    <div class="cf-chart">
      <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Grafik tren cashflow">
        ${grid}
        <polygon class="cf-area" points="${areaPath}"></polygon>
        <polyline class="cf-line-in" points="${inPts}"></polyline>
        <polyline class="cf-line-out" points="${outPts}"></polyline>
        <polyline class="cf-line-net" points="${netPts}"></polyline>
        ${dots}
        ${xLabels}
      </svg>
      <div class="cf-legend">
        <span><i class="net"></i>Net</span>
        <span><i class="in"></i>Masuk</span>
        <span><i class="out"></i>Keluar</span>
      </div>
    </div>`;
}

function renderCashflow() {
  const daily = buildCashflow(state.activeMonth, "day");
  const monthly = buildCashflow(state.activeMonth, "month");
  view.innerHTML = `
    <section class="card">
      <div class="card-header"><div><h3>Tren Cashflow Bulanan</h3><p class="muted">Pergerakan uang masuk, keluar, dan net sepanjang waktu.</p></div></div>
      ${cashflowChart(monthly, (key) => shortMonthLabel(key))}
    </section>
    <section class="card" style="margin-top:12px">
      <div class="card-header"><div><h3>Cashflow Harian · ${monthLabel(state.activeMonth)}</h3><p class="muted">Uang masuk (omzet aktif, tanpa refund) vs uang keluar (pengeluaran) per hari.</p></div></div>
      ${daily.length ? renderCashflowTable(daily, "day") : emptyState("Belum ada cashflow", "Belum ada pemasukan atau pengeluaran di bulan ini.")}
    </section>
    <section class="card" style="margin-top:12px">
      <div class="card-header"><div><h3>Cashflow Bulanan</h3><p class="muted">Tren uang masuk vs keluar sepanjang waktu.</p></div></div>
      ${monthly.length ? renderCashflowTable(monthly, "month") : emptyState("Belum ada cashflow", "Belum ada data pemasukan atau pengeluaran.")}
    </section>`;
}

function renderCashflowTable(points, granularity) {
  const label = (key) => granularity === "day" ? formatDate(key) : monthLabel(key);
  return `<div class="table-wrap"><table><thead><tr><th>${granularity === "day" ? "Tanggal" : "Bulan"}</th><th>Masuk</th><th>Keluar</th><th>Net</th><th>Status</th></tr></thead><tbody>${points.map((p) => `
    <tr><td><strong>${label(p.key)}</strong></td><td class="cf-in">${money(p.in)}</td><td class="cf-out">${money(p.out)}</td><td><strong>${money(p.net)}</strong></td><td>${p.net >= 0 ? `<span class="status-pill status-lunas">Surplus</span>` : `<span class="status-pill status-refund">Defisit</span>`}</td></tr>`).join("")}</tbody></table></div>`;
}

function renderBudgets() {
  const monthKey = state.activeMonth;
  const rows = budgetVsActual(monthKey);
  const planned = (db.budgets && db.budgets[monthKey]) || {};
  view.innerHTML = `
    <section class="card">
      <div class="card-header"><div><h3>Anggaran Bulanan · ${monthLabel(monthKey)}</h3><p class="muted">Tetapkan budget per kategori. Kosong atau 0 berarti tidak dianggarkan.</p></div></div>
      <form id="budgetForm" class="form-grid">
        ${EXPENSE_CATEGORIES.map((cat) => `<div class="field"><label>${escapeHTML(cat)}</label><input name="${escapeHTML(cat)}" type="number" min="0" inputmode="numeric" value="${planned[cat] ? number(planned[cat]) : ""}" placeholder="Budget ${escapeHTML(cat)}"></div>`).join("")}
        <div class="field full form-actions"><button class="btn primary" type="submit">Simpan Anggaran</button></div>
      </form>
    </section>
    <section class="card" style="margin-top:12px">
      <div class="card-header"><div><h3>Budget vs Aktual</h3><p class="muted">Progress pengeluaran terhadap anggaran. ⚠️ kuning = mendekati (≥80%), 🔴 merah = melebihi budget.</p></div></div>
      ${rows.length ? rows.map(renderBudgetRow).join("") : emptyState("Belum ada anggaran", "Tetapkan budget di atas atau catat pengeluaran untuk melihat perbandingan.")}
    </section>`;
  $("#budgetForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.target));
    const monthBudget = {};
    EXPENSE_CATEGORIES.forEach((cat) => {
      const value = number(data[cat]);
      if (value > 0) monthBudget[cat] = value;
    });
    db.budgets[monthKey] = monthBudget;
    saveDB(); toast("Anggaran disimpan"); renderBudgets();
  });
}

function renderBudgetRow(row) {
  const width = Math.min(100, row.pct);
  const status = row.level === "over" ? `<span class="dot bad"></span>Melebihi budget` : row.level === "warn" ? `<span class="dot warn"></span>Mendekati limit` : row.level === "none" ? `<span class="dot none"></span>Tanpa budget` : `<span class="dot good"></span>Aman`;
  return `<div class="budget-row">
    <div class="budget-head"><strong>${escapeHTML(row.category)}</strong><span class="muted">${money(row.actual)}${row.planned > 0 ? ` / ${money(row.planned)}` : ""}</span></div>
    <div class="progress ${row.level}"><span style="width:${width}%"></span></div>
    <div class="budget-foot"><span class="muted">${row.planned > 0 ? pctValue(row.pct) : "Belum dianggarkan"}</span><span class="budget-status budget-${row.level}">${status}</span></div>
  </div>`;
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
  const np = netProfit(state.activeMonth);
  view.innerHTML = `
    <div class="grid four">
      ${metric("Total omzet semua waktu", money(all.omzet), "Refund tidak dihitung", "good")}
      ${metric("Total keuntungan", money(all.profit), "Semua bulan", all.profit >= 0 ? "good" : "bad")}
      ${metric("Total modal", money(all.modal), "Semua bulan")}
      ${metric("Total transaksi", all.total, `${all.sold} produk terjual`)}
    </div>
    <section class="card kv" style="margin-top:12px"><div class="card-header"><div><h3>Pembukuan ${monthLabel(state.activeMonth)}</h3><p class="muted">Ringkasan pembukuan lengkap bulan aktif: omzet, gross profit, pengeluaran, dan net profit sesungguhnya.</p></div></div>
      ${kv("Omzet", money(np.income))}${kv("Gross Profit (margin penjualan)", money(np.grossProfit))}${kv("Total Pengeluaran", money(np.expenses))}
      <div class="kv-row net-row"><span>Net Profit (real)</span><strong class="${np.isProfit ? "good-text" : "bad-text"}"><span class="dot ${np.isProfit ? "good" : "bad"}"></span>${money(np.net)}</strong></div>
    </section>
    <div class="grid two" style="margin-top:12px">
      <section class="card kv"><div class="card-header"><div><h3>Highlight Semua Bulan</h3><p class="muted">Ringkasan performa sepanjang waktu.</p></div></div>
        ${kv("Bulan omzet tertinggi", highestOmzet ? `${monthLabel(highestOmzet.key)} · ${money(highestOmzet.omzet)}` : "-")}
        ${kv("Bulan keuntungan tertinggi", highestProfit ? `${monthLabel(highestProfit.key)} · ${money(highestProfit.profit)}` : "-")}
        ${kv("Produk terlaris", all.topProduct.label)}${kv("Sumber terbesar", all.topPlatform.label)}${kv("Kategori terbesar", all.topCategory.label)}${kv("Metode pembayaran tersering", all.topPayment.label)}
      </section>
      <section class="card"><div class="card-header"><div><h3>Backup Cepat</h3><p class="muted">Export laporan dari halaman rekap.</p></div></div><div class="form-actions"><button class="btn secondary" id="exportMonthCsv">Export CSV Transaksi Bulan</button><button class="btn secondary" id="exportAllCsv">Export Semua Transaksi</button><button class="btn secondary" id="exportMonthExpCsv">Export Pengeluaran Bulan</button><button class="btn secondary" id="exportAllExpCsv">Export Semua Pengeluaran</button><button class="btn ghost" id="copySummaryRecap">Copy Ringkasan</button></div></section>
    </div>
    <section class="card" style="margin-top:12px"><div class="card-header"><div><h3>Rekap Omzet & Keuntungan per Bulan</h3><p class="muted">Klik bulan di header untuk melihat detail transaksi.</p></div></div>${monthlyRows.length ? renderMonthlyTable(monthlyRows) : emptyState("Belum ada rekap", "Input transaksi untuk membuat laporan bulanan otomatis.")}</section>`;
  $("#exportMonthCsv").addEventListener("click", () => exportCSV(getTransactionsForMonth(), `rekap-${state.activeMonth}.csv`));
  $("#exportAllCsv").addEventListener("click", () => exportCSV(db.transactions, "semua-transaksi.csv"));
  $("#exportMonthExpCsv").addEventListener("click", () => exportExpensesCSV(getExpensesForMonth(), `pengeluaran-${state.activeMonth}.csv`));
  $("#exportAllExpCsv").addEventListener("click", () => exportExpensesCSV(db.expenses, "semua-pengeluaran.csv"));
  $("#copySummaryRecap").addEventListener("click", copyMonthSummary);
}

function renderMonthlyTable(rows) {
  return `<div class="table-wrap"><table><thead><tr><th>Bulan</th><th>Omzet</th><th>Modal</th><th>Keuntungan</th><th>Transaksi</th><th>Produk Terjual</th></tr></thead><tbody>${rows.map((r) => `<tr><td><strong>${monthLabel(r.key)}</strong></td><td>${money(r.omzet)}</td><td>${money(r.modal)}</td><td><strong>${money(r.profit)}</strong></td><td>${r.total}</td><td>${r.sold}</td></tr>`).join("")}</tbody></table></div>`;
}

function renderSettings() {
  view.innerHTML = `
    <div class="grid two">
      <section class="card"><div class="card-header"><div><h3>Export & Import Backup</h3><p class="muted">Simpan cadangan data secara rutin karena data utama ada di browser/localStorage.</p></div></div><div class="form-actions"><button class="btn primary" id="exportJson">Export JSON</button><button class="btn ghost" id="importJson">Import JSON</button><button class="btn secondary" id="exportMonthCsv">Export CSV Bulan Aktif</button><button class="btn secondary" id="exportAllCsv">Export Semua CSV</button><button class="btn secondary" id="exportAllExpCsv">Export Pengeluaran CSV</button></div></section>
      <section class="card"><div class="card-header"><div><h3>Preferensi</h3><p class="muted">Atur tampilan dan keamanan data.</p></div></div><div class="setting-row"><div><strong>Dark mode</strong><p class="muted">Mode gelap nyaman dipakai malam hari.</p></div><button class="btn ghost" id="settingsTheme">${db.settings.theme === "dark" ? "Pakai Light Mode" : "Pakai Dark Mode"}</button></div><hr style="border:0;border-top:1px solid var(--line);margin:16px 0"><button class="btn danger" id="resetAll">Reset Semua Data</button></section>
    </div>`;
  $("#exportJson").addEventListener("click", exportJSON);
  $("#importJson").addEventListener("click", () => $("#importFile").click());
  $("#exportMonthCsv").addEventListener("click", () => exportCSV(getTransactionsForMonth(), `rekap-${state.activeMonth}.csv`));
  $("#exportAllCsv").addEventListener("click", () => exportCSV(db.transactions, "semua-transaksi.csv"));
  $("#exportAllExpCsv").addEventListener("click", () => exportExpensesCSV(db.expenses, "semua-pengeluaran.csv"));
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
      db = {
        ...defaultDB(),
        ...imported,
        expenses: Array.isArray(imported.expenses) ? imported.expenses : [],
        budgets: (imported.budgets && typeof imported.budgets === "object" && !Array.isArray(imported.budgets)) ? imported.budgets : {},
        settings: { ...defaultDB().settings, ...(imported.settings || {}) }
      };
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

function exportExpensesCSV(items, filename) {
  const rows = [["Tanggal", "Deskripsi", "Kategori", "Jumlah", "Metode Pembayaran", "Berulang", "Catatan"]];
  items.forEach((e) => rows.push([e.date, e.name, e.category, e.amount, e.payment, e.recurring ? "Ya" : "Tidak", e.note]));
  const csv = rows.map((row) => row.map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
  download(filename, csv, "text/csv;charset=utf-8");
  toast("CSV pengeluaran diunduh");
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

if (typeof document !== "undefined") {
  setupShell();
  render();
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    defaultDB,
    loadDB,
    normalizeExpense,
    isValidExpense,
    getExpensesForMonth,
    getTransactionsForMonth,
    firstDayOf,
    summarize,
    summarizeExpenses,
    netProfit,
    buildCashflow,
    budgetVsActual,
    cashflowChart,
    compactRupiah,
    carryOverRecurring,
    applyExpenseFilters,
    getMonthKey,
    number,
    money,
    calcTotal,
    calcProfit,
    isActive,
    uid,
    today,
    EXPENSE_CATEGORIES,
    PAYMENTS,
    _setDB: (d) => { db = d; },
    _getDB: () => db,
    _setState: (s) => { state = s; },
    _getState: () => state
  };
}
