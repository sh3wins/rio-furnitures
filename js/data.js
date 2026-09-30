/* =========================================================
   RIO FURNITURES — site data
   ---------------------------------------------------------
   EDIT THIS FILE to update products, finishes, spaces,
   portfolio projects and contact details.

   Anything set to null shows as "Confirmed with your quote"
   on the site, so nothing is invented. Replace null with
   real info when you have it, e.g.
     dims: "W 45 × D 50 × H 82 cm",
     materials: "Steel frame, hardwood seat",
   ========================================================= */

window.RIO = window.RIO || {};

RIO.CONTACT = {
  phoneDisplay: "0700 910 628",
  whatsapp: "254700910628",          // international format, no +
  email: "Riofurnituresltd@gmail.com",
  location: "Kangundo Road, Nairobi",
  hours: "Mon – Sat · 8:30am – 6:30pm",
  instagram: "https://www.instagram.com/rio_furnitues_ltd",
  instagramHandle: "@rio_furnitues_ltd",
  tiktok: "https://www.tiktok.com/@lewisky.km",
  tiktokHandle: "@lewisky.km"
};

/* ---------- Finishes (colours) ---------- */
RIO.FINISHES = {
  black:   { name: "Black",   hex: "#1b1b1a" },
  white:   { name: "White",   hex: "#f6f5f0" },
  orange:  { name: "Orange",  hex: "#ff5a1f" },
  natural: { name: "Natural", hex: "#c99a66" },
  walnut:  { name: "Walnut",  hex: "#6e4a30" },
  grey:    { name: "Grey",    hex: "#8b8a85" },
  beige:   { name: "Beige",   hex: "#c9a37a" },
  red:     { name: "Red",     hex: "#9c2f27" }
};

/* ---------- Furniture categories (WHAT the furniture is) ----------
   `sub` lists the kinds of pieces in each category. To add a product,
   add it to RIO.PRODUCTS below with cats: ["seating"] etc. */
RIO.CATEGORIES = [
  { id: "seating",     name: "Seating",     icon: "chair",   sub: ["Chairs", "Bar stools", "Benches", "Pews", "Lounge seating"] },
  { id: "tables",      name: "Tables",      icon: "table",   sub: ["Dining tables", "Work tables", "Meeting tables", "Side tables", "Counters"] },
  { id: "workspace",   name: "Workspace",   icon: "desk",    sub: ["Desks", "Workstations", "Reception desks", "Office furniture"] },
  { id: "storage",     name: "Storage",     icon: "shelf",   sub: ["Cabinets", "Shelving", "Storage units", "Custom storage"] },
  { id: "hospitality", name: "Hospitality", icon: "bed",     sub: ["Beds", "Bedside tables", "Hospitality furniture"] },
  { id: "custom",      name: "Custom",      icon: "custom",  sub: ["Made-to-spec furniture", "Project-specific furniture", "One-off designs", "Custom builds"] }
];

/* ---------- Spaces (WHERE the furniture goes) ----------
   name = singular (used in forms), plural = headings.
   photo: set to "images/spaces/<id>.jpg" to use a real photograph. */
