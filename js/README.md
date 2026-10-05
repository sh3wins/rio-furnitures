# RIO Furnitures — website

Plain HTML, CSS and JavaScript. No build step: open `index.html` with Live Server in VS Code.

## The idea
Calm, light and photo-led. One typeface, lots of space, very little decoration.
The visitor should understand what RIO makes, see it in a space, and be able to
order it in the quantity they need.

## Pages
- `index.html` — home: hero photo, spaces, furniture, ordering, real projects, workshop, start a project
- `furniture.html` — all pieces by type (`?cat=seating`, `?space=school`)
- `product.html?id=chair-04` — photo or drawing, colours, quantities, add to project
- `spaces.html` — each kind of space with its photo and furniture (`?space=church` jumps to one)
- `projects.html` — real RIO projects
- `about.html` — what RIO does, the workshop, how ordering works, visit
- `project.html` — My project (saved in the visitor's browser)
- `start.html` — Start a project, 5 steps (`?mode=custom` for custom work)
- `track.html` — order tracking
- `admin.html` — staff dashboard (separate styles: `css/style.css` + `css/admin.css`)

## Files
- `css/rio.css` — all styles for the public site. Colours, type and spacing are the
  variables at the top; light and dark themes are both defined there.
- `js/data.js` — everything you edit: contact details, photos, colours, spaces, products, projects.
- `js/main.js` — header, footer, photo frames, furniture cards, the order builder.
- `js/live.js` — adds projects and furniture that staff posted from the dashboard (see `ADMIN-SETUP.md`).
- `js/<page>.js` — one small file per page.
- `fonts/` — Instrument Sans (open licence), served from the site.

## Photos
- `images/site/` — TEMPORARY stock photos standing in for RIO's own photography.
- `images/real/` — RIO's own photos and workshop clips.

To replace a photo, save the new one over the old file with the same name. Every
photo sits in a frame with a fixed shape, so the layout does not change. Landscape,
about 2000px wide, saved as JPG is ideal. The list of photos is `RIO.IMAGES` in
`js/data.js`; the big home page photo is `images/site/hero.jpg` (set in `index.html`).
A missing photo shows a quiet labelled placeholder instead of a broken image.

## Editing content — js/data.js
- Product `dims`, `materials`, `lead` and `price` are `null` until known. Unknown
  details are simply not shown; nothing is invented.
- Real product photo: `image: "images/products/chair-04.jpg"`.
  Extra views: `photos: { front: "...", back: "...", side: "...", detail: "...", material: "..." }`.
- Projects: only real projects (`RP(...)` with photos) appear on the site.

## Sending quotes
"Send to RIO" saves the request to the database when Supabase is connected
(see `ADMIN-SETUP.md`), and otherwise opens WhatsApp or email with the details filled in.
