# Card Status and Completion Coverage Patch Summary

## Scope
This patch adds a proper card-status layer to the study app so Boss Rounds can help the student work through all content, not just repeat easy questions.

## New card status model
Every card now resolves to one of three statuses:

- `untried`
- `complete`
- `revision`

The app stores explicit status in progress as `cardStatus`, while also migrating safely from the older `mastered` and `weakIds` arrays.

## Boss Round selection changes
Boss Round now selects from unfinished content by default.

### Balanced / visual / exam / weak mixes
These now use cards that are **not completed successfully**:
- untried cards first
- revision cards next
- completed cards are excluded

### Revision-only option
Added a new Boss Round question-mix option:

- `Revision only`

This pulls only cards marked `need revision`.

### Mixed difficulty option
Added a new Level option:

- `Mixed unlocked levels`

This allows Boss Rounds to pull from all currently unlocked difficulty levels, while still excluding completed cards.

## Status display
Boss setup now shows a card-status panel with:

- untried
- completed
- need revision
- total in selected set

This makes it clear whether the student is actually progressing through the full question bank.

## Completion badge
Once every card in the app is completed successfully, the student earns:

🏆 **The Master-Blaster!**

The badge appears in the normal badge rail and in the Boss setup screen.

## Progress updates
- Correct Boss answers mark cards as `complete`.
- Incorrect Boss answers mark cards as `revision`.
- Practice-mode Mastered marks cards as `complete`.
- Practice-mode Further Review marks cards as `revision`.
- Missed cards are removed from completed/mastered status until answered successfully again.

## Files changed
- `app.js`
- `styles.css`
- `CARD_STATUS_COMPLETION_PATCH_SUMMARY.md`

## Validation
- `node --check app.js`
- confirmed all multiple-choice correct answers appear in their choices
- confirmed referenced PNG assets exist
- confirmed status helper functions and Master-Blaster badge wiring are present
