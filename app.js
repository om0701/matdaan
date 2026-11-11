/**
 * MATDAAN — NATIONAL ELECTRONIC VOTING SYSTEM
 * Sovereign Civic Frontend Engine
 * Preserves all Java Backend APIs, localStorage persistence,
 * strict electoral validation, one-vote enforcement, and admin custody.
 */

// Registered Parties in strict alphabetical order with NOTA last
const PARTIES = [
  {
    code: 'AAP',
    name: 'Aam Aadmi Party',
    border: '#0F766E',
    symbolSvg: `<svg class="candidate-symbol-svg" viewBox="0 0 40 40" fill="none" aria-label="Broom symbol">
      <path d="M8 32 L22 18" stroke="#101B36" stroke-width="3" stroke-linecap="round"/>
      <path d="M20 20 L34 6 L36 8 L22 22 Z" fill="#8B5A2B"/>
      <path d="M8 32 C6 30 5 35 7 36 C9 37 14 36 12 34 Z" fill="#0F766E"/>
      <path d="M12 28 L6 34 M14 26 L8 36 M16 24 L11 37" stroke="#0F766E" stroke-width="2" stroke-linecap="round"/>
    </svg>`
  },
  {
    code: 'BJP',
    name: 'Bharatiya Janata Party',
    border: '#C2410C',
    symbolSvg: `<svg class="candidate-symbol-svg" viewBox="0 0 40 40" fill="none" aria-label="Lotus symbol">
      <path d="M20 8 C18 16 16 24 20 28 C24 24 22 16 20 8 Z" fill="#C2410C"/>
      <path d="M20 18 C14 18 10 23 12 28 C15 28 18 26 20 24 Z" fill="#F28C28"/>
      <path d="M20 18 C26 18 30 23 28 28 C25 28 22 26 20 24 Z" fill="#F28C28"/>
      <path d="M12 28 C8 26 6 30 10 32 C14 32 17 30 20 28 Z" fill="#C2410C"/>
      <path d="M28 28 C32 26 34 30 30 32 C26 32 23 30 20 28 Z" fill="#C2410C"/>
      <path d="M20 28 L20 36" stroke="#138A59" stroke-width="2.5" stroke-linecap="round"/>
    </svg>`
  },
  {
    code: 'BSP',
    name: 'Bahujan Samaj Party',
    border: '#1D4ED8',
    symbolSvg: `<svg class="candidate-symbol-svg" viewBox="0 0 40 40" fill="none" aria-label="Elephant symbol">
      <path d="M8 26 C8 20 12 14 20 14 C26 14 30 18 32 22 C34 26 31 30 29 30 L29 34 L26 34 L26 28 L22 28 L22 34 L19 34 L19 28 L14 28 L14 34 L11 34 L11 26 Z" fill="#1D4ED8"/>
      <circle cx="26" cy="18" r="1.5" fill="#FFFFFF"/>
      <path d="M31 22 C33 22 35 24 35 28" stroke="#1D4ED8" stroke-width="2" stroke-linecap="round"/>
    </svg>`
  },
  {
    code: 'CPI(M)',
    name: 'Communist Party of India (Marxist)',
    border: '#B91C1C',
    symbolSvg: `<svg class="candidate-symbol-svg" viewBox="0 0 40 40" fill="none" aria-label="Hammer and Sickle symbol">
      <path d="M20 6 L21.5 10.5 L26 10.5 L22.5 13 L24 17.5 L20 15 L16 17.5 L17.5 13 L14 10.5 L18.5 10.5 Z" fill="#B91C1C"/>
      <path d="M12 32 C12 22 20 16 28 18 C28 22 24 28 16 30" stroke="#B91C1C" stroke-width="3" stroke-linecap="round" fill="none"/>
      <line x1="14" y1="20" x2="28" y2="34" stroke="#101B36" stroke-width="3" stroke-linecap="round"/>
      <rect x="22" y="16" width="10" height="5" rx="1" transform="rotate(45 22 16)" fill="#B91C1C"/>
    </svg>`
  },
  {
    code: 'INC',
    name: 'Indian National Congress',
    border: '#047857',
    symbolSvg: `<svg class="candidate-symbol-svg" viewBox="0 0 40 40" fill="none" aria-label="Hand symbol">
      <path d="M14 20 V12 C14 10.5 16 10.5 16 12 V18 M16 12 V8 C16 6.5 18 6.5 18 8 V18 M18 8 V10 C18 8.5 20 8.5 20 10 V18 M20 10 V14 C20 12.5 22 12.5 22 14 V24 C22 28 19 32 15 32 C12 32 11 30 11 27 V23 C11 21 14 20 14 20 Z" stroke="#047857" stroke-width="2.2" stroke-linejoin="round" fill="#E8F5E9"/>
    </svg>`
  },
  {
    code: 'TMC',
    name: 'All India Trinamool Congress',
    border: '#0284C7',
    symbolSvg: `<svg class="candidate-symbol-svg" viewBox="0 0 40 40" fill="none" aria-label="Twin Flowers symbol">
      <circle cx="15" cy="14" r="5" fill="#0284C7"/>
      <circle cx="15" cy="14" r="2" fill="#FFFFFF"/>
      <circle cx="25" cy="12" r="5" fill="#0284C7"/>
      <circle cx="25" cy="12" r="2" fill="#FFFFFF"/>
      <path d="M15 19 C15 24 17 28 20 32 M25 17 C25 23 23 28 20 32" stroke="#047857" stroke-width="2" stroke-linecap="round"/>
      <path d="M12 34 C16 31 24 31 28 34" stroke="#047857" stroke-width="3" stroke-linecap="round"/>
    </svg>`
  },
  {
    code: 'NOTA',
    name: 'None of the Above',
    border: '#6B7280',
    symbolSvg: `<svg class="candidate-symbol-svg" viewBox="0 0 40 40" fill="none" aria-label="NOTA symbol">
      <rect x="8" y="10" width="24" height="20" rx="3" fill="#F8F6F0" stroke="#6B7280" stroke-width="2"/>
      <line x1="12" y1="14" x2="28" y2="26" stroke="#B3261E" stroke-width="3" stroke-linecap="round"/>
      <line x1="28" y1="14" x2="12" y2="26" stroke="#B3261E" stroke-width="3" stroke-linecap="round"/>
    </svg>`
  }
];

