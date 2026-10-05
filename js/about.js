/* RIO — About: the workshop and how to reach us */
(function () {
  const C = RIO.CONTACT, ARR = RIO.ARR;

  document.getElementById("about-photo").innerHTML = RIO.media(RIO.IMAGES.about, { cls: "about-photo", sizes: "100vw" });

  // One real workshop clip leads the row; the rest are stills
  document.getElementById("steps").innerHTML = RIO.workshopSteps({ Build: "images/real/clip-welding.mp4" });

  document.getElementById("visit").innerHTML = `
    <div><h2 class="h-l">Visit us</h2><p class="lead mt-s">${C.location}<br>${C.hours}</p></div>
    <div class="row">
      <a class="btn" href="https://wa.me/${C.whatsapp}" target="_blank" rel="noopener">WhatsApp ${C.phoneDisplay} ${ARR}</a>
      <a class="link" href="mailto:${C.email}">${C.email}</a>
    </div>`;
  RIO.observeReveal();
})();
