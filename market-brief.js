/* Esenef Market Brief — dashboard module.
   Fetches the static brief.json published daily (same origin, no key).
   Optional: set window.MARKET_BRIEF_PROXY_URL to a live proxy base URL
   (e.g. the InstaBox dashboard tunnel) as a fallback when brief.json
   is missing or stale. Never call api.aisa.one from here. */
(function () {
  var PROXY_URL = window.MARKET_BRIEF_PROXY_URL || null;
  var fmtIDR = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });
  var fmtUSD = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });
  var fmtNum = new Intl.NumberFormat("id-ID", { maximumFractionDigits: 2 });

  function pct(v) {
    if (v === null || v === undefined) return "";
    return (v >= 0 ? "+" : "") + fmtNum.format(v) + "%";
  }
  function setText(id, text) {
    var el = document.getElementById(id);
    if (el) el.textContent = text;
  }
  function render(b) {
    var d = new Date(b.generated_at_utc);
    setText("mb-date", "Data " + d.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" }));
    setText("mb-usd", "Rp " + fmtNum.format(b.usd_idr));
    setText("mb-usd-note", "XE mid-market" + (b.usd_idr_timestamp ? " · " + b.usd_idr_timestamp.slice(0, 10) : ""));
    setText("mb-gold", fmtIDR.format(b.gold_idr_per_gram));
    setText("mb-btc", fmtUSD.format(b.btc_usd));
    setText("mb-btc-change", "24 jam: " + pct(b.btc_change_24h_pct));
    setText("mb-spy", fmtUSD.format(b.spy_price));
    setText("mb-spy-change", "hari ini: " + pct(b.spy_day_change_pct));
    var news = (b.news && b.news[0]) || null;
    var link = document.getElementById("mb-news-link");
    if (link && news) {
      link.textContent = news.title;
      link.href = news.url || "#";
    }
    setText("mb-news-source", news && news.source ? "(" + news.source + ")" : "");
    setText("mb-summary", b.summary_id || "");
  }
  function fail(msg) {
    setText("mb-date", msg);
  }
  function load(url) {
    return fetch(url, { cache: "no-store" }).then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.json();
    });
  }
  load("brief.json").then(render).catch(function () {
    if (PROXY_URL) {
      load(PROXY_URL.replace(/\/$/, "") + "/brief").then(render).catch(function () {
        fail("Ringkasan pasar belum tersedia hari ini, coba lagi nanti.");
      });
    } else {
      fail("Ringkasan pasar belum tersedia hari ini, coba lagi nanti.");
    }
  });
})();
