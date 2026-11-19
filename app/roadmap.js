// The platinum roadmap: nine phases in the order the game allows them, built from
// the official trophy descriptions (story order, tracked counts, unlock points)
// and the save/missable reporting cited in the footer sources.

export const ROADMAP_PHASES = [
  {
    title: "Before you roll — save discipline",
    text: "There is no mission replay and no New Game Plus, so your saves are the safety net for the whole list. Keep a manual save at the start of every chapter, one untouched save from just before the final mission, and rotate the rest of the 15 manual slots. Never use cheats on this save: they switch off trophies and saving.",
    trophyIds: [],
  },
  {
    title: "Chapter 1 — arrival, and the one missable",
    text: "Play the opening: Gone Fishing and Chapter 1. During Chapter 1, do Lucia's balcony meditation at Jason's house (a morning after Down to Earth is the usual time) — it counts toward Positive Mental Attitude and disappears when the chapter ends. That is the list's only confirmed missable element.",
    trophyIds: [2, 3, 28],
  },
  {
    title: "Chapters 2 to 4 — open the city",
    text: "Finish the chapters and the named story missions. Partner play opens in Chapter 2, and with it the Real Estate app (Little Boxes), the Scooter Bros app (On the Spot) and, in Chapter 3, jewelry robberies and the Snap Gun (Sneakthief) plus the time-sensitive Race Against Yago strand event. Bank vaults arrive through an optional mission late in Chapter 4.",
    trophyIds: [4, 5, 6, 8, 9, 10, 11, 12, 13],
  },
  {
    title: "The finale",
    text: "Complete the final mission for the gold story trophy. Everything outside the story — side-strand finales included — stays available after the credits, and finishing unlocks the 100% Completion checklist under Progress, then Stats.",
    trophyIds: [7],
  },
  {
    title: "Side strands — strangers of Leonida",
    text: "Clear 8 stranger strands for Strangers & Freaks, checking the trophy counter as you go: Andy's, Billy's and Tyrone's strands carry their own finale trophies instead of counting. Finish those three anyway, plus Kenton's, Randy's and Bret's Jason-only hunting strand.",
    trophyIds: [25, 22, 23, 24, 26, 27, 29],
  },
  {
    title: "Collect and discover",
    text: "The map-wide counters: 3 card sets, 100 WAiNK locations, the remaining meditation spots (bring your partner — outdoor spots can count for both characters), 100 discovered vehicles (scan traffic with the WAiNK app as you drive) and the last grey patches of Leonida's map.",
    trophyIds: [30, 31, 28, 35, 42],
  },
  {
    title: "Activities and challenges",
    text: "250 stunts, gold in all 42 Shooting Range challenges, a Top Fun drone-race win at all 14 locations, 20 different race wins, 50 challenges, and the one-offs: an arcade game, Cal's fishing challenge, Combat Focus, and the hidden free-roam secrets — the VCIA jet, the Mile Zero tank, max Strength with your partner, the Kingpin Bowling job and the 500 Criminal Profile actions that accrue as you play.",
    trophyIds: [15, 17, 18, 19, 32, 16, 20, 21, 36, 37, 38, 47, 46, 48, 44, 45, 49, 50, 51],
  },
  {
    title: "Crime and money",
    text: "Rob 5 bank vaults with your partner (the escapes double as Hot Together), an armored truck, a jewelry store unseen, and one illegal operation from each of the 9 gangs. Launder $250,000 of marked bills through your contacts, spend $100,000 across shops, buy the 8 garages early — every Scooter Bros registration needs a free space — then register 10 cheap cars.",
    trophyIds: [40, 33, 41, 39, 43, 34, 52, 53, 54, 55],
  },
  {
    title: "100% completion — and the platinum",
    text: "The checklist outruns the trophy list: 300 stunts, 70 of 80 challenges, 200 vehicles, all 8 vaults and all 39 gang operations. When A Long Road pops, the last unearned trophy is the platinum itself — Vice Got a Price! unlocks the moment the other 54 are all in.",
    trophyIds: [14, 1],
  },
];

export function renderRoadmap(container, trophiesById, earnedIds) {
  container.innerHTML = "";
  ROADMAP_PHASES.forEach((phase, index) => {
    const panel = document.createElement("article");
    panel.className = "panel phase";

    const head = document.createElement("div");
    head.className = "phase-head";
    const num = document.createElement("span");
    num.className = "phase-num";
    num.textContent = `Phase ${index + 1}`;
    const title = document.createElement("h3");
    title.textContent = phase.title;
    head.append(num, title);

    if (phase.trophyIds.length > 0) {
      const done = phase.trophyIds.filter((id) => earnedIds.has(id)).length;
      const progress = document.createElement("span");
      progress.className = "phase-progress";
      progress.textContent = `${done} / ${phase.trophyIds.length} earned`;
      head.append(progress);
    }

    const body = document.createElement("p");
    body.textContent = phase.text;

    const chips = document.createElement("div");
    chips.className = "phase-trophies";
    for (const id of phase.trophyIds) {
      const trophy = trophiesById.get(id);
      if (!trophy) continue;
      const chip = document.createElement("span");
      chip.className = "phase-trophy" + (earnedIds.has(id) ? " done" : "");
      chip.textContent = trophy.name;
      chips.append(chip);
    }

    panel.append(head, body, chips);
    container.append(panel);
  });
}
