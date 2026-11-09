# Dominican psalm tones in the psalm tone tool

Psalm tones only. No Magnificat or Benedictus formulas. Tones II–VIII below are in the same tone dropdown as `1. Dominican`; each ending is the termination dropdown. `4. Dominican alt` is the do-clef notation (c3), a separate Tone IV entry.

## Coverage

| Entry | What is implemented |
| --- | --- |
| `1. Dominican` | Intonation, flex, long mediant, endings `1 re` `2 sol` `3 la` |
| `2. Dominican` | Short mediant; one ending (mi ut re, with ut/mi doubling) |
| `3. Dominican` | Mediant uses Tone I’s accent rules (the source says so) on re ut si ut. Ending `1` (`ji`/`i`, then hi h, optional g, gh). Ending `2`: la, or si la, before the last accent; ut after it; final si-la |
| `4. Dominican` | Mediant (sol la before si; dactyl extends sol; no la after a final accent). First termination, 5 or 6 syllables |
| `4. Dominican alt` | Same mediant and the second termination, a fourth higher, clef c3 |
| `5. Dominican` | Short mediant; two-accent termination |
| `6. Dominican` | Intonation, flex, and mediant are Tone I’s (the source says so). Its own 4- or 5-syllable termination |
| `7. Dominican` | Clef c3. Intonation ut-re, flex on ut. Mediant uses Tone I’s accent places (the source says so) on fa mi re mi. Endings `1` (final si-la) and `2` (final si-re); the nine word-shapes share one body |
| `8. Dominican` | Short mediant; endings `G` (4 or 5 syllables) and `c` (4, 5, or 6) |

No canticle tones. Psalm tones I–VIII are in the dropdown.

## Hand-editing

The bracket tag selects the rule (`[dominican-2]`, `[dominican-7-termination]`, `[dominican-3-termination-2]`, …). For a Tone I-shaped mediant (`1`, `3`, `6`) the notes after the tag are the neumes, and HTML bold/italic uses that formula’s accent count, the same as a Roman tone. Tone VII’s mediant is tagged `[dominican-7]`: the accent places are Tone I’s, and the mi between them is painted as mi, not left on the tenor. Other Dominican lines have no accent marks in the formula; HTML bold and italic are taken from the syllables the rule actually paints (bold on the cadence accent, italic on the approach). Delete a tag to force the ordinary engine.

## Limitations

- No Hebrew list. A final accent is not treated as Hebrew. Ut-doubling and the longer cadences that the book triggers for a Hebrew word of three or more syllables apply when the written accent is on the antepenult, which is the same test as for a Latin proparoxytone. `Aarón` on a short mediant is right only if the accent is written on the last syllable (nothing follows the last accent). `Moysi et Aaron` matches Tone VII when `Aaron` keeps the printed capital (the existing one-capital heuristic) or the antepenult is written `Áaron`. Lowercase `aaron` with no accent is not reclassified.
- Pp. 338–343 distinguish lexical accent from the melodic cadence. A tone may keep, drop, or add an accent, or raise an otherwise grave `et`, only where that tone’s rule says so. Those pages do not supply one cadence algorithm, and the general musical examples there are not used as pitch fixtures.
- Prepositions are grave in the source only when they stand before their case, and acute when postposed or used absolutely. `cum` is grave as a preposition and acute as a conjunction. That is not parsed. The unaccented set is still only `a ab ac ad atque cum de e et in inter ob per prae pro sine sub`, and only a one-syllable word is affected by it. `aut`, `vel`, `non`, `nec`, `neque`, and `sed` stay acute. A written acute still wins. A one-letter syllable is not given an accent unless it is written.
- Syllable division is the tool’s Latin hyphenation (`Pédum` is `Pé-dum`; `tabéscet` is `ta-bé-scet`).
- Tone I’s mediant B-flat is `ixi`. English spelling is not handled.
