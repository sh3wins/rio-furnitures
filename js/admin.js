/* =========================================================
   RIO — Admin dashboard
   Overview · Quote requests · Orders · Customers · Staff
   Data lives in Supabase (see supabase/schema.sql).
   ========================================================= */
(function () {
  const app = document.getElementById("app");
  const cfg = RIO.SUPABASE || {};
  const F = RIO.FINISHES;
  const STAGES = RIO.STAGES || ["Quote confirmed", "Design & drawings", "Materials", "Cutting & fabrication", "Assembly", "Finishing", "Quality control", "Packaging", "Out for delivery", "Delivered"];
  const STATUS = [["new", "New"], ["contacted", "Contacted"], ["quoted", "Quoted"], ["won", "Won"], ["lost", "Lost"]];
  const SOURCE = { project: "My Project", start: "Start a project", custom: "Custom project" };
  const SITE = "https://riofurniturekenya.com";

  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const pad = (n, l) => String(n).padStart(l || 3, "0");
  const today = () => new Date().toISOString().slice(0, 10);
  const fmtDate = (d) => { const x = new Date(d); return isNaN(x) ? (d || "") : x.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }); };
  const ago = (d) => {
    if (/^\d{4}-\d{2}-\d{2}$/.test(String(d))) { // date only (order updates)
      const days = Math.round((new Date(today()) - new Date(d)) / 86400000);
      return days <= 0 ? "today" : days === 1 ? "yesterday" : days < 7 ? days + "d ago" : fmtDate(d);
    }
    const s = (Date.now() - new Date(d).getTime()) / 1000;
    if (s < 60) return "just now"; if (s < 3600) return Math.floor(s / 60) + "m ago";
    if (s < 86400) return Math.floor(s / 3600) + "h ago"; if (s < 86400 * 7) return Math.floor(s / 86400) + "d ago";
    return fmtDate(d);
  };
  const spaceName = (id) => (RIO.space(id) || {}).plural || id || "—";
  const finText = (f) => (typeof f === "string" ? f : Object.entries(f || {}).map(([k, v]) => `${(F[k] || { name: k }).name} ${v}`).join(" · "));
  const waNum = (p) => { let d = String(p || "").replace(/\D/g, ""); if (d.startsWith("0")) d = "254" + d.slice(1); if (d.length === 9) d = "254" + d; return d; };
  const waLink = (p, t) => "https://wa.me/" + waNum(p) + (t ? "?text=" + encodeURIComponent(t) : "");
  const ALPHA = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  const makeCode = () => { const a = new Uint32Array(4); crypto.getRandomValues(a); return "RIO-" + Array.from(a, (v) => ALPHA[v % ALPHA.length]).join(""); };
  const trackUrl = (code) => SITE + "/track.html?order=" + encodeURIComponent(code);
  const logo = `<a class="logo" href="index.html"><span class="logo-mark">RIO<i>.</i></span><span class="logo-sub">Admin</span></a>`;

  let sb = null, user = null, me = null, Q = [], O = [], S = [];
  const ui = { quoteFilter: "new", orderFilter: "active", search: "" };

  /* ================= Boot ================= */
  if (!cfg.url || !cfg.anonKey || !window.supabase) return notConfigured();
  sb = window.supabase.createClient(cfg.url, cfg.anonKey);
  sb.auth.getSession().then(({ data }) => (data && data.session ? boot(data.session.user) : login()));
  sb.auth.onAuthStateChange((ev) => { if (ev === "SIGNED_OUT") { user = me = null; login(); } });

  function notConfigured() {
    app.innerHTML = `
      <div class="auth"><div class="auth-box">
        ${logo}
        <p class="mono muted">Admin</p>
        <h1 class="serif s-l">Not connected <em>yet.</em></h1>
        <p class="notice">The database isn't set up. Follow <code>ADMIN-SETUP.md</code> in the project folder, then paste your Supabase URL and anon key into <code>js/supabase-config.js</code>.</p>
      </div></div>`;
  }

  function login(msg) {
    app.innerHTML = `
      <main class="auth"><div class="auth-box">
        ${logo}
        <p class="mono muted">Staff only</p>
        <h1 class="serif s-l">Sign <em>in.</em></h1>
        <form id="login" novalidate>
          <div class="field"><label for="em">Email</label><input class="input" id="em" type="email" autocomplete="username" required></div>
          <div class="field"><label for="pw">Password</label><input class="input" id="pw" type="password" autocomplete="current-password" required></div>
          <p class="auth-msg" id="lm" role="alert">${esc(msg || "")}</p>
          <button class="btn btn-o" type="submit">Sign in <span class="arr">→</span></button>
        </form>
      </div></main>`;
    const f = document.getElementById("login");
    f.addEventListener("submit", async (e) => {
      e.preventDefault();
      const b = f.querySelector("button"); b.disabled = true; b.textContent = "Signing in…";
      const { data, error } = await sb.auth.signInWithPassword({ email: f.em.value.trim(), password: f.pw.value });
      if (error) { b.disabled = false; b.innerHTML = `Sign in <span class="arr">→</span>`; document.getElementById("lm").textContent = "That email and password didn't match."; return; }
      boot(data.user);
    });
    f.em.focus();
  }

  async function boot(u) {
    user = u;
    app.innerHTML = `<p class="loading wrap">Opening the workspace…</p>`;
    const { data, error } = await sb.from("staff").select("*").eq("user_id", u.id);
    me = data && data[0];
    if (error || !me) {
      app.innerHTML = `<div class="auth"><div class="auth-box">${logo}<p class="mono muted">Admin</p>
        <h1 class="serif s-l">Not on the <em>staff list.</em></h1>
        <p class="notice">You're signed in as <b>${esc(u.email)}</b>, but this account hasn't been added as staff. Ask the admin to add you (see <code>ADMIN-SETUP.md</code>, step 5).</p>
        <p class="mt-m"><button class="link" id="so">Sign out</button></p></div></div>`;
      document.getElementById("so").onclick = () => sb.auth.signOut();
      return;
    }
    await load();
    window.addEventListener("hashchange", route);
    route();
    setInterval(async () => { if (document.visibilityState === "visible" && !drawerOpen()) { await load(); route(true); } }, 90000);
  }

  async function load() {
    const [q, o, s] = await Promise.all([
      sb.from("quotes").select("*").order("created_at", { ascending: false }),
      sb.from("orders").select("*").order("updated_at", { ascending: false }),
      sb.from("staff").select("*")
    ]);
    Q = (q && q.data) || []; O = (o && o.data) || []; S = (s && s.data) || [];
  }

  /* ================= Shell ================= */
  const PAGES = [["overview", "Overview"], ["quotes", "Quote requests"], ["orders", "Orders"], ["customers", "Customers"]];
  function navHTML(active) {
    const newQ = Q.filter((q) => q.status === "new").length;
    return `${logo}
          <span class="grp">Workspace</span>
          ${PAGES.map(([k, t]) => `<a class="snav ${active === k ? "on" : ""}" href="#${k}" ${active === k ? 'aria-current="page"' : ""}><span class="t">${t}</span>${k === "quotes" && newQ ? `<span class="count">${newQ}</span>` : ""}</a>`).join("")}
          <span class="grp">Settings</span>
          <a class="snav ${active === "staff" ? "on" : ""}" href="#staff"><span class="t">Staff</span></a>
          <div class="foot">
            <span class="who" title="${esc(user.email)}">${esc(me.name || user.email)}</span>
            <a href="index.html" target="_blank" rel="noopener">View site ↗</a>
            <button id="signout">Sign out</button>
          </div>`;
  }
  function shell(active, html) {
    // Build the frame once; afterwards only the sidebar + page change (the drawer stays put)
    const main = document.getElementById("main");
    if (main) {
      const side = document.querySelector(".side");
      side.innerHTML = navHTML(active);
      document.getElementById("signout").onclick = () => sb.auth.signOut();
      const fresh = main.cloneNode(false); main.replaceWith(fresh); fresh.innerHTML = html;
      return;
    }
    const newQ = Q.filter((q) => q.status === "new").length;
    app.innerHTML = `
      <div class="shell">
        <nav class="side" aria-label="Admin">
          ${logo}
          <span class="grp">Workspace</span>
          ${PAGES.map(([k, t]) => `<a class="snav ${active === k ? "on" : ""}" href="#${k}" ${active === k ? 'aria-current="page"' : ""}><span class="t">${t}</span>${k === "quotes" && newQ ? `<span class="count">${newQ}</span>` : ""}</a>`).join("")}
          <span class="grp">Settings</span>
          <a class="snav ${active === "staff" ? "on" : ""}" href="#staff"><span class="t">Staff</span></a>
          <div class="foot">
            <span class="who" title="${esc(user.email)}">${esc(me.name || user.email)}</span>
            <a href="index.html" target="_blank" rel="noopener">View site ↗</a>
            <button id="signout">Sign out</button>
          </div>
        </nav>
        <main class="main" id="main">${html}</main>
      </div>
      <div class="drawer" id="drawer"><div class="bg" data-x></div><aside class="panel" role="dialog" aria-modal="true" id="panel"></aside></div>`;
    document.getElementById("signout").onclick = () => sb.auth.signOut();
    const d = document.getElementById("drawer");
    d.addEventListener("click", (e) => { if (e.target.closest("[data-x]")) closeDrawer(); });
  }
  const drawerOpen = () => { const d = document.getElementById("drawer"); return d && d.classList.contains("open"); };
  function openDrawer(html) {
    const p = document.getElementById("panel"); p.innerHTML = html; p.scrollTop = 0;
    document.getElementById("drawer").classList.add("open");
    document.body.style.overflow = "hidden";
    setTimeout(() => { const x = p.querySelector(".x"); if (x) x.focus(); }, 50);
  }
  function closeDrawer() {
    const d = document.getElementById("drawer"); if (d) d.classList.remove("open"); document.body.style.overflow = "";
    const page = (location.hash || "#overview").slice(1).split("/")[0]; history.replaceState(null, "", "#" + page);
  }
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && drawerOpen()) closeDrawer(); });

  function head(kicker, title, actions) {
    return `<div class="page-head"><div><span class="mono muted">${kicker}</span><h1 class="serif s-l">${title}</h1></div><div class="row">${actions || ""}<button class="btn btn-sm" id="refresh">Refresh</button></div></div>`;
  }
  function bindRefresh() { const r = document.getElementById("refresh"); if (r) r.onclick = async () => { r.textContent = "Refreshing…"; await load(); route(true); }; }

  function route(keep) {
    const h = (location.hash || "#overview").slice(1);
    const [page, id] = h.split("/");
    ({ overview, quotes, orders, customers, staff }[page] || overview)();
    bindRefresh();
    if (id && !keep) {
      if (page === "quotes") { const q = Q.find((x) => x.ref === id || x.id === id); if (q) quoteDrawer(q); }
      if (page === "orders") { const o = O.find((x) => x.code === id || x.id === id); if (o) orderDrawer(o); }
    }
  }

  /* ================= Overview ================= */
  function overview() {
    const hour = new Date().getHours();
    const greet = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
    const active = O.filter((o) => !o.archived && o.stage < 9);
    const inProd = active.filter((o) => o.stage >= 1 && o.stage <= 7);
    const out = active.filter((o) => o.stage === 8);
    const pieces = inProd.reduce((a, o) => a + (o.items || []).reduce((b, i) => b + (+i.qty || 0), 0), 0);
    const newQ = Q.filter((q) => q.status === "new");
    const byStage = STAGES.map((s, i) => active.filter((o) => o.stage === i).length);
    const maxS = Math.max(1, ...byStage);
    const feed = [
      ...Q.slice(0, 12).map((q) => ({ t: q.created_at, html: `<button class="t" data-q="${esc(q.ref)}">New quote request · ${esc(q.contact_name || "Someone")}</button><span class="s">${esc(q.ref)} · ${q.total_pieces ? q.total_pieces + " pieces" : esc(q.qty_range || "")} · ${spaceName(q.space)}</span>`, isNew: q.status === "new" })),
      ...O.flatMap((o) => (o.updates || []).slice(0, 2).map((u) => ({ t: u.date, html: `<button class="t" data-o="${esc(o.code)}">${esc(o.code)} · ${esc(u.text)}</button><span class="s">${esc(o.project)}</span>` })))
    ].sort((a, b) => new Date(b.t) - new Date(a.t)).slice(0, 10);

    shell("overview", `
      ${head(new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" }), `${greet}, <em>${esc((me.name || "").split(" ")[0] || "there")}.</em>`)}
      <section class="stats" aria-label="Summary">
        <div class="stat"><span class="mono muted">New quote requests</span><span class="n ${newQ.length ? "hot" : ""}">${pad(newQ.length, 2)}</span><span class="d">${Q.length} in total</span></div>
        <div class="stat"><span class="mono muted">In production</span><span class="n">${pad(inProd.length, 2)}</span><span class="d">orders being made</span></div>
        <div class="stat"><span class="mono muted">Out for delivery</span><span class="n">${pad(out.length, 2)}</span><span class="d">on the road</span></div>
        <div class="stat"><span class="mono muted">Pieces in production</span><span class="n">${pad(pieces)}</span><span class="d">across active orders</span></div>
      </section>
      <div class="cols">
        <div>
          <section class="block">
            <h2 class="title t-m">Needs a reply</h2>
            ${newQ.length ? `<ul class="feed">${newQ.slice(0, 6).map((q) => `<li class="new"><span class="dt"></span><span><button class="t" data-q="${esc(q.ref)}">${esc(q.contact_name || "Unnamed")} — ${esc(q.project_name || spaceName(q.space))}</button><span class="s">${esc(q.ref)} · ${q.total_pieces ? q.total_pieces + " pieces" : esc(q.qty_range || "—")} · ${esc(SOURCE[q.source] || "")}</span></span><time>${ago(q.created_at)}</time></li>`).join("")}</ul>`
              : `<p class="empty">All caught up. New requests from the website appear here.</p>`}
          </section>
          <section class="block">
            <h2 class="title t-m">Recent activity</h2>
            ${feed.length ? `<ul class="feed">${feed.map((f) => `<li class="${f.isNew ? "new" : ""}"><span class="dt"></span><span>${f.html}</span><time>${ago(f.t)}</time></li>`).join("")}</ul>` : `<p class="empty">Nothing yet.</p>`}
          </section>
        </div>
        <section class="block">
          <h2 class="title t-m">Production line</h2>
          <ul class="pipeline">${STAGES.slice(0, 9).map((s, i) => `<li class="${byStage[i] ? "has" : ""}"><span>${s}</span><span class="bar"><span style="width:${(byStage[i] / maxS) * 100}%"></span></span><span class="c">${byStage[i]}</span></li>`).join("")}</ul>
          <p class="mt-s"><a class="link" href="#orders">All orders <span class="arr">→</span></a></p>
        </section>
      </div>`);
    document.getElementById("main").addEventListener("click", (e) => {
      const q = e.target.closest("[data-q]"); if (q) { const x = Q.find((y) => y.ref === q.dataset.q); if (x) quoteDrawer(x); }
      const o = e.target.closest("[data-o]"); if (o) { const x = O.find((y) => y.code === o.dataset.o); if (x) orderDrawer(x); }
    });
  }

  /* ================= Quote requests ================= */
  function quotes() {
    const counts = Object.fromEntries(STATUS.map(([k]) => [k, Q.filter((q) => q.status === k).length]));
    const s = ui.search.toLowerCase();
    const list = Q.filter((q) => (ui.quoteFilter === "all" || q.status === ui.quoteFilter) &&
      (!s || [q.ref, q.contact_name, q.contact_phone, q.contact_email, q.project_name, q.location].join(" ").toLowerCase().includes(s)));
    shell("quotes", `
      ${head("Inbox", "Quote <em>requests.</em>")}
      <div class="row" style="justify-content:space-between;align-items:flex-end;margin-bottom:8px">
        <div class="filters">${[["all", "All", Q.length]].concat(STATUS.map(([k, l]) => [k, l, counts[k]])).map(([k, l, c]) => `<button data-f="${k}" class="${ui.quoteFilter === k ? "on" : ""}">${l} <span class="mono">${c}</span></button>`).join("")}</div>
        <input class="search" id="qs" placeholder="Search name, phone, ref…" value="${esc(ui.search)}" aria-label="Search quote requests">
      </div>
      ${list.length ? `<table class="list"><thead><tr><th>Ref</th><th>Customer</th><th class="hide-s">Space</th><th class="hide-s">From</th><th class="num">Pieces</th><th>Status</th><th class="hide-s">Received</th></tr></thead><tbody>
        ${list.map((q) => `<tr class="rowlink" tabindex="0" data-id="${q.id}">
          <td class="m">${esc(q.ref)}</td>
          <td>${esc(q.contact_name || "—")}<span class="sub">${esc(q.project_name || "")}</span></td>
          <td class="hide-s">${spaceName(q.space)}</td>
          <td class="hide-s">${esc(SOURCE[q.source] || q.source)}</td>
          <td class="num">${q.total_pieces || esc(q.qty_range || "—")}</td>
          <td><span class="pill ${q.status}">${(STATUS.find((x) => x[0] === q.status) || [0, q.status])[1]}</span></td>
          <td class="hide-s m">${ago(q.created_at)}</td></tr>`).join("")}
      </tbody></table>` : `<p class="empty">${Q.length ? "No requests match." : "No quote requests yet. When customers press “Send to RIO” on the website, they land here."}</p>`}`);
    const main = document.getElementById("main");
    main.querySelectorAll("[data-f]").forEach((b) => (b.onclick = () => { ui.quoteFilter = b.dataset.f; quotes(); bindRefresh(); }));
    const qs = document.getElementById("qs");
    qs.oninput = () => { ui.search = qs.value; const pos = qs.selectionStart; quotes(); bindRefresh(); const n = document.getElementById("qs"); n.focus(); n.setSelectionRange(pos, pos); };
    main.querySelectorAll("tr.rowlink").forEach((tr) => {
      const open = () => quoteDrawer(Q.find((q) => q.id === tr.dataset.id));
      tr.onclick = open; tr.onkeydown = (e) => { if (e.key === "Enter") open(); };
    });
  }

  function quoteDrawer(q) {
    history.replaceState(null, "", "#quotes/" + q.ref);
    const items = q.items || [];
    const linked = O.find((o) => o.quote_id === q.id);
    openDrawer(`
      <div class="d-top"><span class="mono muted">Quote request · ${esc(q.ref)}</span><button class="x" data-x aria-label="Close">×</button></div>
      <div class="d-body">
        <span class="mono muted">${fmtDate(q.created_at)} · ${esc(SOURCE[q.source] || q.source)}</span>
        <h2 class="serif s-m">${esc(q.project_name || spaceName(q.space) + " project")}</h2>
        <p class="muted" style="margin:0">${spaceName(q.space)}${q.total_pieces ? " · " + q.total_pieces + " pieces" : q.qty_range ? " · " + esc(q.qty_range) + " pieces" : ""}</p>

        <div class="d-sec"><span class="mono muted">Status</span>
          <div class="seg" id="qstatus">${STATUS.map(([k, l]) => `<button data-s="${k}" class="${q.status === k ? "on" : ""}">${l}</button>`).join("")}</div></div>

        <div class="d-sec"><span class="mono muted">Customer</span>
          <dl class="kv">
            <div><dt>Name</dt><dd>${esc(q.contact_name || "—")}</dd></div>
            <div><dt>Phone</dt><dd>${q.contact_phone ? `<a class="link" href="${waLink(q.contact_phone, "Hi " + (q.contact_name || "") + ", this is RIO about your project " + q.ref + ".")}" target="_blank" rel="noopener">${esc(q.contact_phone)} · WhatsApp</a>` : "—"}</dd></div>
            <div><dt>Email</dt><dd>${q.contact_email ? `<a class="link" href="mailto:${esc(q.contact_email)}?subject=${encodeURIComponent("Your RIO project " + q.ref)}">${esc(q.contact_email)}</a>` : "—"}</dd></div>
            <div><dt>Location</dt><dd>${esc(q.location || "—")}</dd></div>
            ${q.timeline ? `<div><dt>Needed</dt><dd>${esc(q.timeline)}</dd></div>` : ""}
          </dl></div>

        ${items.length ? `<div class="d-sec"><span class="mono muted">Furniture</span><ul class="items">${items.map((i) => `<li><span>${esc(i.name)}</span><span class="f">${esc(finText(i.finishes))}</span><span class="q">${pad(i.qty)}</span></li>`).join("")}</ul></div>` : ""}
        ${q.needs && q.needs.length ? `<div class="d-sec"><span class="mono muted">Needs</span><p style="margin:0">${q.needs.map(esc).join(", ")}${q.qty_range ? ` · ${esc(q.qty_range)} pieces` : ""}</p></div>` : ""}
        ${q.notes ? `<div class="d-sec"><span class="mono muted">Their notes</span><p style="margin:0;white-space:pre-wrap">${esc(q.notes)}</p></div>` : ""}
        ${q.files && q.files.length ? `<div class="d-sec"><span class="mono muted">Files they'll send</span><p style="margin:0">${q.files.map(esc).join(", ")}</p><p class="small muted">Files come by WhatsApp or email — ask for them if they haven't arrived.</p></div>` : ""}

        <div class="d-sec"><div class="field"><label for="qnote">Internal note (staff only)</label><textarea class="textarea" id="qnote" style="min-height:90px" placeholder="Call notes, pricing, next step…">${esc(q.internal_note || "")}</textarea></div></div>
        ${linked ? `<div class="d-sec"><span class="mono muted">Order</span><p style="margin:0"><button class="link" id="goorder">${esc(linked.code)} — ${STAGES[linked.stage]} <span class="arr">→</span></button></p></div>` : ""}
      </div>
      <div class="d-actions">
        <button class="btn btn-sm" id="qsave">Save note</button>
        ${linked ? "" : `<button class="btn btn-o btn-sm" id="mkorder">Create order <span class="arr">→</span></button>`}
        <span class="spacer"></span><span class="saved" id="qsaved"></span>
      </div>`);
    const saved = document.getElementById("qsaved");
    const upd = async (patch, msg) => {
      saved.className = "saved"; saved.textContent = "Saving…";
      const { error } = await sb.from("quotes").update(patch).eq("id", q.id);
      if (error) { saved.className = "saved err"; saved.textContent = "Couldn't save"; return false; }
      Object.assign(q, patch); saved.className = "saved ok"; saved.textContent = msg || "Saved"; return true;
    };
    document.getElementById("qstatus").onclick = async (e) => {
      const b = e.target.closest("[data-s]"); if (!b) return;
      if (await upd({ status: b.dataset.s }, "Status updated")) {
        document.querySelectorAll("#qstatus button").forEach((x) => x.classList.toggle("on", x === b));
        refreshBehind();
      }
    };
    document.getElementById("qsave").onclick = () => upd({ internal_note: document.getElementById("qnote").value });
    const mk = document.getElementById("mkorder");
    if (mk) mk.onclick = () => orderDrawer(draftFromQuote(q));
    const go = document.getElementById("goorder");
    if (go) go.onclick = () => orderDrawer(linked);
  }

  function draftFromQuote(q) {
    return {
      _new: true, code: makeCode(), quote_id: q.id,
      project: ((RIO.space(q.space) || {}).name || "Furniture") + " project", space: q.space || "",
      stage: 0, expected: "",
      items: (q.items || []).map((i) => ({ name: String(i.name || "").replace(/^RIO /, ""), qty: i.qty, finishes: finText(i.finishes) })),
      updates: [{ date: today(), text: "Order confirmed. Thank you for choosing RIO." }],
      customer_name: q.contact_name || "", customer_phone: q.contact_phone || "", customer_email: q.contact_email || "",
      private_note: "", archived: false
    };
  }

  /* ================= Orders ================= */
  function orders() {
    const f = ui.orderFilter;
    const list = O.filter((o) => f === "archived" ? o.archived : !o.archived && (f === "active" ? o.stage < 9 : f === "delivered" ? o.stage === 9 : true));
    const c = { active: O.filter((o) => !o.archived && o.stage < 9).length, delivered: O.filter((o) => !o.archived && o.stage === 9).length, archived: O.filter((o) => o.archived).length };
    shell("orders", `
      ${head("Production", "<em>Orders.</em>", `<button class="btn btn-o btn-sm" id="neworder">New order</button>`)}
      <div class="filters">${[["active", "In progress", c.active], ["delivered", "Delivered", c.delivered], ["archived", "Archived", c.archived]].map(([k, l, n]) => `<button data-f="${k}" class="${f === k ? "on" : ""}">${l} <span class="mono">${n}</span></button>`).join("")}</div>
      ${list.length ? `<table class="list"><thead><tr><th>Order</th><th>Project</th><th class="hide-s">Customer</th><th>Stage</th><th class="num hide-s">Pieces</th><th class="hide-s">Updated</th></tr></thead><tbody>
        ${list.map((o) => {
          const pcs = (o.items || []).reduce((a, i) => a + (+i.qty || 0), 0);
          return `<tr class="rowlink" tabindex="0" data-id="${o.id}">
            <td class="m">${esc(o.code)}</td>
            <td>${esc(o.project)}<span class="sub">${esc(o.expected || spaceName(o.space))}</span></td>
            <td class="hide-s">${esc(o.customer_name || "—")}</td>
            <td><div class="prog"><span class="bar"><span style="width:${(o.stage / 9) * 100}%"></span></span><span class="lbl">${STAGES[o.stage]}</span></div></td>
            <td class="num hide-s">${pcs}</td>
            <td class="m hide-s">${ago(o.updated_at)}</td></tr>`;
        }).join("")}
      </tbody></table>` : `<p class="empty">${O.length ? "Nothing here." : "No orders yet. Create one from a quote request, or press “New order”."}</p>`}`);
    const main = document.getElementById("main");
    main.querySelectorAll("[data-f]").forEach((b) => (b.onclick = () => { ui.orderFilter = b.dataset.f; orders(); bindRefresh(); }));
    document.getElementById("neworder").onclick = () => orderDrawer({ _new: true, code: makeCode(), project: "", space: "", stage: 0, expected: "", items: [{ name: "", qty: 1, finishes: "" }], updates: [], customer_name: "", customer_phone: "", customer_email: "", private_note: "", archived: false });
    main.querySelectorAll("tr.rowlink").forEach((tr) => {
      const open = () => orderDrawer(O.find((o) => o.id === tr.dataset.id));
      tr.onclick = open; tr.onkeydown = (e) => { if (e.key === "Enter") open(); };
    });
  }

  function orderDrawer(src) {
    const o = JSON.parse(JSON.stringify(src)); // edit a copy
    o.items = o.items || []; o.updates = o.updates || [];
    if (!o._new) history.replaceState(null, "", "#orders/" + o.code);
    let dirty = false;
    const render = () => {
      openDrawer(`
        <div class="d-top"><span class="mono muted">${o._new ? "New order" : "Order"} · ${esc(o.code)}</span><button class="x" data-x aria-label="Close">×</button></div>
        <div class="d-body">
          ${o._new ? "" : `<div class="linkbox"><span>${esc(trackUrl(o.code))}</span><button class="link" id="copy">Copy</button>${o.customer_phone ? `<a class="link" target="_blank" rel="noopener" href="${waLink(o.customer_phone, "Hi " + (o.customer_name || "") + ", you can follow your RIO order here: " + trackUrl(o.code))}">Send on WhatsApp</a>` : ""}</div>`}

          <div class="d-sec"><span class="mono muted">Stage — now: <span class="ink">${STAGES[o.stage]}</span></span>
            <ul class="stepper-v" id="stages">${STAGES.map((s, i) => `<li><button type="button" data-st="${i}" class="${i < o.stage ? "done" : i === o.stage ? "now" : ""}"><span class="mono">${pad(i + 1, 2)}</span>${s}</button></li>`).join("")}</ul></div>

          <div class="d-sec"><span class="mono muted">Shown on the tracking page</span>
            <p class="public-hint"><b>Public:</b> anyone with the order code sees these. No names, phone numbers or prices here.</p>
            <div class="f2">
              <div class="field"><label for="o-project">Project label</label><input class="input" id="o-project" value="${esc(o.project)}" placeholder="e.g. Restaurant fit-out, Westlands"></div>
              <div class="field"><label for="o-space">Space</label><select class="select" id="o-space"><option value="">—</option>${RIO.SPACES.map((s) => `<option value="${s.id}" ${o.space === s.id ? "selected" : ""}>${s.plural}</option>`).join("")}</select></div>
              <div class="field" style="grid-column:1/-1"><label for="o-exp">Expected</label><input class="input" id="o-exp" value="${esc(o.expected)}" placeholder="e.g. Delivery planned for late October"></div>
            </div>
            <div class="mt-m"><span class="mono muted">Furniture</span>
              <div id="items">${o.items.map((it, i) => `<div class="erow" data-i="${i}">
                <input data-k="name" value="${esc(it.name)}" placeholder="Piece — e.g. Chair 04" aria-label="Piece">
                <input data-k="qty" type="number" min="0" value="${esc(it.qty)}" aria-label="Quantity">
                <input class="fin-in" data-k="finishes" value="${esc(it.finishes)}" placeholder="Black 40 · White 20" aria-label="Finishes">
                <button type="button" data-rm="${i}" aria-label="Remove line">×</button></div>`).join("")}</div>
              <button type="button" class="addline" id="additem">+ Add a line</button>
            </div>
            <div class="mt-m"><span class="mono muted">Updates for the customer</span>
              <div class="newupdate mt-s"><input class="input" id="o-upd" placeholder="e.g. All parts cut. Moving to assembly." aria-label="New update"><button type="button" class="btn btn-sm" id="addupd">Add update</button></div>
              ${o.updates.length ? `<ul class="log">${o.updates.map((u, i) => `<li><span class="mono">${fmtDate(u.date)}</span><span>${esc(u.text)}</span><button type="button" data-rmu="${i}" aria-label="Remove update">×</button></li>`).join("")}</ul>` : ""}
            </div>
          </div>

          <div class="d-sec"><span class="mono muted">Private — staff only</span>
            <div class="f2 mt-s">
              <div class="field"><label for="o-cn">Customer name</label><input class="input" id="o-cn" value="${esc(o.customer_name)}"></div>
              <div class="field"><label for="o-cp">Phone / WhatsApp</label><input class="input" id="o-cp" value="${esc(o.customer_phone)}"></div>
              <div class="field"><label for="o-ce">Email</label><input class="input" id="o-ce" value="${esc(o.customer_email)}"></div>
              <div class="field"><label for="o-code">Order code</label><input class="input" id="o-code" value="${esc(o.code)}" ${o._new ? "" : "readonly"}></div>
              <div class="field" style="grid-column:1/-1"><label for="o-pn">Private note</label><textarea class="textarea" id="o-pn" style="min-height:80px" placeholder="Price agreed, deposit, delivery contact…">${esc(o.private_note)}</textarea></div>
            </div>
            ${o._new ? "" : `<label class="row small mt-s" style="gap:10px"><input type="checkbox" id="o-arch" ${o.archived ? "checked" : ""}> Archive this order (hides it from tracking)</label>`}
          </div>
        </div>
        <div class="d-actions">
          <button class="btn btn-o" id="osave">${o._new ? "Create order" : "Save changes"}</button>
          <span class="spacer"></span><span class="saved" id="osaved">${dirty ? "Unsaved changes" : ""}</span>
        </div>`);
      bind();
    };
    const collect = () => {
      const v = (id) => { const el = document.getElementById(id); return el ? el.value.trim() : ""; };
      o.project = v("o-project"); o.space = v("o-space"); o.expected = v("o-exp");
      o.customer_name = v("o-cn"); o.customer_phone = v("o-cp"); o.customer_email = v("o-ce"); o.private_note = document.getElementById("o-pn").value;
      if (o._new) o.code = v("o-code").toUpperCase() || o.code;
      const a = document.getElementById("o-arch"); if (a) o.archived = a.checked;
      document.querySelectorAll("#items .erow").forEach((r) => {
        const it = o.items[+r.dataset.i]; if (!it) return;
        r.querySelectorAll("[data-k]").forEach((inp) => { it[inp.dataset.k] = inp.dataset.k === "qty" ? Math.max(0, parseInt(inp.value, 10) || 0) : inp.value.trim(); });
      });
    };
    const mark = () => { dirty = true; const s = document.getElementById("osaved"); if (s) { s.className = "saved"; s.textContent = "Unsaved changes"; } };
    function bind() {
      const p = document.getElementById("panel");
      p.addEventListener("input", mark);
      document.getElementById("stages").onclick = (e) => { const b = e.target.closest("[data-st]"); if (!b) return; collect(); o.stage = +b.dataset.st; dirty = true; render(); };
      document.getElementById("additem").onclick = () => { collect(); o.items.push({ name: "", qty: 1, finishes: "" }); dirty = true; render(); };
      document.getElementById("items").onclick = (e) => { const b = e.target.closest("[data-rm]"); if (!b) return; collect(); o.items.splice(+b.dataset.rm, 1); dirty = true; render(); };
      document.getElementById("addupd").onclick = () => { const t = document.getElementById("o-upd").value.trim(); if (!t) return; collect(); o.updates.unshift({ date: today(), text: t }); dirty = true; render(); };
      document.getElementById("o-upd").onkeydown = (e) => { if (e.key === "Enter") { e.preventDefault(); document.getElementById("addupd").click(); } };
      p.querySelectorAll("[data-rmu]").forEach((b) => (b.onclick = () => { collect(); o.updates.splice(+b.dataset.rmu, 1); dirty = true; render(); }));
      const cp = document.getElementById("copy");
      if (cp) cp.onclick = () => { try { navigator.clipboard.writeText(trackUrl(o.code)); cp.textContent = "Copied"; } catch (x) {} };
      document.getElementById("osave").onclick = save;
    }
    async function save() {
      collect();
      const s = document.getElementById("osaved");
      if (!o.project) { s.className = "saved err"; s.textContent = "Add a project label first"; return; }
      s.className = "saved"; s.textContent = "Saving…";
      const row = { code: o.code, project: o.project, space: o.space, stage: o.stage, expected: o.expected,
        items: o.items.filter((i) => i.name), updates: o.updates, customer_name: o.customer_name, customer_phone: o.customer_phone,
        customer_email: o.customer_email, private_note: o.private_note, archived: !!o.archived };
      let res;
      if (o._new) { row.quote_id = o.quote_id || null; res = await sb.from("orders").insert(row).select().single(); }
      else res = await sb.from("orders").update(row).eq("id", o.id).select().single();
      if (res.error) { s.className = "saved err"; s.textContent = /duplicate|unique/i.test(res.error.message) ? "That order code is taken" : "Couldn't save"; return; }
      const saved = res.data;
      const i = O.findIndex((x) => x.id === saved.id);
      if (i === -1) O.unshift(saved); else O[i] = saved;
      if (o._new && o.quote_id) {
        const q = Q.find((x) => x.id === o.quote_id);
        if (q && q.status !== "won") { await sb.from("quotes").update({ status: "won" }).eq("id", q.id); q.status = "won"; }
      }
      Object.assign(o, saved); delete o._new; dirty = false;
      history.replaceState(null, "", "#orders/" + saved.code);
      render();
      const s2 = document.getElementById("osaved"); s2.className = "saved ok"; s2.textContent = "Saved — tracking page updated";
      refreshBehind();
    }
    render();
  }

  // re-draw the page behind the drawer without closing it
  function refreshBehind() {
    const page = (location.hash || "#overview").slice(1).split("/")[0];
    ({ overview, quotes, orders, customers, staff }[page] || overview)();
    bindRefresh();
  }

  /* ================= Customers ================= */
  function customers() {
    const map = new Map();
    const key = (n, p, e) => (waNum(p) || (e || "").toLowerCase() || (n || "").toLowerCase()).trim();
    const add = (n, p, e, when, kind) => {
      const k = key(n, p, e); if (!k) return;
      const c = map.get(k) || { name: n, phone: p, email: e, quotes: 0, orders: 0, last: when };
      c.name = c.name || n; c.phone = c.phone || p; c.email = c.email || e;
      c[kind]++; if (new Date(when) > new Date(c.last)) c.last = when;
      map.set(k, c);
    };
    Q.forEach((q) => add(q.contact_name, q.contact_phone, q.contact_email, q.created_at, "quotes"));
    O.forEach((o) => add(o.customer_name, o.customer_phone, o.customer_email, o.updated_at, "orders"));
    const s = ui.search.toLowerCase();
    const list = [...map.values()].filter((c) => !s || [c.name, c.phone, c.email].join(" ").toLowerCase().includes(s)).sort((a, b) => new Date(b.last) - new Date(a.last));
    shell("customers", `
      ${head("People", "<em>Customers.</em>")}
      <div class="row" style="justify-content:flex-end;margin-bottom:8px"><input class="search" id="cs" placeholder="Search name, phone, email…" value="${esc(ui.search)}" aria-label="Search customers"></div>
      ${list.length ? `<table class="list"><thead><tr><th>Name</th><th>Phone</th><th class="hide-s">Email</th><th class="num">Quotes</th><th class="num">Orders</th><th class="hide-s">Last seen</th></tr></thead><tbody>
        ${list.map((c) => `<tr><td>${esc(c.name || "—")}</td>
          <td>${c.phone ? `<a class="link" style="font-weight:400" href="${waLink(c.phone)}" target="_blank" rel="noopener">${esc(c.phone)}</a>` : "—"}</td>
          <td class="hide-s">${c.email ? `<a class="link" style="font-weight:400" href="mailto:${esc(c.email)}">${esc(c.email)}</a>` : "—"}</td>
          <td class="num">${c.quotes}</td><td class="num">${c.orders}</td><td class="m hide-s">${ago(c.last)}</td></tr>`).join("")}
      </tbody></table>` : `<p class="empty">Customers appear here from quote requests and orders.</p>`}`);
    const cs = document.getElementById("cs");
    cs.oninput = () => { ui.search = cs.value; const pos = cs.selectionStart; customers(); bindRefresh(); const n = document.getElementById("cs"); n.focus(); n.setSelectionRange(pos, pos); };
  }

  /* ================= Staff ================= */
  function staff() {
    shell("staff", `
      ${head("Settings", "<em>Staff.</em>")}
      <table class="list"><thead><tr><th>Name</th><th>Role</th><th class="hide-s">Added</th></tr></thead><tbody>
        ${S.map((p) => `<tr><td>${esc(p.name || "—")}${p.user_id === user.id ? ` <span class="mono muted">you</span>` : ""}</td><td>${p.role === "admin" ? "Admin" : "Staff"}</td><td class="m hide-s">${fmtDate(p.created_at)}</td></tr>`).join("")}
      </tbody></table>
      <div class="d-sec" style="max-width:640px">
        <span class="mono muted">Adding someone</span>
        <p class="notice">1. In Supabase, open <b>Authentication → Users → Add user</b> and create their email and password.<br>
        2. Open <b>SQL Editor</b> and run (with their email and name):<br>
        <code>insert into staff (user_id, name, role) select id, 'Their Name', 'staff' from auth.users where email = 'them@example.com';</code><br>
        3. They can now sign in here. To remove someone, delete their user in Authentication.</p>
      </div>`);
  }
})();
