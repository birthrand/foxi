import { getLanguageByCode } from "@/data/languages";
import { getUnitById, getUnitsByLanguageCode } from "@/data/units";
import type {
  AiTeacherPrompt,
  LanguageCode,
  Lesson,
  LessonWithLanguage,
  UnitWithLessons,
} from "@/types/learning";

function lessonImageUrl(lessonId: string): string {
  return `https://picsum.photos/seed/${lessonId}/400/300`;
}

function buildAiTeacherPrompt(
  languageName: string,
  lessonTitle: string,
  goal: string,
  vocabularyWords: string[],
  phraseTexts: string[],
  openingLine: string,
): AiTeacherPrompt {
  return {
    role: `Warm beginner ${languageName} tutor`,
    instructions: [
      `You are Foxi, a friendly AI language teacher helping a beginner learn ${languageName}.`,
      `Stay strictly within today's lesson: "${lessonTitle}".`,
      `Lesson goal: ${goal}`,
      `Only use these vocabulary words: ${vocabularyWords.join(", ")}.`,
      `Only use these phrases: ${phraseTexts.join(" | ")}.`,
      "Speak mostly in English. Introduce target-language words slowly with translations.",
      "Use short, natural sentences with contractions and gentle encouragement.",
      "Listen to the student, adapt your next line, and ask them to repeat or try again.",
      "Keep each reply to one or two conversational sentences.",
      "Do not teach unrelated topics or switch to other languages.",
    ].join(" "),
    openingLine,
    focusNotes: [
      `Lesson focus: ${goal}`,
      `Vocabulary limit: ${vocabularyWords.join(", ")}`,
      `Phrase limit: ${phraseTexts.join(" | ")}`,
      "Speak English first, sprinkle in target language slowly.",
      "Celebrate small wins and prompt repetition.",
    ],
  };
}

