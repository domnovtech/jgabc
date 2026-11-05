// Dominican Tone I against the worked examples, plus a Roman-tone guard.
// Run with: bun test
const { describe, test, expect } = require('bun:test');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const context = {
  console,
  setTimeout: function() { return 0; },
  clearTimeout: function() {},
  localStorage: {},
  location: { search: '' },
  URLSearchParams: URLSearchParams,
  module: { exports: null }
};
context.window = context;
context.global = context;
context.$ = {
  extend: function(a, b) {
    if (a === true) return Object.assign({}, arguments[2]);
    return Object.assign({}, a, b);
  },
  fn: {}
};
vm.createContext(context);
const hypher = fs.readFileSync(path.join(root, 'jquery.hypher.js'), 'utf8').split('}());(function')[0] + '}());';
vm.runInContext(hypher, context, { filename: 'jquery.hypher.js' });
vm.runInContext(fs.readFileSync(path.join(root, 'patterns/la-hypher.js'), 'utf8'), context, { filename: 'la-hypher.js' });
vm.runInContext(fs.readFileSync(path.join(root, 'util.js'), 'utf8'), context, { filename: 'util.js' });
vm.runInContext(fs.readFileSync(path.join(root, 'psalmtone.js'), 'utf8'), context, { filename: 'psalmtone.js' });

function chant(text, gabc, extra) {
  return context.applyPsalmTone(Object.assign({
    text: text,
    gabc: gabc,
    clef: 'c4',
    useOpenNotes: false,
    useBoldItalic: false,
    format: 'gabc-plain',
    prefix: false,
    suffix: false,
    includeIntonation: false,
    verseNumber: 2
  }, extra || {})).replace(/\s+/g, ' ').trim();
}
function pitches(gabc) {
  var out = [];
  var re = /([^()\s]+)\(([^)]*)\)/g;
  var m;
  while ((m = re.exec(gabc))) out.push(m[1].replace(/[.,;:]+$/g, '') + '=' + m[2].replace(/\.$/, ''));
  return out.join(' ');
}

var med = context.g_tones['1. Dominican'].mediant;
var endRe = context.g_tones['1. Dominican'].terminations['1 re'];
var endSol = context.g_tones['1. Dominican'].terminations['2 sol'];
var endLa = context.g_tones['1. Dominican'].terminations['3 la'];
var mag = context.g_tones['1. Dominican Magnificat'].mediant;
var ben = context.g_tones['1. Dominican Benedictus'].mediant;

