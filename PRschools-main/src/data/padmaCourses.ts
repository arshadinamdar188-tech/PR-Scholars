// Course data for Padma Maths Pro
export interface CourseChapter {
  name: string;
  topics: string[];
}

export interface CourseUnit {
  name: string;
  chapters: CourseChapter[];
}

export interface Course {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  fee: string;
  duration: string;
  batchSize: string;
  schedule: string;
  highlights: string[];
  units: CourseUnit[];
  faqs: { question: string; answer: string }[];
}

export const padmaCourses: Course[] = [
  {
    slug: "9th-cbse",
    title: "9th Maths CBSE",
    subtitle: "Foundation Course",
    description: "Build a strong mathematical foundation with our comprehensive 9th standard CBSE curriculum. This course focuses on developing problem-solving skills and conceptual clarity that will serve as the base for higher studies.",
    fee: "₹30,000",
    duration: "10½ months",
    batchSize: "15-20 students",
    schedule: "Weekdays & Weekends (Morning/Evening batches available)",
    highlights: [
      "Complete CBSE syllabus coverage",
      "Focus on NCERT + additional practice",
      "Regular doubt clearing sessions",
      "Monthly assessments and progress tracking",
      "Preparation for Olympiads and competitive exams"
    ],
    units: [
      {
        name: "Number Systems",
        chapters: [
          { name: "Real Numbers", topics: ["Introduction to irrational numbers", "Real numbers and their decimal expansions", "Operations on real numbers", "Laws of exponents"] }
        ]
      },
      {
        name: "Algebra",
        chapters: [
          { name: "Polynomials", topics: ["Polynomials in one variable", "Zeros of a polynomial", "Remainder theorem", "Factorization of polynomials"] },
          { name: "Linear Equations", topics: ["Linear equations in two variables", "Graph of linear equation", "Equations of lines parallel to axes"] }
        ]
      },
      {
        name: "Geometry",
        chapters: [
          { name: "Lines and Angles", topics: ["Basic terms and definitions", "Pairs of angles", "Parallel lines and transversal", "Angle sum property"] },
          { name: "Triangles", topics: ["Congruence of triangles", "Criteria for congruence", "Properties of triangles", "Inequalities in triangles"] },
          { name: "Quadrilaterals", topics: ["Angle sum property", "Properties of parallelograms", "Mid-point theorem"] },
          { name: "Circles", topics: ["Basic terms", "Arc and chord properties", "Cyclic quadrilaterals"] }
        ]
      },
      {
        name: "Mensuration",
        chapters: [
          { name: "Areas", topics: ["Area of triangle using Heron's formula", "Application of Heron's formula"] },
          { name: "Surface Areas and Volumes", topics: ["Surface area of cubes and cuboids", "Surface area of cylinders, cones, spheres", "Volume of cubes, cuboids, cylinders, cones, spheres"] }
        ]
      },
      {
        name: "Statistics & Probability",
        chapters: [
          { name: "Statistics", topics: ["Collection of data", "Presentation of data", "Measures of central tendency"] },
          { name: "Probability", topics: ["Probability - an experimental approach"] }
        ]
      }
    ],
    faqs: [
      { question: "What is the batch timing?", answer: "We offer flexible batch timings - Morning (7 AM - 9 AM) and Evening (5 PM - 7 PM) on both weekdays and weekends." },
      { question: "Is the fee payable in installments?", answer: "Yes, the fee can be paid in 2-3 installments. Please contact us for more details." },
      { question: "Do you provide study materials?", answer: "Yes, comprehensive study materials, practice worksheets, and previous year papers are provided." },
      { question: "How are doubts handled?", answer: "We have dedicated doubt-clearing sessions and students can reach out anytime via WhatsApp for quick assistance." }
    ]
  },
  {
    slug: "9th-icse",
    title: "9th Maths ICSE",
    subtitle: "Foundation Course",
    description: "Comprehensive ICSE mathematics program for 9th standard students. The course covers the complete ICSE syllabus with emphasis on application-based learning and problem-solving techniques.",
    fee: "₹30,000",
    duration: "10½ months",
    batchSize: "15-20 students",
    schedule: "Weekdays & Weekends (Morning/Evening batches available)",
    highlights: [
      "Complete ICSE syllabus coverage",
      "Application-based learning approach",
      "Regular practice tests and assessments",
      "Personalized attention in small batches",
      "Preparation for board and competitive exams"
    ],
    units: [
      {
        name: "Pure Arithmetic",
        chapters: [
          { name: "Rational and Irrational Numbers", topics: ["Rational numbers", "Irrational numbers", "Real numbers", "Surds and rationalization"] }
        ]
      },
      {
        name: "Commercial Mathematics",
        chapters: [
          { name: "Compound Interest", topics: ["Compound interest formula", "Finding time and rate", "Growth and depreciation"] },
          { name: "Expansions", topics: ["Algebraic identities", "Special products", "Factorization"] }
        ]
      },
      {
        name: "Algebra",
        chapters: [
          { name: "Factorization", topics: ["Factor theorem", "Remainder theorem", "Factorization of polynomials"] },
          { name: "Simultaneous Linear Equations", topics: ["Graphical method", "Substitution method", "Elimination method", "Cross-multiplication"] },
          { name: "Indices", topics: ["Laws of indices", "Problems on indices"] },
          { name: "Logarithms", topics: ["Laws of logarithms", "Problems on logarithms"] }
        ]
      },
      {
        name: "Geometry",
        chapters: [
          { name: "Triangles", topics: ["Congruent triangles", "Similar triangles", "Special triangles"] },
          { name: "Rectilinear Figures", topics: ["Parallelograms", "Theorems on area", "Construction of quadrilaterals"] },
          { name: "Circle", topics: ["Arc, chord and cyclic properties", "Tangent properties", "Construction of tangents"] }
        ]
      },
      {
        name: "Statistics",
        chapters: [
          { name: "Statistics", topics: ["Mean, median, mode", "Graphical representation", "Frequency distribution"] }
        ]
      }
    ],
    faqs: [
      { question: "What is the batch timing?", answer: "Flexible batch timings available - Morning and Evening batches on weekdays and weekends." },
      { question: "Is the fee payable in installments?", answer: "Yes, installment options are available. Contact us for details." },
      { question: "Do you provide ICSE-specific materials?", answer: "Yes, all study materials are aligned with the ICSE curriculum and examination pattern." },
      { question: "How are doubts handled?", answer: "Regular doubt-clearing sessions plus 24/7 WhatsApp support for quick assistance." }
    ]
  },
  {
    slug: "10th-cbse",
    title: "10th Maths CBSE",
    subtitle: "Board Preparation",
    description: "Focused board exam preparation for 10th CBSE students. This course ensures thorough understanding of concepts while providing extensive practice for securing top marks in board examinations.",
    fee: "₹40,000",
    duration: "10½ months",
    batchSize: "15-20 students",
    schedule: "Weekdays & Weekends (Morning/Evening batches available)",
    highlights: [
      "Complete CBSE board exam preparation",
      "NCERT + reference books coverage",
      "Weekly tests and mock exams",
      "Previous year paper solving",
      "Special focus on scoring topics"
    ],
    units: [
      {
        name: "Real Numbers",
        chapters: [
          { name: "Real Numbers", topics: ["Euclid's division lemma", "Fundamental theorem of arithmetic", "Revisiting irrational numbers", "Revisiting rational numbers"] }
        ]
      },
      {
        name: "Algebra",
        chapters: [
          { name: "Polynomials", topics: ["Geometrical meaning of zeros", "Relationship between zeros and coefficients", "Division algorithm"] },
          { name: "Pair of Linear Equations", topics: ["Graphical method", "Algebraic methods", "Equations reducible to linear form"] },
          { name: "Quadratic Equations", topics: ["Standard form", "Solution methods", "Nature of roots"] },
          { name: "Arithmetic Progressions", topics: ["nth term", "Sum of n terms", "Applications"] }
        ]
      },
      {
        name: "Trigonometry",
        chapters: [
          { name: "Introduction to Trigonometry", topics: ["Trigonometric ratios", "Trigonometric ratios of specific angles", "Trigonometric identities"] },
          { name: "Applications of Trigonometry", topics: ["Heights and distances", "Angles of elevation and depression"] }
        ]
      },
      {
        name: "Coordinate Geometry",
        chapters: [
          { name: "Coordinate Geometry", topics: ["Distance formula", "Section formula", "Area of triangle"] }
        ]
      },
      {
        name: "Geometry",
        chapters: [
          { name: "Triangles", topics: ["Similar triangles", "Criteria for similarity", "Areas of similar triangles", "Pythagoras theorem"] },
          { name: "Circles", topics: ["Tangent to a circle", "Number of tangents from a point"] },
          { name: "Constructions", topics: ["Division of line segment", "Construction of tangents"] }
        ]
      },
      {
        name: "Mensuration",
        chapters: [
          { name: "Areas Related to Circles", topics: ["Perimeter and area of circle", "Areas of sector and segment", "Areas of combinations of figures"] },
          { name: "Surface Areas and Volumes", topics: ["Surface area of combinations", "Volume of combinations", "Conversion of solids", "Frustum of cone"] }
        ]
      },
      {
        name: "Statistics & Probability",
        chapters: [
          { name: "Statistics", topics: ["Mean of grouped data", "Mode and median of grouped data", "Graphical representation"] },
          { name: "Probability", topics: ["Classical definition", "Simple problems"] }
        ]
      }
    ],
    faqs: [
      { question: "How do you prepare students for board exams?", answer: "We follow a structured approach with complete syllabus coverage, regular tests, mock exams, and extensive practice with previous year papers." },
      { question: "What score can students expect?", answer: "Our students consistently score 90+ marks. With dedication and following our methodology, achieving high scores is very much possible." },
      { question: "Do you provide revision sessions?", answer: "Yes, we have dedicated revision sessions and crash courses before the board exams." },
      { question: "What about competitive exam preparation?", answer: "While the focus is on boards, our concept-based teaching helps students prepare for Olympiads and other competitive exams." }
    ]
  },
  {
    slug: "10th-icse",
    title: "10th Maths ICSE",
    subtitle: "Board Preparation",
    description: "Intensive ICSE board exam preparation program. Master the complete ICSE mathematics syllabus with our proven methodology and achieve excellent results in your board examinations.",
    fee: "₹40,000",
    duration: "10½ months",
    batchSize: "15-20 students",
    schedule: "Weekdays & Weekends (Morning/Evening batches available)",
    highlights: [
      "Complete ICSE board preparation",
      "Topic-wise detailed coverage",
      "Regular assessments and mock tests",
      "Solving previous year ICSE papers",
      "Focus on high-weightage topics"
    ],
    units: [
      {
        name: "Commercial Mathematics",
        chapters: [
          { name: "Banking", topics: ["Recurring deposit accounts", "Interest calculation"] },
          { name: "Shares and Dividends", topics: ["Shares concepts", "Dividend calculation", "Return on investment"] },
          { name: "GST", topics: ["GST concepts", "Input and output GST", "Net GST payable"] }
        ]
      },
      {
        name: "Algebra",
        chapters: [
          { name: "Linear Inequations", topics: ["Solution set", "Graphical representation"] },
          { name: "Quadratic Equations", topics: ["Solving quadratic equations", "Nature of roots", "Word problems"] },
          { name: "Ratio and Proportion", topics: ["Componendo and dividendo", "Applications"] },
          { name: "Matrices", topics: ["Matrix operations", "Matrix equations"] },
          { name: "Arithmetic and Geometric Progression", topics: ["AP and GP formulas", "Sum of terms", "Applications"] }
        ]
      },
      {
        name: "Geometry",
        chapters: [
          { name: "Similarity", topics: ["Similar triangles", "Applications of similarity"] },
          { name: "Circles", topics: ["Chord properties", "Arc and cyclic properties", "Tangent properties"] },
          { name: "Constructions", topics: ["Circumscribed and inscribed circles", "Tangent constructions"] }
        ]
      },
      {
        name: "Trigonometry",
        chapters: [
          { name: "Trigonometry", topics: ["Trigonometric identities", "Heights and distances", "Bearings"] }
        ]
      },
      {
        name: "Mensuration",
        chapters: [
          { name: "Cylinder, Cone and Sphere", topics: ["Surface areas", "Volumes", "Combination of solids"] }
        ]
      },
      {
        name: "Statistics & Probability",
        chapters: [
          { name: "Statistics", topics: ["Mean, median, mode", "Cumulative frequency", "Ogive"] },
          { name: "Probability", topics: ["Classical probability", "Simple problems"] }
        ]
      }
    ],
    faqs: [
      { question: "How is ICSE preparation different from CBSE?", answer: "ICSE syllabus has additional topics and a more application-oriented approach. We cover all ICSE-specific topics thoroughly." },
      { question: "What materials are provided?", answer: "Complete study materials, topic-wise worksheets, and collection of previous year ICSE papers are provided." },
      { question: "How frequent are the tests?", answer: "Weekly topic tests, monthly comprehensive tests, and full mock board exams are conducted." },
      { question: "Do you cover practicals?", answer: "Yes, we cover all practical aspects including constructions and project-based learning." }
    ]
  },
  {
    slug: "11th-cbse",
    title: "11th Maths CBSE",
    subtitle: "Senior Secondary",
    description: "Advanced mathematics program for 11th CBSE students. This course builds the foundation for competitive exams like JEE while ensuring strong board exam preparation.",
    fee: "₹45,000",
    duration: "10½ months",
    batchSize: "15-20 students",
    schedule: "Weekdays & Weekends (Morning/Evening batches available)",
    highlights: [
      "Complete 11th CBSE curriculum",
      "JEE foundation preparation",
      "Rigorous problem-solving practice",
      "Concept-based learning approach",
      "Regular doubt clearing sessions"
    ],
    units: [
      {
        name: "Sets and Functions",
        chapters: [
          { name: "Sets", topics: ["Sets and their representations", "Types of sets", "Subsets", "Venn diagrams", "Operations on sets"] },
          { name: "Relations and Functions", topics: ["Ordered pairs", "Cartesian product", "Relations", "Functions", "Domain and range"] },
          { name: "Trigonometric Functions", topics: ["Angles", "Trigonometric functions", "Trigonometric identities", "Graphs"] }
        ]
      },
      {
        name: "Algebra",
        chapters: [
          { name: "Principle of Mathematical Induction", topics: ["Process of proof by induction", "Applications"] },
          { name: "Complex Numbers", topics: ["Complex numbers", "Algebraic operations", "Argand plane", "Polar representation"] },
          { name: "Quadratic Equations", topics: ["Quadratic equations in complex numbers", "Nature of roots"] },
          { name: "Linear Inequalities", topics: ["Algebraic solutions", "Graphical solutions", "System of linear inequalities"] },
          { name: "Permutations and Combinations", topics: ["Fundamental principle of counting", "Permutations", "Combinations"] },
          { name: "Binomial Theorem", topics: ["Binomial theorem", "General and middle terms", "Applications"] },
          { name: "Sequences and Series", topics: ["Arithmetic progression", "Geometric progression", "Special series"] }
        ]
      },
      {
        name: "Coordinate Geometry",
        chapters: [
          { name: "Straight Lines", topics: ["Slope of line", "Various forms of equations", "Distance formulas", "Family of lines"] },
          { name: "Conic Sections", topics: ["Circle", "Parabola", "Ellipse", "Hyperbola"] },
          { name: "Introduction to 3D Geometry", topics: ["Coordinate axes and planes", "Distance formula in 3D", "Section formula"] }
        ]
      },
      {
        name: "Calculus",
        chapters: [
          { name: "Limits and Derivatives", topics: ["Limits", "Algebra of limits", "Derivatives", "Rules of differentiation"] }
        ]
      },
      {
        name: "Mathematical Reasoning",
        chapters: [
          { name: "Mathematical Reasoning", topics: ["Statements", "Logical operations", "Implications", "Validity of statements"] }
        ]
      },
      {
        name: "Statistics and Probability",
        chapters: [
          { name: "Statistics", topics: ["Measures of dispersion", "Mean deviation", "Variance", "Standard deviation"] },
          { name: "Probability", topics: ["Random experiments", "Events", "Axiomatic probability"] }
        ]
      }
    ],
    faqs: [
      { question: "Is this course sufficient for JEE preparation?", answer: "This course builds a strong foundation for JEE. For comprehensive JEE prep, additional specialized coaching is recommended." },
      { question: "How is 11th different from 10th?", answer: "11th mathematics introduces advanced concepts like calculus, complex numbers, and 3D geometry. The difficulty level increases significantly." },
      { question: "What is the teaching methodology?", answer: "We focus on building concepts from basics, followed by extensive problem-solving from NCERT and reference books." },
      { question: "Do you cover NCERT exercises?", answer: "Yes, all NCERT exercises are covered along with additional problems from reference books." }
    ]
  },
  {
    slug: "11th-icse",
    title: "11th Maths ICSE",
    subtitle: "Senior Secondary",
    description: "Comprehensive ISC mathematics program for 11th standard. This course covers the complete ISC syllabus with focus on building strong analytical and problem-solving skills.",
    fee: "₹45,000",
    duration: "10½ months",
    batchSize: "15-20 students",
    schedule: "Weekdays & Weekends (Morning/Evening batches available)",
    highlights: [
      "Complete ISC 11th syllabus",
      "Strong foundation for 12th boards",
      "Competitive exam orientation",
      "Regular assessments",
      "Personalized attention"
    ],
    units: [
      {
        name: "Sets and Functions",
        chapters: [
          { name: "Sets", topics: ["Set notation", "Types of sets", "Set operations", "Venn diagrams"] },
          { name: "Relations and Functions", topics: ["Relations", "Functions", "Types of functions", "Composition of functions"] },
          { name: "Trigonometry", topics: ["Trigonometric functions", "Identities", "Graphs", "Inverse trigonometric functions"] }
        ]
      },
      {
        name: "Algebra",
        chapters: [
          { name: "Mathematical Induction", topics: ["Principle of mathematical induction", "Applications"] },
          { name: "Complex Numbers", topics: ["Complex number system", "Operations", "Modulus and argument", "Argand plane"] },
          { name: "Quadratic Equations", topics: ["Roots of quadratic equations", "Relationship between roots and coefficients"] },
          { name: "Permutations and Combinations", topics: ["Counting principles", "Permutations", "Combinations", "Applications"] },
          { name: "Binomial Theorem", topics: ["Binomial expansion", "General term", "Middle term"] },
          { name: "Sequences and Series", topics: ["AP", "GP", "HP", "Special series"] }
        ]
      },
      {
        name: "Coordinate Geometry",
        chapters: [
          { name: "Straight Lines", topics: ["Equations of lines", "Angle between lines", "Distance of a point from a line"] },
          { name: "Circles", topics: ["Standard form", "General form", "Tangents and normals"] },
          { name: "Conics", topics: ["Parabola", "Ellipse", "Hyperbola"] }
        ]
      },
      {
        name: "Calculus",
        chapters: [
          { name: "Limits", topics: ["Concept of limits", "Limit theorems", "Limits of algebraic and trigonometric functions"] },
          { name: "Differentiation", topics: ["First principle", "Rules of differentiation", "Chain rule"] }
        ]
      },
      {
        name: "Statistics and Probability",
        chapters: [
          { name: "Statistics", topics: ["Measures of central tendency", "Dispersion", "Coefficient of variation"] },
          { name: "Probability", topics: ["Probability concepts", "Addition and multiplication theorems"] }
        ]
      }
    ],
    faqs: [
      { question: "How is ISC different from CBSE?", answer: "ISC has a more detailed syllabus with additional topics. We cover all ISC-specific content thoroughly." },
      { question: "Is this course helpful for competitive exams?", answer: "Yes, the strong conceptual foundation built in this course helps in competitive exams." },
      { question: "What study materials are provided?", answer: "ISC-aligned study materials, worksheets, and reference materials are provided." },
      { question: "How often are tests conducted?", answer: "Weekly tests on current topics and monthly comprehensive assessments are conducted." }
    ]
  },
  {
    slug: "12th-cbse",
    title: "12th Maths CBSE",
    subtitle: "Board + Competitive",
    description: "Intensive 12th CBSE mathematics program designed for board exam excellence and competitive exam preparation. This course ensures complete mastery of the syllabus with focus on scoring maximum marks.",
    fee: "₹50,000",
    duration: "10½ months",
    batchSize: "15-20 students",
    schedule: "Weekdays & Weekends (Morning/Evening batches available)",
    highlights: [
      "Complete 12th CBSE board preparation",
      "JEE Mains foundation support",
      "Extensive mock test series",
      "Previous year paper analysis",
      "Special revision sessions before boards"
    ],
    units: [
      {
        name: "Relations and Functions",
        chapters: [
          { name: "Relations and Functions", topics: ["Types of relations", "Types of functions", "Composition and inverse"] },
          { name: "Inverse Trigonometric Functions", topics: ["Basic concepts", "Properties", "Elementary properties"] }
        ]
      },
      {
        name: "Algebra",
        chapters: [
          { name: "Matrices", topics: ["Types of matrices", "Matrix operations", "Transpose", "Symmetric and skew-symmetric matrices"] },
          { name: "Determinants", topics: ["Determinant of a matrix", "Properties", "Cofactors and adjoints", "Inverse of matrix", "Solving linear equations"] }
        ]
      },
      {
        name: "Calculus",
        chapters: [
          { name: "Continuity and Differentiability", topics: ["Continuity", "Differentiability", "Derivatives of composite functions", "Implicit differentiation", "Logarithmic differentiation"] },
          { name: "Applications of Derivatives", topics: ["Rate of change", "Increasing and decreasing functions", "Tangents and normals", "Maxima and minima"] },
          { name: "Integrals", topics: ["Integration methods", "Definite integrals", "Properties of definite integrals"] },
          { name: "Applications of Integrals", topics: ["Area under curves", "Area between curves"] },
          { name: "Differential Equations", topics: ["Order and degree", "General and particular solutions", "Methods of solving first-order equations"] }
        ]
      },
      {
        name: "Vectors and 3D Geometry",
        chapters: [
          { name: "Vectors", topics: ["Types of vectors", "Addition and scalar multiplication", "Dot and cross products", "Applications"] },
          { name: "Three Dimensional Geometry", topics: ["Direction cosines and ratios", "Equations of line and plane", "Angle between lines and planes", "Distance formulas"] }
        ]
      },
      {
        name: "Linear Programming",
        chapters: [
          { name: "Linear Programming", topics: ["LPP introduction", "Graphical method", "Diet problems", "Manufacturing problems"] }
        ]
      },
      {
        name: "Probability",
        chapters: [
          { name: "Probability", topics: ["Conditional probability", "Bayes' theorem", "Random variables", "Probability distribution", "Binomial distribution"] }
        ]
      }
    ],
    faqs: [
      { question: "How do you ensure board exam success?", answer: "We have a structured approach: complete syllabus by December, followed by intensive revision and mock tests until the exams." },
      { question: "What is the target score?", answer: "We aim for 95+ marks for all our students. With dedication, achieving this is very much possible." },
      { question: "Is JEE preparation included?", answer: "While the primary focus is on boards, we cover concepts at a depth that helps in JEE Mains preparation." },
      { question: "How many mock tests are conducted?", answer: "We conduct 10+ full mock tests in board exam pattern before the actual exams." }
    ]
  },
  {
    slug: "12th-icse",
    title: "12th Maths ICSE",
    subtitle: "Board + Competitive",
    description: "Complete ISC 12th mathematics program with focus on achieving excellent board results. This comprehensive course covers the entire syllabus with special emphasis on high-scoring topics.",
    fee: "₹50,000",
    duration: "10½ months",
    batchSize: "15-20 students",
    schedule: "Weekdays & Weekends (Morning/Evening batches available)",
    highlights: [
      "Complete ISC board preparation",
      "Topic-wise detailed coverage",
      "Mock ISC board exams",
      "Solving past 10 years' papers",
      "Pre-board intensive sessions"
    ],
    units: [
      {
        name: "Relations and Functions",
        chapters: [
          { name: "Relations and Functions", topics: ["Relations", "Functions", "Binary operations"] },
          { name: "Inverse Trigonometric Functions", topics: ["Inverse trigonometric functions", "Properties", "Problems"] }
        ]
      },
      {
        name: "Algebra",
        chapters: [
          { name: "Matrices and Determinants", topics: ["Matrix operations", "Determinants", "Properties", "Inverse of matrix", "Solving equations"] }
        ]
      },
      {
        name: "Calculus",
        chapters: [
          { name: "Continuity and Differentiability", topics: ["Continuity", "Differentiability", "Derivatives"] },
          { name: "Applications of Derivatives", topics: ["Rate of change", "Tangents and normals", "Maxima and minima"] },
          { name: "Integration", topics: ["Indefinite integrals", "Definite integrals", "Applications"] },
          { name: "Differential Equations", topics: ["Formation", "Solution methods", "Applications"] }
        ]
      },
      {
        name: "Probability",
        chapters: [
          { name: "Probability", topics: ["Conditional probability", "Bayes' theorem", "Random variables", "Probability distributions"] }
        ]
      },
      {
        name: "Vectors",
        chapters: [
          { name: "Vectors", topics: ["Vector algebra", "Scalar and vector products", "Applications"] }
        ]
      },
      {
        name: "3D Geometry",
        chapters: [
          { name: "Three Dimensional Geometry", topics: ["Lines in space", "Planes", "Coplanarity", "Distance formulas"] }
        ]
      },
      {
        name: "Linear Programming",
        chapters: [
          { name: "Linear Programming", topics: ["Formulation of LPP", "Graphical solution", "Applications"] }
        ]
      }
    ],
    faqs: [
      { question: "How is ISC 12th preparation different?", answer: "ISC has a more comprehensive syllabus with application-based questions. We prepare students for this pattern specifically." },
      { question: "What is the expected score?", answer: "Our students consistently achieve 90+ marks. With proper preparation, 95+ is achievable." },
      { question: "How many years' papers are solved?", answer: "We solve and analyze at least 10 years' ISC board papers during the course." },
      { question: "Is extra support available before exams?", answer: "Yes, we have special revision sessions and extra classes before the board exams." }
    ]
  }
];

export const getCourseBySlug = (slug: string): Course | undefined => {
  return padmaCourses.find(course => course.slug === slug);
};