export const lessons: Lesson[] = [
  // ── Spanish · Unit 1 ──────────────────────────────────────────────────────
  {
    id: "es-lesson-1",
    unitId: "es-unit-1",
    languageCode: "es",
    number: 1,
    title: "Hello & Goodbye",
    subtitle: "Your first Spanish greetings",
    description: "Learn how to say hello and goodbye in common everyday situations.",
    goal: "Greet someone and say goodbye politely in Spanish.",
    goals: [
      { id: "es-l1-g1", label: "Say hello in formal and informal settings" },
      { id: "es-l1-g2", label: "Say goodbye naturally" },
    ],
    vocabulary: [
      { id: "es-l1-v1", word: "hola", translation: "hello", phonetic: "OH-lah" },
      { id: "es-l1-v2", word: "adiós", translation: "goodbye", phonetic: "ah-DYOHS" },
      {
        id: "es-l1-v3",
        word: "buenos días",
        translation: "good morning",
        phonetic: "BWEH-nohs DEE-ahs",
        example: "Buenos días, ¿cómo estás?",
      },
    ],
    phrases: [
      { id: "es-l1-p1", text: "¡Hola!", translation: "Hi!" },
      { id: "es-l1-p2", text: "Buenos días.", translation: "Good morning." },
      { id: "es-l1-p3", text: "¡Adiós!", translation: "Bye!" },
    ],
    activities: [
      {
        id: "es-l1-a1",
        type: "vocabulary",
        title: "Greeting words",
        description: "Match each Spanish word to its English meaning.",
        estimatedMinutes: 3,
      },
      {
        id: "es-l1-a2",
        type: "speaking",
        title: "Say it out loud",
        description: "Practice saying hola and adiós with Foxi.",
        estimatedMinutes: 5,
      },
      {
        id: "es-l1-a3",
        type: "conversation",
        title: "Mini chat",
        description: "Role-play a short hello-and-goodbye exchange.",
        estimatedMinutes: 4,
      },
    ],
    aiTeacher: buildAiTeacherPrompt(
      "Spanish",
      "Hello & Goodbye",
      "Greet someone and say goodbye politely in Spanish.",
      ["hola", "adiós", "buenos días"],
      ["¡Hola!", "Buenos días.", "¡Adiós!"],
      "Hey! Ready to learn your first Spanish greetings? Let's start with hola — it means hello.",
    ),
    imageUrl: lessonImageUrl("es-lesson-1"),
    xpReward: 10,
    estimatedMinutes: 8,
  },
  {
    id: "es-lesson-2",
    unitId: "es-unit-1",
    languageCode: "es",
    number: 2,
    title: "Please & Thank You",
    subtitle: "Polite words that go a long way",
    description: "Use por favor and gracias to sound friendly and respectful.",
    goal: "Ask for something politely and express thanks in Spanish.",
    goals: [
      { id: "es-l2-g1", label: "Say please when asking for something" },
      { id: "es-l2-g2", label: "Say thank you and you're welcome" },
    ],
    vocabulary: [
      {
        id: "es-l2-v1",
        word: "por favor",
        translation: "please",
        phonetic: "por fah-VOR",
      },
      { id: "es-l2-v2", word: "gracias", translation: "thank you", phonetic: "GRAH-see-ahs" },
      {
        id: "es-l2-v3",
        word: "de nada",
        translation: "you're welcome",
        phonetic: "deh NAH-dah",
      },
    ],
    phrases: [
      { id: "es-l2-p1", text: "Por favor.", translation: "Please." },
      { id: "es-l2-p2", text: "Gracias.", translation: "Thank you." },
      { id: "es-l2-p3", text: "De nada.", translation: "You're welcome." },
    ],
    activities: [
      {
        id: "es-l2-a1",
        type: "vocabulary",
        title: "Polite words",
        description: "Learn por favor, gracias, and de nada.",
        estimatedMinutes: 3,
      },
      {
        id: "es-l2-a2",
        type: "listening",
        title: "Hear the tone",
        description: "Listen to how native speakers sound when being polite.",
        estimatedMinutes: 4,
      },
      {
        id: "es-l2-a3",
        type: "speaking",
        title: "Practice politeness",
        description: "Ask for water and thank someone in Spanish.",
        estimatedMinutes: 5,
      },
    ],
    aiTeacher: buildAiTeacherPrompt(
      "Spanish",
      "Please & Thank You",
      "Ask for something politely and express thanks in Spanish.",
      ["por favor", "gracias", "de nada"],
      ["Por favor.", "Gracias.", "De nada."],
      "Nice work so far! Today we'll learn por favor — that's please in Spanish.",
    ),
    imageUrl: lessonImageUrl("es-lesson-2"),
    xpReward: 10,
    estimatedMinutes: 8,
  },
  {
    id: "es-lesson-3",
    unitId: "es-unit-1",
    languageCode: "es",
    number: 3,
    title: "My Name Is…",
    subtitle: "Introduce yourself with confidence",
    description: "Share your name and ask someone theirs in a simple conversation.",
    goal: "Introduce yourself and ask for someone's name in Spanish.",
    goals: [
      { id: "es-l3-g1", label: "Say your name using Me llamo" },
      { id: "es-l3-g2", label: "Ask ¿Cómo te llamas?" },
    ],
    vocabulary: [
      { id: "es-l3-v1", word: "me llamo", translation: "my name is", phonetic: "meh YAH-moh" },
      {
        id: "es-l3-v2",
        word: "¿Cómo te llamas?",
        translation: "What's your name?",
        phonetic: "KOH-moh teh YAH-mahs",
      },
      { id: "es-l3-v3", word: "mucho gusto", translation: "nice to meet you", phonetic: "MOO-choh GOOS-toh" },
    ],
    phrases: [
      { id: "es-l3-p1", text: "Me llamo Alex.", translation: "My name is Alex." },
      { id: "es-l3-p2", text: "¿Cómo te llamas?", translation: "What's your name?" },
      { id: "es-l3-p3", text: "Mucho gusto.", translation: "Nice to meet you." },
    ],
    activities: [
      {
        id: "es-l3-a1",
        type: "vocabulary",
        title: "Introduction phrases",
        description: "Study me llamo and ¿Cómo te llamas?",
        estimatedMinutes: 4,
      },
      {
        id: "es-l3-a2",
        type: "speaking",
        title: "Introduce yourself",
        description: "Say your name and ask Foxi for theirs.",
        estimatedMinutes: 5,
      },
      {
        id: "es-l3-a3",
        type: "review",
        title: "Unit 1 review",
        description: "Combine greetings, manners, and introductions.",
        estimatedMinutes: 5,
      },
    ],
    aiTeacher: buildAiTeacherPrompt(
      "Spanish",
      "My Name Is…",
      "Introduce yourself and ask for someone's name in Spanish.",
      ["me llamo", "¿Cómo te llamas?", "mucho gusto"],
      ["Me llamo Alex.", "¿Cómo te llamas?", "Mucho gusto."],
      "Let's introduce ourselves! In Spanish you'd say me llamo — that means my name is.",
    ),
    imageUrl: lessonImageUrl("es-lesson-3"),
    xpReward: 15,
    estimatedMinutes: 10,
  },
  // ── Spanish · Unit 2 ──────────────────────────────────────────────────────
  {
    id: "es-lesson-4",
    unitId: "es-unit-2",
    languageCode: "es",
    number: 4,
    title: "Numbers 1–10",
    subtitle: "Count with confidence",
    description: "Learn to count from one to ten and use numbers in simple sentences.",
    goal: "Count from 1 to 10 and recognize numbers in basic Spanish phrases.",
    goals: [
      { id: "es-l4-g1", label: "Count from uno to diez" },
      { id: "es-l4-g2", label: "Use numbers in a short phrase" },
    ],
    vocabulary: [
      { id: "es-l4-v1", word: "uno", translation: "one", phonetic: "OO-noh" },
      { id: "es-l4-v2", word: "dos", translation: "two", phonetic: "dohs" },
      { id: "es-l4-v3", word: "tres", translation: "three", phonetic: "trehs" },
      { id: "es-l4-v4", word: "diez", translation: "ten", phonetic: "dee-EHS" },
    ],
    phrases: [
      { id: "es-l4-p1", text: "Uno, dos, tres.", translation: "One, two, three." },
      { id: "es-l4-p2", text: "Tengo dos hermanos.", translation: "I have two siblings." },
    ],
    activities: [
      {
        id: "es-l4-a1",
        type: "vocabulary",
        title: "Number flashcards",
        description: "Practice uno through diez.",
        estimatedMinutes: 4,
      },
      {
        id: "es-l4-a2",
        type: "listening",
        title: "Hear the count",
        description: "Listen and repeat the numbers in order.",
        estimatedMinutes: 4,
      },
      {
        id: "es-l4-a3",
        type: "speaking",
        title: "Count aloud",
        description: "Count from 1 to 10 with Foxi.",
        estimatedMinutes: 5,
      },
    ],
    aiTeacher: buildAiTeacherPrompt(
      "Spanish",
      "Numbers 1–10",
      "Count from 1 to 10 and recognize numbers in basic Spanish phrases.",
      ["uno", "dos", "tres", "diez"],
      ["Uno, dos, tres.", "Tengo dos hermanos."],
      "Let's count together! Uno means one — can you say uno with me?",
    ),
    imageUrl: lessonImageUrl("es-lesson-4"),
    xpReward: 10,
    estimatedMinutes: 9,
  },
  {
    id: "es-lesson-5",
    unitId: "es-unit-2",
    languageCode: "es",
    number: 5,
    title: "How Are You?",
    subtitle: "Ask and answer about feelings",
    description: "Check in on someone and share how you're doing in Spanish.",
    goal: "Ask how someone is doing and respond with a simple feeling word.",
    goals: [
      { id: "es-l5-g1", label: "Ask ¿Cómo estás?" },
      { id: "es-l5-g2", label: "Answer with bien or mal" },
    ],
    vocabulary: [
      {
        id: "es-l5-v1",
        word: "¿Cómo estás?",
        translation: "How are you?",
        phonetic: "KOH-moh ehs-TAHS",
      },
      { id: "es-l5-v2", word: "bien", translation: "well / good", phonetic: "bee-EHN" },
      { id: "es-l5-v3", word: "mal", translation: "bad / not well", phonetic: "mahl" },
    ],
    phrases: [
      { id: "es-l5-p1", text: "¿Cómo estás?", translation: "How are you?" },
      { id: "es-l5-p2", text: "Estoy bien, gracias.", translation: "I'm fine, thank you." },
      { id: "es-l5-p3", text: "Estoy un poco mal.", translation: "I'm not doing so well." },
    ],
    activities: [
      {
        id: "es-l5-a1",
        type: "vocabulary",
        title: "Feeling words",
        description: "Learn bien, mal, and ¿Cómo estás?",
        estimatedMinutes: 3,
      },
      {
        id: "es-l5-a2",
        type: "conversation",
        title: "Check-in chat",
        description: "Ask Foxi how they are and respond politely.",
        estimatedMinutes: 5,
      },
      {
        id: "es-l5-a3",
        type: "speaking",
        title: "Share how you feel",
        description: "Answer ¿Cómo estás? with estoy bien.",
        estimatedMinutes: 4,
      },
    ],
    aiTeacher: buildAiTeacherPrompt(
      "Spanish",
      "How Are You?",
      "Ask how someone is doing and respond with a simple feeling word.",
      ["¿Cómo estás?", "bien", "mal"],
      ["¿Cómo estás?", "Estoy bien, gracias.", "Estoy un poco mal."],
      "¿Cómo estás? means How are you? — let's practice asking and answering together.",
    ),
    imageUrl: lessonImageUrl("es-lesson-5"),
    xpReward: 10,
    estimatedMinutes: 8,
  },
  {
    id: "es-lesson-6",
    unitId: "es-unit-2",
    languageCode: "es",
    number: 6,
    title: "Nice to Meet You",
    subtitle: "Wrap up your first conversations",
    description: "Combine introductions, feelings, and polite phrases in one short exchange.",
    goal: "Hold a short introduction conversation from hello to nice to meet you.",
    goals: [
      { id: "es-l6-g1", label: "Combine greetings and introductions" },
      { id: "es-l6-g2", label: "End a conversation politely" },
    ],
    vocabulary: [
      { id: "es-l6-v1", word: "encantado", translation: "pleased to meet you (m.)", phonetic: "en-kahn-TAH-doh" },
      { id: "es-l6-v2", word: "hasta luego", translation: "see you later", phonetic: "AHS-tah LWEH-goh" },
    ],
    phrases: [
      { id: "es-l6-p1", text: "Mucho gusto.", translation: "Nice to meet you." },
      { id: "es-l6-p2", text: "Encantado.", translation: "Pleased to meet you." },
      { id: "es-l6-p3", text: "Hasta luego.", translation: "See you later." },
    ],
    activities: [
      {
        id: "es-l6-a1",
        type: "conversation",
        title: "Full intro",
        description: "Practice a complete hello-to-goodbye conversation.",
        estimatedMinutes: 6,
      },
      {
        id: "es-l6-a2",
        type: "review",
        title: "Unit 2 review",
        description: "Review numbers, feelings, and introductions.",
        estimatedMinutes: 5,
      },
      {
        id: "es-l6-a3",
        type: "speaking",
        title: "Meet someone new",
        description: "Role-play meeting a new friend with Foxi.",
        estimatedMinutes: 5,
      },
    ],
    aiTeacher: buildAiTeacherPrompt(
      "Spanish",
      "Nice to Meet You",
      "Hold a short introduction conversation from hello to nice to meet you.",
      ["encantado", "hasta luego", "mucho gusto"],
      ["Mucho gusto.", "Encantado.", "Hasta luego."],
      "Great job getting here! Let's put everything together — start with hola and end with hasta luego.",
    ),
    imageUrl: lessonImageUrl("es-lesson-6"),
    xpReward: 20,
    estimatedMinutes: 12,
  },

  // ── French · Unit 1 ───────────────────────────────────────────────────────
  {
    id: "fr-lesson-1",
    unitId: "fr-unit-1",
    languageCode: "fr",
    number: 1,
    title: "Bonjour!",
    subtitle: "French greetings for any time of day",
    description: "Say hello and goodbye in French for morning, afternoon, and evening.",
    goal: "Greet someone appropriately based on the time of day in French.",
    goals: [
      { id: "fr-l1-g1", label: "Use bonjour and bonsoir" },
      { id: "fr-l1-g2", label: "Say au revoir naturally" },
    ],
    vocabulary: [
      { id: "fr-l1-v1", word: "bonjour", translation: "hello / good day", phonetic: "bon-ZHOOR" },
      { id: "fr-l1-v2", word: "bonsoir", translation: "good evening", phonetic: "bon-SWAHR" },
      { id: "fr-l1-v3", word: "au revoir", translation: "goodbye", phonetic: "oh ruh-VWAHR" },
    ],
    phrases: [
      { id: "fr-l1-p1", text: "Bonjour!", translation: "Hello!" },
      { id: "fr-l1-p2", text: "Bonsoir.", translation: "Good evening." },
      { id: "fr-l1-p3", text: "Au revoir!", translation: "Goodbye!" },
    ],
    activities: [
      {
        id: "fr-l1-a1",
        type: "vocabulary",
        title: "Greeting words",
        description: "Learn bonjour, bonsoir, and au revoir.",
        estimatedMinutes: 3,
      },
      {
        id: "fr-l1-a2",
        type: "speaking",
        title: "Say it out loud",
        description: "Practice French greetings with Foxi.",
        estimatedMinutes: 5,
      },
      {
        id: "fr-l1-a3",
        type: "listening",
        title: "Time of day",
        description: "Pick the right greeting for morning vs evening.",
        estimatedMinutes: 4,
      },
    ],
    aiTeacher: buildAiTeacherPrompt(
      "French",
      "Bonjour!",
      "Greet someone appropriately based on the time of day in French.",
      ["bonjour", "bonsoir", "au revoir"],
      ["Bonjour!", "Bonsoir.", "Au revoir!"],
      "Bonjour! That's hello in French — let's learn when to use bonjour and bonsoir.",
    ),
    imageUrl: lessonImageUrl("fr-lesson-1"),
    xpReward: 10,
    estimatedMinutes: 8,
  },
  {
    id: "fr-lesson-2",
    unitId: "fr-unit-1",
    languageCode: "fr",
    number: 2,
    title: "S'il Vous Plaît",
    subtitle: "Please, thank you, and you're welcome",
    description: "Sound polite in French with essential courtesy phrases.",
    goal: "Ask politely and express thanks in French.",
    goals: [
      { id: "fr-l2-g1", label: "Say s'il vous plaît when asking" },
      { id: "fr-l2-g2", label: "Say merci and de rien" },
    ],
    vocabulary: [
      {
        id: "fr-l2-v1",
        word: "s'il vous plaît",
        translation: "please (formal)",
        phonetic: "seel voo PLEH",
      },
      { id: "fr-l2-v2", word: "merci", translation: "thank you", phonetic: "mehr-SEE" },
      { id: "fr-l2-v3", word: "de rien", translation: "you're welcome", phonetic: "duh ree-EHN" },
    ],
    phrases: [
      { id: "fr-l2-p1", text: "S'il vous plaît.", translation: "Please." },
      { id: "fr-l2-p2", text: "Merci beaucoup.", translation: "Thank you very much." },
      { id: "fr-l2-p3", text: "De rien.", translation: "You're welcome." },
    ],
    activities: [
      {
        id: "fr-l2-a1",
        type: "vocabulary",
        title: "Courtesy words",
        description: "Study s'il vous plaît, merci, and de rien.",
        estimatedMinutes: 3,
      },
      {
        id: "fr-l2-a2",
        type: "speaking",
        title: "Polite requests",
        description: "Ask for something and say thank you.",
        estimatedMinutes: 5,
      },
      {
        id: "fr-l2-a3",
        type: "conversation",
        title: "Café role-play",
        description: "Order politely at a French café.",
        estimatedMinutes: 4,
      },
    ],
    aiTeacher: buildAiTeacherPrompt(
      "French",
      "S'il Vous Plaît",
      "Ask politely and express thanks in French.",
      ["s'il vous plaît", "merci", "de rien"],
      ["S'il vous plaît.", "Merci beaucoup.", "De rien."],
      "In French, please is s'il vous plaît — try saying it slowly with me.",
    ),
    imageUrl: lessonImageUrl("fr-lesson-2"),
    xpReward: 10,
    estimatedMinutes: 8,
  },
  {
    id: "fr-lesson-3",
    unitId: "fr-unit-1",
    languageCode: "fr",
    number: 3,
    title: "Je M'appelle…",
    subtitle: "Introduce yourself in French",
    description: "Share your name and ask someone theirs in a friendly way.",
    goal: "Introduce yourself and ask for someone's name in French.",
    goals: [
      { id: "fr-l3-g1", label: "Say je m'appelle with your name" },
      { id: "fr-l3-g2", label: "Ask Comment tu t'appelles?" },
    ],
    vocabulary: [
      {
        id: "fr-l3-v1",
        word: "je m'appelle",
        translation: "my name is",
        phonetic: "zhuh mah-PELL",
      },
      {
        id: "fr-l3-v2",
        word: "Comment tu t'appelles?",
        translation: "What's your name?",
        phonetic: "koh-mahn too tah-PELL",
      },
      {
        id: "fr-l3-v3",
        word: "enchanté",
        translation: "nice to meet you",
        phonetic: "ahn-shahn-TAY",
      },
    ],
    phrases: [
      { id: "fr-l3-p1", text: "Je m'appelle Marie.", translation: "My name is Marie." },
      { id: "fr-l3-p2", text: "Comment tu t'appelles?", translation: "What's your name?" },
      { id: "fr-l3-p3", text: "Enchanté!", translation: "Nice to meet you!" },
    ],
    activities: [
      {
        id: "fr-l3-a1",
        type: "vocabulary",
        title: "Introduction phrases",
        description: "Learn je m'appelle and Comment tu t'appelles?",
        estimatedMinutes: 4,
      },
      {
        id: "fr-l3-a2",
        type: "speaking",
        title: "Introduce yourself",
        description: "Say your name and ask Foxi for theirs.",
        estimatedMinutes: 5,
      },
      {
        id: "fr-l3-a3",
        type: "review",
        title: "Unit 1 review",
        description: "Combine greetings, manners, and introductions.",
        estimatedMinutes: 5,
      },
    ],
    aiTeacher: buildAiTeacherPrompt(
      "French",
      "Je M'appelle…",
      "Introduce yourself and ask for someone's name in French.",
      ["je m'appelle", "Comment tu t'appelles?", "enchanté"],
      ["Je m'appelle Marie.", "Comment tu t'appelles?", "Enchanté!"],
      "To say my name is in French, you'd say je m'appelle — give it a try!",
    ),
    imageUrl: lessonImageUrl("fr-lesson-3"),
    xpReward: 15,
    estimatedMinutes: 10,
  },
  // ── French · Unit 2 ───────────────────────────────────────────────────────
  {
    id: "fr-lesson-4",
    unitId: "fr-unit-2",
    languageCode: "fr",
    number: 4,
    title: "Les Nombres 1–10",
    subtitle: "Count in French",
    description: "Learn French numbers from one to ten and use them in short phrases.",
    goal: "Count from 1 to 10 in French and use numbers in a simple sentence.",
    goals: [
      { id: "fr-l4-g1", label: "Count from un to dix" },
      { id: "fr-l4-g2", label: "Use a number in a short phrase" },
    ],
    vocabulary: [
      { id: "fr-l4-v1", word: "un", translation: "one", phonetic: "uhn" },
      { id: "fr-l4-v2", word: "deux", translation: "two", phonetic: "duh" },
      { id: "fr-l4-v3", word: "trois", translation: "three", phonetic: "trwah" },
      { id: "fr-l4-v4", word: "dix", translation: "ten", phonetic: "deess" },
    ],
    phrases: [
      { id: "fr-l4-p1", text: "Un, deux, trois.", translation: "One, two, three." },
      { id: "fr-l4-p2", text: "J'ai deux chats.", translation: "I have two cats." },
    ],
    activities: [
      {
        id: "fr-l4-a1",
        type: "vocabulary",
        title: "Number flashcards",
        description: "Practice un through dix.",
        estimatedMinutes: 4,
      },
      {
        id: "fr-l4-a2",
        type: "listening",
        title: "Hear the count",
        description: "Listen and repeat French numbers.",
        estimatedMinutes: 4,
      },
      {
        id: "fr-l4-a3",
        type: "speaking",
        title: "Count aloud",
        description: "Count from 1 to 10 with Foxi.",
        estimatedMinutes: 5,
      },
    ],
    aiTeacher: buildAiTeacherPrompt(
      "French",
      "Les Nombres 1–10",
      "Count from 1 to 10 in French and use numbers in a simple sentence.",
      ["un", "deux", "trois", "dix"],
      ["Un, deux, trois.", "J'ai deux chats."],
      "Let's count in French! Un is one — can you repeat un with me?",
    ),
    imageUrl: lessonImageUrl("fr-lesson-4"),
    xpReward: 10,
    estimatedMinutes: 9,
  },
  {
    id: "fr-lesson-5",
    unitId: "fr-unit-2",
    languageCode: "fr",
    number: 5,
    title: "Ça Va?",
    subtitle: "Ask and answer how you're doing",
    description: "Check in on someone and share how you feel in French.",
    goal: "Ask how someone is doing and respond with ça va or pas bien.",
    goals: [
      { id: "fr-l5-g1", label: "Ask Comment ça va?" },
      { id: "fr-l5-g2", label: "Answer with ça va bien" },
    ],
    vocabulary: [
      {
        id: "fr-l5-v1",
        word: "Comment ça va?",
        translation: "How are you?",
        phonetic: "koh-mahn sah vah",
      },
      { id: "fr-l5-v2", word: "ça va bien", translation: "I'm doing well", phonetic: "sah vah bee-EHN" },
      { id: "fr-l5-v3", word: "pas bien", translation: "not well", phonetic: "pah bee-EHN" },
    ],
    phrases: [
      { id: "fr-l5-p1", text: "Comment ça va?", translation: "How are you?" },
      { id: "fr-l5-p2", text: "Ça va bien, merci.", translation: "I'm fine, thanks." },
      { id: "fr-l5-p3", text: "Pas bien aujourd'hui.", translation: "Not great today." },
    ],
    activities: [
      {
        id: "fr-l5-a1",
        type: "vocabulary",
        title: "Feeling phrases",
        description: "Learn Comment ça va? and ça va bien.",
        estimatedMinutes: 3,
      },
      {
        id: "fr-l5-a2",
        type: "conversation",
        title: "Check-in chat",
        description: "Ask and answer how you're doing.",
        estimatedMinutes: 5,
      },
      {
        id: "fr-l5-a3",
        type: "speaking",
        title: "Share how you feel",
        description: "Respond to Comment ça va? naturally.",
        estimatedMinutes: 4,
      },
    ],
    aiTeacher: buildAiTeacherPrompt(
      "French",
      "Ça Va?",
      "Ask how someone is doing and respond with ça va or pas bien.",
      ["Comment ça va?", "ça va bien", "pas bien"],
      ["Comment ça va?", "Ça va bien, merci.", "Pas bien aujourd'hui."],
      "Comment ça va? is how you'd ask How are you? in French — let's try it together.",
    ),
    imageUrl: lessonImageUrl("fr-lesson-5"),
    xpReward: 10,
    estimatedMinutes: 8,
  },
  {
    id: "fr-lesson-6",
    unitId: "fr-unit-2",
    languageCode: "fr",
    number: 6,
    title: "Enchanté!",
    subtitle: "Your first full French conversation",
    description: "Combine greetings, introductions, and polite phrases in one exchange.",
    goal: "Hold a short introduction conversation from bonjour to enchanté.",
    goals: [
      { id: "fr-l6-g1", label: "Combine greetings and introductions" },
      { id: "fr-l6-g2", label: "End a conversation with à bientôt" },
    ],
    vocabulary: [
      { id: "fr-l6-v1", word: "à bientôt", translation: "see you soon", phonetic: "ah bee-ahn-TOH" },
      { id: "fr-l6-v2", word: "ravi", translation: "delighted (to meet you)", phonetic: "rah-VEE" },
    ],
    phrases: [
      { id: "fr-l6-p1", text: "Enchanté!", translation: "Nice to meet you!" },
      { id: "fr-l6-p2", text: "Ravi de te rencontrer.", translation: "Glad to meet you." },
      { id: "fr-l6-p3", text: "À bientôt!", translation: "See you soon!" },
    ],
    activities: [
      {
        id: "fr-l6-a1",
        type: "conversation",
        title: "Full intro",
        description: "Practice a complete French introduction.",
        estimatedMinutes: 6,
      },
      {
        id: "fr-l6-a2",
        type: "review",
        title: "Unit 2 review",
        description: "Review numbers, feelings, and introductions.",
        estimatedMinutes: 5,
      },
      {
        id: "fr-l6-a3",
        type: "speaking",
        title: "Meet someone new",
        description: "Role-play meeting a new friend with Foxi.",
        estimatedMinutes: 5,
      },
    ],
    aiTeacher: buildAiTeacherPrompt(
      "French",
      "Enchanté!",
      "Hold a short introduction conversation from bonjour to enchanté.",
      ["à bientôt", "ravi", "enchanté"],
      ["Enchanté!", "Ravi de te rencontrer.", "À bientôt!"],
      "Let's tie it all together — start with Bonjour and finish with À bientôt!",
    ),
    imageUrl: lessonImageUrl("fr-lesson-6"),
    xpReward: 20,
    estimatedMinutes: 12,
  },

  // ── Japanese · Unit 1 ───────────────────────────────────────────────────────
  {
    id: "ja-lesson-1",
    unitId: "ja-unit-1",
    languageCode: "ja",
    number: 1,
    title: "Konnichiwa!",
    subtitle: "Essential Japanese greetings",
    description: "Learn hello, good morning, and goodbye for everyday situations.",
    goal: "Greet someone and say goodbye in Japanese.",
    goals: [
      { id: "ja-l1-g1", label: "Use konnichiwa and ohayō" },
      { id: "ja-l1-g2", label: "Say sayōnara and ja ne" },
    ],
    vocabulary: [
      { id: "ja-l1-v1", word: "こんにちは", translation: "hello", phonetic: "kon-nee-chee-wah" },
      { id: "ja-l1-v2", word: "おはよう", translation: "good morning", phonetic: "oh-hah-yoh" },
      { id: "ja-l1-v3", word: "さようなら", translation: "goodbye", phonetic: "sah-yoh-nah-rah" },
    ],
    phrases: [
      { id: "ja-l1-p1", text: "こんにちは！", translation: "Hello!" },
      { id: "ja-l1-p2", text: "おはようございます。", translation: "Good morning. (polite)" },
      { id: "ja-l1-p3", text: "じゃあね。", translation: "See ya!" },
    ],
    activities: [
      {
        id: "ja-l1-a1",
        type: "vocabulary",
        title: "Greeting words",
        description: "Learn konnichiwa, ohayō, and sayōnara.",
        estimatedMinutes: 4,
      },
      {
        id: "ja-l1-a2",
        type: "speaking",
        title: "Say it out loud",
        description: "Practice Japanese greetings with Foxi.",
        estimatedMinutes: 5,
      },
      {
        id: "ja-l1-a3",
        type: "listening",
        title: "Hear the rhythm",
        description: "Listen to the natural pace of Japanese greetings.",
        estimatedMinutes: 4,
      },
    ],
    aiTeacher: buildAiTeacherPrompt(
      "Japanese",
      "Konnichiwa!",
      "Greet someone and say goodbye in Japanese.",
      ["こんにちは", "おはよう", "さようなら"],
      ["こんにちは！", "おはようございます。", "じゃあね。"],
      "こんにちは means hello in Japanese — let's say it together slowly.",
    ),
    imageUrl: lessonImageUrl("ja-lesson-1"),
    xpReward: 10,
    estimatedMinutes: 9,
  },
  {
    id: "ja-lesson-2",
    unitId: "ja-unit-1",
    languageCode: "ja",
    number: 2,
    title: "Please & Thank You",
    subtitle: "Polite Japanese expressions",
    description: "Use onegaishimasu and arigatō to sound respectful and kind.",
    goal: "Ask politely and thank someone in Japanese.",
    goals: [
      { id: "ja-l2-g1", label: "Say お願いします when asking" },
      { id: "ja-l2-g2", label: "Say ありがとう and どういたしまして" },
    ],
    vocabulary: [
      {
        id: "ja-l2-v1",
        word: "お願いします",
        translation: "please",
        phonetic: "oh-neh-guy-shee-mahs",
      },
      { id: "ja-l2-v2", word: "ありがとう", translation: "thank you", phonetic: "ah-ree-gah-toh" },
      {
        id: "ja-l2-v3",
        word: "どういたしまして",
        translation: "you're welcome",
        phonetic: "doh-ee-tah-shee-mah-sheh-teh",
      },
    ],
    phrases: [
      { id: "ja-l2-p1", text: "お願いします。", translation: "Please." },
      { id: "ja-l2-p2", text: "ありがとうございます。", translation: "Thank you very much." },
      { id: "ja-l2-p3", text: "どういたしまして。", translation: "You're welcome." },
    ],
    activities: [
      {
        id: "ja-l2-a1",
        type: "vocabulary",
        title: "Polite expressions",
        description: "Study お願いします and ありがとう.",
        estimatedMinutes: 4,
      },
      {
        id: "ja-l2-a2",
        type: "speaking",
        title: "Practice politeness",
        description: "Ask for something and say thank you.",
        estimatedMinutes: 5,
      },
      {
        id: "ja-l2-a3",
        type: "conversation",
        title: "Shop role-play",
        description: "Practice polite phrases at a small shop.",
        estimatedMinutes: 4,
      },
    ],
    aiTeacher: buildAiTeacherPrompt(
      "Japanese",
      "Please & Thank You",
      "Ask politely and thank someone in Japanese.",
      ["お願いします", "ありがとう", "どういたしまして"],
      ["お願いします。", "ありがとうございます。", "どういたしまして。"],
      "In Japanese, please is お願いします — let's break it down sound by sound.",
    ),
    imageUrl: lessonImageUrl("ja-lesson-2"),
    xpReward: 10,
    estimatedMinutes: 9,
  },
  {
    id: "ja-lesson-3",
    unitId: "ja-unit-1",
    languageCode: "ja",
    number: 3,
    title: "Watashi wa…",
    subtitle: "Introduce yourself in Japanese",
    description: "Share your name and ask someone theirs using simple Japanese.",
    goal: "Introduce yourself and ask for someone's name in Japanese.",
    goals: [
      { id: "ja-l3-g1", label: "Say 私は…です with your name" },
      { id: "ja-l3-g2", label: "Ask お名前は？" },
    ],
    vocabulary: [
      { id: "ja-l3-v1", word: "私", translation: "I / me", phonetic: "wah-tah-shee" },
      { id: "ja-l3-v2", word: "名前", translation: "name", phonetic: "nah-meh" },
      { id: "ja-l3-v3", word: "はじめまして", translation: "nice to meet you", phonetic: "hah-jee-meh-mah-sheh-teh" },
    ],
    phrases: [
      { id: "ja-l3-p1", text: "私はユキです。", translation: "I am Yuki." },
      { id: "ja-l3-p2", text: "お名前は？", translation: "What is your name?" },
      { id: "ja-l3-p3", text: "はじめまして。", translation: "Nice to meet you." },
    ],
    activities: [
      {
        id: "ja-l3-a1",
        type: "vocabulary",
        title: "Introduction words",
        description: "Learn 私, 名前, and はじめまして.",
        estimatedMinutes: 4,
      },
      {
        id: "ja-l3-a2",
        type: "speaking",
        title: "Introduce yourself",
        description: "Say your name and ask Foxi for theirs.",
        estimatedMinutes: 5,
      },
      {
        id: "ja-l3-a3",
        type: "review",
        title: "Unit 1 review",
        description: "Combine greetings, manners, and introductions.",
        estimatedMinutes: 5,
      },
    ],
    aiTeacher: buildAiTeacherPrompt(
      "Japanese",
      "Watashi wa…",
      "Introduce yourself and ask for someone's name in Japanese.",
      ["私", "名前", "はじめまして"],
      ["私はユキです。", "お名前は？", "はじめまして。"],
      "To say I am [name] in Japanese, you'd say 私は…です — let's try it with your name!",
    ),
    imageUrl: lessonImageUrl("ja-lesson-3"),
    xpReward: 15,
    estimatedMinutes: 10,
  },
  // ── Japanese · Unit 2 ─────────────────────────────────────────────────────
  {
    id: "ja-lesson-4",
    unitId: "ja-unit-2",
    languageCode: "ja",
    number: 4,
    title: "Numbers 1–10",
    subtitle: "Count in Japanese",
    description: "Learn Japanese numbers from ichi to jū and use them in short phrases.",
    goal: "Count from 1 to 10 in Japanese and recognize numbers in context.",
    goals: [
      { id: "ja-l4-g1", label: "Count from いち to じゅう" },
      { id: "ja-l4-g2", label: "Use a number in a short phrase" },
    ],
    vocabulary: [
      { id: "ja-l4-v1", word: "いち", translation: "one", phonetic: "ee-chee" },
      { id: "ja-l4-v2", word: "に", translation: "two", phonetic: "nee" },
      { id: "ja-l4-v3", word: "さん", translation: "three", phonetic: "sahn" },
      { id: "ja-l4-v4", word: "じゅう", translation: "ten", phonetic: "joo" },
    ],
    phrases: [
      { id: "ja-l4-p1", text: "いち、に、さん。", translation: "One, two, three." },
      { id: "ja-l4-p2", text: "ねこが二匹います。", translation: "There are two cats." },
    ],
    activities: [
      {
        id: "ja-l4-a1",
        type: "vocabulary",
        title: "Number flashcards",
        description: "Practice いち through じゅう.",
        estimatedMinutes: 4,
      },
      {
        id: "ja-l4-a2",
        type: "listening",
        title: "Hear the count",
        description: "Listen and repeat Japanese numbers.",
        estimatedMinutes: 4,
      },
      {
        id: "ja-l4-a3",
        type: "speaking",
        title: "Count aloud",
        description: "Count from 1 to 10 with Foxi.",
        estimatedMinutes: 5,
      },
    ],
    aiTeacher: buildAiTeacherPrompt(
      "Japanese",
      "Numbers 1–10",
      "Count from 1 to 10 in Japanese and recognize numbers in context.",
      ["いち", "に", "さん", "じゅう"],
      ["いち、に、さん。", "ねこが二匹います。"],
      "Let's count! いち means one — can you say いち with me?",
    ),
    imageUrl: lessonImageUrl("ja-lesson-4"),
    xpReward: 10,
    estimatedMinutes: 9,
  },
  {
    id: "ja-lesson-5",
    unitId: "ja-unit-2",
    languageCode: "ja",
    number: 5,
    title: "Genki?",
    subtitle: "Ask how someone is doing",
    description: "Check in on someone and share how you feel in Japanese.",
    goal: "Ask how someone is doing and respond with genki or chotto.",
    goals: [
      { id: "ja-l5-g1", label: "Ask お元気ですか？" },
      { id: "ja-l5-g2", label: "Answer with 元気です" },
    ],
    vocabulary: [
      {
        id: "ja-l5-v1",
        word: "お元気ですか",
        translation: "How are you?",
        phonetic: "oh-gen-kee dess-kah",
      },
      { id: "ja-l5-v2", word: "元気", translation: "healthy / well", phonetic: "gen-kee" },
      { id: "ja-l5-v3", word: "ちょっと", translation: "a little / somewhat", phonetic: "cho-toh" },
    ],
    phrases: [
      { id: "ja-l5-p1", text: "お元気ですか？", translation: "How are you?" },
      { id: "ja-l5-p2", text: "元気です、ありがとう。", translation: "I'm fine, thank you." },
      { id: "ja-l5-p3", text: "ちょっと疲れました。", translation: "I'm a little tired." },
    ],
    activities: [
      {
        id: "ja-l5-a1",
        type: "vocabulary",
        title: "Feeling words",
        description: "Learn 元気 and お元気ですか.",
        estimatedMinutes: 4,
      },
      {
        id: "ja-l5-a2",
        type: "conversation",
        title: "Check-in chat",
        description: "Ask and answer how you're doing.",
        estimatedMinutes: 5,
      },
      {
        id: "ja-l5-a3",
        type: "speaking",
        title: "Share how you feel",
        description: "Respond to お元気ですか? naturally.",
        estimatedMinutes: 4,
      },
    ],
    aiTeacher: buildAiTeacherPrompt(
      "Japanese",
      "Genki?",
      "Ask how someone is doing and respond with genki or chotto.",
      ["お元気ですか", "元気", "ちょっと"],
      ["お元気ですか？", "元気です、ありがとう。", "ちょっと疲れました。"],
      "お元気ですか means How are you? — let's practice asking and answering.",
    ),
    imageUrl: lessonImageUrl("ja-lesson-5"),
    xpReward: 10,
    estimatedMinutes: 9,
  },
  {
    id: "ja-lesson-6",
    unitId: "ja-unit-2",
    languageCode: "ja",
    number: 6,
    title: "Yoroshiku!",
    subtitle: "Your first full Japanese conversation",
    description: "Combine greetings, introductions, and polite phrases in one exchange.",
    goal: "Hold a short introduction conversation from konnichiwa to yoroshiku onegaishimasu.",
    goals: [
      { id: "ja-l6-g1", label: "Combine greetings and introductions" },
      { id: "ja-l6-g2", label: "End with またね" },
    ],
    vocabulary: [
      {
        id: "ja-l6-v1",
        word: "よろしくお願いします",
        translation: "pleased to meet you / please treat me well",
        phonetic: "yoh-roh-shee-koo oh-neh-guy-shee-mahs",
      },
      { id: "ja-l6-v2", word: "またね", translation: "see you later", phonetic: "mah-tah-neh" },
    ],
    phrases: [
      { id: "ja-l6-p1", text: "はじめまして。", translation: "Nice to meet you." },
      { id: "ja-l6-p2", text: "よろしくお願いします。", translation: "Pleased to meet you." },
      { id: "ja-l6-p3", text: "またね！", translation: "See you later!" },
    ],
    activities: [
      {
        id: "ja-l6-a1",
        type: "conversation",
        title: "Full intro",
        description: "Practice a complete Japanese introduction.",
        estimatedMinutes: 6,
      },
      {
        id: "ja-l6-a2",
        type: "review",
        title: "Unit 2 review",
        description: "Review numbers, feelings, and introductions.",
        estimatedMinutes: 5,
      },
      {
        id: "ja-l6-a3",
        type: "speaking",
        title: "Meet someone new",
        description: "Role-play meeting a new friend with Foxi.",
        estimatedMinutes: 5,
      },
    ],
    aiTeacher: buildAiTeacherPrompt(
      "Japanese",
      "Yoroshiku!",
      "Hold a short introduction conversation from konnichiwa to yoroshiku onegaishimasu.",
      ["よろしくお願いします", "またね", "はじめまして"],
      ["はじめまして。", "よろしくお願いします。", "またね！"],
      "Let's put it all together — start with こんにちは and end with またね!",
    ),
    imageUrl: lessonImageUrl("ja-lesson-6"),
    xpReward: 20,
    estimatedMinutes: 12,
  },
];

