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
  micGranted: false,
  mediaStream: null,
  mediaRecorder: null,
  audioChunks: [],
  userAudioUrl: null,
  hasScoredCurrent: false
};

// ── Check Browser Support ──
function checkSupport() {
  const hasSynth = 'speechSynthesis' in window;
  const hasRecog = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;

  if (!hasSynth && !hasRecog) {
    document.getElementById('setup-view').classList.add('hidden');
    document.getElementById('not-supported-view').classList.remove('hidden');
    return false;
  }
  return true;
}

// ── Initialize ──
document.addEventListener('DOMContentLoaded', () => {
  if (!checkSupport()) return;

  // Setup SpeechRecognition safely
  try {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      commState.recognition = new SpeechRecognition();
      commState.recognition.continuous = true;
      commState.recognition.interimResults = true;
      commState.recognition.lang = 'en-US';

      commState.recognition.onresult = handleRecognitionResult;
      commState.recognition.onerror = handleRecognitionError;
      commState.recognition.onend = handleRecognitionEnd;
    }
  } catch (e) {
    console.warn('SpeechRecognition initialization error:', e);
  }

  // Request mic permission
  requestMicPermission();

  // Full mock pipeline indicator on setup card
  const params = new URLSearchParams(window.location.search);
  const isFullMock = params.get('from') === 'fullmock' || params.get('mode') === 'fullmock';
  if (isFullMock) {
    const setupCard = document.querySelector('.setup-card');
    if (setupCard) {
      const banner = document.createElement('div');
      banner.style.cssText = 'margin-bottom: 24px; background: linear-gradient(135deg, rgba(0, 212, 255, 0.12), rgba(124, 58, 237, 0.15)); border: 1px solid rgba(0, 212, 255, 0.3); border-radius: 14px; padding: 14px 20px; text-align: center;';
      banner.innerHTML = `
        <div style="display: flex; justify-content: center; gap: 8px; flex-wrap: wrap; margin-bottom: 8px;">
          <span style="background: rgba(34, 197, 94, 0.2); border: 1px solid #22c55e; color: #22c55e; padding: 3px 12px; border-radius: 99px; font-size: 0.74rem; font-weight: 700;">✅ Stage 1: Technical MCQ</span>
          <span style="color: var(--text-dim); align-self: center;">→</span>
          <span style="background: rgba(0, 212, 255, 0.2); border: 1px solid #00d4ff; color: #00d4ff; padding: 3px 12px; border-radius: 99px; font-size: 0.74rem; font-weight: 700;">⚡ Stage 2: Spoken English</span>
          <span style="color: var(--text-dim); align-self: center;">→</span>
          <span style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); color: var(--text-muted); padding: 3px 12px; border-radius: 99px; font-size: 0.74rem;">Stage 3: Cognitive</span>
          <span style="color: var(--text-dim); align-self: center;">→</span>
          <span style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); color: var(--text-muted); padding: 3px 12px; border-radius: 99px; font-size: 0.74rem;">Stage 4: Coding</span>
        </div>
        <div style="font-size: 0.9rem; color: #fff; font-weight: 700;">Full Mock Test • Stage 2 of 4: Spoken English Assessment (Pearson Format)</div>
      `;
      setupCard.insertBefore(banner, setupCard.firstChild);
    }
  }
});

