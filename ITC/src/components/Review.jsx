import { useState } from "react";
import katex from "katex";
import QuestionCard from "./QuestionCard.jsx";
import { Header, Footer, MainLogo } from "./Home.jsx";
import { Sound } from "../lib/sound.js";

function looksLikeMath(text) {
  return typeof text === "string" && (/\\(frac|sqrt|log|sin|cos|tan|begin|le|ge|times|div)/.test(text) || /[{}_^]/.test(text));
}
function optionValue(opt, fallback = "—") {
  if (!opt) return { text: fallback };
  if (opt.tex) return { tex: opt.tex };
  const val = opt.text ?? opt.ar ?? "";
  if (String(val).trim()) return { text: val };
  if (opt.label) return { text: opt.label };
  return { text: fallback };
}
function normalizeTex(input = "") {
  let t = String(input || "");
  return t
    .replace(/\\textor/g, "\\text{or}")
    .replace(/\\text\s*or/g, "\\text{or}")
    .replace(/\\frac\s*([0-9])([0-9])(?![0-9{])/g, "\\frac{$1}{$2}")
    .replace(/\\frac\s*\{?([0-9]+)\}?\s*\{([0-9]+)\}/g, "\\frac{$1}{$2}")
    .replace(/\\tfrac\s*([0-9])([0-9])(?![0-9{])/g, "\\tfrac{$1}{$2}");
}
function AnswerValue({ value, tone }) {
  if (value?.imageSrc) {
    const meta = value.label ? `الخيار ${value.label}` : "";
    return (
      <b className={`${tone} review-thumb-wrap`}>
        <img className="review-choice-thumb" src={value.imageSrc} alt={value.label ? `الخيار ${value.label}` : "الإجابة"} />
        {meta && <span className="review-choice-meta">{meta}</span>}
      </b>
    );
  }
  if (Array.isArray(value)) return <b className={tone}>{value.filter(Boolean).join(" ، ") || "—"}</b>;
  if (value?.tex || looksLikeMath(value?.text)) {
    let html = "";
    try { html = katex.renderToString(normalizeTex(value.tex || value.text), { throwOnError: false, strict: "ignore" }); }
    catch { html = String(value.tex || value.text || "—"); }
    return <b className={`${tone} ans-math`} dir="ltr" dangerouslySetInnerHTML={{ __html: html }} />;
  }
  return <b className={tone}>{value?.text ?? "—"}</b>;
}

export default function Review({ res, dark, onToggleDark, soundOn, onToggleSound, onHome, onBack }) {
  const [filter, setFilter] = useState("all");
  const rows = res.rows.filter((r) => filter === "all" ? true : filter === "wrong" ? r.status === "incorrect" : r.status === "unanswered");

  const thirdThumb = (q, label) => {
    if (!label) return { text: "—" };
    return { imageSrc: `/assets/questions/third_section/crops/${q.id}_${label}.webp`, label };
  };
  const answerValue = (r) => {
    if (r.q.kind === "numeric") return (r.numeric || []).filter(Boolean);
    if (r.selected == null) return { text: "—" };
    const o = r.q.options?.[r.selected];
    if (r.q.section === "third_section" && r.q.kind === "image") return thirdThumb(r.q, o?.label);
    return optionValue(o);
  };
  const correctValue = (r) => {
    if (r.q.kind === "numeric") {
      const sample = r.q.sampleCorrectAnswerValues || [];
      return sample.length ? sample : { text: "أي أرقام تحقق المعادلة" };
    }
    if (r.q.section === "third_section" && r.q.kind === "image") return thirdThumb(r.q, r.q.correctAnswer);
    const o = r.q.options?.find((x) => x.label === r.q.correctAnswer);
    return optionValue(o, r.q.correctAnswer ? r.q.correctAnswer : "—");
  };

  return (
    <div className="screen review screen-enter">
      <Header showBack onBack={onBack} showHome onHome={onHome} dark={dark} onToggleDark={onToggleDark} soundOn={soundOn} onToggleSound={onToggleSound} />
      <MainLogo dark={dark} />
      <div className="review-head">
        <h2>مراجعة الإجابات</h2>
        <div className="review-filters">
          {[["all", "الكل"], ["wrong", "الأخطاء"], ["empty", "الفارغة"]].map(([k, l]) => (
            <button key={k} className={filter === k ? "on" : ""} onClick={() => { Sound.tap(); setFilter(k); }}>{l}</button>
          ))}
        </div>
      </div>
      <div className="scroll-area">
        {rows.map((r) => (
          <div className="review-item" key={r.i}>
            <div className="review-ihead">
              <span className="review-num">السؤال {r.i + 1}</span>
              <span className={`review-verdict ${r.status}`}>
                {r.status === "correct" ? "صحيحة ✓" : r.status === "incorrect" ? "خطأ ✕" : r.status === "unscored" ? "غير مُقيّم" : "بدون إجابة"}
              </span>
            </div>
            <QuestionCard question={r.q} selected={r.selected} revealed={true} numericValues={r.numeric || []} showHints={false} />
          </div>
        ))}
        {rows.length === 0 && <div className="review-empty">لا توجد أسئلة في هذا التصنيف.</div>}
      </div>
      <Footer />
    </div>
  );
}
