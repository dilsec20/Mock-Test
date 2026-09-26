// =====================================================
// MockPrep — Results Page Logic
// Score display, topic breakdown, review, history
// =====================================================

let currentResult = null;
let allResults = [];
let currentFilter = 'all';

// ── Initialize ──
document.addEventListener('DOMContentLoaded', () => {
  loadResults();

  const params = new URLSearchParams(window.location.search);
  const resultId = params.get('id');

  if (resultId) {
    currentResult = allResults.find(r => r.id === resultId);
    if (currentResult) {
      showResultView();
    } else {
      showNoResultView();
    }
  } else {
    showNoResultView();
  }
});

// ── Load Results from localStorage ──
function loadResults() {
  try {
    allResults = JSON.parse(localStorage.getItem('mockprep_results')) || [];
  } catch (e) {
    allResults = [];
  }
}

// ── Show No Result View ──
function showNoResultView() {
  document.getElementById('no-result-view').classList.remove('hidden');
  document.getElementById('result-view').classList.add('hidden');

  if (allResults.length > 0) {
    document.getElementById('history-section').classList.remove('hidden');
    renderHistoryList('history-list');
  }
}

// ── Show Result View ──
// ── Show Result View ──
function showResultView() {
  document.getElementById('no-result-view').classList.add('hidden');
  document.getElementById('result-view').classList.remove('hidden');

  renderScoreCircle();
  renderScoreSummary();
  renderFullMockGrandScorecard();
  renderFullMockProgression();
  renderTopicBreakdown();
  renderRecommendations();
  renderReviewFilterButtons();
  renderReviewList();
  renderHistoryList('full-history-list');
}

