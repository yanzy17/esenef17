/* ============================================================================
 * Kasir Sederhana — POS web app (vanilla JS, no build, no deps)
 * Storage namespace: kasirSederhana:v1  (separate from App 1)
 * Sync target: Google Apps Script Web App URL (CORS-safe POST)
 * ==========================================================================*/

const STORAGE_KEY = "kasirSederhana:v1";
const URL_KEY = "kasirSederhana:apps_script_url";
const THEME_KEY = "kasirSederhana:theme";

const PAYMENT_METHODS = ["Cash", "QRIS", "Transfer Bank", "GoPay", "OVO", "DANA", "ShopeePay", "Lainnya"];

const navItems = [
  { id: "kasir",       label: "Kasir",      icon: "🛒" },
  { id: "produk",      label: "Produk",     icon: "📦" },
  { id: "riwayat",     label: "Riwayat",    icon: "📒" },
  { id: "dashboard",   label: "Dashboard",  icon: "📊" },
  { id: "pengaturan",  label: "Atur",       icon: "⚙️" }
];

let db = loadDB();
let state = {
  route: (typeof location !== "undefined" ? location.hash.replace("#", "") : "") || "kasir",
  cart: [],                    // [{ productId, name, price, qty }]
  customer: "",
  payment: "Cash",
  cashReceived: 0,
  discount: { mode: "rp", value: 0 },  // mode "rp" or "pct"
  note: "",
  productSearch: "",
  productEditingId: null,
  historyFilter: { from: "", to: "", search: "" },
  online: typeof navigator !== "undefined" ? navigator.onLine : true,
  toastTimer: null,
  syncInFlight: false
};

const $ = (s) => (typeof document !== "undefined" ? document.querySelector(s) : null);
const view = $("#viewContainer");

/* ----------------------------- Storage layer ----------------------------- */

function defaultDB() {
  return {
    shop: { name: "Toko Saya", address: "", phone: "" },
    products: [],
    transactions: [],
    appsScriptUrl: ""
  };
}

function loadDB() {
  try {
    const raw = (typeof localStorage !== "undefined") ? localStorage.getItem(STORAGE_KEY) : null;
    if (!raw) return defaultDB();
    const parsed = JSON.parse(raw);
    const base = defaultDB();
    return {
      ...base,
      ...parsed,
      shop: { ...base.shop, ...(parsed.shop || {}) },
      products: Array.isArray(parsed.products) ? parsed.products : [],
      transactions: Array.isArray(parsed.transactions) ? parsed.transactions : [],
      appsScriptUrl: typeof parsed.appsScriptUrl === "string" ? parsed.appsScriptUrl : ""
    };
  } catch (error) {
    console.warn("loadDB failed", error);
    return defaultDB();
  }
}

function saveDB() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    return true;
  } catch (error) {
    console.warn("saveDB failed", error);
    toast("Penyimpanan penuh — export & hapus data lama", "error");
    return false;
  }
}

/* ----------------------------- Helpers ---------------------------------- */

function uid(prefix = "id") {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

function escapeHTML(value = "") {
  return String(value).replace(/[&<>'"]/g, (char) => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]
  ));
}

function number(value) {
  return Number(String(value ?? "").replace(/[^0-9.-]/g, "")) || 0;
}

function money(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency", currency: "IDR", maximumFractionDigits: 0
  }).format(number(value));
}

function pad(n) { return String(n).padStart(2, "0"); }

function nowISO() {
  return new Date().toISOString();
}

