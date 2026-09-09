import { useState } from "react";
import QuestionCard from "./QuestionCard.jsx";
import { Header, Footer, MainLogo } from "./Home.jsx";
import { Sound } from "../lib/sound.js";

export default function Review({ res, dark, onToggleDark, soundOn, onToggleSound, onHome, onBack }) {
  const [filter, setFilter] = useState("all");
  const rows = res.rows.filter((r) => filter === "all" ? true : filter === "wrong" ? r.status === "incorrect" : r.status === "unanswered");

  return (
    <div className="screen review screen-enter">
      <Header showBack onBack={onBack} showHome onHome={onHome} dark={dark} onToggleDark={onToggleDark} soundOn={soundOn} onToggleSound={onToggleSound} />
      <MainLogo dark={dark} />
      <div className="review-head">
        <h2>Review Answers</h2>
        <div className="review-filters">
          {[["all", "All"], ["wrong", "Incorrect"], ["empty", "Unanswered"]].map(([k, l]) => (
            <button key={k} className={filter === k ? "on" : ""} onClick={() => { Sound.tap(); setFilter(k); }}>{l}</button>
          ))}
        </div>
      </div>
      <div className="scroll-area">
        {rows.map((r) => (
          <div className="review-item" key={r.i}>
            <div className="review-ihead">
              <span className="review-num">Question {r.i + 1}</span>
              <span className={`review-verdict ${r.status}`}>
                {r.status === "correct" ? "Correct ✓" : r.status === "incorrect" ? "Incorrect ✕" : "Unanswered"}
              </span>
            </div>
            <QuestionCard question={r.q} selected={r.selected} revealed={true} />
          </div>
        ))}
        {rows.length === 0 && <div className="review-empty">No questions in this category.</div>}
      </div>
      <Footer />
    </div>
  );
}