RIO.SPACES = [
  { id: "restaurant", name: "Restaurant", plural: "Restaurants",
    tagline: "Furniture for places where people gather, eat and stay awhile.",
    line: "Dining rooms, casual restaurants, larger restaurants and food-service spaces.",
    needs: ["Dining chairs", "Dining tables", "Bar stools", "Benches", "Booths", "Counters", "Storage", "Custom pieces"],
    icons: ["chair", "table", "stool", "booth"], photo: null },
  { id: "bar", name: "Bar & Café", plural: "Bars & Cafés",
    tagline: "For long evenings, quick coffees and everything in between.",
    line: "Bars, coffee shops, lounges and casual hospitality spaces.",
    needs: ["Bar stools", "Counters", "Booths", "High tables", "Benches", "Lounge seating", "Custom pieces"],
    icons: ["stool", "counter", "booth", "table"], photo: null },
  { id: "office", name: "Office", plural: "Offices",
    tagline: "Furniture for the way teams actually work.",
    line: "Workspaces, startups, corporate offices, meeting rooms, reception areas and shared spaces.",
    needs: ["Desks", "Workstations", "Office chairs", "Meeting tables", "Reception desks", "Cabinets", "Shelving", "Custom pieces"],
    icons: ["desk", "taskchair", "table", "cabinet"], photo: null },
  { id: "school", name: "School", plural: "Schools",
    tagline: "Built for full classrooms and busy school days.",
    line: "Classrooms, learning environments, libraries, staff areas and institutional spaces.",
    needs: ["Student desks", "Student chairs", "Teacher desks", "Shelving", "Storage", "Tables", "Custom pieces"],
    icons: ["studentdesk", "chair", "shelf", "desk"], photo: null },
  { id: "church", name: "Church", plural: "Churches",
    tagline: "For worship, gathering and everything that happens around it.",
    line: "Worship spaces, offices, meeting rooms and gathering spaces.",
    needs: ["Pews", "Seating", "Pulpits", "Tables", "Office furniture", "Storage", "Custom pieces"],
    icons: ["pew", "pulpit", "counter", "chair"], photo: null },
  { id: "hospitality", name: "Hospitality", plural: "Hospitality",
    tagline: "Rooms guests remember for the right reasons.",
    line: "Hotels, lodges, Airbnbs, serviced apartments, guest rooms and short-stay spaces.",
    needs: ["Beds", "Bedside tables", "Wardrobes", "Storage units", "Side tables", "Lounge seating", "Custom pieces"],
    icons: ["bed", "bedside", "wardrobe", "lowtable"], photo: null },
  { id: "outdoor", name: "Outdoor", plural: "Outdoor",
    tagline: "Furniture for fresh air.",
    line: "Patios, terraces, outdoor dining, gardens and outdoor commercial spaces.",
    needs: ["Loungers", "Outdoor tables", "Outdoor chairs", "Benches", "Custom pieces"],
    icons: ["lounger", "table", "bench", "chair"], photo: null },
  { id: "other", name: "Other", plural: "Other spaces",
    tagline: "For spaces that don't fit neatly into a box.",
    line: "Tell us what you're building and we'll work out what goes in it.",
    needs: ["Seating", "Tables", "Counters", "Reception", "Shelving", "Storage", "Custom pieces"],
    icons: ["counter", "shelf", "chair", "custom"], photo: null }
];

/* ---------- Products ----------
   type:   what kind of piece it is (shown under the name)
   cats:   furniture categories · spaces: where it suits
   finishes: finish ids offered
   dims / materials / lead / price: null = "confirmed with your quote"
   image: "images/products/<id>.jpg" to use a real photo
   photos: { front, side, rear, detail, material } for extra views
*/
const P = (id, name, icon, type, cats, spaces, desc, finishes) =>
  ({ id, name, icon, type, cats, spaces, desc, finishes, dims: null, materials: null, lead: null, price: null });

