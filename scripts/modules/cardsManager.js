import { saveProgress, loadProgress } from './storageManager.js';

export function initCards(cards, uiManager) {
  let currentCardIndex = loadProgress('cards')?.currentIndex || 0;

  // Render the current card
  const showCard = () => {
    const card = cards[currentCardIndex];
    uiManager.renderCard(card.en, card.ru, currentCardIndex + 1, cards.length);
    uiManager.updateProgress(currentCardIndex + 1, cards.length, 'cards');
  };

  // Move to next card
  const nextCard = () => {
    if (currentCardIndex < cards.length - 1) {
      currentCardIndex++;
      saveProgress('cards', { currentIndex: currentCardIndex });
      showCard();
      updateStats();
    } else {
      alert('Вы изучили все карточки!');
    }
  };

  // Move to previous card
  const prevCard = () => {
    if (currentCardIndex > 0) {
      currentCardIndex--;
      saveProgress('cards', { currentIndex: currentCardIndex });
      showCard();
    }
  };

  // Show translation (for future use)
  const showTranslation = () => {
    uiManager.showCardTranslation(cards[currentCardIndex].ru);
  };

  // Reset all progress
  const resetProgress = () => {
    currentCardIndex = 0;
    saveProgress('cards', { currentIndex: 0 });
    showCard();
  };

  // Update stats (words learned)
  const updateStats = () => {
    const stats = JSON.parse(localStorage.getItem('toefl-stats')) || {
      wordsLearned: 0,
      successRate: 0,
      streak: 0,
    };
    stats.wordsLearned = currentCardIndex + 1;
    localStorage.setItem('toefl-stats', JSON.stringify(stats));
  };

  showCard();

  return { nextCard, prevCard, showTranslation, showCard, resetProgress };
}