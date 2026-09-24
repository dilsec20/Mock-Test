// =====================================================
// MockPrep — Test Engine
// Core logic: timer, navigation, scoring, state mgmt
// =====================================================

let testState = {
  company: null,
  companyData: null,
  selectedSection: null,
  questions: [],
  currentIndex: 0,
  answers: {},       // { questionId: selectedOptionIndex }
  flagged: new Set(),
  startTime: null,
  timeRemaining: 0,  // seconds
  timerInterval: null,
  isSubmitted: false
};

// ── Initialize ──
document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  testState.company = params.get('company') || 'accenture';

  // Load data from global (loaded via script tag, avoids CORS on file://)
  if (window.COMPANY_DATA && window.COMPANY_DATA[testState.company]) {
    testState.companyData = window.COMPANY_DATA[testState.company];
    renderSectionSelector();

    const sectionParam = params.get('section');
    if (sectionParam === 'coding') {
      selectSection('coding');
      showCodingLinks();
    } else if (sectionParam) {
      selectSection(sectionParam);
    }
  } else {
    console.error('No data found for company:', testState.company);
    document.getElementById('company-name-display').textContent = 'Error: No data found for ' + testState.company + '. Please go back and try again.';
  }
});

// ── Section Selector ──
function renderSectionSelector() {
  const data = testState.companyData;
  document.getElementById('company-name-display').textContent = data.company + ' — Select a section to practice';

  const container = document.getElementById('section-options');
  const testableSections = data.sections.filter(s => !s.isExternal && !s.isSpeaking && !s.isGamified);
  const speakingSection = data.sections.find(s => s.isSpeaking);
  const gamifiedSection = data.sections.find(s => s.isGamified);
  const codingSection = data.sections.find(s => s.isExternal);

  let html = '';

  // Full Mock Test option (All 4 Official Stages Pipeline)
  html += `
    <div class="section-option full-mock-card" data-section="full" onclick="selectSection('full')" style="border: 2px solid var(--accent-primary); background: linear-gradient(135deg, rgba(0, 212, 255, 0.08), rgba(124, 58, 237, 0.12));">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <div class="section-icon" style="font-size: 1.8rem;">🏆</div>
          <div>
            <h4 style="margin: 0; font-size: 1.15rem; color: #fff;">Full Recruitment Mock Test</h4>
            <span style="font-size: 0.72rem; color: var(--accent-primary); font-weight: 700; letter-spacing: 0.5px;">OFFICIAL 4-STAGE RECRUITMENT FLOW</span>
          </div>
        </div>
        <span style="background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary)); color: #fff; padding: 4px 12px; border-radius: 99px; font-size: 0.72rem; font-weight: 800;">ALL 4 STAGES</span>
      </div>
      <div class="section-meta" style="margin-top: 6px; line-height: 1.6;">
        <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-top: 6px;">
          <span style="background: rgba(0, 212, 255, 0.15); border: 1px solid rgba(0, 212, 255, 0.3); color: #00d4ff; border-radius: 6px; padding: 2px 8px; font-size: 0.72rem; font-weight: 600;">1️⃣ Stage 1: Technical Assessment (MCQs)</span>
          <span style="background: rgba(124, 58, 237, 0.15); border: 1px solid rgba(124, 58, 237, 0.3); color: #a78bfa; border-radius: 6px; padding: 2px 8px; font-size: 0.72rem; font-weight: 600;">2️⃣ Stage 2: Spoken English (Pearson)</span>
          <span style="background: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.3); color: #fbbf24; border-radius: 6px; padding: 2px 8px; font-size: 0.72rem; font-weight: 600;">3️⃣ Stage 3: Gamified Cognitive (14s Bubbles, 4m Doors & Maze)</span>
          <span style="background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.3); color: #34d399; border-radius: 6px; padding: 2px 8px; font-size: 0.72rem; font-weight: 600;">4️⃣ Stage 4: Coding Assessment (60 min)</span>
        </div>
      </div>
    </div>
  `;

  // Individual MCQ sections
  testableSections.forEach(section => {
    html += `
      <div class="section-option" data-section="${section.id}" onclick="selectSection('${section.id}')">
        <div class="section-icon">${section.icon}</div>
        <h4>${section.name}</h4>
        <div class="section-meta">
          ${section.questions} questions • ${section.duration} min • ${section.description}
        </div>
      </div>
    `;
  });

  // Speaking section (Pearson/Versant audio assessment)
  if (speakingSection) {
    html += `
      <div class="section-option" data-section="${speakingSection.id}" onclick="selectSection('${speakingSection.id}')">
        <div class="section-icon">${speakingSection.icon}</div>
        <h4>${speakingSection.name} <span style="font-size: 0.65rem; background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary)); color: white; padding: 2px 8px; border-radius: 99px; margin-left: 6px; font-weight: 700;">REAL FORMAT</span></h4>
        <div class="section-meta">
          ${speakingSection.questions} questions • ${speakingSection.duration} min • Spoken audio assessment with mic: Reading, Repeat, Q&A, Sentence Builds, Stories
        </div>
      </div>
    `;
  }

  // Gamified Cognitive section (Interactive Mini-Games)
  if (gamifiedSection) {
    html += `
      <div class="section-option" data-section="${gamifiedSection.id}" onclick="selectSection('${gamifiedSection.id}')">
        <div class="section-icon">${gamifiedSection.icon}</div>
        <h4>${gamifiedSection.name} <span style="font-size: 0.65rem; background: linear-gradient(135deg, #f59e0b, #ef4444); color: white; padding: 2px 8px; border-radius: 99px; margin-left: 6px; font-weight: 700;">REAL GAMES</span></h4>
        <div class="section-meta">
          ${gamifiedSection.questions} challenges • ${gamifiedSection.duration} min • Interactive mini-games: Bubble Math (High/Low), Directional Doors, Maze Pathfinding
        </div>
      </div>
    `;
  }

  // Coding section (external)
  if (codingSection) {
    html += `
      <div class="section-option" data-section="coding" onclick="selectSection('coding')">
        <div class="section-icon">${codingSection.icon}</div>
        <h4>${codingSection.name}</h4>
        <div class="section-meta">
          ${codingSection.questions} problems • Practice on GFG/LeetCode • ${codingSection.description}
        </div>
      </div>
    `;
  }

  container.innerHTML = html;
}

