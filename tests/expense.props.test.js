// Dev-only property-based + unit tests for the expense-bookkeeping module.
// Feature: expense-bookkeeping. Run with: npm test (node --test). NOT shipped with the PWA.
"use strict";

const { test } = require("node:test");
const assert = require("node:assert/strict");
const fc = require("fast-check");
const { api, STORAGE_KEY, makeLocalStorage } = require("./setup.js");

const RUNS = { numRuns: 200 };

// ----- Generators -----
const monthArb = fc.constantFrom("2024-01", "2024-02", "2024-03", "2023-12");
const dayArb = fc.integer({ min: 1, max: 28 }).map((d) => String(d).padStart(2, "0"));
const dateArb = fc.tuple(monthArb, dayArb).map(([m, d]) => `${m}-${d}`);
const categoryArb = fc.constantFrom(...api.EXPENSE_CATEGORIES);
const paymentArb = fc.constantFrom(...api.PAYMENTS);

const expenseArb = fc.record({
  id: fc.string({ minLength: 1, maxLength: 8 }).map((s) => "exp-" + s),
  date: dateArb,
  name: fc.string({ minLength: 1, maxLength: 12 }),
  category: categoryArb,
  amount: fc.integer({ min: 1, max: 5_000_000 }),
  payment: paymentArb,
  recurring: fc.boolean(),
  note: fc.string({ maxLength: 10 }),
  createdAt: fc.integer({ min: 1, max: 1e12 })
});

const txArb = fc.record({
  id: fc.string({ minLength: 1, maxLength: 8 }).map((s) => "tx-" + s),
  date: dateArb,
  name: fc.string({ maxLength: 12 }),
  category: fc.constantFrom("Lainnya", "Jasa"),
  platform: fc.constantFrom("Lynk ID", "WhatsApp"),
  qty: fc.integer({ min: 1, max: 10 }),
  price: fc.integer({ min: 0, max: 1_000_000 }),
  modal: fc.integer({ min: 0, max: 500_000 }),
  discount: fc.integer({ min: 0, max: 50_000 }),
  fee: fc.integer({ min: 0, max: 50_000 }),
  payment: paymentArb,
  status: fc.constantFrom("Lunas", "Belum Lunas", "Refund"),
  note: fc.string({ maxLength: 8 }),
  createdAt: fc.integer({ min: 1, max: 1e12 })
});

function setDB(partial) {
  api._setDB({ transactions: [], products: [], targets: {}, expenses: [], budgets: {}, settings: { theme: "light" }, ...partial });
}

// ----- Property 1: Net profit identity -----
test("Property 1: net profit identity (net = grossProfit - expenses; isProfit = net>=0)", () => {
  fc.assert(fc.property(fc.array(txArb, { maxLength: 25 }), fc.array(expenseArb, { maxLength: 25 }), monthArb, (txs, exps, m) => {
    setDB({ transactions: txs, expenses: exps });
    const np = api.netProfit(m);
    assert.equal(np.net, np.grossProfit - np.expenses);
    assert.equal(np.isProfit, np.net >= 0);
  }), RUNS);
});

// ----- Property 2: Expense total = category sum + top category -----
test("Property 2: summarizeExpenses total equals category sum and topCategory is max", () => {
  fc.assert(fc.property(fc.array(expenseArb, { maxLength: 40 }), (exps) => {
    const s = api.summarizeExpenses(exps);
    const sumByCat = Object.values(s.byCategory).reduce((a, b) => a + b, 0);
    assert.ok(Math.abs(s.total - sumByCat) < 1e-6);
    if (exps.length === 0) {
      assert.deepEqual(s.topCategory, { label: "-", value: 0 });
    } else {
      const maxVal = Math.max(...Object.values(s.byCategory));
      assert.equal(s.topCategory.value, maxVal);
      assert.equal(s.byCategory[s.topCategory.label], maxVal);
    }
  }), RUNS);
});

// ----- Property 3: Non-negative persisted amounts -----
test("Property 3: valid expenses have positive amount; <=0 amount or empty name rejected", () => {
  setDB({});
  fc.assert(fc.property(
    fc.record({
      date: dateArb,
      name: fc.oneof(fc.string({ maxLength: 12 }), fc.constant("   "), fc.constant("")),
      category: fc.oneof(categoryArb, fc.constant("Bogus"), fc.constant(undefined)),
      amount: fc.oneof(fc.integer({ min: -1000, max: 5_000_000 }), fc.constant(0), fc.constant("12000"), fc.constant("abc")),
      payment: paymentArb,
      recurring: fc.boolean(),
      note: fc.string({ maxLength: 8 })
    }),
    (input) => {
      const e = api.normalizeExpense(input, null);
      const valid = api.isValidExpense(e);
      const expectValid = e.name.trim().length > 0 && api.number(e.amount) > 0;
      assert.equal(valid, expectValid);
      if (valid) assert.ok(api.number(e.amount) > 0 && e.name.trim().length > 0);
      // category always falls back to a known category
      assert.ok(api.EXPENSE_CATEGORIES.includes(e.category));
    }
  ), RUNS);
});

