# Electric Bones — Year 7 Science Flashcards

A static, dependency-free flashcard web app for Year 7 science revision. This v7 version keeps the **Exam Coach** and **Weak Review** modes and adds a content-completion patch based on a direct audit against the Year 7 student revision pack. Exam Coach uses mark-scheme answers, written-response prompts, keyword guidance, practical-method questions, and diagram reasoning. Weak Review automatically revisits missed flashcards. The app still works without a backend or build step.

This repo is ready to drop into GitHub and publish with **GitHub Pages**. It includes study-pack flashcards for:

- **7C Muscles and bones**
- **7F Acids and alkalis**
- **7J Current electricity**

## What is included

```text
.
├── index.html                  # Main app page
├── styles.css                  # Kid-friendly visual design
├── app.js                      # Flashcard / quiz logic, scoring, diagrams, fireworks
├── manifest.webmanifest        # PWA metadata
├── .nojekyll                   # Keeps GitHub Pages simple
├── assets/
│   └── favicon.svg             # App icon
├── data/
│   ├── flashcards.csv          # Editable source flashcard data
│   └── flashcards.js           # Browser-ready flashcard data
└── tools/
    └── csv_to_js.py            # Regenerates flashcards.js from the CSV
```

## Card bank

Current v7 study bank after the content-completion patch:

| Card type | Count |
|---|---:|
| Vocabulary | 130 |
| Multiple choice | 123 |
| Visual challenge | 47 |
| Equation/relationship | 24 |
| Self-test | 25 |
| Spot the mistake | 11 |
| Practical method | 8 |
| **Total** | **368** |

Unit split:

| Unit | CSV card count |
|---|---:|
| 7C Muscles and bones | 130 |
| 7F Acids and alkalis | 118 |
| 7J Current electricity | 120 |

The v7 content-completion patch adds **108 new CSV cards** plus **12 new Exam Coach questions**. It targets the audit gaps in the revision pack: 7C drugs / working scientifically / double circulation; 7F household examples / hazard symbols / natural indicators / extra salt equations; and 7J scientific models / truth tables / voltage division / electrical safety.

The app now contains **431 total revision items** when flashcards, label labs, circuit-builder games, and Exam Coach prompts are counted together: 368 CSV cards + 7 label labs + 8 circuit-builder tasks + 48 Exam Coach prompts.

## Features

- Flip-card revision mode
- Multiple-choice quiz mode
- **Visual lab** mode for diagrams, practicals, labels, and spot-the-mistake questions
- **Label lab** mode with drag/drop and tap-to-place diagram labels
- **Circuit Builder** mode with drag/drop and tap-to-place circuit components
- **Exam Coach** mode with written answers, mark schemes, keyword guidance, and self-marking
- **Weak Review** mode that revisits missed cards
- Equation arena for equations and science relationships
- Boss round for mixed-topic practice across the whole deck
- Topic and card-type filters
- Search box
- XP, score, streaks, mastered-card count and badges saved with `localStorage`
- Fireworks / confetti-style particles for correct answers
- Fun mode: brighter visuals, chime sounds, and fireworks for correct answers
- Calm mode: ocean-style visuals, gentle background ocean noise, and seagull-style correct-answer sounds
- Browser text-to-speech using the **Read aloud** button
- Progress export/import as a JSON file so progress can be backed up or moved without a database
- Auto-fit flashcard text to reduce overflow on long cards
- Local progress saving in the browser using `localStorage`
- Works without a backend, install step, package manager, or build step

## V3 second-pass coverage additions

The v3 pass specifically targets the earlier coverage gap:

- circuit-symbol recognition
- series vs parallel circuit reasoning
- ammeter/voltmeter placement
- AND/OR switch arrangements
- short-circuit and wiring mistake checks
- pH scale visual interpretation
- litmus/universal indicator questions
- neutralisation practical method
- safe acid dilution and goggles/splashing mistakes
- salt crystal evaporation method
- elbow joint labels: cartilage, ligament, tendon
- biceps/triceps antagonistic muscle diagrams
- skeleton labels: skull, ribs, backbone
- lungs/diaphragm labels
- alveolus gas-exchange arrows
- artery/vein/capillary recognition
- reaction-time ruler-drop method


## V4 interactive Label lab additions

The v4 patch adds a new **Label lab** mode with mobile-friendly tap placement and desktop drag/drop. Games include:

- skeleton basics: skull, rib cage, spine, pelvis, femur
- antagonistic arm muscles: biceps, triceps, humerus, radius/ulna, elbow joint
- breathing system: trachea, lung, rib cage, diaphragm, air moves in
- circuit symbols: cell, lamp, switch, ammeter, voltmeter
- series vs parallel features: one loop, branches, same current path
- indicators and pH: acid, neutral, alkali, red litmus, pH 7
- neutralisation method sequence: measure acid, add indicator, add alkali slowly, stop at neutral, evaporate solution

Correctly completed label labs count toward XP, streaks, mastered items, and a new **Labeller** badge.

## V5 interactive Circuit Builder additions

The v5 patch adds a new **Circuit Builder** mode with mobile-friendly tap placement and desktop drag/drop. Games include:

- complete lamp circuit: cell, closed switch, lamp
- lamp-off circuit: cell, open switch, lamp
- current measurement: ammeter in series
- voltage measurement: voltmeter in parallel across a lamp
- two lamps in series
- two lamps in parallel
- AND switch circuit: two closed switches in series
- OR switch circuit: switches on parallel branches

