# v8 Multiple-choice difficulty pass

This patch keeps the deck size stable and rewrites the existing multiple-choice cards so Quiz mode is less obvious and more useful for revision.

## What changed

- Rewrote all **123** existing multiple-choice cards.
- Removed silly cross-topic distractors such as pH answers in electricity questions or bone answers in acids questions.
- Replaced most definition-only prompts with scenario, misconception, calculation, or best-explanation prompts.
- Kept stable `Id` values so previous progress is not reset just because wording changed.
- Updated `Back`, `Choices`, `Extra cue`, and `Difficulty` for the rewritten MC cards.
- Regenerated `data/flashcards.js` from the CSV.

## Difficulty distribution after this pass

- Difficulty 3: baseline recall with plausible distractors.
- Difficulty 4: application, misconception correction, or closely related distractors.
- Difficulty 5: calculation/rearrangement or multi-step reasoning.

The intent is that multiple-choice mode now checks whether the child understands the difference between similar ideas, not just whether they can spot an obviously impossible answer.

## Content count

The total deck remains **412 cards**. The multiple-choice count remains **123 cards**.

## Detailed changes

See `docs/v8-multiple-choice-wording-changes.csv` for before/after wording and choice changes.
