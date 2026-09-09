# Leen ITC Practice App — Rebuilt

A complete, editable **React + Vite** rebuild of the Leen ITC preparation app, with
the headline upgrade: math questions render as **true-HD native text** (KaTeX +
Tajawal) instead of low-resolution images. Mobile-first, Arabic RTL, with a
zero-scroll home and exam-selection, a tinted-paper question card integrated into
an "exam frame," rich animations, and Web-Audio sound cues.

## Run it

```bash
npm install
npm run dev      # Vite prints a local URL
npm run build    # production build -> dist/
npm run preview  # preview the production build
```

> Requires internet for `npm install` (pulls react, vite, katex, react-katex).

## What's included (full feature parity with the spec)

**Exams** — 4 types with correct counts & durations:
- الاختبار الشامل (70 q, 85 min), اختبار الرياضيات (30 q, 45 min),
  اختبار الإنجليزي (30 q, 30 min), اختبار القسم الثالث (10 q, 10 min).

**Vocabulary** — 700 words × 3 modes (ترجمة الكلمة / املأ الفراغ / معنى من السياق)
= **2,100 real questions**, 30 per session.

**Question rendering** (`src/components/QuestionCard.jsx`):
- **Math**: HD KaTeX text for transcribed questions (see `src/data/mathHD.js`),
  with automatic **image fallback** (enhanced WebP) for the rest. Equations are
  *atomic* (never wrap mid-expression) and bidi-isolated (no RTL flipping).
  Big expressions (matrices, products) use a centered **stacked** layout; short
  ones render **inline**.
- **English**: text questions (Grammar/Vocabulary/Reading) with scrollable
  passages and highlighted context words.
- **Vocab**: word-translation shows the big word + a 🔊 speaker
  (browser speechSynthesis, prefers a US English voice); fill-blank & context
  show the sentence; all support the Arabic hint card.
- **Third section**: enhanced images; multiple-choice (A–I labels supported) and
  **numeric-input** questions with on-the-fly expression evaluation.

**Timers** — per-question (Math 90s, others 60s) shown as a slim bar merged with
progress; overall exam timer; tab-switch auto-pause; both omitted in untimed mode.

**Flow & persistence** — lead form (GCC phone validation + Google Sheets webhook),
3 pause/resume states (leave-confirm, tab-switch pause, reopen-resume),
seen-history rotation (questions marked seen only **after** completion), timed vs
untimed as separate saved sessions sharing a reserved question set.

**Results** — animated score ring + count-up, confetti (≥50%), correct/incorrect/
unanswered/unscored stats, the **diagnostic report** by category with the spec's
thresholds (≥90% good / >0% needs training / 0% needs foundation), the help card
(WhatsApp / course / resources) and a floating WhatsApp button.

**Review** — filters (الكل / الأخطاء / الفارغة), each item re-renders the question
with your answer vs the correct answer.

**Practice mistakes** — builds a session from only the incorrect/unanswered items.

**UX** — dark/light theme (persisted), sound on/off (persisted), reduced-motion
support, semantic/keyboard-friendly controls, and a **hard zero-scroll** guarantee
on Home and Exam-Selection (fixed-viewport shell; works on small phones).

## Project layout

```
index.html, vite.config.js, package.json
public/
  lead-config.js            <- your Google Apps Script webhook URL
  assets/brand/             <- logo
  assets/questions/         <- enhanced question images (math + third section)
src/
  main.jsx, App.jsx         <- entry + orchestration (screens, resume, theme, sound)
  components/
    Home.jsx, ExamSelect.jsx, Quiz.jsx, NavOverlay.jsx,
    QuestionCard.jsx, Results.jsx, Review.jsx, LeadForm.jsx
  data/
    banks.js                <- normalizes banks + selection/rotation logic
    math.json, english.json, third.json, passages.json, vocab.json  <- REAL data
    mathHD.js               <- HD text overrides for transcribed math questions
  lib/
    sound.js                <- Web Audio cue engine
    scoring.js              <- scoring + numeric eval + diagnostics
  styles/app.css            <- theme, no-scroll shell, tinted card, animations
```

## Adding more HD math questions

The data banks are 100% real (extracted from the original). Math questions are
image-based; **56 of 60 are transcribed to HD text** in `src/data/mathHD.js`,
keyed by id (e.g. `"ITC-MATH-0026"`). The remaining 4 (ITC-MATH-0057..0060)
contain labeled geometric **figures** (cylinder, triangle, trapezoid, right
triangle) whose dimensions live in the diagram, so they correctly keep their
enhanced image. Anything not in that file shows its enhanced image. To
upgrade another question to HD text, read its image and add an entry:

```js
"ITC-MATH-0030": {
  layout: "stacked",                       // omit for inline
  prompt: [
    { type: "ar",    text: "بسّط:" },
    { type: "block", text: "\\frac{x^2-9}{x-3}" }   // big -> its own centered line
  ],
  options: [{ tex: "x+3" }, { tex: "x-3" }, { ar: "٩" }, { tex: "x^2" }],
},
```
- `{type:"tex"}` = inline math inside the Arabic line; `{type:"block"}` = big
  centered equation; `{type:"ar"}` = plain text. The `correct` answer stays the
  original image's answer key (already in `math.json`).

## Configure the lead webhook

Edit `public/lead-config.js` and set `window.LEEN_GOOGLE_SHEETS_WEBHOOK_URL` to
your Apps Script Web App URL.
