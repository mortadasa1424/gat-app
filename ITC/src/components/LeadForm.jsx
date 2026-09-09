import { useState } from "react";
import { Header, Footer, MainLogo } from "./Home.jsx";
import { Sound } from "../lib/sound.js";

const COUNTRIES = [
  { ar: "السعودية", code: "+966", iso: "SA", flagSrc: "/assets/flags/sa.svg" },
  { ar: "الإمارات", code: "+971", iso: "AE", flagSrc: "/assets/flags/ae.svg" },
  { ar: "الكويت", code: "+965", iso: "KW", flagSrc: "/assets/flags/kw.svg" },
  { ar: "قطر", code: "+974", iso: "QA", flagSrc: "/assets/flags/qa.svg" },
  { ar: "البحرين", code: "+973", iso: "BH", flagSrc: "/assets/flags/bh.svg" },
  { ar: "عُمان", code: "+968", iso: "OM", flagSrc: "/assets/flags/om.svg" },
];
const STUDENT_TYPES = ["ثانوي", "دبلوم", "غير ذلك"];

function normalizeDigits(s) {
  const map = { "٠":"0","١":"1","٢":"2","٣":"3","٤":"4","٥":"5","٦":"6","٧":"7","٨":"8","٩":"9","۰":"0","۱":"1","۲":"2","۳":"3","۴":"4","۵":"5","۶":"6","۷":"7","۸":"8","۹":"9" };
  return String(s).replace(/[٠-٩۰-۹]/g, (d) => map[d]).replace(/\D/g, "");
}

function hasTooManyRepeatedDigits(s) {
  return /(\d)\1{4,}/.test(s); // reject 5+ identical digits in a row; allow up to 4
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
  const [stype, setStype] = useState("");
  const [showCountryMenu, setShowCountryMenu] = useState(false);
  const [err, setErr] = useState("");
  const [sending, setSending] = useState(false);

  const validate = () => {
    if (!name.trim()) return "الرجاء إدخال الاسم";
    if (!stype) return "الرجاء اختيار نوع الطالب";
    const p = normalizeDigits(phone);
    if (!p) return "الرجاء إدخال رقم الجوال";
    if (hasTooManyRepeatedDigits(p)) return "رقم الجوال غير صحيح";
    return "";
  };

  const submit = async () => {
    const e = validate();
    if (e) { setErr(e); Sound.warn(); return; }
    setErr(""); setSending(true); Sound.tap();
    const payload = {
      submission_date: new Date().toISOString(),
      name: name.trim(),
      phone: country.code + normalizeDigits(phone),
      student_type: stype,
    };
    try {
      const url = window.LEEN_GOOGLE_SHEETS_WEBHOOK_URL;
      if (url) await fetch(url, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(payload) });
      Sound.start();
      onComplete();
    } catch {
      setErr("لم يتم تأكيد إرسال البيانات. تأكد من الاتصال ثم حاول مرة أخرى.");
      setSending(false);
    }
  };

  return (
    <div className="screen lead screen-enter">
      <Header showHome onHome={onHome} dark={dark} onToggleDark={onToggleDark} soundOn={soundOn} onToggleSound={onToggleSound} />
      <MainLogo dark={dark} />
      <div className="scroll-area">
        <div className="lead-card clean-lead-card">
          <label className="lead-field"><span>الاسم</span>
            <input className="lead-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="اسمك الكامل" /></label>

          <label className="lead-field"><span>رقم الجوال</span>
            <div className="lead-phone flag-phone" dir="ltr">
              <div className="country-picker-wrap">
                <button type="button" className="country-picker-btn" aria-label="اختيار الدولة" onClick={() => setShowCountryMenu((v) => !v)}>
                  <img className="country-flag-img" src={country.flagSrc} alt="" />
                  <span className="country-caret">▾</span>
                </button>
                {showCountryMenu && (
                  <div className="country-menu" role="listbox" aria-label="الدول">
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
                        <span className="country-name">{c.ar}</span>
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

          <label className="lead-field"><span>نوع الطالب</span>
            <div className="lead-chips">
              {STUDENT_TYPES.map((t) => <button key={t} className={stype === t ? "on" : ""} onClick={() => { Sound.select(); setStype(t); }} type="button">{t}</button>)}
            </div></label>

          {err && <div className="lead-error">{err}</div>}
          <button className="btn-primary lead-submit" onClick={submit} disabled={sending}>{sending ? "جاري الإرسال..." : "ابدأ"}</button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
