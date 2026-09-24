// =====================================================
// MockPrep — Accenture Gamified Cognitive Assessment Engine
// Games:
// 1. Bubble Math Challenge (Mental Math, Low to High / High to Low)
// 2. Lock & Key Memory Game (Directional Doors)
// 3. Maze Pathfinding Game (Shortest Path Grid)
// =====================================================

// ── Web Audio Synth (Feedback sounds without external assets) ──
class SoundFX {
  constructor() {
    this.ctx = null;
  }
  init() {
    if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
  }
  beep(freq = 440, type = 'sine', duration = 0.15) {
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {}
  }
  chime() {
    this.beep(523.25, 'sine', 0.1);
    setTimeout(() => this.beep(659.25, 'sine', 0.1), 100);
    setTimeout(() => this.beep(783.99, 'sine', 0.2), 200);
  }
  buzzer() {
    this.beep(150, 'sawtooth', 0.25);
  }
  keySound() {
    this.beep(880, 'triangle', 0.15);
    setTimeout(() => this.beep(1046.5, 'sine', 0.15), 80);
  }
}
const sfx = new SoundFX();

// ── State ──
// ── State ──
const cogState = {
  activeGame: 'bubble', // 'bubble', 'lockkey', 'maze', 'results'
  isAssessmentMode: false,
  overallTimeRemaining: 20 * 60, // 20 min
  overallTimer: null,
  totalScore: 0,

  // Bubble Math State (14s per question)
  bubble: {
    questionIndex: 0,
    totalQuestions: 24,
    score: 0,
    currentQuestion: null,
    selectedBubbles: [],
    isEvaluating: false,
    questionTimer: null,
    timeRemaining: 14
  },

  // Lock & Key State (4 min total)
  lockkey: {
    currentLevel: 1,
    maxLevel: 6,
    score: 0,
    gridSize: 3,
    board: [], // 2D array
    playerPos: { r: 0, c: 0 },
    startPos: { r: 0, c: 0 },
    keysTotal: 0,
    keysCollected: 0,
    resetsCount: 0,
    isCompleted: false,
    timer: null,
    timeRemaining: 4 * 60 // 4 minutes
  },

  // Maze State (4 min total)
  maze: {
    currentLevel: 1,
    maxLevel: 6,
    score: 0,
    gridSize: 4,
    board: [],
    playerPos: { r: 0, c: 0 },
    exitPos: { r: 0, c: 0 },
    stepsTaken: 0,
    optimalSteps: 0,
    isCompleted: false,
    timer: null,
    timeRemaining: 4 * 60 // 4 minutes
  }
};

// ── Initialize ──
document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const isFullMock = params.get('from') === 'fullmock' || params.get('mode') === 'fullmock';

  if (isFullMock) {
    const pipelineEl = document.getElementById('fullmock-pipeline-indicator');
    if (pipelineEl) {
      pipelineEl.innerHTML = `
        <div style="margin-bottom: 20px; background: linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(124, 58, 237, 0.15)); border: 1px solid rgba(245, 158, 11, 0.35); border-radius: 14px; padding: 14px 20px; text-align: center;">
          <div style="display: flex; justify-content: center; gap: 8px; flex-wrap: wrap; margin-bottom: 8px;">
            <span style="background: rgba(34, 197, 94, 0.2); border: 1px solid #22c55e; color: #22c55e; padding: 3px 12px; border-radius: 99px; font-size: 0.74rem; font-weight: 700;">✅ Stage 1: Technical MCQ</span>
            <span style="color: var(--text-dim); align-self: center;">→</span>
            <span style="background: rgba(34, 197, 94, 0.2); border: 1px solid #22c55e; color: #22c55e; padding: 3px 12px; border-radius: 99px; font-size: 0.74rem; font-weight: 700;">✅ Stage 2: Spoken English</span>
            <span style="color: var(--text-dim); align-self: center;">→</span>
            <span style="background: rgba(245, 158, 11, 0.25); border: 1px solid #f59e0b; color: #f59e0b; padding: 3px 12px; border-radius: 99px; font-size: 0.74rem; font-weight: 700;">⚡ Stage 3: Gamified Cognitive</span>
            <span style="color: var(--text-dim); align-self: center;">→</span>
            <span style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); color: var(--text-muted); padding: 3px 12px; border-radius: 99px; font-size: 0.74rem;">Stage 4: Coding</span>
          </div>
          <div style="font-size: 0.9rem; color: #fff; font-weight: 700;">Full Mock Test • Stage 3 of 4: Gamified Cognitive Games (Bubble 14s • Doors 4m • Maze 4m)</div>
        </div>
      `;
      pipelineEl.classList.remove('hidden');
    }
  }

  if (params.get('mode') === 'assessment' || isFullMock) {
    startAssessmentMode();
  } else {
    initBubbleGame();
  }

  // Bind keyboard navigation
  window.addEventListener('keydown', handleKeyNavigation);
});

// ── Switch Game Tabs ──
function switchGame(gameId) {
  cogState.activeGame = gameId;

  // Clear timers when switching
  clearInterval(cogState.bubble.questionTimer);
  clearInterval(cogState.lockkey.timer);
  clearInterval(cogState.maze.timer);

  // Update tabs
  document.querySelectorAll('.game-tab-btn').forEach(btn => btn.classList.remove('active'));
  const activeTab = document.getElementById(`tab-${gameId}`);
  if (activeTab) activeTab.classList.add('active');

  // Update views
  document.querySelectorAll('.game-view').forEach(v => v.classList.add('hidden'));
  const activeView = document.getElementById(`view-${gameId}`);
  if (activeView) activeView.classList.remove('hidden');

  // Update titles
  const titles = {
    bubble: { title: '⚡ Bubble Math Challenge', sub: 'Click circles from LOW → HIGH or HIGH → LOW (14s per question)' },
    lockkey: { title: '🔐 Lock & Key Memory Game', sub: 'Directional Doors: Enter in arrow direction only! (4 min total)' },
    maze: { title: '🗺️ Maze Pathfinding', sub: 'Find the shortest path to the exit avoiding walls (4 min total)' },
    results: { title: '📊 Cognitive Results', sub: 'Your cognitive assessment performance summary' }
  };
  const t = titles[gameId] || titles.bubble;
  document.getElementById('active-game-title').textContent = t.title;
  document.getElementById('active-game-subtitle').textContent = t.sub;

  if (gameId === 'bubble') {
    if (!cogState.bubble.currentQuestion) initBubbleGame();
    else resumeBubbleTimer();
  } else if (gameId === 'lockkey') {
    loadLockKeyLevel(cogState.lockkey.currentLevel);
    startLockKeyTimer();
  } else if (gameId === 'maze') {
    loadMazeLevel(cogState.maze.currentLevel);
    startMazeTimer();
  }
}

