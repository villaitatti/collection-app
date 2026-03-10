(function () {
  function initMbDiaryDots() {
    var panels = document.querySelectorAll('#mb_home .full-screen-panel');
    var dots   = document.querySelectorAll('#mb_diaries_diaries .nav-dot-css');
    if (!panels.length || !dots.length) return false;

    var ratios = Array.from({ length: panels.length }, function () { return 0; });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var idx = Array.from(panels).indexOf(entry.target);
        if (idx !== -1) ratios[idx] = entry.intersectionRatio;
      });

      var activeIdx = ratios.reduce(function (best, r, i) {
        return r > ratios[best] ? i : best;
      }, 0);

      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === activeIdx);
      });
    }, { threshold: [0, 0.25, 0.5, 0.75, 1] });

    panels.forEach(function (p) { observer.observe(p); });
    return true;
  }

  function tryInit(attemptsLeft) {
    if (initMbDiaryDots()) return;
    if (attemptsLeft > 0) {
      setTimeout(function () { tryInit(attemptsLeft - 1); }, 200);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { tryInit(15); });
  } else {
    tryInit(15);
  }
})();
