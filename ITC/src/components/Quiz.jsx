import { useState, useEffect, useRef } from "react";
import QuestionCard from "./QuestionCard.jsx";
import NavOverlay from "./NavOverlay.jsx";
import { Header, CourseFooter, MainLogo, getLeenLogoSrc } from "./Home.jsx";
import { Sound } from "../lib/sound.js";
import { QUESTION_SECONDS } from "../data/banks.js";

export default function Quiz({
  questions, kind, timed, totalMinutes, dark, onToggleDark, soundOn, onToggleSound, onFinish, onHome, initialState,
}) {
  const [idx, setIdx] = useState(initialState?.idx || 0);
  const [answers, setAnswers] = useState(initialState?.answers || {});
  const [numeric, setNumeric] = useState(initialState?.numeric || {});
  const [marked, setMarked] = useState(initialState?.marked || {});
  const [activeSlot, setActiveSlot] = useState(0);
  const [qTime, setQTime] = useState(0);
  const [overall, setOverall] = useState(initialState?.overall ?? totalMinutes * 60);
  const [showNav, setShowNav] = useState(false);
  const [paused, setPaused] = useState(false);
  const [submitConfirm, setSubmitConfirm] = useState(false);
  const [anim, setAnim] = useState("in");
  const qTimerRef = useRef(null);
  const oTimerRef = useRef(null);

  const q = questions[idx];
  const total = questions.length;
  const perQ = QUESTION_SECONDS[q.section] || 60;

  useEffect(() => {
    if (initialState?.onState) initialState.onState({ idx, answers, numeric, marked, overall });
  });

  useEffect(() => {
    setQTime(perQ); setActiveSlot(0); setAnim("in");
    clearInterval(qTimerRef.current);
    if (!timed || paused || submitConfirm) return;
    qTimerRef.current = setInterval(() => {
      setQTime((t) => {
        if (t <= 1) { clearInterval(qTimerRef.current); advance(); return 0; }
        if (t <= 6) Sound.tick();
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(qTimerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, paused, submitConfirm, timed]);

  useEffect(() => {
    clearInterval(oTimerRef.current);
    if (!timed || paused || submitConfirm) return;
    oTimerRef.current = setInterval(() => {
      setOverall((t) => {
        if (t <= 1) { clearInterval(oTimerRef.current); finish(); return 0; }
        if (t === 60) Sound.warn();
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(oTimerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused, submitConfirm, timed]);

  useEffect(() => {
    if (!timed) return;
    const onVis = () => { if (document.hidden) setPaused(true); };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [timed]);

  const pick = (i) => {
    Sound.select();
    setAnswers((a) => ({ ...a, [idx]: i }));
  };

  const onNumericChange = (vals) => {
    setNumeric((n) => ({ ...n, [idx]: vals }));
    Sound.tap();
  };

  const go = (next) => {
    if (next < 0 || next >= total) return;
    Sound.swoosh(); setAnim("out");
    setTimeout(() => setIdx(next), 220);
  };
  const advance = () => { if (idx + 1 >= total) finish(); else go(idx + 1); };
  const finish = () => {
    clearInterval(qTimerRef.current); clearInterval(oTimerRef.current);
    onFinish({ questions, answers, numeric, marked, kind });
  };
  const requestFinish = () => { Sound.tap(); setSubmitConfirm(true); };
  const toggleMark = () => { Sound.tap(); setMarked((m) => ({ ...m, [idx]: !m[idx] })); };

  const overallStr = `${String(Math.floor(overall / 60)).padStart(2, "0")}:${String(overall % 60).padStart(2, "0")}`;
  const navControls = (
    <div className="card-nav-row">
      <button className="nav-btn primary" onClick={() => go(idx - 1)} disabled={idx === 0}>السابق</button>
      {idx + 1 >= total
        ? <button className="nav-btn primary" onClick={requestFinish}>إنهاء الاختبار</button>
        : <button className="nav-btn primary" onClick={() => go(idx + 1)}>التالي</button>}
    </div>
  );

  const cardTools = (
    <>
      <button className="quiz-tool-btn card-grid-btn" onClick={() => { Sound.tap(); setShowNav(true); }} aria-label="عرض جميع الأسئلة" type="button">عرض جميع الأسئلة</button>
      <button className={`quiz-tool-btn flag-btn compact ${marked[idx] ? "on" : ""}`} onClick={toggleMark} aria-label="تحديد للمراجعة" type="button">
        تحديد للمراجعة
      </button>
    </>
  );

  const inCardTimers = (
    <div className="quiz-meta-panel in-card-timers">
      <div className="quiz-status">
        <div className="quiz-count">السؤال <b>{idx + 1}</b> / {total}</div>
        <img className="quiz-mini-logo" src={getLeenLogoSrc(dark)} alt="لين" />
        {timed && <div className={`quiz-overall ${overall <= 60 ? "warn" : ""}`}>{overallStr}</div>}
      </div>
    </div>
  );

  return (
    <div className="screen quiz screen-enter">
      <Header
        showHome onHome={onHome}
        dark={dark} onToggleDark={onToggleDark}
        soundOn={soundOn} onToggleSound={onToggleSound}
      />
      <MainLogo dark={dark} />


      <div className="frame">
        <div className="frame-glow" />
        <div className="q-scroll">
          <div className={`q-anim ${anim === "in" ? "q-in" : "q-out"}`} key={idx}>
            <QuestionCard
              question={q}
              selected={answers[idx] ?? null}
              revealed={false}
              onPick={pick}
              numericValues={numeric[idx] || []}
              onNumericChange={onNumericChange}
              activeSlot={activeSlot}
              setActiveSlot={setActiveSlot}
              showHints
              tools={cardTools}
              meta={inCardTimers}
              navigation={navControls}
            />
          </div>
        </div>
      </div>

      {showNav && (
        <NavOverlay total={total} current={idx} answers={answers} numeric={numeric} marked={marked}
          onJump={(n) => { setShowNav(false); go(n); }} onClose={() => setShowNav(false)} />
      )}

      {paused && (
        <div className="overlay">
          <div className="pause-card">
            <div className="modal-icon">⏸</div>
            <h3>تم إيقاف الاختبار مؤقتًا</h3>
            <button className="btn-primary pause-continue" onClick={() => { Sound.tap(); setPaused(false); }}>متابعة</button>
          </div>
        </div>
      )}

      {submitConfirm && (
        <div className="overlay">
          <div className="modal">
            <div className="modal-icon">✅</div>
            <h3>هل أنت متأكد من رغبتك بتسليم الاختبار؟</h3>
            <div className="modal-acts">
              <button className="btn-primary" onClick={() => { Sound.tap(); finish(); }}>نعم</button>
              <button className="btn-ghost" onClick={() => { Sound.tap(); setSubmitConfirm(false); }}>لا</button>
            </div>
          </div>
        </div>
      )}
      <CourseFooter />
    </div>
  );
}
