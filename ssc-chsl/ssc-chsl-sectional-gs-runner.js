/* SSC CHSL Tier-I — GS & Current Affairs Sectional Test Runner */
(function () {
  'use strict';
  const DATA = globalThis.SSC_CHSL_SECTIONAL_GS_DATA;
  const SESSION_KEY = 'ssc_chsl_sect_gs_active_v1';
  const RESULTS_KEY = 'ssc_chsl_sect_gs_results_v1';
  const SECTION_SECONDS = DATA.exam.totalMinutes * 60;
  const $ = id => document.getElementById(id);
  let session = null;
  let timerId = null;
  let currentFilter = 'all';

  function escapeHtml(v) {
    return String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  }
  function getResults() { try { return JSON.parse(localStorage.getItem(RESULTS_KEY)) || []; } catch { return []; } }
  function saveSession() { if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session)); }
  function loadSession() { try { return JSON.parse(localStorage.getItem(SESSION_KEY)); } catch { return null; } }

  function setView(id) {
    ['selection-view', 'exam-view', 'result-view'].forEach(v => $(v).classList.toggle('hidden', v !== id));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* ── Selection view ── */
  function renderTestCards() {
    const results = getResults();
    $('mock-grid').innerHTML = DATA.tests.map(test => {
      const attempts = results.filter(r => r.testId === test.id).length;
      return `
        <article class="mock-card">
          <div class="mock-card-top"><span class="mock-number">${test.title.replace('GS Test ', '')}</span><span class="mock-state">${attempts ? `${attempts} attempt${attempts === 1 ? '' : 's'}` : 'READY'}</span></div>
          <h3>${test.title}</h3>
          <p>25 questions · 15 minutes · GS & Current Affairs</p>
          <button class="button button-dark start-mock" data-test="${test.id}">Start test →</button>
        </article>`;
    }).join('');
    $('mock-grid').querySelectorAll('.start-mock').forEach(btn => {
      btn.addEventListener('click', () => beginTest(btn.dataset.test));
    });
  }

  function updateResumeBanner() {
    const active = loadSession();
    if (!active) { $('resume-banner').classList.add('hidden'); return; }
    const test = DATA.tests.find(t => t.id === active.testId);
    if (!test) { localStorage.removeItem(SESSION_KEY); $('resume-banner').classList.add('hidden'); return; }
    $('resume-copy').textContent = `${test.title} · ${active.questionIndex + 1}/25`;
    $('resume-banner').classList.remove('hidden');
    $('resume-btn').onclick = () => resumeTest(active);
    $('discard-btn').onclick = () => { if (!confirm('Discard this in-progress test?')) return; localStorage.removeItem(SESSION_KEY); updateResumeBanner(); };
  }

  /* ── Begin / Resume ── */
  function beginTest(testId) {
    if (loadSession() && !confirm('Starting a new test will discard the in-progress one. Continue?')) return;
    localStorage.removeItem(SESSION_KEY);
    session = { testId, questionIndex: 0, answers: {}, flags: {}, startedAt: Date.now(), deadlineAt: Date.now() + SECTION_SECONDS * 1000 };
    saveSession(); startTimer(); renderExam(); setView('exam-view');
  }

  function resumeTest(saved) {
    session = saved;
    const rem = Math.ceil((session.deadlineAt - Date.now()) / 1000);
    if (rem <= 0) { setView('exam-view'); finishTest(true); return; }
    startTimer(); renderExam(); setView('exam-view');
  }

  function getCurrentTest() { return DATA.tests.find(t => t.id === session.testId); }
  function answerKey(q) { return q.id; }

  /* ── Timer ── */
  function startTimer() {
    clearInterval(timerId);
    timerId = setInterval(() => {
      if (!session) return;
      const rem = Math.ceil((session.deadlineAt - Date.now()) / 1000);
      if (rem <= 0) { clearInterval(timerId); finishTest(true); return; }
      updateTimer(rem);
    }, 250);
  }

  function updateTimer(rem) {
    const m = Math.floor(rem / 60), s = rem % 60;
    $('timer').textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    $('timer-block')?.classList.toggle('danger', rem <= 60);
    $('timer-block')?.classList.toggle('warning', rem <= 180 && rem > 60);
    $('timer').classList.toggle('danger', rem <= 60);
  }

  /* ── Exam view ── */
  function renderExam() {
    if (!session) return;
    const test = getCurrentTest();
    $('paper-label').textContent = test.title;
    $('section-title').textContent = 'GS & Current Affairs';
    $('section-subtitle').textContent = '15:00 · +2 correct · −0.50 incorrect · 0 unattempted';
    renderQuestionNav(); renderQuestion();
    updateTimer(Math.max(0, Math.ceil((session.deadlineAt - Date.now()) / 1000)));
    saveSession();
  }

  function renderQuestionNav() {
    const test = getCurrentTest();
    const answered = test.questions.filter(q => session.answers[answerKey(q)] !== undefined).length;
    $('answered-count').textContent = `${answered}/25 answered`;
    $('question-nav').innerHTML = test.questions.map((q, i) => {
      const cls = [i === session.questionIndex ? 'current' : ''];
      if (session.answers[answerKey(q)] !== undefined) cls.push('answered');
      if (session.flags[answerKey(q)]) cls.push('flagged');
      return `<button type="button" class="${cls.filter(Boolean).join(' ')}" data-question="${i}" aria-label="Question ${i + 1}">${i + 1}</button>`;
    }).join('');
    $('question-nav').querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => { session.questionIndex = Number(btn.dataset.question); renderQuestionNav(); renderQuestion(); });
    });
  }

  function renderQuestion() {
    const test = getCurrentTest();
    const q = test.questions[session.questionIndex];
    const sel = session.answers[answerKey(q)];
    $('question-counter').textContent = `GS & Current Affairs · Question ${session.questionIndex + 1} of 25`;
    $('question-text').textContent = q.question;
    $('flag-btn').classList.toggle('active', Boolean(session.flags[answerKey(q)]));
    $('flag-btn').textContent = session.flags[answerKey(q)] ? '★ Marked for review' : '☆ Mark for review';
    $('options-list').innerHTML = q.options.map((o, i) => `
      <label class="option-label ${sel === i ? 'selected' : ''}">
        <input type="radio" name="answer" value="${i}" ${sel === i ? 'checked' : ''}>
        <span class="option-letter">${String.fromCharCode(65 + i)}.</span>
        <span>${escapeHtml(o)}</span>
      </label>`).join('');
    $('options-list').querySelectorAll('input').forEach(inp => {
      inp.addEventListener('change', () => { session.answers[answerKey(q)] = Number(inp.value); saveSession(); renderQuestionNav(); renderQuestion(); });
    });
    $('previous-btn').disabled = session.questionIndex === 0;
    $('next-btn').disabled = session.questionIndex === test.questions.length - 1;
    $('flag-btn').onclick = () => { session.flags[answerKey(q)] = !session.flags[answerKey(q)]; saveSession(); renderQuestionNav(); renderQuestion(); };
    $('previous-btn').onclick = () => { if (session.questionIndex > 0) { session.questionIndex--; renderQuestionNav(); renderQuestion(); } };
    $('next-btn').onclick = () => { if (session.questionIndex < test.questions.length - 1) { session.questionIndex++; renderQuestionNav(); renderQuestion(); } };
    $('submit-section-btn').onclick = () => finishTest(false);
  }

  /* ── Finish & Results ── */
  function finishTest(autoSubmitted) {
    if (!session) return;
    if (!autoSubmitted && !confirm('Submit this test? You cannot change your answers after submission.')) return;
    clearInterval(timerId);
    const test = getCurrentTest();
    let correct = 0, incorrect = 0, unanswered = 0;
    const review = test.questions.map(q => {
      const sel = session.answers[answerKey(q)];
      const isCorrect = sel === q.answer;
      const skipped = sel === undefined;
      if (skipped) unanswered++; else if (isCorrect) correct++; else incorrect++;
      return { id: q.id, topic: q.topic, question: q.question, options: q.options, answer: q.answer, selected: sel === undefined ? -1 : sel, correct: isCorrect, skipped, flagged: Boolean(session.flags[answerKey(q)]), explanation: q.explanation, shortcut: q.shortcut };
    });
    const marks = correct * DATA.exam.correctMarks - incorrect * DATA.exam.incorrectPenalty;
    const timeTaken = Math.min(SECTION_SECONDS, Math.max(1, Math.round((Date.now() - session.startedAt) / 1000)));
    const record = {
      id: `sect-gs-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
      testId: test.id, testTitle: test.title, date: new Date().toISOString(),
      total: 25, correct, incorrect, unanswered, marks, timeTaken, autoSubmitted,
      percentage: Math.round((marks / (25 * DATA.exam.correctMarks)) * 1000) / 10,
      questionResults: review
    };
    const history = getResults(); history.unshift(record);
    localStorage.setItem(RESULTS_KEY, JSON.stringify(history.slice(0, 100)));

    /* also save to shared MockPrep results */
    const topicScores = {};
    const sharedQR = review.map(item => {
      topicScores[item.topic] = topicScores[item.topic] || { correct: 0, total: 0 };
      topicScores[item.topic].total++;
      if (item.correct) topicScores[item.topic].correct++;
      return { id: item.id, question: item.question, code: null, options: item.options, correctAnswer: item.answer, userAnswer: item.selected, isCorrect: item.correct, explanation: `${item.explanation} Shortcut / rule: ${item.shortcut}`, topic: item.topic };
    });
    try {
      const appHistory = JSON.parse(localStorage.getItem('mockprep_results') || '[]');
      appHistory.unshift({ ...record, company: 'SSC CHSL', section: `${record.testTitle} — GS Sectional`, totalTime: SECTION_SECONDS, totalMarks: marks, topicScores, questionResults: sharedQR });
      localStorage.setItem('mockprep_results', JSON.stringify(appHistory.slice(0, 50)));
    } catch (e) { console.error('Could not save to MockPrep history:', e); }

    localStorage.removeItem(SESSION_KEY);
    session = null;
    renderResult(record); setView('result-view');
  }

  function renderResult(record) {
    $('result-title').textContent = `${record.testTitle} complete`;
    $('result-subtitle').textContent = `${record.correct} correct · ${record.incorrect} incorrect · ${record.unanswered} unattempted · +2 / −0.50 scoring`;
    $('result-marks').textContent = Number.isInteger(record.marks) ? record.marks : record.marks.toFixed(1);

    /* topic-wise breakdown */
    const topicMap = {};
    record.questionResults.forEach(item => {
      if (!topicMap[item.topic]) topicMap[item.topic] = { correct: 0, incorrect: 0, unanswered: 0, total: 0 };
      topicMap[item.topic].total++;
      if (item.skipped) topicMap[item.topic].unanswered++;
      else if (item.correct) topicMap[item.topic].correct++;
      else topicMap[item.topic].incorrect++;
    });
    $('section-results').innerHTML = Object.entries(topicMap).map(([topic, r]) => {
      const m = r.correct * 2 - r.incorrect * 0.5;
      return `<article class="section-result-card"><span>${escapeHtml(topic)}</span><strong>${Number.isInteger(m) ? m : m.toFixed(1)} / ${r.total * 2}</strong><small>${r.correct}/${r.total} correct · ${r.incorrect} wrong · ${r.unanswered} skipped</small></article>`;
    }).join('');

    $('review-filter').value = 'all';
    $('review-filter').onchange = () => { currentFilter = $('review-filter').value; renderReview(record); };
    renderReview(record);
    $('back-tests-btn').onclick = () => { renderTestCards(); updateResumeBanner(); setView('selection-view'); };
  }

  function renderReview(record) {
    const items = record.questionResults.filter(item => {
      if (currentFilter === 'all') return true;
      if (currentFilter === 'incorrect') return !item.correct && !item.skipped;
      if (currentFilter === 'skipped') return item.skipped;
      if (currentFilter === 'flagged') return item.flagged;
      return item.topic === currentFilter;
    });
    if (!items.length) { $('review-list').innerHTML = '<div class="empty-state">No questions match this filter.</div>'; return; }
    $('review-list').innerHTML = items.map(item => {
      const chosen = item.selected < 0 ? 'Not answered' : `${String.fromCharCode(65 + item.selected)}. ${item.options[item.selected]}`;
      const correctChoice = `${String.fromCharCode(65 + item.answer)}. ${item.options[item.answer]}`;
      return `
        <article class="review-card">
          <div class="review-top"><span>${escapeHtml(item.topic)}</span><span>${item.skipped ? 'Skipped' : item.correct ? 'Correct · +2' : 'Incorrect · −0.50'}${item.flagged ? ' · Marked for review' : ''}</span></div>
          <div class="review-question">${escapeHtml(item.question)}</div>
          <div class="review-options">${item.options.map((o, i) => `<div class="review-option ${i === item.answer ? 'correct' : i === item.selected && !item.correct ? 'wrong' : ''}">${String.fromCharCode(65 + i)}. ${escapeHtml(o)}${i === item.answer ? ' · Correct answer' : i === item.selected ? ' · Your answer' : ''}</div>`).join('')}</div>
          <div class="review-note"><strong>Your answer:</strong> ${escapeHtml(chosen)}<br><strong>Correct:</strong> ${escapeHtml(correctChoice)}<br><strong>Why:</strong> ${escapeHtml(item.explanation)}<br><strong>Shortcut / rule:</strong> ${escapeHtml(item.shortcut)}</div>
        </article>`;
    }).join('');
  }

  /* ── Init ── */
  function onPageLoad() {
    $('exam-view').querySelector('.timer-block').id = 'timer-block';
    renderTestCards(); updateResumeBanner();
    const existing = loadSession();
    if (existing) { const rem = Math.ceil((existing.deadlineAt - Date.now()) / 1000); if (rem <= 0) resumeTest(existing); }
  }
  document.addEventListener('visibilitychange', () => { if (session) saveSession(); });
  window.addEventListener('beforeunload', () => { if (session) saveSession(); });
  document.addEventListener('DOMContentLoaded', onPageLoad);
})();
