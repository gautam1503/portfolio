// Experience layer: synthesized sound effects, boot intro, achievements, command palette,
// easter eggs and small motion details. No audio files or libraries: everything is generated here.
(function () {
  "use strict";
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };

  // ======================================================================
  // 1. Sound engine (Web Audio synthesis)
  // ======================================================================
  let ctx = null, master = null;
  let muted = store.get("sfx-muted", false);
  function audio() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = 0.5;
      master.connect(ctx.destination);
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }
  function tone(freq, { at = 0, dur = 0.12, type = "sine", vol = 0.08, slide = 0 } = {}) {
    const a = audio(); if (!a) return;
    const t = a.currentTime + at;
    const o = a.createOscillator(), g = a.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(40, freq + slide), t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(master);
    o.start(t); o.stop(t + dur + 0.02);
  }
  function noise({ at = 0, dur = 0.25, vol = 0.05, from = 800, to = 3000 } = {}) {
    const a = audio(); if (!a) return;
    const t = a.currentTime + at;
    const buf = a.createBuffer(1, Math.floor(a.sampleRate * dur), a.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const src = a.createBufferSource(); src.buffer = buf;
    const f = a.createBiquadFilter(); f.type = "bandpass"; f.Q.value = 1.2;
    f.frequency.setValueAtTime(from, t); f.frequency.exponentialRampToValueAtTime(to, t + dur);
    const g = a.createGain();
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + dur * 0.3); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(f).connect(g).connect(master);
    src.start(t); src.stop(t + dur);
  }
  const SOUNDS = {
    click: () => tone(620, { dur: 0.06, type: "triangle", vol: 0.06, slide: 260 }),
    hover: () => tone(1500, { dur: 0.025, vol: 0.012 }),
    key: () => noise({ dur: 0.03, vol: 0.025, from: 2500, to: 4000 }),
    enter: () => { tone(520, { dur: 0.07, type: "square", vol: 0.025 }); tone(780, { at: 0.05, dur: 0.08, type: "square", vol: 0.02 }); },
    error: () => { tone(180, { dur: 0.14, type: "sawtooth", vol: 0.04 }); tone(140, { at: 0.08, dur: 0.16, type: "sawtooth", vol: 0.035 }); },
    // Day: bright rising arpeggio + shimmer. Night: falling notes + soft wind.
    day: () => { [523, 659, 784, 1047].forEach((f, i) => tone(f, { at: i * 0.055, dur: 0.22, type: "triangle", vol: 0.06 })); noise({ at: 0.05, dur: 0.35, vol: 0.02, from: 3000, to: 8000 }); },
    night: () => { [784, 622, 523, 392].forEach((f, i) => tone(f, { at: i * 0.07, dur: 0.3, type: "sine", vol: 0.07 })); noise({ dur: 0.6, vol: 0.03, from: 1200, to: 300 }); },
    whoosh: () => noise({ dur: 0.22, vol: 0.04, from: 400, to: 2400 }),
    success: () => [523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, { at: i * 0.07, dur: 0.35, type: "triangle", vol: 0.06 })),
    achievement: () => { [880, 1175, 1568].forEach((f, i) => tone(f, { at: i * 0.08, dur: 0.3, type: "square", vol: 0.025 })); tone(2093, { at: 0.26, dur: 0.5, vol: 0.04 }); },
    boot: () => { tone(110, { dur: 0.5, type: "sawtooth", vol: 0.03, slide: 330 }); tone(880, { at: 0.35, dur: 0.25, vol: 0.05 }); },
    fanfare: () => [392, 523, 659, 784, 659, 784, 1047].forEach((f, i) => tone(f, { at: i * 0.1, dur: 0.28, type: "square", vol: 0.035 }))
  };
  function sfx(name) { if (!muted && SOUNDS[name]) try { SOUNDS[name](); } catch (e) {} }
  function setMuted(m) {
    muted = m; store.set("sfx-muted", m);
    const b = $("#soundToggle");
    if (b) { b.innerHTML = m ? ICON.soundOff : ICON.soundOn; b.setAttribute("aria-pressed", String(!m)); b.title = m ? "Sound off" : "Sound on"; }
  }
  const ICON = {
    soundOn: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H2v6h4l5 4V5Z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14"/></svg>',
    soundOff: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H2v6h4l5 4V5Z"/><path d="m22 9-6 6M16 9l6 6"/></svg>'
  };

  // Global UI sounds: clicks on interactive elements, subtle ticks on hover (rate limited).
  function wireUiSounds() {
    document.addEventListener("click", (e) => {
      const el = e.target.closest("button, a, .filter");
      if (!el || el.matches("[data-sfx=none], #themeToggle, #soundToggle")) return;
      sfx(el.dataset.sfx || "click");
    }, true);
    let last = 0;
    document.addEventListener("mouseover", (e) => {
      const el = e.target.closest(".btn, .filter, .social, .c-tile, .c-card, .nav-links a, .icon-btn");
      if (!el || el === e.relatedTarget?.closest?.(".btn, .filter, .social, .c-tile, .c-card, .nav-links a, .icon-btn")) return;
      const now = performance.now();
      if (now - last > 70) { last = now; sfx("hover"); }
    });
  }

  // ======================================================================
  // 2. Toasts + achievements (hidden secrets to discover)
  // ======================================================================
  const ACHIEVEMENTS = {
    theme: { icon: "🌗", name: "Day & Night", hint: "Flip the theme" },
    sound: { icon: "🎧", name: "Sound Check", hint: "Play with the sound toggle" },
    terminal: { icon: "💻", name: "Hacker", hint: "Run a command in the terminal" },
    palette: { icon: "⌘", name: "Power User", hint: "Open the command palette (Ctrl/⌘ + K)" },
    explorer: { icon: "🧭", name: "Explorer", hint: "Visit every section" },
    github: { icon: "🐙", name: "Open Source Fan", hint: "Browse the personal projects" },
    resume: { icon: "📄", name: "Due Diligence", hint: "Download the résumé" },
    curious: { icon: "🔍", name: "Curious Mind", hint: "Click the GP logo a few times" },
    sudo: { icon: "🛡️", name: "Root Access", hint: "Try sudo in the terminal" },
    konami: { icon: "🎮", name: "Cheat Code", hint: "↑ ↑ ↓ ↓ ← → ← → B A" },
    contact: { icon: "🤝", name: "Let's Talk", hint: "Send a message" }
  };
  const unlocked = new Set(store.get("achievements", []));
  function toast(html, cls = "") {
    let box = $("#toasts");
    if (!box) { box = document.createElement("div"); box.id = "toasts"; box.setAttribute("aria-live", "polite"); document.body.appendChild(box); }
    const t = document.createElement("div");
    t.className = "toast " + cls;
    t.innerHTML = html;
    box.appendChild(t);
    setTimeout(() => t.classList.add("out"), 3600);
    setTimeout(() => t.remove(), 4100);
  }
  function unlock(id) {
    const a = ACHIEVEMENTS[id];
    if (!a || unlocked.has(id)) return;
    unlocked.add(id);
    store.set("achievements", [...unlocked]);
    sfx("achievement");
    toast(`<span class="t-icon">${a.icon}</span><div><small>Achievement unlocked · ${unlocked.size}/${Object.keys(ACHIEVEMENTS).length}</small><strong>${a.name}</strong></div>`, "achv");
    updateSecretsMeter();
    if (unlocked.size === Object.keys(ACHIEVEMENTS).length) setTimeout(() => { confetti(); toast('<span class="t-icon">👑</span><div><small>All secrets found</small><strong>You\'re thorough. That\'s exactly how I work too.</strong></div>', "achv"); }, 900);
  }
  function updateSecretsMeter() {
    const m = $("#secretsMeter");
    if (!m) return;
    const total = Object.keys(ACHIEVEMENTS).length;
    m.innerHTML = `<span>🔒 ${total} secrets are hidden on this site.</span> <b>Found ${unlocked.size}/${total}</b> <button type="button" class="link-btn" id="secretsHint">Need a hint?</button>`;
    $("#secretsHint").onclick = () => {
      const next = Object.entries(ACHIEVEMENTS).find(([k]) => !unlocked.has(k));
      toast(next ? `<span class="t-icon">💡</span><div><small>Hint</small><strong>${next[1].hint}</strong></div>` : '<span class="t-icon">✅</span><div><strong>Nothing left. You found everything!</strong></div>');
    };
  }

  // ======================================================================
  // 3. Confetti (Konami code, sudo, all secrets)
  // ======================================================================
  function confetti() {
    if (reduced) return;
    const c = document.createElement("canvas");
    c.className = "confetti";
    document.body.appendChild(c);
    const x = c.getContext("2d");
    const W = (c.width = innerWidth), H = (c.height = innerHeight);
    const colors = ["#818cf8", "#22d3ee", "#c084fc", "#34d399", "#fbbf24", "#f472b6"];
    const parts = Array.from({ length: 160 }, () => ({ x: W / 2 + (Math.random() - 0.5) * 200, y: H * 0.35, vx: (Math.random() - 0.5) * 16, vy: Math.random() * -14 - 4, r: Math.random() * 6 + 3, c: colors[(Math.random() * colors.length) | 0], a: Math.random() * 6, va: (Math.random() - 0.5) * 0.3 }));
    const t0 = performance.now();
    (function frame(t) {
      x.clearRect(0, 0, W, H);
      parts.forEach((p) => { p.vy += 0.35; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.a += p.va; x.save(); x.translate(p.x, p.y); x.rotate(p.a); x.fillStyle = p.c; x.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 0.6); x.restore(); });
      if (t - t0 < 3200) requestAnimationFrame(frame); else c.remove();
    })(t0);
  }

  // ======================================================================
  // 4. Boot intro (first visit per session, skippable)
  // ======================================================================
  function boot() {
    let seen = false;
    try { seen = sessionStorage.getItem("booted") === "1"; sessionStorage.setItem("booted", "1"); } catch (e) {}
    if (seen || reduced) return;
    const lines = [
      ["Initializing gautam.dev kernel", "v2.4"],
      ["Mounting /experience", "2+ yrs"],
      ["Starting kafka-consumer@impact", "10k req/day"],
      ["Warming redis cache", "hit 99%"],
      ["Loading modules java · python · go · ai", "ok"],
      ["Syncing github.com/gautam1503", "live"]
    ];
    const o = document.createElement("div");
    o.id = "boot";
    o.innerHTML = `<div class="boot-box"><pre id="bootLog"></pre><div class="boot-bar"><i></i></div><small>Press any key or click to skip</small></div>`;
    document.body.appendChild(o);
    document.documentElement.classList.add("booting");
    const log = $("#bootLog", o), bar = $(".boot-bar i", o);
    let i = 0, done = false;
    const finish = () => {
      if (done) return; done = true;
      o.classList.add("out");
      document.documentElement.classList.remove("booting");
      setTimeout(() => o.remove(), 600);
      removeEventListener("keydown", finish); o.removeEventListener("click", finish);
    };
    addEventListener("keydown", finish); o.addEventListener("click", finish);
    (function step() {
      if (done) return;
      if (i < lines.length) {
        const [l, r] = lines[i];
        log.innerHTML += `<span class="ok">[  OK  ]</span> ${l} <span class="dots">${".".repeat(Math.max(3, 40 - l.length))}</span> <span class="val">${r}</span>\n`;
        bar.style.width = ((i + 1) / (lines.length + 1)) * 100 + "%";
        i++;
        setTimeout(step, 190);
      } else {
        log.innerHTML += `\n<span class="ready">&gt; System ready. Welcome.</span>`;
        bar.style.width = "100%";
        setTimeout(finish, 650);
      }
    })();
  }

  // ======================================================================
  // 5. Text decrypt effect on section headings
  // ======================================================================
  function scramble(el) {
    if (reduced || el.dataset.scrambled || el.children.length) return;
    el.dataset.scrambled = "1";
    const final = el.textContent, chars = "!<>-_\\/[]{}—=+*^?#01";
    let frame = 0;
    const total = 22;
    (function tick() {
      el.textContent = final.split("").map((ch, i) => (ch === " " || i < (frame / total) * final.length ? ch : chars[(Math.random() * chars.length) | 0])).join("");
      if (++frame <= total) requestAnimationFrame(() => setTimeout(tick, 28)); else el.textContent = final;
    })();
  }
  function wireScramble() {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { scramble(e.target); io.unobserve(e.target); } }), { threshold: 0.6 });
    $$(".section-head h2").forEach((h) => io.observe(h));
  }

  // ======================================================================
  // 6. Cursor spotlight on cards + magnetic buttons + scroll progress
  // ======================================================================
  function wireMotion() {
    const bar = document.createElement("div");
    bar.id = "scrollProgress";
    document.body.appendChild(bar);
    const upd = () => { const h = document.documentElement.scrollHeight - innerHeight; bar.style.transform = `scaleX(${h > 0 ? scrollY / h : 0})`; };
    addEventListener("scroll", upd, { passive: true }); upd();

    if (!matchMedia("(hover: hover)").matches || reduced) return;
    document.addEventListener("pointermove", (e) => {
      const card = e.target.closest(".card, .c-card, .c-tile");
      if (card) { const r = card.getBoundingClientRect(); card.style.setProperty("--mx", e.clientX - r.left + "px"); card.style.setProperty("--my", e.clientY - r.top + "px"); }
    }, { passive: true });
    $$(".btn-primary, .hero-social .social").forEach((b) => {
      b.addEventListener("pointermove", (e) => { const r = b.getBoundingClientRect(); b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.18}px, ${(e.clientY - r.top - r.height / 2) * 0.3}px)`; });
      b.addEventListener("pointerleave", () => (b.style.transform = ""));
    });
  }

  // ======================================================================
  // 7. Command palette (Ctrl/⌘ + K)
  // ======================================================================
  let actions = [];
  function registerActions(list) { actions = list; }
  function palette() {
    if ($("#palette")) return closePalette();
    sfx("whoosh");
    unlock("palette");
    const o = document.createElement("div");
    o.id = "palette";
    o.innerHTML = `<div class="pal-box" role="dialog" aria-modal="true" aria-label="Command palette">
      <div class="pal-input"><span>⌘</span><input placeholder="Type a command or search…" aria-label="Search commands" /><kbd>esc</kbd></div>
      <ul class="pal-list" role="listbox"></ul>
      <div class="pal-foot"><span><kbd>↑</kbd><kbd>↓</kbd> navigate</span><span><kbd>↵</kbd> run</span><span>${unlocked.size}/${Object.keys(ACHIEVEMENTS).length} secrets found</span></div>
    </div>`;
    document.body.appendChild(o);
    const input = $("input", o), list = $(".pal-list", o);
    let sel = 0, shown = [];
    const render = () => {
      const q = input.value.toLowerCase().trim();
      shown = actions.filter((a) => !q || (a.label + " " + (a.keywords || "")).toLowerCase().includes(q));
      sel = Math.min(sel, Math.max(0, shown.length - 1));
      list.innerHTML = shown.length ? shown.map((a, i) => `<li role="option" class="${i === sel ? "sel" : ""}" data-i="${i}"><span class="pal-ic">${a.icon}</span>${a.label}<small>${a.group}</small></li>`).join("") : '<li class="empty">No matching command</li>';
      const s = $(".sel", list); if (s) s.scrollIntoView({ block: "nearest" });
    };
    const run = (i) => { const a = shown[i]; if (!a) return; closePalette(); sfx("enter"); setTimeout(a.run, 60); };
    input.addEventListener("input", () => { sel = 0; render(); sfx("key"); });
    input.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown") { sel = (sel + 1) % shown.length; render(); sfx("hover"); e.preventDefault(); }
      else if (e.key === "ArrowUp") { sel = (sel - 1 + shown.length) % shown.length; render(); sfx("hover"); e.preventDefault(); }
      else if (e.key === "Enter") run(sel);
      else if (e.key === "Escape") closePalette();
    });
    list.addEventListener("click", (e) => { const li = e.target.closest("[data-i]"); if (li) run(+li.dataset.i); });
    o.addEventListener("mousedown", (e) => { if (e.target === o) closePalette(); });
    render();
    requestAnimationFrame(() => { o.classList.add("in"); input.focus(); });
  }
  function closePalette() { const o = $("#palette"); if (!o) return; o.classList.remove("in"); setTimeout(() => o.remove(), 180); }

  // ======================================================================
  // 8. Easter eggs: Konami code, logo clicks, tab title, console greeting
  // ======================================================================
  function wireEasterEggs() {
    const code = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
    let pos = 0;
    addEventListener("keydown", (e) => {
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      pos = k === code[pos] ? pos + 1 : k === code[0] ? 1 : 0;
      if (pos === code.length) { pos = 0; hireMode(); unlock("konami"); }
      if ((e.ctrlKey || e.metaKey) && k === "k") { e.preventDefault(); palette(); }
      else if (k === "/" && !e.target.closest("input, textarea, [contenteditable]")) { e.preventDefault(); palette(); }
    });

    let clicks = 0, timer;
    const logo = $(".logo");
    logo?.addEventListener("click", () => {
      clicks++; clearTimeout(timer); timer = setTimeout(() => (clicks = 0), 1200);
      logo.classList.remove("spin"); void logo.offsetWidth; logo.classList.add("spin");
      if (clicks >= 4) { clicks = 0; unlock("curious"); toast('<span class="t-icon">🔍</span><div><small>Psst…</small><strong>Press Ctrl/⌘ + K, or type <code>help</code> in the terminal.</strong></div>'); }
    });

    const title = document.title;
    document.addEventListener("visibilitychange", () => { document.title = document.hidden ? "👀 Still here? The build is waiting…" : title; });

    console.log("%c GP %c Hey, fellow engineer 👋", "background:linear-gradient(90deg,#818cf8,#22d3ee);color:#fff;font-weight:700;padding:4px 8px;border-radius:6px", "font-weight:600;font-size:14px");
    console.log("%cYou opened DevTools on a portfolio, which tells me you're curious. I like that.\n\n• Stack: vanilla JS + Node/Express on Vercel serverless, zero build step\n• Try: Ctrl/⌘ + K, or type `help` in the hero terminal\n• Source: https://github.com/gautam1503/portfolio\n\nLet's talk: gautampandey961@gmail.com", "color:#9aa3b8;line-height:1.6");
  }
  function hireMode() {
    sfx("fanfare");
    confetti();
    toast('<span class="t-icon">🚀</span><div><small>Hire mode activated</small><strong>Great choice. Scroll down and say hi!</strong></div>', "achv");
  }

  // ======================================================================
  // 9. Live system status (real latency to this site's API)
  // ======================================================================
  async function liveStatus() {
    const box = $("#liveStatus");
    if (!box) return;
    const fmtUp = (s) => (s < 60 ? Math.round(s) + "s" : s < 3600 ? Math.round(s / 60) + "m" : Math.round(s / 3600) + "h");
    const run = async () => {
      const t0 = performance.now();
      let api = null;
      try { const r = await fetch("api/health", { cache: "no-store" }); if (r.ok) api = await r.json(); } catch (e) {}
      const ms = Math.round(performance.now() - t0);
      const repos = $("#repoCount")?.textContent || "–";
      const rows = [
        ["API latency", api ? `${ms} ms` : "offline", api ? (ms < 400 ? "ok" : "warn") : "down"],
        ["Serverless instance", api ? `warm · up ${fmtUp(api.uptime)}` : "static mode", api ? "ok" : "warn"],
        ["Email relay (SMTP)", api ? (api.mail ? "operational" : "fallback: mailto") : "fallback: mailto", api && api.mail ? "ok" : "warn"],
        ["GitHub sync", repos !== "–" ? `${repos} repos · 2 min cache` : "syncing…", repos !== "–" ? "ok" : "warn"]
      ];
      box.innerHTML = rows.map(([k, v, s]) => `<div class="st-row"><span class="st-dot ${s}"></span><span>${k}</span><b>${v}</b></div>`).join("");
      const all = rows.every((r) => r[2] === "ok");
      $("#statusHead").innerHTML = `<span class="st-dot ${all ? "ok" : "warn"}"></span>${all ? "All systems operational" : "Partially operational"}<small>checked ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}</small>`;
    };
    const io = new IntersectionObserver((es) => { if (es[0].isIntersecting) { run(); io.disconnect(); setInterval(() => !document.hidden && run(), 15000); } });
    io.observe(box);
    $("#statusRefresh")?.addEventListener("click", run);
  }

  // ======================================================================
  // 10. Local time in Delhi (contact section)
  // ======================================================================
  function localTime() {
    const el = $("#localTime");
    if (!el) return;
    const upd = () => {
      const now = new Date();
      const t = now.toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata", hour: "numeric", minute: "2-digit" });
      const h = +now.toLocaleString("en-US", { timeZone: "Asia/Kolkata", hour: "numeric", hour12: false });
      const awake = h >= 8 && h < 24;
      el.innerHTML = `<span class="st-dot ${awake ? "ok" : "sleep"}"></span>${t} in Delhi · ${awake ? "usually replies within a few hours" : "probably asleep, replies by morning"}`;
    };
    upd(); setInterval(upd, 30000);
  }

  // ======================================================================
  // 11. Explorer: track which sections were seen
  // ======================================================================
  function wireExplorer() {
    const ids = ["about", "skills", "experience", "projects", "freelance", "awards", "under-the-hood", "contact"];
    const seen = new Set();
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { seen.add(e.target.id); if (seen.size === ids.length) { unlock("explorer"); io.disconnect(); } } }), { threshold: 0.15 });
    ids.forEach((id) => { const s = document.getElementById(id); if (s) io.observe(s); });
  }

  // ---------- public API ----------
  window.FX = { sfx, toast, unlock, confetti, hireMode, palette, closePalette, registerActions, scramble, isMuted: () => muted, achievements: () => ({ list: ACHIEVEMENTS, unlocked }) };

  boot();
  document.addEventListener("DOMContentLoaded", () => {
    const sb = $("#soundToggle");
    setMuted(muted);
    sb?.addEventListener("click", () => { setMuted(!muted); if (!muted) sfx("enter"); unlock("sound"); });
    $("#paletteBtn")?.addEventListener("click", palette);
    wireUiSounds(); wireScramble(); wireMotion(); wireEasterEggs(); liveStatus(); localTime(); wireExplorer(); updateSecretsMeter();
  });
})();