describe('Dominican Tone I mediant', function() {
  test('intonation on the first two syllables, then the tenor', function() {
    var out = chant('Primus tonus sic íncipit et sic mediátur', med, { includeIntonation: true, verseNumber: 1 });
    expect(pitches(out)).toBe('Pri=f mus=gh to=h nus=h sic=h ín=h ci=h pit=h et=h sic=h me=ixi di=h á=g tur=h');
  });
  test('flex drops the syllables after the accent', function() {
    var out = chant('Impiórum † et in via peccatórum non stetit', med);
    expect(pitches(out)).toBe('Im=h pi=h ó=h rum=g et=h in=h vi=h a=h pec=h ca=h tó=h rum=h non=ixi ste=g tit=h');
    expect(out).toContain('†');
  });
  test('Dóminum de cælis keeps the la between si and sol', function() {
    expect(pitches(chant('Dóminum de cælis', med))).toBe('Dó=ixi mi=h num=h de=h cæ=g lis=h');
  });
  test('Patri et Fílio doubles sol on the proparoxytone', function() {
    expect(pitches(chant('Patri et Fílio', med))).toBe('Pa=ixi tri=h et=h Fí=g li=g o=h');
  });
  test('dístulit doubles sol; the si is the previous accent', function() {
    expect(pitches(chant('Audívit Dóminus et dístulit', med))).toBe('Au=h dí=h vit=h Dó=ixi mi=h nus=h et=h dís=g tu=g lit=h');
  });
  test('three syllables with two accents omit the la', function() {
    expect(pitches(chant('Non stetit', med))).toBe('Non=ixi ste=g tit=h');
  });
  test('Indútus est', function() {
    // The office prints In-dú-tus; the tool's hyphenation is Ind-ú-tus. The accent is still si, the next syllable sol, the last la.
    expect(pitches(chant('Indútus est', med))).toBe('Ind=h ú=ixi tus=g est=h');
  });
  test('two final monosyllables take the third word', function() {
    expect(pitches(chant('Bonus es tu', med))).toBe('Bo=ixi nus=h es=g tu=h');
    expect(pitches(chant('Contra me est', med))).toBe('Con=ixi tra=h me=g est=h');
    expect(pitches(chant('In me est', med))).toBe('In=ixi me=g est=h');
  });
  test('Justus es, Dómine', function() {
    expect(pitches(chant('Justus es, Dómine', med))).toBe('Jus=h tus=h es=ixi Dó=g mi=g ne=h');
  });
  test('a disyllabic atonic before a word accented on its first syllable', function() {
    expect(pitches(chant('Super eum', med))).toBe('Su=ixi per=h e=g um=h');
  });
  test('monosyllable before a paroxytone of three syllables', function() {
    expect(pitches(chant('et tabéscet', med))).toBe('et=ixi ta=h bé=g scet=h');
  });
  test('atonic before a proparoxytone of four syllables', function() {
    expect(pitches(chant('cum princípibus', med))).toBe('cum=ixi prin=h cí=g pi=g bus=h');
  });
  test('the second syllable before the accent of a long word', function() {
    expect(pitches(chant('misericórdia', med))).toBe('mi=h se=ixi ri=h cór=g di=g a=h');
    expect(pitches(chant('benedíctum', med))).toBe('be=ixi ne=h díc=g tum=h');
  });
  test('ex Síon, with the written accent and no Hebrew list', function() {
    expect(pitches(chant('Dóminus ex Síon', med))).toBe('Dó=h mi=h nus=h ex=ixi Sí=g on=h');
  });
  test('cívitas after ut', function() {
    expect(pitches(chant('ut cívitas', med))).toBe('ut=ixi cí=g vi=g tas=h');
  });
  test('Jerúsalém follows the two written accents', function() {
    expect(pitches(chant('Jerúsalém', med))).toBe('Je=h rú=ixi sa=g lém=h');
  });
  test('a single Latin accent on Jerúsalem is a proparoxytone, not a Hebrew name', function() {
    expect(pitches(chant('Jerúsalem', med))).toBe('Je=h rú=g sa=g lem=h');
  });
  test('Aarón is not re-accented from the final accent alone', function() {
    expect(pitches(chant('Domus Aarón', med))).toBe('Do=ixi mus=h A=h a=g rón=h');
  });
});

describe('Dominican Tone I terminations', function() {
  test('the three endings differ only in the last neume', function() {
    expect(pitches(chant('E u o u a e', endRe))).toBe('E=h u=h o=g u=f a=gh e=gvFED');
    expect(pitches(chant('E u o u a e', endSol))).toBe('E=h u=h o=g u=f a=gh e=g');
    expect(pitches(chant('E u o u a e', endLa))).toBe('E=h u=h o=g u=f a=gh e=h');
  });
  test('Sede a dextris meis and Nomen Dómini', function() {
    expect(pitches(chant('Sede a dextris meis', endRe))).toBe('Se=h de=h a=h dex=g tris=f me=gh is=gvFED');
    expect(pitches(chant('Nomen Dómini', endRe))).toBe('No=g men=f Dó=gh mi=g ni=gvFED');
  });
  test('a final monosyllable is not the accent', function() {
    expect(pitches(chant('Ante lucíferum génui te', endRe))).toBe('An=h te=h lu=h cí=h fe=g rum=f gé=gh nu=g i=g te=gvFED');
    expect(pitches(chant('In quibus non est salus', endSol))).toBe('In=h qui=h bus=h non=g est=f sa=gh lus=g');
    expect(pitches(chant('In mirabílibus super me', endSol))).toBe('In=h mi=h ra=h bí=h li=g bus=f su=gh per=g me=g');
    expect(pitches(chant('Qui convertúntur ad cor', endSol))).toBe('Qui=h con=h ver=h tún=g tur=f ad=gh cor=g');
    expect(pitches(chant('consolátus es me', endSol))).toBe('con=h so=h lá=g tus=f es=gh me=g');
  });
  test('David and Jerúsalem from their written accents', function() {
    expect(pitches(chant('Super domum David', endSol))).toBe('Su=h per=h do=g mum=f Da=gh vid=g');
    expect(pitches(chant('Tui Jerúsalem', endSol))).toBe('Tu=h i=g Je=f rú=gh sa=g lem=g');
  });
});

