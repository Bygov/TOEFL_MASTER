// DataManager: loads all static (cards/questions) data once
export async function loadData() {
  try {
    // Replace with fetch() if you want to load from external files
    const cards = [
      { "en": "Comprehensive", "ru": "Всеобъемлющий" },
      { "en": "Hypothesis", "ru": "Гипотеза" },
      { "en": "Ambiguous", "ru": "Двусмысленный" },
      { "en": "Coherent", "ru": "Логичный, связный" },
      { "en": "Consecutive", "ru": "Последовательный" },
      { "en": "Contradict", "ru": "Противоречить" },
      { "en": "Criteria", "ru": "Критерии" },
      { "en": "Crucial", "ru": "Решающий" },
      { "en": "Debate", "ru": "Дебаты" },
      { "en": "Derive", "ru": "Получать, выводить" },
      { "en": "Devise", "ru": "Разрабатывать" },
      { "en": "Dilemma", "ru": "Дилемма" },
      { "en": "Diminish", "ru": "Уменьшать" },
      { "en": "Discrete", "ru": "Отдельный, дискретный" },
      { "en": "Diverse", "ru": "Разнообразный" },
      { "en": "Dynamic", "ru": "Динамичный" },
      { "en": "Empirical", "ru": "Эмпирический" },
      { "en": "Equivalent", "ru": "Эквивалентный" },
      { "en": "Erode", "ru": "Разъедать" },
      { "en": "Ethical", "ru": "Этический" },
      { "en": "Explicit", "ru": "Явный, четкий" },
      { "en": "Facilitate", "ru": "Облегчать" },
      { "en": "Fundamental", "ru": "Фундаментальный" },
      { "en": "Implement", "ru": "Внедрять" },
      { "en": "Infer", "ru": "Делать вывод" },
      { "en": "Innovative", "ru": "Инновационный" },
      { "en": "Integrate", "ru": "Интегрировать" },
      { "en": "Justify", "ru": "Обосновывать" },
      { "en": "Methodology", "ru": "Методология" },
      { "en": "Paradigm", "ru": "Парадигма" },
      { "en": "Phenomenon", "ru": "Феномен" },
      { "en": "Plausible", "ru": "Правдоподобный" },
      { "en": "Rigorous", "ru": "Тщательный" },
      { "en": "Subsequent", "ru": "Последующий" },
      { "en": "Synthesize", "ru": "Синтезировать" },
      { "en": "Valid", "ru": "Действительный" },
      { "en": "Variable", "ru": "Переменная" },
      { "en": "Validate", "ru": "Проверять, подтверждать" },
      { "en": "Versatile", "ru": "Многосторонний" },
      { "en": "Viable", "ru": "Жизнеспособный" }
    ];

    // questions.json should be loaded/fetched for full set!
    const questions = [
      {
        "question": "What was the primary transformation brought about by the Industrial Revolution?",
        "options": [
          "From agricultural to industrial economies",
          "From democratic to monarchical systems",
          "From urban to rural living",
          "From trade-based to self-sufficient economies"
        ],
        "correct": 0,
        "explanation": "The Industrial Revolution transformed economies from agriculture-based to industry-based."
      },
      {
        "question": "What is the byproduct of photosynthesis that is essential for most life forms?",
        "options": [
          "Carbon dioxide",
          "Glucose",
          "Oxygen",
          "Nitrogen"
        ],
        "correct": 2,
        "explanation": "Photosynthesis releases oxygen as a byproduct, which is essential for most life forms."
      },
      {
        "question": "Why was the Great Pyramid of Giza originally constructed?",
        "options": [
          "As a temple for religious ceremonies",
          "As an astronomical observatory",
          "As a tomb for the Pharaoh Khufu",
          "As a monument to celebrate military victories"
        ],
        "correct": 2,
        "explanation": "It was constructed as a tomb for the Pharaoh Khufu."
      },
      {
        "question": "How did Athenian democracy differ from modern democracies?",
        "options": [
          "It excluded women and slaves",
          "It was direct rather than representative",
          "It had term limits for officials",
          "It included a system of checks and balances"
        ],
        "correct": 1,
        "explanation": "Athenian democracy was direct, with citizens voting on legislation themselves."
      },
      {
        "question": "According to plate tectonics theory, what causes earthquakes?",
        "options": [
          "Changes in atmospheric pressure",
          "Movement of Earth's outer shell plates",
          "Shifts in Earth's magnetic field",
          "Erosion of continental shelves"
        ],
        "correct": 1,
        "explanation": "Movement of plates causes earthquakes, volcanic activity, and mountain formation."
      },
      {
        "question": "What was a key characteristic of the Renaissance?",
        "options": [
          "Decline of urban centers",
          "Revival of classical learning",
          "Increased religious orthodoxy",
          "Development of feudal systems"
        ],
        "correct": 1,
        "explanation": "The Renaissance was characterized by a revival of classical learning and wisdom."
      },
      {
        "question": "What is the first step in the water cycle?",
        "options": [
          "Condensation",
          "Precipitation",
          "Evaporation",
          "Collection"
        ],
        "correct": 2,
        "explanation": "The water cycle begins with water evaporating from the Earth's surface."
      },
      {
        "question": "Which of these is a common theme in Shakespeare's tragedies?",
        "options": [
          "Human suffering",
          "Political satire",
          "Pastoral romance",
          "Scientific discovery"
        ],
        "correct": 0,
        "explanation": "Shakespeare's tragedies often explore themes of human suffering and moral failure."
      },
      {
        "question": "What was the primary function of the Silk Road?",
        "options": [
          "Military conquest",
          "Religious pilgrimage",
          "Trade and cultural exchange",
          "Scientific exploration"
        ],
        "correct": 2,
        "explanation": "The Silk Road was an ancient network of trade routes for trade and cultural exchange."
      },
      {
        "question": "What connects the two hemispheres of the brain?",
        "options": [
          "Cerebral cortex",
          "Corpus callosum",
          "Brain stem",
          "Frontal lobe"
        ],
        "correct": 1,
        "explanation": "The two hemispheres are connected by the corpus callosum."
      }
    ];
    return { questions, cards };
  } catch (error) {
    console.error('Error loading data:', error);
    throw error;
  }
}