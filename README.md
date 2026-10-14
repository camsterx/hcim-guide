# Red Helm Road — B0aty HCIM V3 Tracker

Personal, unofficial Old School RuneScape **Hardcore Ironman** guide and progress tracker for CADVYN.

**Main website:** https://camsterx.github.io/hcim-guide/

**Source route:** [B0aty HCIM Guide V3 on the OSRS Wiki](https://oldschool.runescape.wiki/w/Guide:B0aty_HCIM_Guide_V3)

## What the current website does

- **Follows B0aty's V3 route order**, indexing **15 episodes / 236 banks and other route sections**, based on source metadata from 13 March 2026.
- Browse banks and episodes, open directly at Bank 5 for new visitors, and tick each source instruction independently. Supplementary instructions use new IDs; the existing 2,910 IDs and synced progress are unchanged.
- The **Complete route checklist** contains the local 2,910-step source snapshot plus 6 independently tickable companion lines. Contextual notes, safespot videos, and images use a separate disclosure attached to the appropriate step, collapsed by default so mobile pages remain short.
- A full-bank button marks all contained step IDs as complete (and can undo them).
- Removes the separate condensed **Original HCIM Notes** panel from the current UI to avoid duplicate, conflicting checklists. Older note IDs remain recognised so previously saved data is not lost.
- The **text instructions** come from `data/b0aty-guide.json`, a 13 March 2026 snapshot of the OSRS Wiki guide sourced through a [structured community mirror](https://github.com/nandobrazil/hcim-guide-plugin). `data/wiki-enrichment.js` adds 6 previously missing action lines, 11 companion note lines, 8 wording corrections, and references to 173 images from the [community companion version](https://github.com/Jbbuckler/B0aty-HCIM-Guide-). Images remain hosted externally and may not always load. **Neither source is a verified live replica of the Wiki**; formatting, additional embedded objects and newer edits may differ.
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


## Route fidelity and testing (October 2026)

- Compared all 2,910 primary instructions with 2,927 companion text lines (excluding headings, reset markers and images). Existing step IDs remain fixed. Six new supplementary actions are individually tickable, while non-action resource lines appear in step dropdowns.
- Four endgame lines are appended in sequence rather than placed before the last primary step.
- Screenshots are linked from the companion site, under collapsible step details. Resource panels also embed known YouTube URLs only when those links are supplied, and provide an external link as a fallback.
- Saved checkboxes retain their existing guest and Supabase keys. A bank is considered complete only when all of its source and added steps are ticked.
- This is an offline snapshot parity pass, **not a live audit of every revision or media element on the current OSRS Wiki**. Check the linked Wiki when source material appears inconsistent.

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
- `data/wiki-enrichment.js`: Additional actions, notes, corrected wording and source image references without renumbering saved steps.
- `data/b0aty-notes.js`: Legacy condensed notes, no longer displayed in the main checklist; IDs kept for cloud progress compatibility.
- `original.html` / `app.js` / `data/chapters.js` / `styles.css`: Original custom Firemaking route, retained intact for rollback and old progress.
- `config.js`: Publishable browser Supabase credentials only.
- `supabase/schema.sql`: Schema reference for the *HCIM Guide* project only.

## Maintenance and future chapters

Update the data index when the source guide changes. Never recycle or rename IDs that have saved progress. Bank completion IDs begin with `b0-` and don't clash with the original `c01-` IDs, so both routes' saved progress can coexist in Supabase safely.

This is an unofficial, non-commercial fan project and is not affiliated with Jagex.