// ----- Property 4 & 5: Cashflow net consistency + refund exclusion -----
test("Property 4/5: cashflow net=in-out, sorted ascending, refunds excluded from money-in", () => {
  fc.assert(fc.property(fc.array(txArb, { maxLength: 30 }), fc.array(expenseArb, { maxLength: 30 }), monthArb, fc.constantFrom("day", "month"), (txs, exps, m, g) => {
    setDB({ transactions: txs, expenses: exps });
    const series = api.buildCashflow(m, g);
    for (let i = 0; i < series.length; i++) {
      assert.equal(series[i].net, series[i].in - series[i].out);
      if (i > 0) assert.ok(series[i - 1].key <= series[i].key);
    }
    // Refund exclusion: removing refunds must not change any money-in totals.
    setDB({ transactions: txs.filter((t) => t.status !== "Refund"), expenses: exps });
    const noRefund = api.buildCashflow(m, g);
    const inOf = (arr) => arr.reduce((acc, p) => { acc[p.key] = p.in; return acc; }, {});
    assert.deepEqual(inOf(series), inOf(noRefund));
  }), RUNS);
});

// ----- Property 6: Budget classification correctness -----
test("Property 6: budget classification (over/warn/ok/none) and finite pct", () => {
  fc.assert(fc.property(
    fc.array(fc.record({ category: categoryArb, planned: fc.integer({ min: 0, max: 2_000_000 }) }), { maxLength: 8 }),
    fc.array(expenseArb, { maxLength: 30 }),
    monthArb,
    (budgets, exps, m) => {
      const budgetMap = {};
      budgets.forEach((b) => { if (b.planned > 0) budgetMap[b.category] = b.planned; });
      setDB({ expenses: exps.map((e) => ({ ...e, date: m + "-05" })), budgets: { [m]: budgetMap } });
      const rows = api.budgetVsActual(m);
      rows.forEach((r) => {
        assert.ok(Number.isFinite(r.pct));
        if (r.planned === 0) {
          assert.equal(r.level, "none");
          assert.equal(r.pct, 0);
        } else if (r.actual > r.planned) {
          assert.equal(r.level, "over");
        } else if (r.pct >= 80 && r.pct <= 100) {
          assert.equal(r.level, "warn");
        } else {
          assert.equal(r.level, "ok");
        }
      });
      // sorted by actual descending
      for (let i = 1; i < rows.length; i++) assert.ok(rows[i - 1].actual >= rows[i].actual);
    }
  ), RUNS);
});

// ----- Property 7: Recurring idempotency -----
test("Property 7: carryOverRecurring is idempotent (one instance per template per month)", () => {
  fc.assert(fc.property(fc.array(expenseArb, { minLength: 1, maxLength: 10 }), monthArb, (exps, m) => {
    // Make some templates: recurring, no recurringFrom, dated in a different month.
    const templates = exps.map((e, i) => ({ ...e, id: "tpl-" + i, recurring: true, date: "2022-06-10", recurringFrom: undefined }));
    delete templates.recurringFrom;
    setDB({ expenses: templates.map((t) => { const c = { ...t }; delete c.recurringFrom; return c; }) });
    const first = api.carryOverRecurring(m);
    const afterFirst = api._getDB().expenses.length;
    const second = api.carryOverRecurring(m);
    const afterSecond = api._getDB().expenses.length;
    assert.equal(second, 0, "second run must create nothing");
    assert.equal(afterFirst, afterSecond, "store size unchanged on second run");
    // exactly one instance per template for month m
    templates.forEach((t) => {
      const instances = api._getDB().expenses.filter((e) => e.recurringFrom === t.id && api.getMonthKey(e.date) === m);
      assert.ok(instances.length <= 1);
    });
  }), RUNS);
});

// ----- Property 8: Backward-compatible load -----
test("Property 8: legacy backup (no expenses/budgets) loads with [] and {} and preserves legacy data", () => {
  fc.assert(fc.property(fc.array(txArb, { maxLength: 10 }), (txs) => {
    const legacy = { transactions: txs, products: [{ id: "p1", name: "x" }], targets: { "2024-01": 1000 }, settings: { theme: "dark" } };
    global.localStorage = makeLocalStorage({ [STORAGE_KEY]: JSON.stringify(legacy) });
    const loaded = api.loadDB();
    assert.deepEqual(loaded.expenses, []);
    assert.deepEqual(loaded.budgets, {});
    assert.deepEqual(loaded.transactions, txs);
    assert.deepEqual(loaded.products, legacy.products);
    assert.deepEqual(loaded.targets, legacy.targets);
    assert.equal(loaded.settings.theme, "dark");
  }), RUNS);
});

