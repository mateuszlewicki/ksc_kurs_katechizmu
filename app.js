const $ = s => document.querySelector(s);
const esc = s => s.replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const rng = (a, b) => a === b ? `${a}` : `${a}–${b}`;
const fmtDate = iso => new Date(iso + "T12:00:00").toLocaleDateString("pl-PL", {day:"numeric", month:"long", year:"numeric"});
const mem = {};
const store = {
  get(k){ try { const v = localStorage.getItem(k); return v === null ? mem[k] : v; } catch { return mem[k]; } },
  set(k, v){ mem[k] = v; try { localStorage.setItem(k, v); } catch {} }
};
const COLORS = {
  amber:   {b:"border-amber-500", t:"text-amber-600 dark:text-amber-400"},
  red:     {b:"border-red-600", t:"text-red-700 dark:text-red-400"},
  emerald: {b:"border-emerald-600", t:"text-emerald-700 dark:text-emerald-400"},
  violet:  {b:"border-violet-600", t:"text-violet-700 dark:text-violet-400"}
};
const url = (p, it) => it[3] === "c" ? `${BASE}kkk${p.roman}-${it[4]}-${it[5]}.htm` : null;
const link = (u, h) => `<a class="text-blue-700 dark:text-blue-400 underline decoration-1 underline-offset-2" href="${u}" target="_blank" rel="noopener">${h}</a>`;
// "1749-1754, 1757-1758" -> każdy zakres linkuje do rozdziału, w którym leży
const topicLink = (p, r) => "KKK " + r.split(",").map(s => s.trim()).map(seg => {
  const n = parseInt(seg, 10), it = p.items.find(i => i[3] === "c" && n >= i[1] && n <= i[2]);
  return it ? link(url(p, it), esc(seg)) : esc(seg);
}).join(", ");

function daysLeft(iso){
  const t = new Date(); t.setHours(0,0,0,0);
  return Math.round((new Date(iso + "T00:00:00") - t) / 86400000);
}
function badge(iso){
  const n = daysLeft(iso), base = "shrink-0 whitespace-nowrap border px-2.5 py-0.5 text-sm ";
  if (n < 0) return `<span class="${base}border-slate-300 dark:border-slate-600 text-slate-500">minął</span>`;
  if (n === 0) return `<span class="${base}border-red-600 text-red-700 dark:text-red-400">dziś</span>`;
  const soon = n <= 30 ? "border-red-600 text-red-700 dark:text-red-400" : "border-slate-300 dark:border-slate-600";
  return `<span class="${base}${soon}">za ${n} ${n === 1 ? "dzień" : "dni"}</span>`;
}
function renderDeadlines(){
  const list = [...PARTS.map(p => ({l:`${p.title} – list apologetyczny`, s:p.name, d:p.due})),
    {l:"Oświadczenie o przeczytaniu", s:"YouCat, Kompendium lub pełny Katechizm", d:"2027-04-10"}].sort((a,b) => a.d.localeCompare(b.d));
  $("#deadlines").innerHTML = list.map((x, i) =>
    `<div class="flex items-center justify-between gap-3 px-4 py-3 ${i ? "border-t border-slate-200 dark:border-slate-700" : ""}"><div><b class="block">${esc(x.l)}</b><small class="text-slate-600 dark:text-slate-400">${esc(fmtDate(x.d))} · ${esc(x.s)}</small></div>${badge(x.d)}</div>`).join("");
}

