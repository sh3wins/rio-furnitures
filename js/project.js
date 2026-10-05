/* RIO — My project: the pieces, colours and quantities you've chosen */
RIO.whenReady(function () {
  const F = RIO.FINISHES, S = RIO.store, ARR = RIO.ARR;
  const sw = document.getElementById("pj-switch"), view = document.getElementById("pj-view");
  let proj = S.active();
  const SUGGEST = ["My Restaurant", "Rooftop Bar", "Church Renovation", "Office Setup", "School Furniture"];

  function renderSwitch(creating) {
    sw.innerHTML = `<span class="meta">Projects</span>` +
      S.all().map((p) => `<button type="button" class="${!creating && proj && p.id === proj.id ? "on" : ""}" data-open="${p.id}">${RIO.esc(p.name)} (${S.total(p)})</button>`).join("") +
      `<button type="button" class="${creating ? "on" : ""}" data-new>+ New project</button>`;
  }

  function newView() {
    view.innerHTML = `
      <div class="pj-new">
        <span class="eyebrow">My project</span>
        <h1 class="h-xl">Name your project.</h1>
        <input class="pj-name" id="np-name" placeholder="My Restaurant" aria-label="Project name">
        <div class="suggest">${SUGGEST.map((s) => `<button type="button" data-s="${s}">${s}</button>`).join("")}</div>
        <div class="field mt-l"><span class="lbl">What are you furnishing?</span>
          <div class="tabs wrap-tabs" id="np-space">${RIO.SPACES.map((s) => `<button type="button" data-sp="${s.id}">${s.name}</button>`).join("")}</div></div>
        <div class="row mt-l">
          <button type="button" class="btn" id="np-go">Create project</button>
          <a class="link" href="furniture.html">Browse furniture first ${ARR}</a>
        </div>
        <p class="meta mt-m">Projects are kept in this browser, so you can build over time and come back before requesting a quote.</p>
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
          <a class="th ${p.image ? "" : "is-drawing"}" href="product.html?id=${p.id}" aria-label="${RIO.esc(p.name)}">${RIO.visual(p, firstF)}</a>
          <div><div class="h-s">${RIO.esc(RIO.shortName(p))}</div><span class="meta">${RIO.esc(p.type || "")}</span></div>
          <div class="t"><span class="n" data-lt>${S.lineTotal(it)}</span><span class="meta">pieces</span></div>
        </div>
        <div class="pj-rows">${fins.map((f) => `
          <div class="pj-row ${it.qty[f] ? "" : "zero"}" data-f="${f}">
            <span class="nm"><span class="sw" data-f="${f}" style="background-color:${(F[f] || {}).hex}"></span>${(F[f] || { name: f }).name}</span>
            <span class="qty sm"><button type="button" data-step="-1" aria-label="Fewer">−</button><input type="number" min="0" inputmode="numeric" value="${it.qty[f] || 0}" aria-label="${(F[f] || {}).name} quantity"><button type="button" data-step="1" aria-label="More">+</button></span>
          </div>`).join("")}</div>
        <div class="pj-item-foot"><a href="product.html?id=${p.id}">Open piece</a><button type="button" data-remove>Remove</button></div>
      </div>`;
  }

  function mainView() {
    const c = proj.contact || {};
    view.innerHTML = `
      <div class="pj">
        <div>
          <div class="row" style="justify-content:space-between"><span class="eyebrow" style="margin:0">My project</span><span class="save-state" id="save-state">Saved in this browser</span></div>
          <input class="pj-name mt-s" id="pj-name" value="${RIO.esc(proj.name)}" aria-label="Project name">
          <div class="pj-space"><span class="meta">Kind of space</span><div class="tabs wrap-tabs" id="pj-space">${RIO.SPACES.map((s) => `<button type="button" data-sp="${s.id}" class="${proj.space === s.id ? "on" : ""}">${s.name}</button>`).join("")}</div></div>

          <div id="items">${proj.items.length ? proj.items.map(itemHTML).join("") : `
            <div class="pj-empty"><p class="h-m">Nothing here yet.</p>
            <p class="muted">Open any piece of furniture, set a quantity for each colour, and add it here.</p></div>`}</div>
          <div class="row mt-m" style="gap:14px 28px">
            <a class="link" href="furniture.html${proj.space ? "?space=" + proj.space : ""}">Add furniture ${ARR}</a>
            <a class="link" href="start.html?mode=custom">Add a custom piece ${ARR}</a>
          </div>

          <div class="mt-l f-fields" style="max-width:640px">
            <div class="field"><label for="pj-notes">Notes</label><textarea class="textarea" id="pj-notes" placeholder="Sizes, fabrics, deadline, delivery location…">${RIO.esc(proj.notes)}</textarea></div>
            <div class="field"><span class="lbl">References and drawings</span>
              <label class="dropzone" id="pj-drop">Drop photos, sketches, floor plans, PDFs or measurements<span class="meta">or tap to choose</span>
                <input type="file" multiple id="pj-files" aria-label="Upload references and drawings" accept="image/*,.pdf,.dwg,.dxf,.doc,.docx,.xls,.xlsx"></label>
              <ul class="files" id="pj-file-list"></ul>
              <span class="meta">Files are sent to RIO with your quote request. Added on an earlier visit? Add them again before sending.</span></div>
            <div class="f-grid2">
              <div class="field"><label for="c-name">Name</label><input class="input" id="c-name" data-c="name" value="${RIO.esc(c.name)}" autocomplete="name"></div>
              <div class="field"><label for="c-phone">Phone / WhatsApp</label><input class="input" id="c-phone" data-c="phone" value="${RIO.esc(c.phone)}" autocomplete="tel" inputmode="tel"></div>
              <div class="field"><label for="c-email">Email</label><input class="input" id="c-email" data-c="email" value="${RIO.esc(c.email)}" autocomplete="email"></div>
              <div class="field"><label for="c-loc">Project location</label><input class="input" id="c-loc" data-c="location" value="${RIO.esc(c.location)}" placeholder="Westlands, Nairobi"></div>
            </div>
          </div>
        </div>

        <aside class="pj-side">
          <div class="pj-total">
            <span class="meta">Total pieces</span>
            <span class="n" id="pj-total">0</span>
            <ul id="pj-br"></ul>
            <p class="meta pj-tier" id="pj-tier"></p>
          </div>
          <div class="pj-actions">
            <button type="button" class="btn" id="pj-quote">Send Request ${ARR}</button>
            <p class="meta">We reply with a quote on WhatsApp or email.</p>
            <div class="row"><button type="button" id="pj-dl">Download summary</button><button type="button" id="pj-del">Delete project</button></div>
          </div>
        </aside>
      </div>`;
    bind(); totals(); files();
  }

  function persist(msg) {
    S.save(proj);
    const el = document.getElementById("save-state");
    if (el) el.textContent = msg || "Saved " + new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    renderSwitch();
  }
  function totals() {
    const t = S.total(proj);
    document.getElementById("pj-total").textContent = t;
    document.getElementById("pj-br").innerHTML = proj.items.map((it) => { const p = RIO.product(it.pid); return p ? `<li><span>${RIO.esc(RIO.shortName(p))}</span><span>${S.lineTotal(it)}</span></li>` : ""; }).join("") || `<li><span class="muted">No furniture yet</span><span>0</span></li>`;
    const tier = RIO.TIERS[RIO.tierFor(t)];
    document.getElementById("pj-tier").textContent = t ? `${tier.name} order (${tier.range} pieces)` : "";
    document.querySelectorAll(".pj-item").forEach((el) => {
      const it = proj.items[+el.dataset.i]; if (!it) return;
      el.querySelector("[data-lt]").textContent = S.lineTotal(it);
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
      Array.from(list).forEach((f) => { if (f.size > (RIO.MAX_FILE || 2e7)) { alert(f.name + " is over 20 MB. Please send it on WhatsApp instead."); return; } if (!proj.files.includes(f.name)) proj.files.push(f.name); RIO._fileObjs[proj.id + "/" + f.name] = f; }); files(); persist();
    });
    document.getElementById("pj-file-list").addEventListener("click", (e) => { const b = e.target.closest("[data-rm]"); if (b) { proj.files.splice(+b.dataset.rm, 1); files(); persist(); } });
    document.getElementById("pj-quote").addEventListener("click", () => {
      if (!S.total(proj) && !proj.notes) { RIO.toast(`<span>Add some furniture or a note first.</span><a href="furniture.html">Browse furniture</a>`); return; }
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

  // First visit: nothing to manage yet, so just point to the two ways to begin
  function emptyView() {
    view.innerHTML = `
      <div class="pj-new">
        <h1 class="h-xl">Your project is empty.</h1>
        <p class="lead">Add the furniture you need, with a quantity for each colour. Then send it to us for a quote.</p>
        <div class="row mt-m">
          <a class="btn" href="furniture.html">Explore Furniture</a>
          <a class="link" href="start.html">Or describe what you need ${ARR}</a>
        </div>
      </div>`;
  }

  function render(creating) {
    sw.parentNode.classList.toggle("hide", !proj && !creating);
    renderSwitch(creating);
    if (creating) newView(); else if (!proj) emptyView(); else mainView();
  }
  sw.addEventListener("click", (e) => {
    const o = e.target.closest("[data-open]");
    if (o) { proj = S.get(o.dataset.open); S.setActive(proj.id); render(); }
    if (e.target.closest("[data-new]")) render(true);
  });
  render();
});
