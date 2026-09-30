/* RIO — Furniture */
(function () {
  let cat = RIO.qs("cat") || "all";
  let space = RIO.qs("space") || "all";
  const catEl = document.getElementById("f-cat"), spEl = document.getElementById("f-space"), list = document.getElementById("f-list");
  const CATS = RIO.CATEGORIES;
  if (!CATS.find((c) => c.id === cat)) cat = "all";

  spEl.innerHTML = `<option value="all">Any space</option>` + RIO.SPACES.map((s) => `<option value="${s.id}" ${space === s.id ? "selected" : ""}>${s.plural}</option>`).join("");
  function nav() {
    catEl.innerHTML = [["all", "Everything"]].concat(CATS.map((c) => [c.id, c.name]))
      .map(([id, n]) => `<button type="button" class="${cat === id ? "on" : ""}" data-cat="${id}" aria-pressed="${cat === id}">${n}</button>`).join("");
  }
  const custom = `
    <div class="f-custom reveal">
      <p class="mono muted" style="margin:0">Custom</p>
      <p class="serif s-m" style="margin:0">Can't find it?<br><em>Let's make it.</em></p>
      <a class="link" href="start.html?mode=custom">Start a custom project <span class="arr">→</span></a>
    </div>`;
  function render() {
    const match = (p) => space === "all" || p.spaces.includes(space);
    const groups = (cat === "all" ? CATS : CATS.filter((c) => c.id === cat))
      .map((c) => ({ c, items: RIO.PRODUCTS.filter((p) => !p.hidden && p.cats.includes(c.id) && match(p)) }))
      .filter((g) => g.items.length);
    // in "Everything", show each product once, under its first category
    const seen = new Set();
    if (cat === "all") groups.forEach((g) => { g.items = g.items.filter((p) => !seen.has(p.id) && seen.add(p.id)); });
    list.innerHTML = groups.filter((g) => g.items.length).map((g, gi, arr) => `
      <section class="f-group">
        <div class="f-group-head"><h2 class="serif s-m">${g.c.name}</h2><span class="mono muted">${String(g.items.length).padStart(2, "0")}</span></div>
        <p class="f-sub">${g.c.sub.join(" · ")}</p>
        <div class="f-grid">${g.items.map((p, i) => RIO.piece(p, i % 3)).join("")}${gi === arr.length - 1 ? custom : ""}</div>
      </section>`).join("") || `<section class="f-group"><p class="lead">Nothing here yet for that space.</p><div class="f-grid mt-m">${custom}</div></section>`;
    RIO.observeReveal(list);
    const q = new URLSearchParams();
    if (cat !== "all") q.set("cat", cat); if (space !== "all") q.set("space", space);
    history.replaceState(null, "", "furniture.html" + (q.toString() ? "?" + q : ""));
  }
  catEl.addEventListener("click", (e) => { const b = e.target.closest("[data-cat]"); if (b) { cat = b.dataset.cat; nav(); render(); } });
  spEl.addEventListener("change", () => { space = spEl.value; render(); });
  RIO.bindPieces(list);
  nav(); render();
})();
