// authManager.js
const USERS_KEY = 'toefl-users';
const CURRENT_USER_KEY = 'toefl-current-user';

function getUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
}
function setUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}
function getCurrentUserEmail() {
  return localStorage.getItem(CURRENT_USER_KEY);
}
function getCurrentUser() {
  const email = getCurrentUserEmail();
  if (!email) return null;
  return getUsers().find(u => u.email === email) || null;
}
function setCurrentUser(email) {
  localStorage.setItem(CURRENT_USER_KEY, email);
}
function logoutUser() {
  localStorage.removeItem(CURRENT_USER_KEY);
}
function registerUser({ name, email, password, avatar }) {
  const users = getUsers();
  if (users.find(u => u.email === email)) {
    return { success: false, message: 'Этот email уже зарегистрирован.' };
  }
  const user = {
    name,
    email,
    password,
    avatar: avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(name) + '&background=4e73df&color=fff',
    settings: {
      language: 'ru',
      theme: 'light',
      dailyReminder: true,
      progressNotifications: true,
      streakNotifications: true,
      studyTips: true,
    },
    stats: {
      wordsLearned: [],
      points: 0,
      streak: 0,
      successRate: 0,
    }
  };
  users.push(user);
  setUsers(users);
  setCurrentUser(email);
  return { success: true, message: 'Регистрация успешна' };
}
function loginUser(email, password) {
  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return { success: false, message: 'Неверный email или пароль' };
  setCurrentUser(email);
  return { success: true, message: 'Вход выполнен успешно' };
}
function saveUserSettings(settings) {
  const users = getUsers();
  const email = getCurrentUserEmail();
  const idx = users.findIndex(u => u.email === email);
  if (idx !== -1) {
    users[idx].settings = { ...users[idx].settings, ...settings };
    setUsers(users);
  }
}
function saveUserProfile(profile) {
  const users = getUsers();
  const email = getCurrentUserEmail();
  const idx = users.findIndex(u => u.email === email);
  if (idx !== -1) {
    users[idx] = { ...users[idx], ...profile };
    setUsers(users);
  }
}
function saveUserStats(stats) {
  const users = getUsers();
  const email = getCurrentUserEmail();
  const idx = users.findIndex(u => u.email === email);
  if (idx !== -1) {
    users[idx].stats = { ...users[idx].stats, ...stats };
    setUsers(users);
  }
}
function addWordLearned(word) {
  const user = getCurrentUser();
  if (!user) return;
  if (!user.stats.wordsLearned.includes(word)) {
    user.stats.wordsLearned.push(word);
    saveUserStats({ wordsLearned: user.stats.wordsLearned });
  }
}
function getUserStats() {
  return getCurrentUser()?.stats || {};
}
function getUserSettings() {
  return getCurrentUser()?.settings || {};
}

export {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  saveUserProfile,
  saveUserSettings,
  saveUserStats,
  addWordLearned,
  getUserStats,
  getUserSettings,
};