// LocalStorage Keys
const STORAGE_KEYS = {
  VOTERS: 'matdaan_voters',
  VOTES: 'matdaan_votes',
  CURRENT_VOTER_ID: 'matdaan_session_voter_id',
  ADMIN_LOGGED_IN: 'matdaan_session_admin_auth'
};

// Runtime Selection State
let pendingPartySelection = null;
let lastAnimatedStats = { registered: -1, votes: -1 };

// ==========================================================================
// STORAGE HELPERS (Safe try/catch wrappers)
// ==========================================================================

function getStoredVoters() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.VOTERS);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Failed to read voters from localStorage:', err);
    return [];
  }
}

function saveStoredVoters(voters) {
  try {
    localStorage.setItem(STORAGE_KEYS.VOTERS, JSON.stringify(voters));
    return true;
  } catch (err) {
    console.error('Failed to save voters to localStorage:', err);
    return false;
  }
}

function getStoredVotes() {
  const defaultVotes = {
    'AAP': 0, 'BJP': 0, 'BSP': 0, 'CPI(M)': 0, 'INC': 0, 'TMC': 0, 'NOTA': 0
  };

  try {
    const raw = localStorage.getItem(STORAGE_KEYS.VOTES);
    if (!raw) return defaultVotes;
    const parsed = JSON.parse(raw);
    PARTIES.forEach(p => {
      if (typeof parsed[p.code] !== 'number') parsed[p.code] = 0;
    });
    return parsed;
  } catch (err) {
    console.error('Failed to read votes from localStorage:', err);
    return defaultVotes;
  }
}

function saveStoredVotes(votes) {
  try {
    localStorage.setItem(STORAGE_KEYS.VOTES, JSON.stringify(votes));
    return true;
  } catch (err) {
    console.error('Failed to save votes to localStorage:', err);
    return false;
  }
}

function getActiveVoter() {
  const voterId = localStorage.getItem(STORAGE_KEYS.CURRENT_VOTER_ID);
  if (!voterId) return null;
  const voters = getStoredVoters();
  return voters.find(v => v.id === voterId) || null;
}

function setActiveVoter(voterId) {
  if (voterId) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_VOTER_ID, voterId);
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_VOTER_ID);
  }
}

function isAdminAuthenticated() {
  return localStorage.getItem(STORAGE_KEYS.ADMIN_LOGGED_IN) === 'true';
}

function setAdminAuthenticated(status) {
  if (status) {
    localStorage.setItem(STORAGE_KEYS.ADMIN_LOGGED_IN, 'true');
  } else {
    localStorage.removeItem(STORAGE_KEYS.ADMIN_LOGGED_IN);
  }
}

// Generate unique Voter ID in format VTR + 6 digits
function generateUniqueVoterId(existingVoters) {
  const existingIds = new Set(existingVoters.map(v => v.id));
  let candidateId;
  do {
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    candidateId = `VTR${randomDigits}`;
  } while (existingIds.has(candidateId));
  return candidateId;
}

