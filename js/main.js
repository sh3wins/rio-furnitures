/* =========================================================
   RIO FURNITURES — shared parts of every page
   header · footer · photos · furniture cards · order builder ·
   toast · send-to-RIO
   ========================================================= */
(function () {
  const C = RIO.CONTACT;
  const F = RIO.FINISHES;
  const page = document.body.dataset.page || "";
  RIO.qs = (k) => new URLSearchParams(location.search).get(k);
  RIO.esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const ARR = `<span class="arr" aria-hidden="true">→</span>`;
  RIO.kes = (n) => "KES " + Number(n).toLocaleString("en-KE");   // 45000 → KES 45,000
  RIO.ARR = ARR;

  /* ---------- Header ---------- */
  const NAV = [["spaces", "spaces.html", "Spaces"], ["furniture", "furniture.html", "Furniture"], ["projects", "projects.html", "Projects"], ["about", "about.html", "About"]];
  const header = document.getElementById("site-header");
  if (header) {
    header.className = "site-header";
    header.innerHTML = `
      <a class="skip" href="#main">Skip to content</a>
      <div class="wrap">
        <a href="index.html" class="logo" aria-label="RIO Furnitures — home">RIO</a>
        <nav class="nav" aria-label="Main">
          ${NAV.map(([k, h, t]) => `<a class="nl ${page === k ? "active" : ""}" href="${h}" ${page === k ? 'aria-current="page"' : ""}>${t}</a>`).join("")}
          <a class="btn nav-cta" href="start.html">Start a Project</a>
        </nav>
        <div class="header-right">
          <a class="proj-link" href="project.html"><span class="pl-t">My project</span><span class="qty" id="proj-count"></span></a>
          <button class="theme-btn" type="button">
            <svg class="i-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.2M12 19.3v2.2M4.6 4.6l1.6 1.6M17.8 17.8l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.6 19.4l1.6-1.6M17.8 6.2l1.6-1.6"/></svg>
            <svg class="i-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/></svg>
          </button>
          <a class="btn btn-sm" href="start.html">Start a Project</a>
          <button class="menu-btn" aria-label="Open menu" aria-expanded="false"><span></span><span></span></button>
        </div>
      </div>`;

    // Light / dark switch. Light is the default; the visitor's choice is remembered.
    const root = document.documentElement;
    if (!root.dataset.theme) root.dataset.theme = "light";
    const tb = header.querySelector(".theme-btn");
    const label = () => tb.setAttribute("aria-label", root.dataset.theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
    label();
    tb.addEventListener("click", () => {
      root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
      try { localStorage.setItem("rio-theme", root.dataset.theme); } catch (e) {}
      label();
    });

    const mb = header.querySelector(".menu-btn");
    mb.addEventListener("click", () => {
      const open = document.body.classList.toggle("menu-open");
      mb.setAttribute("aria-expanded", open); mb.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });

    // The header stays in place and gets slightly more compact once you scroll
    const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true }); onScroll();
  }
  function updateCount() {
    const el = document.getElementById("proj-count"); if (!el) return;
    const n = RIO.store.total(RIO.store.active());
    el.textContent = n > 999 ? "999+" : n || "";
    el.classList.toggle("has", n > 0);
    el.parentNode.setAttribute("aria-label", n ? `My project, ${n} pieces` : "My project");
  }
  updateCount();
  document.addEventListener("rio:projects", updateCount);

  /* ---------- Footer ---------- */
  const footer = document.getElementById("site-footer");
  if (footer) {
    footer.className = "site-footer";
    footer.innerHTML = `
      <div class="wrap">
        <div class="foot-top">
          <div class="foot-brand"><a href="index.html" class="foot-plate" aria-label="RIO Furnitures — home"><img src="images/logo/rio-logo-orange.svg" alt="RIO Furnitures, Nairobi" width="132" height="132" loading="lazy"></a><p>Furniture for real spaces.</p></div>
          <ul>
            <li><a href="spaces.html">Spaces</a></li><li><a href="furniture.html">Furniture</a></li>
            <li><a href="projects.html">Projects</a></li><li><a href="reviews.html">Reviews</a></li><li><a href="about.html">About</a></li>
            <li><a href="start.html">Start a project</a></li>
            <li><a href="visit.html">Schedule a site visit</a></li>
          </ul>
          <ul>
            <li><a href="https://wa.me/${C.whatsapp}" target="_blank" rel="noopener">WhatsApp ${C.phoneDisplay}</a></li>
            <li><a href="tel:+${C.whatsapp}">Call ${C.phoneDisplay}</a></li>
            <li><a href="mailto:${C.email}">${C.email}</a></li>
            <li>${C.location} · ${C.hours}</li>
            <li><a href="${C.instagram}" target="_blank" rel="noopener">Instagram</a> · <a href="${C.tiktok}" target="_blank" rel="noopener">TikTok</a></li>
          </ul>
        </div>
        <div class="foot-bottom meta">
          <span>© ${new Date().getFullYear()} RIO Furnitures, Nairobi</span>
          <span><a href="project.html">My project</a> · <a href="track.html">Track an order</a></span>
        </div>
      </div>`;
  }

  /* ---------- Gentle fade-in as content enters the screen ---------- */
  RIO.observeReveal = function (root) {
    const els = (root || document).querySelectorAll(".reveal:not(.in)");
    if (!("IntersectionObserver" in window)) { els.forEach((e) => e.classList.add("in")); return; }
    const io = new IntersectionObserver((en) => en.filter((e) => e.isIntersecting).forEach((e, i) => {
      const el = e.target;
      el.style.transitionDelay = Math.min(i, 5) * 90 + "ms";   // a short stagger across a row
      el.classList.add("in"); io.unobserve(el);
      setTimeout(() => { el.style.transitionDelay = ""; }, 1400);
    }), { threshold: 0.08 });
    els.forEach((e) => io.observe(e));
  };

  /* ---------- Photos ----------
     RIO.media(image, { ratio: "16 / 9", cls: "", eager: false })
     `image` is an entry from RIO.IMAGES ({ src, alt, pos }) or a plain path.
     The frame keeps its shape, so replacing a photo never moves the layout.
     If the file is missing, a quiet labelled placeholder is shown instead. */
  RIO.media = function (image, opts) {
    opts = opts || {};
    const im = typeof image === "string" ? { src: image, alt: opts.alt || "" } : (image || {});
    const ratio = opts.ratio ? ` style="--ar:${opts.ratio}"` : "";
    const label = RIO.esc(im.alt || opts.alt || "Photograph");
    if (!im.src) return `<div class="media is-empty ${opts.cls || ""}"${ratio} data-label="Photo to come: ${label}"></div>`;
    const light = im.small ? ` srcset="${im.small} 900w, ${im.src} 1600w" sizes="${opts.sizes || "(max-width: 760px) 100vw, 50vw"}"` : "";
    return `<div class="media ${opts.cls || ""}"${ratio} data-label="Photo to come: ${label}">
      <img src="${im.src}"${light} alt="${label}"${im.pos ? ` style="object-position:${im.pos}"` : ""} ${opts.eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async" onerror="this.parentNode.classList.add('is-empty')"></div>`;
  };
  /* A looping, silent clip with a still image behind it */
  RIO.clip = function (video, poster, alt, opts) {
    opts = opts || {};
    return `<div class="media ${opts.cls || ""}"${opts.ratio ? ` style="--ar:${opts.ratio}"` : ""}>
      <video src="${video}" poster="${poster}" autoplay muted loop playsinline preload="metadata" aria-label="${RIO.esc(alt)}"></video></div>`;
  };

  /* ---------- Workshop: material → build → finish → space (home and About) ---------- */
  RIO.workshopSteps = function (clips) {
    clips = clips || {};
    return RIO.WORKSHOP.map((w) => {
      const alt = "RIO workshop: " + w.name.toLowerCase();
      return `
      <figure class="reveal">
        ${clips[w.name] ? RIO.clip(clips[w.name], w.photo, alt) : RIO.media(w.photo, { alt })}
        <figcaption><span class="h-s">${w.name}</span><span class="meta">${w.text}</span></figcaption>
      </figure>`;
    }).join("");
  };

  /* ---------- Toast ---------- */
  let toastEl, toastT;
  RIO.toast = function (html) {
    if (!toastEl) { toastEl = document.createElement("div"); toastEl.className = "toast"; toastEl.setAttribute("role", "status"); document.body.appendChild(toastEl); }
    toastEl.innerHTML = html;
    requestAnimationFrame(() => toastEl.classList.add("show"));
    clearTimeout(toastT); toastT = setTimeout(() => toastEl.classList.remove("show"), 4500);
  };

  /* ---------- A product's picture: its photo if it has one, else its line drawing ---------- */
  RIO.visual = function (p, finishId, plain) {
    const c = !plain && p.crop;   // zoom in on the furniture where a crop is set
    if (p.image) return `<img src="${p.image}" alt="${RIO.esc(RIO.shortName(p))}" loading="lazy" decoding="async"${c ? ` class="crop" style="width:${c.w}%;left:${c.x}%;top:${c.y}%"` : ""}>`;
    return RIO.icon(p.icon, (F[finishId] || F[p.finishes[0]]).hex);
  };

  /* ---------- Furniture card ---------- */
  RIO.piece = function (p) {
    return `
      <a class="card reveal" href="product.html?id=${p.id}">
        <div class="media card-media ${p.image ? "" : "is-drawing"}">${RIO.visual(p, p.finishes[0])}</div>
        <div class="card-body">
          ${p.no ? `<span class="no">No. ${p.no}</span>` : ""}
          <h3 class="h-s">${RIO.esc(RIO.shortName(p))}</h3>
          <span class="meta">${RIO.esc(p.type || "")}</span>
          ${p.price ? `<span class="meta price">${RIO.kes(p.price)}</span>` : ""}
        </div>
      </a>`;
  };

  /* =========================================================
     ORDER BUILDER — how many, in which colours, into which project
     RIO.builder(el, product, { onFinish(f), onAdded(project), space })
     ========================================================= */
  RIO.builder = function (el, p, opts) {
    opts = opts || {};
    const qty = {}; p.finishes.forEach((f) => (qty[f] = 0));
    el.innerHTML = `
      <div class="order">
        <div class="order-head"><h2 class="h-s">How many do you need?</h2><p class="meta">${p.finishes.length > 1 ? "Set a quantity for each colour. Mix as many as you like in one order." : "Set the quantity you need."}</p></div>
        <div class="o-rows">
        ${p.finishes.map((f) => `
          <div class="o-row" data-f="${f}">
            <span class="sw" data-f="${f}" style="background-color:${F[f].hex}"></span>
            <span class="nm">${F[f].name}</span>
            <span class="qty">
              <button type="button" data-step="-1" aria-label="Fewer ${F[f].name}">−</button>
              <input type="number" min="0" inputmode="numeric" value="0" aria-label="${F[f].name} quantity">
              <button type="button" data-step="1" aria-label="More ${F[f].name}">+</button>
            </span>
          </div>`).join("")}
        </div>
        <div class="o-total"><span>Total</span><span><span class="n" data-total>0</span> <span class="meta" data-tier>pieces</span></span></div>
        <p class="o-mix meta" data-mix></p>
        <div class="o-add">
          <label class="target hide" data-target-row><span class="meta">Add to</span><select data-target aria-label="Choose project"></select></label>
          <button type="button" class="btn" data-add disabled>Add to Project</button>
          <p class="o-done hide" data-done role="status"></p>
          <p class="o-note">Nothing is charged here. Add what you need, then send your project for a quote.</p>
        </div>
      </div>`;
    const $ = (s) => el.querySelector(s);
    const total = () => Object.values(qty).reduce((a, b) => a + b, 0);
    function paint() {
      const t = total();
      $("[data-total]").textContent = t;
      el.querySelectorAll(".o-row").forEach((r) => {
        const inp = r.querySelector("input");
        if (document.activeElement !== inp) inp.value = qty[r.dataset.f];
      });
      const tier = RIO.TIERS[RIO.tierFor(t)];
      $("[data-tier]").textContent = t ? `pieces · ${tier.name} order` : "pieces";
      $("[data-mix]").textContent = t ? p.finishes.filter((f) => qty[f]).map((f) => `${F[f].name} — ${qty[f]}`).join("   ·   ") : "";
      const add = $("[data-add]");
      add.disabled = !t;
      add.innerHTML = t ? `Add ${t} to Project ${ARR}` : "Add to Project";
    }
    function set(f, n) { qty[f] = Math.max(0, Math.min(99999, parseInt(n, 10) || 0)); paint(); if (opts.onFinish) opts.onFinish(f); }
    el.addEventListener("click", (e) => {
      const st = e.target.closest("[data-step]");
      if (st) { const f = st.closest(".o-row").dataset.f; set(f, qty[f] + +st.dataset.step); }
    });
    el.addEventListener("input", (e) => { if (e.target.matches(".o-row input")) set(e.target.closest(".o-row").dataset.f, e.target.value); });
    el.addEventListener("focusin", (e) => { const r = e.target.closest(".o-row"); if (r && opts.onFinish) opts.onFinish(r.dataset.f); });

    // First visit: there is nothing to choose, the order goes into "My project".
    // Once a visitor has more than one project, they can pick which one.
    const target = $("[data-target]");
    function fill() {
      const all = RIO.store.all(), act = RIO.store.active();
      target.innerHTML = all.map((pr) => `<option value="${pr.id}" ${act && act.id === pr.id ? "selected" : ""}>${RIO.esc(pr.name)} (${RIO.store.total(pr)} pieces)</option>`).join("");
      $("[data-target-row]").classList.toggle("hide", all.length < 2);
    }
    fill();
    $("[data-add]").addEventListener("click", () => {
      const t = total(); if (!t) return;
      const chosen = target.value && RIO.store.get(target.value);
      const pr = chosen || RIO.store.create("My project", opts.space || (p.spaces.length === 1 ? p.spaces[0] : ""));
      RIO.store.setActive(pr.id);
      RIO.store.addItem(pr.id, p.id, qty);
      const done = $("[data-done]");
      done.innerHTML = `<span>${t} × ${RIO.esc(RIO.shortName(p))} added to ${RIO.esc(pr.name)}.</span><a class="link" href="project.html">View Project ${ARR}</a>`;
      done.classList.remove("hide");
      p.finishes.forEach((f) => (qty[f] = 0));
      paint(); fill();
      if (opts.onAdded) opts.onAdded(pr);
    });
    paint();
    return { qty };
  };

  /* ---------- Project summary (plain text, sent to RIO) ---------- */
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

  /* ---------- Send to RIO (database if connected, else WhatsApp / email) ---------- */
  RIO.openSend = function (text, subject, hasFiles, row, title) {
    let m = document.getElementById("send-modal");
    if (!m) { m = document.createElement("div"); m.id = "send-modal"; m.className = "modal"; m.setAttribute("role", "dialog"); m.setAttribute("aria-modal", "true"); document.body.appendChild(m); }
    const online = !!(RIO.db && row);
    const links = (t) => ({
      wa: "https://wa.me/" + C.whatsapp + "?text=" + encodeURIComponent(t),
      mail: "mailto:" + C.email + "?subject=" + encodeURIComponent(subject || "Project request") + "&body=" + encodeURIComponent(t)
    });
    const L = links(text);
    m.innerHTML = `
      <div class="modal-bg" data-close></div>
      <div class="modal-card">
        <button class="modal-close" data-close aria-label="Close">×</button>
        <div data-stage="ready">
          <span class="meta">Send to RIO</span>
          <h2 class="h-m">${title || "Your project is ready."}</h2>
          <p class="muted">${online ? "Send it straight to our team. We'll reply on WhatsApp or email." : "Choose how to send it. Everything below is filled in for you."}</p>
          <div class="summary">${RIO.esc(text)}</div>
          ${hasFiles ? `<p class="small" style="margin-bottom:18px">${online ? "Your files will be sent to RIO with your request." : "Your drawings, photos or PDFs: attach them in WhatsApp or email once it opens."}</p>` : ""}
          <div class="row">
            ${online ? `<button class="btn" data-send>Send to RIO ${ARR}</button>
              <a class="btn btn-line" href="${L.wa}" target="_blank" rel="noopener">WhatsApp instead</a>`
            : `<a class="btn" href="${L.wa}" target="_blank" rel="noopener">Send on WhatsApp ${ARR}</a>
              <a class="btn btn-line" href="${L.mail}">Send by email</a>`}
            <button class="link" data-copy>Copy</button>
          </div>
          <p class="send-err small" data-err role="alert"></p>
        </div>
        <div data-stage="done" hidden>
          <span class="meta">Sent</span>
          <h2 class="h-m">Thank you. We've got it.</h2>
          <p>Your reference is <b class="ink" data-ref></b>. Our team will be in touch soon.</p>
          <p class="small mt-s" data-files-note></p>
          <p class="mt-s"><a class="link" data-track>Track your request ${ARR}</a></p>
          <div class="row mt-m"><a class="btn btn-line" data-wa2 target="_blank" rel="noopener">Follow up on WhatsApp</a><button class="link" data-close>Close</button></div>
        </div>
      </div>`;
    m.classList.add("open");
    m.querySelectorAll("[data-close]").forEach((b) => b.addEventListener("click", () => m.classList.remove("open")));
    m.querySelector("[data-copy]").addEventListener("click", (e) => { try { navigator.clipboard.writeText(text); e.target.textContent = "Copied"; } catch (x) {} });
    const sendBtn = m.querySelector("[data-send]");
    if (sendBtn) sendBtn.addEventListener("click", async () => {
      sendBtn.disabled = true; sendBtn.innerHTML = "Sending…";
      const res = await RIO.submitQuote(row, (i, n) => { sendBtn.innerHTML = `Uploading file ${i} of ${n}…`; });
      if (res.ok) {
        m.querySelector('[data-stage="ready"]').hidden = true;
        m.querySelector('[data-stage="done"]').hidden = false;
        m.querySelector("[data-ref]").textContent = res.ref;
        m.querySelector("[data-wa2]").href = links("Hi RIO, my project reference is " + res.ref + ".").wa;
        m.querySelector("[data-track]").href = "track.html?order=" + encodeURIComponent(res.ref);
        const fn = m.querySelector("[data-files-note]");
        if (res.uploaded) fn.textContent = res.uploaded + (res.uploaded === 1 ? " file" : " files") + " sent with your request.";
        if (res.failed && res.failed.length) fn.textContent += (fn.textContent ? " " : "") + "Please send these on WhatsApp with your reference: " + res.failed.join(", ") + ".";
        document.dispatchEvent(new CustomEvent("rio:quoteSent", { detail: res }));
      } else {
        sendBtn.disabled = false; sendBtn.innerHTML = `Send to RIO ${ARR}`;
        m.querySelector("[data-err]").innerHTML = `We couldn't send it just now. Please use <a class="link" href="${L.wa}" target="_blank" rel="noopener">WhatsApp</a> or <a class="link" href="${L.mail}">email</a> instead.`;
      }
    });
    m.querySelector(".modal-close").focus();
    document.addEventListener("keydown", function esc(e) { if (e.key === "Escape") { m.classList.remove("open"); document.removeEventListener("keydown", esc); } });
  };

  /* ---------- Reviews (approved ones only) ----------
     RIO.fetchReviews(3) resolves to a list, newest first; an empty list if
     there are none, the database is not set up, or it cannot be reached. */
  RIO.fetchReviews = function (limit) {
    const cfg = RIO.SUPABASE || {};
    if (!cfg.url || !cfg.anonKey || !window.fetch) return Promise.resolve([]);
    return fetch(`${cfg.url}/rest/v1/site_reviews?select=id,created_at,name,context,rating,body,photos&published=eq.true&order=created_at.desc${limit ? "&limit=" + limit : ""}`,
      { headers: { apikey: cfg.anonKey, Authorization: "Bearer " + cfg.anonKey } })
      .then((res) => (res.ok ? res.json() : [])).then((rows) => (Array.isArray(rows) ? rows : [])).catch(() => []);
  };
  RIO.stars = (n) => `<span class="stars" role="img" aria-label="${n} out of 5 stars"><span aria-hidden="true">${"★".repeat(n)}<i>${"★".repeat(5 - n)}</i></span></span>`;
  RIO.reviewCard = function (r) {
    const cfg = RIO.SUPABASE || {};
    const url = (p) => cfg.url + "/storage/v1/object/public/review-photos/" + String(p).split("/").map(encodeURIComponent).join("/");
    const when = new Date(r.created_at).toLocaleDateString("en-GB", { month: "long", year: "numeric" });
    const n = Math.max(1, Math.min(5, r.rating | 0));
    return `
      <article class="review reveal">
        ${RIO.stars(n)}
        <p class="review-body">${RIO.esc(r.body)}</p>
        ${r.photos && r.photos.length ? `<div class="review-photos">${r.photos.slice(0, 3).map((p) => `<a href="${url(p)}" target="_blank" rel="noopener"><img src="${url(p)}" alt="Photo from ${RIO.esc(r.name)}" loading="lazy" decoding="async"></a>`).join("")}</div>` : ""}
        <p class="review-by"><span class="ink">${RIO.esc(r.name)}</span>${r.context ? ` · ${RIO.esc(r.context)}` : ""}<span class="meta">${when}</span></p>
      </article>`;
  };

  /* ---------- Shared file drop helper ---------- */
  RIO.fileDrop = function (zone, input, onFiles) {
    input.addEventListener("change", (e) => onFiles(e.target.files));
    ["dragenter", "dragover"].forEach((ev) => zone.addEventListener(ev, (e) => { e.preventDefault(); zone.classList.add("drag"); }));
    ["dragleave", "drop"].forEach((ev) => zone.addEventListener(ev, (e) => { e.preventDefault(); zone.classList.remove("drag"); }));
    zone.addEventListener("drop", (e) => onFiles(e.dataTransfer.files));
  };

  document.addEventListener("DOMContentLoaded", () => RIO.observeReveal());

  // People who turn off motion get still frames instead of looping clips
  if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const stop = () => document.querySelectorAll("video[autoplay]").forEach((v) => { v.removeAttribute("autoplay"); v.pause(); });
    document.addEventListener("DOMContentLoaded", stop); setTimeout(stop, 800);
  }
})();