// ── Assessment Mode ──
function startAssessmentMode() {
  cogState.isAssessmentMode = true;
  cogState.overallTimeRemaining = 20 * 60;
  cogState.totalScore = 0;
  cogState.bubble.questionIndex = 0;
  cogState.bubble.score = 0;
  cogState.lockkey.currentLevel = 1;
  cogState.lockkey.score = 0;
  cogState.lockkey.timeRemaining = 4 * 60;
  cogState.maze.currentLevel = 1;
  cogState.maze.score = 0;
  cogState.maze.timeRemaining = 4 * 60;

  // Start overall countdown
  clearInterval(cogState.overallTimer);
  updateTimerDisplay();
  cogState.overallTimer = setInterval(() => {
    cogState.overallTimeRemaining--;
    updateTimerDisplay();
    if (cogState.overallTimeRemaining <= 0) {
      clearInterval(cogState.overallTimer);
      finishAssessment();
    }
  }, 1000);

  // Switch to Bubble Game
  switchGame('bubble');
  initBubbleGame();
}

function updateTimerDisplay() {
  const m = Math.floor(cogState.overallTimeRemaining / 60);
  const s = cogState.overallTimeRemaining % 60;
  const el = document.getElementById('session-timer-display');
  if (el) {
    el.textContent = `${m}:${s.toString().padStart(2, '0')}`;
    if (cogState.overallTimeRemaining < 120) el.style.color = '#ef4444';
  }
}

function startLockKeyTimer() {
  clearInterval(cogState.lockkey.timer);
  updateLockKeyTimerDisplay();
  cogState.lockkey.timer = setInterval(() => {
    cogState.lockkey.timeRemaining--;
    updateLockKeyTimerDisplay();
    if (cogState.lockkey.timeRemaining <= 0) {
      clearInterval(cogState.lockkey.timer);
      showDoorAlert('⏱️ 4 Minutes Complete! Advancing to Game 3: Maze Pathfinding...');
      setTimeout(() => {
        switchGame('maze');
        loadMazeLevel(1);
      }, 1500);
    }
  }, 1000);
}

function updateLockKeyTimerDisplay() {
  const el = document.getElementById('session-timer-display');
  if (!el) return;
  const s = Math.max(0, cogState.lockkey.timeRemaining);
  const m = Math.floor(s / 60);
  const sec = s % 60;
  el.textContent = `${m}:${sec.toString().padStart(2, '0')}`;
  el.style.color = s < 60 ? '#ef4444' : (s < 120 ? '#f59e0b' : 'var(--text-primary)');
}

function startMazeTimer() {
  clearInterval(cogState.maze.timer);
  updateMazeTimerDisplay();
  cogState.maze.timer = setInterval(() => {
    cogState.maze.timeRemaining--;
    updateMazeTimerDisplay();
    if (cogState.maze.timeRemaining <= 0) {
      clearInterval(cogState.maze.timer);
      showMazeAlert('⏱️ 4 Minutes Complete! Finishing cognitive assessment...');
      setTimeout(() => {
        finishAssessment();
      }, 1500);
    }
  }, 1000);
}

function updateMazeTimerDisplay() {
  const el = document.getElementById('session-timer-display');
  if (!el) return;
  const s = Math.max(0, cogState.maze.timeRemaining);
  const m = Math.floor(s / 60);
  const sec = s % 60;
  el.textContent = `${m}:${sec.toString().padStart(2, '0')}`;
  el.style.color = s < 60 ? '#ef4444' : (s < 120 ? '#f59e0b' : 'var(--text-primary)');
}

function updateScoreDisplay() {
  const el = document.getElementById('session-score-display');
  if (el) el.textContent = cogState.totalScore;
}

// ══════════════════════════════════════════════════════════
// GAME 1: BUBBLE MATH CHALLENGE
// ══════════════════════════════════════════════════════════

// Generates real arithmetic expressions like in screenshot: "2.1 - 0.4", "1.25 + 0.5", "0.8 * 2.2"
function generateMathBubbleQuestion(bubbleCount = 3) {
  const isHighToLow = Math.random() < 0.5;
  const modeText = isHighToLow ? 'HIGH → LOW' : 'LOW → HIGH';

  const usedValues = new Set();
  const bubbles = [];

  const generators = [
    // Subtraction decimals
    () => {
      const a = (Math.floor(Math.random() * 40) + 15) / 10; // 1.5 to 5.5
      const b = (Math.floor(Math.random() * 15) + 3) / 10;  // 0.3 to 1.8
      const val = Math.round((a - b) * 100) / 100;
      return { expr: `${a} - ${b}`, val };
    },
    // Addition decimals
    () => {
      const a = (Math.floor(Math.random() * 25) + 5) / 10;  // 0.5 to 3.0
      const b = (Math.floor(Math.random() * 20) + 5) / 10;  // 0.5 to 2.5
      const val = Math.round((a + b) * 100) / 100;
      return { expr: `${a} + ${b}`, val };
    },
    // Multiplication
    () => {
      const a = (Math.floor(Math.random() * 15) + 4) / 10;  // 0.4 to 1.9
      const b = Math.floor(Math.random() * 4) + 2;         // 2 to 5
      const val = Math.round((a * b) * 100) / 100;
      return { expr: `${a} × ${b}`, val };
    },
    // Products with decimals (like 0.8 * 2.2)
    () => {
      const a = (Math.floor(Math.random() * 8) + 5) / 10;   // 0.5 to 1.2
      const b = (Math.floor(Math.random() * 15) + 15) / 10; // 1.5 to 2.9
      const val = Math.round((a * b) * 100) / 100;
      return { expr: `${a} × ${b}`, val };
    },
    // Percentages
    () => {
      const p = [10, 20, 25, 50][Math.floor(Math.random() * 4)];
      const n = (Math.floor(Math.random() * 8) + 2) * 10;
      const val = Math.round((p * n / 100) * 100) / 100;
      return { expr: `${p}% of ${n}`, val };
    }
  ];

  while (bubbles.length < bubbleCount) {
    const gen = generators[Math.floor(Math.random() * generators.length)];
    const item = gen();
    if (!usedValues.has(item.val)) {
      usedValues.add(item.val);
      bubbles.push(item);
    }
  }

  // Determine correct sequence
  const sorted = [...bubbles].sort((a, b) => isHighToLow ? b.val - a.val : a.val - b.val);

  return {
    isHighToLow,
    modeText,
    bubbles, // shuffled order shown to user
    sorted   // expected click order
  };
}

