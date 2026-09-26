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
  grey:    { name: "Grey",    hex: "#8b8a85" }
};

/* ---------- Categories ---------- */
RIO.CATEGORIES = [
  { id: "seating",     name: "Seating",     icon: "chair" },
  { id: "tables",      name: "Tables",      icon: "table" },
  { id: "desks",       name: "Desks",       icon: "desk" },
  { id: "storage",     name: "Storage",     icon: "shelf" },
  { id: "beds",        name: "Beds",        icon: "bed" },
  { id: "hospitality", name: "Hospitality", icon: "stool" },
  { id: "office",      name: "Office",      icon: "taskchair" },
  { id: "custom",      name: "Custom",      icon: "custom" }
];

/* ---------- Spaces (who RIO serves) ---------- */
RIO.SPACES = [
  { id: "restaurant", name: "Restaurant", plural: "Restaurants",
    line: "Restaurants, cafés, eateries and food spaces.",
    needs: ["Dining tables", "Dining chairs", "Bar stools", "Benches", "Booths", "Counters", "Service furniture", "Storage", "Custom furniture"],
    icons: ["chair", "table", "stool", "booth"], photo: null },
  { id: "bar", name: "Bar", plural: "Bars",
    line: "Bars, lounges, rooftops and nightlife spaces.",
    needs: ["Bar stools", "Bar counters", "Booths", "High tables", "Benches", "Back-bar shelving", "Lounge seating", "Custom furniture"],
    icons: ["stool", "counter", "booth", "table"], photo: null },
  { id: "office", name: "Office", plural: "Offices",
    line: "Startups, agencies, companies and growing teams.",
    needs: ["Desks", "Workstations", "Meeting tables", "Reception desks", "Office chairs", "Storage", "Cabinets", "Shelving", "Custom furniture"],
    icons: ["desk", "taskchair", "table", "cabinet"] },
  { id: "school", name: "School", plural: "Schools",
    line: "Schools, learning centres and educational facilities.",
    needs: ["Student desks", "Student chairs", "Teacher desks", "Storage", "Shelving", "Tables", "Reception furniture", "Custom institutional furniture"],
    icons: ["studentdesk", "chair", "shelf", "desk"] },
  { id: "church", name: "Church", plural: "Churches",
    line: "Churches, ministries and religious facilities.",
    needs: ["Seating", "Pulpits", "Reception desks", "Office furniture", "Tables", "Storage", "Platform / stage furniture", "Custom furniture"],
    icons: ["pew", "pulpit", "counter", "chair"] },
  { id: "outdoor", name: "Outdoor", plural: "Outdoor spaces",
    line: "Terraces, gardens, poolsides, rooftops and courtyards.",
    needs: ["Loungers", "Outdoor tables", "Outdoor chairs", "Benches", "Planters", "Custom furniture"],
    icons: ["lounger", "table", "bench", "chair"], photo: null },
  { id: "other", name: "Other", plural: "Other spaces",
    line: "Retail, salons, studios, clinics, co-working, guest rooms, event spaces and corporate facilities.",
    needs: ["Counters", "Seating", "Shelving", "Reception", "Tables", "Beds", "Wardrobes", "Storage", "Custom furniture"],
    icons: ["counter", "shelf", "chair", "custom"] }
];

