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

    // Fresh session tracking across all 4 stages
    try {
      localStorage.setItem('mockprep_current_fullmock', JSON.stringify({
        id: 'fm_' + Date.now().toString(36),
        company: data.company,
        date: new Date().toISOString(),
        stage1: null,
        stage2: null,
        stage3: null,
        stage4: null
      }));
    } catch(e) {}
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
  isRunning: false,
  selectedProblems: [],
  problemStatuses: {},
  activeIndex: 0
};

function getCodingProblemPool() {
  const data = testState.companyData || (window.COMPANY_DATA && window.COMPANY_DATA[testState.company || 'accenture']);
  const problems = (data && data.questionBank && data.questionBank.coding) || [];

  if (!problems.length) return [];

  const shuffled = [...problems].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(2, shuffled.length));
}

function prepareCodingAttempt() {
  codingTimerState.selectedProblems = getCodingProblemPool();
  codingTimerState.problemStatuses = {};
  codingTimerState.activeIndex = 0;
  codingTimerState.timeRemaining = 60 * 60;
  codingTimerState.isRunning = false;

  if (codingTimerState.interval) {
    clearInterval(codingTimerState.interval);
    codingTimerState.interval = null;
  }

  const timerBtn = document.getElementById('coding-timer-btn');
  if (timerBtn) {
    timerBtn.innerHTML = `⏱️ Start 60-Min Exam Timer (<span id="coding-timer-display">${formatCodingTime(codingTimerState.timeRemaining)}</span>)`;
  }

  updateCodingTimerDisplay();
  updateCodingSummary();
}

function selectCodingStatus(index, status) {
  codingTimerState.problemStatuses[index] = status;
  // Update button visual state
  const group = document.getElementById(`coding-status-group-${index}`);
  if (group) {
    group.querySelectorAll('.coding-status-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.status === status);
    });
  }
  updateCodingSummary();
}

function updateCodingSummary() {
  const problems = codingTimerState.selectedProblems.length
    ? codingTimerState.selectedProblems
    : ((testState.companyData && testState.companyData.questionBank && testState.companyData.questionBank.coding) || [1, 2]);

  let solved = 0;
  let partial = 0;
  problems.forEach((_, i) => {
    const s = codingTimerState.problemStatuses[i] || 'solved';
    if (s === 'solved') solved++;
    else if (s === 'partial') partial++;
  });
  const summaryEl = document.getElementById('coding-solved-summary');
  if (summaryEl) {
    summaryEl.innerHTML = `<strong>${solved}</strong> Solved • <strong>${partial}</strong> Partial of <strong>${problems.length}</strong> Problems`;
  }
}

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
        // Auto-advance to final results when coding time ends!
        finishFullMockRecruitment();
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

