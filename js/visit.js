/* RIO — Schedule a site visit
   The request goes to the dashboard (Quote requests) marked "Site visit",
   with the preferred day and time. If the database is not reachable it
   opens WhatsApp or email with the details filled in, like the other forms. */
(function () {
  const $ = (s) => document.querySelector(s);
  const form = $("#v-form"), msg = $("#v-msg"), date = $("#v-date");

  $("#v-space").innerHTML = `<option value="">Choose…</option>` + RIO.SPACES.map((s) => `<option value="${s.id}">${s.name}</option>`).join("");
  if (RIO.space(RIO.qs("space"))) $("#v-space").value = RIO.qs("space");

  // The earliest day you can ask for is tomorrow
  const iso = (d) => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  const first = new Date(); first.setDate(first.getDate() + 1);
  date.min = iso(first);
  const nice = (v) => new Date(v + "T00:00:00").toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const v = (id) => $("#" + id).value.trim();
    const day = v("v-date"), d = new Date(day + "T00:00:00");
    const stop = (text, id) => { msg.textContent = text; $("#" + id).focus(); };
    if (!v("v-loc")) return stop("Tell us where the space is.", "v-loc");
    if (!day || isNaN(d)) return stop("Choose a day.", "v-date");
    if (day < date.min) return stop("Choose a day from tomorrow onwards.", "v-date");
    if (d.getDay() === 0) return stop("We're closed on Sundays. Please choose Monday to Saturday.", "v-date");
    if (!v("v-phone")) return stop("Add a phone number so we can confirm the visit.", "v-phone");
    msg.textContent = "";

    const sp = RIO.space(v("v-space")), when = nice(day) + ", " + v("v-time");
    const L = ["RIO FURNITURES — SITE VISIT REQUEST", "Preferred: " + when, "Where: " + v("v-loc")];
    if (sp) L.push("Space: " + sp.name);
    if (v("v-notes")) L.push("", v("v-notes"));
    L.push("");
    if (v("v-name")) L.push("Name: " + v("v-name"));
    L.push("Phone: " + v("v-phone"));

    const row = {
      source: "start", project_name: "Site visit", space: v("v-space"), needs: [], qty_range: "",
      notes: "SITE VISIT REQUEST\nPreferred: " + when + (v("v-notes") ? "\n\n" + v("v-notes") : ""),
      files: [], _files: [], timeline: ("Site visit: " + when).slice(0, 80),
      contact_name: v("v-name"), contact_phone: v("v-phone"), contact_email: "", location: v("v-loc")
    };
    RIO.openSend(L.join("\n"), "Site visit request" + (sp ? " — " + sp.name : ""), false, row, "Your visit request is ready.");
  });
})();
