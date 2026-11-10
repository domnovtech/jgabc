// Solemn on a Dominican tone is the Magnificat/Benedictus canticle form.
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

function pitches(text, gabc, clef, extra) {
  var out = context.applyPsalmTone(Object.assign({
    text: text, gabc: gabc, clef: clef || 'c4', useOpenNotes: false, useBoldItalic: false,
    format: 'gabc-plain', prefix: false, suffix: false, includeIntonation: true, verseNumber: 2
  }, extra || {}));
  var parts = [], re = /([^()\s]+)\(([^)]*)\)/g, m;
  while ((m = re.exec(out))) parts.push(m[1].replace(/[.,;:†]+$/g, '') + '=' + m[2].replace(/\.$/, ''));
  return parts.join(' ');
}
const g = context.g_tones;

describe('Solemn is the Dominican canticle form', function() {
  test('no separate Magnificat entry', function() {
    expect(g['1. Dominican Magnificat']).toBeUndefined();
    expect(g['1. Dominican'].solemn).toContain('dominican-1-canticle');
  });
  test('Tone I Magnificat verse 1 has no mediant; later verses use the canticle mediant', function() {
    var s = g['1. Dominican'].solemn;
    expect(pitches('Magníficat', s, 'c4', { omitMediant: true, verseNumber: 1 })).toBe('Ma=f gní=gh fi=h cat=h');
    expect(pitches('Et exsultávit spíritus meus', s)).toBe('Et=f ex=gh sul=h tá=h vit=hg spí=gixi ri=h tus=h me=hg us=gh');
    expect(pitches('Quia fecit mihi magna qui potens est', s)).toBe('Qui=f a=gh fe=h cit=h mi=h hi=h ma=h gna=hg qui=gixi pot=h ens=hg est=gh');
    expect(pitches('Quia respéxit', s)).toBe('Qui=f a=gh re=h spé=h xit=h');
    expect(pitches('Benedíctus Dóminus Deus Israél', s)).toBe('Be=f ne=gh díc=h tus=h Dó=h mi=h nus=hg De=gixi us=h Is=h ra=hg él=gh');
  });
  test('without Solemn the same verse stays a psalm mediant', function() {
    expect(pitches('Et exsultávit spíritus meus', g['1. Dominican'].mediant, 'c4', { includeIntonation: false }))
      .toBe('Et=h ex=h sul=h tá=h vit=h spí=ixi ri=h tus=h me=g us=h');
  });
  test('a flex in the canticle mediant is not lowered', function() {
    expect(pitches('Et exsultávit † spíritus meus', g['1. Dominican'].solemn)).toContain('tá=h vit=hg');
  });
  test('other tones follow their own canticle sections', function() {
    expect(pitches('Et exsultávit spíritus meus', g['2. Dominican'].solemn, 'f3'))
      .toBe('Et=e ex=f sul=eh tá=h vit=hg spí=hi ri=i tus=i me=hi us=h');
    expect(pitches('Magníficat', g['2. Dominican'].solemn, 'f3', { omitMediant: true }))
      .toBe('Ma=e gní=f fi=eh cat=h');
    expect(pitches('Et exsultávit spíritus meus', g['3. Dominican'].solemn))
      .toBe('Et=g ex=hj sul=j tá=j vit=j spí=jk ri=j tus=j me=ih us=hj');
    expect(pitches('Et exsultávit spíritus meus', g['4. Dominican'].solemn))
      .toBe('Et=h ex=gh sul=h tá=h vit=hg spí=gi ri=i tus=i me=hi us=h');
    expect(pitches('Et exsultávit spíritus meus', g['4. Dominican alt'].solemn, 'c3'))
      .toBe('Et=i ex=hi sul=i tá=i vit=ih spí=hj ri=j tus=j me=ij us=i');
    expect(pitches('Et exsultávit spíritus meus', g['5. Dominican'].solemn, 'c3', { noFlex: true }))
      .toBe('Et=d ex=f sul=h tá=h vit=h spí=h ri=h tus=h me=i us=h');
    expect(pitches('Magníficat', g['5. Dominican'].solemn, 'c3', { noFlex: true, omitMediant: true }))
      .toBe('Ma=d gní=f fi=h cat=h');
    expect(pitches('Et exsultávit spíritus meus', g['6. Dominican'].solemn))
      .toBe('Et=f ex=gh sul=h tá=h vit=hg spí=gixi ri=h tus=h me=hg us=gh');
    expect(pitches('Et exsultávit spíritus meus', g['7. Dominican'].solemn, 'c3'))
      .toBe('Et=h ex=hi sul=i tá=i vit=i spí=ik ri=j tus=j me=ji us=ij');
    expect(pitches('Et exsultávit spíritus meus', g['8. Dominican'].solemn))
      .toBe('Et=g ex=h sul=gj tá=j vit=ji spí=jk ri=k tus=k me=jk us=j');
  });
  test('Nunc dimittis and the Lauds canticles are recognized as psalms', function() {
    expect(context.dominicanOfficeKind('Magníficat ánima mea')).toBe('magnificat');
    expect(context.dominicanOfficeKind('Benedíctus Dóminus')).toBe('benedictus');
    expect(context.dominicanOfficeKind('Nunc dimíttis servum tuum')).toBe('psalm');
    expect(context.dominicanOfficeKind('Benedícite, ómnia ópera')).toBe('psalm');
    expect(context.dominicanOfficeKind('Confitébor tibi Dómine')).toBe('psalm');
    expect(context.dominicanOfficeKind('Ego dixi: In dimídio')).toBe('psalm');
    expect(context.dominicanOfficeKind('Exsultávit cor meum')).toBe('psalm');
    expect(context.dominicanOfficeKind('Cantémus Dómino')).toBe('psalm');
    expect(context.dominicanOfficeKind('Dómine, audívi auditiónem')).toBe('psalm');
    expect(context.dominicanOfficeKind('Audíte, cæli')).toBe('psalm');
  });
});
