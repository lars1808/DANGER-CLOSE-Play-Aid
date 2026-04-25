# DANGER CLOSE Companion — Build Brief

A mobile-first web app for tracking solo play of DANGER CLOSE, a tactical military skirmish TTRPG. The app does not roll dice, enforce rules, or automate gameplay. It tracks state. The player rolls physical dice, interprets results using the rulebook, and updates the app to reflect what just happened.

## The Play Loop

This is the test the app has to pass. Picture the player mid-mission, holding a phone in one hand, dice in the other:

1. Squad enters a new Sector. Player adds a Sector entry, sets Cover, Space, and Content (Threat Level or Boon/Empty).
2. Advance Roll happens with physical dice. Player updates each deployed Trooper's Offensive Position and Defensive Position from a dropdown.
3. Exchange begins. Player ticks Suppressed on one Trooper, drops another's Status to Wounded, bumps the Sector's Momentum to Contested, increments Pressure by one.
4. Next Exchange. Repeat.
5. Sector clears. Player marks Content as Cleared. Squad moves to the next Sector.

Every state change in step 2 and 3 should be one tap away on the mission screen. If changing Suppressed takes a tap to expand the trooper, a tap on the field, and a tap to confirm, the design has failed. The mission screen is the play surface and is optimised for speed. Configuration screens (Trooper, Equipment) can be as detailed as they need; you only touch them between sessions.

## Three Screens

### Start Screen
- Link to Trooper screen.
- Link to Equipment screen.
- List of Missions, newest first. Empty by default.
- Button to create a new Mission.
- Tapping a Mission opens it.
- Somewhere accessible: JSON export and JSON import (for backup and moving between devices).

### Trooper Screen
Manages the roster. Out-of-combat configuration.

For each Trooper:
- Name (text)
- Rank (text, optional)
- Callsign (text, optional)
- Squad (text tag — players type a squad name like "PIRATE" or "TIGER COMMANDOS"; troopers sharing a tag belong to the same squad)
- Grit (number, 0–3)
- Mobility (number, derived from base 5 minus armor/weapon/gear penalties — but for v1 just let the player set it manually)
- Flanking Bonus (derived from Mobility: +1 at 0–3, +2 at 4, +3 at 5 — display only, not editable)
- Tags (one of: Forceful, Technical, Steady, Sharp)
- Equipped Gear (links to Equipment entries — multi-select)
- Deployed (checkbox — controls whether they appear in active missions)
- Notes (free text)

Filter view: Active (deployed) vs Barracks (all troopers).

### Equipment Screen
The armory. Out-of-combat configuration.

For each piece of Equipment:
- Name (text)
- Type (one of: Armor, Service Weapon, Special Weapon, Special Equipment)
- Description (free text)
- REQ Cost (number)
- Mobility Modifier (number, typically -2 to 0)
- Owned (number — how many the squad has)

