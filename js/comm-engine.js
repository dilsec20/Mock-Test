// =====================================================
// MockPrep — Communication Speaking Engine
// Web Speech API: SpeechSynthesis + SpeechRecognition
// Parts: Reading, Repeat, Questions, Sentence Builds,
//        Story Retelling, Open Questions
// =====================================================

// ── State ──
const commState = {
  parts: [],           // Array of { type, items, label, letter, instructions, timePerItem }
  currentPartIndex: 0,
  currentItemIndex: 0,
  isRecording: false,
  recognition: null,
  synth: window.speechSynthesis,
  overallTimer: null,
  overallTimeRemaining: 20 * 60, // 20 minutes
  questionTimer: null,
  questionTimeRemaining: 0,
  results: {},         // { partType: { total, scored, items: [] } }
  sbSelectedWords: [],
  micGranted: false
};

// ── Check Browser Support ──
function checkSupport() {
  const hasSynth = 'speechSynthesis' in window;
  const hasRecog = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;

  if (!hasSynth || !hasRecog) {
    document.getElementById('setup-view').classList.add('hidden');
    document.getElementById('not-supported-view').classList.remove('hidden');
    return false;
  }
  return true;
}

// ── Initialize ──
document.addEventListener('DOMContentLoaded', () => {
  if (!checkSupport()) return;

  // Setup SpeechRecognition
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  commState.recognition = new SpeechRecognition();
  commState.recognition.continuous = true;
  commState.recognition.interimResults = true;
  commState.recognition.lang = 'en-US';

  commState.recognition.onresult = handleRecognitionResult;
  commState.recognition.onerror = handleRecognitionError;
  commState.recognition.onend = handleRecognitionEnd;

  // Request mic permission
  requestMicPermission();
});

// ── Mic Permission ──
async function requestMicPermission() {
  const statusEl = document.getElementById('mic-status');
  const startBtn = document.getElementById('start-test-btn');

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach(t => t.stop()); // Release immediately
    commState.micGranted = true;
    statusEl.className = 'mic-status granted';
    statusEl.textContent = '✅ Microphone ready';
    startBtn.disabled = false;
  } catch (e) {
    console.warn('Microphone check:', e);
    statusEl.className = 'mic-status pending';
    statusEl.innerHTML = '⚠️ Mic not active or blocked on local file — <span style="color:var(--text-primary); font-weight:600;">Practice Mode enabled</span> (Audio playback & Sentence Builds active)';
    startBtn.disabled = false;
    startBtn.textContent = '🚀 Start Speaking Practice';
    commState.micGranted = true; // allow practice mode
  }
}

// ── Start Test ──
function startTest() {
  if (!commState.micGranted) return;

  const data = window.COMPANY_DATA?.accenture;
  if (!data || !data.questionBank.communication_speaking) {
    alert('No speaking data found!');
    return;
  }

  const bank = data.questionBank.communication_speaking;

  // Build parts with shuffled & picked items
  commState.parts = [
    {
      type: 'reading', letter: 'A', label: 'Reading',
      instructions: 'Read the sentence aloud clearly at a moderate pace. Speak naturally.',
      items: shuffle([...bank.reading]).slice(0, 8),
      timePerItem: 30
    },
    {
      type: 'repeat', letter: 'B', label: 'Repeat',
      instructions: 'Listen to the sentence, then repeat it as accurately as possible.',
      items: shuffle([...bank.repeat]).slice(0, 16),
      timePerItem: 25
    },
    {
      type: 'questions', letter: 'C', label: 'Questions',
      instructions: 'Answer the question in 1–2 complete sentences. Speak clearly.',
      items: shuffle([...bank.questions]).slice(0, 24),
      timePerItem: 30
    },
    {
      type: 'sentenceBuilds', letter: 'D', label: 'Sentence Builds',
      instructions: 'Rearrange the jumbled words to form a correct sentence. Click words in order.',
      items: shuffle([...bank.sentenceBuilds]).slice(0, 10),
      timePerItem: 40
    },
    {
      type: 'stories', letter: 'E', label: 'Story Retelling',
      instructions: 'Read the story carefully. When ready, retell it in your own words.',
      items: shuffle([...bank.stories]).slice(0, 3),
      timePerItem: 90
    },
    {
      type: 'openQuestions', letter: 'F', label: 'Open Questions',
      instructions: 'Speak for 30–60 seconds. Structure your answer: introduction, main points, conclusion.',
      items: shuffle([...bank.openQuestions]).slice(0, 2),
      timePerItem: 60
    }
  ];

  // Init results
  commState.parts.forEach(p => {
    commState.results[p.type] = { total: p.items.length, scored: 0, items: [] };
  });

  // Switch views
  document.getElementById('setup-view').classList.add('hidden');
  document.getElementById('test-view').classList.remove('hidden');

  // Start overall timer
  startOverallTimer();

  // Render first item
  commState.currentPartIndex = 0;
  commState.currentItemIndex = 0;
  renderCurrentItem();
}

