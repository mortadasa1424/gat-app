import { Header, Footer, MainLogo } from "./Home.jsx";
import { diagnose, weakestCategory } from "../lib/scoring.js";

export default function PerformanceReport({ res, dark, onToggleDark, soundOn, onToggleSound, onHome, onBack }) {
  const rows = diagnose(res.rows, (q) => q.generalCategory);
  const weakest = weakestCategory(rows);

  return (
    <div className="screen report screen-enter">
      <Header showBack onBack={onBack} showHome onHome={onHome} dark={dark} onToggleDark={onToggleDark} soundOn={soundOn} onToggleSound={onToggleSound} />
      <MainLogo dark={dark} />
      <div className="report-head">
        <h2>Performance by Skill</h2>
        {weakest && <p className="report-weakest">Your weakest area: <b>{weakest.label}</b></p>}
      </div>
      <div className="scroll-area report-scroll">
        <div className="report-cards">
          {rows.map((r) => <ReportCard key={r.key} r={r} />)}
        </div>
        {rows.length === 0 && <div className="review-empty">No detailed report is available for this attempt.</div>}
      </div>
      <Footer />
    </div>
  );
}

function ReportCard({ r }) {
  const tone = r.pct >= 90 ? "good" : r.pct > 0 ? "mid" : "low";
  return (
    <article className={`perf-card ${tone}`}>
      <div className="perf-top">
        <span className="perf-pct">{r.pct}%</span>
        <h4>{r.label}</h4>
      </div>
      <div className="perf-bar"><i style={{ width: `${r.pct}%` }} /></div>
      <p>{r.feedback}</p>
      <div className="perf-stats">
        <span><b>{r.correct}</b> Correct</span>
        <span><b>{r.incorrect}</b> Incorrect</span>
        <span><b>{r.unanswered}</b> Empty</span>
      </div>
    </article>
  );
}
