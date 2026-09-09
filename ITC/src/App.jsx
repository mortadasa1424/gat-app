import { useState, useEffect, useCallback, useRef } from "react";
import Home from "./components/Home.jsx";
import ExamSelect from "./components/ExamSelect.jsx";
import Quiz from "./components/Quiz.jsx";
import Results from "./components/Results.jsx";
import Review from "./components/Review.jsx";
import PerformanceReport from "./components/PerformanceReport.jsx";
import LeadForm from "./components/LeadForm.jsx";
import PopupAd, { OpenAdVideoPreloader } from "./components/PopupAd.jsx";
import { EXAMS, VOCAB_MODES, getQuestionSet, completeQuestionSet, getQuestionsByIds } from "./data/banks.js";
import { Sound } from "./lib/sound.js";
import "./styles/app.css";

const WHATSAPP = "966557841489";

const LS = {
  theme: "leen_itc_theme",
  lead: "leen_itc_lead_completed",
  active: "leen_itc_active_attempt_v11",
  openAdLastShown: "leen_itc_open_ad_last_shown_v2",
};
const get = (k, d) => { try { return localStorage.getItem(k) ?? d; } catch { return d; } };
const getJSON = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
const set = (k, v) => { try { localStorage.setItem(k, v); } catch {} };
const setJSON = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };
const del = (k) => { try { localStorage.removeItem(k); } catch {} };
const AD_COOLDOWN_MS = 60 * 60 * 1000;

