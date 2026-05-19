(() => {
  "use strict";

  const STORAGE_KEY = "scienceQuest.year7.v1";
  const cards = Array.isArray(window.YEAR7_FLASHCARDS) ? window.YEAR7_FLASHCARDS : [];

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => Array.from(document.querySelectorAll(selector));

  const els = {
    homeScreen: $("#homeScreen"),
    studyScreen: $("#studyScreen"),
    launchStudyButton: $("#launchStudyButton"),
    homePracticeButton: $("#homePracticeButton"),
    homeExamButton: $("#homeExamButton"),
    homeBossButton: $("#homeBossButton"),
    brandHomeLink: $("#brandHomeLink"),
    homeTopicButtons: $$("[data-home-topic]"),
    homeButton: $("#homeButton"),
    unitFilter: $("#unitFilter"),
    typeFilter: $("#typeFilter"),
    practiceMixSelect: $("#practiceMixSelect"),
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
  const writtenExamUnits = ["7C Muscles and bones", "7F Acids and alkalis", "7J Current electricity"];
  const writtenExamQuestionsPerUnit = 5;
  const answerRevealingExamVisuals = new Set([
    "litmus-test",
    "ph-scale",
    "hazard-symbols",
  ]);
  const examSafeVisualOverrides = {
    "alveolus-gas-exchange": "alveolus-gas-exchange-blank",
    "circuit-comparison": "circuit-comparison-blank",
    "circuit-short-mistake": "circuit-short-mistake-blank",
    "indicator-palette": "indicator-palette-blank",
  };

  const interactiveLabGames = [
    {
      id: "lab-skeleton-basic",
      unit: "7C Muscles and bones",
      title: "Label the skeleton basics",
      brief: "Place each label onto the correct part of the skeleton.",
      diagram: "skeleton",
      labels: ["skull", "rib cage", "spine", "pelvis", "femur"],
      targets: [
        { id: "skull", label: "skull", x: 50, y: 10.5 },
        { id: "rib", label: "rib cage", x: 50, y: 29 },
        { id: "spine", label: "spine", x: 50, y: 40 },
        { id: "pelvis", label: "pelvis", x: 50, y: 54 },
        { id: "femur", label: "femur", x: 48, y: 69.5 },
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
        { id: "biceps", label: "biceps", x: 42.5, y: 43 },
        { id: "triceps", label: "triceps", x: 29, y: 48.5 },
        { id: "humerus", label: "humerus", x: 35.5, y: 36.5 },
        { id: "forearm", label: "radius and ulna", x: 63.5, y: 60.5 },
        { id: "elbow", label: "elbow joint", x: 43, y: 62.5 },
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
        { id: "trachea", label: "trachea", x: 50, y: 30 },
        { id: "lung", label: "lung", x: 45.5, y: 56 },
        { id: "rib", label: "rib cage", x: 35, y: 55 },
        { id: "diaphragm", label: "diaphragm", x: 50, y: 79 },
        { id: "air", label: "air moves in", x: 50, y: 10 },
      ],
    },
    {
      id: "lab-full-anatomy",
      unit: "7C Muscles and bones",
      title: "Full-body anatomy challenge",
      brief: "Connect all 23 labels to the half-skeleton, half-muscle body diagram.",
      diagram: "full-anatomy",
      labels: [
        "skull", "rib cage", "sternum", "spine", "pelvis", "humerus", "radius", "ulna", "femur", "patella", "tibia", "fibula",
        "deltoid", "biceps", "triceps", "pectoral", "intercostal muscles", "abdominals", "diaphragm", "gluteus", "quadriceps", "hamstrings", "calf muscle"
      ],
      targets: [
        { id: "skull", label: "skull", x: 37.8, y: 5.1, anchorSide: "left", anchorY: 6 },
        { id: "rib-cage", label: "rib cage", x: 34.4, y: 25.2, anchorSide: "left", anchorY: 13.5 },
        { id: "sternum", label: "sternum", x: 38.9, y: 25.8, anchorSide: "left", anchorY: 21 },
        { id: "spine", label: "spine", x: 38.4, y: 37.3, anchorSide: "left", anchorY: 28.5 },
        { id: "pelvis", label: "pelvis", x: 34.8, y: 45.9, anchorSide: "left", anchorY: 36 },
        { id: "humerus", label: "humerus", x: 29.5, y: 29.7, anchorSide: "left", anchorY: 43.5 },
        { id: "radius", label: "radius", x: 26.6, y: 44.0, anchorSide: "left", anchorY: 51 },
        { id: "ulna", label: "ulna", x: 26.8, y: 47.3, anchorSide: "left", anchorY: 58.5 },
        { id: "femur", label: "femur", x: 33.8, y: 61.3, anchorSide: "left", anchorY: 66 },
        { id: "patella", label: "patella", x: 34.1, y: 69.6, anchorSide: "left", anchorY: 73.5 },
        { id: "tibia", label: "tibia", x: 33.7, y: 77.9, anchorSide: "left", anchorY: 81 },
        { id: "fibula", label: "fibula", x: 33.8, y: 82.8, anchorSide: "left", anchorY: 88.5 },
        { id: "deltoid", label: "deltoid", x: 49.6, y: 21.6, anchorSide: "right", anchorY: 6 },
        { id: "biceps", label: "biceps", x: 51.2, y: 30.1, anchorSide: "right", anchorY: 14.5 },
        { id: "triceps", label: "triceps", x: 50.0, y: 33.0, anchorSide: "right", anchorY: 23 },
        { id: "pectoral", label: "pectoral", x: 44.0, y: 25.0, anchorSide: "right", anchorY: 31.5 },
        { id: "intercostal", label: "intercostal muscles", x: 45.2, y: 29.0, anchorSide: "right", anchorY: 40 },
        { id: "abdominals", label: "abdominals", x: 43.7, y: 39.3, anchorSide: "right", anchorY: 48.5 },
        { id: "diaphragm", label: "diaphragm", x: 47.6, y: 25.9, anchorSide: "right", anchorY: 57 },
        { id: "gluteus", label: "gluteus", x: 84.8, y: 69.8, anchorSide: "right", anchorY: 65.5 },
        { id: "quadriceps", label: "quadriceps", x: 46.4, y: 59.6, anchorSide: "right", anchorY: 74 },
        { id: "hamstrings", label: "hamstrings", x: 81.7, y: 76.4, anchorSide: "right", anchorY: 82.5 },
        { id: "calf", label: "calf muscle", x: 45.4, y: 78.8, anchorSide: "right", anchorY: 91 },
      ],
      success: "Excellent — that is the full anatomy challenge completed.",
    },
    {
      id: "lab-circuit-symbols",
      unit: "7J Current electricity",
      title: "Match components to circuit symbols",
      brief: "Match each component name to the circuit symbol used in the revision pack.",
      diagram: "symbols-extended",
      labels: ["cell", "open switch", "closed switch", "bulb", "resistor", "voltmeter", "ammeter"],
      targets: [
        { id: "cell", label: "cell", x: 14, y: 34 },
        { id: "open-switch", label: "open switch", x: 39, y: 34 },
        { id: "closed-switch", label: "closed switch", x: 64, y: 34 },
        { id: "bulb", label: "bulb", x: 88, y: 34 },
        { id: "resistor", label: "resistor", x: 24, y: 73 },
        { id: "voltmeter", label: "voltmeter", x: 50, y: 73 },
        { id: "ammeter", label: "ammeter", x: 76, y: 73 },
      ],
      success: "Nice work — those are the standard circuit symbols for Year 7 electricity.",
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
      success: "Circuit A has one path; circuit B has branches.",
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
      success: "Make a neutral solution first, then evaporate carefully to obtain crystals.",
    },
  ];

  const circuitBuilderGames = [
    {
      id: "circuit-build-complete-lamp",
      unit: "7J Current electricity",
      title: "Build a complete lamp circuit",
      brief: "Drag the symbols into the gaps to make one closed rectangular loop with a lamp.",
      layout: "simple-loop",
      poweredOnSuccess: true,
      labels: ["cell", "lamp", "closed switch", "open switch", "voltmeter"],
      slots: [
        { id: "source", label: "source", answer: "cell", x: 20, y: 68 },
        { id: "switch", label: "switch", answer: "closed switch", x: 50, y: 29 },
        { id: "load", label: "lamp", answer: "lamp", x: 80, y: 68 },
      ],
      success: "A closed circuit has no gap, so current can flow all the way around the loop and light the lamp.",
    },
    {
      id: "circuit-build-lamp-off",
      unit: "7J Current electricity",
      title: "Build a circuit where the lamp stays off",
      brief: "Use an open switch so the rectangular loop has a gap and the lamp will not light.",
      layout: "simple-loop",
      poweredOnSuccess: false,
      labels: ["cell", "lamp", "open switch", "closed switch", "ammeter"],
      slots: [
        { id: "source", label: "source", answer: "cell", x: 20, y: 68 },
        { id: "switch", label: "switch", answer: "open switch", x: 50, y: 29 },
        { id: "load", label: "lamp", answer: "lamp", x: 80, y: 68 },
      ],
      success: "The open switch leaves a gap, so the circuit is incomplete and no current flows.",
    },
    {
      id: "circuit-build-measure-current",
      unit: "7J Current electricity",
      title: "Measure current in series",
      brief: "Make one closed rectangular loop and place the ammeter in series with the lamp.",
      layout: "meter-loop",
      poweredOnSuccess: true,
      labels: ["cell", "lamp", "ammeter", "voltmeter", "closed switch"],
      slots: [
        { id: "source", label: "source", answer: "cell", x: 18, y: 68 },
        { id: "meter", label: "ammeter", answer: "ammeter", x: 40, y: 29 },
        { id: "switch", label: "switch", answer: "closed switch", x: 60, y: 29 },
        { id: "load", label: "lamp", answer: "lamp", x: 80, y: 68 },
      ],
      success: "Ammeters go in series, so all the current in the loop passes through the meter.",
    },
    {
      id: "circuit-build-measure-voltage",
      unit: "7J Current electricity",
      title: "Measure voltage across a lamp",
      brief: "Make a closed main loop, then put the voltmeter on a parallel branch across the lamp.",
      layout: "parallel-meter",
      poweredOnSuccess: true,
      labels: ["cell", "lamp", "voltmeter", "ammeter", "closed switch"],
      slots: [
        { id: "source", label: "source", answer: "cell", x: 18, y: 68 },
        { id: "load", label: "lamp", answer: "lamp", x: 56, y: 39 },
        { id: "meter", label: "voltmeter", answer: "voltmeter", x: 56, y: 79 },
        { id: "switch", label: "switch", answer: "closed switch", x: 82, y: 68 },
      ],
      success: "Voltmeters are connected in parallel across a component to compare the energy difference across it.",
    },
    {
      id: "circuit-build-series-two-lamps",
      unit: "7J Current electricity",
      title: "Build a series circuit with two lamps",
      brief: "Place both lamps in the same closed rectangular loop so there is only one path.",
      layout: "series-two-lamps",
      poweredOnSuccess: true,
      labels: ["cell", "lamp", "lamp", "closed switch", "voltmeter"],
      slots: [
        { id: "source", label: "source", answer: "cell", x: 18, y: 68 },
        { id: "load1", label: "lamp 1", answer: "lamp", x: 42, y: 29 },
        { id: "load2", label: "lamp 2", answer: "lamp", x: 66, y: 29 },
        { id: "switch", label: "switch", answer: "closed switch", x: 82, y: 68 },
      ],
      success: "In series, both lamps are on the same loop, so the current has only one path through both.",
    },
    {
      id: "circuit-build-parallel-two-lamps",
      unit: "7J Current electricity",
      title: "Build a parallel circuit with two lamps",
      brief: "Place one lamp on each branch so the circuit has two separate paths.",
      layout: "parallel-two-lamps",
      poweredOnSuccess: true,
      labels: ["cell", "lamp", "lamp", "closed switch", "ammeter"],
      slots: [
        { id: "source", label: "source", answer: "cell", x: 18, y: 68 },
        { id: "branch1", label: "top branch", answer: "lamp", x: 58, y: 44 },
        { id: "branch2", label: "bottom branch", answer: "lamp", x: 58, y: 73 },
        { id: "switch", label: "switch", answer: "closed switch", x: 82, y: 68 },
      ],
      success: "In parallel, the lamps are on different branches, so there are two paths for current.",
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
      answer: "Breathing is the physical movement of air into and out of the lungs. Respiration is a chemical process in cells that releases energy from glucose, usually using oxygen and producing carbon dioxide and water.",
      conciseAnswer: "Breathing moves air in and out of the lungs; respiration happens in cells and releases energy from glucose.",
      explanation: "The common trap is to use respiration as another word for breathing. Breathing gets oxygen into the lungs and removes carbon dioxide from the lungs. Respiration is the cell process that uses oxygen and glucose to release useful energy, with carbon dioxide and water as products.",
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
      answer: "During inhalation, the diaphragm contracts and moves down. The rib muscles move the ribs up and out. Chest volume increases, pressure inside the chest decreases, and air moves into the lungs.",
      conciseAnswer: "Diaphragm down, ribs up and out, chest volume increases, pressure decreases, so air moves in.",
      explanation: "Air moves because of a pressure difference. Increasing the volume inside the chest lowers the pressure compared with outside air, so air flows into the lungs until the pressure difference is reduced.",
      cue: "A high-mark answer links muscle movement to volume, pressure, and air movement.",
    },
    {
      id: "exam-7c-exhalation-mechanism",
      unit: "7C Muscles and bones",
      kind: "written",
      title: "Exhalation sequence",
      prompt: "Describe what happens during exhalation using volume and pressure.",
      visual: "breathing-two-panel",
      marks: 4,
      keywords: ["diaphragm", "relaxes", "up", "ribs", "down", "volume", "decreases", "pressure", "increases", "air", "out"],
      answer: "During exhalation, the diaphragm relaxes and moves up. The rib muscles relax so the ribs move down and in. Chest volume decreases, pressure inside the chest increases, and air moves out of the lungs.",
      conciseAnswer: "Diaphragm up, ribs down and in, chest volume decreases, pressure increases, so air moves out.",
      explanation: "Exhalation is mostly the reverse of inhalation. A smaller chest volume increases the pressure inside the lungs, so air is forced out. A strong answer links muscle movement to volume, pressure, and air movement in that order.",
      cue: "Do not just say air leaves; explain why it leaves.",
    },
    {
      id: "exam-7c-alveoli-adaptations",
      unit: "7C Muscles and bones",
      kind: "written",
      title: "Gas exchange adaptations",
      prompt: "Explain why alveoli are good places for gas exchange.",
      visual: "alveolus-gas-exchange-blank",
      marks: 4,
      keywords: ["large surface area", "thin", "moist", "capillaries", "diffusion", "oxygen", "carbon dioxide"],
      answer: "Alveoli have a large surface area, very thin walls, and a moist surface. They are surrounded by many capillaries, giving a good blood supply, so oxygen diffuses into the blood and carbon dioxide diffuses out of the blood quickly.",
      conciseAnswer: "Alveoli are numerous, thin, moist, and close to capillaries, giving a large surface area and short diffusion distance.",
      explanation: "Gas exchange depends on diffusion. Alveoli speed diffusion by giving gases a large surface to cross, a very short distance through thin walls, moisture for gases to dissolve, and a blood supply that carries gases away to maintain the concentration difference.",
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
      conciseAnswer: "The biceps and triceps work as an opposite pair: one contracts while the other relaxes.",
      explanation: "Muscles can pull but they cannot push. This is why joints need muscle pairs. One muscle pulls the bone one way, then the opposite muscle pulls it back the other way.",
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
      answer: "The skeleton supports the body, protects organs, allows movement with muscles and joints, and helps make blood cells in bone marrow. For example, the skull protects the brain and the rib cage protects the heart and lungs.",
      conciseAnswer: "Support, protection, movement, and blood-cell production; for example, the skull protects the brain.",
      explanation: "Do not only list bone names. The marks come from matching functions to examples: support gives the body shape, protection keeps organs safe, joints and muscles allow movement, and marrow inside some bones makes blood cells.",
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
      answer: "One person holds a ruler vertically with the zero mark level with another person\u2019s open fingers. The ruler is dropped without warning and the second person catches it. Record the distance fallen, repeat several times, keep the same hand, starting position, and ruler, then calculate a mean average.",
      conciseAnswer: "Drop a ruler without warning, record the catch distance, repeat using the same method, and calculate a mean.",
      explanation: "This practical estimates reaction time because a longer distance means the ruler fell for longer before it was caught. Repeats reduce random error, and keeping the setup the same makes the comparison fair.",
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
      answer: "During exercise, muscle cells respire more to release more energy. They need more oxygen and glucose, and they make more carbon dioxide. Breathing rate and pulse rate increase to deliver oxygen and glucose faster and remove carbon dioxide faster.",
      conciseAnswer: "Muscles respire more, so breathing and pulse increase to supply oxygen/glucose and remove carbon dioxide.",
      explanation: "Exercise does not simply make the body \u201cneed more air\u201d. The reason is increased respiration in muscle cells. The lungs bring oxygen into the body and the blood moves oxygen, glucose, and carbon dioxide around faster.",
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
      answer: "Respiration happens in cells, not just in the lungs. It is the chemical process that releases energy from glucose, usually using oxygen. Breathing is the movement of air into and out of the lungs.",
      conciseAnswer: "Respiration happens in cells and releases energy; breathing moves air in and out of the lungs.",
      explanation: "The student has mixed up breathing and respiration. The lungs are involved because they bring oxygen into the body, but the respiration process itself happens in cells throughout the body.",
      cue: "This tests whether the key misconception has been fixed.",
    },


    {
      id: "exam-7c-double-circulation",
      unit: "7C Muscles and bones",
      kind: "written",
      title: "Double circulation",
      prompt: "Explain what is meant by the human double circulatory system. Aim for 4 marks.",
      visual: "double-circulation",
      marks: 4,
      keywords: ["heart", "lungs", "body", "two", "loops", "oxygen", "carbon dioxide"],
      answer: "Humans have double circulation because blood travels through the heart twice during one complete trip around the body. One loop goes from the heart to the lungs and back to pick up oxygen and remove carbon dioxide. The other loop goes from the heart to the body and back to deliver oxygen and nutrients to cells.",
      conciseAnswer: "There are two loops: heart\u2013lungs\u2013heart and heart\u2013body\u2013heart.",
      explanation: "Double circulation keeps oxygen pickup in the lungs separate from oxygen delivery to the body. Blood returns to the heart after the lungs so it can be pumped strongly around the body.",
      cue: "Use both loops: heart-lungs-heart and heart-body-heart.",
    },
    {
      id: "exam-7c-scientific-ethical-questions",
      unit: "7C Muscles and bones",
      kind: "written",
      title: "Scientific or ethical?",
      prompt: "Explain the difference between a scientific question and an ethical question, giving one example of each.",
      marks: 4,
      keywords: ["scientific", "evidence", "measure", "experiment", "ethical", "fair", "right", "wrong"],
      answer: "A scientific question can be answered using evidence from observations or experiments, for example: does caffeine affect reaction time? An ethical question is about what people think is fair, right, or wrong, for example: is it right to test a medicine on animals?",
      conciseAnswer: "Scientific questions are answered with evidence; ethical questions are about what is right or fair.",
      explanation: "Scientific evidence can help an ethical debate, but it does not settle it by itself. For example, experiments can show whether a medicine works, but people still have to judge whether a testing method is acceptable.",
      cue: "Scientific = evidence/testable. Ethical = fairness/right/wrong.",
    },
    {
      id: "exam-7c-drug-classification",
      unit: "7C Muscles and bones",
      kind: "choice",
      title: "Drug classification",
      prompt: "Which statement correctly classifies these drug examples?",
      marks: 1,
      choices: ["Caffeine is a stimulant; alcohol and heroin are depressants; paracetamol and penicillin are medicines.", "Alcohol is a stimulant; caffeine is a depressant; penicillin is illegal.", "All drugs are illegal and harmful.", "Paracetamol and penicillin are both depressants."],
      answer: "Caffeine is a stimulant; alcohol and heroin are depressants; paracetamol and penicillin are medicines.",
      keywords: ["caffeine", "stimulant", "alcohol", "heroin", "depressant", "medicine"],
      cue: "Drug means chemical that affects the body; some drugs are useful medicines.",
    },
    {
      id: "exam-7c-drug-testing-effects",
      unit: "7C Muscles and bones",
      kind: "written",
      title: "Drug effects and testing",
      prompt: "Give one short-term drug effect, one long-term risk of abusing drugs, and one reason medicines are tested.",
      marks: 4,
      keywords: ["reaction", "nervous", "addiction", "organ", "liver", "safe", "dose", "side-effects"],
      answer: "A short-term effect could be a change in reaction time, mood, alertness, or coordination. A long-term risk of abusing drugs is addiction or organ damage, such as liver damage. Medicines are tested to check that they work, find a safe dose, and identify side effects.",
      conciseAnswer: "Short-term effects can change behaviour or reaction time; long-term abuse can cause addiction or organ damage; medicines are tested for safety and effectiveness.",
      explanation: "Separate the three parts of the question. Effects can happen soon after taking a drug, long-term risks can build up after repeated misuse, and medicine testing protects patients by checking benefit, dose, and side effects.",
      cue: "Name effects clearly and link testing to safety.",
    },

    {
      id: "exam-7f-natural-indicator-method",
      unit: "7F Acids and alkalis",
      kind: "written",
      title: "Natural indicator method",
      prompt: "Describe how to make and use a natural indicator such as red cabbage juice.",
      marks: 5,
      keywords: ["red cabbage", "crush", "water", "filter", "known", "acid", "alkali", "colour"],
      answer: "Chop or crush red cabbage and mix it with a small amount of warm water to extract the coloured dye. Filter or pour off the coloured liquid. Test it with known acidic, neutral, and alkaline solutions and record the colours. Then add it to an unknown liquid and compare the colour with the known results.",
      conciseAnswer: "Extract the coloured liquid, test it on known acids/neutral/alkalis, record the colour chart, then compare unknowns.",
      explanation: "A natural indicator is only useful if you first calibrate it with known solutions. The known tests create a colour reference, which lets you interpret the colour change for an unknown liquid.",
      cue: "Known test liquids make the unknown result meaningful.",
    },
    {
      id: "exam-7f-extra-indicators",
      unit: "7F Acids and alkalis",
      kind: "choice",
      title: "Phenolphthalein and methyl orange",
      prompt: "Which indicator colour statement is correct?",
      marks: 1,
      choices: ["Phenolphthalein is colourless in more acidic solutions and pink in more alkaline solutions.", "Phenolphthalein is always blue in acids and alkalis.", "Methyl orange is pink in alkalis and colourless in acids.", "Methyl orange is only used to test electric current."],
      answer: "Phenolphthalein is colourless in more acidic solutions and pink in more alkaline solutions.",
      keywords: ["phenolphthalein", "colourless", "acidic", "pink", "alkaline"],
      cue: "Also remember methyl orange: red in more acidic, yellow in more alkaline.",
    },
    {
      id: "exam-7f-everyday-neutralisation",
      unit: "7F Acids and alkalis",
      kind: "written",
      title: "Everyday neutralisation",
      prompt: "Give two everyday uses of neutralisation and explain what is being neutralised.",
      marks: 4,
      keywords: ["antacid", "stomach", "acid", "soil", "toothpaste", "power stations", "base", "neutralise"],
      answer: "Antacids contain a base or alkali that neutralises extra stomach acid. Farmers can add lime, a base, to soil that is too acidic for crops. Toothpaste can help neutralise acids in the mouth, and alkalis can neutralise acidic gases from power stations.",
      conciseAnswer: "Antacids neutralise stomach acid; lime neutralises acidic soil. Neutralisation is acid + base/alkali.",
      explanation: "Neutralisation means an acid reacts with a base or alkali so the solution becomes closer to neutral. The strongest answers say what the acid is and what substance is used to neutralise it.",
      cue: "Use the word neutralise and name the acid/base example.",
    },
    {
      id: "exam-7f-salt-equation-practice",
      unit: "7F Acids and alkalis",
      kind: "choice",
      title: "Salt word equation",
      prompt: "Complete the word equation: sulfuric acid + magnesium oxide → ?",
      marks: 1,
      choices: ["magnesium sulfate + water", "magnesium chloride + water", "sodium sulfate + hydrogen", "magnesium nitrate + oxygen"],
      answer: "magnesium sulfate + water",
      keywords: ["sulfuric", "magnesium", "sulfate", "water"],
      cue: "Sulfuric acid makes sulfate salts; metal oxide bases make salt + water.",
    },

    {
      id: "exam-7j-physical-abstract-models",
      unit: "7J Current electricity",
      kind: "written",
      title: "Physical and abstract models",
      prompt: "Explain the difference between a physical model and an abstract model, using electricity examples.",
      marks: 4,
      keywords: ["physical", "touch", "abstract", "diagram", "idea", "circuit", "model"],
      answer: "A physical model is one you can touch or build, such as a pump-and-pipes model of a circuit. An abstract model is an idea, diagram, or representation, such as a circuit diagram or the idea that voltage is a push. Both can help explain circuits, but they are simplified.",
      conciseAnswer: "A physical model can be built or touched; an abstract model is a diagram, idea, or representation.",
      explanation: "Models help us reason about something difficult to see, such as electric current. They are useful because they simplify the system, but every model has limits because it is not the real circuit.",
      cue: "Physical = touchable. Abstract = idea/diagram/representation.",
    },
    {
      id: "exam-7j-model-limits",
      unit: "7J Current electricity",
      kind: "written",
      title: "Model strengths and limits",
      prompt: "The central-heating model uses a pump, pipes and radiators to model a circuit. Give one strength and one limitation of this model.",
      visual: "central-heating-model",
      marks: 4,
      keywords: ["pump", "cell", "pipes", "wires", "radiators", "bulbs", "not", "same", "charges"],
      answer: "A strength is that the pump can represent the cell or power supply, the pipes can represent wires, and the radiators can represent bulbs transferring energy. A limitation is that water is not the same as electric charge: water can leak or be used as a material, but charge is not used up as it goes around a circuit.",
      conciseAnswer: "Strength: pump/pipes/radiators can model cell/wires/bulbs. Limitation: water is not electric charge and the model is not exact.",
      explanation: "The central-heating model is good for showing circulation and energy transfer, but it can also mislead. In a real circuit, charge is not used up by a bulb; energy is transferred by the component while charge continues around the loop.",
      cue: "Good model answers say what the model helps with and where it breaks down.",
    },
    {
      id: "exam-7j-truth-table-switches",
      unit: "7J Current electricity",
      kind: "choice",
      title: "AND/OR truth table",
      prompt: "Switch A is open and switch B is closed. Which statement is correct?",
      visual: "circuit-or-switches",
      marks: 1,
      choices: ["An AND circuit is off, but an OR circuit can be on.", "Both AND and OR circuits must be off.", "An AND circuit is on, but an OR circuit must be off.", "Truth tables only apply to acids."],
      answer: "An AND circuit is off, but an OR circuit can be on.",
      keywords: ["AND", "OR", "open", "closed", "series", "parallel"],
      cue: "AND needs both switches. OR needs either switch.",
    },
    {
      id: "exam-7j-safety-rules",
      unit: "7J Current electricity",
      kind: "written",
      title: "Electrical safety",
      prompt: "Give three dangers of electricity and two safety rules for using circuits or mains appliances.",
      marks: 5,
      keywords: ["fires", "burns", "shocks", "heart", "wet", "sockets", "overload", "switch off"],
      answer: "Electricity can cause fires, burns, and electric shocks that may injure or stop the heart. Safety rules include not using electrical equipment with wet hands, not putting objects into sockets, not overloading sockets, and switching off the power supply before changing components in a school circuit.",
      conciseAnswer: "Dangers include shock, burns, and fire; reduce risk by keeping water away, avoiding overloaded sockets, and switching off before changes.",
      explanation: "Electrical safety answers should connect a hazard to a control. Water and damaged equipment increase the chance of current passing through the body, while overloaded sockets and faulty wires can overheat and cause fires.",
      cue: "Separate dangers from precautions.",
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
      marks: 4,
      keywords: ["blue litmus", "red", "acid", "red litmus", "blue", "alkali"],
      answer: "Use both red and blue litmus paper. An acid turns blue litmus red and leaves red litmus red. An alkali turns red litmus blue and leaves blue litmus blue. A neutral solution does not change either red or blue litmus.",
      conciseAnswer: "Acid: blue litmus turns red. Alkali: red litmus turns blue. Neutral: neither changes.",
      explanation: "Using both colours of litmus avoids confusion. A single strip that does not change is not enough evidence by itself, because it may already be the colour it would turn.",
      cue: "Be precise about which colour starts and which colour it turns.",
    },
    {
      id: "exam-7f-universal-indicator",
      unit: "7F Acids and alkalis",
      kind: "written",
      title: "Universal indicator",
      prompt: "Explain why universal indicator gives more information than litmus.",
      visual: "indicator-palette-blank",
      marks: 3,
      keywords: ["range", "colours", "pH", "acidic", "alkaline", "acid", "alkali"],
      answer: "Universal indicator gives a range of colours, so it can estimate pH and show how strongly acidic or alkaline a substance is. Litmus mainly shows whether something is acidic or alkaline, with much less detail.",
      conciseAnswer: "Universal indicator estimates pH and strength; litmus mainly tells acid or alkali.",
      explanation: "Universal indicator is a mixture of indicators, so it changes through several colours across the pH scale. That makes it more informative than litmus when you need to compare weak and strong acids or alkalis.",
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
      answer: "Wear goggles. Measure the acid into a beaker or flask and add a few drops of indicator. Add the alkali slowly while stirring until the indicator shows neutral, such as green with universal indicator. Stop at the neutral colour and record the volumes used.",
      conciseAnswer: "Wear goggles, add indicator to acid, add alkali slowly while stirring, and stop at the neutral colour.",
      explanation: "The key practical idea is control. Adding the alkali slowly prevents overshooting neutral. A few drops of indicator are enough, and the endpoint colour tells you when the acid has been neutralised.",
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
      answer: "The student is pouring acid in a way that could splash and is not wearing eye protection. They should wear goggles, pour small amounts carefully, keep the bottle controlled and pointed away from people, work over the bench or tray, and ask the teacher for help with spills.",
      conciseAnswer: "The student risks acid splashing and needs goggles, careful pouring, and spill control.",
      explanation: "Acids can irritate or damage skin and eyes. Practical-safety answers should identify the hazard and then give a specific safer action, not just say \u201cbe careful\u201d.",
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
      answer: "Only a few drops of indicator are needed. Adding a large squirt can make the colour harder to judge and may affect the mixture, so the result is less reliable.",
      conciseAnswer: "Use only a few drops; too much indicator can make the colour judgement unreliable.",
      explanation: "An indicator is meant to show the result, not become a major part of the mixture. Too much indicator can mask the endpoint and make comparisons between tests unfair.",
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
      answer: "Pour the neutral salt solution into an evaporating dish. Warm it gently to evaporate some water until the solution is more concentrated, then stop heating and leave it to cool or stand so crystals form. Do not heat it to dryness.",
      conciseAnswer: "Gently evaporate some water, then leave the concentrated solution to cool/stand and crystallise.",
      explanation: "Crystals form when there is not enough water left to keep all the salt dissolved. Heating too strongly or to dryness is unsafe and can spit hot solution, so the final crystallisation should happen by cooling or standing.",
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
      answer: "Keep the volume of each test liquid the same and use the same number of drops of universal indicator. You could also keep the time before comparing colours, the temperature, and the type of container the same.",
      conciseAnswer: "Keep liquid volume and indicator drops the same; also control time, temperature, and container if possible.",
      explanation: "A fair test changes only the variable being tested. If one sample gets more indicator or a different volume, the colour comparison may not be due only to acidity or alkalinity.",
      cue: "Fair test means only the liquid type should change.",
    },

    {
      id: "exam-7j-complete-circuit",
      unit: "7J Current electricity",
      kind: "written",
      title: "Complete circuit",
      prompt: "Explain why a lamp only lights in a complete circuit.",
      visual: "circuit-series",
      marks: 3,
      keywords: ["complete", "closed", "loop", "current", "flow", "lamp"],
      answer: "A lamp lights only when there is a complete closed loop. Current can flow from the cell, through the lamp and other components, and back to the cell. A gap or open switch breaks the loop and stops the current.",
      conciseAnswer: "The circuit must be a closed loop so current can flow through the lamp and back to the cell.",
      explanation: "Current does not jump across gaps in a normal school circuit. The lamp transfers energy only when charge can move all the way around the loop.",
      cue: "The key idea is closed path / loop.",
    },
    {
      id: "exam-7j-series-vs-parallel",
      unit: "7J Current electricity",
      kind: "written",
      title: "Series vs parallel",
      prompt: "Compare a series circuit and a parallel circuit.",
      visual: "circuit-comparison-blank",
      marks: 4,
      keywords: ["series", "one loop", "same current", "parallel", "branches", "separate paths"],
      answer: "A series circuit has one loop, so all components share the same current path. A parallel circuit has branches, so current has more than one path and components can be on separate branches.",
      conciseAnswer: "Series has one path; parallel has branches and more than one path.",
      explanation: "The difference in paths affects how the circuits behave. In series, a break anywhere stops the whole circuit. In parallel, one branch can still work even if another branch is open.",
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
      answer: "The voltmeter is connected in series, which is wrong for measuring voltage across a component. It should be connected in parallel across the lamp or component being measured.",
      conciseAnswer: "A voltmeter should be connected in parallel across the component, not in series.",
      explanation: "Voltage is measured between two points, so the voltmeter must be placed across the component. Ammeters are the meters that go in series to measure current through a component.",
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
      answer: "At a junction in a parallel circuit, current splits between the branches. The total current before the junction equals the sum of the branch currents, and the currents rejoin after the branches.",
      conciseAnswer: "Current splits at a junction and rejoins; total current equals the sum of the branch currents.",
      explanation: "Current is not lost at a junction. The charges take different branch paths, so the current in each branch can be smaller than the total current supplied by the cell.",
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
      conciseAnswer: "Series switches are AND because switch A and switch B must both be closed.",
      explanation: "A series circuit has only one path. With two switches in that path, either open switch breaks the only path, so both conditions must be true for the lamp to light.",
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
      answer: "Switches on parallel branches act like OR because either branch can complete a path for current. The lamp can light if switch A is closed or switch B is closed.",
      conciseAnswer: "Parallel switches are OR because either branch can provide a complete path.",
      explanation: "Parallel branches give current more than one possible route. If one branch switch is open but the other branch switch is closed, there is still a complete path through the closed branch.",
      cue: "OR means either route can work.",
    },
    {
      id: "exam-7j-short-circuit",
      unit: "7J Current electricity",
      kind: "written",
      title: "Spot the short circuit",
      prompt: "Look at the short-circuit diagram. Explain why this is a problem.",
      visual: "circuit-short-mistake-blank",
      marks: 3,
      keywords: ["short circuit", "low resistance", "bypass", "large current", "danger", "lamp"],
      answer: "The extra wire gives current a very low-resistance path that bypasses the lamp. This can cause a large current, so the circuit may be dangerous and the lamp may not work properly.",
      conciseAnswer: "The extra wire bypasses the lamp with a low-resistance path, causing a large current risk.",
      explanation: "Current tends to take the easier low-resistance path. A short circuit can make the current much larger than intended, which can overheat wires, damage cells, or stop the component from working properly.",
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
    bossHistory: [],
    writtenExamHistory: [],
    bossSeenIds: [],
    bossUnlockedLevel: 1,
    bossLevelCompletions: {},
    cardStatus: {},
    masterBlasterEarned: false,
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
    circuitPowered: false,
    circuitFeedbackMessage: "",
    examIndex: 0,
    examRevealed: false,
    examLocked: false,
    examResponse: "",
    writtenExamActive: false,
    writtenExamSubmitted: false,
    writtenExamDeck: [],
    writtenExamAnswers: {},
    writtenExamStartedAt: null,
    writtenExamSaved: false,
    bossActive: false,
    bossFinished: false,
    bossDeck: [],
    bossIndex: 0,
    bossAnswers: [],
    bossLength: 10,
    bossUnit: "all",
    bossType: "all",
    bossMix: "balanced",
    bossDifficulty: 1,
    bossSaved: false,
    homeUnits: ["7C Muscles and bones", "7F Acids and alkalis", "7J Current electricity"],
    practiceMix: "balanced",
    progress: loadProgress(),
    sessionAnswered: 0,
    sessionCorrect: 0,
    sessionMastered: 0,
    sessionNeedsReview: 0,
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
        bossHistory: Array.isArray(stored.bossHistory) ? stored.bossHistory : [],
        writtenExamHistory: Array.isArray(stored.writtenExamHistory) ? stored.writtenExamHistory : [],
        bossSeenIds: Array.isArray(stored.bossSeenIds) ? stored.bossSeenIds : [],
        bossUnlockedLevel: Math.max(1, Math.min(5, Number(stored.bossUnlockedLevel || 1))),
        bossLevelCompletions: stored.bossLevelCompletions && typeof stored.bossLevelCompletions === "object" ? stored.bossLevelCompletions : {},
        cardStatus: stored.cardStatus && typeof stored.cardStatus === "object" ? stored.cardStatus : {},
        masterBlasterEarned: Boolean(stored.masterBlasterEarned),
      };
    } catch {
      return { ...defaultProgress };
    }
  }

  function saveProgress() {
    state.progress.lastSavedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.progress));
  }


  function writtenExamNeedsQuitConfirmation() {
    return state.writtenExamActive && !state.writtenExamSubmitted && state.writtenExamDeck.length;
  }

  function showHomeScreen() {
    if (state.bossActive) {
      const confirmed = window.confirm("Are you sure you want to quit this Boss Round? This score will not be saved.");
      if (!confirmed) return;
      resetBossRound();
    }
    if (writtenExamNeedsQuitConfirmation()) {
      const confirmed = window.confirm("Are you sure you want to quit this written exam? Your answers for this exam will be cleared.");
      if (!confirmed) return;
      resetWrittenExamRound();
    }
    els.homeScreen?.classList.remove("hidden");
    els.studyScreen?.classList.add("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function showStudyScreen() {
    els.homeScreen?.classList.add("hidden");
    els.studyScreen?.classList.remove("hidden");
    requestAnimationFrame(() => {
      els.studyScreen?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }


  function goHome() {
    if (state.bossActive) {
      const confirmed = window.confirm("Are you sure you want to quit this Boss Round? This score will not be saved.");
      if (!confirmed) return;
      resetBossRound();
    }
    showHomeScreen();
  }

  function selectedHomeUnits() {
    return state.homeUnits && state.homeUnits.length ? state.homeUnits : uniqueValues("unit");
  }

  function applyHomeTopicDefaults() {
    const selected = selectedHomeUnits();
    state.unit = selected.length === 1 ? selected[0] : "all";
    state.bossUnit = selected.length === 1 ? selected[0] : "all";
    if (els.unitFilter) els.unitFilter.value = state.unit;
  }

  function syncHomeTopicButtons() {
    els.homeTopicButtons.forEach((button) => {
      button.classList.toggle("active", selectedHomeUnits().includes(button.dataset.homeTopic));
    });
  }

  function startPracticeFromHome(mode = state.mode === "boss" ? "study" : state.mode) {
    applyHomeTopicDefaults();
    setMode(mode === "boss" ? "study" : mode);
    showStudyScreen();
  }

  function startBossFromHome() {
    applyHomeTopicDefaults();
    setMode("boss");
    showStudyScreen();
  }

  function startWrittenExamFromHome() {
    state.unit = "all";
    if (els.unitFilter) els.unitFilter.value = "all";
    setMode("writtenExam");
    showStudyScreen();
  }

  function accuracy(progress = state.progress) {
    if (!progress.attempted) return 0;
    return Math.round((progress.correct / progress.attempted) * 100);
  }


  function sessionRoundComplete() {
    return state.sessionAnswered > 0 && state.sessionAnswered % 10 === 0;
  }

  function recommendedNextMode() {
    if ((state.progress.weakIds || []).length || state.sessionNeedsReview) return "Weak review";
    if (state.sessionCorrect >= 8) return "Exam coach";
    if (state.mode === "visual") return "Label lab";
    if (state.mode === "lab") return "Visual lab";
    if (state.mode === "circuit") return "Circuit builder";
    return "Flip cards";
  }

  function setReviewBox(title, text, { complete = false } = {}) {
    const heading = els.reviewBox?.querySelector("h3");
    if (heading) heading.textContent = title;
    if (els.studyTip) els.studyTip.textContent = text;
    els.reviewBox?.classList.toggle("round-complete", Boolean(complete));
  }

  function setModeTip(text) {
    if (sessionRoundComplete()) {
      const incorrect = Math.max(0, state.sessionAnswered - state.sessionCorrect);
      setReviewBox(
        "End of round summary",
        `You answered ${state.sessionAnswered} questions: ${state.sessionCorrect} correct and ${incorrect} for review. Mastered this session: ${state.sessionMastered}. Further review marks: ${state.sessionNeedsReview}. Recommended next: ${recommendedNextMode()}.`,
        { complete: true }
      );
      return;
    }
    setReviewBox("Round progress", "Answer 10 questions to complete a round.", { complete: false });
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

  function renderExamVisual(key) {
    const safeKey = examSafeVisualOverrides[key] || key;
    if (!safeKey || answerRevealingExamVisuals.has(safeKey)) return "";
    return renderVisual(safeKey);
  }

  function renderVisual(key) {
    const symbolKey = key.replace(/^symbol-/, "");
    if (key.startsWith("symbol-")) return renderCircuitSymbol(symbolKey);

    const imageVisuals = {
      "skeleton-basic": { src: "assets/visuals/skeleton-basic.png", alt: "Skeleton diagram with A, B, and C callouts." },
      "elbow-joint": { src: "assets/visuals/elbow-joint.png", alt: "Elbow joint anatomy diagram with A, B, and C callouts." },
      "arm-antagonistic": { src: "assets/visuals/arm-antagonistic.png", alt: "Arm anatomy diagram with antagonistic muscles and A, B, and C callouts." },
      "acid-safety-mistake": { src: "assets/visuals/acid-safety-mistake.png", alt: "Lab safety scene showing a student pouring acid without eye protection." },
      "hazard-symbols": { src: "assets/visuals/hazard-symbols.png", alt: "Hazard symbols diagram with five lettered symbols." },
      "breathing-two-panel": { src: "assets/visuals/breathing-two-panel.png", alt: "Two-panel breathing diagram with lettered panels and callouts." },
      "double-circulation": { src: "assets/visuals/double-circulation.png", alt: "Double circulation diagram showing the lungs, heart, body, and flow paths." },
      "plug-safety": { src: "assets/visuals/plug-safety.png", alt: "UK plug safety cutaway diagram with lettered callouts." },
      "central-heating-model": { src: "assets/visuals/central-heating-model.png", alt: "Central-heating model and electric-circuit comparison diagram." },
      "blood-vessels": { src: "assets/visuals/blood-vessels.png", alt: "Three lettered blood-vessel diagrams for a visual challenge." },
      "alveolus-gas-exchange": { src: "assets/visuals/alveolus-gas-exchange.png", alt: "Alveolus gas-exchange diagram with lettered arrows and a callout." },
      "neutralisation-setup": { src: "assets/visuals/neutralisation-setup.png", alt: "Neutralisation practical setup with lettered apparatus callouts." },
      "evaporation-dish": { src: "assets/visuals/evaporation-dish.png", alt: "Evaporation setup with lettered apparatus callouts." },
      "lungs-diaphragm": { src: "assets/visuals/lungs-diaphragm.png", alt: "Breathing system overview with lettered anatomy callouts." },
      "dilution-method": { src: "assets/visuals/dilution-method.png", alt: "Safe dilution diagram with three lettered callouts." },
      "litmus-test": { src: "assets/visuals/litmus-test.png", alt: "Litmus test setup with four lettered callouts." },
      "indicator-palette": { src: "assets/visuals/indicator-palette.png", alt: "Universal indicator colour strip with three lettered callouts and pH numbers." },
      "reaction-time-ruler": { src: "assets/visuals/reaction-time-ruler.png", alt: "Ruler-drop reaction time test diagram with three lettered callouts." },
    };
    if (imageVisuals[key]) return renderRasterVisual(imageVisuals[key].src, imageVisuals[key].alt);

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
      "circuit-short-mistake-blank": circuitShortMistakeBlankSvg,
      "ph-scale": phScaleSvg,
      "litmus-test": litmusTestSvg,
      "indicator-palette": indicatorPaletteSvg,
      "indicator-palette-blank": indicatorPaletteSvg,
      "neutralisation-setup": neutralisationSetupSvg,
      "indicator-mistake": indicatorMistakeSvg,
      "evaporation-dish": evaporationDishSvg,
      "dilution-method": dilutionMethodSvg,
      "lungs-diaphragm": lungsDiaphragmSvg,
      "alveolus-gas-exchange": alveolusGasExchangeSvg,
      "alveolus-gas-exchange-blank": alveolusGasExchangeBlankSvg,
      "blood-vessels": bloodVesselsSvg,
      "reaction-time-ruler": reactionTimeRulerSvg,
      "circuit-comparison": circuitComparisonSvg,
      "circuit-comparison-blank": circuitComparisonBlankSvg,
      "circuit-dual-ammeters": circuitDualAmmetersSvg,
      "circuit-xyz-parallel": circuitParallelXYZSvg,
      "circuit-pack-mistakes": circuitPackMistakesSvg,
      "circuit-pack-four": circuitPackFourSvg,
      "circuit-concept-map": circuitConceptMapSvg,
    };
    const renderer = diagrams[key];
    return renderer ? renderer() : "";
  }

  function renderRasterVisual(src, alt, className = "study-diagram-image") {
    return `<img class="${className}" src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" loading="lazy" decoding="async">`;
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
    return diagramFrame("Circuit symbol", `<g class="circuit-line">${drawing}</g>`);
  }

  function circuitSeriesSvg() {
    return diagramFrame("Series circuit", `
      <g class="circuit-line revision-circuit">
        <path d="M96 84 H424 V206 H96 Z"/>
        <line x1="126" y1="110" x2="126" y2="180"/><line x1="148" y1="124" x2="148" y2="166"/>
        <circle cx="258" cy="84" r="24"/><line x1="242" y1="68" x2="274" y2="100"/><line x1="274" y1="68" x2="242" y2="100"/>
        <circle cx="340" cy="206" r="24"/><line x1="324" y1="190" x2="356" y2="222"/><line x1="356" y1="190" x2="324" y2="222"/>
      </g>
      <text x="258" y="52" class="diagram-note">lamp A</text>
      <text x="340" y="248" class="diagram-note">lamp B</text>
      ${labelBubble(258, 46, "A")}${labelBubble(340, 244, "B")}
    `);
  }

  function circuitParallelSvg() {
    return diagramFrame("Parallel circuit", `
      <g class="circuit-line revision-circuit">
        <path d="M96 84 H424 V206 H96 Z"/>
        <line x1="126" y1="110" x2="126" y2="180"/><line x1="148" y1="124" x2="148" y2="166"/>
        <line x1="196" y1="84" x2="196" y2="206"/><line x1="348" y1="84" x2="348" y2="206"/>
        <line x1="196" y1="118" x2="348" y2="118"/><line x1="196" y1="172" x2="348" y2="172"/>
        <circle cx="272" cy="118" r="20"/><line x1="258" y1="104" x2="286" y2="132"/><line x1="286" y1="104" x2="258" y2="132"/>
        <circle cx="272" cy="172" r="20"/><line x1="258" y1="158" x2="286" y2="186"/><line x1="286" y1="158" x2="258" y2="186"/>
      </g>
      <text x="272" y="92" class="diagram-note">lamp A</text>
      <text x="272" y="210" class="diagram-note">lamp B</text>
      ${labelBubble(228, 118, "A")}${labelBubble(228, 172, "B")}
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
    return diagramFrame("Circuit diagram", `
      <g class="circuit-line">
        <path d="M95 95 H425 V205 H95 Z" fill="none"/>
        <line x1="105" y1="127" x2="105" y2="168"/><line x1="130" y1="110" x2="130" y2="185"/>
        <circle cx="255" cy="95" r="32"/><text x="255" y="107" class="meter-letter">V</text>
        <circle cx="350" cy="205" r="28"/><line x1="332" y1="187" x2="368" y2="223"/><line x1="368" y1="187" x2="332" y2="223"/>
      </g>
      ${labelBubble(255, 48, "A")}${labelBubble(350, 246, "B")}${labelBubble(118, 92, "C")}
    `);
  }

  function circuitAndSwitchesSvg() {
    return diagramFrame("AND switch circuit", `
      <g class="circuit-line revision-circuit">
        <path d="M90 148 H144 M336 148 H424 V206 H90 Z"/>
        <line x1="116" y1="172" x2="116" y2="206"/><line x1="138" y1="160" x2="138" y2="218"/>
        <circle cx="154" cy="148" r="5"/><circle cx="228" cy="148" r="5"/><line x1="160" y1="144" x2="210" y2="110" class="switch-blade-open"/>
        <circle cx="240" cy="148" r="5"/><circle cx="314" cy="148" r="5"/><line x1="246" y1="144" x2="296" y2="110" class="switch-blade-open"/>
        <circle cx="356" cy="206" r="22"/><line x1="342" y1="192" x2="370" y2="220"/><line x1="370" y1="192" x2="342" y2="220"/>
      </g>
      <text x="190" y="92" class="diagram-note">switch A</text>
      <text x="274" y="92" class="diagram-note">switch B</text>
      ${labelBubble(190, 102, "A")}${labelBubble(274, 102, "B")}
    `);
  }

  function circuitOrSwitchesSvg() {
    return diagramFrame("OR switch circuit", `
      <g class="circuit-line revision-circuit">
        <path d="M90 148 H158 M318 148 H424 V206 H90 Z"/>
        <line x1="116" y1="172" x2="116" y2="206"/><line x1="138" y1="160" x2="138" y2="218"/>
        <path d="M158 148 V102 H318 V148"/>
        <path d="M158 148 V194 H318 V148"/>
        <circle cx="184" cy="102" r="5"/><circle cx="276" cy="102" r="5"/><line x1="190" y1="98" x2="258" y2="66" class="switch-blade-open"/>
        <circle cx="184" cy="194" r="5"/><circle cx="276" cy="194" r="5"/><line x1="190" y1="194" x2="270" y2="194" class="switch-blade-closed"/>
        <circle cx="356" cy="206" r="22"/><line x1="342" y1="192" x2="370" y2="220"/><line x1="370" y1="192" x2="342" y2="220"/>
      </g>
      <text x="232" y="58" class="diagram-note">switch A</text>
      <text x="232" y="236" class="diagram-note">switch B</text>
      ${labelBubble(232, 72, "A")}${labelBubble(232, 222, "B")}
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
    return diagramFrame("Circuit diagram", `
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
    return diagramFrame("Circuit with a short circuit mistake", `
      <g class="circuit-line revision-circuit">
        <path d="M96 95 H424 V205 H96 Z"/>
        <line x1="126" y1="120" x2="126" y2="180"/><line x1="148" y1="132" x2="148" y2="168"/>
        <circle cx="326" cy="205" r="24"/><line x1="310" y1="189" x2="342" y2="221"/><line x1="342" y1="189" x2="310" y2="221"/>
      </g>
      <g class="mistake-line">
        <path d="M178 95 V205"/>
      </g>
      <text x="184" y="150" class="mistake-note">short path</text>
      <text x="326" y="246" class="diagram-note">lamp</text>
      ${labelBubble(178, 150, "A")}${labelBubble(326, 244, "B")}${labelBubble(138, 92, "C")}
    `);
  }

  function circuitShortMistakeBlankSvg() {
    return diagramFrame("Circuit with an extra wire", `
      <g class="circuit-line revision-circuit">
        <path d="M96 95 H424 V205 H96 Z"/>
        <line x1="126" y1="120" x2="126" y2="180"/><line x1="148" y1="132" x2="148" y2="168"/>
        <circle cx="326" cy="205" r="24"/><line x1="310" y1="189" x2="342" y2="221"/><line x1="342" y1="189" x2="310" y2="221"/>
      </g>
      <g class="mistake-line">
        <path d="M178 95 V205"/>
      </g>
      ${labelBubble(178, 150, "A")}${labelBubble(326, 244, "B")}${labelBubble(138, 92, "C")}
    `);
  }

  function circuitComparisonSvg() {
    return diagramFrame("Series and parallel comparison", `
      <g class="circuit-line revision-circuit circuit-mini">
        <text x="150" y="68" class="diagram-note">A</text>
        <path d="M54 88 H236 V198 H54 Z"/>
        <line x1="78" y1="112" x2="78" y2="174"/><line x1="96" y1="124" x2="96" y2="162"/>
        <circle cx="145" cy="88" r="18"/><line x1="133" y1="76" x2="157" y2="100"/><line x1="157" y1="76" x2="133" y2="100"/>
        <circle cx="194" cy="198" r="18"/><line x1="182" y1="186" x2="206" y2="210"/><line x1="206" y1="186" x2="182" y2="210"/>
      </g>
      <text x="145" y="220" class="diagram-note">one loop</text>
      <g class="circuit-line revision-circuit circuit-mini">
        <text x="392" y="68" class="diagram-note">B</text>
        <path d="M286 88 H466 V198 H286 Z"/>
        <line x1="308" y1="112" x2="308" y2="174"/><line x1="326" y1="124" x2="326" y2="162"/>
        <line x1="360" y1="88" x2="360" y2="198"/><line x1="432" y1="88" x2="432" y2="198"/>
        <line x1="360" y1="122" x2="432" y2="122"/><line x1="360" y1="168" x2="432" y2="168"/>
        <circle cx="396" cy="122" r="16"/><line x1="386" y1="112" x2="406" y2="132"/><line x1="406" y1="112" x2="386" y2="132"/>
        <circle cx="396" cy="168" r="16"/><line x1="386" y1="158" x2="406" y2="178"/><line x1="406" y1="158" x2="386" y2="178"/>
      </g>
      <text x="394" y="220" class="diagram-note">two branches</text>
    `);
  }

  function circuitComparisonBlankSvg() {
    return diagramFrame("Circuit comparison", `
      <g class="circuit-line revision-circuit circuit-mini">
        <text x="150" y="68" class="diagram-note">A</text>
        <path d="M54 88 H236 V198 H54 Z"/>
        <line x1="78" y1="112" x2="78" y2="174"/><line x1="96" y1="124" x2="96" y2="162"/>
        <circle cx="145" cy="88" r="18"/><line x1="133" y1="76" x2="157" y2="100"/><line x1="157" y1="76" x2="133" y2="100"/>
        <circle cx="194" cy="198" r="18"/><line x1="182" y1="186" x2="206" y2="210"/><line x1="206" y1="186" x2="182" y2="210"/>
      </g>
      <g class="circuit-line revision-circuit circuit-mini">
        <text x="392" y="68" class="diagram-note">B</text>
        <path d="M286 88 H466 V198 H286 Z"/>
        <line x1="308" y1="112" x2="308" y2="174"/><line x1="326" y1="124" x2="326" y2="162"/>
        <line x1="360" y1="88" x2="360" y2="198"/><line x1="432" y1="88" x2="432" y2="198"/>
        <line x1="360" y1="122" x2="432" y2="122"/><line x1="360" y1="168" x2="432" y2="168"/>
        <circle cx="396" cy="122" r="16"/><line x1="386" y1="112" x2="406" y2="132"/><line x1="406" y1="112" x2="386" y2="132"/>
        <circle cx="396" cy="168" r="16"/><line x1="386" y1="158" x2="406" y2="178"/><line x1="406" y1="158" x2="386" y2="178"/>
      </g>
    `);
  }

  function circuitDualAmmetersSvg() {
    return diagramFrame("Current in a series circuit", `
      <g class="circuit-line revision-circuit">
        <path d="M86 82 H434 V206 H86 Z"/>
        <line x1="246" y1="106" x2="246" y2="184"/><line x1="274" y1="120" x2="274" y2="170"/>
        <circle cx="128" cy="144" r="22"/><text x="128" y="152" class="meter-letter">A</text>
        <circle cx="392" cy="144" r="22"/><text x="392" y="152" class="meter-letter">A</text>
        <circle cx="190" cy="206" r="18"/><line x1="178" y1="194" x2="202" y2="218"/><line x1="202" y1="194" x2="178" y2="218"/>
        <circle cx="260" cy="206" r="18"/><line x1="248" y1="194" x2="272" y2="218"/><line x1="272" y1="194" x2="248" y2="218"/>
        <circle cx="330" cy="206" r="18"/><line x1="318" y1="194" x2="342" y2="218"/><line x1="342" y1="194" x2="318" y2="218"/>
      </g>
      <text x="128" y="114" class="diagram-note">3 A</text>
      <text x="392" y="114" class="diagram-note">?</text>
      <text x="260" y="54" class="diagram-note">3 V cell</text>
    `);
  }

  function circuitParallelXYZSvg() {
    return diagramFrame("Which circuits are parallel?", `
      <g class="circuit-line revision-circuit circuit-mini">
        <text x="100" y="54" class="diagram-note">X</text>
        <path d="M44 80 H160 V196 H44 Z"/>
        <line x1="44" y1="138" x2="160" y2="138"/>
        <line x1="86" y1="116" x2="86" y2="160"/><line x1="104" y1="124" x2="104" y2="152"/>
        <circle cx="102" cy="80" r="16"/><line x1="92" y1="70" x2="112" y2="90"/><line x1="112" y1="70" x2="92" y2="90"/>
        <circle cx="102" cy="196" r="16"/><line x1="92" y1="186" x2="112" y2="206"/><line x1="112" y1="186" x2="92" y2="206"/>
      </g>
      <g class="circuit-line revision-circuit circuit-mini">
        <text x="260" y="54" class="diagram-note">Y</text>
        <path d="M204 80 H320 V196 H204 Z"/>
        <line x1="204" y1="138" x2="320" y2="138"/>
        <line x1="250" y1="104" x2="250" y2="172"/><line x1="266" y1="114" x2="266" y2="162"/>
        <circle cx="262" cy="138" r="16"/><line x1="252" y1="128" x2="272" y2="148"/><line x1="272" y1="128" x2="252" y2="148"/>
        <circle cx="262" cy="196" r="16"/><line x1="252" y1="186" x2="272" y2="206"/><line x1="272" y1="186" x2="252" y2="206"/>
      </g>
      <g class="circuit-line revision-circuit circuit-mini">
        <text x="420" y="54" class="diagram-note">Z</text>
        <path d="M362 80 H478 V196 H362 Z"/>
        <line x1="404" y1="102" x2="404" y2="160"/><line x1="422" y1="114" x2="422" y2="150"/>
        <circle cx="382" cy="80" r="16"/><line x1="372" y1="70" x2="392" y2="90"/><line x1="392" y1="70" x2="372" y2="90"/>
        <circle cx="458" cy="196" r="16"/><line x1="448" y1="186" x2="468" y2="206"/><line x1="468" y1="186" x2="448" y2="206"/>
      </g>
    `);
  }

  function circuitPackMistakesSvg() {
    const mini = (x, y, letter, inner) => `<g transform="translate(${x},${y})"><text x="-90" y="-72" class="diagram-note">${letter}</text><rect x="-100" y="-64" width="200" height="116" rx="18" class="diagram-bg"/><g class="circuit-line revision-circuit">${inner}</g></g>`;
    return diagramFrame("Find the mistakes in the drawings", `
      ${mini(138,92,'A', `<path d="M-54 -20 H54 V34 H-54 Z"/><line x1="4" y1="-34" x2="4" y2="-6"/><line x1="20" y1="-34" x2="20" y2="-6"/><line x1="36" y1="-34" x2="36" y2="-6"/><circle cx="0" cy="34" r="14"/><line x1="-8" y1="26" x2="8" y2="42"/><line x1="8" y1="26" x2="-8" y2="42"/>`)}
      ${mini(382,92,'B', `<line x1="-70" y1="0" x2="-12" y2="0"/><line x1="0" y1="-24" x2="0" y2="24"/><line x1="20" y1="-34" x2="20" y2="34"/><line x1="32" y1="0" x2="72" y2="0"/><text x="-18" y="-18" class="meter-letter">+</text><text x="28" y="-18" class="meter-letter">−</text>`)}
      ${mini(138,226,'C', `<path d="M-54 -22 H54 V34 H-54 Z"/><line x1="6" y1="-36" x2="6" y2="-8"/><line x1="24" y1="-36" x2="24" y2="-8"/><circle cx="-54" cy="6" r="14"/><text x="-54" y="12" class="meter-letter">A</text><circle cx="54" cy="6" r="14"/><text x="54" y="12" class="meter-letter">A</text><circle cx="0" cy="34" r="12"/><line x1="-8" y1="26" x2="8" y2="42"/><line x1="8" y1="26" x2="-8" y2="42"/><text x="-82" y="10" class="diagram-note">0.4 A</text><text x="84" y="10" class="diagram-note">0.5 A</text>`)}
      ${mini(382,226,'D', `<path d="M-54 -22 H54 V34 H-54"/><line x1="6" y1="-36" x2="6" y2="-8"/><line x1="24" y1="-36" x2="24" y2="-8"/><circle cx="-54" cy="6" r="12"/><line x1="-62" y1="-2" x2="-46" y2="14"/><line x1="-46" y1="-2" x2="-62" y2="14"/><circle cx="54" cy="6" r="14"/><text x="54" y="12" class="meter-letter">A</text><circle cx="-4" cy="34" r="4"/><circle cx="34" cy="34" r="4"/><line x1="0" y1="30" x2="24" y2="14"/><text x="84" y="10" class="diagram-note">0.5 A</text>`)}
      ${mini(138,360,'E', `<path d="M-54 -20 H54 V34 H-54 Z"/><circle cx="0" cy="-20" r="12"/><line x1="-8" y1="-28" x2="8" y2="-12"/><line x1="8" y1="-28" x2="-8" y2="-12"/><circle cx="-54" cy="8" r="12"/><line x1="-62" y1="0" x2="-46" y2="16"/><line x1="-46" y1="0" x2="-62" y2="16"/><circle cx="54" cy="8" r="14"/><text x="54" y="14" class="meter-letter">A</text><circle cx="-8" cy="34" r="4"/><circle cx="16" cy="34" r="4"/>`)}
      ${mini(382,360,'F', `<path d="M-54 -20 H54 V34 H-54 Z"/><line x1="6" y1="-34" x2="6" y2="-6"/><line x1="24" y1="-34" x2="24" y2="-6"/><circle cx="-54" cy="8" r="12"/><line x1="-62" y1="0" x2="-46" y2="16"/><line x1="-46" y1="0" x2="-62" y2="16"/><circle cx="0" cy="34" r="12"/><line x1="-8" y1="26" x2="8" y2="42"/><line x1="8" y1="26" x2="-8" y2="42"/><circle cx="54" cy="8" r="14"/><text x="54" y="14" class="meter-letter">A</text><text x="80" y="12" class="diagram-note">0 A</text>`)}
      ${mini(138,494,'G', `<rect x="-30" y="-40" width="80" height="18" rx="6"/><line x1="-10" y1="-38" x2="-2" y2="-24"/><line x1="12" y1="-38" x2="20" y2="-24"/><line x1="34" y1="-38" x2="42" y2="-24"/><path d="M-60 4 C-40 -8,-20 -10,-6 0"/><circle cx="-62" cy="8" r="12"/><circle cx="-14" cy="20" r="12"/><path d="M12 8 C28 4,40 8,56 18"/><circle cx="76" cy="-2" r="4"/><circle cx="96" cy="-2" r="4"/><line x1="80" y1="-6" x2="92" y2="-20"/><path d="M50 -24 C70 -10,78 -6,80 -2"/>`)}
      ${mini(382,494,'H', `<rect x="-30" y="-40" width="80" height="18" rx="6"/><line x1="-10" y1="-38" x2="-2" y2="-24"/><line x1="12" y1="-24" x2="20" y2="-38"/><line x1="34" y1="-38" x2="42" y2="-24"/><path d="M-60 4 C-40 -8,-20 -10,-6 0"/><circle cx="-62" cy="8" r="12"/><circle cx="-14" cy="20" r="12"/><path d="M12 8 C28 4,40 8,56 18"/><circle cx="76" cy="-2" r="4"/><circle cx="96" cy="-2" r="4"/><line x1="80" y1="-6" x2="92" y2="-20"/><path d="M50 -24 C70 -10,78 -6,80 -2"/>`)}
    `, "0 0 520 560");
  }

  function circuitPackFourSvg() {
    const cell = `<line x1="0" y1="-16" x2="0" y2="16"/><line x1="16" y1="-10" x2="16" y2="10"/>`;
    const lampAt = (x, y) => `<circle cx="${x}" cy="${y}" r="12"/><line x1="${x-8}" y1="${y-8}" x2="${x+8}" y2="${y+8}"/><line x1="${x+8}" y1="${y-8}" x2="${x-8}" y2="${y+8}"/>`;
    return diagramFrame("Four circuits A–D", `
      <g class="circuit-line revision-circuit circuit-mini">
        <text x="120" y="46" class="diagram-note">A</text>
        <path d="M62 72 H178 V186 H62 Z"/>
        <g transform="translate(110,72)">${cell}</g>
        <path d="M62 128 H178"/>
        ${lampAt(120,128)}${lampAt(120,186)}
        <circle cx="62" cy="100" r="4"/><circle cx="62" cy="128" r="4"/><line x1="66" y1="104" x2="88" y2="124"/>
      </g>
      <g class="circuit-line revision-circuit circuit-mini">
        <text x="396" y="46" class="diagram-note">B</text>
        <path d="M322 94 H470 V176 H322 Z"/>
        <g transform="translate(372,94)">${cell}</g>
        <circle cx="390" cy="176" r="12"/><line x1="382" y1="168" x2="398" y2="184"/><line x1="398" y1="168" x2="382" y2="184"/>
        <circle cx="430" cy="176" r="12"/><line x1="422" y1="168" x2="438" y2="184"/><line x1="438" y1="168" x2="422" y2="184"/>
        <circle cx="342" cy="176" r="4"/><circle cx="372" cy="176" r="4"/><line x1="346" y1="172" x2="366" y2="156"/>
      </g>
      <g class="circuit-line revision-circuit circuit-mini">
        <text x="120" y="230" class="diagram-note">C</text>
        <path d="M62 248 H178 V362 H62 Z"/>
        ${lampAt(120,248)}${lampAt(120,362)}
        <path d="M62 304 H178"/>
        <g transform="translate(98,304)">${cell}</g>
        <circle cx="126" cy="304" r="4"/><circle cx="162" cy="304" r="4"/><line x1="130" y1="300" x2="150" y2="286"/>
      </g>
      <g class="circuit-line revision-circuit circuit-mini">
        <text x="396" y="230" class="diagram-note">D</text>
        <path d="M332 264 H460 V370 H332 Z"/>
        <g transform="translate(332,316) rotate(90)">${cell}</g>
        ${lampAt(420,316)}${lampAt(388,340)}
        <path d="M388 264 V340"/>
        <circle cx="388" cy="276" r="4"/><circle cx="388" cy="316" r="4"/><line x1="392" y1="280" x2="414" y2="300"/>
      </g>
    `, "0 0 520 420");
  }

  function circuitConceptMapSvg() {
    const bubble = (x,y,w,h,text) => `<g><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="18" class="diagram-bg"/><text x="${x+w/2}" y="${y+h/2+5}" class="diagram-note">${text}</text></g>`;
    return diagramFrame("Electricity concept map", `
      <rect x="48" y="56" width="424" height="54" rx="18" class="palette-bg"/>
      <text x="260" y="78" class="diagram-note">ammeter   amp   bulb   charges   conductor   current   fuse</text>
      <text x="260" y="99" class="diagram-note">heat   insulator   metal   parallel   plastic   resistance   resistor   series   switch   volt   voltage</text>
      ${bubble(204,132,112,40,'electricity')}
      ${bubble(94,198,114,40,'electrons')}
      ${bubble(318,198,132,40,'a complete circuit')}
      ${bubble(64,252,92,40,'current')}
      ${bubble(220,214,106,40,'_____')}
      ${bubble(334,272,110,40,'_____')}
      <g class="circuit-line current-arrows">
        <path d="M260 172 V210" marker-end="url(#arrow)"/>
        <path d="M226 170 C198 176, 176 186, 152 198" marker-end="url(#arrow)"/>
        <path d="M294 170 C322 176, 350 186, 384 198" marker-end="url(#arrow)"/>
        <path d="M120 238 C112 244, 108 248, 104 252" marker-end="url(#arrow)"/>
        <path d="M384 238 C390 248, 392 258, 390 270" marker-end="url(#arrow)"/>
      </g>
      <text x="186" y="183" class="diagram-note">is a flow of</text>
      <text x="334" y="182" class="diagram-note">needs</text>
      <text x="144" y="246" class="diagram-note">called a</text>
      <text x="430" y="258" class="diagram-note">made from</text>
    `, "0 0 520 340");
  }

  function phScaleSvg() {
    const cells = Array.from({ length: 14 }, (_, i) => {
      const x = 52 + i * 29;
      return `<rect x="${x}" y="112" width="29" height="62" rx="5" class="ph ph-${i + 1}"/><text x="${x + 14.5}" y="193" class="small-label">${i + 1}</text>`;
    }).join("");
    return diagramFrame("pH scale", `
      <rect x="44" y="100" width="432" height="86" rx="18" class="palette-bg"/>
      ${cells}
      <line x1="58" y1="104" x2="470" y2="104" class="scale-guide"/>
      <line x1="58" y1="177" x2="470" y2="177" class="scale-guide faint-guide"/>
      ${labelBubble(82, 84, "A")}${labelBubble(260, 84, "B")}${labelBubble(438, 84, "C")}
    `);
  }

  function litmusTestSvg() {
    return diagramFrame("Litmus tests", `
      <rect x="72" y="84" width="142" height="138" rx="18" class="beaker"/><rect x="84" y="154" width="118" height="52" rx="12" class="acid-fill"/>
      <rect x="306" y="84" width="142" height="138" rx="18" class="beaker"/><rect x="318" y="154" width="118" height="52" rx="12" class="alkali-fill"/>
      <rect x="106" y="74" width="18" height="86" rx="6" class="litmus-blue" transform="rotate(-14 115 118)"/>
      <path d="M109 142 l16 10" class="litmus-change-red"/>
      <rect x="386" y="74" width="18" height="86" rx="6" class="litmus-red" transform="rotate(14 395 118)"/>
      <path d="M402 142 l-16 10" class="litmus-change-blue"/>
      ${labelBubble(143, 60, "A")}${labelBubble(377, 60, "B")}
    `);
  }

  function indicatorPaletteSvg() {
    return diagramFrame("Universal indicator", `
      <rect x="84" y="90" width="352" height="104" rx="24" class="palette-bg"/>
      <rect x="112" y="116" width="48" height="52" rx="18" class="indicator-red"/>
      <rect x="174" y="116" width="48" height="52" rx="18" class="indicator-orange"/>
      <rect x="236" y="116" width="48" height="52" rx="18" class="indicator-green"/>
      <rect x="298" y="116" width="48" height="52" rx="18" class="indicator-blue"/>
      <rect x="360" y="116" width="48" height="52" rx="18" class="indicator-purple"/>
      <line x1="112" y1="176" x2="408" y2="176" class="scale-guide faint-guide"/>
      ${labelBubble(136, 86, "A")}${labelBubble(260, 86, "B")}${labelBubble(384, 86, "C")}
    `);
  }

  function neutralisationSetupSvg() {
    return diagramFrame("Neutralisation practical", `
      <rect x="58" y="212" width="404" height="14" rx="7" class="bench-line"/>
      <path d="M124 80 h34 v116 h-34" class="burette"/><line x1="141" y1="196" x2="141" y2="214" class="drip"/><circle cx="141" cy="222" r="4.5" class="drip-dot"/>
      <path d="M225 88 h54 l26 90 q-26 24 -80 0 z" class="flask"/>
      <ellipse cx="252" cy="178" rx="38" ry="14" class="neutral-fill"/>
      <rect x="92" y="116" width="52" height="72" rx="10" class="dropper"/>
      <circle cx="118" cy="198" r="5" class="indicator-purple"/>
      <rect x="354" y="116" width="88" height="72" rx="14" class="beaker"/><rect x="364" y="152" width="68" height="26" rx="9" class="alkali-fill"/>
      <path d="M142 228 Q196 150 252 108" class="guide-arc"/>
      ${labelBubble(118, 92, "A")}${labelBubble(252, 66, "B")}${labelBubble(141, 58, "C")}${labelBubble(398, 92, "D")}
    `);
  }

  function acidSafetyMistakeSvg() {
    return diagramFrame("Lab safety scene", `
      <circle cx="160" cy="92" r="34" class="face"/><path d="M130 76 q30 -42 62 0" class="hair"/>
      <path d="M128 210 q34 -74 72 0" class="labcoat"/><path d="M132 106 q28 18 58 0" class="no-goggles"/>
      <path d="M248 116 l96 -36 l14 34 l-94 36 z" class="acid-bottle"/><text x="304" y="113" class="small-label">acid</text>
      <rect x="340" y="148" width="84" height="76" rx="14" class="beaker"/><rect x="350" y="184" width="64" height="26" rx="8" class="acid-fill"/>
      <path d="M210 145 C250 138, 282 132, 334 120" class="splash"/><circle cx="226" cy="141" r="4" class="drip-dot"/><circle cx="252" cy="135" r="4" class="drip-dot"/>
      ${labelBubble(160, 48, "A")}${labelBubble(304, 72, "B")}${labelBubble(383, 126, "C")}
    `);
  }

  function indicatorMistakeSvg() {
    return diagramFrame("Practical method", `
      <rect x="105" y="86" width="118" height="126" rx="18" class="beaker"/><rect x="116" y="148" width="96" height="46" rx="10" class="acid-fill"/>
      <rect x="292" y="78" width="34" height="112" rx="10" class="dropper"/>
      <circle cx="309" cy="202" r="8" class="indicator-purple"/><circle cx="316" cy="220" r="8" class="indicator-purple"/><circle cx="300" cy="238" r="8" class="indicator-purple"/>
      <path d="M330 120 C370 138, 386 160, 400 188" class="splash"/>
      ${labelBubble(164, 62, "A")}${labelBubble(309, 54, "B")}${labelBubble(396, 168, "C")}
    `);
  }

  function evaporationDishSvg() {
    return diagramFrame("Making salt crystals", `
      <line x1="156" y1="198" x2="344" y2="198" class="bench-line"/>
      <line x1="192" y1="198" x2="168" y2="226" class="support-line"/><line x1="308" y1="198" x2="332" y2="226" class="support-line"/><line x1="168" y1="226" x2="332" y2="226" class="support-line"/>
      <ellipse cx="250" cy="142" rx="114" ry="28" class="dish"/><path d="M136 142 q114 44 228 0" class="dish"/>
      <path d="M172 146 q78 26 156 0" class="solution"/>
      <path d="M224 226 q12 -22 0 -44 q22 12 26 40 q18 -18 2 -40" class="flame"/>
      <path d="M216 108 q-12 -22 0 -38 M250 100 q-12 -22 0 -38 M284 108 q-12 -22 0 -38" class="steam"/>
      ${labelBubble(250, 176, "A")}
    `);
  }

  function dilutionMethodSvg() {
    return diagramFrame("Dilution method", `
      <rect x="98" y="92" width="138" height="128" rx="18" class="beaker"/><rect x="110" y="152" width="114" height="52" rx="10" class="water-fill"/>
      <rect x="330" y="58" width="74" height="132" rx="14" class="beaker" transform="rotate(20 367 124)"/><rect x="341" y="112" width="50" height="42" rx="8" class="acid-fill" transform="rotate(20 367 124)"/>
      <path d="M308 124 C274 138, 244 150, 211 170" class="drip"/><circle cx="275" cy="140" r="5" class="drip-dot"/><circle cx="246" cy="156" r="5" class="drip-dot"/><circle cx="221" cy="170" r="5" class="drip-dot"/>
      <path d="M112 206 H224" class="bench-line"/>
      ${labelBubble(168, 74, "A")}${labelBubble(365, 48, "B")}
    `);
  }

  function elbowJointSvg() {
    return diagramFrame("Elbow joint", `
      <path d="M92 132 C164 104, 236 112, 302 86" class="bone"/>
      <path d="M150 180 C226 146, 286 158, 424 128" class="bone"/>
      <path d="M164 205 C235 177, 302 184, 426 154" class="bone secondary-bone"/>
      <ellipse cx="258" cy="137" rx="45" ry="34" class="cartilage"/>
      <path d="M202 88 C230 116, 236 166, 218 202" class="ligament"/>
      <path d="M314 84 C286 118, 278 160, 298 200" class="tendon"/>
      ${labelBubble(258, 98, "A")}${labelBubble(196, 72, "B")}${labelBubble(318, 70, "C")}
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
    return diagramFrame("Skeleton diagram", `
      <circle cx="260" cy="64" r="30" class="bone-fill"/><path d="M248 78 q12 10 24 0" class="rib-lines"/>
      <path d="M260 98 V190" class="bone"/><path d="M222 118 C242 96 278 96 298 118 M220 142 C244 164 276 164 300 142 M224 164 C246 184 274 184 296 164" class="rib-lines"/>
      <path d="M218 190 C242 170 278 170 302 190 C292 212 228 212 218 190Z" class="bone-fill"/>
      <path d="M226 124 C176 126 145 154 122 190 M294 124 C344 126 375 154 398 190" class="bone"/>
      <path d="M242 210 L212 244 M278 210 L308 244" class="bone"/>
      ${labelBubble(260, 28, "A")}${labelBubble(314, 148, "B")}${labelBubble(260, 116, "C")}
    `);
  }

  function lungsDiaphragmSvg() {
    return diagramFrame("Breathing system", `
      <path d="M260 56 V132" class="airway"/><path d="M260 90 C232 102, 220 116, 208 136" class="airway"/><path d="M260 90 C288 102, 300 116, 312 136" class="airway"/>
      <path d="M202 112 C154 126, 146 222, 232 214 C244 180, 240 142, 202 112" class="lung-left"/>
      <path d="M318 112 C366 126, 374 222, 288 214 C276 180, 280 142, 318 112" class="lung-right"/>
      <path d="M170 90 C154 114, 148 142, 148 176 C148 196, 156 214, 170 228" class="chest-outline"/>
      <path d="M350 90 C366 114, 372 142, 372 176 C372 196, 364 214, 350 228" class="chest-outline"/>
      <path d="M182 104 C160 128, 160 200, 182 220 M338 104 C360 128, 360 200, 338 220" class="rib-lines"/>
      <path d="M165 220 Q260 248 355 220" class="diaphragm"/>
      <path d="M260 28 v24" class="drop-arrow" marker-end="url(#arrow)"/>
      ${labelBubble(260, 54, "A")}${labelBubble(196, 126, "B")}${labelBubble(260, 238, "C")}
    `);
  }

  function alveolusGasExchangeSvg() {
    return diagramFrame("Gas exchange", `
      <circle cx="228" cy="142" r="54" class="alveolus"/>
      <circle cx="262" cy="118" r="28" class="alveolus secondary-alveolus"/>
      <circle cx="270" cy="164" r="24" class="alveolus secondary-alveolus"/>
      <path d="M334 80 C404 98, 412 184, 338 208 C314 216, 304 194, 316 176 C330 154, 330 132, 316 110 C304 92, 312 74, 334 80" class="capillary"/>
      <circle cx="350" cy="108" r="8" class="capillary-cell"/><circle cx="362" cy="142" r="8" class="capillary-cell"/><circle cx="348" cy="176" r="8" class="capillary-cell"/>
      <path d="M224 116 C256 110, 286 106, 324 106" class="oxygen-arrow" marker-end="url(#arrow)"/>
      <path d="M330 180 C296 178, 270 172, 234 164" class="co2-arrow" marker-end="url(#arrow)"/>
      <text x="198" y="106" class="small-label">O₂</text><text x="252" y="194" class="small-label">CO₂</text>
      ${labelBubble(226, 74, "A")}${labelBubble(382, 86, "B")}
    `);
  }

  function alveolusGasExchangeBlankSvg() {
    return diagramFrame("Gas exchange", `
      <circle cx="228" cy="142" r="54" class="alveolus"/>
      <circle cx="262" cy="118" r="28" class="alveolus secondary-alveolus"/>
      <circle cx="270" cy="164" r="24" class="alveolus secondary-alveolus"/>
      <path d="M334 80 C404 98, 412 184, 338 208 C314 216, 304 194, 316 176 C330 154, 330 132, 316 110 C304 92, 312 74, 334 80" class="capillary"/>
      <circle cx="350" cy="108" r="8" class="capillary-cell"/><circle cx="362" cy="142" r="8" class="capillary-cell"/><circle cx="348" cy="176" r="8" class="capillary-cell"/>
      <path d="M224 116 C256 110, 286 106, 324 106" class="oxygen-arrow" marker-end="url(#arrow)"/>
      <path d="M330 180 C296 178, 270 172, 234 164" class="co2-arrow" marker-end="url(#arrow)"/>
      ${labelBubble(226, 74, "A")}${labelBubble(382, 86, "B")}
    `);
  }

  function bloodVesselsSvg() {
    return diagramFrame("Blood vessels", `
      <g transform="translate(56,70)">
        <circle cx="64" cy="72" r="54" class="artery-wall"/><circle cx="64" cy="72" r="28" class="vessel-hole"/>
      </g>
      <g transform="translate(208,80)">
        <ellipse cx="66" cy="62" rx="58" ry="46" class="vein-wall"/><ellipse cx="66" cy="62" rx="36" ry="24" class="vessel-hole"/>
        <path d="M50 46 q16 18 0 32 M82 46 q-16 18 0 32" class="valve"/>
      </g>
      <g transform="translate(370,86)">
        <path d="M0 48 C26 28, 46 28, 76 48 M0 82 C26 62, 46 62, 76 82 M0 116 C26 96, 46 96, 76 116" class="capillary-lines"/>
        <line x1="0" y1="48" x2="0" y2="116" class="capillary-lines"/><line x1="76" y1="48" x2="76" y2="116" class="capillary-lines"/>
        <circle cx="18" cy="66" r="8" class="capillary-cell"/><circle cx="42" cy="100" r="8" class="capillary-cell"/><circle cx="60" cy="66" r="8" class="capillary-cell"/>
      </g>
      ${labelBubble(120, 56, "A")}${labelBubble(274, 56, "B")}${labelBubble(412, 56, "C")}
    `);
  }

  function reactionTimeRulerSvg() {
    const ticks = Array.from({ length: 16 }, (_, i) => {
      const x = 168 + i * 14;
      const long = i % 5 === 0;
      return `<line x1="${x}" y1="82" x2="${x}" y2="${long ? 136 : 116}" class="ruler-tick"/>`;
    }).join("");
    const numbers = [0, 5, 10, 15].map((n, i) => `<text x="${168 + i * 70}" y="154" class="small-label">${n}</text>`).join("");
    return diagramFrame("Reaction time test", `
      <path d="M272 48 v42" class="drop-arrow" marker-end="url(#arrow)"/>
      <rect x="156" y="74" width="226" height="76" rx="10" class="ruler"/>${ticks}${numbers}
      <path d="M246 188 c-40 8 -74 28 -90 52" class="hand"/><path d="M274 188 c42 8 74 28 92 52" class="hand"/>
      <path d="M248 182 h28" class="finger-gap"/>
      ${labelBubble(274, 44, "A")}${labelBubble(262, 174, "B")}
    `);
  }

  function cardDifficulty(card) {
    const value = Number(card?.difficulty || 1);
    return Math.max(1, Math.min(5, Number.isFinite(value) ? value : 1));
  }

  function bossUnlockedLevel() {
    return Math.max(1, Math.min(5, Number(state.progress.bossUnlockedLevel || 1)));
  }

  function bossDifficultyName(level) {
    return ["", "Starter", "Core", "Thinker", "Challenge", "Boss"] [Number(level)] || `Level ${level}`;
  }

  function normaliseBossDifficulty(value = state.bossDifficulty) {
    if (String(value) === "mixed") return "mixed";
    return Math.max(1, Math.min(bossUnlockedLevel(), Number(value) || 1));
  }

  function statusFromLegacy(cardId) {
    if ((state.progress.weakIds || []).includes(cardId)) return "revision";
    if ((state.progress.mastered || []).includes(cardId)) return "complete";
    return "untried";
  }

  function cardStatus(cardOrId) {
    const cardId = typeof cardOrId === "string" ? cardOrId : cardOrId?.id;
    if (!cardId) return "untried";
    const explicit = state.progress.cardStatus?.[cardId];
    if (explicit === "complete" || explicit === "revision" || explicit === "untried") return explicit;
    return statusFromLegacy(cardId);
  }

  function setCardStatus(cardId, status) {
    if (!cardId) return;
    const next = status === "complete" || status === "revision" ? status : "untried";
    state.progress.cardStatus = { ...(state.progress.cardStatus || {}), [cardId]: next };
  }

  function eligibleCardsForStatusCounts(unit = "all", type = "all", difficulty = "mixed") {
    const diff = String(difficulty) === "mixed" ? "mixed" : Math.max(1, Math.min(5, Number(difficulty) || 1));
    const unlocked = bossUnlockedLevel();
    return cards.filter((card) => {
      const unitMatch = unit === "all" || card.unit === unit;
      const typeMatch = !type || type === "all" || card.type === type;
      const level = cardDifficulty(card);
      const levelMatch = diff === "mixed" ? level <= unlocked : level === diff;
      return unitMatch && typeMatch && levelMatch && card.front && card.back;
    });
  }

  function cardStatusCounts(unit = "all", type = "all", difficulty = "mixed") {
    const counts = { untried: 0, complete: 0, revision: 0, total: 0 };
    eligibleCardsForStatusCounts(unit, type, difficulty).forEach((card) => {
      const status = cardStatus(card);
      counts[status] = (counts[status] || 0) + 1;
      counts.total += 1;
    });
    return counts;
  }

  function allContentComplete() {
    return cards.filter((card) => card.front && card.back).every((card) => cardStatus(card) === "complete");
  }

  function bossDifficultyOptions() {
    const unlocked = bossUnlockedLevel();
    return [
      { level: "mixed", label: `Mixed unlocked levels · 1-${unlocked}`, locked: false },
      ...[1, 2, 3, 4, 5].map((level) => ({
        level,
        label: `Level ${level} · ${bossDifficultyName(level)}`,
        locked: level > unlocked,
      })),
    ];
  }

  function bossLevelCounts(unit = state.bossUnit, type = state.bossType) {
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    cards.forEach((card) => {
      const unitMatch = unit === "all" || card.unit === unit;
      const typeMatch = !type || type === "all" || card.type === type;
      if (unitMatch && typeMatch && card.front && card.back && cardStatus(card) !== "complete") counts[cardDifficulty(card)] += 1;
    });
    return counts;
  }

  function renderBossMode() {
    els.quizPanel.classList.add("hidden");
    els.labPanel.classList.add("hidden");
    els.circuitPanel.classList.add("hidden");
    els.cardMetaBar.classList.add("hidden");
    els.flashcard.classList.add("hidden");
    els.buttonRow.classList.add("hidden");
    els.reviewBox.classList.add("hidden");
    els.examPanel.classList.remove("hidden");
    els.feedback.textContent = "";

    if (state.bossFinished) {
      renderBossSummary();
      return;
    }
    if (!state.bossActive) {
      renderBossSetup();
      return;
    }
    renderBossQuestion();
  }

  function renderBossSetup() {
    const units = ["all", ...uniqueValues("unit")];
    const unlocked = bossUnlockedLevel();
    state.bossDifficulty = normaliseBossDifficulty(state.bossDifficulty);
    const available = bossCandidateCards(state.bossUnit, state.bossMix, state.bossType, state.bossDifficulty).length;
    const history = state.progress.bossHistory || [];
    const recent = history.slice(-5).reverse();
    const levelCounts = bossLevelCounts(state.bossUnit, state.bossType);
    const statusCounts = cardStatusCounts(state.bossUnit, state.bossType, state.bossDifficulty);
    const completeAll = allContentComplete();
    const levelPills = [1, 2, 3, 4, 5].map((level) => {
      const locked = level > unlocked;
      const active = Number(state.bossDifficulty) === level;
      return `<span class="boss-level-pill ${active ? "active" : ""} ${locked ? "locked" : ""}">Level ${level}<small>${locked ? "locked" : `${levelCounts[level]} left`}</small></span>`;
    }).join("");
    els.progressFill.style.width = "0%";
    els.examPanel.innerHTML = `
      <section class="boss-card boss-setup-card">
        <div class="boss-topline">
          <div>
            <p class="panel-kicker">Boss Round</p>
            <h3>${completeAll ? "The Master-Blaster challenge is complete." : "Clear every card, not just the easy ones."}</h3>
          </div>
          <span class="boss-lock-badge">${completeAll ? "🏆 Master-Blaster!" : `Level ${unlocked} unlocked`}</span>
        </div>
        <div class="boss-level-strip" aria-label="Boss difficulty levels">${levelPills}</div>
        <div class="card-status-panel" aria-label="Card status">
          <div><strong>${statusCounts.untried}</strong><span>untried</span></div>
          <div><strong>${statusCounts.complete}</strong><span>completed</span></div>
          <div><strong>${statusCounts.revision}</strong><span>need revision</span></div>
          <div><strong>${statusCounts.total}</strong><span>in this set</span></div>
        </div>
        ${completeAll ? `<div class="master-blaster-card">🏆 <strong>The Master-Blaster!</strong><span>Every card has been completed successfully.</span></div>` : ""}
        <div class="boss-setup-grid compact-boss-grid">
          <label>Level
            <select id="bossDifficultySelect">
              ${bossDifficultyOptions().map((option) => `<option value="${option.level}" ${String(option.level) === String(state.bossDifficulty) ? "selected" : ""} ${option.locked ? "disabled" : ""}>${escapeHtml(option.label)}${option.locked ? " · locked" : ""}</option>`).join("")}
            </select>
          </label>
          <label>Topic
            <select id="bossUnitSelect">
              ${units.map((unit) => `<option value="${escapeHtml(unit)}" ${unit === state.bossUnit ? "selected" : ""}>${escapeHtml(unit === "all" ? "All topics" : unit)}</option>`).join("")}
            </select>
          </label>
          <label>Length
            <select id="bossLengthSelect">
              ${[10, 20, 30].map((length) => `<option value="${length}" ${length === state.bossLength ? "selected" : ""}>${length} questions</option>`).join("")}
            </select>
          </label>
          <label>Card type
            <select id="bossTypeSelect">
              ${bossTypeOptions().map((option) => `<option value="${escapeHtml(option.value)}" ${option.value === state.bossType ? "selected" : ""}>${escapeHtml(option.label)}</option>`).join("")}
            </select>
          </label>
          <label>Question mix
            <select id="bossMixSelect">
              <option value="balanced" ${state.bossMix === "balanced" ? "selected" : ""}>Balanced incomplete cards</option>
              <option value="revision" ${state.bossMix === "revision" ? "selected" : ""}>Revision only</option>
              <option value="weak" ${state.bossMix === "weak" ? "selected" : ""}>Weak review focus</option>
              <option value="visual" ${state.bossMix === "visual" ? "selected" : ""}>Visual heavy</option>
              <option value="exam" ${state.bossMix === "exam" ? "selected" : ""}>Exam-style heavy</option>
            </select>
          </label>
        </div>
        <div class="boss-history-panel">
          <h4>Test history</h4>
          ${recent.length ? `<div class="boss-history-list">${recent.map((item) => `<span class="boss-history-pill">L${escapeHtml(item.difficulty || "?")} · ${escapeHtml(item.date || "Round")} · ${item.correct}/${item.total} · ${item.accuracy}%</span>`).join("")}</div>` : `<p>No saved Boss Rounds yet.</p>`}
        </div>
        <div class="boss-actions">
          <button class="primary-button boss-start" type="button" ${available ? "" : "disabled"}>Let’s GO</button>
          <span class="boss-available">${available} unfinished question${available === 1 ? "" : "s"} available</span>
        </div>
      </section>
    `;
    wireBossSetup();
  }

  function wireBossSetup() {
    const difficultySelect = els.examPanel.querySelector("#bossDifficultySelect");
    const unitSelect = els.examPanel.querySelector("#bossUnitSelect");
    const lengthSelect = els.examPanel.querySelector("#bossLengthSelect");
    const typeSelect = els.examPanel.querySelector("#bossTypeSelect");
    const mixSelect = els.examPanel.querySelector("#bossMixSelect");
    difficultySelect?.addEventListener("change", (event) => {
      state.bossDifficulty = normaliseBossDifficulty(event.target.value);
      renderBossSetup();
    });
    unitSelect?.addEventListener("change", (event) => {
      state.bossUnit = event.target.value;
      renderBossSetup();
    });
    lengthSelect?.addEventListener("change", (event) => {
      state.bossLength = Number(event.target.value) || 10;
      renderBossSetup();
    });
    typeSelect?.addEventListener("change", (event) => {
      state.bossType = event.target.value;
      renderBossSetup();
    });
    mixSelect?.addEventListener("change", (event) => {
      state.bossMix = event.target.value;
      renderBossSetup();
    });
    els.examPanel.querySelector(".boss-start")?.addEventListener("click", startBossRound);
  }

  function bossTypeOptions() {
    return [
      { value: "all", label: "All cards" },
      { value: "Vocabulary", label: "Vocabulary" },
      { value: "Equation/relationship", label: "Equations" },
      { value: "Self-test", label: "Self-test" },
      { value: "Multiple choice", label: "Multiple choice" },
      { value: "Visual challenge", label: "Visual challenge" },
      { value: "Practical method", label: "Practical method" },
      { value: "Spot the mistake", label: "Spot the mistake" },
      { value: "Exam-style question", label: "Exam-style" },
    ];
  }

  function bossCandidateCards(unit = state.bossUnit, mix = state.bossMix, type = state.bossType, difficulty = state.bossDifficulty) {
    const diff = normaliseBossDifficulty(difficulty);
    const unlocked = bossUnlockedLevel();
    const pool = cards.filter((card) => {
      const unitMatch = unit === "all" || card.unit === unit;
      const typeMatch = !type || type === "all" || card.type === type;
      const level = cardDifficulty(card);
      const levelMatch = diff === "mixed" ? level <= unlocked : level === diff;
      const status = cardStatus(card);
      const statusMatch = mix === "revision" ? status === "revision" : status !== "complete";
      return unitMatch && typeMatch && levelMatch && statusMatch && card.front && card.back;
    });

    const statusOrder = { untried: 0, revision: 1, complete: 2 };
    const sortByStatus = (items) => [...items].sort((a, b) => {
      const statusDiff = (statusOrder[cardStatus(a)] ?? 9) - (statusOrder[cardStatus(b)] ?? 9);
      if (statusDiff) return statusDiff;
      return cardDifficulty(a) - cardDifficulty(b);
    });

    if (mix === "revision") return sortByStatus(pool);
    if (mix === "weak") {
      const weak = pool.filter((card) => (state.progress.weakIds || []).includes(card.id) || cardStatus(card) === "revision");
      return weak.length ? sortByStatus([...weak, ...pool.filter((card) => !weak.includes(card))]) : sortByStatus(pool);
    }
    if (mix === "visual") {
      const visual = pool.filter((card) => Boolean(card.visual) || visualLabTypes.has(card.type));
      return visual.length ? sortByStatus([...visual, ...pool.filter((card) => !visual.includes(card))]) : sortByStatus(pool);
    }
    if (mix === "exam") {
      const exam = pool.filter((card) => card.type === "Exam-style question" || card.type === "Practical method" || card.type === "Spot the mistake");
      return exam.length ? sortByStatus([...exam, ...pool.filter((card) => !exam.includes(card))]) : sortByStatus(pool);
    }
    return sortByStatus(pool);
  }

  function startBossRound() {
    state.bossDifficulty = normaliseBossDifficulty(state.bossDifficulty);
    const pool = bossCandidateCards();
    if (!pool.length) return;
    const selected = selectBossCards(pool, state.bossLength, state.bossMix);
    state.bossDeck = selected.map((card) => ({
      cardId: card.id,
      difficulty: cardDifficulty(card),
      choices: bossChoicesForCard(card, pool),
    }));
    state.bossAnswers = [];
    state.bossIndex = 0;
    state.bossActive = true;
    state.bossFinished = false;
    state.bossSaved = false;
    render();
  }

  function selectBossCards(pool, length, mix) {
    const copy = [...pool];
    const take = (items) => items.slice(0, Math.min(length, items.length));
    if (mix !== "balanced") return take(copy);

    const groups = [
      copy.filter((card) => card.type === "Multiple choice"),
      copy.filter((card) => Boolean(card.visual) || visualLabTypes.has(card.type)),
      copy.filter((card) => card.type === "Equation/relationship"),
      copy.filter((card) => card.type === "Exam-style question" || card.type === "Practical method" || card.type === "Spot the mistake"),
      copy.filter((card) => card.type === "Vocabulary" || card.type === "Self-test"),
    ].map((group) => [...new Set(group)]);

    const selected = [];
    let guard = 0;
    while (selected.length < length && selected.length < copy.length && guard < 500) {
      for (const group of groups) {
        const next = group.find((card) => !selected.includes(card));
        if (next) selected.push(next);
        if (selected.length >= length || selected.length >= copy.length) break;
      }
      guard += 1;
    }
    for (const card of copy) {
      if (selected.length >= length) break;
      if (!selected.includes(card)) selected.push(card);
    }
    return selected.slice(0, Math.min(length, selected.length));
  }

  function bossChoicesForCard(card, pool) {
    let choices = explicitChoices(card);
    const candidates = pool
      .filter((candidate) => candidate.id !== card.id)
      .map((candidate) => candidate.back)
      .filter((answer) => answer && answer !== card.back);
    shuffleArray(candidates);
    for (const candidate of candidates) {
      if (choices.length >= 4) break;
      if (!choices.includes(candidate)) choices.push(candidate);
    }
    choices = [...new Set([card.back, ...choices])].slice(0, 4);
    shuffleArray(choices);
    return choices;
  }

  function currentBossItem() {
    return state.bossDeck[state.bossIndex] || null;
  }

  function cardById(id) {
    return cards.find((card) => card.id === id) || null;
  }

  function renderBossQuestion() {
    const item = currentBossItem();
    const card = item ? cardById(item.cardId) : null;
    if (!item || !card) {
      finishBossRound();
      return;
    }
    const answer = state.bossAnswers[state.bossIndex] || null;
    const progressPercent = state.bossDeck.length ? ((state.bossIndex + 1) / state.bossDeck.length) * 100 : 0;
    els.progressFill.style.width = `${progressPercent}%`;
    const visualHtml = card.visual ? renderVisual(card.visual) : "";
    els.examPanel.innerHTML = `
      <section class="boss-card boss-question-card ${answer ? "answered" : ""}">
        <div class="boss-topline">
          <div>
            <p class="panel-kicker">Level ${cardDifficulty(card)} · Question ${state.bossIndex + 1} / ${state.bossDeck.length}</p>
            <h3>${escapeHtml(card.front)}</h3>
          </div>
          <button class="danger-soft boss-bail" type="button">Bail out</button>
        </div>
        ${visualHtml ? `<div class="boss-visual">${visualHtml}</div>` : ""}
        <div class="boss-answer-grid">
          ${item.choices.map((choice, index) => {
            const isCorrect = choice === card.back;
            const wasPicked = answer?.selected === choice;
            return `<button class="answer-button boss-answer ${answer ? "locked" : ""} ${answer && isCorrect ? "correct" : ""} ${answer && wasPicked && !isCorrect ? "wrong" : ""}" type="button" data-choice="${escapeHtml(choice)}" ${answer ? "disabled" : ""}><strong>${index + 1}.</strong> ${escapeHtml(choice)}</button>`;
          }).join("")}
        </div>
        <p class="boss-feedback" aria-live="polite">${answer ? (answer.correct ? "Correct." : `Not quite. Correct answer: ${escapeHtml(card.back)}`) : "Choose your answer."}</p>
        <div class="boss-actions">
          <button class="secondary-button boss-next-question" type="button" ${answer ? "" : "disabled"}>${state.bossIndex + 1 >= state.bossDeck.length ? "Finish round" : "Next question"}</button>
        </div>
      </section>
    `;
    wireBossQuestion(card);
  }

  function wireBossQuestion(card) {
    els.examPanel.querySelectorAll(".boss-answer").forEach((button) => {
      button.addEventListener("click", () => answerBossQuestion(card, button.dataset.choice || ""));
    });
    els.examPanel.querySelector(".boss-next-question")?.addEventListener("click", () => {
      if (!state.bossAnswers[state.bossIndex]) return;
      if (state.bossIndex + 1 >= state.bossDeck.length) {
        finishBossRound();
      } else {
        state.bossIndex += 1;
        render();
      }
    });
    els.examPanel.querySelector(".boss-bail")?.addEventListener("click", bailOutBossRound);
  }

  function answerBossQuestion(card, selected) {
    if (state.bossAnswers[state.bossIndex]) return;
    const correct = selected === card.back;
    state.bossAnswers[state.bossIndex] = { cardId: card.id, selected, correct };
    if (correct) {
      playTone("correct");
    } else {
      playTone("wrong");
    }
    render();
  }

  function finishBossRound() {
    state.bossActive = false;
    state.bossFinished = true;
    state.bossSaved = false;
    els.progressFill.style.width = "100%";
    render();
  }

  function bailOutBossRound() {
    const confirmed = window.confirm("Are you sure you want to quit this Boss Round? This score will not be saved.");
    if (!confirmed) return;
    resetBossRound();
    render();
  }

  function resetBossRound() {
    state.bossActive = false;
    state.bossFinished = false;
    state.bossDeck = [];
    state.bossAnswers = [];
    state.bossIndex = 0;
    state.bossSaved = false;
  }

  function bossRoundStats() {
    const total = state.bossDeck.length;
    const correct = state.bossAnswers.filter((answer) => answer?.correct).length;
    const review = Math.max(0, total - correct);
    const accuracy = total ? Math.round((correct / total) * 100) : 0;
    const perfect = total > 0 && correct === total;
    const difficulty = normaliseBossDifficulty(state.bossDifficulty);
    const xpLevel = difficulty === "mixed" ? bossUnlockedLevel() : difficulty;
    const canUnlock = perfect && difficulty !== "mixed" && difficulty === bossUnlockedLevel() && difficulty < 5;
    const nextLevel = canUnlock ? difficulty + 1 : bossUnlockedLevel();
    const xp = correct * (8 + xpLevel * 2) + (perfect ? 30 + xpLevel * 10 : accuracy >= 80 ? 15 : 0);
    return { total, correct, review, accuracy, xp, perfect, difficulty, canUnlock, nextLevel };
  }

  function renderBossSummary() {
    const stats = bossRoundStats();
    const remainingAfterRound = Math.max(0, cardStatusCounts(state.bossUnit, state.bossType, state.bossDifficulty).untried + cardStatusCounts(state.bossUnit, state.bossType, state.bossDifficulty).revision - stats.correct);
    const recommendation = stats.perfect
      ? (stats.canUnlock ? `Level ${stats.nextLevel} unlocked after saving` : (remainingAfterRound ? "Keep clearing unfinished cards" : "This set is cleared"))
      : "Save the score to move missed cards into revision";
    els.examPanel.innerHTML = `
      <section class="boss-card boss-summary-card">
        <p class="panel-kicker">${stats.difficulty === "mixed" ? "Mixed levels" : `Level ${stats.difficulty}`} Boss Round Complete</p>
        <h3>${stats.perfect ? "Perfect round!" : `Score: ${stats.correct} / ${stats.total}`}</h3>
        <div class="boss-score-grid">
          <div><strong>${stats.accuracy}%</strong><span>accuracy</span></div>
          <div><strong>${stats.xp}</strong><span>XP ready</span></div>
          <div><strong>${stats.correct}</strong><span>mastered</span></div>
          <div><strong>${stats.review}</strong><span>review</span></div>
        </div>
        <p class="boss-recommendation">${stats.perfect && stats.difficulty !== "mixed" ? "You earned the level-up check." : "Your card statuses will update when saved."} <strong>${escapeHtml(recommendation)}</strong></p>
        <div class="boss-actions">
          <button class="primary-button boss-save-score" type="button" ${state.bossSaved ? "disabled" : ""}>${state.bossSaved ? "Score saved" : "Save score"}</button>
          <button class="danger-soft boss-forget-score" type="button">Forget this ever happened</button>
        </div>
      </section>
    `;
    els.examPanel.querySelector(".boss-save-score")?.addEventListener("click", saveBossScore);
    els.examPanel.querySelector(".boss-forget-score")?.addEventListener("click", () => {
      resetBossRound();
      render();
    });
  }

  function saveBossScore() {
    if (state.bossSaved) return;
    const stats = bossRoundStats();
    const weakIds = new Set(state.progress.weakIds || []);
    const mastered = new Set(state.progress.mastered || []);
    state.progress.attempted += stats.total;
    state.progress.correct += stats.correct;
    state.progress.xp += stats.xp;
    if (stats.correct === stats.total) {
      state.progress.currentStreak += stats.correct;
    } else {
      state.progress.currentStreak = 0;
    }
    state.progress.bestStreak = Math.max(state.progress.bestStreak || 0, state.progress.currentStreak || 0);
    const seenIds = new Set(state.progress.bossSeenIds || []);
    state.bossAnswers.forEach((answer) => {
      if (!answer?.cardId) return;
      seenIds.add(answer.cardId);
      if (answer.correct) {
        weakIds.delete(answer.cardId);
        mastered.add(answer.cardId);
        setCardStatus(answer.cardId, "complete");
      } else {
        weakIds.add(answer.cardId);
        mastered.delete(answer.cardId);
        setCardStatus(answer.cardId, "revision");
      }
    });
    const completions = { ...(state.progress.bossLevelCompletions || {}) };
    const levelKey = String(stats.difficulty);
    const prior = completions[levelKey] || { attempts: 0, perfect: 0, best: 0 };
    completions[levelKey] = {
      attempts: (prior.attempts || 0) + 1,
      perfect: (prior.perfect || 0) + (stats.perfect ? 1 : 0),
      best: Math.max(prior.best || 0, stats.accuracy),
    };
    state.progress.bossLevelCompletions = completions;
    if (stats.canUnlock) {
      state.progress.bossUnlockedLevel = Math.max(bossUnlockedLevel(), stats.nextLevel);
      state.bossDifficulty = stats.nextLevel;
    }
    state.progress.weakIds = [...weakIds].slice(-220);
    state.progress.mastered = [...mastered];
    state.progress.bossSeenIds = [...seenIds].slice(-1000);
    state.progress.masterBlasterEarned = allContentComplete();
    state.progress.bossHistory = [
      ...(state.progress.bossHistory || []),
      {
        date: new Date().toLocaleDateString(undefined, { month: "short", day: "numeric" }),
        total: stats.total,
        correct: stats.correct,
        accuracy: stats.accuracy,
        xp: stats.xp,
        difficulty: stats.difficulty,
        unlocked: stats.canUnlock ? stats.nextLevel : bossUnlockedLevel(),
        unit: state.bossUnit,
        type: state.bossType,
        mix: state.bossMix,
        ids: state.bossDeck.map((item) => item.cardId),
      },
    ].slice(-30);
    state.bossSaved = true;
    saveProgress();
    celebrate();
    renderStats();
    renderBadges();
    renderBossSummary();
  }

  function render() {
    document.body.classList.toggle("calm", state.progress.calm);
    document.body.classList.toggle("fun", !state.progress.calm);
    document.body.classList.toggle("boss-session-active", state.mode === "boss" && state.bossActive);
    document.body.classList.toggle("boss-mode-screen", state.mode === "boss");
    document.body.classList.toggle("written-exam-session-active", state.mode === "writtenExam" && state.writtenExamActive && !state.writtenExamSubmitted);
    const card = currentCard();
    const deck = deckCards();
    const labDeck = filteredLabGames();
    const circuitDeck = filteredCircuitGames();
    const examDeck = filteredExamQuestions();

    renderStats();
    renderBadges();
    renderModeChrome(state.mode === "lab" ? labDeck.length : state.mode === "circuit" ? circuitDeck.length : state.mode === "exam" ? examDeck.length : state.mode === "writtenExam" ? writtenExamTotalQuestions() : state.mode === "boss" ? (state.bossActive ? state.bossDeck.length : bossCandidateCards().length) : deck.length);
    updateToggleButtons();

    if (state.mode === "boss") {
      renderBossMode();
      return;
    }
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
    if (state.mode === "writtenExam") {
      renderWrittenExamMode();
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
    els.cardCue.textContent = card.cue || "";
    els.frontHint.textContent = isQuizMode() ? "Choose an answer below." : "Tap the card to flip it.";
    setModeTip(tips[(state.index + state.sessionAnswered) % tips.length]);

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
      quiz: ["Multiple choice", "Pick the best answer and build confidence before Boss Mode."],
      equations: ["Equation arena", "Memorise equations and science relationships."],
      visual: ["Visual lab", "Practise diagrams, symbols, practical methods, and spot-the-mistake questions."],
      lab: ["Label lab", "Drag or tap labels onto diagrams to prove you can recognise the science parts."],
      circuit: ["Circuit builder", "Tap or drag components into the circuit slots, then test whether your circuit works."],
      exam: ["Exam coach", "Practise mark-scheme answers, practical methods, and explanation questions."],
      writtenExam: ["Written exam", "15 written questions: 5 from each unit, with answers locked until submission."],
      weak: ["Weak review", "Reviewing cards marked Further review or previously missed. Clear them by answering correctly."],
      boss: [state.bossActive ? `Boss Round · ${state.bossDeck.length} cards` : "Boss round", state.bossActive ? "" : "Build your test set."],
    };
    const [kicker, title] = modeNames[state.mode] || modeNames.study;
    els.modeKicker.textContent = `${kicker} · ${count} card${count === 1 ? "" : "s"}`;
    els.workspaceTitle.textContent = title;

    els.modeButtons.forEach((button) => {
      button.classList.toggle("active", button.dataset.mode === state.mode);
    });
    updateHomeModeButtons();
  }

  function updateHomeModeButtons() {
    els.heroModeButtons.forEach((button) => {
      button.classList.toggle("active-launch", button.dataset.setMode === state.mode && state.mode !== "boss");
    });
    els.homePracticeButton?.classList.toggle("active-launch", state.mode !== "boss" && state.mode !== "writtenExam");
    els.homeExamButton?.classList.toggle("active-launch", state.mode === "writtenExam");
    els.homeBossButton?.classList.toggle("active-launch", state.mode === "boss");
    syncHomeTopicButtons();
  }

  function renderStats() {
    els.xpValue.textContent = String(state.progress.xp);
    els.scoreValue.textContent = `${accuracy()}%`;
    els.streakValue.textContent = String(state.progress.currentStreak);
    els.masteredValue.textContent = String(cardStatusCounts("all", "all", "mixed").complete);

    const level = Math.floor(state.progress.xp / 100) + 1;
    const levelProgress = state.progress.xp % 100;
    els.levelMeter.style.width = `${levelProgress}%`;
    els.levelNote.textContent = `Level ${level}: ${100 - levelProgress} XP until the next level. Boss Round scores earn XP.`;

    const remaining = Math.max(0, 10 - state.sessionAnswered);
    els.missionTitle.textContent = remaining
      ? `Answer ${remaining} more question${remaining === 1 ? "" : "s"}`
      : "Mission complete! Keep going!";
  }

  function renderBadges() {
    const unlocked = badgeRules.filter((rule) => rule.unlocked(state.progress));
    const badges = unlocked.map((badge) => badge.label);
    if (state.progress.masterBlasterEarned || allContentComplete()) badges.push("🏆 The Master-Blaster!");
    if (!badges.length) {
      els.badges.innerHTML = `<span class="badge">🔒 Earn your first badge</span>`;
      return;
    }
    els.badges.innerHTML = badges.map((label) => `<span class="badge ${label.includes("Master-Blaster") ? "master-blaster-badge" : ""}">${label}</span>`).join("");
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
      choices = buildSmartGeneratedChoices(card, deck);
    }

    choices = dedupeAnswers(choices).slice(0, 4);
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

  function buildSmartGeneratedChoices(card, deck = []) {
    const correct = String(card?.back || "").trim();
    const wrongAnswers = [];
    const pools = buildDistractorPools(card, deck);

    pools.forEach((pool) => {
      if (wrongAnswers.length >= 3) return;
      const answers = pool
        .map((candidate) => String(candidate?.back || "").trim())
        .filter(Boolean)
        .filter((answer) => normaliseAnswer(answer) !== normaliseAnswer(correct));
      shuffleArray(answers);
      answers.forEach((answer) => addUniqueAnswer(wrongAnswers, answer, correct));
    });

    return [correct, ...wrongAnswers.slice(0, 3)];
  }

  function buildDistractorPools(card, deck = []) {
    const candidateCards = cards.filter((candidate) => isDistractorCandidate(candidate, card));
    const deckCards = Array.isArray(deck) ? deck.filter((candidate) => isDistractorCandidate(candidate, card)) : [];
    const family = questionFamily(card);

    const sameUnitSameType = candidateCards.filter((candidate) => candidate.unit === card.unit && candidate.type === card.type);
    const sameUnitSameFamily = candidateCards.filter((candidate) => candidate.unit === card.unit && questionFamily(candidate) === family);
    const sameUnitDeck = deckCards.filter((candidate) => candidate.unit === card.unit);
    const sameUnitAny = candidateCards.filter((candidate) => candidate.unit === card.unit);
    const sameTypeAnyUnit = candidateCards.filter((candidate) => candidate.type === card.type);

    // Priority matters. Even in Boss Mode, generated distractors should stay within the same unit first.
    // Otherwise Year 7 vocabulary cards become trivial, e.g. "conductor" offered against heart/bone definitions.
    return [sameUnitSameType, sameUnitSameFamily, sameUnitDeck, sameUnitAny, sameTypeAnyUnit, candidateCards];
  }

  function isDistractorCandidate(candidate, card) {
    if (!candidate || !card) return false;
    if (candidate.id === card.id) return false;
    const answer = String(candidate.back || "").trim();
    if (!answer) return false;
    return normaliseAnswer(answer) !== normaliseAnswer(card.back || "");
  }

  function questionFamily(card) {
    const type = String(card?.type || "").toLowerCase();
    if (type.includes("vocabulary")) return "vocabulary";
    if (type.includes("equation")) return "equation";
    if (type.includes("visual") || type.includes("spot") || type.includes("practical")) return "visual-practical";
    if (type.includes("self")) return "explain";
    return type || "general";
  }

  function addUniqueAnswer(list, answer, correct = "") {
    const key = normaliseAnswer(answer);
    if (!key || key === normaliseAnswer(correct)) return;
    if (list.some((item) => normaliseAnswer(item) === key)) return;
    list.push(answer);
  }

  function dedupeAnswers(values) {
    const seen = new Set();
    return values.filter((value) => {
      const key = normaliseAnswer(value);
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  function normaliseAnswer(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/[“”]/g, '"')
      .replace(/[‘’]/g, "'")
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
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
    recordAttempt(card, correct, { source: "quiz" });

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

  function recordAttempt(card, correct, options = {}) {
    state.progress.attempted += 1;
    state.sessionAnswered += 1;

    const weakIds = new Set(state.progress.weakIds || []);
    const mastered = new Set(state.progress.mastered || []);
    if (correct) {
      if (weakIds.has(card.id)) {
        weakIds.delete(card.id);
        state.progress.weakSolved = (state.progress.weakSolved || 0) + 1;
      }
      state.progress.correct += 1;
      state.sessionCorrect += 1;
      state.progress.currentStreak += 1;
      state.progress.bestStreak = Math.max(state.progress.bestStreak, state.progress.currentStreak);
      if (options.awardXp) {
        const bonus = card.type === "Equation/relationship" ? 15 : 10;
        const streakBonus = Math.min(10, state.progress.currentStreak);
        state.progress.xp += bonus + streakBonus;
      }
      mastered.add(card.id);
      setCardStatus(card.id, "complete");
      if (options.source === "mastered-button") {
        state.sessionMastered += 1;
      }
    } else {
      weakIds.add(card.id);
      mastered.delete(card.id);
      setCardStatus(card.id, "revision");
      state.sessionNeedsReview += 1;
      state.progress.currentStreak = 0;
    }
    state.progress.weakIds = [...weakIds].slice(-220);
    state.progress.mastered = [...mastered];
    state.progress.masterBlasterEarned = allContentComplete();
    saveProgress();
  }

  function markKnown() {
    const card = currentCard();
    if (!card) return;
    recordAttempt(card, true, { source: "mastered-button" });
    state.flipped = true;
    celebrate();
    bounce(els.flashcard);
    render();
  }

  function markNeedsPractice() {
    const card = currentCard();
    if (!card) return;
    recordAttempt(card, false, { source: "further-review-button" });
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
    const previousMode = state.mode;
    if (state.bossActive && mode !== "boss") {
      const confirmed = window.confirm("Are you sure you want to quit this Boss Round? This score will not be saved.");
      if (!confirmed) return;
      resetBossRound();
    }
    if (mode !== "writtenExam" && writtenExamNeedsQuitConfirmation()) {
      const confirmed = window.confirm("Are you sure you want to quit this written exam? Your answers for this exam will be cleared.");
      if (!confirmed) return;
      resetWrittenExamRound();
    }
    state.mode = mode;
    state.sessionAnswered = 0;
    state.sessionCorrect = 0;
    state.sessionMastered = 0;
    state.sessionNeedsReview = 0;
    if (mode === "boss") {
      state.type = "all";
      state.bossActive = false;
      state.bossFinished = false;
      state.bossDeck = [];
      state.bossAnswers = [];
      state.bossIndex = 0;
      state.bossSaved = false;
      if (els.unitFilter) els.unitFilter.value = state.unit;
      if (els.typeFilter) els.typeFilter.value = "all";
    }
    if (mode === "equations") {
      state.type = "Equation/relationship";
      els.typeFilter.value = "Equation/relationship";
    }
    if (mode === "visual" || mode === "lab" || mode === "circuit" || mode === "exam" || mode === "writtenExam" || mode === "weak") {
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
    if (mode === "writtenExam") {
      state.unit = "all";
      if (els.unitFilter) els.unitFilter.value = "all";
      if (previousMode !== "writtenExam" && state.writtenExamSubmitted) resetWrittenExamRound();
      if (!state.writtenExamActive && !state.writtenExamSubmitted) resetWrittenExamRound();
    }
    rebuildDeck({ shuffle: true });
  }

  function speakCurrentCard() {
    if (state.mode === "writtenExam") {
      const firstQuestion = state.writtenExamDeck[0] || selectWrittenExamQuestions()[0];
      if (!firstQuestion || !("speechSynthesis" in window)) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(`Written exam. ${firstQuestion.prompt}`);
      utterance.rate = state.progress.calm ? 0.82 : 0.92;
      utterance.pitch = state.progress.calm ? 0.95 : 1.05;
      window.speechSynthesis.speak(utterance);
      return;
    }
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
    setModeTip("Tap a label, then tap a coloured light. A thin wire shows the connection without covering the diagram.");

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
            ${renderLabWireLayer(game)}
            ${game.targets.map((target, index) => renderLabTarget(target, index)).join("")}
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

  function labTargetColour(index) {
    return `lab-colour-${index % 8}`;
  }

  function labWireAnchor(target, index) {
    const side = target.anchorSide || (target.x < 42 ? "left" : target.x > 58 ? "right" : index % 2 ? "right" : "left");
    const rawY = Number.isFinite(target.anchorY) ? target.anchorY : 14 + index * 15;
    const y = Math.min(94, Math.max(6, rawY));
    return { side, x: side === "left" ? 7 : 93, y };
  }

  function renderLabWireLayer(game) {
    const placedTargets = game.targets
      .map((target, index) => ({ target, index, label: state.labAnswers[target.id] || "" }))
      .filter((item) => item.label);
    if (!placedTargets.length) return `<svg class="lab-wire-layer" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"></svg>`;

    const lines = placedTargets.map(({ target, index }) => {
      const anchor = labWireAnchor(target, index);
      const colour = labTargetColour(index);
      const midX = anchor.side === "left" ? Math.min(target.x - 8, 32) : Math.max(target.x + 8, 68);
      return `<path class="lab-wire ${colour}" d="M ${anchor.x} ${anchor.y} C ${midX} ${anchor.y}, ${midX} ${target.y}, ${target.x} ${target.y}"/>`;
    }).join("");

    const tags = placedTargets.map(({ target, index, label }) => {
      const anchor = labWireAnchor(target, index);
      const colour = labTargetColour(index);
      const width = Math.min(28, Math.max(13, label.length * 1.45 + 7));
      const x = anchor.side === "left" ? 1.8 : 98.2 - width;
      return `
        <div class="lab-wire-tag ${colour} ${anchor.side}" style="left:${x}%;top:${anchor.y}%">
          <span class="wire-dot" aria-hidden="true"></span>${escapeHtml(label)}
        </div>`;
    }).join("");

    return `
      <svg class="lab-wire-layer" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${lines}</svg>
      ${tags}
    `;
  }

  function renderLabTarget(target, index) {
    const placed = state.labAnswers[target.id] || "";
    const colour = labTargetColour(index);
    const label = placed ? `${placed} connected to target` : "Connect selected label to this target";
    const targetStyle = `left:${target.x}%;top:${target.y}%`;
    return `
      <button class="lab-target ${colour} ${placed ? "filled" : ""}" type="button" data-target-id="${escapeHtml(target.id)}" title="${escapeHtml(label)}" aria-label="${escapeHtml(label)}" style="${targetStyle}" data-target-x="${target.x}" data-target-y="${target.y}">
        <span class="target-light" aria-hidden="true"></span>
        <span class="visually-hidden">${placed ? escapeHtml(placed) : "Unlabelled target"}</span>
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
          feedback.textContent = "Choose a label first, then tap a coloured light.";
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
      const teachingNote = game.success ? ` ${game.success}` : "";
      feedback.textContent = state.progress.calm
        ? `Perfect labelling. Calm, careful, correct.${teachingNote} 🌊`
        : `Perfect labelling! Diagram boss defeated.${teachingNote} 🧩🎆`;
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
    const imageDiagrams = {
      skeleton: { src: "assets/visuals/lab-skeleton-basic.png", alt: "Full skeleton diagram for label practice." },
      arm: { src: "assets/visuals/lab-arm-muscles.png", alt: "Arm anatomy diagram for label practice." },
      "full-anatomy": { src: "assets/visuals/lab-full-anatomy.png", alt: "Full-body half-skeleton, half-muscle anatomy diagram for label practice." },
    };
    if (imageDiagrams[kind]) return renderLabRaster(imageDiagrams[kind].src, imageDiagrams[kind].alt);

    const diagrams = {
      lungs: labLungsSvg,
      symbols: labSymbolsSvg,
      "symbols-extended": labSymbolsExtendedSvg,
      "series-parallel": labSeriesParallelSvg,
      indicators: labIndicatorsSvg,
      "neutralisation-order": labNeutralisationOrderSvg,
    };
    return (diagrams[kind] || labLungsSvg)();
  }

  function renderLabRaster(src, alt) {
    return `<img class="interactive-diagram-image" src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" loading="lazy" decoding="async">`;
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
      <circle cx="320" cy="58" r="28" class="lab-bone"/><path d="M308 70 q12 10 24 0" class="lab-ribs"/>
      <path d="M320 90 V214" class="lab-bone-line"/>
      <path d="M262 124 C292 94 348 94 378 124 M258 152 C290 178 350 178 382 152 M262 178 C292 204 348 204 378 178" class="lab-ribs"/>
      <path d="M276 220 C300 198 340 198 364 220 C350 244 290 244 276 220Z" class="lab-bone"/>
      <path d="M276 132 C226 124 196 154 170 206 M364 132 C414 124 444 154 470 206" class="lab-bone-line"/>
      <path d="M302 242 L270 318 M338 242 L372 318" class="lab-bone-line"/>
    `);
  }

  function labArmSvg() {
    return labSvg("Elbow joint and muscles", `
      <path d="M150 192 C220 176, 280 178, 326 190" class="lab-bone-line"/><path d="M326 190 C388 208, 446 238, 504 266" class="lab-bone-line"/>
      <circle cx="326" cy="190" r="24" class="lab-joint"/>
      <path d="M160 150 C230 92 302 114 342 172" class="lab-muscle-a"/>
      <path d="M160 226 C236 260 304 244 344 208" class="lab-muscle-b"/>
      <path d="M338 174 C356 160 370 156 388 160" class="lab-tendon-line"/><path d="M338 208 C360 222 380 230 402 234" class="lab-tendon-line"/>
    `);
  }

  function labLungsSvg() {
    return labSvg("Breathing system", `
      <path d="M320 56 L320 146 M320 110 C286 126 268 144 252 170 M320 110 C354 126 372 144 388 170" class="lab-airway"/>
      <path d="M292 136 C220 146 206 274 294 286 C320 238 320 184 292 136Z" class="lab-lung"/>
      <path d="M348 136 C420 146 434 274 346 286 C320 238 320 184 348 136Z" class="lab-lung"/>
      <path d="M226 104 C184 142 176 248 226 308 M414 104 C456 142 464 248 414 308" class="lab-ribs"/>
      <path d="M206 286 Q320 330 434 286" class="lab-diaphragm"/>
      <path d="M320 26 v30" class="lab-arrow" marker-end="url(#labArrow)"/>
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

  function labSymbolsExtendedSvg() {
    const tile = (x, y, inner) => `<g transform="translate(${x},${y})"><rect x="-46" y="-34" width="92" height="68" rx="18" class="symbol-tile"/>${inner}</g>`;
    return labSvg("Circuit symbol pack", `
      ${tile(96,120, `<line x1="-30" y1="0" x2="-10" y2="0" class="wire"/><line x1="-10" y1="-22" x2="-10" y2="22" class="wire"/><line x1="10" y1="-14" x2="10" y2="14" class="wire"/><line x1="10" y1="0" x2="30" y2="0" class="wire"/>`)}
      ${tile(256,120, `<line x1="-30" y1="0" x2="-8" y2="0" class="wire"/><circle cx="-4" cy="0" r="4" class="wire-fill"/><circle cx="28" cy="0" r="4" class="wire-fill"/><line x1="0" y1="-4" x2="20" y2="-18" class="wire"/>`)}
      ${tile(416,120, `<line x1="-30" y1="0" x2="-8" y2="0" class="wire"/><circle cx="-4" cy="0" r="4" class="wire-fill"/><circle cx="28" cy="0" r="4" class="wire-fill"/><line x1="0" y1="0" x2="24" y2="0" class="wire"/>`)}
      ${tile(552,120, `<circle cx="0" cy="0" r="22" class="wire-fill"/><path d="M-14 -14 L14 14 M14 -14 L-14 14" class="wire"/>`)}
      ${tile(160,250, `<rect x="-26" y="-14" width="52" height="28" rx="6" class="wire-fill"/><line x1="-46" y1="0" x2="-26" y2="0" class="wire"/><line x1="26" y1="0" x2="46" y2="0" class="wire"/>`)}
      ${tile(320,250, `<circle cx="0" cy="0" r="22" class="wire-fill"/><text x="0" y="8" text-anchor="middle" class="meter-letter">V</text>`)}
      ${tile(480,250, `<circle cx="0" cy="0" r="22" class="wire-fill"/><text x="0" y="8" text-anchor="middle" class="meter-letter">A</text>`)}
    `);
  }

  function labSeriesParallelSvg() {
    return labSvg("Series and parallel circuits", `
      <text x="176" y="56" text-anchor="middle" class="lab-title">A</text><text x="464" y="56" text-anchor="middle" class="lab-title">B</text>
      <rect x="92" y="96" width="168" height="150" rx="20" class="wire-box"/><circle cx="150" cy="172" r="18" class="wire-fill"/><circle cx="205" cy="172" r="18" class="wire-fill"/>
      <rect x="380" y="96" width="168" height="150" rx="20" class="wire-box"/><line x1="380" y1="150" x2="548" y2="150" class="wire"/><line x1="380" y1="205" x2="548" y2="205" class="wire"/><circle cx="466" cy="150" r="17" class="wire-fill"/><circle cx="466" cy="205" r="17" class="wire-fill"/>
    `);
  }

  function labIndicatorsSvg() {
    return labSvg("Indicators and pH", `
      <defs><linearGradient id="phGradient" x1="0" x2="1"><stop offset="0" stop-color="#ef4444"/><stop offset="0.5" stop-color="#22c55e"/><stop offset="1" stop-color="#3b82f6"/></linearGradient></defs>
      <rect x="100" y="112" width="78" height="108" rx="14" class="beaker"/><rect x="112" y="168" width="54" height="40" rx="8" class="acid-fill"/>
      <rect x="281" y="112" width="78" height="108" rx="14" class="beaker"/><rect x="293" y="168" width="54" height="40" rx="8" class="neutral-fill"/>
      <rect x="462" y="112" width="78" height="108" rx="14" class="beaker"/><rect x="474" y="168" width="54" height="40" rx="8" class="alkali-fill"/>
      <rect x="126" y="248" width="388" height="30" rx="15" class="ph-track"/>
      <line x1="126" y1="282" x2="514" y2="282" class="lab-guide"/>
      <text x="126" y="308" class="lab-caption">1</text><text x="309" y="308" text-anchor="middle" class="lab-caption">7</text><text x="514" y="308" text-anchor="end" class="lab-caption">14</text>
    `);
  }

  function labNeutralisationOrderSvg() {
    const step = (x, n) => `<g transform="translate(${x},164)"><rect x="-30" y="-34" width="60" height="68" rx="18" class="step-panel"/><circle r="20" class="step-node"/><text y="9" text-anchor="middle" class="meter-letter">${n}</text></g>`;
    return labSvg("Neutralisation method order", `
      <line x1="94" y1="164" x2="546" y2="164" class="lab-guide"/>${step(94,1)}${step(207,2)}${step(320,3)}${step(433,4)}${step(546,5)}
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
    setModeTip("Drag a circuit symbol into a gap in the loop. When the build is correct, the working circuit powers up.");

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

    const feedbackText = state.circuitFeedbackMessage || (state.selectedCircuitPart ? `Selected: ${escapeHtml(state.selectedCircuitPart)}` : "Drag a symbol into a gap in the circuit.");

    els.circuitPanel.innerHTML = `
      <div class="circuit-card ${state.circuitPowered ? "powered" : ""}" data-game-id="${escapeHtml(game.id)}">
        <div class="lab-head">
          <div>
            <p class="panel-kicker">${escapeHtml(game.unit)}</p>
            <h3>${escapeHtml(game.title)}</h3>
            <p>${escapeHtml(game.brief)}</p>
          </div>
          <div class="lab-counter">${state.circuitIndex + 1}/${circuitDeck.length}</div>
        </div>
        <div class="circuit-layout">
          <div class="circuit-stage ${state.circuitPowered ? "powered" : ""}" aria-label="Circuit builder board">
            <div class="circuit-diagram">${renderCircuitBuilderDiagram(game)}</div>
            ${game.slots.map((slot) => renderCircuitSlot(slot)).join("")}
          </div>
          <div class="circuit-bank" aria-label="Circuit component bank">
            <h4>Symbol board</h4>
            <p class="symbol-board-note">Choose a standard circuit symbol, then snap it into a slot.</p>
            ${game.labels.map((label, index) => renderCircuitPart(label, index)).join("")}
            <button class="ghost-button circuit-clear" type="button">Clear circuit</button>
          </div>
        </div>
        <p class="circuit-feedback" aria-live="polite">${feedbackText}</p>
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
      <button class="circuit-slot ${placed ? "filled" : ""}" type="button" data-slot-id="${escapeHtml(slot.id)}" style="left:${slot.x}%;top:${slot.y}%" aria-label="${placed ? `${escapeHtml(placed)} placed in ${escapeHtml(slot.label)}` : `Empty circuit gap for ${escapeHtml(slot.label)}`}" title="${escapeHtml(slot.label)}">
        <span class="slot-role">${escapeHtml(slot.label)}</span>
        <span class="slot-symbol" aria-hidden="true">${placed ? circuitSymbolSvg(placed, "slot") : circuitGapSlotSvg()}</span>
      </button>
    `;
  }

  function renderCircuitPart(label, index) {
    const usedCount = Object.values(state.circuitAnswers).filter((value) => value === label).length;
    const selected = state.selectedCircuitPart === label;
    return `
      <button class="circuit-part ${selected ? "selected" : ""} ${usedCount ? "used" : ""}" type="button" draggable="true" data-part="${escapeHtml(label)}" data-index="${index}" aria-pressed="${selected}">
        <span class="symbol-tile" aria-hidden="true">${circuitSymbolSvg(label, "bank")}</span>
        <strong>${escapeHtml(label)}</strong>
      </button>
    `;
  }

  function circuitGapSlotSvg() {
    return `
      <svg class="circuit-symbol-svg empty-symbol gap-symbol" viewBox="0 0 120 70" focusable="false">
        <path d="M8 35 H28 M92 35 H112"/>
        <path d="M34 18 H86 M34 52 H86"/>
        <path d="M34 18 V52 M86 18 V52"/>
      </svg>
    `;
  }

  function circuitSymbolSvg(part, variant = "bank") {
    const safePart = String(part || "").toLowerCase();
    const className = `circuit-symbol-svg ${variant === "slot" ? "slot-svg" : "bank-svg"}`;
    const drawings = {
      cell: `
        <line x1="14" y1="35" x2="46" y2="35"/>
        <line x1="46" y1="14" x2="46" y2="56"/>
        <line x1="68" y1="23" x2="68" y2="47"/>
        <line x1="68" y1="35" x2="106" y2="35"/>
      `,
      lamp: `
        <line x1="12" y1="35" x2="32" y2="35"/>
        <circle cx="60" cy="35" r="25"/>
        <line x1="43" y1="18" x2="77" y2="52"/>
        <line x1="77" y1="18" x2="43" y2="52"/>
        <line x1="88" y1="35" x2="108" y2="35"/>
      `,
      bulb: `
        <line x1="12" y1="35" x2="32" y2="35"/>
        <circle cx="60" cy="35" r="25"/>
        <line x1="43" y1="18" x2="77" y2="52"/>
        <line x1="77" y1="18" x2="43" y2="52"/>
        <line x1="88" y1="35" x2="108" y2="35"/>
      `,
      resistor: `
        <line x1="12" y1="35" x2="34" y2="35"/>
        <rect x="34" y="20" width="52" height="30" rx="5"/>
        <line x1="86" y1="35" x2="108" y2="35"/>
      `,
      "open switch": `
        <line x1="12" y1="35" x2="42" y2="35"/>
        <circle cx="46" cy="35" r="5"/>
        <circle cx="82" cy="35" r="5"/>
        <line x1="50" y1="31" x2="74" y2="16"/>
        <line x1="86" y1="35" x2="108" y2="35"/>
      `,
      "closed switch": `
        <line x1="12" y1="35" x2="42" y2="35"/>
        <circle cx="46" cy="35" r="5"/>
        <circle cx="82" cy="35" r="5"/>
        <line x1="50" y1="35" x2="78" y2="35"/>
        <line x1="86" y1="35" x2="108" y2="35"/>
      `,
      ammeter: `
        <line x1="12" y1="35" x2="34" y2="35"/>
        <circle cx="60" cy="35" r="26"/>
        <text x="60" y="44">A</text>
        <line x1="86" y1="35" x2="108" y2="35"/>
      `,
      voltmeter: `
        <line x1="12" y1="35" x2="34" y2="35"/>
        <circle cx="60" cy="35" r="26"/>
        <text x="60" y="44">V</text>
        <line x1="86" y1="35" x2="108" y2="35"/>
      `,
      wire: `
        <line x1="14" y1="35" x2="106" y2="35"/>
      `,
    };
    const drawing = drawings[safePart] || drawings.wire;
    return `
      <svg class="${className}" viewBox="0 0 120 70" focusable="false" role="img" aria-label="${escapeHtml(part)} symbol">
        <g>${drawing}</g>
      </svg>
    `;
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
      state.circuitPowered = false;
      state.circuitFeedbackMessage = "";
      renderCircuitMode();
    });
  }

  function placeCircuitPart(slotId, part) {
    if (!slotId || !part || state.circuitLocked) return;
    state.circuitAnswers[slotId] = part;
    state.selectedCircuitPart = "";
    state.circuitPowered = false;
    state.circuitFeedbackMessage = "";
    renderCircuitMode();
  }

  function checkCircuitGame(game) {
    if (state.circuitLocked) return;
    const feedback = els.circuitPanel.querySelector(".circuit-feedback");
    const total = game.slots.length;
    const placed = game.slots.filter((slot) => state.circuitAnswers[slot.id]).length;
    if (placed < total) {
      state.circuitFeedbackMessage = `You have placed ${placed}/${total} symbols. Fill every gap, then test the circuit.`;
      feedback.textContent = state.circuitFeedbackMessage;
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
      state.circuitPowered = game.poweredOnSuccess !== false;
      state.progress.circuitWins = (state.progress.circuitWins || 0) + 1;
      saveProgress();
      state.circuitFeedbackMessage = state.circuitPowered
        ? (state.progress.calm ? `Circuit works. ${game.success} 🌊` : `Circuit powered up! ${game.success} ⚡`)
        : `Correct build. ${game.success}`;
      renderCircuitMode();
      celebrate();
    } else {
      state.circuitPowered = false;
      state.circuitFeedbackMessage = `Not powered yet. ${wrongSlots.length} symbol${wrongSlots.length === 1 ? "" : "s"} need moving.`;
      feedback.textContent = state.circuitFeedbackMessage;
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
    state.circuitPowered = false;
    state.circuitFeedbackMessage = "";
    render();
  }

  function renderCircuitBuilderDiagram(game) {
    const diagrams = {
      "simple-loop": circuitBuilderSimpleLoop,
      "meter-loop": circuitBuilderMeterLoop,
      "parallel-meter": circuitBuilderParallelMeter,
      "series-two-lamps": circuitBuilderSeriesTwoLamps,
      "parallel-two-lamps": circuitBuilderParallelTwoLamps,
    };
    return (diagrams[game.layout] || circuitBuilderSimpleLoop)(game);
  }

  function circuitBuilderSvg(title, inner, viewBox = "0 0 720 380") {
    return `
      <svg class="circuit-builder-svg" viewBox="${viewBox}" role="img" aria-label="${escapeHtml(title)}">
        <defs>
          <filter id="circuitGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <rect x="14" y="14" width="692" height="352" rx="34" class="builder-bg"/>
        <text x="36" y="48" class="builder-title">Circuit board</text>
        ${inner}
      </svg>
    `;
  }

  function circuitPower(paths) {
    if (!state.circuitPowered) return "";
    return paths.map((d) => `<path d="${d}" class="electric-flow"/>`).join("");
  }

  function circuitBuilderSimpleLoop() {
    const wires = [
      'M104 268 H192',
      'M272 268 H448',
      'M528 268 H612',
      'M104 108 H280',
      'M440 108 H612',
      'M104 108 V268',
      'M612 108 V268'
    ];
    return circuitBuilderSvg("Simple rectangular loop", `
      ${wires.map((d) => `<path d="${d}" class="builder-wire"/>`).join("")}
      ${circuitPower(['M104 268 H192 M272 268 H448 M528 268 H612 V108 H440 M280 108 H104 V268'])}
    `);
  }

  function circuitBuilderMeterLoop() {
    const wires = [
      'M104 268 H182',
      'M260 268 H382',
      'M460 268 H612',
      'M104 108 H222',
      'M302 108 H382',
      'M460 108 H612',
      'M104 108 V268',
      'M612 108 V268'
    ];
    return circuitBuilderSvg("Series meter loop", `
      ${wires.map((d) => `<path d="${d}" class="builder-wire"/>`).join("")}
      ${circuitPower(['M104 268 H182 M260 268 H382 M460 268 H612 V108 H460 M382 108 H302 M222 108 H104 V268'])}
    `);
  }

  function circuitBuilderParallelMeter() {
    const wires = [
      'M104 268 H182',
      'M262 268 H502',
      'M582 268 H612',
      'M104 108 H612',
      'M104 108 V268',
      'M612 108 V268',
      'M372 108 V158',
      'M452 108 V158',
      'M372 238 V288',
      'M452 238 V288',
      'M372 158 H452',
      'M372 288 H452'
    ];
    return circuitBuilderSvg("Voltage across a lamp", `
      ${wires.map((d) => `<path d="${d}" class="builder-wire"/>`).join("")}
      ${circuitPower(['M104 268 H182 M262 268 H502 M582 268 H612 V108 H452 V158 H372 V108 H104 V268'])}
    `);
  }

  function circuitBuilderSeriesTwoLamps() {
    const wires = [
      'M104 268 H182',
      'M262 268 H452',
      'M532 268 H612',
      'M104 108 H238',
      'M318 108 H414',
      'M494 108 H612',
      'M104 108 V268',
      'M612 108 V268'
    ];
    return circuitBuilderSvg("Series with two lamps", `
      ${wires.map((d) => `<path d="${d}" class="builder-wire"/>`).join("")}
      ${circuitPower(['M104 268 H182 M262 268 H452 M532 268 H612 V108 H494 M414 108 H318 M238 108 H104 V268'])}
    `);
  }

  function circuitBuilderParallelTwoLamps() {
    const wires = [
      'M104 268 H182',
      'M262 268 H612',
      'M104 108 H612',
      'M104 108 V268',
      'M612 108 V268',
      'M368 108 V144',
      'M448 108 V144',
      'M368 220 V256',
      'M448 220 V256',
      'M368 144 H448',
      'M368 256 H448'
    ];
    return circuitBuilderSvg("Parallel with two lamps", `
      ${wires.map((d) => `<path d="${d}" class="builder-wire"/>`).join("")}
      ${circuitPower([
        'M104 268 H182 M262 268 H612 V108 H448 V144 H368 V108 H104 V268',
        'M104 268 H182 M262 268 H612 V108 H448 V256 H368 V108 H104 V268'
      ])}
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
    setModeTip("Exam coach is about mark-scheme language: answer, reveal, compare, then self-mark honestly.");

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
    const visualHtml = question.visual ? renderExamVisual(question.visual) : "";

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
          ${isChoice ? "" : `<button class="primary-button exam-reveal" type="button">Check answer</button>`}
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
      <textarea id="examResponse" class="exam-response" rows="7" placeholder="Type your answer here, then check it.">${escapeHtml(state.examResponse)}</textarea>
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
        ? "Saved. Move on when you are ready. 🌊"
        : "Saved. Keep going! ⚡";
    }
    if (Array.isArray(question.choices) && question.choices.length) return "Choose the best answer.";
    if (!state.examRevealed) return "Write your answer, then check it.";
    return `Check your answer. Keyword guide: ${hits.length}/${(question.keywords || []).length}.`;
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


  function writtenExamTotalQuestions() {
    return writtenExamUnits.length * writtenExamQuestionsPerUnit;
  }

  function writtenExamQuestionPool(unit) {
    return examTrainerQuestions.filter((question) => question.unit === unit && question.kind === "written");
  }

  function writtenExamPoolCounts() {
    return writtenExamUnits.reduce((counts, unit) => {
      counts[unit] = writtenExamQuestionPool(unit).length;
      return counts;
    }, {});
  }

  function writtenExamMovedQuestionCount() {
    const counts = writtenExamPoolCounts();
    return writtenExamUnits.reduce((total, unit) => total + (counts[unit] || 0), 0);
  }

  function writtenExamCanStart() {
    const counts = writtenExamPoolCounts();
    return writtenExamUnits.every((unit) => (counts[unit] || 0) >= writtenExamQuestionsPerUnit);
  }

  function writtenExamChallengeScore(question) {
    return (Number(question.marks) || 1) * 20 + (question.visual ? 4 : 0) + ((question.keywords || []).length * 0.5);
  }

  function selectWrittenExamQuestions() {
    return writtenExamUnits.flatMap((unit) => {
      const pool = writtenExamQuestionPool(unit).sort((a, b) => {
        const scoreDiff = writtenExamChallengeScore(b) - writtenExamChallengeScore(a);
        if (scoreDiff) return scoreDiff;
        return String(a.title || "").localeCompare(String(b.title || ""));
      });
      const challengePoolSize = Math.min(pool.length, Math.max(writtenExamQuestionsPerUnit, Math.ceil(pool.length * 0.75)));
      const challengePool = pool.slice(0, challengePoolSize);
      shuffleArray(challengePool);
      return challengePool
        .slice(0, writtenExamQuestionsPerUnit)
        .sort((a, b) => writtenExamChallengeScore(b) - writtenExamChallengeScore(a));
    });
  }

  function resetWrittenExamRound() {
    state.writtenExamActive = false;
    state.writtenExamSubmitted = false;
    state.writtenExamDeck = [];
    state.writtenExamAnswers = {};
    state.writtenExamStartedAt = null;
    state.writtenExamSaved = false;
  }

  function startWrittenExamRound() {
    if (!writtenExamCanStart()) return;
    const deck = selectWrittenExamQuestions();
    state.writtenExamDeck = deck;
    state.writtenExamAnswers = deck.reduce((answers, question) => {
      answers[question.id] = "";
      return answers;
    }, {});
    state.writtenExamActive = true;
    state.writtenExamSubmitted = false;
    state.writtenExamStartedAt = new Date().toISOString();
    state.writtenExamSaved = false;
    render();
  }

  function writtenExamAnsweredCount() {
    return state.writtenExamDeck.filter((question) => String(state.writtenExamAnswers[question.id] || "").trim()).length;
  }

  function renderWrittenExamMode() {
    els.examPanel.classList.remove("hidden");
    els.labPanel.classList.add("hidden");
    els.circuitPanel.classList.add("hidden");
    els.flashcard.classList.add("hidden");
    els.quizPanel.classList.add("hidden");
    els.buttonRow.classList.add("hidden");
    els.reviewBox.classList.remove("hidden");
    els.cardMetaBar.classList.add("hidden");
    els.feedback.textContent = "";
    setModeTip("Written exam mode locks all answers until you submit the full 15-question paper.");

    if (state.writtenExamSubmitted && state.writtenExamDeck.length) {
      renderWrittenExamResults();
      return;
    }
    if (state.writtenExamActive && state.writtenExamDeck.length) {
      renderWrittenExamPaper();
      return;
    }
    renderWrittenExamSetup();
  }

  function renderWrittenExamSetup() {
    const counts = writtenExamPoolCounts();
    const movedCount = writtenExamMovedQuestionCount();
    const recent = (state.progress.writtenExamHistory || []).slice(-3).reverse();
    els.progressFill.style.width = "0%";
    els.examPanel.innerHTML = `
      <section class="exam-card written-exam-card written-exam-setup">
        <div class="exam-topline">
          <span class="unit-badge">Exam Mode</span>
          <span class="marks-badge">${writtenExamTotalQuestions()} written questions</span>
          <span class="type-badge">Answers locked until submit</span>
        </div>
        <div class="written-exam-hero">
          <div>
            <p class="panel-kicker">Full written paper</p>
            <h3>15 challenging written-answer questions across all 3 units.</h3>
            <p class="written-exam-lead">The app can currently move <strong>${movedCount}</strong> written-answer questions into this mode. Each exam builds <strong>5 questions from each unit</strong> and prioritises higher-mark explanation, method, comparison, and spot-the-mistake prompts.</p>
          </div>
          <button class="primary-button written-exam-start" type="button" ${writtenExamCanStart() ? "" : "disabled"}>Start 15-question exam</button>
        </div>
        <div class="written-exam-count-grid">
          ${writtenExamUnits.map((unit) => `<div><strong>${counts[unit] || 0}</strong><span>${escapeHtml(unit)}</span><small>${writtenExamQuestionsPerUnit} used per exam</small></div>`).join("")}
        </div>
        <div class="boss-rules written-exam-rules">
          <h4>Rules</h4>
          <ul>
            <li>No mark scheme, keyword list, or answer appears until the full exam is submitted.</li>
            <li>After submission, each question shows your answer, a concise target answer, and a broader explanation.</li>
            <li>Keyword coverage is a guide only; it is not an automatic mark.</li>
          </ul>
        </div>
        ${recent.length ? `<div class="boss-history-panel"><h4>Recent written exams</h4><div class="boss-history-list">${recent.map((item) => `<span class="boss-history-pill">${escapeHtml(item.date || "Exam")} · ${item.answered}/${item.total} answered</span>`).join("")}</div></div>` : ""}
      </section>
    `;
    els.examPanel.querySelector(".written-exam-start")?.addEventListener("click", startWrittenExamRound);
  }

  function renderWrittenExamPaper() {
    const total = state.writtenExamDeck.length;
    const answered = writtenExamAnsweredCount();
    const progressPercent = total ? Math.round((answered / total) * 100) : 0;
    els.progressFill.style.width = `${progressPercent}%`;
    els.examPanel.innerHTML = `
      <section class="exam-card written-exam-card written-exam-paper">
        <div class="written-exam-sticky-head">
          <div>
            <p class="panel-kicker">Written exam in progress</p>
            <h3>${answered}/${total} answered</h3>
          </div>
          <div class="written-exam-toolbar">
            <button class="danger-soft written-exam-clear" type="button">Quit exam</button>
            <button class="primary-button written-exam-submit" type="button">Submit exam</button>
          </div>
        </div>
        <p class="written-exam-lock-note">Answer all 15 questions. Answers and explanations are hidden until you submit.</p>
        <div class="written-exam-question-list">
          ${state.writtenExamDeck.map((question, index) => renderWrittenExamQuestion(question, index)).join("")}
        </div>
        <div class="written-exam-bottom-actions">
          <button class="primary-button written-exam-submit" type="button">Submit exam</button>
        </div>
      </section>
    `;
    wireWrittenExamPaper();
  }

  function renderWrittenExamQuestion(question, index) {
    const answer = state.writtenExamAnswers[question.id] || "";
    const visualHtml = question.visual ? renderExamVisual(question.visual) : "";
    return `
      <article class="written-exam-question" data-question-id="${escapeHtml(question.id)}">
        <div class="exam-topline">
          <span class="unit-badge">${escapeHtml(question.unit)}</span>
          <span class="marks-badge">${question.marks} mark${question.marks === 1 ? "" : "s"}</span>
          <span class="type-badge">Question ${index + 1}</span>
        </div>
        <h4>${escapeHtml(question.title)}</h4>
        <p class="exam-prompt">${escapeHtml(question.prompt)}</p>
        ${visualHtml ? `<div class="exam-visual">${visualHtml}</div>` : ""}
        <label class="exam-answer-label" for="writtenExamAnswer-${escapeHtml(question.id)}">Your written answer</label>
        <textarea id="writtenExamAnswer-${escapeHtml(question.id)}" class="exam-response written-exam-response" rows="5" data-question-id="${escapeHtml(question.id)}" placeholder="Write your answer here. The model answer stays hidden until you submit.">${escapeHtml(answer)}</textarea>
      </article>
    `;
  }

  function wireWrittenExamPaper() {
    els.examPanel.querySelectorAll(".written-exam-response").forEach((textarea) => {
      textarea.addEventListener("input", (event) => {
        const questionId = event.target.dataset.questionId || "";
        state.writtenExamAnswers[questionId] = event.target.value;
        const total = state.writtenExamDeck.length;
        const answered = writtenExamAnsweredCount();
        els.progressFill.style.width = `${total ? Math.round((answered / total) * 100) : 0}%`;
        const heading = els.examPanel.querySelector(".written-exam-sticky-head h3");
        if (heading) heading.textContent = `${answered}/${total} answered`;
      });
    });
    els.examPanel.querySelectorAll(".written-exam-submit").forEach((button) => {
      button.addEventListener("click", submitWrittenExam);
    });
    els.examPanel.querySelector(".written-exam-clear")?.addEventListener("click", () => {
      const confirmed = window.confirm("Quit this written exam and clear these answers?");
      if (!confirmed) return;
      resetWrittenExamRound();
      render();
    });
  }

  function submitWrittenExam() {
    els.examPanel.querySelectorAll(".written-exam-response").forEach((textarea) => {
      const questionId = textarea.dataset.questionId || "";
      state.writtenExamAnswers[questionId] = textarea.value;
    });
    const answered = writtenExamAnsweredCount();
    if (!answered) {
      const confirmed = window.confirm("Submit a blank exam? You can still review the answers, but no responses have been entered.");
      if (!confirmed) return;
    }
    state.writtenExamSubmitted = true;
    state.writtenExamActive = false;
    saveWrittenExamHistory();
    render();
  }

  function saveWrittenExamHistory() {
    if (state.writtenExamSaved) return;
    const total = state.writtenExamDeck.length;
    const answered = writtenExamAnsweredCount();
    state.progress.writtenExamHistory = [
      ...(state.progress.writtenExamHistory || []),
      {
        date: new Date().toLocaleDateString(undefined, { month: "short", day: "numeric" }),
        total,
        answered,
        ids: state.writtenExamDeck.map((question) => question.id),
      },
    ].slice(-20);
    state.writtenExamSaved = true;
    saveProgress();
  }

  function renderWrittenExamResults() {
    const total = state.writtenExamDeck.length;
    const answered = writtenExamAnsweredCount();
    const coverage = writtenExamDeckKeywordCoverage();
    els.progressFill.style.width = "100%";
    els.examPanel.innerHTML = `
      <section class="exam-card written-exam-card written-exam-results">
        <div class="written-exam-sticky-head results-head">
          <div>
            <p class="panel-kicker">Written exam submitted</p>
            <h3>Review answers and fill knowledge gaps.</h3>
          </div>
          <div class="written-exam-toolbar">
            <button class="secondary-button written-exam-new" type="button">Build another exam</button>
          </div>
        </div>
        <div class="boss-score-grid written-exam-score-grid">
          <div><strong>${answered}/${total}</strong><span>answered</span></div>
          <div><strong>${coverage.hit}/${coverage.total}</strong><span>keyword guide</span></div>
          <div><strong>${writtenExamQuestionsPerUnit}</strong><span>per unit</span></div>
          <div><strong>${writtenExamMovedQuestionCount()}</strong><span>pool size</span></div>
        </div>
        <p class="written-exam-lock-note">Keyword coverage is a self-check only. Use the concise target answer first, then read the explanation for missing reasoning.</p>
        <div class="written-exam-question-list review-list">
          ${state.writtenExamDeck.map((question, index) => renderWrittenExamReview(question, index)).join("")}
        </div>
      </section>
    `;
    els.examPanel.querySelector(".written-exam-new")?.addEventListener("click", () => {
      resetWrittenExamRound();
      startWrittenExamRound();
    });
  }

  function writtenExamDeckKeywordCoverage() {
    return state.writtenExamDeck.reduce((totals, question) => {
      const hits = keywordHits(question, state.writtenExamAnswers[question.id] || "");
      totals.hit += hits.length;
      totals.total += (question.keywords || []).length;
      return totals;
    }, { hit: 0, total: 0 });
  }

  function renderWrittenExamReview(question, index) {
    const userAnswer = String(state.writtenExamAnswers[question.id] || "").trim();
    const hits = keywordHits(question, userAnswer);
    const visualHtml = question.visual ? renderExamVisual(question.visual) : "";
    return `
      <article class="written-exam-question written-exam-review-card">
        <div class="exam-topline">
          <span class="unit-badge">${escapeHtml(question.unit)}</span>
          <span class="marks-badge">${question.marks} mark${question.marks === 1 ? "" : "s"}</span>
          <span class="type-badge">Question ${index + 1}</span>
        </div>
        <h4>${escapeHtml(question.title)}</h4>
        <p class="exam-prompt">${escapeHtml(question.prompt)}</p>
        ${visualHtml ? `<div class="exam-visual">${visualHtml}</div>` : ""}
        <div class="written-exam-answer-grid">
          <div class="written-exam-answer-block user-answer-block">
            <h5>Your answer</h5>
            <p>${userAnswer ? escapeHtml(userAnswer) : "No answer entered."}</p>
          </div>
          <div class="written-exam-answer-block target-answer-block">
            <h5>Concise target answer</h5>
            <p>${escapeHtml(writtenExamConciseAnswer(question))}</p>
          </div>
        </div>
        <div class="written-exam-explanation">
          <h5>Broader explanation</h5>
          <p>${escapeHtml(writtenExamExplanation(question))}</p>
          <div class="keyword-list">
            ${(question.keywords || []).map((keyword) => `<span class="keyword ${hits.includes(String(keyword).toLowerCase()) ? "hit" : ""}">${escapeHtml(keyword)}</span>`).join("")}
          </div>
        </div>
      </article>
    `;
  }

  function writtenExamConciseAnswer(question) {
    return question.conciseAnswer || question.answer;
  }

  function writtenExamExplanation(question) {
    if (question.explanation) return question.explanation;
    const cue = question.cue || "A strong answer uses precise science words and links cause to effect.";
    return `${cue} Check whether your answer names the key science idea, explains the cause or process, and states the result clearly. Use the highlighted keywords as a gap-check, not as a memorised script.`;
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
          weakIds: Array.isArray(imported.weakIds) ? imported.weakIds : [],
          bossHistory: Array.isArray(imported.bossHistory) ? imported.bossHistory : [],
          writtenExamHistory: Array.isArray(imported.writtenExamHistory) ? imported.writtenExamHistory : [],
          bossSeenIds: Array.isArray(imported.bossSeenIds) ? imported.bossSeenIds : [],
          bossUnlockedLevel: Math.max(1, Math.min(5, Number(imported.bossUnlockedLevel || 1))),
          bossLevelCompletions: imported.bossLevelCompletions && typeof imported.bossLevelCompletions === "object" ? imported.bossLevelCompletions : {},
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

    els.practiceMixSelect?.addEventListener("change", (event) => {
      state.practiceMix = event.target.value;
      if (state.practiceMix === "weak") setMode("weak");
      else if (state.practiceMix === "visual") setMode("visual");
      else if (state.practiceMix === "exam") setMode("exam");
      else rebuildDeck({ shuffle: true });
    });

    els.homeTopicButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const topic = button.dataset.homeTopic;
        const selected = new Set(selectedHomeUnits());
        if (selected.has(topic) && selected.size > 1) selected.delete(topic);
        else selected.add(topic);
        state.homeUnits = [...selected];
        syncHomeTopicButtons();
      });
    });

    els.modeButtons.forEach((button) => {
      button.addEventListener("click", () => setMode(button.dataset.mode));
    });

    els.heroModeButtons.forEach((button) => {
      button.addEventListener("click", () => {
        startPracticeFromHome(button.dataset.setMode);
      });
    });

    els.launchStudyButton?.addEventListener("click", () => {
      startPracticeFromHome(state.mode);
    });

    els.homePracticeButton?.addEventListener("click", () => {
      startPracticeFromHome("study");
    });

    els.homeExamButton?.addEventListener("click", startWrittenExamFromHome);

    els.homeBossButton?.addEventListener("click", startBossFromHome);

    els.homeButton?.addEventListener("click", goHome);
    els.brandHomeLink?.addEventListener("click", (event) => {
      event.preventDefault();
      goHome();
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
      state.sessionAnswered = 0;
      state.sessionCorrect = 0;
      state.sessionMastered = 0;
      state.sessionNeedsReview = 0;
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