function fmtDateTime(iso) {
  if (!iso) return "-";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "-";
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function fmtDateOnly(iso) {
  if (!iso) return "-";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "-";
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
}

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function isoDateKey(iso) {
  // returns YYYY-MM-DD in local time
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function options(items, selected = "") {
  return items.map((item) =>
    `<option value="${escapeHTML(item)}" ${item === selected ? "selected" : ""}>${escapeHTML(item)}</option>`
  ).join("");
}

/* ----------------------------- Toast ------------------------------------ */

function toast(message, kind = "ok") {
  const el = $("#toast");
  if (!el) return;
  el.textContent = message;
  el.classList.toggle("error", kind === "error");
  el.classList.add("show");
  if (state.toastTimer) clearTimeout(state.toastTimer);
  state.toastTimer = setTimeout(() => el.classList.remove("show"), 2400);
}

/* ----------------------------- Cart math -------------------------------- */

function cartSubtotal() {
  return state.cart.reduce((sum, it) => sum + number(it.price) * number(it.qty), 0);
}

function discountAmount(subtotal) {
  const d = state.discount;
  if (!d || !number(d.value)) return 0;
  if (d.mode === "pct") {
    const pct = Math.max(0, Math.min(100, number(d.value)));
    return Math.round(subtotal * pct / 100);
  }
  return Math.min(subtotal, number(d.value));
}

function cartTotal() {
  const sub = cartSubtotal();
  return Math.max(0, sub - discountAmount(sub));
}

function cartChange() {
  if (state.payment !== "Cash") return 0;
  const c = number(state.cashReceived) - cartTotal();
  return c > 0 ? c : 0;
}

/* ----------------------------- Products --------------------------------- */

function getProduct(id) {
  return db.products.find((p) => p.id === id) || null;
}

function addOrUpdateProduct(input) {
  const now = nowISO();
  const p = {
    id: input.id || uid("prd"),
    name: String(input.name || "").trim(),
    price: number(input.price),
    category: String(input.category || "").trim(),
    stock: input.stock === "" || input.stock == null ? null : number(input.stock),
    updatedAt: now
  };
  if (!p.name) { toast("Nama produk wajib diisi", "error"); return false; }
  if (p.price < 0) { toast("Harga tidak valid", "error"); return false; }
  const idx = db.products.findIndex((x) => x.id === p.id);
  if (idx >= 0) db.products[idx] = p; else db.products.push(p);
  saveDB();
  return true;
}

function deleteProduct(id) {
  db.products = db.products.filter((p) => p.id !== id);
  saveDB();
}

/* ----------------------------- Cart ops --------------------------------- */

function cartAdd(productId) {
  const prod = getProduct(productId);
  if (!prod) return;
  if (prod.stock != null && prod.stock <= 0) {
    toast("Stok produk habis", "error");
    return;
  }
  const existing = state.cart.find((i) => i.productId === productId);
  if (existing) {
    if (prod.stock != null && existing.qty + 1 > prod.stock) {
      toast("Melebihi stok tersedia", "error");
      return;
    }
    existing.qty += 1;
  } else {
    state.cart.push({ productId, name: prod.name, price: prod.price, qty: 1 });
  }
  renderRoute();
}

function cartSetQty(productId, qty) {
  const item = state.cart.find((i) => i.productId === productId);
  if (!item) return;
  const prod = getProduct(productId);
  let q = Math.max(0, Math.floor(number(qty)));
  if (prod && prod.stock != null && q > prod.stock) {
    q = prod.stock;
    toast("Disesuaikan ke stok tersedia");
  }
  if (q === 0) {
    state.cart = state.cart.filter((i) => i.productId !== productId);
  } else {
    item.qty = q;
  }
  renderRoute();
}

function cartRemove(productId) {
  state.cart = state.cart.filter((i) => i.productId !== productId);
  renderRoute();
}

function cartClear() {
  state.cart = [];
  state.customer = "";
  state.payment = "Cash";
  state.cashReceived = 0;
  state.discount = { mode: "rp", value: 0 };
  state.note = "";
}

/* ----------------------------- Save Transaction -------------------------- */

function buildTransactionFromCart() {
  const subtotal = cartSubtotal();
  const disc = discountAmount(subtotal);
  const total = Math.max(0, subtotal - disc);
  const cash = state.payment === "Cash" ? number(state.cashReceived) : 0;
  const change = state.payment === "Cash" ? Math.max(0, cash - total) : 0;
  const items = state.cart.map((it) => ({
    productId: it.productId,
    name: it.name,
    qty: number(it.qty),
    price: number(it.price),
    subtotal: number(it.qty) * number(it.price)
  }));
  return {
    id: uid("trx"),
    createdAt: nowISO(),
    datetime: nowISO(),
    customer: String(state.customer || "").trim(),
    items,
    subtotal,
    discount: disc,
    discountMeta: { mode: state.discount.mode, value: number(state.discount.value) },
    total,
    payment: state.payment,
    cashReceived: cash,
    change,
    note: String(state.note || "").trim(),
    synced: false,
    syncedAt: null
  };
}

async function commitTransaction() {
  if (state.cart.length === 0) { toast("Keranjang kosong", "error"); return; }
  if (state.payment === "Cash" && number(state.cashReceived) < cartTotal()) {
    toast("Tunai diterima kurang", "error"); return;
  }
  const trx = buildTransactionFromCart();
  // decrement stock for tracked products
  for (const it of trx.items) {
    const p = getProduct(it.productId);
    if (p && p.stock != null) p.stock = Math.max(0, p.stock - it.qty);
  }
  db.transactions.unshift(trx);
  if (!saveDB()) return;
  // attempt sync
  if (db.appsScriptUrl && state.online) {
    try {
      const ok = await pushTransaction(trx);
      if (ok) {
        const t = db.transactions.find((t) => t.id === trx.id);
        if (t) { t.synced = true; t.syncedAt = nowISO(); saveDB(); }
      }
    } catch (e) {
      // remain unsynced; queued
    }
  }
  cartClear();
  toast("Transaksi tersimpan");
  showReceiptModal(trx);
  updateSyncPill();
}

/* ----------------------------- Sync (Apps Script) ------------------------ */

/**
 * POST a JSON payload WITHOUT a Content-Type header.
 * Apps Script reads it via e.postData.contents. This avoids CORS preflight
 * which Google apps script Web Apps cannot answer.
 */
async function postNoPreflight(url, payload) {
  const body = JSON.stringify(payload);
  const res = await fetch(url, {
    method: "POST",
    body, // plain string; browser sends as text/plain — no preflight
    redirect: "follow",
    mode: "cors"
    // intentionally no headers — adding "Content-Type: application/json" triggers preflight
  });
  const text = await res.text();
  let json = null;
  try { json = JSON.parse(text); } catch { /* not JSON */ }
  return { ok: res.ok, status: res.status, text, json };
}

async function pushTransaction(trx) {
  if (!db.appsScriptUrl) return false;
  const payload = {
    type: "transaction",
    shop: db.shop,
    transaction: {
      id: trx.id,
      datetime: trx.datetime,
      customer: trx.customer,
      payment: trx.payment,
      subtotal: trx.subtotal,
      discount: trx.discount,
      total: trx.total,
      cashReceived: trx.cashReceived,
      change: trx.change,
      note: trx.note,
      items: trx.items.map((it) => ({
        name: it.name, qty: it.qty, price: it.price, subtotal: it.subtotal
      }))
    },
    source: "Kasir Sederhana Web"
  };
  const result = await postNoPreflight(db.appsScriptUrl, payload);
  return !!(result.ok && (!result.json || result.json.ok !== false));
}

async function pingScript() {
  if (!db.appsScriptUrl) { toast("URL Apps Script belum diisi", "error"); return false; }
  try {
    const result = await postNoPreflight(db.appsScriptUrl, { type: "ping" });
    if (result.ok) {
      toast("Terhubung ✓");
      return true;
    }
    toast(`Gagal: HTTP ${result.status}`, "error");
    return false;
  } catch (e) {
    toast(`Gagal: ${e.message || e}`, "error");
    return false;
  }
}

async function syncPending() {
  if (state.syncInFlight) return;
  if (!db.appsScriptUrl) { toast("URL Apps Script belum diisi", "error"); return; }
  if (!state.online) { toast("Sedang offline", "error"); return; }
  const pending = db.transactions.filter((t) => !t.synced);
  if (pending.length === 0) { toast("Semua sudah tersinkron"); return; }
  state.syncInFlight = true;
  updateSyncPill();
  let ok = 0, fail = 0;
  // sync oldest first so sheet is chronological
  for (const trx of [...pending].reverse()) {
    try {
      const success = await pushTransaction(trx);
      if (success) {
        const t = db.transactions.find((x) => x.id === trx.id);
        if (t) { t.synced = true; t.syncedAt = nowISO(); }
        ok++;
      } else {
        fail++;
      }
    } catch (e) {
      fail++;
    }
  }
  saveDB();
  state.syncInFlight = false;
  toast(`Sinkron selesai: ${ok} OK, ${fail} gagal`, fail > 0 ? "error" : "ok");
  updateSyncPill();
  renderRoute();
}

function updateSyncPill() {
  const pill = $("#syncPill");
  const text = $("#syncPillText");
  if (!pill || !text) return;
  const pending = db.transactions.filter((t) => !t.synced).length;
  pill.classList.remove("online", "offline");
  if (!state.online) {
    pill.classList.add("offline");
    text.textContent = `Offline · ${pending} pending`;
    pill.firstChild.nodeValue = "⚠ ";
    return;
  }
  if (!db.appsScriptUrl) {
    text.textContent = `Belum disetel · ${pending} lokal`;
    pill.firstChild.nodeValue = "○ ";
    return;
  }
  if (state.syncInFlight) {
    text.textContent = `Sinkron…`;
    pill.firstChild.nodeValue = "⟳ ";
    return;
  }
  if (pending === 0) {
    pill.classList.add("online");
    text.textContent = "Tersinkron";
    pill.firstChild.nodeValue = "✓ ";
  } else {
    text.textContent = `${pending} belum sinkron`;
    pill.firstChild.nodeValue = "⟳ ";
  }
}

/* ----------------------------- Render core ------------------------------ */

function renderNav() {
  const sideNav = $("#sideNav");
  const bottomNav = $("#bottomNav");
  const itemHTML = (n, fullLabel = false) => `
    <button class="nav-link ${state.route === n.id ? "active" : ""}" type="button" data-route="${n.id}" aria-label="${escapeHTML(n.label)}">
      <span class="ico" aria-hidden="true">${n.icon}</span>
      <span>${escapeHTML(n.label)}</span>
    </button>`;
  if (sideNav) sideNav.innerHTML = navItems.map((n) => itemHTML(n, true)).join("");
  if (bottomNav) bottomNav.innerHTML = navItems.map((n) => itemHTML(n)).join("");
}

function setActiveTitle() {
  const item = navItems.find((n) => n.id === state.route);
  const t = $("#pageTitle");
  if (t) t.textContent = item ? item.label : "Kasir";
}

function renderRoute() {
  setActiveTitle();
  renderNav();
  if (!view) return;
  switch (state.route) {
    case "kasir":      renderKasir(); break;
    case "produk":     renderProduk(); break;
    case "riwayat":    renderRiwayat(); break;
    case "dashboard":  renderDashboard(); break;
    case "pengaturan": renderPengaturan(); break;
    default:           state.route = "kasir"; renderKasir();
  }
  updateSyncPill();
}

/* ----------------------------- View: Kasir (POS) ------------------------- */

function renderKasir() {
  const q = (state.productSearch || "").toLowerCase();
  const products = db.products.filter((p) => !q || p.name.toLowerCase().includes(q) || (p.category || "").toLowerCase().includes(q));
  const subtotal = cartSubtotal();
  const disc = discountAmount(subtotal);
  const total = cartTotal();
  const change = cartChange();

  view.innerHTML = `
    <div class="pos-layout">
      <section class="card pos-products">
        <div class="card-header">
          <div>
            <h3>Produk</h3>
            <p class="muted">Tap produk untuk menambahkan ke keranjang.</p>
          </div>
          <button class="btn small secondary" type="button" data-route="produk">+ Kelola Produk</button>
        </div>
        <div class="pos-search">
          <input id="prodSearch" type="search" placeholder="Cari produk / kategori…" value="${escapeHTML(state.productSearch)}" />
        </div>
        ${products.length === 0 ? `
          <div class="empty">
            <span class="emoji">📦</span>
            <strong>Belum ada produk</strong>
            Tambah produk dulu di menu Produk.
          </div>
        ` : `
          <div class="prod-grid">
            ${products.map((p) => `
              <button class="prod-tile ${p.stock != null && p.stock <= 0 ? "out" : ""}" data-add="${p.id}" type="button" ${p.stock != null && p.stock <= 0 ? "disabled" : ""}>
                <span class="pname">${escapeHTML(p.name)}</span>
                <span class="pmeta">${p.category ? escapeHTML(p.category) : "&nbsp;"}${p.stock != null ? ` · stok ${p.stock}` : ""}</span>
                <span class="pprice">${money(p.price)}</span>
              </button>
            `).join("")}
          </div>
        `}
      </section>

      <section class="card pos-cart cart-card">
        <div class="card-header">
          <div>
            <h3>Keranjang</h3>
            <p class="muted">${state.cart.length} item · ${money(subtotal)} subtotal</p>
          </div>
          ${state.cart.length > 0 ? `<button class="btn small ghost" type="button" id="cartClearBtn">Kosongkan</button>` : ""}
        </div>

        ${state.cart.length === 0 ? `
          <div class="empty">
            <span class="emoji">🛒</span>
            <strong>Keranjang kosong</strong>
            Pilih produk untuk mulai transaksi.
          </div>
        ` : `
          <div class="cart-list">
            ${state.cart.map((it) => `
              <div class="cart-row">
                <div>
                  <div class="cname">${escapeHTML(it.name)}</div>
                  <div class="cmeta">${money(it.price)} / item</div>
                  <div class="qty-ctrl">
                    <button type="button" data-dec="${it.productId}" aria-label="Kurangi">−</button>
                    <input type="number" min="0" inputmode="numeric" value="${it.qty}" data-qty="${it.productId}" />
                    <button type="button" data-inc="${it.productId}" aria-label="Tambah">+</button>
                  </div>
                </div>
                <div>
                  <div class="csub">${money(it.qty * it.price)}</div>
                  <button class="crm" type="button" data-rm="${it.productId}">Hapus</button>
                </div>
              </div>
            `).join("")}
          </div>
        `}

        <div class="form-grid" style="margin-top:8px">
          <div class="field full">
            <label>Diskon</label>
            <div class="dscnt-row">
              <input id="discValue" type="number" min="0" inputmode="numeric" placeholder="0" value="${state.discount.value || ""}" />
              <div class="toggle" role="group" aria-label="Mode diskon">
                <button type="button" id="discRp" class="${state.discount.mode === 'rp' ? 'active' : ''}">Rp</button>
                <button type="button" id="discPct" class="${state.discount.mode === 'pct' ? 'active' : ''}">%</button>
              </div>
            </div>
          </div>
          <div class="field">
            <label>Nama pelanggan</label>
            <input id="custName" type="text" value="${escapeHTML(state.customer)}" placeholder="Opsional" />
          </div>
          <div class="field">
            <label>Metode bayar</label>
            <select id="paySelect">${options(PAYMENT_METHODS, state.payment)}</select>
          </div>
          ${state.payment === "Cash" ? `
            <div class="field full">
              <label>Tunai diterima</label>
              <input id="cashReceived" type="number" min="0" inputmode="numeric" value="${state.cashReceived || ""}" placeholder="${total}" />
            </div>
          ` : ""}
          <div class="field full">
            <label>Catatan</label>
            <input id="noteInput" type="text" value="${escapeHTML(state.note)}" placeholder="Opsional" />
          </div>
        </div>

        <div class="totals">
          <div class="trow"><span>Subtotal</span><strong>${money(subtotal)}</strong></div>
          <div class="trow"><span>Diskon</span><strong>− ${money(disc)}</strong></div>
          <div class="trow total"><span>Total</span><strong>${money(total)}</strong></div>
          ${state.payment === "Cash" ? `
            <div class="trow"><span>Tunai</span><strong>${money(state.cashReceived)}</strong></div>
            <div class="trow change"><span>Kembalian</span><strong>${money(change)}</strong></div>
          ` : ""}
        </div>

        <button class="btn primary block" id="commitBtn" type="button" ${state.cart.length === 0 ? "disabled" : ""}>Catat Transaksi</button>
      </section>
    </div>
  `;

  // wire up
  const search = $("#prodSearch");
  if (search) {
    search.addEventListener("input", (e) => {
      state.productSearch = e.target.value;
      // partial re-render only the product grid would be nicer; full is fine for now
      renderKasir();
      $("#prodSearch")?.focus();
    });
  }
  view.querySelectorAll("[data-add]").forEach((btn) => {
    btn.addEventListener("click", () => cartAdd(btn.getAttribute("data-add")));
  });
  view.querySelectorAll("[data-inc]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-inc");
      const item = state.cart.find((i) => i.productId === id);
      if (item) cartSetQty(id, item.qty + 1);
    });
  });
  view.querySelectorAll("[data-dec]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-dec");
      const item = state.cart.find((i) => i.productId === id);
      if (item) cartSetQty(id, item.qty - 1);
    });
  });
  view.querySelectorAll("[data-qty]").forEach((inp) => {
    inp.addEventListener("change", () => cartSetQty(inp.getAttribute("data-qty"), inp.value));
  });
  view.querySelectorAll("[data-rm]").forEach((btn) => {
    btn.addEventListener("click", () => cartRemove(btn.getAttribute("data-rm")));
  });
  $("#cartClearBtn")?.addEventListener("click", () => { cartClear(); renderRoute(); });

  $("#discValue")?.addEventListener("input", (e) => { state.discount.value = number(e.target.value); refreshTotalsOnly(); });
  $("#discRp")?.addEventListener("click", () => { state.discount.mode = "rp"; renderKasir(); });
  $("#discPct")?.addEventListener("click", () => { state.discount.mode = "pct"; renderKasir(); });
  $("#custName")?.addEventListener("input", (e) => { state.customer = e.target.value; });
  $("#noteInput")?.addEventListener("input", (e) => { state.note = e.target.value; });
  $("#paySelect")?.addEventListener("change", (e) => {
    state.payment = e.target.value;
    if (state.payment !== "Cash") state.cashReceived = 0;
    renderKasir();
  });
  $("#cashReceived")?.addEventListener("input", (e) => { state.cashReceived = number(e.target.value); refreshTotalsOnly(); });
  $("#commitBtn")?.addEventListener("click", commitTransaction);
}