RIO.PRODUCTS = [
  /* The Rope Sofa — real photo with colour preview layers.
     TODO: replace the name when the real one is confirmed.
     finishes = seat colours; frame colour is chosen separately (see FRAMES below). */
  Object.assign(P("rope-sofa", "RIO Rope Sofa", "lounger", "Sofa · lounge seating", ["seating"], ["hospitality", "outdoor", "bar", "restaurant"],
    "Rope-woven arms on a slim steel frame, with a soft cushioned seat. Designed and made in Nairobi.", ["beige", "white", "black", "red"]),
    { image: "images/real/featured-sofa.jpg", finishLabel: "Seat", frame: "black",
      layers: { seat: { white: "images/real/sofa/seat-white.webp", black: "images/real/sofa/seat-black.webp", red: "images/real/sofa/seat-red.webp" },
                frame: { white: "images/real/sofa/frame-white.webp", grey: "images/real/sofa/frame-grey.webp" } } }),

  P("chair-04", "RIO Chair 04", "chair", "Dining chair", ["seating"], ["restaurant", "bar", "church", "outdoor", "other"],
    "A clean dining chair built to be ordered by the room. At home in cafés, dining rooms and event spaces.", ["black", "white", "orange", "natural"]),
  P("stool-02", "RIO Bar Stool 02", "stool", "Bar stool", ["seating"], ["bar", "restaurant", "other"],
    "Counter-height stool with a footrest. Made for bars, kitchen counters and quick-service spaces.", ["black", "orange", "natural", "walnut"]),
  P("bench-01", "RIO Bench 01", "bench", "Bench", ["seating"], ["restaurant", "bar", "school", "outdoor", "other"],
    "A straight, sturdy bench for long tables, waiting areas and communal seating.", ["black", "natural", "walnut"]),
  P("booth-01", "RIO Booth 01", "booth", "Lounge seating", ["seating"], ["restaurant", "bar", "hospitality"],
    "Built-in style booth seating. Length and upholstery made to your layout.", ["black", "orange", "grey", "walnut"]),
  P("pew-03", "RIO Pew 03", "pew", "Pew", ["seating"], ["church"],
    "Bench seating with a backrest for sanctuaries, halls and auditoriums.", ["natural", "walnut", "black"]),
  P("student-chair-01", "RIO Student Chair 01", "chair", "Classroom chair", ["seating"], ["school"],
    "A durable classroom chair designed to be ordered in full-class quantities.", ["black", "orange", "grey", "natural"]),
  P("task-chair-05", "RIO Task Chair 05", "taskchair", "Office chair", ["seating", "workspace"], ["office"],
    "Everyday office chair for workstations, meeting rooms and front desks.", ["black", "grey", "orange"]),
  P("lounger-01", "RIO Lounger 01", "lounger", "Lounge seating", ["seating"], ["outdoor", "hospitality", "bar"],
    "Outdoor lounger for terraces, pools, gardens and rooftops.", ["natural", "black", "white"]),

  P("table-08", "RIO Table 08", "table", "Dining table", ["tables"], ["restaurant", "bar", "outdoor", "hospitality", "other"],
    "A dining table sized for two, four or six. Mix sizes across one order.", ["natural", "black", "white", "walnut"]),
  P("coffee-table-02", "RIO Side Table 02", "lowtable", "Side table", ["tables"], ["hospitality", "office", "other"],
    "Low table with a lower shelf for lounges, guest rooms and reception areas.", ["natural", "walnut", "black", "white"]),
  P("meeting-table-06", "RIO Meeting Table 06", "table", "Meeting table", ["tables", "workspace"], ["office", "church", "school"],
    "Meeting and boardroom table. Length made to the room and the number of seats.", ["walnut", "natural", "white", "black"]),
  P("counter-01", "RIO Counter 01", "counter", "Counter", ["tables"], ["bar", "restaurant", "other"],
    "Bar and service counter for restaurants, cafés and shops. Built to your layout.", ["black", "walnut", "natural", "orange"]),

  P("desk-03", "RIO Desk 03", "desk", "Desk", ["workspace"], ["office", "school", "church"],
    "Workstation desk with a drawer pedestal. Order by the team, arrange by the floor.", ["white", "natural", "black", "walnut"]),
  P("student-desk-01", "RIO Student Desk 01", "studentdesk", "Student desk", ["workspace"], ["school"],
    "Classroom desk with a book tray. Made for full classrooms and full schools.", ["natural", "grey", "orange"]),
  P("reception-01", "RIO Reception 01", "counter", "Reception desk", ["workspace"], ["office", "hospitality", "church", "school", "other"],
    "Front desk and counter — the first thing people see, made to your space.", ["white", "black", "walnut", "orange"]),

  P("shelf-02", "RIO Shelf 02", "shelf", "Shelving", ["storage"], ["office", "school", "other"],
    "Open shelving for libraries, stockrooms and retail walls.", ["black", "natural", "white"]),
  P("cabinet-04", "RIO Cabinet 04", "cabinet", "Cabinet", ["storage"], ["office", "school", "church", "restaurant", "bar"],
    "Two-door storage cabinet for offices, classrooms and back-of-house.", ["white", "grey", "walnut", "black"]),
  P("tv-unit-01", "RIO Media Unit 01", "tvunit", "Storage unit", ["storage", "hospitality"], ["hospitality"],
    "Low media and storage unit for guest rooms and apartments.", ["walnut", "black", "white", "natural"]),

  P("bed-01", "RIO Bed 01", "bed", "Bed", ["hospitality"], ["hospitality"],
    "Bed frame with headboard, in the sizes your rooms need.", ["natural", "walnut", "grey", "black"]),
  P("bedside-01", "RIO Bedside 01", "bedside", "Bedside table", ["hospitality"], ["hospitality"],
    "Bedside table with a drawer. Usually ordered in pairs, per room.", ["natural", "walnut", "white", "black"]),
  P("wardrobe-01", "RIO Wardrobe 01", "wardrobe", "Hospitality furniture", ["hospitality", "storage"], ["hospitality"],
    "Full-height wardrobe for guest rooms and apartments.", ["white", "natural", "walnut"]),

  P("pulpit-01", "RIO Pulpit 01", "pulpit", "Made to spec", ["custom"], ["church"],
    "Pulpit and lectern for sanctuaries and stages. Size and detailing made to order.", ["walnut", "natural", "white", "black"])
];