function formatDisplayDateTime(date) {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: true
  }).format(date);
}

// ==========================================================================
// INLINE MESSAGING HELPERS
// ==========================================================================

function showInlineError(elementId, message) {
  const el = document.getElementById(elementId);
  if (!el) return;
  el.textContent = message;
  el.classList.remove('hidden');
}

function hideInlineError(elementId) {
  const el = document.getElementById(elementId);
  if (!el) return;
  el.textContent = '';
  el.classList.add('hidden');
}

function showInlineSuccess(elementId, message) {
  const el = document.getElementById(elementId);
  if (!el) return;
  el.textContent = message;
  el.classList.remove('hidden');
}

function hideInlineSuccess(elementId) {
  const el = document.getElementById(elementId);
  if (!el) return;
  el.textContent = '';
  el.classList.add('hidden');
}

// ==========================================================================
// ANIMATED NUMBER COUNTER
// ==========================================================================

function animateNumber(element, startVal, endVal, duration = 800) {
  if (!element) return;
  if (startVal === endVal || typeof requestAnimationFrame === 'undefined') {
    element.textContent = endVal.toLocaleString('en-IN');
    return;
  }

  const startTime = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();

  function update(currentTime) {
    const now = (typeof performance !== 'undefined' && performance.now) ? currentTime : Date.now();
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const easeProgress = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(startVal + (endVal - startVal) * easeProgress);

    element.textContent = current.toLocaleString('en-IN');

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = endVal.toLocaleString('en-IN');
    }
  }

  requestAnimationFrame(update);
}

// ==========================================================================
// ROUTING & VIEW NAVIGATION
// ==========================================================================

const VALID_VIEWS = ['home', 'register', 'login', 'dashboard', 'vote', 'admin'];

