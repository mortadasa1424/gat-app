import { Sound } from "../lib/sound.js";
import { COURSE_URL, PROMO_ASSETS } from "../config/marketing.js";
import { Home as HomeIcon, Sun, Moon, Volume2, VolumeX, ChevronRight, Calculator, BookOpen } from "./icons.jsx";

const LIGHT_LOGO_URL = "/assets/brand/leen-logo.png";
const DARK_LOGO_URL = "/assets/brand/leen-logo-dark.png";

export function getLeenLogoSrc(dark) {
  if (typeof dark === "boolean") return dark ? DARK_LOGO_URL : LIGHT_LOGO_URL;
  if (typeof document !== "undefined") return document.body.classList.contains("light") ? LIGHT_LOGO_URL : DARK_LOGO_URL;
  return DARK_LOGO_URL;
}

export default function Home({ onPickQuant, onPickVerbal, dark, onToggleDark, soundOn, onToggleSound }) {
  return (
    <div className="screen home screen-enter">
      <Header dark={dark} onToggleDark={onToggleDark} soundOn={soundOn} onToggleSound={onToggleSound} />

      <div className="home-entry">
        <div className="home-copy">
          <MainLogo dark={dark} />
          <h1 className="home-title">Free GAT Exam Practice</h1>
          <p className="home-lede">Quantitative and Verbal practice tests, built to mirror the real GAT exam.</p>
        </div>

        <div className="home-options" role="group" aria-label="Choose a section">
          <button className="entry-option" onClick={() => { Sound.tap(); onPickQuant(); }}>
            <span className="entry-option-icon"><Calculator size={22} aria-hidden="true" /></span>
            <span className="entry-option-body">
              <span className="entry-option-title">Quantitative Section</span>
              <span className="entry-option-sub">Practice all three Quantitative tests</span>
            </span>
            <ChevronRight className="entry-option-chevron" size={18} aria-hidden="true" />
          </button>

          <button className="entry-option" aria-label="Verbal Section" onClick={() => { Sound.tap(); onPickVerbal(); }}>
            <span className="entry-option-icon"><BookOpen size={22} aria-hidden="true" /></span>
            <span className="entry-option-body">
              <span className="entry-option-title">Verbal Section</span>
              <span className="entry-option-sub">Practice all three Verbal tests</span>
            </span>
            <ChevronRight className="entry-option-chevron" size={18} aria-hidden="true" />
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export function Header({ dark, onToggleDark, soundOn, onToggleSound, showHome = false, onHome, extraControls = null, showBack = false, onBack }) {
  return (
    <header className="appbar clean-appbar" dir="ltr">
      <div className="appbar-icons-left">
        <button className="icon-btn" onClick={() => { Sound.tap(); onToggleDark?.(); }} aria-label="Theme">
          {dark ? <Moon size={20} aria-hidden="true" /> : <Sun size={20} aria-hidden="true" />}
        </button>
        <button className="icon-btn" onClick={() => { Sound.tap(); onToggleSound?.(); }} aria-label="Sound">
          {soundOn ? <Volume2 size={20} aria-hidden="true" /> : <VolumeX size={20} aria-hidden="true" />}
        </button>
        {extraControls}
        {showHome && (
          <button className="icon-btn home-icon-btn" onClick={() => { Sound.tap(); onHome?.(); }} aria-label="Home">
            <HomeIcon size={20} aria-hidden="true" />
          </button>
        )}
      </div>
      {showBack && (
        <button className="icon-btn return-top" onClick={() => { Sound.tap(); onBack?.(); }} aria-label="Back">
          <ChevronRight size={20} aria-hidden="true" />
        </button>
      )}
    </header>
  );
}

export function MainLogo({ dark } = {}) {
  return (
    <div className="main-logo" aria-label="Leen">
      <img src={getLeenLogoSrc(dark)} alt="Leen" />
    </div>
  );
}

export function Footer() {
  if (!PROMO_ASSETS.footerBanner) return <CourseFooter />;
  return (
    <footer className="appfooter ad-footer" aria-label="GAT course ad">
      <a className="footer-ad-banner" href={COURSE_URL} target="_blank" rel="noreferrer" aria-label="Enroll in the GAT course now">
        <img className="footer-ad-img" src={PROMO_ASSETS.footerBanner} alt="GAT course" loading="eager" decoding="async" draggable="false" />
      </a>
    </footer>
  );
}

export function CourseFooter() {
  return (
    <footer className="appfooter clean-footer course-footer">
      <span>To enroll in the GAT prep course, click </span>
      <a href={COURSE_URL} target="_blank" rel="noreferrer">here</a>
    </footer>
  );
}
