/* SCHOOL ADMIN SETTINGS */
const CONFIG = {
  schoolName: "PR Classes",
  sampleQuestionCount: 5,
  fullTestQuestionCount: 20,
  sampleTimeSeconds: 5 * 60,
  fullTestTimeSeconds: 20 * 60,
};

const STORAGE_KEYS = {
  users: "prClassesUsers",
  session: "prClassesSession",
  results: "prClassesResults",
  sampleAttempted: "prClassesSampleAttempted",
  subjects: "prClassesSubjects",
  questionBank: "prClassesQuestionBank",
  questionDataVersion: "prClassesQuestionDataVersion",
  adminSession: "prClassesAdminSession",
};

const QUESTION_DATA_STORAGE_VERSION = 1;
const SUBJECTS = {
  Mathematics: {
    icon: "M",
    difficulty: "Core",
    description: "Class 6-8 arithmetic, fractions, geometry, ratios, and number operations.",
  },
  Science: {
    icon: "S",
    difficulty: "Conceptual",
    description: "Physics, chemistry, and biology fundamentals for middle school learners.",
  },
  English: {
    icon: "E",
    difficulty: "Grammar",
    description: "Grammar rules, vocabulary, sentence sense, and language usage practice.",
  },
  "General Knowledge": {
    icon: "GK",
    difficulty: "Mixed",
    description: "India-focused current facts, civics basics, culture, and landmark knowledge.",
  },
  "Reasoning & Aptitude": {
    icon: "R",
    difficulty: "Logic",
    description: "Patterns, analogies, sequences, comparisons, and basic logical deduction.",
  },
};

