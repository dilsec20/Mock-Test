/* SSC CHSL Tier-I — Unified Full Mock, Sectional & Chapter-Wise PYQ Engine */
(function () {
  'use strict';

  const MOCK_DATA = globalThis.SSC_CHSL_MOCK_DATA;
  const SECTION_SECONDS = 15 * 60;
  const CHAPTER_SECONDS = 30 * 60;
  const SESSION_KEY = 'ssc_chsl_active_test_v2';
  const $ = id => document.getElementById(id);

  let session = null;
  let timerId = null;
  let currentMode = 'full'; // 'full' | 'sectional' | 'chapter'
  let currentSubject = 'gs'; // 'gs' | 'english' | 'reasoning' | 'quant'
  let currentChapterSubject = 'gs';
  let currentFilter = 'all';

  function escapeHtml(v) {
    return String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  }

  /* ── Subject Configurations for Sectional Tests ── */
  function getSubjectConfig(key) {
    const configs = {
      gs: {
        id: 'gs',
        title: 'General Awareness / GS',
        shortTitle: 'GS & Current Affairs',
        eyebrow: 'General Studies Practice',
        banner: '250 PYQ-style questions covering Indian History, Polity, Geography, Science, Economics, Art & Culture, Sports, Environment, and Current Affairs.',
        resultsKey: 'ssc_chsl_sect_gs_results_v1',
        getTests: () => globalThis.SSC_CHSL_SECTIONAL_GS_DATA?.tests || []
      },
      english: {
        id: 'english',
        title: 'English Language',
        shortTitle: 'English Language',
        eyebrow: 'English Language Practice',
        banner: '250 PYQ-style questions covering Vocabulary, Synonyms & Antonyms, Idioms & Phrases, One-Word Substitution, Active/Passive Voice, Direct/Indirect Speech, Error Detection, Sentence Improvement, and Cloze Test.',
        resultsKey: 'ssc_chsl_sect_eng_results_v1',
        getTests: () => globalThis.SSC_CHSL_SECTIONAL_ENG_DATA?.tests || []
      },
      reasoning: {
        id: 'reasoning',
        title: 'General Intelligence & Reasoning',
        shortTitle: 'Reasoning',
        eyebrow: 'Reasoning Ability Practice',
        banner: '250 practice questions covering Analogy, Number & Letter Series, Coding-Decoding, Blood Relations, Direction Sense, Syllogisms, Venn Diagrams, and Classification.',
        resultsKey: 'ssc_chsl_sect_rea_results_v1',
        getTests: () => {
          if (!MOCK_DATA?.mocks) return [];
          return MOCK_DATA.mocks.map((mock, idx) => ({
            id: `sect-rea-${String(idx + 1).padStart(2, '0')}`,
            title: `Reasoning Test ${String(idx + 1).padStart(2, '0')}`,
            questions: mock.sections[1].questions
          }));
        }
      },
      quant: {
        id: 'quant',
        title: 'Quantitative Aptitude',
        shortTitle: 'Quantitative Aptitude',
        eyebrow: 'Quantitative Aptitude Practice',
        banner: '250 practice questions covering Arithmetic, Percentages, Profit & Loss, SI/CI, Ratio, Time & Work, Speed-Distance, Algebra, Geometry, Mensuration, and Data Interpretation.',
        resultsKey: 'ssc_chsl_sect_qa_results_v1',
        getTests: () => {
          if (!MOCK_DATA?.mocks) return [];
          return MOCK_DATA.mocks.map((mock, idx) => ({
            id: `sect-qa-${String(idx + 1).padStart(2, '0')}`,
            title: `Quant Test ${String(idx + 1).padStart(2, '0')}`,
            questions: mock.sections[2].questions
          }));
        }
      }
    };
    return configs[key] || configs.gs;
  }

  /* ── Subject Configurations for Chapter-Wise PYQ Tests (50 Qs · 30 min · 100 Marks) ── */
  function getChapterSubjectConfig(key) {
    const configs = {
      gs: {
        id: 'gs',
        title: 'General Awareness / GS',
        shortTitle: 'General Awareness',
        eyebrow: '12 Chapters · 600 PYQs',
        banner: 'Chapter-by-chapter SSC CHSL/CGL PYQ tests mapped to every GS module: History, Geography & Census 2011, Polity, Economics, Physics, Chemistry, Biology, Art & Culture, Awards & Books, Sports & Days, Environment, and Computer & Space (50 MCQs · 30 min each).',
        resultsKey: 'ssc_chsl_ch_gs_results_v1',
        getTests: () => globalThis.SSC_CHSL_CHAPTER_GS_DATA?.tests || []
      },
      english: {
        id: 'english',
        title: 'English Language',
        shortTitle: 'English Language',
        eyebrow: '6 Chapters · 300 PYQs',
        banner: 'Topic-focused SSC PYQ mastery covering Error Detection & Grammar, Synonyms & Antonyms, Idioms & Phrases, One-Word Substitution, Voice & Direct-Indirect Speech, and Fillers/Improvement/Para Jumbles/Spellings (50 MCQs · 30 min each).',
        resultsKey: 'ssc_chsl_ch_eng_results_v1',
        getTests: () => globalThis.SSC_CHSL_CHAPTER_ENG_DATA?.tests || []
      },
      reasoning: {
        id: 'reasoning',
        title: 'General Intelligence & Reasoning',
        shortTitle: 'Reasoning',
        eyebrow: '8 Chapters · 400 PYQs',
        banner: 'Chapter-wise SSC PYQ practice covering Analogies, Number/Letter Series, Coding-Decoding, Odd One Out & Words, Blood Relations & Ranking, Directions/Clocks/Calendars, Syllogism & Venn Diagrams, and Math Ops/Matrix/Dice (50 MCQs · 30 min each).',
        resultsKey: 'ssc_chsl_ch_rea_results_v1',
        getTests: () => globalThis.SSC_CHSL_CHAPTER_REA_DATA?.tests || []
      },
      quant: {
        id: 'quant',
        title: 'Quantitative Aptitude',
        shortTitle: 'Quantitative Aptitude',
        eyebrow: '12 Chapters · 600 PYQs',
        banner: 'Complete 12-chapter Quant PYQ drills matching your study modules: Number System, LCM/HCF, Percentage, Profit-Loss, Ratio/Avg, SI/CI, Time-Work, TSD, Geometry, Mensuration, Trigonometry, and Algebra & DI (50 MCQs · 30 min each).',
        resultsKey: 'ssc_chsl_ch_qa_results_v1',
        getTests: () => globalThis.SSC_CHSL_CHAPTER_QA_DATA?.tests || []
      }
    };
    return configs[key] || configs.gs;
  }

  function getActiveConfig(rec) {
    return rec.isChapter ? getChapterSubjectConfig(rec.subjectKey) : getSubjectConfig(rec.subjectKey);
  }

  function getResults(storageKey) {
    try { return JSON.parse(localStorage.getItem(storageKey)) || []; } catch { return []; }
  }
  function saveSession() {
    if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }
  function loadSession() {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY)); } catch { return null; }
  }

  function setView(viewId) {
    ['selection-view', 'exam-view', 'transition-view', 'result-view'].forEach(id => {
      $(id).classList.toggle('hidden', id !== viewId);
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* ── Mode Switching (Full Mock vs Sectional vs Chapter-Wise) ── */
  function switchMode(mode) {
    currentMode = mode;
    $('btn-mode-full').classList.toggle('active', mode === 'full');
    $('btn-mode-full').setAttribute('aria-selected', mode === 'full');
    $('btn-mode-sectional').classList.toggle('active', mode === 'sectional');
    $('btn-mode-sectional').setAttribute('aria-selected', mode === 'sectional');
    $('btn-mode-chapter').classList.toggle('active', mode === 'chapter');
    $('btn-mode-chapter').setAttribute('aria-selected', mode === 'chapter');

    $('full-mock-container').classList.toggle('hidden', mode !== 'full');
    $('sectional-container').classList.toggle('hidden', mode !== 'sectional');
    $('chapter-container').classList.toggle('hidden', mode !== 'chapter');

    if (mode === 'full') {
      $('view-eyebrow').textContent = 'Computer-based mock practice';
      $('view-title').textContent = 'SSC CHSL Tier-I';
      $('view-copy').textContent = 'Ten full-length practice papers. Four timed sections. Detailed review after submission.';
      $('fact-questions').textContent = '100';
      $('fact-duration').textContent = '60';
      $('fact-marking').textContent = '+2 / −0.5';
      renderFullMockCards();
    } else if (mode === 'sectional') {
      $('view-eyebrow').textContent = 'Focused subject practice';
      $('view-title').textContent = 'SSC CHSL Sectional Tests';
      $('view-copy').textContent = 'Timed 15-minute drills with 25 questions each across General Awareness, English, Reasoning, and Quantitative Aptitude.';
      $('fact-questions').textContent = '25';
      $('fact-duration').textContent = '15';
      $('fact-marking').textContent = '+2 / −0.5';
      document.querySelectorAll('.sect-tab').forEach(t => t.classList.toggle('active', t.dataset.subject === currentSubject));
      renderSectionalView();
    } else {
      $('view-eyebrow').textContent = 'Chapter-wise PYQ mastery';
      $('view-title').textContent = 'SSC CHSL Chapter Tests';
      $('view-copy').textContent = 'Deep 50-MCQ chapter tests built from high-frequency SSC PYQs. Official 2× pace: 30 minutes per 50 questions (+2 / −0.50).';
      $('fact-questions').textContent = '50';
      $('fact-duration').textContent = '30';
      $('fact-marking').textContent = '+2 / −0.5';
      document.querySelectorAll('.ch-tab').forEach(t => t.classList.toggle('active', t.dataset.subject === currentChapterSubject));
      renderChapterView();
    }
    updateResumeBanner();
  }

  /* ── Full Mock Cards ── */
  function renderFullMockCards() {
    const results = getResults('ssc_chsl_mock_results_v1');
    $('mock-grid').innerHTML = MOCK_DATA.mocks.map(mock => {
      const attempts = results.filter(r => r.mockId === mock.id).length;
      return `
        <article class="mock-card">
          <div class="mock-card-top">
            <span class="mock-number">${mock.title.replace('Mock Test ', '')}</span>
            <span class="mock-state">${attempts ? `${attempts} attempt${attempts === 1 ? '' : 's'}` : 'READY'}</span>
          </div>
          <h3>${mock.title}</h3>
          <p>100 questions · 60 minutes · 4 sections</p>
          <button class="button button-dark start-mock" data-mock="${mock.id}">Start paper →</button>
        </article>`;
    }).join('');

    $('mock-grid').querySelectorAll('.start-mock').forEach(btn => {
      btn.addEventListener('click', () => beginFullMock(btn.dataset.mock));
    });
  }

  /* ── Sectional View & Cards ── */
  function renderSectionalView() {
    const cfg = getSubjectConfig(currentSubject);
    $('subject-banner').textContent = cfg.banner;
    $('sect-heading-eyebrow').textContent = cfg.eyebrow;
    $('sect-heading-title').textContent = `${cfg.shortTitle} Sectional Tests`;

    const tests = cfg.getTests();
    $('sect-heading-muted').textContent = `${tests.length * 25} questions across ${tests.length} tests`;

    const results = getResults(cfg.resultsKey);
    $('sectional-grid').innerHTML = tests.map(test => {
      const attempts = results.filter(r => r.testId === test.id).length;
      return `
        <article class="mock-card">
          <div class="mock-card-top">
            <span class="mock-number">${test.title.replace(/[^0-9]/g, '')}</span>
            <span class="mock-state">${attempts ? `${attempts} attempt${attempts === 1 ? '' : 's'}` : 'READY'}</span>
          </div>
          <h3>${test.title}</h3>
          <p>25 questions · 15 minutes · ${cfg.shortTitle}</p>
          <button class="button button-dark start-sect-test" data-test="${test.id}">Start test →</button>
        </article>`;
    }).join('');

    $('sectional-grid').querySelectorAll('.start-sect-test').forEach(btn => {
      btn.addEventListener('click', () => beginSectionalTest(currentSubject, btn.dataset.test));
    });
  }

  /* ── Chapter-Wise PYQ View & Cards ── */
  function renderChapterView() {
    const cfg = getChapterSubjectConfig(currentChapterSubject);
    $('chapter-banner').textContent = cfg.banner;
    $('ch-heading-eyebrow').textContent = cfg.eyebrow;
    $('ch-heading-title').textContent = `${cfg.shortTitle} Chapters`;

    const tests = cfg.getTests();
    const totalQ = tests.reduce((s, t) => s + (t.questions?.length || 0), 0);
    $('ch-heading-muted').textContent = `${totalQ} PYQ MCQs across ${tests.length} chapters · 30 min each`;

    const results = getResults(cfg.resultsKey);
    $('chapter-grid').innerHTML = tests.map((ch, idx) => {
      const chResults = results.filter(r => r.testId === ch.id);
      const attempts = chResults.length;
      const bestScore = attempts ? Math.max(...chResults.map(r => r.marks)) : null;
      const stateLabel = attempts ? `${attempts}x · Best ${Number.isInteger(bestScore) ? bestScore : bestScore.toFixed(1)}/100` : 'READY';
      return `
        <article class="mock-card chapter-card">
          <div class="mock-card-top">
            <span class="mock-number">${String(idx + 1).padStart(2, '0')}</span>
            <span class="mock-state">${escapeHtml(stateLabel)}</span>
          </div>
          <h3>${escapeHtml(ch.title)}</h3>
          <p class="ch-sub">${escapeHtml(ch.subtitle || '')}</p>
          <p class="ch-meta">${ch.questions.length} MCQs · 30 min · 100 Marks</p>
          <button class="button button-dark start-ch-test" data-test="${ch.id}">Start chapter test →</button>
        </article>`;
    }).join('');

    $('chapter-grid').querySelectorAll('.start-ch-test').forEach(btn => {
      btn.addEventListener('click', () => beginChapterTest(currentChapterSubject, btn.dataset.test));
    });
  }

  /* ── Resume Banner ── */
  function updateResumeBanner() {
    const active = loadSession();
    if (!active) {
      $('resume-banner').classList.add('hidden');
      return;
    }
    if (active.isSectional || active.isChapter) {
      const cfg = getActiveConfig(active);
      const test = cfg.getTests().find(t => t.id === active.testId);
      if (!test) { localStorage.removeItem(SESSION_KEY); $('resume-banner').classList.add('hidden'); return; }
      const totalQ = test.questions?.length || (active.isChapter ? 50 : 25);
      $('resume-copy').textContent = `${test.title} (${cfg.shortTitle}) · Question ${active.questionIndex + 1}/${totalQ}`;
    } else {
      const mock = MOCK_DATA.mocks.find(m => m.id === active.mockId);
      if (!mock) { localStorage.removeItem(SESSION_KEY); $('resume-banner').classList.add('hidden'); return; }
      $('resume-copy').textContent = `${mock.title} · Section ${active.sectionIndex + 1} (${MOCK_DATA.sections[active.sectionIndex]?.name})`;
    }
    $('resume-banner').classList.remove('hidden');
    $('resume-btn').onclick = () => resumeTest(active);
    $('discard-btn').onclick = () => {
      if (!confirm('Discard this in-progress test? Current answers will be lost.')) return;
      localStorage.removeItem(SESSION_KEY);
      updateResumeBanner();
    };
  }

  /* ── Begin Full Mock ── */
  function beginFullMock(mockId) {
    if (loadSession() && !confirm('Starting a new mock will discard the in-progress session. Continue?')) return;
    localStorage.removeItem(SESSION_KEY);
    session = {
      isSectional: false,
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

  /* ── Begin Sectional Test ── */
  function beginSectionalTest(subjectKey, testId) {
    if (loadSession() && !confirm('Starting a new test will discard the in-progress session. Continue?')) return;
    localStorage.removeItem(SESSION_KEY);
    session = {
      isSectional: true,
      isChapter: false,
      subjectKey,
      testId,
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

  /* ── Begin Chapter-Wise PYQ Test (50 Qs · 30 min) ── */
  function beginChapterTest(subjectKey, testId) {
    if (loadSession() && !confirm('Starting a new chapter test will discard the in-progress session. Continue?')) return;
    localStorage.removeItem(SESSION_KEY);
    session = {
      isSectional: false,
      isChapter: true,
      subjectKey,
      testId,
      questionIndex: 0,
      answers: {},
      flags: {},
      sectionStartedAt: Date.now(),
      deadlineAt: Date.now() + CHAPTER_SECONDS * 1000,
      startedAt: Date.now()
    };
    saveSession();
    startTimer();
    renderExam();
    setView('exam-view');
  }

  /* ── Resume Test ── */
  function resumeTest(saved) {
    session = saved;
    const remaining = Math.ceil((session.deadlineAt - Date.now()) / 1000);
    if (remaining <= 0) {
      setView('exam-view');
      if (session.isSectional || session.isChapter) finishSingleStageTest(true);
      else submitFullSection(true);
      return;
    }
    startTimer();
    renderExam();
    setView('exam-view');
  }

  /* ── Helper accessors ── */
  function getCurrentTestObj() {
    if (session.isSectional || session.isChapter) {
      const cfg = getActiveConfig(session);
      return cfg.getTests().find(t => t.id === session.testId);
    }
    return MOCK_DATA.mocks.find(m => m.id === session.mockId);
  }

  function getCurrentQuestions() {
    if (session.isSectional || session.isChapter) {
      return getCurrentTestObj()?.questions || [];
    }
    return getCurrentTestObj()?.sections[session.sectionIndex]?.questions || [];
  }

  function answerKey(q) { return q.id; }

  /* ── Timer ── */
  function startTimer() {
    clearInterval(timerId);
    timerId = setInterval(() => {
      if (!session) return;
      const remaining = Math.ceil((session.deadlineAt - Date.now()) / 1000);
      if (remaining <= 0) {
        clearInterval(timerId);
        if (session.isSectional || session.isChapter) finishSingleStageTest(true);
        else submitFullSection(true);
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

  /* ── Exam View ── */
  function renderExam() {
    if (!session) return;
    const questions = getCurrentQuestions();
    if (!questions.length) return;

    if (session.isChapter) {
      const test = getCurrentTestObj();
      const cfg = getChapterSubjectConfig(session.subjectKey);
      $('paper-label').textContent = `${test.title} · Chapter PYQ Test`;
      $('section-title').textContent = cfg.shortTitle;
      $('section-subtitle').textContent = `30:00 test clock · ${questions.length} PYQ MCQs · +2 correct · −0.50 incorrect · Max ${questions.length * 2} Marks`;
      $('stage-track').classList.add('hidden');
      $('submit-section-btn').innerHTML = 'Submit chapter test <span aria-hidden="true">→</span>';
    } else if (session.isSectional) {
      const test = getCurrentTestObj();
      const cfg = getSubjectConfig(session.subjectKey);
      $('paper-label').textContent = `${test.title} · Sectional Drill`;
      $('section-title').textContent = cfg.shortTitle;
      $('section-subtitle').textContent = '15:00 test clock · 25 questions · +2 correct · −0.50 incorrect · 0 unattempted';
      $('stage-track').classList.add('hidden');
      $('submit-section-btn').innerHTML = 'Submit test <span aria-hidden="true">→</span>';
    } else {
      const mock = getCurrentTestObj();
      const section = mock.sections[session.sectionIndex];
      $('paper-label').textContent = `${mock.title} · Section ${session.sectionIndex + 1} of 4`;
      $('section-title').textContent = section.name;
      $('section-subtitle').textContent = '15:00 for this section · +2 correct · −0.50 incorrect · 0 unattempted';
      $('stage-track').classList.remove('hidden');
      $('stage-track').innerHTML = MOCK_DATA.sections.map((item, index) => {
        const stateClass = index < session.sectionIndex ? 'complete' : index === session.sectionIndex ? 'active' : '';
        return `<div class="stage-step ${stateClass}">${String(index + 1).padStart(2, '0')} · ${escapeHtml(item.name)}</div>`;
      }).join('');
      const isLast = session.sectionIndex === MOCK_DATA.sections.length - 1;
      $('submit-section-btn').innerHTML = isLast ? 'Submit exam <span aria-hidden="true">→</span>' : 'Submit section <span aria-hidden="true">→</span>';
    }

    renderQuestionNav();
    renderQuestion();
    updateTimer(Math.max(0, Math.ceil((session.deadlineAt - Date.now()) / 1000)));
    saveSession();
  }

  function renderQuestionNav() {
    const questions = getCurrentQuestions();
    const answered = questions.filter(q => session.answers[answerKey(q)] !== undefined).length;
    $('answered-count').textContent = `${answered}/${questions.length} answered`;
    $('question-nav').innerHTML = questions.map((q, i) => {
      const classes = [i === session.questionIndex ? 'current' : ''];
      if (session.answers[answerKey(q)] !== undefined) classes.push('answered');
      if (session.flags[answerKey(q)]) classes.push('flagged');
      return `<button type="button" class="${classes.filter(Boolean).join(' ')}" data-question="${i}" aria-label="Question ${i + 1}">${i + 1}</button>`;
    }).join('');

    $('question-nav').querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        session.questionIndex = Number(btn.dataset.question);
        renderQuestionNav();
        renderQuestion();
      });
    });
  }

  function renderQuestion() {
    const questions = getCurrentQuestions();
    const q = questions[session.questionIndex];
    if (!q) return;
    const selected = session.answers[answerKey(q)];

    const titlePrefix = (session.isSectional || session.isChapter) ? getActiveConfig(session).shortTitle : MOCK_DATA.sections[session.sectionIndex].name;
    $('question-counter').textContent = `${titlePrefix} · Question ${session.questionIndex + 1} of ${questions.length}`;
    $('question-text').textContent = q.question;

    $('flag-btn').classList.toggle('active', Boolean(session.flags[answerKey(q)]));
    $('flag-btn').textContent = session.flags[answerKey(q)] ? '★ Marked for review' : '☆ Mark for review';

    $('options-list').innerHTML = q.options.map((opt, i) => `
      <label class="option-label ${selected === i ? 'selected' : ''}">
        <input type="radio" name="answer" value="${i}" ${selected === i ? 'checked' : ''}>
        <span class="option-letter">${String.fromCharCode(65 + i)}.</span>
        <span>${escapeHtml(opt)}</span>
      </label>
    `).join('');

    $('options-list').querySelectorAll('input').forEach(inp => {
      inp.addEventListener('change', () => {
        session.answers[answerKey(q)] = Number(inp.value);
        saveSession();
        renderQuestionNav();
        renderQuestion();
      });
    });

    $('previous-btn').disabled = session.questionIndex === 0;
    $('next-btn').disabled = session.questionIndex === questions.length - 1;

    $('flag-btn').onclick = () => {
      session.flags[answerKey(q)] = !session.flags[answerKey(q)];
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
      if (session.questionIndex < questions.length - 1) {
        session.questionIndex++;
        renderQuestionNav();
        renderQuestion();
      }
    };

    $('submit-section-btn').onclick = () => {
      if (session.isSectional || session.isChapter) finishSingleStageTest(false);
      else submitFullSection(false);
    };
  }

  /* ── Full Mock: Submit Section ── */
  function calculateSectionScore(section) {
    let correct = 0, incorrect = 0, unanswered = 0;
    for (const q of section.questions) {
      const sel = session.answers[answerKey(q)];
      if (sel === undefined) unanswered++;
      else if (sel === q.answer) correct++;
      else incorrect++;
    }
    return { correct, incorrect, unanswered, marks: correct * 2 - incorrect * 0.5 };
  }

  function submitFullSection(autoSubmitted) {
    if (!session) return;
    const mock = getCurrentTestObj();
    const section = mock.sections[session.sectionIndex];
    if (!autoSubmitted && !confirm('Submit this section and proceed? You cannot return to this section after submission.')) return;

    clearInterval(timerId);
    const score = calculateSectionScore(section);
    session.sectionResults = session.sectionResults || [];
    const timeTaken = Math.min(SECTION_SECONDS, Math.max(1, Math.round((Date.now() - session.sectionStartedAt) / 1000)));
    session.sectionResults[session.sectionIndex] = { ...score, timeTaken, autoSubmitted };
    session.sectionIndex++;
    session.questionIndex = 0;

    if (session.sectionIndex >= MOCK_DATA.sections.length) {
      finishFullMock();
      return;
    }

    session.deadlineAt = Date.now() + SECTION_SECONDS * 1000;
    session.sectionStartedAt = Date.now();
    saveSession();
    startTimer();
    renderExam();
    $('section-subtitle').textContent = autoSubmitted
      ? 'Previous section time ended and auto-submitted. The next 15-minute section is now open.'
      : 'Section submitted. The next 15-minute section is now open.';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* ── Finish Full Mock ── */
  function finishFullMock() {
    clearInterval(timerId);
    const mock = getCurrentTestObj();
    const review = mock.sections.flatMap(section => section.questions.map(q => {
      const sel = session.answers[answerKey(q)];
      const isCorrect = sel === q.answer;
      return {
        id: q.id,
        section: section.name,
        topic: q.topic,
        question: q.question,
        options: q.options,
        answer: q.answer,
        selected: sel === undefined ? -1 : sel,
        correct: isCorrect,
        skipped: sel === undefined,
        flagged: Boolean(session.flags[answerKey(q)]),
        explanation: q.explanation,
        shortcut: q.shortcut
      };
    }));

    const sectionResults = mock.sections.map((sec, idx) => session.sectionResults?.[idx] || calculateSectionScore(sec));
    const correct = sectionResults.reduce((s, r) => s + r.correct, 0);
    const incorrect = sectionResults.reduce((s, r) => s + r.incorrect, 0);
    const unanswered = sectionResults.reduce((s, r) => s + r.unanswered, 0);
    const marks = sectionResults.reduce((s, r) => s + r.marks, 0);

    const record = {
      id: `ssc-full-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
      mockId: mock.id,
      mockTitle: mock.title,
      date: new Date().toISOString(),
      isSectional: false,
      total: 100,
      correct,
      incorrect,
      unanswered,
      marks,
      percentage: Math.round((marks / 200) * 1000) / 10,
      sections: sectionResults,
      questionResults: review
    };

    const history = getResults('ssc_chsl_mock_results_v1');
    history.unshift(record);
    localStorage.setItem('ssc_chsl_mock_results_v1', JSON.stringify(history.slice(0, 50)));

    /* Save to MockPrep platform results */
    const topicScores = {};
    const sharedQR = review.map(item => {
      topicScores[item.section] = topicScores[item.section] || { correct: 0, total: 0 };
      topicScores[item.section].total++;
      if (item.correct) topicScores[item.section].correct++;
      return {
        id: item.id,
        question: item.question,
        code: null,
        options: item.options,
        correctAnswer: item.answer,
        userAnswer: item.selected,
        isCorrect: item.correct,
        explanation: `${item.explanation} Shortcut: ${item.shortcut}`,
        topic: item.section
      };
    });

    try {
      const appHistory = JSON.parse(localStorage.getItem('mockprep_results') || '[]');
      appHistory.unshift({
        ...record,
        company: 'SSC CHSL',
        section: `${record.mockTitle} (Full Exam)`,
        totalTime: 60 * 60,
        totalMarks: marks,
        maxMarks: 200,
        topicScores,
        questionResults: sharedQR
      });
      localStorage.setItem('mockprep_results', JSON.stringify(appHistory.slice(0, 50)));
    } catch (e) {
      console.error('Could not save to MockPrep history:', e);
    }

    localStorage.removeItem(SESSION_KEY);
    session = null;
    renderResultView(record);
    setView('result-view');
  }

  /* ── Finish Single-Stage Test (Sectional 25Q/15m OR Chapter 50Q/30m) ── */
  function finishSingleStageTest(autoSubmitted) {
    if (!session) return;
    const isChapter = Boolean(session.isChapter);
    if (!autoSubmitted && !confirm(`Submit this ${isChapter ? 'chapter' : 'sectional'} test? You cannot change answers after submission.`)) return;

    clearInterval(timerId);
    const test = getCurrentTestObj();
    const cfg = getActiveConfig(session);
    const questions = test.questions;
    const totalDuration = isChapter ? CHAPTER_SECONDS : SECTION_SECONDS;

    let correct = 0, incorrect = 0, unanswered = 0;
    const review = questions.map(q => {
      const sel = session.answers[answerKey(q)];
      const isCorrect = sel === q.answer;
      const skipped = sel === undefined;
      if (skipped) unanswered++;
      else if (isCorrect) correct++;
      else incorrect++;

      return {
        id: q.id,
        section: cfg.shortTitle,
        topic: q.topic,
        question: q.question,
        options: q.options,
        answer: q.answer,
        selected: sel === undefined ? -1 : sel,
        correct: isCorrect,
        skipped,
        flagged: Boolean(session.flags[answerKey(q)]),
        explanation: q.explanation,
        shortcut: q.shortcut
      };
    });

    const total = questions.length;
    const maxMarks = total * 2;
    const marks = correct * 2 - incorrect * 0.5;
    const timeTaken = Math.min(totalDuration, Math.max(1, Math.round((Date.now() - session.startedAt) / 1000)));

    const record = {
      id: `ssc-${isChapter ? 'ch' : 'sect'}-${session.subjectKey}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
      testId: test.id,
      testTitle: test.title,
      subjectKey: session.subjectKey,
      subjectTitle: cfg.shortTitle,
      date: new Date().toISOString(),
      isSectional: !isChapter,
      isChapter,
      total,
      maxMarks,
      correct,
      incorrect,
      unanswered,
      marks,
      timeTaken,
      autoSubmitted,
      percentage: Math.round((marks / maxMarks) * 1000) / 10,
      questionResults: review
    };

    const history = getResults(cfg.resultsKey);
    history.unshift(record);
    localStorage.setItem(cfg.resultsKey, JSON.stringify(history.slice(0, 150)));

    /* Save to MockPrep platform results */
    const topicScores = {};
    const sharedQR = review.map(item => {
      topicScores[item.topic] = topicScores[item.topic] || { correct: 0, total: 0 };
      topicScores[item.topic].total++;
      if (item.correct) topicScores[item.topic].correct++;
      return {
        id: item.id,
        question: item.question,
        code: null,
        options: item.options,
        correctAnswer: item.answer,
        userAnswer: item.selected,
        isCorrect: item.correct,
        explanation: `${item.explanation} Shortcut: ${item.shortcut}`,
        topic: item.topic
      };
    });

    try {
      const appHistory = JSON.parse(localStorage.getItem('mockprep_results') || '[]');
      appHistory.unshift({
        ...record,
        company: 'SSC CHSL',
        section: `${record.testTitle} — ${cfg.shortTitle} (${isChapter ? 'Chapter PYQ' : 'Sectional'})`,
        totalTime: totalDuration,
        totalMarks: marks,
        maxMarks,
        topicScores,
        questionResults: sharedQR
      });
      localStorage.setItem('mockprep_results', JSON.stringify(appHistory.slice(0, 50)));
    } catch (e) {
      console.error('Could not save to MockPrep history:', e);
    }

    localStorage.removeItem(SESSION_KEY);
    session = null;
    renderResultView(record);
    setView('result-view');
  }

  /* ── Render Result View ── */
  function renderResultView(record) {
    const isSingle = Boolean(record.isSectional || record.isChapter);
    const maxMarks = record.maxMarks || (record.isChapter ? 100 : record.isSectional ? 50 : 200);
    $('result-eyebrow').textContent = record.isChapter ? 'Chapter PYQ drill complete' : record.isSectional ? 'Sectional drill complete' : 'Full mock complete';
    $('result-title').textContent = `${isSingle ? record.testTitle : record.mockTitle} Complete`;
    $('result-subtitle').textContent = `${record.correct} correct · ${record.incorrect} incorrect · ${record.unanswered} unattempted · +2 / −0.50 scoring`;
    $('result-marks').textContent = Number.isInteger(record.marks) ? record.marks : record.marks.toFixed(1);
    $('result-total-label').textContent = `out of ${maxMarks}`;

    if (isSingle) {
      /* Topic breakdown cards */
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
        return `
          <article class="section-result-card">
            <span>${escapeHtml(topic)}</span>
            <strong>${Number.isInteger(m) ? m : m.toFixed(1)} / ${r.total * 2}</strong>
            <small>${r.correct}/${r.total} correct · ${r.incorrect} wrong · ${r.unanswered} skipped</small>
          </article>`;
      }).join('');

      /* Filter options */
      $('review-filter').innerHTML = `
        <option value="all">All questions (${record.total})</option>
        <option value="incorrect">Incorrect</option>
        <option value="skipped">Skipped</option>
        <option value="flagged">Marked for review</option>
        ${Object.keys(topicMap).map(t => `<option value="${escapeHtml(t)}">${escapeHtml(t)}</option>`).join('')}
      `;
    } else {
      /* Full mock: 4 sections */
      $('section-results').innerHTML = record.sections.map((result, index) => `
        <article class="section-result-card">
          <span>${escapeHtml(MOCK_DATA.sections[index].name)}</span>
          <strong>${Number.isInteger(result.marks) ? result.marks : result.marks.toFixed(1)} / 50</strong>
          <small>${result.correct}/25 correct · ${result.incorrect} wrong · ${result.unanswered} skipped</small>
        </article>
      `).join('');

      $('review-filter').innerHTML = `
        <option value="all">All questions (100)</option>
        <option value="incorrect">Incorrect</option>
        <option value="skipped">Skipped</option>
        <option value="flagged">Marked for review</option>
        ${MOCK_DATA.sections.map(s => `<option value="${escapeHtml(s.name)}">${escapeHtml(s.name)}</option>`).join('')}
      `;
    }

    currentFilter = 'all';
    $('review-filter').value = 'all';
    $('review-filter').onchange = () => {
      currentFilter = $('review-filter').value;
      renderReviewList(record);
    };

    renderReviewList(record);

    $('back-tests-btn').onclick = () => {
      if (record.isChapter) {
        currentChapterSubject = record.subjectKey;
        switchMode('chapter');
      } else if (record.isSectional) {
        currentSubject = record.subjectKey;
        switchMode('sectional');
      } else {
        switchMode('full');
      }
      setView('selection-view');
    };
  }

  /* ── Render Review Cards ── */
  function renderReviewList(record) {
    const isSingle = Boolean(record.isSectional || record.isChapter);
    const items = record.questionResults.filter(item => {
      if (currentFilter === 'all') return true;
      if (currentFilter === 'incorrect') return !item.correct && !item.skipped;
      if (currentFilter === 'skipped') return item.skipped;
      if (currentFilter === 'flagged') return item.flagged;
      if (isSingle) return item.topic === currentFilter;
      return item.section === currentFilter;
    });

    if (!items.length) {
      $('review-list').innerHTML = '<div class="empty-state" style="padding: 30px; text-align: center; color: var(--muted); border: 1px dashed var(--line); border-radius: 8px;">No questions match this filter.</div>';
      return;
    }

    $('review-list').innerHTML = items.map(item => {
      const chosen = item.selected < 0 ? 'Not answered' : `${String.fromCharCode(65 + item.selected)}. ${item.options[item.selected]}`;
      const correctChoice = `${String.fromCharCode(65 + item.answer)}. ${item.options[item.answer]}`;
      const tagText = isSingle ? item.topic : `${item.section} · ${item.topic}`;

      return `
        <article class="review-card">
          <div class="review-top">
            <span>${escapeHtml(tagText)}</span>
            <span>${item.skipped ? 'Skipped' : item.correct ? 'Correct · +2' : 'Incorrect · −0.50'}${item.flagged ? ' · Marked for review' : ''}</span>
          </div>
          <div class="review-question">${escapeHtml(item.question)}</div>
          <div class="review-options">
            ${item.options.map((opt, idx) => `
              <div class="review-option ${idx === item.answer ? 'correct' : idx === item.selected && !item.correct ? 'wrong' : ''}">
                ${String.fromCharCode(65 + idx)}. ${escapeHtml(opt)}
                ${idx === item.answer ? ' · Correct answer' : idx === item.selected ? ' · Your choice' : ''}
              </div>
            `).join('')}
          </div>
          <div class="review-note">
            <strong>Your answer:</strong> ${escapeHtml(chosen)}<br>
            <strong>Correct:</strong> ${escapeHtml(correctChoice)}<br>
            <strong>Why:</strong> ${escapeHtml(item.explanation)}<br>
            <strong>Shortcut / rule:</strong> ${escapeHtml(item.shortcut)}
          </div>
        </article>`;
    }).join('');
  }

  /* ── Init Page ── */
  function onPageLoad() {
    $('exam-view').querySelector('.timer-block').id = 'timer-block';

    // Mode Buttons
    $('btn-mode-full').addEventListener('click', () => switchMode('full'));
    $('btn-mode-sectional').addEventListener('click', () => switchMode('sectional'));
    $('btn-mode-chapter').addEventListener('click', () => switchMode('chapter'));

    // Sectional Subject Tabs
    document.querySelectorAll('.sect-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.sect-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentSubject = tab.dataset.subject;
        renderSectionalView();
      });
    });

    // Chapter Subject Tabs
    document.querySelectorAll('.ch-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.ch-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentChapterSubject = tab.dataset.subject;
        renderChapterView();
      });
    });

    // Check for in-progress session
    const existing = loadSession();
    if (existing) {
      if (existing.isChapter) {
        currentChapterSubject = existing.subjectKey || 'gs';
        switchMode('chapter');
      } else if (existing.isSectional) {
        currentSubject = existing.subjectKey || 'gs';
        switchMode('sectional');
      } else {
        switchMode('full');
      }
      const rem = Math.ceil((existing.deadlineAt - Date.now()) / 1000);
      if (rem <= 0) resumeTest(existing);
    } else {
      switchMode('full');
    }
  }

  document.addEventListener('visibilitychange', () => { if (session) saveSession(); });
  window.addEventListener('beforeunload', () => { if (session) saveSession(); });
  document.addEventListener('DOMContentLoaded', onPageLoad);
})();
