# Dominican Tone I in the psalm tone tool

Only the Tone I psalm tone is implemented. Tones II–VIII are not, and neither are the Magnificat or Benedictus mediants.

## Where it is

In the tone dropdown, after the Roman tones: `1. Dominican`. Intonation is on verse 1 unless Repeat intonation is on. A † is the flex.

The ending dropdown is that tone’s three terminations: `1 re`, `2 sol`, `3 la`. Solemn is turned off; Tone I has no solemn form. Choosing the ending is manual.

## What the rules cover

Psalm intonation (sol, then sol-la on syllable 2), flex a whole tone under the syllables after the accent, the long mediant (B-flat, la, sol, la, with sol doubled on a final proparoxytone), and all three terminations (sol-fa, podatus, sol up to the last note). Worked examples are in `tests/dominican-tone-1.test.js`.

## Hand-editing

Each formula line starts with `[dominican-1]` or `[dominican-1-termination]`. The notes after the tag are the neumes the rules apply. Edit those pitches in the formula box; leave the tag in place. Delete the tag and that line is read by the ordinary engine again. The syllable rules themselves are `applyDominicanTone1` in `psalmtone.js`.

## Not automatic

- No Hebrew list. A written accent is respected (`Síon`, `Jerúsalém`, `Dávid`). `Jerúsalem` with only the Latin accent is sung as a proparoxytone. `Aarón` is not given the Hebrew “second syllable before the ultima” figure.
- Atonic words are a short explicit set (`a`, `ab`, `ad`, `cum`, `de`, `e`, `et`, `in`, `inter`, `ob`, `per`, `prae`, `pro`, `sine`, `sub`, and the same with capitals), not pp. 339–341. An unmarked word of three or more syllables is accented only when a stated Tone I rule names the syllable, or by the tool’s existing capital-vowel guess.
- Syllable division is the tool’s Latin hyphenation, so a consonant can sit on a different syllable than in the printed examples (`Ind-ú-tus`, `bé-scet`). The role of each syllable (si, sol, final, and so on) still follows the rule.
- The mediant B-flat is always `ixi`. Some printed examples write a bare `i`; the English note to Tone I treats that note as B-flat.
- English spelling is not handled. The underlined verse view still counts accents the ordinary way; the gabc is the Tone I result.
