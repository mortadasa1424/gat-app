import { useMemo, useState } from "react";
import katex from "katex";
import { passages } from "../data/banks.js";

const LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];

function normalizeTex(input = "") {
  let t = String(input || "");
  // Repair common malformed TeX from transcription, while preserving valid KaTeX.
  t = t
    .replace(/\\textor/g, "\\text{or}")
    .replace(/\\text\s*or/g, "\\text{or}")
    .replace(/\\frac\s*([0-9])([0-9])(?![0-9{])/g, "\\frac{$1}{$2}")
    .replace(/\\frac\s*\{?([0-9]+)\}?\s*\{([0-9]+)\}/g, "\\frac{$1}{$2}")
    .replace(/\\frac\s*\{([0-9]+)\}\s*\{?([0-9]+)\}?/g, "\\frac{$1}{$2}")
    .replace(/\\tfrac\s*([0-9])([0-9])(?![0-9{])/g, "\\tfrac{$1}{$2}")
    .replace(/\\tfrac\s*\{?([0-9]+)\}?\s*\{([0-9]+)\}/g, "\\tfrac{$1}{$2}")
    .replace(/(^|[^\\])circ\b/g, "$1\\\\circ")
    .replace(/(^|[^\\])theta\b/g, "$1\\\\theta")
    .replace(/(^|[^\\])pi\b/g, "$1\\\\pi")
    .replace(/([0-9A-Za-z}\\)])\s*;\s*(?=[A-Za-z\\])/g, "$1\\\\;")
    .replace(/(^|[^\\])times\b/g, "$1\\\\times");
  // Convert stray text-or markers that appeared inside answer options.
  t = t.replace(/\\text\{or\}/g, "\\;\\text{or}\\;");
  return t;
}

function Tex({ tex, block = false, className = "" }) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(normalizeTex(tex), {
        throwOnError: false,
        displayMode: block,
        strict: "ignore",
        trust: false,
      });
    } catch {
      return String(tex || "");
    }
  }, [tex, block]);
  const Tag = block ? "div" : "span";
  return <Tag className={className} dir="ltr" dangerouslySetInnerHTML={{ __html: html }} />;
}

function InlineSeg({ tex }) {
  return <span className="iso"><Tex tex={tex} /></span>;
}

function Segment({ s, i }) {
  if (s.type === "block") return <span key={i} className="iso block-inline"><Tex tex={s.text} block /></span>;
  if (s.type === "tex") return <InlineSeg key={i} tex={s.text} />;
  return <span key={i}>{s.text}</span>;
}

function Prompt({ q }) {
  const segs = q.prompt || [];
  const hasBlock = segs.some((s) => s.type === "block");
  const layout = q.layout || (hasBlock ? "stacked" : "inline");
  if (layout === "stacked") {
    const lead = [], blocks = [];
    let seen = false;
    segs.forEach((s) => { if (s.type === "block") { seen = true; blocks.push(s); } else if (!seen) lead.push(s); else blocks.push(s); });
    return (
      <div className="q-prompt q-stacked" dir="rtl">
        {lead.length > 0 && <div className="q-lead">{lead.map((s, i) => <Segment key={i} s={s} i={i} />)}</div>}
        {blocks.map((s, i) => s.type === "block"
          ? <div className="q-block" key={i}><Tex tex={s.text} block /></div>
          : s.type === "tex" ? <div className="q-lead" key={i}><InlineSeg tex={s.text} /></div>
          : <div className="q-lead" key={i}>{s.text}</div>)}
      </div>
    );
  }
  return <div className="q-prompt" dir="rtl">{segs.map((s, i) => <Segment key={i} s={s} i={i} />)}</div>;
}