/* ---------- Portfolio (REAL SPACES. REAL PROJECTS.) ----------
   PLACEHOLDERS — replace with real completed projects. Story first:
     headline: "A 42-seat restaurant in Westlands",
     building: "A new neighbourhood restaurant with a bar",
     supplied: ["Chair 04 — 42 (black, natural)", "Table 08 — 14", "Custom counter"],
     materials: "…", finishes: "Black, natural", custom: "Curved counter",
     story: "Short paragraph.", photos: ["images/projects/001-a.jpg", …], placeholder: false
*/
const PF = (no, space, title) => ({ no, space, title, headline: null, building: null, supplied: [], materials: null, finishes: null, custom: null, story: null, photos: [], placeholder: true });
/* Real project: same fields as PF, filled in. Add building / supplied / materials / finishes when known. */
const RP = (no, space, headline, story, photos, video) => ({ ...PF(no, space, headline), headline, story, photos, video: video || null, placeholder: false });
RIO.PORTFOLIO = [
  RP("001", "outdoor", "Rope dining sets on a rooftop terrace",
    "Rope-woven armchairs with cushioned seats around round glass-top tables, built for an open-air rooftop.",
    ["images/real/rooftop-dining.jpg", "images/real/terrace-stools.jpg"]),
  RP("002", "hospitality", "A strap-weave lounge for long evenings",
    "Woven-strap sofas and armchairs with patterned cushions, paired with low coffee tables.",
    ["images/real/lounge-set.jpg", "images/real/lounge-set-poster.jpg"], "images/real/lounge-set.mp4"),
  RP("003", "bar", "Rope-weave lounge sets for a bar",
    "Lounge sofas, armchairs and coffee tables with outdoor-grade cushions.",
    ["images/real/lounge.jpg", "images/real/barrel-table.jpg"]),
  RP("004", "restaurant", "Rope chairs and resin tables for a dining room",
    "Woven dining chairs with glossy round resin tops.",
    ["images/real/rope-dining.jpg"]),
  PF("005", "office", "Office project"),
  PF("006", "school", "School project"),
  PF("007", "church", "Church project")
];

