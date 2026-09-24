const workspaceParams = new URLSearchParams(window.location.search);
const workspaceMode = workspaceParams.get('mode') === 'debugging' ? 'debugging' : 'ai-coding';
const isCapgeminiFullMock = workspaceParams.get('fullmock') === 'capgemini';

const challengeSets = {
  debugging: [
    {
      title: 'Fix Binary Search Tree Traversal',
      tag: 'Tree + Recursion',
      statement: 'Review the function and fix the faulty traversal logic. The function must return true only when the target exists in the binary search tree.',
      constraints: ['1 <= number of nodes <= 10^5', 'Keys are distinct', 'Do not change the function signature'],
      tests: ['Tree: 8, 3, 10, 1, 6, 14, 4, 7, 13 | target = 7 | Expected: true', 'Tree: 8, 3, 10, 1, 6, 14, 4, 7, 13 | target = 9 | Expected: false'],
      code: 'bool searchBST(Node* root, int target) {\n    if (root == nullptr) return false;\n    if (root->val == target) return true;\n\n    if (target < root->val)\n        return searchBST(root->right, target);\n    return searchBST(root->left, target);\n}'
    },
    {
      title: 'Debug Range Query Logic',
      tag: 'Prefix Sum + Arrays',
      statement: 'The range-sum function returns incorrect values for ranges beginning at index zero. Identify and correct the boundary logic.',
      constraints: ['Use O(1) range queries after preprocessing', 'Input values may be negative', 'Keep the public API unchanged'],
      tests: ['Values: 2, -1, 4, 6 | left = 0, right = 2 | Expected: 5', 'Values: 2, -1, 4, 6 | left = 1, right = 3 | Expected: 9'],
      code: 'int rangeSum(vector<int>& prefix, int left, int right) {\n    return prefix[right] - prefix[left];\n}'
    },
    {
      title: 'Fix Shortest Path Implementation',
      tag: 'Graph + Priority Queue',
      statement: 'Correct the shortest-path implementation so unreachable nodes are handled and stale priority-queue entries do not corrupt the answer.',
      constraints: ['Graph edges have non-negative weights', 'Return -1 when the target is unreachable', 'Avoid revisiting a settled node'],
      tests: ['Edges: 0-1(4), 1-2(3) | source = 0, target = 2 | Expected: 7', 'Edges: 0-1(4) | source = 0, target = 3 | Expected: -1'],
      code: 'int shortestPath(int source, int target) {\n    priority_queue<pair<int,int>> q;\n    q.push({0, source});\n    while (!q.empty()) {\n        auto [distance, node] = q.top();\n        q.pop();\n        // validate distance before expanding node\n    }\n    return 0;\n}'
    },
    {
      title: 'Repair Sliding Window State',
      tag: 'Strings + Hash Map',
      statement: 'Fix the sliding window so duplicate characters move the left boundary forward without losing the longest valid window.',
      constraints: ['String length may be 10^5', 'The result must be computed in O(n)', 'Input contains ASCII characters'],
      tests: ['Input: abcabcbb | Expected: 3', 'Input: pwwkew | Expected: 3'],
      code: 'int longestUnique(string s) {\n    unordered_map<char, int> lastSeen;\n    int left = 0, best = 0;\n    for (int right = 0; right < s.size(); right++) {\n        left = lastSeen[s[right]];\n        best = max(best, right - left + 1);\n        lastSeen[s[right]] = right;\n    }\n    return best;\n}'
    },
    {
      title: 'Validate Heap Property',
      tag: 'Heap + Invariants',
      statement: 'Find the invariant violation in the heap checker and make it validate every parent-child relationship.',
      constraints: ['The array represents a complete binary tree', 'Return false on the first invalid relationship', 'Use zero-based indexing'],
      tests: ['Input: 90, 70, 80, 20, 40 | Expected: true', 'Input: 50, 70, 40 | Expected: false'],
      code: 'bool isMaxHeap(vector<int>& values) {\n    for (int i = 0; i < values.size() / 2; i++) {\n        int left = 2 * i + 1;\n        int right = 2 * i + 2;\n        if (values[i] < values[left] && values[i] < values[right]) return false;\n    }\n    return true;\n}'
    },
    {
      title: 'Fix Java Null Handling',
      tag: 'Java + Exceptions',
      statement: 'Repair the Java service method so a missing profile returns a safe response instead of throwing a NullPointerException.',
      constraints: ['Do not catch Exception broadly', 'Keep the return type unchanged', 'Handle a missing repository result explicitly'],
      tests: ['Existing user id = 42 | Expected: profile JSON', 'Unknown user id = 99 | Expected: 404 response'],
      code: 'Profile getProfile(long id) {\n    Profile profile = repository.findById(id).orElse(null);\n    return profile.toDto();\n}'
    },
    {
      title: 'Repair C++ Iterator Invalidation',
      tag: 'C++ + STL',
      statement: 'Fix the loop that removes expired sessions while iterating over a vector without skipping elements or using an invalid iterator.',
      constraints: ['Preserve the relative order of remaining sessions', 'Use a single pass', 'Do not access an erased iterator'],
      tests: ['Sessions: 2, 7, 4, 9 | expiry <= 7 | Expected: 9', 'Sessions: 1, 3 | expiry <= 3 | Expected: empty'],
      code: 'for (auto it = sessions.begin(); it != sessions.end(); ++it) {\n    if (it->expiresAt <= now) {\n        sessions.erase(it);\n    }\n}'
    },
    {
      title: 'Correct Java Binary Search Bounds',
      tag: 'Java + Arrays',
      statement: 'Fix the binary search so it finds the first occurrence of a target and terminates for a one-element array.',
      constraints: ['Input is sorted in ascending order', 'Return -1 when absent', 'Target may appear multiple times'],
      tests: ['Values: 1, 2, 2, 4 | target = 2 | Expected: 1', 'Values: 8 | target = 8 | Expected: 0'],
      code: 'int firstIndex(int[] values, int target) {\n    int left = 0, right = values.length - 1;\n    while (left < right) {\n        int mid = (left + right) / 2;\n        if (values[mid] >= target) right = mid - 1;\n        else left = mid + 1;\n    }\n    return values[left] == target ? left : -1;\n}'
    },
    {
      title: 'Fix C++ Graph Visited State',
      tag: 'C++ + Graph DFS',
      statement: 'Correct the DFS so cycles do not cause infinite recursion and every connected node is visited exactly once.',
      constraints: ['The graph may contain cycles', 'Use adjacency lists', 'Return the number of reachable nodes'],
      tests: ['Edges: 0-1, 1-2 | start = 0 | Expected: 3', 'Edges: 0-1, 1-0 | start = 0 | Expected: 2'],
      code: 'void dfs(int node, vector<vector<int>>& graph, vector<bool>& visited) {\n    for (int next : graph[node]) {\n        if (!visited[next]) dfs(next, graph, visited);\n    }\n    visited[node] = true;\n}'
    },
    {
      title: 'Debug Java HashMap Aggregation',
      tag: 'Java + HashMap',
      statement: 'Fix the frequency aggregation so the first occurrence of a key is counted instead of being overwritten incorrectly.',
      constraints: ['Keys are strings', 'Return the most frequent key', 'Tie-break by lexicographically smaller key'],
      tests: ['Input: api, db, api | Expected: api', 'Input: ui, db | Expected: db'],
      code: 'for (String key : keys) {\n    frequency.put(key, frequency.get(key));\n}\nreturn frequency;'
    }
  ],
  'ai-coding': [
    {
      title: 'Build a Searchable Todo Skeleton',
      tag: 'React + State',
      statement: 'Complete the starter React/HTML/CSS application. Users must add todos, filter by text, toggle completion, and remove items.',
      constraints: ['Keep state in the parent component', 'Use controlled inputs', 'Do not mutate the original todo array'],
      tests: ['Add "Review hooks" | Expected: item appears in the list', 'Filter "hooks" | Expected: only matching items remain visible'],
      code: 'function TodoApp() {\n  const [todos, setTodos] = React.useState([]);\n  const [query, setQuery] = React.useState(\'\');\n\n  function addTodo(text) {\n    // implement immutable state update\n  }\n\n  return (\n    <main className="todo-app">\n      {/* complete the starter UI */}\n    </main>\n  );\n}'
    },
    {
      title: 'Implement a Debounced Search',
      tag: 'JavaScript + DOM',
      statement: 'Complete the search skeleton so it waits for the user to pause typing before requesting and rendering results.',
      constraints: ['Cancel the previous timer', 'Show a loading state', 'Ignore stale responses'],
      tests: ['Type "react" quickly | Expected: one request after the pause', 'Clear the input | Expected: empty state appears'],
      code: 'const input = document.querySelector(\'#search\');\nlet timer;\n\ninput.addEventListener(\'input\', (event) => {\n  clearTimeout(timer);\n  timer = setTimeout(() => {\n    // fetch and render the latest query\n  }, 300);\n});'
    },
    {
      title: 'Create an Accessible Modal',
      tag: 'React + Accessibility',
      statement: 'Finish the modal skeleton with Escape-key handling, focus management, and a close action that returns focus to the trigger.',
      constraints: ['Use semantic dialog behaviour', 'Trap focus while open', 'Do not close when clicking inside the dialog'],
      tests: ['Press Escape | Expected: dialog closes', 'Click the backdrop | Expected: dialog closes'],
      code: 'function Modal({ open, onClose, children }) {\n  React.useEffect(() => {\n    // add Escape listener only while open\n  }, [open, onClose]);\n\n  if (!open) return null;\n  return <div role="dialog" aria-modal="true">{children}</div>;\n}'
    },
    {
      title: 'Fix Responsive Card Layout',
      tag: 'HTML + CSS',
      statement: 'Complete the provided card grid so cards remain readable on mobile, tablet, and desktop without horizontal scrolling.',
      constraints: ['Use CSS grid or flexbox', 'Do not use fixed page widths', 'Keep card content inside its container'],
      tests: ['Viewport: 390px | Expected: one column', 'Viewport: 1024px | Expected: three balanced columns'],
      code: '.card-grid {\n  display: grid;\n  grid-template-columns: repeat(4, 320px);\n  gap: 24px;\n}\n\n/* complete the responsive skeleton */'
    },
    {
      title: 'Build a Filterable Data Table',
      tag: 'React + JavaScript',
      statement: 'Add sorting, filtering, and an empty state to the starter table while preserving the original data source.',
      constraints: ['Do not mutate source rows', 'Keep sorting stable', 'Render an explicit no-results state'],
      tests: ['Filter by "engineering" | Expected: matching rows only', 'Sort by name | Expected: ascending order'],
      code: 'function DataTable({ rows }) {\n  const [filter, setFilter] = React.useState(\'\');\n  const [sortKey, setSortKey] = React.useState(\'name\');\n\n  const visibleRows = rows\n    .filter(row => /* add case-insensitive filter */)\n    .slice()\n    .sort(/* add stable sort */);\n\n  return <table>{/* render rows and empty state */}</table>;\n}'
    }
  ]
};