/* QUESTION BANK */
const QUESTION_BANK = {
  Mathematics: [
    { id: "math-1", subject: "Mathematics", question: "What is the value of 12 × 12?", options: ["124", "144", "134", "154"], correctAnswer: 1, explanation: "12 × 12 = 144." },
    { id: "math-2", subject: "Mathematics", question: "What is the perimeter of a rectangle with length 8 cm and breadth 5 cm?", options: ["13 cm", "26 cm", "40 cm", "16 cm"], correctAnswer: 1, explanation: "Perimeter = 2 × (8 + 5) = 26 cm." },
    { id: "math-3", subject: "Mathematics", question: "What is 3/4 + 1/8?", options: ["5/8", "7/8", "1", "3/8"], correctAnswer: 1, explanation: "3/4 = 6/8, so 6/8 + 1/8 = 7/8." },
    { id: "math-4", subject: "Mathematics", question: "Which fraction is equal to 0.25?", options: ["1/2", "1/4", "3/4", "2/5"], correctAnswer: 1, explanation: "0.25 is one-fourth, or 1/4." },
    { id: "math-5", subject: "Mathematics", question: "Which of these numbers is prime?", options: ["21", "27", "29", "33"], correctAnswer: 2, explanation: "29 has no factors other than 1 and 29." },
    { id: "math-6", subject: "Mathematics", question: "What is the area of a square with side 9 cm?", options: ["18 cm²", "36 cm²", "72 cm²", "81 cm²"], correctAnswer: 3, explanation: "Area of a square = side × side = 81 cm²." },
    { id: "math-7", subject: "Mathematics", question: "Solve: x + 15 = 42", options: ["17", "27", "37", "57"], correctAnswer: 1, explanation: "Subtract 15 from 42 to get x = 27." },
    { id: "math-8", subject: "Mathematics", question: "What is the average of 6, 8, and 10?", options: ["7", "8", "9", "10"], correctAnswer: 1, explanation: "(6 + 8 + 10) ÷ 3 = 24 ÷ 3 = 8." },
    { id: "math-9", subject: "Mathematics", question: "What is the simple interest on ₹1000 at 10% per annum for 1 year?", options: ["₹10", "₹50", "₹100", "₹200"], correctAnswer: 2, explanation: "Simple interest = 1000 × 10% × 1 = ₹100." },
    { id: "math-10", subject: "Mathematics", question: "What is 3³?", options: ["6", "9", "18", "27"], correctAnswer: 3, explanation: "3³ means 3 × 3 × 3 = 27." },
    { id: "math-11", subject: "Mathematics", question: "In the ratio 2:3, if the total is 25, what is the larger part?", options: ["10", "12", "15", "18"], correctAnswer: 2, explanation: "Total parts = 5, so one part = 5 and larger part = 15." },
    { id: "math-12", subject: "Mathematics", question: "How many meters are there in 1.5 km?", options: ["150", "1500", "1050", "15,000"], correctAnswer: 1, explanation: "1 km = 1000 m, so 1.5 km = 1500 m." },
    { id: "math-13", subject: "Mathematics", question: "What is the value of 2(6 + 4)?", options: ["10", "18", "20", "24"], correctAnswer: 2, explanation: "First solve inside the bracket: 10, then 2 × 10 = 20." },
    { id: "math-14", subject: "Mathematics", question: "What is the sum of the angles in a triangle?", options: ["90°", "180°", "270°", "360°"], correctAnswer: 1, explanation: "The interior angles of a triangle always add up to 180°." },
    { id: "math-15", subject: "Mathematics", question: "What is the LCM of 4 and 6?", options: ["10", "12", "16", "24"], correctAnswer: 1, explanation: "12 is the smallest number divisible by both 4 and 6." },
    { id: "math-16", subject: "Mathematics", question: "What is the HCF of 18 and 24?", options: ["3", "4", "6", "12"], correctAnswer: 2, explanation: "6 is the highest common factor of 18 and 24." },
    { id: "math-17", subject: "Mathematics", question: "7/10 is equal to what percentage?", options: ["7%", "70%", "17%", "700%"], correctAnswer: 1, explanation: "Multiply 7/10 by 100 to get 70%." },
    { id: "math-18", subject: "Mathematics", question: "Find the next number: 5, 10, 15, __", options: ["18", "20", "22", "25"], correctAnswer: 1, explanation: "The pattern adds 5 each time." },
    { id: "math-19", subject: "Mathematics", question: "What is 48 ÷ 6 + 3?", options: ["8", "10", "11", "12"], correctAnswer: 2, explanation: "48 ÷ 6 = 8 and 8 + 3 = 11." },
    { id: "math-20", subject: "Mathematics", question: "If the cost price is ₹80 and the selling price is ₹100, what is the profit?", options: ["₹10", "₹15", "₹20", "₹25"], correctAnswer: 2, explanation: "Profit = selling price − cost price = ₹20." },
  ],
  Science: [
    { id: "science-1", subject: "Science", question: "Where do plants mainly prepare their food?", options: ["Roots", "Leaves", "Flowers", "Stem"], correctAnswer: 1, explanation: "Leaves carry out photosynthesis and prepare food." },
    { id: "science-2", subject: "Science", question: "Which planet is known as the Red Planet?", options: ["Venus", "Mars", "Jupiter", "Mercury"], correctAnswer: 1, explanation: "Mars is called the Red Planet due to its reddish appearance." },
    { id: "science-3", subject: "Science", question: "What is the boiling point of water at normal pressure?", options: ["50°C", "75°C", "100°C", "120°C"], correctAnswer: 2, explanation: "Water boils at 100°C at standard atmospheric pressure." },
    { id: "science-4", subject: "Science", question: "Which vitamin is produced in our skin with sunlight?", options: ["Vitamin A", "Vitamin B", "Vitamin C", "Vitamin D"], correctAnswer: 3, explanation: "Sunlight helps the skin produce Vitamin D." },
    { id: "science-5", subject: "Science", question: "Which gas do humans need for breathing?", options: ["Nitrogen", "Oxygen", "Carbon dioxide", "Helium"], correctAnswer: 1, explanation: "Humans breathe in oxygen for respiration." },
    { id: "science-6", subject: "Science", question: "Which force pulls objects toward the Earth?", options: ["Magnetic force", "Gravity", "Friction", "Tension"], correctAnswer: 1, explanation: "Gravity pulls objects toward the Earth." },
    { id: "science-7", subject: "Science", question: "What is the SI unit of electric current?", options: ["Volt", "Watt", "Ampere", "Ohm"], correctAnswer: 2, explanation: "Electric current is measured in amperes." },
    { id: "science-8", subject: "Science", question: "The change of a solid into a liquid is called:", options: ["Freezing", "Melting", "Evaporation", "Condensation"], correctAnswer: 1, explanation: "Melting is the process where solids become liquids." },
    { id: "science-9", subject: "Science", question: "Animals that eat only plants are called:", options: ["Carnivores", "Omnivores", "Herbivores", "Scavengers"], correctAnswer: 2, explanation: "Herbivores depend on plants for food." },
    { id: "science-10", subject: "Science", question: "Which organ pumps blood throughout the body?", options: ["Lungs", "Kidney", "Heart", "Brain"], correctAnswer: 2, explanation: "The heart pumps blood through the circulatory system." },
    { id: "science-11", subject: "Science", question: "Which is at the center of our solar system?", options: ["Moon", "Earth", "Sun", "Mars"], correctAnswer: 2, explanation: "The Sun is at the center of the solar system." },
    { id: "science-12", subject: "Science", question: "What is the chemical formula of water?", options: ["CO2", "O2", "H2O", "NaCl"], correctAnswer: 2, explanation: "Water is made of hydrogen and oxygen: H2O." },
    { id: "science-13", subject: "Science", question: "Which of these is a good conductor of electricity?", options: ["Rubber", "Plastic", "Copper", "Wood"], correctAnswer: 2, explanation: "Copper allows electricity to pass through easily." },
    { id: "science-14", subject: "Science", question: "Every food chain begins with:", options: ["Animals", "Green plants", "Fungi", "Human beings"], correctAnswer: 1, explanation: "Green plants are producers and start the food chain." },
    { id: "science-15", subject: "Science", question: "What is the process of water vapor turning into liquid called?", options: ["Evaporation", "Condensation", "Melting", "Sublimation"], correctAnswer: 1, explanation: "Condensation changes water vapor into liquid water." },
    { id: "science-16", subject: "Science", question: "Which is the nearest star to the Earth?", options: ["Polaris", "Sun", "Sirius", "Alpha Centauri"], correctAnswer: 1, explanation: "The Sun is the nearest star to Earth." },
    { id: "science-17", subject: "Science", question: "A bicycle stops when brakes are applied mainly because of:", options: ["Heat", "Gravity", "Friction", "Magnetism"], correctAnswer: 2, explanation: "Brakes create friction which slows the wheel." },
    { id: "science-18", subject: "Science", question: "Which part of a plant absorbs water from the soil?", options: ["Leaf", "Flower", "Root", "Fruit"], correctAnswer: 2, explanation: "Roots absorb water and minerals from the soil." },
    { id: "science-19", subject: "Science", question: "Which habitat is best suited for a camel?", options: ["Desert", "Polar region", "Rainforest", "Ocean"], correctAnswer: 0, explanation: "Camels are adapted to survive in deserts." },
    { id: "science-20", subject: "Science", question: "Which acid is naturally found in lemon?", options: ["Sulfuric acid", "Citric acid", "Nitric acid", "Hydrochloric acid"], correctAnswer: 1, explanation: "Lemon contains citric acid." },
  ],
  English: [
    { id: "english-1", subject: "English", question: "Choose the synonym of 'happy'.", options: ["Sad", "Joyful", "Angry", "Weak"], correctAnswer: 1, explanation: "Joyful means happy." },
    { id: "english-2", subject: "English", question: "Choose the antonym of 'ancient'.", options: ["Old", "Historic", "Modern", "Past"], correctAnswer: 2, explanation: "Modern is the opposite of ancient." },
    { id: "english-3", subject: "English", question: "Which sentence is correct?", options: ["She go to school.", "She is going to school.", "She going school.", "She are going to school."], correctAnswer: 1, explanation: "'She is going to school' is grammatically correct." },
    { id: "english-4", subject: "English", question: "Identify the noun in the sentence: 'Riya reads books every day.'", options: ["reads", "every", "Riya", "day"], correctAnswer: 2, explanation: "Riya is a proper noun." },
    { id: "english-5", subject: "English", question: "What is the plural form of 'child'?", options: ["childs", "children", "childes", "childrens"], correctAnswer: 1, explanation: "The irregular plural of child is children." },
    { id: "english-6", subject: "English", question: "Fill in the blank: 'I ___ a letter yesterday.'", options: ["write", "writes", "wrote", "written"], correctAnswer: 2, explanation: "The past tense of write is wrote." },
    { id: "english-7", subject: "English", question: "Which word is the pronoun in the sentence: 'Aman lost his bag'?", options: ["Aman", "lost", "his", "bag"], correctAnswer: 2, explanation: "'His' is the pronoun showing possession." },
    { id: "english-8", subject: "English", question: "Which word is the adjective in: 'The blue kite is mine.'", options: ["The", "blue", "kite", "mine"], correctAnswer: 1, explanation: "Blue describes the kite, so it is an adjective." },
    { id: "english-9", subject: "English", question: "Choose the correct preposition: 'The cat is ___ the table.'", options: ["under", "during", "before", "between"], correctAnswer: 0, explanation: "A cat below the table is under it." },
    { id: "english-10", subject: "English", question: "Which punctuation mark ends a question?", options: ["Full stop", "Comma", "Question mark", "Colon"], correctAnswer: 2, explanation: "Questions end with a question mark." },
    { id: "english-11", subject: "English", question: "Choose the synonym of 'brave'.", options: ["Courageous", "Cowardly", "Quiet", "Lazy"], correctAnswer: 0, explanation: "Courageous has the same meaning as brave." },
    { id: "english-12", subject: "English", question: "Choose the correct article: 'He is ___ honest man.'", options: ["a", "an", "the", "no article"], correctAnswer: 1, explanation: "'Honest' begins with a vowel sound, so use 'an'." },
    { id: "english-13", subject: "English", question: "What is the past tense of 'go'?", options: ["goed", "gone", "went", "going"], correctAnswer: 2, explanation: "The correct past tense of go is went." },
    { id: "english-14", subject: "English", question: "Fill in the blank: 'They ___ playing cricket now.'", options: ["is", "are", "was", "be"], correctAnswer: 1, explanation: "'They' takes the helping verb 'are'." },
    { id: "english-15", subject: "English", question: "Identify the adverb in the sentence: 'She sings well.'", options: ["She", "sings", "well", "none"], correctAnswer: 2, explanation: "Well describes how she sings, so it is an adverb." },
    { id: "english-16", subject: "English", question: "Choose the correctly arranged sentence.", options: ["We stayed inside because it was raining.", "Because raining it was we stayed inside.", "Stayed we inside because raining.", "Because it we stayed raining inside."], correctAnswer: 0, explanation: "The first option has correct grammar and order." },
    { id: "english-17", subject: "English", question: "Choose the antonym of 'accept'.", options: ["receive", "allow", "reject", "welcome"], correctAnswer: 2, explanation: "Reject is the opposite of accept." },
    { id: "english-18", subject: "English", question: "What is the collective noun for a group of birds?", options: ["army", "crowd", "flock", "team"], correctAnswer: 2, explanation: "A group of birds is called a flock." },
    { id: "english-19", subject: "English", question: "Choose the correctly spelled word.", options: ["beautifull", "beutiful", "beautiful", "beautyfull"], correctAnswer: 2, explanation: "Beautiful is the correct spelling." },
    { id: "english-20", subject: "English", question: "In the sentence 'The river flows quietly,' which word is the verb?", options: ["river", "flows", "quietly", "the"], correctAnswer: 1, explanation: "Flows is the action word, so it is the verb." },
  ],
  "General Knowledge": [
    { id: "gk-1", subject: "General Knowledge", question: "What is the national animal of India?", options: ["Lion", "Tiger", "Elephant", "Peacock"], correctAnswer: 1, explanation: "The tiger is the national animal of India." },
    { id: "gk-2", subject: "General Knowledge", question: "What is the capital of Maharashtra?", options: ["Pune", "Nagpur", "Mumbai", "Nashik"], correctAnswer: 2, explanation: "Mumbai is the capital of Maharashtra." },
    { id: "gk-3", subject: "General Knowledge", question: "When is Independence Day celebrated in India?", options: ["26 January", "15 August", "2 October", "14 November"], correctAnswer: 1, explanation: "India celebrates Independence Day on 15 August." },
    { id: "gk-4", subject: "General Knowledge", question: "Who wrote India's national anthem?", options: ["Bankim Chandra Chattopadhyay", "Rabindranath Tagore", "Sarojini Naidu", "Mahatma Gandhi"], correctAnswer: 1, explanation: "Rabindranath Tagore wrote Jana Gana Mana." },
    { id: "gk-5", subject: "General Knowledge", question: "Which is the largest Indian state by area?", options: ["Madhya Pradesh", "Rajasthan", "Maharashtra", "Uttar Pradesh"], correctAnswer: 1, explanation: "Rajasthan is the largest state by area." },
    { id: "gk-6", subject: "General Knowledge", question: "What is the currency of India?", options: ["Dollar", "Taka", "Rupee", "Yen"], correctAnswer: 2, explanation: "The Indian currency is the Rupee." },
    { id: "gk-7", subject: "General Knowledge", question: "Who was the first Prime Minister of India?", options: ["Sardar Patel", "Jawaharlal Nehru", "Subhas Chandra Bose", "Lal Bahadur Shastri"], correctAnswer: 1, explanation: "Jawaharlal Nehru was India's first Prime Minister." },
    { id: "gk-8", subject: "General Knowledge", question: "Which festival is known as the Festival of Lights?", options: ["Holi", "Diwali", "Eid", "Baisakhi"], correctAnswer: 1, explanation: "Diwali is known as the Festival of Lights." },
    { id: "gk-9", subject: "General Knowledge", question: "Which is often called the national river of India?", options: ["Yamuna", "Godavari", "Ganga", "Narmada"], correctAnswer: 2, explanation: "The Ganga is widely regarded as India's national river." },
    { id: "gk-10", subject: "General Knowledge", question: "What is the top color of the Indian national flag?", options: ["Green", "White", "Blue", "Saffron"], correctAnswer: 3, explanation: "The top band of the Indian flag is saffron." },
    { id: "gk-11", subject: "General Knowledge", question: "In which city is the Taj Mahal located?", options: ["Delhi", "Agra", "Jaipur", "Lucknow"], correctAnswer: 1, explanation: "The Taj Mahal is located in Agra." },
    { id: "gk-12", subject: "General Knowledge", question: "When is Republic Day celebrated in India?", options: ["26 January", "15 August", "2 October", "1 May"], correctAnswer: 0, explanation: "Republic Day is celebrated on 26 January." },
    { id: "gk-13", subject: "General Knowledge", question: "Which sport uses a bat, ball, and wickets?", options: ["Football", "Cricket", "Hockey", "Volleyball"], correctAnswer: 1, explanation: "Cricket is played with a bat, ball, and wickets." },
    { id: "gk-14", subject: "General Knowledge", question: "Which planet is known as the Blue Planet?", options: ["Earth", "Venus", "Mars", "Saturn"], correctAnswer: 0, explanation: "Earth is called the Blue Planet because of its water." },
    { id: "gk-15", subject: "General Knowledge", question: "Where is the Parliament of India located?", options: ["Mumbai", "New Delhi", "Chennai", "Kolkata"], correctAnswer: 1, explanation: "The Parliament of India is in New Delhi." },
    { id: "gk-16", subject: "General Knowledge", question: "What does ISRO stand for?", options: ["Indian Space Research Organisation", "International Satellite Research Office", "Indian Science Rocket Office", "Integrated Space Research Operation"], correctAnswer: 0, explanation: "ISRO stands for Indian Space Research Organisation." },
    { id: "gk-17", subject: "General Knowledge", question: "Which is the longest river in India?", options: ["Godavari", "Yamuna", "Ganga", "Kaveri"], correctAnswer: 2, explanation: "The Ganga is the longest river in India." },
    { id: "gk-18", subject: "General Knowledge", question: "Which state is known as the Land of Five Rivers?", options: ["Haryana", "Punjab", "Gujarat", "Bihar"], correctAnswer: 1, explanation: "Punjab is known as the Land of Five Rivers." },
    { id: "gk-19", subject: "General Knowledge", question: "What is the official residence of the President of India?", options: ["Raj Bhavan", "Rashtrapati Bhavan", "Parliament House", "Hyderabad House"], correctAnswer: 1, explanation: "The President of India lives in Rashtrapati Bhavan." },
    { id: "gk-20", subject: "General Knowledge", question: "What is the national flower of India?", options: ["Rose", "Lily", "Lotus", "Sunflower"], correctAnswer: 2, explanation: "The lotus is the national flower of India." },
  ],
  "Reasoning & Aptitude": [
    { id: "reasoning-1", subject: "Reasoning & Aptitude", question: "Find the next number: 2, 4, 6, __", options: ["7", "8", "9", "10"], correctAnswer: 1, explanation: "The pattern increases by 2, so the next number is 8." },
    { id: "reasoning-2", subject: "Reasoning & Aptitude", question: "Which is the odd one out?", options: ["Apple", "Banana", "Carrot", "Mango"], correctAnswer: 2, explanation: "Carrot is a vegetable while the others are fruits." },
    { id: "reasoning-3", subject: "Reasoning & Aptitude", question: "Book is to Read as Food is to __", options: ["Cook", "Eat", "Serve", "Buy"], correctAnswer: 1, explanation: "Books are read and food is eaten." },
    { id: "reasoning-4", subject: "Reasoning & Aptitude", question: "Which word comes third in alphabetical order: Mango, Apple, Banana, Orange?", options: ["Apple", "Banana", "Mango", "Orange"], correctAnswer: 2, explanation: "Alphabetical order is Apple, Banana, Mango, Orange." },
    { id: "reasoning-5", subject: "Reasoning & Aptitude", question: "If yesterday was Monday, what is today?", options: ["Sunday", "Tuesday", "Wednesday", "Friday"], correctAnswer: 1, explanation: "The day after Monday is Tuesday." },
    { id: "reasoning-6", subject: "Reasoning & Aptitude", question: "Find the next number: 1, 4, 9, 16, __", options: ["20", "24", "25", "36"], correctAnswer: 2, explanation: "These are square numbers: 1², 2², 3², 4², so next is 5² = 25." },
    { id: "reasoning-7", subject: "Reasoning & Aptitude", question: "Teacher is to School as Doctor is to __", options: ["Hospital", "Library", "Office", "Market"], correctAnswer: 0, explanation: "A doctor works in a hospital." },
    { id: "reasoning-8", subject: "Reasoning & Aptitude", question: "Which is the odd one out?", options: ["Square", "Circle", "Triangle", "Blue"], correctAnswer: 3, explanation: "Blue is a color while the others are shapes." },
    { id: "reasoning-9", subject: "Reasoning & Aptitude", question: "All roses are flowers. All flowers are plants. Therefore:", options: ["All plants are roses", "All roses are plants", "All flowers are roses", "No roses are plants"], correctAnswer: 1, explanation: "If roses are flowers and flowers are plants, then roses are plants." },
    { id: "reasoning-10", subject: "Reasoning & Aptitude", question: "Find the next number: 30, 27, 24, __", options: ["21", "20", "18", "17"], correctAnswer: 0, explanation: "The pattern decreases by 3 each time." },
    { id: "reasoning-11", subject: "Reasoning & Aptitude", question: "Which number is different from the others?", options: ["2", "3", "5", "9", "11"], correctAnswer: 3, explanation: "9 is not a prime number, while the others are prime." },
    { id: "reasoning-12", subject: "Reasoning & Aptitude", question: "If A is taller than B and B is taller than C, who is the shortest?", options: ["A", "B", "C", "Cannot say"], correctAnswer: 2, explanation: "C is shorter than both A and B." },
    { id: "reasoning-13", subject: "Reasoning & Aptitude", question: "Find the next letter: A, C, E, __", options: ["F", "G", "H", "I"], correctAnswer: 1, explanation: "The pattern skips one letter each time: A, C, E, G." },
    { id: "reasoning-14", subject: "Reasoning & Aptitude", question: "Which word comes first in dictionary order?", options: ["Ball", "Ant", "Cat", "Dog"], correctAnswer: 1, explanation: "Ant comes first alphabetically." },
    { id: "reasoning-15", subject: "Reasoning & Aptitude", question: "John's mother has one son and two daughters. How many sisters does John have?", options: ["0", "1", "2", "3"], correctAnswer: 2, explanation: "John has two sisters." },
    { id: "reasoning-16", subject: "Reasoning & Aptitude", question: "Find the missing number: 2, 6, 12, 20, __", options: ["28", "30", "32", "34"], correctAnswer: 1, explanation: "The differences are +4, +6, +8, so next is +10, giving 30." },
    { id: "reasoning-17", subject: "Reasoning & Aptitude", question: "If today is Friday, what day will it be the day after tomorrow?", options: ["Saturday", "Sunday", "Monday", "Tuesday"], correctAnswer: 1, explanation: "The day after tomorrow from Friday is Sunday." },
    { id: "reasoning-18", subject: "Reasoning & Aptitude", question: "Puppy is to Dog as Kitten is to __", options: ["Cow", "Cat", "Goat", "Tiger"], correctAnswer: 1, explanation: "A kitten is the young one of a cat." },
    { id: "reasoning-19", subject: "Reasoning & Aptitude", question: "Which is the odd one out?", options: ["January", "March", "Monday", "May"], correctAnswer: 2, explanation: "Monday is a day, while the others are months." },
    { id: "reasoning-20", subject: "Reasoning & Aptitude", question: "Find the next number: 100, 90, 80, __", options: ["60", "70", "75", "85"], correctAnswer: 1, explanation: "The pattern decreases by 10 each time." },
  ],
};

