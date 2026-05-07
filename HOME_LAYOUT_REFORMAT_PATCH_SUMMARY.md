# Home Layout Reformat Patch Summary

## Scope
This patch reformats the app around the new launch-page sketch and integrates the provided Electric Bones top-bar graphic.

## Main UI changes

### 1) New compact home / launch page
- Replaced the old large hero layout with a more compact home page.
- Added a dedicated top graphic section using the provided Electric Bones bone header image.
- Added a large **End of year revision card** section.
- Kept **Today’s mission** as its own summary panel.
- Added a dedicated **Learning modes** launcher area with a separate **Let’s GO** button.

### 2) Full-screen learning page
- Learning now opens in its own separate page section.
- Added a dedicated **Home** button so the user can return to the launch page at any time.
- Reworked the learning layout so the workspace gets more room for:
  - Visual lab
  - Label lab
  - Circuit builder
- Converted the old left-sidebar layout into a wider study layout with the controls placed above the main workspace.

### 3) Card action wording update
- Renamed the bottom study buttons to better match the requested workflow:
  - `Need practice` -> `Further review`
  - `I knew it` -> `Mastered`
- These continue to feed the next study round by using the existing weak-review/mastered progress logic.

### 4) Branding asset integration
- Added the provided top-bar image asset:
  - `assets/branding/electric-bones-header.png`

## Files changed
- `index.html`
- `app.js`
- `styles.css`
- `assets/branding/electric-bones-header.png`
- `HOME_LAYOUT_REFORMAT_PATCH_SUMMARY.md`

## Validation
- `node --check app.js`
- confirmed required new IDs exist in `index.html`
- confirmed the branding image asset exists and is wired into the page
