// Course data for R's Defence Academy
export interface DefenceCourseUnit {
  name: string;
  topics: string[];
}

export interface DefenceCourse {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  eligibility: string[];
  duration: string;
  fee: string;
  batchSize: string;
  schedule: string;
  highlights: string[];
  syllabus: DefenceCourseUnit[];
  faqs: { question: string; answer: string }[];
}

export const defenceCourses: DefenceCourse[] = [
  {
    slug: "nda",
    title: "NDA & NA Entrance Exam",
    subtitle: "National Defence Academy & Naval Academy",
    description: "Comprehensive preparation program for NDA & NA entrance examination. This course covers both the written exam and SSB interview preparation, designed to transform aspirants into confident candidates ready to serve the nation.",
    eligibility: [
      "Age: 16.5 to 19.5 years",
      "Unmarried male candidates",
      "12th pass or appearing (for Army/Air Force wing)",
      "12th pass with Physics and Maths (for Naval/Air Force)",
      "Physically and mentally fit"
    ],
    duration: "6 months / 1 year",
    fee: "₹30,000 - ₹50,000",
    batchSize: "20-25 students",
    schedule: "Weekdays & Weekends (Flexible timings)",
    highlights: [
      "Complete Mathematics syllabus coverage",
      "General Ability Test (GAT) preparation",
      "SSB Interview guidance",
      "Physical fitness training tips",
      "Mock tests in NDA pattern",
      "Personality development sessions"
    ],
    syllabus: [
      {
        name: "Mathematics",
        topics: [
          "Algebra - Complex numbers, Quadratic equations, Sequences and Series",
          "Matrices and Determinants",
          "Trigonometry - Identities, Properties of triangles, Heights and distances",
          "Analytical Geometry - 2D and 3D",
          "Differential Calculus - Limits, Continuity, Differentiation",
          "Integral Calculus - Integration methods, Definite integrals",
          "Vector Algebra - Products, Applications",
          "Statistics and Probability"
        ]
      },
      {
        name: "General Ability Test - English",
        topics: [
          "Grammar and Usage",
          "Vocabulary and Comprehension",
          "Cohesion and Coherence",
          "Spotting Errors",
          "Sentence Completion",
          "Synonyms and Antonyms",
          "Reading Comprehension"
        ]
      },
      {
        name: "General Ability Test - General Knowledge",
        topics: [
          "Physics - Motion, Heat, Optics, Electricity",
          "Chemistry - Elements, Compounds, Reactions",
          "General Science - Biology, Environment",
          "History - Indian History, World History",
          "Geography - India and World",
          "Current Affairs - National and International",
          "Defence and Security"
        ]
      },
      {
        name: "SSB Preparation",
        topics: [
          "Officer Intelligence Rating (OIR) Test",
          "Picture Perception and Description Test (PPDT)",
          "Thematic Apperception Test (TAT)",
          "Word Association Test (WAT)",
          "Situation Reaction Test (SRT)",
          "Self Description Test (SD)",
          "Group Discussion and Group Planning",
          "Personal Interview preparation"
        ]
      }
    ],
    faqs: [
      { question: "What is the NDA exam pattern?", answer: "NDA exam consists of two papers - Mathematics (300 marks) and General Ability Test (600 marks). Both are objective type with 2.5 hours duration each. Negative marking applies." },
      { question: "How many attempts are allowed for NDA?", answer: "There is no limit on the number of attempts as long as you meet the age criteria (16.5 to 19.5 years)." },
      { question: "Is coaching necessary for NDA?", answer: "While self-study is possible, structured coaching provides systematic preparation, mock tests, and SSB guidance which significantly improves selection chances." },
      { question: "What happens after clearing NDA written exam?", answer: "Candidates who clear the written exam are called for SSB Interview. Those who clear SSB undergo medical examination and final selection is based on merit." }
    ]
  },
  {
    slug: "cds",
    title: "CDS/AFCAT/INET Entrance Exam",
    subtitle: "Combined Defence Services & Other Entries",
    description: "Comprehensive preparation for graduates aspiring to join the Indian Armed Forces through CDS, AFCAT, and INET examinations. This program covers all aspects of written exams and interview preparation.",
    eligibility: [
      "CDS: Graduates (age 20-25 years for IMA/OTA)",
      "AFCAT: Graduates with 60% (age 20-24 years)",
      "INET: BE/B.Tech graduates (age 19-24 years)",
      "Unmarried (for most entries)",
      "Physically and mentally fit"
    ],
    duration: "6 months",
    fee: "₹30,000",
    batchSize: "15-20 students",
    schedule: "Weekdays & Weekends (Flexible timings)",
    highlights: [
      "Complete syllabus coverage for CDS/AFCAT/INET",
      "English and General Knowledge focus",
      "Mathematics for technical entries",
      "Current affairs updates",
      "Previous year paper practice",
      "SSB Interview preparation included"
    ],
    syllabus: [
      {
        name: "English",
        topics: [
          "Spotting Errors",
          "Sentence Arrangement",
          "Synonyms and Antonyms",
          "Reading Comprehension",
          "Fill in the Blanks",
          "Idioms and Phrases",
          "One Word Substitution",
          "Ordering of Sentences"
        ]
      },
      {
        name: "General Knowledge",
        topics: [
          "History - Ancient, Medieval, Modern India",
          "Geography - Physical, Indian, World",
          "Indian Polity and Constitution",
          "Economics - Basic Concepts",
          "Physics and Chemistry basics",
          "Current Affairs - 6 months",
          "Defence and Awards",
          "Sports and Culture"
        ]
      },
      {
        name: "Elementary Mathematics",
        topics: [
          "Number System and HCF-LCM",
          "Percentages and Averages",
          "Profit, Loss and Discount",
          "Simple and Compound Interest",
          "Time, Speed and Distance",
          "Time and Work",
          "Algebra and Geometry",
          "Mensuration and Trigonometry"
        ]
      },
      {
        name: "Reasoning and Military Aptitude",
        topics: [
          "Verbal Reasoning",
          "Non-Verbal Reasoning",
          "Spatial Ability",
          "Military Aptitude Test",
          "Data Interpretation",
          "Logical Reasoning"
        ]
      }
    ],
    faqs: [
      { question: "What is the difference between CDS and AFCAT?", answer: "CDS is conducted by UPSC for Army, Navy, and Air Force entry. AFCAT is conducted by IAF specifically for Air Force entry. Eligibility and exam pattern differ slightly." },
      { question: "Can women apply for these exams?", answer: "Yes, women can apply for Short Service Commission through CDS (OTA) and AFCAT. Permanent Commission opportunities are also available in certain branches." },
      { question: "What is the selection process?", answer: "Written exam followed by SSB Interview, Medical Examination, and final merit-based selection." },
      { question: "How long is the training after selection?", answer: "Training duration varies: IMA (18 months), OTA (49 weeks for SSC), AFA (74 weeks), INA (varies by branch)." }
    ]
  },
  {
    slug: "ssb",
    title: "SSB Interview Training",
    subtitle: "Services Selection Board Preparation",
    description: "Intensive SSB Interview preparation program designed to develop Officer Like Qualities (OLQs) in candidates. This comprehensive 14-day training covers all aspects of the 5-day SSB procedure with mock tests and personalized feedback.",
    eligibility: [
      "Cleared any defence written exam (NDA/CDS/AFCAT/INET)",
      "Received SSB interview call letter",
      "Or preparing for future SSB interviews",
      "Open to all candidates serious about defence career"
    ],
    duration: "14 days intensive",
    fee: "₹14,000",
    batchSize: "10-15 students",
    schedule: "Full-time residential/Non-residential",
    highlights: [
      "Complete 5-day SSB procedure simulation",
      "Psychology test training with practice",
      "GTO tasks practice and guidance",
      "Personal Interview preparation",
      "Conference simulation",
      "Individual feedback and improvement areas",
      "Physical fitness guidance",
      "Ex-SSB interviewer guidance"
    ],
    syllabus: [
      {
        name: "Day 1 - Screening",
        topics: [
          "Officer Intelligence Rating (OIR) Test practice",
          "Picture Perception techniques",
          "Story writing skills",
          "PPDT discussion strategies",
          "Narration techniques"
        ]
      },
      {
        name: "Psychology Tests",
        topics: [
          "Thematic Apperception Test (TAT) - Story writing",
          "Word Association Test (WAT) - Quick response training",
          "Situation Reaction Test (SRT) - Decision making",
          "Self Description Test (SD) - Self analysis"
        ]
      },
      {
        name: "Group Testing Officer (GTO) Tasks",
        topics: [
          "Group Discussion (GD)",
          "Group Planning Exercise (GPE)",
          "Progressive Group Task (PGT)",
          "Half Group Task (HGT)",
          "Individual Obstacles",
          "Command Task",
          "Final Group Task (FGT)",
          "Lecturette"
        ]
      },
      {
        name: "Personal Interview",
        topics: [
          "Rapid Fire questions handling",
          "Personal questions preparation",
          "General awareness for interview",
          "Body language and communication",
          "Handling stress questions",
          "Current affairs discussion"
        ]
      },
      {
        name: "Conference Preparation",
        topics: [
          "Board facing techniques",
          "Last impression creation",
          "Doubt clarification handling",
          "Confidence building"
        ]
      }
    ],
    faqs: [
      { question: "What are Officer Like Qualities (OLQs)?", answer: "OLQs are 15 qualities assessed during SSB: Effective Intelligence, Reasoning Ability, Organizing Ability, Power of Expression, Social Adaptability, Cooperation, Sense of Responsibility, Initiative, Self-Confidence, Speed of Decision, Ability to Influence, Liveliness, Determination, Courage, and Stamina." },
      { question: "How many days is the actual SSB interview?", answer: "The SSB interview is a 5-day process: Day 1 (Screening), Days 2-4 (Psychology tests, GTO tasks, Interview), Day 5 (Conference)." },
      { question: "What is the success rate in SSB?", answer: "Generally, the SSB success rate is around 5-10%. However, with proper preparation and development of OLQs, the chances improve significantly." },
      { question: "Can I attend SSB training before getting a call letter?", answer: "Yes, it's actually recommended. Training before getting the call letter allows you to develop OLQs gradually and enter the SSB with confidence." }
    ]
  }
];

export const getDefenceCourseBySlug = (slug: string): DefenceCourse | undefined => {
  return defenceCourses.find(course => course.slug === slug);
};