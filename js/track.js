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
    // A quote reference (Q-XXXXX): show the request status, or jump to its order
    if (/^Q-/i.test(String(code).trim()) && RIO.trackQuote) {
      const q = await RIO.trackQuote(code);
      if (q && q.order_code) { input.value = q.order_code; return show(q.order_code); }
      if (q) return showQuote(q);
    }
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

  function showQuote(q) {
    msg.textContent = "";
    const STEPS = [["new", "Request received", "We've got your request and will review it shortly."],
      ["contacted", "We've been in touch", "Our team has reached out about your project."],
      ["quoted", "Quote sent", "Your quote is ready — check WhatsApp or email."],
      ["won", "Order confirmed", "Your order is being set up. Your order code will be sent to you."]];
    if (q.status === "lost") {
      out.innerHTML = `<section class="track-card reveal"><span class="mono muted">${RIO.esc(q.ref)}</span><h2 class="serif s-l">This request <em>is closed.</em></h2>
        <p class="lead mt-s">Want to pick it up again? <a class="link" href="https://wa.me/${C.whatsapp}?text=${encodeURIComponent("Hi RIO, about my request " + q.ref)}" target="_blank" rel="noopener">Message us on WhatsApp</a>.</p></section>`;
      RIO.observeReveal(out); return;
    }
    const at = Math.max(0, STEPS.findIndex((s) => s[0] === q.status));
    const sp = RIO.space(q.space);
    out.innerHTML = `
      <section class="track-card reveal">
        <div class="track-head">
          <div><span class="mono muted">${RIO.esc(q.ref)}${sp ? " · " + sp.plural : ""}</span>
            <h2 class="serif s-l">${RIO.esc(q.project_name || "Your project request")}</h2></div>
          <div class="track-now"><span class="mono muted">Now</span><span class="title t-l">${STEPS[at][1]}</span>
            <span class="muted small">${STEPS[at][2]}</span></div>
        </div>
        <div class="track-bar" aria-hidden="true"><span style="width:0" data-w="${(at / (STEPS.length - 1)) * 100}"></span></div>
        <ol class="track-stages" style="grid-template-columns:repeat(4,1fr)">
          ${STEPS.map((s, i) => `<li class="${i < at ? "done" : i === at ? "now" : ""}"><span class="mono">${String(i + 1).padStart(2, "0")}</span>${s[1]}</li>`).join("")}
        </ol>
        <p class="muted small mt-m">Sent ${new Date(q.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}${q.total_pieces ? " · " + q.total_pieces + " pieces" : q.qty_range ? " · " + RIO.esc(q.qty_range) + " pieces" : ""}. Once your order is confirmed, you'll get an order code to follow it through production.</p>
        <div class="track-help"><span class="muted">Questions?</span>
          <a class="link" href="https://wa.me/${C.whatsapp}?text=${encodeURIComponent("Hi RIO, a question about my request " + q.ref)}" target="_blank" rel="noopener">Message us on WhatsApp <span class="arr">→</span></a></div>
      </section>`;
    RIO.observeReveal(out);
    requestAnimationFrame(() => setTimeout(() => { const b = out.querySelector(".track-bar span"); if (b) b.style.width = b.dataset.w + "%"; }, 300));
    history.replaceState(null, "", "track.html?order=" + encodeURIComponent(q.ref));
  }

  form.addEventListener("submit", (e) => { e.preventDefault(); show(input.value); });
  const q = RIO.qs("order");
  if (q) { input.value = q; show(q); }
  RIO.observeReveal();
})();
