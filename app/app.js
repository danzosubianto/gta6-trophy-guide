// Leonida Legend — GTA VI trophy tracker.
// State lives in localStorage; the app loads only its own files and works offline.

import { renderRoadmap } from "./roadmap.js";

const EARNED_KEY = "leonida-legend-earned-v1";
const SPOILER_KEY = "leonida-legend-spoilers-v1";

const KIND_FILTERS = [
  { id: "all", label: "All kinds" },
  { id: "story", label: "Story" },
  { id: "side", label: "Side strands" },
  { id: "missable", label: "Missable" },
  { id: "collectibles", label: "Collectibles" },
  { id: "activities", label: "Activities" },
  { id: "crime", label: "Crime" },
  { id: "money", label: "Money & property" },
  { id: "exploration", label: "Exploration" },
  { id: "completion", label: "Completion" },
];

const KIND_LABELS = {
  story: "Story",
  side: "Side strand",
  collectibles: "Collectibles",
  activities: "Activities",
  crime: "Crime",
  money: "Money & property",
  exploration: "Exploration",
  completion: "Completion",
};

const GRADE_ORDER = { platinum: 0, gold: 1, silver: 2, bronze: 3 };

let trophies = [];
let trophiesById = new Map();
let sourcesByName = new Map();
let earnedIds = loadEarned();
let spoilerProtection = loadSpoilerSetting();
let activeKind = "all";
let openGuideId = null;

function loadEarned() {
  try {
    const raw = localStorage.getItem(EARNED_KEY);
    if (raw) return new Set(JSON.parse(raw));
  } catch { /* corrupted storage falls back to an empty set */ }
  return new Set();
}

function saveEarned() {
  localStorage.setItem(EARNED_KEY, JSON.stringify([...earnedIds]));
}

function loadSpoilerSetting() {
  return localStorage.getItem(SPOILER_KEY) === "on";
}

function saveSpoilerSetting() {
  localStorage.setItem(SPOILER_KEY, spoilerProtection ? "on" : "off");
}

function isMasked(trophy) {
  // Spoiler protection hides the story-bearing trophies (main story and side
  // strands) that PlayStation keeps hidden, until the player earns them.
  return spoilerProtection && trophy.hidden && (trophy.kind === "story" || trophy.kind === "side") && !earnedIds.has(trophy.id);
}

function sourceLink(label) {
  // Per-trophy labels are short ("Exophase — official list", "Output Lag guide");
  // the footer list carries the full names. Match on the leading brand name.
  const brand = label.replace(/ — .*$/, "").replace(/ guide$/, "");
  return sourcesByName.get(brand);
}

function buildCard(trophy) {
  const card = document.createElement("article");
  const masked = isMasked(trophy);
  card.className = "card" + (earnedIds.has(trophy.id) ? " is-earned" : "") + (masked ? " masked" : "");

  const top = document.createElement("div");
  top.className = "card-top";

  const check = document.createElement("input");
  check.type = "checkbox";
  check.className = "card-check";
  check.checked = earnedIds.has(trophy.id);
  check.setAttribute("aria-label", `Mark ${trophy.name} as earned`);
  check.addEventListener("change", () => {
    if (check.checked) earnedIds.add(trophy.id); else earnedIds.delete(trophy.id);
    saveEarned();
    renderAll();
  });

  const textBox = document.createElement("div");
  const name = document.createElement("h3");
  name.className = "card-name";
  name.textContent = masked ? "Hidden trophy — spoiler protection on" : trophy.name;
  const desc = document.createElement("p");
  desc.className = "card-desc";
  desc.textContent = masked ? "Earn it (or turn spoiler protection off) to reveal its name and description." : trophy.description;
  textBox.append(name, desc);

  const badges = document.createElement("div");
  badges.className = "badges";
  const grade = document.createElement("span");
  grade.className = `badge grade-${trophy.grade}`;
  grade.textContent = trophy.grade;
  badges.append(grade);
  const kind = document.createElement("span");
  kind.className = "badge kind";
  kind.textContent = KIND_LABELS[trophy.kind] ?? trophy.kind;
  badges.append(kind);
  if (trophy.hidden) {
    const hidden = document.createElement("span");
    hidden.className = "badge hidden-badge";
    hidden.textContent = "Hidden on PSN";
    badges.append(hidden);
  }
  if (trophy.missable) {
    const miss = document.createElement("span");
    miss.className = "badge missable";
    miss.textContent = "Missable";
    badges.append(miss);
  }
  if (trophy.count) {
    const count = document.createElement("span");
    count.className = "badge count";
    count.textContent = `${trophy.count.target.toLocaleString("en-US")} ${trophy.count.label}`;
    badges.append(count);
  }

  top.append(check, textBox, badges);
  card.append(top);

  const guideBtn = document.createElement("button");
  guideBtn.type = "button";
  guideBtn.className = "guide-btn";
  guideBtn.textContent = openGuideId === trophy.id ? "Hide guide" : "Guide & sources";
  guideBtn.addEventListener("click", () => {
    openGuideId = openGuideId === trophy.id ? null : trophy.id;
    renderAll();
  });
  card.append(guideBtn);

  if (openGuideId === trophy.id) {
    const body = document.createElement("div");
    body.className = "guide-body";
    const guide = document.createElement("p");
    guide.textContent = masked ? "This guide is hidden by spoiler protection until the trophy is earned." : trophy.guide;
    body.append(guide);
    const src = document.createElement("p");
    src.className = "src";
    src.append("Sources: ");
    trophy.sources.forEach((label, i) => {
      if (i > 0) src.append(" · ");
      const url = sourceLink(label);
      if (url && !masked) {
        const a = document.createElement("a");
        a.href = url;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.textContent = label;
        src.append(a);
      } else {
        src.append(label);
      }
    });
    body.append(src);
    card.append(body);
  }

  return card;
}