function switchView(targetView) {
  let viewName = targetView;

  // Handle smooth scroll anchor aliases
  if (viewName === 'how-it-works' || viewName === 'security-trust' || viewName === 'election-stats') {
    viewName = 'home';
  } else if (!VALID_VIEWS.includes(viewName)) {
    viewName = 'home';
  }

  // Guard: if navigating to #dashboard or #vote without an active voter, redirect to login
  if (viewName === 'dashboard' || viewName === 'vote') {
    const voter = getActiveVoter();
    if (!voter) {
      window.location.hash = '#login';
      return;
    }
  }

  VALID_VIEWS.forEach(v => {
    const section = document.getElementById(`view-${v}`);
    const navLink = document.getElementById(`nav-${v}`);
    if (section) {
      if (v === viewName) {
        section.classList.add('active-view');
      } else {
        section.classList.remove('active-view');
      }
    }
    if (navLink) {
      if (v === viewName) {
        navLink.classList.add('active');
        navLink.setAttribute('aria-current', 'page');
      } else {
        navLink.classList.remove('active');
        navLink.removeAttribute('aria-current');
      }
    }
  });

  // Handle in-page smooth scrolling if hash was an anchor section
  if (targetView === 'how-it-works' || targetView === 'security-trust' || targetView === 'election-stats') {
    setTimeout(() => {
      const anchorEl = document.getElementById(targetView);
      if (anchorEl) {
        anchorEl.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Trigger view updates
  if (viewName === 'home') {
    updateHomeMetrics();
  } else if (viewName === 'dashboard') {
    renderVoterDashboard();
  } else if (viewName === 'vote') {
    renderVotingBooth();
  } else if (viewName === 'admin') {
    renderAdminPortal();
  }
}

function handleHashChange() {
  const rawHash = window.location.hash.replace('#', '').trim();
  switchView(rawHash);

  // Close mobile drawer on navigation
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileToggle = document.getElementById('btn-mobile-menu');
  if (mobileDrawer && mobileDrawer.classList.contains('open')) {
    mobileDrawer.classList.remove('open');
    if (mobileToggle) mobileToggle.setAttribute('aria-expanded', 'false');
  }
}

// ==========================================================================
// VIEW 1: HOME & ANIMATED METRICS
// ==========================================================================

function updateHomeMetrics() {
  const voters = getStoredVoters();
  const votes = getStoredVotes();

  const totalRegistered = voters.length;
  const totalVotesCast = Object.values(votes).reduce((sum, n) => sum + n, 0);
  const turnoutPct = totalRegistered > 0
    ? ((totalVotesCast / totalRegistered) * 100).toFixed(1)
    : '0.0';

  const regEl = document.getElementById('home-registered-count');
  const votesEl = document.getElementById('home-votes-count');
  const turnoutEl = document.getElementById('home-turnout-pct');

  if (regEl) {
    const prevReg = lastAnimatedStats.registered >= 0 ? lastAnimatedStats.registered : 0;
    animateNumber(regEl, prevReg, totalRegistered);
    lastAnimatedStats.registered = totalRegistered;
  }

  if (votesEl) {
    const prevVotes = lastAnimatedStats.votes >= 0 ? lastAnimatedStats.votes : 0;
    animateNumber(votesEl, prevVotes, totalVotesCast);
    lastAnimatedStats.votes = totalVotesCast;
  }

  if (turnoutEl) turnoutEl.textContent = `${turnoutPct}%`;
}

// ==========================================================================
// VIEW 2: SIGN UP (REGISTRATION)
// ==========================================================================

function initRegisterView() {
  const form = document.getElementById('registration-form');
  const proceedBtn = document.getElementById('btn-proceed-to-login');
  const registerAnotherBtn = document.getElementById('btn-register-another');

  if (form) {
    form.addEventListener('submit', handleRegistrationSubmit);
  }

  if (proceedBtn) {
    proceedBtn.addEventListener('click', () => {
      window.location.hash = '#login';
    });
  }

  if (registerAnotherBtn) {
    registerAnotherBtn.addEventListener('click', resetRegistrationForm);
  }
}

function handleRegistrationSubmit(e) {
  e.preventDefault();
  hideInlineError('register-error');

  const nameInput = document.getElementById('reg-name');
  const ageInput = document.getElementById('reg-age');
  const stateInput = document.getElementById('reg-state');
  const pinInput = document.getElementById('reg-pin');

  const fullName = nameInput.value.trim();
  const rawAge = ageInput.value.trim();
  const age = parseInt(rawAge, 10);
  const state = stateInput.value.trim();
  const pin = pinInput.value.trim();

  // 1. Name validation
  if (!fullName || fullName.length < 2) {
    showInlineError('register-error', 'Please enter your full legal name as it appears on official records.');
    nameInput.focus();
    return;
  }

  // 2. Age validation (must be 18+)
  if (!rawAge || isNaN(age)) {
    showInlineError('register-error', 'Please enter your age in years.');
    ageInput.focus();
    return;
  }

  if (age < 18) {
    showInlineError(
      'register-error',
      'Registration declined: You must be at least 18 years of age to register as an elector (Article 326 of the Constitution of India).'
    );
    ageInput.focus();
    return;
  }

  if (age > 120) {
    showInlineError('register-error', 'Please enter a valid age between 18 and 120.');
    ageInput.focus();
    return;
  }

  // 3. State validation
  if (!state) {
    showInlineError('register-error', 'Please select your State or Union Territory from the list.');
    stateInput.focus();
    return;
  }

  // 4. PIN validation (must be exactly 4 digits)
  if (!/^\d{4}$/.test(pin)) {
    showInlineError('register-error', 'PIN must be exactly 4 numeric digits (e.g. 4821).');
    pinInput.focus();
    return;
  }

  // Save new elector
  const voters = getStoredVoters();
  const newVoterId = generateUniqueVoterId(voters);

  const newVoter = {
    id: newVoterId,
    name: fullName,
    age: age,
    state: state,
    pin: pin,
    hasVoted: false,
    registeredAt: new Date().toISOString()
  };

  voters.push(newVoter);
  const saved = saveStoredVoters(voters);

  if (!saved) {
    showInlineError('register-error', 'Error: Unable to save registration data to local storage.');
    return;
  }

  // Display success card with official Elector ID Card
  document.getElementById('success-voter-id').textContent = newVoter.id;
  document.getElementById('success-voter-name').textContent = newVoter.name;
  document.getElementById('success-voter-age').textContent = `${newVoter.age} years`;
  document.getElementById('success-voter-state').textContent = newVoter.state;

  document.getElementById('register-form-container').classList.add('hidden');
  document.getElementById('register-success-card').classList.remove('hidden');

  // Pre-fill login input
  const loginIdInput = document.getElementById('login-voter-id');
  if (loginIdInput) loginIdInput.value = newVoter.id;

  updateHomeMetrics();
}

function resetRegistrationForm() {
  const form = document.getElementById('registration-form');
  if (form) form.reset();
  hideInlineError('register-error');
  document.getElementById('register-success-card').classList.add('hidden');
  document.getElementById('register-form-container').classList.remove('hidden');
  document.getElementById('reg-name').focus();
}

// ==========================================================================
// VIEW 3: VOTER LOGIN SCREEN
// ==========================================================================

function initLoginView() {
  const form = document.getElementById('voter-login-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    hideInlineError('voter-login-error');

    const idInput = document.getElementById('login-voter-id');
    const pinInput = document.getElementById('login-pin');

    const voterId = idInput.value.trim().toUpperCase();
    const pin = pinInput.value.trim();

    if (!voterId) {
      showInlineError('voter-login-error', 'Please enter your Voter ID (e.g. VTR482910).');
      idInput.focus();
      return;
    }

    if (!pin) {
      showInlineError('voter-login-error', 'Please enter your 4-digit security PIN.');
      pinInput.focus();
      return;
    }

    const voters = getStoredVoters();
    const voter = voters.find(v => v.id.toUpperCase() === voterId);

    if (!voter) {
      showInlineError('voter-login-error', 'Voter ID not found in the electoral roll. Please verify your ID or sign up first.');
      idInput.focus();
      return;
    }

    if (voter.pin !== pin) {
      showInlineError('voter-login-error', 'Incorrect 4-digit security PIN for this Voter ID.');
      pinInput.focus();
      return;
    }

    // Authenticated -> Store session and route to dashboard
    setActiveVoter(voter.id);
    form.reset();
    window.location.hash = '#dashboard';
  });
}

// ==========================================================================
// VIEW 4: VOTER DASHBOARD
// ==========================================================================

function renderVoterDashboard() {
  const voter = getActiveVoter();
  if (!voter) {
    window.location.hash = '#login';
    return;
  }

  // Avatar Initials
  const initials = voter.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  document.getElementById('profile-avatar-initials').textContent = initials || 'VI';
  document.getElementById('profile-name').textContent = voter.name;
  document.getElementById('profile-voter-id').textContent = voter.id;
  document.getElementById('profile-age').textContent = `${voter.age} years`;
  document.getElementById('profile-state').textContent = voter.state;

  const statusBadge = document.getElementById('profile-status-badge');
  const voteStatusText = document.getElementById('profile-vote-status');
  const unvotedBox = document.getElementById('dash-unvoted-actions');
  const votedBox = document.getElementById('dash-voted-notice');

  if (voter.hasVoted) {
    statusBadge.className = 'status-pill-badge';
    statusBadge.style.backgroundColor = 'var(--emerald-light)';
    statusBadge.style.color = 'var(--emerald-600)';
    statusBadge.textContent = 'Ballot Cast (Voted)';
    voteStatusText.className = 'demo-val status-green';
    voteStatusText.textContent = 'Completed (One vote recorded)';
    unvotedBox.classList.add('hidden');
    votedBox.classList.remove('hidden');

    const timestampEl = document.getElementById('dash-voted-timestamp');
    if (timestampEl && voter.votedAt) {
      timestampEl.textContent = `Vote committed on: ${formatDisplayDateTime(new Date(voter.votedAt))}`;
    }
  } else {
    statusBadge.className = 'status-pill-badge';
    statusBadge.style.backgroundColor = 'rgba(242, 140, 40, 0.15)';
    statusBadge.style.color = 'var(--saffron-600)';
    statusBadge.textContent = 'Eligible to Vote';
    voteStatusText.className = 'demo-val';
    voteStatusText.textContent = 'Eligible (Uncast)';
    unvotedBox.classList.remove('hidden');
    votedBox.classList.add('hidden');
  }
}

function initVoterDashboard() {
  const logoutBtn = document.getElementById('btn-voter-logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      setActiveVoter(null);
      window.location.hash = '#login';
    });
  }
}

// ==========================================================================
// VIEW 5: ELECTRONIC VOTING BOOTH
// ==========================================================================

function initVotingBooth() {
  renderBallotCards();

  const ballotForm = document.getElementById('ballot-form');
  const confirmVoteBtn = document.getElementById('btn-final-cast-vote');
  const backToBallotBtn = document.getElementById('btn-back-to-ballot');

  // Event delegation on candidate options list
  const container = document.getElementById('candidate-options-list');
  if (container) {
    container.addEventListener('change', (e) => {
      if (e.target && e.target.name === 'selectedParty') {
        document.querySelectorAll('.candidate-card').forEach(c => c.classList.remove('selected'));
        const parentCard = e.target.closest ? e.target.closest('.candidate-card') : e.target.parentElement;
        if (parentCard) parentCard.classList.add('selected');
        hideInlineError('ballot-error');
      }
    });
  }

  if (ballotForm) {
    ballotForm.addEventListener('submit', handleBallotSubmit);
  }

  if (confirmVoteBtn) {
    confirmVoteBtn.addEventListener('click', handleConfirmCastVote);
  }

  if (backToBallotBtn) {
    backToBallotBtn.addEventListener('click', () => {
      document.getElementById('vote-confirm-container').classList.add('hidden');
      document.getElementById('ballot-card-container').classList.remove('hidden');
    });
  }
}

function renderVotingBooth() {
  const voter = getActiveVoter();
  if (!voter) {
    window.location.hash = '#login';
    return;
  }

  // If voter has already voted, do not permit access to ballot
  if (voter.hasVoted) {
    alert('You have already voted. Under electoral law, only one vote per registered elector is permitted.');
    window.location.hash = '#dashboard';
    return;
  }

  document.getElementById('booth-voter-name').textContent = voter.name;
  document.getElementById('booth-voter-id').textContent = voter.id;
  document.getElementById('booth-voter-state').textContent = voter.state;

  // Clear selections
  document.querySelectorAll('input[name="selectedParty"]').forEach(r => r.checked = false);
  document.querySelectorAll('.candidate-card').forEach(c => c.classList.remove('selected'));
  hideInlineError('ballot-error');

  // Reset sub-steps
  document.getElementById('ballot-card-container').classList.remove('hidden');
  document.getElementById('vote-confirm-container').classList.add('hidden');
  document.getElementById('vote-success-container').classList.add('hidden');
}

function renderBallotCards() {
  const container = document.getElementById('candidate-options-list');
  if (!container) return;

  container.innerHTML = '';

  PARTIES.forEach(party => {
    const card = document.createElement('label');
    card.className = 'candidate-card';
    card.style.borderLeft = `6px solid ${party.border}`;
    card.setAttribute('for', `party-opt-${party.code}`);

    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.id = `party-opt-${party.code}`;
    radio.name = 'selectedParty';
    radio.value = party.code;
    radio.className = 'candidate-radio';

    const symbolBox = document.createElement('div');
    symbolBox.className = 'candidate-symbol-box';
    symbolBox.innerHTML = party.symbolSvg;

    const info = document.createElement('div');
    info.className = 'candidate-info';

    const codeSpan = document.createElement('span');
    codeSpan.className = 'candidate-code';
    codeSpan.textContent = party.code;

    const nameSpan = document.createElement('span');
    nameSpan.className = 'candidate-name';
    nameSpan.textContent = party.name;

    info.appendChild(codeSpan);
    info.appendChild(nameSpan);

    card.appendChild(radio);
    card.appendChild(symbolBox);
    card.appendChild(info);

    container.appendChild(card);
  });
}

function handleBallotSubmit(e) {
  e.preventDefault();
  hideInlineError('ballot-error');

  const selectedRadio = document.querySelector('input[name="selectedParty"]:checked');
  if (!selectedRadio) {
    showInlineError('ballot-error', 'Please select a candidate or NOTA before tapping "Cast vote".');
    return;
  }

  const selectedCode = selectedRadio.value;
  const partyObj = PARTIES.find(p => p.code === selectedCode);
  if (!partyObj) return;

  pendingPartySelection = partyObj;

  // Populate confirm step
  document.getElementById('confirm-party-code').textContent = partyObj.code;
  document.getElementById('confirm-party-name').textContent = partyObj.name;
  document.getElementById('confirm-party-symbol').innerHTML = partyObj.symbolSvg;

  document.getElementById('ballot-card-container').classList.add('hidden');
  document.getElementById('vote-confirm-container').classList.remove('hidden');
}

function handleConfirmCastVote() {
  const currentVoter = getActiveVoter();
  if (!currentVoter || !pendingPartySelection) {
    window.location.hash = '#login';
    return;
  }

  const voters = getStoredVoters();
  const voterIndex = voters.findIndex(v => v.id === currentVoter.id);

  if (voterIndex === -1 || voters[voterIndex].hasVoted) {
    alert('Ballot already cast or elector record not found.');
    window.location.hash = '#dashboard';
    return;
  }

  // 1. Mark voter as voted
  const now = new Date();
  voters[voterIndex].hasVoted = true;
  voters[voterIndex].votedAt = now.toISOString();
  saveStoredVoters(voters);

  // 2. Increment vote tally
  const votes = getStoredVotes();
  votes[pendingPartySelection.code] = (votes[pendingPartySelection.code] || 0) + 1;
  saveStoredVotes(votes);

  // 3. Receipt & Ink Screen
  document.getElementById('receipt-voter-id').textContent = currentVoter.id;
  document.getElementById('receipt-timestamp').textContent = formatDisplayDateTime(now);

  document.getElementById('vote-confirm-container').classList.add('hidden');
  document.getElementById('vote-success-container').classList.remove('hidden');

  pendingPartySelection = null;
  updateHomeMetrics();
}

// ==========================================================================
// VIEW 6: ADMIN PORTAL & OFFICER DASHBOARD
// ==========================================================================

function initAdminPortal() {
  const loginForm = document.getElementById('admin-login-form');
  const logoutBtn = document.getElementById('btn-admin-logout');
  const loadSampleBtn = document.getElementById('btn-load-sample-votes');

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      hideInlineError('admin-login-error');

      const user = document.getElementById('admin-username').value.trim();
      const pass = document.getElementById('admin-password').value.trim();

      // Demo credentials: admin / admin123
      if (user === 'admin' && pass === 'admin123') {
        setAdminAuthenticated(true);
        loginForm.reset();
        renderAdminPortal();
      } else {
        showInlineError('admin-login-error', 'Invalid Officer credentials. (Classroom demo: username "admin", password "admin123").');
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      setAdminAuthenticated(false);
      renderAdminPortal();
    });
  }

  if (loadSampleBtn) {
    loadSampleBtn.addEventListener('click', handleAdminLoadSampleVotes);
  }
}

