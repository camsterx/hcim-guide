# Red Helm Road — B0aty HCIM V3 Tracker

Personal, unofficial Old School RuneScape **Hardcore Ironman** guide and progress tracker for CADVYN.

**Main website:** https://camsterx.github.io/hcim-guide/

**Source route:** [B0aty HCIM Guide V3 on the OSRS Wiki](https://oldschool.runescape.wiki/w/Guide:B0aty_HCIM_Guide_V3)

## What the current website does

- **Follows B0aty's V3 route order**, indexing **15 episodes / 236 banks and other route sections**, based on source metadata from 13 March 2026.
- Browse banks and episodes, open directly at Bank 5 for new visitors, and tick every individual source instruction. Completion persists per step and per bank.
- The **All B0aty Wiki steps & notes** disclosure opens inside the guide. It loads the full text of the 2,910 steps from a first-party snapshot stored in this repository; no need to switch tabs while following the route.
- A full-bank button marks all contained step IDs as complete (and can undo them).
- Provides **original additional HCIM safety and preparation notes for the opening banks**.
- The complete **text instructions and inline notes** are served directly by this GitHub Pages site from `data/b0aty-guide.json`, a 13 March 2026 snapshot of the OSRS Wiki guide sourced through a [structured community mirror](https://github.com/nandobrazil/hcim-guide-plugin). The source stays linked for authorship, licence and updates. Formatting, embedded images, links and newer wiki edits may differ, so the original Wiki remains linked for attribution and updates.
- The browser loads the locally hosted guide first, and tries two pinned external mirrors only if that request fails. **Progress saves independently of the source loading.**
- Save bank ticks and note ticks in Supabase when signed in, using a personal email magic link. Both tables have row-level security.
- Download/import a JSON progress backup.
- The **previous 65-step custom Firemaking route** is still available at [original.html](./original.html), using its original step IDs and stored progress.

## Source and licensing

This app is an independently written tracker *for* the B0aty route, not an endorsed or official version of the guide. Bank titles, structure, video references and displayed source instructions are credited to the OSRS Wiki project, B0aty and the [community structured mirror](https://github.com/nandobrazil/hcim-guide-plugin). OSRS Wiki content is published under **CC BY-NC-SA 3.0**; when redistributing adapted content follow the attribution, non-commercial, and share-alike terms. The independent supplemental notes are original. Always check the Wiki's latest text for source updates, precise inventory counts and combat requirements.

## Hardcore warnings

- Never blindly follow routes through the Stronghold of Security, Wilderness, dungeons, dangerous bosses, or unfamiliar aggressive NPCs. Prepare adequate Hitpoints, emergency escape and food.
- B0aty's efficiency route may assume you are actively playing and able to react immediately. This app adds safety guidance, but not a risk audit of every one of the source guide's nearly 3,000 instructions.
- Wintertodt **zero warmth is an unsafe death**; do not leave the minigame unattended on an HCIM.
- B0aty's route unlocks **Herblore around Banks 10–11**, before its much later Wintertodt stages.

## Cloud setup

Supabase project: **HCIM Guide** (not CADVYN), UK region, public project reference `hkwedsvspmlctvahyuec`.

Supabase **Authentication > URL Configuration** should include `https://camsterx.github.io/hcim-guide/` as both Site URL and an allowed Redirect URL. The Email provider must be on.

Public frontend keys live in `config.js`. Never commit a service-role key, secret key or password.

GitHub Pages should deploy the **main** branch from **/(root)**. The site uses static ES modules with no build step.

The tables `step_progress` and `hcim_profiles` are already present in this separate Supabase project. `step_progress` uses unique `user_id,step_id` records and authenticated user-only row-level security.

### Testing

1. Open the published site and sign in with your email link.
2. Mark a new bank completed, wait for **All changes synced**.
3. Open the website on another device and sign in with the same email.
4. Verify the completion tick matches.
5. Periodically use **Download backup**.

## Files

- `index.html` / `boaty-styles.css` / `boaty-app.js`: Current B0aty route tracker.
- `data/b0aty-index.js`: Route metadata (15 episodes, 236 sections, 2,910 original steps, source credit).
- `data/b0aty-guide.json`: Full source instructions, hosted locally and subject to the CC BY-NC-SA 3.0 terms recorded in `data/ATTRIBUTION.md`.
- `data/b0aty-notes.js`: Original, extra HCIM advice and condensed checkpoints for initial sections.
- `original.html` / `app.js` / `data/chapters.js` / `styles.css`: Original custom Firemaking route, retained intact for rollback and old progress.
- `config.js`: Publishable browser Supabase credentials only.
- `supabase/schema.sql`: Schema reference for the *HCIM Guide* project only.

## Maintenance and future chapters

Update the data index when the source guide changes. Never recycle or rename IDs that have saved progress. Bank completion IDs begin with `b0-` and don't clash with the original `c01-` IDs, so both routes' saved progress can coexist in Supabase safely.

This is an unofficial, non-commercial fan project and is not affiliated with Jagex.
