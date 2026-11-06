// Dominican psalm tones II–VIII (no canticles). Run: bun test ./tests/dominican-tones-2-8.test.js
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

function chant(text, gabc, clef, extra) {
  return context.applyPsalmTone(Object.assign({
    text: text, gabc: gabc, clef: clef || 'c4', useOpenNotes: false, useBoldItalic: false,
    format: 'gabc-plain', prefix: false, suffix: false, includeIntonation: false, verseNumber: 2
  }, extra || {})).replace(/\s+/g, ' ').trim();
}
function pitches(gabc) {
  var out = [], re = /([^()\s]+)\(([^)]*)\)/g, m;
  while ((m = re.exec(gabc))) out.push(m[1].replace(/[.,;:]+$/g,'') + '=' + m[2].replace(/\.$/,''));
  return out.join(' ');
}
function tone(name) { return context.g_tones[name]; }

describe('Tone II', function() {
  var t = tone('2. Dominican');
  test('short mediant, including a final monosyllable', function() {
    expect(pitches(chant('peccatórum non stetit', t.mediant, 'f3'))).toBe('pec=h ca=h tó=h rum=h non=h ste=i tit=h');
    expect(pitches(chant('púeri Dóminum', t.mediant, 'f3'))).toBe('pú=h e=h ri=h Dó=i mi=h num=h');
    expect(pitches(chant('Domus Aarón', t.mediant, 'f3'))).toBe('Do=h mus=h A=h a=h rón=i');
    expect(pitches(chant('locútus sum', t.mediant, 'f3'))).toBe('lo=h cú=h tus=h sum=i');
    expect(pitches(chant('Dicta sunt de te', t.mediant, 'f3'))).toBe('Dic=h ta=h sunt=h de=h te=i');
  });
  test('flex is re', function() {
    expect(pitches(chant('Impiórum † et non stetit', t.mediant, 'f3'))).toContain('ó=h rum=f');
  });
  test('termination mi ut re', function() {
    var g = t.termination;
    expect(pitches(chant('E u o u a e', g, 'f3'))).toBe('E=h u=h o=h u=g a=e e=f');
    expect(pitches(chant('Dómini íbimus', g, 'f3'))).toBe('Dó=h mi=g ni=g í=e bi=e mus=f');
    expect(pitches(chant('Mirabília fecit', g, 'f3'))).toBe('Mi=h ra=h bí=h li=g a=g fe=e cit=f');
    expect(pitches(chant('Super domum David', g, 'f3'))).toBe('Su=h per=h do=h mum=g Da=e vid=f');
    expect(pitches(chant('fíliæ Sion', g, 'f3'))).toBe('fí=h li=g æ=g Si=e on=f');
    expect(pitches(chant('In mirabílibus super me', g, 'f3'))).toBe('In=h mi=h ra=h bí=h li=g bus=g su=e per=e me=f');
    expect(pitches(chant('adjuvábunt me', g, 'f3'))).toBe('ad=h ju=g vá=e bunt=e me=f');
    expect(pitches(chant('Tua júdica me', g, 'f3'))).toBe('Tu=h a=h jú=g di=e ca=e me=f');
    expect(pitches(chant('Diligéntibus se', g, 'f3'))).toBe('Di=h li=h gén=h ti=g bus=e se=f');
    expect(pitches(chant('Timéntibus se', g, 'f3'))).toBe('Ti=h mén=h ti=g bus=e se=f');
    expect(pitches(chant('Qui convertúntur ad cor', g, 'f3'))).toBe('Qui=h con=h ver=h tún=h tur=g ad=e cor=f');
    expect(pitches(chant('Sǽculo tu es', g, 'f3'))).toBe('Sǽ=h cu=g lo=g tu=e es=f');
    expect(pitches(chant('Habitátio est in te', g, 'f3'))).toBe('Ha=h bi=h tá=h ti=h o=h est=g in=e te=f');
    expect(pitches(chant('Pestiléntiæ non sedit', g, 'f3'))).toBe('Pes=h ti=h lén=h ti=h æ=h non=g se=e dit=f');
    expect(pitches(chant('Pedum tuórum', g, 'f3'))).toBe('Pe=h dum=h tu=g ó=e rum=f');
    expect(pitches(chant('Fácere cum eis', g, 'f3'))).toBe('Fá=h ce=h re=h cum=g e=e is=f');
  });
});