function initBubbleGame() {
  cogState.bubble.questionIndex = 0;
  cogState.bubble.score = 0;
  renderNextBubbleQuestion();
}

function renderNextBubbleQuestion() {
  clearInterval(cogState.bubble.questionTimer);
  cogState.bubble.questionIndex++;
  if (cogState.bubble.questionIndex > cogState.bubble.totalQuestions) {
    onBubbleGameFinished();
    return;
  }

  // Difficulty scaling: 3 bubbles for Q1-12, 4 bubbles for Q13-24
  const count = cogState.bubble.questionIndex > 14 ? 4 : 3;
  cogState.bubble.currentQuestion = generateMathBubbleQuestion(count);
  cogState.bubble.selectedBubbles = [];
  cogState.bubble.isEvaluating = false;
  cogState.bubble.timeRemaining = 14;

  // Update question header
  document.getElementById('bubble-question-num').textContent =
    `Question: ${cogState.bubble.questionIndex} / ${cogState.bubble.totalQuestions}`;
  document.getElementById('bubble-round-score').textContent =
    `Score: ${cogState.bubble.score}`;
  const pct = (cogState.bubble.questionIndex / cogState.bubble.totalQuestions) * 100;
  document.getElementById('bubble-progress-fill').style.width = `${pct}%`;

  // Update prompt badge
  const promptEl = document.getElementById('bubble-prompt-badge');
  const q = cogState.bubble.currentQuestion;
  promptEl.textContent = `Click circles from ${q.modeText}`;
  promptEl.className = `bubble-prompt ${q.isHighToLow ? 'high-low' : 'low-high'}`;

  // Start 14s timer for this bubble question
  updateBubbleTimerDisplay();
  cogState.bubble.questionTimer = setInterval(() => {
    cogState.bubble.timeRemaining--;
    updateBubbleTimerDisplay();
    if (cogState.bubble.timeRemaining <= 0) {
      clearInterval(cogState.bubble.questionTimer);
      handleBubbleTimeout();
    }
  }, 1000);

  // Render bubbles
  const container = document.getElementById('bubbles-container');
  container.innerHTML = q.bubbles.map((b, i) => `
    <div class="math-bubble" id="bubble-${i}" data-index="${i}" onclick="handleBubbleClick(${i})">
      <div class="expression-text">${b.expr}</div>
    </div>
  `).join('');
}

function updateBubbleTimerDisplay() {
  const timerEl = document.getElementById('bubble-question-timer');
  const fillEl = document.getElementById('bubble-timer-fill');
  const s = Math.max(0, cogState.bubble.timeRemaining);
  if (timerEl) {
    timerEl.textContent = `⏱️ ${s}s`;
    if (s <= 4) {
      timerEl.style.color = '#ef4444';
      if (fillEl) fillEl.classList.add('danger');
    } else if (s <= 7) {
      timerEl.style.color = '#f59e0b';
      if (fillEl) fillEl.classList.remove('danger');
    } else {
      timerEl.style.color = '#22c55e';
      if (fillEl) fillEl.classList.remove('danger');
    }
  }
  if (fillEl) {
    fillEl.style.width = `${(s / 14) * 100}%`;
  }
}

function resumeBubbleTimer() {
  clearInterval(cogState.bubble.questionTimer);
  updateBubbleTimerDisplay();
  cogState.bubble.questionTimer = setInterval(() => {
    cogState.bubble.timeRemaining--;
    updateBubbleTimerDisplay();
    if (cogState.bubble.timeRemaining <= 0) {
      clearInterval(cogState.bubble.questionTimer);
      handleBubbleTimeout();
    }
  }, 1000);
}

function handleBubbleTimeout() {
  if (cogState.bubble.isEvaluating) return;
  cogState.bubble.isEvaluating = true;
  sfx.buzzer();

  const container = document.getElementById('bubbles-container');
  if (container) {
    const bubbleEls = container.querySelectorAll('.math-bubble');
    bubbleEls.forEach(el => el.classList.add('wrong'));
  }

  const promptEl = document.getElementById('bubble-prompt-badge');
  if (promptEl) {
    promptEl.textContent = '⏳ Time Up! (14s expired — auto skipping)';
    promptEl.className = 'bubble-prompt high-low';
  }

  setTimeout(() => {
    renderNextBubbleQuestion();
  }, 1100);
}

function handleBubbleClick(index) {
  if (cogState.bubble.isEvaluating) return;
  const bubbleEl = document.getElementById(`bubble-${index}`);
  if (!bubbleEl || bubbleEl.classList.contains('selected')) return;

  sfx.beep(480 + cogState.bubble.selectedBubbles.length * 90, 'sine', 0.1);

  // Mark selection
  cogState.bubble.selectedBubbles.push(index);
  bubbleEl.classList.add('selected');

  // Add order badge
  const badge = document.createElement('div');
  badge.className = 'order-badge';
  badge.textContent = cogState.bubble.selectedBubbles.length;
  bubbleEl.appendChild(badge);

  // Check if all bubbles clicked
  const total = cogState.bubble.currentQuestion.bubbles.length;
  if (cogState.bubble.selectedBubbles.length === total) {
    evaluateBubbleAnswer();
  }
}