const allChallenges = challengeSets[workspaceMode];
function getCoverageChallenge(mode, items) {
  const storageKey = `mockprep_workspace_coverage:${mode}`;
  let remaining = [];
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey)) || [];
    remaining = saved.filter(index => Number.isInteger(index) && index >= 0 && index < items.length);
  } catch (e) {}

  if (!remaining.length) {
    remaining = items.map((_, index) => index);
    for (let index = remaining.length - 1; index > 0; index--) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [remaining[index], remaining[swapIndex]] = [remaining[swapIndex], remaining[index]];
    }
  }

  const selectedIndex = remaining.shift();
  try { localStorage.setItem(storageKey, JSON.stringify(remaining)); } catch (e) {}
  return items[selectedIndex];
}

const challenges = isCapgeminiFullMock
  ? [getCoverageChallenge(workspaceMode, allChallenges)]
  : allChallenges;
let activeIndex = 0;
let secondsRemaining = workspaceMode === 'debugging' ? 20 * 60 : 45 * 60;
let timerId;

const elements = {
  list: document.getElementById('challenge-list'),
  title: document.getElementById('problem-title'),
  number: document.getElementById('problem-number'),
  content: document.getElementById('problem-content'),
  editor: document.getElementById('code-editor'),
  result: document.getElementById('test-result'),
  timer: document.getElementById('workspace-timer'),
  progress: document.getElementById('workspace-progress'),
  progressLabel: document.getElementById('progress-label'),
  progressFill: document.getElementById('progress-fill'),
  titleLabel: document.getElementById('workspace-title'),
  modeLabel: document.getElementById('workspace-mode-label')
};

