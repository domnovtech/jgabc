// Lexical accent from Processionarium pp. 338–341, then each tone's own cadence.
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

function marked(text) {
  var words = context.op1GroupWords(context.getSyllables(text));
  context.op1MarkAccents(words);
  return words.map(function(w) {
    return w.syls.map(function(s) { return (s.accent ? '*' : '') + s.sylnospace; }).join('-');
  }).join(' ');
}
function pitches(text, gabc, clef) {
  var out = context.applyPsalmTone({
    text: text, gabc: gabc, clef: clef || 'c4', useOpenNotes: false, useBoldItalic: false,
    format: 'gabc-plain', prefix: false, suffix: false, includeIntonation: false, verseNumber: 2
  });
  var parts = [], re = /([^()\s]+)\(([^)]*)\)/g, m;
  while ((m = re.exec(out))) parts.push(m[1].replace(/[.,;:]+$/g, '') + '=' + m[2].replace(/\.$/, ''));
  return parts.join(' ');
}
const tone1 = context.g_tones['1. Dominican'].mediant;

describe('Dominican lexical accent', function() {
  test('copulatives are grave; the acute lists stay accented', function() {
    expect(marked('et ac atque')).toBe('et ac at-que');
    expect(marked('non nec neque sed aut vel at')).toBe('*non *nec *ne-que *sed *aut *vel *at');
  });
  test('a preposition before a word is grave, and accented when it ends the half-verse', function() {
    expect(marked('propter te')).toBe('prop-ter *te');
    expect(marked('sine te')).toBe('si-ne *te');
    expect(marked('Ante me')).toBe('An-te *me');
    expect(marked('secus decúrsus')).toBe('se-cus de-*cúr-sus');
    expect(marked('ultra flúmina')).toBe('ul-tra *flú-mi-na');
    expect(marked('te propter')).toBe('*te *prop-ter');
    expect(marked('valet ultra')).toBe('*va-let *ul-tra');
  });
  test('cum is grave before a noun and acute before a finite verb or a reviewed Vulgate wording', function() {
    expect(marked('cum servo')).toBe('cum *ser-vo');
    expect(marked('cum víderit')).toBe('*cum *ví-de-rit');
    expect(marked('cum declínat')).toBe('*cum de-*clí-nat');
    expect(marked('cum irátus')).toBe('*cum i-*rá-tus');
  });
  test('codex examples: final accent on adhúc, antepenult on alíquando', function() {
    expect(marked('adhúc')).toBe('ad-*húc');
    expect(marked('alíquando')).toBe('a-*lí-quan-do');
    expect(marked('déinde')).toBe('*dé-in-de');
  });
  test('a star forces the acute and a tilde forces the grave', function() {
    expect(marked('pro*pter te')).toBe('*prop-ter *te');
    expect(marked('e*t')).toBe('*et');
    expect(marked('~non stetit')).toBe('non *ste-tit');
    expect(marked('~non stetit')).not.toContain('~');
  });
});

describe('Tone I keeps its own cadence on top of those accents', function() {
  test('et stays between the accents; ex Síon is raised because the tone says so', function() {
    expect(pitches('Patri et Fílio', tone1)).toBe('Pa=ixi tri=h et=h Fí=g li=g o=h');
    expect(pitches('Dóminus ex Síon', tone1)).toBe('Dó=h mi=h nus=h ex=ixi Sí=g on=h');
    expect(pitches('Super eum', tone1)).toBe('Su=ixi per=h e=g um=h');
  });
  test('an atonic disyllable before a monosyllable receives the adventitious accent', function() {
    expect(pitches('Ante me', tone1)).toBe('An=ixi te=g me=h');
    expect(pitches('propter te', tone1)).toBe('prop=ixi ter=g te=h');
  });
  test('a tilde removes the accent Non would otherwise take', function() {
    expect(pitches('Non stetit', tone1)).toBe('Non=ixi ste=g tit=h');
    expect(pitches('~non stetit', tone1)).toBe('non=h ste=g tit=h');
  });
  test('the ordinary Roman tone is unchanged', function() {
    expect(pitches('Dóminum de cælis', "f gh hr 'ixi hr 'g hr h.")).toBe('Dó=f mi=gh num=ixi de=h cæ=g lis=h');
  });
});
