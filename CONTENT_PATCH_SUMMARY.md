# V7 Content Completion Patch Summary

This patch updates the study app content after auditing the app against the Year 7 student revision pack for:

- 7C Muscles and bones
- 7F Acids and alkalis
- 7J Current electricity

## Files changed

- `data/flashcards.csv`
- `data/flashcards.js`
- `app.js`
- `README.md`

## Content bank change

| Area | Before | After |
|---|---:|---:|
| CSV flashcards | 260 | 368 |
| Exam Coach prompts | 36 | 48 |
| Label lab games | 7 | 7 |
| Circuit-builder games | 8 | 8 |
| Total revision items | 311 | 431 |

## Unit coverage change

| Unit | Before CSV cards | After CSV cards | Main added coverage |
|---|---:|---:|---|
| 7C Muscles and bones | 95 | 130 | double circulation, gas-exchange organs, vessel adaptations, force/newtons, working scientifically, drugs/effects/testing |
| 7F Acids and alkalis | 78 | 118 | household examples, hazard symbols, phenolphthalein, methyl orange, red cabbage/natural indicators, pH measurement, extra salt equations, everyday neutralisation |
| 7J Current electricity | 87 | 120 | physical/abstract models, central-heating model limits, AND/OR truth tables, voltage division, safety, cells vs mains, fuses/circuit breakers, resistance factors |

## Accuracy cleanups

- Changed low-pH wording from “stronger acid” to “more acidic” where the revision-pack level is about pH rather than formal acid strength.
- Changed “strongest alkali” to “most alkaline”.
- Changed the pH 1 correction to “very acidic” rather than “strong acid”.
- Changed the concentrated/dilute distractor from “made less strong” to “made less concentrated”.
- Tightened `Charge` so it refers to charged particles such as electrons.
- Tightened `Relax` so it does not imply muscles actively push themselves longer.

## Validation performed

- Regenerated `data/flashcards.js` from `data/flashcards.csv` using `python3 tools/csv_to_js.py`.
- Ran `node --check app.js` successfully.
- Checked every CSV multiple-choice card includes its correct answer.
- Checked every CSV visual key resolves to an existing diagram renderer.
- Checked generated JS contains 368 cards.
