/* RIO — Spaces: a walk through the rooms */
(function () {
  const walk = document.getElementById("walk");
  const nav = document.getElementById("room-nav");
  const F = RIO.FINISHES;

  nav.innerHTML = RIO.SPACES.map((s) => `<a href="#${s.id}" data-s="${s.id}">${s.plural}</a>`).join("");

  walk.innerHTML = RIO.SPACES.map((s, i) => {
    const inRoom = [];
    (RIO.ROOMS[s.id] || RIO.ROOMS.other).objects.forEach((o) => { if (!inRoom.includes(o.pid)) inRoom.push(o.pid); });
    const more = RIO.PRODUCTS.filter((p) => p.spaces.includes(s.id) && !inRoom.includes(p.id)).map((p) => p.id);
    const list = inRoom.concat(more).slice(0, 8);
    return `
      <section class="walk-room" id="${s.id}" data-s="${s.id}">
        <div class="wrap walk-head">
          <div>
            <p class="mono muted">Room 0${i + 1}</p>
            <h2 class="serif s-xl reveal">${s.plural}</h2>
            <p class="lead mt-s"><em class="serif-i">${s.tagline}</em></p>
          </div>
          <div class="reveal" data-d="1">
            <p class="lead">${s.line}</p>
            <p class="walk-needs">${s.needs.join(" · ")}</p>
          </div>
        </div>
        ${RIO.room(s.id)}
        <div class="wrap walk-foot">
          <div>
            <p class="mono muted" style="margin:0 0 10px">In this room</p>
            <ul class="inroom">${list.map((pid) => {
              const p = RIO.product(pid);
              return `<li><button type="button" data-open="${pid}" data-room="${s.id}">
                <span class="th">${RIO.icon(p.icon, F[p.finishes[0]].hex)}</span>
                <span class="nm">${RIO.shortName(p)}<span class="mono muted">${RIO.code(p)}</span></span>
                <span class="go">→</span></button></li>`;
            }).join("")}</ul>
          </div>
          <div class="walk-cta">
            <p class="serif s-m" style="margin:0">Imagine it<br><em>as yours.</em></p>
            <a class="btn btn-o" href="start.html?space=${s.id}">Furnish this space <span class="arr">→</span></a>
            <button class="link" type="button" data-build="${s.id}">Build it piece by piece <span class="arr">→</span></button>
          </div>
        </div>
      </section>`;
  }).join("");

  RIO.bindRooms(walk);
  RIO.observeReveal(walk);

  walk.addEventListener("click", (e) => {
    const o = e.target.closest("[data-open]");
    if (o) RIO.openFocus(o.dataset.open, { room: o.dataset.room });
    const b = e.target.closest("[data-build]");
    if (b) {
      const s = RIO.space(b.dataset.build);
      const pr = RIO.store.create("New " + s.name, s.id);
      RIO.toast(`<span>Started <b>${RIO.esc(pr.name)}</b>. Click any piece in the room to add it.</span><a href="project.html">Open →</a>`);
    }
  });

  // highlight the room you're in
  const io = new IntersectionObserver((en) => en.forEach((e) => {
    if (e.isIntersecting) nav.querySelectorAll("a").forEach((a) => a.classList.toggle("on", a.dataset.s === e.target.dataset.s));
  }), { rootMargin: "-45% 0px -50% 0px" });
  walk.querySelectorAll(".walk-room").forEach((r) => io.observe(r));

  const q = RIO.qs("space");
  if (q && document.getElementById(q)) setTimeout(() => document.getElementById(q).scrollIntoView(), 60);
})();
