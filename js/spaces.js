/* RIO — Spaces: each kind of space, a photo, and the furniture made for it */
(function () {
  const box = document.getElementById("rooms");
  const nav = document.getElementById("room-nav");
  const ARR = RIO.ARR;

  nav.innerHTML = RIO.SPACES.map((s) => `<a href="#${s.id}" data-s="${s.id}">${s.plural}</a>`).join("");

  box.innerHTML = RIO.SPACES.map((s) => {
    const image = RIO.IMAGES[s.id];
    const pieces = RIO.PRODUCTS.filter((p) => !p.hidden && p.spaces.includes(s.id)).slice(0, 4);
    return `
      <section class="room ${image ? "" : "plain"}" id="${s.id}" data-s="${s.id}">
        ${image ? RIO.media(image, { cls: "reveal" }) : ""}
        <div class="room-head">
          <div>
            <h2 class="h-l">${s.plural}</h2>
            <p class="lead mt-s">${s.short}</p>
          </div>
          <div>
            <p>${s.line}</p>
            <p class="meta room-needs">${s.needs.join(" · ")}</p>
            <div class="row">
              <a class="btn" href="start.html?space=${s.id}">Furnish this space</a>
              ${pieces.length ? `<a class="link" href="furniture.html?space=${s.id}">All furniture for ${s.plural.toLowerCase()} ${ARR}</a>` : ""}
            </div>
          </div>
        </div>
        ${pieces.length ? `<div class="cards four">${pieces.map((p) => RIO.piece(p)).join("")}</div>` : ""}
      </section>`;
  }).join("");
  RIO.observeReveal(box);

  // Mark the space you are looking at in the bar at the top
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((en) => en.forEach((e) => {
      if (e.isIntersecting) nav.querySelectorAll("a").forEach((a) => a.classList.toggle("on", a.dataset.s === e.target.dataset.s));
    }), { rootMargin: "-40% 0px -55% 0px" });
    box.querySelectorAll(".room").forEach((r) => io.observe(r));
  }

  const q = RIO.qs("space");
  if (q && document.getElementById(q)) setTimeout(() => document.getElementById(q).scrollIntoView(), 60);
})();