// ── Overall Timer ──
function startOverallTimer() {
  updateOverallTimerDisplay();
  commState.overallTimer = setInterval(() => {
    commState.overallTimeRemaining--;
    updateOverallTimerDisplay();
    if (commState.overallTimeRemaining <= 0) {
      clearInterval(commState.overallTimer);
      finishTest();
    }
  }, 1000);
}

function updateOverallTimerDisplay() {
  const m = Math.floor(commState.overallTimeRemaining / 60);
  const s = commState.overallTimeRemaining % 60;
  const el = document.getElementById('overall-timer-display');
  el.textContent = `${m}:${s.toString().padStart(2, '0')}`;
  if (commState.overallTimeRemaining < 60) el.style.color = '#ef4444';
  else if (commState.overallTimeRemaining < 180) el.style.color = '#f59e0b';
}

// ── Render Current Item ──
function renderCurrentItem() {
  const part = commState.parts[commState.currentPartIndex];
  if (!part) { finishTest(); return; }

  const item = part.items[commState.currentItemIndex];
  if (!item) {
    // Move to next part
    commState.currentPartIndex++;
    commState.currentItemIndex = 0;
    renderCurrentItem();
    return;
  }

  // Update part header
  document.getElementById('part-badge').textContent = `PART ${part.letter}`;
  document.getElementById('part-title').textContent = part.label;
  document.getElementById('part-instructions').textContent = part.instructions;

  // Update progress
  const totalInPart = part.items.length;
  const current = commState.currentItemIndex + 1;
  document.getElementById('progress-text').textContent = `${current} / ${totalInPart}`;
  document.getElementById('progress-fill').style.width = `${(current / totalInPart) * 100}%`;
  document.getElementById('card-number').textContent = `${part.letter}${current}`;

  // Reset common elements
  document.getElementById('recognized-text').className = 'recognized-text empty';
  document.getElementById('recognized-text').textContent = 'Your speech will appear here...';
  document.getElementById('accuracy-container').classList.add('hidden');
  document.getElementById('model-answer').classList.add('hidden');
  document.getElementById('hint-text').classList.add('hidden');
  document.getElementById('play-container').classList.add('hidden');
  document.getElementById('sb-area').classList.add('hidden');
  document.getElementById('recording-controls').classList.remove('hidden');

  // Reset mic
  stopRecording();

  // Part-specific rendering
  switch (part.type) {
    case 'reading':
      renderReading(item);
      break;
    case 'repeat':
      renderRepeat(item);
      break;
    case 'questions':
      renderQuestion(item);
      break;
    case 'sentenceBuilds':
      renderSentenceBuild(item);
      break;
    case 'stories':
      renderStory(item);
      break;
    case 'openQuestions':
      renderOpenQuestion(item);
      break;
  }

  // Start question timer
  startQuestionTimer(part.timePerItem);
}

