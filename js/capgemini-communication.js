// Capgemini Communication Assessment: original PYQ-style practice set.
const firstQuestionBank = [
  { section: 'Grammar & Sentence Correction', type: 'mcq', prompt: 'Choose the grammatically correct sentence.', options: ['The report were sent yesterday.', 'The report was sent yesterday.', 'The report has send yesterday.', 'The report sending yesterday.'], answer: 1 },
  { section: 'Grammar & Sentence Correction', type: 'mcq', prompt: 'Choose the correct word: Please submit the form ___ Friday.', options: ['in', 'at', 'by', 'onwards'], answer: 2 },
  { section: 'Grammar & Sentence Correction', type: 'mcq', prompt: 'Choose the correct sentence.', options: ['Neither the manager nor the analysts was available.', 'Neither the manager nor the analysts were available.', 'Neither manager nor analysts is available.', 'Neither the manager or analysts were available.'], answer: 1 },
  { section: 'Grammar & Sentence Correction', type: 'mcq', prompt: 'Choose the best correction: “She is working here since three years.”', options: ['She works here since three years.', 'She has been working here for three years.', 'She was working here since three years.', 'She is worked here for three years.'], answer: 1 },
  { section: 'Grammar & Sentence Correction', type: 'mcq', prompt: 'Choose the most professional sentence.', options: ['Send me the file now.', 'Could you please share the final file by 4 PM?', 'You share file fast.', 'I want file immediately.'], answer: 1 },
  { section: 'Grammar & Sentence Correction', type: 'mcq', prompt: 'Choose the correct passive form: “The team will review the proposal.”', options: ['The proposal will be reviewed by the team.', 'The proposal is reviewed by the team.', 'The team will be reviewed by the proposal.', 'The proposal reviewed the team.'], answer: 0 },
  { section: 'Grammar & Sentence Correction', type: 'mcq', prompt: 'Choose the correct connector: The server was unavailable; ___, the release was delayed.', options: ['therefore', 'although', 'unless', 'meanwhile'], answer: 0 },
  { section: 'Grammar & Sentence Correction', type: 'mcq', prompt: 'Choose the correctly punctuated sentence.', options: ['After testing the fix we deployed it.', 'After testing the fix, we deployed it.', 'After, testing the fix we deployed it.', 'After testing, the fix we deployed it.'], answer: 1 },
  { section: 'Grammar & Sentence Correction', type: 'mcq', prompt: 'Choose the closest meaning of “concise”.', options: ['Clear and brief', 'Uncertain and long', 'Angry and direct', 'Informal and humorous'], answer: 0 },
  { section: 'Grammar & Sentence Correction', type: 'mcq', prompt: 'Choose the correct conditional sentence.', options: ['If I had known, I would have informed you.', 'If I know, I would informed you.', 'If I had knew, I will inform you.', 'If I knowed, I informed you.'], answer: 0 },
  { section: 'Business Communication Writing', type: 'writing', maxSeconds: 600, prompt: 'Write a professional email to your project lead explaining that a dependency delay will affect tomorrow’s delivery. Mention the impact, the action you have taken, and a revised timeline.', minWords: 100 },
  { section: 'Business Communication Writing', type: 'writing', maxSeconds: 600, prompt: 'Write a response to a customer whose issue is still under investigation. Acknowledge the inconvenience, explain the next step without making unsupported promises, and give a clear update commitment.', minWords: 100 },
  { section: 'Situational Awareness & Response', type: 'mcq', prompt: 'A teammate sends an urgent request without enough details. What is the best response?', options: ['Ignore it until they send everything.', 'Ask focused clarifying questions and confirm the deadline.', 'Start changing production immediately.', 'Tell them the request is poorly written.'], answer: 1 },
  { section: 'Situational Awareness & Response', type: 'mcq', prompt: 'You discover a mistake in a report already shared with a client. What should you do first?', options: ['Delete the email from your sent folder.', 'Inform your lead, verify the correction, and send a clear update.', 'Wait to see whether the client notices.', 'Blame the person who supplied the data.'], answer: 1 },
  { section: 'Situational Awareness & Response', type: 'mcq', prompt: 'A meeting is becoming unproductive because two people disagree. Which response is most constructive?', options: ['Interrupt them and end the meeting.', 'Summarize both viewpoints and propose an evidence-based next step.', 'Agree with the senior person without discussion.', 'Move the disagreement to a private chat and hide it.'], answer: 1 },
  { section: 'Situational Awareness & Response', type: 'mcq', prompt: 'You will miss a committed deadline because testing found a serious defect. What is the best action?', options: ['Submit without mentioning the defect.', 'Communicate the risk early with impact, mitigation, and a realistic estimate.', 'Change the ticket status to complete.', 'Wait until the deadline has passed.'], answer: 1 },
  { section: 'Situational Awareness & Response', type: 'mcq', prompt: 'A colleague asks you to share confidential customer data through a personal account. What should you do?', options: ['Send it because the request is urgent.', 'Use the approved secure channel and confirm authorization first.', 'Upload it to a public drive temporarily.', 'Forward it to several colleagues for advice.'], answer: 1 },
  { section: 'Situational Awareness & Response', type: 'mcq', prompt: 'A customer’s message is emotional and unclear. Which reply is best?', options: ['Your message makes no sense.', 'I understand this is frustrating. Could you confirm the order number and the outcome you need?', 'Please calm down before writing again.', 'We cannot help with this.'], answer: 1 },
  { section: 'Reading Comprehension', type: 'mcq', passage: 'A delivery team introduced a daily fifteen-minute review for its release checklist. The review did not add new approval layers; instead, it exposed missing test evidence before deployment. After four weeks, rollback events decreased, while the average release time remained almost unchanged. The team concluded that earlier visibility, rather than more meetings, was the main benefit.', prompt: 'What was the main benefit of the daily review?', options: ['It added more approval layers.', 'It exposed missing evidence earlier.', 'It increased release time significantly.', 'It removed the need for testing.'], answer: 1 },
  { section: 'Reading Comprehension', type: 'mcq', passage: 'A delivery team introduced a daily fifteen-minute review for its release checklist. The review did not add new approval layers; instead, it exposed missing test evidence before deployment. After four weeks, rollback events decreased, while the average release time remained almost unchanged. The team concluded that earlier visibility, rather than more meetings, was the main benefit.', prompt: 'What happened to rollback events?', options: ['They increased.', 'They stayed exactly the same.', 'They decreased.', 'They were not measured.'], answer: 2 },
  { section: 'Reading Comprehension', type: 'mcq', passage: 'A delivery team introduced a daily fifteen-minute review for its release checklist. The review did not add new approval layers; instead, it exposed missing test evidence before deployment. After four weeks, rollback events decreased, while the average release time remained almost unchanged. The team concluded that earlier visibility, rather than more meetings, was the main benefit.', prompt: 'What can be inferred about release time?', options: ['It became much longer.', 'It was roughly stable.', 'It was eliminated.', 'It became impossible to measure.'], answer: 1 },
  { section: 'Reading Comprehension', type: 'mcq', passage: 'A delivery team introduced a daily fifteen-minute review for its release checklist. The review did not add new approval layers; instead, it exposed missing test evidence before deployment. After four weeks, rollback events decreased, while the average release time remained almost unchanged. The team concluded that earlier visibility, rather than more meetings, was the main benefit.', prompt: 'Which statement best summarizes the passage?', options: ['A short visibility check reduced deployment risk without slowing releases much.', 'All releases should require many approvals.', 'Testing is unnecessary when teams meet daily.', 'The team replaced its release process entirely.'], answer: 0 },
  { section: 'Listening Comprehension', type: 'listening', audio: 'The service review will begin at half past two in Conference Room B. Please bring the incident timeline and the customer impact summary.', prompt: 'When will the service review begin?', options: ['At 2:00', 'At 2:15', 'At 2:30', 'At 3:30'], answer: 2 },
  { section: 'Listening Comprehension', type: 'listening', audio: 'The service review will begin at half past two in Conference Room B. Please bring the incident timeline and the customer impact summary.', prompt: 'Where will the review take place?', options: ['Conference Room A', 'Conference Room B', 'The customer office', 'The cafeteria'], answer: 1 },
  { section: 'Listening Comprehension', type: 'listening', audio: 'The service review will begin at half past two in Conference Room B. Please bring the incident timeline and the customer impact summary.', prompt: 'What should participants bring?', options: ['A budget and a contract', 'An incident timeline and customer impact summary', 'A laptop charger only', 'A new project plan'], answer: 1 },
  { section: 'Listening Comprehension', type: 'listening', audio: 'The service review will begin at half past two in Conference Room B. Please bring the incident timeline and the customer impact summary.', prompt: 'What is the purpose of the message?', options: ['To cancel a meeting', 'To announce a review and its preparation items', 'To request annual leave', 'To report a password reset'], answer: 1 },
  { section: 'Spoken Communication Simulation', type: 'spoken', maxSeconds: 120, minWords: 100, prompt: 'You are introducing yourself to a new project team. Speak for up to two minutes about your background, one technical strength, and how you collaborate with teammates.' },
  { section: 'Spoken Communication Simulation', type: 'spoken', maxSeconds: 120, minWords: 100, prompt: 'A customer reports that a feature is not working after a release. Explain how you would respond, investigate the issue, communicate progress, and close the conversation professionally.' }
];

