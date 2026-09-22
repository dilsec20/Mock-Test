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
function showResultView() {
  document.getElementById('no-result-view').classList.add('hidden');
  document.getElementById('result-view').classList.remove('hidden');

  renderScoreCircle();
  renderScoreSummary();
  renderTopicBreakdown();
  renderRecommendations();
  renderReviewList();
  renderHistoryList('full-history-list');
}

// ── Score Circle Animation ──
function renderScoreCircle() {
  const percent = currentResult.percentage;
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

  // Title
  document.getElementById('result-title').textContent =
    `${currentResult.company} — ${currentResult.section}`;
  document.getElementById('result-subtitle').textContent =
    `Completed on ${formatDate(currentResult.date)} • ${formatTime(currentResult.timeTaken)} taken`;
}

// ── Score Summary Cards ──
function renderScoreSummary() {
  const r = currentResult;
  const container = document.getElementById('score-summary');

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

// ── Review List ──
function renderReviewList(filter = 'all') {
  currentFilter = filter;
  const container = document.getElementById('review-list');
  let questions = currentResult.questionResults;

  if (filter === 'correct') questions = questions.filter(q => q.isCorrect);
  else if (filter === 'incorrect') questions = questions.filter(q => q.userAnswer !== -1 && !q.isCorrect);
  else if (filter === 'skipped') questions = questions.filter(q => q.userAnswer === -1);

  if (questions.length === 0) {
    container.innerHTML = `<p class="text-muted text-center" style="padding: var(--space-xl);">No questions match this filter.</p>`;
    return;
  }

  container.innerHTML = questions.map((q, i) => {
    const badgeClass = q.userAnswer === -1 ? 'skipped-badge' : q.isCorrect ? 'correct-badge' : 'incorrect-badge';
    const badgeText = q.userAnswer === -1 ? '⬜ Skipped' : q.isCorrect ? '✅ Correct' : '❌ Incorrect';

    let codeHtml = '';
    if (q.code) {
      codeHtml = `<div class="code-snippet" style="font-size: 0.8rem; margin: var(--space-md) 0;">${escapeHtml(q.code)}</div>`;
    }

    return `
      <div class="review-question animate-in" style="animation-delay: ${Math.min(i * 0.05, 0.5)}s">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-sm);">
          <div class="question-topic-tag">${q.topic}</div>
          <span class="result-badge ${badgeClass}">${badgeText}</span>
        </div>
        <div class="question-text" style="font-size: 0.95rem;">${escapeHtml(q.question)}</div>
        ${codeHtml}
        <div class="options-list" style="gap: 4px;">
          ${q.options.map((opt, oi) => {
            let cls = '';
            if (oi === q.correctAnswer) cls = 'correct';
            else if (oi === q.userAnswer && !q.isCorrect) cls = 'incorrect';

            return `
              <div class="option-item ${cls}" style="cursor: default; padding: 0.6rem 1rem;">
                <div class="option-letter" style="width: 28px; height: 28px; font-size: 0.75rem;">${String.fromCharCode(65 + oi)}</div>
                <div class="option-text" style="font-size: 0.85rem;">${escapeHtml(opt)}</div>
                ${oi === q.correctAnswer ? '<span style="font-size: 0.75rem; color: var(--accent-green);">✓ Correct</span>' : ''}
                ${oi === q.userAnswer && !q.isCorrect ? '<span style="font-size: 0.75rem; color: var(--accent-red);">✗ Your Answer</span>' : ''}
              </div>
            `;
          }).join('')}
        </div>
        ${q.explanation ? `<div class="explanation">💡 <strong>Explanation:</strong> ${escapeHtml(q.explanation)}</div>` : ''}
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