describe('Dominican Tone I Magnificat and Benedictus', function() {
  test('Magnificat verse 1 has intonation and no mediant', function() {
    expect(pitches(chant('Magníficat', mag, { includeIntonation: true, verseNumber: 1 }))).toBe('Ma=f gní=gh fi=h cat=h');
  });
  test('later Magnificat verses have the canticle mediant and the intonation', function() {
    expect(pitches(chant('Et exsultávit spíritus meus', mag, { includeIntonation: true, verseNumber: 2 }))).toBe('Et=f ex=gh sul=h tá=h vit=hg spí=gixi ri=h tus=h me=hg us=gh');
  });
  test('a final monosyllable shifts the canticle accent back', function() {
    // magna and potens are ma-gna and pot-ens here; gna is the syllable before the accent, ens the penult.
    expect(pitches(chant('Quia fecit mihi magna qui potens est', mag, { includeIntonation: true, verseNumber: 2 }))).toBe('Qui=f a=gh fe=h cit=h mi=h hi=h ma=h gna=hg qui=gixi pot=h ens=hg est=gh');
  });
  test('Benedictus keeps the mediant on verse 1, and Israël does not shift past Deus', function() {
    var out = chant('Benedíctus Dóminus Deus Israél', ben, { includeIntonation: true, verseNumber: 1 });
    expect(pitches(out)).toContain('Be=f ne=gh');
    expect(pitches(out)).toContain('nus=hg De=gixi us=h Is=h ra=hg él=gh');
  });
  test('no flex on the gospel canticles', function() {
    var out = chant('Et exsultávit † spíritus meus', mag, { includeIntonation: true, verseNumber: 2 });
    expect(out).not.toContain('†');
    expect(pitches(out)).not.toContain('vit=g');
  });
  test('canticle terminations are the psalm terminations', function() {
    expect(pitches(chant('ánima mea Dóminum', endSol, { includeIntonation: true }))).toBe('á=h ni=h ma=h me=g a=f Dó=gh mi=g num=g');
  });
});

describe('Roman tones stay on the ordinary engine', function() {
  test('Tone I Dominican is an extra dropdown entry and does not replace tone 1', function() {
    expect(context.g_tones['1.'].mediant).toBe("f gh hr 'ixi hr 'g hr h.");
    expect(context.g_tones['1. Dominican'].rules).toBe('dominican-1');
    expect(context.d_tones['1. Dominican'].rules).toBe('dominican-1');
    expect(Object.keys(context.g_tones['1. Dominican'].terminations)).toEqual(['1 re', '2 sol', '3 la']);
  });
  test('a Roman formula is unchanged', function() {
    var out = chant('Dóminum de cælis', "f gh hr 'ixi hr 'g hr h.", { favor: 'intonation', includeIntonation: undefined });
    expect(out.replace(/<[^>]+>/g, '')).toBe('Dó(f)mi(gh)num(ixi) de(h) cæ(g)lis(h.)');
    var ending = chant('Nomen Dómini', "hr g f 'gh gr gvFED.", { favor: 'termination' });
    expect(ending.replace(/<[^>]+>/g, '')).toBe('No(g)men(f) Dó(gh)mi(g)ni(gvFED.)');
  });
});
