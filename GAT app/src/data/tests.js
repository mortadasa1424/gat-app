// Normalizes the mock question banks into fixed-form test sets. GAT tests are
// always the same question set in the same order for every attempt — no
// randomization or seen-history rotation (unlike ITC's vocab trainer).
import quant1Real from "./quant/test-1.json";
import quant2Real from "./quant/test-2.json";
import quant3Real from "./quant/test-3.json";
import verbal1Real from "./verbal/test-1.json";
import verbal1Passages from "./verbal/passages-1.json";
import verbal2Real from "./verbal/test-2.json";
import verbal2Passages from "./verbal/passages-2.json";
import verbal3Real from "./verbal/test-3.json";
import verbal3Passages from "./verbal/passages-3.json";
import passagesRaw from "./mock/passages.json";
import { TEST_META, SPECIFIC_TO_GENERAL } from "./schema.js";

export { TEST_META, GENERAL_CATEGORIES } from "./schema.js";

export const passages = Object.fromEntries(
  [...passagesRaw, ...verbal1Passages, ...verbal2Passages, ...verbal3Passages].map((p) => [p.id, p])
);

// Every GAT test is namespaced with its testKey so ids stay unique across the
// six slots (quant2/3 and verbal2/3 still share small mock content until
// their real imports land). Each test's own question count is used
// everywhere (quiz, scoring, review, etc.) — nothing assumes a fixed length.
// generalCategory is derived centrally from specificCategory via
// SPECIFIC_TO_GENERAL (falling back to a question's own generalCategory for
// mock data, which sets it directly since it has no real specificCategory).
function buildTestQuestions(testKey, base) {
  const meta = TEST_META[testKey];
  return base.map((q, i) => ({
    ...q,
    id: `GAT-${testKey.toUpperCase()}-${String(i + 1).padStart(3, "0")}`,
    section: meta.section,
    testKey,
    order: i + 1,
    generalCategory: SPECIFIC_TO_GENERAL[q.specificCategory] ?? q.generalCategory ?? null,
  }));
}

const TEST_QUESTIONS = {
  quant1: buildTestQuestions("quant1", quant1Real),
  quant2: buildTestQuestions("quant2", quant2Real),
  quant3: buildTestQuestions("quant3", quant3Real),
  verbal1: buildTestQuestions("verbal1", verbal1Real),
  verbal2: buildTestQuestions("verbal2", verbal2Real),
  verbal3: buildTestQuestions("verbal3", verbal3Real),
};

export function getTestQuestions(testKey) {
  return TEST_QUESTIONS[testKey] || [];
}

function allQuestions() {
  return Object.values(TEST_QUESTIONS).flat();
}

export function getQuestionsByIds(ids = []) {
  const byId = Object.fromEntries(allQuestions().map((q) => [q.id, q]));
  return ids.map((id) => byId[id]).filter(Boolean);
}

export function rehydrateQuestions(questions = []) {
  const byId = Object.fromEntries(allQuestions().map((q) => [q.id, q]));
  return (questions || []).map((q) => byId[q?.id] || q).filter(Boolean);
}
