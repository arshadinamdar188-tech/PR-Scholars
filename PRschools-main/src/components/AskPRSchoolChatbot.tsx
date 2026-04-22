import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import "./AskPRSchoolChatbot.css";

type Sender = "bot" | "user";

type ChatMessage = {
  id: number;
  sender: Sender;
  text: string;
  timestamp: string;
};

type FaqItem = {
  id: string;
  question: string;
  answer: string;
  keywords: string[];
};

const CHATBOT_CONFIG = {
  schoolName: "PR School",
  typingDelayMs: 700,
  showTimestamps: true,
  fallback:
    "Sorry, I do not have that information right now. Please contact PR School directly.",
};

// Admin editable FAQ knowledge base.
const FAQS: FaqItem[] = [
  {
    id: "about",
    question: "About school",
    answer:
      "PR School is committed to quality education, discipline, values, and overall student development.",
    keywords: ["about", "school", "vision", "mission", "information"],
  },
  {
    id: "admission",
    question: "Admission process",
    answer:
      "To take admission, visit the school office, collect the admission form, submit required documents, and complete the fee process. If online admission is available, students can apply through the website.",
    keywords: ["admission", "enroll", "enrol", "apply", "application", "process", "join"],
  },
  {
    id: "documents",
    question: "Required documents",
    answer:
      "Admission documents usually include birth certificate, previous marksheet or transfer certificate, passport-size photographs, Aadhaar card, and parent identity proof.",
    keywords: ["documents", "document", "required", "birth certificate", "marksheet", "tc", "transfer"],
  },
  {
    id: "timing",
    question: "School timing",
    answer:
      "School timing is 8:00 AM to 2:00 PM, Monday to Friday. Please confirm with the school office for updated timing.",
    keywords: ["timing", "time", "hours", "open", "closing", "schedule", "school time"],
  },
  {
    id: "fees",
    question: "Fee payment",
    answer:
      "Fees can be paid at the school office or through the online payment system if available on the website.",
    keywords: ["fee", "fees", "payment", "pay", "charges", "installment"],
  },
  {
    id: "transport",
    question: "Transport facility",
    answer:
      "Transport facility is available for selected routes. Please contact the school office for route and fee details.",
    keywords: ["transport", "bus", "pickup", "drop", "route", "van"],
  },
  {
    id: "classes",
    question: "Classes available",
    answer: "PR School offers classes from Nursery to Class 10. Update this answer as needed.",
    keywords: ["classes", "class", "grade", "nursery", "10", "levels", "standards"],
  },
  {
    id: "facilities",
    question: "Facilities",
    answer:
      "The school provides classrooms, library, computer lab, sports activities, and co-curricular development programs.",
    keywords: ["facilities", "library", "lab", "sports", "activities", "campus", "infrastructure"],
  },
  {
    id: "contact",
    question: "Contact information",
    answer:
      "You can contact the school through the contact page, office phone number, or official school email.",
    keywords: ["contact", "phone", "email", "call", "reach", "address"],
  },
  {
    id: "office",
    question: "Office help",
    answer: "For personal support, please visit the school office during working hours.",
    keywords: ["office", "help", "support", "visit", "working hours"],
  },
  {
    id: "results",
    question: "Exam results",
    answer:
      "Exam results are shared by the school through report cards, student portal, or official communication channels.",
    keywords: ["result", "results", "exam", "report card", "marks", "portal"],
  },
  {
    id: "holidays",
    question: "Holidays",
    answer:
      "Holiday information is shared through the school calendar, notice board, or website announcements.",
    keywords: ["holiday", "holidays", "vacation", "calendar", "leave"],
  },
  {
    id: "uniform",
    question: "Uniform",
    answer:
      "Students are expected to follow the prescribed school uniform. Please contact the office for uniform details.",
    keywords: ["uniform", "dress", "school dress", "code"],
  },
  {
    id: "principal",
    question: "Principal meeting",
    answer:
      "To meet the principal, please contact the school office and schedule an appointment.",
    keywords: ["principal", "meeting", "appointment", "head", "headmaster"],
  },
];

const SUGGESTION_CHIPS = [
  "Admission process",
  "Fee payment",
  "School timing",
  "Transport facility",
  "Principal meeting",
  "Uniform",
];

const normalizeText = (value: string) => value.toLowerCase().trim().replace(/\s+/g, " ");

const nowTimestamp = () =>
  new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

