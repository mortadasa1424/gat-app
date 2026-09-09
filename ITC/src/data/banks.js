// Normalizes the extracted raw banks into one uniform question shape and
// implements selection + rotation (seen-history) logic per the spec.
import vocabRaw from "./vocab.json";
import mathRaw from "./math.json";
import thirdRaw from "./third.json";
import englishRaw from "./english.json";
import passagesRaw from "./passages.json";
import { mathHD } from "./mathHD.js";
import { thirdHitboxes } from "./thirdHitboxes.js";

const oneLineMathIds = new Set([
  "ITC-MATH-0018", "ITC-MATH-0019", "ITC-MATH-0020", "ITC-MATH-0023",
  "ITC-MATH-0025", "ITC-MATH-0027", "ITC-MATH-0036", "ITC-MATH-0044",
  "ITC-MATH-0053", "ITC-MATH-0054", "ITC-MATH-0055",
]);

const mathImageHitboxes = {
  "ITC-MATH-0057": {
    A: { x: 40, y: 61, w: 48, h: 9 },
    B: { x: 40, y: 70, w: 48, h: 9 },
    C: { x: 40, y: 79, w: 48, h: 9 },
    D: { x: 40, y: 88, w: 48, h: 9 },
  },
  "ITC-MATH-0058": {
    A: { x: 74, y: 56, w: 19, h: 9 },
    B: { x: 74, y: 67, w: 19, h: 9 },
    C: { x: 74, y: 78, w: 19, h: 9 },
    D: { x: 74, y: 89, w: 19, h: 9 },
  },
  "ITC-MATH-0059": {
    A: { x: 70, y: 53, w: 23, h: 10 },
    B: { x: 70, y: 64, w: 23, h: 10 },
    C: { x: 70, y: 75, w: 23, h: 10 },
    D: { x: 70, y: 86, w: 23, h: 10 },
  },
  "ITC-MATH-0060": {
    A: { x: 76, y: 52, w: 18, h: 10 },
    B: { x: 76, y: 64, w: 18, h: 10 },
    C: { x: 76, y: 76, w: 18, h: 10 },
    D: { x: 76, y: 88, w: 18, h: 10 },
  },
};

export const passages = Object.fromEntries(passagesRaw.map((p) => [p.id, p]));

// ---- normalize a raw option list -> [{label,text}] ----
const opt = (o) => ({ label: o.label, text: o.text });

// ---- MATH: image-based, with HD text override when available ----
export const mathBank = mathRaw.map((q) => {
  const hd = mathHD[q.id];
  const base = {
    id: q.id,
    section: "math",
    categoryAr: q.categoryAr,
    categorySlug: q.categorySlug,
    correctAnswer: q.correctAnswer, // label "A".."D"
    answerLabels: q.answerLabels || ["A", "B", "C", "D"],
  };
  const imageHitboxes = mathImageHitboxes[q.id] || null;
  if (imageHitboxes && !hd) {
    // Image fallback with clickable hitboxes when no verified HD/SVG version exists.
    return {
      ...base,
      kind: "image",
      image: q.imagePath,
      imageWebp: q.imagePath.replace(".png", ".webp"),
      hitboxes: imageHitboxes,
      options: (q.answerLabels || ["A", "B", "C", "D"]).map((l) => ({ label: l, text: "" })),
    };
  }
  if (hd) {
    // HD question: text/SVG (KaTeX). Options are tex/ar; labels A.. by index unless option sets its own.
    return {
      ...base,
      kind: hd.svg ? "svg" : "text",
      layout: hd.layout,
      prompt: hd.prompt,
      svg: hd.svg,
      options: hd.options.map((o, i) => ({ label: base.answerLabels[i], ...o, oneLineMath: oneLineMathIds.has(q.id) })),
    };
  }
  return { ...base, kind: "image", image: q.imagePath, imageWebp: q.imagePath.replace(".png", ".webp"),
    hitboxes: null,
    options: (q.answerLabels || ["A", "B", "C", "D"]).map((l) => ({ label: l, text: "" })) };
});

