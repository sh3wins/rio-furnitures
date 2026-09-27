/* RIO — order tracking page */
(function () {
  const form = document.getElementById("track-form");
  const input = document.getElementById("track-code");
  const msg = document.getElementById("track-msg");
  const out = document.getElementById("track-result");
  const C = RIO.CONTACT;
  const norm = (s) => String(s || "").trim().toUpperCase().replace(/\s+/g, "");
  const fmt = (d) => { const x = new Date(d + "T00:00:00"); return isNaN(x) ? d : x.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }); };

  async function show(code) {
    out.innerHTML = "";
    if (!code) { msg.textContent = ""; return; }
    msg.textContent = "Looking up your order…";
    // Live database first; fall back to js/orders.js if the database isn't set up
    let o = RIO.trackOrder ? await RIO.trackOrder(code) : undefined;
    if (!o) o = (RIO.ORDERS || []).find((x) => norm(x.code) === norm(code)) || null;
    if (!o) {
      msg.innerHTML = `We couldn't find <b>${RIO.esc(code)}</b>. Check the code, or <a class="link" href="https://wa.me/${C.whatsapp}" target="_blank" rel="noopener">ask us on WhatsApp</a>.`;
      return;
    }
    msg.textContent = "";
    const st = Math.max(0, Math.min(RIO.STAGES.length - 1, o.stage | 0));
    const pct = (st / (RIO.STAGES.length - 1)) * 100;
    const total = (o.items || []).reduce((a, i) => a + (i.qty || 0), 0);
    const sp = RIO.space(o.space);
    out.innerHTML = `
      <section class="track-card reveal">
        <div class="track-head">
          <div><span class="mono muted">${RIO.esc(o.code)}${sp ? " · " + sp.plural : ""}</span>
            <h2 class="serif s-l">${RIO.esc(o.project || "Your order")}</h2></div>
          <div class="track-now"><span class="mono muted">Now</span><span class="title t-l">${RIO.STAGES[st]}</span>
            ${o.expected ? `<span class="muted small">${RIO.esc(o.expected)}</span>` : ""}</div>
        </div>
        <div class="track-bar" aria-hidden="true"><span style="width:0" data-w="${pct}"></span></div>
        <ol class="track-stages">
          ${RIO.STAGES.map((s, i) => `<li class="${i < st ? "done" : i === st ? "now" : ""}" ${i === st ? 'aria-current="step"' : ""}><span class="mono">${String(i + 1).padStart(2, "0")}</span>${s}</li>`).join("")}
        </ol>
        ${o.items && o.items.length ? `
        <div class="track-block"><span class="mono muted">In this order · ${total} pieces</span>
          <ul class="track-items">${o.items.map((i) => `<li><span>${RIO.esc(i.name)}</span><span class="muted">${RIO.esc(i.finishes || "")}</span><span class="mono ink">${String(i.qty || 0).padStart(3, "0")}</span></li>`).join("")}</ul></div>` : ""}
        ${o.updates && o.updates.length ? `
        <div class="track-block"><span class="mono muted">Updates</span>
          <ul class="track-log">${o.updates.map((u) => `<li><span class="mono muted">${fmt(u.date)}</span><span>${RIO.esc(u.text)}</span></li>`).join("")}</ul></div>` : ""}
        <div class="track-help"><span class="muted">Questions about this order?</span>
          <a class="link" href="https://wa.me/${C.whatsapp}?text=${encodeURIComponent("Hi RIO, a question about order " + o.code)}" target="_blank" rel="noopener">Message us on WhatsApp <span class="arr">→</span></a></div>
      </section>`;
    RIO.observeReveal(out);
    requestAnimationFrame(() => setTimeout(() => { const b = out.querySelector(".track-bar span"); if (b) b.style.width = b.dataset.w + "%"; }, 300));
    history.replaceState(null, "", "track.html?order=" + encodeURIComponent(o.code));
  }

  form.addEventListener("submit", (e) => { e.preventDefault(); show(input.value); });
  const q = RIO.qs("order");
  if (q) { input.value = q; show(q); }
  RIO.observeReveal();
})();
