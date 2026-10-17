(function () {
  "use strict";
  const P = window.PROFILE;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  // ---------- icons (inline SVG, stroke-based) ----------
  const svg = (d, extra = "") => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${extra}>${d}</svg>`;
  const ICONS = {
    arrow: svg('<path d="M5 12h14M13 5l7 7-7 7"/>'),
    download: svg('<path d="M12 3v12m0 0-5-5m5 5 5-5M5 21h14"/>'),
    send: svg('<path d="m22 2-7 20-4-9-9-4 20-7Z"/><path d="M22 2 11 13"/>'),
    code: svg('<path d="m16 18 6-6-6-6M8 6l-6 6 6 6"/>'),
    server: svg('<rect x="2" y="3" width="20" height="8" rx="2"/><rect x="2" y="13" width="20" height="8" rx="2"/><path d="M6 7h.01M6 17h.01"/>'),
    layout: svg('<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>'),
    database: svg('<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.7 4 3 9 3s9-1.3 9-3V5"/><path d="M3 12c0 1.7 4 3 9 3s9-1.3 9-3"/>'),
    zap: svg('<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8Z"/>'),
    cloud: svg('<path d="M17.5 19H9a7 7 0 1 1 6.7-9h1.8a4.5 4.5 0 1 1 0 9Z"/>'),
    globe: svg('<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20Z"/>'),
    tool: svg('<path d="M14.7 6.3a4 4 0 0 0 5 5L22 14l-8 8-2.3-2.3a4 4 0 0 0-5-5L2 10l8-8 2.3 2.3a4 4 0 0 0 2.4 2Z"/>'),
    rocket: svg('<path d="M4.5 16.5c-1.5 1.3-2 5-2 5s3.7-.5 5-2c.7-.8.7-2.1-.1-2.9a2.2 2.2 0 0 0-2.9-.1Z"/><path d="m12 15-3-3a22 22 0 0 1 2-4A12.9 12.9 0 0 1 22 2c0 2.7-.8 7.5-6 11a22 22 0 0 1-4 2Z"/><path d="M9 12H4s.6-3 2-4c1.6-1.1 5 0 5 0M12 15v5s3-.6 4-2c1.1-1.6 0-5 0-5"/>'),
    trophy: svg('<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.7V17c0 .6-.5 1-1 1.2-1.2.5-2 2-2 3.8M14 14.7V17c0 .6.5 1 1 1.2 1.2.5 2 2 2 3.8"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>'),
    cap: svg('<path d="M22 10 12 5 2 10l10 5 10-5Z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>'),
    mail: svg('<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>'),
    phone: svg('<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z"/>'),
    pin: svg('<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>'),
    copy: svg('<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>'),
    check: svg('<path d="M20 6 9 17l-5-5"/>'),
    sun: svg('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>'),
    moon: svg('<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>'),
    menu: svg('<path d="M4 6h16M4 12h16M4 18h16"/>'),
    close: svg('<path d="M18 6 6 18M6 6l12 12"/>'),
    spark: svg('<path d="M12 3l1.9 5.8L20 10.7l-5.6 2.3L12 19l-2.4-6L4 10.7l6.1-1.9L12 3Z"/><path d="M19 3v4M21 5h-4"/>'),
    star: svg('<path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1L12 2Z"/>'),
    fork: svg('<circle cx="6" cy="5" r="2"/><circle cx="18" cy="5" r="2"/><circle cx="12" cy="19" r="2"/><path d="M6 7v2a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V7M12 12v5"/>'),
    repo: svg('<path d="M4 19.5V4.5A2.5 2.5 0 0 1 6.5 2H20v16H6.5a2.5 2.5 0 0 0-2.5 2.5Zm0 0A2.5 2.5 0 0 0 6.5 22H20v-4"/>'),
    external: svg('<path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>'),
    github: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.4-4-1.4-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.2.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.3 4.7 18.3 5 18.3 5c.7 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.1 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .5Z"/></svg>',
    linkedin: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.4 20.5h-3.6v-5.6c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9v5.7H9.3V9h3.4v1.6c.5-.9 1.6-1.8 3.4-1.8 3.6 0 4.3 2.4 4.3 5.5v6.2ZM5.3 7.4a2.1 2.1 0 1 1 0-4.2 2.1 2.1 0 0 1 0 4.2ZM7.1 20.5H3.5V9h3.6v11.5ZM22.2 0H1.8C.8 0 0 .8 0 1.7v20.6c0 .9.8 1.7 1.8 1.7h20.4c1 0 1.8-.8 1.8-1.7V1.7C24 .8 23.2 0 22.2 0Z"/></svg>',
    leetcode: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 0a1.4 1.4 0 0 0-1 .4L7 6.3l-2.6 2.8a5.3 5.3 0 0 0-1.2 2c-.1.6-.2 1.2-.2 1.8 0 .6.1 1.2.3 1.8.2.6.4 1.1.8 1.6l.3.4 4.3 4.4c1.7 1.7 4.6 1.9 6.4.2l2.6-2.6a1.4 1.4 0 1 0-2-2l-2.6 2.6c-.7.7-2 .7-2.6 0l-4.3-4.4a2 2 0 0 1 0-2.7l4.3-4.6 4-4.3a1.4 1.4 0 0 0-1-2.3Zm-2.6 12.2a1.4 1.4 0 0 0 0 2.8h9.8a1.4 1.4 0 0 0 0-2.8h-9.8Z"/></svg>',
    whatsapp: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1l-.9 1.2c-.2.2-.3.2-.6.1a8.2 8.2 0 0 1-4-3.5c-.3-.5.3-.5.9-1.6.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6a1.1 1.1 0 0 0-.8.4 3.4 3.4 0 0 0-1 2.5c0 1.5 1 2.9 1.2 3.1.1.2 2.1 3.2 5.1 4.5 1.9.8 2.6.9 3.6.7.6-.1 1.8-.7 2-1.5.3-.7.3-1.3.2-1.5l-.8-.4ZM12 21.8a9.8 9.8 0 0 1-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4A9.8 9.8 0 1 1 12 21.8Zm8.4-18.3A11.8 11.8 0 0 0 1.7 17.7L0 24l6.4-1.7A11.8 11.8 0 0 0 24 12a11.7 11.7 0 0 0-3.6-8.5Z"/></svg>'
  };
  const icon = (n) => ICONS[n] || "";

  // ---------- helpers ----------
  function experienceText() {
    const start = new Date(P.careerStart);
    const now = new Date();
    const months = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
    return Math.floor(months / 12) + "+ years";
  }
  const socials = () => [
    { name: "GitHub", href: P.links.github, icon: "github" },
    { name: "LinkedIn", href: P.links.linkedin, icon: "linkedin" },
    { name: "LeetCode", href: P.links.leetcode, icon: "leetcode" },
    { name: "Email", href: "mailto:" + P.email, icon: "mail" },
    { name: "WhatsApp", href: "https://wa.me/" + P.phoneRaw.replace("+", ""), icon: "whatsapp" }
  ];
  const socialHtml = () => socials().map((s) => `<a class="social" href="${esc(s.href)}" ${s.href.startsWith("http") ? 'target="_blank" rel="noopener"' : ""} aria-label="${s.name}" title="${s.name}">${icon(s.icon)}</a>`).join("");

  // ---------- render ----------
  function render() {
    $$('[data-bind="name"]').forEach((el) => (el.textContent = P.name));
    $$('[data-bind="years"]').forEach((el) => (el.textContent = experienceText()));
    $$('[data-bind-href="resume"]').forEach((el) => el.setAttribute("href", P.resume));
    $$("[data-icon]").forEach((el) => (el.innerHTML = icon(el.dataset.icon)));
    $("#heroSocial").innerHTML = socialHtml();
    $("#footerSocial").innerHTML = socialHtml();
    $("#year").textContent = new Date().getFullYear();

    $("#stats").innerHTML = P.stats.map((s) => `
      <div class="stat reveal"><div class="stat-value" data-count="${s.value}" data-decimals="${s.decimals || 0}" data-prefix="${s.prefix || ""}" data-suffix="${s.suffix || ""}">${s.prefix || ""}0${s.suffix || ""}</div><div class="stat-label">${esc(s.label)}</div></div>`).join("");

    $("#summary").textContent = P.summary;
    $("#highlights").innerHTML = P.highlights.map((h) => `<li>${esc(h)}</li>`).join("");
    $("#domains").innerHTML = P.domains.map((d) => `<span class="chip">${esc(d)}</span>`).join("");
    $("#principles").innerHTML = P.principles.map((p) => `<div class="principle"><h4>${esc(p.title)}</h4><p>${esc(p.text)}</p></div>`).join("");

    $("#skillsGrid").innerHTML = P.skills.map((g) => `
      <div class="card skill-card reveal">
        <div class="skill-icon">${icon(g.icon)}</div>
        <h3>${esc(g.group)}</h3>
        <div class="tags">${g.items.map((i) => `<span class="tag">${esc(i)}</span>`).join("")}</div>
      </div>`).join("");

    // experience points contain trusted <b> markup from profile.js
    $("#timeline").innerHTML = P.experience.map((e) => `
      <article class="tl-item card reveal">
        <div class="tl-head">
          <div><h3>${esc(e.title)}</h3><div class="tl-company">${esc(e.company)}</div></div>
          <div class="tl-meta">${esc(e.period)}<br/>${esc(e.location)}</div>
        </div>
        <ul class="tl-points">${e.points.map((p) => `<li>${p}</li>`).join("")}</ul>
        <div class="tags">${e.stack.map((s) => `<span class="tag mono">${esc(s)}</span>`).join("")}</div>
      </article>`).join("");

    const catLabel = { backend: "Backend · Distributed", fullstack: "Full-Stack", integrations: "Integrations", freelance: "Freelance" };
    $("#projectsGrid").innerHTML = P.projects.map((p) => `
      <article class="card project reveal" data-cat="${p.category}">
        <span class="cat">${catLabel[p.category] || p.category}</span>
        <h3>${esc(p.title)}</h3>
        <p class="tagline">${esc(p.tagline)}</p>
        <ul>${p.points.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
        <div class="tags">${p.stack.map((s) => `<span class="tag mono">${esc(s)}</span>`).join("")}</div>
      </article>`).join("");

    $("#services").innerHTML = P.freelanceServices.map((s) => `
      <div class="card service reveal"><div class="s-icon">${icon(s.icon)}</div><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></div>`).join("");

    $("#awardsGrid").innerHTML = P.awards.map((a, i) => `
      <div class="card award reveal"><div class="trophy">${icon(i === 0 ? "trophy" : "cap")}</div>
      <div><h3>${esc(a.title)}</h3><div class="org">${esc(a.org)}</div><p>${esc(a.text)}</p></div></div>`).join("");
    $("#edu").className = "card edu reveal";
    $("#edu").innerHTML = `<div><h3>${esc(P.education.degree)}</h3><div class="muted">${esc(P.education.school)}</div></div><div class="score grad">${esc(P.education.score)}</div>`;

    // Primary channels: whole card is the link, copy button sits beside it (not nested inside the link).
    const primary = [
      { label: "Email me", value: P.email, href: "mailto:" + P.email, icon: "mail", copy: P.email, tone: "indigo" },
      { label: "Call or WhatsApp", value: P.phone, href: "tel:" + P.phoneRaw, icon: "phone", copy: P.phoneRaw, tone: "cyan" }
    ];
    const profiles = [
      { label: "LinkedIn", value: "Gautam Pandey", href: P.links.linkedin, icon: "linkedin", tone: "linkedin" },
      { label: "GitHub", value: "@" + P.github.user, href: P.links.github, icon: "github", tone: "github" },
      { label: "LeetCode", value: "Problem solving", href: P.links.leetcode, icon: "leetcode", tone: "leetcode" },
      { label: "WhatsApp", value: "Quick chat", href: "https://wa.me/" + P.phoneRaw.replace("+", ""), icon: "whatsapp", tone: "whatsapp" }
    ];
    $("#contactCards").innerHTML = `
      <div class="c-primary">${primary.map((c) => `
        <div class="c-card tone-${c.tone}">
          <a class="c-main" href="${esc(c.href)}">
            <span class="c-icon">${icon(c.icon)}</span>
            <span class="c-text"><small>${c.label}</small><strong>${esc(c.value).replace("@", "<wbr>@")}</strong></span>
          </a>
          <button type="button" class="icon-btn copy" data-copy="${esc(c.copy)}" aria-label="Copy ${c.label.toLowerCase()}" title="Copy">${icon("copy")}</button>
        </div>`).join("")}
      </div>
      <div class="c-profiles">${profiles.map((c) => `
        <a class="c-tile tone-${c.tone}" href="${esc(c.href)}" target="_blank" rel="noopener">
          <span class="c-icon">${icon(c.icon)}</span>
          <span class="c-text"><strong>${c.label}</strong><small>${esc(c.value)}</small></span>
          <span class="c-arrow">${icon("external")}</span>
        </a>`).join("")}
      </div>
      <div class="c-location">${icon("pin")}<span>${esc(P.location)}</span><span class="c-badge">Open to remote &amp; relocation</span></div>`;

    const fab = $("#whatsappFab");
    fab.href = "https://wa.me/" + P.phoneRaw.replace("+", "") + "?text=" + encodeURIComponent("Hi Gautam, I saw your portfolio and would like to connect.");
    fab.innerHTML = icon("whatsapp");
  }

  // ---------- typed roles ----------
  function typed() {
    const el = $("#typed");
    const words = P.rotatingRoles;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { el.textContent = words[0]; return; }
    let w = 0, i = 0, del = false;
    (function tick() {
      const word = words[w];
      el.textContent = word.slice(0, i);
      if (!del && i === word.length) { del = true; return setTimeout(tick, 1800); }
      if (del && i === 0) { del = false; w = (w + 1) % words.length; }
      i += del ? -1 : 1;
      setTimeout(tick, del ? 35 : 70);
    })();
  }

  // ---------- terminal ----------
  function terminal() {
    const lines = [
      ['<span class="p">$</span> whoami', 0],
      ['<span class="s">gautam_pandey</span> <span class="c"># SDE · backend · full-stack · AI</span>', 1],
      ['<span class="p">$</span> cat stack.json', 0],
      ['{', 1],
      ['  <span class="k">"lang"</span>: [<span class="s">"Java"</span>, <span class="s">"Python"</span>, <span class="s">"Go"</span>, <span class="s">"JS/TS"</span>],', 1],
      ['  <span class="k">"backend"</span>: [<span class="s">"Spring Boot"</span>, <span class="s">"Django"</span>, <span class="s">"Node"</span>],', 1],
      ['  <span class="k">"data"</span>: [<span class="s">"Postgres"</span>, <span class="s">"MySQL"</span>, <span class="s">"Mongo"</span>, <span class="s">"Redis"</span>],', 1],
      ['  <span class="k">"async"</span>: [<span class="s">"Kafka"</span>, <span class="s">"SQS"</span>],', 1],
      ['  <span class="k">"infra"</span>: [<span class="s">"AWS"</span>, <span class="s">"Docker"</span>, <span class="s">"CI/CD"</span>]', 1],
      ['}', 1],
      ['<span class="p">$</span> ./impact --summary', 0],
      ['✔ <span class="n">10k+</span> req/day · <span class="n">$1.5M+</span> volume', 1],
      ['✔ latency <span class="n">-45%</span> · onboarding <span class="n">-80%</span>', 1],
      ['✔ <span class="n">Rising Star Award</span> 🏆', 1],
      ['<span class="p">$</span> <span class="s">open_to</span> --role <span class="n">"SDE"</span> --stack <span class="n">"Java|Python|AI"</span>', 0]
    ];
    const el = $("#terminal");
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { el.innerHTML = lines.map((l) => l[0]).join("\n"); return; }
    let n = 0;
    (function next() {
      if (n >= lines.length) return;
      el.innerHTML += (n ? "\n" : "") + lines[n][0];
      n++;
      setTimeout(next, lines[n - 1][1] ? 110 : 420);
    })();
  }

  // ---------- counters ----------
  function animateCount(el) {
    const target = parseFloat(el.dataset.count), dec = +el.dataset.decimals, pre = el.dataset.prefix, suf = el.dataset.suffix;
    const t0 = performance.now(), dur = 1400;
    (function step(t) {
      const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      el.textContent = pre + (target * e).toLocaleString("en-US", { minimumFractionDigits: dec, maximumFractionDigits: dec }) + suf;
      if (k < 1) requestAnimationFrame(step);
    })(t0);
  }

  // ---------- interactions ----------
  function interactions() {
    const show = (el) => {
      if (el.classList.contains("in")) return;
      el.classList.add("in");
      $$("[data-count]", el).forEach(animateCount);
      io.unobserve(el);
    };
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => en.isIntersecting && show(en.target));
    }, { threshold: 0.12 });
    $$(".reveal").forEach((el, i) => { el.style.transitionDelay = (i % 4) * 60 + "ms"; io.observe(el); });
    // Jumps (nav links, fast scrolls) can skip past elements without them ever intersecting.
    const revealPassed = () => $$(".reveal:not(.in)").forEach((el) => { if (el.getBoundingClientRect().top < innerHeight * 0.9) show(el); });

    const nav = $("#nav");
    const links = $$(".nav-links a");
    const sections = links.map((a) => $(a.getAttribute("href")));
    addEventListener("scroll", () => {
      nav.classList.toggle("scrolled", scrollY > 10);
      revealPassed();
      let cur = null;
      sections.forEach((s, i) => { if (s && s.getBoundingClientRect().top < 140) cur = i; });
      links.forEach((a, i) => a.classList.toggle("active", i === cur));
    }, { passive: true });

    const menuBtn = $("#menuBtn"), navLinks = $("#navLinks");
    const setMenu = (open) => { navLinks.classList.toggle("open", open); menuBtn.setAttribute("aria-expanded", open); menuBtn.innerHTML = icon(open ? "close" : "menu"); };
    setMenu(false);
    menuBtn.addEventListener("click", () => setMenu(!navLinks.classList.contains("open")));
    links.forEach((a) => a.addEventListener("click", () => setMenu(false)));

    const themeBtn = $("#themeToggle");
    const applyTheme = (t) => { document.documentElement.dataset.theme = t; themeBtn.innerHTML = icon(t === "light" ? "moon" : "sun"); };
    let saved = null;
    try { saved = localStorage.getItem("theme"); } catch (e) {}
    applyTheme(saved || (matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark"));
    themeBtn.addEventListener("click", () => {
      const t = document.documentElement.dataset.theme === "light" ? "dark" : "light";
      applyTheme(t);
      try { localStorage.setItem("theme", t); } catch (e) {}
    });

    $("#filters").addEventListener("click", (e) => {
      const b = e.target.closest(".filter");
      if (!b) return;
      $$(".filter").forEach((x) => x.classList.toggle("active", x === b));
      const f = b.dataset.filter;
      $$(".project").forEach((p) => p.classList.toggle("hidden", f !== "all" && p.dataset.cat !== f));
      $("#reposBlock").classList.toggle("hidden", f !== "all" && f !== "personal");
      revealPassed();
    });

    document.addEventListener("click", async (e) => {
      const b = e.target.closest("[data-copy]");
      if (!b) return;
      e.preventDefault();
      try { await navigator.clipboard.writeText(b.dataset.copy); b.innerHTML = icon("check"); setTimeout(() => (b.innerHTML = icon("copy")), 1500); } catch (err) {}
    });
  }

  // ---------- personal projects (live from GitHub) ----------
  const LANG_COLORS = { JavaScript: "#f1e05a", TypeScript: "#3178c6", Python: "#3572A5", Java: "#b07219", Go: "#00ADD8", "C++": "#f34b7d", C: "#555555", HTML: "#e34c26", CSS: "#563d7c", PHP: "#4F5D95", Shell: "#89e051", Kotlin: "#A97BFF", Dart: "#00B4AB", Jupyter: "#DA5B0B" };
  const prettyName = (n) => n.replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim().replace(/\b\w/g, (c) => c.toUpperCase());
  function timeAgo(iso) {
    const d = (Date.now() - new Date(iso)) / 86400000;
    if (d < 1) return "today";
    if (d < 30) return Math.floor(d) + "d ago";
    if (d < 365) return Math.floor(d / 30) + "mo ago";
    return Math.floor(d / 365) + "y ago";
  }

  async function fetchRepos() {
    const cfg = P.github;
    const key = "repos:" + cfg.user;
    try {
      const c = JSON.parse(sessionStorage.getItem(key) || "null");
      if (c && Date.now() - c.t < 10 * 60 * 1000) return c.repos;
    } catch (e) {}
    let repos;
    try {
      // Our backend proxies and caches GitHub so visitors don't hit GitHub's rate limit.
      const r = await fetch("api/github-repos");
      if (!r.ok) throw new Error();
      repos = await r.json();
    } catch (e) {
      const r = await fetch(`https://api.github.com/users/${encodeURIComponent(cfg.user)}/repos?per_page=100&sort=pushed`);
      if (!r.ok) throw new Error("GitHub " + r.status);
      repos = (await r.json()).map((x) => ({ name: x.name, description: x.description, url: x.html_url, homepage: x.homepage, language: x.language, stars: x.stargazers_count, forks: x.forks_count, fork: x.fork, archived: x.archived, topics: x.topics || [], pushedAt: x.pushed_at }));
    }
    try { sessionStorage.setItem(key, JSON.stringify({ t: Date.now(), repos })); } catch (e) {}
    return repos;
  }

  async function loadRepos() {
    const cfg = P.github, grid = $("#reposGrid");
    $("#githubAll").href = `https://github.com/${cfg.user}?tab=repositories`;
    grid.innerHTML = '<div class="card repo skeleton"></div>'.repeat(3);
    try {
      const hide = new Set((cfg.hide || []).map((n) => n.toLowerCase()));
      const repos = (await fetchRepos())
        .filter((r) => (cfg.showForks || !r.fork) && !hide.has(r.name.toLowerCase()))
        .sort((a, b) => new Date(b.pushedAt) - new Date(a.pushedAt)); // most recently updated first
      $("#repoCount").textContent = repos.length || "";
      if (!repos.length) { grid.innerHTML = `<div class="repos-msg">New projects are on the way. <a href="${esc(P.links.github)}" target="_blank" rel="noopener">Follow on GitHub</a></div>`; return; }
      const limit = cfg.initialCount || 5;
      grid.innerHTML = repos.map((r, i) => {
        const live = r.homepage && /^https?:\/\//.test(r.homepage) ? `<a href="${esc(r.homepage)}" target="_blank" rel="noopener">${icon("external")} Live</a>` : "";
        const lang = r.language ? `<span><i class="lang-dot" style="background:${LANG_COLORS[r.language] || "#8b949e"}"></i>${esc(r.language)}</span>` : "";
        const stars = r.stars ? `<span>${icon("star").replace("<svg", '<svg width="14" height="14"')}${r.stars}</span>` : "";
        return `<article class="card repo reveal in${i >= limit ? " extra" : ""}">
          <div class="repo-top">${icon("repo")}<h4>${esc(prettyName(r.name))}</h4></div>
          <p class="${r.description ? "" : "empty"}">${esc(r.description || "Source code and details on GitHub.")}</p>
          <div class="repo-meta">${lang}${stars}<span>Updated ${timeAgo(r.pushedAt)}</span></div>
          <div class="repo-links"><a href="${esc(r.url)}" target="_blank" rel="noopener">${icon("github")} Code</a>${live}</div>
        </article>`;
      }).join("");

      const more = $("#reposMore");
      more.hidden = repos.length <= limit;
      const setExpanded = (open) => {
        grid.classList.toggle("expanded", open);
        more.setAttribute("aria-expanded", open);
        more.innerHTML = open ? `Show less ${icon("arrow")}` : `View all ${repos.length} projects ${icon("arrow")}`;
      };
      setExpanded(false);
      more.onclick = () => {
        const open = !grid.classList.contains("expanded");
        setExpanded(open);
        if (!open) $("#reposBlock").scrollIntoView({ block: "start" });
      };
    } catch (err) {
      grid.innerHTML = `<div class="repos-msg">Couldn't load projects right now. <a href="https://github.com/${esc(cfg.user)}?tab=repositories" target="_blank" rel="noopener">See them on GitHub</a></div>`;
    }
  }

  // ---------- contact form ----------
  function contactForm() {
    const form = $("#contactForm"), status = $("#formStatus"), btn = $("#sendBtn");
    const setStatus = (msg, cls) => { status.textContent = msg; status.className = "form-status " + (cls || ""); };
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form));
      let bad = false;
      $$("input[required], textarea[required]", form).forEach((el) => { const ok = el.checkValidity(); el.classList.toggle("invalid", !ok); if (!ok) bad = true; });
      if (bad) return setStatus("Please fill in your name, a valid email and a message (10+ characters).", "err");

      btn.disabled = true; setStatus("Sending…");
      try {
        const res = await fetch("api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
        const body = await res.json().catch(() => ({}));
        // Only our API returns { error }; anything else means no backend is running here.
        if (!res.ok) throw Object.assign(new Error(body.error || "No backend"), { server: Boolean(body.error) });
        form.reset();
        setStatus("Thanks! Your message reached me. I'll get back to you within 24 hours.", "ok");
      } catch (err) {
        if (err.server) { setStatus(err.message, "err"); }
        else {
          // Backend not reachable (e.g. static hosting): fall back to the visitor's mail client.
          const subject = `[Portfolio] ${data.topic} — ${data.name}${data.company ? " (" + data.company + ")" : ""}`;
          const body = `${data.message}\n\n— ${data.name}\n${data.email}`;
          location.href = `mailto:${P.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
          setStatus("Opening your email app. You can also email " + P.email + " directly.", "ok");
        }
      } finally { btn.disabled = false; }
    });
  }

  render();
  typed();
  terminal();
  interactions();
  contactForm();
  loadRepos();
})();