function refreshTotalsOnly() {
  const subtotal = cartSubtotal();
  const disc = discountAmount(subtotal);
  const total = cartTotal();
  const change = cartChange();
  const totals = view.querySelector(".totals");
  if (!totals) return;
  totals.innerHTML = `
    <div class="trow"><span>Subtotal</span><strong>${money(subtotal)}</strong></div>
    <div class="trow"><span>Diskon</span><strong>− ${money(disc)}</strong></div>
    <div class="trow total"><span>Total</span><strong>${money(total)}</strong></div>
    ${state.payment === "Cash" ? `
      <div class="trow"><span>Tunai</span><strong>${money(state.cashReceived)}</strong></div>
      <div class="trow change"><span>Kembalian</span><strong>${money(change)}</strong></div>
    ` : ""}
  `;
}

/* ----------------------------- View: Produk ------------------------------ */

function renderProduk() {
  const editing = state.productEditingId ? getProduct(state.productEditingId) : null;
  const q = (state.productSearch || "").toLowerCase();
  const list = db.products
    .filter((p) => !q || p.name.toLowerCase().includes(q) || (p.category || "").toLowerCase().includes(q))
    .sort((a, b) => a.name.localeCompare(b.name, "id"));

  view.innerHTML = `
    <section class="card">
      <div class="card-header">
        <div>
          <h3>${editing ? "Edit Produk" : "Tambah Produk"}</h3>
          <p class="muted">Masukkan detail produk. Stok kosongkan jika tidak dilacak.</p>
        </div>
        ${editing ? `<button class="btn small ghost" type="button" id="cancelEditBtn">Batal</button>` : ""}
      </div>
      <form id="prodForm" class="form-grid" autocomplete="off">
        <div class="field">
          <label for="pName">Nama produk *</label>
          <input id="pName" name="name" type="text" value="${escapeHTML(editing?.name || "")}" required />
        </div>
        <div class="field">
          <label for="pPrice">Harga (Rp) *</label>
          <input id="pPrice" name="price" type="number" min="0" inputmode="numeric" value="${editing?.price ?? ""}" required />
        </div>
        <div class="field">
          <label for="pCategory">Kategori</label>
          <input id="pCategory" name="category" type="text" value="${escapeHTML(editing?.category || "")}" placeholder="Opsional" />
        </div>
        <div class="field">
          <label for="pStock">Stok</label>
          <input id="pStock" name="stock" type="number" min="0" inputmode="numeric" value="${editing?.stock ?? ""}" placeholder="Kosongkan = tidak dilacak" />
        </div>
        <div class="form-actions field full">
          <button class="btn primary" type="submit">${editing ? "Simpan Perubahan" : "+ Tambah Produk"}</button>
        </div>
      </form>
    </section>

    <section class="card">
      <div class="card-header">
        <div>
          <h3>Daftar Produk</h3>
          <p class="muted">${db.products.length} produk total</p>
        </div>
      </div>
      <div class="search-row">
        <input id="prodListSearch" type="search" placeholder="Cari produk / kategori…" value="${escapeHTML(state.productSearch)}" />
      </div>
      ${list.length === 0 ? `
        <div class="empty">
          <span class="emoji">📦</span>
          <strong>Belum ada produk</strong>
          Tambah produk pertama lewat form di atas.
        </div>
      ` : `
        <div class="table-wrap">
          <table>
            <thead><tr>
              <th>Nama</th><th>Kategori</th><th>Harga</th><th>Stok</th><th>Aksi</th>
            </tr></thead>
            <tbody>
              ${list.map((p) => `
                <tr>
                  <td><strong>${escapeHTML(p.name)}</strong></td>
                  <td>${p.category ? escapeHTML(p.category) : "<span class='muted'>—</span>"}</td>
                  <td>${money(p.price)}</td>
                  <td>${p.stock == null ? "<span class='muted'>tidak dilacak</span>" : p.stock}</td>
                  <td>
                    <button class="btn small ghost" type="button" data-edit="${p.id}">Edit</button>
                    <button class="btn small danger" type="button" data-del="${p.id}">Hapus</button>
                  </td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      `}
    </section>
  `;

  $("#prodForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const f = e.target;
    const ok = addOrUpdateProduct({
      id: state.productEditingId || "",
      name: f.name.value,
      price: f.price.value,
      category: f.category.value,
      stock: f.stock.value === "" ? null : f.stock.value
    });
    if (ok) {
      toast(state.productEditingId ? "Produk diperbarui" : "Produk ditambahkan");
      state.productEditingId = null;
      renderProduk();
    }
  });
  $("#cancelEditBtn")?.addEventListener("click", () => { state.productEditingId = null; renderProduk(); });
  $("#prodListSearch")?.addEventListener("input", (e) => {
    state.productSearch = e.target.value;
    renderProduk();
    $("#prodListSearch")?.focus();
  });
  view.querySelectorAll("[data-edit]").forEach((b) => {
    b.addEventListener("click", () => { state.productEditingId = b.getAttribute("data-edit"); renderProduk(); window.scrollTo({ top: 0, behavior: "smooth" }); });
  });
  view.querySelectorAll("[data-del]").forEach((b) => {
    b.addEventListener("click", () => {
      const p = getProduct(b.getAttribute("data-del"));
      if (!p) return;
      if (confirm(`Hapus produk "${p.name}"?`)) {
        deleteProduct(p.id);
        toast("Produk dihapus");
        renderProduk();
      }
    });
  });
}

/* ----------------------------- View: Riwayat ----------------------------- */

function filteredTransactions() {
  const { from, to, search } = state.historyFilter;
  const q = (search || "").toLowerCase();
  return db.transactions.filter((t) => {
    const dk = isoDateKey(t.datetime || t.createdAt);
    if (from && dk < from) return false;
    if (to && dk > to) return false;
    if (q) {
      const hay = [
        t.customer,
        t.payment,
        t.note,
        ...(t.items || []).map((i) => i.name)
      ].join(" ").toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

function renderRiwayat() {
  const list = filteredTransactions();
  const total = list.reduce((s, t) => s + number(t.total), 0);

  view.innerHTML = `
    <section class="card">
      <div class="card-header">
        <div>
          <h3>Filter</h3>
          <p class="muted">${list.length} transaksi · ${money(total)}</p>
        </div>
      </div>
      <div class="form-grid">
        <div class="field">
          <label for="hFrom">Dari tanggal</label>
          <input id="hFrom" type="date" value="${escapeHTML(state.historyFilter.from)}" />
        </div>
        <div class="field">
          <label for="hTo">Sampai tanggal</label>
          <input id="hTo" type="date" value="${escapeHTML(state.historyFilter.to)}" />
        </div>
        <div class="field full">
          <label for="hSearch">Cari (customer / item / catatan)</label>
          <input id="hSearch" type="search" value="${escapeHTML(state.historyFilter.search)}" placeholder="Misal: Andi, kopi, QRIS" />
        </div>
        <div class="form-actions field full">
          <button class="btn ghost" type="button" id="hReset">Reset Filter</button>
        </div>
      </div>
    </section>

    <section class="card">
      <div class="card-header">
        <div>
          <h3>Transaksi</h3>
          <p class="muted">Tap satu baris untuk detail dan cetak ulang struk.</p>
        </div>
      </div>
      ${list.length === 0 ? `
        <div class="empty">
          <span class="emoji">📒</span>
          <strong>Belum ada transaksi</strong>
          Catat transaksi pertama dari menu Kasir.
        </div>
      ` : `
        <div class="table-wrap hide-mobile">
          <table>
            <thead><tr>
              <th>Waktu</th><th>Customer</th><th>Item</th><th>Bayar</th><th>Total</th><th>Sync</th><th></th>
            </tr></thead>
            <tbody>
              ${list.map((t) => `
                <tr>
                  <td>${escapeHTML(fmtDateTime(t.datetime || t.createdAt))}</td>
                  <td>${t.customer ? escapeHTML(t.customer) : "<span class='muted'>—</span>"}</td>
                  <td>${(t.items || []).length}</td>
                  <td>${escapeHTML(t.payment)}</td>
                  <td><strong>${money(t.total)}</strong></td>
                  <td>${syncTagHTML(t)}</td>
                  <td><button class="btn small ghost" type="button" data-detail="${t.id}">Detail</button></td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
        <div class="tx-card-list hide-desktop">
          ${list.map((t) => `
            <article class="tx-card" data-detail="${t.id}" role="button" tabindex="0">
              <div class="tx-top">
                <div>
                  <div class="tx-title">${escapeHTML(fmtDateTime(t.datetime || t.createdAt))}</div>
                  <div class="muted">${t.customer ? escapeHTML(t.customer) : "Tanpa nama"} · ${escapeHTML(t.payment)}</div>
                </div>
                <div style="text-align:right">
                  <div><strong>${money(t.total)}</strong></div>
                  <div style="margin-top:4px">${syncTagHTML(t)}</div>
                </div>
              </div>
              <div class="tx-meta">
                <div><span>Item</span><strong>${(t.items || []).length}</strong></div>
                <div><span>Diskon</span><strong>${money(t.discount)}</strong></div>
              </div>
            </article>
          `).join("")}
        </div>
      `}
    </section>
  `;

  $("#hFrom")?.addEventListener("change", (e) => { state.historyFilter.from = e.target.value; renderRiwayat(); });
  $("#hTo")?.addEventListener("change", (e) => { state.historyFilter.to = e.target.value; renderRiwayat(); });
  $("#hSearch")?.addEventListener("input", (e) => { state.historyFilter.search = e.target.value; renderRiwayat(); $("#hSearch")?.focus(); });
  $("#hReset")?.addEventListener("click", () => { state.historyFilter = { from: "", to: "", search: "" }; renderRiwayat(); });

  view.querySelectorAll("[data-detail]").forEach((el) => {
    const open = () => {
      const trx = db.transactions.find((t) => t.id === el.getAttribute("data-detail"));
      if (trx) showReceiptModal(trx);
    };
    el.addEventListener("click", open);
    el.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });
  });
}

