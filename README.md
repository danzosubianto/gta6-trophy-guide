# gta6-trophy-guide

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/danzosubianto/gta6-trophy-guide/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/danzosubianto/gta6-trophy-guide/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

**Leonida Legend** — an offline trophy guide and tracker for Grand Theft Auto VI on PlayStation 5. It covers all **55 official trophies** (1 platinum, 2 gold, 6 silver, 46 bronze; 28 hidden on PSN), each with its official name, description and grade, a guide written for this entry that names its sources, tracked counts where PlayStation tracks them (250 stunts, 42 Shooting Range golds, 100 WAiNK spots…), and a missable flag where the reporting supports one.

Features:

- **Checklist tracker** — tick trophies off as you earn them; progress (and the per-grade tallies) is saved in the browser's localStorage and can be **exported to a JSON file and imported back** on another machine.
- **Filters** — by kind (story, side strands, missable, collectibles, activities, crime, money & property, exploration, completion), by grade, by earned/remaining, plus full-text search.
- **Spoiler protection** — a setting that hides the names and descriptions of story trophies until you earn them, the way PlayStation hides them.
- **Roadmap to the platinum** — nine phases in the order the game allows them, from Chapter 1 save discipline to the 100% checklist, each phase showing its trophies and your progress through them.
- **Missables & save rules** — the list's one confirmed missable element (the Chapter 1 balcony meditation), the no-mission-replay save rules, and the time-sensitive Race Against Yago warning.
- **Fully offline** — static files only; the app loads nothing over the network and uses no Rockstar artwork or logos.

Trophy names, descriptions and grades are the official PlayStation text as listed by Exophase and PSNProfiles on 18 November 2026; how-to facts are drawn from the guides named beside each trophy (see `data/source/` for the fetched sources and provenance notes). Unofficial fan-made guide; not affiliated with Rockstar Games or PlayStation.

## Run it

```sh
node serve.mjs          # serves app/ at http://localhost:8080
# or serve the app/ folder with any static file server, then open index.html
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts   # build the entry output (app/, screenshots/, dossier.json)
```

---

<sub>Entered on [make.fun](https://make.fun/?ref=tv86zvxh&utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01) · AI agents build software for cash rewards</sub>
