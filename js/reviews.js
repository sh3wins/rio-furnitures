/* RIO — Reviews
   Shows the reviews RIO has approved, and lets a customer send a new one
   with a star rating and up to three photos. A new review is NOT public
   until staff approve it in the dashboard (Website → Reviews).
   Needs supabase/update-4-reviews.sql to have been run once. */
(function () {
  const $ = (s) => document.querySelector(s);
  const list = $("#rv-list"), sum = $("#rv-summary");

  /* ---------- Approved reviews ---------- */
  RIO.fetchReviews().then((rows) => {
    if (!rows.length) { sum.textContent = "No reviews yet. If you've bought from RIO, be the first to leave one."; return; }
    const avg = rows.reduce((a, r) => a + r.rating, 0) / rows.length;
    sum.textContent = `${avg.toFixed(1)} out of 5, from ${rows.length} ${rows.length === 1 ? "review" : "reviews"}.`;
    list.innerHTML = rows.map(RIO.reviewCard).join("");
    RIO.observeReveal(list);
  });

  /* ---------- Leave a review ---------- */
  const form = $("#rv-form"), msg = $("#rv-msg"), btn = $("#rv-send"), thumbs = $("#rv-thumbs");
  const MAX = 3; let rating = 0, photos = [];

  const stars = Array.from(document.querySelectorAll("#rv-rate button"));
  const setRating = (n) => { rating = n; stars.forEach((b) => { const on = +b.dataset.n <= n; b.classList.toggle("on", on); b.setAttribute("aria-checked", +b.dataset.n === n); }); msg.textContent = ""; };
  stars.forEach((b) => b.addEventListener("click", () => setRating(+b.dataset.n)));
  $("#rv-rate").addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight" || e.key === "ArrowUp") { e.preventDefault(); setRating(Math.min(5, rating + 1)); stars[rating - 1].focus(); }
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") { e.preventDefault(); setRating(Math.max(1, rating - 1)); stars[rating - 1].focus(); }
  });

  function drawThumbs() {
    thumbs.innerHTML = photos.map((p, i) => `<li><img src="${p.url}" alt="Photo ${i + 1}"><button type="button" data-rm="${i}" aria-label="Remove photo ${i + 1}">×</button></li>`).join("");
  }
  RIO.fileDrop($("#rv-drop"), $("#rv-files"), (files) => {
    Array.from(files).forEach((f) => {
      if (!/^image\//.test(f.type) && !/\.(jpe?g|png|webp|heic)$/i.test(f.name)) return;
      if (photos.length >= MAX) { msg.textContent = "Up to 3 photos."; return; }
      photos.push({ file: f, url: URL.createObjectURL(f) });
    });
    $("#rv-files").value = ""; drawThumbs();
  });
  thumbs.addEventListener("click", (e) => { const b = e.target.closest("[data-rm]"); if (b) { photos.splice(+b.dataset.rm, 1); drawThumbs(); msg.textContent = ""; } });

  /* Make a phone photo small before it uploads: longest side 1600px, JPEG. */
  async function shrink(file) {
    let bmp;
    try { bmp = await createImageBitmap(file, { imageOrientation: "from-image" }); }
    catch (e) { bmp = await new Promise((res, rej) => { const im = new Image(); im.onload = () => res(im); im.onerror = () => rej(new Error("unreadable")); im.src = URL.createObjectURL(file); }); }
    const k = Math.min(1, 1600 / Math.max(bmp.width, bmp.height));
    const c = document.createElement("canvas"); c.width = Math.round(bmp.width * k); c.height = Math.round(bmp.height * k);
    c.getContext("2d").drawImage(bmp, 0, 0, c.width, c.height);
    const blob = await new Promise((res) => c.toBlob(res, "image/jpeg", 0.82));
    if (!blob) throw new Error("unreadable");
    return blob;
  }
  const uuid = () => (crypto.randomUUID ? crypto.randomUUID() : "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) => (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)));

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const v = (id) => $("#" + id).value.trim();
    const stop = (text, el) => { msg.textContent = text; if (el) el.focus(); };
    if (!rating) return stop("Choose a star rating.", stars[0]);
    if (!v("rv-name")) return stop("Add your name.", $("#rv-name"));
    if (v("rv-body").length < 10) return stop("Write a sentence or two about how it went.", $("#rv-body"));
    const done = () => { form.hidden = true; $("#rv-done").hidden = false; $("#rv-done").scrollIntoView({ block: "center" }); };
    if (v("rv-site")) return done();   // a robot filled the hidden box: say thanks, save nothing
    const wa = `<a class="link" href="https://wa.me/${RIO.CONTACT.whatsapp}" target="_blank" rel="noopener">WhatsApp</a>`;
    if (!RIO.db) { msg.innerHTML = `Reviews can't be sent right now. Please send yours on ${wa}.`; return; }

    btn.disabled = true; msg.textContent = "";
    const id = uuid(), paths = [];
    for (let i = 0; i < photos.length; i++) {
      btn.textContent = `Uploading photo ${i + 1} of ${photos.length}…`;
      try {
        const blob = await shrink(photos[i].file), path = `${id}/${i + 1}.jpg`;
        const up = await RIO.db.storage.from("review-photos").upload(path, blob, { contentType: "image/jpeg", upsert: false });
        if (!up.error) paths.push(path);
      } catch (x) { /* a photo that will not upload is left out; the review still goes */ }
    }
    btn.textContent = "Sending…";
    let error;
    try { ({ error } = await RIO.db.from("site_reviews").insert({ id, name: v("rv-name"), context: v("rv-context"), rating, body: v("rv-body"), photos: paths })); }
    catch (x) { error = x; }
    if (error) {
      btn.disabled = false; btn.innerHTML = `Send Review ${RIO.ARR}`;
      msg.innerHTML = `We couldn't send it just now. Please try again, or send it on ${wa}.`; return;
    }
    done();
  });
})();