// ── Part A: Reading ──
function renderReading(item) {
  document.getElementById('text-display').textContent = item.text;
  document.getElementById('text-display').className = 'comm-text-display';
}

// ── Part B: Repeat ──
function renderRepeat(item) {
  document.getElementById('text-display').textContent = '🔊 Listen to the sentence, then repeat it.';
  document.getElementById('text-display').className = 'comm-text-display';
  document.getElementById('play-container').classList.remove('hidden');

  // Store current text for playback
  document.getElementById('play-audio-btn').dataset.text = item.text;
}

// ── Part C: Questions ──
function renderQuestion(item) {
  document.getElementById('text-display').textContent = item.text;
  document.getElementById('text-display').className = 'comm-text-display';

  // Prepare model answer (shown after recording)
  document.getElementById('model-answer-text').textContent = item.modelAnswer;
}

// ── Part D: Sentence Builds ──
function renderSentenceBuild(item) {
  document.getElementById('text-display').textContent = 'Rearrange the words to form a correct sentence:';
  document.getElementById('text-display').className = 'comm-text-display';
  document.getElementById('recording-controls').classList.add('hidden');
  document.getElementById('sb-area').classList.remove('hidden');

  // Shuffle words
  const shuffledWords = shuffle([...item.words]);
  commState.sbSelectedWords = [];

  const container = document.getElementById('sb-words-container');
  container.innerHTML = shuffledWords.map((w, i) =>
    `<div class="sb-word" data-index="${i}" data-word="${w}" onclick="selectSBWord(this)">${w}</div>`
  ).join('');

  const answerArea = document.getElementById('sb-answer-area');
  answerArea.innerHTML = '<span style="color: var(--text-dim); font-size: 0.9rem;">Click words below to build the sentence</span>';

  // Store answer
  answerArea.dataset.answer = item.answer;
}

function selectSBWord(el) {
  el.classList.add('selected');
  const word = el.dataset.word;
  commState.sbSelectedWords.push({ word, el });

  const answerArea = document.getElementById('sb-answer-area');
  if (commState.sbSelectedWords.length === 1) answerArea.innerHTML = '';
  answerArea.classList.add('active');

  const wordEl = document.createElement('div');
  wordEl.className = 'sb-answer-word';
  wordEl.textContent = word;
  wordEl.onclick = () => removeSBWord(wordEl, el);
  answerArea.appendChild(wordEl);
}

function removeSBWord(answerWord, sourceWord) {
  answerWord.remove();
  sourceWord.classList.remove('selected');
  commState.sbSelectedWords = commState.sbSelectedWords.filter(w => w.el !== sourceWord);

  const answerArea = document.getElementById('sb-answer-area');
  if (commState.sbSelectedWords.length === 0) {
    answerArea.innerHTML = '<span style="color: var(--text-dim); font-size: 0.9rem;">Click words below to build the sentence</span>';
    answerArea.classList.remove('active');
  }
}

function checkSentenceBuild() {
  const answerArea = document.getElementById('sb-answer-area');
  const expectedAnswer = answerArea.dataset.answer.toLowerCase().replace(/[.,!?]/g, '').trim();
  const userAnswer = commState.sbSelectedWords.map(w => w.word).join(' ').toLowerCase().replace(/[.,!?]/g, '').trim();

  const similarity = calculateSimilarity(userAnswer, expectedAnswer);
  return { userAnswer, expectedAnswer, accuracy: Math.round(similarity * 100) };
}

// ── Part E: Story Retelling ──
function renderStory(item) {
  document.getElementById('text-display').innerHTML = `
    <div style="text-align: left; width: 100%;">
      <strong style="color: var(--accent-primary); font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1px;">📖 ${item.title}</strong>
      <p style="margin-top: 12px; line-height: 1.9; font-size: 1rem;">${item.text}</p>
    </div>
  `;
  document.getElementById('text-display').className = 'comm-text-display story';
}