// ── Mic Permission ──
async function requestMicPermission() {
  const statusEl = document.getElementById('mic-status');
  const startBtn = document.getElementById('start-test-btn');

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    commState.mediaStream = stream;
    commState.micGranted = true;
    if (statusEl) {
      statusEl.className = 'mic-status granted';
      statusEl.textContent = '✅ Microphone ready';
    }
    if (startBtn) startBtn.disabled = false;
  } catch (e) {
    console.warn('Microphone check:', e);
    commState.micGranted = true; // allow practice mode
    if (statusEl) {
      statusEl.className = 'mic-status pending';
      statusEl.innerHTML = '⚠️ Mic access prompt pending or blocked — <span style="color:var(--text-primary); font-weight:600;">Practice Mode enabled</span> (Audio playback & Sentence Builds active)';
    }
    if (startBtn) {
      startBtn.disabled = false;
      startBtn.textContent = '🚀 Start Speaking Test';
    }
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
  commState.hasScoredCurrent = false;
  document.getElementById('recognized-text').className = 'recognized-text empty';
  document.getElementById('recognized-text').textContent = 'Your speech will appear here...';
  document.getElementById('accuracy-container').classList.add('hidden');
  document.getElementById('model-answer').classList.add('hidden');
  document.getElementById('hint-text').classList.add('hidden');
  document.getElementById('play-container').classList.add('hidden');
  document.getElementById('sb-area').classList.add('hidden');
  document.getElementById('recording-controls').classList.remove('hidden');

  const replayBar = document.getElementById('audio-replay-bar');
  if (replayBar) replayBar.classList.add('hidden');
  const userPlayer = document.getElementById('user-voice-player');
  if (userPlayer) {
    userPlayer.pause();
    userPlayer.src = '';
  }

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
  const playBtn = document.getElementById('play-audio-btn');
  if (playBtn) playBtn.dataset.text = item.text;

  // Auto-play sentence after a short delay so user hears it clearly
  setTimeout(() => {
    playAudio();
  }, 600);
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
  const text = btn ? btn.dataset.text : '';
  if (!text) return;

  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
    if (window.speechSynthesis.paused) window.speechSynthesis.resume();
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.9;
  utterance.pitch = 1;
  utterance.lang = 'en-US';

  // Pick an English voice
  const voices = window.speechSynthesis.getVoices();
  const englishVoice = voices.find(v => v.lang.startsWith('en') && v.name.includes('Google')) ||
                       voices.find(v => v.lang.startsWith('en-US')) ||
                       voices.find(v => v.lang.startsWith('en'));
  if (englishVoice) utterance.voice = englishVoice;

  if (btn) {
    btn.disabled = true;
    btn.textContent = '🔊 Playing...';
  }
  const indicator = document.getElementById('speaking-indicator');
  if (indicator) indicator.classList.remove('hidden');

  utterance.onend = () => {
    if (btn) {
      btn.disabled = false;
      btn.textContent = '🔊 Listen Again';
    }
    if (indicator) indicator.classList.add('hidden');
    const textDisplay = document.getElementById('text-display');
    if (textDisplay) textDisplay.textContent = 'Now repeat the sentence you heard: Click 🎤 and speak.';
  };

  utterance.onerror = () => {
    if (btn) {
      btn.disabled = false;
      btn.textContent = '🔊 Listen Again';
    }
    if (indicator) indicator.classList.add('hidden');
  };

  window.speechSynthesis.speak(utterance);
}

// ── Speech Recognition & Audio Recording (MediaRecorder) ──
let recognizedText = '';
let finalTranscript = '';

function toggleRecording() {
  if (commState.isRecording) {
    stopRecording();
  } else {
    startRecording();
  }
}

async function startRecording() {
  recognizedText = '';
  finalTranscript = '';
  commState.isRecording = true;
  commState.audioChunks = [];

  const micBtn = document.getElementById('mic-btn');
  const micLabel = document.getElementById('mic-label');
  const recText = document.getElementById('recognized-text');
  const replayBar = document.getElementById('audio-replay-bar');
  if (replayBar) replayBar.classList.add('hidden');

  if (micBtn) {
    micBtn.classList.add('recording');
    micBtn.textContent = '⏹️';
  }
  if (micLabel) {
    micLabel.className = 'mic-label recording';
    micLabel.textContent = '🔴 Recording... Click ⏹️ to stop';
  }
  if (recText) {
    recText.className = 'recognized-text';
    recText.textContent = 'Listening to your speech... Speak now!';
  }

  // Start MediaRecorder for user playback
  try {
    if (!commState.mediaStream || !commState.mediaStream.active) {
      commState.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    }
    if (commState.mediaStream && window.MediaRecorder) {
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : (MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : '');
      const options = mimeType ? { mimeType } : {};
      commState.mediaRecorder = new MediaRecorder(commState.mediaStream, options);

      commState.mediaRecorder.ondataavailable = e => {
        if (e.data && e.data.size > 0) {
          commState.audioChunks.push(e.data);
        }
      };

      commState.mediaRecorder.onstop = () => {
        if (commState.audioChunks.length > 0) {
          const blob = new Blob(commState.audioChunks, { type: commState.mediaRecorder.mimeType || 'audio/webm' });
          if (commState.userAudioUrl) URL.revokeObjectURL(commState.userAudioUrl);
          commState.userAudioUrl = URL.createObjectURL(blob);
          const p = document.getElementById('user-voice-player');
          if (p) p.src = commState.userAudioUrl;
          const bar = document.getElementById('audio-replay-bar');
          if (bar) bar.classList.remove('hidden');
        }
      };

      commState.mediaRecorder.start(100);
    }
  } catch (err) {
    console.warn('MediaRecorder error:', err);
  }

  // Start SpeechRecognition
  if (commState.recognition) {
    try {
      commState.recognition.start();
    } catch (e) {
      // Already running
    }
  }
}