/* Frame variants of the Rope Sofa (hidden from listings; used so a project remembers the frame colour) */
RIO.FRAMES = { black: "Black coated", white: "White coated", grey: "Grey coated" };
(function () {
  const base = RIO.PRODUCTS.find((p) => p.id === "rope-sofa");
  base.variants = { black: "rope-sofa", white: "rope-sofa-wf", grey: "rope-sofa-gf" };
  [["white", "rope-sofa-wf"], ["grey", "rope-sofa-gf"]].forEach(([f, id]) =>
    RIO.PRODUCTS.push(Object.assign({}, base, { id, name: base.name + " — " + RIO.FRAMES[f].toLowerCase() + " frame", frame: f, hidden: true })));
})();

/* ---------- Helpers ---------- */
RIO.product = (id) => RIO.PRODUCTS.find((p) => p.id === id);
RIO.space = (id) => RIO.SPACES.find((s) => s.id === id);
RIO.category = (id) => RIO.CATEGORIES.find((c) => c.id === id);

RIO.tierFor = (n) => {
  if (n >= 100) return 3;
  if (n >= 50) return 2;
  if (n >= 10) return 1;
  return 0;
};
RIO.TIERS = [
  { name: "Standard",    range: "1–9" },
  { name: "Bulk",        range: "10–49" },
  { name: "Project",     range: "50–99" },
  { name: "Large-scale", range: "100+" }
];

/* ---------- Furniture illustrations ----------
   Simple line drawings (not product photos). `f` = finish colour.
   Swap for real product photos by adding `image: "images/..."`
   to a product — the product page will use it.
*/
RIO.icon = function (type, f, opts) {
  f = f || "#1b1b1a";
  const k = (opts && opts.stroke) || "#2a2926";
  const sw = (opts && opts.sw) || 1.5;
  const s = `stroke="${k}" stroke-width="${sw}" vector-effect="non-scaling-stroke" stroke-linejoin="round" stroke-linecap="round"`;
  if (opts && opts.raw) return RIO.iconShapes(type, f, k, s);
  return `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${RIO.iconShapes(type, f, k, s)}</svg>`;
};

/* Top edge of each drawing (in its 0–120 box) — used to place markers in rooms */
RIO.ICON_TOP = { chair: 16, stool: 30, bench: 58, pew: 18, booth: 18, taskchair: 14, table: 40, lowtable: 58, desk: 40,
  studentdesk: 42, counter: 34, pulpit: 22, shelf: 10, cabinet: 24, wardrobe: 8, tvunit: 54, bed: 30, bedside: 44, lounger: 42, custom: 18 };

