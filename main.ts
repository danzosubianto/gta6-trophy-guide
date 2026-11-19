// Leonida Legend — entrypoint for the gta6-trophy-guide-01 bounty.
//
// The guide itself is the static app in app/ (index.html, style.css, app.js,
// roadmap.js and data/trophies.json): it runs in a browser with the network
// off and loads nothing from outside app/. This program hands the entry in:
// it copies app/ and screenshots/ into the output directory and writes
// dossier.json there with the kit's vendored library, byte for byte the way
// the scorer rebuilds it.
//
// Run locally with:  mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

const repoDir = dirname(fileURLToPath(import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

mkdirSync(outputDir, { recursive: true });
cpSync(join(repoDir, "app"), join(outputDir, "app"), { recursive: true });

const shotsDir = join(outputDir, "screenshots");
mkdirSync(shotsDir, { recursive: true });
const localShots = join(repoDir, "screenshots");
if (existsSync(localShots)) {
  cpSync(localShots, shotsDir, { recursive: true });
}

// The caps mirror the gate's: at most 4 screenshots of 256 KiB, at most 993
// files and 48 MiB under app/, and the dossier text capped at 160 KiB.
const dossier = buildDossier(outputDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 50331648,
});
writeFileSync(join(outputDir, "dossier.json"), dossier);
