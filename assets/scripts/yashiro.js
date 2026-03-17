/**
 * yashiro.js — shared UI scripts for the Yashiro & Berenson application
 * Handles: image carousel, section-break centering
 */
(function () {
  'use strict';

  /* =========================================================
     1. IMAGE CAROUSEL (home page hero background)
     ========================================================= */
  function initCarousel() {
    var carousel = document.getElementById('yashiro-carousel');
    if (!carousel) return;
    if (carousel._carouselReady) return;

    var bgs   = carousel.querySelectorAll('.yashiro-carousel-bg');
    var dots  = carousel.querySelectorAll('.yashiro-carousel-dot');
    var prevBtn = document.getElementById('carousel-prev');
    var nextBtn = document.getElementById('carousel-next');
    var titleEl = document.getElementById('carousel-caption-title');
    var descEl  = document.getElementById('carousel-caption-desc');

    if (!bgs.length || !prevBtn || !nextBtn) {
      setTimeout(initCarousel, 150);
      return;
    }

    carousel._carouselReady = true;
    var current = 0;
    var timer;

    function updateCaption(n) {
      var bg = bgs[n];
      if (titleEl) titleEl.textContent = bg.dataset.title || '';
      if (descEl)  descEl.textContent  = bg.dataset.desc  || '';
    }

    function goTo(n) {
      bgs[current].classList.remove('active');
      if (dots[current]) dots[current].classList.remove('active');
      current = (n + bgs.length) % bgs.length;
      bgs[current].classList.add('active');
      if (dots[current]) dots[current].classList.add('active');
      updateCaption(current);
    }

    function resetTimer() {
      clearInterval(timer);
      timer = setInterval(function () { goTo(current + 1); }, 6000);
    }

    prevBtn.addEventListener('click', function () { goTo(current - 1); resetTimer(); });
    nextBtn.addEventListener('click', function () { goTo(current + 1); resetTimer(); });
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () { goTo(i); resetTimer(); });
    });

    updateCaption(0);
    timer = setInterval(function () { goTo(current + 1); }, 6000);
  }

  /* =========================================================
     2. SECTION BREAKS — center paragraphs containing only ***
     ========================================================= */
  function initSectionBreaks() {
    var paras = document.querySelectorAll(
      '.yashiro-prose-article p, .yashiro-static-content article p, #main-container article p'
    );
    paras.forEach(function (p) {
      if (p.textContent.trim() === '***') {
        p.classList.add('yashiro-section-break');
      }
    });
  }

  /* =========================================================
     INIT — retry until ResearchSpace has rendered the DOM
     ========================================================= */
  function initAll() {
    initCarousel();
    initSectionBreaks();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
  setTimeout(initAll, 600);
  setTimeout(initAll, 1800);
})();