describe('Tone IV and its do-clef alternative', function() {
  var t = tone('4. Dominican'), alt = tone('4. Dominican alt');
  test('mediant sol la before si, dactyl extends sol, final accent omits la', function() {
    expect(pitches(chant('peccatórum non stetit', t.mediant))).toBe('pec=h ca=h tó=h rum=g non=h ste=i tit=h');
    expect(pitches(chant('Volúntas ejus', t.mediant))).toBe('Vo=h lún=g tas=h e=i jus=h');
    expect(pitches(chant('Audívit Dóminus et dístulit', t.mediant))).toBe('Au=h dí=h vit=h Dó=h mi=g nus=g et=h dís=i tu=h lit=h');
    expect(pitches(chant('Árguas me', t.mediant))).toBe('Ár=h gu=g as=h me=i');
    expect(pitches(chant('Dóminus ex Sión', t.mediant))).toBe('Dó=h mi=h nus=h ex=g Si=h ón=i');
    expect(pitches(chant('Dóminus Sión', t.mediant))).toBe('Dó=h mi=g nus=g Si=h ón=i');
  });
  test('alt mediant is the same rules a fourth higher', function() {
    expect(pitches(chant('peccatórum non stetit', alt.mediant, 'c3'))).toBe('pec=i ca=i tó=i rum=h non=i ste=j tit=i');
    expect(pitches(chant('Árguas me', alt.mediant, 'c3'))).toBe('Ár=i gu=h as=i me=j');
  });
  test('first termination, five or six syllables', function() {
    expect(pitches(chant('E u o u a e', t.termination))).toBe('E=h u=g o=h u=ih a=gf e=e');
    expect(pitches(chant('Mirabília fecit', t.termination))).toBe('Mi=h ra=h bí=g li=h a=ih fe=gf cit=e');
    expect(pitches(chant('In mirabílibus super me', t.termination))).toBe('In=h mi=h ra=h bí=g li=h bus=ih su=g per=f me=e');
    expect(pitches(chant('Tuis Jerúsalem', t.termination))).toBe('Tu=g is=h Je=ih rú=g sa=f lem=e');
  });
  test('alt termination', function() {
    expect(pitches(chant('E u o u a e', alt.termination, 'c3'))).toBe('E=i u=h o=i u=j a=h e=f');
    expect(pitches(chant('Laudáte nomen Dómini', alt.termination, 'c3'))).toBe('Lau=i dá=i te=h no=i men=j Dó=h mi=f ni=f');
  });
});

describe('Tone V', function() {
  var t = tone('5. Dominican');
  test('short mediant', function() {
    expect(pitches(chant('Dómino meo', t.mediant, 'c3'))).toBe('Dó=h mi=h no=h me=i o=h');
    expect(pitches(chant('Dicta sunt de te', t.mediant, 'c3'))).toBe('Dic=h ta=h sunt=h de=h te=i');
  });
  test('two-accent termination', function() {
    var g = t.termination;
    expect(pitches(chant('E u ó u a e', g, 'c3'))).toBe('E=h u=h ó=i u=g a=h e=f');
    expect(pitches(chant('dextris meis', g, 'c3'))).toBe('dex=i tris=g me=h is=f');
    expect(pitches(chant('Pópulórum', g, 'c3'))).toBe('Pó=i pu=g ló=h rum=f');
    expect(pitches(chant('In excélsis', g, 'c3'))).toBe('In=i ex=g cél=h sis=f');
    expect(pitches(chant('In lætítia', g, 'c3'))).toBe('In=i læ=g tí=h ti=f a=f');
    expect(pitches(chant('In quibus non est salus', g, 'c3'))).toBe('In=h qui=h bus=h non=i est=g sa=h lus=f');
    expect(pitches(chant('Mirabília fecit', g, 'c3'))).toBe('Mi=h ra=h bí=i li=h a=g fe=h cit=f');
  });
});