function stopRecording() {
  if (!commState.isRecording) return;
  commState.isRecording = false;

  const micBtn = document.getElementById('mic-btn');
  const micLabel = document.getElementById('mic-label');

  if (micBtn) {
    micBtn.classList.remove('recording');
    micBtn.textContent = '🎤';
  }
  if (micLabel) {
    micLabel.className = 'mic-label';
    micLabel.textContent = '✅ Recording saved! Click "Replay" below to check your pronunciation.';
  }

  // Stop MediaRecorder
  if (commState.mediaRecorder && commState.mediaRecorder.state !== 'inactive') {
    try { commState.mediaRecorder.stop(); } catch (e) {}
  }

  // Stop SpeechRecognition
  if (commState.recognition) {
    try { commState.recognition.stop(); } catch (e) {}
  }

  // Evaluate accuracy and display feedback immediately
  setTimeout(() => {
    scoreCurrentItem();
  }, 250);
}

function replayUserVoice() {
  const player = document.getElementById('user-voice-player');
  const btn = document.getElementById('replay-voice-btn');
  if (!player || !player.src) {
    alert('Please record your voice first using the 🎤 button!');
    return;
  }

  if (player.paused) {
    player.currentTime = 0;
    player.play();
    if (btn) {
      btn.innerHTML = '<span>⏸️</span> Playing... (Click to pause)';
      btn.style.borderColor = 'var(--accent-blue)';
    }
    player.onended = () => {
      if (btn) {
        btn.innerHTML = '<span>▶️</span> Replay My Voice (Check Pronunciation)';
        btn.style.borderColor = '';
      }
    };
  } else {
    player.pause();
    if (btn) {
      btn.innerHTML = '<span>▶️</span> Replay My Voice (Check Pronunciation)';
      btn.style.borderColor = '';
    }
  }
}

function playNativeVoice() {
  const part = commState.parts[commState.currentPartIndex];
  if (!part) return;
  const item = part.items[commState.currentItemIndex];
  if (!item) return;

  let text = item.text;
  if (part.type === 'questions' && item.modelAnswer) text = item.modelAnswer;
  else if (part.type === 'sentenceBuilds' && item.answer) text = item.answer;

  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
    if (window.speechSynthesis.paused) window.speechSynthesis.resume();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.9;
    u.lang = 'en-US';
    const voices = window.speechSynthesis.getVoices();
    const v = voices.find(vc => vc.lang.startsWith('en') && vc.name.includes('Google')) ||
              voices.find(vc => vc.lang.startsWith('en-US')) ||
              voices.find(vc => vc.lang.startsWith('en'));
    if (v) u.voice = v;
    window.speechSynthesis.speak(u);
  }
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
  if (recText) {
    recText.className = 'recognized-text';
    recText.textContent = recognizedText || 'Listening to your speech...';
  }
}

function handleRecognitionError(event) {
  if (event.error === 'no-speech') {
    if (commState.isRecording && commState.recognition) {
      try { commState.recognition.start(); } catch (e) {}
    }
  } else if (event.error === 'aborted') {
    // Normal stop
  } else {
    console.warn('Recognition error:', event.error);
  }
}

function handleRecognitionEnd() {
  if (commState.isRecording && commState.recognition) {
    try { commState.recognition.start(); } catch (e) {}
  }
}

// ── Score Current Item ──
function scoreCurrentItem() {
  if (commState.hasScoredCurrent) return;
  const part = commState.parts[commState.currentPartIndex];
  if (!part) return;
  const item = part.items[commState.currentItemIndex];
  if (!item) return;

  commState.hasScoredCurrent = true;
  let accuracy = 0;
  let userResponse = '';

  switch (part.type) {
    case 'reading':
      userResponse = recognizedText.trim();
      accuracy = userResponse ? calculateSimilarity(userResponse.toLowerCase(), item.text.toLowerCase()) * 100 : 70;
      showAccuracy(accuracy);
      break;

    case 'repeat':
      userResponse = recognizedText.trim();
      accuracy = userResponse ? calculateSimilarity(userResponse.toLowerCase(), item.text.toLowerCase()) * 100 : 70;
      showAccuracy(accuracy);
      break;

    case 'questions':
      userResponse = recognizedText.trim();
      if (userResponse.length > 10) accuracy = 70 + Math.min(30, userResponse.split(' ').length * 2);
      else if (userResponse.length > 0) accuracy = 55;
      else accuracy = 65;
      showAccuracy(accuracy);
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
      const keywords = item.keywords || [];
      const mentioned = keywords.filter(k => userResponse.toLowerCase().includes(k.toLowerCase()));
      accuracy = keywords.length > 0 ? (mentioned.length / keywords.length) * 100 : 70;
      if (userResponse.length > 30) accuracy = Math.max(accuracy, 60);
      showAccuracy(accuracy);
      break;
    }

    case 'openQuestions':
      userResponse = recognizedText.trim();
      const words = userResponse.split(' ').filter(w => w.length > 0);
      if (words.length > 20) accuracy = 85;
      else if (words.length > 10) accuracy = 70;
      else if (words.length > 5) accuracy = 55;
      else accuracy = 60;
      showAccuracy(accuracy);
      break;
  }

  // Store result
  commState.results[part.type].items.push({
    itemId: item.id,
    accuracy: Math.round(accuracy),
    userResponse: userResponse || '[Audio Recording Saved]'
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
    badge.textContent = `✓ ${pct}% Pronunciation Match — Great!`;
  } else if (pct >= 50) {
    badge.className = 'accuracy-badge medium';
    badge.textContent = `△ ${pct}% Pronunciation Match — Good effort`;
  } else {
    badge.className = 'accuracy-badge low';
    badge.textContent = `✗ ${pct}% Pronunciation Match — Listen to Native Accent`;
  }
}

