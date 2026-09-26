/* RIO — Projects: stories first, numbers second */
(function () {
  let f = "all";
  const nav = document.getElementById("pf"), box = document.getElementById("stories");
  const tbc = `<span class="tbc">to be added</span>`;
  const label = (s) => s.plural;

  nav.innerHTML = [["all", "All"]].concat(RIO.SPACES.map((s) => [s.id, label(s)])).map(([id, n]) => `<button type="button" data-f="${id}" class="${id === f ? "on" : ""}">${n}</button>`).join("");
  function render() {
    box.innerHTML = RIO.PORTFOLIO.filter((p) => f === "all" || p.space === f).map((p) => {
      const s = RIO.space(p.space);
      const ph = (i, cls, lbl) => p.photos[i] ? `<div class="ph has-img ${cls}"><img src="${p.photos[i]}" alt="${RIO.esc(p.headline || p.title)}" loading="lazy"></div>` : `<div class="ph ${cls}" data-label="${lbl}"></div>`;
      return `
        <article class="story" id="p${p.no}">
          <div class="img-reveal">${ph(0, "hero-ph", label(s) + " — the finished space")}</div>
          <div class="story-body">
            <div class="reveal">
              <span class="mono muted">Project ${p.no} · ${label(s)}</span>
              <h2 class="serif s-l">${p.headline ? RIO.esc(p.headline) : `${RIO.esc(p.title)}<br><em>— story coming soon</em>`}</h2>
              <p class="lead mt-s">${p.story ? RIO.esc(p.story) : "Photographs and the story of this space will appear here."}</p>
              ${p.placeholder ? `<p class="note-edit">Placeholder — add the real project in <code>js/data.js → RIO.PORTFOLIO</code>.</p>` : ""}
            </div>
            <div class="reveal" data-d="1">
              <dl>
                <div><dt class="mono muted">Building</dt><dd>${p.building ? RIO.esc(p.building) : tbc}</dd></div>
                <div><dt class="mono muted">Furniture supplied</dt><dd>${p.supplied.length ? "<ul>" + p.supplied.map((x) => `<li>${RIO.esc(x)}</li>`).join("") + "</ul>" : tbc}</dd></div>
                <div><dt class="mono muted">Materials</dt><dd>${p.materials ? RIO.esc(p.materials) : tbc}</dd></div>
                <div><dt class="mono muted">Finishes</dt><dd>${p.finishes ? RIO.esc(p.finishes) : tbc}</dd></div>
              </dl>
              <div class="story-thumbs">${ph(1, "", "Detail")}${ph(2, "", "Detail")}</div>
            </div>
          </div>
        </article>`;
    }).join("");
    RIO.observeReveal(box);
  }
  nav.addEventListener("click", (e) => {
    const b = e.target.closest("[data-f]"); if (!b) return; f = b.dataset.f;
    nav.querySelectorAll("button").forEach((x) => x.classList.toggle("on", x === b)); render();
  });
  render();
  if (location.hash) setTimeout(() => { const el = document.querySelector(location.hash); if (el) el.scrollIntoView(); }, 60);
})();