function selectSection(sectionId) {
  testState.selectedSection = sectionId;

  // Update UI
  document.querySelectorAll('.section-option').forEach(el => {
    el.classList.toggle('selected', el.dataset.section === sectionId);
  });

  document.getElementById('begin-test-btn').disabled = false;
}

// ── Begin Test ──
function beginTest() {
  if (!testState.selectedSection) return;

  // Handle coding section separately
  if (testState.selectedSection === 'coding') {
    showCodingLinks();
    return;
  }

  // Handle speaking section separately (redirects to dedicated speech engine)
  if (testState.selectedSection === 'communication_speaking') {
    window.location.href = `comm-test.html?company=${testState.company}`;
    return;
  }

  // Handle gamified cognitive section separately
  if (testState.selectedSection === 'cognitive_gamified') {
    window.location.href = `cognitive-games.html?company=${testState.company}&mode=assessment`;
    return;
  }

  // Load questions based on selected section
  const data = testState.companyData;

  if (testState.selectedSection === 'full') {
    // Combine all written testable sections (excluding speaking, gamified & coding)
    testState.isFullMock = true;
    testState.questions = [];
    let totalTime = 0;
    data.sections.filter(s => !s.isExternal && !s.isSpeaking && !s.isGamified).forEach(section => {
      const sectionQuestions = data.questionBank[section.id] || [];
      // Shuffle and pick the right number
      const picked = shuffleArray([...sectionQuestions]).slice(0, section.questions);
      picked.forEach(q => { q._section = section.name; });
      testState.questions.push(...picked);
      totalTime += section.duration;
    });
    testState.timeRemaining = totalTime * 60;
    document.getElementById('current-section-name').textContent = 'Stage 1 of 4: Technical Assessment (Full Mock)';
  } else {
    const section = data.sections.find(s => s.id === testState.selectedSection);
    const sectionQuestions = data.questionBank[testState.selectedSection] || [];
    testState.questions = shuffleArray([...sectionQuestions]).slice(0, section.questions);
    testState.questions.forEach(q => { q._section = section.name; });
    testState.timeRemaining = section.duration * 60;
    document.getElementById('current-section-name').textContent = section.name;
  }

  if (testState.questions.length === 0) {
    alert('No questions available for this section.');
    return;
  }

  testState.currentIndex = 0;
  testState.answers = {};
  testState.flagged = new Set();
  testState.startTime = Date.now();
  testState.isSubmitted = false;

  // Switch views
  document.body.classList.add('in-exam-mode');
  document.getElementById('section-select-view').classList.add('hidden');
  document.getElementById('test-view').classList.remove('hidden');

  // Render
  renderQuestionNav();
  renderQuestion();
  startTimer();
  updateSummary();
}