elements.titleLabel.textContent = workspaceMode === 'debugging' ? 'Debugging Assessment' : 'AI-assisted Coding';
elements.modeLabel.textContent = workspaceMode === 'debugging' ? 'Debugging Assessment' : 'AI-assisted Coding';

document.body.classList.toggle('cap-debugging-mode', workspaceMode === 'debugging');

document.getElementById('workspace-exit-btn').addEventListener('click', () => {
  window.location.href = 'test.html?company=capgemini';
});

function renderChallengeList() {
  elements.list.innerHTML = challenges.map((challenge, index) => `
    <button class="cap-challenge-item ${index === activeIndex ? 'active' : ''}" data-index="${index}">
      <span class="cap-challenge-index">${String(index + 1).padStart(2, '0')}</span>
      <span class="cap-challenge-copy"><strong>${challenge.title}</strong><small>${challenge.tag}</small></span>
      <span class="cap-challenge-status">${index < activeIndex ? 'DONE' : index === activeIndex ? 'IN PROGRESS' : 'READY'}</span>
    </button>
  `).join('');

  elements.list.querySelectorAll('[data-index]').forEach(button => {
    button.addEventListener('click', () => {
      activeIndex = Number(button.dataset.index);
      renderChallenge();
    });
  });
}

function renderChallenge() {
  const challenge = challenges[activeIndex];
  elements.title.textContent = challenge.title;
  elements.number.textContent = String(activeIndex + 1).padStart(2, '0');
  elements.progress.textContent = `${activeIndex + 1} / ${challenges.length}`;
  elements.progressLabel.textContent = `${activeIndex + 1} / ${challenges.length}`;
  elements.progressFill.style.width = `${((activeIndex + 1) / challenges.length) * 100}%`;
  elements.content.innerHTML = `
    <p class="cap-challenge-statement">${challenge.statement}</p>
    <div class="cap-workspace-section"><h3>Requirements</h3><ul>${challenge.constraints.map(item => `<li>${item}</li>`).join('')}</ul></div>
    <div class="cap-workspace-section"><h3>Sample test cases</h3>${challenge.tests.map((test, index) => `<div class="cap-sample-test"><strong>TEST ${index + 1}</strong><span>${test}</span></div>`).join('')}</div>
  `;
  elements.editor.value = challenge.code;
  elements.result.innerHTML = 'Test results <span>Not run</span>';
  renderChallengeList();
}