const TOPIC_NOTE = {
  3: "Numery według YouCat, obok zakres punktów KKK. Na platformie ta sekcja jest ukryta przed studentami.",
  def: "Pytania i zarzuty, które ludzie naprawdę zadają lub od lat podnoszą wobec wiary (ateiści, protestanci, Świadkowie Jehowy, dyskusje o Kościele). Kolejność według punktów KKK. To propozycje, nie lista z platformy kursu."
};
function renderParts(){
  $("#parts").innerHTML = PARTS.map(p => {
    const c = COLORS[p.color];
    const rows = p.items.map(it => {
      const u = url(p, it);
      return `<li class="flex justify-between gap-3 border-b border-slate-200 dark:border-slate-700 py-1.5 last:border-0 ${it[3]==="h" ? "font-semibold" : ""}"><span>${u ? link(u, esc(it[0])) : esc(it[0])}</span><span class="whitespace-nowrap tabular-nums text-slate-500 dark:text-slate-400">${rng(it[1], it[2])}</span></li>`;
    }).join("");
    const topics = TOPICS[p.id] ? `
      <h3 class="mt-4 mb-1 font-semibold">${p.id === 3 ? "Tematy do pracy pisemnej" : "Przykładowe tematy listu apologetycznego"}</h3>
      <p class="mb-2 text-sm text-slate-600 dark:text-slate-400">${TOPIC_NOTE[p.id] || TOPIC_NOTE.def}</p>
      <ul id="topicList${p.id}" class="mt-2"></ul>` : "";
    return `<details class="mb-3 border border-l-[6px] ${c.b} bg-white dark:bg-slate-900">
      <summary class="flex cursor-pointer list-none items-center gap-3 px-4 py-3.5">
        <span class="w-12 shrink-0 text-center text-3xl font-semibold leading-none ${c.t}" aria-hidden="true">${p.roman}</span>
        <span class="flex-1"><span class="block text-xl font-semibold">${p.title}</span><span class="block text-sm text-slate-600 dark:text-slate-400">${esc(p.name)} · KKK ${rng(p.from, p.to)}</span></span>
      </summary>
      <div class="px-4 pb-4"><ul>${rows}</ul>${topics}</div></details>`;
  }).join("");
  PARTS.forEach(p => {
    if (!TOPICS[p.id]) return;
    renderTopics(p, "");
    const f = $("#topicFilter" + p.id);
    if (f) f.addEventListener("input", () => renderTopics(p, f.value));
  });
}
function renderTopics(p, q){
  const ul = $("#topicList" + p.id); if (!ul) return;
  const s = q.trim().toLowerCase();
  const rows = TOPICS[p.id].filter(t => !s || (t[0] + " " + t[1] + " " + t[2]).toLowerCase().includes(s));
  ul.innerHTML = rows.length ? rows.map((t, i) =>
    `<li class="flex flex-wrap gap-x-3 border-b border-slate-200 dark:border-slate-700 py-2 last:border-0">${t[0] ? `<span class="min-w-[2.6em] tabular-nums text-slate-500 dark:text-slate-400">${t[0]}</span>` : `<span class="text-slate-400" aria-hidden="true">•</span>`}<div class="flex-1 min-w-[12em]">${esc(t[1])}</div>${t[2] ? `<span class="text-sm">${topicLink(p, t[2])}</span>` : ""}</li>`).join("")
    : `<li class="py-2">Brak tematów pasujących do „${esc(q)}”. Spróbować krótszego fragmentu.</li>`;
}

const TASKS = [
  ...PARTS.map(p => ({k:`list${p.id}`, t:`${p.title}: list apologetyczny oddany`})),
  {k:"decl", t:"Oświadczenie o przeczytaniu podpisane"},
  {k:"track", t:"Śledzenie zmian włączone we wszystkich listach"}
];
function renderProgress(){
  $("#progress").innerHTML = TASKS.map(x =>
    `<label class="flex items-center gap-2.5 py-1.5"><input type="checkbox" class="h-5 w-5 accent-blue-600" data-k="${x.k}" ${store.get("kkk:" + x.k) === "1" ? "checked" : ""}> ${esc(x.t)}</label>`).join("") +
    `<p id="progCount" class="mt-2 text-sm text-slate-600 dark:text-slate-400"></p>`;
  const upd = () => { $("#progCount").textContent = `Zrobione: ${TASKS.filter(x => store.get("kkk:" + x.k) === "1").length} z ${TASKS.length}. Zapis tylko w tej przeglądarce.`; };
  $("#progress").addEventListener("change", e => { if (e.target.dataset.k) { store.set("kkk:" + e.target.dataset.k, e.target.checked ? "1" : "0"); upd(); } });
  upd();
}

$("#theme").addEventListener("click", () => {
  const dark = document.documentElement.classList.toggle("dark");
  try { localStorage.setItem("theme", dark ? "dark" : "light"); } catch {}
});

renderDeadlines(); renderParts(); renderProgress();