function highlightSentence(text, word) {
  if (!word) return text;
  const re = new RegExp(`(${word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "i");
  return String(text || "").split(re).map((p, i) => re.test(p) ? <mark key={i} className="q-hl">{p}</mark> : <span key={i}>{p}</span>);
}
function stripQuotesWord(t) { const m = t && t.match(/"([^"]+)"/); return m ? m[1] : null; }

function sanitizePassageText(text) {
  return String(text || "")
    .replace(/\\r\\n|\\n|\\r/g, "\n")
    .replace(/\/r|\/n/g, " ")
    .replace(/\s+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function EnglishPrompt({ q }) {
  const passage = q.passageId ? passages[q.passageId] : null;
  const isCtx = q.questionType === "context";
  return (
    <div className="q-en">
      {passage && (
        <div className="q-passage" dir="ltr">
          <div className="q-passage-t">{passage.title}</div>
          <div className="q-passage-b">{sanitizePassageText(passage.passageText)}</div>
        </div>
      )}
      <div className="q-text" dir="ltr">
        {isCtx ? highlightSentence(q.sentenceText || q.questionText, q.highlightedWord || stripQuotesWord(q.questionText)) : q.questionText}
      </div>
    </div>
  );
}

function SpeakButton({ word }) {
  const [speaking, setSpeaking] = useState(false);
  const speak = () => {
    try {
      const u = new SpeechSynthesisUtterance(word);
      const voices = speechSynthesis.getVoices();
      const us = voices.find((v) => /en-US/i.test(v.lang)) || voices.find((v) => /^en/i.test(v.lang));
      if (us) u.voice = us;
      u.rate = 0.9;
      u.onstart = () => setSpeaking(true);
      u.onend = () => setSpeaking(false);
      speechSynthesis.cancel();
      speechSynthesis.speak(u);
    } catch {}
  };
  return <button className={`quiz-tool-btn q-speak tool-speak ${speaking ? "speaking" : ""}`} onClick={speak} aria-label="نطق الكلمة" type="button">نطق الكلمة</button>;
}

function VocabWord({ q }) {
  return (
    <div className="q-word-wrap no-speaker">
      <div className="q-word" dir="ltr">{q.word}</div>
    </div>
  );
}

function looksLikeMath(text) {
  return typeof text === "string" && (/\\(frac|sqrt|log|sin|cos|tan|begin|le|ge|times|div|pm|text)/.test(text) || /[{}_^]/.test(text));
}
function optionText(opt) { return opt?.text ?? opt?.ar ?? opt?.tex ?? ""; }

function hasLatin(text = "") { return /[A-Za-z]/.test(String(text || "")); }
function hasArabic(text = "") { return /[\u0600-\u06FF]/.test(String(text || "")); }
function capitalizeEnglishOption(text = "") {
  const raw = String(text ?? "").trim();
  if (!raw || hasArabic(raw) || !hasLatin(raw)) return raw;
  return raw.replace(/\b([A-Za-z])([A-Za-z']*)\b/g, (_, a, rest) => `${a.toUpperCase()}${rest.toLowerCase()}`);
}
function plainOptionLength(text = "") {
  return String(text ?? "")
    .replace(/\\[a-zA-Z]+/g, "")
    .replace(/[{}_^\\;]/g, "")
    .replace(/\s+/g, " ")
    .trim().length;
}
// Rank the per-option size classes so a whole question can share ONE size,
// instead of one option shrinking to a tiny font next to a large neighbour.
const OPT_SIZE_RANK = { "": 0, "opt-or": 1, "opt-long": 1, "opt-xlong": 2 };
function optionSizeRank(cls) { return OPT_SIZE_RANK[cls] ?? 0; }
function groupOptionSizeClass(options = []) {
  const rank = options.reduce((m, o) => Math.max(m, optionSizeRank(optionSizeClass(o))), 0);
  return rank >= 2 ? "opt-xlong" : rank === 1 ? "opt-long" : "";
}
function optionSizeClass(opt) {
  const text = optionText(opt);
  const raw = opt?.tex || text;
  const rawStr = String(raw || "");
  const mathy = Boolean(opt?.tex || looksLikeMath(text));
  if (mathy && prettySimpleMath(raw)) return "";
  const len = plainOptionLength(raw);

  // Keep short math options readable. A tiny exponent, variable, or negative sign
  // should not force a massive shrink; only genuinely wide formulas should.
  if (mathy) {
    const hasFractionOrRoot = /\\frac|\\sqrt/.test(rawStr);
    const hasEquationOrInequality = /=|\\le|\\ge|<|>/.test(rawStr);
    const hasLongPolynomial = /\^\{?[23]\}?/.test(rawStr) && /[+\-]/.test(rawStr) && len >= 14;
    const commaCount = (rawStr.match(/,/g) || []).length;
    const signCount = (rawStr.match(/[+\-=]/g) || []).length;
    const hasManyTerms = commaCount >= 3 || (commaCount + signCount) >= 4;
    const hasLeadingNegativeSeries = /^\s*-/.test(rawStr) && commaCount >= 2;
    // Sequence-style answers can be wider than they look because KaTeX keeps the whole row on one line.
    // Slightly shrink only the longer sequence/polynomial options so the full expression stays visible.
    if (/\\(?:text|mathrm)\{or\}|\\;\\(?:text|mathrm)\{or\}\\;/.test(rawStr)) return "opt-or";
    if (len >= 34 || (hasEquationOrInequality && len >= 28) || (hasManyTerms && len >= 24)) return "opt-xlong";
    if (len >= 24 || hasLeadingNegativeSeries || (hasManyTerms && len >= 12) || (hasFractionOrRoot && len >= 14) || (hasEquationOrInequality && len >= 18) || hasLongPolynomial) return "opt-long";
    return "";
  }

  if (len >= 50) return "opt-xlong";
  if (len >= 34) return "opt-long";
  return "";
}

function normalizeDisplayText(text) {
  return String(text ?? "")
    // keep numbers and Arabic units from collapsing or flipping, e.g. 239 ريال not ريال239
    .replace(/([0-9٠-٩۰-۹]+(?:[.,][0-9٠-٩۰-۹]+)?)(?=[\u0600-\u06FF])/g, "$1 ")
    .replace(/([\u0600-\u06FF])(?=[0-9٠-٩۰-۹])/g, "$1 ")
    .replace(/\s{2,}/g, " ")
    .trim();
}
function renderPlainText(text) {
  const clean = normalizeDisplayText(text);
  const parts = clean.split(/(\d+(?:[.,]\d+)?|[٠-٩۰-۹]+(?:[.,][٠-٩۰-۹]+)?)/g);
  return parts.map((part, i) => /^(\d+(?:[.,]\d+)?|[٠-٩۰-۹]+(?:[.,][٠-٩۰-۹]+)?)$/.test(part)
    ? <span key={i} className="num-isolate" dir="ltr">{part}</span>
    : <span key={i}>{part}</span>);
}
function isArabicText(text) { return /[\u0600-\u06FF]/.test(String(text || "")); }
function isArabicOptionText(text) { return isArabicText(text) || /[٠-٩۰-۹]/.test(String(text || "")); }

function prettySimpleMath(tex = "") {
  const raw = String(tex || "").trim();
  const unit = raw.match(/^([0-9٠-٩۰-۹]+(?:[.,][0-9٠-٩۰-۹]+)?)\s*(?:\\;|\\,|\\:)?\s*cm\s*(?:\^\{?([23])\}?|\^([23]))$/i);
  if (unit) return { kind: "unit", value: unit[1], power: unit[2] || unit[3] };
  const degree = raw.match(/^([0-9٠-٩۰-۹]+(?:[.,][0-9٠-٩۰-۹]+)?)\s*(?:\^\{?\\circ\}?|°)$/i);
  if (degree) return { kind: "degree", value: degree[1] };
  return null;
}


function normalizeOneLineMathText(input = "") {
  return String(input ?? "")
    .replace(/\\;/g, " ")
    .replace(/\\,/g, " ")
    .replace(/\\:/g, " ")
    .replace(/\\leq?/g, "≤")
    .replace(/\\geq?/g, "≥")
    .replace(/\\pm/g, "±")
    .replace(/\\times/g, "×")
    .replace(/\\div/g, "÷")
    .replace(/\\text\{([^}]*)\}/g, "$1")
    .replace(/\\mathrm\{([^}]*)\}/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

function OneLineMathText({ text }) {
  const clean = normalizeOneLineMathText(text);
  const parts = [];
  let i = 0;
  while (i < clean.length) {
    const ch = clean[i];
    if (ch === "^") {
      if (clean[i + 1] === "{") {
        const close = clean.indexOf("}", i + 2);
        const sup = close > -1 ? clean.slice(i + 2, close) : clean[i + 2] || "";
        parts.push(<sup key={parts.length}>{sup}</sup>);
        i = close > -1 ? close + 1 : i + 3;
      } else {
        parts.push(<sup key={parts.length}>{clean[i + 1] || ""}</sup>);
        i += 2;
      }
      continue;
    }
    if (ch === "²" || ch === "³") {
      parts.push(<sup key={parts.length}>{ch === "²" ? "2" : "3"}</sup>);
      i += 1;
      continue;
    }
    if (/[A-Za-z]/.test(ch)) {
      let j = i + 1;
      while (j < clean.length && /[A-Za-z]/.test(clean[j])) j += 1;
      const word = clean.slice(i, j);
      if (/^[xyri]$/.test(word)) parts.push(<span key={parts.length} className="math-var">{word}</span>);
      else parts.push(<span key={parts.length}>{word}</span>);
      i = j;
      continue;
    }
    if (ch === " ") parts.push(<span key={parts.length} className="math-space"> </span>);
    else parts.push(<span key={parts.length}>{ch}</span>);
    i += 1;
  }
  return <span className="one-line-math-option" dir="ltr">{parts}</span>;
}

function MathOptionText({ tex }) {
  const simple = prettySimpleMath(tex);
  if (!simple) return <Tex tex={tex} />;
  if (simple.kind === "degree") {
    return <span className="simple-math-option" dir="ltr"><span>{simple.value}</span><span>°</span></span>;
  }
  return (
    <span className="simple-math-option" dir="ltr">
      <span>{simple.value}</span><span>&nbsp;cm</span><sup>{simple.power}</sup>
    </span>
  );
}

function OptionRow({ opt, index, state, disabled, onPick, isEnglishOption, isVocabOption, showTag, sizeOverride = null }) {
  const rawText = optionText(opt);
  const displayText = isVocabOption ? capitalizeEnglishOption(rawText) : rawText;
  const oneLineMath = Boolean(opt.oneLineMath);
  const mathy = Boolean(oneLineMath || opt.tex || looksLikeMath(rawText));
  const dir = mathy || isEnglishOption ? "ltr" : isArabicOptionText(displayText) ? "rtl" : "ltr";
  const sizeClass = sizeOverride != null ? sizeOverride : optionSizeClass(opt);
  // Do not apply opt-flat anymore. Its older CSS allowed KaTeX internals to wrap,
  // which stacked short answers vertically and expanded the option boxes.
  const cls = ["opt", !showTag && "no-tag", sizeClass, mathy && "opt-math", oneLineMath && "opt-oneline-math", state].filter(Boolean).join(" ");
  const letter = opt.label ?? LETTERS[index];
  return (
    <button className={cls} onClick={() => !disabled && onPick?.(index)} disabled={disabled} type="button" dir={dir}>
      {showTag && <span className="opt-tag">{letter}</span>}
      <span className={mathy ? "opt-eq" : "opt-txt"} dir={dir}>
        {oneLineMath ? <OneLineMathText text={opt.tex || rawText} /> : mathy ? <MathOptionText tex={opt.tex || rawText} /> : <span>{renderPlainText(displayText)}</span>}
      </span>
      <span className="opt-mark">{state === "correct" ? "✓" : state === "wrong" ? "✕" : ""}</span>
    </button>
  );
}

function NumericQuestion({ q, values, onChange, activeSlot, setActiveSlot, disabled }) {
  const tpl = q.expressionTemplate || "";
  const tokens = [];
  let i = 0;
  while (i < tpl.length) {
    if (tpl[i] === "{") {
      const close = tpl.indexOf("}", i);
      const n = parseInt(tpl.slice(i + 1, close), 10) - 1;
      tokens.push({ type: "box", slot: n });
      i = close + 1;
    } else {
      let j = i;
      while (j < tpl.length && tpl[j] !== "{") j++;
      tokens.push({ type: "txt", text: tpl.slice(i, j) });
      i = j;
    }
  }
  const keypad = q.keypadDigits?.length ? q.keypadDigits : ["1","2","3","4","5","6","7","8","9"];
  const press = (d) => {
    if (disabled) return;
    const next = [...values];
    next[activeSlot] = d;
    onChange(next);
    const total = q.inputCount || 1;
    setActiveSlot((activeSlot + 1) % total);
  };
  const del = () => {
    if (disabled) return;
    const next = [...values];
    next[activeSlot] = "";
    onChange(next);
  };
  return (
    <div className="numq">
      <div className="numq-helper" dir="rtl">املأ كل خانة برقم واحد فقط</div>
      <div className="numq-eq" dir="ltr">
        {tokens.map((t, k) => t.type === "box"
          ? <button key={k} type="button" disabled={disabled}
              className={`numbox ${activeSlot === t.slot ? "active" : ""} ${values[t.slot] ? "filled" : ""}`}
              onClick={() => setActiveSlot(t.slot)}>{values[t.slot] || ""}</button>
          : <span key={k} className="numq-op">{t.text}</span>)}
      </div>
      {!disabled && (
        <div className="keypad">
          {keypad.map((d) => <button key={d} type="button" className="key" onClick={() => press(d)}>{d}</button>)}
          <button type="button" className="key del" onClick={del}>⌫ مسح</button>
        </div>
      )}
    </div>
  );
}

const WORD_HINTS_AR = {
  amount: "يشير إلى مقدار الشيء أو عدده.",
  quantity: "يشير إلى مقدار الشيء أو عدد أجزائه.",
  people: "يشير إلى جماعة من البشر أو أكثر من شخص.",
  person: "يشير إلى إنسان واحد.",
  earth: "قد يشير إلى كوكبنا أو إلى التربة والسطح الذي نعيش عليه.",
  planet: "جرم كبير يدور حول نجم؛ والأرض مثال عليه.",
  full: "حالة الشيء عندما لا يبقى فيه فراغ أو مساحة إضافية.",
  empty: "حالة الشيء عندما لا يوجد داخله أي شيء.",
  jacket: "قطعة ملابس خارجية قصيرة تُلبس فوق الملابس، غالبًا في الجو البارد.",
  october: "الشهر العاشر من السنة، يأتي بعد سبتمبر وقبل نوفمبر.",
  january: "الشهر الأول من السنة.",
  february: "الشهر الثاني من السنة.",
  march: "الشهر الثالث من السنة.",
  april: "الشهر الرابع من السنة.",
  may: "الشهر الخامس من السنة.",
  june: "الشهر السادس من السنة.",
  july: "الشهر السابع من السنة.",
  august: "الشهر الثامن من السنة.",
  september: "الشهر التاسع من السنة.",
  november: "الشهر الحادي عشر من السنة.",
  december: "الشهر الثاني عشر من السنة.",
  motorcycle: "وسيلة نقل صغيرة بعجلتين ومحرك.",
  leg: "جزء من الجسم يُستخدم للمشي أو الوقوف ويمتد من أعلى الفخذ إلى القدم.",
  arm: "جزء من الجسم يمتد من الكتف إلى اليد ويُستخدم للحمل أو الإمساك.",
  foot: "الجزء السفلي من الجسم الذي يلامس الأرض عند الوقوف أو المشي.",
  head: "الجزء العلوي من الجسم الذي يحتوي على الوجه والدماغ.",
  car: "وسيلة نقل تسير على الطريق ولها عادة أربع عجلات.",
  train: "وسيلة نقل تسير على سكة حديد.",
  plane: "وسيلة نقل تطير في الجو.",
  group: "عدد من الأشخاص أو الأشياء معًا.",
  basic: "شيء بسيط وأساسي يُبنى عليه غيره.",
  difficult: "شيء يحتاج إلى جهد أو مهارة لفهمه أو إنجازه.",
  easy: "شيء لا يحتاج إلى جهد كبير.",
  fact: "معلومة صحيحة يمكن التحقق منها.",
  goal: "شيء يحاول الشخص الوصول إليه أو تحقيقه.",
  idea: "فكرة أو خطة موجودة في الذهن.",
  problem: "مسألة أو موقف يحتاج إلى حل.",
  solution: "ما يزيل المشكلة أو يجيب عن السؤال.",
  result: "ما يحدث بعد سبب أو فعل معيّن.",
  cause: "الأمر الذي يجعل شيئًا آخر يحدث.",
  reason: "التفسير الذي يوضح لماذا حدث الشيء أو لماذا فُعل.",
  choice: "أمر يتم اختياره من بين أكثر من احتمال.",
  chance: "إمكانية حدوث شيء أو فرصة لحدوثه.",
  available: "شيء جاهز ويمكن استخدامه أو الحصول عليه.",
  different: "ليس مطابقًا لشيء آخر.",
  example: "حالة أو شيء يوضح الفكرة العامة.",
  clean: "خالٍ من الأوساخ.",
  dirty: "ليس خاليًا من الأوساخ.",
  enough: "بالمقدار المطلوب دون نقص.",
  cheap: "سعره منخفض أو لا يحتاج إلى مال كثير.",
  expensive: "سعره عالٍ أو يحتاج إلى مال كثير.",
  famous: "معروف عند عدد كبير من الناس.",
  alone: "من دون وجود أشخاص آخرين.",
  crowded: "مكان أو موقف فيه عدد كبير مع مساحة قليلة.",
  early: "قبل الوقت المعتاد أو المتوقع.",
  quickly: "بطريقة سريعة وفي وقت قليل.",
  slowly: "بطريقة غير سريعة.",
  careful: "يفعل الشيء بانتباه لتجنب الخطأ أو الخطر.",
  cautious: "ينتبه لتجنب الخطر أو الخطأ.",
  safe: "بعيد عن الخطر أو الضرر.",
  dangerous: "يمكن أن يسبب ضررًا أو خطرًا.",
  natural: "موجود في الطبيعة وليس مصنوعًا بيد الإنسان.",
  artificial: "مصنوع بيد الإنسان وليس طبيعيًا.",
  modern: "مرتبط بالوقت الحاضر وليس بالماضي القديم.",
  ancient: "قديم جدًا ويرجع إلى زمن بعيد.",
  important: "له قيمة أو تأثير كبير.",
  necessary: "لا بد من وجوده أو فعله.",
  exact: "صحيح تمامًا من غير اختلاف.",
  accurate: "صحيح ومحدد بدرجة عالية.",
  correct: "خالٍ من الأخطاء.",
  wrong: "غير صحيح أو لا يطابق المطلوب.",
};

const DEF_HINTS_AR = {
  "how much of something there is.": "يشير إلى مقدار الشيء أو عدده.",
  "connected with atoms or nuclear energy.": "مرتبط بالذرات أو بالطاقة النووية.",
  "to damage something so badly that it no longer exists or works.": "أن تُلحق بالشيء ضررًا شديدًا حتى لا يعود موجودًا أو صالحًا للعمل.",
  "a possibility or opportunity for something to happen.": "إمكانية أو فرصة لحدوث شيء ما.",
  "to be present at an event, class, or meeting.": "أن تكون موجودًا في فعالية أو درس أو اجتماع.",
  "to grow, improve, or make something more advanced over time.": "أن ينمو الشيء أو يتحسن أو يصبح أكثر تقدمًا مع الوقت.",
  "something selected from two or more possibilities.": "شيء يتم اختياره من بين احتمالين أو أكثر.",
  "ready to be used, taken, or spoken to.": "شيء جاهز للاستخدام أو الأخذ أو التواصل معه.",
  "not the same as another thing or person.": "ليس مثل شيء أو شخص آخر.",
  "one item or case that shows what a group or idea is like.": "حالة أو شيء واحد يوضح طبيعة مجموعة أو فكرة.",
  "simple and necessary; forming the starting point.": "بسيط وضروري ويمثل نقطة البداية.",
  "not easy; needing effort or skill.": "ليس سهلًا ويحتاج إلى جهد أو مهارة.",
  "something that is true and can be checked.": "معلومة صحيحة يمكن التحقق منها.",
  "to take something for a time and return it later.": "أن تأخذ شيئًا لفترة ثم تعيده لاحقًا.",
  "not clean.": "غير خالٍ من الأوساخ.",
  "lack of success in doing something.": "عدم النجاح في فعل شيء ما.",
  "a system or table showing days, weeks, and months.": "نظام أو جدول يعرض الأيام والأسابيع والأشهر.",
  "to have a different opinion.": "أن يكون لديك رأي مختلف عن غيرك.",
  "something you are trying to achieve.": "شيء تحاول الوصول إليه أو تحقيقه.",
  "with attention, avoiding mistakes or danger.": "بطريقة فيها انتباه لتجنب الخطأ أو الخطر.",
  "not interesting, exciting, or bright.": "شيء غير مشوق أو غير لامع أو لا يثير الاهتمام.",
  "a thought, plan, or suggestion in your mind.": "فكرة أو خطة أو اقتراح في الذهن.",
  "causing very great damage or suffering.": "يسبب ضررًا أو معاناة شديدة جدًا.",
  "throughout or at some point in a period of time.": "داخل مدة زمنية أو في نقطة منها.",
  "a position, height, or amount on a scale.": "موضع أو ارتفاع أو مقدار على مقياس.",
  "to stop and hold something that is moving.": "أن توقف شيئًا يتحرك وتمسكه.",
  "before the expected or usual time.": "قبل الوقت المعتاد أو المتوقع.",
  "what someone thinks or believes about something.": "ما يعتقده الشخص أو يراه تجاه شيء ما.",
  "the reason something happens.": "الأمر الذي يجعل شيئًا يحدث.",
  "without difficulty.": "من غير صعوبة.",
  "one piece or section of a whole thing.": "قطعة أو قسم من شيء كامل.",
  "careful to avoid danger or mistakes.": "ينتبه لتجنب الخطر أو الأخطاء.",
  "not difficult.": "غير صعب.",
  "an arrangement for what you will do.": "ترتيب لما ستفعله لاحقًا.",
  "costing little money.": "لا يحتاج إلى مال كثير.",
  "a result or change caused by something.": "تغيير أو نتيجة تحدث بسبب شيء آخر.",
  "a situation or question that needs to be solved.": "موقف أو سؤال يحتاج إلى حل.",
  "to look at something to make sure it is correct or safe.": "أن تنظر في شيء للتأكد من صحته أو سلامته.",
  "producing the result that was wanted.": "يعطي النتيجة المطلوبة.",
  "the reason why something is done or made.": "السبب الذي من أجله يُفعل الشيء أو يُصنع.",
  "to decide which one you want.": "أن تقرر أي خيار تريد.",
  "having nothing inside.": "لا يوجد داخله أي شيء.",
  "an amount or number of something.": "مقدار أو عدد من شيء ما.",
  "free from dirt.": "خالٍ من الأوساخ.",
  "as much or as many as needed.": "بالمقدار أو العدد المطلوب دون نقص.",
  "why something happens or why someone does something.": "تفسير سبب حدوث شيء أو قيام شخص بفعل ما.",
  "in a way that is easy to see or understand.": "بطريقة يسهل رؤيتها أو فهمها.",
  "a mistake.": "شيء غير صحيح يحدث بسبب خطأ.",
  "what happens because of something else.": "ما يحدث بسبب شيء آخر.",
  "to go upward using your hands, feet, or effort.": "أن تصعد للأعلى باستخدام اليدين أو القدمين أو الجهد.",
  "something that happens, especially an organized activity.": "شيء يحدث، وغالبًا يكون نشاطًا منظمًا.",
  "the answer to a problem.": "ما يجيب عن المشكلة أو يزيلها.",
  "the quality that makes something look red, blue, green, etc.": "الصفة التي تجعل الشيء يبدو أحمر أو أزرق أو أخضر ونحو ذلك.",
  "completely correct, with no difference.": "صحيح تمامًا من غير اختلاف.",
  "achieving what you wanted.": "الوصول إلى ما كنت تريد تحقيقه.",
  "having many bright colors.": "له ألوان كثيرة وواضحة.",
  "to give one thing and receive another.": "أن تعطي شيئًا وتأخذ شيئًا آخر بدلًا منه.",
  "complete; all of something.": "كل الشيء من غير نقص.",
  "an event where people try to win against others.": "فعالية يحاول فيها أشخاص الفوز على غيرهم.",
  "making you feel interested and eager.": "يجعلك مهتمًا ومتحمسًا.",
  "the ability or right to enter, use, or reach something.": "القدرة أو الحق في الدخول إلى شيء أو استخدامه أو الوصول إليه.",
  "to say that you are unhappy about something.": "أن تقول إنك غير راضٍ عن شيء ما.",
  "physical activity or a task for practice.": "نشاط بدني أو مهمة للتدريب.",
  "to go somewhere with someone.": "أن تذهب إلى مكان مع شخص آخر.",
  "made of many connected parts; not simple.": "يتكون من أجزاء كثيرة مترابطة وليس بسيطًا.",
  "to think something will happen.": "أن تظن أن شيئًا سيحدث.",
  "correct and exact.": "صحيح ومحدد.",
  "a large formal meeting for discussion.": "اجتماع رسمي كبير للنقاش.",
  "costing a lot of money.": "يحتاج إلى مال كثير.",
  "in a correct and exact way.": "بطريقة صحيحة ودقيقة.",
  "to say or show that something is true.": "أن تقول أو تُظهر أن شيئًا صحيح.",
  "a test done to learn or prove something.": "اختبار يُجرى لمعرفة شيء أو إثباته.",
  "to succeed in reaching a goal.": "أن تنجح في الوصول إلى هدف.",
  "hard to understand.": "يصعب فهمه.",
  "to make something clear or easy to understand.": "أن تجعل الشيء واضحًا أو سهل الفهم.",
  "at a high or developed level.": "في مستوى عالٍ أو متطور.",
  "the tenth month of the year, between september and november.": "الشهر العاشر من السنة، يأتي بعد سبتمبر وقبل نوفمبر.",
  "a short coat worn over other clothes, especially in cool weather.": "قطعة ملابس خارجية قصيرة تُلبس فوق الملابس، خصوصًا في الجو البارد.",
  "having no empty space left; holding as much as possible.": "حالة الشيء عندما لا يبقى فيه فراغ أو مساحة إضافية.",
  "a device that warns people when there is fire.": "جهاز يصدر تنبيهًا عند وجود حريق.",
  "a journey by air.": "رحلة تتم عن طريق الجو.",
  "a level of quality used for comparison.": "مستوى جودة يُستخدم للمقارنة.",
  "a living thing that grows in soil, such as a flower or tree.": "كائن حي ينمو في التربة مثل الزهرة أو الشجرة.",
  "a machine that produces electricity.": "آلة تنتج الكهرباء.",
  "a move to a higher job or an effort to advertise something.": "انتقال إلى منصب أعلى أو جهد للترويج لشيء ما.",
  "a number of people or things together.": "عدد من الأشخاص أو الأشياء موجودة معًا.",
  "a part of an organization with a special job.": "جزء من منظمة له مهمة محددة.",
  "a path for vehicles to travel on.": "مسار تسير عليه المركبات.",
  "a period in a process, or a raised area for performance.": "مرحلة ضمن عملية أو منصة مرتفعة للعرض.",
  "a person or thing that shows the way or gives instructions.": "شخص أو شيء يوضح الطريق أو يعطي تعليمات.",
  "a person who guides or is in charge of others.": "شخص يوجه الآخرين أو يكون مسؤولًا عنهم.",
  "a person whose job is to rescue swimmers.": "شخص عمله إنقاذ السباحين عند الخطر.",
  "a planned piece of work.": "عمل مخطط له لتحقيق نتيجة معينة.",
  "a series of actions or steps.": "سلسلة من الأفعال أو الخطوات المتتابعة.",
  "a set of names or items written one after another.": "مجموعة أسماء أو عناصر مكتوبة بالترتيب.",
  "a small piece of information attached to something.": "معلومة قصيرة مرفقة بشيء ما.",
  "able to be believed.": "يمكن تصديقه أو الوثوق به.",
  "able to cause harm.": "يمكن أن يسبب ضررًا.",
  "able to happen or be done.": "يمكن حدوثه أو إنجازه.",
  "after the expected time.": "بعد الوقت المتوقع أو المعتاد.",
  "an answer or reaction.": "رد أو تفاعل مع شيء قيل أو حدث.",
  "an extra part added to something.": "جزء إضافي يضاف إلى شيء آخر.",
  "an important task or purpose.": "مهمة أو هدف مهم يجب إنجازه.",
  "because something might happen.": "بسبب احتمال حدوث شيء ما.",
  "big in size or amount.": "كبير في الحجم أو المقدار.",
  "by way of; through.": "عن طريق شيء أو من خلاله.",
  "causing admiration.": "يجعل الشخص يشعر بالإعجاب.",
  "chosen without a clear plan or pattern.": "يتم اختياره دون خطة أو نمط واضح.",
  "clear and exact; not general.": "واضح ومحدد وليس عامًا.",
  "colored bands seen in the sky after rain and sunlight.": "أشرطة ألوان تظهر في السماء بعد المطر مع ضوء الشمس.",
  "completely different or facing the other way.": "مختلف تمامًا أو متجه إلى الجهة الأخرى.",
  "connected with the present time, not the old past.": "مرتبط بالوقت الحاضر وليس بالماضي البعيد.",
  "connected with the sea.": "مرتبط بالبحر أو بما يحدث فيه.",
  "done by hand, or a book of instructions.": "يتم باليد، أو كتاب يحتوي على تعليمات.",
  "easy to understand or do.": "سهل الفهم أو التنفيذ.",
  "every time; at all times.": "في كل مرة أو في جميع الأوقات.",
  "existing in nature; not made by people.": "موجود في الطبيعة وليس مصنوعًا بواسطة البشر.",
  "expected to happen.": "من المتوقع أن يحدث.",
  "extremely cold.": "بارد بدرجة شديدة جدًا.",
  "fast; taking little time.": "سريع ولا يستغرق وقتًا طويلًا.",
  "for one person or group only; not public.": "خاص بشخص أو مجموعة وليس متاحًا للجميع.",
  "full of people or things, with little space.": "ممتلئ بالأشخاص أو الأشياء مع مساحة قليلة.",
  "happening once every year.": "يحدث مرة واحدة كل سنة.",
  "happy or satisfied.": "يشعر بالفرح أو الرضا.",
  "having a lot of money or resources.": "يمتلك مالًا أو موارد كثيرة.",
  "having a lot of weight.": "له وزن كبير.",
  "having a thin edge or point that can cut.": "له طرف أو حافة رفيعة يمكنها القطع.",
  "having great value or effect.": "له قيمة كبيرة أو تأثير واضح.",
  "having little money, or low in quality.": "لديه مال قليل أو جودة منخفضة.",
  "having lived or existed for a long time.": "عاش أو وُجد لمدة طويلة.",
  "having too much flesh on the body; or a natural oily substance in food.": "له زيادة في لحم الجسم، أو يشير إلى مادة زيتية طبيعية في الطعام.",
  "helpful and caring; or a type of something.": "يدل على اللطف والاهتمام أو على نوع من شيء ما.",
  "how good or bad something is.": "درجة جودة الشيء أو سوءه.",
  "how well someone or something does a task.": "مدى جودة أداء شخص أو شيء لمهمة معينة.",
  "important or large enough to matter.": "مهم أو كبير بدرجة تجعله ذا قيمة.",
  "in a fast way.": "بطريقة سريعة.",
  "in a happy way.": "بطريقة يظهر فيها الفرح.",
  "known by many people.": "معروف لدى عدد كبير من الناس.",
  "less than half of a group.": "أقل من نصف المجموعة.",
  "liked by many people.": "يحبه عدد كبير من الناس.",
  "liked more than others.": "مفضل أكثر من غيره.",
  "made by people, not natural.": "مصنوع بواسطة البشر وليس طبيعيًا.",
  "many times.": "مرات كثيرة.",
  "money management, especially for business or government.": "إدارة المال، خاصة في الأعمال أو الجهات الحكومية.",
  "more than half of a group.": "أكثر من نصف المجموعة.",
  "movement toward improvement or a goal.": "تحرك باتجاه التحسن أو الوصول إلى هدف.",
  "needed; must be done or present.": "ضروري ويجب وجوده أو فعله.",
  "newspapers, tv, websites, and other ways of sharing information.": "وسائل تنقل المعلومات مثل الصحف والتلفاز والمواقع.",
  "not able to happen or be done.": "لا يمكن حدوثه أو تنفيذه.",
  "not at any time.": "لا يحدث في أي وقت.",
  "not confident or not safe.": "لا يشعر بالثقة أو الأمان.",
  "not different.": "غير مختلف عن شيء آخر.",
  "not fast.": "ليس سريعًا.",
  "not fresh.": "ليس جديدًا أو ليس بحالة طازجة.",
  "not heavy, or brightness that lets you see.": "خفيف الوزن، أو ضوء يسمح بالرؤية.",
  "not in danger.": "بعيد عن الخطر.",
  "not large.": "ليس كبيرًا في الحجم.",
  "not often.": "لا يحدث كثيرًا.",
  "not old; recently made or found.": "ليس قديمًا؛ تم صنعه أو اكتشافه مؤخرًا.",
  "not quickly.": "بطريقة غير سريعة.",
  "not specific; affecting most people or things.": "عام وغير محدد، وينطبق على معظم الأشخاص أو الأشياء.",
  "not wide.": "ليس واسعًا.",
  "official permission to do or use something.": "إذن رسمي لفعل شيء أو استخدامه.",
  "often.": "يحدث كثيرًا أو بشكل متكرر.",
  "on some occasions but not always.": "يحدث في بعض الأوقات وليس دائمًا.",
  "one part of something.": "جزء واحد من شيء أكبر.",
  "ordinary and not exciting.": "عادي ولا يثير الحماس.",
  "people born and living around the same time.": "أشخاص وُلدوا ويعيشون في الفترة نفسها تقريبًا.",
  "possibly; perhaps.": "يدل على الاحتمال وليس التأكيد.",
  "responsibility for a mistake, or a defect in something.": "مسؤولية عن خطأ، أو عيب في شيء ما.",
  "right; without mistakes.": "صحيح وخالٍ من الأخطاء.",
  "safe and protected.": "آمن ومحمي من الخطر.",
  "small or not very important.": "صغير أو ليس ذا أهمية كبيرة.",
  "something that helps you or gives you a better chance.": "شيء يساعدك أو يمنحك فرصة أفضل.",
  "strength or power used to move or affect something.": "قوة تُستخدم لتحريك شيء أو التأثير فيه.",
  "suitable for a particular purpose or situation.": "مناسب لغرض أو موقف معين.",
  "telling the truth and not cheating.": "يقول الحقيقة ولا يخدع الآخرين.",
  "the act of keeping things apart.": "فعل إبقاء الأشياء منفصلة عن بعضها.",
  "the act of setting up equipment or software.": "عملية تجهيز جهاز أو برنامج ليعمل.",
  "the greatest amount allowed or possible.": "أكبر مقدار مسموح أو ممكن.",
  "the greatest amount possible.": "أكبر مقدار يمكن الوصول إليه.",
  "the money needed to buy or do something.": "المال المطلوب لشراء شيء أو القيام به.",
  "the place someone is going to.": "المكان الذي يتجه إليه الشخص.",
  "the smallest amount possible or allowed.": "أصغر مقدار ممكن أو مسموح.",
  "the study of places, land, and the earth.": "دراسة الأماكن والأراضي وكوكب الأرض.",
  "the study or record of past events.": "دراسة أو تسجيل أحداث الماضي.",
  "the surface you walk on inside a building, or a level of a building.": "سطح تمشي عليه داخل مبنى أو مستوى من المبنى.",
  "to become aware of something.": "أن تلاحظ شيئًا أو تصبح مدركًا له.",
  "to become ice or extremely cold.": "أن يتحول إلى جليد أو يصبح شديد البرودة.",
  "to become or make something better.": "أن يتحسن الشيء أو تجعله أفضل.",
  "to become part of a group or activity.": "أن تصبح جزءًا من مجموعة أو نشاط.",
  "to bring goods from another country.": "أن تجلب بضائع من بلد آخر.",
  "to choose.": "أن تختار بين أكثر من احتمال.",
  "to come together with someone.": "أن تلتقي بشخص أو تجتمع معه.",
  "to divide or open something with a sharp tool.": "أن تقسم أو تفتح شيئًا بأداة حادة.",
  "to do an action, job, or show.": "أن تنفذ فعلًا أو مهمة أو عرضًا.",
  "to employ someone or rent something for a time.": "أن توظف شخصًا أو تستأجر شيئًا لمدة محددة.",
  "to feel pleased and excited about something that will happen.": "أن تشعر بالفرح والحماس لشيء سيحدث.",
  "to find an answer to a difficulty.": "أن تجد حلًا لصعوبة أو مشكلة.",
  "to fix something damaged.": "أن تصلح شيئًا متضررًا.",
  "to give money for something.": "أن تدفع مالًا مقابل شيء.",
  "to give something for a time and expect it back.": "أن تعطي شيئًا مؤقتًا وتتوقع استرجاعه.",
  "to give work or a form to someone officially.": "أن تسلم عملًا أو نموذجًا بشكل رسمي.",
  "to go after someone or obey instructions.": "أن تسير خلف شخص أو تلتزم بالتعليمات.",
  "to go or come back.": "أن تعود إلى المكان أو الحالة السابقة.",
  "to have and not lose, or continue doing something.": "أن تحتفظ بشيء أو تستمر في فعل شيء.",
  "to have something as part of a whole.": "أن يحتوي الشيء على جزء ضمن الكل.",
  "to have the same opinion or accept something.": "أن توافق على رأي أو تقبل شيئًا.",
  "to help.": "أن تقدم مساعدة لشخص أو لشيء.",
  "to hit something suddenly and violently.": "أن تصدم شيئًا فجأة وبقوة.",
  "to keep doing something.": "أن تستمر في فعل شيء دون توقف.",
  "to keep someone or something safe.": "أن تحمي شخصًا أو شيئًا من الخطر.",
  "to keep something in your mind.": "أن تحفظ شيئًا في ذهنك.",
  "to let someone do something.": "أن تسمح لشخص بفعل شيء.",
  "to make someone remember something.": "أن تجعل شخصًا يتذكر شيئًا.",
  "to make something happen later.": "أن تؤخر حدوث شيء إلى وقت لاحق.",
  "to move nearer to something or a way of doing something.": "أن تقترب من شيء أو تتعامل معه بطريقة معينة.",
  "to need or rely on someone or something.": "أن تحتاج إلى شخص أو شيء وتعتمد عليه.",
  "to need to pay or give something back.": "أن تكون مطالبًا بدفع شيء أو إعادته.",
  "to not remember.": "ألا تستطيع تذكر شيء.",
  "to not succeed.": "ألا تنجح في فعل شيء.",
  "to put equipment or software in place so it can be used.": "أن تجهز جهازًا أو برنامجًا ليصبح قابلًا للاستخدام.",
  "to put something over or on top of something else.": "أن تضع شيئًا فوق شيء آخر أو تغطيه.",
  "to reach a place.": "أن تصل إلى مكان معين.",
  "to recognize who or what something is.": "أن تعرف هوية شخص أو شيء.",
  "to refuse to accept something.": "أن ترفض قبول شيء ما.",
  "to request formally or put something into use.": "أن تطلب شيئًا رسميًا أو تبدأ استخدامه.",
  "to return something to its proper place.": "أن تعيد شيئًا إلى مكانه الصحيح.",
  "to rise from bed or from sitting.": "أن تنهض من السرير أو من وضع الجلوس.",
  "to save someone from danger.": "أن تنقذ شخصًا من الخطر.",
  "to say that something is good or useful.": "أن تذكر أن شيئًا جيد أو مفيد.",
  "to send goods to another country for sale.": "أن ترسل بضائع إلى بلد آخر للبيع.",
  "to take something away.": "أن تزيل شيئًا أو تأخذه بعيدًا.",
  "to tell people something publicly.": "أن تخبر الناس بشيء بشكل علني.",
  "to use up, eat, or drink something.": "أن تستهلك شيئًا أو تأكله أو تشربه.",
  "to waste money, time, or chances.": "أن تضيع مالًا أو وقتًا أو فرصًا.",
  "untidy; not neat.": "غير مرتب أو غير منظم.",
  "unwanted or loud sound.": "صوت مزعج أو غير مرغوب فيه.",
  "usual, normal, or happening repeatedly.": "معتاد أو طبيعي أو يحدث بشكل متكرر.",
  "very likely.": "من المرجح جدًا أن يحدث.",
  "very old; from a long time ago.": "قديم جدًا ومن زمن بعيد.",
  "wanting to know or learn more about something.": "لديه رغبة في معرفة المزيد أو التعلم.",
  "where something comes from.": "المكان أو السبب الذي يأتي منه الشيء.",
  "without other people.": "من دون وجود أشخاص آخرين.",
};

const GLOSS_AR = {
  "fruit drink": "مشروب مصنوع من الفاكهة",
  "grain food": "طعام حَبّي مثل ما يؤكل مع الوجبات",
  "late breakfast": "وجبة تأتي بين وقت الفطور والغداء",
  "cook in water": "تحضير الطعام داخل الماء الساخن",
  "cook with vapor": "تحضير الطعام بالبخار",
  "plant eater": "شخص يعتمد على الطعام النباتي ولا يأكل اللحم",
  "sixth month": "الشهر السادس في السنة",
  "seventh month": "الشهر السابع في السنة",
  "eighth month": "الشهر الثامن في السنة",
  "ninth month": "الشهر التاسع في السنة",
  "eleventh month": "الشهر الحادي عشر في السنة",
  "twelfth month": "الشهر الثاني عشر في السنة",
  "first month": "الشهر الأول في السنة",
  "second month": "الشهر الثاني في السنة",
  "third month": "الشهر الثالث في السنة",
  "fourth month": "الشهر الرابع في السنة",
  "fifth month": "الشهر الخامس في السنة",
  "seven days": "مدة تتكون من سبعة أيام",
  "twelve months": "مدة تتكون من اثني عشر شهرًا",
  "ten years": "مدة تتكون من عشر سنوات",
  "hundred years": "مدة تتكون من مئة سنة",
  "weekend day": "يوم يقع في نهاية الأسبوع",
  "first weekday": "أول يوم في أسبوع العمل أو الدراسة",
  "second weekday": "ثاني يوم في أسبوع العمل أو الدراسة",
  "midweek day": "يوم يقع في منتصف الأسبوع",
  "fifth weekday": "اليوم الخامس من أيام الأسبوع",
  "sixth weekday": "اليوم السادس من أيام الأسبوع",
  "seventh day": "اليوم السابع من الأسبوع",
  "world": "جرم كبير نعيش عليه ويدور في الفضاء",
  "limb": "جزء من الجسم يُستخدم للحركة مثل المشي أو الاتكاء أو حمل الأشياء.",
  "tremor": "اهتزاز مفاجئ في الأرض",
  "material": "خامة أو شيء تُصنع منه الأشياء",
  "sight": "ما تراه العين أو القدرة على الرؤية",
  "drop by": "الذهاب إلى شخص أو مكان لفترة قصيرة",
  "book reading": "نشاط فهم الكلمات في كتاب أو نص",
  "unhappy": "شعور بالحزن أو عدم الفرح",
  "shock": "حدث غير متوقع يسبب الدهشة",
  "stroll": "المشي بهدوء أو لفترة قصيرة",
  "setup": "طريقة ترتيب أجزاء تعمل معًا",
  "throw away": "التخلص من شيء بدل استخدامه",
  "vocal music": "إصدار كلمات أو ألحان بالصوت",
  "chore": "مهمة صغيرة يجب إنجازها",
  "riches": "امتلاك مال أو موارد كثيرة",
  "athletic activity": "نشاط بدني أو رياضي",
  "exam": "اختبار يقيس المعرفة أو المهارة",
  "metal joining": "وصل أجزاء معدنية معًا بالحرارة أو الأدوات",
  "powerful": "يمتلك قوة كبيرة",
  "danger": "احتمال حدوث ضرر",
  "circular part": "جزء دائري يساعد على الحركة",
  "water exercise": "نشاط بدني يُمارس في الماء",
  "menace": "إظهار نية لإيذاء أو تخويف شخص",
  "broad": "له مساحة أو عرض كبير",
  "exhausted": "يشعر بتعب شديد",
  "travel industry": "مجال مرتبط بالسفر وزيارة الأماكن",
  "incorrect": "لا يطابق الصواب",
  "unattractive": "لا يبدو جميلًا أو مريحًا للنظر",
  "visitor": "شخص يذهب إلى مكان لفترة مؤقتة",
  "youthful": "مرتبط بصغر السن",
  "feeble": "قليل القوة",
  "classic": "مرتبط بالعادات أو الأساليب القديمة المعروفة",
  "furious": "غاضب جدًا",
  "anxious": "يشعر بالقلق والتوتر",
  "convert": "تغيير الشيء إلى شكل أو حالة أخرى",
  "lovely": "جميل أو مُبهج للنظر",
  "country-wide": "يتعلق بالبلد كله",
  "render": "نقل الكلام من لغة إلى أخرى",
  "uninterested": "لا يشعر بالاهتمام",
  "global": "مرتبط بالعالم كله",
  "courageous": "لا يخاف بسهولة عند مواجهة الخطر",
  "self-assured": "يشعر بالثقة في نفسه",
  "handle": "يتعامل مع موقف أو شخص بطريقة معينة",
  "prepare food": "يصنع الطعام أو يجهزه للأكل",
  "lawbreaker": "شخص يخالف القانون",
  "lorry": "مركبة كبيرة لنقل الأشياء",
  "thrilled": "متحمس جدًا وسعيد بما سيحدث",
  "mishap": "حادث غير مقصود يسبب مشكلة",
  "attempt": "يبذل جهدًا لفعل شيء",
  "warm": "ودود ولطيف في التعامل",
  "heritage": "عادات ومعارف تنتقل بين الناس عبر الزمن",
  "usual": "يحدث غالبًا أو بشكل طبيعي",
  "amusing": "يجعل الناس يضحكون أو يستمتعون",
  "pass away": "يتوقف عن الحياة",
  "one-of-a-kind": "لا يوجد مثله تمامًا",
  "match": "نشاط أو لعبة يتنافس فيها أشخاص أو فرق",
  "worldwide": "في أنحاء العالم",
  "helpful": "يفيد أو يساعد على إنجاز شيء",
  "cheerful": "يشعر بالسعادة أو يظهرها",
  "reside": "يسكن أو يقيم في مكان",
  "worthless": "لا فائدة منه أو لا قيمة له",
  "pastime": "نشاط يُفعل في وقت الفراغ",
  "nearby": "قريب من المكان",
  "normally": "في العادة أو غالبًا",
  "idle": "لا يحب العمل أو يبذل جهدًا قليلًا",
  "open": "متاح للناس أو غير خاص",
  "holiday": "فترة راحة أو سفر بعيدًا عن العمل أو الدراسة",
  "film": "قصة مصورة تُعرض للمشاهدة",
  "inhabitant": "شخص يعيش في مكان معين",
  "range": "مجموعة من أنواع أو خيارات مختلفة",
  "tune": "أصوات أو ألحان تُسمع بانتظام",
  "community": "مجموعة أشخاص يعيشون أو يعملون معًا",
  "edition": "نسخة من شيء منشور أو مطوّر",
  "jittery": "يشعر بتوتر أو اضطراب",
  "breach": "كسر قاعدة أو عدم الالتزام بها",
  "mom and dad": "الأم والأب معًا",
  "young male": "طفل أو شاب ذكر",
  "young female": "طفلة أو شابة أنثى",
  "family member": "شخص من العائلة",
  "kids": "صغار السن من البشر",
  "young one": "إنسان صغير السن",
  "morning meal": "وجبة تؤكل في بداية اليوم",
  "midday meal": "وجبة تؤكل في منتصف اليوم",
  "evening meal": "وجبة تؤكل في المساء",
  "sweetener": "شيء يجعل الطعام أو الشراب أحلى",
  "cook in oil": "تحضير الطعام في الزيت الساخن",
  "tasty": "طعمه جيد وممتع",
  "veggies": "أطعمة نباتية تؤكل مع الوجبات",
  "seasoning": "شيء يضاف للطعام لتعديل الطعم",
  "short time": "مدة قصيرة جدًا",
  "sixty minutes": "مدة تساوي ستين دقيقة",
  "24-hour period": "مدة يوم كامل",
};

function simpleGlossArabic(gloss = "") {
  const g = String(gloss || "").trim().toLowerCase();
  if (GLOSS_AR[g]) return GLOSS_AR[g];
  if (/art|canvas|painting|gallery/.test(g)) return "نشاط أو عمل بصري تُستخدم فيه الألوان لصنع صورة.";
  if (/photo|picture|camera/.test(g)) return "التقاط الصور للأشخاص أو الأشياء أو الأماكن.";
  if (/summary|recap/.test(g)) return "عرض قصير لأهم النقاط دون التفاصيل الطويلة.";
  if (/job|profession|occupation|calling|workplace|office/.test(g)) return "عمل أو مجال يمارسه الشخص لكسب الرزق أو أداء مهمة.";
  if (/law|statute|rule|regulation|offence|crime/.test(g)) return "أمر مرتبط بالقواعد أو القوانين أو مخالفتها.";
  if (/therapy|treatment|remedy|doctor|clinic|medical|ill|pain|organ|body|tooth|breath|heart|blood|health|sick|fever|flu|head|hand|finger|leg|limb|stomach|lung|throat|mouth|ear|nose|eye|back/.test(g)) return "معنى مرتبط بجسم الإنسان أو الصحة أو العلاج.";
  if (/dance|music|vocal|tune|film|movie|theater/.test(g)) return "نشاط أو شيء مرتبط بالفن أو الترفيه.";
  if (/father|mother|mom|dad|brother|sister|child|son|daughter|spouse|husband|wife|aunt|uncle|cousin|grand/.test(g)) return "شخص تربطك به علاقة عائلية محددة.";
  if (/married|wedded|divorced|separated/.test(g)) return "حالة اجتماعية مرتبطة بالزواج أو الانفصال.";
  if (/kitchen|bedroom|bathroom|lounge|entrance|window|mirror|house|furniture|home/.test(g)) return "شيء أو مكان داخل البيت يُستخدم في الحياة اليومية.";
  if (/shirt|pants|shoes|sneakers|coat|jacket|cap|hat|watch|ring|bag|belt|wear|glasses|gown|umbrella|wallet|luggage/.test(g)) return "شيء يُلبس أو يُحمل مع الشخص.";
  if (/meal|food|drink|cook|bread|rice|milk|coffee|tea|soup|meat|chicken|fruit|vegetable|spice|salad|pasta|cake|hungry|sweet|sip/.test(g)) return "معنى مرتبط بالطعام أو الشراب أو طريقة تحضيره.";
  if (/minute|hour|day|yesterday|tomorrow|month|year|past|future|morning|evening|night|period|time/.test(g)) return "وقت أو مدة زمنية محددة.";
  if (/school|class|lesson|teacher|student|exam|course|homework|university|college|diploma|math|science|topic|graduation/.test(g)) return "معنى مرتبط بالدراسة أو التعليم أو الاختبارات.";
  if (/car|road|travel|flight|airport|journey|bike|plane|train|hotel|booking|trip|bridge|highway|beach|shore|stadium|park|city|country|street|location/.test(g)) return "معنى مرتبط بالمكان أو التنقل أو السفر.";
  if (/shop|store|price|money|card|cash|bill|discount|customer|invoice|tax|payment|currency|cart|valuable|bank/.test(g)) return "معنى مرتبط بالشراء أو الدفع أو المال.";
  if (/computer|phone|mobile|app|web|online|email|password|download|keyboard|screen|program|data|file|internet|media|chat|message|reply/.test(g)) return "معنى مرتبط بالتقنية أو التواصل الرقمي.";
  if (/earth|world|tree|sea|river|lake|mountain|weather|nature|moon|sun|star|planet|forest|island|water|desert|metal|wood|gold|silver|iron|climate|pollution|sky|flower/.test(g)) return "شيء من الطبيعة أو البيئة أو المواد من حولنا.";
  if (/tool|equipment|hammer|blade|cable|lab|factory|technician|repair|machine|electric/.test(g)) return "شيء أو مجال مرتبط بالأدوات أو العمل الفني أو الإصلاح.";
  if (/successful|prosperous/.test(g)) return "حالة تدل على تحقيق نتيجة جيدة أو تقدم واضح.";
  if (/serious|grave/.test(g)) return "صفة تدل على أهمية الموقف وعدم كونه مزاحًا.";
  if (/send|transmit/.test(g)) return "إرسال شيء أو نقله من مكان إلى آخر.";
  if (/translate|render/.test(g)) return "نقل الكلام أو النص من لغة إلى لغة أخرى.";
  return "صفة أو فكرة محددة يساعدك السياق على تمييزها من بين الخيارات.";
}

function arabicDictionaryClue(q, rawHint) {
  const correctVisible = q.options?.find((x) => x.label === q.correctAnswer)?.text;
  const candidateWord = q.vocabMode === "WT"
    ? q.word
    : (q.correctAnswerValue || q.highlightedWord || correctVisible || q.word || q.questionText);
  const wordKey = String(candidateWord || "").trim().toLowerCase();
  if (WORD_HINTS_AR[wordKey]) return WORD_HINTS_AR[wordKey];
  const stripped = String(rawHint || "")
    .replace(/^\s*(English\s+clue|تلميح|hint)\s*[:：]?\s*/iu, "")
    .trim();
  const defKey = stripped.toLowerCase();
  if (DEF_HINTS_AR[defKey]) return DEF_HINTS_AR[defKey];
  const m = stripped.match(/idea shown by [“"]([^”"]+)[”"](?:.*context:\s*[“"]([^”"]+)[”"])?/i);
  if (m) return simpleGlossArabic(m[1]);
  if (/^the \w+ month of the year/i.test(stripped)) return "يشير إلى ترتيب شهر معيّن داخل السنة.";
  if (/no empty space|holding as much/i.test(stripped)) return "لا يبقى فيه فراغ أو مساحة إضافية.";
  if (/coat worn over/i.test(stripped)) return "قطعة ملابس خارجية تُلبس فوق الملابس في الجو البارد.";
  if (/people|person/.test(stripped)) return "يرتبط بالبشر أو بمجموعة منهم حسب السياق.";
  if (/atoms|nuclear/.test(stripped)) return "مرتبط بالذرات أو بالطاقة النووية.";
  if (/not easy|hard/.test(stripped)) return "يحتاج إلى جهد أو مهارة ولا يكون سهلًا.";
  if (/not clean/.test(stripped)) return "غير خالٍ من الأوساخ.";
  if (/without difficulty/.test(stripped)) return "يحدث من غير صعوبة.";
  if (/money|cost|price/.test(stripped)) return "مرتبط بالمبلغ أو القيمة المالية.";
  if (/safe|danger|harm/.test(stripped)) return "مرتبط بالسلامة أو احتمال الضرر.";
  if (/time|period|year|month|day/.test(stripped)) return "مرتبط بالزمن أو مدة زمنية محددة.";
  if (/place|enter|reach|go|move/.test(stripped)) return "مرتبط بالمكان أو الحركة من مكان إلى آخر.";
  return "صفة أو فكرة محددة يساعدك السياق على تمييزها من بين الخيارات.";
}

function makeSafeHint(q) {
  if (q.kind !== "vocab") return "";
  const directHint = String(q.hintTextAr || "")
    .replace(/^\s*(تلميح|hint)\s*[:：]?\s*/iu, "")
    .trim();
  const correct = q.options?.find((x) => x.label === q.correctAnswer);
  const forbidden = [
    correct?.text,
    correct?.ar,
    q.correctAnswerValue,
  ].filter(Boolean).map((x) => String(x).trim()).filter((x) => x.length > 1);

  const isBad = /ابحث\s+عن|المعنى\s+العربي|معنى\s+الكلمة|اختر\s+الكلمة|تحمل\s+معنى|قريبة\s+في\s+المعنى|مرتبط\s+بـ|فكّ?ر|يطابق\s+هذا\s+الوصف|داخل\s+الجملة|دون\s+الاعتماد|ترجمة\s+حرفية/u.test(directHint);
  const leaksAnswer = (hint) => forbidden.some((answer) => String(hint || "").toLocaleLowerCase().includes(answer.toLocaleLowerCase()));
  const hasArabicChars = /[\u0600-\u06FF]/.test(directHint);

  let hint = "";
  if (directHint && hasArabicChars && !isBad && !leaksAnswer(directHint)) hint = directHint;
  else hint = arabicDictionaryClue(q, directHint);

  // Never show the exact correct visible option inside the hint.
  forbidden.forEach((answer) => {
    if (!answer) return;
    const re = new RegExp(answer.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "giu");
    hint = hint.replace(re, "هذا المعنى");
  });
  return hint.trim();
}

function ThirdChoiceTiles({ q, labels, revealed, onPick, optState }) {
  const cropSrc = (label) => `/assets/questions/third_section/crops/${q.id}_${label}.webp`;
  return (
    <div className="third-choice-tiles" dir="ltr">
      <div className="third-prompt" dir="rtl">اختر الشكل غير المتناسق مع بقية الأشكال.</div>
      <div className="third-tile-grid" aria-label="صور الخيارات A إلى I">
        {labels.map((label) => (
          <div key={label} className="third-option-preview" aria-label={`صورة الخيار ${label}`}>
            <span className="third-option-prefix" aria-hidden="true">{label}.</span>
            <div className="third-tile">
              <img className="third-crop-img" src={cropSrc(label)} alt={`الخيار ${label}`} loading="eager" draggable="false" />
            </div>
          </div>
        ))}
      </div>
      <div className="third-answer-grid" aria-label="اختر الإجابة">
        {labels.map((label, i) => (
          <button
            key={label}
            type="button"
            aria-label={`اختر ${label}`}
            className={`third-answer-btn ${optState(i)}`}
            onClick={() => !revealed && onPick?.(i)}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

function ImageChoice({ q, selected, revealed, onPick }) {
  const labels = q.options?.map((o) => o.label) || [];
  const optState = (i) => {
    const lbl = labels[i] ?? LETTERS[i];
    if (!revealed) return selected === i ? "sel" : "";
    if (lbl === q.correctAnswer) return "correct";
    if (i === selected) return "wrong";
    return "";
  };
  const hasHitboxes = q.hitboxes && labels.every((label) => q.hitboxes[label]);
  const isThird = q.section === "third_section";
  if (isThird && hasHitboxes) {
    return <ThirdChoiceTiles q={q} labels={labels} revealed={revealed} onPick={onPick} optState={optState} />;
  }
  return (
    <div className={`image-choice-wrap ${isThird ? "third-choice" : "math-image-choice"}`}>
      <img className={`q-img ${isThird ? "third-img" : "math-img"}`} src={q.imageWebp || q.image} alt="" loading="lazy" />
      {hasHitboxes ? (
        <div className="img-hit-layer" aria-label="خيارات السؤال داخل الصورة">
          {labels.map((label, i) => {
            const box = q.hitboxes[label];
            return (
              <button key={label} type="button" aria-label={`الخيار ${label}`}
                className={`img-hit absolute ${optState(i)}`}
                style={{ left: `${box.x}%`, top: `${box.y}%`, width: `${box.w}%`, height: `${box.h}%` }}
                onClick={() => !revealed && onPick?.(i)}>
                <span>{label}</span>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="img-hit-grid" style={{ gridTemplateColumns: `repeat(${Math.max(labels.length, 1)}, 1fr)` }}>
          {labels.map((label, i) => (
            <button key={label} type="button" aria-label={`الخيار ${label}`}
              className={`img-hit ${optState(i)}`} onClick={() => !revealed && onPick?.(i)}>
              <span>{label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function QuestionCard({
  question, selected = null, revealed = false, onPick,
  numericValues = [], onNumericChange, activeSlot = 0, setActiveSlot,
  showHints = true, tools = null, meta = null, navigation = null,
}) {
  const [hintOpen, setHintOpen] = useState(false);
  const q = question;
  const optState = (i) => {
    const lbl = q.options?.[i]?.label ?? LETTERS[i];
    if (!revealed) return selected === i ? "sel" : "";
    if (lbl === q.correctAnswer) return "correct";
    if (i === selected) return "wrong";
    return "";
  };
  const isMath = q.section === "math" && q.kind === "text";
  const isEnglishOption = q.section === "english" || (q.section === "vocab" && q.vocabMode !== "WT");
  const isOverlayImageChoice = q.kind === "image" && q.options?.length > 0;
  const showTags = q.kind === "image" && !q.hitboxes;
  const safeHint = showHints ? makeSafeHint(q) : "";
  const isVocabWord = q.kind === "vocab" && q.vocabMode === "WT";
  const hasTools = tools || safeHint || isVocabWord;
  // Math options always use the two-column grid. The shared group size below makes
  // every option in a question render at ONE size, and the stylesheet lets each box
  // grow and wrap so even long answers (sequences, coordinate+radius, "x = a or
  // x = b", long number-words) sit fully contained in half a row without clipping.
  const mathGroupSize = isMath ? groupOptionSizeClass(q.options || []) : null;
  const useSingleColumnOptions = false;
  const optsClass = [
    "opts",
    showTags ? "opts-labels" : useSingleColumnOptions ? "opts-single-col" : "opts-two-col",
  ].filter(Boolean).join(" ");

  return (
    <div className={`card ${q.section === "third_section" ? "third-card" : ""} ${q.section === "math" ? "math-card" : ""}`}>
      {meta}
      {hasTools && (
        <div className="card-tools">
          {tools}
          {isVocabWord && <SpeakButton word={q.word} />}
          {safeHint && (
            <button className={`quiz-tool-btn hint-icon ${hintOpen ? "on" : ""}`} onClick={() => setHintOpen((o) => !o)} aria-label="تلميح" type="button">تلميح</button>
          )}
        </div>
      )}

      <div className="card-body">
        {isOverlayImageChoice && <ImageChoice q={q} selected={selected} revealed={revealed} onPick={onPick} />}
        {q.kind === "svg" && (
          <div className="q-figure">
            <Prompt q={q} />
            <div className="q-svg" dangerouslySetInnerHTML={{ __html: q.svg }} />
          </div>
        )}
        {q.kind === "numeric" && (
          <NumericQuestion q={q} values={numericValues} onChange={onNumericChange}
            activeSlot={activeSlot} setActiveSlot={setActiveSlot} disabled={revealed} />
        )}
        {q.kind === "text" && <Prompt q={q} />}
        {q.kind === "text-en" && <EnglishPrompt q={q} />}
        {q.kind === "vocab" && (q.vocabMode === "WT" ? <VocabWord q={q} /> : <EnglishPrompt q={q} />)}
      </div>

      {!isOverlayImageChoice && q.kind !== "numeric" && q.options?.length > 0 && (
        <div className={optsClass}>
          {q.options.map((opt, i) => (
            <OptionRow key={i} opt={opt} index={i} state={optState(i)} disabled={revealed}
              onPick={onPick} isEnglishOption={isEnglishOption} isVocabOption={q.section === "vocab"} showTag={showTags}
              sizeOverride={isMath ? mathGroupSize : null} />
          ))}
        </div>
      )}

      {hintOpen && safeHint && <div className="hint-body compact-hint" dir="rtl">{safeHint}</div>}
      {navigation}
    </div>
  );
}
