import { useState } from "react";
import { Header, Footer, MainLogo } from "./Home.jsx";
import { Sound } from "../lib/sound.js";

const COUNTRIES = [
  { label: "Saudi Arabia", code: "+966", iso: "SA", flagSrc: "/assets/flags/sa.svg" },
  { label: "UAE", code: "+971", iso: "AE", flagSrc: "/assets/flags/ae.svg" },
  { label: "Kuwait", code: "+965", iso: "KW", flagSrc: "/assets/flags/kw.svg" },
  { label: "Qatar", code: "+974", iso: "QA", flagSrc: "/assets/flags/qa.svg" },
  { label: "Bahrain", code: "+973", iso: "BH", flagSrc: "/assets/flags/bh.svg" },
  { label: "Oman", code: "+968", iso: "OM", flagSrc: "/assets/flags/om.svg" },
];

// The displayed label IS the value sent to Apps Script and stored in the
// sheet verbatim — no internal alias/code. Keep these three exact strings in
// sync with Code.gs's ALLOWED_GRADE_LEVELS.
const GRADE_LEVELS = ["10th Grade", "11th Grade", "12th Grade", "Other"];

function normalizeDigits(s) {
  const map = { "٠":"0","١":"1","٢":"2","٣":"3","٤":"4","٥":"5","٦":"6","٧":"7","٨":"8","٩":"9","۰":"0","۱":"1","۲":"2","۳":"3","۴":"4","۵":"5","۶":"6","۷":"7","۸":"8","۹":"9" };
  return String(s).replace(/[٠-٩۰-۹]/g, (d) => map[d]).replace(/\D/g, "");
}
function hasTooManyRepeatedDigits(s) {
  return /(\d)\1{4,}/.test(s);
}
function localFromDisplay(display, countryCode) {
  const codeDigits = normalizeDigits(countryCode);
  let digits = normalizeDigits(display);
  if (digits.startsWith(codeDigits)) digits = digits.slice(codeDigits.length);
  return digits;
}

export default function LeadForm({ dark, onToggleDark, soundOn, onToggleSound, onComplete, onHome }) {
  const [name, setName] = useState("");
  const [country, setCountry] = useState(COUNTRIES[0]);
  const [phone, setPhone] = useState("");
  const [gradeLevel, setGradeLevel] = useState("");
  const [showCountryMenu, setShowCountryMenu] = useState(false);
  const [err, setErr] = useState("");
  const [sending, setSending] = useState(false);

  const validate = () => {
    const p = normalizeDigits(phone);
    if (!p) return "Please enter your phone number";
    if (hasTooManyRepeatedDigits(p)) return "Phone number is invalid";
    if (!gradeLevel) return "Please select your grade level";
    return "";
  };

  const submit = async () => {
    const e = validate();
    if (e) { setErr(e); Sound.warn(); return; }
    setErr(""); setSending(true); Sound.tap();
    const url = window.LEEN_GAT_GOOGLE_SHEETS_WEBHOOK_URL;
    // Form-encoded + no-cors (kept intentionally, not yet reverted): this is a
    // CORS-safelisted simple request, so it reaches Apps Script's doPost with
    // no preflight. mode:"no-cors" makes the response opaque — status/body are
    // unreadable — so success is NOT verified here. Once the write path to the
    // sheet is confirmed working end-to-end, this must be replaced with a
    // verifiable path before onComplete() can be trusted to mean "saved".
    const body = new URLSearchParams({
      name: name.trim() || "",
      phone: country.code + normalizeDigits(phone),
      grade_level: gradeLevel,
      submission_date: new Date().toISOString(),
    });
    try {
      if (!url) throw new Error("missing webhook url");
      await fetch(url, { method: "POST", body, mode: "no-cors" });
      Sound.start();
      onComplete();
    } catch {
      setErr("Couldn't confirm your submission. Check your connection and try again.");
      setSending(false);
    }
  };

  return (
    <div className="screen lead screen-enter">
      <Header showHome onHome={onHome} dark={dark} onToggleDark={onToggleDark} soundOn={soundOn} onToggleSound={onToggleSound} />
      <MainLogo dark={dark} />
      <div className="scroll-area">
        <div className="lead-card clean-lead-card">
          <label className="lead-field"><span>Name (optional)</span>
            <input className="lead-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" /></label>

          <label className="lead-field"><span>Phone Number</span>
            <div className="lead-phone flag-phone" dir="ltr">
              <div className="country-picker-wrap">
                <button type="button" className="country-picker-btn" aria-label="Select country" onClick={() => setShowCountryMenu((v) => !v)}>
                  <img className="country-flag-img" src={country.flagSrc} alt="" />
                  <span className="country-caret">▾</span>
                </button>
                {showCountryMenu && (
                  <div className="country-menu" role="listbox" aria-label="Countries">
                    {COUNTRIES.map((c) => (
                      <button
                        key={c.iso}
                        type="button"
                        className={`country-item ${country.iso === c.iso ? "active" : ""}`}
                        onClick={() => {
                          setCountry(c);
                          setPhone((prev) => localFromDisplay(`${c.code}${prev}`, c.code));
                          setShowCountryMenu(false);
                        }}
                      >
                        <img className="country-flag-img" src={c.flagSrc} alt="" />
                        <span className="country-name">{c.label}</span>
                        <span className="country-code">{c.code}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <input
                className="lead-input phone-full-input"
                value={`${country.code}${phone}`}
                onChange={(e) => setPhone(localFromDisplay(e.target.value, country.code))}
                inputMode="tel"
                dir="ltr"
                placeholder={`${country.code}555579299`}
              />
            </div>
          </label>

          <label className="lead-field"><span>Grade Level</span>
            <div className="lead-chips" role="radiogroup" aria-label="Grade Level">
              {GRADE_LEVELS.map((g) => (
                <button key={g} className={gradeLevel === g ? "on" : ""} onClick={() => { Sound.select(); setGradeLevel(g); }} type="button" role="radio" aria-checked={gradeLevel === g}>{g}</button>
              ))}
            </div></label>

          {err && <div className="lead-error" role="alert">{err}</div>}
          <button className="btn-primary lead-submit" onClick={submit} disabled={sending}>{sending ? "Sending..." : "Start"}</button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