/* UI STATE */
const appState = {
  currentScreen: "landingScreen",
  screenHistory: [],
  activeTest: null,
  lastResult: null,
  questionDataMigrationNotice: null,
};

const elements = {};

document.addEventListener("DOMContentLoaded", initApp);

function initApp() {
  cacheElements();
  bindEvents();
  renderSubjectCards();
  hydrateInitialScreen();
}

function cacheElements() {
  [
    "landingScreen",
    "authScreen",
    "dashboardScreen",
    "testScreen",
    "resultsScreen",
    "historyScreen",
    "backButton",
    "logoutButton",
    "takeSampleButton",
    "openAuthButton",
    "showLoginButton",
    "showRegisterButton",
    "authMessage",
    "loginPanel",
    "registerPanel",
    "loginForm",
    "registerForm",
    "welcomeTitle",
    "viewResultsButton",
    "dashboardLogoutButton",
    "subjectGrid",
    "testModeBadge",
    "testTitle",
    "testMeta",
    "timerBadge",
    "progressText",
    "progressFill",
    "questionText",
    "optionsContainer",
    "prevQuestionButton",
    "markReviewButton",
    "nextQuestionButton",
    "submitTestButton",
    "questionPalette",
    "resultsTitle",
    "resultSummaryText",
    "animatedScore",
    "scoreTotalLabel",
    "percentageValue",
    "gradeValue",
    "performanceLabel",
    "reviewContainer",
    "guestPrompt",
    "retakeButton",
    "backToDashboardButton",
    "resultsTableBody",
    "clearResultsButton",
  ].forEach((id) => {
    elements[id] = document.getElementById(id);
  });
}

function bindEvents() {
  elements.takeSampleButton.addEventListener("click", handleSampleEntry);
  elements.openAuthButton.addEventListener("click", () => openAuthScreen("login"));
  elements.showLoginButton.addEventListener("click", () => toggleAuthMode("login"));
  elements.showRegisterButton.addEventListener("click", () => toggleAuthMode("register"));
  elements.loginForm.addEventListener("submit", handleLogin);
  elements.registerForm.addEventListener("submit", handleRegister);
  elements.viewResultsButton.addEventListener("click", showResultsHistory);
  elements.dashboardLogoutButton.addEventListener("click", logoutUser);
  elements.prevQuestionButton.addEventListener("click", goToPreviousQuestion);
  elements.nextQuestionButton.addEventListener("click", goToNextQuestion);
  elements.markReviewButton.addEventListener("click", toggleReviewFlag);
  elements.submitTestButton.addEventListener("click", () => finalizeTest(false));
  elements.retakeButton.addEventListener("click", handleRetake);
  elements.backToDashboardButton.addEventListener("click", () => navigatePostResult());
  elements.clearResultsButton.addEventListener("click", clearResultsHistory);
  elements.backButton.addEventListener("click", handleBackNavigation);
  elements.logoutButton.addEventListener("click", logoutUser);
}

/* STORAGE HELPERS */
function getStorageData(key, fallback) {
  try {
    const rawValue = localStorage.getItem(key);
    return rawValue ? JSON.parse(rawValue) : fallback;
  } catch {
    return fallback;
  }
}

