const motionTasks = [
  { prompt: 'Move the marker from Start to Goal. Avoid blocked cells and finish in 6 moves or fewer.', start: 12, goal: 3, blocked: [8, 6], limit: 6 },
  { prompt: 'Plan a route from Start to Goal without entering blocked cells. Use 6 moves or fewer.', start: 0, goal: 15, blocked: [1, 5, 10], limit: 6 },
  { prompt: 'Guide the marker to Goal. Blocked cells cannot be crossed; use at most 6 moves.', start: 3, goal: 12, blocked: [6, 9], limit: 6 },
  { prompt: 'Find a valid route from Start to Goal while avoiding blocked cells. Use 6 moves or fewer.', start: 15, goal: 0, blocked: [11, 9, 5], limit: 6 }
];

const gridTasks = [
  { prompt: 'Watch the highlighted cells, then repeat the same sequence in order.', sequence: [0, 4, 8] },
  { prompt: 'Memorize the highlighted sequence and select those cells in the same order.', sequence: [2, 1, 5, 8] },
  { prompt: 'Watch carefully. Reproduce the highlighted cell sequence in order.', sequence: [6, 3, 4, 1] },
  { prompt: 'Remember each highlighted location and repeat the full sequence in order.', sequence: [8, 4, 0, 2, 6] }
];

const behaviouralItems = [
  { prompt: 'When a team decision is needed, I usually:', left: 'Prefer to decide independently', right: 'Invite the team to shape the decision' },
  { prompt: 'When priorities change unexpectedly, I tend to:', left: 'Prefer a clear fixed plan', right: 'Adapt and reorganize quickly' },
  { prompt: 'When I find a mistake in my work, I usually:', left: 'Wait until I am asked about it', right: 'Raise it early and propose a correction' },
  { prompt: 'When starting an unfamiliar task, I prefer to:', left: 'Begin with the first workable idea', right: 'Compare options and plan my approach' },
  { prompt: 'During a disagreement, I tend to:', left: 'State my view directly', right: 'First understand the other perspective' },
  { prompt: 'When receiving feedback, I usually:', left: 'Focus first on what went wrong', right: 'Look for one change I can apply next' }
];

const logicalItems = window.COMPANY_DATA.capgemini.questionBank.cognitive_assessment;
const questions = [
  ...motionTasks.map((task, index) => ({ id: `cg_motion_${index + 1}`, section: 'Motion Challenge', type: 'motion', ...task })),
  ...gridTasks.map((task, index) => ({ id: `cg_grid_${index + 1}`, section: 'Grid Challenge', type: 'grid', ...task })),
  ...logicalItems.map(question => ({ ...question, section: 'Logical Reasoning', type: 'logic' })),
  ...behaviouralItems.map((item, index) => ({ id: `cg_behaviour_${index + 1}`, section: 'Behavioural Module', type: 'behaviour', ...item }))
];

const state = {
  index: 0,
  answers: {},
  remaining: 25 * 60,
  timer: null,
  previewTimer: null,
  motionProgress: {},
  gridProgress: {},
  submitted: false
};
const isFullMock = new URLSearchParams(window.location.search).get('mode') === 'fullmock';
const $ = id => document.getElementById(id);

function init() {
  $('start-btn').onclick = start;
  $('next-btn').onclick = () => move(1);
  $('prev-btn').onclick = () => move(-1);
  $('end-btn').onclick = () => finish(true);
}

function start() {
  $('start-view').classList.add('hidden');
  $('test-view').classList.remove('hidden');
  renderNav();
  renderQuestion();
  updateTimer();
  state.timer = setInterval(() => {
    state.remaining = Math.max(0, state.remaining - 1);
    updateTimer();
    if (state.remaining === 0) finish(false);
  }, 1000);
}

function updateTimer() {
  const minutes = Math.floor(state.remaining / 60);
  const seconds = state.remaining % 60;
  $('timer').textContent = `${minutes}:${String(seconds).padStart(2, '0')}`;
}

function stopPreview() {
  clearInterval(state.previewTimer);
  state.previewTimer = null;
}

function renderNav() {
  const sections = [...new Set(questions.map(question => question.section))];
  $('question-nav').innerHTML = sections.map(section => `
    <div class="cog-module-label">${section}</div>
    <div class="cog-nav">${questions.map((question, index) => question.section === section
      ? `<button class="${index === state.index ? 'current ' : ''}${state.answers[index] !== undefined ? 'done' : ''}" data-index="${index}">${index + 1}</button>`
      : '').join('')}</div>
  `).join('');
  $('question-nav').querySelectorAll('button').forEach(button => {
    button.onclick = () => {
      stopPreview();
      state.index = Number(button.dataset.index);
      renderNav();
      renderQuestion();
    };
  });
  const completed = Object.keys(state.answers).length;
  $('progress-label').textContent = `${state.index + 1} of ${questions.length} • ${completed} completed`;
  $('progress-fill').style.width = `${completed / questions.length * 100}%`;
}

