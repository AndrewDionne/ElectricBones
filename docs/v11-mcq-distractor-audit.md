# v11 MCQ distractor audit and fix

## Problem found

The screenshot showed a generated multiple-choice item for **Conductor** with answer options from unrelated biology content, such as heart and spine definitions. The question stem was fine; the generated distractor bank was not.

The app has two kinds of multiple-choice questions:

1. **Authored MCQ cards** with explicit `Choices` in `data/flashcards.csv`.
2. **Generated quiz cards** where the app builds answer choices from other flashcard backs.

The failure came from the generated-choice path, not from a hand-authored conductor MCQ.

## Audit numbers

- Total cards: **422**
- Cards with explicit choices: **230**
- Cards relying on generated answer choices: **192**

Generated-choice cards by type:

- Vocabulary: **130**
- Equation/relationship: **24**
- Self-test: **26**
- Spot the mistake: **8**
- Practical method: **2**
- Visual challenge: **2**


## Root cause

The previous generated-choice rule was too broad:

- In normal quiz modes, distractors could come from cards with the **same unit OR same type**.
- In Boss Mode, distractors could come from **any card in the whole app**.

That meant a 7J electricity vocabulary card could be paired with 7C biology vocabulary definitions. The screenshot is a direct example of this.

## Fix implemented

Generated choices now use ranked distractor pools:

1. Same unit and same type.
2. Same unit and same question family.
3. Same unit from the active deck.
4. Same unit, any type.
5. Same type, any unit only as an emergency fallback.
6. Any card only as the final fallback.

This means Boss Mode can still mix topics for the question order, but each individual question now gets plausible same-topic answer options.

## Example fix

For **Conductor**, the old generated choices could include biology answers. The new primary distractor pool is 7J vocabulary only, so likely distractors include definitions for current, ampere, ammeter, voltage, insulator, resistor, and related electricity terms.

## Files changed

- `app.js`
- `docs/v11-mcq-distractor-audit.md`
- `docs/v11-mcq-distractor-audit.csv`