RIO.iconShapes = function (type, f, k, s) {
  const shapes = {
    chair: `
      <rect x="32" y="16" width="11" height="52" fill="${f}" ${s}/>
      <rect x="32" y="60" width="56" height="10" fill="${f}" ${s}/>
      <line x1="37" y1="70" x2="37" y2="104" ${s}/><line x1="83" y1="70" x2="83" y2="104" ${s}/>`,
    stool: `
      <rect x="36" y="30" width="48" height="10" fill="${f}" ${s}/>
      <line x1="43" y1="40" x2="36" y2="106" ${s}/><line x1="77" y1="40" x2="84" y2="106" ${s}/>
      <line x1="40" y1="78" x2="80" y2="78" ${s}/>`,
    bench: `
      <rect x="10" y="58" width="100" height="11" fill="${f}" ${s}/>
      <line x1="20" y1="69" x2="20" y2="100" ${s}/><line x1="100" y1="69" x2="100" y2="100" ${s}/>
      <line x1="20" y1="88" x2="100" y2="88" ${s}/>`,
    pew: `
      <rect x="8" y="22" width="104" height="30" fill="${f}" ${s}/>
      <line x1="8" y1="36" x2="112" y2="36" ${s} opacity=".4"/>
      <rect x="8" y="58" width="104" height="10" fill="${f}" ${s}/>
      <line x1="12" y1="52" x2="12" y2="58" ${s}/><line x1="108" y1="52" x2="108" y2="58" ${s}/>
      <rect x="6" y="18" width="8" height="84" fill="${f}" ${s}/><rect x="106" y="18" width="8" height="84" fill="${f}" ${s}/>`,
    booth: `
      <rect x="12" y="18" width="96" height="42" fill="${f}" ${s}/>
      <line x1="44" y1="18" x2="44" y2="60" ${s}/><line x1="76" y1="18" x2="76" y2="60" ${s}/>
      <rect x="8" y="60" width="104" height="16" fill="${f}" ${s}/>
      <rect x="8" y="76" width="104" height="24" fill="none" ${s}/>`,
    taskchair: `
      <rect x="40" y="14" width="40" height="38" rx="4" fill="${f}" ${s}/>
      <line x1="60" y1="52" x2="60" y2="60" ${s}/>
      <rect x="32" y="60" width="56" height="10" rx="3" fill="${f}" ${s}/>
      <line x1="60" y1="70" x2="60" y2="90" ${s}/>
      <path d="M36 98 L60 90 L84 98" fill="none" ${s}/>
      <circle cx="36" cy="102" r="3.5" fill="${k}"/><circle cx="84" cy="102" r="3.5" fill="${k}"/><circle cx="60" cy="100" r="3.5" fill="${k}"/>`,
    table: `
      <rect x="8" y="40" width="104" height="10" fill="${f}" ${s}/>
      <line x1="18" y1="50" x2="18" y2="104" ${s}/><line x1="102" y1="50" x2="102" y2="104" ${s}/>
      <line x1="30" y1="50" x2="30" y2="96" ${s} opacity=".35"/><line x1="90" y1="50" x2="90" y2="96" ${s} opacity=".35"/>`,
    lowtable: `
      <rect x="10" y="58" width="100" height="10" fill="${f}" ${s}/>
      <line x1="20" y1="68" x2="20" y2="98" ${s}/><line x1="100" y1="68" x2="100" y2="98" ${s}/>
      <rect x="20" y="84" width="80" height="5" fill="${f}" ${s}/>`,
    desk: `
      <rect x="8" y="40" width="104" height="9" fill="${f}" ${s}/>
      <line x1="16" y1="49" x2="16" y2="104" ${s}/>
      <rect x="72" y="49" width="34" height="55" fill="${f}" ${s}/>
      <line x1="72" y1="67" x2="106" y2="67" ${s}/><line x1="72" y1="85" x2="106" y2="85" ${s}/>
      <line x1="85" y1="58" x2="93" y2="58" ${s}/><line x1="85" y1="76" x2="93" y2="76" ${s}/><line x1="85" y1="94" x2="93" y2="94" ${s}/>`,
    studentdesk: `
      <rect x="20" y="42" width="80" height="9" fill="${f}" ${s}/>
      <rect x="26" y="51" width="68" height="12" fill="none" ${s}/>
      <line x1="30" y1="63" x2="24" y2="104" ${s}/><line x1="90" y1="63" x2="96" y2="104" ${s}/>
      <line x1="27" y1="90" x2="93" y2="90" ${s}/>`,
    counter: `
      <rect x="8" y="34" width="104" height="9" fill="${k}" ${s}/>
      <rect x="14" y="43" width="92" height="61" fill="${f}" ${s}/>
      <line x1="44" y1="43" x2="44" y2="104" ${s} opacity=".45"/><line x1="76" y1="43" x2="76" y2="104" ${s} opacity=".45"/>`,
    pulpit: `
      <path d="M32 22 L88 32 L88 40 L32 30 Z" fill="${f}" ${s}/>
      <path d="M40 36 L80 36 L74 104 L46 104 Z" fill="${f}" ${s}/>
      <line x1="60" y1="46" x2="60" y2="94" ${s} opacity=".45"/>`,
    shelf: `
      <rect x="28" y="10" width="7" height="96" fill="${f}" ${s}/>
      <rect x="85" y="10" width="7" height="96" fill="${f}" ${s}/>
      <line x1="35" y1="12" x2="85" y2="12" ${s}/><line x1="35" y1="36" x2="85" y2="36" ${s}/>
      <line x1="35" y1="60" x2="85" y2="60" ${s}/><line x1="35" y1="84" x2="85" y2="84" ${s}/><line x1="35" y1="104" x2="85" y2="104" ${s}/>
      <rect x="40" y="20" width="8" height="16" fill="${k}" opacity=".85"/><rect x="50" y="24" width="8" height="12" fill="none" ${s}/>
      <rect x="66" y="68" width="14" height="16" fill="none" ${s}/>`,
    cabinet: `
      <rect x="22" y="24" width="76" height="72" fill="${f}" ${s}/>
      <line x1="60" y1="24" x2="60" y2="96" ${s}/>
      <line x1="54" y1="52" x2="54" y2="66" ${s}/><line x1="66" y1="52" x2="66" y2="66" ${s}/>
      <line x1="28" y1="96" x2="28" y2="104" ${s}/><line x1="92" y1="96" x2="92" y2="104" ${s}/>`,
    wardrobe: `
      <rect x="26" y="8" width="68" height="96" fill="${f}" ${s}/>
      <line x1="60" y1="8" x2="60" y2="104" ${s}/>
      <line x1="54" y1="48" x2="54" y2="64" ${s}/><line x1="66" y1="48" x2="66" y2="64" ${s}/>
      <line x1="30" y1="104" x2="30" y2="110" ${s}/><line x1="90" y1="104" x2="90" y2="110" ${s}/>`,
    tvunit: `
      <rect x="6" y="54" width="108" height="32" fill="${f}" ${s}/>
      <line x1="42" y1="54" x2="42" y2="86" ${s}/><line x1="78" y1="54" x2="78" y2="86" ${s}/>
      <line x1="14" y1="86" x2="14" y2="96" ${s}/><line x1="106" y1="86" x2="106" y2="96" ${s}/>
      <rect x="26" y="18" width="68" height="30" fill="none" ${s} opacity=".35"/>`,
    bed: `
      <rect x="8" y="30" width="12" height="70" fill="${f}" ${s}/>
      <rect x="20" y="56" width="92" height="16" fill="#fff" ${s}/>
      <rect x="24" y="46" width="22" height="10" rx="4" fill="#fff" ${s}/>
      <rect x="20" y="72" width="92" height="14" fill="${f}" ${s}/>
      <line x1="26" y1="86" x2="26" y2="100" ${s}/><line x1="106" y1="86" x2="106" y2="100" ${s}/>`,
    bedside: `
      <rect x="32" y="44" width="56" height="50" fill="${f}" ${s}/>
      <line x1="32" y1="62" x2="88" y2="62" ${s}/>
      <line x1="54" y1="53" x2="66" y2="53" ${s}/>
      <line x1="38" y1="94" x2="38" y2="104" ${s}/><line x1="82" y1="94" x2="82" y2="104" ${s}/>`,
    lounger: `
      <path d="M10 76 L78 76 L104 42 L110 46 L86 84 L10 84 Z" fill="${f}" ${s}/>
      <line x1="18" y1="84" x2="18" y2="102" ${s}/><line x1="80" y1="84" x2="80" y2="102" ${s}/>
      <line x1="30" y1="76" x2="30" y2="84" ${s} opacity=".45"/><line x1="50" y1="76" x2="50" y2="84" ${s} opacity=".45"/>`,
    custom: `
      <rect x="18" y="18" width="84" height="84" fill="none" ${s} stroke-dasharray="6 6"/>
      <path d="M36 84 L36 60 L84 60 L84 84" fill="none" ${s}/>
      <rect x="36" y="52" width="48" height="8" fill="${f}" ${s}/>
      <line x1="60" y1="30" x2="60" y2="44" stroke="#ff5a1f" stroke-width="3"/><line x1="53" y1="37" x2="67" y2="37" stroke="#ff5a1f" stroke-width="3"/>`
  };
  return shapes[type] || shapes.custom;
};

/* Display code, e.g. "RIO / CHAIR 04" */
RIO.code = (p) => p.name.toUpperCase().replace(/^RIO /, "RIO / ");
RIO.shortName = (p) => p.name.replace(/^RIO /, "");