function syncTagHTML(t) {
  if (t.synced) return `<span class="sync-tag ok">✓ Tersinkron</span>`;
  return `<span class="sync-tag pend">⟳ Pending</span>`;
}

/* ----------------------------- View: Dashboard --------------------------- */

function renderDashboard() {
  const today = todayKey();
  const monthKey = today.slice(0, 7);
  const txs = db.transactions;
  const todayTx = txs.filter((t) => isoDateKey(t.datetime || t.createdAt) === today);
  const monthTx = txs.filter((t) => (isoDateKey(t.datetime || t.createdAt) || "").startsWith(monthKey));

  const omzetToday = todayTx.reduce((s, t) => s + number(t.total), 0);
  const omzetMonth = monthTx.reduce((s, t) => s + number(t.total), 0);
  const avgMonth = monthTx.length ? omzetMonth / monthTx.length : 0;
  const payCount = {};
  monthTx.forEach((t) => { payCount[t.payment] = (payCount[t.payment] || 0) + 1; });
  const topPay = Object.entries(payCount).sort((a, b) => b[1] - a[1])[0];
  const last5 = txs.slice(0, 5);
  const pending = txs.filter((t) => !t.synced).length;

  view.innerHTML = `
    <section class="grid four">
      <div class="card metric"><span class="label">Transaksi hari ini</span><span class="value">${todayTx.length}</span><span class="hint">${money(omzetToday)} omzet</span></div>
      <div class="card metric good"><span class="label">Omzet bulan ini</span><span class="value">${money(omzetMonth)}</span><span class="hint">${monthTx.length} transaksi</span></div>
      <div class="card metric"><span class="label">Rata-rata transaksi</span><span class="value">${money(avgMonth)}</span><span class="hint">bulan ini</span></div>
      <div class="card metric"><span class="label">Metode terbanyak</span><span class="value" style="font-size:1.15rem">${topPay ? escapeHTML(topPay[0]) : "—"}</span><span class="hint">${topPay ? `${topPay[1]} transaksi` : "belum ada data"}</span></div>
    </section>

    <section class="card">
      <div class="card-header">
        <div>
          <h3>Status Sinkronisasi</h3>
          <p class="muted">${pending === 0 ? "Semua transaksi sudah dikirim ke Sheet." : `${pending} transaksi belum tersinkron.`}</p>
        </div>
        <button class="btn small ${pending > 0 ? "primary" : "ghost"}" type="button" id="dashSyncBtn" ${pending === 0 ? "disabled" : ""}>Sinkron Sekarang</button>
      </div>
    </section>

    <section class="card">
      <div class="card-header">
        <div>
          <h3>5 Transaksi Terakhir</h3>
        </div>
        <button class="btn small ghost" type="button" data-route="riwayat">Lihat semua</button>
      </div>
      ${last5.length === 0 ? `
        <div class="empty">
          <span class="emoji">📒</span>
          <strong>Belum ada transaksi</strong>
        </div>
      ` : `
        <div class="tx-card-list">
          ${last5.map((t) => `
            <article class="tx-card" data-detail="${t.id}" role="button" tabindex="0">
              <div class="tx-top">
                <div>
                  <div class="tx-title">${escapeHTML(fmtDateTime(t.datetime || t.createdAt))}</div>
                  <div class="muted">${t.customer ? escapeHTML(t.customer) : "Tanpa nama"} · ${escapeHTML(t.payment)} · ${(t.items || []).length} item</div>
                </div>
                <div style="text-align:right">
                  <div><strong>${money(t.total)}</strong></div>
                  <div style="margin-top:4px">${syncTagHTML(t)}</div>
                </div>
              </div>
            </article>
          `).join("")}
        </div>
      `}
    </section>
  `;

  $("#dashSyncBtn")?.addEventListener("click", syncPending);
  view.querySelectorAll("[data-detail]").forEach((el) => {
    el.addEventListener("click", () => {
      const trx = db.transactions.find((t) => t.id === el.getAttribute("data-detail"));
      if (trx) showReceiptModal(trx);
    });
  });
}

