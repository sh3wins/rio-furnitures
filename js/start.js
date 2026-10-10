/* RIO — Start a project (also: ?mode=custom) */
(function () {
  const $ = (s) => document.querySelector(s);
  const custom = RIO.qs("mode") === "custom";
  const STEPS = ["The space", "What you need", "How many", "Details"];
  const LAST = STEPS.length - 1;
  const NEEDS = ["Seating", "Tables", "Workspace", "Storage", "Beds", "Counters", "Custom", "Other"];
  const QTY = [["1–9", "A few pieces"], ["10–49", "Bulk"], ["50–99", "A project"], ["100+", "Large-scale"]];
  const st = { space: RIO.space(RIO.qs("space")) ? RIO.qs("space") : "", needs: custom ? ["Custom"] : [], qty: "", files: [], fileObjs: {}, text: {} };
  let step = 0;

  if (custom) {
    $("#s-kicker").textContent = "Custom furniture";
    $("#s-title").textContent = "Tell us what you need made.";
    document.title = "Custom Project | RIO Furnitures, Nairobi, Kenya";
  }
  $("#s-steps").innerHTML = STEPS.map((s, i) => `<li data-go="${i}">${i + 1}. ${s}</li>`).join("");

  const choice = (k, v, word, aside, multi) => {
    const on = multi ? st[k].includes(v) : st[k] === v;
    return `<li><button type="button" class="choice ${multi ? "sq" : ""} ${on ? "on" : ""}" data-k="${k}" data-v="${v}" aria-pressed="${on}">
      <span class="ring"></span><span class="w">${word}</span><span class="aside">${aside || ""}</span></button></li>`;
  };
  const val = (id) => (document.getElementById(id) ? document.getElementById(id).value.trim() : st.text[id] || "");

  function body() {
    if (step === 0) return `<h2 class="h-l">What kind of space?</h2>
      <ul class="choices">${RIO.SPACES.map((s) => choice("space", s.id, s.name, s.needs.slice(0, 3).join(", "))).join("")}</ul>`;
    if (step === 1) return `<h2 class="h-l">What furniture do you need?</h2>
      <p class="f-sub">Choose as many as you like.</p>
      <ul class="choices">${NEEDS.map((n) => choice("needs", n, n, "", true)).join("")}</ul>`;
    if (step === 2) return `<h2 class="h-l">Roughly how many?</h2>
      <p class="f-sub">Across the whole space. A rough number is fine.</p>
      <ul class="choices">${QTY.map(([q, a]) => choice("qty", q, q + " pieces", a)).join("")}</ul>
      <p class="f-hint ${st.qty === "50–99" || st.qty === "100+" ? "" : "hide"}" id="qhint">A project-scale order. We'll plan production around your space and quote on your exact quantities and finishes.</p>`;
    if (step === 3) return `<h2 class="h-l">Tell us about it.</h2>
      <div class="f-fields">
        <div class="field"><label for="t-about">${custom ? "Describe the piece: size, use and look" : "The space, the colours and materials, and anything else"}</label>
          <textarea class="textarea" id="t-about" placeholder="${custom ? "A curved reception counter, about 3m long, walnut front with a black top…" : "Opening a 40-seat café in March. Black and natural finishes, a long counter by the window…"}">${RIO.esc(st.text["t-about"])}</textarea></div>
        <div class="field"><span class="lbl">Upload what you have</span>
          <label class="dropzone" id="t-drop">Drawings, photos, floor plans or measurements<span class="meta">drop here or tap to choose</span>
            <input type="file" multiple id="t-files" aria-label="Upload drawings, photos or plans" accept="image/*,.pdf,.dwg,.dxf,.doc,.docx,.xls,.xlsx"></label>
          <ul class="files" id="t-list"></ul></div>
        <div class="f-grid2">
          <div class="field"><label for="t-name">Name</label><input class="input" id="t-name" autocomplete="name" value="${RIO.esc(st.text["t-name"])}"></div>
          <div class="field"><label for="t-phone">Phone / WhatsApp</label><input class="input" id="t-phone" autocomplete="tel" inputmode="tel" value="${RIO.esc(st.text["t-phone"])}"></div>
          <div class="field"><label for="t-email">Email</label><input class="input" id="t-email" type="email" autocomplete="email" value="${RIO.esc(st.text["t-email"])}"></div>
          <div class="field"><label for="t-loc">Location</label><input class="input" id="t-loc" placeholder="Westlands, Nairobi" value="${RIO.esc(st.text["t-loc"])}"></div>
          <div class="field"><label for="t-when">When do you need it?</label><select class="select" id="t-when">${["Not sure yet", "As soon as possible", "Within a month", "1–3 months", "3+ months"].map((w) => `<option ${st.text["t-when"] === w ? "selected" : ""}>${w}</option>`).join("")}</select></div>
        </div>
      </div>`;
  }

  function keepText() {
    ["t-about", "t-name", "t-phone", "t-email", "t-loc", "t-when"].forEach((k) => { const el = document.getElementById(k); if (el) st.text[k] = el.value.trim(); });
  }
  function files() {
    const ul = $("#t-list"); if (!ul) return;
    ul.innerHTML = st.files.map((n, i) => `<li><span>${RIO.esc(n)}</span><button type="button" data-rm="${i}" aria-label="Remove">×</button></li>`).join("");
  }

  function render() {
    $("#s-body").innerHTML = `<div class="f-step on">${body()}</div>`;
    $("#s-count").textContent = `Step ${step + 1} of ${STEPS.length}`;
    $("#s-prog").style.width = ((step + 1) / STEPS.length) * 100 + "%";
    document.querySelectorAll("#s-steps li").forEach((li, i) => { li.classList.toggle("on", i === step); li.classList.toggle("done", i < step); });
    $("#s-back").style.visibility = step ? "visible" : "hidden";
    const next = $("#s-next");
    next.innerHTML = step === LAST ? `Send Request ${RIO.ARR}` : `Continue ${RIO.ARR}`;
    $("#s-msg").textContent = "";
    if (step === 3) {
      RIO.fileDrop($("#t-drop"), $("#t-files"), (l) => { Array.from(l).forEach((f) => { if (f.size > (RIO.MAX_FILE || 2e7)) { alert(f.name + " is over 20 MB. Please send it on WhatsApp instead."); return; } if (!st.files.includes(f.name)) st.files.push(f.name); st.fileObjs[f.name] = f; }); files(); });
      $("#t-list").addEventListener("click", (e) => { const b = e.target.closest("[data-rm]"); if (b) { delete st.fileObjs[st.files[+b.dataset.rm]]; st.files.splice(+b.dataset.rm, 1); files(); } });
      files();
    }
  }

  function need(i) {
    if (i === 0 && !st.space) return "Choose a space to continue.";
    if (i === 1 && !st.needs.length) return "Choose at least one.";
    if (i === 2 && !st.qty) return "Choose a rough amount.";
    if (i === 3 && !st.text["t-phone"] && !st.text["t-email"]) return "Add a phone number or email so we can reply.";
    return "";
  }
  function go(i) {
    keepText();
    if (i > step) { for (let k = step; k < i; k++) { const m = need(k); if (m) { $("#s-msg").textContent = m; return; } } }
    step = Math.max(0, Math.min(LAST, i)); render();
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
      if (!Array.isArray(st[k])) setTimeout(() => go(step + 1), 250);
      return;
    }
    const g = e.target.closest("[data-go]"); if (g) go(+g.dataset.go);
  });
  $("#s-steps").addEventListener("click", (e) => { const li = e.target.closest("li.done"); if (li) go(+li.dataset.go); });
  $("#s-back").addEventListener("click", () => go(step - 1));
  $("#s-next").addEventListener("click", () => (step === LAST ? send() : go(step + 1)));

  function summary() {
    const T = st.text, sp = RIO.space(st.space);
    const L = [custom ? "RIO FURNITURES — CUSTOM PROJECT" : "RIO FURNITURES — PROJECT REQUEST"];
    L.push("Building: " + (sp ? sp.name : "-"), "Needs: " + st.needs.join(", "), "How much: " + st.qty + " pieces");
    if (T["t-when"] && T["t-when"] !== "Not sure yet") L.push("Needed: " + T["t-when"]);
    if (st.files.length) L.push("Files I'll share: " + st.files.join(", "));
    if (T["t-about"]) L.push("", T["t-about"]);
    L.push("");
    [["t-name", "Name"], ["t-phone", "Phone"], ["t-email", "Email"], ["t-loc", "Location"]].forEach(([k, n]) => { if (T[k]) L.push(n + ": " + T[k]); });
    return L.join("\n");
  }
  let savedOnce = false;
  function send() {
    keepText();
    const m = need(LAST); if (m) { $("#s-msg").textContent = m; return; }
    $("#s-msg").textContent = "";
    // Keep a copy as a project in this browser, so exact pieces can be added later
    if (!savedOnce) {
      const T = st.text, sp = RIO.space(st.space);
      const p = RIO.store.create(sp ? "New " + sp.name : "New project", st.space);
      p.notes = [st.needs.join(", ") + " · " + st.qty + " pcs", T["t-about"]].filter(Boolean).join("\n");
      p.files = st.files.slice();
      p.contact = { name: T["t-name"], phone: T["t-phone"], email: T["t-email"], location: T["t-loc"] };
      RIO.store.save(p); savedOnce = true;
    }
    const T = st.text;
    const row = {
      source: custom ? "custom" : "start", project_name: "", space: st.space, needs: st.needs, qty_range: st.qty,
      notes: T["t-about"] || "", files: st.files.slice(), _files: st.files.map((n) => st.fileObjs[n]), timeline: T["t-when"] && T["t-when"] !== "Not sure yet" ? T["t-when"] : "",
      contact_name: T["t-name"] || "", contact_phone: T["t-phone"] || "", contact_email: T["t-email"] || "", location: T["t-loc"] || ""
    };
    RIO.openSend(summary(), (custom ? "Custom project" : "Project request") + (RIO.space(st.space) ? " — " + RIO.space(st.space).name : ""), st.files.length > 0, row);
  }

  if (st.space) step = 1;
  render();
})();