export default function App() {
  const [screen, setScreen] = useState("home"); // home|select|quiz|results|review|lead
  const [selectMode, setSelectMode] = useState("exams"); // exams|vocab
  const [session, setSession] = useState(null); // {kind, timed, minutes, questions, examTitle, isVocab, initialState}
  const [attempt, setAttempt] = useState(null);
  const [reviewRes, setReviewRes] = useState(null);
  const [reportRes, setReportRes] = useState(null);
  const [pending, setPending] = useState(null); // intended start, awaiting lead
  const [resumePrompt, setResumePrompt] = useState(null);
  const [savedPrompt, setSavedPrompt] = useState(null);
  const [leaveConfirm, setLeaveConfirm] = useState(false);
  const [homeReturnConfirm, setHomeReturnConfirm] = useState(null);
  const [practiceMistakesPrompt, setPracticeMistakesPrompt] = useState(null);
  const [showOpenAd, setShowOpenAd] = useState(false);
  const [showFinishAd, setShowFinishAd] = useState(false);
  const [openAdPreloadActive, setOpenAdPreloadActive] = useState(false);
  const [openAdVideoSrc, setOpenAdVideoSrc] = useState("");
  const openAdVideoSrcRef = useRef("");

  const [dark, setDark] = useState(() => get(LS.theme, "dark") !== "light");
  const [soundOn, setSoundOn] = useState(true);

  useEffect(() => { Sound.setEnabled(soundOn); }, [soundOn]);
  useEffect(() => { document.body.classList.toggle("light", !dark); set(LS.theme, dark ? "dark" : "light"); }, [dark]);
  useEffect(() => {
    const unlock = () => { Sound.unlock(); window.removeEventListener("pointerdown", unlock); };
    window.addEventListener("pointerdown", unlock);
  }, []);

  const revokeOpenAdVideoSrc = useCallback((clearState = true) => {
    const src = openAdVideoSrcRef.current;
    if (src?.startsWith("blob:")) URL.revokeObjectURL(src);
    openAdVideoSrcRef.current = "";
    if (clearState) setOpenAdVideoSrc("");
  }, []);

  const handleOpenAdReady = useCallback(({ src }) => {
    if (!src) return;

    const previousSrc = openAdVideoSrcRef.current;
    if (previousSrc && previousSrc !== src && previousSrc.startsWith("blob:")) {
      URL.revokeObjectURL(previousSrc);
    }

    openAdVideoSrcRef.current = src;
    setOpenAdVideoSrc(src);
  }, []);

  const handleOpenAdClose = useCallback(() => {
    setShowOpenAd(false);
    revokeOpenAdVideoSrc();
  }, [revokeOpenAdVideoSrc]);

  useEffect(() => {
    const now = Date.now();
    const lastShown = Number(get(LS.openAdLastShown, "0")) || 0;
    if (now - lastShown < AD_COOLDOWN_MS) return;

    // Start loading immediately. The opening popup appears only after the
    // complete MP4 has been downloaded and converted to a Blob URL.
    setOpenAdPreloadActive(true);
  }, []);

  useEffect(() => {
    if (!openAdPreloadActive || !openAdVideoSrc || showOpenAd) return;

    const latestNow = Date.now();
    const latestLastShown = Number(get(LS.openAdLastShown, "0")) || 0;
    if (latestNow - latestLastShown < AD_COOLDOWN_MS) {
      setOpenAdPreloadActive(false);
      revokeOpenAdVideoSrc();
      return;
    }

    set(LS.openAdLastShown, String(latestNow));
    setOpenAdPreloadActive(false);
    setShowOpenAd(true);
  }, [openAdPreloadActive, openAdVideoSrc, revokeOpenAdVideoSrc, showOpenAd]);

  useEffect(() => {
    return () => revokeOpenAdVideoSrc(false);
  }, [revokeOpenAdVideoSrc]);

  // resume interrupted attempt on load
  useEffect(() => {
    const saved = getJSON(LS.active, null);
    if (saved && saved.questionIds?.length) setResumePrompt(saved);
  }, []);

  const leadDone = () => get(LS.lead, "") === "true";

  // ---- start flow ----
  const requestStart = (kindKey, timed, isVocab) => {
    const meta = isVocab ? VOCAB_MODES[kindKey] : EXAMS[kindKey];
    const intent = { kindKey, kind: meta.kind, timed, isVocab, minutes: isVocab ? 30 : EXAMS[kindKey].minutes, examTitle: meta.title };
    // existing saved attempt for same kind+mode+timed?
    const saved = getJSON(LS.active, null);
    if (saved && saved.kind === meta.kind && saved.timed === timed) {
      setSavedPrompt({ intent, saved });
      return;
    }
    if (!leadDone()) { setPending(intent); setScreen("lead"); return; }
    beginAttempt(intent);
  };

  const beginAttempt = (intent, restoreState = null) => {
    const questions = restoreState?.questions || getQuestionSet(intent.kind);
    const sess = {
      ...intent, questions, isVocab: intent.isVocab,
      initialState: { ...(restoreState?.state || {}), questions, onState: onQuizState },
    };
    setSession(sess);
    setScreen("quiz");
    saveActive(intent, questions, restoreState?.state || {});
  };

  const saveActive = (intent, questions, state) => {
    setJSON(LS.active, {
      kind: intent.kind, kindKey: intent.kindKey, timed: intent.timed, minutes: intent.minutes,
      examTitle: intent.examTitle, isVocab: intent.isVocab,
      questionIds: questions.map((q) => q.id), state,
    });
  };

  const onQuizState = useCallback((live) => {
    const saved = getJSON(LS.active, null);
    if (saved) setJSON(LS.active, { ...saved, state: live });
  }, []);

  const finishAttempt = (att) => {
    const finished = {
      ...att,
      kind: session?.kind || att.kind,
      isVocab: Boolean(session?.isVocab),
      examTitle: session?.examTitle || att.examTitle,
    };
    completeQuestionSet(finished.kind, finished.questions);
    del(LS.active);
    setAttempt(finished);
    setScreen("results");
    setShowFinishAd(true);
  };

  // ---- lead complete ----
  const onLeadComplete = () => {
    set(LS.lead, "true");
    if (pending) { const p = pending; setPending(null); beginAttempt(p); }
    else setScreen("home");
  };

  // ---- resume prompt actions ----
  const doResume = () => {
    const s = resumePrompt; setResumePrompt(null);
    const intent = { kindKey: s.kindKey, kind: s.kind, timed: s.timed, isVocab: s.isVocab, minutes: s.minutes, examTitle: s.examTitle };
    const questions = getQuestionsByIds(s.questionIds || []);
    beginAttempt(intent, { questions: questions.length ? questions : getQuestionSet(s.kind), state: s.state });
  };
  const discardResume = () => { setResumePrompt(null); del(LS.active); };

  // ---- saved (same mode) prompt ----
  const continueSaved = () => {
    const { intent, saved } = savedPrompt; setSavedPrompt(null);
    if (!leadDone()) { setPending(intent); setScreen("lead"); return; }
    const questions = getQuestionsByIds(saved.questionIds || []);
    beginAttempt(intent, { questions: questions.length ? questions : getQuestionSet(intent.kind), state: saved.state });
  };
  const newAttempt = () => {
    const { intent } = savedPrompt; setSavedPrompt(null);
    del(LS.active);
    if (!leadDone()) { setPending(intent); setScreen("lead"); return; }
    beginAttempt(intent);
  };

  // ---- practice mistakes ----
  const practiceMistakes = (res) => {
    const wrongRows = res.rows.filter((r) => r.status === "incorrect" || r.status === "unanswered");
    const wrongIds = wrongRows.map((r) => r.q?.id).filter(Boolean);
    // Rehydrate from the current banks so practice mistakes always uses the latest
    // question renderer/data and the current question screen for all exams.
    const freshById = Object.fromEntries(getQuestionsByIds(wrongIds).map((q) => [q.id, q]));
    const wrong = wrongRows.map((r) => freshById[r.q?.id] || r.q).filter(Boolean);
    const sess = {
      kind: attempt.kind || "practice", timed: false, minutes: 0, questions: wrong,
      isVocab: attempt.isVocab, examTitle: "تدرّب على الأخطاء", initialState: { onState: () => {}, idx: 0, answers: {}, numeric: {}, marked: {}, overall: 0 },
    };
    setSession(sess); setScreen("quiz");
  };

  const goHome = () => { setScreen("home"); setSession(null); };
  const askLeave = () => setLeaveConfirm(true);
  const confirmLeave = () => { setLeaveConfirm(false); goHome(); };
  const askHomeReturn = (source) => setHomeReturnConfirm(source);
  const confirmHomeReturn = () => {
    setHomeReturnConfirm(null);
    goHome();
  };
  const requestPracticeMistakes = (res) => setPracticeMistakesPrompt(res);
  const confirmPracticeMistakes = () => {
    const res = practiceMistakesPrompt;
    setPracticeMistakesPrompt(null);
    if (res) practiceMistakes(res);
  };

  return (
    <div className="app-root">
      <div className="aurora"><span className="b1" /><span className="b2" /><span className="b3" /><span className="b4" /></div>
      <div className="grain" />
      <a className="wa-float global-wa" href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer" aria-label="واتساب">
        <svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16.04 3.01C8.87 3.01 3.04 8.8 3.04 15.92c0 2.27.6 4.5 1.73 6.47L3 29l6.79-1.77a13.04 13.04 0 0 0 6.25 1.59h.01c7.17 0 13-5.79 13-12.91 0-3.45-1.36-6.69-3.82-9.13a13.05 13.05 0 0 0-9.19-3.77Zm0 23.63h-.01a10.84 10.84 0 0 1-5.51-1.5l-.4-.24-4.03 1.05 1.08-3.91-.26-.4a10.66 10.66 0 0 1-1.67-5.72c0-5.9 4.85-10.72 10.81-10.72 2.89 0 5.6 1.12 7.64 3.15a10.63 10.63 0 0 1 3.17 7.57c0 5.91-4.86 10.72-10.82 10.72Zm5.93-8.03c-.32-.16-1.9-.93-2.2-1.04-.3-.11-.51-.16-.73.16-.21.32-.84 1.04-1.03 1.25-.19.22-.38.24-.7.08-.32-.16-1.36-.5-2.6-1.59-.96-.85-1.6-1.9-1.79-2.22-.19-.32-.02-.5.14-.66.15-.15.32-.38.49-.57.16-.19.22-.32.32-.54.11-.22.05-.41-.03-.57-.08-.16-.73-1.75-1-2.4-.26-.63-.53-.54-.73-.55h-.62c-.21 0-.57.08-.86.41-.3.32-1.14 1.11-1.14 2.71 0 1.6 1.17 3.14 1.33 3.36.16.22 2.3 3.49 5.57 4.9.78.34 1.39.54 1.86.69.78.25 1.49.21 2.05.13.63-.09 1.9-.77 2.17-1.51.27-.74.27-1.38.19-1.51-.08-.13-.3-.21-.62-.37Z"/></svg>
      </a>
      {screen === "home" && (
        <Home
          dark={dark} onToggleDark={() => setDark((d) => !d)}
          soundOn={soundOn} onToggleSound={() => setSoundOn((s) => !s)}
          onPickMockExams={() => { setSelectMode("exams"); setScreen("select"); }}
          onPickVocab={() => { setSelectMode("vocab"); setScreen("select"); }}
        />
      )}

      {screen === "select" && (
        <ExamSelect
          mode={selectMode === "vocab" ? "vocab" : "exams"}
          dark={dark} onToggleDark={() => setDark((d) => !d)}
          soundOn={soundOn} onToggleSound={() => setSoundOn((s) => !s)}
          onHome={goHome}
          onStart={(key, timed) => requestStart(key, timed, selectMode === "vocab")}
        />
      )}

      {screen === "lead" && (
        <LeadForm
          dark={dark} onToggleDark={() => setDark((d) => !d)}
          soundOn={soundOn} onToggleSound={() => setSoundOn((s) => !s)}
          onComplete={onLeadComplete} onHome={goHome}
        />
      )}

      {screen === "quiz" && session && (
        <Quiz
          questions={session.questions} kind={session.kind} timed={session.timed}
          totalMinutes={session.minutes} examTitle={session.examTitle}
          dark={dark} onToggleDark={() => setDark((d) => !d)}
          soundOn={soundOn} onToggleSound={() => setSoundOn((s) => !s)}
          onFinish={finishAttempt} onHome={askLeave}
          initialState={session.initialState}
        />
      )}

      {screen === "results" && attempt && (
        <Results
          attempt={attempt} isVocab={attempt.isVocab}
          dark={dark} onToggleDark={() => setDark((d) => !d)}
          soundOn={soundOn} onToggleSound={() => setSoundOn((s) => !s)}
          onHome={() => askHomeReturn("results")}
          onReport={(res) => { setReportRes(res); setScreen("report"); }}
          onReview={(res) => { setReviewRes(res); setScreen("review"); }}
          onPracticeMistakes={requestPracticeMistakes}
        />
      )}



      {screen === "report" && reportRes && (
        <PerformanceReport
          res={reportRes}
          dark={dark} onToggleDark={() => setDark((d) => !d)}
          soundOn={soundOn} onToggleSound={() => setSoundOn((s) => !s)}
          onHome={() => askHomeReturn("report")}
          onBack={() => setScreen("results")}
        />
      )}

      {screen === "review" && reviewRes && (
        <Review
          res={reviewRes}
          dark={dark} onToggleDark={() => setDark((d) => !d)}
          soundOn={soundOn} onToggleSound={() => setSoundOn((s) => !s)}
          onHome={() => askHomeReturn("review")}
          onBack={() => setScreen("results")}
        />
      )}

      {openAdPreloadActive && !showOpenAd && (
        <OpenAdVideoPreloader
          enabled={openAdPreloadActive}
          onReady={handleOpenAdReady}
          onError={() => setOpenAdPreloadActive(false)}
        />
      )}
      {showOpenAd && <PopupAd variant="open" videoSrc={openAdVideoSrc} onClose={handleOpenAdClose} />}
      {showFinishAd && <PopupAd variant="finish" onClose={() => setShowFinishAd(false)} />}

      {/* resume interrupted */}
      {resumePrompt && (
        <Modal title="استكمال المحاولة" icon="↩️"
          body={`لقد غادرت أثناء   ${resumePrompt.examTitle}، هل ترغب بإكمال محاولتك؟`}
          yes="نعم" no="لا" onYes={doResume} onNo={discardResume} />
      )}
      {/* saved same-mode */}
      {savedPrompt && (
        <Modal title="لديك محاولة سابقة لهذا الاختبار " icon="💾"
          body={`هل ترغب بإكمالها؟`}
          yes="نعم" no="لا" onYes={continueSaved} onNo={newAttempt} />
      )}
      {/* leave confirm */}
      {leaveConfirm && (
        <Modal title="مغادرة الاختبار؟" icon="🚪"
          yes="نعم" no="لا" onYes={confirmLeave} onNo={() => setLeaveConfirm(false)} />
      )}
      {/* return to home confirm: results, review, and skill performance */}
      {homeReturnConfirm && (
        <Modal title="هل ترغب بالعودة إلى القائمة الرئيسية؟" icon="🚪"
          yes="نعم" no="لا" onYes={confirmHomeReturn} onNo={() => setHomeReturnConfirm(null)} />
      )}
      {/* practice mistakes confirm */}
      {practiceMistakesPrompt && (
        <Modal title="هل ترغب بإعادة الاختبار؟" icon="🔁"
          body="سيتم إعادة الأسئلة التي لم تجبها أو الأسئلة التي أجبتها بشكل خاطئ"
          bodyClassName="modal-comment"
          yes="نعم" no="لا" onYes={confirmPracticeMistakes} onNo={() => setPracticeMistakesPrompt(null)} />
      )}
    </div>
  );
}

function Modal({ title, body, bodyClassName = "", yes, no, onYes, onNo, icon }) {
  return (
    <div className="overlay">
      <div className="modal">
        {icon && <div className="modal-icon">{icon}</div>}
        <h3>{title}</h3>
        {body && <p className={bodyClassName}>{body}</p>}
        <div className="modal-acts">
          <button className="btn-primary" onClick={() => { Sound.tap(); onYes(); }}>{yes}</button>
          <button className="btn-ghost" onClick={() => { Sound.tap(); onNo(); }}>{no}</button>
        </div>
      </div>
    </div>
  );
}