function renderAdminPortal() {
  const isAuth = isAdminAuthenticated();
  const loginBox = document.getElementById('admin-login-container');
  const dashBox = document.getElementById('admin-dashboard-container');
  const statusPill = document.getElementById('admin-status-pill');

  if (!isAuth) {
    loginBox.classList.remove('hidden');
    dashBox.classList.add('hidden');
    if (statusPill) statusPill.classList.add('hidden');
    return;
  }

  loginBox.classList.add('hidden');
  dashBox.classList.remove('hidden');
  if (statusPill) statusPill.classList.remove('hidden');

  // Update Admin Metrics
  const voters = getStoredVoters();
  const votes = getStoredVotes();

  const totalRegistered = voters.length;
  const totalVotesCast = Object.values(votes).reduce((sum, n) => sum + n, 0);
  const turnoutPct = totalRegistered > 0
    ? ((totalVotesCast / totalRegistered) * 100).toFixed(1)
    : '0.0';

  document.getElementById('admin-registered-count').textContent = totalRegistered.toLocaleString('en-IN');
  document.getElementById('admin-votes-count').textContent = totalVotesCast.toLocaleString('en-IN');
  document.getElementById('admin-turnout-pct').textContent = `${turnoutPct}%`;

  // Render Candidate Results Bars
  const barsContainer = document.getElementById('admin-results-bars-container');
  if (barsContainer) {
    barsContainer.innerHTML = '';
    PARTIES.forEach(party => {
      const partyVotes = votes[party.code] || 0;
      const votePct = totalVotesCast > 0
        ? ((partyVotes / totalVotesCast) * 100).toFixed(1)
        : '0.0';

      const row = document.createElement('div');
      row.className = 'result-row';

      row.innerHTML = `
        <div class="result-row-header">
          <div class="result-party-info">
            <div class="result-party-symbol">${party.symbolSvg}</div>
            <div>
              <span class="result-party-code">${party.code}</span>
              <span class="result-party-name">${party.name}</span>
            </div>
          </div>
          <span class="result-tally">${partyVotes} ${partyVotes === 1 ? 'vote' : 'votes'} (${votePct}%)</span>
        </div>
        <div class="result-bar-track">
          <div class="result-bar-fill"
               style="width: ${votePct}%;"
               aria-valuenow="${votePct}"
               aria-valuemin="0"
               aria-valuemax="100"
               role="progressbar"></div>
        </div>
      `;
      barsContainer.appendChild(row);
    });
  }

  // Render Electoral Roll Table
  const tbody = document.getElementById('admin-voters-tbody');
  if (tbody) {
    tbody.innerHTML = '';
    if (voters.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: var(--slate-500); padding: 24px;">No electors enrolled on the register yet.</td></tr>';
    } else {
      voters.forEach(v => {
        const tr = document.createElement('tr');
        const formattedRegDate = v.registeredAt ? formatDisplayDateTime(new Date(v.registeredAt)) : '—';
        const badgeClass = v.hasVoted ? 'badge-table voted' : 'badge-table eligible';
        const statusText = v.hasVoted ? 'Voted' : 'Eligible';

        tr.innerHTML = `
          <td><strong class="font-mono">${v.id}</strong></td>
          <td>${v.name}</td>
          <td>${v.age}</td>
          <td>${v.state}</td>
          <td>${formattedRegDate}</td>
          <td><span class="${badgeClass}">${statusText}</span></td>
        `;
        tbody.appendChild(tr);
      });
    }
  }
}