function matchesFaq(input: string, faq: FaqItem) {
  const normalizedQuestion = normalizeText(faq.question);

  if (input === normalizedQuestion) {
    return true;
  }

  const normalizedKeywords = faq.keywords.map((keyword) => normalizeText(keyword));

  if (normalizedKeywords.some((keyword) => input === keyword)) {
    return true;
  }

  if (normalizedKeywords.some((keyword) => input.includes(keyword) || keyword.includes(input))) {
    return true;
  }

  return false;
}

function findBestAnswer(userText: string) {
  const normalizedInput = normalizeText(userText);

  if (!normalizedInput) {
    return "Please type your question so I can help you.";
  }

  const matchedFaq = FAQS.find((faq) => matchesFaq(normalizedInput, faq));
  return matchedFaq ? matchedFaq.answer : CHATBOT_CONFIG.fallback;
}

const AskPRSchoolChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messageIdRef = useRef(0);
  const typingTimeoutRef = useRef<number | null>(null);
  const chatBodyRef = useRef<HTMLDivElement | null>(null);

  const welcomeMessage = useMemo(
    () =>
      `Hello! Welcome to ${CHATBOT_CONFIG.schoolName}. I can help with admission, fees, timing, transport, classes, and more.`,
    []
  );

  useEffect(() => {
    messageIdRef.current += 1;
    setMessages([
      {
        id: messageIdRef.current,
        sender: "bot",
        text: welcomeMessage,
        timestamp: nowTimestamp(),
      },
    ]);

    return () => {
      if (typingTimeoutRef.current) {
        window.clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [welcomeMessage]);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages, isTyping, isOpen]);

  const addMessage = (sender: Sender, text: string) => {
    messageIdRef.current += 1;
    setMessages((prev) => [
      ...prev,
      {
        id: messageIdRef.current,
        sender,
        text,
        timestamp: nowTimestamp(),
      },
    ]);
  };

  const handleUserMessage = (rawText: string) => {
    const normalized = normalizeText(rawText);
    if (!normalized) {
      return;
    }

    const cleanText = rawText.trim();
    addMessage("user", cleanText);
    setInputValue("");
    setIsTyping(true);

    if (typingTimeoutRef.current) {
      window.clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = window.setTimeout(() => {
      setIsTyping(false);
      addMessage("bot", findBestAnswer(cleanText));
    }, CHATBOT_CONFIG.typingDelayMs);
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleUserMessage(inputValue);
  };

  return (
    <>
      <button
        type="button"
        className="prchat-launcher"
        aria-label={isOpen ? "Close Ask PR School chatbot" : "Open Ask PR School chatbot"}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        💬
      </button>

      <section className={`prchat-panel ${isOpen ? "open" : ""}`.trim()} aria-label="Ask PR School Chat">
        <header className="prchat-header">
          <div>
            <h2>Ask PR School</h2>
            <p>Instant help for parents, students, and visitors</p>
          </div>
          <button
            type="button"
            className="prchat-close"
            aria-label="Close chatbot"
            onClick={() => setIsOpen(false)}
          >
            ✕
          </button>
        </header>

        <div className="prchat-body" ref={chatBodyRef}>
          <div className="prchat-messages" aria-live="polite">
            {messages.map((message, index) => (
              <div key={message.id}>
                <article className={`prchat-message ${message.sender}`}>
                  <div>{message.text}</div>
                  {CHATBOT_CONFIG.showTimestamps ? (
                    <div className="prchat-meta">{message.timestamp}</div>
                  ) : null}
                </article>

                {index === 0 ? (
                  <div className="prchat-chips" aria-label="Suggested questions">
                    {SUGGESTION_CHIPS.map((chip) => (
                      <button
                        key={chip}
                        type="button"
                        className="prchat-chip"
                        onClick={() => handleUserMessage(chip)}
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}

            {isTyping ? (
              <article className="prchat-message bot">
                <span className="prchat-typing" aria-label="Bot is typing">
                  <span />
                  <span />
                  <span />
                </span>
              </article>
            ) : null}
          </div>
        </div>

        <form className="prchat-input-row" onSubmit={onSubmit}>
          <label htmlFor="prchatInput" className="prchat-sr-only">
            Type your question
          </label>
          <input
            id="prchatInput"
            className="prchat-input"
            type="text"
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            placeholder="Ask about admission, fees, timing..."
            maxLength={260}
          />
          <button type="submit" className="prchat-send-btn" aria-label="Send message">
            Send
          </button>
        </form>
      </section>
    </>
  );
};

export default AskPRSchoolChatbot;