/* ---------- Products ----------
   cats:   category ids (a product can live in several)
   spaces: space ids it suits
   finishes: finish ids offered for this product
   price:  null = "Request quote". Add a number (KES) if you want to show a standard unit price.
*/
RIO.PRODUCTS = [
  { id: "chair-04", name: "RIO Chair 04", icon: "chair", cats: ["seating", "hospitality"], spaces: ["restaurant", "bar", "church", "outdoor", "other"],
    desc: "A clean dining chair built to be ordered by the room. Stacks visually in rows, works in cafés, dining rooms and event spaces.",
    finishes: ["black", "white", "orange", "natural"], dims: null, materials: null, lead: null, price: null },
  { id: "stool-02", name: "RIO Bar Stool 02", icon: "stool", cats: ["seating", "hospitality"], spaces: ["restaurant", "bar", "other"],
    desc: "Counter-height stool with a footrest. Made for bars, kitchen counters and quick-service spaces.",
    finishes: ["black", "orange", "natural", "walnut"], dims: null, materials: null, lead: null, price: null },
  { id: "bench-01", name: "RIO Bench 01", icon: "bench", cats: ["seating", "hospitality"], spaces: ["restaurant", "bar", "school", "outdoor", "other"],
    desc: "A straight, sturdy bench for long tables, waiting areas and communal seating.",
    finishes: ["black", "natural", "walnut"], dims: null, materials: null, lead: null, price: null },
  { id: "booth-01", name: "RIO Booth 01", icon: "booth", cats: ["seating", "hospitality"], spaces: ["restaurant", "bar"],
    desc: "Built-in style booth seating for restaurants and cafés. Length and upholstery made to your layout.",
    finishes: ["black", "orange", "grey", "walnut"], dims: null, materials: null, lead: null, price: null },
  { id: "pew-03", name: "RIO Pew 03", icon: "pew", cats: ["seating"], spaces: ["church"],
    desc: "Institutional bench seating with a backrest for sanctuaries, halls and auditoriums.",
    finishes: ["natural", "walnut", "black"], dims: null, materials: null, lead: null, price: null },
  { id: "student-chair-01", name: "RIO Student Chair 01", icon: "chair", cats: ["seating"], spaces: ["school"],
    desc: "A durable classroom chair designed to be ordered in full-class quantities.",
    finishes: ["black", "orange", "grey", "natural"], dims: null, materials: null, lead: null, price: null },
  { id: "task-chair-05", name: "RIO Task Chair 05", icon: "taskchair", cats: ["seating", "office"], spaces: ["office"],
    desc: "Everyday office chair for workstations, meeting rooms and front desks.",
    finishes: ["black", "grey", "orange"], dims: null, materials: null, lead: null, price: null },

  { id: "table-08", name: "RIO Table 08", icon: "table", cats: ["tables", "hospitality"], spaces: ["restaurant", "bar", "outdoor", "other"],
    desc: "A dining table sized for two, four or six. Mix sizes across one restaurant order.",
    finishes: ["natural", "black", "white", "walnut"], dims: null, materials: null, lead: null, price: null },
  { id: "coffee-table-02", name: "RIO Coffee Table 02", icon: "lowtable", cats: ["tables"], spaces: ["office", "other"],
    desc: "Low table with a lower shelf for living rooms, lounges and reception areas.",
    finishes: ["natural", "walnut", "black", "white"], dims: null, materials: null, lead: null, price: null },
  { id: "meeting-table-06", name: "RIO Meeting Table 06", icon: "table", cats: ["tables", "office"], spaces: ["office", "church", "school"],
    desc: "Meeting and boardroom table. Length made to the room and the number of seats.",
    finishes: ["walnut", "natural", "white", "black"], dims: null, materials: null, lead: null, price: null },

  { id: "desk-03", name: "RIO Desk 03", icon: "desk", cats: ["desks", "office"], spaces: ["office", "school", "church"],
    desc: "Workstation desk with a drawer pedestal. Order by the team, arrange by the floor.",
    finishes: ["white", "natural", "black", "walnut"], dims: null, materials: null, lead: null, price: null },
  { id: "student-desk-01", name: "RIO Student Desk 01", icon: "studentdesk", cats: ["desks"], spaces: ["school"],
    desc: "Classroom desk with a book tray. Made for full classrooms and full schools.",
    finishes: ["natural", "grey", "orange"], dims: null, materials: null, lead: null, price: null },
  { id: "reception-01", name: "RIO Reception 01", icon: "counter", cats: ["desks", "office", "hospitality"], spaces: ["office", "church", "school", "other"],
    desc: "Front desk and counter. The first thing people see — made to your space and brand.",
    finishes: ["white", "black", "walnut", "orange"], dims: null, materials: null, lead: null, price: null },
  { id: "counter-01", name: "RIO Counter 01", icon: "counter", cats: ["hospitality"], spaces: ["restaurant", "bar", "other"],
    desc: "Bar and service counter for restaurants, cafés and retail. Built to your layout.",
    finishes: ["black", "walnut", "natural", "orange"], dims: null, materials: null, lead: null, price: null },
  { id: "pulpit-01", name: "RIO Pulpit 01", icon: "pulpit", cats: ["custom"], spaces: ["church"],
    desc: "Pulpit and lectern for sanctuaries and stages. Size and detailing made to order.",
    finishes: ["walnut", "natural", "white", "black"], dims: null, materials: null, lead: null, price: null },

  { id: "shelf-02", name: "RIO Shelf 02", icon: "shelf", cats: ["storage", "office"], spaces: ["office", "school", "other"],
    desc: "Open shelving for libraries, stockrooms, studios and retail walls.",
    finishes: ["black", "natural", "white"], dims: null, materials: null, lead: null, price: null },
  { id: "cabinet-04", name: "RIO Cabinet 04", icon: "cabinet", cats: ["storage", "office"], spaces: ["office", "school", "church", "restaurant", "bar"],
    desc: "Two-door storage cabinet for offices, classrooms and back-of-house.",
    finishes: ["white", "grey", "walnut", "black"], dims: null, materials: null, lead: null, price: null },
  { id: "wardrobe-01", name: "RIO Wardrobe 01", icon: "wardrobe", cats: ["storage"], spaces: ["other"],
    desc: "Full-height wardrobe for bedrooms and guest rooms.",
    finishes: ["white", "natural", "walnut"], dims: null, materials: null, lead: null, price: null },
  { id: "tv-unit-01", name: "RIO TV Unit 01", icon: "tvunit", cats: ["storage"], spaces: ["other"],
    desc: "Low media unit for living rooms and apartment units.",
    finishes: ["walnut", "black", "white", "natural"], dims: null, materials: null, lead: null, price: null },

  { id: "bed-01", name: "RIO Bed 01", icon: "bed", cats: ["beds"], spaces: ["other"],
    desc: "Bed frame with headboard. Available in the sizes your units need.",
    finishes: ["natural", "walnut", "grey", "black"], dims: null, materials: null, lead: null, price: null },
  { id: "bedside-01", name: "RIO Bedside 01", icon: "bedside", cats: ["beds", "storage"], spaces: ["other"],
    desc: "Bedside table with a drawer. Usually ordered in pairs, per unit.",
    finishes: ["natural", "walnut", "white", "black"], dims: null, materials: null, lead: null, price: null },
  { id: "lounger-01", name: "RIO Outdoor Lounger 01", icon: "lounger", cats: ["hospitality"], spaces: ["outdoor", "restaurant", "bar"],
    desc: "Outdoor lounger for terraces, pools, gardens and rooftop spaces.",
    finishes: ["natural", "black", "white"], dims: null, materials: null, lead: null, price: null }
];

