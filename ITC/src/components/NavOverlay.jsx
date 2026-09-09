import { Sound } from "../lib/sound.js";

export default function NavOverlay({ total, current, answers, numeric, marked, onJump, onClose }) {
  const stateOf = (i) => {
    const answered = answers[i] != null || (Array.isArray(numeric?.[i]) && numeric[i].some((v) => String(v || "").trim() !== ""));
    const isMarked = Boolean(marked?.[i]);
    return [i === current && "cur", answered && "ans", isMarked && "mrk", answered && isMarked && "ans-mrk"]
      .filter(Boolean)
      .join(" ");
  };
  return (
    <div className="overlay-sheet" onClick={onClose}>
      <div className="navpanel" onClick={(e) => e.stopPropagation()}>
        <div className="navpanel-head">
          <h3>تنقل بين الأسئلة</h3>
          <button onClick={() => { Sound.tap(); onClose(); }}>إغلاق</button>
        </div>
        <div className="nav-legend">
          <span><i className="lg-cur" /> الحالي</span>
          <span><i className="lg-ans" /> مُجاب</span>
          <span><i className="lg-mrk" /> للمراجعة</span>
          <span><i className="lg-ans-mrk" /> مُجاب + مراجعة</span>
          <span><i className="lg-emp" /> فارغ</span>
        </div>
        <div className="nav-grid">
          {Array.from({ length: total }).map((_, i) => (
            <button key={i} className={`nav-cell ${stateOf(i)}`} style={{ animationDelay: `${i * 0.015}s` }}
              onClick={() => { Sound.tap(); onJump(i); }}>{i + 1}</button>
          ))}
        </div>
      </div>
    </div>
  );
}