function handleAdminLoadSampleVotes() {
  const voters = getStoredVoters();
  const votes = getStoredVotes();

  const sampleElectors = [
    { name: 'Sunita Devi', state: 'Uttar Pradesh', age: 34 },
    { name: 'Rajesh Patil', state: 'Maharashtra', age: 41 },
    { name: 'Priya Nair', state: 'Kerala', age: 28 },
    { name: 'Mohammed Arif', state: 'Telangana', age: 39 },
    { name: 'Ananya Banerjee', state: 'West Bengal', age: 31 },
    { name: 'Gurpreet Singh', state: 'Punjab', age: 45 },
    { name: 'Vikramaditya Rao', state: 'Karnataka', age: 52 },
    { name: 'Kavita Joshi', state: 'Uttarakhand', age: 26 },
    { name: 'Deepak Sharma', state: 'Rajasthan', age: 37 },
    { name: 'Meenakshi Sundaram', state: 'Tamil Nadu', age: 49 },
    { name: 'Amitabh Verma', state: 'Bihar', age: 33 },
    { name: 'Lalitha Reddy', state: 'Andhra Pradesh', age: 30 },
    { name: 'Tsering Dorjee', state: 'Ladakh', age: 44 },
    { name: 'Shreya Sen', state: 'Assam', age: 29 }
  ];

  // Distribute 2 votes to each party
  PARTIES.forEach(party => {
    votes[party.code] = (votes[party.code] || 0) + 2;
  });

  // Add 14 registered electors
  sampleElectors.forEach((sample, idx) => {
    const voterId = generateUniqueVoterId(voters);
    voters.push({
      id: voterId,
      name: sample.name,
      age: sample.age,
      state: sample.state,
      pin: '1234',
      hasVoted: true,
      registeredAt: new Date(Date.now() - (idx + 1) * 3600000).toISOString(),
      votedAt: new Date(Date.now() - idx * 1800000).toISOString()
    });
  });

  saveStoredVoters(voters);
  saveStoredVotes(votes);

  renderAdminPortal();
  updateHomeMetrics();

  showInlineSuccess('admin-sample-message', '14 verified sample votes loaded (2 per party/NOTA) and 14 electors enrolled.');
  setTimeout(() => hideInlineSuccess('admin-sample-message'), 5000);
}

