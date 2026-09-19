(function () {
  function run() {
    try {
      var external = document.getElementById("external-status");
      if (external) external.textContent = "YES";

      var scripts = Array.prototype.slice.call(document.scripts || []);
      var nextCount = scripts.filter(function (s) {
        return (s.src || "").indexOf("/_next/") !== -1;
      }).length;
      var next = document.getElementById("next-scripts");
      if (next) next.textContent = String(nextCount);

      var resources = performance && performance.getEntriesByType
        ? performance.getEntriesByType("resource")
        : [];
      var failedNext = resources.filter(function (entry) {
        return entry.name && entry.name.indexOf("/_next/") !== -1 && entry.transferSize === 0 && entry.duration > 0;
      });

      if (failedNext.length) {
        var err = document.getElementById("resource-error");
        if (err) err.textContent = "possible _next failure: " + failedNext[0].name;
      }
    } catch (error) {
      var err = document.getElementById("resource-error");
      if (err) err.textContent = "external error: " + String(error && error.message ? error.message : error);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
})();