// ── Coding Timer & Full Mock Support ──
let codingTimerState = {
  interval: null,
  timeRemaining: 60 * 60,
  isRunning: false
};

function toggleCodingTimer() {
  const btn = document.getElementById('coding-timer-btn');
  if (codingTimerState.isRunning) {
    clearInterval(codingTimerState.interval);
    codingTimerState.isRunning = false;
    if (btn) btn.innerHTML = `⏱️ Resume 60-Min Timer (<span id="coding-timer-display">${formatCodingTime(codingTimerState.timeRemaining)}</span>)`;
  } else {
    codingTimerState.isRunning = true;
    updateCodingTimerDisplay();
    codingTimerState.interval = setInterval(() => {
      codingTimerState.timeRemaining--;
      updateCodingTimerDisplay();
      if (codingTimerState.timeRemaining <= 0) {
        clearInterval(codingTimerState.interval);
        codingTimerState.isRunning = false;
        alert('⏰ 60 Minutes Coding Assessment Time Expired!');
      }
    }, 1000);
    if (btn) btn.innerHTML = `⏸️ Pause Timer (<span id="coding-timer-display">${formatCodingTime(codingTimerState.timeRemaining)}</span>)`;
  }
}

function updateCodingTimerDisplay() {
  const el = document.getElementById('coding-timer-display');
  if (el) el.textContent = formatCodingTime(codingTimerState.timeRemaining);
}

function formatCodingTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function finishFullMockRecruitment() {
  const modal = document.getElementById('fullmock-complete-modal');
  if (modal) modal.classList.add('active');
}

// ── Show Coding Links ──
function showCodingLinks() {
  document.body.classList.remove('in-exam-mode');
  document.getElementById('section-select-view').classList.add('hidden');
  document.getElementById('coding-view').classList.remove('hidden');

  const params = new URLSearchParams(window.location.search);
  const isFullMock = params.get('from') === 'fullmock';
  const pipelineEl = document.getElementById('coding-fullmock-pipeline');

  if (pipelineEl && isFullMock) {
    pipelineEl.innerHTML = `
      <div style="margin-bottom: 24px; background: linear-gradient(135deg, rgba(0, 212, 255, 0.12), rgba(16, 185, 129, 0.15)); border: 2px solid #10b981; border-radius: 16px; padding: 22px; text-align: center; box-shadow: 0 8px 30px rgba(16, 185, 129, 0.25);">
        <div style="display: flex; justify-content: center; gap: 8px; flex-wrap: wrap; margin-bottom: 12px;">
          <span style="background: rgba(34, 197, 94, 0.2); border: 1px solid #22c55e; color: #22c55e; padding: 4px 12px; border-radius: 99px; font-size: 0.75rem; font-weight: 700;">✅ Stage 1: Technical MCQ</span>
          <span style="color: var(--text-dim); align-self: center;">→</span>
          <span style="background: rgba(34, 197, 94, 0.2); border: 1px solid #22c55e; color: #22c55e; padding: 4px 12px; border-radius: 99px; font-size: 0.75rem; font-weight: 700;">✅ Stage 2: Spoken English</span>
          <span style="color: var(--text-dim); align-self: center;">→</span>
          <span style="background: rgba(34, 197, 94, 0.2); border: 1px solid #22c55e; color: #22c55e; padding: 4px 12px; border-radius: 99px; font-size: 0.75rem; font-weight: 700;">✅ Stage 3: Cognitive Games</span>
          <span style="color: var(--text-dim); align-self: center;">→</span>
          <span style="background: rgba(16, 185, 129, 0.25); border: 1px solid #10b981; color: #10b981; padding: 4px 12px; border-radius: 99px; font-size: 0.75rem; font-weight: 700;">🏆 Stage 4: Coding (Final Stage)</span>
        </div>
        <h3 style="margin-bottom: 6px; color: #fff; font-size: 1.3rem;">🏆 Final Stage: Accenture Coding Assessment</h3>
        <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 16px; line-height: 1.5;">
          3 Official Accenture Coding Problems • Practice solving them within the official 60-minute timeframe.
        </p>
        <div style="display: flex; justify-content: center; gap: 12px; align-items: center; flex-wrap: wrap;">
          <button id="coding-timer-btn" class="btn btn-secondary btn-sm" onclick="toggleCodingTimer()" style="font-weight: 600;">⏱️ Start 60-Min Exam Timer (<span id="coding-timer-display">60:00</span>)</button>
          <button class="btn btn-success btn-sm" onclick="finishFullMockRecruitment()" style="font-weight: 700;">🎉 Finish Full Mock Test</button>
        </div>
      </div>
    `;
    pipelineEl.classList.remove('hidden');
  }

  const data = testState.companyData;
  const problems = data.questionBank.coding || [];

  const grid = document.getElementById('coding-links-grid');
  grid.innerHTML = problems.map((p, i) => `
    <a href="${p.link}" target="_blank" rel="noopener" class="coding-link-card">
      <div style="flex-shrink: 0; width: 36px; height: 36px; border-radius: 8px; background: var(--bg-glass); border: 1px solid var(--border-glass); display: flex; align-items: center; justify-content: center; font-size: 0.85rem; font-weight: 700; color: var(--text-secondary);">${i + 1}</div>
      <div style="flex: 1;">
        <div style="font-weight: 600; font-size: 0.9rem;">${p.title}</div>
        <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 2px;">${p.topics.join(' • ')}</div>
      </div>
      <span class="difficulty ${p.difficulty.toLowerCase()}">${p.difficulty}</span>
      <span style="color: var(--text-dim);">↗</span>
    </a>
  `).join('');
}