function renderQuestion() {
  const question = questions[state.index];
  stopPreview();
  $('meta').textContent = `Question ${state.index + 1} of ${questions.length} • ${question.section}`;
  $('module-label').textContent = question.section;
  $('question').textContent = question.prompt;
  $('feedback').textContent = '';
  $('activity').innerHTML = '';

  if (question.type === 'motion') renderMotion(question);
  else if (question.type === 'grid') renderGrid(question);
  else if (question.type === 'logic') renderLogic(question);
  else renderBehaviour(question);

  $('prev-btn').disabled = state.index === 0;
  $('next-btn').textContent = state.index === questions.length - 1 ? 'Submit →' : 'Next →';
}

function renderMotion(question) {
  const progress = state.motionProgress[state.index] || { position: question.start, moves: [] };
  state.motionProgress[state.index] = progress;
  $('activity').innerHTML = `
    <div class="cog-muted" style="text-align:center">Start = green • Goal = blue • Blocked = red</div>
    <div class="cog-motion-grid" id="motion-grid"></div>
    <div class="cog-motion-controls" aria-label="Move marker">
      <button class="btn btn-secondary" data-move="up" aria-label="Move up">↑</button>
      <button class="btn btn-secondary" data-move="left" aria-label="Move left">←</button>
      <button class="btn btn-secondary" data-move="down" aria-label="Move down">↓</button>
      <button class="btn btn-secondary" data-move="right" aria-label="Move right">→</button>
      <button class="btn btn-ghost" id="motion-reset">Reset</button>
    </div>
    <div id="motion-count" class="cog-muted" style="text-align:center;margin-top:10px"></div>
  `;
  drawMotionGrid(question, progress);
  $('motion-count').textContent = `${progress.moves.length} / ${question.limit} moves`;
  $('activity').querySelectorAll('[data-move]').forEach(button => {
    button.onclick = () => moveMarker(question, button.dataset.move);
  });
  $('motion-reset').onclick = () => {
    state.motionProgress[state.index] = { position: question.start, moves: [] };
    delete state.answers[state.index];
    renderNav();
    renderMotion(question);
  };
}

function drawMotionGrid(question, progress) {
  const grid = $('motion-grid');
  grid.innerHTML = Array.from({ length: 16 }, (_, cell) => {
    const classes = ['cog-cell'];
    if (cell === question.start) classes.push('start');
    if (cell === question.goal) classes.push('goal');
    if (question.blocked.includes(cell)) classes.push('blocked');
    if (cell === progress.position) classes.push('current');
    const label = question.blocked.includes(cell) ? '×' : cell === progress.position ? '●' : cell === question.start ? 'S' : cell === question.goal ? 'G' : '';
    return `<div class="${classes.join(' ')}" aria-label="Grid cell ${cell + 1}">${label}</div>`;
  }).join('');
}

function moveMarker(question, direction) {
  const progress = state.motionProgress[state.index];
  if (progress.moves.length >= question.limit || state.answers[state.index]?.correct) return;
  const row = Math.floor(progress.position / 4);
  const column = progress.position % 4;
  const offsets = { up: [-1, 0], down: [1, 0], left: [0, -1], right: [0, 1] };
  const [rowOffset, columnOffset] = offsets[direction];
  const nextRow = row + rowOffset;
  const nextColumn = column + columnOffset;
  if (nextRow < 0 || nextRow > 3 || nextColumn < 0 || nextColumn > 3) {
    $('feedback').textContent = 'That move leaves the grid. Try another direction.';
    return;
  }
  const nextPosition = nextRow * 4 + nextColumn;
  if (question.blocked.includes(nextPosition)) {
    $('feedback').textContent = 'Blocked cell. Choose another route.';
    return;
  }
  progress.position = nextPosition;
  progress.moves.push(direction);
  drawMotionGrid(question, progress);
  $('motion-count').textContent = `${progress.moves.length} / ${question.limit} moves`;
  if (nextPosition === question.goal) {
    state.answers[state.index] = { correct: progress.moves.length <= question.limit, moves: [...progress.moves] };
    $('feedback').textContent = `Goal reached in ${progress.moves.length} moves.`;
    renderNav();
  } else if (progress.moves.length === question.limit) {
    state.answers[state.index] = { correct: false, moves: [...progress.moves] };
    $('feedback').textContent = 'Move limit reached. Reset to try again, or continue.';
    renderNav();
  } else {
    $('feedback').textContent = '';
  }
}