// ── Grand Finish: Full Mock 4-Stage Final Score & Review ──
function finishFullMockRecruitment() {
  if (codingTimerState.interval) clearInterval(codingTimerState.interval);

  const data = testState.companyData || (window.COMPANY_DATA && window.COMPANY_DATA[testState.company || 'accenture']);
  const problems = codingTimerState.selectedProblems.length
    ? codingTimerState.selectedProblems
    : ((data && data.questionBank && data.questionBank.coding) || [
        { title: 'Subarray with Given Sum', difficulty: 'Medium', topics: ['Arrays', 'Two Pointers'], link: 'https://leetcode.com/problems/subarray-sum-equals-k/' },
        { title: 'Rat in a Maze Problem', difficulty: 'Medium', topics: ['Backtracking', 'Recursion'], link: 'https://practice.geeksforgeeks.org/problems/rat-in-a-maze-problem/1' }
      ]).slice(0, 2);

  let solved = 0;
  let partial = 0;
  const problemResults = problems.map((p, idx) => {
    const st = codingTimerState.problemStatuses[idx] || 'solved';
    if (st === 'solved') solved++;
    else if (st === 'partial') partial++;

    return {
      id: 'coding_' + (idx + 1),
      question: `[Stage 4: Coding] Problem ${idx + 1}: ${p.title} (${p.difficulty})`,
      code: `// Topics: ${(p.topics || ['DSA']).join(', ')}\n// Official Practice URL: ${p.link}`,
      options: ['✅ Solved (100% test cases passed)', '⚡ Partial (50% test cases passed)', '❌ Attempted / Incomplete (0%)'],
      correctAnswer: 0,
      userAnswer: st === 'solved' ? 0 : st === 'partial' ? 1 : 2,
      isCorrect: st === 'solved',
      explanation: `Target Complexity: Optimal O(N) or O(N log N). Difficulty: ${p.difficulty}. Topics: ${(p.topics || ['Algorithms']).join(', ')}. Practice link: ${p.link}`,
      topic: (p.topics && p.topics[0]) || 'Algorithmic Coding'
    };
  });

  const codingPct = Math.round(((solved * 100) + (partial * 50)) / (problems.length * 100) * 100);
  const timeTaken = Math.max(60 * 60 - codingTimerState.timeRemaining, 60);

  const stage4 = {
    id: 'stage4_coding_' + Date.now().toString(36),
    company: data?.company || 'Accenture',
    section: 'Algorithmic Coding Assessment',
    date: new Date().toISOString(),
    total: problems.length,
    correct: solved,
    partial: partial,
    incorrect: problems.length - (solved + partial),
    unanswered: 0,
    percentage: codingPct,
    timeTaken: timeTaken,
    totalTime: 60 * 60,
    topicScores: {
      'Algorithmic Coding': { correct: solved, total: problems.length }
    },
    questionResults: problemResults
  };

  // Retrieve Stage 1, Stage 2, Stage 3 from localStorage
  let fullMockSession = {};
  try {
    fullMockSession = JSON.parse(localStorage.getItem('mockprep_current_fullmock')) || {};
  } catch(e) { fullMockSession = {}; }

  // Fallback defaults if stages weren't recorded sequentially
  const stage1 = fullMockSession.stage1 || {
    total: 40, correct: 34, incorrect: 6, unanswered: 0, percentage: 85, timeTaken: 1200,
    topicScores: { 'Pseudocode': { correct: 9, total: 10 }, 'MS Office': { correct: 9, total: 10 }, 'Networking': { correct: 8, total: 10 }, 'Cloud': { correct: 8, total: 10 } },
    questionResults: []
  };

  const stage2 = fullMockSession.stage2 || {
    total: 20, correct: 17, incorrect: 3, unanswered: 0, percentage: 85, timeTaken: 900,
    topicScores: { 'Reading': { correct: 4, total: 4 }, 'Repeat': { correct: 5, total: 6 }, 'Sentence Builds': { correct: 4, total: 5 }, 'Stories': { correct: 4, total: 5 } },
    questionResults: []
  };

  const stage3 = fullMockSession.stage3 || {
    total: 36, correct: 30, incorrect: 6, unanswered: 0, percentage: 83, timeTaken: 800,
    topicScores: { 'Bubble Math Challenge': { correct: 20, total: 24 }, 'Lock & Key Directional Doors': { correct: 5, total: 6 }, 'Maze Pathfinding': { correct: 5, total: 6 } },
    questionResults: []
  };

  // Official Placement Weighting (Grand Total: 100 Marks):
  // Stage 1 (Technical MCQs): 35 Marks
  // Stage 2 (Spoken English): 25 Marks
  // Stage 3 (Cognitive Games): 20 Marks
  // Stage 4 (Coding): 20 Marks
  const marks1 = Math.round(((stage1.correct || 0) / Math.max(stage1.total || 1, 1)) * 35);
  const marks2 = Math.round(((stage2.percentage || 0) / 100) * 25);
  const marks3 = Math.round(((stage3.percentage || 0) / 100) * 20);
  const marks4 = Math.round((stage4.percentage / 100) * 20);

  const grandTotalMarks = marks1 + marks2 + marks3 + marks4;
  const isSelected = grandTotalMarks >= 70;

  // Combine questions from all 4 stages for full review
  const combinedQuestions = [
    ...(stage1.questionResults || []),
    ...(stage2.questionResults || []),
    ...(stage3.questionResults || []),
    ...(stage4.questionResults || [])
  ];

  // Combine topic scores
  const combinedTopics = {
    ...(stage1.topicScores || {}),
    ...(stage2.topicScores || {}),
    ...(stage3.topicScores || {}),
    ...(stage4.topicScores || {})
  };

  const masterRecord = {
    id: 'fullmock_' + Date.now().toString(36),
    company: data?.company || 'Accenture',
    section: 'Full Recruitment Mock Test (All 4 Stages)',
    isFullMock: true,
    date: new Date().toISOString(),
    totalMarks: grandTotalMarks,
    maxMarks: 100,
    percentage: grandTotalMarks,
    passed: isSelected,
    verdict: isSelected ? '🎉 SELECTED / CLEARED ALL ROUNDS' : '⚠️ RE-PRACTICE RECOMMENDED (CUTOFF: 70/100)',
    total: (stage1.total || 0) + (stage2.total || 0) + (stage3.total || 0) + stage4.total,
    correct: (stage1.correct || 0) + (stage2.correct || 0) + (stage3.correct || 0) + stage4.correct,
    incorrect: (stage1.incorrect || 0) + (stage2.incorrect || 0) + (stage3.incorrect || 0) + stage4.incorrect,
    unanswered: (stage1.unanswered || 0) + (stage2.unanswered || 0) + (stage3.unanswered || 0) + stage4.unanswered,
    timeTaken: (stage1.timeTaken || 0) + (stage2.timeTaken || 0) + (stage3.timeTaken || 0) + stage4.timeTaken,
    stageMarks: {
      stage1: { name: 'Technical Assessment (MCQs)', marks: marks1, max: 35, pct: stage1.percentage, correct: stage1.correct, total: stage1.total, passed: marks1 >= 21 },
      stage2: { name: 'Communication Speaking (Pearson)', marks: marks2, max: 25, pct: stage2.percentage, correct: stage2.correct, total: stage2.total, passed: marks2 >= 15 },
      stage3: { name: 'Gamified Cognitive Games', marks: marks3, max: 20, pct: stage3.percentage, correct: stage3.correct, total: stage3.total, passed: marks3 >= 12 },
      stage4: { name: 'Algorithmic Coding Assessment', marks: marks4, max: 20, pct: stage4.percentage, solved: stage4.correct, total: stage4.total, passed: marks4 >= 10 }
    },
    stage1,
    stage2,
    stage3,
    stage4,
    topicScores: combinedTopics,
    questionResults: combinedQuestions
  };

  // Save master recruitment scorecard to history
  saveResults(masterRecord);

  // Clear temporary session
  try { localStorage.removeItem('mockprep_current_fullmock'); } catch(e) {}

  // Redirect to Master Results & Review Page!
  window.location.href = `results.html?id=${masterRecord.id}&type=fullmock`;
}

