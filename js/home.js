/* RIO — home page */
RIO.whenReady(function () {
  const $ = (s) => document.querySelector(s);
  const F = RIO.FINISHES, ARR = RIO.ARR;

  /* ---------- Spaces: one large room, then two side by side, and again ---------- */
  $("#walk").innerHTML = RIO.HOME_SPACES.map((id, i) => {
    const s = RIO.space(id), wide = i % 3 === 0;
    return `
      <a class="space reveal ${wide ? "wide" : ""}" href="spaces.html?space=${s.id}">
        ${RIO.media(RIO.IMAGES[s.id])}
        <div class="space-cap">
          <h3 class="h-m">${s.plural}</h3>
          <p>${s.short}</p>
          <span class="link">Explore ${ARR}</span>
        </div>
      </a>`;
  }).join("");

  /* ---------- A few pieces ---------- */
  const PICK = ["rope-sofa", "chair-04", "table-08", "desk-03"];
  $("#pieces").innerHTML = PICK.map((id) => RIO.piece(RIO.product(id))).join("");

  /* ---------- Example order (shows how ordering in quantity works) ---------- */
  const SAMPLE = [["black", 15], ["natural", 10], ["white", 5]];
  $("#sample").innerHTML = SAMPLE.map(([f, n]) => `<li><span><span class="sw" data-f="${f}" style="background-color:${F[f].hex}"></span>${F[f].name}</span><span>${n}</span></li>`).join("") +
    `<li class="sample-total"><span>Total</span><span>${SAMPLE.reduce((a, x) => a + x[1], 0)} chairs</span></li>`;

  /* ---------- Real RIO projects ---------- */
  $("#proofs").innerHTML = RIO.projects().slice(0, 3).map((p) => `
    <a class="proof reveal" href="projects.html#p${p.no}">
      ${RIO.media(p.photos[0], { alt: p.headline })}
      <div class="proof-cap">
        <span class="meta">${RIO.space(p.space).name}</span>
        <h3 class="h-s">${RIO.esc(p.headline)}</h3>
        <span class="link">View project ${ARR}</span>
      </div>
    </a>`).join("");

  /* ---------- Workshop ---------- */
  $("#steps").innerHTML = RIO.WORKSHOP.map((w) => `
    <figure class="reveal">
      ${RIO.media(w.photo, { alt: "RIO workshop: " + w.name.toLowerCase() })}
      <figcaption><span class="h-s">${w.name}</span><span class="meta">${w.text}</span></figcaption>
    </figure>`).join("");

  $("#ask-wa").href = "https://wa.me/" + RIO.CONTACT.whatsapp;
  RIO.observeReveal();
});