// ── Navigation ──
function nextItem() {
  stopRecording();
  if (!commState.hasScoredCurrent) {
    scoreCurrentItem();
  }

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

  // Compile and save results
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

  // If in Full Mock Mode or redirected from fullmock, save stage2 and auto-advance to Stage 3 (Cognitive Games)
  const params = new URLSearchParams(window.location.search);
  const isFullMock = params.get('from') === 'fullmock' || params.get('mode') === 'fullmock';

  if (isFullMock) {
    let fullMock = {};
    try {
      fullMock = JSON.parse(localStorage.getItem('mockprep_current_fullmock')) || {};
    } catch(e) { fullMock = {}; }
    fullMock.id = fullMock.id || ('fm_' + Date.now().toString(36));
    fullMock.stage2 = resultRecord;
    try {
      localStorage.setItem('mockprep_current_fullmock', JSON.stringify(fullMock));
    } catch(e) {}

    // Show Auto-Transition Modal to Stage 3: Gamified Cognitive Games
    const transModal = document.getElementById('fullmock-transition-modal');
    if (transModal) {
      transModal.classList.add('active');
      let countdown = 3;
      const timerEl = document.getElementById('fm-trans-timer');
      const btn = document.getElementById('fm-trans-btn');
      if (timerEl) timerEl.textContent = countdown;
      const targetUrl = 'cognitive-games.html?company=accenture&mode=fullmock';

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
      window.location.href = 'cognitive-games.html?company=accenture&mode=fullmock';
    }
  }

  const nextStageEl = document.getElementById('fullmock-next-stage');
  if (nextStageEl && isFullMock) {
    nextStageEl.innerHTML = `
      <div style="margin: 24px auto; max-width: 650px; background: linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(0, 212, 255, 0.2)); border: 2px solid #10b981; border-radius: 16px; padding: 24px; text-align: center; box-shadow: 0 10px 35px rgba(16, 185, 129, 0.35);">
        <div style="display: flex; justify-content: center; gap: 8px; flex-wrap: wrap; margin-bottom: 16px;">
          <span style="background: rgba(34, 197, 94, 0.2); border: 1px solid #22c55e; color: #22c55e; padding: 4px 12px; border-radius: 99px; font-size: 0.75rem; font-weight: 700;">✅ Stage 1: Technical MCQ</span>
          <span style="color: var(--text-dim); align-self: center;">→</span>
          <span style="background: rgba(34, 197, 94, 0.2); border: 1px solid #22c55e; color: #22c55e; padding: 4px 12px; border-radius: 99px; font-size: 0.75rem; font-weight: 700;">✅ Stage 2: Spoken English</span>
          <span style="color: var(--text-dim); align-self: center;">→</span>
          <span style="background: rgba(245, 158, 11, 0.2); border: 1px solid #f59e0b; color: #f59e0b; padding: 4px 12px; border-radius: 99px; font-size: 0.75rem; font-weight: 700;">⚡ Stage 3: Gamified Cognitive (Next)</span>
          <span style="color: var(--text-dim); align-self: center;">→</span>
          <span style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); color: var(--text-muted); padding: 4px 12px; border-radius: 99px; font-size: 0.75rem;">Stage 4: Coding</span>
        </div>
        <h3 style="margin-bottom: 8px; font-size: 1.3rem; color: #fff;">🎉 Stage 2 Complete!</h3>
        <p style="color: var(--text-secondary); font-size: 0.95rem; margin-bottom: 20px; line-height: 1.6;">
          Next up in your Full Mock Test: <strong>Stage 3 — Gamified Cognitive Assessment</strong> featuring Bubble Math (14s countdown & auto-skip), Directional Doors (4m timer), and Maze Pathfinding (4m timer).
        </p>
        <a href="cognitive-games.html?company=accenture&mode=fullmock" class="btn btn-primary btn-lg" style="font-size: 1.05rem; padding: 14px 32px; box-shadow: 0 4px 25px rgba(16, 185, 129, 0.4); text-decoration: none; display: inline-flex; align-items: center; gap: 8px;">
          <span>🎮</span> Proceed to Stage 3: Gamified Cognitive Games →
        </a>
      </div>
    `;
    nextStageEl.classList.remove('hidden');
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
