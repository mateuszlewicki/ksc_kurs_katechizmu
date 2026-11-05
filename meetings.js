// Spotkania online: data (RRRR-MM-DD), start 19:00, czas trwania 90 minut.
const MEETINGS = ["2026-11-05", "2027-01-14", "2027-03-04", "2027-04-15"];
const MEETING_START = "19:00", MEETING_MINUTES = 90;
(function () {
  const [sh, sm] = MEETING_START.split(":").map(Number);
  const end = new Date(2000, 0, 1, sh, sm + MEETING_MINUTES);
  const endTxt = String(end.getHours()).padStart(2, "0") + ":" + String(end.getMinutes()).padStart(2, "0");
  $("#meetings").innerHTML = MEETINGS.map((d, i) => {
    const day = new Date(d + "T12:00:00").toLocaleDateString("pl-PL", {weekday: "long", day: "numeric", month: "long", year: "numeric"});
    return `<div class="flex items-center justify-between gap-3 px-4 py-3 ${i ? "border-t border-slate-200 dark:border-slate-700" : "mt-2 border-t border-slate-200 dark:border-slate-700"}"><div><b class="block">${esc(day)}</b><small class="text-slate-600 dark:text-slate-400">${MEETING_START}–${endTxt} · 1,5 godz.</small></div>${badge(d)}</div>`;
  }).join("");
})();
