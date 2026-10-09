/* RIO — home page */
RIO.whenReady(function () {
  const $ = (s) => document.querySelector(s);
  const F = RIO.FINISHES, ARR = RIO.ARR;

  /* ---------- Spaces: one large room first, then side by side ----------
     Only spaces that have a photo are shown. If that leaves one on its own
     at the end, it is shown large too. */
  const shown = RIO.HOME_SPACES.filter((id) => RIO.IMAGES[id]);
  $("#walk").innerHTML = shown.map((id, i) => {
    const s = RIO.space(id), wide = i === 0 || (i === shown.length - 1 && shown.length % 2 === 0);
    return `
      <a class="space reveal ${wide ? "wide" : ""}" href="spaces.html?space=${s.id}">
        ${RIO.media(RIO.IMAGES[s.id], { sizes: wide ? "100vw" : undefined })}
        <div class="space-cap">
          <h3 class="h-m">${s.plural}</h3>
          <p>${s.short}</p>
          <span class="link">Explore ${ARR}</span>
        </div>
      </a>`;
  }).join("");

  /* ---------- A few pieces ---------- */
  const PICK = ["rope-armchair-set", "woven-chair-set", "dining-table-set", "high-table-set"];
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
  $("#steps").innerHTML = RIO.workshopSteps({ Build: "images/real/clip-welding.mp4" });   // the welding clip plays; the rest are stills

  $("#ask-wa").href = "https://wa.me/" + RIO.CONTACT.whatsapp;
  RIO.observeReveal();
});
