import { saveProgress, loadProgress } from './storageManager.js';

export function initQuiz(questions, uiManager) {
  let currentQuestionIndex = 0;
  let shuffledQuestions = [];
  let answerSubmitted = false;

  // Shuffle questions and answers (Fisher-Yates, stable correct index)
  function shuffleQuestions() {
    shuffledQuestions = questions.map(q => ({
      ...q,
      options: [...q.options],
      correct: q.correct
    }));
    for (let i = shuffledQuestions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledQuestions[i], shuffledQuestions[j]] = [shuffledQuestions[j], shuffledQuestions[i]];
    }
    shuffledQuestions.forEach(q => {
      const correctAnswer = q.options[q.correct];
      for (let i = q.options.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [q.options[i], q.options[j]] = [q.options[j], q.options[i]];
      }
      q.correct = q.options.indexOf(correctAnswer);
    });
  }

  // Check answer and update stats
  function checkAnswer() {
    if (answerSubmitted) return;
    const selected = document.querySelector('input[name="option"]:checked');
    if (!selected) {
      uiManager.showFeedback('Пожалуйста, выберите ответ.', 'warning');
      return;
    }
    answerSubmitted = true;
    const answer = parseInt(selected.value);
    const question = shuffledQuestions[currentQuestionIndex];
    const isCorrect = answer === question.correct;

    uiManager.highlightAnswers(question.correct, isCorrect ? null : answer);
    uiManager.showFeedback(
      isCorrect ? 'Правильно!' : 'Неправильно.',
      isCorrect ? 'success' : 'error',
      question.explanation,
      !isCorrect ? question.options[question.correct] : null
    );
    uiManager.toggleNextButton(true);
    saveProgress('quiz', { currentIndex: currentQuestionIndex });
    updateStats(isCorrect);
    if (!isCorrect) saveMistake(question, answer);
  }

  // Save mistake to localStorage
  function saveMistake(question, selectedIndex) {
    const mistakes = JSON.parse(localStorage.getItem('toefl-mistakes')) || [];
    mistakes.unshift({
      question: question.question,
      yourAnswer: question.options[selectedIndex],
      correctAnswer: question.options[question.correct],
      date: new Date().toLocaleDateString('ru-RU')
    });
    if (mistakes.length > 20) mistakes.pop();
    localStorage.setItem('toefl-mistakes', JSON.stringify(mistakes));
  }

  // Move to next question
  function nextQuestion() {
    if (currentQuestionIndex < shuffledQuestions.length - 1) {
      currentQuestionIndex++;
      answerSubmitted = false;
      renderQuestion();
      uiManager.toggleNextButton(false);
      saveProgress('quiz', { currentIndex: currentQuestionIndex });
    } else {
      uiManager.showCompletionMessage();
    }
  }

  function prevQuestion() {
    if (currentQuestionIndex > 0) {
      currentQuestionIndex--;
      answerSubmitted = false;
      renderQuestion();
      uiManager.toggleNextButton(false);
      saveProgress('quiz', { currentIndex: currentQuestionIndex });
    }
  }

  // Render question UI
  function renderQuestion() {
    const q = shuffledQuestions[currentQuestionIndex];
    uiManager.renderQuestion(
      q.question,
      q.options,
      currentQuestionIndex + 1,
      shuffledQuestions.length
    );
    uiManager.updateProgress(currentQuestionIndex + 1, shuffledQuestions.length, 'quiz');
    uiManager.toggleBackButton(currentQuestionIndex > 0);
  }

  // Start quiz
  function startQuiz() {
    if (!shuffledQuestions.length) shuffleQuestions();
    renderQuestion();
    uiManager.toggleNextButton(false);
  }

  // Update stats in localStorage
  function updateStats(isCorrect) {
    const stats = JSON.parse(localStorage.getItem('toefl-stats')) || {
      wordsLearned: 0,
      successRate: 0,
      streak: 0,
      correctAnswers: 0,
      totalAnswers: 0,
      totalPoints: 0
    };
    stats.totalAnswers = (stats.totalAnswers || 0) + 1;
    if (isCorrect) {
      stats.correctAnswers = (stats.correctAnswers || 0) + 1;
      stats.totalPoints = (stats.totalPoints || 0) + 10;
    }
    stats.successRate = Math.round((stats.correctAnswers / stats.totalAnswers) * 100);
    localStorage.setItem('toefl-stats', JSON.stringify(stats));
  }

  shuffleQuestions();

  return { checkAnswer, nextQuestion, prevQuestion, startQuiz };
}