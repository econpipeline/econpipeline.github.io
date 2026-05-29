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

  /* ---------- Count-up on data-count ---------- */
  function countUp(el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    if (isNaN(target) || reduce) { el.textContent = el.getAttribute("data-count"); return; }
    var dur = 900, start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(eased * target).toString();
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var counters = document.querySelectorAll("[data-count]");
  if (showAll) {
    counters.forEach(function (el) { el.textContent = el.getAttribute("data-count"); });
  } else if ("IntersectionObserver" in window && !reduce) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { countUp(e.target); cio.unobserve(e.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { cio.observe(el); });
  } else {
    counters.forEach(function (el) { el.textContent = el.getAttribute("data-count"); });
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
})();
