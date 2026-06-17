// Dev-only test setup: provide a localStorage stub so the browser-oriented
// script.js can be required under Node without a DOM. NOT shipped with the PWA.
"use strict";

const STORAGE_KEY = "bukuKeuanganDigital:v1";

function makeLocalStorage(initial = {}) {
  const store = new Map(Object.entries(initial));
  return {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => { store.set(k, String(v)); },
    removeItem: (k) => { store.delete(k); },
    clear: () => store.clear(),
    _store: store
  };
}

// Install before requiring the module (top-level loadDB() reads localStorage).
global.localStorage = makeLocalStorage();

const api = require("../script.js");

module.exports = { api, STORAGE_KEY, makeLocalStorage };
