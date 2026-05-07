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
    cardTag: $("#cardTag"),
    cardFront: $("#cardFront"),
    cardBack: $("#cardBack"),
    cardCue: $("#cardCue"),
    frontHint: $("#frontHint"),
    quizPanel: $("#quizPanel"),
    answerGrid: $("#answerGrid"),
    feedback: $("#feedback"),
    knowButton: $("#knowButton"),
    needPracticeButton: $("#needPracticeButton"),
    nextButton: $("#nextButton"),
    shuffleButton: $("#shuffleButton"),
    speakButton: $("#speakButton"),
    soundToggle: $("#soundToggle"),
    calmToggle: $("#calmToggle"),
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
    canvas: $("#fireworksCanvas"),
  };

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
  ];

  const defaultProgress = {
    attempted: 0,
    correct: 0,
    xp: 0,
    currentStreak: 0,
    bestStreak: 0,
    mastered: [],
    calm: false,
    sound: true,
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
    progress: loadProgress(),
    sessionAnswered: 0,
    sessionCorrect: 0,
    audioContext: null,
    fireworks: [],
    animationFrame: null,
  };

  function loadProgress() {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      return {
        ...defaultProgress,
        ...stored,
        mastered: Array.isArray(stored.mastered) ? stored.mastered : [],
      };
    } catch {
      return { ...defaultProgress };
    }
  }

  function saveProgress() {
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
      const typeMatch = forcedEquationMode
        ? card.type === "Equation/relationship"
        : state.type === "all" || card.type === state.type;
      const searchText = `${card.unit} ${card.type} ${card.front} ${card.back} ${card.cue}`.toLowerCase();
      const searchMatch = !search || searchText.includes(search);
      return unitMatch && typeMatch && searchMatch;
    });
  }

  function rebuildDeck({ shuffle = false } = {}) {
    const deck = filteredCards();
    state.order = deck.map((_, index) => index);
    if (shuffle || ["quiz", "boss", "equations"].includes(state.mode)) {
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
    const deck = deckCards();
    if (!deck.length) return;
    state.index = (state.index + 1) % deck.length;
    state.flipped = false;
    state.quizLocked = false;
    state.currentChoices = [];
    render();
  }

  function shuffleCurrentDeck() {
    shuffleArray(state.order);
    state.index = 0;
    state.flipped = false;
    state.quizLocked = false;
    state.currentChoices = [];
    bounce(els.flashcard);
    render();
  }

  function render() {
    document.body.classList.toggle("calm", state.progress.calm);
    const card = currentCard();
    const deck = deckCards();

    renderStats();
    renderBadges();
    renderModeChrome(deck.length);
    updateToggleButtons();

    if (!card) {
      renderEmptyState();
      return;
    }

    els.flashcard.classList.toggle("flipped", state.flipped);
    els.cardTag.textContent = `${card.unit} · ${card.type}`;
    els.cardFront.textContent = card.front;
    els.cardBack.textContent = card.back;
    els.cardCue.textContent = card.cue || "No extra cue for this card.";
    els.frontHint.textContent = isQuizMode() ? "Choose an answer below." : "Tap the card to flip it.";
    els.studyTip.textContent = tips[(state.index + state.sessionAnswered) % tips.length];

    const progressPercent = deck.length ? ((state.index + 1) / deck.length) * 100 : 0;
    els.progressFill.style.width = `${progressPercent}%`;

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
    els.cardTag.textContent = "No cards";
    els.cardFront.textContent = "No matching cards found.";
    els.cardBack.textContent = "Try clearing the search or changing the filters.";
    els.cardCue.textContent = "";
    els.frontHint.textContent = "";
    els.progressFill.style.width = "0%";
    els.quizPanel.classList.add("hidden");
  }

  function renderModeChrome(count) {
    const modeNames = {
      study: ["Flip cards", "Practise the card, then check the answer."],
      quiz: ["Multiple choice", "Pick the best answer. Correct answers earn XP and fireworks."],
      equations: ["Equation arena", "Memorise the equations and science relationships."],
      boss: ["Boss round", "Mixed questions from every topic. Build the biggest streak you can."],
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
    return ["quiz", "equations", "boss"].includes(state.mode);
  }

  function buildQuizChoices(card, deck) {
    if (state.currentChoices.length && els.answerGrid.children.length) return;

    const possibleWrong = cards
      .filter((candidate) => candidate.id !== card.id)
      .filter((candidate) => state.mode === "boss" || candidate.unit === card.unit || candidate.type === card.type)
      .map((candidate) => candidate.back);

    const uniqueWrong = [...new Set(possibleWrong)].filter(Boolean);
    shuffleArray(uniqueWrong);

    const choices = [card.back, ...uniqueWrong.slice(0, 3)];
    while (choices.length < 4) {
      const fallback = cards[Math.floor(Math.random() * cards.length)]?.back;
      if (fallback && !choices.includes(fallback)) choices.push(fallback);
    }
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
      els.feedback.textContent = randomChoice([
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

    if (correct) {
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
      state.progress.currentStreak = 0;
    }
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
    rebuildDeck({ shuffle: true });
  }

  function speakCurrentCard() {
    const card = currentCard();
    if (!card || !("speechSynthesis" in window)) return;
    const text = state.flipped ? card.back : card.front;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.92;
    utterance.pitch = 1.05;
    window.speechSynthesis.speak(utterance);
  }

  function celebrate() {
    playTone("correct");
    if (!state.progress.calm && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
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

  function wireEvents() {
    els.unitFilter.addEventListener("change", (event) => {
      state.unit = event.target.value;
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
      render();
    });

    els.calmToggle.addEventListener("click", () => {
      state.progress.calm = !state.progress.calm;
      saveProgress();
      render();
    });

    els.resetProgress.addEventListener("click", () => {
      const confirmed = window.confirm("Reset XP, streaks and badges for this browser?");
      if (!confirmed) return;
      state.progress = { ...defaultProgress };
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
    });

    window.addEventListener("resize", () => {
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
    rebuildDeck({ shuffle: true });
  }

  boot();
})();