// ---- ENGLISH: text-based (grammar/vocab/reading) ----
export const englishBank = englishRaw.map((q) => ({
  id: q.id,
  section: "english",
  questionType: q.questionType, // grammar | vocabulary | reading
  category: q.category,
  subcategory: q.subcategory || "",
  passageId: q.passageId || null,
  questionText: q.questionText,
  options: (q.options || []).map(opt),
  answerLabels: q.answerLabels || ["A", "B", "C", "D"],
  correctAnswer: q.correctAnswer,
  kind: "text-en",
}));

// ---- THIRD SECTION: image-based, MC or numeric input ----
export const thirdBank = thirdRaw.map((q) => ({
  id: q.id,
  section: "third_section",
  questionType: q.questionType,
  interactionType: q.interactionType, // multiple_choice | numeric_input
  image: q.imagePath,
  imageWebp: q.imagePath.replace(".png", ".webp"),
  answerLabels: q.answerLabels || [],
  correctAnswer: q.correctAnswer || "",
  inputCount: q.inputCount || 0,
  inputLabels: q.inputLabels || [],
  keypadDigits: q.keypadDigits || [],
  expressionTemplate: q.expressionTemplate || "",
  sampleCorrectAnswerValues: q.sampleCorrectAnswerValues || [],
  kind: q.interactionType === "numeric_input" ? "numeric" : "image",
  hitboxes: q.interactionType === "numeric_input" ? null : (thirdHitboxes[q.id] || null),
  // inductive (image) questions use clickable overlay hitboxes on top of the original image.
  options: q.interactionType === "numeric_input" ? [] : (q.answerLabels || []).map((l) => ({ label: l, text: "" })),
}));

// ---- VOCAB: standalone trainer modes ----
const vocabByType = (qt) =>
  vocabRaw
    .filter((q) => q.active !== false && q.id.endsWith(qt))
    .map((q) => ({
      id: q.id,
      section: "vocab",
      vocabMode: qt, // WT | FIB
      questionText: q.questionText,
      sentenceText: q.sentenceText || q.questionText,
      word: q.questionText,
      highlightedWord: q.highlightedWord || null,
      options: (q.options || []).map(opt),
      correctAnswer: q.correctAnswer,
      correctAnswerValue: q.correctAnswerValue || null,
      hintTextAr: q.hintTextAr || null,
      kind: "vocab",
    }));

export const vocabBanks = {
  WT: vocabByType("WT"),   // ترجمة الكلمة
  FIB: vocabByType("FIB"), // املأ الفراغ
};

// ===================== fixed exam forms =====================
// Exam sections are intentionally hardlocked. Every user receives the same
// question IDs in the same order on every attempt. Vocabulary practice keeps
// the legacy rotating behavior and is not included here.
const LOCKED_MATH_IDS = [
  "ITC-MATH-0001", "ITC-MATH-0002",
  "ITC-MATH-0005", "ITC-MATH-0006",
  "ITC-MATH-0009", "ITC-MATH-0010",
  "ITC-MATH-0013", "ITC-MATH-0014",
  "ITC-MATH-0017", "ITC-MATH-0018",
  "ITC-MATH-0021", "ITC-MATH-0022",
  "ITC-MATH-0025", "ITC-MATH-0026",
  "ITC-MATH-0029", "ITC-MATH-0030",
  "ITC-MATH-0033", "ITC-MATH-0034",
  "ITC-MATH-0037", "ITC-MATH-0038",
  "ITC-MATH-0041", "ITC-MATH-0042",
  "ITC-MATH-0045", "ITC-MATH-0046",
  "ITC-MATH-0049", "ITC-MATH-0050",
  "ITC-MATH-0053", "ITC-MATH-0054",
  "ITC-MATH-0057", "ITC-MATH-0058",
];

const LOCKED_ENGLISH_IDS = [
  "ITC-ENG-GRAM-001", "ITC-ENG-GRAM-002", "ITC-ENG-GRAM-003", "ITC-ENG-GRAM-004", "ITC-ENG-GRAM-005",
  "ITC-ENG-GRAM-006", "ITC-ENG-GRAM-007", "ITC-ENG-GRAM-008", "ITC-ENG-GRAM-009", "ITC-ENG-GRAM-010",
  "ITC-ENG-VOCAB-001", "ITC-ENG-VOCAB-002", "ITC-ENG-VOCAB-003", "ITC-ENG-VOCAB-004", "ITC-ENG-VOCAB-005",
  "ITC-ENG-VOCAB-006", "ITC-ENG-VOCAB-007", "ITC-ENG-VOCAB-008", "ITC-ENG-VOCAB-009", "ITC-ENG-VOCAB-010",
  "ITC-ENG-READ-001", "ITC-ENG-READ-002", "ITC-ENG-READ-003", "ITC-ENG-READ-004", "ITC-ENG-READ-005",
  "ITC-ENG-READ-006", "ITC-ENG-READ-007", "ITC-ENG-READ-008", "ITC-ENG-READ-009", "ITC-ENG-READ-010",
];