// ==========================================================================
// RESET DEMO
// ==========================================================================

function initResetDemo() {
  const resetBtn = document.getElementById('btn-reset-demo');
  if (!resetBtn) return;

  resetBtn.addEventListener('click', () => {
    const userConfirmed = window.confirm(
      'Are you sure you want to reset all demo data? This will clear all registered voters and recorded votes.'
    );

    if (userConfirmed) {
      try {
        localStorage.removeItem(STORAGE_KEYS.VOTERS);
        localStorage.removeItem(STORAGE_KEYS.VOTES);
        localStorage.removeItem(STORAGE_KEYS.CURRENT_VOTER_ID);
        localStorage.removeItem(STORAGE_KEYS.ADMIN_LOGGED_IN);
      } catch (err) {
        console.error('Error clearing localStorage:', err);
      }

      resetRegistrationForm();
      lastAnimatedStats = { registered: -1, votes: -1 };
      updateHomeMetrics();
      if (isAdminAuthenticated()) renderAdminPortal();

      window.location.hash = '#home';
    }
  });
}

// ==========================================================================
// MOBILE MENU TOGGLE
// ==========================================================================

function initMobileMenu() {
  const toggleBtn = document.getElementById('btn-mobile-menu');
  const drawer = document.getElementById('mobile-drawer');

  if (!toggleBtn || !drawer) return;

  toggleBtn.addEventListener('click', () => {
    const isOpen = drawer.classList.toggle('open');
    toggleBtn.setAttribute('aria-expanded', String(isOpen));
  });

  drawer.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      drawer.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    });
  });
}

// ==========================================================================
// INITIALIZATION & TIMER
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  initRegisterView();
  initLoginView();
  initVoterDashboard();
  initVotingBooth();
  initAdminPortal();
  initResetDemo();
  initMobileMenu();

  window.addEventListener('hashchange', handleHashChange);
  handleHashChange();

  // Auto-refresh home telemetry and admin view every 3 seconds
  setInterval(() => {
    const currentHash = window.location.hash.replace('#', '').trim();
    if (currentHash === 'home' || currentHash === '' || currentHash === 'how-it-works' || currentHash === 'security-trust') {
      updateHomeMetrics();
    } else if (currentHash === 'admin' && isAdminAuthenticated()) {
      renderAdminPortal();
    }
  }, 3000);
});
