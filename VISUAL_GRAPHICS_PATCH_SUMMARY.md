# Visual Graphics Patch Summary — v8

## Purpose

This patch addresses the visual-lab audit findings by improving diagram fairness and clarity without changing the core study content.

## Main changes

- Removed answer-loaded titles from circuit symbol cards. Symbol challenge diagrams now use the generic title `Circuit symbol`.
- Removed direct answer words from pH, neutralisation, dilution, and indicator-mistake diagrams.
- Removed `!` markers from mistake diagrams and replaced them with neutral A/B/C callouts.
- Removed circuit-builder pre-answer captions that explained the principle before the student attempted the build.
- Renamed answer-loaded circuit-builder slots such as `series meter` and `parallel meter` to neutral `meter`.
- Removed label-lab captions that gave away series/parallel and neutralisation-order answers. The teaching note now appears after a correct lab check.
- Improved several weak SVGs: skeleton, elbow joint, blood vessels, reaction-time ruler, litmus setup, neutralisation setup, lab safety scene, and dilution method.

## Remaining recommendation

For a future artwork pass, the skeleton, elbow-joint anatomy, and lab-safety scene are still the best candidates for prepared PNG or externally drawn SVG illustration assets. The current patch improves the in-app SVG fallback so the app is fair and usable now.

## Files changed

- `app.js`
- `styles.css`
- `VISUAL_GRAPHICS_PATCH_SUMMARY.md`
