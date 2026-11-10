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
    expect(pitches(chant('et morti non trádidit me', g, 'c3'))).toBe('et=h mor=i ti=h non=g trá=h di=f dit=f me=f');
    expect(pitches(chant('Pestiléntiæ non sedit', g, 'c3'))).toBe('Pes=h ti=h lén=i ti=h æ=h non=g se=h dit=f');
    expect(pitches(chant('Qui convertúntur ad cor', g, 'c3'))).toBe('Qui=h con=h ver=h tún=i tur=g ad=h cor=f');
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
    var g = t.terminations['1'];
    expect(pitches(chant('E u o u a e', g))).toBe('E=j u=j o=ji u=hi a=h e=gh');
    expect(pitches(chant('ánima mea Dóminum', g))).toBe('á=j ni=j ma=j me=ji a=hi Dó=h mi=g num=gh');
    expect(pitches(chant('In lege Dómini', g))).toBe('In=j le=ji ge=hi Dó=h mi=g ni=gh');
    expect(pitches(chant('Mirabília fecit', g))).toBe('Mi=j ra=j bí=j li=ji a=hi fe=h cit=gh');
    expect(pitches(chant('Et præcínxit se', g))).toBe('Et=ji præ=hi cín=h xit=g se=gh');
  });
});

describe('Tone III second termination', function() {
  var g = tone('3. Dominican').terminations['2'];
  test('la before the last accent, then ut, final si-la', function() {
    expect(pitches(chant('E u ó u a e', g))).toBe('E=j u=j ó=j u=h a=j e=ih');
    expect(pitches(chant('Dextris meis', g))).toBe('Dex=j tris=h me=j is=ih');
    expect(pitches(chant('Lege Dómini', g))).toBe('Le=j ge=h Dó=j mi=j ni=ih');
    expect(pitches(chant('In excélsis', g))).toBe('In=j ex=h cél=j sis=ih');
    expect(pitches(chant('In lætítia', g))).toBe('In=j læ=h tí=j ti=j a=ih');
    expect(pitches(chant('In Jerúsalem', g))).toBe('In=j Je=h rú=j sa=j lem=ih');
    expect(pitches(chant('Esuriéntibus', g))).toBe('E=j su=j ri=h én=j ti=j bus=ih');
    expect(pitches(chant('Populórum', g))).toBe('Po=j pu=h ló=j rum=ih');
    expect(pitches(chant('Deo Jácob', g))).toBe('De=j o=h Já=j cob=ih');
    expect(pitches(chant('In quibus non est salus', g))).toBe('In=j qui=j bus=j non=j est=h sa=j lus=ih');
    expect(pitches(chant('Consolátus es me', g))).toBe('Con=j so=j lá=j tus=h es=j me=ih');
    expect(pitches(chant('Convertúntur ad cor', g))).toBe('Con=j ver=j tún=j tur=h ad=j cor=ih');
  });
  test('si la when two syllables stand before the last accent', function() {
    expect(pitches(chant('Pestiléntiæ non sedit', g))).toBe('Pes=j ti=j lén=j ti=j æ=i non=h se=j dit=ih');
    expect(pitches(chant('Spirítui Sancto', g))).toBe('Spi=j rí=j tu=i i=h Sanc=j to=ih');
    expect(pitches(chant('Tuis Jerúsalem', g))).toBe('Tu=j is=i Je=h rú=j sa=j lem=ih');
    expect(pitches(chant('Ante lucíferum génui te', g))).toBe('An=j te=j lu=j cí=j fe=i rum=h gé=j nu=j i=j te=ih');
    expect(pitches(chant('Tuum vivífica me', g))).toBe('Tu=j um=i vi=h ví=j fi=j ca=j me=ih');
    expect(pitches(chant('Mirabílibus super me', g))).toBe('Mi=j ra=j bí=j li=i bus=h su=j per=j me=ih');
  });
});