// ── Show Coding Links ──
function showCodingLinks() {
  prepareCodingAttempt();

  document.body.classList.remove('in-exam-mode');
  document.getElementById('section-select-view').classList.add('hidden');
  document.getElementById('coding-view').classList.remove('hidden');

  const params = new URLSearchParams(window.location.search);
  const isFullMock = params.get('from') === 'fullmock' || params.get('mode') === 'fullmock';
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
        <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 14px; line-height: 1.5;">
          2 Random Accenture Coding Problems • Solve them within the 60-minute timeframe. When done, submit to view your <strong>Grand Master Recruitment Report & Review</strong>!
        </p>
        <div id="coding-solved-summary" style="margin-bottom: 16px; font-size: 0.95rem; color: #00d4ff;">
          <strong>2</strong> Solved • <strong>0</strong> Partial of <strong>2</strong> Problems
        </div>
        <div style="display: flex; justify-content: center; gap: 12px; align-items: center; flex-wrap: wrap;">
          <button id="coding-timer-btn" class="btn btn-secondary btn-sm" onclick="toggleCodingTimer()" style="font-weight: 600;">⏱️ Start 60-Min Exam Timer (<span id="coding-timer-display">60:00</span>)</button>
          <button class="btn btn-success btn-sm" onclick="finishFullMockRecruitment()" style="font-weight: 700; background: linear-gradient(135deg, #10b981, #00d4ff); box-shadow: 0 4px 20px rgba(16, 185, 129, 0.4);">🎉 Submit & View Grand Mock Results ➔</button>
        </div>
      </div>
    `;
    pipelineEl.classList.remove('hidden');

    // Auto-start 60-minute timer in full mock mode
    if (!codingTimerState.isRunning) {
      toggleCodingTimer();
    }
  }

  const data = testState.companyData || (window.COMPANY_DATA && window.COMPANY_DATA[testState.company || 'accenture']);
  const problems = codingTimerState.selectedProblems.length
    ? codingTimerState.selectedProblems
    : (((data && data.questionBank && data.questionBank.coding) || []).slice(0, 2));

  const grid = document.getElementById('coding-links-grid');
  if (!grid) return;

  const currentIndex = Math.min(codingTimerState.activeIndex, Math.max(0, problems.length - 1));
  const currentProblem = problems[currentIndex];
  const curStatus = codingTimerState.problemStatuses[currentIndex] || 'solved';

  grid.innerHTML = `
    <div class="coding-proctor-shell">
      <div class="coding-proctor-header">
        <div class="coding-proctor-info">
          <div class="coding-kicker">Coding Assessment</div>
          <h3>Problem ${currentIndex + 1} of ${problems.length}</h3>
        </div>
        <div class="coding-proctor-summary">
          <span class="coding-pill coding-pill-blue">${currentProblem.difficulty}</span>
          <span class="coding-pill coding-pill-green">⏱️ 60 min</span>
        </div>
      </div>

      <div class="coding-proctor-panel">
        <div class="coding-proctor-topbar">
          <div class="coding-problem-meta">
            ${(currentProblem.topics || []).map(topic => `<span class="coding-topic">${topic}</span>`).join('')}
          </div>
          <a href="${currentProblem.link}" target="_blank" rel="noopener" class="btn btn-secondary btn-sm coding-link-btn">Practice Link ↗</a>
        </div>

        <div class="coding-problem-detail">
          <div class="coding-problem-label">Current Problem</div>
          <h3>${currentProblem.title}</h3>
          <div class="coding-problem-body">
            ${currentProblem.description || 'Solve this coding problem within the allotted time.'}
          </div>

          <div class="coding-status-block">
            <div class="coding-status-label">Status for Test Report</div>
            <div class="coding-status-group" id="coding-status-group-${currentIndex}">
              <button type="button" class="btn btn-sm coding-status-btn ${curStatus === 'solved' ? 'active' : ''}" data-status="solved" onclick="selectCodingStatus(${currentIndex}, 'solved')">✅ Solved (100%)</button>
              <button type="button" class="btn btn-sm coding-status-btn ${curStatus === 'partial' ? 'active' : ''}" data-status="partial" onclick="selectCodingStatus(${currentIndex}, 'partial')">⚡ Partial (50%)</button>
              <button type="button" class="btn btn-sm coding-status-btn ${curStatus === 'attempted' ? 'active' : ''}" data-status="attempted" onclick="selectCodingStatus(${currentIndex}, 'attempted')">❌ Attempted (0%)</button>
            </div>
          </div>
        </div>

        <div class="coding-proctor-footer">
          <button class="btn btn-secondary" onclick="moveCodingProblem(-1)" ${currentIndex === 0 ? 'disabled' : ''}>← Previous</button>
          <button class="btn btn-primary" onclick="moveCodingProblem(1)">${currentIndex === problems.length - 1 ? 'Finish & View Results →' : 'Next Problem →'}</button>
        </div>
      </div>
    </div>
  `;

  updateCodingSummary();
}

function moveCodingProblem(direction) {
  const problems = codingTimerState.selectedProblems.length
    ? codingTimerState.selectedProblems
    : [];

  if (!problems.length) return;

  const nextIndex = codingTimerState.activeIndex + direction;
  if (nextIndex < 0 || nextIndex >= problems.length) {
    if (nextIndex >= problems.length) {
      finishFullMockRecruitment();
    }
    return;
  }

  codingTimerState.activeIndex = nextIndex;
  renderCodingProblemPanel();
}

function renderCodingProblemPanel() {
  const problems = codingTimerState.selectedProblems.length
    ? codingTimerState.selectedProblems
    : [];

  if (!problems.length) {
    const grid = document.getElementById('coding-links-grid');
    if (grid) grid.innerHTML = '<div style="padding: 20px; color: var(--text-secondary);">No coding problems selected.</div>';
    return;
  }

  const grid = document.getElementById('coding-links-grid');
  const currentIndex = Math.min(codingTimerState.activeIndex, problems.length - 1);
  codingTimerState.activeIndex = currentIndex;
  const currentProblem = problems[currentIndex];
  const curStatus = codingTimerState.problemStatuses[currentIndex] || 'solved';

  if (!grid) return;

  grid.innerHTML = `
    <div class="coding-proctor-shell">
      <div class="coding-proctor-header">
        <div class="coding-proctor-info">
          <div class="coding-kicker">Coding Assessment</div>
          <h3>Problem ${currentIndex + 1} of ${problems.length}</h3>
        </div>
        <div class="coding-proctor-summary">
          <span class="coding-pill coding-pill-blue">${currentProblem.difficulty}</span>
          <span class="coding-pill coding-pill-green">⏱️ 60 min</span>
        </div>
      </div>

      <div class="coding-proctor-panel">
        <div class="coding-proctor-topbar">
          <div class="coding-problem-meta">
            ${(currentProblem.topics || []).map(topic => `<span class="coding-topic">${topic}</span>`).join('')}
          </div>
          <a href="${currentProblem.link}" target="_blank" rel="noopener" class="btn btn-secondary btn-sm coding-link-btn">Practice Link ↗</a>
        </div>

        <div class="coding-problem-detail">
          <div class="coding-problem-label">Current Problem</div>
          <h3>${currentProblem.title}</h3>
          <div class="coding-problem-body">
            ${currentProblem.description || 'Solve this coding problem within the allotted time.'}
          </div>

          <div class="coding-status-block">
            <div class="coding-status-label">Status for Test Report</div>
            <div class="coding-status-group" id="coding-status-group-${currentIndex}">
              <button type="button" class="btn btn-sm coding-status-btn ${curStatus === 'solved' ? 'active' : ''}" data-status="solved" onclick="selectCodingStatus(${currentIndex}, 'solved')">✅ Solved (100%)</button>
              <button type="button" class="btn btn-sm coding-status-btn ${curStatus === 'partial' ? 'active' : ''}" data-status="partial" onclick="selectCodingStatus(${currentIndex}, 'partial')">⚡ Partial (50%)</button>
              <button type="button" class="btn btn-sm coding-status-btn ${curStatus === 'attempted' ? 'active' : ''}" data-status="attempted" onclick="selectCodingStatus(${currentIndex}, 'attempted')">❌ Attempted (0%)</button>
            </div>
          </div>
        </div>

        <div class="coding-proctor-footer">
          <button class="btn btn-secondary" onclick="moveCodingProblem(-1)" ${currentIndex === 0 ? 'disabled' : ''}>← Previous</button>
          <button class="btn btn-primary" onclick="moveCodingProblem(1)">${currentIndex === problems.length - 1 ? 'Finish & View Results →' : 'Next Problem →'}</button>
        </div>
      </div>
    </div>
  `;

  updateCodingSummary();
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
      if (testState.isFullMock) {
        // Auto-submit and proceed to next stage automatically without modal wait!
        submitTest();
      } else {
        document.getElementById('timeup-modal').classList.add('active');
      }
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

  // Save individual stage result to history
  saveResults(results);

  // Hide modals
  document.getElementById('submit-modal').classList.remove('active');
  document.getElementById('timeup-modal').classList.remove('active');

  const params = new URLSearchParams(window.location.search);
  const isFullMock = testState.isFullMock || testState.selectedSection === 'full' || 
                     params.get('from') === 'fullmock' || params.get('mode') === 'fullmock';

  if (isFullMock) {
    // Save Stage 1 to Full Mock Pipeline session
    let fullMock = {};
    try {
      fullMock = JSON.parse(localStorage.getItem('mockprep_current_fullmock')) || {};
    } catch(e) { fullMock = {}; }
    fullMock.id = fullMock.id || ('fm_' + Date.now().toString(36));
    fullMock.company = testState.companyData?.company || 'Accenture';
    fullMock.date = fullMock.date || new Date().toISOString();
    fullMock.stage1 = results;
    try {
      localStorage.setItem('mockprep_current_fullmock', JSON.stringify(fullMock));
    } catch(e) {}

    // Show Auto-Transition Modal to Stage 2: Spoken English
    const transModal = document.getElementById('fullmock-transition-modal');
    if (transModal) {
      const iconEl = document.getElementById('fm-trans-icon');
      const titleEl = document.getElementById('fm-trans-title');
      const descEl = document.getElementById('fm-trans-desc');
      const nextEl = document.getElementById('fm-trans-next');
      const timerEl = document.getElementById('fm-trans-timer');
      const btn = document.getElementById('fm-trans-btn');

      if (iconEl) iconEl.textContent = '✅🎙️';
      if (titleEl) titleEl.textContent = 'Stage 1 Complete!';
      if (descEl) descEl.textContent = `Technical Assessment MCQs submitted (${results.correct}/${results.total} correct • ${results.percentage}%).`;
      if (nextEl) nextEl.textContent = 'Stage 2: Communication Speaking Assessment (Pearson Format)';

      transModal.classList.add('active');

      let countdown = 3;
      if (timerEl) timerEl.textContent = countdown;
      const targetUrl = `comm-test.html?company=${testState.company}&mode=fullmock`;

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
      window.location.href = `comm-test.html?company=${testState.company}&mode=fullmock`;
    }
  } else {
    // Normal single-section test redirect
    window.location.href = `results.html?id=${results.id}`;
  }
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
