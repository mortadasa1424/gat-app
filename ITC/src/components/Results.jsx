import { useEffect, useMemo, useRef, useState } from "react";
import { Header, CourseFooter, MainLogo } from "./Home.jsx";
import { scoreAttempt } from "../lib/scoring.js";
import { rehydrateQuestions } from "../data/banks.js";
import { Sound } from "../lib/sound.js";

const RC = 2 * Math.PI * 74;
const WHATSAPP = "966557841489";
const COURSE = "https://leen.sa/courses/itc?utm_source=Exam&utm_medium=APP&utm_campaign=ITC26";

export default function Results({ attempt, isVocab, dark, onToggleDark, soundOn, onToggleSound, onHome, onReport, onReview, onPracticeMistakes }) {
  const currentAttempt = useMemo(() => ({
    ...attempt,
    questions: rehydrateQuestions(attempt?.questions || []),
  }), [attempt]);
  const res = scoreAttempt(currentAttempt);
  const { pct, correct, incorrect, unanswered, unscored } = res;
  const [shown, setShown] = useState(0);
  const [offset, setOffset] = useState(RC);
  const [help, setHelp] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setOffset(RC * (1 - pct / 100)), 200);
    let n = 0; const step = Math.max(1, Math.round(pct / 40));
    const ci = setInterval(() => { n = Math.min(n + step, pct); setShown(n); if (n >= pct) clearInterval(ci); }, 26);
    Sound.complete(pct);
    if (pct >= 50) burst();
    return () => { clearTimeout(t); clearInterval(ci); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const burst = () => {
    const cv = canvasRef.current; if (!cv) return;
    const cx = cv.getContext("2d"); cv.width = innerWidth; cv.height = innerHeight;
    const cols = ["#00c3e1", "#ff8b13", "#fd5f6d", "#22c58b", "#ffd23f", "#fff"];
    const P = Array.from({ length: 120 }, () => ({ x: innerWidth / 2, y: innerHeight * 0.3,
      vx: (Math.random() - 0.5) * 11, vy: Math.random() * -13 - 3, g: 0.35,
      s: Math.random() * 8 + 4, c: cols[(Math.random() * cols.length) | 0], r: Math.random() * 6, vr: (Math.random() - 0.5) * 0.5, life: 1 }));
    let f = 0;
    const loop = () => {
      cx.clearRect(0, 0, cv.width, cv.height); f++;
      P.forEach((p) => { p.vy += p.g; p.x += p.vx; p.y += p.vy; p.r += p.vr; p.life -= 0.008;
        cx.save(); cx.translate(p.x, p.y); cx.rotate(p.r); cx.globalAlpha = Math.max(p.life, 0);
        cx.fillStyle = p.c; cx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * 0.6); cx.restore(); });
      if (f < 190) requestAnimationFrame(loop); else cx.clearRect(0, 0, cv.width, cv.height);
    };
    loop();
  };

  const hasMistakes = incorrect + unanswered > 0;
  const allCorrect = correct === res.total && res.total > 0;

  return (
    <div className="screen results screen-enter">
      <canvas id="confetti" ref={canvasRef} />
      <Header showHome onHome={onHome} dark={dark} onToggleDark={onToggleDark} soundOn={soundOn} onToggleSound={onToggleSound} />
      <MainLogo dark={dark} />

      <div className="scroll-area results-scroll">
        <div className="res-title">{isVocab ? "نتيجة تدريب المفردات" : "نتيجة الاختبار"}</div>

        <div className="score-card clean-score-card">
          <div className="ring">
            <svg width="178" height="178" viewBox="0 0 178 178">
              <defs><linearGradient id="grG" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#00c3e1" /><stop offset="1" stopColor="#ff8b13" /></linearGradient></defs>
              <circle className="trk" cx="89" cy="89" r="74" fill="none" strokeWidth="13" />
              <circle className="fil" cx="89" cy="89" r="74" fill="none" strokeWidth="13" strokeDasharray={RC} strokeDashoffset={offset} />
            </svg>
            <div className="pct">{shown}<small>%</small></div>
          </div>
        </div>

        <div className="res-badges">
          <div className="rbadge ok"><b>{correct}</b><span>صحيح</span></div>
          <div className="rbadge no"><b>{incorrect}</b><span>خطأ</span></div>
          <div className="rbadge gr"><b>{unanswered}</b><span>بدون إجابة</span></div>
        </div>
        {unscored > 0 && <div className="unscored-note">يوجد {unscored} سؤال يحتاج مراجعة.</div>}

        <div className={`expander ${help ? "open" : ""}`}>
          <button className="expander-head" onClick={() => { Sound.tap(); setHelp((h) => !h); }}>
            هل تحتاج إلى مساعدة؟ <span className="chev">▾</span>
          </button>
          {help && (
            <div className="expander-body help-body">
              <a className="help-link" href={COURSE} target="_blank" rel="noreferrer">سجّل في دورة الاستعداد لاختبار ITC</a>
              <a className="help-link wa-action" href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer"><span className="wa-mini" aria-hidden="true"><svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16.04 3.01C8.87 3.01 3.04 8.8 3.04 15.92c0 2.27.6 4.5 1.73 6.47L3 29l6.79-1.77a13.04 13.04 0 0 0 6.25 1.59h.01c7.17 0 13-5.79 13-12.91 0-3.45-1.36-6.69-3.82-9.13a13.05 13.05 0 0 0-9.19-3.77Zm0 23.63h-.01a10.84 10.84 0 0 1-5.51-1.5l-.4-.24-4.03 1.05 1.08-3.91-.26-.4a10.66 10.66 0 0 1-1.67-5.72c0-5.9 4.85-10.72 10.81-10.72 2.89 0 5.6 1.12 7.64 3.15a10.63 10.63 0 0 1 3.17 7.57c0 5.91-4.86 10.72-10.82 10.72Zm5.93-8.03c-.32-.16-1.9-.93-2.2-1.04-.3-.11-.51-.16-.73.16-.21.32-.84 1.04-1.03 1.25-.19.22-.38.24-.7.08-.32-.16-1.36-.5-2.6-1.59-.96-.85-1.6-1.9-1.79-2.22-.19-.32-.02-.5.14-.66.15-.15.32-.38.49-.57.16-.19.22-.32.32-.54.11-.22.05-.41-.03-.57-.08-.16-.73-1.75-1-2.4-.26-.63-.53-.54-.73-.55h-.62c-.21 0-.57.08-.86.41-.3.32-1.14 1.11-1.14 2.71 0 1.6 1.17 3.14 1.33 3.36.16.22 2.3 3.49 5.57 4.9.78.34 1.39.54 1.86.69.78.25 1.49.21 2.05.13.63-.09 1.9-.77 2.17-1.51.27-.74.27-1.38.19-1.51-.08-.13-.3-.21-.62-.37Z"/></svg></span> تواصل معنا عبر واتساب</a>
            </div>
          )}
        </div>

        {!allCorrect && (
          <div className="res-actions clean-actions">
            {!isVocab && <button className="btn-primary action-report" onClick={() => { Sound.tap(); onReport(res); }}>الأداء حسب المهارة</button>}
            <button className="btn-primary" onClick={() => { Sound.tap(); onReview(res); }}>مراجعة الإجابات</button>
            {hasMistakes && <button className="btn-primary action-warn" onClick={() => { Sound.tap(); onPracticeMistakes(res); }}>تدرب على الأخطاء</button>}
          </div>
        )}
      </div>

      <CourseFooter />
    </div>
  );
}