/* ----------------------------- View: Pengaturan -------------------------- */

function renderPengaturan() {
  const pending = db.transactions.filter((t) => !t.synced).length;
  view.innerHTML = `
    <section class="card">
      <div class="card-header">
        <div>
          <h3>Profil Toko</h3>
          <p class="muted">Tampil di bagian atas struk.</p>
        </div>
      </div>
      <form id="shopForm" class="form-grid" autocomplete="off">
        <div class="field">
          <label for="sName">Nama toko</label>
          <input id="sName" name="name" type="text" value="${escapeHTML(db.shop.name)}" />
        </div>
        <div class="field">
          <label for="sPhone">No telp</label>
          <input id="sPhone" name="phone" type="text" value="${escapeHTML(db.shop.phone)}" />
        </div>
        <div class="field full">
          <label for="sAddress">Alamat</label>
          <input id="sAddress" name="address" type="text" value="${escapeHTML(db.shop.address)}" />
        </div>
        <div class="form-actions field full">
          <button class="btn primary" type="submit">Simpan Profil</button>
        </div>
      </form>
    </section>

    <section class="card">
      <div class="card-header">
        <div>
          <h3>Sinkronisasi Google Sheets</h3>
          <p class="muted">Tempel URL Web App dari Apps Script. Lihat <a href="SETUP.md" target="_blank" rel="noopener">SETUP.md</a> untuk panduan.</p>
        </div>
      </div>
      <div class="form-grid">
        <div class="field full">
          <label for="urlInput">Apps Script Web App URL</label>
          <input id="urlInput" type="url" placeholder="https://script.google.com/macros/s/.../exec" value="${escapeHTML(db.appsScriptUrl)}" />
        </div>
        <div class="form-actions field full">
          <button class="btn primary" type="button" id="saveUrlBtn">Simpan URL</button>
          <button class="btn secondary" type="button" id="testConnBtn">Test Koneksi</button>
          <button class="btn ghost" type="button" id="manualSyncBtn">Sinkron Sekarang (${pending})</button>
        </div>
      </div>
    </section>

    <section class="card">
      <div class="card-header">
        <div>
          <h3>Backup & Reset</h3>
          <p class="muted">Export semua transaksi & produk lokal, atau reset semua data.</p>
        </div>
      </div>
      <div class="form-actions">
        <button class="btn secondary" type="button" id="exportJsonBtn">Export JSON</button>
        <button class="btn secondary" type="button" id="exportCsvBtn">Export CSV (Transaksi)</button>
        <button class="btn danger" type="button" id="resetBtn">Reset Semua Data</button>
      </div>
    </section>

    <section class="card">
      <div class="card-header">
        <div>
          <h3>Tentang</h3>
          <p class="muted">Kasir Sederhana · v1 · vanilla JS · offline-friendly.</p>
        </div>
      </div>
      <div class="kv-row"><span>Aplikasi lain</span><strong><a href="../">Buku Keuangan Digital ↗</a></strong></div>
      <div class="kv-row"><span>Penyimpanan</span><strong>localStorage (${STORAGE_KEY})</strong></div>
      <div class="kv-row"><span>Versi</span><strong>1.0.0</strong></div>
    </section>
  `;

  $("#shopForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const f = e.target;
    db.shop = {
      name: f.name.value.trim() || "Toko Saya",
      address: f.address.value.trim(),
      phone: f.phone.value.trim()
    };
    if (saveDB()) toast("Profil tersimpan");
  });

  $("#saveUrlBtn")?.addEventListener("click", () => {
    const v = ($("#urlInput")?.value || "").trim();
    db.appsScriptUrl = v;
    if (saveDB()) {
      try { localStorage.setItem(URL_KEY, v); } catch {}
      toast(v ? "URL tersimpan" : "URL dihapus");
      updateSyncPill();
    }
  });

  $("#testConnBtn")?.addEventListener("click", async () => {
    const v = ($("#urlInput")?.value || "").trim();
    if (v && v !== db.appsScriptUrl) { db.appsScriptUrl = v; saveDB(); }
    await pingScript();
  });

  $("#manualSyncBtn")?.addEventListener("click", syncPending);

  $("#exportJsonBtn")?.addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(db, null, 2)], { type: "application/json" });
    triggerDownload(blob, `kasir-backup-${todayKey()}.json`);
  });

  $("#exportCsvBtn")?.addEventListener("click", () => {
    const rows = [
      ["Waktu", "ID", "Customer", "Bayar", "Subtotal", "Diskon", "Total", "Tunai", "Kembalian", "Items", "Catatan", "Sync"]
    ];
    db.transactions.forEach((t) => {
      const items = (t.items || []).map((i) => `${i.name} x${i.qty} @${i.price}`).join(" | ");
      rows.push([
        fmtDateTime(t.datetime || t.createdAt),
        t.id,
        t.customer || "",
        t.payment || "",
        t.subtotal,
        t.discount,
        t.total,
        t.cashReceived || 0,
        t.change || 0,
        items,
        t.note || "",
        t.synced ? "synced" : "pending"
      ]);
    });
    const csv = rows.map((r) => r.map(csvCell).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    triggerDownload(blob, `kasir-transaksi-${todayKey()}.csv`);
  });

  $("#resetBtn")?.addEventListener("click", () => {
    const ans = prompt('Tindakan ini menghapus SEMUA data lokal (produk, transaksi, pengaturan). Ketik "RESET" untuk konfirmasi.');
    if (ans === "RESET") {
      try { localStorage.removeItem(STORAGE_KEY); } catch {}
      db = defaultDB();
      saveDB();
      toast("Semua data direset");
      renderRoute();
    }
  });
}

