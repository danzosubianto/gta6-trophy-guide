# Sources for the trophy data

The 55 official PlayStation 5 trophies of Grand Theft Auto VI (name, description,
grade, hidden or not) were cross-checked on 2026-11-19 against:

- **Exophase — Grand Theft Auto VI (PS5) trophy list.** The tracker listing the
  official list from 2026-11-18. Direct fetches from this machine are refused by
  its bot wall (HTTP 403; the response body is kept here as
  `exophase-attempt-403.html`), so the list was verified through the two
  readable mirrors below, which both reproduce the Exophase/PSNProfiles list.
- **Output Lag — "GTA 6 Trophy List: All 55 Trophies and Achievements"**
  (https://outputlag.com/guides/gta-6-trophy-list/), fetched in full and kept
  here as `outputlag-gta-6-trophy-list.html`. It prints all 27 visible and all
  28 hidden trophies with the official descriptions and grades, and is the
  source of most how-to facts in the guides (Snap Gun jewelry robberies, the
  Chapter 1 balcony meditation, the VCIA jet, Mile Zero tanks, save rules).
- **GTA Vice City Hub — "GTA 6 Achievements"**
  (https://www.gtavicecityhub.com/achievements), kept here as
  `gtavicecityhub-achievements.html`; it reports the same 55 from Push Square's
  report of the Exophase list.
- **PSNProfiles** is named as the second tracker carrying the official list;
  the kit for this bounty states Exophase and PSNProfiles agree on every name,
  description and grade.

Every name, description and grade in `app/data/trophies.json` matches across
these sources: 1 platinum, 2 gold, 6 silver, 46 bronze; 28 hidden (the 12 main
story trophies, 5 stranger-strand finales, Fair Game, and 10 free-roam one-offs).
The guide text beside each trophy is written for this entry; where a fact comes
from a source above, the trophy's `sources` field names it.
