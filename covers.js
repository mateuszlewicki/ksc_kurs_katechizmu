// Okładki są wczytywane z małych plików tekstowych (base64) i składane w obraz.
(function () {
  var PARTS = { k: 35, m: 22, y: 10 };
  Object.keys(PARTS).forEach(function (p) {
    var el = document.querySelector('img[data-cover="' + p + '"]');
    if (!el) return;
    var jobs = [];
    for (var i = 0; i < PARTS[p]; i++) {
      jobs.push(fetch("i/" + p + (i < 10 ? "0" : "") + i + ".txt").then(function (r) { return r.ok ? r.text() : ""; }));
    }
    Promise.all(jobs).then(function (t) {
      var b = t.join("").replace(/\s+/g, "");
      if (b) el.src = "data:image/jpeg;base64," + b;
    }).catch(function () {});
  });
})();
