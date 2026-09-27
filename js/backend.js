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
  RIO.MAX_FILE = 20 * 1024 * 1024; // 20 MB, matches the storage bucket
  RIO.submitQuote = async function (row, onProgress) {
    if (!RIO.db) return { ok: false, reason: "offline" };
    const ref = RIO.makeCode("Q", 5);
    const fileObjs = (row._files || []).filter(Boolean);
    const clean = Object.assign({ status: "new" }, row, { ref });
    delete clean._files;
    // Upload the actual files first, into the private "quote-files" bucket
    const uploaded = [], failed = [];
    for (let i = 0; i < fileObjs.length; i++) {
      const f = fileObjs[i];
      if (onProgress) onProgress(i + 1, fileObjs.length, f.name);
      if (f.size > RIO.MAX_FILE) { failed.push(f.name); continue; }
      const safe = f.name.replace(/[^\w.\-]+/g, "_").slice(-80);
      const path = ref + "/" + Date.now().toString(36) + "-" + safe;
      try {
        const { error } = await RIO.db.storage.from("quote-files").upload(path, f, { contentType: f.type || undefined, upsert: false });
        if (error) failed.push(f.name); else uploaded.push(path);
      } catch (e) { failed.push(f.name); }
    }
    const sentNames = new Set(fileObjs.map((f) => f.name));
    const notAttached = (clean.files || []).filter((n) => !sentNames.has(n)); // names from an earlier visit
    clean.files = uploaded.concat(failed.concat(notAttached).map((n) => "not uploaded: " + n));
    try {
      const { error } = await RIO.db.from("quotes").insert(clean);
      if (error) return { ok: false, reason: error.message };
      return { ok: true, ref, uploaded: uploaded.length, failed: failed.concat(notAttached) };
    } catch (e) { return { ok: false, reason: String(e) }; }
  };

  /* Public quote lookup by reference (Q-XXXXX). */
  RIO.trackQuote = async function (ref) {
    if (!RIO.db) return undefined;
    try {
      const { data, error } = await RIO.db.rpc("track_quote", { p_ref: ref });
      if (error) return undefined;
      return (data && data[0]) || null;
    } catch (e) { return undefined; }
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
