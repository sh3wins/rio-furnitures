/* =========================================================
   RIO — talking to the database (public site)
   RIO.db            → Supabase client, or null when not set up
   RIO.submitQuote() → saves a quote request, returns its reference
   RIO.trackOrder()  → safe public lookup of one order code
   ========================================================= */
(function () {
  const cfg = RIO.SUPABASE || {};
  RIO.db = null;
  if (cfg.url && cfg.anonKey && window.supabase && window.supabase.createClient) {
    try { RIO.db = window.supabase.createClient(cfg.url, cfg.anonKey); } catch (e) { RIO.db = null; }
  }

  const ALPHA = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; // no 0/O/1/I confusion
  RIO.makeCode = function (prefix, n) {
    let s = "";
    const arr = new Uint32Array(n || 5);
    (window.crypto || window.msCrypto).getRandomValues(arr);
    arr.forEach((v) => (s += ALPHA[v % ALPHA.length]));
    return (prefix || "Q") + "-" + s;
  };

  /* Turn a My Project object into the database row shape */
  RIO.quoteFromProject = function (p) {
    const items = (p.items || []).map((it) => {
      const prod = RIO.product(it.pid) || { name: it.pid };
      const qty = RIO.store.lineTotal(it);
      const fin = {};
      Object.keys(it.qty || {}).forEach((f) => { if (it.qty[f] > 0) fin[f] = it.qty[f]; });
      return { name: prod.name, code: it.pid, qty, finishes: fin };
    }).filter((i) => i.qty > 0);
    const c = p.contact || {};
    return {
      source: "project", project_name: p.name || "", space: p.space || "",
      items, total_pieces: items.reduce((a, i) => a + i.qty, 0),
      notes: p.notes || "", files: p.files || [],
      contact_name: c.name || "", contact_phone: c.phone || "", contact_email: c.email || "", location: c.location || ""
    };
  };

  /* Save a quote request. Resolves { ok, ref } — never throws. */
  RIO.submitQuote = async function (row) {
    if (!RIO.db) return { ok: false, reason: "offline" };
    const ref = RIO.makeCode("Q", 5);
    const clean = Object.assign({ status: "new" }, row, { ref });
    try {
      const { error } = await RIO.db.from("quotes").insert(clean);
      if (error) return { ok: false, reason: error.message };
      return { ok: true, ref };
    } catch (e) { return { ok: false, reason: String(e) }; }
  };

  /* Public order lookup. Resolves an order object, null (not found) or undefined (no database). */
  RIO.trackOrder = async function (code) {
    if (!RIO.db) return undefined;
    try {
      const { data, error } = await RIO.db.rpc("track_order", { p_code: code });
      if (error) return undefined;
      return (data && data[0]) || null;
    } catch (e) { return undefined; }
  };
})();
