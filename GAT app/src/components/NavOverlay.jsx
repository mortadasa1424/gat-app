import { X, LayoutGrid } from "./icons.jsx";
import { Sound } from "../lib/sound.js";

// Shared question-state + grid rendering for both the mobile overlay (a
// modal sheet opened via "View All Questions") and the desktop inline
// sidebar (Phase 3) — same navigation data/logic, presentation only differs.
export default function NavOverlay({ total, current, answers, marked, onJump, onClose, inline = false, onSubmit = null }) {
  const stateOf = (i) => {
    const answered = answers[i] != null;
    const isMarked = Boolean(marked?.[i]);
    return [i === current && "cur", answered && "ans", isMarked && "mrk", answered && isMarked && "ans-mrk"]
      .filter(Boolean)
      .join(" ");
  };

  const answeredCount = Object.keys(answers || {}).length;
  const remainingCount = Math.max(0, total - answeredCount);

  const panel = (
    <div className={inline ? "navpanel navpanel-inline" : "navpanel"} onClick={inline ? undefined : (e) => e.stopPropagation()}>
      <div className="navpanel-head">
        <h3><LayoutGrid size={18} aria-hidden="true" /> {inline ? "Navigator" : "Navigate Questions"}</h3>
        {!inline && (
          <button onClick={() => { Sound.tap(); onClose(); }} aria-label="Close"><X size={18} /></button>
        )}
      </div>
      <div className="nav-legend">
        <span><i className="lg-cur" /> Current</span>
        <span><i className="lg-ans" /> Answered</span>
        <span><i className="lg-mrk" /> Marked</span>
        <span><i className="lg-ans-mrk" /> Answered + Marked</span>
        <span><i className="lg-emp" /> Empty</span>
      </div>
      <div className="nav-grid">
        {Array.from({ length: total }).map((_, i) => (
          <button key={i} className={`nav-cell ${stateOf(i)}`} style={{ animationDelay: `${i * 0.015}s` }}
            onClick={() => { Sound.tap(); onJump(i); }}>{i + 1}</button>
        ))}
      </div>
      {inline && (
        <div className="navpanel-summary">
          <div className="navpanel-stat"><b>{answeredCount}</b> Answered</div>
          <div className="navpanel-stat"><b>{remainingCount}</b> Remaining</div>
          {onSubmit && (
            <button className="btn-primary navpanel-submit" onClick={() => { Sound.tap(); onSubmit(); }}>Submit Test</button>
          )}
        </div>
      )}
    </div>
  );

  if (inline) return panel;

  return (
    <div className="overlay-sheet" onClick={onClose}>
      {panel}
    </div>
  );
}
