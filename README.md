# Year 7 Science Flashcards — GitHub Pages App

A static, dependency-free flashcard web app for Year 7 science revision.

This repo is ready to drop into GitHub and publish with **GitHub Pages**. It includes the study-pack flashcards for:

- **7C Muscles and bones**
- **7F Acids and alkalis**
- **7J Current electricity**

## What is included

```text
.
├── index.html                  # Main app page
├── styles.css                  # Kid-friendly visual design
├── app.js                      # Flashcard / quiz logic, scoring, fireworks
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

## Features

- Flip-card revision mode
- Multiple-choice quiz mode
- Equation arena for equations and science relationships
- Boss round for mixed-topic practice
- Topic and card-type filters
- Search box
- XP, score, streaks, mastered-card count and badges
- Fireworks / confetti-style particles for correct answers
- Sound effects with a sound toggle
- Browser text-to-speech using the **Read aloud** button
- Calm mode for lower-motion study
- Local progress saving in the browser using `localStorage`
- Works without a backend, install step, package manager, or build step

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
git commit -m "Add Year 7 science flashcard app"
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

## Edit the flashcards

Edit:

```text
data/flashcards.csv
```

Keep these columns:

```text
Unit, Type, Front, Back, Extra cue
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
