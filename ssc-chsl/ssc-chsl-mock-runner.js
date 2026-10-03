(function () {
  const DATA = globalThis.SSC_CHSL_MOCK_DATA;
  const SESSION_KEY = 'ssc_chsl_active_mock_v1';
  const RESULTS_KEY = 'ssc_chsl_mock_results_v1';
  const SECTION_SECONDS = 15 * 60;
  const $ = id => document.getElementById(id);
  let session = null;
  let timerId = null;
  let currentFilter = 'all';

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, character => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[character]);
  }

  function getResults() {
    try { return JSON.parse(localStorage.getItem(RESULTS_KEY)) || []; }
    catch (error) { return []; }
  }

  function saveSession() {
    if (!session) return;
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }

  function loadSession() {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY)); }
    catch (error) { return null; }
  }

  function setView(viewId) {
    ['selection-view', 'exam-view', 'transition-view', 'result-view'].forEach(id => {
      $(id).classList.toggle('hidden', id !== viewId);
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function renderMockCards() {
    const results = getResults();
    $('mock-grid').innerHTML = DATA.mocks.map(mock => {
      const attempts = results.filter(result => result.mockId === mock.id).length;
      return `
        <article class="mock-card">
          <div class="mock-card-top"><span class="mock-number">${mock.title.replace('Mock Test ', '')}</span><span class="mock-state">${attempts ? `${attempts} attempt${attempts === 1 ? '' : 's'}` : 'READY'}</span></div>
          <h3>${mock.title}</h3>
          <p>100 questions · 60 minutes · 4 sections</p>
          <button class="button button-dark start-mock" data-mock="${mock.id}">Start paper →</button>
        </article>`;
    }).join('');
    $('mock-grid').querySelectorAll('.start-mock').forEach(button => {
      button.addEventListener('click', () => beginMock(button.dataset.mock));
    });
  }

  function updateResumeBanner() {
    const active = loadSession();
    if (!active) {
      $('resume-banner').classList.add('hidden');
      return;
    }
    const mock = DATA.mocks.find(item => item.id === active.mockId);
    if (!mock) {
      localStorage.removeItem(SESSION_KEY);
      $('resume-banner').classList.add('hidden');
      return;
    }
    $('resume-copy').textContent = `${mock.title} · ${DATA.sections[active.sectionIndex]?.name || 'Ready to submit'}`;
    $('resume-banner').classList.remove('hidden');
    $('resume-btn').onclick = () => resumeMock(active);
    $('discard-btn').onclick = () => {
      if (!confirm('Discard this in-progress mock? Its answers will be deleted.')) return;
      localStorage.removeItem(SESSION_KEY);
      updateResumeBanner();
    };
  }

  function beginMock(mockId) {
    if (loadSession() && !confirm('Starting a new mock will discard the in-progress mock. Continue?')) return;
    localStorage.removeItem(SESSION_KEY);
    session = {
      mockId,
      sectionIndex: 0,
      questionIndex: 0,
      answers: {},
      flags: {},
      sectionStartedAt: Date.now(),
      deadlineAt: Date.now() + SECTION_SECONDS * 1000,
      startedAt: Date.now()
    };
    saveSession();
    startTimer();
    renderExam();
    setView('exam-view');
  }

  function resumeMock(savedSession) {
    session = savedSession;
    const remaining = Math.ceil((session.deadlineAt - Date.now()) / 1000);
    if (remaining <= 0) {
      setView('exam-view');
      session.remainingExpired = true;
      submitSection(true);
      return;
    }
    startTimer();
    renderExam();
    setView('exam-view');
  }

  function getCurrentMock() {
    return DATA.mocks.find(mock => mock.id === session.mockId);
  }

  function getCurrentSection() {
    return getCurrentMock().sections[session.sectionIndex];
  }

  function answerKey(question) { return question.id; }

  function startTimer() {
    clearInterval(timerId);
    timerId = setInterval(() => {
      if (!session) return;
      const remaining = Math.ceil((session.deadlineAt - Date.now()) / 1000);
      if (remaining <= 0) {
        clearInterval(timerId);
        submitSection(true);
        return;
      }
      updateTimer(remaining);
    }, 250);
  }

  function updateTimer(remaining) {
    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;
    $('timer').textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    $('timer-block')?.classList.toggle('danger', remaining <= 60);
    $('timer-block')?.classList.toggle('warning', remaining <= 180 && remaining > 60);
    $('timer').classList.toggle('danger', remaining <= 60);
  }

  function renderExam() {
    if (!session) return;
    const mock = getCurrentMock();
    const section = getCurrentSection();
    const questions = section.questions;
    if (!section) return;

    $('paper-label').textContent = `${mock.title} · Section ${session.sectionIndex + 1} of 4`;
    $('section-title').textContent = section.name;
    $('section-subtitle').textContent = '15:00 for this section · +2 correct · −0.50 incorrect · 0 unattempted';
    $('stage-track').innerHTML = DATA.sections.map((item, index) => {
      const stateClass = index < session.sectionIndex ? 'complete' : index === session.sectionIndex ? 'active' : '';
      return `<div class="stage-step ${stateClass}">${String(index + 1).padStart(2, '0')} · ${escapeHtml(item.name)}</div>`;
    }).join('');

    renderQuestionNav();
    renderQuestion();
    updateTimer(Math.max(0, Math.ceil((session.deadlineAt - Date.now()) / 1000)));
    saveSession();
  }

  function renderQuestionNav() {
    const section = getCurrentSection();
    const answered = section.questions.filter(question => session.answers[answerKey(question)] !== undefined).length;
    $('answered-count').textContent = `${answered}/25 answered`;
    $('question-nav').innerHTML = section.questions.map((question, index) => {
      const classes = [index === session.questionIndex ? 'current' : ''];
      if (session.answers[answerKey(question)] !== undefined) classes.push('answered');
      if (session.flags[answerKey(question)]) classes.push('flagged');
      return `<button type="button" class="${classes.filter(Boolean).join(' ')}" data-question="${index}" aria-label="Question ${index + 1}${session.answers[answerKey(question)] !== undefined ? ', answered' : ''}${session.flags[answerKey(question)] ? ', marked for review' : ''}">${index + 1}</button>`;
    }).join('');
    $('question-nav').querySelectorAll('button').forEach(button => {
      button.addEventListener('click', () => {
        session.questionIndex = Number(button.dataset.question);
        renderQuestionNav();
        renderQuestion();
      });
    });
  }

  function renderQuestion() {
    const section = getCurrentSection();
    const question = section.questions[session.questionIndex];
    const selected = session.answers[answerKey(question)];
    $('question-counter').textContent = `${section.name} · Question ${session.questionIndex + 1} of 25`;
    $('question-text').textContent = question.question;
    $('flag-btn').classList.toggle('active', Boolean(session.flags[answerKey(question)]));
    $('flag-btn').textContent = session.flags[answerKey(question)] ? '★ Marked for review' : '☆ Mark for review';
    $('options-list').innerHTML = question.options.map((option, index) => `
      <label class="option-label ${selected === index ? 'selected' : ''}">
        <input type="radio" name="answer" value="${index}" ${selected === index ? 'checked' : ''}>
        <span class="option-letter">${String.fromCharCode(65 + index)}.</span>
        <span>${escapeHtml(option)}</span>
      </label>
    `).join('');
    $('options-list').querySelectorAll('input').forEach(input => {
      input.addEventListener('change', () => {
        session.answers[answerKey(question)] = Number(input.value);
        saveSession();
        renderQuestionNav();
        renderQuestion();
      });
    });
    $('previous-btn').disabled = session.questionIndex === 0;
    $('next-btn').disabled = session.questionIndex === section.questions.length - 1;
    $('flag-btn').onclick = () => {
      session.flags[answerKey(question)] = !session.flags[answerKey(question)];
      saveSession();
      renderQuestionNav();
      renderQuestion();
    };
    $('previous-btn').onclick = () => {
      if (session.questionIndex > 0) {
        session.questionIndex--;
        renderQuestionNav();
        renderQuestion();
      }
    };
    $('next-btn').onclick = () => {
      if (session.questionIndex < section.questions.length - 1) {
        session.questionIndex++;
        renderQuestionNav();
        renderQuestion();
      }
    };
    $('submit-section-btn').onclick = () => submitSection(false);
  }

  function calculateSection(section) {
    let correct = 0;
    let incorrect = 0;
    let unanswered = 0;
    for (const question of section.questions) {
      const selected = session.answers[answerKey(question)];
      if (selected === undefined) unanswered++;
      else if (selected === question.answer) correct++;
      else incorrect++;
    }
    return { correct, incorrect, unanswered, marks: correct * 2 - incorrect * 0.5 };
  }

  function submitSection(autoSubmitted) {
    if (!session) return;
    const section = getCurrentSection();
    if (!autoSubmitted && !confirm('Submit this section and unlock the next one? You cannot return after submission.')) return;
    clearInterval(timerId);
    const score = calculateSection(section);
    session.sectionResults = session.sectionResults || [];
    const sectionTimeTaken = Math.min(SECTION_SECONDS, Math.max(1, Math.round((Date.now() - session.sectionStartedAt) / 1000)));
    session.sectionResults[session.sectionIndex] = { ...score, timeTaken: sectionTimeTaken, autoSubmitted, submittedAt: new Date().toISOString() };
    session.sectionIndex++;
    session.questionIndex = 0;

    if (session.sectionIndex >= DATA.sections.length) {
      finishMock();
      return;
    }

    session.deadlineAt = Date.now() + SECTION_SECONDS * 1000;
    session.sectionStartedAt = Date.now();
    saveSession();
    startTimer();
    renderExam();
    $('section-subtitle').textContent = autoSubmitted
      ? 'Time ended. This section auto-submitted; the next 15-minute section is now open.'
      : 'Section submitted. The next 15-minute section is now open.';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function makeReviewItems(mock) {
    return mock.sections.flatMap(section => section.questions.map(question => {
      const selected = session.answers[answerKey(question)];
      const correct = selected === question.answer;
      return {
        id: question.id,
        section: section.name,
        topic: question.topic,
        question: question.question,
        options: question.options,
        answer: question.answer,
        selected: selected === undefined ? -1 : selected,
        correct,
        skipped: selected === undefined,
        flagged: Boolean(session.flags[answerKey(question)]),
        explanation: question.explanation,
        shortcut: question.shortcut
      };
    }));
  }

  function finishMock() {
    clearInterval(timerId);
    const mock = getCurrentMock();
    const review = makeReviewItems(mock);
    const sectionResults = mock.sections.map((section, index) => session.sectionResults?.[index] || calculateSection(section));
    const correct = sectionResults.reduce((sum, result) => sum + result.correct, 0);
    const incorrect = sectionResults.reduce((sum, result) => sum + result.incorrect, 0);
    const unanswered = sectionResults.reduce((sum, result) => sum + result.unanswered, 0);
    const marks = sectionResults.reduce((sum, result) => sum + result.marks, 0);
    const record = {
      id: `ssc-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
      mockId: mock.id,
      mockTitle: mock.title,
      date: new Date().toISOString(),
      total: 100,
      correct,
      incorrect,
      unanswered,
      marks,
      percentage: Math.round((marks / 200) * 1000) / 10,
      sections: sectionResults,
      questionResults: review
    };
    const history = getResults();
    history.unshift(record);
    localStorage.setItem(RESULTS_KEY, JSON.stringify(history.slice(0, 50)));

    const topicScores = {};
    const sharedQuestionResults = review.map(item => {
      const topic = item.section;
      topicScores[topic] = topicScores[topic] || { correct: 0, total: 0 };
      topicScores[topic].total++;
      if (item.correct) topicScores[topic].correct++;
      return {
        id: item.id,
        question: item.question,
        code: null,
        options: item.options,
        correctAnswer: item.answer,
        userAnswer: item.selected,
        isCorrect: item.correct,
        explanation: `${item.explanation} Shortcut / formula: ${item.shortcut}`,
        topic
      };
    });
    const appResult = {
      ...record,
      company: 'SSC CHSL',
      section: `${record.mockTitle} Tier-I`,
      timeTaken: sectionResults.reduce((sum, result) => sum + (result.timeTaken || 0), 0),
      totalTime: DATA.exam.totalMinutes * 60,
      totalMarks: marks,
      topicScores,
      questionResults: sharedQuestionResults
    };
    try {
      const appHistory = JSON.parse(localStorage.getItem('mockprep_results') || '[]');
      appHistory.unshift(appResult);
      localStorage.setItem('mockprep_results', JSON.stringify(appHistory.slice(0, 50)));
    } catch (error) {
      console.error('Could not save SSC CHSL result to MockPrep history:', error);
    }
    localStorage.removeItem(SESSION_KEY);
    session = null;
    renderResult(record);
    setView('result-view');
  }

  function renderResult(record) {
    $('result-title').textContent = `${record.mockTitle} complete`;
    $('result-subtitle').textContent = `${record.correct} correct · ${record.incorrect} incorrect · ${record.unanswered} unattempted · +2 / −0.50 scoring`;
    $('result-marks').textContent = Number.isInteger(record.marks) ? record.marks : record.marks.toFixed(1);
    $('section-results').innerHTML = record.sections.map((result, index) => `
      <article class="section-result-card"><span>${escapeHtml(DATA.sections[index].name)}</span><strong>${Number.isInteger(result.marks) ? result.marks : result.marks.toFixed(1)} / 50</strong><small>${result.correct}/25 correct · ${result.incorrect} wrong · ${result.unanswered} skipped</small></article>
    `).join('');
    $('review-filter').value = 'all';
    $('review-filter').onchange = () => {
      currentFilter = $('review-filter').value;
      renderReview(record);
    };
    renderReview(record);
    $('back-tests-btn').onclick = () => {
      renderMockCards();
      updateResumeBanner();
      setView('selection-view');
    };
  }

  function renderReview(record) {
    const items = record.questionResults.filter(item => {
      if (currentFilter === 'all') return true;
      if (currentFilter === 'incorrect') return !item.correct && !item.skipped;
      if (currentFilter === 'skipped') return item.skipped;
      if (currentFilter === 'flagged') return item.flagged;
      return item.section === currentFilter;
    });
    if (!items.length) {
      $('review-list').innerHTML = '<div class="empty-state">No questions match this filter.</div>';
      return;
    }
    $('review-list').innerHTML = items.map(item => {
      const chosen = item.selected < 0 ? 'Not answered' : `${String.fromCharCode(65 + item.selected)}. ${item.options[item.selected]}`;
      const correctChoice = `${String.fromCharCode(65 + item.answer)}. ${item.options[item.answer]}`;
      return `
        <article class="review-card">
          <div class="review-top"><span>${escapeHtml(item.section)} · ${escapeHtml(item.topic)}</span><span>${item.skipped ? 'Skipped' : item.correct ? 'Correct · +2' : 'Incorrect · −0.50'}${item.flagged ? ' · Marked for review' : ''}</span></div>
          <div class="review-question">${escapeHtml(item.question)}</div>
          <div class="review-options">${item.options.map((option, index) => `<div class="review-option ${index === item.answer ? 'correct' : index === item.selected && !item.correct ? 'wrong' : ''}">${String.fromCharCode(65 + index)}. ${escapeHtml(option)}${index === item.answer ? ' · Correct answer' : index === item.selected ? ' · Your answer' : ''}</div>`).join('')}</div>
          <div class="review-note"><strong>Your answer:</strong> ${escapeHtml(chosen)}<br><strong>Correct:</strong> ${escapeHtml(correctChoice)}<br><strong>Why:</strong> ${escapeHtml(item.explanation)}<br><strong>Shortcut / formula:</strong> ${escapeHtml(item.shortcut)}</div>
        </article>`;
    }).join('');
  }

  function onPageLoad() {
    $('exam-view').querySelector('.timer-block').id = 'timer-block';
    $('back-tests-btn').addEventListener('click', () => {
      renderMockCards();
      updateResumeBanner();
      setView('selection-view');
    });
    renderMockCards();
    updateResumeBanner();
    const existing = loadSession();
    if (existing) {
      const remaining = Math.ceil((existing.deadlineAt - Date.now()) / 1000);
      if (remaining <= 0) resumeMock(existing);
    }
  }

  document.addEventListener('visibilitychange', () => {
    if (session) saveSession();
  });
  window.addEventListener('beforeunload', () => {
    if (session) saveSession();
  });
  document.addEventListener('DOMContentLoaded', onPageLoad);
})();
