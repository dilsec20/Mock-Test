window.COMPANY_DATA = window.COMPANY_DATA || {};
window.COMPANY_DATA.capgemini = {
  company: 'Capgemini',
  examName: 'Capgemini New Hiring Assessment',
  examDate: '2026-10-15',
  totalDuration: 45,
  supportsFullMock: false,
  sections: [
    {
      id: 'ai_literacy',
      name: 'AI Literacy',
      icon: '🤖',
      questions: 20,
      duration: 20,
      description: 'AI foundations, prompting, agents, evaluation, and responsible AI',
      practiceUrl: 'https://www.cloudskillsboost.google/paths/118',
      practiceLabel: 'AI fundamentals reference'
    },
    {
      id: 'technical_assessment',
      name: 'Technical Assessment',
      icon: '🧠',
      questions: 20,
      duration: 25,
      description: 'Programming logic, DSA, DBMS, SQL, APIs, cloud, and engineering fundamentals',
      practiceUrl: 'https://www.hackerrank.com/domains',
      practiceLabel: 'Technical practice'
    },
    {
      id: 'english_communication',
      name: 'English Communication',
      icon: '🎙️',
      questions: 10,
      duration: 15,
      description: 'Find defects, explain failures, and correct code with AI assistance',
      practiceUrl: 'https://www.hackerrank.com/domains/tutorials/10-days-of-javascript',
      practiceLabel: 'Debugging practice',
    },
    {
      id: 'problem_solving',
      name: 'Problem Solving',
      icon: '🧩',
      questions: 10,
      duration: 25,
      description: 'Logical reasoning, algorithms, and quantitative problem solving'
    },
    {
      id: 'ai_debugging',
      name: 'AI-assisted Debugging',
      icon: '🐞',
      questions: 10,
      duration: 25,
      description: 'Find defects, explain failures, and correct code with AI assistance',
      isWorkspace: true,
      workspaceMode: 'debugging'
    },
    {
      id: 'ai_feature_development',
      name: 'AI-assisted Feature Development',
      icon: '🛠️',
      questions: 10,
      duration: 30,
      description: 'Extend a provided application using React, JavaScript, HTML, and CSS',
      practiceUrl: 'https://react.dev/learn',
      practiceLabel: 'React reference',
      isWorkspace: true,
      workspaceMode: 'ai-coding'
    },
    {
      id: 'prompt_engineering',
      name: 'Prompt Engineering',
      icon: '✍️',
      questions: 10,
      duration: 20,
      description: 'Write precise prompts that produce reliable engineering results',
      practiceUrl: 'https://learnprompting.org/docs/intro',
      practiceLabel: 'Prompt practice'
    },
    {
      id: 'cognitive_assessment',
      name: 'Cognitive Assessment',
      icon: '🧠',
      questions: 10,
      duration: 20,
      description: 'Motion, grid, logical reasoning, and behavioural practice',
      practiceUrl: 'https://www.indiabix.com/logical-reasoning/questions-and-answers/',
      practiceLabel: 'Reasoning practice'
    },
    {
      id: 'coding',
      name: 'Coding Assessment',
      icon: '💻',
      questions: 4,
      duration: 60,
      description: 'Two hard DSA problems, one SQL problem, and one frontend skeleton task',
      topics: ['Hard DSA', 'SQL JOINs', 'React/JavaScript', 'HTML/CSS'],
      practiceUrl: 'https://leetcode.com/',
      practiceLabel: 'Open coding platform',
      isExternal: true
    }
  ],
  questionBank: {
    ai_literacy: [
      { id: 'cg_ai_1', topic: 'AI Foundations', question: 'What is the main role of a large language model?', options: ['Store exact copies of every webpage', 'Predict likely token sequences from context', 'Replace every database', 'Encrypt all network traffic'], answer: 1, explanation: 'LLMs generate text by predicting likely next tokens from learned patterns and context.' },
      { id: 'cg_ai_2', topic: 'AI Foundations', question: 'What does an embedding represent?', options: ['A vector representation of meaning or features', 'A database password', 'A browser cookie', 'A compiled binary only'], answer: 0, explanation: 'Embeddings represent items as vectors so semantic similarity can be measured.' },
      { id: 'cg_ai_3', topic: 'Generative AI', question: 'Which is a generative AI task?', options: ['Sorting a fixed array', 'Creating a summary from a document', 'Checking a CPU temperature', 'Opening a network port'], answer: 1, explanation: 'Generating a summary is a content-generation task.' },
      { id: 'cg_ai_4', topic: 'Prompt Engineering', question: 'Which prompt is most precise?', options: ['Fix this', 'Explain the bug, preserve the API, show a patch, and add a test', 'Make it good', 'Write code'], answer: 1, explanation: 'A precise prompt provides context, constraints, output format, and validation.' },
      { id: 'cg_ai_5', topic: 'Prompt Engineering', question: 'Why provide an output format in a prompt?', options: ['To constrain the response into a usable structure', 'To increase monitor brightness', 'To remove all model errors', 'To disable validation'], answer: 0, explanation: 'An explicit format makes the response easier to parse and review.' },
      { id: 'cg_ai_6', topic: 'Prompt Engineering', question: 'What is few-shot prompting?', options: ['Giving examples of the desired input-output behaviour', 'Using only one word', 'Running a prompt offline', 'Deleting the context'], answer: 0, explanation: 'Few-shot prompts include examples that guide the expected response pattern.' },
      { id: 'cg_ai_7', topic: 'RAG', question: 'What problem does retrieval-augmented generation address?', options: ['It supplies relevant external context to the model', 'It replaces CSS', 'It guarantees perfect reasoning', 'It removes the need for data'], answer: 0, explanation: 'RAG retrieves relevant information and places it in the model context.' },
      { id: 'cg_ai_8', topic: 'RAG', question: 'Why are document chunks used in a retrieval system?', options: ['To search and provide focused context', 'To make documents unreadable', 'To remove metadata', 'To avoid indexing'], answer: 0, explanation: 'Chunks make retrieval more focused and fit within context limits.' },
      { id: 'cg_ai_9', topic: 'AI Agents', question: 'What distinguishes an AI agent from a single prompt response?', options: ['It can plan, use tools, and act across steps', 'It never uses context', 'It only generates CSS', 'It cannot inspect results'], answer: 0, explanation: 'Agents typically combine planning, tool use, observations, and multiple steps.' },
      { id: 'cg_ai_10', topic: 'AI Agents', question: 'Why should an agent tool have a clear schema?', options: ['It defines valid inputs and predictable outputs', 'It hides all errors', 'It prevents logging', 'It removes authorization'], answer: 0, explanation: 'Schemas reduce ambiguity and make tool calls safer to validate.' },
      { id: 'cg_ai_11', topic: 'Evaluation', question: 'What is a regression test for an AI feature?', options: ['A fixed case used to detect behaviour changes', 'A random prompt with no expected result', 'A UI colour choice', 'A production password'], answer: 0, explanation: 'Regression cases compare future behaviour with an expected baseline.' },
      { id: 'cg_ai_12', topic: 'Evaluation', question: 'What should be checked before accepting AI-generated code?', options: ['Tests, edge cases, security, and maintainability', 'Only whether it looks short', 'Only the variable names', 'Nothing if it compiles'], answer: 0, explanation: 'Generated code still requires normal engineering review and validation.' },
      { id: 'cg_ai_13', topic: 'Responsible AI', question: 'What is data minimization?', options: ['Collecting only data needed for the stated purpose', 'Collecting every possible field', 'Removing all access controls', 'Duplicating private data'], answer: 0, explanation: 'Data minimization reduces privacy and security exposure.' },
      { id: 'cg_ai_14', topic: 'Responsible AI', question: 'What is a hallucination in an AI response?', options: ['A confident but unsupported or false claim', 'A successful unit test', 'A valid database join', 'A compressed image'], answer: 0, explanation: 'Hallucinations are generated claims that are not grounded in reliable evidence.' },
      { id: 'cg_ai_15', topic: 'Responsible AI', question: 'Which practice helps protect confidential code sent to an AI tool?', options: ['Use approved tools and remove unnecessary secrets', 'Paste production credentials', 'Disable authentication', 'Share all customer records'], answer: 0, explanation: 'Approved tools and secret removal reduce accidental disclosure.' },
      { id: 'cg_ai_16', topic: 'AI Productivity', question: 'What is a good use of AI in debugging?', options: ['Suggest hypotheses that the developer validates with tests', 'Accept every suggestion blindly', 'Skip reproducing the defect', 'Remove error handling'], answer: 0, explanation: 'AI can accelerate investigation, but the developer must verify the result.' },
      { id: 'cg_ai_17', topic: 'AI Productivity', question: 'What context is most useful when asking AI to explain a failure?', options: ['Error, relevant code, inputs, expected result, and actual result', 'Only the project name', 'Only the word error', 'An unrelated screenshot'], answer: 0, explanation: 'Concrete failure context allows a more targeted explanation.' },
      { id: 'cg_ai_18', topic: 'Model Limits', question: 'What does a context window limit affect?', options: ['How much input and conversation the model can consider at once', 'The monitor size', 'The keyboard layout', 'The database schema only'], answer: 0, explanation: 'The context window limits the amount of information available in one model call.' },
      { id: 'cg_ai_19', topic: 'Model Limits', question: 'Why should important AI output be grounded in sources?', options: ['Sources make claims easier to verify', 'Sources guarantee no bugs', 'Sources remove all bias', 'Sources replace testing'], answer: 0, explanation: 'Grounding enables review and reduces unsupported claims.' },
      { id: 'cg_ai_20', topic: 'AI Governance', question: 'Who remains accountable for using AI-generated code in a product?', options: ['The engineering team and organization using it', 'The model alone', 'The browser', 'Nobody'], answer: 0, explanation: 'Human teams remain responsible for decisions, quality, and compliance.' }
    ],
    technical_assessment: [
      { id: 'cg_tech_1', topic: 'Programming Logic', question: 'What is the time complexity of a loop that doubles i until n?', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'], answer: 1, explanation: 'The values grow exponentially, so there are logarithmic iterations.' },
      { id: 'cg_tech_2', topic: 'Programming Logic', question: 'Which structure follows last-in-first-out order?', options: ['Queue', 'Stack', 'Graph', 'Hash table'], answer: 1, explanation: 'A stack removes the most recently inserted item first.' },
      { id: 'cg_tech_3', topic: 'Arrays', question: 'Which technique finds a pair sum in O(n) average time?', options: ['Nested loops only', 'Hash map lookup', 'Bubble sort only', 'Depth-first search'], answer: 1, explanation: 'A hash map stores complements for constant-average lookup.' },
      { id: 'cg_tech_4', topic: 'Strings', question: 'Which structure is useful for counting character frequencies?', options: ['Hash map', 'Stack only', 'Queue only', 'Linked list only'], answer: 0, explanation: 'A hash map maps each character to its frequency.' },
      { id: 'cg_tech_5', topic: 'Searching', question: 'Binary search requires which property?', options: ['Sorted search space', 'A graph cycle', 'A hash collision', 'A recursive function always'], answer: 0, explanation: 'Binary search eliminates half of an ordered search space at each step.' },
      { id: 'cg_tech_6', topic: 'Sorting', question: 'What is the average complexity of merge sort?', options: ['O(log n)', 'O(n)', 'O(n log n)', 'O(n^2) always'], answer: 2, explanation: 'Merge sort divides and merges in O(n log n) time.' },
      { id: 'cg_tech_7', topic: 'DBMS', question: 'What does a primary key provide?', options: ['A unique identifier for each row', 'Duplicate row storage', 'Automatic encryption', 'A network route'], answer: 0, explanation: 'A primary key uniquely identifies records.' },
      { id: 'cg_tech_8', topic: 'SQL', question: 'Which clause filters groups after aggregation?', options: ['WHERE', 'HAVING', 'ORDER BY', 'FROM'], answer: 1, explanation: 'HAVING filters grouped aggregate results.' },
      { id: 'cg_tech_9', topic: 'SQL', question: 'Which JOIN keeps all rows from the left table?', options: ['INNER JOIN', 'LEFT JOIN', 'CROSS JOIN only', 'RIGHT JOIN only'], answer: 1, explanation: 'LEFT JOIN preserves every left-side row.' },
      { id: 'cg_tech_10', topic: 'SQL', question: 'What does GROUP BY do?', options: ['Combines rows into groups for aggregation', 'Deletes duplicate tables', 'Creates an index automatically', 'Encrypts columns'], answer: 0, explanation: 'GROUP BY forms groups that aggregate functions can summarize.' },
      { id: 'cg_tech_11', topic: 'OOP', question: 'What is polymorphism?', options: ['One interface with multiple implementations', 'One variable with no type', 'Deleting inherited methods', 'Encrypting objects'], answer: 0, explanation: 'Polymorphism allows a common interface to have different implementations.' },
      { id: 'cg_tech_12', topic: 'HTTP', question: 'Which status code means a resource was not found?', options: ['200', '201', '404', '500'], answer: 2, explanation: 'HTTP 404 indicates that the requested resource was not found.' },
      { id: 'cg_tech_13', topic: 'REST APIs', question: 'Which method is commonly used to partially update a resource?', options: ['GET', 'PATCH', 'TRACE', 'HEAD'], answer: 1, explanation: 'PATCH is commonly used for partial updates.' },
      { id: 'cg_tech_14', topic: 'Operating Systems', question: 'What is a process?', options: ['A program in execution', 'A CSS selector', 'A database column', 'A network cable'], answer: 0, explanation: 'A process is an executing instance of a program.' },
      { id: 'cg_tech_15', topic: 'Networking', question: 'Which protocol translates domain names to IP addresses?', options: ['DNS', 'FTP', 'SSH', 'SMTP'], answer: 0, explanation: 'DNS resolves domain names to IP addresses.' },
      { id: 'cg_tech_16', topic: 'Cloud', question: 'What does horizontal scaling usually mean?', options: ['Adding more instances', 'Increasing one machine’s RAM only', 'Deleting replicas', 'Changing a font size'], answer: 0, explanation: 'Horizontal scaling adds instances to share workload.' },
      { id: 'cg_tech_17', topic: 'Security', question: 'What is the safest place for a password in a database?', options: ['Plain text', 'A salted slow hash', 'A URL parameter', 'A CSS file'], answer: 1, explanation: 'Passwords should be stored using an appropriate salted password hash.' },
      { id: 'cg_tech_18', topic: 'Git', question: 'What does a commit represent?', options: ['A recorded set of repository changes', 'A database join', 'A browser refresh', 'A cloud region'], answer: 0, explanation: 'A commit records a snapshot of changes in version control.' },
      { id: 'cg_tech_19', topic: 'Web Fundamentals', question: 'What does the DOM represent?', options: ['The document as an object tree', 'A database index', 'A CPU scheduler', 'A network packet'], answer: 0, explanation: 'The DOM models an HTML document as an object tree.' },
      { id: 'cg_tech_20', topic: 'Testing', question: 'What is a regression test?', options: ['A test that catches a previously fixed defect returning', 'A random manual click', 'A production deployment', 'A code formatter'], answer: 0, explanation: 'Regression tests protect behaviour that previously worked or was fixed.' }
    ],
    english_communication: [
      {
        id: 'cg_eng_1',
        topic: 'Reading',
        question: 'Choose the clearest professional sentence.',
        options: ['Send the report when done.', 'Please send the completed report by 5 PM.', 'Report send fast.', 'You sending report?'],
        answer: 1,
        explanation: 'The second sentence is specific, polite, and professional.'
      },
      {
        id: 'cg_eng_2',
        topic: 'Grammar',
        question: 'Choose the correct sentence.',
        options: ['The team have finished the task.', 'The team has finished the task.', 'The team finishing task.', 'The team finish the task yesterday.'],
        answer: 1,
        explanation: 'In this context, team is treated as a singular collective noun.'
      }
    ],
    problem_solving: [
      {
        id: 'cg_ps_1',
        topic: 'Logic',
        question: 'A process doubles its output each hour. If it produces 3 units in hour 1, how many units does it produce in hour 5?',
        options: ['12', '24', '48', '96'],
        answer: 2,
        explanation: 'The sequence is 3, 6, 12, 24, 48.'
      },
      {
        id: 'cg_ps_2',
        topic: 'Algorithms',
        question: 'Which data structure is best for breadth-first traversal of a graph?',
        options: ['Stack', 'Queue', 'Heap only', 'Hash set only'],
        answer: 1,
        explanation: 'Breadth-first traversal processes nodes in first-in-first-out order.'
      }
    ],
    ai_debugging: [
      {
        id: 'cg_dbg_1',
        topic: 'Debugging',
        question: 'A loop accesses array[i] while i <= array.length. What is the likely defect?',
        options: ['The loop should start at 1.', 'The final access is out of bounds.', 'Arrays cannot use loops.', 'The array must be sorted.'],
        answer: 1,
        explanation: 'The last valid index is array.length - 1, so <= causes an out-of-bounds access.'
      },
      {
        id: 'cg_dbg_2',
        topic: 'JavaScript',
        question: 'A UI handler reads input.value before the input element is queried. What should be fixed first?',
        options: ['Add a second stylesheet.', 'Query the element before reading its value.', 'Convert the value to an array.', 'Remove the event handler.'],
        answer: 1,
        explanation: 'The element reference must exist before its value property is accessed.'
      }
    ],
    ai_feature_development: [
      {
        id: 'cg_feat_1',
        topic: 'React',
        question: 'Which React practice prevents a list warning when rendering items from an array?',
        options: ['Use a stable key for each item.', 'Put all items in one string.', 'Use document.write.', 'Reload the page after every render.'],
        answer: 0,
        explanation: 'React uses stable keys to track list items between renders.'
      },
      {
        id: 'cg_feat_2',
        topic: 'Frontend',
        question: 'Which approach is best for a reusable form field component?',
        options: ['Hard-code every field label.', 'Accept label, value, and onChange as props.', 'Store values in global HTML attributes only.', 'Use inline SQL in the component.'],
        answer: 1,
        explanation: 'Props make the component reusable and keep state flow explicit.'
      }
    ],
    prompt_engineering: [
      {
        id: 'cg_prompt_1',
        topic: 'Prompt Design',
        question: 'Which prompt is most useful for asking an AI to fix a defect?',
        options: ['Fix it.', 'Make this better.', 'Explain the error, preserve the public API, show the patch, and add a regression test.', 'Write anything.'],
        answer: 2,
        explanation: 'A strong prompt supplies context, constraints, output format, and validation requirements.'
      },
      {
        id: 'cg_prompt_2',
        topic: 'Evaluation',
        question: 'What should be included when asking AI to generate a feature safely?',
        options: ['Only the feature name.', 'Requirements, constraints, existing interfaces, and acceptance tests.', 'A random example.', 'No expected behaviour.'],
        answer: 1,
        explanation: 'The model needs requirements and acceptance criteria to produce verifiable work.'
      }
    ],
    cognitive_assessment: [
      {
        id: 'cg_cog_1',
        topic: 'Logical Reasoning',
        question: 'If every blue tile is adjacent to a red tile and tile A is blue, what must be true?',
        options: ['A has a red neighbour.', 'A is always in the centre.', 'A cannot move.', 'All tiles are red.'],
        answer: 0,
        explanation: 'The condition directly guarantees a red adjacent tile.'
      },
      {
        id: 'cg_cog_2',
        topic: 'Patterns',
        question: 'Which sequence follows the pattern 2, 6, 12, 20, ...?',
        options: ['Add consecutive even numbers.', 'Multiply by 2.', 'Add 3 each time.', 'Subtract consecutive numbers.'],
        answer: 0,
        explanation: 'The differences are 4, 6, 8, so the next difference is 10.'
      }
    ],
    coding: [
      {
        id: 'cg_dsa_1',
        category: 'dsa',
        title: 'Longest Consecutive Sequence',
        difficulty: 'Hard',
        topics: ['DSA', 'Hash Set', 'Arrays'],
        link: 'https://leetcode.com/problems/longest-consecutive-sequence/',
        description: 'Find the longest consecutive sequence in an unsorted array in O(n) expected time.'
      },
      {
        id: 'cg_dsa_2',
        category: 'dsa',
        title: 'Minimum Window Substring',
        difficulty: 'Hard',
        topics: ['DSA', 'Strings', 'Sliding Window'],
        link: 'https://leetcode.com/problems/minimum-window-substring/',
        description: 'Find the smallest substring of s containing every character of t with the required frequency.'
      },
      {
        id: 'cg_sql_1',
        category: 'sql',
        title: 'Department Highest Salary',
        difficulty: 'Medium',
        topics: ['SQL', 'JOIN', 'GROUP BY', 'HAVING'],
        link: 'https://leetcode.com/problems/department-highest-salary/',
        description: 'Use joins and aggregation to return employees with the highest salary in each department.'
      },
      {
        id: 'cg_front_1',
        category: 'frontend',
        title: 'React Searchable Todo Skeleton',
        difficulty: 'Hard',
        topics: ['Frontend', 'React', 'JavaScript', 'HTML/CSS', 'DOM'],
        link: 'https://react.dev/learn/sharing-state-between-components',
        description: 'Complete a starter React/HTML/CSS application so users can add, filter, toggle, and remove todos while keeping state shared between components.'
      }
    ]
  }
};
