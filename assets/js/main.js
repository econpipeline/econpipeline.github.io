/* =============================================================================
   The South African Economics Pipeline – interactions
   Vanilla JS, no dependencies. Respects prefers-reduced-motion.
   ========================================================================== */
(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  // Preview aid: ?allin reveals every section immediately (e.g. for screenshots or print).
  var showAll = window.location.search.indexOf("allin") !== -1;

  /* ---------- Scroll reveal ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if (showAll) {
    reveals.forEach(function (el) { el.classList.add("in"); });
  } else if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- Nav: solid on scroll + hide on scroll-down ---------- */
  var nav = document.getElementById("nav");
  function onScroll() {
    if (window.pageYOffset > 60) nav.classList.add("scrolled"); else nav.classList.remove("scrolled");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Active section highlight ---------- */
  var links = Array.prototype.slice.call(document.querySelectorAll(".nav__links a"));
  var sections = links.map(function (a) { return document.querySelector(a.getAttribute("href")); });
  if ("IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          var id = "#" + e.target.id;
          links.forEach(function (a) { a.classList.toggle("active", a.getAttribute("href") === id); });
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (s) { if (s) spy.observe(s); });
  }

  /* ---------- Mobile menu ---------- */
  var toggle = document.getElementById("navToggle");
  var menu = document.getElementById("menu");
  function setMenu(open) {
    menu.classList.toggle("open", open);
    menu.setAttribute("aria-hidden", String(!open));
    toggle.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
  }
  if (toggle) {
    toggle.addEventListener("click", function () { setMenu(!menu.classList.contains("open")); });
    menu.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });
  }

  /* ---------- Interactive roadmap ---------- */
  var rmButtons = Array.prototype.slice.call(document.querySelectorAll(".rm"));
  var details = document.querySelectorAll("#roadmapDetail p");
  function selectMilestone(i) {
    rmButtons.forEach(function (b) {
      var on = b.getAttribute("data-i") === String(i);
      b.classList.toggle("active", on);
      b.setAttribute("aria-expanded", String(on));
    });
    details.forEach(function (p) { p.classList.toggle("show", p.getAttribute("data-d") === String(i)); });
  }
  rmButtons.forEach(function (b) {
    b.addEventListener("click", function () { selectMilestone(b.getAttribute("data-i")); });
  });
  if (rmButtons.length) selectMilestone(0);

  /* ---------- Fund a bursary modal ---------- */
  var giveModal = document.getElementById("giveModal");
  if (giveModal && typeof giveModal.showModal === "function") {
    var nameInput = document.getElementById("giveName");
    var amountInput = document.getElementById("giveAmount");
    var refEl = document.getElementById("giveRef");
    var pledgeBtn = document.getElementById("givePledge");
    var printBtn = document.getElementById("givePrint");
    var ref18a = document.getElementById("give18a");
    var chips = Array.prototype.slice.call(document.querySelectorAll(".give-chip"));

    // Build "ECONPIPELINE <SURNAME>", capped at 20 chars for bank reference fields.
    function buildRef() {
      var name = (nameInput.value || "").trim();
      if (!name) return "ECONPIPELINE";
      var parts = name.split(/\s+/);
      var surname = parts[parts.length - 1].toUpperCase().replace(/[^A-Z]/g, "");
      if (!surname) return "ECONPIPELINE";
      return ("ECONPIPELINE " + surname).slice(0, 20).trim();
    }
    function cleanAmount() { return (amountInput.value || "").replace(/[^0-9]/g, ""); }
    function prettyAmount(a) { return a ? "R" + Number(a).toLocaleString("en-ZA") : ""; }

    function refresh() {
      var ref = buildRef();
      var amt = cleanAmount();
      refEl.textContent = ref;

      // Printable page link, personalised.
      var q = [];
      if (nameInput.value.trim()) q.push("name=" + encodeURIComponent(nameInput.value.trim()));
      if (amt) q.push("amt=" + encodeURIComponent(amt));
      printBtn.setAttribute("href", "give.html" + (q.length ? "?" + q.join("&") : ""));

      // Pre-filled pledge email to info@.
      var name = nameInput.value.trim() || "(your name)";
      var amtLine = amt ? prettyAmount(amt) : "(amount)";
      var lines = [
        "I would like to fund a bursary in The South African Economics Pipeline.",
        "",
        "Name: " + name,
        "Amount: " + amtLine,
        "Payment reference: " + ref,
        ref18a && ref18a.checked ? "I would like a Section 18A tax certificate." : "",
        "",
        "I will pay by electronic transfer to the Stellenbosch University account, quoting the reference above."
      ].filter(function (l) { return l !== null; });
      var subject = "Pipeline bursary pledge – " + name;
      pledgeBtn.setAttribute("href",
        "mailto:info@econpipeline.org?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(lines.join("\n")));
    }

    function openGive() { refresh(); giveModal.showModal(); }
    document.querySelectorAll("[data-give]").forEach(function (b) {
      b.addEventListener("click", function (e) { e.preventDefault(); openGive(); });
    });
    // Close on backdrop click (clicks on the dialog element itself, not its content).
    giveModal.addEventListener("click", function (e) { if (e.target === giveModal) giveModal.close(); });

    nameInput.addEventListener("input", refresh);
    amountInput.addEventListener("input", function () {
      chips.forEach(function (c) { c.classList.toggle("active", c.getAttribute("data-amount") === cleanAmount()); });
      refresh();
    });
    if (ref18a) ref18a.addEventListener("change", refresh);
    chips.forEach(function (c) {
      c.addEventListener("click", function () {
        amountInput.value = c.getAttribute("data-amount");
        chips.forEach(function (o) { o.classList.toggle("active", o === c); });
        refresh();
      });
    });

    /* ---------- Copy buttons ---------- */
    function flash(btn) {
      var prev = btn.textContent;
      btn.classList.add("copied"); btn.textContent = "Copied ✓";
      setTimeout(function () { btn.classList.remove("copied"); btn.textContent = prev; }, 1400);
    }
    function copyText(text, btn) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () { flash(btn); }).catch(function () { legacyCopy(text, btn); });
      } else { legacyCopy(text, btn); }
    }
    function legacyCopy(text, btn) {
      var ta = document.createElement("textarea");
      ta.value = text; ta.setAttribute("readonly", ""); ta.style.position = "absolute"; ta.style.left = "-9999px";
      document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); flash(btn); } catch (err) { /* no-op */ }
      document.body.removeChild(ta);
    }

    document.querySelectorAll(".give-bank__row .give-copy--mini").forEach(function (btn) {
      btn.addEventListener("click", function () { copyText(btn.parentNode.getAttribute("data-bank"), btn); });
    });
    var copyRefBtn = giveModal.querySelector("[data-copy-ref]");
    if (copyRefBtn) copyRefBtn.addEventListener("click", function () { copyText(refEl.textContent, copyRefBtn); });

    var copyAllBtn = giveModal.querySelector("[data-copy-all]");
    if (copyAllBtn) copyAllBtn.addEventListener("click", function () {
      var rows = Array.prototype.slice.call(document.querySelectorAll(".give-bank__row"));
      var block = rows.map(function (r) {
        return r.querySelector("dt").textContent + ": " + r.querySelector("dd").getAttribute("data-bank");
      });
      block.push("Reference: " + refEl.textContent);
      copyText(block.join("\n"), copyAllBtn);
    });
  }

  /* ---------- Film: click-to-load YouTube ----------
     Nothing is requested from YouTube until the visitor clicks play, so no
     third-party cookies are set on page load. The click is the consent, which
     keeps the POPIA banner (analytics.js) meaning what it says. */
  var filmFacade = document.querySelector(".film__facade");
  if (filmFacade) {
    filmFacade.addEventListener("click", function (e) {
      e.preventDefault();                 // the href is the no-JS fallback to YouTube
      var frame = document.createElement("iframe");
      frame.className = "film__frame";
      frame.title = "Why you should do a PhD in economics";
      frame.src = "https://www.youtube-nocookie.com/embed/" +
        filmFacade.getAttribute("data-yt") +
        "?autoplay=1&rel=0&modestbranding=1&playsinline=1";
      frame.setAttribute("allow",
        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share");
      frame.setAttribute("allowfullscreen", "");
      filmFacade.parentNode.replaceChild(frame, filmFacade);
      frame.focus();
      // No-op unless the visitor accepted analytics; analytics.js only then defines gtag.
      if (window.gtag) window.gtag("event", "film_play", { video_title: "Pipeline hero film" });
    });
  }

  /* ---------- Apply button: 2027 cohort closed; next intake opens July 2027 ----------
     The static HTML already shows the closed state; this keeps it in sync and
     strips any live href if the markup is ever restored. Update this block (and
     the CTA copy in index.html) when applications reopen in July 2027. */
  var applyBtn = document.getElementById("applyBtn");
  if (applyBtn && !showAll) {
    applyBtn.classList.add("btn--disabled");
    applyBtn.setAttribute("aria-disabled", "true");
    applyBtn.removeAttribute("href");
    applyBtn.textContent = "Applications closed";
  }
})();
