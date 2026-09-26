/* =========================================================
   RIO — ORDER TRACKING
   ---------------------------------------------------------
   HOW TO UPDATE AN ORDER (in VS Code):
   1. Find the order below by its code.
   2. Change `stage` to the stage number it has reached (see STAGES).
   3. Optionally add a line to `updates` (newest first).
   4. Save, then: git add .  →  git commit -m "Update order"  →  git push

   HOW TO ADD A NEW ORDER:
   Copy the DEMO order, give it a new unique code and fill it in.
   Send the customer their tracking link, e.g.
   https://riofurniturekenya.com/track.html?order=RIO-7K3Q

   ⚠ PRIVACY: this file is PUBLIC on GitHub. Never put customer
   names, phone numbers, emails, addresses or prices here.
   Use hard-to-guess codes (letters + numbers), not 0001, 0002…
   ========================================================= */

window.RIO = window.RIO || {};

RIO.STAGES = [
  "Quote confirmed",
  "Design & drawings",
  "Materials",
  "Cutting & fabrication",
  "Assembly",
  "Finishing",
  "Quality control",
  "Packaging",
  "Out for delivery",
  "Delivered"
];

RIO.ORDERS = [
  {
    code: "RIO-DEMO",                       // delete this demo when you add real orders
    project: "Demo — Restaurant fit-out",   // a short label only, no customer names
    space: "restaurant",
    stage: 4,                               // 0 = Quote confirmed … 9 = Delivered
    expected: "Delivery planned for late October",
    items: [
      { name: "Chair 04", qty: 70, finishes: "Black 40 · White 20 · Orange 10" },
      { name: "Table 08", qty: 15, finishes: "Natural 15" },
      { name: "Bar Stool 02", qty: 12, finishes: "Black 12" }
    ],
    updates: [
      { date: "2026-09-27", text: "Frames assembled. Moving to finishing next week." },
      { date: "2026-09-20", text: "All parts cut." },
      { date: "2026-09-12", text: "Drawings approved. Materials ordered." }
    ]
  }
];
