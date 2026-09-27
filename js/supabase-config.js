/* =========================================================
   RIO — connection to the Supabase database
   ---------------------------------------------------------
   Paste your two values from Supabase:
   Project Settings → API → "Project URL" and "anon public" key.

   The anon key is SAFE to be public — the database security
   rules (supabase/schema.sql) decide what it can do:
   the website can only SEND quote requests and look up an
   order by its code. Everything else needs a staff login.

   While these are empty, the site keeps working exactly as
   before (WhatsApp / email + tracking from js/orders.js).
   ========================================================= */
window.RIO = window.RIO || {};
RIO.SUPABASE = {
  url: "https://ucikdixyeipprnfshecc.supabase.co",
  anonKey: "sb_publishable_ckSz85VnM0zAEWpXam7zAg_hGruKXeb"   // the "publishable" key (safe to be public)
};
