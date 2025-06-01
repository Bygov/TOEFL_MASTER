import * as auth from './authManager.js';

export function initUI() {
  // Загрузить настройки пользователя (тема, язык, аватар, имя, email)
  function loadSettings() {
    const settings = auth.getUserSettings();
    const user = auth.getCurrentUser();

    if (user?.name) {
      const usernameInput = document.getElementById('username-input');
      if (usernameInput) usernameInput.value = user.name;
      const username = document.getElementById('username');
      if (username) username.textContent = user.name;
      const profileUsername = document.getElementById('profile-username');
      if (profileUsername) profileUsername.textContent = user.name;
    }
    if (user?.email) {
      const emailInput = document.getElementById('email-input');
      if (emailInput) emailInput.value = user.email;
      const profileEmail = document.getElementById('profile-email');
      if (profileEmail) profileEmail.textContent = user.email;
    }
    if (user?.avatar) {
      const userAvatar = document.getElementById('user-avatar');
      if (userAvatar) userAvatar.src = user.avatar;
      const profileAvatarImg = document.getElementById('profile-avatar-img');
      if (profileAvatarImg) profileAvatarImg.src = user.avatar;
    }
    if (settings.theme) {
      const theme = document.getElementById('theme');
      if (theme) theme.value = settings.theme;
    }
    if (settings.language) {
      const language = document.getElementById('language');
      if (language) language.value = settings.language;
    }
    const dailyReminder = document.getElementById('daily-reminder');
    if (dailyReminder) dailyReminder.checked = settings.dailyReminder !== false;
    const progressNotifications = document.getElementById('progress-notifications');
    if (progressNotifications) progressNotifications.checked = settings.progressNotifications !== false;
    const streakNotifications = document.getElementById('streak-notifications');
    if (streakNotifications) streakNotifications.checked = settings.streakNotifications !== false;
    const studyTips = document.getElementById('study-tips');
    if (studyTips) studyTips.checked = settings.studyTips !== false;
  }

  function setUserProfile({ name, email, avatar }) {
    if (name) {
      const username = document.getElementById('username');
      if (username) username.textContent = name;
      const profileUsername = document.getElementById('profile-username');
      if (profileUsername) profileUsername.textContent = name;
      const usernameInput = document.getElementById('username-input');
      if (usernameInput) usernameInput.value = name;
    }
    if (email) {
      const profileEmail = document.getElementById('profile-email');
      if (profileEmail) profileEmail.textContent = email;
      const emailInput = document.getElementById('email-input');
      if (emailInput) emailInput.value = email;
    }
    if (avatar) {
      const userAvatar = document.getElementById('user-avatar');
      if (userAvatar) userAvatar.src = avatar;
      const profileAvatarImg = document.getElementById('profile-avatar-img');
      if (profileAvatarImg) profileAvatarImg.src = avatar;
    }
  }

  function setGuestProfile() {
    const username = document.getElementById('username');
    if (username) username.textContent = 'Гость';
    const userAvatar = document.getElementById('user-avatar');
    if (userAvatar) userAvatar.src =
      'https://ui-avatars.com/api/?name=Guest&background=858796&color=fff';
    const profileUsername = document.getElementById('profile-username');
    if (profileUsername) profileUsername.textContent = 'Гость';
    const profileEmail = document.getElementById('profile-email');
    if (profileEmail) profileEmail.textContent = '';
    const profileAvatarImg = document.getElementById('profile-avatar-img');
    if (profileAvatarImg) profileAvatarImg.src =
      'https://ui-avatars.com/api/?name=Guest&background=858796&color=fff';
  }

  function setAvatar(imgSrc) {
    const user = auth.getCurrentUser();
    if (user) {
      auth.saveUserProfile({ ...user, avatar: imgSrc });
      const userAvatar = document.getElementById('user-avatar');
      if (userAvatar) userAvatar.src = imgSrc;
      const profileAvatarImg = document.getElementById('profile-avatar-img');
      if (profileAvatarImg) profileAvatarImg.src = imgSrc;
    }
  }

  function saveSettings() {
    const language = document.getElementById('language')?.value;
    const theme = document.getElementById('theme')?.value;
    const username = document.getElementById('username-input')?.value;
    const email = document.getElementById('email-input')?.value;
    const dailyReminder = document.getElementById('daily-reminder')?.checked;
    const progressNotifications = document.getElementById('progress-notifications')?.checked;
    const streakNotifications = document.getElementById('streak-notifications')?.checked;
    const studyTips = document.getElementById('study-tips')?.checked;

    auth.saveUserSettings({
      language,
      theme,
      dailyReminder,
      progressNotifications,
      streakNotifications,
      studyTips,
    });
    auth.saveUserProfile({ ...auth.getCurrentUser(), name: username, email });
    setUserProfile({ name: username, email });
    alert('Настройки сохранены!');

    // Apply theme immediately
    if (theme === 'dark') {
      document.body.classList.add('theme-dark');
    } else {
      document.body.classList.remove('theme-dark');
    }
  }

  function updateProgressStats(totalCards, totalQuestions) {
    const stats = auth.getUserStats();
    const wordsLearned = document.getElementById('words-learned');
    if (wordsLearned) wordsLearned.textContent = stats.wordsLearned?.length || 0;
    const successRate = document.getElementById('success-rate');
    if (successRate) successRate.textContent = (stats.successRate || 0) + '%';
    const streakDays = document.getElementById('streak-days');
    if (streakDays) streakDays.textContent = stats.streak || 0;
    const totalPoints = document.getElementById('total-points');
    if (totalPoints) totalPoints.textContent = stats.points || 0;
    const cardsProgress = document.getElementById('cards-progress');
    if (cardsProgress) cardsProgress.textContent = `${stats.wordsLearned?.length || 0}/${totalCards}`;
    // quiz progress etc.
    const totalPointsProgress = document.getElementById('total-points-progress');
    if (totalPointsProgress) totalPointsProgress.textContent = stats.points || 0;
  }

  function updateHomeStats() {
    // можно выводить статистику на главной
  }

  // ... инициализация календарей, истории и т.п. как раньше

  function renderCard(en, ru, idx, total) {
    const cardFront = document.getElementById('card-front');
    if (cardFront) cardFront.textContent = en;
    const cardTranslation = document.getElementById('card-translation');
    if (cardTranslation) cardTranslation.textContent = ru;
    const cardCounter = document.getElementById('card-counter');
    if (cardCounter) cardCounter.textContent = `${idx}/${total}`;
  }
  function updateProgress(current, total, type) {
    if (type === 'cards') {
      const cardsProgressFill = document.getElementById('cards-progress-fill');
      if (cardsProgressFill) cardsProgressFill.style.width = `${(current / total) * 100}%`;
    }
    if (type === 'quiz') {
      const quizProgressFill = document.getElementById('quiz-progress-fill');
      if (quizProgressFill) quizProgressFill.style.width = `${(current / total) * 100}%`;
    }
  }
  function showCardTranslation(ru) {
    const cardTranslation = document.getElementById('card-translation');
    if (cardTranslation) cardTranslation.textContent = ru;
  }
  function renderQuestion(question, options, idx, total) {
    const questionContainer = document.getElementById('question-container');
    if (questionContainer) {
      questionContainer.innerHTML = `
        <div class="question-text"><p>${question}</p></div>
        <div class="question-options" id="options-container">
          ${options
            .map((opt, i) => `<label><input type="radio" name="option" value="${i}" /> ${opt}</label>`)
            .join('<br>')}
        </div>
      `;
    }
    const questionCounter = document.getElementById('question-counter');
    if (questionCounter)
      questionCounter.textContent = `Вопрос ${idx} из ${total}`;
  }
  function showFeedback(msg, type, explanation, correct) {
    const feedback = document.getElementById('feedback');
    if (feedback)
      feedback.innerHTML = `<div class="feedback-${type || 'info'}">${msg}${explanation ? '<br>' + explanation : ''}${correct ? `<br>Правильный ответ: <b>${correct}</b>` : ''}</div>`;
  }
  function highlightAnswers(correctIdx, wrongIdx) {
    const options = document.getElementsByName('option');
    if (options[correctIdx]) options[correctIdx].parentElement.style.background = '#c6ffc6';
    if (typeof wrongIdx === 'number' && options[wrongIdx]) options[wrongIdx].parentElement.style.background = '#ffd6d6';
  }
  function toggleNextButton(show) {
    const nextBtn = document.getElementById('next-btn');
    if (nextBtn) nextBtn.classList.toggle('hidden', !show);
  }
  function toggleBackButton(show) {
    const backBtn = document.getElementById('back-btn');
    if (backBtn) backBtn.classList.toggle('hidden', !show);
  }
  function showCompletionMessage() {
    const questionContainer = document.getElementById('question-container');
    if (questionContainer) questionContainer.innerHTML = `<p>Тест завершён!</p>`;
  }

  // Личный кабинет: список выученных слов
  function renderLearnedWords() {
    const stats = auth.getUserStats();
    const container = document.getElementById('learned-words-list');
    if (!container) return;
    if (!stats.wordsLearned?.length) {
      container.innerHTML = '<p>Слов пока нет</p>';
      return;
    }
    container.innerHTML = `<ul>${stats.wordsLearned.map(w => `<li>${w}</li>`).join('')}</ul>`;
  }

  return {
    loadSettings,
    saveSettings,
    setUserProfile,
    setGuestProfile,
    setAvatar,
    updateProgressStats,
    updateHomeStats,
    renderCard,
    updateProgress,
    showCardTranslation,
    renderQuestion,
    showFeedback,
    highlightAnswers,
    toggleNextButton,
    toggleBackButton,
    showCompletionMessage,
    renderLearnedWords
  };
}