function renderGrid(question) {
  state.gridProgress[state.index] = [];
  const selected = state.answers[state.index]?.selected || [];
  $('activity').innerHTML = `
    <div class="cog-memory-grid" id="memory-grid"></div>
    <div class="cog-motion-controls"><button id="grid-reset" class="btn btn-ghost hidden">Replay pattern</button></div>
  `;
  const grid = $('memory-grid');
  grid.style.gridTemplateColumns = 'repeat(3, minmax(58px, 76px))';
  grid.innerHTML = Array.from({ length: 9 }, (_, index) => `<button class="cog-cell" data-cell="${index}" disabled></button>`).join('');
  $('grid-reset').onclick = () => {
    delete state.answers[state.index];
    renderNav();
    renderGrid(question);
  };
  if (state.answers[state.index]) {
    $('feedback').textContent = state.answers[state.index].correct ? 'Sequence completed correctly.' : 'Sequence saved. Review the expected sequence after submission.';
    $('grid-reset').classList.remove('hidden');
    grid.querySelectorAll('button').forEach(button => { button.disabled = true; });
    return;
  }
  const cells = [...grid.querySelectorAll('button')];
  let previewIndex = 0;
  $('feedback').textContent = 'Watch the pattern...';
  state.previewTimer = setInterval(() => {
    cells.forEach(cell => cell.classList.remove('flash'));
    if (previewIndex >= question.sequence.length) {
      stopPreview();
      cells.forEach(cell => { cell.disabled = false; });
      $('feedback').textContent = 'Repeat the highlighted cells in order.';
      return;
    }
    cells[question.sequence[previewIndex]].classList.add('flash');
    previewIndex++;
  }, 650);
  cells.forEach(button => {
    button.onclick = () => selectMemoryCell(question, Number(button.dataset.cell), cells);
  });
}

function selectMemoryCell(question, cell, cells) {
  const selected = state.gridProgress[state.index];
  selected.push(cell);
  const button = cells[cell];
  button.disabled = true;
  button.textContent = String(selected.length);
  button.classList.add('current');
  const correctSoFar = selected.every((value, index) => value === question.sequence[index]);
  if (!correctSoFar || selected.length === question.sequence.length) {
    const correct = correctSoFar && selected.length === question.sequence.length;
    state.answers[state.index] = { correct, selected: [...selected] };
    cells.forEach(cellButton => { cellButton.disabled = true; });
    $('feedback').textContent = correct ? 'Correct sequence.' : 'That sequence does not match. You can replay the pattern.';
    $('grid-reset').classList.remove('hidden');
    renderNav();
  }
}

function renderLogic(question) {
  $('activity').innerHTML = `<div class="cog-options">${question.options.map((option, index) => `
    <label class="cog-option ${state.answers[state.index] === index ? 'selected' : ''}">
      <input type="radio" name="logic-answer" value="${index}" ${state.answers[state.index] === index ? 'checked' : ''}>
      <span>${option}</span>
    </label>
  `).join('')}</div>`;
  $('activity').querySelectorAll('input').forEach(input => {
    input.onchange = () => {
      state.answers[state.index] = Number(input.value);
      renderNav();
      renderLogic(question);
    };
  });
}

function renderBehaviour(question) {
  const value = state.answers[state.index];
  const selectedValue = value === undefined ? 3 : value;
  const labels = ['Mostly left', 'Slightly left', 'Neutral', 'Slightly right', 'Mostly right'];
  $('activity').innerHTML = `
    <div class="cog-range"><span>${question.left}</span><strong>↔</strong><span style="text-align:right">${question.right}</span>
      <input id="behaviour-range" type="range" min="1" max="5" step="1" value="${selectedValue}" aria-label="Choose which statement describes you more">
      <span class="cog-range-value" id="behaviour-value" style="grid-column:1/-1">${value === undefined ? 'Choose a response' : labels[value - 1]}</span>
    </div>
    <p class="cog-muted">There are no correct or incorrect responses in this module.</p>
  `;
  $('behaviour-range').oninput = event => {
    state.answers[state.index] = Number(event.target.value);
    $('behaviour-value').textContent = labels[state.answers[state.index] - 1];
    renderNav();
  };
}

function move(direction) {
  stopPreview();
  const nextIndex = state.index + direction;
  if (nextIndex < 0) return;
  if (nextIndex >= questions.length) {
    finish(false);
    return;
  }
  state.index = nextIndex;
  renderNav();
  renderQuestion();
}