function currentFilters() {
  return {
    query: document.getElementById("search").value.trim().toLowerCase(),
    grade: document.getElementById("grade-filter").value,
    status: document.getElementById("status-filter").value,
    kind: activeKind,
  };
}

function trophyMatches(trophy, filters) {
  if (filters.kind === "missable") {
    if (!trophy.missable) return false;
  } else if (filters.kind !== "all" && trophy.kind !== filters.kind) {
    return false;
  }
  if (filters.grade !== "all" && trophy.grade !== filters.grade) return false;
  if (filters.status === "earned" && !earnedIds.has(trophy.id)) return false;
  if (filters.status === "remaining" && earnedIds.has(trophy.id)) return false;
  if (filters.query) {
    const haystack = `${trophy.name} ${trophy.description} ${trophy.guide}`.toLowerCase();
    if (!haystack.includes(filters.query)) return false;
  }
  return true;
}

function renderChecklist() {
  const filters = currentFilters();
  const list = trophies.filter((t) => trophyMatches(t, filters));
  const box = document.getElementById("cards");
  box.innerHTML = "";
  for (const trophy of list) box.append(buildCard(trophy));
  document.getElementById("result-line").textContent =
    `Showing ${list.length} of ${trophies.length} trophies — ${earnedIds.size} earned.`;
}

function renderMissables() {
  const box = document.getElementById("missable-cards");
  box.innerHTML = "";
  for (const trophy of trophies.filter((t) => t.missable)) box.append(buildCard(trophy));
}

function renderProgress() {
  const total = trophies.length;
  const done = earnedIds.size;
  document.getElementById("progress-count").textContent = `${done} / ${total} trophies`;
  const pct = total ? Math.round((done / total) * 100) : 0;
  document.getElementById("progress-pct").textContent = `${pct}%`;
  document.getElementById("progress-fill").style.width = `${pct}%`;
  const counts = document.getElementById("grade-counts");
  counts.innerHTML = "";
  for (const grade of ["platinum", "gold", "silver", "bronze"]) {
    const all = trophies.filter((t) => t.grade === grade);
    const got = all.filter((t) => earnedIds.has(t.id)).length;
    const span = document.createElement("span");
    span.textContent = `${grade}: ${got}/${all.length}`;
    counts.append(span);
  }
}

function renderRoadmapView() {
  renderRoadmap(document.getElementById("roadmap"), trophiesById, earnedIds);
}

function renderAll() {
  renderProgress();
  renderChecklist();
  renderMissables();
  renderRoadmapView();
}