// ── Part F: Open Questions ──
function renderOpenQuestion(item) {
  document.getElementById('text-display').textContent = item.text;
  document.getElementById('text-display').className = 'comm-text-display';

  if (item.hint) {
    document.getElementById('hint-text').textContent = '💡 Hint: ' + item.hint;
    document.getElementById('hint-text').classList.remove('hidden');
  }
}

// ── Question Timer ──
function startQuestionTimer(seconds) {
  clearInterval(commState.questionTimer);
  commState.questionTimeRemaining = seconds;
  updateQuestionTimerDisplay();

  commState.questionTimer = setInterval(() => {
    commState.questionTimeRemaining--;
    updateQuestionTimerDisplay();
    if (commState.questionTimeRemaining <= 0) {
      clearInterval(commState.questionTimer);
      autoNext();
    }
  }, 1000);
}

function updateQuestionTimerDisplay() {
  const el = document.getElementById('question-timer');
  const s = commState.questionTimeRemaining;
  const m = Math.floor(s / 60);
  const sec = s % 60;
  el.textContent = m > 0 ? `${m}:${sec.toString().padStart(2, '0')}` : `0:${sec.toString().padStart(2, '0')}`;

  el.className = 'comm-timer';
  if (s <= 5) el.classList.add('danger');
  else if (s <= 10) el.classList.add('warning');
}

// ── Speech Synthesis (Play Audio) ──
function playAudio() {
  const btn = document.getElementById('play-audio-btn');
  const text = btn.dataset.text;
  if (!text) return;

  commState.synth.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.9;
  utterance.pitch = 1;
  utterance.lang = 'en-US';

  // Pick a good voice if available
  const voices = commState.synth.getVoices();
  const englishVoice = voices.find(v => v.lang.startsWith('en') && v.name.includes('Google')) ||
                       voices.find(v => v.lang.startsWith('en-US')) ||
                       voices.find(v => v.lang.startsWith('en'));
  if (englishVoice) utterance.voice = englishVoice;

  btn.disabled = true;
  btn.textContent = '🔊 Playing...';
  document.getElementById('speaking-indicator').classList.remove('hidden');

  utterance.onend = () => {
    btn.disabled = false;
    btn.textContent = '🔊 Listen Again';
    document.getElementById('speaking-indicator').classList.add('hidden');
    // After playing, show the text briefly
    const part = commState.parts[commState.currentPartIndex];
    const item = part.items[commState.currentItemIndex];
    document.getElementById('text-display').textContent = 'Now repeat the sentence you heard.';
  };

  commState.synth.speak(utterance);
}

// ── Speech Recognition (Recording) ──
let recognizedText = '';
let finalTranscript = '';

function toggleRecording() {
  if (commState.isRecording) {
    stopRecording();
  } else {
    startRecording();
  }
}

function startRecording() {
  recognizedText = '';
  finalTranscript = '';
  commState.isRecording = true;

  const micBtn = document.getElementById('mic-btn');
  const micLabel = document.getElementById('mic-label');
  const recText = document.getElementById('recognized-text');

  micBtn.classList.add('recording');
  micBtn.textContent = '⏹️';
  micLabel.className = 'mic-label recording';
  micLabel.textContent = '🔴 Recording... Click to stop';
  recText.className = 'recognized-text';
  recText.textContent = 'Listening...';

  try {
    commState.recognition.start();
  } catch (e) {
    // Already started
  }
}

function stopRecording() {
  commState.isRecording = false;
  const micBtn = document.getElementById('mic-btn');
  const micLabel = document.getElementById('mic-label');

  micBtn.classList.remove('recording');
  micBtn.textContent = '🎤';
  micLabel.className = 'mic-label';
  micLabel.textContent = 'Click to start recording';

  try {
    commState.recognition.stop();
  } catch (e) {}
}

