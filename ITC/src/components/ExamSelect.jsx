import { useMemo, useState } from "react";
import { Header, Footer, MainLogo } from "./Home.jsx";
import { EXAMS, VOCAB_MODES } from "../data/banks.js";
import { Sound } from "../lib/sound.js";

export default function ExamSelect({ mode, dark, onToggleDark, soundOn, onToggleSound, onHome, onStart }) {
  const isVocab = mode === "vocab";
  const items = useMemo(() => Object.entries(isVocab ? VOCAB_MODES : EXAMS), [isVocab]);
  const [picked, setPicked] = useState(null);
  const [timedByKey, setTimedByKey] = useState(() => Object.fromEntries(items.map(([key]) => [key, false])));

  const toggleTimed = (key) => {
    Sound.tap();
    setTimedByKey((prev) => ({ ...prev, [key]: !prev[key] }));
  };
  const start = () => {
    if (!picked) return;
    Sound.start();
    onStart(picked, timedByKey[picked] === true);
  };

  return (
    <div className={`screen select screen-enter ${isVocab ? "vocab-select" : "exam-select"}`}>
      <Header showHome onHome={onHome} dark={dark} onToggleDark={onToggleDark} soundOn={soundOn} onToggleSound={onToggleSound} />
      <MainLogo dark={dark} />

      <div className={`tiles ${isVocab ? "g1" : "g2"} clean-tiles`}>
        {items.map(([key, ex]) => (
          <button key={key} className={`tile ${picked === key ? "sel" : ""}`}
            onClick={() => { Sound.select(); setPicked(key); }}>
            <span className="tile-icon">{ex.icon}</span>
            <span className="tile-body">
              <span className="tile-title">{ex.title}</span>
            </span>
            <span className="tile-check">✓</span>
          </button>
        ))}
      </div>

      <div className="select-foot clean-select-foot">
        {picked && (
          <button
            type="button"
            className={`timer-toggle ${timedByKey[picked] === true ? "on" : ""}`}
            onClick={() => toggleTimed(picked)}
            aria-pressed={timedByKey[picked] === true}
            aria-label="تفعيل المؤقت"
            title="تفعيل المؤقت"
          >
            <span className="timer-toggle-icon" aria-hidden="true">⏱</span>
            <span className="timer-toggle-label" aria-hidden="true">المؤقت</span>
            <span className="timer-toggle-switch" aria-hidden="true">
              <span className="timer-toggle-knob" />
            </span>
          </button>
        )}
        <button className="btn-primary" disabled={!picked} onClick={start}>ابدأ</button>
      </div>
      <Footer />
    </div>
  );
}
