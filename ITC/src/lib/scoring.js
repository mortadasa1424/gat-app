// Scoring per spec: correct | incorrect | unanswered | unscored.
// Numeric questions use expressionTemplate evaluation with digit normalization.

function normalizeNum(s) {
  if (s == null) return "";
  // Arabic-Indic and Persian digits -> ASCII
  const map = { "٠":"0","١":"1","٢":"2","٣":"3","٤":"4","٥":"5","٦":"6","٧":"7","٨":"8","٩":"9",
                "۰":"0","۱":"1","۲":"2","۳":"3","۴":"4","۵":"5","۶":"6","۷":"7","۸":"8","۹":"9" };
  return String(s).replace(/[٠-٩۰-۹]/g, (d) => map[d]).replace(/[,٬]/g, "").replace(/×/g, "*").replace(/÷/g, "/").replace(/[−–]/g, "-").trim();
}

function safeEval(expr) {
  if (!/^[0-9+\-*/(). ]+$/.test(expr)) return null;
  try { /* eslint-disable no-new-func */ const v = Function(`"use strict";return (${expr})`)(); return Number.isFinite(v) ? v : null; }
  catch { return null; }
}

// evaluate a numeric question. Template is an EQUATION, 1-based, e.g. "{1}+{2}=15"
// or "({1}×{2})+{3}=71". We substitute the user's inputs (slot i -> {i+1}),
// evaluate the left side, and compare to the right side.
function scoreNumeric(q, vals) {
  const inputs = (vals || []).map(normalizeNum);
  const need = q.inputCount || inputs.length;
  const filled = inputs.filter((v) => v !== "").length;
  if (filled === 0) return "unanswered";
  if (filled < need) return "unanswered"; // partial = treat as not answered
  const tmpl = q.expressionTemplate || "";
  if (tmpl) {
    let eq = tmpl;
    // 1-based placeholders
    inputs.forEach((v, i) => { eq = eq.split(`{${i + 1}}`).join(v || "0"); });
    eq = normalizeNum(eq); // also converts ×÷− to * / -
    const sides = eq.split("=");
    if (sides.length !== 2) return "unscored";
    const lhs = safeEval(sides[0]);
    const rhs = safeEval(sides[1]);
    if (lhs == null || rhs == null) return "unscored";
    return Math.abs(lhs - rhs) < 1e-6 ? "correct" : "incorrect";
  }
  const got = safeEval(inputs[0] || "");
  if (got == null) return "unscored";
  return String(got) === normalizeNum(q.correctAnswer) ? "correct" : "incorrect";
}

export function scoreAttempt({ questions, answers, numeric }) {
  const rows = questions.map((q, i) => {
    let status;
    if (q.kind === "numeric") {
      status = scoreNumeric(q, numeric[i]);
    } else {
      const sel = answers[i];
      if (sel == null) status = "unanswered";
      else status = q.options[sel]?.label === q.correctAnswer ? "correct" : "incorrect";
    }
    return { q, i, status, selected: answers[i], numeric: numeric[i] };
  });
  const correct = rows.filter((r) => r.status === "correct").length;
  const incorrect = rows.filter((r) => r.status === "incorrect").length;
  const unanswered = rows.filter((r) => r.status === "unanswered").length;
  const unscored = rows.filter((r) => r.status === "unscored").length;
  const scorable = rows.length - unscored;
  const pct = scorable > 0 ? Math.round((correct / scorable) * 100) : 0;
  return { rows, correct, incorrect, unanswered, unscored, scorable, pct, total: rows.length };
}

// diagnostic breakdown by a key function
export function diagnose(rows, keyFn, labelFn) {
  const groups = {};
  rows.forEach((r) => {
    const k = keyFn(r.q);
    if (k == null) return;
    (groups[k] ||= { correct: 0, incorrect: 0, unanswered: 0, unscored: 0, total: 0 });
    groups[k][r.status]++; groups[k].total++;
  });
  return Object.entries(groups).map(([k, g]) => {
    const scorable = g.total - g.unscored;
    const pct = scorable > 0 ? Math.round((g.correct / scorable) * 100) : 0;
    let feedback = "بحاجة إلى تأسيس";
    if (pct >= 90) feedback = "مستواك جيد في هذا القسم";
    else if (pct > 0) feedback = "بحاجة إلى تدريب";
    return { key: k, label: labelFn ? labelFn(k) : k, pct, feedback, ...g };
  }).sort((a, b) => b.pct - a.pct);
}
