import { Sound } from "../lib/sound.js";

const COURSE_URL = "https://leen.sa/courses/itc?utm_source=Exam&utm_medium=APP&utm_campaign=ITC26";
const LIGHT_LOGO_URL = "/assets/brand/leen-logo.png";
const DARK_LOGO_URL = "/assets/brand/leen-logo-dark.png";

export function getLeenLogoSrc(dark) {
  if (typeof dark === "boolean") return dark ? DARK_LOGO_URL : LIGHT_LOGO_URL;
  if (typeof document !== "undefined") return document.body.classList.contains("light") ? LIGHT_LOGO_URL : DARK_LOGO_URL;
  return DARK_LOGO_URL;
}

export default function Home({ onPickMockExams, onPickVocab, dark, onToggleDark, soundOn, onToggleSound }) {
  return (
    <div className="screen home screen-enter">
      <Header dark={dark} onToggleDark={onToggleDark} soundOn={soundOn} onToggleSound={onToggleSound} />

      <div className="home-hero clean-hero">
        <MainLogo dark={dark} />
        <h1>تدريب مجاني على اختبار ITC</h1>
      </div>

      <div className="home-cards">
        <button className="home-card c-exam" onClick={() => { Sound.tap(); onPickMockExams(); }}>
          <span className="aura" />
          <span className="home-card-icon">📝</span>
          <span className="home-card-title">الاختبارات التجريبية</span>
          <span className="home-card-sub">تدرب على أقسام اختبار ITC الثلاثة</span>
        </button>

        <button className="home-card c-vocab" aria-label="مفردات الإنجليزي" onClick={() => { Sound.tap(); onPickVocab(); }}>
          <span className="aura" />
          <span className="home-card-icon">📚</span>
          <span className="home-card-title">تدريب المفردات</span>
          <span className="home-card-sub">تدرب على أهم المفردات في اختبار ITC</span>
        </button>
      </div>

      <Footer />
    </div>
  );
}

export function Header({ dark, onToggleDark, soundOn, onToggleSound, showHome = false, onHome, extraControls = null, showBack = false, onBack }) {
  return (
    <header className="appbar clean-appbar" dir="ltr">
      <div className="appbar-icons-left">
        <button className="icon-btn" onClick={() => { Sound.tap(); onToggleDark?.(); }} aria-label="السمة">
          <span className="ic">{dark ? "🌙" : "☀️"}</span>
        </button>
        <button className="icon-btn" onClick={() => { Sound.tap(); onToggleSound?.(); }} aria-label="الصوت">
          <span className="ic">{soundOn ? "🔊" : "🔇"}</span>
        </button>
        {extraControls}
        {showHome && (
          <button className="icon-btn home-icon-btn" onClick={() => { Sound.tap(); onHome?.(); }} aria-label="الرئيسية">
            <img className="home-icon-img" src="/assets/icons/home-icon.svg" alt="" aria-hidden="true" />
          </button>
        )}
      </div>
      {showBack && (
        <button className="icon-btn return-top" onClick={() => { Sound.tap(); onBack?.(); }} aria-label="رجوع">
          <span className="ic">↩</span>
        </button>
      )}
    </header>
  );
}

export function MainLogo({ dark } = {}) {
  return (
    <div className="main-logo" aria-label="لين">
      <img src={getLeenLogoSrc(dark)} alt="لين" />
    </div>
  );
}

export function Footer() {
  return (
    <footer className="appfooter ad-footer" aria-label="إعلان دورة ITC">
      <a
        className="footer-ad-banner"
        href={COURSE_URL}
        target="_blank"
        rel="noreferrer"
        aria-label="سجل الآن في دورة ITC"
      >
        <img
          className="footer-ad-img"
          src="/assets/ads/itc-footer-banner.png?v=9"
          alt="دورة ITC الشاملة - 1400 سؤال من التجميعات الحديثة"
          width="1125"
          height="225"
          loading="eager"
          decoding="async"
          draggable="false"
        />
      </a>
    </footer>
  );
}

export function CourseFooter() {
  return (
    <footer className="appfooter clean-footer course-footer">
      <span>للتسجيل في دورة الاستعداد لاختبار ITC اضغط </span>
      <a href={COURSE_URL} target="_blank" rel="noreferrer">هنا</a>
    </footer>
  );
}
