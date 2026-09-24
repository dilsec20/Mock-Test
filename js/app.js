// =====================================================
// MockPrep — Landing Page Logic
// =====================================================

const COMPANIES = [
  {
    id: 'accenture',
    name: 'Accenture',
    logo: 'A>',
    examDate: '2026-09-28',
    examName: 'Accenture Campus Recruitment',
    dataFile: 'data/accenture.json',
    color: '#A100FF',
    sections: ['Technical MCQ', 'Grammar MCQ', 'Speaking Test (Pearson)', 'Gamified Cognitive Games', 'Coding'],
    stats: {
      questions: '650+ Pool',
      duration: '70 min',
      tests: '6 Modules'
    },
    features: ['No Negative Marking', 'Gamified Mini-Games (Bubble & Mazes)', 'Pearson Spoken English', 'Mic & Voice Evaluated']
  },
  {
    id: 'capgemini',
    name: 'Capgemini',
    logo: 'C>',
    examDate: '2026-10-15',
    examName: 'Capgemini New Hiring Assessment',
    dataFile: 'data/capgemini-data.js',
    color: '#0070AD',
    sections: ['AI Literacy', 'Technical Assessment', 'AI-assisted Debugging', 'AI-assisted Feature Development', 'Hard Coding'],
    stats: {
      questions: '40 MCQs',
      duration: '45 min',
      tests: '2 Sections'
    },
    features: ['alpha_<stack> / root_<mind>', '10+ Coding Mocks', 'Hard DSA', 'Java / C++ Debugging', 'React / JavaScript / HTML / CSS', 'AI, Cloud, APIs & DevOps']
  }
];

// ── Initialize ──
document.addEventListener('DOMContentLoaded', () => {
  renderCompanyCards();
  initCountdown();
});

// ── Render Company Cards ──
function renderCompanyCards() {
  const grid = document.getElementById('companies-grid');
  if (!grid) return;

  grid.innerHTML = COMPANIES.map((company, index) => {
    const daysLeft = getDaysLeft(company.examDate);
    const isUpcoming = daysLeft >= 0;
    const urgencyClass = daysLeft <= 3 ? 'color: var(--accent-red);' :
                         daysLeft <= 7 ? 'color: var(--accent-orange);' :
                         'color: var(--accent-green);';

    return `
      <div class="company-card" style="animation-delay: ${index * 0.1}s">
        <div class="company-card-header">
          <div class="company-logo" style="background: ${company.color}">${company.logo}</div>
          <div>
            <h3>${company.name}</h3>
            <div class="exam-date">
              ${isUpcoming ? `📅 Exam: ${formatDate(company.examDate)} • <span style="${urgencyClass} font-weight: 700;">${daysLeft} days left</span>` : '✅ Exam Completed'}
            </div>
          </div>
        </div>

        <div class="company-card-body">
          <div class="company-sections">
            ${company.sections.map(s => `<span class="section-tag">${s}</span>`).join('')}
          </div>

          <div class="company-stats">
            <div class="stat-item">
              <div class="stat-number">${company.stats.questions}</div>
              <div class="stat-label">Questions</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">${company.stats.duration}</div>
              <div class="stat-label">Duration</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">${company.stats.tests}</div>
              <div class="stat-label">Sections</div>
            </div>
          </div>

          <div style="display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: var(--space-md);">
            ${company.features.map(f => `<span style="font-size: 0.7rem; color: var(--accent-green); background: rgba(16,185,129,0.1); padding: 2px 8px; border-radius: 999px;">✓ ${f}</span>`).join('')}
          </div>
        </div>

        <div class="company-card-actions">
          <button class="btn btn-primary btn-lg" onclick="startTest('${company.id}')" id="start-btn-${company.id}">
            🚀 Start Mock Test
          </button>
        </div>
      </div>
    `;
  }).join('');
}

// ── Countdown Timer ──
function initCountdown() {
  const upcoming = COMPANIES
    .filter(c => getDaysLeft(c.examDate) >= 0)
    .sort((a, b) => new Date(a.examDate) - new Date(b.examDate));

  if (upcoming.length === 0) return;

  const nearest = upcoming[0];
  const section = document.getElementById('countdown-section');
  const nameEl = document.getElementById('nearest-exam-name');

  if (section) section.classList.remove('hidden');
  if (nameEl) nameEl.textContent = `${nearest.name} — ${formatDate(nearest.examDate)}`;

  updateCountdown(nearest.examDate);
  setInterval(() => updateCountdown(nearest.examDate), 1000);
}

function updateCountdown(targetDate) {
  const now = new Date();
  const target = new Date(targetDate + 'T09:00:00+05:30');
  const diff = target - now;

  if (diff <= 0) {
    document.getElementById('cd-days').textContent = '00';
    document.getElementById('cd-hours').textContent = '00';
    document.getElementById('cd-mins').textContent = '00';
    document.getElementById('cd-secs').textContent = '00';
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const secs = Math.floor((diff % (1000 * 60)) / 1000);

  document.getElementById('cd-days').textContent = String(days).padStart(2, '0');
  document.getElementById('cd-hours').textContent = String(hours).padStart(2, '0');
  document.getElementById('cd-mins').textContent = String(mins).padStart(2, '0');
  document.getElementById('cd-secs').textContent = String(secs).padStart(2, '0');
}

// ── Start Test ──
function startTest(companyId) {
  window.location.href = `test.html?company=${companyId}`;
}

// ── Utilities ──
function getDaysLeft(dateStr) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target - now) / (1000 * 60 * 60 * 24));
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}