function handleRecognitionResult(event) {
  let interim = '';
  finalTranscript = '';

  for (let i = 0; i < event.results.length; i++) {
    if (event.results[i].isFinal) {
      finalTranscript += event.results[i][0].transcript;
    } else {
      interim += event.results[i][0].transcript;
    }
  }

  recognizedText = finalTranscript || interim;
  const recText = document.getElementById('recognized-text');
  recText.className = 'recognized-text';
  recText.textContent = recognizedText || 'Listening...';
}

function handleRecognitionError(event) {
  if (event.error === 'no-speech') {
    // Restart if still recording
    if (commState.isRecording) {
      try { commState.recognition.start(); } catch(e) {}
    }
  } else if (event.error === 'aborted') {
    // Normal stop
  } else {
    console.warn('Recognition error:', event.error);
  }
}

function handleRecognitionEnd() {
  // Auto-restart if still in recording mode
  if (commState.isRecording) {
    try { commState.recognition.start(); } catch(e) {}
  }
}

// ── Score Current Item ──
function scoreCurrentItem() {
  const part = commState.parts[commState.currentPartIndex];
  if (!part) return;
  const item = part.items[commState.currentItemIndex];
  if (!item) return;

  let accuracy = 0;
  let userResponse = '';

  switch (part.type) {
    case 'reading':
      userResponse = recognizedText.trim();
      accuracy = calculateSimilarity(userResponse.toLowerCase(), item.text.toLowerCase()) * 100;
      showAccuracy(accuracy);
      break;

    case 'repeat':
      userResponse = recognizedText.trim();
      accuracy = calculateSimilarity(userResponse.toLowerCase(), item.text.toLowerCase()) * 100;
      showAccuracy(accuracy);
      break;

    case 'questions':
      userResponse = recognizedText.trim();
      // For questions, score based on length and keyword matching
      if (userResponse.length > 10) accuracy = 70 + Math.min(30, userResponse.split(' ').length * 2);
      else if (userResponse.length > 0) accuracy = 40;
      showAccuracy(accuracy);
      // Show model answer
      document.getElementById('model-answer').classList.remove('hidden');
      break;

    case 'sentenceBuilds': {
      const result = checkSentenceBuild();
      userResponse = result.userAnswer;
      accuracy = result.accuracy;
      showAccuracy(accuracy);
      break;
    }

    case 'stories': {
      userResponse = recognizedText.trim();
      // Score based on keywords mentioned
      const keywords = item.keywords || [];
      const mentioned = keywords.filter(k => userResponse.toLowerCase().includes(k.toLowerCase()));
      accuracy = keywords.length > 0 ? (mentioned.length / keywords.length) * 100 : 50;
      if (userResponse.length > 30) accuracy = Math.max(accuracy, 40);
      showAccuracy(accuracy);
      break;
    }

    case 'openQuestions':
      userResponse = recognizedText.trim();
      // Score based on response quality (length, sentence structure)
      const words = userResponse.split(' ').filter(w => w.length > 0);
      if (words.length > 20) accuracy = 85;
      else if (words.length > 10) accuracy = 70;
      else if (words.length > 5) accuracy = 50;
      else accuracy = 20;
      showAccuracy(accuracy);
      break;
  }

  // Store result
  commState.results[part.type].items.push({
    itemId: item.id,
    accuracy: Math.round(accuracy),
    userResponse
  });
  commState.results[part.type].scored += Math.round(accuracy);
}

function showAccuracy(accuracy) {
  const container = document.getElementById('accuracy-container');
  const badge = document.getElementById('accuracy-badge');
  container.classList.remove('hidden');

  const pct = Math.round(accuracy);
  if (pct >= 75) {
    badge.className = 'accuracy-badge high';
    badge.textContent = `✓ ${pct}% — Great!`;
  } else if (pct >= 50) {
    badge.className = 'accuracy-badge medium';
    badge.textContent = `△ ${pct}% — Good effort`;
  } else {
    badge.className = 'accuracy-badge low';
    badge.textContent = `✗ ${pct}% — Keep practicing`;
  }
}

