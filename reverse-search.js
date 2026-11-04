// Reverse search: type a word in Urdu/Shahmukhi-style script and get the English word.
// Works on balochi.html, pashto.html and punjabi.html with no other changes.
// Add this line just above </body> in each page:
//   <script src="reverse-search.js"></script>
(function () {
  if (typeof dictionary === "undefined" || typeof searchBox === "undefined" ||
      typeof resultsDiv === "undefined" || typeof showResult === "undefined") return;

  function stripMarks(s) {
    return String(s)
      .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, "")   // remove diacritics
      .replace(/\u0643/g, "\u06A9")                          // Arabic kaf -> Urdu kaf
      .replace(/\u064A/g, "\u06CC")                          // Arabic yeh -> Urdu yeh
      .replace(/\u06BE/g, "\u06C1")                          // do-chashmi heh -> heh
      .replace(/\s+/g, " ")
      .trim();
  }

  function forms(entry) {
    return stripMarks(entry.script).split(/\s*[\/،,]\s*/);
  }

  searchBox.addEventListener("input", function () {
    const raw = searchBox.value.trim();
    if (!/[\u0600-\u06FF\u0750-\u077F]/.test(raw)) return;   // not script: normal English search handles it

    if (typeof suggestionsList !== "undefined") suggestionsList.style.display = "none";

    const q = stripMarks(raw);
    let matches = dictionary.filter(function (e) { return forms(e).includes(q); });
    if (matches.length === 0) {
      matches = dictionary.filter(function (e) { return stripMarks(e.script).includes(q); });
    }

    if (matches.length === 0) {
      resultsDiv.innerHTML = '<p>No match found for this script.</p>';
      return;
    }
    if (matches.length === 1) {
      showResult(matches[0], "Found by its script");
      return;
    }

    resultsDiv.innerHTML = '<p class="suggestion-note">' + matches.length + ' words match. Tap one:</p>';
    matches.slice(0, 8).forEach(function (entry) {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "chip";
      b.textContent = (entry.emoji || "") + " " + entry.word + " \u2014 " + entry.script;
      b.addEventListener("click", function () {
        searchBox.value = entry.word;
        showResult(entry);
      });
      resultsDiv.appendChild(b);
    });
  });
})();