function formatTime(value) {
  return `${String(Math.floor(value / 60)).padStart(2, '0')}:${String(value % 60).padStart(2, '0')}`;
}

function startTimer() {
  elements.timer.textContent = formatTime(secondsRemaining);
  timerId = setInterval(() => {
    secondsRemaining = Math.max(0, secondsRemaining - 1);
    elements.timer.textContent = formatTime(secondsRemaining);
    if (secondsRemaining === 0) {
      clearInterval(timerId);
      elements.result.innerHTML = 'Assessment time ended <span>Submit the current challenge</span>';
    }
  }, 1000);
}

document.getElementById('run-code-btn').addEventListener('click', () => {
  const hasCode = elements.editor.value.trim().length > 0;
  elements.result.innerHTML = hasCode
    ? 'Test run complete <span class="cap-result-success">Review sample cases: passed</span>'
    : 'Test run blocked <span class="cap-result-failure">Add an implementation first</span>';
});

document.getElementById('reset-code-btn').addEventListener('click', () => {
  elements.editor.value = challenges[activeIndex].code;
  elements.result.innerHTML = 'Test results <span>Not run</span>';
});

document.getElementById('submit-next-btn').addEventListener('click', () => {
  if (activeIndex === challenges.length - 1) {
    elements.result.innerHTML = 'Assessment complete <span class="cap-result-success">All challenges submitted</span>';
    clearInterval(timerId);
    if (isCapgeminiFullMock) completeCapgeminiWorkspaceStage();
    return;
  }
  activeIndex += 1;
  renderChallenge();
});

