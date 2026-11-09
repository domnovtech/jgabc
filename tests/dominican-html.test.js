// HTML emphasis follows the GABC cadence. Tone I and Roman tones keep addBoldItalic.
const { describe, test, expect } = require('bun:test');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const root = path.join(__dirname, '..');
const context = { console, setTimeout: function(){return 0;}, clearTimeout: function(){}, localStorage: {}, location: { search: '' }, URLSearchParams: URLSearchParams, module: { exports: null } };
context.window = context;
context.$ = { extend: function(a,b){ if (a===true) return Object.assign({}, arguments[2]); return Object.assign({}, a, b); }, fn: {} };
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(root,'jquery.hypher.js'),'utf8').split('}());(function')[0]+'}());', context);
vm.runInContext(fs.readFileSync(path.join(root,'patterns/la-hypher.js'),'utf8'), context);
vm.runInContext(fs.readFileSync(path.join(root,'util.js'),'utf8'), context);
vm.runInContext(fs.readFileSync(path.join(root,'psalmtone.js'),'utf8'), context);

function htmlFor(formula, text, clef) {
  const parsed = context.getGabcTones(formula, undefined, false, clef || 'c4');
  if (parsed.rules && !parsed.accents && parsed.rules.indexOf('dominican-1') !== 0) {
    return context.dominicanEmphasisHtml(text, parsed, clef || 'c4', 'html', false, 2, false, false, 1);
  }
  return context.addBoldItalic(text, parsed.accents, parsed.preparatory, parsed.afterLastAccent, 'html', false, 2, false, false, 1);
}
function tags(html) { return html.replace(/<(?!\/?(?:b|i)\b)[^>]*>/g, ''); }
function boldText(html) {
  var out = [], re = /<b>(.*?)<\/b>/g, m;
  while ((m = re.exec(html))) out.push(m[1]);
  return out;
}

describe('HTML cadence emphasis', function() {
  const g = context.g_tones;
  test('Tone I keeps the ordinary accent markup', function() {
    expect(tags(htmlFor(g['1. Dominican'].mediant, 'secúndum magnam misericórdiam tuam'))).toBe('secúndum magnam miseri<b>cór</b>diam <b>tu</b>am');
    expect(tags(htmlFor(g['1. Dominican'].terminations['2 sol'], 'dele iniquitátem meam'))).toBe('dele iniqui<i>tá</i><i>tem</i> <b>me</b>am');
  });
  test('Roman tone 2 termination is unchanged', function() {
    expect(tags(htmlFor(g['2.'].termination, 'dele iniquitátem meam', 'f3'))).toBe('dele iniquitá<i>tem</i> <b>me</b>am');
  });
  test('Tone II no longer bolds the recitation', function() {
    const html = htmlFor(g['2. Dominican'].termination, 'dele iniquitátem meam', 'f3');
    expect(tags(html)).toBe('dele iniquitá<i>tem</i> <b>me</b>am');
    expect(boldText(html)).toEqual(['me']);
    const html2 = htmlFor(g['2. Dominican'].termination, 'et a peccáto meo munda me', 'f3');
    expect(boldText(html2)).toEqual(['mun']);
    expect(tags(html2).indexOf('<b>et</b>')).toBe(-1);
  });
  test('Tone V bolds its two cadence accents', function() {
    const html = htmlFor(g['5. Dominican'].termination, 'dele iniquitátem meam', 'c3');
    expect(tags(html)).toBe('dele iniqui<b>tá</b>tem <b>me</b>am');
    expect(boldText(html)).toEqual(['tá', 'me']);
    const html2 = htmlFor(g['5. Dominican'].termination, 'et a peccáto meo munda me', 'c3');
    expect(boldText(html2)).toEqual(['me', 'mun']);
  });
  test('Tone IV mediant italics the sol-la approach and bolds si', function() {
    expect(tags(htmlFor(g['4. Dominican'].mediant, 'peccatórum non stetit'))).toBe('peccató<i>rum</i> <i>non</i> <b>ste</b>tit');
    expect(tags(htmlFor(g['4. Dominican alt'].mediant, 'peccatórum non stetit', 'c3'))).toBe('peccató<i>rum</i> <i>non</i> <b>ste</b>tit');
  });
  test('bold syllables are inside the GABC cadence, not the reciting tone', function() {
    const cases = [
      ['2. Dominican', 'termination', 'f3', 'dele iniquitátem meam'],
      ['5. Dominican', 'termination', 'c3', 'dele iniquitátem meam'],
      ['6. Dominican', 'termination', 'c4', 'dele iniquitátem meam'],
      ['8. Dominican', 'terminations.G', 'c4', 'dele iniquitátem meam'],
      ['3. Dominican', 'termination', 'c4', 'dele iniquitátem meam'],
      ['4. Dominican', 'termination', 'c4', 'dele iniquitátem meam']
    ];
    cases.forEach(function(row) {
      var tone = g[row[0]];
      var formula = row[1].indexOf('.') > 0 ? tone.terminations.G : tone[row[1]];
      var html = htmlFor(formula, row[3], row[2]);
      var gabc = context.applyPsalmTone({ text: row[3], gabc: formula, clef: row[2], useBoldItalic: false, format: 'gabc-plain', prefix: false, suffix: false, includeIntonation: false, verseNumber: 2 });
      boldText(html).forEach(function(word) {
        expect(gabc.indexOf(word + '(')).toBeGreaterThan(-1);
      });
      expect(tags(html).indexOf('<b>de</b>')).toBe(-1);
    });
  });
});