/* ---------- Portfolio (REAL SPACES. REAL PROJECTS.) ----------
   These are PLACEHOLDERS. Replace with real completed projects.
   Tell the story first, then the numbers. Example:
     headline: "A 42-seat restaurant in Westlands",
     building: "A new neighbourhood restaurant with a bar",
     supplied: ["Chair 04 — 42 (black, natural)", "Table 08 — 14", "Custom counter"],
     materials: "…", finishes: "Black, natural oak",
     story: "Short paragraph about the space.",
     photos: ["images/projects/001-a.jpg", "images/projects/001-b.jpg", "images/projects/001-c.jpg"],
     placeholder: false
*/
RIO.PORTFOLIO = [
  { no: "001", space: "restaurant", title: "Restaurant project", headline: null, building: null, supplied: [], materials: null, finishes: null, story: null, photos: [], placeholder: true },
  { no: "002", space: "bar",        title: "Bar project",     headline: null, building: null, supplied: [], materials: null, finishes: null, story: null, photos: [], placeholder: true },
  { no: "003", space: "office",     title: "Office project",     headline: null, building: null, supplied: [], materials: null, finishes: null, story: null, photos: [], placeholder: true },
  { no: "004", space: "school",     title: "School project",     headline: null, building: null, supplied: [], materials: null, finishes: null, story: null, photos: [], placeholder: true },
  { no: "005", space: "church",     title: "Church project",     headline: null, building: null, supplied: [], materials: null, finishes: null, story: null, photos: [], placeholder: true },
  { no: "006", space: "other",      title: "Commercial project", headline: null, building: null, supplied: [], materials: null, finishes: null, story: null, photos: [], placeholder: true },
  { no: "007", space: "outdoor",    title: "Outdoor project",    headline: null, building: null, supplied: [], materials: null, finishes: null, story: null, photos: [], placeholder: true }
];

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
