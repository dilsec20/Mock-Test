(function () {
  'use strict';

  const SESSION_KEY = 'rrb_ntpc_active_mock_v1';
  const RESULTS_KEY = 'rrb_ntpc_mock_results_v1';
  const sections = [
    { id: 'mathematics', name: 'Mathematics', count: 30, minutes: 27 },
    { id: 'reasoning', name: 'General Intelligence & Reasoning', count: 30, minutes: 27 },
    { id: 'awareness', name: 'General Awareness', count: 40, minutes: 36 }
  ];
  const $ = id => document.getElementById(id);
  let bank = null;
  let papers = [];
  let session = null;
  let timerId = null;
  let currentReviewFilter = 'all';

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
  }

  function shuffle(items, seed) {
    const result = items.slice();
    let state = seed >>> 0;
    for (let i = result.length - 1; i > 0; i--) {
      state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
      const j = state % (i + 1);
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  function makePaper(id, title, kind, sectionId, index) {
    const specs = kind === 'full' ? sections : sections.filter(section => section.id === sectionId);
    const paperSections = specs.map((section, sectionIndex) => {
      const pool = bank[section.id];
      const start = (index * 43 + sectionIndex * 17) % pool.length;
      const chosen = Array.from({ length: section.count }, (_, qIndex) => pool[(start + qIndex) % pool.length]);
      const pyqs = pool.filter(question => question.type === 'PYQ');
      if (pyqs.length) {
        const sourced = pyqs[index % pyqs.length];
        const existing = chosen.findIndex(question => question.id === sourced.id);
        if (existing >= 0) chosen.splice(existing, 1);
        else chosen.pop();
        chosen.unshift(sourced);
      }
      const questions = chosen.map((base, qIndex) => {
        return { ...base, id: `${id}-${section.id}-${qIndex + 1}`, sectionId: section.id, sectionName: section.name };
      });
      return { ...section, questions };
    });
    const flatQuestions = paperSections.flatMap(section => section.questions);
    return {
      id, title, kind, sectionId, sections: paperSections, questions: flatQuestions,
      totalMinutes: kind === 'full' ? 90 : paperSections[0].minutes,
      questionCount: flatQuestions.length
    };
  }

  function buildPapers() {
    papers = [];
    let index = 0;
    for (const section of sections) {
      for (let set = 1; set <= 5; set++) {
        index++;
        papers.push(makePaper(`section-${section.id}-${set}`, `${section.name} · Sectional ${set}`, 'sectional', section.id, index));
      }
    }
    for (let set = 1; set <= 10; set++) {
      index++;
      papers.push(makePaper(`full-${set}`, `Full Mock ${String(set).padStart(2, '0')}`, 'full', null, index));
    }
  }

  function loadResults() {
    try { return JSON.parse(localStorage.getItem(RESULTS_KEY)) || []; }
    catch (error) { return []; }
  }

  function loadSavedSession() {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY)); }
    catch (error) { return null; }
  }

  function saveSession() {
    if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }

  function showView(viewId) {
    ['selection-view', 'exam-view', 'result-view'].forEach(id => $(id).classList.toggle('hidden', id !== viewId));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function renderCards() {
    const results = loadResults();
    const sectional = papers.filter(paper => paper.kind === 'sectional');
    const full = papers.filter(paper => paper.kind === 'full');
    const card = paper => {
      const attempts = results.filter(result => result.mockId === paper.id).length;
      const duration = paper.kind === 'full' ? '90 min' : `${paper.totalMinutes} min`;
      const sectionLine = paper.kind === 'full' ? '100 questions · 3 sections' : `${paper.questionCount} questions · ${paper.sections[0].name}`;
      return `<article class="mock-card ${paper.kind === 'full' ? 'full-card' : 'sectional-card'}">
        <div class="mock-card-top"><span class="mock-number">${paper.kind === 'full' ? paper.title.slice(-2) : String(paper.title.match(/Sectional (\d+)/)?.[1] || '')}</span><span class="mock-state">${attempts ? `${attempts} attempt${attempts === 1 ? '' : 's'}` : 'READY'}</span></div>
        <h3>${escapeHtml(paper.title)}</h3><p>${sectionLine}<br>${duration} · +1 / −⅓</p>
        <button class="button button-dark start-mock" data-mock="${paper.id}">Start test →</button>
      </article>`;
    };
    $('sectional-grid').innerHTML = sectional.map(card).join('');
    $('full-grid').innerHTML = full.map(card).join('');
    document.querySelectorAll('.start-mock').forEach(button => button.addEventListener('click', () => beginMock(button.dataset.mock)));
  }

  function updateResumeBanner() {
    const active = loadSavedSession();
    const paper = active && papers.find(item => item.id === active.mockId);
    if (!active || !paper) {
      $('resume-banner').classList.add('hidden');
      if (active && !paper) localStorage.removeItem(SESSION_KEY);
      return;
    }
    $('resume-copy').textContent = `${paper.title} · ${active.questionIndex + 1} of ${paper.questionCount}`;
    $('resume-banner').classList.remove('hidden');
    $('resume-btn').onclick = () => resumeMock(active);
    $('discard-btn').onclick = () => {
      if (!confirm('Discard the in-progress test and its answers?')) return;
      localStorage.removeItem(SESSION_KEY);
      updateResumeBanner();
    };
  }

  function beginMock(mockId) {
    if (loadSavedSession() && !confirm('Starting a new test will discard the in-progress test. Continue?')) return;
    const paper = papers.find(item => item.id === mockId);
    if (!paper) return;
    const duration = paper.totalMinutes * 60 * 1000;
    session = { mockId, questionIndex: 0, answers: {}, flags: {}, startedAt: Date.now(), deadlineAt: Date.now() + duration };
    localStorage.removeItem(SESSION_KEY);
    saveSession();
    showView('exam-view');
    renderExam();
    startTimer();
  }

  function resumeMock(saved) {
    session = saved;
    if (session.deadlineAt <= Date.now()) {
      finishMock(true);
      return;
    }
    showView('exam-view');
    renderExam();
    startTimer();
  }

  function currentPaper() { return papers.find(paper => paper.id === session.mockId); }

  function startTimer() {
    clearInterval(timerId);
    timerId = setInterval(() => {
      if (!session) return;
      const remaining = Math.ceil((session.deadlineAt - Date.now()) / 1000);
      if (remaining <= 0) finishMock(true);
      else updateTimer(remaining);
    }, 250);
  }

  function updateTimer(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainder = seconds % 60;
    $('timer').textContent = `${String(minutes).padStart(2, '0')}:${String(remainder).padStart(2, '0')}`;
    $('timer-block').classList.toggle('danger', seconds <= 60);
    $('timer-block').classList.toggle('warning', seconds <= 180 && seconds > 60);
  }

  function currentSection(question) {
    return currentPaper().sections.find(section => section.id === question.sectionId);
  }

  function renderExam() {
    if (!session) return;
    const paper = currentPaper();
    const question = paper.questions[session.questionIndex];
    const section = currentSection(question);
    const sectional = paper.kind === 'sectional';
    $('paper-label').textContent = sectional ? 'Sectional practice' : 'Full-length CBT-1 practice';
    $('section-title').textContent = paper.title;
    $('section-subtitle').textContent = sectional
      ? `${section.name} · ${section.count} questions · practice clock (not an official sectional limit) · +1 / −⅓ / 0`
      : `${paper.questionCount} questions · overall 90-minute timer · +1 / −⅓ / 0`;
    $('timer-label').textContent = sectional ? 'SECTION PRACTICE TIME' : 'OVERALL TIME LEFT';
    const stage = sectional ? paper.sections : sections;
    $('stage-track').innerHTML = stage.map(item => {
      const active = item.id === section.id;
      const done = paper.questions.filter(q => q.sectionId === item.id && session.answers[q.id] !== undefined).length === item.count;
      return `<button type="button" class="stage-step ${active ? 'active' : done ? 'complete' : ''}" data-section="${item.id}">${escapeHtml(item.name)} <small>${item.count} Q</small></button>`;
    }).join('');
    $('stage-track').querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
      const target = paper.questions.findIndex(item => item.sectionId === button.dataset.section);
      if (target >= 0) { session.questionIndex = target; saveSession(); renderExam(); }
    }));
    $('timer-block').classList.toggle('sectional-timer', sectional);
    renderQuestionNav();
    renderQuestion();
    updateTimer(Math.max(0, Math.ceil((session.deadlineAt - Date.now()) / 1000)));
    saveSession();
  }

  function renderQuestionNav() {
    const paper = currentPaper();
    const section = currentSection(paper.questions[session.questionIndex]);
    const visible = paper.kind === 'sectional' ? section.questions : paper.questions;
    const answered = visible.filter(q => session.answers[q.id] !== undefined).length;
    $('answered-count').textContent = `${answered}/${visible.length} answered`;
    $('question-nav').innerHTML = visible.map((question, index) => {
      const globalIndex = paper.questions.indexOf(question);
      const classes = [globalIndex === session.questionIndex ? 'current' : ''];
      if (session.answers[question.id] !== undefined) classes.push('answered');
      if (session.flags[question.id]) classes.push('flagged');
      return `<button type="button" class="${classes.filter(Boolean).join(' ')}" data-question="${globalIndex}" aria-label="Question ${index + 1}">${index + 1}</button>`;
    }).join('');
    $('question-nav').querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
      session.questionIndex = Number(button.dataset.question);
      saveSession(); renderExam();
    }));
  }

  function renderQuestion() {
    const paper = currentPaper();
    const question = paper.questions[session.questionIndex];
    const section = currentSection(question);
    const localIndex = section.questions.indexOf(question) + 1;
    $('question-counter').textContent = `${section.name} · Question ${localIndex} of ${section.count} · Paper ${session.questionIndex + 1} of ${paper.questionCount}`;
    const badges = [`<span class="badge ${question.type === 'PYQ' ? 'pyq' : ''}">${escapeHtml(question.type)}</span>`, `<span class="badge">${escapeHtml(question.level)}</span>`, `<span class="badge source">${escapeHtml(question.topic)}</span>`];
    $('question-badges').innerHTML = badges.join('');
    $('question-text').textContent = question.question;
    const selected = session.answers[question.id];
    $('options-list').innerHTML = question.options.map((option, index) => `<label class="option-label ${selected === index ? 'selected' : ''}"><input type="radio" name="answer" value="${index}" ${selected === index ? 'checked' : ''}><span class="option-letter">${String.fromCharCode(65 + index)}.</span><span>${escapeHtml(option)}</span></label>`).join('');
    $('options-list').querySelectorAll('input').forEach(input => input.addEventListener('change', () => {
      session.answers[question.id] = Number(input.value); saveSession(); renderQuestionNav(); renderQuestion();
    }));
    $('flag-btn').classList.toggle('active', Boolean(session.flags[question.id]));
    $('flag-btn').textContent = session.flags[question.id] ? '★ Marked for review' : '☆ Mark for review';
    $('flag-btn').onclick = () => { session.flags[question.id] = !session.flags[question.id]; saveSession(); renderQuestionNav(); renderQuestion(); };
    const index = session.questionIndex;
    $('previous-btn').disabled = index === 0;
    $('next-btn').disabled = index === paper.questions.length - 1;
    $('previous-btn').onclick = () => { if (session.questionIndex > 0) { session.questionIndex--; saveSession(); renderExam(); } };
    $('next-btn').onclick = () => { if (session.questionIndex < paper.questions.length - 1) { session.questionIndex++; saveSession(); renderExam(); } };
    $('submit-btn').onclick = () => finishMock(false);
  }

  function scoreSection(section, answers) {
    let correct = 0, incorrect = 0, unanswered = 0;
    for (const question of section.questions) {
      const selected = answers[question.id];
      if (selected === undefined) unanswered++;
      else if (selected === question.answer) correct++;
      else incorrect++;
    }
    return { sectionId: section.id, name: section.name, count: section.questions.length, correct, incorrect, unanswered, marks: correct - incorrect / 3 };
  }

  function makeReview(paper, answers, flags) {
    return paper.questions.map(question => {
      const selected = answers[question.id];
      return { ...question, selected: selected === undefined ? -1 : selected, correct: selected === question.answer, skipped: selected === undefined, flagged: Boolean(flags[question.id]) };
    });
  }

  function finishMock(autoSubmitted) {
    if (!session) return;
    const paper = currentPaper();
    if (!autoSubmitted && !confirm(`Submit ${paper.title}? You cannot change answers after submission.`)) return;
    clearInterval(timerId);
    const answers = session.answers;
    const sectionResults = paper.sections.map(section => scoreSection(section, answers));
    const review = makeReview(paper, answers, session.flags);
    const correct = sectionResults.reduce((sum, section) => sum + section.correct, 0);
    const incorrect = sectionResults.reduce((sum, section) => sum + section.incorrect, 0);
    const unanswered = sectionResults.reduce((sum, section) => sum + section.unanswered, 0);
    const marks = sectionResults.reduce((sum, section) => sum + section.marks, 0);
    const record = {
      id: `rrb-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
      mockId: paper.id, mockTitle: paper.title, date: new Date().toISOString(), kind: paper.kind,
      total: paper.questionCount, correct, incorrect, unanswered, marks,
      sections: sectionResults, questionResults: review,
      timeTaken: Math.min(paper.totalMinutes * 60, Math.max(1, Math.round((Date.now() - session.startedAt) / 1000)))
    };
    const history = loadResults();
    history.unshift(record);
    localStorage.setItem(RESULTS_KEY, JSON.stringify(history.slice(0, 50)));
    try {
      const appHistory = JSON.parse(localStorage.getItem('mockprep_results') || '[]');
      appHistory.unshift({
        ...record, company: 'RRB NTPC', section: paper.title,
        totalTime: paper.totalMinutes * 60, totalMarks: paper.questionCount,
        topicScores: Object.fromEntries(sectionResults.map(section => [section.name, { correct: section.correct, total: section.count }])),
        questionResults: review.map(question => ({
          id: question.id, question: question.question, code: null, options: question.options,
          correctAnswer: question.answer, userAnswer: question.selected, isCorrect: question.correct,
          explanation: question.explanation, topic: question.sectionName, sourceType: question.type, level: question.level
        }))
      });
      localStorage.setItem('mockprep_results', JSON.stringify(appHistory.slice(0, 50)));
    } catch (error) { console.warn('Could not add this attempt to the shared results page.', error); }
    localStorage.removeItem(SESSION_KEY);
    session = null;
    renderResult(record, autoSubmitted);
  }

  function renderResult(record, autoSubmitted) {
    $('result-title').textContent = `${record.mockTitle} complete`;
    $('result-subtitle').textContent = `${record.correct} correct · ${record.incorrect} incorrect · ${record.unanswered} unattempted · +1 / −⅓ scoring${autoSubmitted ? ' · Time expired' : ''}`;
    $('result-marks').textContent = record.marks.toFixed(2).replace(/\.00$/, '');
    $('result-total').textContent = `out of ${record.total} marks`;
    $('section-results').innerHTML = record.sections.map(section => `<article class="section-result-card"><span>${escapeHtml(section.name)}</span><strong>${section.marks.toFixed(2).replace(/\.00$/, '')} / ${section.count}</strong><small>${section.correct} right · ${section.incorrect} wrong · ${section.unanswered} skipped</small></article>`).join('');
    const filter = $('review-filter');
    filter.innerHTML = `<option value="all">All questions</option><option value="incorrect">Incorrect</option><option value="skipped">Skipped</option><option value="flagged">Marked for review</option>${record.sections.map(section => `<option value="${escapeHtml(section.sectionId)}">${escapeHtml(section.name)}</option>`).join('')}`;
    filter.value = 'all';
    filter.onchange = () => { currentReviewFilter = filter.value; renderReview(record); };
    currentReviewFilter = 'all';
    renderReview(record);
    $('back-tests-btn').onclick = () => { renderCards(); updateResumeBanner(); showView('selection-view'); };
    showView('result-view');
  }

  function renderReview(record) {
    const items = record.questionResults.filter(question => {
      if (currentReviewFilter === 'all') return true;
      if (currentReviewFilter === 'incorrect') return !question.correct && !question.skipped;
      if (currentReviewFilter === 'skipped') return question.skipped;
      if (currentReviewFilter === 'flagged') return question.flagged;
      return question.sectionId === currentReviewFilter;
    });
    if (!items.length) { $('review-list').innerHTML = '<div class="empty-state">No questions match this filter.</div>'; return; }
    $('review-list').innerHTML = items.map(question => {
      const selected = question.selected < 0 ? 'Not answered' : `${String.fromCharCode(65 + question.selected)}. ${question.options[question.selected]}`;
      const correct = `${String.fromCharCode(65 + question.answer)}. ${question.options[question.answer]}`;
      const score = question.skipped ? 'Skipped' : question.correct ? 'Correct · +1' : 'Incorrect · −⅓';
      const source = question.sourceUrl ? `<a href="${escapeHtml(question.sourceUrl)}" target="_blank" rel="noopener">${escapeHtml(question.source)}</a>` : escapeHtml(question.source);
      return `<article class="review-card"><div class="review-top"><span>${escapeHtml(question.sectionName)} · ${escapeHtml(question.topic)} · ${escapeHtml(question.level)}</span><span>${score}${question.flagged ? ' · Marked for review' : ''}</span></div><div class="review-question">${escapeHtml(question.question)}</div><div class="review-options">${question.options.map((option, index) => `<div class="review-option ${index === question.answer ? 'correct' : index === question.selected && !question.correct ? 'wrong' : ''}">${String.fromCharCode(65 + index)}. ${escapeHtml(option)}${index === question.answer ? ' · Correct answer' : index === question.selected ? ' · Your answer' : ''}</div>`).join('')}</div><div class="review-note"><strong>Your answer:</strong> ${escapeHtml(selected)}<br><strong>Correct:</strong> ${escapeHtml(correct)}<br><strong>Why:</strong> ${escapeHtml(question.explanation)}${question.related ? `<br><strong>Related rule / fact:</strong> ${escapeHtml(question.related)}` : ''}<br><strong>Question type:</strong> ${escapeHtml(question.type)} · ${source}</div></article>`;
    }).join('');
  }

  async function init() {
    try {
      const response = await fetch('question-bank.json', { cache: 'no-cache' });
      if (!response.ok) throw new Error(`Question bank request failed (${response.status}).`);
      bank = await response.json();
      buildPapers();
      renderCards();
      updateResumeBanner();
      const saved = loadSavedSession();
      if (saved && saved.deadlineAt <= Date.now()) resumeMock(saved);
      else if (saved) $('resume-btn').onclick = () => resumeMock(saved);
    } catch (error) {
      console.error(error);
      $('selection-view').innerHTML = `<div class="empty-state">The RRB question bank could not be loaded. Open this page through the MockPrep site or a local web server.</div>`;
    }
  }

  document.addEventListener('visibilitychange', () => { if (session) saveSession(); });
  window.addEventListener('beforeunload', () => { if (session) saveSession(); });
  document.addEventListener('DOMContentLoaded', init);
})();
