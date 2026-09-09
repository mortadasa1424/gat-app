// GAT question schema + category constants.
//
// A question (after normalization by data/tests.js) looks like:
//
// {
//   id: "GAT-QT1-001",                 // testKey-index, stable across edits
//   section: "quantitative" | "verbal",
//   testKey: "quant1" | "quant2" | "quant3" | "verbal1" | "verbal2" | "verbal3",
//   order: 1,                          // 1..N, position within the test (N varies per test)
//
//   specificCategory: "",              // raw category from the source Word doc (unmapped)
//   generalCategory: null,             // one of GENERAL_CATEGORIES[section]; null until the
//                                      // specificCategory -> generalCategory mapping is supplied
//
//   kind: "text" | "text-passage" | "image" | "svg",
//   prompt: [ { type: "ar"|"en"|"tex"|"block", text: "" } ],
//   passageId: null,                   // Verbal Reading Comprehension -> data/mock/passages.json
//   image: null,                       // extracted asset path, used when kind === "image"
//   svg: null,                         // vector diagram markup, used when kind === "svg"
//
//   options: [ { label: "A", text: "", tex: null } ],
//   answerLabels: ["A", "B", "C", "D"],
//   correctAnswer: "A",
//
//   sourceRef: null,                   // originating .docx + question number, for traceability
//   reviewStatus: "mock" | "needs_qa" | "final",
// }

export const GENERAL_CATEGORIES = {
  quantitative: [
    "Arithmetic",
    "Algebra",
    "Statistics & Data Analysis",
    "Geometry",
    "Miscellaneous Topics",
  ],
  // "The Odd One Out" was removed from the platform entirely (no longer a
  // supported category) — Verbal Test 1's source document still contained a
  // few Odd One Out questions, which were excluded during ingestion rather
  // than imported and hidden.
  verbal: [
    "Analogy",
    "Sentence Completion",
    "Contextual Error",
    "Reading Comprehension",
  ],
};

// specificCategory (the Lesson name from the source Word docs) -> generalCategory.
// Centralized so it can be inspected/changed in one place without touching
// individual questions. Populated from Quantitative Test 1's real lessons;
// extend as later tests introduce new lesson names.
//
// Entries below were not explicitly given in the original spec and are
// judgment calls, called out here rather than invented silently elsewhere:
//   - "Roots": paired with Exponents (its inverse operation) under Algebra,
//     consistent with how this document already treats Exponents.
//   - "Speed - Time - Distance": doesn't fit any of the four named categories
//     cleanly (it's a word-problem topic, not a math operation), so it's
//     placed in Miscellaneous Topics rather than forced into Algebra/Arithmetic.
//   - "Sequences & Patterns" (introduced in Test 2): finding a pattern/nth
//     term is algebraic reasoning, not a numeric operation or geometry topic,
//     so it's grouped under Algebra.
export const SPECIFIC_TO_GENERAL = {
  // Geometry
  "Shaded Areas": "Geometry",
  "Triangles": "Geometry",
  "Circles": "Geometry",
  "Angles": "Geometry",
  "Polygons & Quadrilaterals": "Geometry",
  "Areas, Perimeters & Volumes": "Geometry",

  // Algebra
  "Exponents": "Algebra",
  "Algebraic Expressions": "Algebra",
  "Equations & Inequalities": "Algebra",
  "Algebraic Expressions, Equations & Inequalities": "Algebra",
  "Roots": "Algebra", // judgment call — see comment above
  "Sequences & Patterns": "Algebra", // judgment call — see comment above

  // Statistics & Data Analysis
  "Statistics": "Statistics & Data Analysis",
  "Data Analysis": "Statistics & Data Analysis",

  // Arithmetic
  "Numbers & Order of Operations": "Arithmetic",
  "Decimals": "Arithmetic",
  "Fractions": "Arithmetic",
  "Division": "Arithmetic",
  "Ratios & Percentages": "Arithmetic",
  "Percentages & Ratios": "Arithmetic",
  "Proportions": "Arithmetic",

  // Miscellaneous Topics
  "Speed - Time - Distance": "Miscellaneous Topics", // judgment call — see comment above
};

export const TEST_META = {
  quant1: { section: "quantitative", title: "Quantitative - Test 1" },
  quant2: { section: "quantitative", title: "Quantitative - Test 2" },
  quant3: { section: "quantitative", title: "Quantitative - Test 3" },
  verbal1: { section: "verbal", title: "Verbal - Test 1" },
  verbal2: { section: "verbal", title: "Verbal - Test 2" },
  verbal3: { section: "verbal", title: "Verbal - Test 3" },
};