describe('Tone VI reuses the Tone I mediant', function() {
  var t = tone('6. Dominican');
  test('mediant matches Tone I', function() {
    var text = 'Dóminum de cælis';
    expect(pitches(chant(text, t.mediant))).toBe(pitches(chant(text, tone('1. Dominican').mediant)));
  });
  test('termination on the fourth or fifth syllable', function() {
    var g = t.termination;
    expect(pitches(chant('E u o u a e', g))).toBe('E=h u=h o=f u=gh a=g e=f');
    expect(pitches(chant('Mirabília fecit', g))).toBe('Mi=h ra=h bí=h li=f a=gh fe=g cit=f');
    expect(pitches(chant('In lege Dómini', g))).toBe('In=h le=f ge=gh Dó=g mi=f ni=f');
    expect(pitches(chant('In mirabílibus super me', g))).toBe('In=h mi=h ra=h bí=h li=f bus=gh su=g per=f me=f');
    expect(pitches(chant('Tuis Jerúsalem', g))).toBe('Tu=h is=f Je=gh rú=g sa=f lem=f');
  });
});

describe('Tone VIII', function() {
  var t = tone('8. Dominican');
  test('short mediant', function() {
    expect(pitches(chant('Dómino meo', t.mediant))).toBe('Dó=j mi=j no=j me=k o=j');
    expect(pitches(chant('Dicta sunt de te', t.mediant))).toBe('Dic=j ta=j sunt=j de=j te=k');
    expect(pitches(chant('Jerúsalém', t.mediant))).toBe('Je=j rú=j sa=j lém=k');
  });
  test('first termination', function() {
    var g = t.terminations.G;
    expect(pitches(chant('E u o u a e', g))).toBe('E=j u=j o=i u=j a=h e=g');
    expect(pitches(chant('Á dextris meis', g))).toBe('Á=j dex=i tris=j me=h is=g');
    expect(pitches(chant('In domum Dómini íbimus', g))).toBe('In=j do=j mum=j Dó=j mi=i ni=j í=h bi=g mus=g');
    expect(pitches(chant('In mirabílibus super me', g))).toBe('In=j mi=j ra=j bí=j li=i bus=j su=h per=g me=g');
  });
  test('second termination', function() {
    var g = t.terminations.c;
    expect(pitches(chant('E u o u a e', g))).toBe('E=j u=j o=h u=j a=k e=j');
    expect(pitches(chant('Ante lucíferum génui te', g))).toBe('An=j te=j lu=j cí=j fe=h rum=j gé=k nu=j i=j te=j');
    expect(pitches(chant('Et præcínxit se', g))).toBe('Et=h præ=j cín=k xit=j se=j');
    expect(pitches(chant('Qui convertúntur ad cor', g))).toBe('Qui=j con=j ver=j tún=h tur=j ad=k cor=j');
  });
});

describe('Tone III mediant follows Tone I; first termination is its own', function() {
  var t = tone('3. Dominican');
  test('mediant pitches are re ut si ut on the Tone I accents', function() {
    expect(pitches(chant('Dóminum de cælis', t.mediant))).toBe('Dó=k mi=j num=j de=j cæ=i lis=j');
    expect(pitches(chant('Patri et Fílio', t.mediant))).toBe('Pa=k tri=j et=j Fí=i li=i o=j');
  });
  test('first termination', function() {
    var g = t.termination;
    expect(pitches(chant('E u o u a e', g))).toBe('E=j u=j o=ji u=hi a=h e=gh');
    expect(pitches(chant('ánima mea Dóminum', g))).toBe('á=j ni=j ma=j me=ji a=hi Dó=h mi=g num=gh');
    expect(pitches(chant('In lege Dómini', g))).toBe('In=j le=ji ge=hi Dó=h mi=g ni=gh');
    expect(pitches(chant('Mirabília fecit', g))).toBe('Mi=j ra=j bí=j li=ji a=hi fe=h cit=gh');
    expect(pitches(chant('Et præcínxit se', g))).toBe('Et=ji præ=hi cín=h xit=g se=gh');
  });
});

describe('Roman tone 2 is untouched', function() {
  test('formula and output', function() {
    expect(context.g_tones['2.'].mediant).toBe("e f hr 'i hr h.");
    expect(context.g_tones['7. Dominican']).toBeUndefined();
    var out = chant('non stetit', context.g_tones['2.'].mediant, 'f3', { favor: 'intonation', includeIntonation: undefined });
    expect(out).toContain('(e)');
  });
});
