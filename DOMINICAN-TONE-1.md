# Dominican psalm tones in the psalm tone tool

Psalm tones only. No Magnificat or Benedictus formulas. Tones II–VIII below are in the same tone dropdown as `1. Dominican`; each ending is the termination dropdown. `4. Dominican alt` is the do-clef notation (c3), a separate Tone IV entry.

## Coverage

| Entry | What is implemented |
| --- | --- |
| `1. Dominican` | Intonation, flex, long mediant, endings `1 re` `2 sol` `3 la` |
| `2. Dominican` | Short mediant; one ending (mi ut re, with ut/mi doubling) |
| `3. Dominican` | Mediant uses Tone I’s accent rules (the source says so) on re ut si ut. First termination only (`ji`/`i`, then hi h, optional g, gh) |
| `4. Dominican` | Mediant (sol la before si; dactyl extends sol; no la after a final accent). First termination, 5 or 6 syllables |
| `4. Dominican alt` | Same mediant and the second termination, a fourth higher, clef c3 |
| `5. Dominican` | Short mediant; two-accent termination |
| `6. Dominican` | Intonation, flex, and mediant are Tone I’s (the source says so). Its own 4- or 5-syllable termination |
| `8. Dominican` | Short mediant; endings `G` (4 or 5 syllables) and `c` (4, 5, or 6) |

Pending: Tone III’s second termination; all of Tone VII (its mediant is the Tone I accent pattern on fa mi re mi, but the nine termination cases are not coded). No canticle tones.

## Hand-editing

The bracket tag selects the rule (`[dominican-2]`, `[dominican-6-termination]`, …). For a Tone I-shaped mediant (`1`, `3`, `6`) the notes after the tag are the neumes, and HTML bold/italic uses that formula’s accent count, the same as a Roman tone. Other Dominican lines have no accent marks in the formula; HTML bold and italic are taken from the syllables the rule actually paints (bold on the cadence accent, italic on the approach). Delete a tag to force the ordinary engine.

## Limitations

- No Hebrew list. A final accent is not treated as Hebrew. Ut-doubling and the longer cadences that the book triggers for a Hebrew word of three or more syllables apply when the written accent is on the antepenult, which is the same test as for a Latin proparoxytone. `Aarón` on a short mediant is right only if the accent is written on the last syllable (nothing follows the last accent).
- Atonic monosyllables in use: `a ab ad cum de e et in inter ob per prae pro sine sub`. Provisional, not pp. 339–341. A one-letter syllable is not given an accent unless it is written.
- Syllable division is the tool’s Latin hyphenation.
- Tone I’s mediant B-flat is `ixi`. English spelling is not handled.