function evaluateBubbleAnswer() {
  clearInterval(cogState.bubble.questionTimer);
  cogState.bubble.isEvaluating = true;
  const q = cogState.bubble.currentQuestion;

  // Check order
  let isCorrect = true;
  for (let i = 0; i < q.sorted.length; i++) {
    const clickedIdx = cogState.bubble.selectedBubbles[i];
    const clickedBubble = q.bubbles[clickedIdx];
    if (clickedBubble !== q.sorted[i]) {
      isCorrect = false;
      break;
    }
  }

  const container = document.getElementById('bubbles-container');
  const bubbleEls = container.querySelectorAll('.math-bubble');

  if (isCorrect) {
    sfx.chime();
    cogState.bubble.score++;
    cogState.totalScore += 10;
    updateScoreDisplay();
    bubbleEls.forEach(el => el.classList.add('correct'));
  } else {
    sfx.buzzer();
    bubbleEls.forEach(el => el.classList.add('wrong'));
    // Briefly display actual evaluated values
    q.bubbles.forEach((b, idx) => {
      const el = document.getElementById(`bubble-${idx}`);
      if (el) {
        const txt = el.querySelector('.expression-text');
        if (txt) txt.textContent = `${b.expr} = ${b.val}`;
      }
    });
  }

  setTimeout(() => {
    renderNextBubbleQuestion();
  }, isCorrect ? 500 : 1200);
}

function onBubbleGameFinished() {
  if (cogState.isAssessmentMode) {
    // Proceed to Game 2 (Lock & Key)
    switchGame('lockkey');
    loadLockKeyLevel(1);
  } else {
    alert(`🎉 Bubble Math Complete! Your score: ${cogState.bubble.score} / ${cogState.bubble.totalQuestions}`);
  }
}

// ══════════════════════════════════════════════════════════
// GAME 2: LOCK & KEY MEMORY GAME (DIRECTIONAL DOORS)
// ══════════════════════════════════════════════════════════

// Pre-designed solvable levels from 3x3 to 6x6 with directional doors!
// Direction codes:
// D_U: Door can ONLY be entered by moving UP (from below)
// D_D: Door can ONLY be entered by moving DOWN (from above)
// D_L: Door can ONLY be entered by moving LEFT (from right)
// D_R: Door can ONLY be entered by moving RIGHT (from left)
// P: Player, K: Key, #: Wall, E: Exit, .: Empty
const LOCK_KEY_LEVELS = [
  // Level 1 (3x3): Collect 1 Key, Enter doors in allowed direction, reach Exit
  // Solvable path: P(2,0) -> (1,0) -> enter (1,1) moving R -> (1,2) -> (0,2)[Key] -> enter (0,1) moving L -> (0,0)[Exit]
  {
    size: 3,
    start: { r: 2, c: 0 },
    keys: 1,
    board: [
      ['E', 'D_L', 'K'],
      ['.', 'D_R', '.'],
      ['P', '.', '.']
    ]
  },

  // Level 2 (3x3): Collect 1 Key, reach Exit
  // Solvable path: P(1,0) -> (0,0) -> enter (0,1) moving R -> (0,2)[Key] -> (1,2) -> (2,2)[Exit]
  {
    size: 3,
    start: { r: 1, c: 0 },
    keys: 1,
    board: [
      ['.', 'D_R', 'K'],
      ['P', 'D_D', '.'],
      ['.', '.', 'E']
    ]
  },

  // Level 3 (4x4): Collect 2 Keys, reach Exit
  // Uses directional doors strategically (no solid wall blocks)
  {
    size: 4,
    start: { r: 3, c: 0 },
    keys: 2,
    board: [
      ['.', 'D_R', 'K', '.'],
      ['D_U', '.', 'D_L', '.'],
      ['.', 'D_U', '.', 'K'],
      ['P', 'D_R', '.', 'E']
    ]
  },

  // Level 4 (4x4): Collect 2 Keys, reach Exit
  {
    size: 4,
    start: { r: 2, c: 1 },
    keys: 2,
    board: [
      ['K', 'D_L', '.', '.'],
      ['.', 'D_U', '.', 'K'],
      ['.', 'P', 'D_R', '.'],
      ['.', '.', 'D_R', 'E']
    ]
  },

  // Level 5 (5x5): Collect 2 Keys, reach Exit
  {
    size: 5,
    start: { r: 4, c: 0 },
    keys: 2,
    board: [
      ['K', '.', '.', 'D_R', 'E'],
      ['.', 'D_R', '.', '.', '.'],
      ['D_U', '.', 'D_U', '.', 'D_D'],
      ['.', 'D_U', '.', 'K', '.'],
      ['P', '.', 'D_R', '.', '.']
    ]
  },

  // Level 6 (6x6): Collect 2 Keys, reach Exit
  {
    size: 6,
    start: { r: 2, c: 2 },
    keys: 2,
    board: [
      ['E', 'D_L', '.', '.', 'D_R', 'K'],
      ['.', '.', 'D_R', '.', '.', '.'],
      ['.', 'D_L', 'P', 'D_R', '.', '.'],
      ['.', 'D_U', '.', '.', 'D_D', '.'],
      ['.', '.', 'D_L', '.', '.', '.'],
      ['.', '.', '.', '.', 'D_R', 'K']
    ]
  }
];

function loadLockKeyLevel(levelNum) {
  cogState.lockkey.currentLevel = levelNum;
  cogState.lockkey.isCompleted = false;

  // Update level selector tabs
  document.querySelectorAll('#view-lockkey .level-btn').forEach((btn, idx) => {
    btn.classList.toggle('active', idx + 1 === levelNum);
  });

  const level = LOCK_KEY_LEVELS[levelNum - 1] || LOCK_KEY_LEVELS[0];
  cogState.lockkey.gridSize = level.size;
  cogState.lockkey.keysTotal = level.keys || 1;
  cogState.lockkey.keysCollected = 0;

  // Deep clone board
  cogState.lockkey.board = level.board.map(row => [...row]);

  // Find player start
  let startFound = false;
  for (let r = 0; r < level.size; r++) {
    for (let c = 0; c < level.size; c++) {
      if (cogState.lockkey.board[r][c] === 'P') {
        cogState.lockkey.startPos = { r, c };
        cogState.lockkey.playerPos = { r, c };
        startFound = true;
      }
    }
  }
  if (!startFound && level.start) {
    cogState.lockkey.startPos = { ...level.start };
    cogState.lockkey.playerPos = { ...level.start };
  }

  updateKeyDisplay();
  hideDoorAlert();
  renderLockKeyGrid();
}