// ── Timer ──
function startTimer() {
  updateTimerDisplay();
  testState.timerInterval = setInterval(() => {
    testState.timeRemaining--;

    if (testState.timeRemaining <= 0) {
      clearInterval(testState.timerInterval);
      testState.timeRemaining = 0;
      updateTimerDisplay();
      document.getElementById('timeup-modal').classList.add('active');
      return;
    }

    updateTimerDisplay();
  }, 1000);
}

function updateTimerDisplay() {
  const mins = Math.floor(testState.timeRemaining / 60);
  const secs = testState.timeRemaining % 60;
  const display = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  const timerEl = document.getElementById('timer-value');
  const timerContainer = document.getElementById('timer-display');

  if (timerEl) timerEl.textContent = display;

  if (timerContainer) {
    timerContainer.classList.remove('warning', 'danger');
    if (testState.timeRemaining <= 60) {
      timerContainer.classList.add('danger');
    } else if (testState.timeRemaining <= 300) {
      timerContainer.classList.add('warning');
    }
  }
}

// ── Render Question ──
function renderQuestion() {
  const q = testState.questions[testState.currentIndex];
  if (!q) return;

  const card = document.getElementById('question-card');
  if (card) card.scrollTop = 0;
  const selectedAnswer = testState.answers[q.id];

  let codeHtml = '';
  if (q.code) {
    const lang = q.codeLang || 'C++';
    codeHtml = `
      <div class="code-snippet">
        <span class="code-lang">${lang}</span>${escapeHtml(q.code)}</div>
    `;
  }

  card.innerHTML = `
    <div class="question-number">Question ${testState.currentIndex + 1} of ${testState.questions.length}</div>
    <div class="question-topic-tag">${q.topic || q._section || ''}</div>
    <div class="question-text">${escapeHtml(q.question)}</div>
    ${codeHtml}
    <div class="options-list">
      ${q.options.map((opt, i) => `
        <div class="option-item ${selectedAnswer === i ? 'selected' : ''}" onclick="selectOption('${q.id}', ${i})" id="option-${i}">
          <div class="option-letter">${String.fromCharCode(65 + i)}</div>
          <div class="option-text">${escapeHtml(opt)}</div>
        </div>
      `).join('')}
    </div>
  `;

  // Update progress
  document.getElementById('progress-text').textContent =
    `Question ${testState.currentIndex + 1} of ${testState.questions.length}`;
  document.getElementById('progress-bar').style.width =
    `${((testState.currentIndex + 1) / testState.questions.length) * 100}%`;

  const totalBadge = document.getElementById('total-q-badge');
  if (totalBadge) totalBadge.textContent = `${testState.questions.length} Qs`;

  // Update flag button
  const flagBtn = document.getElementById('flag-btn');
  if (flagBtn) {
    flagBtn.classList.toggle('active', testState.flagged.has(q.id));
    flagBtn.textContent = testState.flagged.has(q.id) ? '🚩 Flagged' : '🚩 Flag for Review';
  }

  // Update prev/next buttons
  document.getElementById('prev-btn').disabled = testState.currentIndex === 0;
  const nextBtn = document.getElementById('next-btn');
  if (testState.currentIndex === testState.questions.length - 1) {
    nextBtn.textContent = '📤 Submit';
    nextBtn.onclick = showSubmitModal;
  } else {
    nextBtn.textContent = 'Next →';
    nextBtn.onclick = nextQuestion;
  }

  // Update nav highlight
  updateNavHighlight();
  updateSummary();
}