function completeCapgeminiWorkspaceStage() {
  let session = {};
  try {
    session = JSON.parse(localStorage.getItem('mockprep_capgemini_fullmock')) || {};
  } catch (e) {}
  session.stages = session.stages || {};
  session.stages[workspaceMode] = {
    section: workspaceMode === 'debugging' ? 'Debugging Assessment' : 'AI-assisted Coding',
    total: 1,
    correct: 0,
    incorrect: 1,
    percentage: 0,
    date: new Date().toISOString(),
    challenge: challenges[0].title
  };

  if (workspaceMode === 'debugging') {
    try { localStorage.setItem('mockprep_capgemini_fullmock', JSON.stringify(session)); } catch (e) {}
    window.location.href = 'capgemini-workspace.html?company=capgemini&mode=ai-coding&fullmock=capgemini&stage=ai-coding';
    return;
  }

  if (workspaceMode === 'ai-coding') {
    try { localStorage.setItem('mockprep_capgemini_fullmock', JSON.stringify(session)); } catch (e) {}
    window.location.href = 'test.html?company=capgemini&section=prompt_engineering&mode=fullmock';
    return;
  }

  const stageValues = Object.values(session.stages);
  const total = stageValues.reduce((sum, stage) => sum + (stage.total || 0), 0);
  const correct = stageValues.reduce((sum, stage) => sum + (stage.correct || 0), 0);
  const fullResult = {
    id: 'capgemini_full_' + Date.now().toString(36),
    company: 'Capgemini',
    section: 'Capgemini Full Assessment Summary',
    date: new Date().toISOString(),
    total,
    correct,
    incorrect: total - correct,
    unanswered: 0,
    percentage: total ? Math.round((correct / total) * 100) : 0,
    timeTaken: 0,
    totalTime: 45 * 60,
    stageResults: session.stages,
    topicScores: {},
    questionResults: []
  };
  let history = [];
  try { history = JSON.parse(localStorage.getItem('mockprep_results')) || []; } catch (e) {}
  history.unshift(fullResult);
  try { localStorage.setItem('mockprep_results', JSON.stringify(history.slice(0, 50))); } catch (e) {}
  try { localStorage.removeItem('mockprep_capgemini_fullmock'); } catch (e) {}
  window.location.href = `results.html?id=${fullResult.id}`;
}

function addAssistantMessage(text, response) {
  const log = document.getElementById('assistant-log');
  log.innerHTML += `<div class="cap-assistant-message cap-assistant-user">${text}</div><div class="cap-assistant-message">${response}</div>`;
  log.scrollTop = log.scrollHeight;
}

function sendAssistantMessage(text) {
  const cleanText = text.trim();
  if (!cleanText) return;
  addAssistantMessage(cleanText, 'Start by stating the input, output, invariant, and one edge case. I will guide the next step without writing the full solution.');
  document.getElementById('assistant-input').value = '';
}

document.getElementById('assistant-send-btn').addEventListener('click', () => sendAssistantMessage(document.getElementById('assistant-input').value));
document.getElementById('assistant-input').addEventListener('keydown', event => {
  if (event.key === 'Enter') sendAssistantMessage(event.target.value);
});
document.querySelectorAll('[data-assist]').forEach(button => {
  button.addEventListener('click', () => sendAssistantMessage(button.dataset.assist));
});

renderChallenge();
startTimer();