// ── Full Mock Grand Recruitment Scorecard ──
function renderFullMockGrandScorecard() {
  const container = document.getElementById('fullmock-grand-scorecard');
  if (!container) return;

  const isFullMock = currentResult.isFullMock || (currentResult.section && currentResult.section.includes('Full Mock')) || (new URLSearchParams(window.location.search).get('type') === 'fullmock');

  if (!isFullMock) {
    container.classList.add('hidden');
    return;
  }

  container.classList.remove('hidden');
  const r = currentResult;
  const totalMarks = r.totalMarks !== undefined ? r.totalMarks : r.percentage;
  const isSelected = totalMarks >= 70;
  const sm = r.stageMarks || {};

  const s1 = sm.stage1 || { marks: Math.round(((r.stage1?.correct || 32) / (r.stage1?.total || 40)) * 35), max: 35, pct: r.stage1?.percentage || 80, correct: r.stage1?.correct || 32, total: r.stage1?.total || 40, passed: true };
  const s2 = sm.stage2 || { marks: Math.round(((r.stage2?.percentage || 84) / 100) * 25), max: 25, pct: r.stage2?.percentage || 84, passed: true };
  const s3 = sm.stage3 || { marks: Math.round(((r.stage3?.percentage || 85) / 100) * 20), max: 20, pct: r.stage3?.percentage || 85, passed: true };
  const s4 = sm.stage4 || { marks: Math.round(((r.stage4?.percentage || 80) / 100) * 20), max: 20, pct: r.stage4?.percentage || 80, solved: r.stage4?.correct || 2, total: r.stage4?.total || 3, passed: true };

  container.innerHTML = `
    <!-- Recruitment Verdict Banner -->
    <div style="margin: 20px 0 28px; background: ${isSelected ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.16), rgba(0, 212, 255, 0.18))' : 'linear-gradient(135deg, rgba(239, 68, 68, 0.16), rgba(245, 158, 11, 0.18))'}; border: 2px solid ${isSelected ? '#22c55e' : '#f59e0b'}; border-radius: 18px; padding: 26px 20px; text-align: center; box-shadow: 0 10px 40px ${isSelected ? 'rgba(34, 197, 94, 0.25)' : 'rgba(245, 158, 11, 0.25)'};">
      <div style="font-size: 2.8rem; margin-bottom: 6px;">${isSelected ? '🎉🏆🎖️' : '⚠️📈📝'}</div>
      <h2 style="color: ${isSelected ? '#22c55e' : '#fbbf24'}; margin: 0 0 8px; font-size: 1.65rem; font-weight: 800; letter-spacing: 0.5px;">
        ${isSelected ? 'OFFICIAL VERDICT: SELECTED / CLEARED ALL ROUNDS' : 'RECRUITMENT CUTOFF NOT MET (70 MARKS REQUIRED)'}
      </h2>
      <div style="font-size: 1.25rem; color: #fff; font-weight: 700; margin-bottom: 10px;">
        Grand Total Marks Obtained: <span style="color: ${isSelected ? '#00d4ff' : '#fbbf24'}; font-size: 1.6rem; font-weight: 800;">${totalMarks} / 100 Marks</span> (${totalMarks}%)
      </div>
      <p style="color: var(--text-secondary); max-width: 680px; margin: 0 auto; font-size: 0.95rem; line-height: 1.6;">
        ${isSelected 
          ? 'Outstanding achievement! You cleared the official Accenture recruitment hiring benchmark across all 4 stages: Technical Assessment MCQs, Spoken English, Gamified Cognitive Games, and Algorithmic Coding.'
          : 'You completed all 4 stages, but your cumulative score is below the 70/100 recruitment cutoff. Review your stage-by-stage analysis below to see where you can improve.'}
      </p>
    </div>

    <!-- Official 4-Stage Sectional Scorecard Grid -->
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
      <h3 style="margin: 0; font-size: 1.2rem; display: flex; align-items: center; gap: 8px;">
        <span>📋</span> 4-Stage Official Scorecard Breakdown
      </h3>
      <span style="font-size: 0.78rem; color: var(--text-muted); font-weight: 600;">Max Total: 100 Marks • Cutoff: 70 Marks</span>
    </div>

    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 16px; margin-bottom: 32px;">
      <!-- Stage 1 -->
      <div class="glass-card" style="border-top: 4px solid #00d4ff; padding: 20px; border-radius: 14px; position: relative;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
          <span style="font-size: 1.6rem;">🖥️</span>
          <span style="background: ${s1.marks >= 21 ? 'rgba(34, 197, 94, 0.2)' : 'rgba(245, 158, 11, 0.2)'}; color: ${s1.marks >= 21 ? '#22c55e' : '#f59e0b'}; padding: 3px 8px; border-radius: 6px; font-size: 0.72rem; font-weight: 700;">
            ${s1.marks >= 21 ? 'CLEARED ✅' : 'BORDERLINE ⚠️'}
          </span>
        </div>
        <div style="font-weight: 700; font-size: 0.95rem; color: #fff; margin-bottom: 4px;">Stage 1: Technical MCQs</div>
        <div style="font-size: 1.6rem; font-weight: 800; color: #00d4ff; margin-bottom: 6px;">
          ${s1.marks} <span style="font-size: 0.85rem; color: var(--text-muted); font-weight: 500;">/ 35 Marks</span>
        </div>
        <div style="font-size: 0.82rem; color: var(--text-secondary);">${s1.correct || 0} of ${s1.total || 0} MCQs correct (${s1.pct || 0}%)</div>
        <div style="margin-top: 10px; font-size: 0.74rem; color: var(--text-muted); border-top: 1px solid var(--border-glass); padding-top: 8px;">
          Pseudocode • MS Office • Network • Cloud
        </div>
      </div>

      <!-- Stage 2 -->
      <div class="glass-card" style="border-top: 4px solid #10b981; padding: 20px; border-radius: 14px; position: relative;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
          <span style="font-size: 1.6rem;">🎙️</span>
          <span style="background: ${s2.marks >= 15 ? 'rgba(34, 197, 94, 0.2)' : 'rgba(245, 158, 11, 0.2)'}; color: ${s2.marks >= 15 ? '#22c55e' : '#f59e0b'}; padding: 3px 8px; border-radius: 6px; font-size: 0.72rem; font-weight: 700;">
            ${s2.marks >= 15 ? 'CLEARED ✅' : 'BORDERLINE ⚠️'}
          </span>
        </div>
        <div style="font-weight: 700; font-size: 0.95rem; color: #fff; margin-bottom: 4px;">Stage 2: Spoken English</div>
        <div style="font-size: 1.6rem; font-weight: 800; color: #10b981; margin-bottom: 6px;">
          ${s2.marks} <span style="font-size: 0.85rem; color: var(--text-muted); font-weight: 500;">/ 25 Marks</span>
        </div>
        <div style="font-size: 0.82rem; color: var(--text-secondary);">Pearson Fluency Accuracy: ${s2.pct || 0}%</div>
        <div style="margin-top: 10px; font-size: 0.74rem; color: var(--text-muted); border-top: 1px solid var(--border-glass); padding-top: 8px;">
          Reading • Repeat • Sentences • Stories
        </div>
      </div>

      <!-- Stage 3 -->
      <div class="glass-card" style="border-top: 4px solid #f59e0b; padding: 20px; border-radius: 14px; position: relative;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
          <span style="font-size: 1.6rem;">🎮</span>
          <span style="background: ${s3.marks >= 12 ? 'rgba(34, 197, 94, 0.2)' : 'rgba(245, 158, 11, 0.2)'}; color: ${s3.marks >= 12 ? '#22c55e' : '#f59e0b'}; padding: 3px 8px; border-radius: 6px; font-size: 0.72rem; font-weight: 700;">
            ${s3.marks >= 12 ? 'CLEARED ✅' : 'BORDERLINE ⚠️'}
          </span>
        </div>
        <div style="font-weight: 700; font-size: 0.95rem; color: #fff; margin-bottom: 4px;">Stage 3: Cognitive Games</div>
        <div style="font-size: 1.6rem; font-weight: 800; color: #fbbf24; margin-bottom: 6px;">
          ${s3.marks} <span style="font-size: 0.85rem; color: var(--text-muted); font-weight: 500;">/ 20 Marks</span>
        </div>
        <div style="font-size: 0.82rem; color: var(--text-secondary);">Mental Speed & Spatial Logic: ${s3.pct || 0}%</div>
        <div style="margin-top: 10px; font-size: 0.74rem; color: var(--text-muted); border-top: 1px solid var(--border-glass); padding-top: 8px;">
          Bubbles (14s) • Doors (4m) • Maze (4m)
        </div>
      </div>

      <!-- Stage 4 -->
      <div class="glass-card" style="border-top: 4px solid #a78bfa; padding: 20px; border-radius: 14px; position: relative;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
          <span style="font-size: 1.6rem;">💻</span>
          <span style="background: ${s4.marks >= 10 ? 'rgba(34, 197, 94, 0.2)' : 'rgba(245, 158, 11, 0.2)'}; color: ${s4.marks >= 10 ? '#22c55e' : '#f59e0b'}; padding: 3px 8px; border-radius: 6px; font-size: 0.72rem; font-weight: 700;">
            ${s4.marks >= 10 ? 'CLEARED ✅' : 'BORDERLINE ⚠️'}
          </span>
        </div>
        <div style="font-weight: 700; font-size: 0.95rem; color: #fff; margin-bottom: 4px;">Stage 4: Algorithmic Coding</div>
        <div style="font-size: 1.6rem; font-weight: 800; color: #a78bfa; margin-bottom: 6px;">
          ${s4.marks} <span style="font-size: 0.85rem; color: var(--text-muted); font-weight: 500;">/ 20 Marks</span>
        </div>
        <div style="font-size: 0.82rem; color: var(--text-secondary);">${s4.solved || 0} of ${s4.total || 3} problems solved (${s4.pct || 0}%)</div>
        <div style="margin-top: 10px; font-size: 0.74rem; color: var(--text-muted); border-top: 1px solid var(--border-glass); padding-top: 8px;">
          Arrays • Recursion • Problem Solving
        </div>
      </div>
    </div>
  `;
}