// ── Select Option ──
function selectOption(questionId, optionIndex) {
  if (testState.isSubmitted) return;
  testState.answers[questionId] = optionIndex;
  renderQuestion();
}

// ── Clear Answer ──
function clearAnswer() {
  const q = testState.questions[testState.currentIndex];
  if (q) {
    delete testState.answers[q.id];
    renderQuestion();
  }
}

// ── Flag Toggle ──
function toggleFlag() {
  const q = testState.questions[testState.currentIndex];
  if (!q) return;
  if (testState.flagged.has(q.id)) {
    testState.flagged.delete(q.id);
  } else {
    testState.flagged.add(q.id);
  }
  renderQuestion();
}

// ── Navigation ──
function nextQuestion() {
  if (testState.currentIndex < testState.questions.length - 1) {
    testState.currentIndex++;
    renderQuestion();
  }
}

function prevQuestion() {
  if (testState.currentIndex > 0) {
    testState.currentIndex--;
    renderQuestion();
  }
}

function goToQuestion(index) {
  testState.currentIndex = index;
  renderQuestion();
}

// ── Question Nav Grid ──
function renderQuestionNav() {
  const nav = document.getElementById('question-nav');
  if (!nav) return;

  nav.innerHTML = testState.questions.map((q, i) => `
    <button class="q-nav-btn" id="q-nav-${i}" onclick="goToQuestion(${i})">${i + 1}</button>
  `).join('');
}

function updateNavHighlight() {
  testState.questions.forEach((q, i) => {
    const btn = document.getElementById(`q-nav-${i}`);
    if (!btn) return;

    btn.className = 'q-nav-btn';
    if (i === testState.currentIndex) {
      btn.classList.add('current');
    } else if (testState.flagged.has(q.id)) {
      btn.classList.add('flagged');
      if (testState.answers[q.id] !== undefined) btn.classList.add('answered');
    } else if (testState.answers[q.id] !== undefined) {
      btn.classList.add('answered');
    }
  });
}

// ── Summary ──
function updateSummary() {
  const answered = Object.keys(testState.answers).length;
  const flagged = testState.flagged.size;
  const remaining = testState.questions.length - answered;

  const answeredEl = document.getElementById('answered-count');
  const flaggedEl = document.getElementById('flagged-count');
  const remainingEl = document.getElementById('remaining-count');

  if (answeredEl) answeredEl.textContent = answered;
  if (flaggedEl) flaggedEl.textContent = flagged;
  if (remainingEl) remainingEl.textContent = remaining;
}

// ── Submit Modal ──
function showSubmitModal() {
  const answered = Object.keys(testState.answers).length;
  const total = testState.questions.length;
  const unanswered = total - answered;

  document.getElementById('submit-modal-text').innerHTML =
    `You have answered <strong style="color: var(--accent-green);">${answered}</strong> out of <strong>${total}</strong> questions.` +
    (unanswered > 0 ? `<br><span style="color: var(--accent-orange);">⚠️ ${unanswered} questions are unanswered.</span>` : '') +
    (testState.flagged.size > 0 ? `<br><span style="color: var(--accent-orange);">🚩 ${testState.flagged.size} questions are flagged for review.</span>` : '');

  document.getElementById('submit-modal').classList.add('active');
}

function hideSubmitModal() {
  document.getElementById('submit-modal').classList.remove('active');
}

