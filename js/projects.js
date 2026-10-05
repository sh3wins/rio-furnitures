/* RIO — Projects: real RIO work. The photographs do the talking. */
(function () {
  let f = "all";
  const nav = document.getElementById("pf"), box = document.getElementById("stories");
  const all = RIO.projects();
  const spaces = RIO.SPACES.filter((s) => all.some((p) => p.space === s.id));

  nav.innerHTML = [["all", "All"]].concat(spaces.map((s) => [s.id, s.plural])).map(([id, n]) => `<button type="button" data-f="${id}" class="${id === f ? "on" : ""}">${n}</button>`).join("");

  // Only facts we actually have are shown
  const fact = (label, value) => value ? `<div><dt>${label}</dt><dd>${value}</dd></div>` : "";
  function render() {
    box.innerHTML = all.filter((p) => f === "all" || p.space === f).map((p) => {
      const s = RIO.space(p.space);
      const facts = fact("Space", p.building && RIO.esc(p.building)) +
        fact("Furniture", p.supplied.length ? "<ul>" + p.supplied.map((x) => `<li>${RIO.esc(x)}</li>`).join("") + "</ul>" : "") +
        fact("Materials", p.materials && RIO.esc(p.materials)) + fact("Finishes", p.finishes && RIO.esc(p.finishes));
      const more = p.photos.slice(1, 3);
      return `
        <article class="story" id="p${p.no}">
          <div class="reveal">${p.video ? RIO.clip(p.video, p.photos[0], p.headline) : RIO.media(p.photos[0], { alt: p.headline })}</div>
          <div class="story-body">
            <div>
              <span class="meta">${s.name}</span>
              <h2 class="h-l">${RIO.esc(p.headline)}</h2>
              ${p.story ? `<p class="lead">${RIO.esc(p.story)}</p>` : ""}
            </div>
            <div>
              ${facts ? `<dl class="facts">${facts}</dl>` : ""}
              ${more.length ? `<div class="story-thumbs">${more.map((src) => RIO.media(src, { alt: p.headline })).join("")}</div>` : ""}
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