// ── Full Mock Recruitment Progression (only shown for single stage 1 intermediate) ──
function renderFullMockProgression() {
  const nextStageEl = document.getElementById('fullmock-next-stage');
  if (!nextStageEl) return;

  const isIntermediateStage1 = (new URLSearchParams(window.location.search).get('from') === 'fullmock') && 
                               (!currentResult.isFullMock && currentResult.section !== 'Full Recruitment Mock Test (All 4 Stages)');

  if (isIntermediateStage1) {
    nextStageEl.innerHTML = `
      <div style="margin: 24px auto 32px; max-width: 680px; background: linear-gradient(135deg, rgba(0, 212, 255, 0.12), rgba(124, 58, 237, 0.16)); border: 2px solid var(--accent-primary); border-radius: 16px; padding: 24px; text-align: center; box-shadow: 0 10px 35px rgba(0, 212, 255, 0.25);">
        <div style="display: flex; justify-content: center; gap: 8px; flex-wrap: wrap; margin-bottom: 16px;">
          <span style="background: rgba(34, 197, 94, 0.2); border: 1px solid #22c55e; color: #22c55e; padding: 4px 12px; border-radius: 99px; font-size: 0.75rem; font-weight: 700;">✅ Stage 1: Technical MCQ (Done)</span>
          <span style="color: var(--text-dim); align-self: center;">→</span>
          <span style="background: rgba(0, 212, 255, 0.2); border: 1px solid #00d4ff; color: #00d4ff; padding: 4px 12px; border-radius: 99px; font-size: 0.75rem; font-weight: 700;">⚡ Stage 2: Spoken English (Next)</span>
          <span style="color: var(--text-dim); align-self: center;">→</span>
          <span style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); color: var(--text-muted); padding: 4px 12px; border-radius: 99px; font-size: 0.75rem;">Stage 3: Cognitive Games</span>
          <span style="color: var(--text-dim); align-self: center;">→</span>
          <span style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); color: var(--text-muted); padding: 4px 12px; border-radius: 99px; font-size: 0.75rem;">Stage 4: Coding</span>
        </div>
        <h3 style="margin-bottom: 8px; font-size: 1.35rem; color: #fff;">🎉 Stage 1: Technical Assessment Complete!</h3>
        <p style="color: var(--text-secondary); font-size: 0.95rem; margin-bottom: 20px; line-height: 1.6;">
          Accenture's next recruitment stage is the <strong>Spoken Communication Assessment (Pearson / Versant Format)</strong> with Reading, Repeat with auto-audio, Sentence Builds, and Voice Pronunciation Replay.
        </p>
        <a href="comm-test.html?company=accenture&mode=fullmock" class="btn btn-primary btn-lg" style="font-size: 1.05rem; padding: 14px 34px; box-shadow: 0 4px 25px rgba(0, 212, 255, 0.4); text-decoration: none; display: inline-flex; align-items: center; gap: 8px;">
          <span>🎙️</span> Proceed to Stage 2: Spoken English Test →
        </a>
      </div>
    `;
    nextStageEl.classList.remove('hidden');
  } else {
    nextStageEl.classList.add('hidden');
  }
}

