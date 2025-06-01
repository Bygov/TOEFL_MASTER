import { initQuiz } from './modules/quizManager.js';
import { initCards } from './modules/cardsManager.js';
import { initUI } from './modules/uiManager.js';
import { loadData } from './modules/dataManager.js';
import * as auth from './modules/authManager.js';

document.addEventListener('DOMContentLoaded', async () => {
  // UI references
  const menuToggle = document.querySelector('.menu-toggle');
  const sidebar = document.querySelector('.sidebar');
  const modals = {
    account: document.getElementById('account-modal'),
    profile: document.getElementById('profile-modal'),
    notifications: document.getElementById('notifications-modal'),
  };
  const closeModalBtns = document.querySelectorAll('.close-modal');
  const accountIcon = document.getElementById('account-icon');
  const userProfile = document.getElementById('user-profile');
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  const homeCards = document.querySelectorAll('.home-card');
  const quizTabBtns = document.querySelectorAll('.quiz-tab-btn');
  const reviewTabBtns = document.querySelectorAll('.review-tab-btn');
  const sidebarLinks = document.querySelectorAll('.sidebar-link');
  const toSettingsBtn = document.getElementById('to-settings-btn');

  // Profile avatar click logic (sidebar + header)
  function goToProfileOrRegister() {
    if (auth.getCurrentUser()) {
      showPage('profile');
      fillProfilePage();
    } else {
      showPage('registration');
      showRegistration();
    }
  }
  [accountIcon, userProfile].forEach(btn => {
    if (btn) btn.addEventListener('click', (e) => {
      e.stopPropagation();
      goToProfileOrRegister();
    });
  });

  // "Выйти" в личном кабинете
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      auth.logoutUser();
      uiManager.setGuestProfile();
      showPage('login');
    });
  }

  // Переход из профиля в настройки
  if (toSettingsBtn) {
    toSettingsBtn.addEventListener('click', () => {
      showPage('settings');
      uiManager.loadSettings();
    });
  }

  // Переключение регистрация/логин
  function showRegistration() {
    const registrationPage = document.getElementById('registration-page');
    const loginPage = document.getElementById('login-page');
    if (registrationPage) registrationPage.classList.remove('hidden');
    if (loginPage) loginPage.classList.add('hidden');
  }
  function showLogin() {
    const registrationPage = document.getElementById('registration-page');
    const loginPage = document.getElementById('login-page');
    if (registrationPage) registrationPage.classList.add('hidden');
    if (loginPage) loginPage.classList.remove('hidden');
  }
  const toLoginBtn = document.getElementById('to-login-btn');
  if (toLoginBtn) toLoginBtn.addEventListener('click', (e) => {
    e.preventDefault();
    showLogin();
  });
  const toRegistrationBtn = document.getElementById('to-registration-btn');
  if (toRegistrationBtn) toRegistrationBtn.addEventListener('click', (e) => {
    e.preventDefault();
    showRegistration();
  });

  // Registration form
  const registerForm = document.getElementById('registration-form');
  if (registerForm) {
    registerForm.addEventListener('submit', e => {
      e.preventDefault();
      const name = document.getElementById('reg-name')?.value;
      const email = document.getElementById('reg-email')?.value;
      const password = document.getElementById('reg-password')?.value;
      const confirm = document.getElementById('reg-confirm')?.value;
      if (password !== confirm) {
        alert('Пароли не совпадают');
        return;
      }
      const res = auth.registerUser({ name, email, password });
      if (res.success) {
        const user = auth.getCurrentUser();
        uiManager.setUserProfile({ name: user.name, email: user.email, avatar: user.avatar });
        uiManager.loadSettings();
        updateStats();
        alert('Регистрация успешна!');
        showPage('home');
      } else {
        alert(res.message);
      }
    });
  }
  // Login form
  const loginFormStandalone = document.getElementById('login-form-standalone');
  if (loginFormStandalone) {
    loginFormStandalone.addEventListener('submit', e => {
      e.preventDefault();
      const email = document.getElementById('login-email-standalone')?.value;
      const password = document.getElementById('login-password-standalone')?.value;
      const res = auth.loginUser(email, password);
      if (res.success) {
        const user = auth.getCurrentUser();
        uiManager.setUserProfile({ name: user.name, email: user.email, avatar: user.avatar });
        uiManager.loadSettings();
        updateStats();
        alert('Вход выполнен!');
        showPage('home');
      } else {
        alert(res.message);
      }
    });
  }

  // --- Основная инициализация приложения ---
  let quizManager, cardsManager, uiManagerInstance;
  let totalCards = 0, totalQuestions = 0, cards = [], questions = [];
  try {
    const data = await loadData();
    cards = data.cards;
    questions = data.questions;
    totalCards = cards.length;
    totalQuestions = questions.length;

    uiManagerInstance = initUI();
    quizManager = initQuiz(questions, uiManagerInstance);
    cardsManager = initCards(cards, uiManagerInstance);

    if (menuToggle && sidebar) {
      menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
      });
    }

    // Кнопки открытия модальных окон
    [accountIcon, userProfile].forEach(btn => {
      if (btn && modals.account) {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          modals.account.classList.remove('hidden');
        });
      }
    });

    closeModalBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        btn.closest('.modal')?.classList.add('hidden');
      });
    });
    Object.values(modals).forEach(modal => {
      if (modal) {
        modal.addEventListener('click', (e) => {
          if (e.target === modal) modal.classList.add('hidden');
        });
      }
    });
    document.querySelectorAll('.modal-content').forEach(content => {
      content.addEventListener('click', e => e.stopPropagation());
    });

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const tabId = btn.dataset.tab;
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(`${tabId}-tab`)?.classList.add('active');
      });
    });

    quizTabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const tabId = btn.dataset.tab;
        quizTabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const questionContainer = document.getElementById('question-container');
        if (questionContainer) {
          questionContainer.innerHTML = `
            <div class="quiz-tab-content">
              <h3>${tabId.charAt(0).toUpperCase() + tabId.slice(1)} Section</h3>
              <p>This section will contain ${tabId} questions.</p>
            </div>
          `;
        }
      });
    });

    reviewTabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const tabId = btn.dataset.tab;
        reviewTabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.querySelectorAll('.review-tab-content').forEach(content => {
          content.classList.remove('active');
        });
        document.getElementById(`${tabId}-tab`)?.classList.add('active');
      });
    });

    // Кнопки карточек, тестов и т.д.
    homeCards.forEach(card => card.addEventListener('click', () => showPage(card.dataset.page)));
    sidebarLinks.forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        showPage(link.dataset.page);
        if (window.innerWidth < 992 && sidebar) sidebar.classList.remove('active');
      });
    });

    // Кнопки управления карточками и тестами и прочее — остаются как есть
    document.getElementById('submit-btn')?.addEventListener('click', () => {
      quizManager.checkAnswer();
      updateStats();
    });
    document.getElementById('next-btn')?.addEventListener('click', () => {
      quizManager.nextQuestion();
      updateStats();
    });
    document.getElementById('back-btn')?.addEventListener('click', () => {
      quizManager.prevQuestion();
      updateStats();
    });
    document.getElementById('next-card')?.addEventListener('click', () => {
      cardsManager.nextCard();
      updateStats();
    });
    document.getElementById('prev-card')?.addEventListener('click', () => {
      cardsManager.prevCard();
      updateStats();
    });
    document.getElementById('flip-card')?.addEventListener('click', () => {
      document.querySelector('.flashcard')?.classList.add('flipped');
    });
    document.getElementById('flip-card-back')?.addEventListener('click', () => {
      document.querySelector('.flashcard')?.classList.remove('flipped');
    });

    document.querySelectorAll('.difficulty-btn').forEach(btn => {
      btn.addEventListener('click', function () {
        const difficulty =
          this.classList.contains('easy') ? 'easy' :
            this.classList.contains('medium') ? 'medium' : 'hard';
        const cardIndex = JSON.parse(localStorage.getItem('toefl-cards-progress'))?.currentIndex || 0;
        const word = cards[cardIndex]?.en;
        if (word) auth.addWordLearned(word);
        this.classList.add('active');
        setTimeout(() => {
          this.classList.remove('active');
          cardsManager.nextCard();
        }, 500);
        updateStats();
      });
    });

    document.getElementById('reset-progress')?.addEventListener('click', () => {
      if (confirm('Вы уверены, что хотите сбросить весь прогресс?')) {
        auth.saveUserStats({ wordsLearned: [], points: 0, streak: 0, successRate: 0 });
        cardsManager.resetProgress();
        quizManager.startQuiz();
        updateStats();
        alert('Прогресс сброшен');
      }
    });

    document.getElementById('generate-plan')?.addEventListener('click', () => {
      uiManagerInstance.generateStudyPlan?.();
    });

    document.getElementById('save-settings')?.addEventListener('click', () => {
      uiManagerInstance.saveSettings?.();
    });

    document.getElementById('practice-difficult')?.addEventListener('click', () => showPage('cards'));
    document.getElementById('clear-mistakes')?.addEventListener('click', () => {
      if (confirm('Очистить историю ошибок?')) {
        localStorage.removeItem('toefl-mistakes');
        uiManagerInstance.initializeMistakesList?.();
      }
    });

    document.querySelectorAll('.avatar-option').forEach(option => {
      option.addEventListener('click', function () {
        document.querySelectorAll('.avatar-option').forEach(opt => opt.classList.remove('selected'));
        this.classList.add('selected');
        const imgSrc = this.querySelector('img').src;
        uiManagerInstance.setAvatar(imgSrc);
      });
    });

    // При загрузке — если есть пользователь, на главную, иначе на логин
    if (auth.getCurrentUser()) {
      showPage('home');
      uiManagerInstance.loadSettings();
    } else {
      showPage('login');
      uiManagerInstance.setGuestProfile();
    }
    updateStats();

  } catch (error) {
    console.error('Error initializing application:', error);
    alert('An error occurred while loading the application. Please try again later.');
  }

  // Переход между страницами
  function showPage(page) {
    document.querySelectorAll('.page, #cards-section, #quiz-section').forEach(el => el.classList.add('hidden'));
    if (page === 'cards') {
      document.getElementById('cards-section')?.classList.remove('hidden');
      if (cardsManager) cardsManager.showCard();
    } else if (page === 'quiz') {
      document.getElementById('quiz-section')?.classList.remove('hidden');
      if (quizManager) quizManager.startQuiz();
    } else {
      document.getElementById(`${page}-page`)?.classList.remove('hidden');
    }
    sidebarLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('data-page') === page);
    });
    const crumb = document.querySelector(`.sidebar-link[data-page="${page}"] span`)?.textContent || '';
    const breadcrumbs = document.querySelector('.breadcrumbs');
    if (breadcrumbs) breadcrumbs.textContent = crumb;
    if (page === 'settings' && uiManagerInstance.renderLearnedWords) {
      uiManagerInstance.renderLearnedWords();
    }
    if (page === 'profile') {
      fillProfilePage();
    }
  }

  // Заполнение профиля — вызывать при открытии "profile"
  function fillProfilePage() {
    const user = auth.getCurrentUser();
    if (!user) return;
    document.getElementById('profile-avatar-img').src = user.avatar || '';
    document.getElementById('profile-username').textContent = user.name || '';
    document.getElementById('profile-email').textContent = user.email || '';
    // Статистика
    const stats = auth.getUserStats();
    document.getElementById('profile-words-learned').textContent = stats.wordsLearned?.length || 0;
    document.getElementById('profile-streak').textContent = stats.streak || 0;
    document.getElementById('profile-points').textContent = stats.points || 0;
  }

  function updateStats() {
    if (uiManagerInstance) {
      uiManagerInstance.updateProgressStats?.(
        Array.isArray(cards) ? cards.length : 0,
        Array.isArray(questions) ? questions.length : 0
      );
      uiManagerInstance.updateHomeStats?.();
      if (uiManagerInstance.renderLearnedWords) uiManagerInstance.renderLearnedWords();
    }
  }
});