function resetCurrentLockKeyLevel() {
  loadLockKeyLevel(cogState.lockkey.currentLevel);
}

function updateKeyDisplay() {
  const el = document.getElementById('key-count-display');
  if (el) {
    el.innerHTML = `🔑 Keys Collected: <strong>${cogState.lockkey.keysCollected} / ${cogState.lockkey.keysTotal}</strong>`;
  }
}

function showDoorAlert(msg) {
  const alertEl = document.getElementById('door-alert-banner');
  if (alertEl) {
    if (msg) alertEl.textContent = msg;
    alertEl.classList.add('visible');
    sfx.buzzer();
    setTimeout(() => {
      alertEl.classList.remove('visible');
    }, 2500);
  }
}

function hideDoorAlert() {
  const alertEl = document.getElementById('door-alert-banner');
  if (alertEl) alertEl.classList.remove('visible');
}

function renderLockKeyGrid() {
  const gridEl = document.getElementById('lockkey-grid');
  const size = cogState.lockkey.gridSize;
  const board = cogState.lockkey.board;
  const player = cogState.lockkey.playerPos;

  gridEl.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
  gridEl.innerHTML = '';

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const cell = document.createElement('div');
      cell.className = 'grid-cell';
      cell.dataset.r = r;
      cell.dataset.c = c;
      cell.onclick = () => handleLockKeyCellClick(r, c);

      const val = board[r][c];

      // Player Position
      if (r === player.r && c === player.c) {
        cell.classList.add('player');
        if (val.startsWith('D_')) {
          cell.classList.add('directional-door');
          const dir = val.split('_')[1];
          const arrows = { U: '⬆️', D: '⬇️', L: '⬅️', R: '➡️' };
          cell.innerHTML = `♟️<span class="door-direction-arrow">${arrows[dir] || ''}</span>`;
        } else {
          cell.innerHTML = '♟️';
        }
      } else if (val === '#') {
        cell.classList.add('wall');
      } else if (val === 'K') {
        cell.classList.add('key');
        cell.innerHTML = '🔑';
      } else if (val === 'E') {
        cell.classList.add('exit');
        cell.innerHTML = cogState.lockkey.keysCollected >= cogState.lockkey.keysTotal ? '🏁' : '🔒';
      } else if (val.startsWith('D_')) {
        cell.classList.add('directional-door');
        const dir = val.split('_')[1];
        const arrows = { U: '⬆️', D: '⬇️', L: '⬅️', R: '➡️' };
        cell.innerHTML = `<span style="font-size:1.3rem;">🚪</span><span class="door-direction-arrow">${arrows[dir] || ''}</span>`;
      }

      gridEl.appendChild(cell);
    }
  }
}

function handleLockKeyCellClick(targetR, targetC) {
  const player = cogState.lockkey.playerPos;
  // Check if target is adjacent (orthogonally)
  const dr = targetR - player.r;
  const dc = targetC - player.c;
  if (Math.abs(dr) + Math.abs(dc) === 1) {
    moveLockKeyPlayer(dr, dc);
  }
}

function moveLockKeyPlayer(dr, dc) {
  if (cogState.lockkey.isCompleted) return;

  const cur = cogState.lockkey.playerPos;
  const newR = cur.r + dr;
  const newC = cur.c + dc;
  const size = cogState.lockkey.gridSize;

  // Boundary check
  if (newR < 0 || newR >= size || newC < 0 || newC >= size) return;

  const targetVal = cogState.lockkey.board[newR][newC];

  // Wall collision (if any legacy wall)
  if (targetVal === '#') {
    sfx.beep(200, 'sine', 0.1);
    return;
  }

  // Directional Door Check
  if (targetVal.startsWith('D_')) {
    const requiredDir = targetVal.split('_')[1];
    let movementDir = '';
    if (dr === -1) movementDir = 'U';
    else if (dr === 1) movementDir = 'D';
    else if (dc === -1) movementDir = 'L';
    else if (dc === 1) movementDir = 'R';

    // Must move in the arrow direction to pass!
    if (movementDir !== requiredDir) {
      const dirLabels = {
        U: 'UP ⬆️ (from below)',
        D: 'DOWN ⬇️ (from above)',
        L: 'LEFT ⬅️ (from right)',
        R: 'RIGHT ➡️ (from left)'
      };

      // Flash target cell red
      const cellEl = document.querySelector(`#lockkey-grid .grid-cell[data-r="${newR}"][data-c="${newC}"]`);
      if (cellEl) {
        cellEl.classList.add('locked-flash');
      }

      showDoorAlert(`🚫 Door Locked! Only accessible moving ${dirLabels[requiredDir] || requiredDir}. Resetting to start...`);
      cogState.lockkey.resetsCount++;

      setTimeout(() => {
        resetCurrentLockKeyLevel();
      }, 500);
      return;
    }
  }

  // Move player
  cogState.lockkey.playerPos = { r: newR, c: newC };
  sfx.beep(550, 'sine', 0.05);

  // Pick up Key
  if (targetVal === 'K') {
    sfx.keySound();
    cogState.lockkey.keysCollected++;
    cogState.lockkey.board[newR][newC] = '.'; // remove key
    updateKeyDisplay();
  }

  // Reached Exit
  if (targetVal === 'E') {
    if (cogState.lockkey.keysCollected >= cogState.lockkey.keysTotal) {
      onLockKeyLevelComplete();
      return;
    } else {
      // Locked exit
      const remaining = cogState.lockkey.keysTotal - cogState.lockkey.keysCollected;
      showDoorAlert(`🔒 Exit Door is locked! Collect all keys first (${remaining} remaining).`);
      return;
    }
  }

  renderLockKeyGrid();
}

