(function () {
  var LATIN_URL = "dominican-tones-latin.md";
  var ENGLISH_URL = "dominican-tones-english.md";
  var ROMAN = { I: 1, II: 2, III: 3, IV: 4, V: 5, VI: 6, VII: 7, VIII: 8 };
  // A Windows checkout (core.autocrlf) rewrites the Markdown as CRLF, and a
  // fence may also carry trailing spaces. Require neither to be absent.
  var gabcPattern = /[ \t]{0,3}```[ \t]*gabc[ \t]*\n([\s\S]*?)\n[ \t]{0,3}```[ \t]*/g;

  var chants = [];
  var layoutWidth = 0;

  function escapeHtml(value) {
    return value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  // The prose is a small subset of Markdown: `code`, **bold**, and *italics*.
  function formatMarkdown(src) {
    var html = "";
    for (var i = 0; i < src.length; i++) {
      if (src.charAt(i) === "`") {
        var endCode = src.indexOf("`", i + 1);
        if (endCode > i) {
          html += "<code>" + escapeHtml(src.slice(i + 1, endCode)) + "</code>";
          i = endCode;
          continue;
        }
      }
      if (src.substr(i, 2) === "**") {
        var endBold = src.indexOf("**", i + 2);
        if (endBold > i) {
          html += "<strong>" + formatMarkdown(src.slice(i + 2, endBold)) + "</strong>";
          i = endBold + 1;
          continue;
        }
      }
      if (src.charAt(i) === "*") {
        var endEm = src.indexOf("*", i + 1);
        if (endEm > i) {
          html += "<em>" + formatMarkdown(src.slice(i + 1, endEm)) + "</em>";
          i = endEm;
          continue;
        }
      }
      html += escapeHtml(src.charAt(i));
    }
    return html;
  }

  // [Tr.: ...] notes may contain a nested bracket, as in "[Nota]".
  function renderInline(src) {
    var notes = [];
    var text = "";
    for (var i = 0; i < src.length; i++) {
      if (src.substr(i, 5) === "[Tr.:") {
        var depth = 0;
        var j = i;
        for (; j < src.length; j++) {
          if (src.charAt(j) === "[") depth++;
          else if (src.charAt(j) === "]") {
            depth--;
            if (depth === 0) {
              j++;
              break;
            }
          }
        }
        text += "\uE000" + notes.length + "\uE001";
        notes.push(src.slice(i, j));
        i = j - 1;
      } else {
        text += src.charAt(i);
      }
    }
    var html = formatMarkdown(text);
    for (var n = 0; n < notes.length; n++) {
      html = html.replace(
        "\uE000" + n + "\uE001",
        '<span class="tr-note">' + formatMarkdown(notes[n]) + "</span>"
      );
    }
    return html;
  }

  function normalizeNewlines(value) {
    return String(value).replace(/^\uFEFF/, "").replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  }

  function tokenize(markdown) {
    var text = normalizeNewlines(markdown);
    var tokens = [];
    var last = 0;
    var match;
    gabcPattern.lastIndex = 0;
    while ((match = gabcPattern.exec(text))) {
      tokens.push({ type: "text", text: text.slice(last, match.index) });
      tokens.push({ type: "gabc", gabc: match[1] });
      last = match.index + match[0].length;
    }
    tokens.push({ type: "text", text: text.slice(last) });
    return tokens;
  }

  function headerField(gabc, key) {
    var text = normalizeNewlines(gabc);
    var end = text.match(/(?:^|\n)%%[ \t]*\n/);
    var head = end ? text.slice(0, end.index) : text;
    var escaped = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    var match = new RegExp("(?:^|\\n)" + escaped + ":\\s*([^;\\r\\n]*)", "i").exec(head);
    return match ? match[1].trim() : null;
  }

  function toneNumber(line) {
    var bare = line.replace(/^\*\*|\*\*$/g, "");
    if (!ROMAN[bare]) return 0;
    if (bare === line || line === "**" + bare + "**") return ROMAN[bare];
    return 0;
  }

  function cellHtml(line) {
    if (toneNumber(line)) {
      var bare = line.replace(/^\*\*|\*\*$/g, "");
      return '<h2 class="tone">' + escapeHtml(bare) + "</h2>";
    }
    if (/^\*\*[^*]+\*\*$/.test(line)) {
      return '<h3 class="section">' + formatMarkdown(line.slice(2, -2)) + "</h3>";
    }
    return "<p>" + renderInline(line) + "</p>";
  }

  function pairBlocks(latin, english) {
    var left = tokenize(latin);
    var right = tokenize(english);
    if (left.length !== right.length) {
      throw new Error("Latin and English do not have the same number of sections.");
    }
    var blocks = [];
    for (var i = 0; i < left.length; i++) {
      if (left[i].type !== right[i].type) {
        throw new Error("Latin and English sections are out of order.");
      }
      if (left[i].type === "gabc") {
        if (left[i].gabc !== right[i].gabc) {
          throw new Error("A chant example differs between the Latin and the English.");
        }
        blocks.push({ type: "gabc", gabc: left[i].gabc });
        continue;
      }
      var latinLines = left[i].text.split("\n");
      var englishLines = right[i].text.split("\n");
      if (latinLines.length !== englishLines.length) {
        throw new Error("A passage is not line-aligned between Latin and English.");
      }
      for (var j = 0; j < latinLines.length; j++) {
        blocks.push({ type: "line", la: latinLines[j], en: englishLines[j] });
      }
    }
    return blocks;
  }

  function placeSvg(host, svg) {
    // Fixed pixel size, as on the psalm-tone and transcription pages: the
    // score was broken into lines at this width, so the viewBox would only
    // rescale it.
    svg.removeAttribute("viewBox");
    host.replaceChildren(svg);
  }

  function renderScore(entry) {
    var ctxt = makeExsurgeChantContext();
    var useDropCap = headerField(entry.gabc, "initial-style") !== "0";
    var mappings = exsurge.Gabc.createMappingsFromSource(ctxt, entry.gabc);
    if (!mappings || !mappings.length) {
      throw new Error("Example " + entry.n + " produced no notation.");
    }
    var score = new exsurge.ChantScore(ctxt, mappings, useDropCap);
    entry.ctxt = ctxt;
    entry.score = score;
    return new Promise(function (resolve, reject) {
      try {
        score.performLayoutAsync(ctxt, function () {
          try {
            score.layoutChantLines(ctxt, entry.host.clientWidth, function () {
              try {
                placeSvg(entry.host, score.createSvgNode(ctxt));
                resolve();
              } catch (error) {
                reject(error);
              }
            });
          } catch (error) {
            reject(error);
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  function relayoutAll() {
    var width = chants.length ? chants[0].host.clientWidth : 0;
    if (!width || Math.abs(width - layoutWidth) < 2) return;
    layoutWidth = width;
    chants.forEach(function (entry) {
      if (!entry.score) return;
      entry.score.layoutChantLines(entry.ctxt, width, function () {
        placeSvg(entry.host, entry.score.createSvgNode(entry.ctxt));
      });
    });
  }

  function buildPage(blocks) {
    var main = document.getElementById("tones");
    var precededByBlank = false;
    var exampleCount = 0;
    blocks.forEach(function (block) {
      if (block.type === "gabc") {
        exampleCount++;
        var figure = document.createElement("figure");
        figure.className = "chant";
        var host = document.createElement("div");
        host.className = "chant-host";
        var name = headerField(block.gabc, "name");
        if (name) figure.setAttribute("aria-label", name);
        figure.appendChild(host);
        main.appendChild(figure);
        chants.push({ n: exampleCount, gabc: block.gabc, host: host, figure: figure });
        precededByBlank = false;
        return;
      }
      if (!block.la.trim() && !block.en.trim()) {
        precededByBlank = true;
        return;
      }
      var row = document.createElement("div");
      row.className = "pair" + (precededByBlank ? "" : " tight");
      var tone = toneNumber(block.la.trim());
      if (tone) row.id = "tone-" + tone;
      var latin = document.createElement("div");
      latin.className = "cell la";
      latin.lang = "la";
      latin.setAttribute("data-label", "Latin");
      latin.innerHTML = cellHtml(block.la);
      var english = document.createElement("div");
      english.className = "cell en";
      english.lang = "en";
      english.setAttribute("data-label", "English");
      english.innerHTML = cellHtml(block.en);
      row.appendChild(latin);
      row.appendChild(english);
      main.appendChild(row);
      precededByBlank = false;
    });
    return exampleCount;
  }

  function finish(rendered, errors) {
    window.dominicanTones = {
      examples: chants.length,
      rendered: rendered,
      errors: errors,
      translatorNotes: document.querySelectorAll(".tr-note").length,
      done: true
    };
    var status = document.getElementById("render-status");
    if (errors.length) {
      status.textContent = errors.join(" ");
    }
  }

  async function main() {
    var responses = await Promise.all([fetch(LATIN_URL), fetch(ENGLISH_URL)]);
    if (!responses[0].ok || !responses[1].ok) {
      throw new Error("The Latin or English text could not be loaded.");
    }
    var latin = await responses[0].text();
    var english = await responses[1].text();
    var count = buildPage(pairBlocks(latin, english));
    if (count !== 59) {
      throw new Error("Expected 59 chant examples and found " + count + ".");
    }
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
      await Promise.all([
        document.fonts.load("19px 'Crimson Text'"),
        document.fonts.load("italic 19px 'Crimson Text'"),
        document.fonts.load("bold 19px 'Crimson Text'")
      ]);
    }
    layoutWidth = chants[0].host.clientWidth;
    var rendered = 0;
    var errors = [];
    for (var i = 0; i < chants.length; i++) {
      try {
        await renderScore(chants[i]);
        var svg = chants[i].host.querySelector("svg.Exsurge");
        var lines = svg && svg.querySelectorAll("g.chantLine").length;
        if (!svg || !lines) {
          throw new Error("Example " + chants[i].n + " did not draw a staff.");
        }
        rendered++;
      } catch (error) {
        console.error(error);
        errors.push(error && error.message ? error.message : String(error));
        chants[i].host.textContent = errors[errors.length - 1];
      }
    }
    finish(rendered, errors);
    var resizeTimer;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(relayoutAll, 150);
    });
  }

  main().catch(function (error) {
    console.error(error);
    finish(0, [error && error.message ? error.message : String(error)]);
  });
})();