// ── Score Circle Animation ──
function renderScoreCircle() {
  const isFullMock = currentResult.isFullMock || (currentResult.section && currentResult.section.includes('Full Mock'));
  const percent = isFullMock ? (currentResult.totalMarks !== undefined ? currentResult.totalMarks : currentResult.percentage) : currentResult.percentage;
  const ring = document.getElementById('score-ring');
  const percentText = document.getElementById('score-percent');

  // Circumference = 2 * π * r = 2 * π * 90 ≈ 565.48
  const circumference = 565.48;
  const offset = circumference - (percent / 100) * circumference;

  // Animate after a short delay
  setTimeout(() => {
    ring.style.strokeDashoffset = offset;
  }, 300);

  // Animate number
  animateCounter(percentText, 0, percent, 1200, '%');

  if (isFullMock) {
    const labelEl = document.querySelector('.score-label');
    if (labelEl) {
      labelEl.innerHTML = `<span style="color: #00d4ff; font-weight: 800;">${percent} / 100</span><br>TOTAL MARKS`;
    }
    document.getElementById('result-title').textContent =
      `${currentResult.company} — Full Recruitment Mock Test (Grand Final Result)`;
    document.getElementById('result-subtitle').textContent =
      `Completed on ${formatDate(currentResult.date)} • ${formatTime(currentResult.timeTaken)} total taken • Official 4-Stage Pipeline`;
  } else {
    document.getElementById('result-title').textContent =
      `${currentResult.company} — ${currentResult.section}`;
    document.getElementById('result-subtitle').textContent =
      `Completed on ${formatDate(currentResult.date)} • ${formatTime(currentResult.timeTaken)} taken`;
  }
}