// ── Navigation ──
function nextItem() {
  stopRecording();
  scoreCurrentItem();

  clearInterval(commState.questionTimer);

  commState.currentItemIndex++;
  const part = commState.parts[commState.currentPartIndex];

  if (!part || commState.currentItemIndex >= part.items.length) {
    // Move to next part
    commState.currentPartIndex++;
    commState.currentItemIndex = 0;

    if (commState.currentPartIndex >= commState.parts.length) {
      finishTest();
      return;
    }
  }

  renderCurrentItem();
}

function skipQuestion() {
  stopRecording();
  clearInterval(commState.questionTimer);

  // Record zero score for skipped
  const part = commState.parts[commState.currentPartIndex];
  if (part) {
    const item = part.items[commState.currentItemIndex];
    if (item) {
      commState.results[part.type].items.push({ itemId: item.id, accuracy: 0, userResponse: '[skipped]' });
    }
  }

  commState.currentItemIndex++;
  const currentPart = commState.parts[commState.currentPartIndex];

  if (!currentPart || commState.currentItemIndex >= currentPart.items.length) {
    commState.currentPartIndex++;
    commState.currentItemIndex = 0;

    if (commState.currentPartIndex >= commState.parts.length) {
      finishTest();
      return;
    }
  }

  renderCurrentItem();
}

function autoNext() {
  // Auto-advance when timer runs out
  nextItem();
}

