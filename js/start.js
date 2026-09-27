/* RIO — Start a project (also: ?mode=custom) */
(function () {
  const $ = (s) => document.querySelector(s);
  const custom = RIO.qs("mode") === "custom";
  const STEPS = ["What are you building?", "What do you need?", "How much?", "Tell us about it", "Send to RIO"];
  const NEEDS = ["Seating", "Tables", "Workspace", "Storage", "Beds", "Counters", "Custom", "Other"];
  const QTY = [["1–9", "A few pieces"], ["10–49", "Bulk"], ["50–99", "A project"], ["100+", "Large-scale"]];
  const st = { space: RIO.space(RIO.qs("space")) ? RIO.qs("space") : "", needs: custom ? ["Custom"] : [], qty: "", files: [], text: {} };
  let step = 0;

  if (custom) {
    $("#s-kicker").textContent = "Custom furniture";
    $("#s-title").innerHTML = "Can't find it?<br><em>Let's make it.</em>";
    document.title = "Custom Project — RIO Furnitures";
  }
  $("#s-steps").innerHTML = STEPS.map((s, i) => `<li data-go="${i}"><span class="mono">0${i + 1}</span>${s}</li>`).join("");

  const choice = (k, v, word, aside, multi, mono) => {
    const on = multi ? st[k].includes(v) : st[k] === v;
    return `<li><button type="button" class="choice ${multi ? "sq" : ""} ${on ? "on" : ""}" data-k="${k}" data-v="${v}" aria-pressed="${on}">
      <span class="ring"></span><span class="w ${mono ? "mono-w" : ""}">${word}</span><span class="aside">${aside || ""}</span></button></li>`;
  };
  const val = (id) => (document.getElementById(id) ? document.getElementById(id).value.trim() : st.text[id] || "");

  function body() {
    if (step === 0) return `<p class="mono muted">Step 01</p><h2 class="serif s-l">What are you <em>building?</em></h2>
      <ul class="choices">${RIO.SPACES.map((s) => choice("space", s.id, s.name, s.needs.slice(0, 3).join(", "))).join("")}</ul>`;
    if (step === 1) return `<p class="mono muted">Step 02</p><h2 class="serif s-l">What do you <em>need?</em></h2>
      <p class="muted" style="margin:-20px 0 24px">Choose as many as you like.</p>
      <ul class="choices">${NEEDS.map((n) => choice("needs", n, n, "", true)).join("")}</ul>`;
    if (step === 2) return `<p class="mono muted">Step 03</p><h2 class="serif s-l">How <em>much?</em></h2>
      <p class="muted" style="margin:-20px 0 24px">Roughly, across the whole space.</p>
      <ul class="choices">${QTY.map(([q, a]) => choice("qty", q, q + " pcs", a, false, true)).join("")}</ul>
      <p class="f-hint ${st.qty === "50–99" || st.qty === "100+" ? "" : "hide"}" id="qhint">A project-scale order. We'll plan production around your space and quote on your exact quantities and finishes.</p>`;
    if (step === 3) return `<p class="mono muted">Step 04</p><h2 class="serif s-l">Tell us <em>about it.</em></h2>
      <div style="display:grid;gap:36px">
        <div class="field"><label for="t-about">${custom ? "Describe the piece — size, use, look" : "The space, the look, the timeline"}</label>
          <textarea class="textarea" id="t-about" placeholder="${custom ? "A curved reception counter, about 3m long, walnut front with a black top…" : "Opening a 40-seat café in Kilimani in March. Black and natural finishes, a few orange chairs, a long counter by the window…"}">${RIO.esc(st.text["t-about"])}</textarea></div>
        <div class="field"><span class="lbl">Upload what you have</span>
          <label class="dropzone" id="t-drop">Drawings · photos · floor plans · inspiration · measurements<span class="mono muted">drop here or click to choose</span>
            <input type="file" multiple id="t-files" accept="image/*,.pdf,.dwg,.dxf,.doc,.docx,.xls,.xlsx"></label>
          <ul class="files" id="t-list"></ul></div>
        <div class="f-grid2">
          <div class="field"><label for="t-name">Name</label><input class="input" id="t-name" autocomplete="name" value="${RIO.esc(st.text["t-name"])}"></div>
          <div class="field"><label for="t-phone">Phone / WhatsApp</label><input class="input" id="t-phone" autocomplete="tel" inputmode="tel" value="${RIO.esc(st.text["t-phone"])}"></div>
          <div class="field"><label for="t-email">Email</label><input class="input" id="t-email" type="email" autocomplete="email" value="${RIO.esc(st.text["t-email"])}"></div>
          <div class="field"><label for="t-loc">Location</label><input class="input" id="t-loc" placeholder="Westlands, Nairobi" value="${RIO.esc(st.text["t-loc"])}"></div>
          <div class="field"><label for="t-proj">Project name</label><input class="input" id="t-proj" placeholder="My Restaurant — Westlands" value="${RIO.esc(st.text["t-proj"])}"></div>
          <div class="field"><label for="t-when">When do you need it?</label><select class="select" id="t-when">${["Not sure yet", "As soon as possible", "Within a month", "1–3 months", "3+ months"].map((w) => `<option ${st.text["t-when"] === w ? "selected" : ""}>${w}</option>`).join("")}</select></div>
        </div>
      </div>`;
    const sp = RIO.space(st.space);
    const contact = ["t-name", "t-phone", "t-email", "t-loc"].map((k) => st.text[k]).filter(Boolean).map(RIO.esc).join(" · ");
    return `<p class="mono muted">Step 05</p><h2 class="serif s-l">Ready to <em>send.</em></h2>
      <dl class="review">
        <div><dt class="mono muted">Building</dt><dd>${sp ? sp.name : "—"}</dd><button type="button" data-go="0">Edit</button></div>
        <div><dt class="mono muted">Needs</dt><dd>${st.needs.join(", ") || "—"}</dd><button type="button" data-go="1">Edit</button></div>
        <div><dt class="mono muted">How much</dt><dd>${st.qty ? st.qty + " pieces" : "—"}</dd><button type="button" data-go="2">Edit</button></div>
        <div><dt class="mono muted">The space</dt><dd>${RIO.esc(st.text["t-about"]) || '<span class="muted">No description</span>'}${st.files.length ? `<br><span class="mono muted">${st.files.length} file(s)</span>` : ""}</dd><button type="button" data-go="3">Edit</button></div>
        <div><dt class="mono muted">Contact</dt><dd>${contact || '<span class="muted">Add your details so we can reply</span>'}</dd><button type="button" data-go="3">Edit</button></div>
      </dl>
      <label class="row mt-m small" id="save-row" style="gap:10px"><input type="checkbox" id="t-save" checked> Also save as a project in this browser</label>`;
  }

  function keepText() {
    ["t-about", "t-name", "t-phone", "t-email", "t-loc", "t-proj", "t-when"].forEach((k) => { const el = document.getElementById(k); if (el) st.text[k] = el.value.trim(); });
  }
  function files() {
    const ul = $("#t-list"); if (!ul) return;
    ul.innerHTML = st.files.map((n, i) => `<li><span>${RIO.esc(n)}</span><button type="button" data-rm="${i}" aria-label="Remove">×</button></li>`).join("");
  }

  function render() {
    $("#s-body").innerHTML = `<div class="f-step on">${body()}</div>`;
    $("#s-count").textContent = `Step 0${step + 1} / 05`;
    $("#s-prog").style.width = ((step + 1) / STEPS.length) * 100 + "%";
    document.querySelectorAll("#s-steps li").forEach((li, i) => { li.classList.toggle("on", i === step); li.classList.toggle("done", i < step); });
    $("#s-back").style.visibility = step ? "visible" : "hidden";
    const next = $("#s-next");
    next.className = step === 4 ? "btn btn-o" : "btn";
    next.innerHTML = step === 4 ? `Send project to RIO <span class="arr">→</span>` : `Continue <span class="arr">→</span>`;
    $("#s-msg").textContent = "";
    if (step === 3) {
      RIO.fileDrop($("#t-drop"), $("#t-files"), (l) => { Array.from(l).forEach((f) => { if (!st.files.includes(f.name)) st.files.push(f.name); }); files(); });
      $("#t-list").addEventListener("click", (e) => { const b = e.target.closest("[data-rm]"); if (b) { st.files.splice(+b.dataset.rm, 1); files(); } });
      files();
    }
  }

  function need(i) {
    if (i === 0 && !st.space) return "Choose a space to continue.";
    if (i === 1 && !st.needs.length) return "Choose at least one.";
    if (i === 2 && !st.qty) return "Choose a rough amount.";
    return "";
  }
  function go(i) {
    keepText();
    if (i > step) { for (let k = step; k < i; k++) { const m = need(k); if (m) { $("#s-msg").textContent = m; return; } } }
    step = Math.max(0, Math.min(4, i)); render();
    const top = document.querySelector(".flow").getBoundingClientRect().top + window.scrollY - 90;
    if (window.scrollY > top) window.scrollTo({ top, behavior: "smooth" });
  }

  document.getElementById("s-form").addEventListener("click", (e) => {
    const c = e.target.closest(".choice");
    if (c) {
      const k = c.dataset.k, v = c.dataset.v;
      if (Array.isArray(st[k])) st[k] = st[k].includes(v) ? st[k].filter((x) => x !== v) : st[k].concat(v);
      else st[k] = v;
      document.querySelectorAll(`.choice[data-k="${k}"]`).forEach((b) => {
        const on = Array.isArray(st[k]) ? st[k].includes(b.dataset.v) : st[k] === b.dataset.v;
        b.classList.toggle("on", on); b.setAttribute("aria-pressed", on);
      });
      const h = $("#qhint"); if (h) h.classList.toggle("hide", !(st.qty === "50–99" || st.qty === "100+"));
      $("#s-msg").textContent = "";
      if (!Array.isArray(st[k])) setTimeout(() => go(step + 1), 450);
      return;
    }
    const g = e.target.closest("[data-go]"); if (g) go(+g.dataset.go);
  });
  $("#s-steps").addEventListener("click", (e) => { const li = e.target.closest("li.done"); if (li) go(+li.dataset.go); });
  $("#s-back").addEventListener("click", () => go(step - 1));
  $("#s-next").addEventListener("click", () => (step === 4 ? send() : go(step + 1)));

  function summary() {
    const T = st.text, sp = RIO.space(st.space);
    const L = [custom ? "RIO FURNITURES — CUSTOM PROJECT" : "RIO FURNITURES — PROJECT REQUEST"];
    if (T["t-proj"]) L.push("Project: " + T["t-proj"]);
    L.push("Building: " + (sp ? sp.name : "-"), "Needs: " + st.needs.join(", "), "How much: " + st.qty + " pieces");
    if (T["t-when"] && T["t-when"] !== "Not sure yet") L.push("Needed: " + T["t-when"]);
    if (st.files.length) L.push("Files I'll share: " + st.files.join(", "));
    if (T["t-about"]) L.push("", T["t-about"]);
    L.push("");
    [["t-name", "Name"], ["t-phone", "Phone"], ["t-email", "Email"], ["t-loc", "Location"]].forEach(([k, n]) => { if (T[k]) L.push(n + ": " + T[k]); });
    return L.join("\n");
  }
  function send() {
    const box = $("#t-save");
    if (box && box.checked) {
      const T = st.text, sp = RIO.space(st.space);
      const name = T["t-proj"] || (sp ? "New " + sp.name : "New project");
      const p = RIO.store.create(name, st.space);
      p.notes = [st.needs.join(", ") + " · " + st.qty + " pcs", T["t-about"]].filter(Boolean).join("\n");
      p.files = st.files.slice();
      p.contact = { name: T["t-name"], phone: T["t-phone"], email: T["t-email"], location: T["t-loc"] };
      RIO.store.save(p);
      $("#save-row").innerHTML = `<span class="dot-o"></span> Saved as <a class="link" href="project.html">${RIO.esc(name)}</a> — add exact pieces and finishes any time.`;
    }
    const T = st.text;
    const row = {
      source: custom ? "custom" : "start", project_name: T["t-proj"] || "", space: st.space, needs: st.needs, qty_range: st.qty,
      notes: T["t-about"] || "", files: st.files.slice(), timeline: T["t-when"] && T["t-when"] !== "Not sure yet" ? T["t-when"] : "",
      contact_name: T["t-name"] || "", contact_phone: T["t-phone"] || "", contact_email: T["t-email"] || "", location: T["t-loc"] || ""
    };
    RIO.openSend(summary(), (custom ? "Custom project" : "Project request") + (RIO.space(st.space) ? " — " + RIO.space(st.space).name : ""), st.files.length > 0, row);
  }

  if (st.space) step = 1;
  render();
})();