Correctly completed circuit builds count toward XP, streaks, mastered items, and a new **Circuit builder** badge.

## V6 Exam Coach and Weak Review additions

The v6 patch adds **36 exam-style prompts**, 12 per unit. These are intentionally different from ordinary flashcards: they train the learner to produce mark-scheme language and explain cause/effect relationships.

Exam Coach includes:

- written-response questions with model answers
- keyword guidance and a live keyword-coverage meter
- auto-marked multiple-choice questions where appropriate
- practical-method questions
- diagram-based explanation prompts
- spot-the-mistake questions
- self-marking buttons so open-ended answers can still affect XP/streaks
- a new **Exam ready** badge

Weak Review tracks missed items in browser storage and gives the learner a focused place to clean up mistakes. Correct answers remove items from the weak list and count toward the **Comeback kid** badge.


## V7 content-completion patch

The v7 patch is a content and accuracy pass against the Year 7 student revision pack. It includes:

- wording cleanups around pH, acid/alkali language, concentration, charge, and muscle relaxation
- 7C additions for double circulation, gas-exchange organ functions, vessel adaptations, force in newtons, scientific/non-scientific/ethical questions, and drug examples/effects/testing
- 7F additions for household acid/alkali examples, hazard-symbol meanings, phenolphthalein, methyl orange, red cabbage/natural indicator methods, pH measurement, extra neutralisation equations, and everyday neutralisation examples
- 7J additions for physical vs abstract models, model strengths/limitations, AND/OR truth-table reasoning, voltage division, electrical safety, cells vs mains, fuses/circuit breakers, wire colours, and wire-resistance factors

## Run locally

Because this is a static site, you can open `index.html` directly in a browser.

For a closer GitHub Pages-style local preview, run:

```bash
python3 -m http.server 8080
```

Then open:

```text
http://localhost:8080
```

## Publish to GitHub Pages

From inside the unzipped repo folder:

```bash
git init
git add .
git commit -m "Add Electric Bones flashcard app"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

Then in GitHub:

1. Open the repo.
2. Go to **Settings** → **Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Branch: `main`.
5. Folder: `/ root`.
6. Save.

GitHub will publish the app at a URL like:

```text
https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/
```

For Andrew's repo, the expected Pages URL is:

```text
https://andrewdionne.github.io/ElectricBones/
```

## Edit the flashcards

Edit:

```text
data/flashcards.csv
```

Required columns:

```text
Unit, Type, Front, Back, Extra cue
```

Optional columns:

```text
Choices, Visual
```

For `Choices`, separate the answer options with a pipe character. Include the correct answer too. Example:

```text
Correct answer | Wrong answer 1 | Wrong answer 2 | Wrong answer 3
```

For `Visual`, use one of the built-in diagram keys from `app.js`, for example:

```text
circuit-series
ph-scale
elbow-joint
lungs-diaphragm
```

Then regenerate the browser data file:

```bash
python3 tools/csv_to_js.py
```

Commit both files:

```bash
git add data/flashcards.csv data/flashcards.js
git commit -m "Update flashcards"
git push
```

## Notes for a public child-friendly app

This app does not require accounts, names, email addresses, analytics, external scripts, or a backend. Progress is stored only in the child’s browser on that device.

## Study mode notes

### Self-test cards

Self-test cards are short-answer recall prompts. They are best used in flip-card mode: the learner reads the question, says or writes an answer, then flips the card and marks whether they knew it. They are not automatically graded because they are open-ended.

### Multiple-choice mode

Multiple-choice mode turns cards into four-option questions. Most vocabulary and equation cards generate distractors automatically. The dedicated `Multiple choice`, `Visual challenge`, `Practical method`, and `Spot the mistake` cards include hand-authored answer options in the `Choices` column for better exam-style practice.

### Visual lab

Visual lab filters to the diagram/worksheet-style cards. It is intended to close the gap between memorising definitions and actually handling exam questions that use images, symbols, circuit layouts, practical apparatus, and labelled body diagrams.

### Label lab

Label lab is interactive. The learner taps a label and then taps the matching target on the diagram, or drags labels onto targets on desktop. This is better for diagram recognition than ordinary multiple choice because the child has to actively locate the part, not just recognise the answer from a list.

### Circuit Builder

Circuit Builder is interactive. The learner taps a component and then taps an empty circuit slot, or drags components into slots on desktop. It is designed to reinforce the practical circuit ideas behind Year 7 electricity: complete circuits, open switches, current measured in series, voltage measured in parallel, and series/parallel arrangements.

### Exam Coach

Exam Coach is for higher-value end-of-year practice. The learner types a short answer, reveals the mark scheme, checks the keyword guide, and then self-marks honestly. Some Exam Coach questions are auto-marked multiple choice. This is intended to improve explanations, practical methods, and diagram reasoning — the remaining gap after vocabulary and recognition practice.

### Weak Review

Weak Review uses local progress data to show missed cards again. Getting an item correct removes it from the weak list. This does not need an account or database; it is stored in the browser.

### Boss round

Boss round ignores the normal topic/type boundaries and mixes the full deck. It is intended as an end-of-session challenge: keep answering, build a streak, and identify weak areas.

### Progress without a database

The app saves progress in browser `localStorage`, so XP/streak/mastered cards persist after closing and reopening the site on the same device and browser. It does not sync across devices. Use **Export progress** and **Import progress** to back up or move progress using a JSON file.
