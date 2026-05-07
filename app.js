(() => {
  "use strict";

  const STORAGE_KEY = "scienceQuest.year7.v1";
  const cards = Array.isArray(window.YEAR7_FLASHCARDS) ? window.YEAR7_FLASHCARDS : [];

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => Array.from(document.querySelectorAll(selector));

  const els = {
    unitFilter: $("#unitFilter"),
    typeFilter: $("#typeFilter"),
    searchBox: $("#searchBox"),
    modeButtons: $$(".mode-button"),
    heroModeButtons: $$('[data-set-mode]'),
    flashcard: $("#flashcard"),
    cardMetaBar: $("#cardMetaBar"),
    cardVisual: $("#cardVisual"),
    cardUnitBadge: $("#cardUnitBadge"),
    cardTypeBadge: $("#cardTypeBadge"),
    cardFront: $("#cardFront"),
    cardBack: $("#cardBack"),
    cardCue: $("#cardCue"),
    frontHint: $("#frontHint"),
    quizPanel: $("#quizPanel"),
    labPanel: $("#labPanel"),
    circuitPanel: $("#circuitPanel"),
    examPanel: $("#examPanel"),
    answerGrid: $("#answerGrid"),
    feedback: $("#feedback"),
    knowButton: $("#knowButton"),
    needPracticeButton: $("#needPracticeButton"),
    nextButton: $("#nextButton"),
    shuffleButton: $("#shuffleButton"),
    speakButton: $("#speakButton"),
    soundToggle: $("#soundToggle"),
    calmToggle: $("#calmToggle"),
    exportProgress: $("#exportProgress"),
    importProgressFile: $("#importProgressFile"),
    resetProgress: $("#resetProgress"),
    modeKicker: $("#modeKicker"),
    workspaceTitle: $("#workspaceTitle"),
    progressFill: $("#progressFill"),
    xpValue: $("#xpValue"),
    scoreValue: $("#scoreValue"),
    streakValue: $("#streakValue"),
    masteredValue: $("#masteredValue"),
    badges: $("#badges"),
    levelMeter: $("#levelMeter"),
    levelNote: $("#levelNote"),
    missionTitle: $("#missionTitle"),
    studyTip: $("#studyTip"),
    buttonRow: $(".button-row"),
    reviewBox: $(".review-box"),
    canvas: $("#fireworksCanvas"),
  };

  const visualLabTypes = new Set(["Visual challenge", "Practical method", "Spot the mistake"]);

  const interactiveLabGames = [
    {
      id: "lab-skeleton-basic",
      unit: "7C Muscles and bones",
      title: "Label the skeleton basics",
      brief: "Place each label onto the correct part of the skeleton.",
      diagram: "skeleton",
      labels: ["skull", "rib cage", "spine", "pelvis", "femur"],
      targets: [
        { id: "skull", label: "skull", x: 50, y: 16 },
        { id: "rib", label: "rib cage", x: 50, y: 38 },
        { id: "spine", label: "spine", x: 59, y: 46 },
        { id: "pelvis", label: "pelvis", x: 50, y: 61 },
        { id: "femur", label: "femur", x: 42, y: 78 },
      ],
    },
    {
      id: "lab-arm-muscles",
      unit: "7C Muscles and bones",
      title: "Antagonistic muscles at the elbow",
      brief: "Label the bones, joint, and muscle pair that bend and straighten the arm.",
      diagram: "arm",
      labels: ["biceps", "triceps", "humerus", "radius and ulna", "elbow joint"],
      targets: [
        { id: "biceps", label: "biceps", x: 42, y: 32 },
        { id: "triceps", label: "triceps", x: 58, y: 40 },
        { id: "humerus", label: "humerus", x: 35, y: 55 },
        { id: "forearm", label: "radius and ulna", x: 66, y: 68 },
        { id: "elbow", label: "elbow joint", x: 52, y: 58 },
      ],
    },
    {
      id: "lab-breathing",
      unit: "7C Muscles and bones",
      title: "Breathing system labels",
      brief: "Match the labels to the parts used during breathing.",
      diagram: "lungs",
      labels: ["trachea", "lung", "rib cage", "diaphragm", "air moves in"],
      targets: [
        { id: "trachea", label: "trachea", x: 50, y: 19 },
        { id: "lung", label: "lung", x: 38, y: 46 },
        { id: "rib", label: "rib cage", x: 64, y: 48 },
        { id: "diaphragm", label: "diaphragm", x: 50, y: 74 },
        { id: "air", label: "air moves in", x: 50, y: 9 },
      ],
    },
    {
      id: "lab-circuit-symbols",
      unit: "7J Current electricity",
      title: "Circuit symbol match-up",
      brief: "Drop each component name onto the right circuit symbol.",
      diagram: "symbols",
      labels: ["cell", "lamp", "switch", "ammeter", "voltmeter"],
      targets: [
        { id: "cell", label: "cell", x: 18, y: 44 },
        { id: "lamp", label: "lamp", x: 34, y: 44 },
        { id: "switch", label: "switch", x: 50, y: 44 },
        { id: "ammeter", label: "ammeter", x: 66, y: 44 },
        { id: "voltmeter", label: "voltmeter", x: 82, y: 44 },
      ],
    },
    {
      id: "lab-series-parallel",
      unit: "7J Current electricity",
      title: "Series or parallel features",
      brief: "Match each feature to the correct part of the circuit diagram.",
      diagram: "series-parallel",
      labels: ["one loop", "branches", "series circuit", "parallel circuit", "same current path"],
      targets: [
        { id: "series-title", label: "series circuit", x: 29, y: 14 },
        { id: "one-loop", label: "one loop", x: 30, y: 58 },
        { id: "same-path", label: "same current path", x: 30, y: 80 },
        { id: "parallel-title", label: "parallel circuit", x: 72, y: 14 },
        { id: "branches", label: "branches", x: 72, y: 58 },
      ],
    },
    {
      id: "lab-indicators",
      unit: "7F Acids and alkalis",
      title: "Indicators and pH",
      brief: "Match the indicator or pH result to the correct beaker/scale position.",
      diagram: "indicators",
      labels: ["acid", "alkali", "neutral", "red litmus stays red", "pH 7"],
      targets: [
        { id: "acid", label: "acid", x: 22, y: 47 },
        { id: "litmus", label: "red litmus stays red", x: 22, y: 73 },
        { id: "neutral", label: "neutral", x: 50, y: 47 },
        { id: "ph7", label: "pH 7", x: 50, y: 73 },
        { id: "alkali", label: "alkali", x: 78, y: 47 },
      ],
    },
    {
      id: "lab-neutralisation",
      unit: "7F Acids and alkalis",
      title: "Neutralisation method order",
      brief: "Place the practical method labels in the correct order from left to right.",
      diagram: "neutralisation-order",
      labels: ["measure acid", "add indicator", "add alkali slowly", "stop at neutral", "evaporate solution"],
      targets: [
        { id: "step1", label: "measure acid", x: 14, y: 52 },
        { id: "step2", label: "add indicator", x: 32, y: 52 },
        { id: "step3", label: "add alkali slowly", x: 50, y: 52 },
        { id: "step4", label: "stop at neutral", x: 68, y: 52 },
        { id: "step5", label: "evaporate solution", x: 86, y: 52 },
      ],
    },
  ];

  const circuitBuilderGames = [
    {
      id: "circuit-build-complete-lamp",
      unit: "7J Current electricity",
      title: "Build a complete lamp circuit",
      brief: "Use a cell, closed switch, and lamp so the lamp would light.",
      layout: "simple-loop",
      labels: ["cell", "lamp", "closed switch", "open switch", "voltmeter"],
      slots: [
        { id: "source", label: "power source", answer: "cell", x: 18, y: 58 },
        { id: "switch", label: "switch", answer: "closed switch", x: 48, y: 28 },
        { id: "load", label: "load", answer: "lamp", x: 78, y: 58 },
      ],
      success: "A closed switch completes the loop, so current can flow through the lamp.",
    },
    {
      id: "circuit-build-lamp-off",
      unit: "7J Current electricity",
      title: "Build a circuit where the lamp is off",
      brief: "Use an open switch to break the circuit so current cannot flow.",
      layout: "simple-loop",
      labels: ["cell", "lamp", "open switch", "closed switch", "ammeter"],
      slots: [
        { id: "source", label: "power source", answer: "cell", x: 18, y: 58 },
        { id: "switch", label: "switch", answer: "open switch", x: 48, y: 28 },
        { id: "load", label: "load", answer: "lamp", x: 78, y: 58 },
      ],
      success: "An open switch creates a gap, so the circuit is incomplete and the lamp stays off.",
    },
    {
      id: "circuit-build-measure-current",
      unit: "7J Current electricity",
      title: "Measure current correctly",
      brief: "Put the ammeter in series so all the current flows through it.",
      layout: "meter-loop",
      labels: ["cell", "lamp", "ammeter", "voltmeter", "closed switch"],
      slots: [
        { id: "source", label: "source", answer: "cell", x: 16, y: 61 },
        { id: "meter", label: "series meter", answer: "ammeter", x: 43, y: 25 },
        { id: "switch", label: "switch", answer: "closed switch", x: 68, y: 25 },
        { id: "load", label: "load", answer: "lamp", x: 78, y: 62 },
      ],
      success: "Ammeters go in series because current must flow through the meter.",
    },
    {
      id: "circuit-build-measure-voltage",
      unit: "7J Current electricity",
      title: "Measure voltage across a lamp",
      brief: "Put the voltmeter on a parallel branch across the lamp.",
      layout: "parallel-meter",
      labels: ["cell", "lamp", "voltmeter", "ammeter", "closed switch"],
      slots: [
        { id: "source", label: "source", answer: "cell", x: 16, y: 58 },
        { id: "load", label: "load", answer: "lamp", x: 64, y: 43 },
        { id: "meter", label: "parallel meter", answer: "voltmeter", x: 64, y: 74 },
        { id: "switch", label: "switch", answer: "closed switch", x: 84, y: 58 },
      ],
      success: "Voltmeters go in parallel because they compare the energy difference across a component.",
    },
    {
      id: "circuit-build-series-two-lamps",
      unit: "7J Current electricity",
      title: "Build a series circuit with two lamps",
      brief: "Place two lamps on the same single loop.",
      layout: "series-two-lamps",
      labels: ["cell", "lamp", "lamp", "closed switch", "voltmeter"],
      slots: [
        { id: "source", label: "source", answer: "cell", x: 16, y: 58 },
        { id: "load1", label: "lamp 1", answer: "lamp", x: 44, y: 28 },
        { id: "load2", label: "lamp 2", answer: "lamp", x: 70, y: 28 },
        { id: "switch", label: "switch", answer: "closed switch", x: 84, y: 58 },
      ],
      success: "A series circuit has one loop, so the same current path passes through both lamps.",
    },
    {
      id: "circuit-build-parallel-two-lamps",
      unit: "7J Current electricity",
      title: "Build a parallel circuit with two lamps",
      brief: "Place one lamp on each branch so the current has more than one path.",
      layout: "parallel-two-lamps",
      labels: ["cell", "lamp", "lamp", "closed switch", "ammeter"],
      slots: [
        { id: "source", label: "source", answer: "cell", x: 16, y: 58 },
        { id: "branch1", label: "top branch", answer: "lamp", x: 58, y: 41 },
        { id: "branch2", label: "bottom branch", answer: "lamp", x: 58, y: 73 },
        { id: "switch", label: "switch", answer: "closed switch", x: 84, y: 58 },
      ],
      success: "Parallel circuits have branches, so each lamp has its own path.",
    },
    {
      id: "circuit-build-and-switches",
      unit: "7J Current electricity",
      title: "Build an AND switch circuit",
      brief: "The lamp should light only when both switches are closed.",
      layout: "and-switches",
      labels: ["cell", "closed switch", "closed switch", "lamp", "open switch"],
      slots: [
        { id: "source", label: "source", answer: "cell", x: 16, y: 58 },
        { id: "switch1", label: "switch 1", answer: "closed switch", x: 38, y: 28 },
        { id: "switch2", label: "switch 2", answer: "closed switch", x: 62, y: 28 },
        { id: "load", label: "load", answer: "lamp", x: 84, y: 58 },
      ],
      success: "Two closed switches in series act like AND: switch 1 AND switch 2 must both be closed.",
    },
    {
      id: "circuit-build-or-switches",
      unit: "7J Current electricity",
      title: "Build an OR switch circuit",
      brief: "The lamp should be able to light if either branch switch is closed.",
      layout: "or-switches",
      labels: ["cell", "closed switch", "open switch", "lamp", "closed switch"],
      slots: [
        { id: "source", label: "source", answer: "cell", x: 16, y: 58 },
        { id: "branch1", label: "top branch", answer: "closed switch", x: 54, y: 41 },
        { id: "branch2", label: "bottom branch", answer: "closed switch", x: 54, y: 73 },
        { id: "load", label: "load", answer: "lamp", x: 84, y: 58 },
      ],
      success: "Switches on parallel branches act like OR: either branch can complete the circuit.",
    },
  ];


  const examTrainerQuestions = [
    {
      id: "exam-7c-breathing-vs-respiration",
      unit: "7C Muscles and bones",
      kind: "written",
      title: "Breathing vs respiration",
      prompt: "Explain the difference between breathing and respiration. Aim for 3 marks.",
      marks: 3,
      keywords: ["breathing", "lungs", "air", "respiration", "cells", "energy"],
      answer: "Breathing is the movement of air into and out of the lungs. Respiration is a chemical process in cells that releases energy from glucose, using oxygen and making carbon dioxide and water.",
      cue: "Do not write that respiration simply means breathing. That is the common trap.",
    },
    {
      id: "exam-7c-inhalation-mechanism",
      unit: "7C Muscles and bones",
      kind: "written",
      title: "Inhalation sequence",
      prompt: "Describe what happens to the diaphragm, ribs, chest volume, pressure, and air movement during inhalation.",
      visual: "lungs-diaphragm",
      marks: 5,
      keywords: ["diaphragm", "contracts", "down", "ribs", "up", "out", "volume", "increases", "pressure", "decreases", "air", "in"],
      answer: "During inhalation, the diaphragm contracts and moves down. The ribs move up and out. Chest volume increases, pressure inside the chest decreases, and air moves into the lungs.",
      cue: "A high-mark answer links muscle movement to volume, pressure, and air movement.",
    },
    {
      id: "exam-7c-exhalation-mechanism",
      unit: "7C Muscles and bones",
      kind: "written",
      title: "Exhalation sequence",
      prompt: "Describe what happens during exhalation using volume and pressure.",
      marks: 4,
      keywords: ["diaphragm", "relaxes", "up", "ribs", "down", "volume", "decreases", "pressure", "increases", "air", "out"],
      answer: "During exhalation, the diaphragm relaxes and moves up. The ribs move down and in. Chest volume decreases, pressure increases, and air is pushed out of the lungs.",
      cue: "Do not just say air leaves; explain why it leaves.",
    },
    {
      id: "exam-7c-alveoli-adaptations",
      unit: "7C Muscles and bones",
      kind: "written",
      title: "Gas exchange adaptations",
      prompt: "Explain why alveoli are good places for gas exchange.",
      visual: "alveolus-gas-exchange",
      marks: 4,
      keywords: ["large surface area", "thin", "moist", "capillaries", "diffusion", "oxygen", "carbon dioxide"],
      answer: "Alveoli have a large surface area, thin walls, and a moist surface. They are surrounded by capillaries, so oxygen diffuses into the blood and carbon dioxide diffuses from the blood into the air spaces.",
      cue: "Use the word diffusion if it has been taught.",
    },
    {
      id: "exam-7c-antagonistic-muscles",
      unit: "7C Muscles and bones",
      kind: "written",
      title: "Antagonistic muscles",
      prompt: "Use the biceps and triceps to explain what an antagonistic muscle pair is.",
      visual: "arm-antagonistic",
      marks: 4,
      keywords: ["pair", "opposite", "biceps", "contracts", "triceps", "relaxes", "bend", "straighten"],
      answer: "Antagonistic muscles work in pairs and do opposite jobs. To bend the elbow, the biceps contracts while the triceps relaxes. To straighten the elbow, the triceps contracts while the biceps relaxes.",
      cue: "Muscles can pull but cannot push, so pairs are needed.",
    },
    {
      id: "exam-7c-joint-tissue-choice",
      unit: "7C Muscles and bones",
      kind: "choice",
      title: "Joints and tissues",
      prompt: "Which statement is correct?",
      marks: 1,
      choices: ["Tendons join muscle to bone; ligaments join bone to bone.", "Tendons join bone to bone; ligaments join muscle to bone.", "Cartilage contracts to move bones.", "The skeleton moves because bones contract."],
      answer: "Tendons join muscle to bone; ligaments join bone to bone.",
      keywords: ["tendon", "ligament"],
      cue: "This is a common terminology question.",
    },
    {
      id: "exam-7c-skeleton-functions",
      unit: "7C Muscles and bones",
      kind: "written",
      title: "Functions of the skeleton",
      prompt: "Give three functions of the skeleton and one example for any function.",
      visual: "skeleton-basic",
      marks: 4,
      keywords: ["support", "protect", "movement", "blood cells", "skull", "brain", "ribs", "heart", "lungs"],
      answer: "The skeleton supports the body, protects organs, allows movement with muscles and joints, and helps make blood cells. For example, the skull protects the brain and the rib cage protects the heart and lungs.",
      cue: "List functions first, then add an example to gain the final mark.",
    },
    {
      id: "exam-7c-reaction-time-method",
      unit: "7C Muscles and bones",
      kind: "written",
      title: "Reaction time practical",
      prompt: "Describe a fair method for testing reaction time using a dropped ruler.",
      visual: "reaction-time-ruler",
      marks: 5,
      keywords: ["ruler", "drop", "catch", "distance", "same", "repeat", "average", "fair"],
      answer: "One person holds a ruler at the zero mark near another person's fingers. The ruler is dropped without warning and the second person catches it. Record the distance fallen, repeat several times, keep the method the same, and calculate an average.",
      cue: "Fair-test marks often come from repeats and controlled variables.",
    },
    {
      id: "exam-7c-exercise-response",
      unit: "7C Muscles and bones",
      kind: "written",
      title: "Exercise response",
      prompt: "Explain why breathing rate and pulse rate increase during exercise.",
      marks: 4,
      keywords: ["muscles", "respiration", "energy", "oxygen", "glucose", "carbon dioxide", "blood", "faster"],
      answer: "During exercise, muscle cells respire more to release more energy. They need more oxygen and glucose, and they make more carbon dioxide. Breathing and pulse rate increase to deliver oxygen and remove carbon dioxide faster.",
      cue: "Link exercise to respiration, not just to being tired.",
    },
    {
      id: "exam-7c-blood-vessels-choice",
      unit: "7C Muscles and bones",
      kind: "choice",
      title: "Blood vessels",
      prompt: "Which vessel is best described as very small with thin walls for exchange?",
      visual: "blood-vessels",
      marks: 1,
      choices: ["capillary", "artery", "vein", "ligament"],
      answer: "capillary",
      keywords: ["capillary"],
      cue: "Capillaries are where exchange with tissues happens.",
    },
    {
      id: "exam-7c-pressure-application",
      unit: "7C Muscles and bones",
      kind: "choice",
      title: "Pressure relationship",
      prompt: "A sharp pin has a tiny area at its tip. Why does it make a large pressure?",
      marks: 1,
      choices: ["The same force acts over a smaller area.", "The pin has no force.", "A larger area always means larger pressure.", "Pressure does not depend on area."],
      answer: "The same force acts over a smaller area.",
      keywords: ["force", "area", "pressure"],
      cue: "pressure = force / area",
    },
    {
      id: "exam-7c-spot-mistake-respiration",
      unit: "7C Muscles and bones",
      kind: "written",
      title: "Spot the mistake: respiration",
      prompt: "A student writes: ‘Respiration is when your lungs breathe in oxygen.’ Correct the sentence.",
      marks: 3,
      keywords: ["respiration", "cells", "release", "energy", "oxygen", "glucose"],
      answer: "Respiration happens in cells, not just in the lungs. It is the process that releases energy from glucose using oxygen. Breathing is the movement of air into and out of the lungs.",
      cue: "This tests whether the key misconception has been fixed.",
    },

    {
      id: "exam-7f-ph-scale",
      unit: "7F Acids and alkalis",
      kind: "choice",
      title: "pH scale",
      prompt: "Which statement correctly describes pH?",
      visual: "ph-scale",
      marks: 1,
      choices: ["Acids are below pH 7, neutral is pH 7, and alkalis are above pH 7.", "Acids are above pH 7 and alkalis are below pH 7.", "All safe liquids are pH 7.", "Universal indicator only tells you if something is hot."],
      answer: "Acids are below pH 7, neutral is pH 7, and alkalis are above pH 7.",
      keywords: ["acid", "neutral", "alkali", "pH"],
      cue: "This is one of the most likely quick-mark questions.",
    },
    {
      id: "exam-7f-litmus",
      unit: "7F Acids and alkalis",
      kind: "written",
      title: "Litmus results",
      prompt: "Describe how red and blue litmus can be used to test for acids and alkalis.",
      visual: "litmus-test",
      marks: 4,
      keywords: ["blue litmus", "red", "acid", "red litmus", "blue", "alkali"],
      answer: "An acid turns blue litmus red. An alkali turns red litmus blue. If the litmus does not change, the substance may be neutral or already the same colour result.",
      cue: "Be precise about which colour starts and which colour it turns.",
    },
    {
      id: "exam-7f-universal-indicator",
      unit: "7F Acids and alkalis",
      kind: "written",
      title: "Universal indicator",
      prompt: "Explain why universal indicator gives more information than litmus.",
      visual: "indicator-palette",
      marks: 3,
      keywords: ["range", "colours", "pH", "strength", "acid", "alkali"],
      answer: "Universal indicator has a range of colours, so it can estimate pH and show how acidic or alkaline a substance is. Litmus mainly shows whether something is acidic or alkaline.",
      cue: "The key phrase is range of colours / pH estimate.",
    },
    {
      id: "exam-7f-neutralisation-equation",
      unit: "7F Acids and alkalis",
      kind: "choice",
      title: "Neutralisation equation",
      prompt: "Which word equation describes neutralisation between an acid and an alkali?",
      marks: 1,
      choices: ["acid + alkali → salt + water", "acid + water → alkali", "salt + water → acid + alkali", "alkali + metal → salt + hydrogen"],
      answer: "acid + alkali → salt + water",
      keywords: ["acid", "alkali", "salt", "water"],
      cue: "Memorise this exactly.",
    },
    {
      id: "exam-7f-neutralisation-method",
      unit: "7F Acids and alkalis",
      kind: "written",
      title: "Neutralisation practical",
      prompt: "Describe a safe method for neutralising an acid with an alkali using indicator.",
      visual: "neutralisation-setup",
      marks: 5,
      keywords: ["acid", "indicator", "alkali", "slowly", "stir", "neutral", "colour", "goggles"],
      answer: "Wear goggles. Measure the acid into a beaker or flask and add a few drops of indicator. Add alkali slowly while stirring until the indicator shows neutral. Stop at the neutral colour and record the volumes used.",
      cue: "Slow addition and stopping at neutral are the practical marks.",
    },
    {
      id: "exam-7f-safety-mistake",
      unit: "7F Acids and alkalis",
      kind: "written",
      title: "Spot the safety mistake",
      prompt: "Look at the safety-mistake diagram. What is wrong and what should the student do instead?",
      visual: "acid-safety-mistake",
      marks: 4,
      keywords: ["goggles", "acid", "pour", "splash", "careful", "small amount", "away"],
      answer: "The student is pouring acid in a way that could splash and they are not clearly protected. They should wear goggles, pour small amounts carefully, keep the bottle controlled and pointed away, and clean spills safely with teacher help.",
      cue: "Name the risk and the safer action.",
    },
    {
      id: "exam-7f-indicator-mistake",
      unit: "7F Acids and alkalis",
      kind: "written",
      title: "Spot the method mistake",
      prompt: "A student adds a large squirt of indicator to an acid. Explain the mistake.",
      visual: "indicator-mistake",
      marks: 3,
      keywords: ["few drops", "indicator", "too much", "colour", "result", "affect"],
      answer: "Only a few drops of indicator are needed. Adding too much can make the colour harder to judge and may affect the mixture, so the result is less reliable.",
      cue: "Practical questions often reward reliability language.",
    },
    {
      id: "exam-7f-salt-name-hcl",
      unit: "7F Acids and alkalis",
      kind: "choice",
      title: "Salt naming",
      prompt: "Hydrochloric acid makes which type of salt?",
      marks: 1,
      choices: ["chloride", "nitrate", "sulfate", "oxide"],
      answer: "chloride",
      keywords: ["hydrochloric", "chloride"],
      cue: "Hydrochloric → chloride.",
    },
    {
      id: "exam-7f-salt-name-sulfuric",
      unit: "7F Acids and alkalis",
      kind: "choice",
      title: "Salt naming",
      prompt: "Sulfuric acid makes which type of salt?",
      marks: 1,
      choices: ["sulfate", "chloride", "nitrate", "carbonate"],
      answer: "sulfate",
      keywords: ["sulfuric", "sulfate"],
      cue: "Sulfuric → sulfate.",
    },
    {
      id: "exam-7f-evaporation-crystals",
      unit: "7F Acids and alkalis",
      kind: "written",
      title: "Making salt crystals",
      prompt: "After making a neutral salt solution, how can you obtain salt crystals safely?",
      visual: "evaporation-dish",
      marks: 4,
      keywords: ["evaporate", "water", "solution", "warm", "crystals", "leave", "cool"],
      answer: "Pour the neutral salt solution into an evaporating dish. Warm it gently to evaporate some water, then leave the concentrated solution to cool or stand so crystals form.",
      cue: "Do not boil it dry in a school practical answer unless your teacher specifically allows that method.",
    },
    {
      id: "exam-7f-dilution",
      unit: "7F Acids and alkalis",
      kind: "choice",
      title: "Dilution idea",
      prompt: "What happens to an acid when it is diluted with water?",
      visual: "dilution-method",
      marks: 1,
      choices: ["It becomes less acidic, so its pH moves closer to 7.", "It always becomes a strong alkali.", "It becomes more concentrated.", "The pH scale no longer applies."],
      answer: "It becomes less acidic, so its pH moves closer to 7.",
      keywords: ["dilute", "less acidic", "pH", "closer to 7"],
      cue: "Dilution reduces concentration; it does not magically turn an acid into an alkali.",
    },
    {
      id: "exam-7f-fair-test",
      unit: "7F Acids and alkalis",
      kind: "written",
      title: "Fair testing indicators",
      prompt: "Name two variables you should keep the same when comparing how different liquids affect universal indicator.",
      marks: 2,
      keywords: ["same volume", "same amount", "same indicator", "same time", "same temperature", "same drops"],
      answer: "Keep the volume of each test liquid the same and use the same number of drops of universal indicator. You could also keep the time and temperature the same.",
      cue: "Fair test means only the liquid type should change.",
    },

    {
      id: "exam-7j-complete-circuit",
      unit: "7J Current electricity",
      kind: "written",
      title: "Complete circuit",
      prompt: "Explain why a lamp only lights in a complete circuit.",
      visual: "circuit-open-switch",
      marks: 3,
      keywords: ["complete", "closed", "loop", "current", "flow", "lamp"],
      answer: "A lamp lights only when there is a complete closed loop. Current can then flow from the cell, through the components, and back to the cell. A gap stops the current.",
      cue: "The key idea is closed path / loop.",
    },
    {
      id: "exam-7j-series-vs-parallel",
      unit: "7J Current electricity",
      kind: "written",
      title: "Series vs parallel",
      prompt: "Compare a series circuit and a parallel circuit.",
      visual: "circuit-parallel",
      marks: 4,
      keywords: ["series", "one loop", "same current", "parallel", "branches", "separate paths"],
      answer: "A series circuit has one loop, so all components share the same current path. A parallel circuit has branches, so current has more than one path and components can be on separate branches.",
      cue: "Use the words loop and branches.",
    },
    {
      id: "exam-7j-ammeter-placement",
      unit: "7J Current electricity",
      kind: "choice",
      title: "Ammeter placement",
      prompt: "Where should an ammeter be placed to measure current through a lamp?",
      visual: "circuit-ammeter-series",
      marks: 1,
      choices: ["in series with the lamp", "in parallel across the lamp", "outside the circuit", "instead of the cell"],
      answer: "in series with the lamp",
      keywords: ["ammeter", "series"],
      cue: "Ammeter = series.",
    },
    {
      id: "exam-7j-voltmeter-placement",
      unit: "7J Current electricity",
      kind: "choice",
      title: "Voltmeter placement",
      prompt: "Where should a voltmeter be placed to measure voltage across a lamp?",
      visual: "circuit-voltmeter-parallel",
      marks: 1,
      choices: ["in parallel across the lamp", "in series before the lamp", "in the same place as the switch", "not connected to the circuit"],
      answer: "in parallel across the lamp",
      keywords: ["voltmeter", "parallel"],
      cue: "Voltmeter = parallel.",
    },
    {
      id: "exam-7j-voltmeter-mistake",
      unit: "7J Current electricity",
      kind: "written",
      title: "Spot the meter mistake",
      prompt: "Look at the diagram. A voltmeter has been connected in series. Explain the mistake and fix it.",
      visual: "circuit-voltmeter-mistake",
      marks: 3,
      keywords: ["voltmeter", "parallel", "across", "lamp", "series", "wrong"],
      answer: "The voltmeter is in series, which is wrong for measuring voltage across a component. It should be connected in parallel across the lamp or component being measured.",
      cue: "Say both what is wrong and what to do instead.",
    },
    {
      id: "exam-7j-current-in-series",
      unit: "7J Current electricity",
      kind: "choice",
      title: "Current in series",
      prompt: "In a simple series circuit, what happens to current at different points?",
      visual: "circuit-series",
      marks: 1,
      choices: ["It is the same everywhere in the loop.", "It is used up by the first lamp.", "It is zero after the switch.", "It is larger after each component."],
      answer: "It is the same everywhere in the loop.",
      keywords: ["series", "current", "same"],
      cue: "Current is not used up.",
    },
    {
      id: "exam-7j-current-in-parallel",
      unit: "7J Current electricity",
      kind: "written",
      title: "Current in parallel",
      prompt: "Explain what happens to current at a junction in a parallel circuit.",
      visual: "circuit-parallel",
      marks: 3,
      keywords: ["junction", "splits", "branches", "total", "sum", "rejoins"],
      answer: "At a junction in a parallel circuit, current splits between the branches. The total current is the sum of the branch currents, and the currents rejoin after the branches.",
      cue: "The key relationship is total current = branch currents added together.",
    },
    {
      id: "exam-7j-switch-and",
      unit: "7J Current electricity",
      kind: "written",
      title: "AND switch circuit",
      prompt: "Explain why two switches in series act like an AND circuit.",
      visual: "circuit-and-switches",
      marks: 3,
      keywords: ["series", "both", "closed", "complete", "AND", "lamp"],
      answer: "Two switches in series act like AND because both switches must be closed for the circuit to be complete. If either switch is open, there is a gap and the lamp will not light.",
      cue: "AND means switch A and switch B are both needed.",
    },
    {
      id: "exam-7j-switch-or",
      unit: "7J Current electricity",
      kind: "written",
      title: "OR switch circuit",
      prompt: "Explain why switches on parallel branches act like an OR circuit.",
      visual: "circuit-or-switches",
      marks: 3,
      keywords: ["parallel", "branch", "either", "closed", "OR", "complete"],
      answer: "Switches on parallel branches act like OR because either branch can complete a path for current. The lamp can light if switch A or switch B is closed.",
      cue: "OR means either route can work.",
    },
    {
      id: "exam-7j-short-circuit",
      unit: "7J Current electricity",
      kind: "written",
      title: "Spot the short circuit",
      prompt: "Look at the short-circuit diagram. Explain why this is a problem.",
      visual: "circuit-short-mistake",
      marks: 3,
      keywords: ["short circuit", "low resistance", "bypass", "large current", "danger", "lamp"],
      answer: "The extra wire gives current a very low-resistance path that bypasses the lamp. This can cause a large current, so the circuit may be dangerous and the lamp may not work properly.",
      cue: "A short circuit is not just a messy circuit; it gives current an easier path.",
    },
    {
      id: "exam-7j-resistance-current",
      unit: "7J Current electricity",
      kind: "choice",
      title: "Resistance and current",
      prompt: "If voltage stays the same, what usually happens when resistance increases?",
      marks: 1,
      choices: ["current decreases", "current increases", "current becomes pH 7", "current is used up"],
      answer: "current decreases",
      keywords: ["resistance", "current", "decreases"],
      cue: "Higher resistance makes it harder for current to flow.",
    },
    {
      id: "exam-7j-circuit-symbols",
      unit: "7J Current electricity",
      kind: "choice",
      title: "Circuit symbols",
      prompt: "Which instrument is shown by a circle with the letter A?",
      visual: "symbol-ammeter",
      marks: 1,
      choices: ["ammeter", "voltmeter", "lamp", "cell"],
      answer: "ammeter",
      keywords: ["ammeter"],
      cue: "A = ammeter, V = voltmeter.",
    },
  ];

  const tips = [
    "Say the answer out loud before flipping the card. This makes your brain work harder.",
    "For equations, cover the answer and try to write the full relationship from memory.",
    "If two answers look similar, spot the one science word that makes them different.",
    "Use examples: acid + alkali makes salt + water; a series circuit has one loop.",
    "Do a tiny sprint: 5 questions, quick break, then 5 more.",
    "Teach one card to someone else. If you can teach it, you know it.",
  ];

  const badgeRules = [
    { id: "first-win", label: "🌟 First spark", unlocked: (s) => s.correct >= 1 },
    { id: "streak-5", label: "🔥 5 streak", unlocked: (s) => s.bestStreak >= 5 || s.currentStreak >= 5 },
    { id: "streak-10", label: "⚡ 10 streak", unlocked: (s) => s.bestStreak >= 10 || s.currentStreak >= 10 },
    { id: "xp-100", label: "🚀 100 XP", unlocked: (s) => s.xp >= 100 },
    { id: "xp-300", label: "🧠 300 XP", unlocked: (s) => s.xp >= 300 },
    { id: "cards-25", label: "📚 25 mastered", unlocked: (s) => s.mastered.length >= 25 },
    { id: "cards-50", label: "🏆 50 mastered", unlocked: (s) => s.mastered.length >= 50 },
    { id: "perfect", label: "🎯 Sharp shooter", unlocked: (s) => s.attempted >= 10 && accuracy(s) >= 90 },
    { id: "label-lab-5", label: "🧩 Labeller", unlocked: (s) => s.labWins >= 5 },
    { id: "circuit-builder-5", label: "🔌 Circuit builder", unlocked: (s) => s.circuitWins >= 5 },
    { id: "exam-coach-10", label: "📝 Exam ready", unlocked: (s) => s.examWins >= 10 },
    { id: "weak-cleanup", label: "🔁 Comeback kid", unlocked: (s) => (s.weakSolved || 0) >= 10 },
  ];

  const defaultProgress = {
    attempted: 0,
    correct: 0,
    xp: 0,
    currentStreak: 0,
    bestStreak: 0,
    labWins: 0,
    circuitWins: 0,
    examWins: 0,
    weakSolved: 0,
    weakIds: [],
    mastered: [],
    calm: false,
    sound: true,
    lastSavedAt: null,
  };

  const state = {
    mode: "study",
    unit: "all",
    type: "all",
    search: "",
    order: [],
    index: 0,
    flipped: false,
    quizLocked: false,
    currentChoices: [],
    labIndex: 0,
    labAnswers: {},
    selectedLabLabel: "",
    labLocked: false,
    circuitIndex: 0,
    circuitAnswers: {},
    selectedCircuitPart: "",
    circuitLocked: false,
    examIndex: 0,
    examRevealed: false,
    examLocked: false,
    examResponse: "",
    progress: loadProgress(),
    sessionAnswered: 0,
    sessionCorrect: 0,
    audioContext: null,
    oceanSource: null,
    oceanGain: null,
    oceanFilter: null,
    fireworks: [],
    animationFrame: null,
    fitFrame: null,
  };

  function loadProgress() {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      return {
        ...defaultProgress,
        ...stored,
        mastered: Array.isArray(stored.mastered) ? stored.mastered : [],
        weakIds: Array.isArray(stored.weakIds) ? stored.weakIds : [],
      };
    } catch {
      return { ...defaultProgress };
    }
  }

  function saveProgress() {
    state.progress.lastSavedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.progress));
  }

  function accuracy(progress = state.progress) {
    if (!progress.attempted) return 0;
    return Math.round((progress.correct / progress.attempted) * 100);
  }

  function uniqueValues(key) {
    return [...new Set(cards.map((card) => card[key]).filter(Boolean))].sort();
  }

  function populateFilters() {
    const units = uniqueValues("unit");
    els.unitFilter.innerHTML = [
      `<option value="all">All topics</option>`,
      ...units.map((unit) => `<option value="${escapeHtml(unit)}">${escapeHtml(unit)}</option>`),
    ].join("");
  }

  function filteredCards() {
    const search = state.search.trim().toLowerCase();
    return cards.filter((card) => {
      const unitMatch = state.unit === "all" || card.unit === state.unit;
      const forcedEquationMode = state.mode === "equations";
      const forcedVisualMode = state.mode === "visual";
      const typeMatch = forcedEquationMode
        ? card.type === "Equation/relationship"
        : forcedVisualMode
          ? Boolean(card.visual) || visualLabTypes.has(card.type)
          : state.type === "all" || card.type === state.type;
      const searchText = `${card.unit} ${card.type} ${card.front} ${card.back} ${card.cue}`.toLowerCase();
      const searchMatch = !search || searchText.includes(search);
      const weakMatch = state.mode !== "weak" || (state.progress.weakIds || []).includes(card.id);
      return unitMatch && typeMatch && searchMatch && weakMatch;
    });
  }

  function rebuildDeck({ shuffle = false } = {}) {
    const deck = filteredCards();
    state.order = deck.map((_, index) => index);
    if (shuffle || ["quiz", "boss", "equations", "weak"].includes(state.mode)) {
      shuffleArray(state.order);
    }
    state.index = 0;
    state.flipped = false;
    state.quizLocked = false;
    state.currentChoices = [];
    render();
  }

  function deckCards() {
    const deck = filteredCards();
    return state.order.map((index) => deck[index]).filter(Boolean);
  }

  function currentCard() {
    const deck = deckCards();
    return deck[state.index] || null;
  }

  function nextCard() {
    if (state.mode === "lab") {
      nextLabGame();
      return;
    }
    if (state.mode === "circuit") {
      nextCircuitGame();
      return;
    }
    if (state.mode === "exam") {
      nextExamQuestion();
      return;
    }
    const deck = deckCards();
    if (!deck.length) return;
    state.index = (state.index + 1) % deck.length;
    state.flipped = false;
    state.quizLocked = false;
    state.currentChoices = [];
    render();
  }

  function shuffleCurrentDeck() {
    if (state.mode === "lab") {
      const labDeck = filteredLabGames();
      if (labDeck.length) state.labIndex = Math.floor(Math.random() * labDeck.length);
      state.labAnswers = {};
      state.selectedLabLabel = "";
      state.labLocked = false;
      render();
      return;
    }
    if (state.mode === "circuit") {
      const circuitDeck = filteredCircuitGames();
      if (circuitDeck.length) state.circuitIndex = Math.floor(Math.random() * circuitDeck.length);
      state.circuitAnswers = {};
      state.selectedCircuitPart = "";
      state.circuitLocked = false;
      render();
      return;
    }
    if (state.mode === "exam") {
      const examDeck = filteredExamQuestions();
      if (examDeck.length) state.examIndex = Math.floor(Math.random() * examDeck.length);
      resetExamQuestionState();
      render();
      return;
    }
    shuffleArray(state.order);
    state.index = 0;
    state.flipped = false;
    state.quizLocked = false;
    state.currentChoices = [];
    bounce(els.flashcard);
    render();
  }


  function renderCardVisual(card) {
    const visualKey = card?.visual || "";
    if (!els.cardVisual) return;
    const html = visualKey ? renderVisual(visualKey) : "";
    els.cardVisual.innerHTML = html;
    els.cardVisual.classList.toggle("hidden", !html);
    els.flashcard.classList.toggle("has-visual", Boolean(html));
  }

  function renderVisual(key) {
    const symbolKey = key.replace(/^symbol-/, "");
    if (key.startsWith("symbol-")) return renderCircuitSymbol(symbolKey);

    const diagrams = {
      "circuit-series": circuitSeriesSvg,
      "circuit-parallel": circuitParallelSvg,
      "circuit-ammeter-series": circuitAmmeterSeriesSvg,
      "circuit-voltmeter-parallel": circuitVoltmeterParallelSvg,
      "circuit-voltmeter-mistake": circuitVoltmeterMistakeSvg,
      "circuit-and-switches": circuitAndSwitchesSvg,
      "circuit-or-switches": circuitOrSwitchesSvg,
      "circuit-open-switch": circuitOpenSwitchSvg,
      "circuit-current-arrows": circuitCurrentArrowsSvg,
      "circuit-short-mistake": circuitShortMistakeSvg,
      "ph-scale": phScaleSvg,
      "litmus-test": litmusTestSvg,
      "indicator-palette": indicatorPaletteSvg,
      "neutralisation-setup": neutralisationSetupSvg,
      "acid-safety-mistake": acidSafetyMistakeSvg,
      "indicator-mistake": indicatorMistakeSvg,
      "evaporation-dish": evaporationDishSvg,
      "dilution-method": dilutionMethodSvg,
      "elbow-joint": elbowJointSvg,
      "arm-antagonistic": armAntagonisticSvg,
      "skeleton-basic": skeletonBasicSvg,
      "lungs-diaphragm": lungsDiaphragmSvg,
      "alveolus-gas-exchange": alveolusGasExchangeSvg,
      "blood-vessels": bloodVesselsSvg,
      "reaction-time-ruler": reactionTimeRulerSvg,
    };
    const renderer = diagrams[key];
    return renderer ? renderer() : "";
  }

  function diagramFrame(title, inner, viewBox = "0 0 520 260") {
    return `
      <svg class="study-diagram" viewBox="${viewBox}" role="img" aria-label="${escapeHtml(title)}">
        <defs>
          <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="8" stdDeviation="8" flood-color="#0f172a" flood-opacity="0.16"/>
          </filter>
          <marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L0,6 L9,3 z" fill="currentColor"></path>
          </marker>
        </defs>
        <rect x="8" y="8" width="504" height="244" rx="28" class="diagram-bg"/>
        <text x="28" y="38" class="diagram-title">${escapeHtml(title)}</text>
        ${inner}
      </svg>`;
  }

  function labelBubble(x, y, label) {
    return `<g class="diagram-label"><circle cx="${x}" cy="${y}" r="16"/><text x="${x}" y="${y + 5}">${label}</text></g>`;
  }

  function renderCircuitSymbol(kind) {
    const labels = {
      cell: "Cell",
      battery: "Battery",
      lamp: "Lamp / bulb",
      switchOpen: "Open switch",
      switchClosed: "Closed switch",
      resistor: "Resistor",
      ammeter: "Ammeter",
      voltmeter: "Voltmeter",
      motor: "Motor",
    };
    const drawing = {
      cell: `<line x1="110" y1="140" x2="215" y2="140"/><line x1="215" y1="96" x2="215" y2="184"/><line x1="250" y1="116" x2="250" y2="164"/><line x1="250" y1="140" x2="390" y2="140"/>`,
      battery: `<line x1="92" y1="140" x2="170" y2="140"/><line x1="170" y1="96" x2="170" y2="184"/><line x1="202" y1="116" x2="202" y2="164"/><line x1="238" y1="96" x2="238" y2="184"/><line x1="270" y1="116" x2="270" y2="164"/><line x1="270" y1="140" x2="420" y2="140"/>`,
      lamp: `<line x1="90" y1="140" x2="190" y2="140"/><circle cx="260" cy="140" r="48"/><line x1="226" y1="106" x2="294" y2="174"/><line x1="294" y1="106" x2="226" y2="174"/><line x1="308" y1="140" x2="430" y2="140"/>`,
      switchOpen: `<line x1="88" y1="140" x2="204" y2="140"/><circle cx="212" cy="140" r="7"/><circle cx="318" cy="140" r="7"/><line x1="218" y1="136" x2="300" y2="92"/><line x1="326" y1="140" x2="430" y2="140"/>`,
      switchClosed: `<line x1="88" y1="140" x2="204" y2="140"/><circle cx="212" cy="140" r="7"/><circle cx="318" cy="140" r="7"/><line x1="218" y1="140" x2="312" y2="140"/><line x1="326" y1="140" x2="430" y2="140"/>`,
      resistor: `<line x1="88" y1="140" x2="178" y2="140"/><rect x="178" y="116" width="150" height="48" rx="8"/><line x1="328" y1="140" x2="430" y2="140"/>`,
      ammeter: `<line x1="88" y1="140" x2="190" y2="140"/><circle cx="260" cy="140" r="52"/><text x="260" y="154" class="meter-letter">A</text><line x1="312" y1="140" x2="430" y2="140"/>`,
      voltmeter: `<line x1="88" y1="140" x2="190" y2="140"/><circle cx="260" cy="140" r="52"/><text x="260" y="154" class="meter-letter">V</text><line x1="312" y1="140" x2="430" y2="140"/>`,
      motor: `<line x1="88" y1="140" x2="190" y2="140"/><circle cx="260" cy="140" r="52"/><text x="260" y="154" class="meter-letter">M</text><line x1="312" y1="140" x2="430" y2="140"/>`,
    }[kind] || "";
    return diagramFrame(labels[kind] || "Circuit symbol", `<g class="circuit-line">${drawing}</g>`);
  }

  function circuitSeriesSvg() {
    return diagramFrame("Series circuit", `
      <g class="circuit-line">
        <path d="M95 85 H425 V205 H95 Z" fill="none"/>
        <line x1="105" y1="122" x2="105" y2="168"/><line x1="130" y1="104" x2="130" y2="186"/>
        <circle cx="250" cy="85" r="30"/><line x1="230" y1="65" x2="270" y2="105"/><line x1="270" y1="65" x2="230" y2="105"/>
        <circle cx="338" cy="205" r="30"/><line x1="318" y1="185" x2="358" y2="225"/><line x1="358" y1="185" x2="318" y2="225"/>
      </g>
      ${labelBubble(250, 44, "A")}${labelBubble(338, 246, "B")}
    `);
  }

  function circuitParallelSvg() {
    return diagramFrame("Parallel circuit", `
      <g class="circuit-line">
        <path d="M95 85 H425 V205 H95 Z" fill="none"/>
        <line x1="105" y1="122" x2="105" y2="168"/><line x1="130" y1="104" x2="130" y2="186"/>
        <line x1="180" y1="85" x2="180" y2="205"/><line x1="355" y1="85" x2="355" y2="205"/>
        <line x1="180" y1="120" x2="355" y2="120"/><line x1="180" y1="172" x2="355" y2="172"/>
        <circle cx="268" cy="120" r="24"/><line x1="252" y1="104" x2="284" y2="136"/><line x1="284" y1="104" x2="252" y2="136"/>
        <circle cx="268" cy="172" r="24"/><line x1="252" y1="156" x2="284" y2="188"/><line x1="284" y1="156" x2="252" y2="188"/>
      </g>
      ${labelBubble(268, 80, "A")}${labelBubble(268, 214, "B")}
    `);
  }

  function circuitAmmeterSeriesSvg() {
    return diagramFrame("Measuring current", `
      <g class="circuit-line">
        <path d="M95 95 H425 V200 H95 Z" fill="none"/>
        <line x1="105" y1="127" x2="105" y2="168"/><line x1="130" y1="110" x2="130" y2="185"/>
        <circle cx="260" cy="95" r="34"/><text x="260" y="108" class="meter-letter">A</text>
        <circle cx="330" cy="200" r="26"/><line x1="314" y1="184" x2="346" y2="216"/><line x1="346" y1="184" x2="314" y2="216"/>
      </g>
      ${labelBubble(260, 48, "A")}
    `);
  }

  function circuitVoltmeterParallelSvg() {
    return diagramFrame("Measuring voltage", `
      <g class="circuit-line">
        <path d="M95 95 H425 V205 H95 Z" fill="none"/>
        <line x1="105" y1="127" x2="105" y2="168"/><line x1="130" y1="110" x2="130" y2="185"/>
        <circle cx="300" cy="95" r="28"/><line x1="282" y1="77" x2="318" y2="113"/><line x1="318" y1="77" x2="282" y2="113"/>
        <path d="M242 95 V170 H358 V95" fill="none"/>
        <circle cx="300" cy="170" r="31"/><text x="300" y="182" class="meter-letter">V</text>
      </g>
      ${labelBubble(300, 212, "A")}
    `);
  }

  function circuitVoltmeterMistakeSvg() {
    return diagramFrame("Spot the mistake", `
      <g class="circuit-line mistake-line">
        <path d="M95 95 H425 V205 H95 Z" fill="none"/>
        <line x1="105" y1="127" x2="105" y2="168"/><line x1="130" y1="110" x2="130" y2="185"/>
        <circle cx="255" cy="95" r="32"/><text x="255" y="107" class="meter-letter">V</text>
        <circle cx="350" cy="205" r="28"/><line x1="332" y1="187" x2="368" y2="223"/><line x1="368" y1="187" x2="332" y2="223"/>
      </g>
      ${labelBubble(255, 48, "!")}
    `);
  }

  function circuitAndSwitchesSvg() {
    return diagramFrame("AND switch arrangement", `
      <g class="circuit-line">
        <path d="M90 145 H140 M330 145 H425 V205 H90 Z" fill="none"/>
        <line x1="100" y1="172" x2="100" y2="204"/><line x1="124" y1="158" x2="124" y2="218"/>
        <circle cx="150" cy="145" r="6"/><circle cx="220" cy="145" r="6"/><line x1="156" y1="140" x2="202" y2="108"/>
        <circle cx="232" cy="145" r="6"/><circle cx="302" cy="145" r="6"/><line x1="238" y1="140" x2="284" y2="108"/>
        <circle cx="355" cy="205" r="25"/><line x1="339" y1="189" x2="371" y2="221"/><line x1="371" y1="189" x2="339" y2="221"/>
      </g>
      ${labelBubble(185, 90, "A")}${labelBubble(267, 90, "B")}
    `);
  }

  function circuitOrSwitchesSvg() {
    return diagramFrame("OR switch arrangement", `
      <g class="circuit-line">
        <path d="M90 145 H150 M320 145 H425 V205 H90 Z" fill="none"/>
        <line x1="100" y1="172" x2="100" y2="204"/><line x1="124" y1="158" x2="124" y2="218"/>
        <path d="M150 145 V102 H320 V145" fill="none"/>
        <path d="M150 145 V188 H320 V145" fill="none"/>
        <circle cx="175" cy="102" r="6"/><circle cx="275" cy="102" r="6"/><line x1="181" y1="98" x2="253" y2="66"/>
        <circle cx="175" cy="188" r="6"/><circle cx="275" cy="188" r="6"/><line x1="181" y1="188" x2="270" y2="188"/>
        <circle cx="355" cy="205" r="25"/><line x1="339" y1="189" x2="371" y2="221"/><line x1="371" y1="189" x2="339" y2="221"/>
      </g>
      ${labelBubble(225, 60, "A")}${labelBubble(225, 224, "B")}
    `);
  }

  function circuitOpenSwitchSvg() {
    return diagramFrame("Open switch", `
      <g class="circuit-line">
        <path d="M95 95 H425 V205 H95 Z" fill="none"/>
        <line x1="105" y1="127" x2="105" y2="168"/><line x1="130" y1="110" x2="130" y2="185"/>
        <circle cx="225" cy="95" r="6"/><circle cx="300" cy="95" r="6"/><line x1="231" y1="91" x2="285" y2="58"/>
        <circle cx="330" cy="205" r="28"/><line x1="312" y1="187" x2="348" y2="223"/><line x1="348" y1="187" x2="312" y2="223"/>
      </g>
      ${labelBubble(260, 50, "A")}
    `);
  }

  function circuitCurrentArrowsSvg() {
    return diagramFrame("Current direction", `
      <g class="circuit-line current-arrows">
        <path d="M95 95 H425 V205 H95 Z" fill="none"/>
        <path d="M188 95 H280" marker-end="url(#arrow)"/><path d="M425 130 V190" marker-end="url(#arrow)"/><path d="M330 205 H230" marker-end="url(#arrow)"/>
        <line x1="105" y1="127" x2="105" y2="168"/><line x1="130" y1="110" x2="130" y2="185"/>
        <circle cx="318" cy="95" r="26"/><line x1="302" y1="79" x2="334" y2="111"/><line x1="334" y1="79" x2="302" y2="111"/>
      </g>
      ${labelBubble(246, 68, "A")}
    `);
  }

  function circuitShortMistakeSvg() {
    return diagramFrame("Spot the mistake", `
      <g class="circuit-line mistake-line">
        <path d="M95 95 H425 V205 H95 Z" fill="none"/>
        <line x1="105" y1="127" x2="105" y2="168"/><line x1="130" y1="110" x2="130" y2="185"/>
        <path d="M170 95 V205" fill="none"/>
        <circle cx="320" cy="205" r="28"/><line x1="302" y1="187" x2="338" y2="223"/><line x1="338" y1="187" x2="302" y2="223"/>
      </g>
      ${labelBubble(170, 150, "!")}
    `);
  }

  function phScaleSvg() {
    const cells = Array.from({ length: 14 }, (_, i) => {
      const x = 48 + i * 30;
      return `<rect x="${x}" y="115" width="30" height="54" class="ph ph-${i + 1}"/><text x="${x + 15}" y="190" class="small-label">${i + 1}</text>`;
    }).join("");
    return diagramFrame("pH scale", `
      ${cells}
      <text x="84" y="92" class="diagram-text">acidic</text><text x="245" y="92" class="diagram-text">neutral</text><text x="358" y="92" class="diagram-text">alkaline</text>
      ${labelBubble(78, 113, "A")}${labelBubble(258, 113, "B")}${labelBubble(438, 113, "C")}
    `);
  }

  function litmusTestSvg() {
    return diagramFrame("Litmus tests", `
      <rect x="85" y="90" width="110" height="130" rx="18" class="beaker"/><text x="140" y="152" class="diagram-text">acid</text>
      <rect x="325" y="90" width="110" height="130" rx="18" class="beaker"/><text x="380" y="152" class="diagram-text">alkali</text>
      <rect x="116" y="58" width="24" height="92" rx="7" class="litmus-blue" transform="rotate(-12 128 104)"/>
      <rect x="352" y="58" width="24" height="92" rx="7" class="litmus-red" transform="rotate(12 364 104)"/>
      ${labelBubble(122, 55, "A")}${labelBubble(366, 55, "B")}
    `);
  }

  function indicatorPaletteSvg() {
    return diagramFrame("Universal indicator", `
      <rect x="95" y="98" width="330" height="88" rx="22" class="palette-bg"/>
      <circle cx="145" cy="142" r="28" class="indicator-red"/><circle cx="205" cy="142" r="28" class="indicator-orange"/><circle cx="265" cy="142" r="28" class="indicator-green"/><circle cx="325" cy="142" r="28" class="indicator-blue"/><circle cx="385" cy="142" r="28" class="indicator-purple"/>
      ${labelBubble(145, 90, "A")}${labelBubble(265, 90, "B")}${labelBubble(385, 90, "C")}
    `);
  }

  function neutralisationSetupSvg() {
    return diagramFrame("Neutralisation practical", `
      <rect x="78" y="72" width="90" height="135" rx="16" class="beaker acid-fill"/><text x="123" y="226" class="small-label">acid</text>
      <rect x="214" y="68" width="92" height="140" rx="16" class="beaker alkali-fill"/><text x="260" y="226" class="small-label">alkali + indicator</text>
      <path d="M355 72 h42 l-12 145 h-18 z" class="burette"/><line x1="376" y1="217" x2="376" y2="237" class="drip"/>
      <circle cx="376" cy="244" r="5" class="drip-dot"/>
      ${labelBubble(123, 54, "A")}${labelBubble(260, 52, "B")}${labelBubble(376, 52, "C")}
    `);
  }

  function acidSafetyMistakeSvg() {
    return diagramFrame("Spot the safety mistake", `
      <circle cx="165" cy="94" r="34" class="face"/><path d="M136 78 q28 -40 58 0" class="hair"/>
      <path d="M130 210 q35 -72 70 0" class="labcoat"/>
      <path d="M250 118 l95 -35 l14 33 l-94 35 z" class="acid-bottle"/><text x="304" y="113" class="small-label">acid</text>
      <rect x="340" y="148" width="84" height="76" rx="14" class="beaker acid-fill"/>
      <path d="M210 145 C250 138, 282 132, 334 120" class="splash"/>
      ${labelBubble(165, 52, "!")}
    `);
  }

  function indicatorMistakeSvg() {
    return diagramFrame("Spot the method mistake", `
      <rect x="105" y="86" width="118" height="126" rx="18" class="beaker acid-fill"/><text x="164" y="235" class="small-label">acid</text>
      <rect x="292" y="80" width="34" height="112" rx="10" class="dropper"/><circle cx="309" cy="206" r="8" class="indicator-purple"/>
      <text x="300" y="230" class="small-label">too much indicator</text>
      <path d="M330 120 C370 138, 386 160, 400 188" class="splash"/>
      ${labelBubble(309, 54, "!")}
    `);
  }

  function evaporationDishSvg() {
    return diagramFrame("Making salt crystals", `
      <ellipse cx="250" cy="140" rx="125" ry="42" class="dish"/><path d="M125 140 q125 90 250 0" class="dish"/>
      <path d="M160 145 q90 42 180 0" class="solution"/>
      <path d="M210 92 q-18 -30 0 -52 M260 94 q-18 -30 0 -52 M310 92 q-18 -30 0 -52" class="steam"/>
      ${labelBubble(250, 180, "A")}
    `);
  }

  function dilutionMethodSvg() {
    return diagramFrame("Diluting acid", `
      <rect x="110" y="92" width="118" height="128" rx="18" class="beaker water-fill"/><text x="169" y="238" class="small-label">water</text>
      <rect x="302" y="52" width="78" height="142" rx="14" class="beaker acid-fill" transform="rotate(18 341 123)"/><text x="350" y="230" class="small-label">acid added slowly</text>
      <path d="M285 120 C255 130, 232 146, 205 168" class="drip"/>
      ${labelBubble(169, 74, "A")}${labelBubble(343, 46, "B")}
    `);
  }

  function elbowJointSvg() {
    return diagramFrame("Elbow joint", `
      <path d="M110 130 C185 105, 250 122, 315 86" class="bone"/>
      <path d="M145 176 C220 144, 278 162, 398 134" class="bone"/>
      <ellipse cx="248" cy="138" rx="45" ry="34" class="cartilage"/>
      <path d="M206 90 C228 118, 235 160, 218 195" class="ligament"/>
      <path d="M300 90 C278 120, 272 158, 292 195" class="tendon"/>
      ${labelBubble(248, 100, "A")}${labelBubble(196, 74, "B")}${labelBubble(314, 72, "C")}
    `);
  }

  function armAntagonisticSvg() {
    return diagramFrame("Antagonistic muscles", `
      <path d="M112 108 C170 72, 248 78, 308 115" class="bone"/>
      <path d="M300 115 C370 150, 396 178, 420 218" class="bone"/>
      <path d="M162 100 C210 58, 282 74, 312 124 C250 116, 204 116, 162 100" class="muscle-red"/>
      <path d="M165 136 C228 165, 284 160, 326 130 C260 140, 208 140, 165 136" class="muscle-blue"/>
      ${labelBubble(238, 72, "A")}${labelBubble(238, 172, "B")}${labelBubble(310, 128, "C")}
    `);
  }

  function skeletonBasicSvg() {
    return diagramFrame("Skeleton labels", `
      <circle cx="260" cy="70" r="34" class="bone-fill"/><path d="M230 120 H290 L305 190 H215 Z" class="bone-fill"/>
      <path d="M215 132 C170 118, 142 146, 120 185 M305 132 C350 118, 378 146, 400 185" class="bone"/>
      <path d="M238 190 L215 235 M282 190 L305 235" class="bone"/>
      <path d="M235 118 q25 28 50 0 M232 140 q28 25 56 0 M230 162 q30 22 60 0" class="rib-lines"/>
      ${labelBubble(260, 30, "A")}${labelBubble(315, 154, "B")}${labelBubble(260, 118, "C")}
    `);
  }

  function lungsDiaphragmSvg() {
    return diagramFrame("Breathing system", `
      <path d="M260 64 V132" class="airway"/><path d="M260 92 C220 105, 205 140, 202 188" class="airway"/><path d="M260 92 C300 105, 315 140, 318 188" class="airway"/>
      <path d="M207 116 C140 128, 138 220, 230 214 C244 180, 240 142, 207 116" class="lung-left"/>
      <path d="M313 116 C380 128, 382 220, 290 214 C276 180, 280 142, 313 116" class="lung-right"/>
      <path d="M165 218 Q260 250 355 218" class="diaphragm"/>
      ${labelBubble(260, 58, "A")}${labelBubble(196, 126, "B")}${labelBubble(260, 238, "C")}
    `);
  }

  function alveolusGasExchangeSvg() {
    return diagramFrame("Gas exchange", `
      <circle cx="248" cy="142" r="60" class="alveolus"/>
      <path d="M325 82 C405 94, 420 190, 330 206 C292 212, 292 168, 326 162 C355 155, 356 118, 326 112 C292 106, 292 76, 325 82" class="capillary"/>
      <path d="M224 116 C260 112, 288 106, 326 104" class="oxygen-arrow" marker-end="url(#arrow)"/>
      <path d="M330 182 C296 180, 270 176, 232 166" class="co2-arrow" marker-end="url(#arrow)"/>
      <text x="203" y="105" class="small-label">O₂</text><text x="250" y="196" class="small-label">CO₂</text>
      ${labelBubble(248, 76, "A")}${labelBubble(384, 86, "B")}
    `);
  }

  function bloodVesselsSvg() {
    return diagramFrame("Blood vessels", `
      <rect x="68" y="102" width="116" height="74" rx="37" class="artery"/><rect x="82" y="122" width="88" height="34" rx="17" class="vessel-hole"/>
      <rect x="204" y="112" width="116" height="54" rx="27" class="vein"/><rect x="218" y="125" width="88" height="28" rx="14" class="vessel-hole"/><path d="M250 114 l26 26 l-26 26" class="valve"/>
      <path d="M350 90 C380 110, 380 150, 350 170 M376 90 C406 110, 406 150, 376 170 M402 90 C432 110, 432 150, 402 170" class="capillary-lines"/>
      ${labelBubble(126, 82, "A")}${labelBubble(262, 90, "B")}${labelBubble(392, 80, "C")}
    `);
  }

  function reactionTimeRulerSvg() {
    const ticks = Array.from({ length: 11 }, (_, i) => `<line x1="${190 + i * 16}" y1="80" x2="${190 + i * 16}" y2="${i % 5 === 0 ? 122 : 104}"/>`).join("");
    return diagramFrame("Reaction time test", `
      <rect x="174" y="62" width="190" height="72" rx="12" class="ruler"/>${ticks}<text x="210" y="150" class="small-label">ruler drop distance</text>
      <path d="M260 180 c-40 4 -70 20 -85 44 M260 180 c40 4 70 20 85 44" class="hand"/>
      ${labelBubble(274, 54, "A")}${labelBubble(260, 178, "B")}
    `);
  }

  function render() {
    document.body.classList.toggle("calm", state.progress.calm);
    document.body.classList.toggle("fun", !state.progress.calm);
    const card = currentCard();
    const deck = deckCards();
    const labDeck = filteredLabGames();
    const circuitDeck = filteredCircuitGames();
    const examDeck = filteredExamQuestions();

    renderStats();
    renderBadges();
    renderModeChrome(state.mode === "lab" ? labDeck.length : state.mode === "circuit" ? circuitDeck.length : state.mode === "exam" ? examDeck.length : deck.length);
    updateToggleButtons();

    if (state.mode === "lab") {
      renderLabMode(labDeck);
      return;
    }
    if (state.mode === "circuit") {
      renderCircuitMode(circuitDeck);
      return;
    }
    if (state.mode === "exam") {
      renderExamMode(examDeck);
      return;
    }

    els.labPanel.classList.add("hidden");
    els.circuitPanel.classList.add("hidden");
    els.examPanel.classList.add("hidden");
    els.cardMetaBar.classList.remove("hidden");
    els.flashcard.classList.remove("hidden");
    els.buttonRow.classList.remove("hidden");
    els.reviewBox.classList.remove("hidden");

    if (!card) {
      renderEmptyState();
      return;
    }

    els.flashcard.classList.toggle("flipped", state.flipped);
    els.cardUnitBadge.textContent = card.unit;
    els.cardTypeBadge.textContent = card.type;
    renderCardVisual(card);
    els.cardFront.textContent = card.front;
    els.cardBack.textContent = card.back;
    els.cardCue.textContent = card.cue || "No extra cue for this card.";
    els.frontHint.textContent = isQuizMode() ? "Choose an answer below." : "Tap the card to flip it.";
    els.studyTip.textContent = tips[(state.index + state.sessionAnswered) % tips.length];

    const progressPercent = deck.length ? ((state.index + 1) / deck.length) * 100 : 0;
    els.progressFill.style.width = `${progressPercent}%`;

    scheduleCardTextFit();

    if (isQuizMode()) {
      els.quizPanel.classList.remove("hidden");
      els.knowButton.classList.add("hidden");
      els.needPracticeButton.classList.add("hidden");
      buildQuizChoices(card, deck);
    } else {
      els.quizPanel.classList.add("hidden");
      els.knowButton.classList.remove("hidden");
      els.needPracticeButton.classList.remove("hidden");
      els.feedback.textContent = "";
    }
  }

  function renderEmptyState() {
    els.flashcard.classList.remove("flipped");
    els.cardUnitBadge.textContent = "No cards";
    els.cardTypeBadge.textContent = "Filter empty";
    renderCardVisual(null);
    els.cardFront.textContent = "No matching cards found.";
    els.cardBack.textContent = "Try clearing the search or changing the filters.";
    els.cardCue.textContent = "";
    els.frontHint.textContent = "";
    els.progressFill.style.width = "0%";
    els.quizPanel.classList.add("hidden");
    scheduleCardTextFit();
  }

  function renderModeChrome(count) {
    const modeNames = {
      study: ["Flip cards", "Practise the card, then check the answer."],
      quiz: ["Multiple choice", "Pick the best answer. Correct answers earn XP and fun/calm rewards."],
      equations: ["Equation arena", "Memorise equations and science relationships."],
      visual: ["Visual lab", "Practise diagrams, symbols, practical methods, and spot-the-mistake questions."],
      lab: ["Label lab", "Drag or tap labels onto diagrams to prove you can recognise the science parts."],
      circuit: ["Circuit builder", "Tap or drag components into the circuit slots, then test whether your circuit works."],
      exam: ["Exam coach", "Practise mark-scheme answers, practical methods, and explanation questions."],
      weak: ["Weak review", "Only missed cards appear here. Clear them by answering correctly."],
      boss: ["Boss round", "A mixed challenge from every topic. Keep answering to build the biggest streak."],
    };
    const [kicker, title] = modeNames[state.mode] || modeNames.study;
    els.modeKicker.textContent = `${kicker} · ${count} card${count === 1 ? "" : "s"}`;
    els.workspaceTitle.textContent = title;

    els.modeButtons.forEach((button) => {
      button.classList.toggle("active", button.dataset.mode === state.mode);
    });
  }

  function renderStats() {
    els.xpValue.textContent = String(state.progress.xp);
    els.scoreValue.textContent = `${accuracy()}%`;
    els.streakValue.textContent = String(state.progress.currentStreak);
    els.masteredValue.textContent = String(state.progress.mastered.length);

    const level = Math.floor(state.progress.xp / 100) + 1;
    const levelProgress = state.progress.xp % 100;
    els.levelMeter.style.width = `${levelProgress}%`;
    els.levelNote.textContent = `Level ${level}: ${100 - levelProgress} XP until the next level.`;

    const remaining = Math.max(0, 10 - state.sessionAnswered);
    els.missionTitle.textContent = remaining
      ? `Answer ${remaining} more question${remaining === 1 ? "" : "s"}`
      : "Mission complete! Keep going!";
  }

  function renderBadges() {
    const unlocked = badgeRules.filter((rule) => rule.unlocked(state.progress));
    if (!unlocked.length) {
      els.badges.innerHTML = `<span class="badge">🔒 Earn your first badge</span>`;
      return;
    }
    els.badges.innerHTML = unlocked.map((badge) => `<span class="badge">${badge.label}</span>`).join("");
  }

  function updateToggleButtons() {
    els.soundToggle.setAttribute("aria-pressed", String(state.progress.sound));
    els.soundToggle.textContent = state.progress.sound ? "🔊 Sound on" : "🔇 Sound off";
    els.calmToggle.setAttribute("aria-pressed", String(state.progress.calm));
    els.calmToggle.textContent = state.progress.calm ? "☀️ Fun mode" : "🌙 Calm mode";
  }

  function isQuizMode() {
    return ["quiz", "equations", "visual", "boss", "weak"].includes(state.mode);
  }

  function buildQuizChoices(card, deck) {
    if (state.currentChoices.length && els.answerGrid.children.length) return;

    let choices = explicitChoices(card);
    if (!choices.length) {
      const possibleWrong = cards
        .filter((candidate) => candidate.id !== card.id)
        .filter((candidate) => state.mode === "boss" || candidate.unit === card.unit || candidate.type === card.type)
        .map((candidate) => candidate.back);

      const uniqueWrong = [...new Set(possibleWrong)].filter(Boolean);
      shuffleArray(uniqueWrong);
      choices = [card.back, ...uniqueWrong.slice(0, 3)];
    }

    while (choices.length < 4) {
      const fallback = cards[Math.floor(Math.random() * cards.length)]?.back;
      if (fallback && !choices.includes(fallback)) choices.push(fallback);
    }
    choices = [...new Set(choices)].slice(0, 4);
    if (!choices.includes(card.back)) choices[0] = card.back;
    shuffleArray(choices);
    state.currentChoices = choices;

    els.answerGrid.innerHTML = choices
      .map((choice, index) => `
        <button class="answer-button" type="button" data-choice="${escapeHtml(choice)}" data-index="${index}">
          <strong>${index + 1}.</strong> ${escapeHtml(choice)}
        </button>
      `)
      .join("");
    els.feedback.textContent = "";

    els.answerGrid.querySelectorAll(".answer-button").forEach((button) => {
      button.addEventListener("click", () => selectAnswer(button, card));
    });
  }

  function explicitChoices(card) {
    if (!Array.isArray(card.choices)) return [];
    const cleaned = card.choices.map((choice) => String(choice || "").trim()).filter(Boolean);
    if (!cleaned.includes(card.back)) cleaned.unshift(card.back);
    return [...new Set(cleaned)].slice(0, 4);
  }

  function selectAnswer(button, card) {
    if (state.quizLocked) return;
    state.quizLocked = true;

    const selected = button.dataset.choice || "";
    const correct = selected === card.back;
    const buttons = els.answerGrid.querySelectorAll(".answer-button");
    buttons.forEach((answerButton) => {
      answerButton.disabled = true;
      const isCorrect = answerButton.dataset.choice === card.back;
      answerButton.classList.toggle("correct", isCorrect);
      answerButton.classList.toggle("wrong", answerButton === button && !correct);
    });

    state.flipped = true;
    recordAttempt(card, correct);

    if (correct) {
      els.feedback.textContent = state.progress.calm
        ? randomChoice([
            "Correct. Gentle seagull celebration unlocked. 🌊",
            "Nice and steady — that answer is anchored. 🐚",
            "Correct. Calm science brain engaged. 🧠",
            "Well done. Smooth sailing. ⛵",
          ])
        : randomChoice([
            "Correct! Fireworks unlocked! 🎆",
            "Boom! Science brain activated! 🧠",
            "Yes! That answer was electric! ⚡",
            "Brilliant. Add that to your mastered pile! 🌟",
          ]);
      celebrate();
    } else {
      els.feedback.textContent = `Not quite. Correct answer: ${card.back}`;
      playTone("wrong");
      shake(els.flashcard);
    }
    renderStats();
    renderBadges();
    els.flashcard.classList.add("flipped");
  }

  function recordAttempt(card, correct) {
    state.progress.attempted += 1;
    state.sessionAnswered += 1;

    const weakIds = new Set(state.progress.weakIds || []);
    if (correct) {
      if (weakIds.has(card.id)) {
        weakIds.delete(card.id);
        state.progress.weakSolved = (state.progress.weakSolved || 0) + 1;
      }
      state.progress.correct += 1;
      state.sessionCorrect += 1;
      state.progress.currentStreak += 1;
      state.progress.bestStreak = Math.max(state.progress.bestStreak, state.progress.currentStreak);
      const bonus = card.type === "Equation/relationship" ? 15 : 10;
      const streakBonus = Math.min(10, state.progress.currentStreak);
      state.progress.xp += bonus + streakBonus;
      if (!state.progress.mastered.includes(card.id)) {
        state.progress.mastered.push(card.id);
      }
    } else {
      weakIds.add(card.id);
      state.progress.currentStreak = 0;
    }
    state.progress.weakIds = [...weakIds].slice(-220);
    saveProgress();
  }

  function markKnown() {
    const card = currentCard();
    if (!card) return;
    recordAttempt(card, true);
    state.flipped = true;
    celebrate();
    bounce(els.flashcard);
    render();
  }

  function markNeedsPractice() {
    const card = currentCard();
    if (!card) return;
    recordAttempt(card, false);
    playTone("wrong");
    shake(els.flashcard);
    nextCard();
  }

  function flipCard() {
    if (isQuizMode()) return;
    state.flipped = !state.flipped;
    render();
  }

  function setMode(mode) {
    state.mode = mode;
    if (mode === "boss") {
      state.unit = "all";
      state.type = "all";
      els.unitFilter.value = "all";
      els.typeFilter.value = "all";
    }
    if (mode === "equations") {
      state.type = "Equation/relationship";
      els.typeFilter.value = "Equation/relationship";
    }
    if (mode === "visual" || mode === "lab" || mode === "circuit" || mode === "exam" || mode === "weak") {
      state.type = "all";
      els.typeFilter.value = "all";
    }
    if (mode === "lab") {
      state.labIndex = 0;
      state.labAnswers = {};
      state.selectedLabLabel = "";
      state.labLocked = false;
    }
    if (mode === "circuit") {
      state.circuitIndex = 0;
      state.circuitAnswers = {};
      state.selectedCircuitPart = "";
      state.circuitLocked = false;
    }
    if (mode === "exam") {
      state.examIndex = 0;
      resetExamQuestionState();
    }
    rebuildDeck({ shuffle: true });
  }

  function speakCurrentCard() {
    if (state.mode === "exam") {
      const question = currentExamQuestion();
      if (!question || !("speechSynthesis" in window)) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(`${question.title}. ${question.prompt}`);
      utterance.rate = state.progress.calm ? 0.82 : 0.92;
      utterance.pitch = state.progress.calm ? 0.95 : 1.05;
      window.speechSynthesis.speak(utterance);
      return;
    }
    const card = currentCard();
    if (!card || !("speechSynthesis" in window)) return;
    const text = state.flipped ? card.back : card.front;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = state.progress.calm ? 0.82 : 0.92;
    utterance.pitch = state.progress.calm ? 0.95 : 1.05;
    window.speechSynthesis.speak(utterance);
  }

  function celebrate() {
    if (state.progress.calm) {
      playCalmCorrect();
      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        launchCalmRipple();
      }
      return;
    }
    playTone("correct");
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      launchFireworks();
    }
  }

  function getAudioContext() {
    if (!state.progress.sound) return null;
    if (!state.audioContext) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return null;
      state.audioContext = new AudioContext();
    }
    if (state.audioContext.state === "suspended") {
      state.audioContext.resume().catch(() => {});
    }
    return state.audioContext;
  }

  function playTone(kind) {
    const context = getAudioContext();
    if (!context) return;

    const notes = kind === "correct" ? [523.25, 659.25, 783.99] : [220, 185];
    notes.forEach((frequency, index) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = kind === "correct" ? "triangle" : "sawtooth";
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0.0001, context.currentTime + index * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.08, context.currentTime + index * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + index * 0.08 + 0.16);
      oscillator.connect(gain).connect(context.destination);
      oscillator.start(context.currentTime + index * 0.08);
      oscillator.stop(context.currentTime + index * 0.08 + 0.18);
    });
  }


  function playCalmCorrect() {
    const context = getAudioContext();
    if (!context) return;
    playSeagullCall(context, 0);
    playSeagullCall(context, 0.18);
  }

  function playSeagullCall(context, delay) {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "sine";
    const start = context.currentTime + delay;
    oscillator.frequency.setValueAtTime(880, start);
    oscillator.frequency.exponentialRampToValueAtTime(1320, start + 0.09);
    oscillator.frequency.exponentialRampToValueAtTime(740, start + 0.24);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.035, start + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.32);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start(start);
    oscillator.stop(start + 0.34);
  }

  function syncCalmSoundscape() {
    if (state.progress.calm && state.progress.sound) {
      startOceanNoise();
    } else {
      stopOceanNoise();
    }
  }

  function startOceanNoise() {
    const context = getAudioContext();
    if (!context || state.oceanSource) return;

    const seconds = 2.4;
    const buffer = context.createBuffer(1, Math.floor(context.sampleRate * seconds), context.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i += 1) {
      const fade = Math.sin((i / data.length) * Math.PI);
      data[i] = (Math.random() * 2 - 1) * fade * 0.65;
    }

    const source = context.createBufferSource();
    const filter = context.createBiquadFilter();
    const gain = context.createGain();
    source.buffer = buffer;
    source.loop = true;
    filter.type = "lowpass";
    filter.frequency.value = 620;
    gain.gain.value = 0.018;
    source.connect(filter).connect(gain).connect(context.destination);
    source.start();
    state.oceanSource = source;
    state.oceanFilter = filter;
    state.oceanGain = gain;
  }

  function stopOceanNoise() {
    if (!state.oceanSource) return;
    try {
      state.oceanSource.stop();
    } catch {}
    state.oceanSource.disconnect();
    state.oceanSource = null;
    state.oceanFilter = null;
    state.oceanGain = null;
  }

  function launchCalmRipple() {
    const canvas = els.canvas;
    const context = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const ratio = window.devicePixelRatio || 1;
    canvas.width = Math.floor(rect.width * ratio);
    canvas.height = Math.floor(rect.height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);

    const x = rect.width * (0.25 + Math.random() * 0.5);
    const y = rect.height * (0.28 + Math.random() * 0.24);
    for (let p = 0; p < 34; p += 1) {
      const angle = (Math.PI * 2 * p) / 34;
      const speed = 1.2 + Math.random() * 1.8;
      state.fireworks.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed * 0.42,
        life: 64 + Math.random() * 24,
        age: 0,
        size: 2 + Math.random() * 2.5,
        color: `hsla(${185 + Math.random() * 35} 78% 44% / 1)`,
      });
    }
    if (!state.animationFrame) animateFireworks();
  }

  function launchFireworks() {
    const canvas = els.canvas;
    const context = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const ratio = window.devicePixelRatio || 1;
    canvas.width = Math.floor(rect.width * ratio);
    canvas.height = Math.floor(rect.height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);

    const bursts = 4;
    for (let i = 0; i < bursts; i += 1) {
      const x = rect.width * (0.18 + Math.random() * 0.64);
      const y = rect.height * (0.18 + Math.random() * 0.34);
      const hue = Math.floor(Math.random() * 360);
      for (let p = 0; p < 46; p += 1) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 5;
        state.fireworks.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 58 + Math.random() * 22,
          age: 0,
          size: 2 + Math.random() * 3,
          color: `hsl(${(hue + Math.random() * 80) % 360} 95% 58%)`,
        });
      }
    }

    if (!state.animationFrame) animateFireworks();
  }

  function animateFireworks() {
    const canvas = els.canvas;
    const context = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    context.clearRect(0, 0, rect.width, rect.height);

    state.fireworks = state.fireworks.filter((particle) => particle.age < particle.life);
    state.fireworks.forEach((particle) => {
      particle.age += 1;
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vy += 0.045;
      particle.vx *= 0.985;
      particle.vy *= 0.985;
      const alpha = Math.max(0, 1 - particle.age / particle.life);
      context.globalAlpha = alpha;
      context.fillStyle = particle.color;
      context.beginPath();
      context.arc(particle.x, particle.y, particle.size * alpha, 0, Math.PI * 2);
      context.fill();
    });
    context.globalAlpha = 1;

    if (state.fireworks.length) {
      state.animationFrame = requestAnimationFrame(animateFireworks);
    } else {
      context.clearRect(0, 0, rect.width, rect.height);
      cancelAnimationFrame(state.animationFrame);
      state.animationFrame = null;
    }
  }


  function scheduleCardTextFit() {
    if (state.fitFrame) cancelAnimationFrame(state.fitFrame);
    state.fitFrame = requestAnimationFrame(() => {
      fitTextToCard(els.cardFront);
      fitTextToCard(els.cardBack);
      state.fitFrame = null;
    });
  }

  function fitTextToCard(textElement) {
    const face = textElement?.closest(".card-face");
    if (!face) return;
    textElement.style.fontSize = "";
    textElement.style.lineHeight = "";

    const faceStyle = window.getComputedStyle(face);
    const paddingX = parseFloat(faceStyle.paddingLeft) + parseFloat(faceStyle.paddingRight);
    const paddingY = parseFloat(faceStyle.paddingTop) + parseFloat(faceStyle.paddingBottom);
    const availableWidth = Math.max(160, face.clientWidth - paddingX);
    const siblingHeight = Array.from(face.children)
      .filter((child) => child !== textElement)
      .reduce((sum, child) => sum + child.scrollHeight + 16, 0);
    const availableHeight = Math.max(110, face.clientHeight - paddingY - siblingHeight);

    let size = parseFloat(window.getComputedStyle(textElement).fontSize) || 48;
    const max = size;
    const min = window.innerWidth < 680 ? 22 : 26;
    textElement.style.fontSize = `${max}px`;
    textElement.style.lineHeight = "1.05";

    let guard = 0;
    while (
      guard < 40 &&
      size > min &&
      (textElement.scrollWidth > availableWidth || textElement.scrollHeight > availableHeight)
    ) {
      size -= 2;
      textElement.style.fontSize = `${size}px`;
      guard += 1;
    }

    if (size <= 30) {
      textElement.style.lineHeight = "1.14";
    }
  }

  function bounce(element) {
    element.classList.remove("pop");
    void element.offsetWidth;
    element.classList.add("pop");
  }

  function shake(element) {
    element.classList.remove("shake");
    void element.offsetWidth;
    element.classList.add("shake");
  }

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function randomChoice(values) {
    return values[Math.floor(Math.random() * values.length)];
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }


  function filteredLabGames() {
    const search = state.search.trim().toLowerCase();
    return interactiveLabGames.filter((game) => {
      const unitMatch = state.unit === "all" || game.unit === state.unit;
      const haystack = `${game.unit} ${game.title} ${game.brief} ${game.labels.join(" ")}`.toLowerCase();
      const searchMatch = !search || haystack.includes(search);
      return unitMatch && searchMatch;
    });
  }

  function currentLabGame(labDeck = filteredLabGames()) {
    if (!labDeck.length) return null;
    if (state.labIndex >= labDeck.length) state.labIndex = 0;
    return labDeck[state.labIndex];
  }

  function renderLabMode(labDeck = filteredLabGames()) {
    els.quizPanel.classList.add("hidden");
    els.circuitPanel.classList.add("hidden");
    els.examPanel.classList.add("hidden");
    els.cardMetaBar.classList.remove("hidden");
    els.flashcard.classList.add("hidden");
    els.buttonRow.classList.add("hidden");
    els.reviewBox.classList.remove("hidden");
    els.labPanel.classList.remove("hidden");
    els.feedback.textContent = "";

    const game = currentLabGame(labDeck);
    els.cardUnitBadge.textContent = game?.unit || "No lab games";
    els.cardTypeBadge.textContent = "Interactive label lab";
    els.studyTip.textContent = "Tap a label, then tap a target. On desktop you can also drag labels onto targets.";

    const progressPercent = labDeck.length ? ((state.labIndex + 1) / labDeck.length) * 100 : 0;
    els.progressFill.style.width = `${progressPercent}%`;

    if (!game) {
      els.labPanel.innerHTML = `
        <div class="lab-card">
          <h3>No matching label lab games found.</h3>
          <p>Try clearing the search or changing the topic filter.</p>
        </div>
      `;
      return;
    }

    els.labPanel.innerHTML = `
      <div class="lab-card" data-game-id="${escapeHtml(game.id)}">
        <div class="lab-head">
          <div>
            <p class="panel-kicker">${escapeHtml(game.unit)}</p>
            <h3>${escapeHtml(game.title)}</h3>
            <p>${escapeHtml(game.brief)}</p>
          </div>
          <div class="lab-counter">${state.labIndex + 1}/${labDeck.length}</div>
        </div>
        <div class="lab-layout">
          <div class="lab-stage" aria-label="Interactive diagram">
            <div class="lab-diagram">${renderLabDiagram(game.diagram)}</div>
            ${game.targets.map((target) => renderLabTarget(target)).join("")}
          </div>
          <div class="lab-bank" aria-label="Label bank">
            <h4>Labels</h4>
            ${game.labels.map((label) => renderLabLabel(label, game)).join("")}
            <button class="ghost-button lab-clear" type="button">Clear labels</button>
          </div>
        </div>
        <p class="lab-feedback" aria-live="polite">${state.selectedLabLabel ? `Selected: ${escapeHtml(state.selectedLabLabel)}` : "Choose a label to start."}</p>
        <div class="lab-actions">
          <button class="primary-button lab-check" type="button">Check labels</button>
          <button class="secondary-button lab-next" type="button">Next lab</button>
        </div>
      </div>
    `;
    wireLabPanel(game);
  }

  function renderLabTarget(target) {
    const placed = state.labAnswers[target.id] || "";
    return `
      <button class="lab-target ${placed ? "filled" : ""}" type="button" data-target-id="${escapeHtml(target.id)}" style="left:${target.x}%;top:${target.y}%">
        <span class="target-dot" aria-hidden="true"></span>
        <span class="target-text">${placed ? escapeHtml(placed) : "Drop label"}</span>
      </button>
    `;
  }

  function renderLabLabel(label, game) {
    const used = Object.values(state.labAnswers).includes(label);
    const selected = state.selectedLabLabel === label;
    return `
      <button class="lab-label ${used ? "used" : ""} ${selected ? "selected" : ""}" type="button" draggable="true" data-label="${escapeHtml(label)}" aria-pressed="${selected}">
        ${escapeHtml(label)}
      </button>
    `;
  }

  function wireLabPanel(game) {
    const feedback = els.labPanel.querySelector(".lab-feedback");
    els.labPanel.querySelectorAll(".lab-label").forEach((button) => {
      button.addEventListener("click", () => {
        state.selectedLabLabel = button.dataset.label || "";
        state.labLocked = false;
        renderLabMode();
      });
      button.addEventListener("dragstart", (event) => {
        const label = button.dataset.label || "";
        state.selectedLabLabel = label;
        event.dataTransfer.setData("text/plain", label);
        event.dataTransfer.effectAllowed = "move";
      });
    });

    els.labPanel.querySelectorAll(".lab-target").forEach((targetButton) => {
      targetButton.addEventListener("click", () => {
        const targetId = targetButton.dataset.targetId || "";
        if (!state.selectedLabLabel) {
          feedback.textContent = "Choose a label first, then tap a target.";
          return;
        }
        placeLabLabel(targetId, state.selectedLabLabel, game);
      });
      targetButton.addEventListener("dragover", (event) => {
        event.preventDefault();
        targetButton.classList.add("drag-over");
      });
      targetButton.addEventListener("dragleave", () => targetButton.classList.remove("drag-over"));
      targetButton.addEventListener("drop", (event) => {
        event.preventDefault();
        targetButton.classList.remove("drag-over");
        const label = event.dataTransfer.getData("text/plain") || state.selectedLabLabel;
        placeLabLabel(targetButton.dataset.targetId || "", label, game);
      });
    });

    els.labPanel.querySelector(".lab-check")?.addEventListener("click", () => checkLabGame(game));
    els.labPanel.querySelector(".lab-next")?.addEventListener("click", nextLabGame);
    els.labPanel.querySelector(".lab-clear")?.addEventListener("click", () => {
      state.labAnswers = {};
      state.selectedLabLabel = "";
      state.labLocked = false;
      renderLabMode();
    });
  }

  function placeLabLabel(targetId, label, game) {
    if (!targetId || !label) return;
    Object.keys(state.labAnswers).forEach((key) => {
      if (state.labAnswers[key] === label) delete state.labAnswers[key];
    });
    state.labAnswers[targetId] = label;
    state.selectedLabLabel = "";
    state.labLocked = false;
    renderLabMode();
  }

  function checkLabGame(game) {
    if (state.labLocked) return;
    const feedback = els.labPanel.querySelector(".lab-feedback");
    const total = game.targets.length;
    const placed = game.targets.filter((target) => state.labAnswers[target.id]).length;
    if (placed < total) {
      feedback.textContent = `You have placed ${placed}/${total} labels. Finish the diagram, then check again.`;
      return;
    }

    const wrongTargets = game.targets.filter((target) => state.labAnswers[target.id] !== target.label);
    const correct = wrongTargets.length === 0;
    state.labLocked = true;
    els.labPanel.querySelectorAll(".lab-target").forEach((button) => {
      const target = game.targets.find((item) => item.id === button.dataset.targetId);
      const isRight = target && state.labAnswers[target.id] === target.label;
      button.classList.toggle("correct", Boolean(isRight));
      button.classList.toggle("wrong", !isRight);
    });

    recordAttempt({ id: game.id, type: "Interactive label lab" }, correct);
    if (correct) {
      state.progress.labWins = (state.progress.labWins || 0) + 1;
      saveProgress();
      feedback.textContent = state.progress.calm
        ? "Perfect labelling. Calm, careful, correct. 🌊"
        : "Perfect labelling! Diagram boss defeated. 🧩🎆";
      celebrate();
    } else {
      feedback.textContent = `Close. ${wrongTargets.length} label${wrongTargets.length === 1 ? "" : "s"} need another look.`;
      playTone("wrong");
      shake(els.labPanel.querySelector(".lab-card"));
    }
    renderStats();
    renderBadges();
  }

  function nextLabGame() {
    const labDeck = filteredLabGames();
    if (!labDeck.length) return;
    state.labIndex = (state.labIndex + 1) % labDeck.length;
    state.labAnswers = {};
    state.selectedLabLabel = "";
    state.labLocked = false;
    render();
  }

  function renderLabDiagram(kind) {
    const diagrams = {
      skeleton: labSkeletonSvg,
      arm: labArmSvg,
      lungs: labLungsSvg,
      symbols: labSymbolsSvg,
      "series-parallel": labSeriesParallelSvg,
      indicators: labIndicatorsSvg,
      "neutralisation-order": labNeutralisationOrderSvg,
    };
    return (diagrams[kind] || labSkeletonSvg)();
  }

  function labSvg(title, inner, viewBox = "0 0 640 360") {
    return `
      <svg class="interactive-diagram" viewBox="${viewBox}" role="img" aria-label="${escapeHtml(title)}">
        <rect x="12" y="12" width="616" height="336" rx="30" class="lab-bg"/>
        ${inner}
      </svg>
    `;
  }

  function labSkeletonSvg() {
    return labSvg("Skeleton diagram", `
      <circle cx="320" cy="64" r="28" class="lab-bone"/><line x1="320" y1="92" x2="320" y2="212" class="lab-bone-line"/>
      <path d="M258 130 C288 104 352 104 382 130 M260 160 C292 184 348 184 380 160" class="lab-bone-line"/>
      <path d="M278 218 C300 198 340 198 362 218 C350 240 290 240 278 218Z" class="lab-bone"/>
      <line x1="280" y1="138" x2="214" y2="210" class="lab-bone-line"/><line x1="360" y1="138" x2="426" y2="210" class="lab-bone-line"/>
      <line x1="300" y1="238" x2="270" y2="316" class="lab-bone-line"/><line x1="340" y1="238" x2="372" y2="316" class="lab-bone-line"/>
    `);
  }

  function labArmSvg() {
    return labSvg("Elbow joint and muscles", `
      <line x1="160" y1="190" x2="320" y2="190" class="lab-bone-line"/><line x1="322" y1="192" x2="492" y2="260" class="lab-bone-line"/>
      <circle cx="320" cy="190" r="22" class="lab-joint"/>
      <path d="M162 150 C225 95 300 120 332 170" class="lab-muscle-a"/>
      <path d="M160 222 C230 254 292 242 326 208" class="lab-muscle-b"/>
      <text x="222" y="330" class="lab-caption">Muscles work in pairs: one contracts while the other relaxes.</text>
    `);
  }

  function labLungsSvg() {
    return labSvg("Breathing system", `
      <path d="M320 64 L320 148 M320 120 C278 136 250 184 252 238 M320 120 C362 136 390 184 388 238" class="lab-airway"/>
      <path d="M294 142 C224 152 204 274 292 286 C318 242 318 188 294 142Z" class="lab-lung"/>
      <path d="M346 142 C416 152 436 274 348 286 C322 242 322 188 346 142Z" class="lab-lung"/>
      <path d="M204 288 Q320 332 436 288" class="lab-diaphragm"/>
      <path d="M238 114 C166 176 176 282 242 320 M402 114 C474 176 464 282 398 320" class="lab-ribs"/>
      <path d="M320 28 v36" class="lab-arrow" marker-end="url(#labArrow)"/>
      <defs><marker id="labArrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="currentColor"/></marker></defs>
    `);
  }

  function labSymbolsSvg() {
    const symbol = (x, label, inner) => `<g transform="translate(${x},150)"><rect x="-46" y="-42" width="92" height="84" rx="18" class="symbol-tile"/>${inner}</g>`;
    return labSvg("Circuit symbols", `
      ${symbol(116, "cell", `<line x1="-28" y1="0" x2="-6" y2="0" class="wire"/><line x1="-6" y1="-26" x2="-6" y2="26" class="wire"/><line x1="12" y1="-16" x2="12" y2="16" class="wire"/><line x1="12" y1="0" x2="32" y2="0" class="wire"/>`)}
      ${symbol(218, "lamp", `<circle cx="0" cy="0" r="25" class="wire-fill"/><path d="M-16 -16 L16 16 M16 -16 L-16 16" class="wire"/>`)}
      ${symbol(320, "switch", `<line x1="-30" y1="0" x2="-6" y2="0" class="wire"/><circle cx="-4" cy="0" r="4" class="wire-fill"/><line x1="2" y1="-6" x2="30" y2="-26" class="wire"/><circle cx="34" cy="0" r="4" class="wire-fill"/>`)}
      ${symbol(422, "ammeter", `<circle cx="0" cy="0" r="27" class="wire-fill"/><text x="0" y="9" text-anchor="middle" class="meter-letter">A</text>`)}
      ${symbol(524, "voltmeter", `<circle cx="0" cy="0" r="27" class="wire-fill"/><text x="0" y="9" text-anchor="middle" class="meter-letter">V</text>`)}
    `);
  }

  function labSeriesParallelSvg() {
    return labSvg("Series and parallel circuits", `
      <text x="176" y="56" text-anchor="middle" class="lab-title">A</text><text x="464" y="56" text-anchor="middle" class="lab-title">B</text>
      <rect x="92" y="96" width="168" height="150" rx="20" class="wire-box"/><circle cx="150" cy="172" r="18" class="wire-fill"/><circle cx="205" cy="172" r="18" class="wire-fill"/>
      <rect x="380" y="96" width="168" height="150" rx="20" class="wire-box"/><line x1="380" y1="150" x2="548" y2="150" class="wire"/><line x1="380" y1="205" x2="548" y2="205" class="wire"/><circle cx="466" cy="150" r="17" class="wire-fill"/><circle cx="466" cy="205" r="17" class="wire-fill"/>
      <text x="320" y="314" text-anchor="middle" class="lab-caption">Circuit A has one path. Circuit B has branches.</text>
    `);
  }

  function labIndicatorsSvg() {
    return labSvg("Indicators and pH", `
      <defs><linearGradient id="phGradient" x1="0" x2="1"><stop offset="0" stop-color="#ef4444"/><stop offset="0.5" stop-color="#22c55e"/><stop offset="1" stop-color="#3b82f6"/></linearGradient></defs>
      <rect x="108" y="116" width="70" height="104" rx="12" class="beaker"/><rect x="118" y="168" width="50" height="42" rx="8" class="acid-fill"/>
      <rect x="285" y="116" width="70" height="104" rx="12" class="beaker"/><rect x="295" y="168" width="50" height="42" rx="8" class="neutral-fill"/>
      <rect x="462" y="116" width="70" height="104" rx="12" class="beaker"/><rect x="472" y="168" width="50" height="42" rx="8" class="alkali-fill"/>
      <rect x="128" y="250" width="384" height="28" rx="14" class="ph-track"/><text x="130" y="306" class="lab-caption">pH 1</text><text x="315" y="306" class="lab-caption">pH 7</text><text x="484" y="306" class="lab-caption">pH 14</text>
    `);
  }

  function labNeutralisationOrderSvg() {
    const step = (x, n) => `<g transform="translate(${x},164)"><circle r="34" class="step-node"/><text y="9" text-anchor="middle" class="meter-letter">${n}</text></g>`;
    return labSvg("Neutralisation method order", `
      <line x1="94" y1="164" x2="546" y2="164" class="lab-bone-line"/>${step(94,1)}${step(207,2)}${step(320,3)}${step(433,4)}${step(546,5)}
      <text x="320" y="276" text-anchor="middle" class="lab-caption">Make a neutral solution first, then evaporate carefully to obtain crystals.</text>
    `);
  }

  function filteredCircuitGames() {
    const search = state.search.trim().toLowerCase();
    return circuitBuilderGames.filter((game) => {
      const unitMatch = state.unit === "all" || game.unit === state.unit;
      const haystack = `${game.unit} ${game.title} ${game.brief} ${game.labels.join(" ")} ${game.success}`.toLowerCase();
      const searchMatch = !search || haystack.includes(search);
      return unitMatch && searchMatch;
    });
  }

  function currentCircuitGame(circuitDeck = filteredCircuitGames()) {
    if (!circuitDeck.length) return null;
    if (state.circuitIndex >= circuitDeck.length) state.circuitIndex = 0;
    return circuitDeck[state.circuitIndex];
  }

  function renderCircuitMode(circuitDeck = filteredCircuitGames()) {
    els.quizPanel.classList.add("hidden");
    els.labPanel.classList.add("hidden");
    els.examPanel.classList.add("hidden");
    els.cardMetaBar.classList.remove("hidden");
    els.flashcard.classList.add("hidden");
    els.buttonRow.classList.add("hidden");
    els.reviewBox.classList.remove("hidden");
    els.circuitPanel.classList.remove("hidden");
    els.feedback.textContent = "";

    const game = currentCircuitGame(circuitDeck);
    els.cardUnitBadge.textContent = game?.unit || "No circuit games";
    els.cardTypeBadge.textContent = "Interactive circuit builder";
    els.studyTip.textContent = "Tap a component, then tap an empty circuit slot. On desktop you can also drag parts into place.";

    const progressPercent = circuitDeck.length ? ((state.circuitIndex + 1) / circuitDeck.length) * 100 : 0;
    els.progressFill.style.width = `${progressPercent}%`;

    if (!game) {
      els.circuitPanel.innerHTML = `
        <div class="circuit-card">
          <h3>No matching circuit builder games found.</h3>
          <p>Try clearing the search or choosing Current electricity.</p>
        </div>
      `;
      return;
    }

    els.circuitPanel.innerHTML = `
      <div class="circuit-card" data-game-id="${escapeHtml(game.id)}">
        <div class="lab-head">
          <div>
            <p class="panel-kicker">${escapeHtml(game.unit)}</p>
            <h3>${escapeHtml(game.title)}</h3>
            <p>${escapeHtml(game.brief)}</p>
          </div>
          <div class="lab-counter">${state.circuitIndex + 1}/${circuitDeck.length}</div>
        </div>
        <div class="circuit-layout">
          <div class="circuit-stage" aria-label="Circuit builder board">
            <div class="circuit-diagram">${renderCircuitBuilderDiagram(game.layout)}</div>
            ${game.slots.map((slot) => renderCircuitSlot(slot)).join("")}
          </div>
          <div class="circuit-bank" aria-label="Circuit component bank">
            <h4>Components</h4>
            ${game.labels.map((label, index) => renderCircuitPart(label, index)).join("")}
            <button class="ghost-button circuit-clear" type="button">Clear circuit</button>
          </div>
        </div>
        <p class="circuit-feedback" aria-live="polite">${state.selectedCircuitPart ? `Selected: ${escapeHtml(state.selectedCircuitPart)}` : "Choose a component to start."}</p>
        <div class="lab-actions">
          <button class="primary-button circuit-check" type="button">Test circuit</button>
          <button class="secondary-button circuit-next" type="button">Next build</button>
        </div>
      </div>
    `;
    wireCircuitPanel(game);
  }

  function renderCircuitSlot(slot) {
    const placed = state.circuitAnswers[slot.id] || "";
    return `
      <button class="circuit-slot ${placed ? "filled" : ""}" type="button" data-slot-id="${escapeHtml(slot.id)}" style="left:${slot.x}%;top:${slot.y}%">
        <span class="component-icon" aria-hidden="true">${placed ? circuitPartIcon(placed) : "＋"}</span>
        <span class="component-text">${placed ? escapeHtml(placed) : escapeHtml(slot.label)}</span>
      </button>
    `;
  }

  function renderCircuitPart(label, index) {
    const usedCount = Object.values(state.circuitAnswers).filter((value) => value === label).length;
    const selected = state.selectedCircuitPart === label;
    return `
      <button class="circuit-part ${selected ? "selected" : ""} ${usedCount ? "used" : ""}" type="button" draggable="true" data-part="${escapeHtml(label)}" data-index="${index}" aria-pressed="${selected}">
        <span>${circuitPartIcon(label)}</span>
        <strong>${escapeHtml(label)}</strong>
      </button>
    `;
  }

  function circuitPartIcon(part) {
    const icons = {
      cell: "🔋",
      lamp: "💡",
      "closed switch": "✅",
      "open switch": "↗️",
      ammeter: "A",
      voltmeter: "V",
      wire: "─",
    };
    return icons[part] || "⚙️";
  }

  function wireCircuitPanel(game) {
    const feedback = els.circuitPanel.querySelector(".circuit-feedback");
    els.circuitPanel.querySelectorAll(".circuit-part").forEach((button) => {
      button.addEventListener("click", () => {
        if (state.circuitLocked) {
          feedback.textContent = "This circuit already works. Hit Next build for a fresh challenge.";
          return;
        }
        state.selectedCircuitPart = button.dataset.part || "";
        renderCircuitMode();
      });
      button.addEventListener("dragstart", (event) => {
        if (state.circuitLocked) {
          event.preventDefault();
          feedback.textContent = "This circuit already works. Hit Next build for a fresh challenge.";
          return;
        }
        const part = button.dataset.part || "";
        state.selectedCircuitPart = part;
        event.dataTransfer.setData("text/plain", part);
        event.dataTransfer.effectAllowed = "move";
      });
    });

    els.circuitPanel.querySelectorAll(".circuit-slot").forEach((slotButton) => {
      slotButton.addEventListener("click", () => {
        const slotId = slotButton.dataset.slotId || "";
        if (!state.selectedCircuitPart) {
          feedback.textContent = "Choose a component first, then tap a circuit slot.";
          return;
        }
        placeCircuitPart(slotId, state.selectedCircuitPart);
      });
      slotButton.addEventListener("dragover", (event) => {
        event.preventDefault();
        slotButton.classList.add("drag-over");
      });
      slotButton.addEventListener("dragleave", () => slotButton.classList.remove("drag-over"));
      slotButton.addEventListener("drop", (event) => {
        event.preventDefault();
        slotButton.classList.remove("drag-over");
        const part = event.dataTransfer.getData("text/plain") || state.selectedCircuitPart;
        placeCircuitPart(slotButton.dataset.slotId || "", part);
      });
    });

    els.circuitPanel.querySelector(".circuit-check")?.addEventListener("click", () => checkCircuitGame(game));
    els.circuitPanel.querySelector(".circuit-next")?.addEventListener("click", nextCircuitGame);
    els.circuitPanel.querySelector(".circuit-clear")?.addEventListener("click", () => {
      state.circuitAnswers = {};
      state.selectedCircuitPart = "";
      state.circuitLocked = false;
      renderCircuitMode();
    });
  }

  function placeCircuitPart(slotId, part) {
    if (!slotId || !part || state.circuitLocked) return;
    state.circuitAnswers[slotId] = part;
    state.selectedCircuitPart = "";
    renderCircuitMode();
  }

  function checkCircuitGame(game) {
    if (state.circuitLocked) return;
    const feedback = els.circuitPanel.querySelector(".circuit-feedback");
    const total = game.slots.length;
    const placed = game.slots.filter((slot) => state.circuitAnswers[slot.id]).length;
    if (placed < total) {
      feedback.textContent = `You have placed ${placed}/${total} components. Complete every slot, then test the circuit.`;
      return;
    }

    const wrongSlots = game.slots.filter((slot) => state.circuitAnswers[slot.id] !== slot.answer);
    const correct = wrongSlots.length === 0;
    els.circuitPanel.querySelectorAll(".circuit-slot").forEach((button) => {
      const slot = game.slots.find((item) => item.id === button.dataset.slotId);
      const isRight = slot && state.circuitAnswers[slot.id] === slot.answer;
      button.classList.toggle("correct", Boolean(isRight));
      button.classList.toggle("wrong", !isRight);
    });

    recordAttempt({ id: game.id, type: "Circuit builder" }, correct);
    if (correct) {
      state.circuitLocked = true;
      state.progress.circuitWins = (state.progress.circuitWins || 0) + 1;
      saveProgress();
      feedback.textContent = state.progress.calm
        ? `Circuit works. ${game.success} 🌊`
        : `Circuit powered up! ${game.success} ⚡🎆`;
      celebrate();
    } else {
      feedback.textContent = `Not powered yet. ${wrongSlots.length} component${wrongSlots.length === 1 ? "" : "s"} need moving.`;
      playTone("wrong");
      shake(els.circuitPanel.querySelector(".circuit-card"));
    }
    renderStats();
    renderBadges();
  }

  function nextCircuitGame() {
    const circuitDeck = filteredCircuitGames();
    if (!circuitDeck.length) return;
    state.circuitIndex = (state.circuitIndex + 1) % circuitDeck.length;
    state.circuitAnswers = {};
    state.selectedCircuitPart = "";
    state.circuitLocked = false;
    render();
  }

  function renderCircuitBuilderDiagram(layout) {
    const diagrams = {
      "simple-loop": circuitBuilderSimpleLoop,
      "meter-loop": circuitBuilderMeterLoop,
      "parallel-meter": circuitBuilderParallelMeter,
      "series-two-lamps": circuitBuilderSeriesTwoLamps,
      "parallel-two-lamps": circuitBuilderParallelTwoLamps,
      "and-switches": circuitBuilderAndSwitches,
      "or-switches": circuitBuilderOrSwitches,
    };
    return (diagrams[layout] || circuitBuilderSimpleLoop)();
  }

  function circuitBuilderSvg(title, inner, viewBox = "0 0 720 380") {
    return `
      <svg class="circuit-builder-svg" viewBox="${viewBox}" role="img" aria-label="${escapeHtml(title)}">
        <rect x="14" y="14" width="692" height="352" rx="34" class="builder-bg"/>
        <text x="36" y="48" class="builder-title">${escapeHtml(title)}</text>
        ${inner}
      </svg>
    `;
  }

  function circuitBuilderSimpleLoop() {
    return circuitBuilderSvg("Simple circuit loop", `
      <path d="M132 214 H220 M330 214 H390 M500 214 H590 V104 H360 M260 104 H132 Z" class="builder-wire"/>
      <text x="360" y="336" text-anchor="middle" class="builder-caption">A complete circuit needs a source, a closed path, and a component such as a lamp.</text>
    `);
  }

  function circuitBuilderMeterLoop() {
    return circuitBuilderSvg("Current measurement circuit", `
      <path d="M116 220 H204 M310 220 H444 M560 220 H612 V104 H430 M350 104 H246 M150 104 H116 Z" class="builder-wire"/>
      <text x="360" y="336" text-anchor="middle" class="builder-caption">Current is measured in series.</text>
    `);
  }

  function circuitBuilderParallelMeter() {
    return circuitBuilderSvg("Voltage measurement circuit", `
      <path d="M116 220 H310 M470 220 H612 V104 H116 Z" class="builder-wire"/>
      <path d="M376 170 V286 H500 V170" class="builder-wire branch-wire"/>
      <text x="360" y="336" text-anchor="middle" class="builder-caption">Voltage is measured across a component on a parallel branch.</text>
    `);
  }

  function circuitBuilderSeriesTwoLamps() {
    return circuitBuilderSvg("Two lamps in series", `
      <path d="M116 220 H204 M300 220 H390 M496 220 H612 V104 H116 Z" class="builder-wire"/>
      <text x="360" y="336" text-anchor="middle" class="builder-caption">Series means one loop and one current path.</text>
    `);
  }

  function circuitBuilderParallelTwoLamps() {
    return circuitBuilderSvg("Two lamps in parallel", `
      <path d="M116 220 H252 M522 220 H612 V104 H116 Z" class="builder-wire"/>
      <path d="M280 158 H504 M280 278 H504" class="builder-wire branch-wire"/>
      <path d="M280 158 V278 M504 158 V278" class="builder-wire branch-wire"/>
      <text x="360" y="336" text-anchor="middle" class="builder-caption">Parallel means branches and more than one path.</text>
    `);
  }

  function circuitBuilderAndSwitches() {
    return circuitBuilderSvg("AND switch circuit", `
      <path d="M116 220 H204 M292 220 H368 M456 220 H612 V104 H116 Z" class="builder-wire"/>
      <text x="360" y="336" text-anchor="middle" class="builder-caption">AND: both series switches must be closed.</text>
    `);
  }

  function circuitBuilderOrSwitches() {
    return circuitBuilderSvg("OR switch circuit", `
      <path d="M116 220 H252 M522 220 H612 V104 H116 Z" class="builder-wire"/>
      <path d="M280 158 H504 M280 278 H504" class="builder-wire branch-wire"/>
      <path d="M280 158 V278 M504 158 V278" class="builder-wire branch-wire"/>
      <text x="360" y="336" text-anchor="middle" class="builder-caption">OR: either parallel branch can complete the circuit.</text>
    `);
  }



  function filteredExamQuestions() {
    const search = state.search.trim().toLowerCase();
    return examTrainerQuestions.filter((question) => {
      const unitMatch = state.unit === "all" || question.unit === state.unit;
      const haystack = `${question.unit} ${question.title} ${question.prompt} ${question.answer} ${question.cue || ""}`.toLowerCase();
      const searchMatch = !search || haystack.includes(search);
      return unitMatch && searchMatch;
    });
  }

  function currentExamQuestion() {
    const deck = filteredExamQuestions();
    if (!deck.length) return null;
    return deck[state.examIndex % deck.length] || null;
  }

  function resetExamQuestionState() {
    state.examRevealed = false;
    state.examLocked = false;
    state.examResponse = "";
  }

  function renderExamMode(examDeck = filteredExamQuestions()) {
    els.examPanel.classList.remove("hidden");
    els.labPanel.classList.add("hidden");
    els.circuitPanel.classList.add("hidden");
    els.flashcard.classList.add("hidden");
    els.quizPanel.classList.add("hidden");
    els.buttonRow.classList.add("hidden");
    els.reviewBox.classList.remove("hidden");
    els.cardMetaBar.classList.add("hidden");
    els.studyTip.textContent = "Exam coach is about mark-scheme language: answer, reveal, compare, then self-mark honestly.";

    if (!examDeck.length) {
      els.progressFill.style.width = "0%";
      els.examPanel.innerHTML = `
        <div class="exam-card">
          <p class="panel-kicker">Exam coach</p>
          <h3>No exam questions match these filters.</h3>
          <p>Clear the search box or choose another topic.</p>
        </div>
      `;
      return;
    }

    const question = examDeck[state.examIndex % examDeck.length];
    const progressPercent = examDeck.length ? ((state.examIndex + 1) / examDeck.length) * 100 : 0;
    els.progressFill.style.width = `${progressPercent}%`;
    const isChoice = Array.isArray(question.choices) && question.choices.length;
    const hits = keywordHits(question, state.examResponse);
    const visualHtml = question.visual ? renderVisual(question.visual) : "";

    els.examPanel.innerHTML = `
      <div class="exam-card ${state.examLocked ? "locked" : ""}">
        <div class="exam-topline">
          <span class="unit-badge">${escapeHtml(question.unit)}</span>
          <span class="type-badge">${isChoice ? "Auto-mark" : "Written answer"}</span>
          <span class="marks-badge">${question.marks} mark${question.marks === 1 ? "" : "s"}</span>
        </div>
        <div class="exam-grid">
          <div class="exam-main">
            <p class="panel-kicker">Question ${state.examIndex + 1} of ${examDeck.length}</p>
            <h3>${escapeHtml(question.title)}</h3>
            <p class="exam-prompt">${escapeHtml(question.prompt)}</p>
            ${visualHtml ? `<div class="exam-visual">${visualHtml}</div>` : ""}
            ${isChoice ? renderExamChoices(question) : renderExamWritten(question, hits)}
          </div>
          <aside class="exam-mark-scheme ${state.examRevealed || state.examLocked ? "visible" : ""}">
            <h4>Mark scheme</h4>
            <p>${escapeHtml(question.answer)}</p>
            <h4>Keywords to look for</h4>
            <div class="keyword-list">
              ${(question.keywords || []).map((keyword) => `<span class="keyword ${hits.includes(keyword.toLowerCase()) ? "hit" : ""}">${escapeHtml(keyword)}</span>`).join("")}
            </div>
            <p class="exam-cue">${escapeHtml(question.cue || "Use precise science words and link cause to effect.")}</p>
          </aside>
        </div>
        <div class="exam-actions">
          ${isChoice ? "" : `<button class="primary-button exam-reveal" type="button">Reveal mark scheme</button>`}
          ${!isChoice ? `<button class="secondary-button exam-self-good" type="button">I got the key points</button><button class="danger-soft exam-self-practice" type="button">Need more practice</button>` : ""}
          <button class="secondary-button exam-next" type="button">Next exam question</button>
        </div>
        <p class="exam-feedback" aria-live="polite">${examFeedbackText(question, hits)}</p>
      </div>
    `;
    wireExamPanel(question);
  }

  function renderExamChoices(question) {
    const choices = [...question.choices];
    shuffleArray(choices);
    return `
      <div class="exam-choice-grid">
        ${choices.map((choice, index) => `
          <button class="answer-button exam-choice" type="button" data-exam-choice="${escapeHtml(choice)}" data-exam-index="${index}">
            <strong>${index + 1}.</strong> ${escapeHtml(choice)}
          </button>
        `).join("")}
      </div>
    `;
  }

  function renderExamWritten(question, hits) {
    return `
      <label class="exam-answer-label" for="examResponse">Your answer</label>
      <textarea id="examResponse" class="exam-response" rows="7" placeholder="Type a short exam-style answer here. Then reveal the mark scheme and self-mark honestly.">${escapeHtml(state.examResponse)}</textarea>
      <div class="keyword-meter" aria-label="Keyword coverage">
        <span style="width:${Math.min(100, Math.round((hits.length / Math.max(1, (question.keywords || []).length)) * 100))}%"></span>
      </div>
      <p class="keyword-note">Keyword hits: ${hits.length}/${(question.keywords || []).length}. This is a guide only — meaning matters more than keyword stuffing.</p>
    `;
  }

  function wireExamPanel(question) {
    const textarea = els.examPanel.querySelector("#examResponse");
    textarea?.addEventListener("input", (event) => {
      state.examResponse = event.target.value;
      const hits = keywordHits(question, state.examResponse);
      const meter = els.examPanel.querySelector(".keyword-meter span");
      const note = els.examPanel.querySelector(".keyword-note");
      if (meter) meter.style.width = `${Math.min(100, Math.round((hits.length / Math.max(1, (question.keywords || []).length)) * 100))}%`;
      if (note) note.textContent = `Keyword hits: ${hits.length}/${(question.keywords || []).length}. This is a guide only — meaning matters more than keyword stuffing.`;
      els.examPanel.querySelectorAll(".keyword").forEach((chip) => {
        chip.classList.toggle("hit", hits.includes(chip.textContent.toLowerCase()));
      });
    });

    els.examPanel.querySelectorAll(".exam-choice").forEach((button) => {
      button.addEventListener("click", () => checkExamChoice(button, question));
    });
    els.examPanel.querySelector(".exam-reveal")?.addEventListener("click", () => {
      state.examRevealed = true;
      renderExamMode();
    });
    els.examPanel.querySelector(".exam-self-good")?.addEventListener("click", () => markExamSelf(question, true));
    els.examPanel.querySelector(".exam-self-practice")?.addEventListener("click", () => markExamSelf(question, false));
    els.examPanel.querySelector(".exam-next")?.addEventListener("click", nextExamQuestion);
  }

  function checkExamChoice(button, question) {
    if (state.examLocked) return;
    state.examLocked = true;
    state.examRevealed = true;
    const selected = button.dataset.examChoice || "";
    const correct = selected === question.answer;
    els.examPanel.querySelectorAll(".exam-choice").forEach((choiceButton) => {
      choiceButton.disabled = true;
      const isCorrect = choiceButton.dataset.examChoice === question.answer;
      choiceButton.classList.toggle("correct", isCorrect);
      choiceButton.classList.toggle("wrong", choiceButton === button && !correct);
    });
    recordAttempt(examAsCard(question), correct);
    if (correct) {
      state.progress.examWins = (state.progress.examWins || 0) + 1;
      saveProgress();
      celebrate();
    } else {
      playTone("wrong");
      shake(els.examPanel.querySelector(".exam-card"));
    }
    renderStats();
    renderBadges();
    const feedback = els.examPanel.querySelector(".exam-feedback");
    if (feedback) feedback.textContent = correct ? "Correct — that is the exam answer." : `Not quite. Correct answer: ${question.answer}`;
    els.examPanel.querySelector(".exam-mark-scheme")?.classList.add("visible");
  }

  function markExamSelf(question, correct) {
    if (state.examLocked) return;
    state.examLocked = true;
    state.examRevealed = true;
    recordAttempt(examAsCard(question), correct);
    if (correct) {
      state.progress.examWins = (state.progress.examWins || 0) + 1;
      saveProgress();
      celebrate();
    } else {
      playTone("wrong");
      shake(els.examPanel.querySelector(".exam-card"));
    }
    renderExamMode();
  }

  function nextExamQuestion() {
    const examDeck = filteredExamQuestions();
    if (!examDeck.length) return;
    state.examIndex = (state.examIndex + 1) % examDeck.length;
    resetExamQuestionState();
    render();
  }

  function keywordHits(question, response) {
    const text = String(response || "").toLowerCase();
    return (question.keywords || [])
      .map((keyword) => String(keyword).toLowerCase())
      .filter((keyword) => text.includes(keyword));
  }

  function examFeedbackText(question, hits) {
    if (state.examLocked) {
      return state.progress.calm
        ? "Marked and saved. Move on steadily, or review the mark scheme first. 🌊"
        : "Marked and saved. XP banked — keep the streak alive! ⚡";
    }
    if (Array.isArray(question.choices) && question.choices.length) return "Choose the best answer. Use number keys 1–4 if you like.";
    if (!state.examRevealed) return "Write your answer first, then reveal the mark scheme.";
    return `Compare your answer with the mark scheme. Keyword guide: ${hits.length}/${(question.keywords || []).length}.`;
  }

  function examAsCard(question) {
    return {
      id: question.id,
      type: "Exam-style question",
      unit: question.unit,
      front: question.prompt,
      back: question.answer,
    };
  }


  function exportProgress() {
    const payload = {
      app: "Year 7 Science Flashcards",
      version: 6,
      exportedAt: new Date().toISOString(),
      progress: state.progress,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "year7-science-flashcards-progress.json";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function importProgress(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      try {
        const payload = JSON.parse(String(reader.result || "{}"));
        const imported = payload.progress || payload;
        state.progress = {
          ...defaultProgress,
          ...imported,
          mastered: Array.isArray(imported.mastered) ? imported.mastered : [],
        };
        saveProgress();
        syncCalmSoundscape();
        render();
        window.alert("Progress imported for this browser.");
      } catch {
        window.alert("That progress file could not be imported.");
      } finally {
        els.importProgressFile.value = "";
      }
    });
    reader.readAsText(file);
  }

  function wireEvents() {
    els.unitFilter.addEventListener("change", (event) => {
      state.unit = event.target.value;
      state.labIndex = 0;
      state.labAnswers = {};
      state.examIndex = 0;
      resetExamQuestionState();
      rebuildDeck({ shuffle: true });
    });

    els.typeFilter.addEventListener("change", (event) => {
      state.type = event.target.value;
      if (state.mode === "equations" && state.type !== "Equation/relationship") {
        state.mode = "study";
      }
      rebuildDeck({ shuffle: true });
    });

    els.searchBox.addEventListener("input", (event) => {
      state.search = event.target.value;
      state.labIndex = 0;
      state.labAnswers = {};
      state.examIndex = 0;
      resetExamQuestionState();
      rebuildDeck({ shuffle: true });
    });

    els.modeButtons.forEach((button) => {
      button.addEventListener("click", () => setMode(button.dataset.mode));
    });

    els.heroModeButtons.forEach((button) => {
      button.addEventListener("click", () => {
        setMode(button.dataset.setMode);
        document.querySelector(".workspace")?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });

    els.flashcard.addEventListener("click", flipCard);
    els.flashcard.addEventListener("keydown", (event) => {
      if (event.key === " " || event.key === "Enter") {
        event.preventDefault();
        flipCard();
      }
    });

    els.knowButton.addEventListener("click", markKnown);
    els.needPracticeButton.addEventListener("click", markNeedsPractice);
    els.nextButton.addEventListener("click", nextCard);
    els.shuffleButton.addEventListener("click", shuffleCurrentDeck);
    els.speakButton.addEventListener("click", speakCurrentCard);

    els.soundToggle.addEventListener("click", () => {
      state.progress.sound = !state.progress.sound;
      saveProgress();
      syncCalmSoundscape();
      render();
    });

    els.calmToggle.addEventListener("click", () => {
      state.progress.calm = !state.progress.calm;
      saveProgress();
      syncCalmSoundscape();
      render();
    });

    els.exportProgress.addEventListener("click", exportProgress);

    els.importProgressFile.addEventListener("change", (event) => {
      importProgress(event.target.files?.[0]);
    });

    els.resetProgress.addEventListener("click", () => {
      const confirmed = window.confirm("Reset XP, streaks and badges for this browser?");
      if (!confirmed) return;
      state.progress = { ...defaultProgress };
      stopOceanNoise();
      saveProgress();
      render();
    });

    document.addEventListener("keydown", (event) => {
      const active = document.activeElement;
      const typing = active && ["INPUT", "SELECT", "TEXTAREA"].includes(active.tagName);
      if (typing) return;

      if (event.key.toLowerCase() === "n") nextCard();
      if (event.key === " " && !isQuizMode()) {
        event.preventDefault();
        flipCard();
      }
      if (/^[1-4]$/.test(event.key) && isQuizMode() && !state.quizLocked) {
        const button = els.answerGrid.querySelector(`[data-index="${Number(event.key) - 1}"]`);
        button?.click();
      }
      if (/^[1-4]$/.test(event.key) && state.mode === "exam" && !state.examLocked) {
        const button = els.examPanel.querySelector(`[data-exam-index="${Number(event.key) - 1}"]`);
        button?.click();
      }
    });

    window.addEventListener("resize", () => {
      scheduleCardTextFit();
      if (!state.fireworks.length) return;
      const canvas = els.canvas;
      canvas.width = window.innerWidth * (window.devicePixelRatio || 1);
      canvas.height = window.innerHeight * (window.devicePixelRatio || 1);
    });
  }

  function boot() {
    if (!cards.length) {
      renderEmptyState();
      return;
    }
    populateFilters();
    els.unitFilter.value = state.unit;
    els.typeFilter.value = state.type;
    wireEvents();
    syncCalmSoundscape();
    rebuildDeck({ shuffle: true });
  }

  boot();
})();
