/* RIO — homepage: the showroom */
(function () {
  const $ = (s) => document.querySelector(s);
  const F = RIO.FINISHES;

  /* ---------- Room viewer ---------- */
  const stage = $("#stage"), idx = $("#room-index");
  stage.innerHTML = RIO.SPACES.map((s, i) => `<div class="slide ${i === 0 ? "on" : ""}" data-s="${s.id}" ${i ? 'aria-hidden="true"' : ""}>${RIO.room(s.id)}</div>`).join("") +
    `<p class="stage-hint mono" aria-hidden="true"><span class="dot-o"></span> Hover or tap the furniture</p>`;
  idx.innerHTML = RIO.SPACES.map((s, i) => `<li><button type="button" class="${i === 0 ? "on" : ""}" data-s="${s.id}" aria-pressed="${i === 0}"><span class="mono">0${i + 1}</span>${s.name}</button></li>`).join("");
  RIO.bindRooms(stage);

  let cur = RIO.SPACES[0].id, started = false;
  function show(id) {
    const next = stage.querySelector(`.slide[data-s="${id}"]`);
    const prev = stage.querySelector(".slide.on");
    if (prev && prev !== next) {
      prev.classList.remove("on"); prev.setAttribute("aria-hidden", "true");
      setTimeout(() => prev.querySelector(".room").classList.remove("shown"), 900);
    }
    next.classList.add("on"); next.removeAttribute("aria-hidden");
    const room = next.querySelector(".room");
    room.classList.remove("shown");
    setTimeout(() => room.classList.add("shown"), 250);
    cur = id;
    idx.querySelectorAll("button").forEach((b) => { const on = b.dataset.s === id; b.classList.toggle("on", on); b.setAttribute("aria-pressed", on); });
    const sp = RIO.space(id);
    $("#explore-room").href = "spaces.html?space=" + id;
    $("#explore-room").innerHTML = `Explore the ${sp.name.toLowerCase()} <span class="arr">→</span>`;
    $("#furnish-room").href = "start.html?space=" + id;
  }
  idx.addEventListener("click", (e) => { const b = e.target.closest("[data-s]"); if (b && b.dataset.s !== cur) show(b.dataset.s); });

  // first entrance + a brief hint that the furniture is interactive
  const io = new IntersectionObserver((en) => {
    if (en[0].isIntersecting && !started) {
      started = true; io.disconnect(); show(cur);
      const r = stage.querySelector(".slide.on .room");
      setTimeout(() => r.classList.add("hint"), 2200);
      setTimeout(() => r.classList.remove("hint"), 5200);
    }
  }, { threshold: 0.3 });
  io.observe(stage);

  /* ---------- Selected pieces ---------- */
  const PICK = ["chair-04", "stool-02", "bed-01", "desk-03"];
  $("#pieces").innerHTML = PICK.map((id, i) => {
    const p = RIO.product(id);
    return `
      <article class="piece reveal" data-d="${i % 4}" data-id="${id}">
        <a class="plinth" href="product.html?id=${id}" aria-label="${RIO.esc(p.name)}">${RIO.visual(p, p.finishes[0])}</a>
        <div class="piece-meta">
          <div><span class="mono muted">${RIO.code(p)}</span><h3 class="title t-m"><a href="product.html?id=${id}">${RIO.shortName(p)}</a></h3></div>
          <div class="dots">${p.finishes.map((f, k) => `<button type="button" class="${k ? "" : "on"}" data-f="${f}" style="background:${F[f].hex}" aria-label="${F[f].name}"></button>`).join("")}</div>
        </div>
      </article>`;
  }).join("");
  $("#pieces").addEventListener("mouseover", (e) => swap(e));
  $("#pieces").addEventListener("click", (e) => swap(e));
  function swap(e) {
    const b = e.target.closest(".dots button"); if (!b) return;
    const card = b.closest(".piece"), p = RIO.product(card.dataset.id);
    if (b.classList.contains("on") || p.image) return;
    card.querySelectorAll(".dots button").forEach((x) => x.classList.toggle("on", x === b));
    const svg = card.querySelector(".plinth svg");
    svg.style.opacity = 0;
    setTimeout(() => { svg.outerHTML = RIO.icon(p.icon, F[b.dataset.f].hex); card.querySelector(".plinth svg").style.opacity = 1; }, 220);
  }

  /* ---------- Ordering demo ---------- */
  const DEMO = [["black", 40], ["white", 20], ["orange", 10], ["natural", 5]];
  $("#demo-rows").innerHTML = DEMO.map(([f]) => `<div class="demo-row"><span><span class="sw" style="background:${F[f].hex}"></span> ${F[f].name}</span><span class="mono ink" data-n>000</span></div>`).join("");
  const dio = new IntersectionObserver((en) => {
    if (!en[0].isIntersecting) return; dio.disconnect();
    const rows = $("#demo-rows").querySelectorAll("[data-n]");
    let run = 0;
    DEMO.forEach(([f, n], i) => setTimeout(() => {
      RIO.animateNumber(rows[i], n, 900, 3);
      rows[i].closest(".demo-row").classList.add("on");
      run += n; RIO.animateNumber($("#demo-n"), run, 900, 3);
      $("#demo-bar").innerHTML = DEMO.slice(0, i + 1).map(([g, m]) => `<span style="width:${(m / 75) * 100}%;background:${F[g].hex}"></span>`).join("");
    }, 500 + i * 650));
  }, { threshold: 0.5 });
  dio.observe($("#demo"));

  /* ---------- Gallery ---------- */
  const G = RIO.PORTFOLIO.slice(0, 3);
  $("#gallery").innerHTML = G.map((p, i) => {
    const s = RIO.space(p.space), photo = p.photos[0];
    return `
      <a class="g-item g${i}" href="projects.html#p${p.no}">
        <div class="ph img-reveal ${photo ? "has-img" : ""}" data-label="${s.name} — project photograph">${photo ? `<img src="${photo}" alt="${RIO.esc(p.title)}" loading="lazy">` : ""}</div>
        <div class="g-cap"><span class="mono muted">Project ${p.no} · ${s.name}</span><span class="serif s-s">${p.headline ? RIO.esc(p.headline) : `<em>Story coming soon</em>`}</span></div>
      </a>`;
  }).join("");

  /* ---------- Workshop strip ---------- */
  const MAKE = [["Workshop", "Where every piece starts."], ["Materials", "Chosen for how the space is used."], ["Cutting", "Parts cut for your full quantity."], ["Assembly", "Frames joined by hand."],
    ["Finishing", "The finishes you picked, mixed in one order."], ["Quality control", "Every piece checked."], ["Packaging", "Protected for the trip."], ["Delivery", "To your space, ready to open."]];
  $("#strip").innerHTML = MAKE.map((m, i) => `
    <figure class="step">
      <div class="ph" data-label="Photograph — ${m[0].toLowerCase()}"></div>
      <figcaption><span class="mono muted">0${i + 1}</span><span class="title">${m[0]}</span><span class="muted small">${m[1]}</span></figcaption>
    </figure>`).join("");
  // gentle horizontal drift with scroll (desktop only)
  const strip = $("#strip"), sec = strip.closest("section");
  const mq = window.matchMedia("(min-width: 900px) and (prefers-reduced-motion: no-preference)");
  function drift() {
    if (!mq.matches) { strip.style.transform = ""; return; }
    const r = sec.getBoundingClientRect(), vh = window.innerHeight;
    const k = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
    const max = strip.scrollWidth - strip.parentElement.clientWidth;
    strip.style.transform = `translateX(${-k * Math.max(0, max) * 0.9}px)`;
  }
  window.addEventListener("scroll", () => requestAnimationFrame(drift), { passive: true });
  window.addEventListener("resize", drift); drift();

  RIO.observeReveal();
})();