function buildKindChips() {
  const box = document.getElementById("kind-chips");
  box.innerHTML = "";
  for (const filter of KIND_FILTERS) {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "chip" + (filter.id === "missable" ? " missable-chip" : "") + (activeKind === filter.id ? " is-active" : "");
    chip.textContent = filter.label;
    chip.addEventListener("click", () => {
      activeKind = filter.id;
      buildKindChips();
      renderChecklist();
    });
    box.append(chip);
  }
}

function buildSourceList(data) {
  const list = document.getElementById("source-list");
  list.innerHTML = "";
  for (const source of data.sources ?? []) {
    sourcesByName.set(source.name.replace(/ — .*$/, ""), source.url);
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = source.url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.textContent = source.name;
    li.append(a);
    list.append(li);
  }
}

function switchView(view) {
  for (const name of ["checklist", "roadmap", "missables"]) {
    document.getElementById(`view-${name}`).hidden = name !== view;
    document.getElementById(`tab-${name}`).classList.toggle("is-active", name === view);
  }
  document.getElementById("toolbar").style.display = view === "checklist" ? "" : "none";
}

function exportProgress() {
  const payload = {
    app: "leonida-legend",
    game: "Grand Theft Auto VI",
    platform: "PlayStation 5",
    exportedAt: new Date().toISOString(),
    earned: [...earnedIds].sort((a, b) => a - b),
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "gta6-trophy-progress.json";
  a.click();
  URL.revokeObjectURL(url);
}

async function importProgress(file) {
  const data = JSON.parse(await file.text());
  const ids = Array.isArray(data) ? data : data.earned;
  if (!Array.isArray(ids)) throw new Error("No earned list in that file.");
  earnedIds = new Set(ids.filter((id) => trophiesById.has(id)));
  saveEarned();
  renderAll();
}

function applyUrlParams() {
  // Shareable views: ?view=roadmap, ?kind=crime, ?grade=silver, ?open=40,
  // ?spoilers=on, and ?seed=2,3,15 to pre-mark trophies on a fresh browser
  // (handy for showing a friend — or a screenshot — a run in progress).
  const params = new URLSearchParams(location.search);
  const seed = params.get("seed");
  if (seed && localStorage.getItem(EARNED_KEY) === null) {
    earnedIds = new Set(seed.split(",").map(Number).filter((id) => trophiesById.has(id)));
    saveEarned();
  }
  if (params.get("spoilers") === "on") {
    spoilerProtection = true;
    saveSpoilerSetting();
    document.getElementById("spoiler-toggle").checked = true;
  }
  const kind = params.get("kind");
  if (kind && KIND_FILTERS.some((f) => f.id === kind)) {
    activeKind = kind;
    buildKindChips();
  }
  const grade = params.get("grade");
  if (grade) document.getElementById("grade-filter").value = grade;
  const open = Number(params.get("open"));
  if (trophiesById.has(open)) openGuideId = open;
  const view = params.get("view");
  if (view === "roadmap" || view === "missables" || view === "checklist") switchView(view);
}

async function init() {
  const response = await fetch("data/trophies.json");
  const data = await response.json();
  trophies = (data.trophies ?? []).slice().sort((a, b) =>
    (GRADE_ORDER[a.grade] - GRADE_ORDER[b.grade]) || (a.id - b.id));
  trophiesById = new Map(trophies.map((t) => [t.id, t]));
  buildSourceList(data);
  buildKindChips();

  const spoilerToggle = document.getElementById("spoiler-toggle");
  spoilerToggle.checked = spoilerProtection;
  spoilerToggle.addEventListener("change", () => {
    spoilerProtection = spoilerToggle.checked;
    saveSpoilerSetting();
    renderAll();
  });

  for (const id of ["search", "grade-filter", "status-filter"]) {
    document.getElementById(id).addEventListener("input", renderChecklist);
  }
  for (const tab of document.querySelectorAll(".tab")) {
    tab.addEventListener("click", () => switchView(tab.dataset.view));
  }

  document.getElementById("export-btn").addEventListener("click", exportProgress);
  document.getElementById("import-file").addEventListener("change", async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      await importProgress(file);
    } catch {
      alert("That file does not look like an exported progress file.");
    }
    event.target.value = "";
  });
  document.getElementById("reset-btn").addEventListener("click", () => {
    earnedIds = new Set();
    saveEarned();
    renderAll();
  });

  applyUrlParams();
  renderAll();
}

init();
