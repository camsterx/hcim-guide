# Red Helm Road — Hardcore Ironman Progression

A mobile-friendly, unofficial OSRS **Hardcore Ironman** maxing route, designed for somebody playing mostly while working from home. It follows the continuous, numbered efficiency-guide style without copying the Oziris guide. **Safety before speed.**

## What's built
- 65 persistent numbered steps across seven sections, from Tutorial Island to **99 Firemaking**.
- **Druidic Ritual / Herblore before Wintertodt** and preparation for 20 Construction.
- Each section has its own page, plus the continuous route and a Resume button.
- Low-attention, semi-AFK and focused-play labels; warnings for dangerous HCIM steps.
- Tick completion saved locally and (when signed in) in a **separate HCIM Guide Supabase project**, syncing across devices.
- Export/import JSON backups and optional RSN/level milestones.
- Five planned chapter placeholders; additional chapter step IDs can be added without changing existing progress.

## Publishing on GitHub Pages
This repository is intended to host at `https://camsterx.github.io/hcim-guide/`.

From **GitHub → hcim-guide → Settings → Pages → Build and deployment**, choose **Deploy from a branch**, `main`, `/ (root)` and Save. Wait for GitHub to publish; then open the URL. The site is static; no build command is required.

## Supabase authentication redirect — REQUIRED
The dedicated Supabase project is **HCIM Guide**, project reference `hkwedsvspmlctvahyuec`, UK London region. It is NOT the CADVYN project.

In **Supabase → HCIM Guide → Authentication → URL Configuration**:
- Site URL: `https://camsterx.github.io/hcim-guide/`
- Redirect URLs: add `https://camsterx.github.io/hcim-guide/`

Check **Authentication → Sign In / Providers → Email** is enabled. This site uses an email magic link through Supabase Auth. The project has two database tables: `public.step_progress` and `public.hcim_profiles`. Both already have **Row Level Security** enabled and policies allowing only the signed-in user to read/write their own records.

The `config.js` file contains only a public Supabase URL and **publishable** key. NEVER add a Supabase secret, service-role key, password or private token to the public repository.

## Test cross-device saving
1. Open the published website on your PC. Select **Settings → Sign in**.
2. Request a sign-in link by email and open it on the same browser/device.
3. Tick a step. Wait for **All changes synced**.
4. Open the website on another device, sign in with **the same email**, and check the step is completed.
5. Check **Settings → Download backup** occasionally. If you used the website before signing in, choose **Merge this device’s guest ticks** after sign-in.

Email magic links may be rate-limited by Supabase's built-in email sender. For reliable large-scale usage, configure a custom SMTP provider. This is unnecessary to start personal testing.

## Extending chapters
Add a chapter object in `data/chapters.js`. Each step is `[permanentID,title,description,attentionTag,optionalRiskWarning]`. Do not rename existing step IDs: those are the keys used in the database to track progress. All chapter pages, progress totals and the main continuous route update automatically.

## Danger rules
- Wintertodt is an **unsafe death** for a Hardcore Ironman; keep warmth above zero.
- Do not AFK while traversing dangerous areas, during Druidic Ritual or during combat.
- Even the safe-looking parts of OSRS should be checked against the current OSRS Wiki before risky actions. Guides cannot remove all risk.

No connection is made to your RuneLite account or OSRS credentials. This is an independent fan project, not affiliated with Jagex.
