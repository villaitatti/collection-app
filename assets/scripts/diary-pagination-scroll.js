// Scroll back to the top of the diary page-browser whenever the reader
// changes pages via the semantic-table/Griddle pagination footer (the
// "« 1 2 3 4 »" links under #mb_diaries_diary in Template:mbdiaries-ontology:Diary.html).
//
// Griddle swaps which rows are mounted in place -- there is no navigation
// event, no URL change, and no router for anything else to hook into -- so
// without this, clicking a page number leaves the reader at whatever
// scroll position they were at on the previous page, landing somewhere in
// the middle of the new set of diary sequences instead of at the first one.
(function () {
  'use strict';

  var RESULTS_SELECTOR = '#table-result';
  var CONTAINER_SELECTOR = '#mb_diaries_diary';
  var PAGINATION_LINK_SELECTOR =
    CONTAINER_SELECTOR + ' .griddle-footer .pagination li:not(.disabled) a';

  function scrollToTopOfResults(behavior) {
    var target =
      document.querySelector(RESULTS_SELECTOR) ||
      document.querySelector(CONTAINER_SELECTOR);
    if (target) {
      target.scrollIntoView({ behavior: behavior, block: 'start' });
    } else {
      window.scrollTo({ top: 0, behavior: behavior });
    }
  }

  // Each new row mounts an rs-text-annotation-workspace that fetches its own
  // IIIF image after the row itself lands in the DOM, so the page keeps
  // growing/reflowing for a while after Griddle's initial swap (image load
  // time varies with network conditions). A single scroll right after the
  // swap gets outrun by that later reflow and the reader ends up back below
  // the fold, so watch the container for DOM mutations and keep re-pinning
  // the scroll position until things settle down, instead of trusting one
  // fixed delay.
  var SETTLE_QUIET_MS = 250;
  var MAX_WATCH_MS = 4000;

  function afterPageChange() {
    var container = document.querySelector(CONTAINER_SELECTOR);

    scrollToTopOfResults('auto');

    if (!container || typeof MutationObserver === 'undefined') {
      setTimeout(function () { scrollToTopOfResults('smooth'); }, 300);
      return;
    }

    var quietTimer = null;
    var stopped = false;

    function stop() {
      if (stopped) {
        return;
      }
      stopped = true;
      observer.disconnect();
      clearTimeout(quietTimer);
      clearTimeout(maxWatchTimer);
      scrollToTopOfResults('smooth');
    }

    var observer = new MutationObserver(function () {
      scrollToTopOfResults('auto');
      clearTimeout(quietTimer);
      quietTimer = setTimeout(stop, SETTLE_QUIET_MS);
    });

    observer.observe(container, { childList: true, subtree: true, attributes: true });

    quietTimer = setTimeout(stop, SETTLE_QUIET_MS);
    var maxWatchTimer = setTimeout(stop, MAX_WATCH_MS);
  }

  // Capture phase, not bubble: Griddle/React may call stopPropagation() on
  // the click as part of its own handling, which would stop a bubble-phase
  // listener on document from ever seeing it. Capture fires on the way down,
  // before that can happen.
  document.addEventListener('click', function (event) {
    var link = event.target.closest(PAGINATION_LINK_SELECTOR);
    if (!link) {
      return;
    }
    afterPageChange();
  }, true);
})();
