/* =========================================================
   RIO — content posted from the admin dashboard
   ---------------------------------------------------------
   Staff can post projects and furniture (with photos) from
   admin.html. This file fetches what they have published and
   adds it to RIO.PORTFOLIO and RIO.PRODUCTS, newest first, so
   every page shows it alongside what is written in data.js.

   Pages wait for it with:  RIO.whenReady(function () { ... });
   If the database is not set up, or is slow, pages simply show
   what is in data.js. Nothing breaks.
   ========================================================= */
(function () {
  const cfg = RIO.SUPABASE || {};
  const KEY = "rio.live.v1";
  const FRESH_MS = 60 * 1000;      // reuse the saved copy for a minute
  const WAIT_MS = 2500;            // never hold a page longer than this
  const base = { projects: RIO.PORTFOLIO.slice(), products: RIO.PRODUCTS.slice() };

  RIO.photoUrl = (path) => /^https?:/.test(path) ? path : cfg.url + "/storage/v1/object/public/site-photos/" + String(path).split("/").map(encodeURIComponent).join("/");

  function apply(data) {
    const projects = (data.projects || []).filter((r) => r.photos && r.photos.length).map((r) => ({
      no: String(r.id).slice(0, 8), space: RIO.space(r.space) ? r.space : "other", title: r.title, headline: r.title,
      story: r.story || null, photos: r.photos.map(RIO.photoUrl), video: null,
      building: null, supplied: [], materials: null, finishes: null, custom: null, placeholder: false, live: true
    }));
    const products = (data.products || []).filter((r) => r.photos && r.photos.length && !base.products.some((p) => p.id === r.slug)).map((r) => {
      const fins = (r.finishes || []).filter((f) => RIO.FINISHES[f]);
      const spaces = (r.spaces || []).filter((s) => RIO.space(s));
      const photos = r.photos.map(RIO.photoUrl);
      return {
        id: r.slug, name: r.name, icon: "custom", type: r.type || "", cats: [RIO.category(r.category) ? r.category : "custom"],
        spaces: spaces.length ? spaces : ["other"], desc: r.description || "", finishes: fins.length ? fins : ["black"],
        dims: null, materials: null, lead: null, price: null, image: photos[0], gallery: photos, live: true
      };
    });
    RIO.PORTFOLIO = projects.concat(base.projects);
    RIO.PRODUCTS = products.concat(base.products);
  }

  const read = () => { try { return JSON.parse(localStorage.getItem(KEY)); } catch (e) { return null; } };
  const save = (data) => { try { localStorage.setItem(KEY, JSON.stringify(Object.assign({ t: Date.now() }, data))); } catch (e) {} };

  async function get(table, order) {
    const res = await fetch(`${cfg.url}/rest/v1/${table}?select=*&published=eq.true&order=${order}`, { headers: { apikey: cfg.anonKey, Authorization: "Bearer " + cfg.anonKey } });
    if (!res.ok) throw new Error(table + " " + res.status);
    return res.json();
  }

  let ready = false; const waiting = [];
  const go = () => { if (ready) return; ready = true; waiting.splice(0).forEach((fn) => fn()); };
  RIO.whenReady = (fn) => (ready ? fn() : waiting.push(fn));

  const cached = read();
  if (!cfg.url || !cfg.anonKey || !window.fetch) return go();
  if (cached && Date.now() - cached.t < FRESH_MS) { apply(cached); return go(); }

  const timer = setTimeout(() => { if (cached) apply(cached); go(); }, WAIT_MS);
  Promise.all([get("site_projects", "created_at.desc"), get("site_products", "created_at.desc")])
    .then(([projects, products]) => { const data = { projects, products }; save(data); if (!ready) apply(data); })
    .catch(() => { if (!ready && cached) apply(cached); })
    .then(() => { clearTimeout(timer); go(); });
})();