function setStorageData(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getUsers() {
  return getStorageData(STORAGE_KEYS.users, []);
}

function getSession() {
  return getStorageData(STORAGE_KEYS.session, null);
}

function setSession(user) {
  const session = {
    fullName: user.fullName,
    email: user.email,
    classLevel: user.classLevel,
    loggedInAt: new Date().toISOString(),
  };
  setStorageData(STORAGE_KEYS.session, session);
  updateSessionUI();
}

function clearSession() {
  localStorage.removeItem(STORAGE_KEYS.session);
  updateSessionUI();
}

function getAllResults() {
  return getStorageData(STORAGE_KEYS.results, []);
}

function getCurrentUserResults() {
  const session = getSession();
  if (!session) return [];
  return getAllResults().filter((entry) => entry.email === session.email);
}

function saveResult(result) {
  const allResults = getAllResults();
  allResults.unshift(result);
  setStorageData(STORAGE_KEYS.results, allResults);
}

/* AUTH FUNCTIONS */
function handleRegister(event) {
  event.preventDefault();

  const fullName = document.getElementById("registerName").value.trim();
  const email = document.getElementById("registerEmail").value.trim().toLowerCase();
  const mobile = document.getElementById("registerMobile").value.trim();
  const classLevel = document.getElementById("registerClass").value.trim();
  const password = document.getElementById("registerPassword").value.trim();

  if (!fullName || !email || !mobile || !classLevel || !password) {
    showAuthMessage("All registration fields are required.", "error");
    return;
  }

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    showAuthMessage("Please enter a valid email address.", "error");
    return;
  }

  if (!/^\d{10}$/.test(mobile)) {
    showAuthMessage("Mobile number must contain exactly 10 digits.", "error");
    return;
  }

  const users = getUsers();
  const existingUser = users.find((user) => user.email === email);
  if (existingUser) {
    showAuthMessage("An account with this email already exists. Please log in instead.", "error");
    toggleAuthMode("login");
    document.getElementById("loginEmail").value = email;
    return;
  }

  const newUser = {
    id: `user-${Date.now()}`,
    fullName,
    email,
    mobile,
    classLevel,
    password,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  setStorageData(STORAGE_KEYS.users, users);
  setSession(newUser);
  showAuthMessage("Registration successful! Welcome to PR Classes Mock Test.", "success");
  elements.registerForm.reset();
  renderDashboard();
  appState.screenHistory = [];
  showScreen("dashboardScreen", false);
}

function handleLogin(event) {
  event.preventDefault();

  const email = document.getElementById("loginEmail").value.trim().toLowerCase();
  const password = document.getElementById("loginPassword").value.trim();
  const user = getUsers().find((entry) => entry.email === email && entry.password === password);

  if (!user) {
    showAuthMessage("Login failed. Please check your email and password.", "error");
    return;
  }

  setSession(user);
  showAuthMessage(`Welcome back, ${user.fullName}!`, "success");
  renderDashboard();
  appState.screenHistory = [];
  showScreen("dashboardScreen", false);
}

function logoutUser() {
  stopTestTimer();
  appState.activeTest = null;
  appState.lastResult = null;
  clearSession();
  appState.screenHistory = [];
  showScreen("landingScreen", false);
}

function updateSessionUI() {
  const session = getSession();
  elements.logoutButton.classList.toggle("hidden", !session);
}

function showAuthMessage(message, type) {
  elements.authMessage.textContent = message;
  elements.authMessage.className = `inline-message ${type}`;
}

function openAuthScreen(mode) {
  toggleAuthMode(mode);
  showScreen("authScreen");
}

function toggleAuthMode(mode) {
  const isLogin = mode === "login";
  elements.showLoginButton.classList.toggle("active", isLogin);
  elements.showRegisterButton.classList.toggle("active", !isLogin);
  elements.loginPanel.classList.toggle("active", isLogin);
  elements.registerPanel.classList.toggle("active", !isLogin);
  elements.authMessage.className = "inline-message hidden";
  elements.authMessage.textContent = "";
}

/* TEST LOGIC */
function handleSampleEntry() {
  const alreadyTried = localStorage.getItem(STORAGE_KEYS.sampleAttempted) === "true";
  if (alreadyTried && !getSession()) {
    openAuthScreen("register");
    showAuthMessage("Your free sample test is complete. Register now to unlock the full test library.", "success");
    return;
  }

  startTestSession({
    mode: "sample",
    subject: "General Knowledge",
    questions: shuffleArray(QUESTION_BANK["General Knowledge"]).slice(0, CONFIG.sampleQuestionCount),
    durationSeconds: CONFIG.sampleTimeSeconds,
  });
}

function startFullTest(subject) {
  if (!getSession()) {
    openAuthScreen("register");
    return;
  }

  startTestSession({
    mode: "full",
    subject,
    questions: buildQuestionSet(subject, CONFIG.fullTestQuestionCount),
    durationSeconds: CONFIG.fullTestTimeSeconds,
  });
}

function buildQuestionSet(subject, count) {
  const source = shuffleArray(QUESTION_BANK[subject]);
  if (source.length >= count) {
    return source.slice(0, count);
  }

  const expanded = [];
  while (expanded.length < count) {
    shuffleArray(QUESTION_BANK[subject]).forEach((question, index) => {
      if (expanded.length < count) {
        expanded.push({ ...question, id: `${question.id}-${expanded.length}-${index}` });
      }
    });
  }
  return expanded;
}

function startTestSession({ mode, subject, questions, durationSeconds }) {
  stopTestTimer();

  appState.activeTest = {
    mode,
    subject,
    questions,
    answers: Array(questions.length).fill(null),
    markedForReview: Array(questions.length).fill(false),
    visited: Array(questions.length).fill(false),
    currentIndex: 0,
    remainingSeconds: durationSeconds,
    timerId: null,
    startedAt: Date.now(),
  };

  renderTestScreen();
  showScreen("testScreen");
  startTestTimer();
}

function startTestTimer() {
  if (!appState.activeTest) return;

  updateTimerBadge();
  appState.activeTest.timerId = window.setInterval(() => {
    if (!appState.activeTest) return;
    appState.activeTest.remainingSeconds -= 1;
    updateTimerBadge();

    if (appState.activeTest.remainingSeconds <= 0) {
      finalizeTest(true);
    }
  }, 1000);
}

function stopTestTimer() {
  if (appState.activeTest?.timerId) {
    clearInterval(appState.activeTest.timerId);
    appState.activeTest.timerId = null;
  }
}

function updateTimerBadge() {
  if (!appState.activeTest) return;
  const minutes = String(Math.floor(appState.activeTest.remainingSeconds / 60)).padStart(2, "0");
  const seconds = String(appState.activeTest.remainingSeconds % 60).padStart(2, "0");
  elements.timerBadge.textContent = `${minutes}:${seconds}`;
  elements.timerBadge.classList.toggle("urgent", appState.activeTest.remainingSeconds <= 60);
}

function renderTestScreen() {
  const test = appState.activeTest;
  if (!test) return;

  const currentQuestion = test.questions[test.currentIndex];
  test.visited[test.currentIndex] = true;

  elements.testModeBadge.textContent = test.mode === "sample" ? "Sample Test" : "Full Subject Test";
  elements.testTitle.textContent = `${test.subject}`;
  elements.testMeta.textContent = `${test.questions.length} questions • ${test.mode === "sample" ? "Guest mode" : "Registered mode"}`;
  elements.progressText.textContent = `Question ${test.currentIndex + 1} of ${test.questions.length}`;
  elements.progressFill.style.width = `${((test.currentIndex + 1) / test.questions.length) * 100}%`;
  elements.questionText.textContent = currentQuestion.question;
  elements.markReviewButton.textContent = test.markedForReview[test.currentIndex] ? "Unmark Review" : "Mark for Review";
  elements.prevQuestionButton.disabled = test.currentIndex === 0;
  elements.nextQuestionButton.disabled = test.currentIndex === test.questions.length - 1;

  renderOptions(currentQuestion, test.answers[test.currentIndex]);
  renderQuestionPalette();
}

function renderOptions(question, selectedAnswer) {
  const optionsMarkup = question.options
    .map((option, index) => {
      const isSelected = selectedAnswer === index;
      return `
        <button class="option-button ${isSelected ? "selected" : ""}" data-option-index="${index}" type="button">
          <strong>${String.fromCharCode(65 + index)}.</strong> ${option}
        </button>
      `;
    })
    .join("");

  elements.optionsContainer.innerHTML = optionsMarkup;
  elements.optionsContainer.querySelectorAll(".option-button").forEach((button) => {
    button.addEventListener("click", () => {
      const optionIndex = Number(button.dataset.optionIndex);
      selectAnswer(optionIndex);
    });
  });
}

function selectAnswer(optionIndex) {
  const test = appState.activeTest;
  if (!test) return;

  test.answers[test.currentIndex] = optionIndex;
  renderTestScreen();
}

function toggleReviewFlag() {
  const test = appState.activeTest;
  if (!test) return;

  test.markedForReview[test.currentIndex] = !test.markedForReview[test.currentIndex];
  renderTestScreen();
}

function goToPreviousQuestion() {
  const test = appState.activeTest;
  if (!test || test.currentIndex === 0) return;

  test.currentIndex -= 1;
  renderTestScreen();
}

function goToNextQuestion() {
  const test = appState.activeTest;
  if (!test || test.currentIndex === test.questions.length - 1) return;

  test.currentIndex += 1;
  renderTestScreen();
}

function jumpToQuestion(index) {
  const test = appState.activeTest;
  if (!test) return;
  test.currentIndex = index;
  renderTestScreen();
}

function getQuestionStatus(index) {
  const test = appState.activeTest;
  if (!test) return "unanswered";

  if (test.markedForReview[index]) return "review";
  if (test.answers[index] !== null) return "answered";
  if (test.visited[index] && index !== test.currentIndex) return "skipped";
  return "unanswered";
}

function renderQuestionPalette() {
  const test = appState.activeTest;
  if (!test) return;

  elements.questionPalette.innerHTML = test.questions
    .map((_, index) => {
      const status = getQuestionStatus(index);
      const isCurrent = index === test.currentIndex ? "current" : "";
      return `<button class="palette-button ${status} ${isCurrent}" type="button" data-question-index="${index}">${index + 1}</button>`;
    })
    .join("");

  elements.questionPalette.querySelectorAll(".palette-button").forEach((button) => {
    button.addEventListener("click", () => jumpToQuestion(Number(button.dataset.questionIndex)));
  });
}

function finalizeTest(autoSubmitted) {
  const test = appState.activeTest;
  if (!test) return;

  stopTestTimer();
  if (test.mode === "sample") {
    localStorage.setItem(STORAGE_KEYS.sampleAttempted, "true");
  }

  const correctAnswers = test.questions.reduce((count, question, index) => {
    return count + (test.answers[index] === question.correctAnswer ? 1 : 0);
  }, 0);
  const totalQuestions = test.questions.length;
  const percentage = Math.round((correctAnswers / totalQuestions) * 100);
  const gradeInfo = getGrade(percentage);
  const session = getSession();
  const savedAt = new Date().toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const reviewItems = test.questions.map((question, index) => ({
    questionNumber: index + 1,
    question: question.question,
    userAnswer: test.answers[index],
    correctAnswer: question.correctAnswer,
    options: question.options,
    explanation: question.explanation,
    isCorrect: test.answers[index] === question.correctAnswer,
  }));

  appState.lastResult = {
    mode: test.mode,
    subject: test.subject,
    score: correctAnswers,
    totalQuestions,
    percentage,
    grade: gradeInfo.grade,
    performance: gradeInfo.label,
    savedAt,
    autoSubmitted,
    reviewItems,
  };

  if (test.mode === "full" && session) {
    saveResult({
      email: session.email,
      subject: test.subject,
      score: correctAnswers,
      totalQuestions,
      percentage,
      grade: gradeInfo.grade,
      dateTaken: savedAt,
    });
  }

  appState.activeTest = null;
  renderResultScreen();
  showScreen("resultsScreen");
}

function getGrade(percentage) {
  if (percentage >= 90) return { grade: "A+", label: "Excellent" };
  if (percentage >= 75) return { grade: "A", label: "Good" };
  if (percentage >= 60) return { grade: "B", label: "Average" };
  return { grade: "C", label: "Needs Improvement" };
}

/* UI FUNCTIONS */
function hydrateInitialScreen() {
  document.title = `${CONFIG.schoolName} Mock Test`;
  const session = getSession();
  if (session) {
    renderDashboard();
    appState.screenHistory = [];
    showScreen("dashboardScreen", false);
    return;
  }

  appState.screenHistory = [];
  showScreen("landingScreen", false);
}

function showScreen(screenId, pushHistory = true) {
  if (pushHistory && appState.currentScreen && appState.currentScreen !== screenId) {
    appState.screenHistory.push(appState.currentScreen);
  }

  document.querySelectorAll(".screen").forEach((screen) => {
    screen.classList.toggle("active", screen.id === screenId);
  });

  appState.currentScreen = screenId;
  elements.backButton.classList.toggle("hidden", appState.screenHistory.length === 0);
}

function handleBackNavigation() {
  if (appState.currentScreen === "testScreen" && appState.activeTest) {
    const shouldLeave = window.confirm("Leaving now will end the current attempt. Do you want to continue?");
    if (!shouldLeave) return;
    stopTestTimer();
    appState.activeTest = null;
  }

  const previousScreen = appState.screenHistory.pop();
  if (!previousScreen) {
    showScreen("landingScreen", false);
    return;
  }

  showScreen(previousScreen, false);
  if (previousScreen === "dashboardScreen") {
    renderDashboard();
  }
  if (previousScreen === "historyScreen") {
    renderResultsTable();
  }
}

function renderDashboard() {
  const session = getSession();
  if (!session) {
    showScreen("landingScreen", false);
    return;
  }

  elements.welcomeTitle.textContent = `Hello, ${session.fullName}!`;
  renderSubjectCards();
}

function renderSubjectCards() {
  elements.subjectGrid.innerHTML = Object.entries(SUBJECTS)
    .map(([subject, details]) => {
      return `
        <button class="subject-card" type="button" data-subject="${subject}">
          <div class="subject-card-top">
            <div class="subject-icon">${details.icon}</div>
            <span class="difficulty-badge">${details.difficulty}</span>
          </div>
          <h3>${subject}</h3>
          <p>${details.description}</p>
          <div class="subject-card-meta">
            <span>${CONFIG.fullTestQuestionCount} questions</span>
            <span>${Math.floor(CONFIG.fullTestTimeSeconds / 60)} mins</span>
          </div>
        </button>
      `;
    })
    .join("");

  elements.subjectGrid.querySelectorAll(".subject-card").forEach((button) => {
    button.addEventListener("click", () => startFullTest(button.dataset.subject));
  });
}

function renderResultScreen() {
  const result = appState.lastResult;
  if (!result) return;

  elements.resultsTitle.textContent = `${result.subject} Result`;
  elements.resultSummaryText.textContent = `${result.autoSubmitted ? "Auto-submitted" : "Submitted"} • ${result.score} out of ${result.totalQuestions}`;
  elements.scoreTotalLabel.textContent = `/${result.totalQuestions}`;
  elements.percentageValue.textContent = `${result.percentage}%`;
  elements.gradeValue.textContent = result.grade;
  elements.performanceLabel.textContent = result.performance;
  animateScore(result.score);

  elements.reviewContainer.innerHTML = result.reviewItems
    .map((item) => {
      const userAnswerText = item.userAnswer === null ? "Not answered" : item.options[item.userAnswer];
      const correctAnswerText = item.options[item.correctAnswer];
      return `
        <article class="review-item ${item.isCorrect ? "correct-review" : "wrong-review"}">
          <h4>Q${item.questionNumber}. ${item.question}</h4>
          <p class="review-answer"><strong>Your answer:</strong> ${userAnswerText}</p>
          <p class="review-answer"><strong>Correct answer:</strong> ${correctAnswerText}</p>
          <p class="review-answer"><strong>Explanation:</strong> ${item.explanation}</p>
        </article>
      `;
    })
    .join("");

  const isGuestSample = result.mode === "sample" && !getSession();
  elements.guestPrompt.classList.toggle("hidden", !isGuestSample);
  if (isGuestSample) {
    elements.guestPrompt.innerHTML = `
      <strong>Sample complete.</strong> Register now to save results, unlock all subjects, and take full timed tests.
      <div style="margin-top: 0.85rem;">
        <button id="resultRegisterButton" class="solid-button accent-button" type="button">Register for Full Access</button>
      </div>
    `;
    document.getElementById("resultRegisterButton").addEventListener("click", () => {
      openAuthScreen("register");
      showAuthMessage("Create your account to unlock the full test dashboard.", "success");
    });
    elements.retakeButton.textContent = "Register for Full Tests";
  } else {
    elements.guestPrompt.innerHTML = "";
    elements.retakeButton.textContent = "Retake Test";
  }
}

function animateScore(targetScore) {
  let currentValue = 0;
  const duration = 700;
  const frameCount = 30;
  const stepValue = targetScore / frameCount;
  const stepTime = duration / frameCount;

  elements.animatedScore.textContent = "0";

  const counter = window.setInterval(() => {
    currentValue += stepValue;
    if (currentValue >= targetScore) {
      elements.animatedScore.textContent = String(targetScore);
      clearInterval(counter);
      return;
    }
    elements.animatedScore.textContent = String(Math.round(currentValue));
  }, stepTime);
}

function handleRetake() {
  const result = appState.lastResult;
  if (!result) return;

  if (result.mode === "sample" && !getSession()) {
    openAuthScreen("register");
    showAuthMessage("Register now to continue with the full mock test library.", "success");
    return;
  }

  if (result.mode === "sample") {
    handleSampleEntry();
    return;
  }

  startFullTest(result.subject);
}

function navigatePostResult() {
  if (getSession()) {
    renderDashboard();
    showScreen("dashboardScreen", false);
    return;
  }
  showScreen("landingScreen", false);
}

function showResultsHistory() {
  if (!getSession()) {
    openAuthScreen("login");
    return;
  }

  renderResultsTable();
  showScreen("historyScreen");
}

function renderResultsTable() {
  const results = getCurrentUserResults();
  if (!results.length) {
    elements.resultsTableBody.innerHTML = `<tr><td colspan="5" class="empty-state">No saved test attempts yet. Start a full test to build your history.</td></tr>`;
    return;
  }

  elements.resultsTableBody.innerHTML = results
    .map((result) => {
      return `
        <tr>
          <td>${result.subject}</td>
          <td>${result.score}/${result.totalQuestions}</td>
          <td>${result.percentage}%</td>
          <td>${result.grade}</td>
          <td>${result.dateTaken}</td>
        </tr>
      `;
    })
    .join("");
}

function clearResultsHistory() {
  const session = getSession();
  if (!session) return;

  const shouldClear = window.confirm("Clear all saved test history for this student?");
  if (!shouldClear) return;

  const remainingResults = getAllResults().filter((entry) => entry.email !== session.email);
  setStorageData(STORAGE_KEYS.results, remainingResults);
  renderResultsTable();
}

/* UTILITIES */
function shuffleArray(array) {
  const items = [...array];
  for (let index = items.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [items[index], items[swapIndex]] = [items[swapIndex], items[index]];
  }
  return items;
}

/* ADMIN + DYNAMIC SUBJECT EXTENSIONS */
const DEFAULT_SUBJECTS = JSON.parse(JSON.stringify(SUBJECTS));
const DEFAULT_QUESTION_BANK = JSON.parse(JSON.stringify(QUESTION_BANK));

function normalizeSubjectName(value) {
  return String(value || "")
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .trim()
    .replace(/\s+/g, " ");
}

function slugifySubject(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getDefaultSubjectMeta(subject) {
  if (DEFAULT_SUBJECTS[subject]) return { ...DEFAULT_SUBJECTS[subject] };
  const parts = subject.split(" ").filter(Boolean);
  const icon = parts.length > 1
    ? parts.slice(0, 2).map((part) => part.charAt(0).toUpperCase()).join("")
    : subject.slice(0, 2).toUpperCase();

  return {
    icon: icon || "S",
    difficulty: "Custom",
    description: `${subject} mock tests uploaded by admin.`,
  };
}

function getFreshDefaultQuestionData() {
  return {
    subjects: JSON.parse(JSON.stringify(DEFAULT_SUBJECTS)),
    questionBank: JSON.parse(JSON.stringify(DEFAULT_QUESTION_BANK)),
  };
}

function migrateStoredQuestionData() {
  const storedVersion = Number(localStorage.getItem(STORAGE_KEYS.questionDataVersion) || "0");
  if (storedVersion >= QUESTION_DATA_STORAGE_VERSION) return null;

  const storedSubjects = getStorageData(STORAGE_KEYS.subjects, null);
  const storedQuestionBank = getStorageData(STORAGE_KEYS.questionBank, null);

  const hasStoredSubjects = storedSubjects !== null;
  const hasStoredQuestionBank = storedQuestionBank !== null;
  if (!hasStoredSubjects && !hasStoredQuestionBank) {
    localStorage.setItem(STORAGE_KEYS.questionDataVersion, String(QUESTION_DATA_STORAGE_VERSION));
    return null;
  }

  const hasValidSubjectsShape = !hasStoredSubjects || (typeof storedSubjects === "object" && !Array.isArray(storedSubjects));
  const hasValidQuestionBankShape = !hasStoredQuestionBank || (typeof storedQuestionBank === "object" && !Array.isArray(storedQuestionBank));

  if (!hasValidSubjectsShape || !hasValidQuestionBankShape) {
    const defaults = getFreshDefaultQuestionData();
    setStorageData(STORAGE_KEYS.subjects, defaults.subjects);
    setStorageData(STORAGE_KEYS.questionBank, defaults.questionBank);
    localStorage.setItem(STORAGE_KEYS.questionDataVersion, String(QUESTION_DATA_STORAGE_VERSION));
    return {
      ...defaults,
      migrationNotice: "Question data storage was invalid and has been reset to default subjects on this device.",
    };
  }

  const migratedSubjects = {};
  const migratedQuestionBank = {};
  let didRepairStorage = false;

  Object.entries(storedSubjects || {}).forEach(([rawSubject, meta]) => {
    const normalizedSubject = normalizeSubjectName(rawSubject);
    if (!normalizedSubject) {
      didRepairStorage = true;
      return;
    }
    if (normalizedSubject !== rawSubject) didRepairStorage = true;
    if (!meta || typeof meta !== "object" || Array.isArray(meta)) {
      didRepairStorage = true;
      return;
    }
    if (!migratedSubjects[normalizedSubject]) {
      migratedSubjects[normalizedSubject] = meta;
      return;
    }

    didRepairStorage = true;
  });

  Object.entries(storedQuestionBank || {}).forEach(([rawSubject, questions]) => {
    const normalizedSubject = normalizeSubjectName(rawSubject);
    if (!normalizedSubject || !Array.isArray(questions)) {
      didRepairStorage = true;
      return;
    }
    if (normalizedSubject !== rawSubject) didRepairStorage = true;

    if (!migratedQuestionBank[normalizedSubject]) {
      migratedQuestionBank[normalizedSubject] = [];
    }

    questions.forEach((question) => {
      if (!question || typeof question !== "object" || Array.isArray(question)) {
        didRepairStorage = true;
        return;
      }
      if (question.subject !== normalizedSubject) didRepairStorage = true;
      migratedQuestionBank[normalizedSubject].push({
        ...question,
        subject: normalizedSubject,
      });
    });
  });

  Object.keys(migratedQuestionBank).forEach((subject) => {
    if (!migratedSubjects[subject]) {
      didRepairStorage = true;
      migratedSubjects[subject] = getDefaultSubjectMeta(subject);
    }
  });

  setStorageData(STORAGE_KEYS.subjects, migratedSubjects);
  setStorageData(STORAGE_KEYS.questionBank, migratedQuestionBank);
  localStorage.setItem(STORAGE_KEYS.questionDataVersion, String(QUESTION_DATA_STORAGE_VERSION));

  return {
    subjects: migratedSubjects,
    questionBank: migratedQuestionBank,
    migrationNotice: didRepairStorage ? "Question data storage was repaired automatically on this device." : null,
  };
}

function syncSubjectCatalogFromQuestionBank() {
  // Normalize stale SUBJECTS keys (strip hidden unicode, extra spaces)
  const _normalizedSubjectsSnap = {};
  Object.keys(SUBJECTS).forEach((rawKey) => {
    const cleanKey = normalizeSubjectName(rawKey);
    if (!cleanKey) return;
    if (!_normalizedSubjectsSnap[cleanKey]) _normalizedSubjectsSnap[cleanKey] = SUBJECTS[rawKey];
  });
  Object.keys(SUBJECTS).forEach((k) => delete SUBJECTS[k]);
  Object.assign(SUBJECTS, _normalizedSubjectsSnap);

  const normalizedQuestionBank = {};

  Object.keys(QUESTION_BANK).forEach((rawSubject) => {
    const normalizedSubject = normalizeSubjectName(rawSubject);
    if (!normalizedSubject) return;

    const questions = Array.isArray(QUESTION_BANK[rawSubject]) ? QUESTION_BANK[rawSubject] : [];
    if (!normalizedQuestionBank[normalizedSubject]) {
      normalizedQuestionBank[normalizedSubject] = [];
    }

    questions.forEach((question) => {
      normalizedQuestionBank[normalizedSubject].push({
        ...question,
        subject: normalizedSubject,
      });
    });
  });

  Object.keys(QUESTION_BANK).forEach((subject) => delete QUESTION_BANK[subject]);
  Object.assign(QUESTION_BANK, normalizedQuestionBank);

  Object.keys(QUESTION_BANK).forEach((subject) => {
    if (!SUBJECTS[subject]) {
      SUBJECTS[subject] = getDefaultSubjectMeta(subject);
    }
  });
}
function hydrateQuestionData() {
  const migratedData = migrateStoredQuestionData();
  appState.questionDataMigrationNotice = migratedData?.migrationNotice || null;
  const storedSubjects = migratedData ? migratedData.subjects : getStorageData(STORAGE_KEYS.subjects, null);
  const storedQuestionBank = migratedData ? migratedData.questionBank : getStorageData(STORAGE_KEYS.questionBank, null);

  if (storedSubjects && typeof storedSubjects === "object") {
    Object.keys(SUBJECTS).forEach((subject) => delete SUBJECTS[subject]);
    Object.assign(SUBJECTS, storedSubjects);
  }

  if (storedQuestionBank && typeof storedQuestionBank === "object") {
    Object.keys(QUESTION_BANK).forEach((subject) => delete QUESTION_BANK[subject]);
    Object.assign(QUESTION_BANK, storedQuestionBank);
  }

  Object.keys(SUBJECTS).forEach((subject) => {
    const normalizedSubject = normalizeSubjectName(subject);
    if (normalizedSubject !== subject) {
      SUBJECTS[normalizedSubject] = SUBJECTS[subject];
      delete SUBJECTS[subject];
    }
  });

  syncSubjectCatalogFromQuestionBank();

  Object.keys(SUBJECTS).forEach((subject) => {
    if (!Array.isArray(QUESTION_BANK[subject])) QUESTION_BANK[subject] = [];
  });

  saveQuestionData();
}

function saveQuestionData() {
  syncSubjectCatalogFromQuestionBank();
  setStorageData(STORAGE_KEYS.subjects, SUBJECTS);
  setStorageData(STORAGE_KEYS.questionBank, QUESTION_BANK);
  localStorage.setItem(STORAGE_KEYS.questionDataVersion, String(QUESTION_DATA_STORAGE_VERSION));
}

function ensureSubject(subjectName) {
  const subject = normalizeSubjectName(subjectName);
  if (!subject) return null;

  if (!SUBJECTS[subject]) {
    SUBJECTS[subject] = getDefaultSubjectMeta(subject);
  }

  if (!Array.isArray(QUESTION_BANK[subject])) {
    QUESTION_BANK[subject] = [];
  }

  return subject;
}

function addQuestionToBank(subject, inputQuestion) {
  const safeSubject = ensureSubject(subject);
  if (!safeSubject) return false;

  const questionText = String(inputQuestion.question || "").trim();
  const options = Array.isArray(inputQuestion.options)
    ? inputQuestion.options.map((option) => String(option || "").trim())
    : [];

  if (!questionText || options.length !== 4 || options.some((option) => !option)) return false;

  const correctAnswer = Number(inputQuestion.correctAnswer);
  if (Number.isNaN(correctAnswer) || correctAnswer < 0 || correctAnswer > 3) return false;

  QUESTION_BANK[safeSubject].push({
    id: inputQuestion.id || `${slugifySubject(safeSubject)}-${Date.now()}-${Math.floor(Math.random() * 100000)}`,
    subject: safeSubject,
    question: questionText,
    options,
    correctAnswer,
    explanation: String(inputQuestion.explanation || "No explanation provided.").trim() || "No explanation provided.",
  });

  return true;
}

function getAllQuestionsFlat() {
  return Object.keys(QUESTION_BANK).flatMap((subject) =>
    (QUESTION_BANK[subject] || []).map((question) => ({ ...question, subject })),
  );
}

initApp = function () {
  cacheElements();
  hydrateQuestionData();
  bindEvents();
  initializeAdminWorkspace();
  renderSubjectCards();
  hydrateInitialScreen();
}

cacheElements = function () {
  [
    "landingScreen",
    "authScreen",
    "dashboardScreen",
    "testScreen",
    "resultsScreen",
    "historyScreen",
    "adminScreen",
    "backButton",
    "logoutButton",
    "takeSampleButton",
    "openAuthButton",
    "openAdminButton",
    "landingAdminButton",
    "showLoginButton",
    "showRegisterButton",
    "authMessage",
    "loginPanel",
    "registerPanel",
    "loginForm",
    "registerForm",
    "welcomeTitle",
    "viewResultsButton",
    "dashboardLogoutButton",
    "subjectGrid",
    "testModeBadge",
    "testTitle",
    "testMeta",
    "timerBadge",
    "progressText",
    "progressFill",
    "questionText",
    "optionsContainer",
    "prevQuestionButton",
    "markReviewButton",
    "nextQuestionButton",
    "submitTestButton",
    "questionPalette",
    "resultsTitle",
    "resultSummaryText",
    "animatedScore",
    "scoreTotalLabel",
    "percentageValue",
    "gradeValue",
    "performanceLabel",
    "reviewContainer",
    "guestPrompt",
    "retakeButton",
    "backToDashboardButton",
    "resultsTableBody",
    "clearResultsButton",
    "adminMessage",
    "adminLoginPanel",
    "adminWorkspace",
    "adminLoginForm",
    "adminTabAdd",
    "adminTabImport",
    "adminTabList",
    "adminAddPanel",
    "adminImportPanel",
    "adminListPanel",
    "addQuestionForm",
    "questionSubject",
    "questionCorrectIndex",
    "questionTextInput",
    "questionOption1",
    "questionOption2",
    "questionOption3",
    "questionOption4",
    "questionExplanation",
    "importSubjectSelect",
    "newSubjectName",
    "createSubjectButton",
    "excelFileInput",
    "importExcelButton",
    "downloadTemplateButton",
    "adminSubjectFilter",
    "adminQuestionTableBody",
    "resetQuestionBankButton",
  ].forEach((id) => {
    elements[id] = document.getElementById(id);
  });
}

bindEvents = function () {
  elements.takeSampleButton.addEventListener("click", handleSampleEntry);
  elements.openAuthButton.addEventListener("click", () => openAuthScreen("login"));
  elements.showLoginButton.addEventListener("click", () => toggleAuthMode("login"));
  elements.showRegisterButton.addEventListener("click", () => toggleAuthMode("register"));
  elements.loginForm.addEventListener("submit", handleLogin);
  elements.registerForm.addEventListener("submit", handleRegister);
  elements.viewResultsButton.addEventListener("click", showResultsHistory);
  elements.dashboardLogoutButton.addEventListener("click", logoutUser);
  elements.prevQuestionButton.addEventListener("click", goToPreviousQuestion);
  elements.nextQuestionButton.addEventListener("click", goToNextQuestion);
  elements.markReviewButton.addEventListener("click", toggleReviewFlag);
  elements.submitTestButton.addEventListener("click", () => finalizeTest(false));
  elements.retakeButton.addEventListener("click", handleRetake);
  elements.backToDashboardButton.addEventListener("click", () => navigatePostResult());
  elements.clearResultsButton.addEventListener("click", clearResultsHistory);
  elements.backButton.addEventListener("click", handleBackNavigation);
  elements.logoutButton.addEventListener("click", logoutUser);

  elements.openAdminButton.addEventListener("click", () => openAdminScreen());
  elements.landingAdminButton.addEventListener("click", () => openAdminScreen());
  elements.adminLoginForm.addEventListener("submit", handleAdminLogin);
  elements.adminTabAdd.addEventListener("click", () => setAdminTab("add"));
  elements.adminTabImport.addEventListener("click", () => setAdminTab("import"));
  elements.adminTabList.addEventListener("click", () => setAdminTab("list"));
  elements.addQuestionForm.addEventListener("submit", handleAddQuestion);
  elements.createSubjectButton.addEventListener("click", handleCreateSubject);
  elements.importExcelButton.addEventListener("click", handleExcelImport);
  elements.downloadTemplateButton.addEventListener("click", downloadTemplateCsv);
  elements.adminSubjectFilter.addEventListener("change", renderAdminQuestionTable);
  elements.resetQuestionBankButton.addEventListener("click", resetQuestionBankToDefault);
}

handleSampleEntry = function () {
  const alreadyTried = localStorage.getItem(STORAGE_KEYS.sampleAttempted) === "true";
  if (alreadyTried && !getSession()) {
    openAuthScreen("register");
    showAuthMessage("Your free sample test is complete. Register now to unlock the full test library.", "success");
    return;
  }

  if (!QUESTION_BANK["General Knowledge"] || QUESTION_BANK["General Knowledge"].length === 0) {
    window.alert("Sample subject currently has no questions. Please contact admin.");
    return;
  }

  startTestSession({
    mode: "sample",
    subject: "General Knowledge",
    questions: shuffleArray(QUESTION_BANK["General Knowledge"]).slice(0, CONFIG.sampleQuestionCount),
    durationSeconds: CONFIG.sampleTimeSeconds,
  });
}

startFullTest = function (subject) {
  if (!getSession()) {
    openAuthScreen("register");
    return;
  }

  const questionCount = (QUESTION_BANK[subject] || []).length;
  if (!questionCount) {
    window.alert("Questions are not available for this subject yet.");
    return;
  }

  startTestSession({
    mode: "full",
    subject,
    questions: buildQuestionSet(subject, CONFIG.fullTestQuestionCount),
    durationSeconds: CONFIG.fullTestTimeSeconds,
  });
}

buildQuestionSet = function (subject, count) {
  const sourceBank = QUESTION_BANK[subject] || [];
  const source = shuffleArray(sourceBank);
  if (!source.length) return [];

  if (source.length >= count) {
    return source.slice(0, count);
  }

  const expanded = [];
  while (expanded.length < count) {
    shuffleArray(sourceBank).forEach((question, index) => {
      if (expanded.length < count) {
        expanded.push({ ...question, id: `${question.id}-${expanded.length}-${index}` });
      }
    });
  }
  return expanded;
}

hydrateInitialScreen = function () {
  document.title = `${CONFIG.schoolName} Mock Test`;
  const params = new URLSearchParams(window.location.search);
  if (params.get("openAdmin") === "1") {
    openAdminScreen(false);
    return;
  }

  const session = getSession();
  if (session) {
    renderDashboard();
    appState.screenHistory = [];
    showScreen("dashboardScreen", false);
    return;
  }

  appState.screenHistory = [];
  showScreen("landingScreen", false);
}

renderSubjectCards = function () {
  syncSubjectCatalogFromQuestionBank();

  const availableSubjects = Object.entries(SUBJECTS).filter(([subject]) => {
    const questions = QUESTION_BANK[subject] || [];
    return questions.length > 0;
  });

  if (!availableSubjects.length) {
    elements.subjectGrid.innerHTML = `<div class="empty-state">No subjects available yet. Please ask admin to upload question bank.</div>`;
    return;
  }

  elements.subjectGrid.innerHTML = availableSubjects
    .map(([subject, details]) => {
      return `
        <button class="subject-card" type="button" data-subject="${subject}">
          <div class="subject-card-top">
            <div class="subject-icon">${details.icon}</div>
            <span class="difficulty-badge">${details.difficulty}</span>
          </div>
          <h3>${subject}</h3>
          <p>${details.description}</p>
          <div class="subject-card-meta">
            <span>${CONFIG.fullTestQuestionCount} questions</span>
            <span>${Math.floor(CONFIG.fullTestTimeSeconds / 60)} mins</span>
          </div>
        </button>
      `;
    })
    .join("");

  elements.subjectGrid.querySelectorAll(".subject-card").forEach((button) => {
    button.addEventListener("click", () => startFullTest(button.dataset.subject));
  });
}

handleRetake = function () {
  const result = appState.lastResult;
  if (!result) return;

  if (result.mode === "sample" && !getSession()) {
    openAuthScreen("register");
    showAuthMessage("Register now to continue with the full mock test library.", "success");
    return;
  }

  if (result.mode === "sample") {
    handleSampleEntry();
    return;
  }

  if (!QUESTION_BANK[result.subject] || QUESTION_BANK[result.subject].length === 0) {
    window.alert("This subject currently has no questions.");
    navigatePostResult();
    return;
  }

  startFullTest(result.subject);
}

function initializeAdminWorkspace() {
  appState.activeAdminTab = "add";
  refreshAdminSubjectControls();
  setAdminTab(appState.activeAdminTab);
  const isAdminLoggedIn = getStorageData(STORAGE_KEYS.adminSession, false) === true;
  setAdminAuthState(isAdminLoggedIn);
  if (isAdminLoggedIn) showPendingAdminMigrationNotice();
}

function openAdminScreen(pushHistory = true) {
  showScreen("adminScreen", pushHistory);
  refreshAdminSubjectControls();
  renderAdminQuestionTable();
  setAdminTab("import");
  if (!elements.adminWorkspace.classList.contains("hidden")) showPendingAdminMigrationNotice();
}

function setAdminAuthState(isLoggedIn) {
  elements.adminLoginPanel.classList.toggle("hidden", isLoggedIn);
  elements.adminWorkspace.classList.toggle("hidden", !isLoggedIn);
}

function showAdminMessage(message, type = "success") {
  elements.adminMessage.textContent = message;
  elements.adminMessage.className = `inline-message ${type}`;
}

function consumeQuestionDataMigrationNotice() {
  const notice = appState.questionDataMigrationNotice;
  appState.questionDataMigrationNotice = null;
  return notice;
}

function showPendingAdminMigrationNotice() {
  const notice = consumeQuestionDataMigrationNotice();
  if (!notice) return false;

  showAdminMessage(notice, "success");
  return true;
}

function handleAdminLogin(event) {
  event.preventDefault();
  const email = (document.getElementById("adminEmail")?.value || "").trim().toLowerCase();
  const password = (document.getElementById("adminPassword")?.value || "").trim();

  if (email !== "admin@prclasses.in" || password !== "123456") {
    showAdminMessage("Invalid admin credentials.", "error");
    return;
  }

  setStorageData(STORAGE_KEYS.adminSession, true);
  setAdminAuthState(true);
  refreshAdminSubjectControls();
  setAdminTab("import");
  const migrationNotice = consumeQuestionDataMigrationNotice();
  showAdminMessage(migrationNotice ? `Admin login successful. ${migrationNotice}` : "Admin login successful.", "success");
}

function setAdminTab(tab) {
  appState.activeAdminTab = tab;

  elements.adminTabAdd.classList.toggle("active", tab === "add");
  elements.adminTabImport.classList.toggle("active", tab === "import");
  elements.adminTabList.classList.toggle("active", tab === "list");

  elements.adminAddPanel.classList.toggle("hidden", tab !== "add");
  elements.adminImportPanel.classList.toggle("hidden", tab !== "import");
  elements.adminListPanel.classList.toggle("hidden", tab !== "list");

  if (tab === "list") renderAdminQuestionTable();
}

function refreshAdminSubjectControls() {
  syncSubjectCatalogFromQuestionBank();
  const subjects = Array.from(new Set([...Object.keys(SUBJECTS), ...Object.keys(QUESTION_BANK)]))
    .sort((a, b) => a.localeCompare(b));

  elements.questionSubject.innerHTML = ["<option value=\"\">Select subject</option>"]
    .concat(subjects.map((subject) => `<option value="${subject}">${subject}</option>`))
    .join("");

  elements.importSubjectSelect.innerHTML = ["<option value=\"from-file\">Use subject from Excel file</option>"]
    .concat(subjects.map((subject) => `<option value="${subject}">${subject}</option>`))
    .join("");

  const currentFilter = elements.adminSubjectFilter.value || "all";
  elements.adminSubjectFilter.innerHTML = ["<option value=\"all\">All Subjects</option>"]
    .concat(subjects.map((subject) => `<option value="${subject}">${subject}</option>`))
    .join("");
  elements.adminSubjectFilter.value = subjects.includes(currentFilter) ? currentFilter : "all";
}

function handleCreateSubject() {
  const newSubjectName = normalizeSubjectName(elements.newSubjectName.value);
  if (!newSubjectName) {
    showAdminMessage("Please enter a subject name.", "error");
    return;
  }

  const alreadyExists = Boolean(SUBJECTS[newSubjectName]);
  ensureSubject(newSubjectName);
  saveQuestionData();
  refreshAdminSubjectControls();
  elements.newSubjectName.value = "";

  if (!alreadyExists) renderSubjectCards();
  showAdminMessage(alreadyExists ? "Subject already exists." : `Subject '${newSubjectName}' created.`, "success");
}

function handleAddQuestion(event) {
  event.preventDefault();

  const subject = normalizeSubjectName(elements.questionSubject.value);
  const question = (elements.questionTextInput.value || "").trim();
  const options = [
    elements.questionOption1.value,
    elements.questionOption2.value,
    elements.questionOption3.value,
    elements.questionOption4.value,
  ];
  const correctAnswer = Number(elements.questionCorrectIndex.value);
  const explanation = (elements.questionExplanation.value || "").trim();

  const added = addQuestionToBank(subject, { question, options, correctAnswer, explanation });
  if (!added) {
    showAdminMessage("Please complete all fields and use valid correct option index (0-3).", "error");
    return;
  }

  saveQuestionData();
  elements.addQuestionForm.reset();
  refreshAdminSubjectControls();
  renderAdminQuestionTable();
  renderSubjectCards();
  showAdminMessage("Question added successfully.", "success");
}

function parseCorrectAnswer(rawCorrectAnswer, options) {
  const value = String(rawCorrectAnswer ?? "").trim();
  if (!value) return -1;
  if (/^[0-3]$/.test(value)) return Number(value);

  const letterMap = { a: 0, b: 1, c: 2, d: 3 };
  if (letterMap[value.toLowerCase()] !== undefined) return letterMap[value.toLowerCase()];
  return options.findIndex((option) => option.toLowerCase() === value.toLowerCase());
}

function normalizeHeaderKey(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function getCellValueByAliases(row, aliases) {
  if (!row || typeof row !== "object") return "";
  const entries = Object.entries(row);

  for (let index = 0; index < aliases.length; index += 1) {
    const alias = normalizeHeaderKey(aliases[index]);
    const found = entries.find(([key]) => normalizeHeaderKey(key) === alias);
    if (found) return found[1];
  }

  return "";
}

function rowsFromSheet(firstSheet) {
  const matrix = XLSX.utils.sheet_to_json(firstSheet, {
    header: 1,
    raw: false,
    defval: "",
    blankrows: false,
  });

  if (!Array.isArray(matrix) || matrix.length === 0) return [];

  const headerCandidates = [
    ["question", "optiona", "optionb", "optionc", "optiond"],
    ["question", "option1", "option2", "option3", "option4"],
  ];

  let headerRowIndex = -1;
  for (let rowIndex = 0; rowIndex < matrix.length; rowIndex += 1) {
    const row = Array.isArray(matrix[rowIndex]) ? matrix[rowIndex] : [];
    const normalized = row.map((cell) => normalizeHeaderKey(cell));
    const matches = headerCandidates.some((candidate) => candidate.every((key) => normalized.includes(key)));
    if (matches) {
      headerRowIndex = rowIndex;
      break;
    }
  }

  if (headerRowIndex === -1) {
    return XLSX.utils.sheet_to_json(firstSheet, { raw: false, defval: "" });
  }

  const headerRow = (Array.isArray(matrix[headerRowIndex]) ? matrix[headerRowIndex] : [])
    .map((cell) => String(cell || "").trim());
  const rows = [];

  for (let rowIndex = headerRowIndex + 1; rowIndex < matrix.length; rowIndex += 1) {
    const rowValues = Array.isArray(matrix[rowIndex]) ? matrix[rowIndex] : [];
    const rowObject = {};

    for (let colIndex = 0; colIndex < headerRow.length; colIndex += 1) {
      const header = headerRow[colIndex];
      if (!header) continue;
      rowObject[header] = rowValues[colIndex] ?? "";
    }

    const hasContent = Object.values(rowObject).some((value) => String(value || "").trim() !== "");
    if (hasContent) rows.push(rowObject);
  }

  return rows;
}

function parseExcelRows(rows, forcedSubject) {
  let importedCount = 0;
  const errors = [];

  rows.forEach((row, index) => {
    const rowNumber = index + 2;
    const rowSubject = getCellValueByAliases(row, ["subject", "subject name", "subjectname", "sub", "topic"]);
    const subject = normalizeSubjectName(forcedSubject === "from-file" ? rowSubject : forcedSubject);
    const question = String(getCellValueByAliases(row, ["question"])).trim();
    const options = [
      getCellValueByAliases(row, ["option1", "option a", "optiona"]),
      getCellValueByAliases(row, ["option2", "option b", "optionb"]),
      getCellValueByAliases(row, ["option3", "option c", "optionc"]),
      getCellValueByAliases(row, ["option4", "option d", "optiond"]),
    ].map((option) => String(option ?? "").trim());
    const correctAnswer = parseCorrectAnswer(
      getCellValueByAliases(row, ["correctanswer", "correct", "correct option", "correctoption"]),
      options,
    );
    const explanation = String(getCellValueByAliases(row, ["explanation"]) || "No explanation provided.").trim();

    const added = addQuestionToBank(subject, { question, options, correctAnswer, explanation });
    if (added) importedCount += 1;
    else errors.push(`Row ${rowNumber}`);
  });

  return { importedCount, errors };
}

function handleExcelImport() {
  const file = elements.excelFileInput.files?.[0];
  if (!file) {
    showAdminMessage("Please choose an Excel or CSV file.", "error");
    return;
  }

  const forcedSubject = elements.importSubjectSelect.value || "from-file";
  const reader = new FileReader();

  reader.onload = (event) => {
    try {
      const workbook = XLSX.read(event.target.result, { type: "array" });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = rowsFromSheet(firstSheet);
      const { importedCount, errors } = parseExcelRows(rows, forcedSubject);

      if (!importedCount) {
        showAdminMessage("No valid questions were found in file.", "error");
        return;
      }

      saveQuestionData();
      refreshAdminSubjectControls();
      renderAdminQuestionTable();
      renderSubjectCards();
      elements.excelFileInput.value = "";

      const skippedText = errors.length ? ` Skipped: ${errors.slice(0, 5).join(", ")}${errors.length > 5 ? "..." : ""}.` : "";
      showAdminMessage(`Imported ${importedCount} question(s).${skippedText}`, "success");
    } catch {
      showAdminMessage("Could not parse the selected file.", "error");
    }
  };

  reader.readAsArrayBuffer(file);
}
function renderAdminQuestionTable() {
  const filterSubject = elements.adminSubjectFilter.value || "all";
  const rows = getAllQuestionsFlat().filter((question) => filterSubject === "all" || question.subject === filterSubject);

  if (!rows.length) {
    elements.adminQuestionTableBody.innerHTML = `<tr><td colspan="4" class="empty-state">No questions found for selected subject.</td></tr>`;
    return;
  }

  elements.adminQuestionTableBody.innerHTML = rows
    .map((row) => `
      <tr>
        <td>${row.subject}</td>
        <td>${row.question}</td>
        <td>${row.options[row.correctAnswer] || "-"}</td>
        <td>
          <button class="ghost-button danger-outline" type="button" data-subject="${row.subject}" data-id="${row.id}">Delete</button>
        </td>
      </tr>
    `)
    .join("");

  elements.adminQuestionTableBody.querySelectorAll("button[data-id]").forEach((button) => {
    button.addEventListener("click", () => {
      const subject = button.dataset.subject;
      const id = button.dataset.id;
      if (!subject || !id || !Array.isArray(QUESTION_BANK[subject])) return;

      QUESTION_BANK[subject] = QUESTION_BANK[subject].filter((question) => question.id !== id);
      saveQuestionData();
      renderAdminQuestionTable();
      renderSubjectCards();
      showAdminMessage("Question deleted.", "success");
    });
  });
}

function resetQuestionBankToDefault() {
  const shouldReset = window.confirm("Reset all subjects and questions to default values?");
  if (!shouldReset) return;

  Object.keys(SUBJECTS).forEach((subject) => delete SUBJECTS[subject]);
  Object.assign(SUBJECTS, JSON.parse(JSON.stringify(DEFAULT_SUBJECTS)));
  Object.keys(QUESTION_BANK).forEach((subject) => delete QUESTION_BANK[subject]);
  Object.assign(QUESTION_BANK, JSON.parse(JSON.stringify(DEFAULT_QUESTION_BANK)));

  saveQuestionData();
  refreshAdminSubjectControls();
  renderAdminQuestionTable();
  renderSubjectCards();
  showAdminMessage("Question bank reset to default.", "success");
}

function downloadTemplateCsv() {
  const csvLines = [
    "subject,question,option1,option2,option3,option4,correctAnswer,explanation",
    'Science,"Which gas do plants absorb?","Oxygen","Nitrogen","Carbon Dioxide","Hydrogen",2,"Plants absorb carbon dioxide during photosynthesis."',
  ];

  const blob = new Blob([csvLines.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "mock-test-template.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}