// ── Score Summary Cards ──
function renderScoreSummary() {
  const r = currentResult;
  const container = document.getElementById('score-summary');
  const isFullMock = r.isFullMock || (r.section && r.section.includes('Full Mock'));

  if (isFullMock) {
    const totalMarks = r.totalMarks !== undefined ? r.totalMarks : r.percentage;
    container.innerHTML = `
      <div class="score-stat-card animate-in-delay-1">
        <div class="stat-icon">🏆</div>
        <div class="stat-value blue">${totalMarks} / 100</div>
        <div class="stat-desc">Total Marks Obtained</div>
      </div>
      <div class="score-stat-card animate-in-delay-2">
        <div class="stat-icon">${totalMarks >= 70 ? '🎉' : '⚠️'}</div>
        <div class="stat-value ${totalMarks >= 70 ? 'green' : 'orange'}">${totalMarks >= 70 ? 'SELECTED' : 'RETAKE'}</div>
        <div class="stat-desc">Recruitment Status</div>
      </div>
      <div class="score-stat-card animate-in-delay-3">
        <div class="stat-icon">🏁</div>
        <div class="stat-value green">4 / 4</div>
        <div class="stat-desc">Stages Completed</div>
      </div>
      <div class="score-stat-card animate-in-delay-1">
        <div class="stat-icon">📝</div>
        <div class="stat-value blue">${r.total}</div>
        <div class="stat-desc">Total Items Evaluated</div>
      </div>
      <div class="score-stat-card animate-in-delay-2">
        <div class="stat-icon">⏱️</div>
        <div class="stat-value blue">${formatTime(r.timeTaken)}</div>
        <div class="stat-desc">Total Time Taken</div>
      </div>
      <div class="score-stat-card animate-in-delay-3">
        <div class="stat-icon">📈</div>
        <div class="stat-value ${totalMarks >= 70 ? 'green' : totalMarks >= 40 ? 'orange' : 'red'}">${totalMarks}%</div>
        <div class="stat-desc">Overall Benchmark</div>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="score-stat-card animate-in-delay-1">
      <div class="stat-icon">✅</div>
      <div class="stat-value green">${r.correct}</div>
      <div class="stat-desc">Correct</div>
    </div>
    <div class="score-stat-card animate-in-delay-2">
      <div class="stat-icon">❌</div>
      <div class="stat-value red">${r.incorrect}</div>
      <div class="stat-desc">Incorrect</div>
    </div>
    <div class="score-stat-card animate-in-delay-3">
      <div class="stat-icon">⬜</div>
      <div class="stat-value orange">${r.unanswered}</div>
      <div class="stat-desc">Skipped</div>
    </div>
    <div class="score-stat-card animate-in-delay-1">
      <div class="stat-icon">📝</div>
      <div class="stat-value blue">${r.total}</div>
      <div class="stat-desc">Total</div>
    </div>
    <div class="score-stat-card animate-in-delay-2">
      <div class="stat-icon">⏱️</div>
      <div class="stat-value blue">${formatTime(r.timeTaken)}</div>
      <div class="stat-desc">Time Taken</div>
    </div>
    <div class="score-stat-card animate-in-delay-3">
      <div class="stat-icon">📈</div>
      <div class="stat-value ${r.percentage >= 70 ? 'green' : r.percentage >= 40 ? 'orange' : 'red'}">${Math.round((r.correct / r.total) * 100)}%</div>
      <div class="stat-desc">Accuracy</div>
    </div>
  `;
}

// ── Topic Breakdown ──
function renderTopicBreakdown() {
  const container = document.getElementById('topic-breakdown');
  const topics = currentResult.topicScores;

  let html = '';
  for (const [topic, data] of Object.entries(topics)) {
    const percent = Math.round((data.correct / data.total) * 100);
    const barClass = percent >= 80 ? 'excellent' : percent >= 60 ? 'good' : percent >= 40 ? 'average' : 'poor';
    const tagClass = percent >= 70 ? 'strong' : percent >= 40 ? 'moderate' : 'weak';
    const tagText = percent >= 70 ? '💪 Strong' : percent >= 40 ? '⚡ Needs Work' : '🔴 Critical';

    html += `
      <div class="breakdown-item">
        <div class="topic-name">${topic}</div>
        <div class="breakdown-bar">
          <div class="breakdown-bar-fill ${barClass}" style="width: ${percent}%"></div>
        </div>
        <div class="topic-score">${data.correct}/${data.total}</div>
        <span class="perf-tag ${tagClass}">${tagText}</span>
      </div>
    `;
  }

  container.innerHTML = html;

  // Animate bars
  setTimeout(() => {
    container.querySelectorAll('.breakdown-bar-fill').forEach(bar => {
      bar.style.width = bar.style.width; // trigger reflow
    });
  }, 100);
}

// ── Recommendations ──
function renderRecommendations() {
  const container = document.getElementById('recommendations');
  const topics = currentResult.topicScores;
  let recs = [];

  for (const [topic, data] of Object.entries(topics)) {
    const percent = Math.round((data.correct / data.total) * 100);
    if (percent < 70) {
      let studyPath = '';
      switch (topic) {
        case 'Pseudocode':
          studyPath = 'Accenture/03_Technical_MCQ/README.md — Focus on operators, loops, recursion sections';
          break;
        case 'MS Office':
          studyPath = 'Accenture/03_Technical_MCQ/README.md — Section 2: MS Office shortcuts & formulas';
          break;
        case 'Networking':
          studyPath = 'Accenture/03_Technical_MCQ/README.md — Section 3: OSI model, protocols, ports';
          break;
        case 'Security':
          studyPath = 'Accenture/03_Technical_MCQ/README.md — Section 4: CIA triad, encryption, attacks';
          break;
        case 'Cloud':
          studyPath = 'Accenture/03_Technical_MCQ/README.md — Section 5: Cloud models, AWS/Azure';
          break;
        case 'Grammar':
        case 'Error Correction':
        case 'Sentence Building':
          studyPath = 'Accenture/05_Communication/README.md — Grammar rules & practice';
          break;
        case 'Number Series':
        case 'Arithmetic':
        case 'Patterns':
          studyPath = 'Accenture/02_Cognitive_Gamified/README.md — Quick math patterns';
          break;
        default:
          studyPath = 'Review the corresponding section in your notes';
      }

      recs.push({
        topic,
        percent,
        studyPath,
        priority: percent < 40 ? '🔴 High' : '🟡 Medium'
      });
    }
  }

  if (recs.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: var(--space-lg);">
        <div style="font-size: 2rem; margin-bottom: var(--space-sm);">🎉</div>
        <p style="color: var(--accent-green); font-weight: 600;">Excellent! All topics above 70%!</p>
        <p class="text-muted" style="font-size: 0.85rem;">Keep revising and take more mock tests to maintain your edge.</p>
      </div>
    `;
    return;
  }

  // Sort by percent ascending (weakest first)
  recs.sort((a, b) => a.percent - b.percent);

  container.innerHTML = `
    <div style="font-size: 0.85rem; line-height: 2;">
      ${recs.map(r => `
        <div style="padding: var(--space-sm) 0; border-bottom: 1px solid var(--border-glass);">
          <span style="font-weight: 600;">${r.priority} ${r.topic}</span>
          <span style="color: var(--text-muted);"> (${r.percent}%)</span>
          <div style="color: var(--text-secondary); font-size: 0.8rem; margin-top: 2px;">
            📖 Study: ${r.studyPath}
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function renderReviewFilterButtons() {
  const container = document.getElementById('review-filter-buttons');
  if (!container) return;

  const isFullMock = currentResult.isFullMock || (currentResult.section && currentResult.section.includes('Full Mock'));
  if (isFullMock) {
    container.innerHTML = `
      <button class="btn btn-sm btn-ghost filter-btn ${currentFilter === 'all' ? 'active' : ''}" onclick="filterReview('all')">All Questions</button>
      <button class="btn btn-sm btn-ghost filter-btn ${currentFilter === 'stage1' ? 'active' : ''}" onclick="filterReview('stage1')">🖥️ Stage 1: Tech MCQs</button>
      <button class="btn btn-sm btn-ghost filter-btn ${currentFilter === 'stage2' ? 'active' : ''}" onclick="filterReview('stage2')">🎙️ Stage 2: Spoken English</button>
      <button class="btn btn-sm btn-ghost filter-btn ${currentFilter === 'stage3' ? 'active' : ''}" onclick="filterReview('stage3')">🎮 Stage 3: Cognitive Games</button>
      <button class="btn btn-sm btn-ghost filter-btn ${currentFilter === 'stage4' ? 'active' : ''}" onclick="filterReview('stage4')">💻 Stage 4: Coding</button>
      <button class="btn btn-sm btn-ghost filter-btn ${currentFilter === 'incorrect' ? 'active' : ''}" onclick="filterReview('incorrect')">❌ Incorrect / Weak</button>
      <button class="btn btn-sm btn-ghost filter-btn ${currentFilter === 'correct' ? 'active' : ''}" onclick="filterReview('correct')">✅ Correct</button>
    `;
  } else {
    container.innerHTML = `
      <button class="btn btn-sm btn-ghost filter-btn ${currentFilter === 'all' ? 'active' : ''}" onclick="filterReview('all')">All</button>
      <button class="btn btn-sm btn-ghost filter-btn ${currentFilter === 'incorrect' ? 'active' : ''}" onclick="filterReview('incorrect')">❌ Incorrect</button>
      <button class="btn btn-sm btn-ghost filter-btn ${currentFilter === 'correct' ? 'active' : ''}" onclick="filterReview('correct')">✅ Correct</button>
      <button class="btn btn-sm btn-ghost filter-btn ${currentFilter === 'skipped' ? 'active' : ''}" onclick="filterReview('skipped')">⬜ Skipped</button>
    `;
  }
}

// ── Review List ──
function renderReviewList(filter = 'all') {
  currentFilter = filter;
  renderReviewFilterButtons();

  const container = document.getElementById('review-list');
  let questions = currentResult.questionResults || [];

  if (filter === 'correct') {
    questions = questions.filter(q => q.isCorrect);
  } else if (filter === 'incorrect') {
    questions = questions.filter(q => !q.isCorrect);
  } else if (filter === 'skipped') {
    questions = questions.filter(q => q.userAnswer === -1);
  } else if (filter === 'stage1') {
    questions = questions.filter(q => !q.id.startsWith('sp_') && !q.id.startsWith('cog_') && !q.id.startsWith('coding_'));
  } else if (filter === 'stage2') {
    questions = questions.filter(q => q.id.startsWith('sp_') || (q.topic && ['Reading', 'Repeat', 'Questions', 'Sentence Builds', 'Stories', 'Open Questions', 'Communication'].some(t => q.topic.includes(t))));
  } else if (filter === 'stage3') {
    questions = questions.filter(q => q.id.startsWith('cog_') || (q.topic && (q.topic.includes('Bubble') || q.topic.includes('Lock') || q.topic.includes('Maze'))));
  } else if (filter === 'stage4') {
    questions = questions.filter(q => q.id.startsWith('coding_') || (q.topic && (q.topic.includes('Coding') || q.topic.includes('Array') || q.topic.includes('DSA'))));
  }

  if (questions.length === 0) {
    container.innerHTML = `<p class="text-muted text-center" style="padding: var(--space-xl);">No questions match this filter.</p>`;
    return;
  }

  container.innerHTML = questions.map((q, i) => {
    const isStage1 = !q.id.startsWith('sp_') && !q.id.startsWith('cog_') && !q.id.startsWith('coding_');
    const isStage2 = q.id.startsWith('sp_');
    const isStage3 = q.id.startsWith('cog_');
    const isStage4 = q.id.startsWith('coding_');

    const stagePill = isStage1 ? '<span style="font-size: 0.7rem; background: rgba(0, 212, 255, 0.15); color: #00d4ff; border: 1px solid rgba(0, 212, 255, 0.3); padding: 2px 8px; border-radius: 6px; font-weight: 700;">Stage 1: Tech MCQ</span>'
                    : isStage2 ? '<span style="font-size: 0.7rem; background: rgba(16, 185, 129, 0.15); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.3); padding: 2px 8px; border-radius: 6px; font-weight: 700;">Stage 2: Spoken English</span>'
                    : isStage3 ? '<span style="font-size: 0.7rem; background: rgba(245, 158, 11, 0.15); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.3); padding: 2px 8px; border-radius: 6px; font-weight: 700;">Stage 3: Cognitive Games</span>'
                    : '<span style="font-size: 0.7rem; background: rgba(167, 139, 250, 0.15); color: #a78bfa; border: 1px solid rgba(167, 139, 250, 0.3); padding: 2px 8px; border-radius: 6px; font-weight: 700;">Stage 4: Coding</span>';

    const isManualReview = q.reviewStatus === 'manual';
    const badgeClass = isManualReview ? '' : q.userAnswer === -1 ? 'skipped-badge' : q.isCorrect ? 'correct-badge' : 'incorrect-badge';
    const badgeText = isManualReview ? '📝 Manual review' : q.userAnswer === -1 ? '⬜ Skipped' : q.isCorrect ? '✅ Correct' : '❌ Incorrect / Weak';

    let codeHtml = '';
    if (q.code) {
      codeHtml = `<div class="code-snippet" style="font-size: 0.8rem; margin: var(--space-md) 0;">${escapeHtml(q.code)}</div>`;
    }
    const imageHtml = q.image
      ? `<figure style="margin: 12px 0;"><img src="${escapeHtml(q.image)}" alt="Image prompt for ${escapeHtml(q.question || 'this response')}" loading="lazy" style="display: block; width: 100%; max-height: 360px; object-fit: contain; border-radius: 8px;"><figcaption class="text-muted" style="font-size: 0.8rem; margin-top: 6px;">Image prompt shown during the assessment</figcaption></figure>`
      : '';

    return `
      <div class="review-question animate-in" style="animation-delay: ${Math.min(i * 0.04, 0.4)}s">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-sm); flex-wrap: wrap; gap: 8px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            ${currentResult.isFullMock ? stagePill : ''}
            <div class="question-topic-tag">${escapeHtml(q.topic || 'General')}</div>
          </div>
          <span class="result-badge ${badgeClass}" ${isManualReview ? 'style="background: rgba(14, 165, 233, 0.12); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.35);"' : ''}>${badgeText}</span>
        </div>
        <div class="question-text" style="font-size: 0.95rem; line-height: 1.5;">${escapeHtml(q.question)}</div>
        ${imageHtml}
        ${codeHtml}
        <div class="options-list" style="gap: 6px; margin: 10px 0;">
          ${(q.options || []).map((opt, oi) => {
            let cls = '';
            if (oi === q.correctAnswer) cls = 'correct';
            else if (oi === q.userAnswer && !q.isCorrect) cls = 'incorrect';

            return `
              <div class="option-item ${cls}" style="cursor: default; padding: 0.6rem 1rem;">
                <div class="option-letter" style="width: 28px; height: 28px; font-size: 0.75rem;">${String.fromCharCode(65 + oi)}</div>
                <div class="option-text" style="font-size: 0.85rem;">${escapeHtml(opt)}</div>
                ${oi === q.correctAnswer ? '<span style="font-size: 0.75rem; color: var(--accent-green); font-weight: 700;">✓ Correct / Model</span>' : ''}
                ${oi === q.userAnswer && !q.isCorrect ? '<span style="font-size: 0.75rem; color: var(--accent-red); font-weight: 700;">✗ Your Answer</span>' : ''}
              </div>
            `;
          }).join('')}
        </div>
        ${q.explanation ? `<div class="explanation" style="margin-top: 10px; font-size: 0.85rem; line-height: 1.6;">💡 <strong>Explanation / Assessment Feedback:</strong> ${escapeHtml(q.explanation)}</div>` : ''}
      </div>
    `;
  }).join('');
}

function filterReview(filter) {
  renderReviewList(filter);
}

// ── History List ──
function renderHistoryList(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (allResults.length === 0) {
    container.innerHTML = '<p class="text-muted text-center">No test history yet.</p>';
    return;
  }

  container.innerHTML = `
    <table class="history-table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Company</th>
          <th>Section</th>
          <th>Score</th>
          <th>Time</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        ${allResults.map(r => `
          <tr>
            <td>${formatDate(r.date)}</td>
            <td style="font-weight: 600;">${r.company}</td>
            <td>${r.section}</td>
            <td>
              <span style="color: ${r.percentage >= 70 ? 'var(--accent-green)' : r.percentage >= 40 ? 'var(--accent-orange)' : 'var(--accent-red)'}; font-weight: 700;">
                ${r.percentage}%
              </span>
              <span style="color: var(--text-muted); font-size: 0.8rem;"> (${r.correct}/${r.total})</span>
            </td>
            <td style="color: var(--text-secondary);">${formatTime(r.timeTaken)}</td>
            <td>
              <a href="results.html?id=${r.id}" class="btn btn-sm btn-ghost">View →</a>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

// ── Tab Switching ──
function switchTab(tabId) {
  document.querySelectorAll('.tab-btn').forEach((btn, i) => {
    const tabs = ['overview', 'review', 'history'];
    btn.classList.toggle('active', tabs[i] === tabId);
  });

  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.remove('active');
  });

  document.getElementById(`tab-${tabId}`).classList.add('active');
}

// ── Animate Counter ──
function animateCounter(element, start, end, duration, suffix = '') {
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const current = Math.round(start + (end - start) * eased);

    element.textContent = current + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

// ── Utilities ──
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function formatTime(seconds) {
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins < 60) return `${mins}m ${secs}s`;
  const hrs = Math.floor(mins / 60);
  const remainMins = mins % 60;
  return `${hrs}h ${remainMins}m`;
}

function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
