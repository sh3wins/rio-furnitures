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
- **Files** customers upload are *named* in the request; the files themselves still come by WhatsApp/email (photo uploads into the admin are phase 2).
- `js/orders.js` is now only a fallback — once the database is connected, manage orders in the admin.
