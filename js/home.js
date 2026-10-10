/* RIO — home page */
RIO.whenReady(function () {
  const $ = (s) => document.querySelector(s);
  const F = RIO.FINISHES, ARR = RIO.ARR;

  /* ---------- Spaces: one large room first, then side by side ----------
     Only spaces that have a photo are shown. If that leaves one on its own
     at the end, it is shown large too. */
  const shown = RIO.HOME_SPACES.filter((id) => RIO.IMAGES[id]);
  $("#walk").innerHTML = shown.map((id, i) => {
    const s = RIO.space(id);
    // Each space is a category: the bar at the bottom says how many pieces are inside
    const n = RIO.PRODUCTS.filter((p) => !p.hidden && p.spaces.includes(s.id)).length;
    return `
      <a class="space reveal" href="${n ? "furniture.html?space=" + s.id : "spaces.html?space=" + s.id}">
        ${RIO.media(RIO.IMAGES[s.id])}
        <div class="space-cap">
          <h3 class="h-m">${s.plural}</h3>
          <p>${s.short}</p>
        </div>
        <span class="go">${n ? `See ${n} ${n === 1 ? "piece" : "pieces"}` : "See this space"} ${ARR}</span>
      </a>`;
  }).join("");

  /* ---------- A few pieces ---------- */
  const PICK = ["rope-armchair-set", "woven-chair-set", "dining-table-set", "high-table-set"];
  $("#pieces").innerHTML = PICK.map((id) => RIO.piece(RIO.product(id))).join("");
  // Say plainly that these four are not everything
  const total = RIO.PRODUCTS.filter((p) => !p.hidden).length;
  $("#pieces-count").textContent = `Showing ${PICK.length} of ${total} pieces`;
  $("#pieces-more").innerHTML = `See all ${total} pieces ${ARR}`;

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

  /* ---------- Reviews: the latest three that RIO has approved ---------- */
  RIO.fetchReviews(3).then((rows) => {
    if (!rows.length) return;
    $("#rv-home").innerHTML = rows.map(RIO.reviewCard).join("");
    $("#home-reviews").hidden = false;
    RIO.observeReveal($("#home-reviews"));
  });

  $("#ask-wa").href = "https://wa.me/" + RIO.CONTACT.whatsapp;
  RIO.observeReveal();
});
