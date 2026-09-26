/* =========================================================
   RIO FURNITURES — shared UI
   header · footer · reveal · focus panel · order builder ·
   toast · send-to-RIO
   ========================================================= */
(function () {
  const C = RIO.CONTACT;
  const F = RIO.FINISHES;
  const page = document.body.dataset.page || "";
  RIO.qs = (k) => new URLSearchParams(location.search).get(k);
  RIO.esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ---------- Header ---------- */
  const NAV = [["spaces", "spaces.html", "Spaces"], ["furniture", "furniture.html", "Furniture"], ["projects", "projects.html", "Projects"], ["about", "about.html", "About"]];
  const header = document.getElementById("site-header");
  if (header) {
    header.className = "site-header";
    header.innerHTML = `
      <div class="wrap">
        <a href="index.html" class="logo" aria-label="RIO Furnitures — home"><span class="logo-mark">RIO<i>.</i></span><span class="logo-sub">Furnitures</span></a>
        <nav class="nav" aria-label="Main">
          ${NAV.map(([k, h, t]) => `<a class="nl ${page === k ? "active" : ""}" href="${h}" ${page === k ? 'aria-current="page"' : ""}>${t}</a>`).join("")}
          <a class="btn btn-sm" href="start.html"><span class="dot-o"></span> Start a project</a>
        </nav>
        <div class="header-right">
          <a class="proj-link" href="project.html" aria-label="My project"><span class="pl-t">My project</span><span class="qty" id="proj-count">0</span></a>
          <button class="menu-btn" aria-label="Open menu" aria-expanded="false"><span></span><span></span></button>
        </div>
      </div>`;
    const mb = header.querySelector(".menu-btn");
    mb.addEventListener("click", () => {
      const o = document.body.classList.toggle("menu-open");
      mb.setAttribute("aria-expanded", o); mb.setAttribute("aria-label", o ? "Close menu" : "Open menu");
    });
    let lastY = 0;
    window.addEventListener("scroll", () => {
      const y = window.scrollY;
      if (!document.body.classList.contains("menu-open")) {
        const h = y > 300 && y > lastY + 2;
        if (y < lastY - 2 || y < 300) header.classList.remove("hide"); else if (h) header.classList.add("hide");
        document.body.classList.toggle("nav-hidden", header.classList.contains("hide"));
      }
      lastY = y;
    }, { passive: true });
  }
  function updateCount(bump) {
    const el = document.getElementById("proj-count"); if (!el) return;
    const n = RIO.store.total(RIO.store.active());
    el.textContent = n > 999 ? "999+" : n;
    el.classList.toggle("has", n > 0);
    if (bump) { el.classList.remove("bump"); void el.offsetWidth; el.classList.add("bump"); }
  }
  updateCount();
  document.addEventListener("rio:projects", () => updateCount(true));

  /* ---------- Footer ---------- */
  const footer = document.getElementById("site-footer");
  if (footer) {
    footer.className = "site-footer";
    footer.innerHTML = `
      <div class="wrap">
        <div class="foot-top">
          <div>
            <p class="serif s-l" style="color:var(--paper);margin:0 0 28px">Make room for<br><em>something good.</em></p>
            <a class="btn btn-o" href="start.html">Start a project <span class="arr">→</span></a>
          </div>
          <div><h4>Showroom</h4><ul>
            <li><a href="spaces.html">Spaces</a></li><li><a href="furniture.html">Furniture</a></li>
            <li><a href="projects.html">Projects</a></li><li><a href="about.html">About</a></li>
            <li><a href="start.html?mode=custom">Custom furniture</a></li><li><a href="project.html">My project</a></li></ul></div>
          <div><h4>Talk to us</h4><ul>
            <li><a href="https://wa.me/${C.whatsapp}" target="_blank" rel="noopener">WhatsApp ${C.phoneDisplay}</a></li>
            <li><a href="tel:+${C.whatsapp}">Call ${C.phoneDisplay}</a></li>
            <li><a href="mailto:${C.email}">${C.email}</a></li></ul></div>
          <div><h4>Visit</h4><ul>
            <li>${C.location}</li><li>${C.hours}</li>
            <li><a href="${C.instagram}" target="_blank" rel="noopener">Instagram</a> · <a href="${C.tiktok}" target="_blank" rel="noopener">TikTok</a></li></ul></div>
        </div>
        <div class="foot-bottom">
          <span class="foot-word">RIO<i>.</i></span>
          <span class="mono">You build the space. We build what goes in it.</span>
          <span class="mono">© ${new Date().getFullYear()} RIO Furnitures · Nairobi</span>
        </div>
      </div>`;
  }

  /* ---------- Reveal ---------- */
  RIO.observeReveal = function (root) {
    const els = (root || document).querySelectorAll(".reveal:not(.in), .img-reveal:not(.in)");
    if (!("IntersectionObserver" in window)) { els.forEach((e) => e.classList.add("in")); return; }
    const io = new IntersectionObserver((en) => en.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.12, rootMargin: "0px 0px -5% 0px" });
    els.forEach((e) => io.observe(e));
  };

  RIO.animateNumber = function (el, to, dur, pad) {
    const from = parseInt(el.dataset.val || "0", 10) || 0;
    el.dataset.val = to;
    const fmt = (n) => (pad ? String(n).padStart(pad, "0") : n);
    if (from === to) { el.textContent = fmt(to); return; }
    const d = dur || 500, t0 = performance.now();
    cancelAnimationFrame(el._raf);
    const step = (t) => {
      const k = Math.min(1, (t - t0) / d), e = 1 - Math.pow(1 - k, 3);
      el.textContent = fmt(Math.round(from + (to - from) * e));
      if (k < 1) el._raf = requestAnimationFrame(step);
    };
    el._raf = requestAnimationFrame(step);
  };

  /* ---------- Toast ---------- */
  let toastEl, toastT;
  RIO.toast = function (html) {
    if (!toastEl) { toastEl = document.createElement("div"); toastEl.className = "toast"; toastEl.setAttribute("role", "status"); document.body.appendChild(toastEl); }
    toastEl.innerHTML = `<span class="dot-o"></span>${html}`;
    requestAnimationFrame(() => toastEl.classList.add("show"));
    clearTimeout(toastT); toastT = setTimeout(() => toastEl.classList.remove("show"), 4500);
  };

  /* ---------- Visual for a product (photo if provided, else drawing) ---------- */
  RIO.visual = function (p, finishId) {
    if (p.image) return `<img src="${p.image}" alt="${RIO.esc(p.name)}" style="width:100%;height:100%;object-fit:cover">`;
    return RIO.icon(p.icon, (F[finishId] || F[p.finishes[0]]).hex);
  };

  /* =========================================================
     ORDER BUILDER — one product, many finishes, one line
     RIO.builder(el, product, { onFinish(f), onAdded() })
     ========================================================= */
  RIO.builder = function (el, p, opts) {
    opts = opts || {};
    const qty = {}; p.finishes.forEach((f) => (qty[f] = 0));
    el.innerHTML = `
      <div class="order">
        <div class="order-head"><span class="title t-m">Build your order</span><span class="mono muted">Mix finishes · one order</span></div>
        ${p.finishes.map((f) => `
          <div class="o-row" data-f="${f}">
            <span class="sw" style="background:${F[f].hex}"></span>
            <span class="nm">${F[f].name}<small>QTY <span data-q>000</span></small></span>
            <span class="qty">
              <button type="button" data-step="-1" aria-label="Fewer ${F[f].name}">−</button>
              <input type="number" min="0" inputmode="numeric" value="0" aria-label="${F[f].name} quantity">
              <button type="button" data-step="1" aria-label="More ${F[f].name}">+</button>
            </span>
          </div>`).join("")}
        <div class="o-quick" aria-label="Quick add"><span class="mono muted" style="align-self:center">Add to</span>
          <select class="mono" data-quick-f style="border:0;background:transparent;font-size:11px">${p.finishes.map((f) => `<option value="${f}">${F[f].name}</option>`).join("")}</select>
          <button type="button" data-quick="10">+10</button><button type="button" data-quick="25">+25</button><button type="button" data-quick="50">+50</button>
        </div>
        <div class="o-total"><span class="mono muted">Total</span><span><span class="n" data-total>0</span> <span class="mono muted">units</span></span></div>
        <div class="o-bar" data-bar></div>
        <div class="o-mix" data-mix>Set a quantity for each finish you need.</div>
        <div class="o-tier" data-tier>${RIO.TIERS.map((t) => `<span>${t.name} ${t.range}</span>`).join("")}</div>
        <div class="o-add">
          <div class="target"><span class="mono muted">Add to</span><select data-target aria-label="Choose project"></select></div>
          <input class="field-line hide" data-newname placeholder="Name it — e.g. My Restaurant, Westlands" aria-label="New project name">
          <button type="button" class="btn btn-o" data-add disabled>Add to project <span class="arr">→</span></button>
          <p class="o-note">Priced on your exact quantities and finishes. Nothing is charged here.</p>
        </div>
      </div>`;
    const $ = (s) => el.querySelector(s);
    const total = () => Object.values(qty).reduce((a, b) => a + b, 0);
    function paint() {
      const t = total();
      RIO.animateNumber($("[data-total]"), t, 380);
      $("[data-total]").classList.toggle("has", t > 0);
      el.querySelectorAll(".o-row").forEach((r) => {
        const f = r.dataset.f, inp = r.querySelector("input");
        if (document.activeElement !== inp) inp.value = qty[f];
        r.querySelector("[data-q]").textContent = String(qty[f]).padStart(3, "0");
        r.classList.toggle("has", qty[f] > 0);
      });
      $("[data-bar]").innerHTML = t ? p.finishes.filter((f) => qty[f]).map((f) => `<span style="width:${(qty[f] / t) * 100}%;background:${F[f].hex}"></span>`).join("") : "";
      $("[data-mix]").textContent = t ? p.finishes.filter((f) => qty[f]).map((f) => `${F[f].name} ${qty[f]}`).join("  +  ") + "  =  " + t : "Set a quantity for each finish you need.";
      const ti = RIO.tierFor(t);
      el.querySelectorAll("[data-tier] span").forEach((s, i) => s.classList.toggle("on", t > 0 && i === ti));
      const add = $("[data-add]");
      add.disabled = !t;
      add.innerHTML = t ? `Add ${t} to project <span class="arr">→</span>` : `Add to project <span class="arr">→</span>`;
    }
    function set(f, n) { qty[f] = Math.max(0, Math.min(99999, parseInt(n, 10) || 0)); paint(); if (opts.onFinish) opts.onFinish(f); }
    el.addEventListener("click", (e) => {
      const st = e.target.closest("[data-step]");
      if (st) { const f = st.closest(".o-row").dataset.f; set(f, qty[f] + +st.dataset.step); }
      const qk = e.target.closest("[data-quick]");
      if (qk) { const f = $("[data-quick-f]").value; set(f, qty[f] + +qk.dataset.quick); }
    });
    el.addEventListener("input", (e) => { if (e.target.matches(".o-row input")) set(e.target.closest(".o-row").dataset.f, e.target.value); });
    el.addEventListener("focusin", (e) => { const r = e.target.closest(".o-row"); if (r && opts.onFinish) opts.onFinish(r.dataset.f); });

    const target = $("[data-target]"), nn = $("[data-newname]");
    function fill() {
      const all = RIO.store.all(), act = RIO.store.active();
      target.innerHTML = all.map((pr) => `<option value="${pr.id}" ${act && act.id === pr.id ? "selected" : ""}>${RIO.esc(pr.name)} — ${RIO.store.total(pr)} pcs</option>`).join("") + `<option value="__new" ${all.length ? "" : "selected"}>New project…</option>`;
      nn.classList.toggle("hide", target.value !== "__new");
    }
    target.addEventListener("change", () => { nn.classList.toggle("hide", target.value !== "__new"); if (target.value === "__new") nn.focus(); });
    fill();
    $("[data-add]").addEventListener("click", () => {
      const t = total(); if (!t) return;
      let pr;
      if (target.value === "__new") pr = RIO.store.create(nn.value.trim() || "My project", opts.space || (p.spaces.length === 1 ? p.spaces[0] : ""));
      else { pr = RIO.store.get(target.value); RIO.store.setActive(pr.id); }
      RIO.store.addItem(pr.id, p.id, qty);
      RIO.toast(`<span>${t} × ${RIO.shortName(p)} added to <b>${RIO.esc(pr.name)}</b></span><a href="project.html">View project →</a>`);
      p.finishes.forEach((f) => (qty[f] = 0)); nn.value = "";
      paint(); fill();
      if (opts.onAdded) opts.onAdded(pr);
    });
    paint();
    return { qty };
  };

  /* =========================================================
     FOCUS PANEL — the piece you clicked in a room
     ========================================================= */
  let focusEl, lastFocus;
  RIO.openFocus = function (pid, ctx) {
    const p = RIO.product(pid); if (!p) return;
    ctx = ctx || {};
    lastFocus = document.activeElement;
    if (!focusEl) {
      focusEl = document.createElement("div");
      focusEl.className = "focus";
      focusEl.innerHTML = `<div class="focus-bg" data-close></div><aside class="focus-panel" role="dialog" aria-modal="true" aria-label="Furniture details"></aside>`;
      document.body.appendChild(focusEl);
      focusEl.addEventListener("click", (e) => { if (e.target.closest("[data-close]")) RIO.closeFocus(); });
      document.addEventListener("keydown", (e) => { if (e.key === "Escape" && focusEl.classList.contains("open")) RIO.closeFocus(); });
    }
    const tbc = `<span class="tbc">confirmed with your quote</span>`;
    const panel = focusEl.querySelector(".focus-panel");
    let cur = p.finishes[0];
    panel.innerHTML = `
      <div class="focus-top"><span class="mono muted">${ctx.room ? "In the " + RIO.space(ctx.room).name.toLowerCase() : "Furniture"}</span><button class="focus-close" data-close aria-label="Close">×</button></div>
      <div class="focus-stage" data-stage>${RIO.visual(p, cur)}<span class="mono muted" data-fname>${F[cur].name}</span></div>
      <div class="focus-body">
        <span class="mono muted">${RIO.code(p)}</span>
        <h2 class="serif s-m">${RIO.shortName(p)}</h2>
        <p class="desc">${p.desc}</p>
        <div class="finishes" data-fins>${p.finishes.map((f) => `<button type="button" class="fin ${f === cur ? "on" : ""}" data-fin="${f}" aria-label="${F[f].name}"><span class="c" style="background:${F[f].hex}"></span><span class="mono">${F[f].name}</span></button>`).join("")}</div>
        <dl class="specs-q mt-m">
          <div><dt class="mono muted">Dimensions</dt><dd>${p.dims || tbc}</dd></div>
          <div><dt class="mono muted">Materials</dt><dd>${p.materials || tbc}</dd></div>
          <div><dt class="mono muted">Price</dt><dd>${p.price ? "From KES " + p.price.toLocaleString() : "Project quote"}</dd></div>
        </dl>
        <div class="mt-m" data-builder></div>
        <div class="focus-more"><a class="link" href="product.html?id=${p.id}">See the full piece <span class="arr">→</span></a></div>
      </div>`;
    const show = (f) => {
      if (f === cur) return; cur = f;
      if (!p.image) { const st = panel.querySelector("[data-stage] svg"); st.outerHTML = RIO.icon(p.icon, F[f].hex); }
      panel.querySelector("[data-fname]").textContent = F[f].name;
      panel.querySelectorAll("[data-fin]").forEach((b) => b.classList.toggle("on", b.dataset.fin === f));
      if (RIO.tintRooms) RIO.tintRooms(p.id, f);
    };
    panel.querySelector("[data-fins]").addEventListener("click", (e) => { const b = e.target.closest("[data-fin]"); if (b) show(b.dataset.fin); });
    RIO.builder(panel.querySelector("[data-builder]"), p, { onFinish: show, space: ctx.room });
    focusEl._pid = p.id;
    requestAnimationFrame(() => { focusEl.classList.add("open"); panel.scrollTop = 0; panel.querySelector(".focus-close").focus({ preventScroll: true }); });
    document.body.style.overflow = "hidden";
  };
  RIO.closeFocus = function () {
    if (!focusEl) return;
    focusEl.classList.remove("open");
    document.body.style.overflow = "";
    if (RIO.tintRooms && focusEl._pid) RIO.tintRooms(focusEl._pid, null);
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  };

  /* ---------- Project summary ---------- */
  RIO.projectSummary = function (p) {
    const L = ["RIO FURNITURES — PROJECT REQUEST", "Project: " + (p.name || "Untitled project")];
    if (p.space) L.push("Space: " + ((RIO.space(p.space) || {}).name || p.space));
    L.push("");
    p.items.forEach((it) => {
      const prod = RIO.product(it.pid); const t = RIO.store.lineTotal(it);
      if (!prod || !t) return;
      L.push(prod.name.toUpperCase() + " — " + t + " pcs");
      Object.keys(it.qty).forEach((f) => { if (it.qty[f] > 0) L.push("   " + (F[f] || { name: f }).name + " — " + it.qty[f]); });
    });
    L.push("", "TOTAL: " + RIO.store.total(p) + " pieces");
    if (p.notes) L.push("", "Notes: " + p.notes);
    if (p.files && p.files.length) L.push("", "Files I'll share: " + p.files.join(", "));
    const c = p.contact || {};
    if (c.name || c.phone || c.email || c.location) {
      L.push("");
      if (c.name) L.push("Name: " + c.name); if (c.phone) L.push("Phone: " + c.phone);
      if (c.email) L.push("Email: " + c.email); if (c.location) L.push("Location: " + c.location);
    }
    return L.join("\n");
  };

  /* ---------- Send to RIO (WhatsApp / email, static-site friendly) ---------- */
  RIO.openSend = function (text, subject, hasFiles) {
    let m = document.getElementById("send-modal");
    if (!m) { m = document.createElement("div"); m.id = "send-modal"; m.className = "modal"; m.setAttribute("role", "dialog"); m.setAttribute("aria-modal", "true"); document.body.appendChild(m); }
    const wa = "https://wa.me/" + C.whatsapp + "?text=" + encodeURIComponent(text);
    const mail = "mailto:" + C.email + "?subject=" + encodeURIComponent(subject || "Project request") + "&body=" + encodeURIComponent(text);
    m.innerHTML = `
      <div class="modal-bg" data-close></div>
      <div class="modal-card">
        <button class="modal-close" data-close aria-label="Close">×</button>
        <span class="mono muted">Send to RIO</span>
        <h2 class="serif s-m" style="margin:12px 0 8px">Your project is ready.</h2>
        <p class="muted" style="margin:0">Choose how to send it — everything below is filled in for you.</p>
        <div class="summary">${RIO.esc(text)}</div>
        ${hasFiles ? `<p class="small" style="margin:0 0 18px">Attach your drawings, photos or PDFs in the chat or email once it opens.</p>` : ""}
        <div class="row">
          <a class="btn btn-o" href="${wa}" target="_blank" rel="noopener">Send on WhatsApp <span class="arr">→</span></a>
          <a class="btn" href="${mail}">Send by email</a>
          <button class="link" data-copy>Copy</button>
        </div>
      </div>`;
    m.classList.add("open");
    m.querySelectorAll("[data-close]").forEach((b) => b.addEventListener("click", () => m.classList.remove("open")));
    m.querySelector("[data-copy]").addEventListener("click", (e) => { try { navigator.clipboard.writeText(text); e.target.textContent = "Copied"; } catch (x) {} });
    m.querySelector(".modal-close").focus();
    document.addEventListener("keydown", function esc(e) { if (e.key === "Escape") { m.classList.remove("open"); document.removeEventListener("keydown", esc); } });
  };

  /* ---------- A piece on a plinth (furniture lists) ---------- */
  RIO.piece = function (p, d) {
    return `
      <article class="piece reveal" data-d="${d || 0}" data-id="${p.id}">
        <a class="plinth" href="product.html?id=${p.id}" aria-label="${RIO.esc(p.name)}">${RIO.visual(p, p.finishes[0])}</a>
        <div class="piece-meta">
          <div><span class="mono muted">${RIO.code(p)}</span><h3 class="title t-m"><a href="product.html?id=${p.id}">${RIO.shortName(p)}</a></h3></div>
          <div class="dots">${p.finishes.map((f, k) => `<button type="button" class="${k ? "" : "on"}" data-f="${f}" style="background:${F[f].hex}" aria-label="Show in ${F[f].name}"></button>`).join("")}</div>
        </div>
      </article>`;
  };
  RIO.bindPieces = function (root) {
    const swap = (e) => {
      const b = e.target.closest(".dots button"); if (!b) return;
      const card = b.closest(".piece"), p = RIO.product(card.dataset.id);
      if (b.classList.contains("on") || p.image) return;
      card.querySelectorAll(".dots button").forEach((x) => x.classList.toggle("on", x === b));
      const svg = card.querySelector(".plinth svg"); svg.style.opacity = 0;
      setTimeout(() => { card.querySelector(".plinth svg").outerHTML = RIO.icon(p.icon, F[b.dataset.f].hex); }, 220);
    };
    root.addEventListener("mouseover", swap); root.addEventListener("click", swap);
  };

  /* ---------- Shared file drop helper ---------- */
  RIO.fileDrop = function (zone, input, onFiles) {
    input.addEventListener("change", (e) => onFiles(e.target.files));
    ["dragenter", "dragover"].forEach((ev) => zone.addEventListener(ev, (e) => { e.preventDefault(); zone.classList.add("drag"); }));
    ["dragleave", "drop"].forEach((ev) => zone.addEventListener(ev, (e) => { e.preventDefault(); zone.classList.remove("drag"); }));
    zone.addEventListener("drop", (e) => onFiles(e.dataTransfer.files));
  };

  document.addEventListener("DOMContentLoaded", () => RIO.observeReveal());
})();
