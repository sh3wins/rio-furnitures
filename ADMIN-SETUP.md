# RIO Admin — setup (about 15 minutes, one time)

The admin lives at **riofurniturekenya.com/admin.html**.
It needs a free Supabase project (the database + staff logins).
Until you finish these steps the website keeps working as before.

## 1. Create the Supabase project
1. Go to https://supabase.com and sign up (use RIO's email, not a personal one).
2. **New project** → name it `rio-furnitures` → choose a strong database password (save it somewhere safe) → region: pick the closest (e.g. Europe / Frankfurt or South Africa if listed).
3. Wait a minute while it builds.

## 2. Create the tables
1. In the left menu open **SQL Editor** → **New query**.
2. Open `supabase/schema.sql` from this project in VS Code, copy everything, paste it in, press **Run**.
3. You should see "Success. No rows returned."

## 3. Connect the website
1. In Supabase: **Project Settings → API**.
2. Copy **Project URL** and the **anon public** key.
3. In VS Code open `js/supabase-config.js` and paste them:
   ```js
   url: "https://xxxxxxxx.supabase.co",
   anonKey: "eyJhbGciOi..."
   ```
   (The anon key is meant to be public. Never paste the `service_role` key anywhere in this project.)

## 4. Create your admin login
1. Supabase: **Authentication → Users → Add user → Create new user**.
2. Enter your email and a strong password. Tick **Auto Confirm User**.

## 5. Put yourself on the staff list
In **SQL Editor**, run this (change the name and email):
```sql
insert into staff (user_id, name, role)
select id, 'Aurelia', 'admin' from auth.users where email = 'you@example.com';
```
Do the same for each RIO staff member (use `'staff'` instead of `'admin'`).

## 6. Allow the website address
**Authentication → URL Configuration** → Site URL: `https://riofurniturekenya.com`

## 7. Push and sign in
```
git add .
git commit -m "Connect admin dashboard"
git push
```
Then open **riofurniturekenya.com/admin.html** and sign in.

---

## How it works day to day
- **Quote requests**: when a customer presses **Send to RIO** (Start a Project or My Project) it lands in *Quote requests* with a reference like `Q-7K3QD`. Set the status as you go: New → Contacted → Quoted → Won / Lost.
- **Create order**: from a quote, press *Create order*. It gets a code like `RIO-7K3Q`.
- **Orders**: click a stage to move it, add updates, press *Save*. The customer's tracking page updates instantly. Use *Send on WhatsApp* to give them their tracking link.
- **Public vs private**: the project label, expected date, furniture list and updates are shown on the tracking page. Customer name, phone, email and private notes are staff-only.
- **Files** customers attach arrive with their request. Open the quote → *Files* → **Open ↗** (links work for 10 minutes; click again for a fresh one).
- **Telling the customer**: when you move an order to a new stage and press *Save*, an orange box appears at the top with **WhatsApp** / **Email** buttons and a ready-written message. Press it, then press send.
- **Tracking**: customers can track with their quote reference (`Q-…`) or order code (`RIO-…`).
- `js/orders.js` is now only a fallback — once the database is connected, manage orders in the admin.

## Posting projects and furniture from the dashboard

Staff can add finished projects and new furniture, with photos, straight from the
dashboard (**Website → Projects** and **Website → Furniture**). Anything marked
"Show on the website" is live straight away.

One-time setup:

1. In Supabase, open **SQL Editor → New query**.
2. Paste in the whole of `supabase/update-2-site-photos.sql` and press **Run**.
3. Open the dashboard and press **Refresh**. The two Website pages are ready.

How it works:

- Photos are made smaller in the browser before they upload, then stored in the
  public `site-photos` storage bucket. Details are stored in `site_projects` and
  `site_products`.
- The website reads published posts and shows them first, ahead of what is written
  in `js/data.js`. Visitors may take up to a minute to see a new post.
- Only signed-in staff can add, change or delete. Visitors can only read what is published.
- **Everything posted is public.** Only post photos and names customers are happy to have shown.