const alternatePrompts = [
  [
    'In a project update, choose the sentence with correct grammar.',
    'Choose the correct word: The client meeting is scheduled ___ Monday.',
    'For a status report, select the sentence with correct agreement.',
    'Choose the best correction: “They are working on this project since January.”',
    'For a client email, select the clearest professional sentence.',
    'Choose the correct passive form: “The manager approved the request.”',
    'Choose the correct connector: The data was incomplete; ___, the analysis was postponed.',
    'Select the sentence that uses punctuation correctly in a project update.',
    'Choose the closest meaning of “accurate”.',
    'Select the conditional sentence that correctly describes a past possibility.',
    'Write a professional email to your manager requesting a one-day extension because a test environment is unavailable. Explain the impact, workaround, and revised delivery plan.',
    'Write a professional reply to a colleague who says your handover notes are incomplete. Acknowledge the concern, explain what you will add, and confirm when the update will be ready.',
    'A colleague asks for help while you are handling a critical incident. What is the best response?',
    'You notice an incorrect number in a presentation that will be used in a client meeting. What should you do?',
    'A teammate strongly disagrees with your technical recommendation. What should you do?',
    'A requirement changes just before development starts. What is the best professional response?',
    'You receive a file containing information you are not authorized to view. What should you do?',
    'A customer asks for an immediate fix, but the cause is not yet known. How should you respond?',
    'What is the central idea of the passage?',
    'What did the team avoid adding to the process?',
    'Which result remained nearly unchanged?',
    'What did the team believe created the improvement?',
    'When should participants join the project call?',
    'What document should participants review beforehand?',
    'Who is expected to attend the call?',
    'Why was the message sent?',
    'You are joining a project halfway through. Speak for up to two minutes about how you would introduce yourself, understand the work, and build trust with the team.',
    'Explain to a customer how you would handle a delay caused by a third-party service. Speak for up to two minutes and describe your communication plan.'
  ],
  [
    'Select the sentence with correct subject-verb agreement.',
    'Choose the correct word: Please respond ___ the end of the day.',
    'Select the correctly formed sentence.',
    'Choose the best correction: “He did not completed the task.”',
    'Choose the clearest sentence for a formal email.',
    'Choose the correct passive form: “The analyst prepared the dashboard.”',
    'Choose the best connector: The build passed; ___, we started deployment.',
    'Choose the sentence with correct comma placement.',
    'Choose the closest meaning of “flexible”.',
    'Select the conditional sentence that correctly describes a future possibility.',
    'Write an email to a customer explaining that a planned maintenance window has moved by two hours. Include the reason, expected impact, and a polite apology.',
    'Write a response to your lead after receiving feedback that your communication was unclear. Explain the specific improvement you will make and how you will verify it.',
    'You cannot complete two urgent requests at the same time. What should you do?',
    'You find that a shared document contains outdated instructions. What is the best action?',
    'A meeting participant keeps interrupting others. What is the most constructive response?',
    'You disagree with a new deadline because it creates a quality risk. What should you communicate?',
    'A person outside the project asks for an internal status report. What should you do?',
    'A customer sends an angry message about repeated updates. Which response is best?',
    'Why was the checklist review introduced?',
    'What did the review expose before deployment?',
    'What happened to rollback events after four weeks?',
    'What did the team say was more important than extra meetings?',
    'What time is the service review?',
    'Which room is mentioned in the announcement?',
    'Which two items are requested for the review?',
    'What action does the announcement ask participants to take?',
    'Describe a time you had to learn a new process quickly. Speak for up to two minutes and explain your approach and result.',
    'Explain how you would communicate a confirmed production defect to a customer while keeping the explanation clear and responsible.'
  ]
];