export function getLessonById(lessonId: string): Lesson | undefined {
  return lessons.find((lesson) => lesson.id === lessonId);
}

export function getLessonsByUnitId(unitId: string): Lesson[] {
  return lessons
    .filter((lesson) => lesson.unitId === unitId)
    .sort((a, b) => a.number - b.number);
}

export function getLessonsByLanguageCode(languageCode: LanguageCode): Lesson[] {
  return lessons
    .filter((lesson) => lesson.languageCode === languageCode)
    .sort((a, b) => a.number - b.number);
}

export function getLessonWithLanguage(lessonId: string): LessonWithLanguage | undefined {
  const lesson = getLessonById(lessonId);
  if (!lesson) {
    return undefined;
  }

  const language = getLanguageByCode(lesson.languageCode);
  if (!language) {
    return undefined;
  }

  return { ...lesson, language };
}

export function getUnitsWithLessons(languageCode: LanguageCode): UnitWithLessons[] {
  return getUnitsByLanguageCode(languageCode).map((unit) => ({
    ...unit,
    lessons: getLessonsByUnitId(unit.id),
  }));
}

export function getFirstLessonForLanguage(languageCode: LanguageCode): Lesson | undefined {
  return getLessonsByLanguageCode(languageCode)[0];
}

export function getTotalXpForLanguage(languageCode: LanguageCode): number {
  return getLessonsByLanguageCode(languageCode).reduce(
    (total, lesson) => total + lesson.xpReward,
    0,
  );
}
