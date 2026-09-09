import { useState } from "react";
import { Header, Footer, MainLogo } from "./Home.jsx";
import { Sound } from "../lib/sound.js";
import { Calculator, BookOpen, Check } from "./icons.jsx";

const TEST_LABELS = {
  quantitative: [
    { key: "quant1", title: "Quantitative Test 1" },
    { key: "quant2", title: "Quantitative Test 2" },
    { key: "quant3", title: "Quantitative Test 3" },
  ],
  verbal: [
    { key: "verbal1", title: "Verbal Test 1" },
    { key: "verbal2", title: "Verbal Test 2" },
    { key: "verbal3", title: "Verbal Test 3" },
  ],
};

const SECTION_TITLE = {
  quantitative: "Quantitative Section",
  verbal: "Verbal Section",
};

// Same icon used for the matching section on Home.
const SECTION_ICON = {
  quantitative: Calculator,
  verbal: BookOpen,
};

export default function SectionSelect({ section, dark, onToggleDark, soundOn, onToggleSound, onHome, onStart }) {
  const items = TEST_LABELS[section] || [];
  const TileIcon = SECTION_ICON[section] || Calculator;
  const [picked, setPicked] = useState(null);
  const [timed, setTimed] = useState(false);

  const start = () => {
    if (!picked) return;
    Sound.start();
    onStart(picked, timed);
  };

  return (
    <div className="screen select screen-enter exam-select">
      <Header showHome onHome={onHome} dark={dark} onToggleDark={onToggleDark} soundOn={soundOn} onToggleSound={onToggleSound} />
      <MainLogo dark={dark} />

      <div className="select-title">
        <h2>{SECTION_TITLE[section]}</h2>
        <p className="select-sub">Choose a test to begin.</p>
      </div>

      <div className="tests-grid">
        {items.map((t) => (
          <button key={t.key} className={`tile ${picked === t.key ? "sel" : ""}`}
            onClick={() => { Sound.select(); setPicked(t.key); }}>
            <span className="tile-icon"><TileIcon size={22} aria-hidden="true" /></span>
            <span className="tile-body">
              <span className="tile-title">{t.title}</span>
            </span>
            <span className="tile-check"><Check size={13} aria-hidden="true" /></span>
          </button>
        ))}
      </div>

      <div className="select-action-panel">
        <div className="select-action-row">
          <div className="timer-toggle-group">
            <span className="timer-toggle-caption">Timer</span>
            <button
              type="button"
              className={`timer-toggle timer-toggle-compact ${timed ? "on" : ""}`}
              onClick={() => { Sound.tap(); setTimed((v) => !v); }}
              aria-pressed={timed}
              aria-label="Timed test, 60 minute overall limit"
              title="Timed test — 60 minute overall limit"
            >
              <span className="timer-toggle-switch" aria-hidden="true">
                <span className="timer-toggle-knob" />
              </span>
              <span className="timer-toggle-onoff" aria-hidden="true">{timed ? "On" : "Off"}</span>
            </button>
          </div>

          <button className="btn-primary select-start-btn" disabled={!picked} onClick={start}>Start Test</button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