// ── Submit Test ──
function submitTest() {
  if (testState.isSubmitted) return;
  testState.isSubmitted = true;
  document.body.classList.remove('in-exam-mode');

  // Stop timer
  if (testState.timerInterval) {
    clearInterval(testState.timerInterval);
  }

  // Calculate results
  const results = calculateResults();

  // Save to localStorage
  saveResults(results);

  // Hide modals
  document.getElementById('submit-modal').classList.remove('active');
  document.getElementById('timeup-modal').classList.remove('active');

  // Navigate to results page
  const isFullMock = testState.isFullMock || testState.selectedSection === 'full' || new URLSearchParams(window.location.search).get('from') === 'fullmock';
  window.location.href = `results.html?id=${results.id}${isFullMock ? '&from=fullmock' : ''}`;
}

// ── Calculate Results ──
function calculateResults() {
  let correct = 0;
  let incorrect = 0;
  let unanswered = 0;
  const topicScores = {};
  const questionResults = [];

  testState.questions.forEach(q => {
    const userAnswer = testState.answers[q.id];
    const isCorrect = userAnswer === q.answer;
    const isAnswered = userAnswer !== undefined;

    if (isAnswered && isCorrect) correct++;
    else if (isAnswered && !isCorrect) incorrect++;
    else unanswered++;

    // Track topic scores
    const topic = q.topic || q._section || 'General';
    if (!topicScores[topic]) {
      topicScores[topic] = { correct: 0, total: 0 };
    }
    topicScores[topic].total++;
    if (isCorrect) topicScores[topic].correct++;

    questionResults.push({
      id: q.id,
      question: q.question,
      code: q.code || null,
      options: q.options,
      correctAnswer: q.answer,
      userAnswer: userAnswer !== undefined ? userAnswer : -1,
      isCorrect: isCorrect,
      explanation: q.explanation,
      topic: topic
    });
  });

  const total = testState.questions.length;
  const percentage = Math.round((correct / total) * 100);
  const timeTaken = Math.round((Date.now() - testState.startTime) / 1000);

  return {
    id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
    company: testState.companyData.company,
    section: testState.selectedSection === 'full' ? 'Full Mock Test' :
             testState.companyData.sections.find(s => s.id === testState.selectedSection)?.name || testState.selectedSection,
    date: new Date().toISOString(),
    total,
    correct,
    incorrect,
    unanswered,
    percentage,
    timeTaken,
    totalTime: (testState.selectedSection === 'full'
      ? testState.companyData.sections.filter(s => !s.isExternal && !s.isSpeaking && !s.isGamified).reduce((s, sec) => s + sec.duration, 0)
      : testState.companyData.sections.find(s => s.id === testState.selectedSection)?.duration || 0) * 60,
    topicScores,
    questionResults
  };
}

// ── Save Results ──
function saveResults(results) {
  const key = 'mockprep_results';
  let history = [];
  try {
    history = JSON.parse(localStorage.getItem(key)) || [];
  } catch (e) {}
  history.unshift(results);
  // Keep last 50 attempts
  if (history.length > 50) history = history.slice(0, 50);
  localStorage.setItem(key, JSON.stringify(history));
}

// ── Utilities ──
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ── Keyboard Shortcuts ──
document.addEventListener('keydown', (e) => {
  if (testState.isSubmitted || document.getElementById('test-view').classList.contains('hidden')) return;

  switch (e.key) {
    case 'ArrowRight':
    case 'n':
      e.preventDefault();
      nextQuestion();
      break;
    case 'ArrowLeft':
    case 'p':
      e.preventDefault();
      prevQuestion();
      break;
    case '1': case '2': case '3': case '4':
      e.preventDefault();
      const q = testState.questions[testState.currentIndex];
      if (q) selectOption(q.id, parseInt(e.key) - 1);
      break;
    case 'a': case 'b': case 'c': case 'd':
      e.preventDefault();
      const q2 = testState.questions[testState.currentIndex];
      if (q2) selectOption(q2.id, e.key.charCodeAt(0) - 97);
      break;
    case 'f':
      e.preventDefault();
      toggleFlag();
      break;
  }
});

// ── Prevent accidental page leave ──
window.addEventListener('beforeunload', (e) => {
  if (!testState.isSubmitted && testState.questions.length > 0 && Object.keys(testState.answers).length > 0) {
    e.preventDefault();
    e.returnValue = 'You have an ongoing test. Are you sure you want to leave?';
  }
});
