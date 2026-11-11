(function () {
  "use strict";
  var box = document.getElementById("picker"), out = document.getElementById("pick-out");
  if (!box || !out) { return; }
  var A = {
    fast: "Ask for an acrylic or wall-panel system. Most go in within one to two days once the materials arrive, with little or no grout.",
    clean: "Ask for solid surface or large wall panels. Fewer seams means less to scrub; skip small tile with lots of grout lines.",
    look: "Ask for custom tile. It costs more and takes one to three weeks, so ask each bidder which waterproofing system they use and whether they flood-test it.",
    safe: "Ask for a low-threshold or curbless shower with a built-in seat and wall blocking for grab bars. If you are replacing a tub, say so up front; it changes the plumbing and floor work."
  };
  box.addEventListener("click", function (e) {
    var b = e.target.closest("button[data-k]"); if (!b) { return; }
    box.querySelectorAll("button").forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
    out.textContent = A[b.getAttribute("data-k")];
  });
})();