const LOCKED_THIRD_IDS = [
  "ITC-THIRD-0010", "ITC-THIRD-0011", "ITC-THIRD-0012", "ITC-THIRD-0013", "ITC-THIRD-0014",
  "ITC-THIRD-0001", "ITC-THIRD-0002", "ITC-THIRD-0003", "ITC-THIRD-0004", "ITC-THIRD-0005",
];

const LOCKED_EXAM_KINDS = new Set(["exam:math", "exam:english", "exam:third", "exam:comprehensive"]);
const byIds = (pool, ids) => {
  const byId = Object.fromEntries(pool.map((q) => [q.id, q]));
  return ids.map((id) => byId[id]).filter(Boolean);
};
const lockedMathSet = () => byIds(mathBank, LOCKED_MATH_IDS);
const lockedEnglishSet = () => byIds(englishBank, LOCKED_ENGLISH_IDS);
const lockedThirdSet = () => byIds(thirdBank, LOCKED_THIRD_IDS);
const buildLockedSet = (kind) => {
  switch (kind) {
    case "exam:math": return lockedMathSet();
    case "exam:english": return lockedEnglishSet();
    case "exam:third": return lockedThirdSet();
    case "exam:comprehensive": return [...lockedMathSet(), ...lockedEnglishSet(), ...lockedThirdSet()];
    default: return null;
  }
};

// ===================== seen-history rotation =====================
const HISTORY_KEY = "leen_itc_question_history_v3";
const SET_KEY = "leen_itc_current_question_set_v5";
const LAST_ATTEMPT_KEY = "leen_itc_last_finished_question_set_v2";

const readJSON = (k, d) => {
  try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; }
};
const writeJSON = (k, v) => {
  try { localStorage.setItem(k, JSON.stringify(v)); } catch {}
};

const getHistory = () => readJSON(HISTORY_KEY, {});
const getSets = () => readJSON(SET_KEY, {});
const getLastAttempts = () => readJSON(LAST_ATTEMPT_KEY, {});

// pick n unseen ids from a pool, balancing by category when keyFn provided.
// Important rule: when the same exam is started again, do not serve questions
// from the student's immediately previous completed attempt unless the bank is exhausted.
function pickBalanced(pool, n, poolKey, keyFn, avoidIds = []) {
  const hist = getHistory();
  const seen = new Set(hist[poolKey] || []);
  const avoid = new Set(avoidIds || []);

  // Primary pool: unseen AND not in the last finished attempt for this exact exam.
  let unseen = pool.filter((q) => !seen.has(q.id) && !avoid.has(q.id));

  // If history leaves too few questions but the bank still has enough questions
  // outside the last attempt, reuse older seen questions but still avoid the last set.
  if (unseen.length < n) {
    const notLastAttempt = pool.filter((q) => !avoid.has(q.id));
    unseen = notLastAttempt.length >= n ? notLastAttempt : pool.slice(); // truly exhausted -> full reuse allowed
  }

  if (keyFn) {
    // round-robin across categories
    const groups = {};
    unseen.forEach((q) => { (groups[keyFn(q)] ||= []).push(q); });
    Object.values(groups).forEach((g) => g.sort(() => Math.random() - 0.5));
    const cats = Object.keys(groups);
    const out = [];
    let i = 0;
    while (out.length < n && cats.some((c) => groups[c].length)) {
      const c = cats[i % cats.length];
      if (groups[c].length) out.push(groups[c].pop());
      i++;
    }
    return out.slice(0, n);
  }
  return [...unseen].sort(() => Math.random() - 0.5).slice(0, n);
}

