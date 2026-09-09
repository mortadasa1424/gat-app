import { Header, Footer, MainLogo } from "./Home.jsx";
import { diagnose } from "../lib/scoring.js";

function sectionRows(res) {
  const mathRows = res.rows.filter((r) => r.q.section === "math");
  const engRows = res.rows.filter((r) => r.q.section === "english");
  const thirdRows = res.rows.filter((r) => r.q.section === "third_section");
  const out = [];
  if (mathRows.length) out.push({ title: "تفصيل الرياضيات", rows: diagnose(mathRows, (q) => q.categoryAr) });
  if (engRows.length) out.push({ title: "تفصيل الإنجليزي", rows: diagnose(engRows, (q) => q.subcategory || q.category, englishLabel) });
  if (thirdRows.length) out.push({ title: "تفصيل التفكير الاستقرائي", rows: diagnose(thirdRows, (q) => q.questionType, thirdLabel) });
  return out;
}

function englishLabel(k) {
  const v = String(k || "").toLowerCase();
  if (v.includes("grammar")) return "القواعد / Grammar";
  if (v.includes("vocab")) return "المفردات / Vocabulary";
  if (v.includes("reading")) return "القراءة / Reading";
  return k;
}
function thirdLabel(k) {
  const v = String(k || "").toLowerCase();
  if (v.includes("numeric") || v.includes("arithmetic")) return "الحساب";
  if (v.includes("multiple") || v.includes("inductive")) return "التفكير الاستقرائي";
  return k;
}

export default function PerformanceReport({ res, dark, onToggleDark, soundOn, onToggleSound, onHome, onBack }) {
  const groups = sectionRows(res);
  return (
    <div className="screen report screen-enter">
      <Header showBack onBack={onBack} showHome onHome={onHome} dark={dark} onToggleDark={onToggleDark} soundOn={soundOn} onToggleSound={onToggleSound} />
      <MainLogo dark={dark} />
      <div className="report-head">
        <h2>الأداء حسب المهارة</h2>
      </div>
      <div className="scroll-area report-scroll">
        {groups.map((g) => <ReportGroup key={g.title} title={g.title} rows={g.rows} />)}
        {groups.length === 0 && <div className="review-empty">لا يوجد تقرير تفصيلي لهذا التدريب.</div>}
      </div>
      <Footer />
    </div>
  );
}

function ReportGroup({ title, rows }) {
  return (
    <section className="report-group">
      <h3>{title}</h3>
      <div className="report-cards">
        {rows.map((r) => <ReportCard key={r.key} r={r} />)}
      </div>
    </section>
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
        <span><b>{r.correct}</b> صحيح</span>
        <span><b>{r.incorrect}</b> خطأ</span>
        <span><b>{r.unanswered}</b> فارغ</span>
      </div>
    </article>
  );
}