function csvCell(v) {
  const s = String(v ?? "");
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function triggerDownload(blob, name) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 100);
}

/* ----------------------------- Receipt Modal ----------------------------- */

function showReceiptModal(trx) {
  closeModal();
  const wrap = document.createElement("div");
  wrap.className = "modal-backdrop";
  wrap.id = "receiptModal";
  wrap.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true" aria-label="Struk Transaksi">
      <div class="modal-head">
        <h3>Struk Transaksi</h3>
        <button class="icon-btn" type="button" id="rcClose" aria-label="Tutup">✕</button>
      </div>
      <div class="modal-body">
        ${receiptHTML(trx)}
        <div class="muted" style="text-align:center;margin-top:10px;font-size:.82rem">
          ${trx.synced ? "Tersinkron ke Google Sheets ✓" : "Belum tersinkron — tersimpan lokal"}
        </div>
      </div>
      <div class="modal-foot">
        ${!trx.synced ? `<button class="btn ghost" type="button" id="rcSyncOne">Sinkron sekarang</button>` : ""}
        <button class="btn secondary" type="button" id="rcPrint">🖨 Cetak</button>
        <button class="btn primary" type="button" id="rcDone">Selesai</button>
      </div>
    </div>
  `;
  document.body.appendChild(wrap);
  wrap.addEventListener("click", (e) => { if (e.target === wrap) closeModal(); });
  $("#rcClose")?.addEventListener("click", closeModal);
  $("#rcDone")?.addEventListener("click", closeModal);
  $("#rcPrint")?.addEventListener("click", () => window.print());
  $("#rcSyncOne")?.addEventListener("click", async () => {
    if (!db.appsScriptUrl) { toast("URL Apps Script belum diisi", "error"); return; }
    if (!state.online) { toast("Sedang offline", "error"); return; }
    try {
      const ok = await pushTransaction(trx);
      if (ok) {
        const t = db.transactions.find((x) => x.id === trx.id);
        if (t) { t.synced = true; t.syncedAt = nowISO(); saveDB(); }
        toast("Tersinkron ✓");
        closeModal();
        renderRoute();
      } else {
        toast("Sinkron gagal", "error");
      }
    } catch (e) {
      toast(`Gagal: ${e.message || e}`, "error");
    }
  });
}

function closeModal() {
  document.getElementById("receiptModal")?.remove();
}

function receiptHTML(trx) {
  const shop = db.shop || {};
  const itemRows = (trx.items || []).map((it) => `
    <div class="rc-item">
      <div class="rc-line"><span>${escapeHTML(it.name)}</span><span></span></div>
      <div class="rc-line"><small>${it.qty} x ${money(it.price)}</small><small>${money(it.qty * it.price)}</small></div>
    </div>
  `).join("");
  return `
    <div class="receipt" id="receiptPrintable">
      <div class="rc-head">
        <strong>${escapeHTML(shop.name || "Toko Saya")}</strong>
        ${shop.address ? `<small>${escapeHTML(shop.address)}</small>` : ""}
        ${shop.phone ? `<small>${escapeHTML(shop.phone)}</small>` : ""}
      </div>
      <hr/>
      <div class="rc-line"><small>${escapeHTML(fmtDateTime(trx.datetime || trx.createdAt))}</small><small>#${escapeHTML(trx.id.slice(-6))}</small></div>
      ${trx.customer ? `<div class="rc-line"><small>Pelanggan</small><small>${escapeHTML(trx.customer)}</small></div>` : ""}
      <hr/>
      ${itemRows}
      <hr/>
      <div class="rc-line"><span>Subtotal</span><span>${money(trx.subtotal)}</span></div>
      <div class="rc-line"><span>Diskon</span><span>− ${money(trx.discount)}</span></div>
      <div class="rc-line bold"><span>TOTAL</span><span>${money(trx.total)}</span></div>
      <div class="rc-line"><span>Bayar</span><span>${escapeHTML(trx.payment)}</span></div>
      ${trx.payment === "Cash" ? `
        <div class="rc-line"><span>Tunai</span><span>${money(trx.cashReceived)}</span></div>
        <div class="rc-line"><span>Kembalian</span><span>${money(trx.change)}</span></div>
      ` : ""}
      ${trx.note ? `<hr/><div class="rc-line"><small>Catatan: ${escapeHTML(trx.note)}</small><small></small></div>` : ""}
      <hr/>
      <div class="rc-foot">
        <small>Terima kasih 🙏</small>
      </div>
    </div>
  `;
}

/* ----------------------------- Routing ---------------------------------- */

function navigate(route) {
  if (!navItems.find((n) => n.id === route)) return;
  state.route = route;
  if (typeof location !== "undefined") location.hash = route;
  renderRoute();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function bindGlobalEvents() {
  document.body.addEventListener("click", (e) => {
    const a = e.target.closest("[data-route]");
    if (a) {
      e.preventDefault();
      navigate(a.getAttribute("data-route"));
    }
  });
  window.addEventListener("hashchange", () => {
    const r = location.hash.replace("#", "") || "kasir";
    if (r !== state.route) { state.route = r; renderRoute(); }
  });
  window.addEventListener("online", () => {
    state.online = true;
    updateSyncPill();
    if (db.appsScriptUrl && db.transactions.some((t) => !t.synced)) {
      // best effort silent sync
      syncPending();
    }
  });
  window.addEventListener("offline", () => { state.online = false; updateSyncPill(); });

  $("#themeToggle")?.addEventListener("click", () => {
    const cur = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
    const next = cur === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try { localStorage.setItem(THEME_KEY, next); } catch {}
  });
}

function applyInitialTheme() {
  let theme = "light";
  try { theme = localStorage.getItem(THEME_KEY) || "light"; } catch {}
  if (theme === "dark") document.documentElement.setAttribute("data-theme", "dark");
}

/* ----------------------------- Init ------------------------------------- */

function init() {
  // backfill apps script url from legacy key (if present)
  try {
    const legacy = localStorage.getItem(URL_KEY);
    if (legacy && !db.appsScriptUrl) { db.appsScriptUrl = legacy; saveDB(); }
  } catch {}
  applyInitialTheme();
  bindGlobalEvents();
  renderRoute();
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
}

/* ----------------------------- Exports for tests ------------------------- */

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    defaultDB, escapeHTML, number, money, discountAmount: (sub, mode, val) => {
      const prev = state.discount; state.discount = { mode, value: val };
      const d = discountAmount(sub); state.discount = prev; return d;
    }
  };
}
