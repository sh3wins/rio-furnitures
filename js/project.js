/* RIO — My Project: a calm workspace */
(function () {
  const F = RIO.FINISHES, S = RIO.store;
  const sw = document.getElementById("pj-switch"), view = document.getElementById("pj-view");
  let proj = S.active();
  const SUGGEST = ["My Restaurant — Westlands", "Rooftop Bar", "Church Renovation", "Office Setup", "School Furniture"];

  function renderSwitch(creating) {
    const all = S.all();
    sw.innerHTML = `<span class="mono muted" style="margin-right:8px">Projects</span>` +
      all.map((p) => `<button type="button" class="${!creating && proj && p.id === proj.id ? "on" : ""}" data-open="${p.id}">${RIO.esc(p.name)} <span class="mono muted">${S.total(p)}</span></button>`).join("") +
      `<button type="button" class="${creating ? "on" : ""}" data-new>+ New project</button>`;
  }

  function newView() {
    view.innerHTML = `
      <div class="pj-new">
        <p class="mono muted">My project</p>
        <h1 class="serif s-xl" style="margin:16px 0 40px">Name your<br><em>project.</em></h1>
        <input class="pj-name" id="np-name" placeholder="My Restaurant — Westlands" aria-label="Project name">
        <div class="suggest">${SUGGEST.map((s) => `<button type="button" data-s="${s}">${s}</button>`).join("")}</div>
        <div class="field mt-l"><span class="lbl">What are you furnishing?</span>
          <div class="quiet-nav" id="np-space">${RIO.SPACES.map((s) => `<button type="button" data-sp="${s.id}">${s.name}</button>`).join("")}</div></div>
        <div class="row mt-l">
          <button type="button" class="btn btn-o" id="np-go">Save this project <span class="arr">→</span></button>
          <a class="link" href="spaces.html">Explore the spaces first <span class="arr">→</span></a>
        </div>
        <p class="small muted mt-m">Projects are kept in this browser, so you can build over time and come back before requesting a quote.</p>
      </div>`;
    let sp = "";
    view.querySelector(".suggest").addEventListener("click", (e) => { const b = e.target.closest("[data-s]"); if (b) view.querySelector("#np-name").value = b.dataset.s; });
    view.querySelector("#np-space").addEventListener("click", (e) => {
      const b = e.target.closest("[data-sp]"); if (!b) return; sp = b.dataset.sp;
      view.querySelectorAll("#np-space button").forEach((x) => x.classList.toggle("on", x === b));
    });
    view.querySelector("#np-go").addEventListener("click", () => { proj = S.create(view.querySelector("#np-name").value.trim() || "Untitled project", sp); render(); });
    view.querySelector("#np-name").focus();
  }

  function itemHTML(it, i) {
    const p = RIO.product(it.pid); if (!p) return "";
    const fins = Array.from(new Set(p.finishes.concat(Object.keys(it.qty))));
    const firstF = Object.keys(it.qty).find((f) => it.qty[f] > 0) || p.finishes[0];
    return `
      <div class="pj-item" data-i="${i}">
        <div class="pj-item-head">
          <a class="th" href="product.html?id=${p.id}" aria-label="${RIO.esc(p.name)}">${RIO.visual(p, firstF)}</a>
          <div><span class="mono muted">${RIO.code(p)}</span><div class="title t-m" style="font-weight:400">${RIO.shortName(p)}</div></div>
          <div class="t"><span class="n" data-lt>${String(S.lineTotal(it)).padStart(3, "0")}</span><span class="mono muted">pcs</span></div>
        </div>
        <div class="pj-rows">${fins.map((f) => `
          <div class="pj-row ${it.qty[f] ? "" : "zero"}" data-f="${f}">
            <span class="nm"><span class="sw" style="background:${(F[f] || {}).hex}"></span>${(F[f] || { name: f }).name}</span>
            <span class="qty sm"><button type="button" data-step="-1" aria-label="Fewer">−</button><input type="number" min="0" value="${it.qty[f] || 0}" aria-label="${(F[f] || {}).name} quantity"><button type="button" data-step="1" aria-label="More">+</button></span>
          </div>`).join("")}</div>
        <div class="pj-item-foot"><a href="product.html?id=${p.id}">Open piece</a><button type="button" data-remove>Remove</button></div>
      </div>`;
  }

  function mainView() {
    const c = proj.contact || {};
    view.innerHTML = `
      <div class="pj">
        <div>
          <div class="row" style="justify-content:space-between"><span class="mono muted">My project</span><span class="save-state" id="save-state">Saved in this browser</span></div>
          <input class="pj-name mt-s" id="pj-name" value="${RIO.esc(proj.name)}" aria-label="Project name">
          <div class="pj-space"><div class="quiet-nav" id="pj-space">${RIO.SPACES.map((s) => `<button type="button" data-sp="${s.id}" class="${proj.space === s.id ? "on" : ""}">${s.name}</button>`).join("")}</div></div>

          <p class="mono muted" style="margin:0 0 6px">Furniture</p>
          <div id="items">${proj.items.length ? proj.items.map(itemHTML).join("") : `
            <div class="pj-empty"><p class="serif s-m" style="margin:0 0 10px">Nothing here <em>yet.</em></p>
            <p class="muted" style="margin:0">Open any piece — in a room or in the furniture list — set quantities for each finish, and add it here.</p></div>`}</div>
          <div class="row mt-m" style="gap:28px">
            <a class="link" href="${proj.space ? "spaces.html?space=" + proj.space : "spaces.html"}">+ Add from a room <span class="arr">→</span></a>
            <a class="link" href="furniture.html${proj.space ? "?space=" + proj.space : ""}">+ Browse furniture <span class="arr">→</span></a>
            <a class="link" href="start.html?mode=custom">+ Custom piece <span class="arr">→</span></a>
          </div>

          <div class="mt-l" style="display:grid;gap:36px;max-width:640px">
            <div class="field"><label for="pj-notes">Notes</label><textarea class="textarea" id="pj-notes" placeholder="Sizes, fabrics, deadline, delivery location…">${RIO.esc(proj.notes)}</textarea></div>
            <div class="field"><span class="lbl">References &amp; drawings</span>
              <label class="dropzone" id="pj-drop">Drop photos, sketches, floor plans, PDFs or measurements<span class="mono muted">or click to choose</span>
                <input type="file" multiple id="pj-files" accept="image/*,.pdf,.dwg,.dxf,.doc,.docx,.xls,.xlsx"></label>
              <ul class="files" id="pj-file-list"></ul>
              <span class="small muted">Files are sent to RIO with your quote request. Added on an earlier visit? Add them again before sending.</span></div>
            <div class="f-grid2">
              <div class="field"><label for="c-name">Name</label><input class="input" id="c-name" data-c="name" value="${RIO.esc(c.name)}" autocomplete="name"></div>
              <div class="field"><label for="c-phone">Phone / WhatsApp</label><input class="input" id="c-phone" data-c="phone" value="${RIO.esc(c.phone)}" autocomplete="tel"></div>
              <div class="field"><label for="c-email">Email</label><input class="input" id="c-email" data-c="email" value="${RIO.esc(c.email)}" autocomplete="email"></div>
              <div class="field"><label for="c-loc">Project location</label><input class="input" id="c-loc" data-c="location" value="${RIO.esc(c.location)}" placeholder="Westlands, Nairobi"></div>
            </div>
          </div>
        </div>

        <aside class="pj-side">
          <div class="pj-total">
            <span class="mono muted">Total pieces</span>
            <span class="n" id="pj-total">000</span>
            <ul id="pj-br"></ul>
            <div class="o-tier" id="pj-tier">${RIO.TIERS.map((t) => `<span>${t.name} ${t.range}</span>`).join("")}</div>
          </div>
          <div class="pj-actions">
            <button type="button" class="btn btn-o" id="pj-quote">Request a quote <span class="arr">→</span></button>
            <button type="button" class="btn" id="pj-save">Save this project</button>
            <div class="row"><button type="button" id="pj-dl">Download summary</button><button type="button" id="pj-del">Delete project</button></div>
          </div>
        </aside>
      </div>`;
    bind(); totals(); files();
  }

  let flashT;
  function persist(msg) {
    S.save(proj);
    const el = document.getElementById("save-state");
    if (el) { el.textContent = msg || "Saved · " + new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }); el.classList.add("flash"); clearTimeout(flashT); flashT = setTimeout(() => el.classList.remove("flash"), 1200); }
    renderSwitch();
  }
  function totals() {
    const t = S.total(proj), n = document.getElementById("pj-total");
    RIO.animateNumber(n, t, 500, 3); n.classList.toggle("has", t > 0);
    document.getElementById("pj-br").innerHTML = proj.items.map((it) => { const p = RIO.product(it.pid); return p ? `<li><span>${RIO.shortName(p)}</span><span class="mono">${S.lineTotal(it)}</span></li>` : ""; }).join("") || `<li><span class="muted">No furniture yet</span><span class="mono">0</span></li>`;
    const ti = RIO.tierFor(t);
    document.querySelectorAll("#pj-tier span").forEach((s, i) => s.classList.toggle("on", t > 0 && i === ti));
    document.querySelectorAll(".pj-item").forEach((el) => {
      const it = proj.items[+el.dataset.i]; if (!it) return;
      el.querySelector("[data-lt]").textContent = String(S.lineTotal(it)).padStart(3, "0");
      el.querySelectorAll(".pj-row").forEach((r) => r.classList.toggle("zero", !(it.qty[r.dataset.f] > 0)));
    });
  }
  function files() {
    document.getElementById("pj-file-list").innerHTML = (proj.files || []).map((n, i) => `<li><span>${RIO.esc(n)}</span><button type="button" data-rm="${i}" aria-label="Remove ${RIO.esc(n)}">×</button></li>`).join("");
  }

  function bind() {
    const items = document.getElementById("items");
    const setQ = (row, v) => {
      const it = proj.items[+row.closest(".pj-item").dataset.i];
      it.qty[row.dataset.f] = Math.max(0, Math.min(99999, parseInt(v, 10) || 0));
      row.querySelector("input").value = it.qty[row.dataset.f];
      totals(); persist();
    };
    items.addEventListener("click", (e) => {
      const st = e.target.closest("[data-step]");
      if (st) { const row = st.closest(".pj-row"); const it = proj.items[+row.closest(".pj-item").dataset.i]; setQ(row, (it.qty[row.dataset.f] || 0) + +st.dataset.step); }
      if (e.target.closest("[data-remove]")) { proj.items.splice(+e.target.closest(".pj-item").dataset.i, 1); persist("Removed"); mainView(); }
    });
    items.addEventListener("change", (e) => { if (e.target.matches(".pj-row input")) setQ(e.target.closest(".pj-row"), e.target.value); });
    document.getElementById("pj-name").addEventListener("input", (e) => { proj.name = e.target.value || "Untitled project"; persist(); });
    document.getElementById("pj-space").addEventListener("click", (e) => {
      const b = e.target.closest("[data-sp]"); if (!b) return;
      proj.space = proj.space === b.dataset.sp ? "" : b.dataset.sp;
      document.querySelectorAll("#pj-space button").forEach((x) => x.classList.toggle("on", x.dataset.sp === proj.space));
      persist();
    });
    document.getElementById("pj-notes").addEventListener("input", (e) => { proj.notes = e.target.value; persist(); });
    document.querySelectorAll("[data-c]").forEach((i) => i.addEventListener("input", () => { proj.contact = proj.contact || {}; proj.contact[i.dataset.c] = i.value.trim(); persist(); }));
    RIO.fileDrop(document.getElementById("pj-drop"), document.getElementById("pj-files"), (list) => {
      proj.files = proj.files || []; RIO._fileObjs = RIO._fileObjs || {};
      Array.from(list).forEach((f) => { if (f.size > (RIO.MAX_FILE || 2e7)) { alert(f.name + " is over 20 MB — please send it on WhatsApp instead."); return; } if (!proj.files.includes(f.name)) proj.files.push(f.name); RIO._fileObjs[proj.id + "/" + f.name] = f; }); files(); persist();
    });
    document.getElementById("pj-file-list").addEventListener("click", (e) => { const b = e.target.closest("[data-rm]"); if (b) { proj.files.splice(+b.dataset.rm, 1); files(); persist(); } });
    document.getElementById("pj-save").addEventListener("click", () => { persist("Project saved"); RIO.toast(`<span><b>${RIO.esc(proj.name)}</b> is saved in this browser.</span>`); });
    document.getElementById("pj-quote").addEventListener("click", () => {
      if (!S.total(proj) && !proj.notes) { RIO.toast(`<span>Add some furniture or a note first.</span><a href="spaces.html">Explore →</a>`); return; }
      const qrow = RIO.quoteFromProject ? RIO.quoteFromProject(proj) : null;
      if (qrow) qrow._files = (proj.files || []).map((n) => (RIO._fileObjs || {})[proj.id + "/" + n]).filter(Boolean);
      RIO.openSend(RIO.projectSummary(proj), "Project quote — " + proj.name, (proj.files || []).length > 0, qrow);
    });
    document.getElementById("pj-dl").addEventListener("click", () => {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([RIO.projectSummary(proj)], { type: "text/plain" }));
      a.download = "RIO-" + proj.name.replace(/[^a-z0-9]+/gi, "-") + ".txt"; a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    });
    document.getElementById("pj-del").addEventListener("click", (e) => {
      if (e.target.dataset.sure) { S.remove(proj.id); proj = S.active(); render(); return; }
      e.target.dataset.sure = "1"; e.target.textContent = "Tap again to delete";
      setTimeout(() => { e.target.textContent = "Delete project"; delete e.target.dataset.sure; }, 3000);
    });
  }

  function render(creating) {
    renderSwitch(creating || !proj);
    if (!proj || creating) newView(); else mainView();
  }
  sw.addEventListener("click", (e) => {
    const o = e.target.closest("[data-open]");
    if (o) { proj = S.get(o.dataset.open); S.setActive(proj.id); render(); }
    if (e.target.closest("[data-new]")) render(true);
  });
  render();
})();