// Returns a reserved question set for an exam kind+mode, reusing until completed.
export function getQuestionSet(kind) {
  if (LOCKED_EXAM_KINDS.has(kind)) {
    return buildLockedSet(kind) || [];
  }

  const sets = getSets();
  if (sets[kind]?.length) {
    // rebuild from ids
    const byId = Object.fromEntries(allQuestions().map((q) => [q.id, q]));
    const restored = sets[kind].map((id) => byId[id]).filter(Boolean);
    if (restored.length) return restored;
  }
  const fresh = buildSet(kind);
  sets[kind] = fresh.map((q) => q.id);
  writeJSON(SET_KEY, sets);
  return fresh;
}

function groupThirdQuestions(qs) {
  const order = { numeric_input: 0, multiple_choice: 1 };
  return [...qs].sort((a, b) => (order[a.interactionType] ?? 9) - (order[b.interactionType] ?? 9));
}

function buildSet(kind) {
  const last = getLastAttempts();
  const avoid = new Set(last[kind] || []);
  const avoidFor = (section) => (q) => avoid.has(q.id) && (!section || q.section === section);
  switch (kind) {
    case "exam:math": return lockedMathSet();
    case "exam:english": return lockedEnglishSet();
    case "exam:third": return lockedThirdSet();
    case "exam:comprehensive": return [...lockedMathSet(), ...lockedEnglishSet(), ...lockedThirdSet()];
    case "vocab:WT": return pickBalanced(vocabBanks.WT, 30, "vocab_word_translation", null, [...avoid]);
    case "vocab:FIB": return pickBalanced(vocabBanks.FIB, 30, "vocab_fill_blank", null, [...avoid]);
    default: return [];
  }
}

// Mark a completed set's questions as seen, then clear the reserved set.
export function completeQuestionSet(kind, questions) {
  const hist = getHistory();
  const last = getLastAttempts();
  last[kind] = (questions || []).map((q) => q.id).filter(Boolean);
  writeJSON(LAST_ATTEMPT_KEY, last);
  const add = (poolKey, qs) => {
    const set = new Set(hist[poolKey] || []);
    qs.forEach((q) => set.add(q.id));
    hist[poolKey] = [...set];
  };
  const math = questions.filter((q) => q.section === "math");
  const eng = questions.filter((q) => q.section === "english");
  const third = questions.filter((q) => q.section === "third_section");
  if (math.length) add("math", math);
  if (eng.length) add("english", eng);
  if (third.length) add("third", third);
  const vocabModeKey = { WT: "vocab_word_translation", FIB: "vocab_fill_blank" };
  const vc = questions.filter((q) => q.section === "vocab");
  if (vc.length) add(vocabModeKey[vc[0].vocabMode], vc);
  writeJSON(HISTORY_KEY, hist);
  const sets = getSets();
  delete sets[kind];
  writeJSON(SET_KEY, sets);
}

function allQuestions() {
  return [...mathBank, ...englishBank, ...thirdBank, ...vocabBanks.WT, ...vocabBanks.FIB];
}

export function getQuestionsByIds(ids = []) {
  const byId = Object.fromEntries(allQuestions().map((q) => [q.id, q]));
  return ids.map((id) => byId[id]).filter(Boolean);
}

export function rehydrateQuestions(questions = []) {
  const byId = Object.fromEntries(allQuestions().map((q) => [q.id, q]));
  return (questions || []).map((q) => byId[q?.id] || q).filter(Boolean);
}

// exam metadata (counts + durations from spec)
export const EXAMS = {
  comprehensive: { kind: "exam:comprehensive", title: "الاختبار الشامل (جميع الأقسام)", count: 70, minutes: 85, icon: "🎯" },
  math: { kind: "exam:math", title: "اختبار قسم الرياضيات", count: 30, minutes: 45, icon: "📐" },
  english: { kind: "exam:english", title: "اختبار قسم الإنجليزي", count: 30, minutes: 30, icon: "🔤" },
  third: { kind: "exam:third", title: "اختبار قسم التفكير الاستقرائي", count: 10, minutes: 10, icon: "🧩" },
};

export const VOCAB_MODES = {
  WT: { kind: "vocab:WT", title: "ترجمة الكلمة", count: 30, minutes: 30, icon: "🔠" },
  FIB: { kind: "vocab:FIB", title: "املأ الفراغ", count: 30, minutes: 30, icon: "✏️" },
};

// per-question seconds by section (spec)
export const QUESTION_SECONDS = { math: 90, english: 60, third_section: 60, vocab: 60 };