function prepareBank(bank, paperNumber) {
  return bank.map((question, index) => ({
    ...question,
    id: `capgemini_comm_p${paperNumber}_q${index + 1}`,
    paperNumber
  }));
}

const questionBanks = [
  prepareBank(firstQuestionBank, 1),
  prepareBank(firstQuestionBank.map((question, index) => ({ ...question, prompt: alternatePrompts[0][index] })), 2),
  prepareBank(firstQuestionBank.map((question, index) => ({ ...question, prompt: alternatePrompts[1][index] })), 3)
];

const totalQuestionPool = questionBanks.reduce((total, bank) => total + bank.length, 0);

let questions = firstQuestionBank;
const state = { index: 0, answers: {}, startedAt: null, remaining: 3600, timer: null, recognition: null, recording: false, attempt: 0 };
const attemptKey = 'capgemini_communication_attempt_count';
const $ = id => document.getElementById(id);

function wordCount(value) { return value.trim() ? value.trim().split(/\s+/).length : 0; }
function escapeHtml(value) { return value.replace(/[&<>'"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[c])); }
function speak(text) { if (!('speechSynthesis' in window)) return; speechSynthesis.cancel(); const utterance = new SpeechSynthesisUtterance(text); utterance.rate = 0.9; speechSynthesis.speak(utterance); }

function init() {
  const attempts = Number(localStorage.getItem(attemptKey) || 0);
  if (attempts >= 3) {
    $('start-btn').disabled = true;
    $('locked-message').textContent = 'All three practice attempts are complete on this device.';
    $('locked-message').classList.remove('hidden');
    $('reset-btn').classList.remove('hidden');
  } else if (attempts > 0) {
    $('locked-message').textContent = `${attempts} of 3 attempts used. Start attempt ${attempts + 1} with a different question set.`;
    $('locked-message').classList.remove('hidden');
  }
  $('start-btn').onclick = start;
  $('reset-btn').onclick = () => { localStorage.removeItem(attemptKey); location.reload(); };
  $('next-btn').onclick = () => move(1);
  $('prev-btn').onclick = () => move(-1);
  $('end-btn').onclick = () => finish(true);
}

function start() {
  state.attempt = Number(localStorage.getItem(attemptKey) || 0) + 1;
  if (state.attempt > 3) return;
  localStorage.setItem(attemptKey, String(state.attempt));
  questions = questionBanks[state.attempt - 1];
  state.startedAt = Date.now();
  $('start-view').classList.add('hidden'); $('test-view').classList.remove('hidden');
  renderNav(); renderQuestion(); updateTimer();
  state.timer = setInterval(() => { state.remaining--; updateTimer(); if (state.remaining <= 0) finish(false); }, 1000);
}

function updateTimer() {
  const min = Math.floor(state.remaining / 60); const sec = state.remaining % 60;
  $('timer').textContent = `${min}:${String(sec).padStart(2, '0')}`;
  $('timer').className = 'ca-timer' + (state.remaining <= 60 ? ' danger' : state.remaining <= 300 ? ' warning' : '');
}

function renderNav() {
  const groups = [...new Set(questions.map(q => q.section))];
  $('question-nav').innerHTML = groups.map(section => `<div class="ca-section">${section}</div><div class="ca-nav">${questions.map((q, i) => q.section === section ? `<button class="${i === state.index ? 'current ' : ''}${state.answers[i] !== undefined ? 'answered' : ''}" data-index="${i}">${i + 1}</button>` : '').join('')}</div>`).join('');
  $('question-nav').querySelectorAll('button').forEach(button => { button.onclick = () => { state.index = Number(button.dataset.index); renderNav(); renderQuestion(); }; });
  const answered = Object.keys(state.answers).length;
  $('progress-text').textContent = `${state.index + 1} of ${questions.length} • ${answered} answered`;
  $('progress-fill').style.width = `${(answered / questions.length) * 100}%`;
}

function renderQuestion() {
  const q = questions[state.index];
  $('ca-meta').textContent = `Attempt ${state.attempt} of 3 • ${q.section} • Question ${state.index + 1} of ${questions.length}`;
  $('question-label').textContent = q.type === 'spoken' ? `Maximum recording time: ${q.maxSeconds / 60} minutes` : q.type === 'writing' ? 'Writing task • recommended maximum: 10 minutes' : q.type === 'listening' ? 'Listen before answering' : 'Select one answer';
  $('question-prompt').textContent = q.prompt;
  let html = q.passage ? `<div class="ca-passage">${q.passage}</div>` : '';
  if (q.audio) html += `<button id="listen-btn" class="btn btn-secondary">🔊 Play audio</button>`;
  if (q.type === 'mcq' || q.type === 'listening') html += `<div class="ca-options">${q.options.map((option, i) => `<label class="ca-option ${state.answers[state.index] === i ? 'selected' : ''}"><input type="radio" name="answer" value="${i}" ${state.answers[state.index] === i ? 'checked' : ''}> <span>${option}</span></label>`).join('')}</div>`;
  if (q.type === 'writing' || q.type === 'spoken') html += `<textarea id="response" class="ca-response" placeholder="Write or speak your response here..."></textarea><div id="word-count" class="ca-help">0 words • minimum ${q.minWords || 100} words</div>${q.type === 'spoken' ? '<button id="mic-btn" class="btn btn-secondary" style="margin-top:10px">🎙️ Start microphone</button>' : ''}`;
  $('question-content').innerHTML = html;
  if (q.audio) $('listen-btn').onclick = () => speak(q.audio);
  $('question-content').querySelectorAll('input').forEach(input => input.onchange = () => { state.answers[state.index] = Number(input.value); renderNav(); renderQuestion(); });
  const response = $('response');
  if (response) { response.value = state.answers[state.index] || ''; response.oninput = () => { state.answers[state.index] = response.value; $('word-count').textContent = `${wordCount(response.value)} words • minimum ${q.minWords || 100} words`; renderNav(); }; }
  if ($('mic-btn')) $('mic-btn').onclick = toggleMic;
  $('prev-btn').disabled = state.index === 0; $('next-btn').textContent = state.index === questions.length - 1 ? 'Submit →' : 'Next →';
}

function toggleMic() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) { alert('Speech recognition is not available in this browser. Type your response instead.'); return; }
  if (state.recording) { state.recognition.stop(); return; }
  state.recognition = new SpeechRecognition(); state.recognition.continuous = true; state.recognition.interimResults = true; state.recognition.lang = 'en-US'; state.recording = true; $('mic-btn').textContent = '⏹️ Stop microphone';
  state.recognition.onresult = event => { let text = ''; for (const result of event.results) text += result[0].transcript + ' '; const response = $('response'); if (response) { response.value = text.trim(); state.answers[state.index] = response.value; $('word-count').textContent = `${wordCount(response.value)} words • minimum 100 words`; } };
  state.recognition.onend = () => { state.recording = false; if ($('mic-btn')) $('mic-btn').textContent = '🎙️ Start microphone'; };
  state.recognition.start();
}

function move(direction) {
  const q = questions[state.index];
  if (direction > 0 && (q.type === 'writing' || q.type === 'spoken') && wordCount(String(state.answers[state.index] || '')) < (q.minWords || 100)) { alert(`Please provide at least ${q.minWords || 100} words before continuing.`); return; }
  if (state.index + direction >= questions.length) { finish(false); return; }
  state.index += direction; renderNav(); renderQuestion();
}

function finish(early) {
  if (!early && state.remaining > 0 && !confirm('Submit this assessment now?')) return;
  clearInterval(state.timer); if (state.recognition) state.recognition.stop();
  let correct = 0; questions.forEach((q, i) => { if (q.type === 'mcq' || q.type === 'listening') { if (state.answers[i] === q.answer) correct++; } else if (wordCount(String(state.answers[i] || '')) >= (q.minWords || 100)) correct++; });
  const percent = Math.round((correct / questions.length) * 100);
  localStorage.setItem('capgemini_communication_last_result', JSON.stringify({ date: new Date().toISOString(), total: questions.length, correct, percentage: percent, timeTaken: 3600 - state.remaining }));
  $('test-view').classList.add('hidden'); $('result-view').classList.remove('hidden'); $('result-summary').textContent = `${correct} of ${questions.length} responses met the practice scoring criteria (${percent}%). Review your written and spoken answers with a mentor or language tool.`;
}

document.addEventListener('DOMContentLoaded', init);
