/* =========================================================
   RIO FURNITURES — My Project store
   Projects are saved in the visitor's browser (localStorage).
   Shape:
   { id, name, space, items: [{ pid, qty: { black: 40, white: 20 } }],
     notes, files: ["plan.pdf"], contact: {name, phone, email, location},
     created, updated }
   ========================================================= */

(function () {
  const KEY = "rio.projects.v1";
  const ACTIVE = "rio.activeProject.v1";
  let memory = { projects: [], active: null }; // fallback if storage is blocked

  function read() {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) { return memory.projects; }
  }
  function write(list) {
    memory.projects = list;
    try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) {}
    document.dispatchEvent(new CustomEvent("rio:projects"));
  }
  function getActiveId() {
    try { return localStorage.getItem(ACTIVE) || memory.active; } catch (e) { return memory.active; }
  }
  function setActiveId(id) {
    memory.active = id;
    try { localStorage.setItem(ACTIVE, id); } catch (e) {}
    document.dispatchEvent(new CustomEvent("rio:projects"));
  }
  const uid = () => "p" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

  const store = {
    all: () => read(),
    get: (id) => read().find((p) => p.id === id),
    active() {
      const list = read();
      const id = getActiveId();
      return list.find((p) => p.id === id) || list[0] || null;
    },
    setActive: setActiveId,
    create(name, space) {
      const list = read();
      const p = {
        id: uid(), name: name || "Untitled project", space: space || "",
        items: [], notes: "", files: [], contact: {},
        created: Date.now(), updated: Date.now()
      };
      list.unshift(p);
      write(list);
      setActiveId(p.id);
      return p;
    },
    save(p) {
      const list = read();
      const i = list.findIndex((x) => x.id === p.id);
      p.updated = Date.now();
      if (i === -1) list.unshift(p); else list[i] = p;
      write(list);
      return p;
    },
    remove(id) {
      const list = read().filter((p) => p.id !== id);
      write(list);
      if (getActiveId() === id && list[0]) setActiveId(list[0].id);
    },
    /* Adds finish quantities for a product. Same product merges into one line. */
    addItem(projectId, pid, qty) {
      const p = store.get(projectId);
      if (!p) return null;
      let line = p.items.find((it) => it.pid === pid);
      if (!line) { line = { pid, qty: {} }; p.items.push(line); }
      Object.keys(qty).forEach((f) => {
        const n = Math.max(0, parseInt(qty[f], 10) || 0);
        if (n) line.qty[f] = (line.qty[f] || 0) + n;
      });
      return store.save(p);
    },
    lineTotal: (line) => Object.values(line.qty || {}).reduce((a, b) => a + (+b || 0), 0),
    total: (p) => (p ? p.items.reduce((a, l) => a + store.lineTotal(l), 0) : 0)
  };

  window.RIO = window.RIO || {};
  RIO.store = store;
})();