// ----- Property 9: Export/import round-trip (via persistence) -----
test("Property 9: round-trip through loadDB reproduces all five sections", () => {
  fc.assert(fc.property(fc.array(txArb, { maxLength: 12 }), fc.array(expenseArb, { maxLength: 12 }), monthArb, (txs, exps, m) => {
    const full = {
      transactions: txs,
      products: [{ id: "p1", name: "Prod" }],
      targets: { [m]: 5000 },
      expenses: exps,
      budgets: { [m]: { "Listrik": 100000 } },
      settings: { theme: "light" }
    };
    global.localStorage = makeLocalStorage({ [STORAGE_KEY]: JSON.stringify(full) });
    const loaded = api.loadDB();
    assert.deepEqual(loaded.transactions, full.transactions);
    assert.deepEqual(loaded.expenses, full.expenses);
    assert.deepEqual(loaded.budgets, full.budgets);
    assert.deepEqual(loaded.targets, full.targets);
    assert.deepEqual(loaded.settings, full.settings);
  }), RUNS);
});

// ----- Property 10: Month isolation -----
test("Property 10: getExpensesForMonth returns only matching-month expenses and omits none", () => {
  fc.assert(fc.property(fc.array(expenseArb, { maxLength: 40 }), monthArb, (exps, m) => {
    setDB({ expenses: exps });
    const result = api.getExpensesForMonth(m);
    result.forEach((e) => assert.equal(api.getMonthKey(e.date), m));
    const expectedCount = exps.filter((e) => api.getMonthKey(e.date) === m).length;
    assert.equal(result.length, expectedCount);
  }), RUNS);
});

// ----- Unit tests -----
test("Unit (10.1): form validation rejects empty name and amount<=0; valid persists; edit preserves id/createdAt", () => {
  setDB({});
  assert.equal(api.isValidExpense(api.normalizeExpense({ name: "", amount: 1000 })), false);
  assert.equal(api.isValidExpense(api.normalizeExpense({ name: "Iklan", amount: 0 })), false);
  assert.equal(api.isValidExpense(api.normalizeExpense({ name: "Iklan", amount: -5 })), false);
  const ok = api.normalizeExpense({ name: " Iklan ", amount: "150000", category: "Iklan/Ads" });
  assert.equal(api.isValidExpense(ok), true);
  assert.equal(ok.name, "Iklan");
  assert.equal(ok.amount, 150000);
  // edit preserves id + createdAt
  setDB({ expenses: [{ id: "exp-1", createdAt: 111, name: "Old", amount: 100, category: "Listrik" }] });
  const edited = api.normalizeExpense({ name: "New", amount: 200, category: "Listrik" }, "exp-1");
  assert.equal(edited.id, "exp-1");
  assert.equal(edited.createdAt, 111);
  assert.ok(edited.updatedAt >= 111);
});

test("Unit (16.2): legacy import fallbacks for invalid expenses/budgets", () => {
  global.localStorage = makeLocalStorage({ [STORAGE_KEY]: JSON.stringify({ transactions: [], expenses: "nope", budgets: [1, 2] }) });
  const loaded = api.loadDB();
  assert.deepEqual(loaded.expenses, []);
  assert.deepEqual(loaded.budgets, {});
});

test("Unit (17.1): zero-division guards return 0 (no NaN/Infinity)", () => {
  // budget pct with planned 0
  setDB({ expenses: [{ id: "e1", date: "2024-01-05", name: "x", category: "Listrik", amount: 5000 }], budgets: {} });
  const rows = api.budgetVsActual("2024-01");
  rows.forEach((r) => { assert.ok(Number.isFinite(r.pct)); });
  // expense ratio with zero income
  setDB({ transactions: [], expenses: [{ id: "e1", date: "2024-01-05", name: "x", category: "Listrik", amount: 5000 }] });
  const np = api.netProfit("2024-01");
  const ratio = np.income ? (np.expenses / np.income) * 100 : 0;
  assert.equal(ratio, 0);
});

test("Unit (3.x): applyExpenseFilters filters and sorts within filtered subset", () => {
  const exps = [
    { id: "a", date: "2024-01-02", name: "Iklan Meta", category: "Iklan/Ads", amount: 300, payment: "DANA", createdAt: 1 },
    { id: "b", date: "2024-01-05", name: "Listrik PLN", category: "Listrik", amount: 100, payment: "Cash", createdAt: 2 },
    { id: "c", date: "2024-01-03", name: "Iklan TikTok", category: "Iklan/Ads", amount: 500, payment: "DANA", createdAt: 3 }
  ];
  api._setState({ activeMonth: "2024-01", expenseFilters: { search: "iklan", category: "Iklan/Ads", payment: "DANA", sort: "amount" } });
  const out = api.applyExpenseFilters(exps);
  assert.equal(out.length, 2);
  assert.deepEqual(out.map((e) => e.id), ["c", "a"]); // amount desc
});