// ── Finish Test ──
function finishTest() {
  stopRecording();
  clearInterval(commState.overallTimer);
  clearInterval(commState.questionTimer);
  commState.synth.cancel();

  document.getElementById('test-view').classList.add('hidden');
  document.getElementById('results-view').classList.remove('hidden');

  // Calculate overall score
  let totalItems = 0;
  let totalScore = 0;
  const partScoresHtml = [];

  const partLabels = {
    reading: '📖 Reading',
    repeat: '🔁 Repeat',
    questions: '❓ Questions',
    sentenceBuilds: '🔤 Sentence Builds',
    stories: '📚 Stories',
    openQuestions: '💬 Open Questions'
  };

  const topicScores = {};

  commState.parts.forEach(part => {
    const r = commState.results[part.type];
    const avg = r.items.length > 0 ? Math.round(r.scored / r.items.length) : 0;
    totalItems += r.items.length;
    totalScore += r.scored;

    topicScores[part.label] = {
      total: r.items.length,
      correct: Math.round((avg / 100) * r.items.length)
    };

    const colorClass = avg >= 75 ? 'high' : avg >= 50 ? 'medium' : 'low';
    const colorMap = { high: '#22c55e', medium: '#f59e0b', low: '#ef4444' };

    partScoresHtml.push(`
      <div class="comm-part-score">
        <div class="comm-part-score-label">${partLabels[part.type] || part.label}</div>
        <div class="comm-part-score-value" style="color: ${colorMap[colorClass]}">${avg}%</div>
      </div>
    `);
  });

  const overallPct = totalItems > 0 ? Math.round(totalScore / totalItems) : 0;

  // Update score circle
  const circle = document.getElementById('score-circle');
  circle.className = 'comm-score-circle ' + (overallPct >= 75 ? 'high' : overallPct >= 50 ? 'medium' : 'low');
  document.getElementById('final-score').textContent = overallPct + '%';

  // Part scores
  document.getElementById('part-scores').innerHTML = partScoresHtml.join('');

  // Subtitle
  if (overallPct >= 80) {
    document.getElementById('result-subtitle').textContent = '🎉 Excellent! You\'re well prepared for the real test!';
  } else if (overallPct >= 60) {
    document.getElementById('result-subtitle').textContent = '👍 Good effort! Keep practicing to improve your scores.';
  } else {
    document.getElementById('result-subtitle').textContent = '💪 Keep practicing! Focus on speaking clearly and at a steady pace.';
  }

  // Save to localStorage for My Results history
  const timeTaken = 20 * 60 - commState.overallTimeRemaining;
  const questionResults = [];
  commState.parts.forEach(part => {
    const r = commState.results[part.type];
    r.items.forEach((res, idx) => {
      const origItem = part.items[idx];
      const accuracy = res.accuracy || 0;
      const promptText = origItem ? (origItem.text || origItem.title || origItem.answer || 'Question ' + (idx + 1)) : ('Item ' + (idx + 1));
      const expectedText = origItem ? (origItem.text || origItem.answer || origItem.modelAnswer || '') : '';
      questionResults.push({
        id: res.itemId || ('sp_' + idx),
        question: `[${part.label}] ${promptText}`,
        code: null,
        options: [expectedText ? `Target / Model: ${expectedText}` : 'Model Answer Provided'],
        correctAnswer: 0,
        userAnswer: accuracy >= 60 ? 0 : (res.userResponse === '[skipped]' ? -1 : 1),
        isCorrect: accuracy >= 60,
        explanation: `Score: ${accuracy}%. Your response: "${res.userResponse || '[No speech detected]'}"`,
        topic: part.label
      });
    });
  });

  const resultRecord = {
    id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
    company: 'Accenture',
    section: 'Communication Speaking (Pearson Format)',
    date: new Date().toISOString(),
    total: totalItems,
    correct: Math.round((overallPct / 100) * totalItems),
    incorrect: totalItems - Math.round((overallPct / 100) * totalItems),
    unanswered: 0,
    percentage: overallPct,
    timeTaken: Math.max(timeTaken, 1),
    totalTime: 20 * 60,
    topicScores: topicScores,
    questionResults: questionResults
  };

  try {
    const key = 'mockprep_results';
    let history = JSON.parse(localStorage.getItem(key)) || [];
    history.unshift(resultRecord);
    if (history.length > 50) history = history.slice(0, 50);
    localStorage.setItem(key, JSON.stringify(history));

    const actionsDiv = document.querySelector('#results-view div:last-child');
    if (actionsDiv) {
      actionsDiv.innerHTML = `
        <a href="results.html?id=${resultRecord.id}" class="play-btn" style="margin-right: 12px; text-decoration: none;">📊 Detailed Breakdown</a>
        <a href="index.html" class="comm-nav-btn" style="margin-right: 12px; text-decoration: none;">🏠 Back to Home</a>
        <button class="comm-nav-btn" onclick="location.reload()">🔄 Retake</button>
      `;
    }
  } catch (e) {
    console.error('Failed to save result:', e);
  }
}

// ── Utility: Text Similarity ──
function calculateSimilarity(a, b) {
  if (!a || !b) return 0;

  // Normalize
  const normalize = s => s.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ').trim();
  const sa = normalize(a);
  const sb = normalize(b);

  if (sa === sb) return 1;

  // Word-level comparison
  const wordsA = sa.split(' ');
  const wordsB = sb.split(' ');
  let matches = 0;

  wordsB.forEach(w => {
    if (wordsA.includes(w)) matches++;
  });

  const wordSimilarity = wordsB.length > 0 ? matches / wordsB.length : 0;

  // Length penalty for very short responses
  const lengthRatio = Math.min(wordsA.length / Math.max(wordsB.length, 1), 1.2);
  const lengthPenalty = lengthRatio < 0.3 ? 0.5 : 1;

  return Math.min(wordSimilarity * lengthPenalty, 1);
}

// ── Utility: Shuffle Array ──
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ── Load voices (needed for some browsers) ──
if (window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = () => {
    window.speechSynthesis.getVoices();
  };
}
