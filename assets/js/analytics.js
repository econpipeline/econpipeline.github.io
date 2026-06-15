/* ============================================================================
   Analytics + consent — Economics Pipeline
   ----------------------------------------------------------------------------
   Google Analytics 4 (Measurement ID G-NXG7TZLF6J), loaded ONLY after the
   visitor consents. GA is not requested at all until "Accept" is clicked, so
   no analytics cookies are set beforehand – this is what makes the POPIA
   banner meaningful rather than decorative.

   The choice is remembered in localStorage ("ga-consent" = granted | denied)
   and shared across all pages on the site, so the banner shows once.

   No build step, no dependencies – vanilla JS, in keeping with the repo.
   To revoke/test: run  localStorage.removeItem("ga-consent")  in the console.
   ========================================================================== */
(function () {
  "use strict";

  var GA_ID = "G-NXG7TZLF6J";
  var KEY = "ga-consent"; // "granted" | "denied"

  function read() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function store(value) {
    try { localStorage.setItem(KEY, value); } catch (e) { /* ignore */ }
  }

  function loadGA() {
    if (window.__gaLoaded) return;
    window.__gaLoaded = true;

    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_ID;
    document.head.appendChild(s);

    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag("js", new Date());
    gtag("config", GA_ID);
  }

  function removeBanner() {
    var el = document.getElementById("ga-consent-banner");
    if (el && el.parentNode) el.parentNode.removeChild(el);
  }

  function injectStyles() {
    if (document.getElementById("ga-consent-styles")) return;
    var css =
      "#ga-consent-banner{position:fixed;left:0;right:0;bottom:0;z-index:9999;" +
      "display:flex;flex-wrap:wrap;align-items:center;justify-content:center;" +
      "gap:.75rem 1.25rem;padding:1rem 1.25rem;" +
      "background:var(--maroon-deep,#481829);color:var(--paper,#faf8f5);" +
      "font-family:Raleway,system-ui,sans-serif;font-size:.9rem;line-height:1.5;" +
      "border-top:2px solid var(--gold,#caa258);" +
      "box-shadow:0 -2px 14px rgba(22,10,16,.3)}" +
      "#ga-consent-banner p{margin:0;max-width:52ch}" +
      "#ga-consent-banner .ga-actions{display:flex;gap:.6rem;align-items:center}" +
      "#ga-consent-banner button{font:inherit;cursor:pointer;border-radius:4px;" +
      "padding:.5rem 1.2rem;border:1px solid transparent;" +
      "transition:background .2s,border-color .2s}" +
      "#ga-consent-accept{background:var(--gold,#caa258);color:var(--ink,#160a10);" +
      "font-weight:600}" +
      "#ga-consent-accept:hover{background:var(--gold-soft,#dcc08a)}" +
      "#ga-consent-decline{background:transparent;color:var(--paper,#faf8f5);" +
      "border-color:rgba(250,248,245,.4)}" +
      "#ga-consent-decline:hover{border-color:var(--paper,#faf8f5)}" +
      "@media print{#ga-consent-banner{display:none!important}}";
    var style = document.createElement("style");
    style.id = "ga-consent-styles";
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);
  }

  function showBanner() {
    if (document.getElementById("ga-consent-banner")) return;
    injectStyles();

    var bar = document.createElement("div");
    bar.id = "ga-consent-banner";
    bar.setAttribute("role", "dialog");
    bar.setAttribute("aria-label", "Analytics consent");

    var msg = document.createElement("p");
    msg.textContent =
      "We use Google Analytics to understand how visitors use this site. " +
      "May we enable analytics cookies?";

    var actions = document.createElement("div");
    actions.className = "ga-actions";

    var accept = document.createElement("button");
    accept.id = "ga-consent-accept";
    accept.type = "button";
    accept.textContent = "Accept";
    accept.addEventListener("click", function () {
      store("granted");
      removeBanner();
      loadGA();
    });

    var decline = document.createElement("button");
    decline.id = "ga-consent-decline";
    decline.type = "button";
    decline.textContent = "Decline";
    decline.addEventListener("click", function () {
      store("denied");
      removeBanner();
    });

    actions.appendChild(accept);
    actions.appendChild(decline);
    bar.appendChild(msg);
    bar.appendChild(actions);
    document.body.appendChild(bar);
  }

  var choice = read();
  if (choice === "granted") { loadGA(); return; }
  if (choice === "denied") { return; }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", showBanner);
  } else {
    showBanner();
  }
})();