function onLockKeyLevelComplete() {
  cogState.lockkey.isCompleted = true;
  sfx.chime();
  cogState.lockkey.score += 20;
  cogState.totalScore += 20;
  cogState.lockkey.clearedLevels = (cogState.lockkey.clearedLevels || 0) + 1;
  updateScoreDisplay();

  setTimeout(() => {
    if (cogState.lockkey.currentLevel < cogState.lockkey.maxLevel) {
      loadLockKeyLevel(cogState.lockkey.currentLevel + 1);
    } else {
      if (cogState.isAssessmentMode) {
        // Move to Game 3 (Maze)
        switchGame('maze');
        loadMazeLevel(1);
      } else {
        alert('🏆 Outstanding! You mastered all Directional Door levels!');
      }
    }
  }, 600);
}

function showLockKeyHint() {
  alert('💡 Directional Doors Rule:\n\n• Each door (🚪) has an arrow indicating the ONLY direction allowed to enter (e.g. ➡️ means you must move Right into the door).\n• Entering from any other direction locks the door, flashes red, and resets you to start.\n• There are no wall blocks—use the allowed doors to collect all keys (🔑) and reach the exit (🏁)!');
}

// ══════════════════════════════════════════════════════════
// GAME 3: MAZE PATHFINDING GAME
// ══════════════════════════════════════════════════════════

const MAZE_LEVELS = [
  // Maze 1 (4x4) — Solvable in 6 steps
  {
    size: 4,
    start: { r: 0, c: 0 },
    exit: { r: 3, c: 3 },
    optimal: 6,
    board: [
      ['S', '.', '#', '.'],
      ['.', '#', '.', '.'],
      ['.', '.', '.', '#'],
      ['#', '.', '.', 'E']
    ]
  },
  // Maze 2 (4x4) — Solvable in 6 steps
  {
    size: 4,
    start: { r: 0, c: 0 },
    exit: { r: 3, c: 3 },
    optimal: 6,
    board: [
      ['S', '#', '.', '.'],
      ['.', '.', '#', '.'],
      ['#', '.', '.', '.'],
      ['.', '#', '.', 'E']
    ]
  },
  // Maze 3 (5x5) — 100% Solvable in 8 steps
  {
    size: 5,
    start: { r: 0, c: 0 },
    exit: { r: 4, c: 4 },
    optimal: 8,
    board: [
      ['S', '.', '.', '#', '.'],
      ['#', '#', '.', '.', '.'],
      ['.', '.', '.', '#', '.'],
      ['.', '#', '.', '.', '.'],
      ['.', '#', '#', '.', 'E']
    ]
  },
  // Maze 4 (5x5) — 100% Solvable in 8 steps
  {
    size: 5,
    start: { r: 4, c: 0 },
    exit: { r: 0, c: 4 },
    optimal: 8,
    board: [
      ['.', '.', '#', '.', 'E'],
      ['.', '#', '.', '.', '.'],
      ['.', '.', '.', '#', '.'],
      ['#', '.', '#', '.', '.'],
      ['S', '.', '.', '#', '.']
    ]
  },
  // Maze 5 (6x6) — 100% Solvable in 10 steps
  {
    size: 6,
    start: { r: 0, c: 0 },
    exit: { r: 5, c: 5 },
    optimal: 10,
    board: [
      ['S', '.', '.', '#', '.', '.'],
      ['#', '.', '.', '.', '#', '.'],
      ['.', '.', '#', '.', '.', '.'],
      ['.', '#', '.', '#', '.', '.'],
      ['.', '.', '.', '.', '.', '.'],
      ['#', '#', '.', '#', '.', 'E']
    ]
  },
  // Maze 6 (6x6) — 100% Solvable in 10 steps
  {
    size: 6,
    start: { r: 0, c: 5 },
    exit: { r: 5, c: 0 },
    optimal: 10,
    board: [
      ['.', '.', '#', '.', '.', 'S'],
      ['.', '#', '.', '.', '#', '.'],
      ['.', '.', '.', '#', '.', '.'],
      ['#', '.', '.', '.', '.', '.'],
      ['.', '.', '#', '.', '.', '.'],
      ['E', '.', '.', '.', '#', '.']
    ]
  }
];

function loadMazeLevel(levelNum) {
  cogState.maze.currentLevel = levelNum;
  cogState.maze.isCompleted = false;
  cogState.maze.stepsTaken = 0;

  // Update tabs
  document.querySelectorAll('#view-maze .level-btn').forEach((btn, idx) => {
    btn.classList.toggle('active', idx + 1 === levelNum);
  });

  const level = MAZE_LEVELS[levelNum - 1] || MAZE_LEVELS[0];
  cogState.maze.gridSize = level.size;
  cogState.maze.optimalSteps = level.optimal || level.size * 2 - 2;
  cogState.maze.board = level.board.map(r => [...r]);
  cogState.maze.playerPos = { ...level.start };
  cogState.maze.exitPos = { ...level.exit };

  hideMazeAlert();
  updateMazeStepDisplay();
  renderMazeGrid();
}

function resetCurrentMazeLevel() {
  loadMazeLevel(cogState.maze.currentLevel);
}

function showMazeAlert(msg, isSuccess = false) {
  const alertEl = document.getElementById('maze-alert-banner');
  if (alertEl) {
    alertEl.textContent = msg;
    if (isSuccess) alertEl.classList.add('success');
    else alertEl.classList.remove('success');
    alertEl.classList.add('visible');
    setTimeout(() => {
      alertEl.classList.remove('visible');
    }, 2800);
  }
}

function hideMazeAlert() {
  const alertEl = document.getElementById('maze-alert-banner');
  if (alertEl) alertEl.classList.remove('visible');
}

function updateMazeStepDisplay() {
  const el = document.getElementById('maze-step-display');
  if (el) {
    const isExceeded = cogState.maze.stepsTaken > cogState.maze.optimalSteps;
    const colorStyle = isExceeded ? 'color: #ef4444;' : 'color: var(--accent-green);';
    const warningBadge = isExceeded
      ? ` <span style="background: rgba(239,68,68,0.2); color:#ef4444; padding:2px 8px; border-radius:4px; font-size:0.8rem; margin-left:8px; border:1px solid rgba(239,68,68,0.4);">⚠️ Exceeded Shortest Path (${cogState.maze.optimalSteps} max)</span>`
      : ` <span style="background: rgba(34,197,94,0.15); color:var(--accent-green); padding:2px 8px; border-radius:4px; font-size:0.8rem; margin-left:8px; border:1px solid rgba(34,197,94,0.3);">✨ Optimal: ${cogState.maze.optimalSteps} steps</span>`;

    el.innerHTML = `🚶 Steps Taken: <strong style="${colorStyle}">${cogState.maze.stepsTaken}</strong> | Shortest Required: <strong style="color:var(--accent-blue);">${cogState.maze.optimalSteps}</strong>${warningBadge}`;
  }
}