describe('Tone VII', function() {
  var t = tone('7. Dominican');
  test('intonation, flex, and the Tone I mediant on fa mi re mi', function() {
    var init = chant('Séptimus tonus sic íncipit', t.mediant, 'c3', { includeIntonation: true, verseNumber: 1 });
    expect(pitches(init).indexOf('Sép=h ti=hi')).toBe(0);
    expect(pitches(chant('Impiórum † et non stetit', t.mediant, 'c3'))).toContain('ó=i rum=h');
    expect(pitches(chant('In lege Dómini volúntas ejus', t.mediant, 'c3'))).toBe('In=i le=i ge=i Dó=i mi=i ni=i vo=i lún=k tas=j e=i jus=j');
    expect(pitches(chant('Audívit Dóminus et dístulit', t.mediant, 'c3'))).toBe('Au=i dí=i vit=i Dó=k mi=j nus=j et=j dís=i tu=i lit=j');
    expect(pitches(chant('Non stetit', t.mediant, 'c3'))).toBe('Non=k ste=i tit=j');
    expect(pitches(chant('Indútus est', t.mediant, 'c3'))).toBe('Ind=i ú=k tus=i est=j');
    expect(pitches(chant('Bonus es tu', t.mediant, 'c3'))).toBe('Bo=k nus=j es=i tu=j');
    expect(pitches(chant('In me est', t.mediant, 'c3'))).toBe('In=k me=i est=j');
    expect(pitches(chant('misericórdia', t.mediant, 'c3'))).toBe('mi=i se=k ri=j cór=i di=i a=j');
    expect(pitches(chant('Jerúsalém', t.mediant, 'c3'))).toBe('Je=i rú=k sa=i lém=j');
    expect(pitches(chant('Jerúsalem', t.mediant, 'c3'))).toBe('Je=i rú=i sa=i lem=j');
    expect(pitches(chant('Súper eum', t.mediant, 'c3'))).toBe('Sú=k per=j e=i um=j');
    expect(pitches(chant('cum princípibus', t.mediant, 'c3'))).toBe('cum=k prin=j cí=i pi=i bus=j');
  });
  test('first termination, the nine word shapes', function() {
    var g = t.terminations['1'];
    expect(pitches(chant('Cómmovébitur', g, 'c3'))).toBe('Cóm=j mo=i vé=h bi=h tur=gf');
    expect(pitches(chant('Pópulórum', g, 'c3'))).toBe('Pó=j pu=i ló=h rum=gf');
    expect(pitches(chant('Benédicétur', g, 'c3'))).toBe('Be=i né=j di=i cé=h tur=gf');
    expect(pitches(chant('In lætítia', g, 'c3'))).toBe('In=j læ=i tí=h ti=h a=gf');
    expect(pitches(chant('Moysi et Aaron', g, 'c3'))).toBe('Mo=i y=i si=j et=i A=h a=h ron=gf');
    expect(pitches(chant('Salvum me fácias', g, 'c3'))).toBe('Sal=j vum=i me=i fá=h ci=h as=gf');
    expect(pitches(chant('In excélsis', g, 'c3'))).toBe('In=j ex=i cél=h sis=gf');
    expect(pitches(chant('Pédum tuórum', g, 'c3'))).toBe('Pé=j dum=i tu=i ó=h rum=gf');
    expect(pitches(chant('Dextris meis', g, 'c3'))).toBe('Dex=j tris=i me=h is=gf');
    expect(pitches(chant('Super eum', g, 'c3'))).toBe('Su=j per=i e=h um=gf');
    expect(pitches(chant('Pestiléntiæ non sedit', g, 'c3'))).toBe('Pes=i ti=i lén=j ti=i æ=i non=i se=h dit=gf');
    expect(pitches(chant('Vúlpium erunt', g, 'c3'))).toBe('Vúl=j pi=i um=i e=h runt=gf');
    expect(pitches(chant('Non est salus', g, 'c3'))).toBe('Non=j est=i sa=h lus=gf');
    expect(pitches(chant('Jacób et Joseph', g, 'c3'))).toBe('Ja=i cób=j et=i Jo=h seph=gf');
    expect(pitches(chant('Diligéntibus te', g, 'c3'))).toBe('Di=i li=j gén=i ti=h bus=h te=gf');
    expect(pitches(chant('Et enútries me', g, 'c3'))).toBe('Et=i e=j nú=i tri=h es=h me=gf');
    expect(pitches(chant('Vivífica me', g, 'c3'))).toBe('Vi=j ví=i fi=h ca=h me=gf');
    expect(pitches(chant('Ante lucíferum génui te', g, 'c3'))).toBe('An=i te=i lu=i cí=j fe=i rum=i gé=i nu=h i=h te=gf');
    expect(pitches(chant('Tua líbera me', g, 'c3'))).toBe('Tu=j a=i lí=i be=h ra=h me=gf');
    expect(pitches(chant('Ut éruas me', g, 'c3'))).toBe('Ut=j é=i ru=h as=h me=gf');
    expect(pitches(chant('Et præcínxit se', g, 'c3'))).toBe('Et=j præ=i cín=h xit=h se=gf');
    expect(pitches(chant('Quæ in eis sunt', g, 'c3'))).toBe('Quæ=j in=i e=h is=h sunt=gf');
    expect(pitches(chant('In mirabílibus super me', g, 'c3'))).toBe('In=i mi=i ra=i bí=j li=i bus=i su=h per=h me=gf');
    expect(pitches(chant('Qui convertúntur ad cor', g, 'c3'))).toBe('Qui=i con=i ver=i tún=j tur=i ad=h cor=gf');
    expect(pitches(chant('Consolátus es me', g, 'c3'))).toBe('Con=i so=i lá=j tus=i es=h me=gf');
    expect(pitches(chant('Habitátio est in te', g, 'c3'))).toBe('Ha=i bi=i tá=j ti=i o=i est=i in=h te=gf');
  });
  test('second termination changes only the final neume', function() {
    var g = t.terminations['2'];
    expect(pitches(chant('Pópulórum', g, 'c3'))).toBe('Pó=j pu=i ló=h rum=gi');
    expect(pitches(chant('Diligéntibus te', g, 'c3'))).toBe('Di=i li=j gén=i ti=h bus=h te=gi');
    expect(pitches(chant('Et præcínxit se', g, 'c3'))).toBe('Et=j præ=i cín=h xit=h se=gi');
  });
  test('aut is acute and ac is grave', function() {
    expect(pitches(chant('aut stetit', t.mediant, 'c3'))).toBe('aut=k ste=i tit=j');
    expect(pitches(chant('ac stetit', t.mediant, 'c3'))).toBe('ac=i ste=i tit=j');
  });
});

describe('Roman tone 2 is untouched', function() {
  test('formula and output', function() {
    expect(context.g_tones['2.'].mediant).toBe("e f hr 'i hr h.");
    expect(context.g_tones['7. Dominican'].clef).toBe('c3');
    var out = chant('non stetit', context.g_tones['2.'].mediant, 'f3', { favor: 'intonation', includeIntonation: undefined });
    expect(out).toContain('(e)');
  });
});
