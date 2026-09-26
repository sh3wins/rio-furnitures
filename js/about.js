/* RIO — About: how we build, how ordering works, visit */
(function () {
  const C = RIO.CONTACT;
  const MAKE = [
    ["Materials", "Timber, steel, boards and fabrics, chosen for how your space will be used."],
    ["Cutting", "Parts cut for the full quantity of your order."],
    ["Fabrication", "Frames and components made in the workshop."],
    ["Assembly", "Pieces put together and checked for fit."],
    ["Finishing", "The finishes you chose — several colours in one order."],
    ["Quality control", "Each piece checked before it's packed."],
    ["Packaging", "Protected for transport."],
    ["Delivery", "To your site, ready for opening day."]
  ];
  document.getElementById("proc").innerHTML = MAKE.map((m, i) => `
    <figure class="reveal">
      <div class="ph img-reveal" data-label="Photograph — ${m[0].toLowerCase()}"></div>
      <figcaption><span class="mono muted">0${i + 1}</span><span class="title" style="color:var(--paper)">${m[0]}</span><p>${m[1]}</p></figcaption>
    </figure>`).join("");

  const FLOW = [["Tell us what you're building", 1], ["Explore the spaces", 0], ["Choose your pieces", 0], ["Pick finishes — mix them", 0], ["Set quantities", 0], ["Add to your project", 1],
    ["Save it, come back, keep building", 0], ["Request a quote", 1], ["RIO reviews your project", 0], ["Manufacturing", 0], ["Delivery", 0]];
  document.getElementById("howto").innerHTML = FLOW.map(([t, o], i) => `<li class="${o ? "rio" : ""}"><span class="mono muted">${String(i + 1).padStart(2, "0")}</span>${t}</li>`).join("");

  document.getElementById("visit").innerHTML = `
    <div><p class="mono muted">Visit</p><h2 class="serif s-l">${C.location}</h2><p class="lead mt-s">${C.hours}</p></div>
    <div class="row" style="justify-content:flex-start">
      <a class="btn" href="https://wa.me/${C.whatsapp}" target="_blank" rel="noopener">WhatsApp ${C.phoneDisplay} <span class="arr">→</span></a>
      <a class="link" href="mailto:${C.email}">${C.email}</a>
    </div>`;
  RIO.observeReveal();
})();