Squad-level:
- Requisition (number — the squad's pool, ticks up and down as the player chooses)

Group display by Type. Filter toggle: "Show only Owned".

The default equipment list from the rulebook should ship pre-populated (Light/Medium/Heavy Armor, Carbine/Assault Rifle/Marksman Rifle, the Special Weapons and Special Equipment from pages 38–40). Players can edit, delete, or add their own.

### Mission Screen
The play surface. Mobile-first, compact by default, fast to update.

Mission-level fields:
- Mission Name (text)
- Status (TBD / Active / Success / Partial Success / Failure)
- Difficulty (Routine / Hazardous / Desperate)
- Airspace (Clear / Contested / Hostile)
- Type (text — Assault, Defense, Sabotage, etc.)
- Objective (free text)
- Stakes (free text)
- Location (free text)
- Notes (free text)
- "Load Squad" action: takes a squad tag, marks all troopers with that tag as Deployed, initialises their combat fields to defaults (Status: OK, Offensive: Engaged, Defensive: In Cover, Suppressed: false, Ammo: 3, Grit: their current value).

Deployed Troopers section — a compact row per Trooper showing combat-relevant fields only:
- Callsign (or Name if no callsign)
- Status (dropdown: OK / Grazed / Wounded / Bleeding Out / Dead)
- Grit (number, tappable +/-)
- Ammo (number, tappable +/-)
- Offensive Position (dropdown: Limited / Engaged / Flanking)
- Defensive Position (dropdown: Flanked / In Cover / Fortified)
- Suppressed (checkbox)
- Mobility (read-only, from Trooper record)
- Flanking Bonus (read-only, derived)
- Gear (read-only summary; full detail on expand)

These fields live on the Mission record (or on a Mission–Trooper join), not on the Trooper record. Combat state persists across Sectors within the mission but does not write back to the Trooper's permanent record.

Tap-to-expand a Trooper row to see full Trooper details (Tags, full Gear list, Trooper-level Notes).

Sectors section — a list, newest at the bottom, with a button to add a new Sector. Each Sector shows:
- Sector Name (text)
- Momentum (dropdown: Defeat / Faltering / Losing Ground / Contested / Gaining Ground / Breaking Through / Victory)
- Cover (dropdown: Exposed / Normal / Dense)
- Space (dropdown: Tight / Transitional / Open)
- Content (dropdown: Empty / Boon / TL1 / TL2 / TL3 / TL4 / Cleared)
- Pressure (number, capped at TL+1 of the Sector's content; player-managed)
- Notes (free text — expand to view/edit)

Pressure is a numerical track, no automatic behaviour. The cap is the only constraint.

## Data Model

- **Trooper**: id, name, rank, callsign, squad (string tag), grit, mobility, tag, gear (array of Equipment ids), deployed, notes.
- **Equipment**: id, name, type, description, reqCost, mobilityMod, owned.
- **Squad-level**: requisition (single number).
- **Mission**: id, name, status, difficulty, airspace, type, objective, stakes, location, notes, deployedTroopers (array of mission-trooper records with their combat state), sectors (array of Sector records).
- **Mission-Trooper combat state**: trooperId, status, grit, ammo, offensivePosition, defensivePosition, suppressed.
- **Sector**: id, name, momentum, cover, space, content, pressure, notes.

Persistence: browser localStorage. JSON export/import for backup and cross-device transfer. No server, no auth, no sync.

## Out of Scope (v1)

- Dice rolling. The player uses physical dice.
- Rules automation. The app does not enforce Mobility checks, Defense Rolls, Momentum changes, or anything else. It records state.
- Campaign turn structure (Recovery, Reinforcement, Downtime, Requisition, Events, Briefing).
- Hex map rendering.
- Multi-device sync, multi-user, accounts.
- Images, illustrations, character portraits.
- Tooltips that pull rules text from the rulebook.
- Sector linking / graph view.

## Style

- Mobile-first. Must be comfortable to use one-handed on a phone while rolling dice with the other.
- Light-on-dark.
- Font: Outfit (Google Fonts).
- Colour palette (from the print rulebook):
  - `#2E0014` deep maroon (background or deepest element)
  - `#FF2808` red (alerts, danger states — Bleeding Out, Defeat)
  - `#FFBD00` amber (warnings, mid-states — Wounded, Contested)
  - `#419D78` green (positive states — OK, Gaining Ground, Victory)
  - `#28502E` dark green (background accents, complementary)
- Compact information density on the mission screen. Generous spacing on configuration screens.
- Avoid icons that require legends. Where icons help, pair them with labels.

## About the Rulebook

A copy of the DANGER CLOSE rulebook is included so you understand what the fields mean and how terms relate. It is reference material for terminology only. The app does not implement any rule from it. If a rule and this brief disagree on what the app should do, this brief wins.

## Build Notes

- React, single-file artifact, Tailwind for styling.
- No external storage APIs beyond localStorage.
- JSON export should download a `.json` file; import should accept a file picker.
- The mission screen should render acceptably on a 360px-wide viewport. Test it there first.
- When in doubt, fewer taps wins.