function renderMazeGrid() {
  const gridEl = document.getElementById('maze-grid');
  const size = cogState.maze.gridSize;
  const board = cogState.maze.board;
  const player = cogState.maze.playerPos;

  gridEl.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
  gridEl.innerHTML = '';

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const cell = document.createElement('div');
      cell.className = 'grid-cell';
      cell.dataset.r = r;
      cell.dataset.c = c;
      cell.onclick = () => handleMazeCellClick(r, c);

      const val = board[r][c];

      if (r === player.r && c === player.c) {
        cell.classList.add('player');
        cell.innerHTML = '🟢';
      } else if (val === '#') {
        cell.classList.add('wall');
      } else if (val === 'E') {
        cell.classList.add('exit');
        cell.innerHTML = '🏁';
      }

      gridEl.appendChild(cell);
    }
  }
}

function handleMazeCellClick(targetR, targetC) {
  const player = cogState.maze.playerPos;
  const dr = targetR - player.r;
  const dc = targetC - player.c;
  if (Math.abs(dr) + Math.abs(dc) === 1) {
    moveMazePlayer(dr, dc);
  }
}

function moveMazePlayer(dr, dc) {
  if (cogState.maze.isCompleted) return;

  const cur = cogState.maze.playerPos;
  const newR = cur.r + dr;
  const newC = cur.c + dc;
  const size = cogState.maze.gridSize;

  if (newR < 0 || newR >= size || newC < 0 || newC >= size) return;
  if (cogState.maze.board[newR][newC] === '#') {
    sfx.beep(200, 'sine', 0.1);
    return;
  }

  cogState.maze.playerPos = { r: newR, c: newC };
  cogState.maze.stepsTaken++;
  sfx.beep(600, 'sine', 0.05);
  updateMazeStepDisplay();

  // Reached exit
  if (newR === cogState.maze.exitPos.r && newC === cogState.maze.exitPos.c) {
    onMazeLevelComplete();
    return;
  }

  renderMazeGrid();
}

function onMazeLevelComplete() {
  if (cogState.maze.stepsTaken <= cogState.maze.optimalSteps) {
    // Reached exit using the shortest path!
    cogState.maze.isCompleted = true;
    sfx.chime();
    const marks = 25;
    cogState.maze.score += marks;
    cogState.totalScore += marks;
    cogState.maze.clearedLevels = (cogState.maze.clearedLevels || 0) + 1;
    updateScoreDisplay();
    showMazeAlert(`🎯 Perfect! Shortest path completed in ${cogState.maze.stepsTaken} steps! (+${marks} pts)`, true);

    setTimeout(() => {
      if (cogState.maze.currentLevel < cogState.maze.maxLevel) {
        loadMazeLevel(cogState.maze.currentLevel + 1);
      } else {
        if (cogState.isAssessmentMode) {
          finishAssessment();
        } else {
          alert('🏆 Congratulations! You mastered all Maze Pathfinding levels with optimal shortest paths!');
        }
      }
    }, 1200);
  } else {
    // Sub-optimal path: took more than optimal steps!
    sfx.buzzer();
    showMazeAlert(`⚠️ Not the shortest path! You took ${cogState.maze.stepsTaken} steps (optimal is ${cogState.maze.optimalSteps}). 0 marks added. Resetting maze for retry...`, false);

    setTimeout(() => {
      resetCurrentMazeLevel();
    }, 2500);
  }
}

function showMazeHint() {
  alert(`💡 Maze Pathfinding Shortest Path Rule:\n\n• Goal: Reach the exit flag (🏁) from start (🟢) using ONLY the shortest possible path.\n• Current Level Optimal: Exactly ${cogState.maze.optimalSteps} steps.\n• Marks (+25 pts) are ONLY awarded when you take the exact shortest path. If you take extra steps, no marks are awarded and the maze resets for retry!`);
}

// ── Global Keyboard Navigation ──
function handleKeyNavigation(e) {
  let dr = 0, dc = 0;
  if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') dr = -1;
  else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') dr = 1;
  else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') dc = -1;
  else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') dc = 1;

  if (dr !== 0 || dc !== 0) {
    if (cogState.activeGame === 'lockkey') {
      e.preventDefault();
      moveLockKeyPlayer(dr, dc);
    } else if (cogState.activeGame === 'maze') {
      e.preventDefault();
      moveMazePlayer(dr, dc);
    }
  }
}

// ══════════════════════════════════════════════════════════
// ASSESSMENT FINISH & RESULTS SAVING
// ══════════════════════════════════════════════════════════

