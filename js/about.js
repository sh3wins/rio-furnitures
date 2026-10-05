/* RIO — About: the workshop and how to reach us */
(function () {
  const C = RIO.CONTACT, ARR = RIO.ARR;

  document.getElementById("about-photo").innerHTML = RIO.media(RIO.IMAGES.about, { cls: "about-photo" });

  // One real workshop clip leads the row; the rest are stills
  const CLIP = { Build: "images/real/clip-welding.mp4" };
  document.getElementById("steps").innerHTML = RIO.WORKSHOP.map((w) => `
    <figure class="reveal">
      ${CLIP[w.name] ? RIO.clip(CLIP[w.name], w.photo, "RIO workshop: " + w.name.toLowerCase()) : RIO.media(w.photo, { alt: "RIO workshop: " + w.name.toLowerCase() })}
      <figcaption><span class="h-s">${w.name}</span><span class="meta">${w.text}</span></figcaption>
    </figure>`).join("");

  document.getElementById("visit").innerHTML = `
    <div><span class="eyebrow">Visit</span><h2 class="h-l">${C.location}</h2><p class="lead mt-s">${C.hours}</p></div>
    <div class="row">
      <a class="btn" href="https://wa.me/${C.whatsapp}" target="_blank" rel="noopener">WhatsApp ${C.phoneDisplay} ${ARR}</a>
      <a class="link" href="mailto:${C.email}">${C.email}</a>
    </div>`;
  RIO.observeReveal();
})();