function finish(askConfirmation) {
  if (state.submitted) return;
  if (askConfirmation && !confirm('Submit this cognitive assessment now?')) return;
  state.submitted = true;
  clearInterval(state.timer);
  stopPreview();

  const objectiveQuestions = questions.filter(question => question.type !== 'behaviour');
  let correct = 0;
  let unanswered = 0;
  const topicScores = {};
  for (const question of objectiveQuestions) {
    const answer = state.answers[questions.indexOf(question)];
    const answered = answer !== undefined;
    const isCorrect = question.type === 'logic'
      ? answer === question.answer
      : Boolean(answer && answer.correct);
    if (!answered) unanswered++;
    if (isCorrect) correct++;
    const topic = question.section;
    topicScores[topic] = topicScores[topic] || { correct: 0, total: 0 };
    topicScores[topic].total++;
    if (isCorrect) topicScores[topic].correct++;
  }

  const questionResults = questions.map((question, index) => {
    const answer = state.answers[index];
    if (question.type === 'behaviour') {
      const labels = ['Mostly left', 'Slightly left', 'Neutral', 'Slightly right', 'Mostly right'];
      const response = answer === undefined ? 'Not answered' : answer === 3 ? 'Neutral' : `${labels[answer - 1]}: ${answer < 3 ? question.left : question.right}`;
      return {
        id: question.id,
        question: question.prompt,
        options: [],
        correctAnswer: -1,
        userAnswer: answer === undefined ? -1 : answer - 1,
        isCorrect: null,
        reviewStatus: 'reflection',
        explanation: `Your response: ${response}. This is a work-style reflection, not a scored right-or-wrong answer.`,
        topic: question.section
      };
    }

    const isLogic = question.type === 'logic';
    const isCorrect = isLogic ? answer === question.answer : Boolean(answer && answer.correct);
    let userAnswer = -1;
    let explanation;
    if (isLogic) {
      userAnswer = answer === undefined ? -1 : answer;
      explanation = question.explanation;
    } else if (question.type === 'motion') {
      userAnswer = answer?.correct ? 0 : answer ? 1 : -1;
      explanation = `Expected: reach cell ${question.goal + 1} from cell ${question.start + 1} within ${question.limit} moves, avoiding the blocked cells. Your moves: ${answer?.moves?.join(', ') || 'No completed route'}.`;
    } else {
      userAnswer = answer?.correct ? 0 : answer ? 1 : -1;
      explanation = `Expected sequence: ${question.sequence.map(cell => cell + 1).join(' → ')}. Your sequence: ${answer?.selected?.map(cell => cell + 1).join(' → ') || 'No response'}.`;
    }
    return {
      id: question.id,
      question: question.prompt,
      options: isLogic ? question.options : ['Completed correctly', 'Incorrect or incomplete'],
      correctAnswer: isLogic ? question.answer : 0,
      userAnswer,
      isCorrect,
      explanation,
      topic: question.section
    };
  });

  const percentage = Math.round(correct / objectiveQuestions.length * 100);
  const resultRecord = {
    id: `cg_cognitive_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`,
    company: 'Capgemini',
    section: 'Cognitive Assessment (Motion, Grid, Logical Reasoning, Behavioural)',
    date: new Date().toISOString(),
    total: objectiveQuestions.length,
    correct,
    incorrect: objectiveQuestions.length - correct - unanswered,
    unanswered,
    percentage,
    timeTaken: 25 * 60 - state.remaining,
    totalTime: 25 * 60,
    topicScores,
    questionResults,
    assessmentNote: 'Score covers Motion, Grid, and Logical Reasoning. Behavioural responses are saved for reflection and are not scored.'
  };

  if (isFullMock) {
    let session = {};
    try { session = JSON.parse(localStorage.getItem('mockprep_capgemini_fullmock')) || {}; } catch (error) {}
    session.stages = session.stages || {};
    session.stages.cognitive_assessment = resultRecord;
    localStorage.setItem('mockprep_capgemini_fullmock', JSON.stringify(session));
    window.location.href = 'test.html?company=capgemini&finalize=capgemini-fullmock';
    return;
  }

  try {
    const history = JSON.parse(localStorage.getItem('mockprep_results') || '[]');
    history.unshift(resultRecord);
    localStorage.setItem('mockprep_results', JSON.stringify(history.slice(0, 50)));
  } catch (error) {
    console.error('Could not save cognitive results:', error);
  }
  $('review-link').href = `results.html?id=${encodeURIComponent(resultRecord.id)}`;
  $('result-summary').textContent = `${correct} / ${objectiveQuestions.length} scored items correct (${percentage}%). Behavioural reflections are saved in the review but do not affect your score.`;
  $('test-view').classList.add('hidden');
  $('result-view').classList.remove('hidden');
}

document.addEventListener('DOMContentLoaded', init);
