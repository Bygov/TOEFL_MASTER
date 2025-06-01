export function saveProgress(mode, data) {
  try {
    localStorage.setItem(`toefl-${mode}-progress`, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving progress:', error);
  }
}

export function loadProgress(mode) {
  try {
    const data = localStorage.getItem(`toefl-${mode}-progress`);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error loading progress:', error);
    return null;
  }
}