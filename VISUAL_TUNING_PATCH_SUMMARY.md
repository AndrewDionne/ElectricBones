# Visual Tuning Patch Summary

## Scope
Follow-up patch after the PNG integration.

This patch does two things:
1. fine-tunes the interactive visual-lab experience, especially the hotspot usability over the new PNG diagrams;
2. upgrades several of the remaining SVG science diagrams that were still weaker than the rest of the app.

## Main changes

### 1) Visual-lab usability tuning
- Reduced the default visual-lab target pill size slightly so labels cover less of the diagram.
- Kept the previously integrated PNG-based skeleton and arm diagrams.
- Preserved the updated hotspot positions for the PNG anatomy diagrams.

### 2) Upgraded remaining SVG diagrams
Improved these inline SVGs in `app.js`:
- `ph-scale`
- `litmus-test`
- `neutralisation-setup`
- `dilution-method`
- `blood-vessels`
- `reaction-time-ruler`

### 3) Added support styles
Added new CSS helpers in `styles.css` for:
- guide lines/arcs
- thicker artery and vein wall styling
- ruler ticks
- lighter secondary scale guides

## Intent of the improvements
- make apparatus diagrams clearer without revealing answers;
- make blood-vessel and reaction-time graphics easier to interpret;
- make pH and litmus visuals cleaner and closer to revision-style diagrams;
- reduce diagram obstruction from floating label targets.

## Files changed
- `app.js`
- `styles.css`
- `VISUAL_TUNING_PATCH_SUMMARY.md`

## Validation
- `node --check app.js`
- confirmed all new class names used in the SVG markup exist in `styles.css`