function finishAssessment() {
  clearInterval(cogState.overallTimer);
  switchGame('results');

  const bubblePct = Math.round((cogState.bubble.score / cogState.bubble.totalQuestions) * 100);
  const lockKeyPct = Math.round((cogState.lockkey.currentLevel / cogState.lockkey.maxLevel) * 100);
  const mazePct = Math.round((cogState.maze.currentLevel / cogState.maze.maxLevel) * 100);

  const overallPct = Math.round((bubblePct * 0.4) + (lockKeyPct * 0.3) + (mazePct * 0.3));

  document.getElementById('cog-final-pct').textContent = `${overallPct}%`;
  document.getElementById('res-bubble-score').textContent = `${cogState.bubble.score} / ${cogState.bubble.totalQuestions}`;
  document.getElementById('res-lockkey-score').textContent = `${cogState.lockkey.currentLevel} / ${cogState.lockkey.maxLevel}`;
  document.getElementById('res-maze-score').textContent = `${cogState.maze.currentLevel} / ${cogState.maze.maxLevel}`;

  const feedbackEl = document.getElementById('cog-feedback-text');
  if (overallPct >= 80) feedbackEl.textContent = '🎉 Outstanding! Top 5% Cognitive Performance!';
  else if (overallPct >= 60) feedbackEl.textContent = '👍 Good speed and spatial reasoning. Ready for Accenture!';
  else feedbackEl.textContent = '💪 Keep practicing! Speed and directional awareness improve with practice.';

  // Save to localStorage for My Results history
  const timeTaken = 20 * 60 - cogState.overallTimeRemaining;
  const resultRecord = {
    id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
    company: 'Accenture',
    section: 'Cognitive Assessment (Gamified Games)',
    date: new Date().toISOString(),
    total: 36, // 24 bubbles + 6 lockkey + 6 maze
    correct: Math.round((overallPct / 100) * 36),
    incorrect: 36 - Math.round((overallPct / 100) * 36),
    unanswered: 0,
    percentage: overallPct,
    timeTaken: Math.max(timeTaken, 1),
    totalTime: 20 * 60,
    topicScores: {
      'Bubble Math Challenge': { correct: cogState.bubble.score, total: cogState.bubble.totalQuestions },
      'Lock & Key Directional Doors': { correct: cogState.lockkey.currentLevel, total: cogState.lockkey.maxLevel },
      'Maze Pathfinding': { correct: cogState.maze.currentLevel, total: cogState.maze.maxLevel }
    },
    questionResults: [
      {
        id: 'cog_bubble',
        question: 'Bubble Math: Quick mental arithmetic and ascending/descending order',
        code: null,
        options: ['Accuracy: ' + bubblePct + '%'],
        correctAnswer: 0,
        userAnswer: 0,
        isCorrect: bubblePct >= 60,
        explanation: `Score: ${cogState.bubble.score} / ${cogState.bubble.totalQuestions} questions correct.`,
        topic: 'Bubble Math Challenge'
      },
      {
        id: 'cog_lockkey',
        question: 'Lock & Key Memory Game: Directional Doors navigation from 3x3 to 6x6',
        code: null,
        options: ['Levels Cleared: ' + cogState.lockkey.currentLevel + ' / ' + cogState.lockkey.maxLevel],
        correctAnswer: 0,
        userAnswer: 0,
        isCorrect: lockKeyPct >= 60,
        explanation: `Cleared ${cogState.lockkey.currentLevel} of ${cogState.lockkey.maxLevel} directional door levels.`,
        topic: 'Lock & Key Directional Doors'
      },
      {
        id: 'cog_maze',
        question: 'Maze Pathfinding: Shortest obstacle path traversal',
        code: null,
        options: ['Levels Cleared: ' + cogState.maze.currentLevel + ' / ' + cogState.maze.maxLevel],
        correctAnswer: 0,
        userAnswer: 0,
        isCorrect: mazePct >= 60,
        explanation: `Cleared ${cogState.maze.currentLevel} of ${cogState.maze.maxLevel} maze levels.`,
        topic: 'Maze Pathfinding'
      }
    ]
  };

  try {
    const key = 'mockprep_results';
    let history = JSON.parse(localStorage.getItem(key)) || [];
    history.unshift(resultRecord);
    if (history.length > 50) history = history.slice(0, 50);
    localStorage.setItem(key, JSON.stringify(history));
  } catch (e) {
    console.error('Failed to save result:', e);
  }

  // If in Full Mock Mode or redirected from fullmock, save stage3 and auto-advance to Stage 4 (Coding)
  const params = new URLSearchParams(window.location.search);
  const isFullMock = params.get('from') === 'fullmock' || params.get('mode') === 'fullmock';

  if (isFullMock) {
    let fullMock = {};
    try {
      fullMock = JSON.parse(localStorage.getItem('mockprep_current_fullmock')) || {};
    } catch(e) { fullMock = {}; }
    fullMock.id = fullMock.id || ('fm_' + Date.now().toString(36));
    fullMock.stage3 = resultRecord;
    try {
      localStorage.setItem('mockprep_current_fullmock', JSON.stringify(fullMock));
    } catch(e) {}

    // Show Auto-Transition Modal to Stage 4: Algorithmic Coding
    const transModal = document.getElementById('fullmock-transition-modal');
    if (transModal) {
      transModal.classList.add('active');
      let countdown = 3;
      const timerEl = document.getElementById('fm-trans-timer');
      const btn = document.getElementById('fm-trans-btn');
      if (timerEl) timerEl.textContent = countdown;
      const targetUrl = 'test.html?company=accenture&section=coding&mode=fullmock';

      let hasNavigated = false;
      const proceed = () => {
        if (hasNavigated) return;
        hasNavigated = true;
        clearInterval(transTimer);
        window.location.href = targetUrl;
      };

      if (btn) btn.onclick = proceed;

      const transTimer = setInterval(() => {
        countdown--;
        if (timerEl) timerEl.textContent = countdown;
        if (countdown <= 0) {
          proceed();
        }
      }, 1000);
    } else {
      window.location.href = 'test.html?company=accenture&section=coding&mode=fullmock';
    }
  }

  const nextStageEl = document.getElementById('fullmock-next-stage');
  if (nextStageEl && isFullMock) {
    nextStageEl.innerHTML = `
      <div style="margin: 20px auto; max-width: 500px; padding: 20px; background: linear-gradient(135deg, rgba(124, 58, 237, 0.25), rgba(0, 212, 255, 0.25)); border: 2px solid var(--accent-purple); border-radius: 16px; text-align: center; box-shadow: 0 8px 30px rgba(124, 58, 237, 0.35);">
        <div style="font-size: 2rem; margin-bottom: 4px;">🎉</div>
        <h3 style="margin-bottom: 6px; color: #fff;">Stage 3 Complete!</h3>
        <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 16px;">
          Next in Full Mock: <strong>Stage 4 — Coding Assessment (2 DSA + 1 SQL + 1 Frontend DOM • 60 min)</strong>
        </p>
        <a href="test.html?company=accenture&section=coding&mode=fullmock" class="btn btn-primary btn-lg" style="box-shadow: 0 0 20px rgba(0,212,255,0.4); text-decoration: none;">
          🚀 Proceed to Stage 4: Coding Assessment →
        </a>
      </div>
    `;
    nextStageEl.classList.remove('hidden');
  }
}
