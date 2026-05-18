# Full Anatomy Label Lab Patch Summary

## Scope
This patch integrates the new full-body half-skeleton / half-muscle anatomy image into the app as a new advanced Label Lab challenge.

## New asset
- `assets/visuals/lab-full-anatomy.png`

## New Label Lab
Added a new interactive label lab game:
- `lab-full-anatomy`
- Title: `Full-body anatomy challenge`
- Unit: `7C Muscles and bones`

The challenge uses all 23 anatomy targets.

## Labels included
### Bones side
- skull
- rib cage
- sternum
- spine
- pelvis
- humerus
- radius
- ulna
- femur
- patella
- tibia
- fibula

### Muscles side
- deltoid
- biceps
- triceps
- pectoral
- intercostal muscles
- abdominals
- diaphragm
- gluteus
- quadriceps
- hamstrings
- calf muscle

## App changes
- Added the full anatomy image to the Label Lab raster diagram map as `full-anatomy`.
- Added 23 target-dot coordinates for the image.
- Added per-target wire anchor metadata so the label wires are better spaced for a large 23-label challenge.
- Added special CSS so the large 4:3 anatomy image displays cleanly and the label bank becomes scrollable.

## Files changed
- `app.js`
- `styles.css`
- `assets/visuals/lab-full-anatomy.png`
- `FULL_ANATOMY_LABEL_LAB_PATCH_SUMMARY.md`

## Validation
- `node --check app.js`
- Confirmed the new image asset exists.
- Confirmed the new full-body anatomy lab includes exactly 23 targets.
