# RIO Furnitures — Showroom website

Open `index.html` with Live Server in VS Code.

## The idea
Quiet surface, powerful underneath:
1. Calm: rooms, type, whitespace.
2. Discover: hover furniture in a room → orange marker → click → the piece opens.
3. Powerful: mix finishes in one order (e.g. Black 40 + White 20 + Orange 10 + Natural 5 = 75), add to My Project, save, upload refs, request a quote.
4. Trust: workshop, real projects, Kartech connection.

## Pages
- index.html — the showroom (room viewer, pieces, ordering, projects, custom, workshop, Kartech)
- spaces.html — walk through all six rooms (spaces.html?space=church jumps to one)
- furniture.html — all pieces, grouped by category (?cat=seating, ?space=school)
- product.html?id=chair-04 — examine a piece, views, finishes, build your order
- project.html — My Project workspace
- start.html — Start a Project, 5 steps (start.html?mode=custom for custom work)
- projects.html — project stories (placeholders)
- about.html — how we build, how ordering works, Kartech, visit

## Fonts
Instrument Serif (statements) · Inter Tight (everything you read and click) · IBM Plex Mono (codes, quantities, labels)

## Where to edit — js/data.js
- Contact details, finishes, products, spaces, portfolio.
- Product `dims`, `materials`, `lead`, `price` are null → shown as "confirmed with your quote".
- Real product photo: `image: "images/products/chair-04.jpg"`.
  Extra views: `photos: { front: "...", side: "...", back: "...", detail: "...", material: "..." }`.
- Real room photo: set `photo: "images/spaces/restaurant.jpg"` on a space (markers still use the room layout in js/scenes.js).
- Portfolio: fill `RIO.PORTFOLIO` — headline first ("A 42-seat restaurant in Westlands"), then supplied, materials, finishes, photos.

## Rooms — js/scenes.js
Each room is drawn from the same furniture drawings. Move pieces by changing `x`, `foot`, `s` (scale), `f` (finish).

## Sending quotes
Static site: "Send project to RIO" opens WhatsApp (0700 910 628) or email with the full breakdown filled in.
Projects are saved in the visitor's browser (localStorage).
