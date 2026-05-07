# PNG Visuals Patch Summary

## Scope
This patch implements the first PNG artwork pass for the complex biology and safety visuals identified in the visual graphics audit.

## What changed

### New PNG assets added
- `assets/visuals/skeleton-basic.png`
- `assets/visuals/lab-skeleton-basic.png`
- `assets/visuals/elbow-joint.png`
- `assets/visuals/arm-antagonistic.png`
- `assets/visuals/lab-arm-muscles.png`
- `assets/visuals/acid-safety-mistake.png`

### App changes
- Added raster-image rendering support for study/exam visuals.
- Added raster-image rendering support for interactive label-lab diagrams.
- Switched these flashcard visuals from inline SVG to PNG:
  - `skeleton-basic`
  - `elbow-joint`
  - `arm-antagonistic`
  - `acid-safety-mistake`
- Switched these label-lab diagrams from inline SVG to PNG:
  - `skeleton`
  - `arm`
- Tuned interactive label target positions for the new skeleton and arm artwork.
- Added CSS support for responsive PNG display in card, exam, and lab panels.

## Why these moved to PNG
These were the most complex visuals and were the weakest when hand-drawn as inline SVG:
- full skeleton
- elbow anatomy
- antagonistic muscle/arm anatomy
- lab safety scene

## Validation
- `node --check app.js`
- Confirmed all new image asset paths referenced in `app.js` exist.
- Confirmed the repo now contains 6 new PNG assets under `assets/visuals/`.

## Notes
- Circuits, pH, indicators, and practical-method diagrams remain SVG by design.
- This patch focuses on the highest-value PNG conversions only.
