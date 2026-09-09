# Assistant Change Log

## 2026-06-07 — Footer banner ad placeholder
- Replaced the default app footer with a styled footer banner ad placeholder through `Footer` in `src/components/Home.jsx`.
- Preserved the original course-registration footer as `CourseFooter`.
- Kept `CourseFooter` on the question screen, retake/practice-mistake question screen, and all results pages by updating `src/components/Quiz.jsx` and `src/components/Results.jsx`.
- Added responsive footer ad styles in `src/styles/app.css`.
- Footer banner placeholder dimensions: `360 × 72 px`; responsive width `min(100%, 360px)`; under 360px width, height is `68px`.

## 2026-06-07 — Hardlocked exam question forms
- Hardlocked Math exam to exactly 30 fixed questions: 2 from each of the 15 math categories.
- Hardlocked English exam to exactly 30 fixed questions: 10 Grammar, 10 Vocabulary, and 10 Reading questions.
- Hardlocked التفكير الاستقرائي to exactly 10 fixed questions: 5 الحساب numeric-input questions followed by 5 visual reasoning questions.
- Hardlocked الاختبار الشامل to the exact same locked question sets in the order Math → English → التفكير الاستقرائي.
- Updated `getQuestionSet` in `src/data/banks.js` so locked exam kinds never use randomization, seen-history rotation, or stored random reserved sets.
- Bumped localStorage keys for active attempts and reserved sets to avoid restoring older pre-lock random attempts.
- Left تدرب على المفردات / vocabulary practice rotation unchanged.

## 2026-06-07 — Pop-up ads and results help cleanup
- Added reusable `src/components/PopupAd.jsx`.
- Added browser-side app-open pop-up ad logic in `src/App.jsx`, using localStorage cooldown only; no server-side operations and no lead-form dependency.
- App-open pop-up shows once per hour, has an X close button, and auto-closes after 5 seconds.
- Added finish-exam pop-up ad that appears after any completed quiz/exam reaches results, with an X close button and 5-second auto-close.
- Pop-up ad placeholder dimensions: `80vw × 80vh`, max `640 × 760 px`.
- Removed the “اطّلع على مصادرنا المجانية” button from the “هل تحتاج إلى مساعدة؟” section in `src/components/Results.jsx`.

## 2026-06-10 — Footer banner final image
- Replaced the footer banner placeholder in `src/components/Home.jsx` with the uploaded `360 × 72 px` ITC banner image.
- Added the image asset at `public/assets/ads/itc-footer-banner.png`.
- Added a transparent clickable hotspot over the visible `سجل` button that opens `https://leen.sa/courses/itc?utm_source=Exam&utm_medium=APP&utm_campaign=ITC26` in a new tab.
- Added final image-banner styles in `src/styles/app.css` while preserving the existing footer component API.

## 2026-06-10 — Dark-mode logo replacement
- Added the uploaded dark-compatible logo as `public/assets/brand/leen-logo-dark.png` after removing the solid purple background and preserving transparency.
- Updated `MainLogo` in `src/components/Home.jsx` to switch between the original logo in light mode and the transparent white logo in dark mode.
- Updated all screens that render `MainLogo` to pass the current theme state: Home, exam/vocab select, lead form, quiz, results, review, and performance report.
- Updated the quiz header mini-logo in `src/components/Quiz.jsx` to use the dark-compatible logo in dark mode and the original logo in light mode.

## 2026-06-10 — Final separated popup ad logic
- Replaced the app-open popup placeholder with the uploaded video asset at `public/assets/ads/itc-popup-open.mp4`.
- Kept the app-open popup on a browser-local one-hour cooldown using `localStorage`; no server-side tracking.
- Removed the old 5-second open-popup timer and changed the open popup to close 5 seconds after the video finishes.
- Kept the video audio enabled; the video is not muted.
- Added click/tap behavior on the video itself to open `https://leen.sa/courses/itc?utm_source=Exam&utm_medium=APP&utm_campaign=ITC26` in a new tab.
- Replaced the finish-exam popup placeholder with the uploaded image asset at `public/assets/ads/itc-popup-finish.jpeg`.
- Kept the finish-exam popup showing every time an exam or quiz is completed.
- Added a transparent clickable hotspot over the visible `للتسجيل` button that opens `https://leen.sa/courses/itc?utm_source=Exam&utm_medium=APP&utm_campaign=ITC26` in a new tab.
- Kept the existing popup card viewport/dimensions: `80vw × 80vh`, max `640 × 760 px`.
- Moved the popup close button to the physical top-left and kept it clear/visible.

## 2026-06-10 — Finish popup close behavior refinement
- Confirmed the finish-exam image popup has no automatic close timer.
- Updated the `للتسجيل` hotspot so tapping it both opens `https://leen.sa/courses/itc?utm_source=Exam&utm_medium=APP&utm_campaign=ITC26` in a new tab and closes the popup.
- Kept the X button as the other close method for the finish-exam popup.

## 2026-06-10 — App favicon
- Created a transparent favicon from the uploaded Leen icon by removing the pale background and square-padding it for standard favicon usage.
- Added multi-size favicon assets: `public/favicon.ico`, `public/favicon-16.png`, `public/favicon-32.png`, `public/favicon-48.png`, `public/apple-touch-icon.png`, `public/icon-192.png`, and `public/icon-512.png`.
- Added the favicon and Apple touch icon link tags to `index.html`.
- Preserved the transparent source at `public/assets/brand/leen-favicon-source.png`.

## Final packaging note
- Added Netlify drag-and-drop fallback files in `public/_redirects` and `public/_headers` so the exported `dist` build supports SPA routing and cache headers when deployed directly.
## 2026-06-10 — Ad clarity and video playback fixes

- Rebuilt the footer banner into 1x/2x/3x image assets and added `srcSet` so it stays sharper on high-DPI screens.
- Restored rounded footer banner corners and removed any blur/backdrop/filter effects from ad media.
- Improved the opening video popup so it tries unmuted autoplay, but shows a clear tap-to-play prompt when the browser blocks autoplay with sound.
- Changed the opening popup localStorage key to show the fixed video ad once after redeploy, then continue the one-hour local cooldown.
- Added cache-busting query strings to ad media references.
- Made the finish-ad registration hotspot a button that explicitly opens the course URL in a new tab and closes the popup.


## 2026-06-10 — Popup video timing and footer banner update
- Replaced the opening popup ad video with `public/assets/ads/itc-popup-open.mp4` from `0610.mp4` without re-encoding.
- Delayed the opening popup ad by 15 seconds after app load.
- Kept the opening popup ad cooldown local to the browser using `localStorage`, once per hour.
- Kept the opening popup video muted for autoplay reliability.
- Kept opening popup video click-through to `https://leen.sa/courses/itc?utm_source=Exam&utm_medium=APP&utm_campaign=ITC26` in a new tab.
- Kept the close button on the top-left and retained auto-close 5 seconds after video end.
- Replaced the footer ad banner with `public/assets/ads/itc-footer-banner.png` from the provided 360 × 72 PNG.
- Made the full footer banner clickable to `https://leen.sa/courses/itc?utm_source=Exam&utm_medium=APP&utm_campaign=ITC26` in a new tab.

## 2026-06-10 — 1080×216 footer banner asset
- Replaced the footer banner runtime asset with a 1080×216 PNG generated from the provided 360×72 banner.
- Footer now loads only `/assets/ads/itc-footer-banner.png?v=8` to avoid fallback to lower-density assets.
- Kept the on-screen display ratio at 360×72 CSS pixels for mobile high-DPI sharpness.
- Finish-exam ad still closes on X or after clicking the ad image and opening the ITC course page.

## 2026-06-10 — Popup open video autoplay hardening
- Replaced `public/assets/ads/itc-popup-open.mp4` with the provided no-audio MP4.
- Updated `src/components/PopupAd.jsx` to keep the popup video muted, inline, no-controls, and autoplay-only.
- Added non-interactive autoplay retries on load/media/page visibility events.
- No click-to-play prompt or manual play fallback was added.

## 2026-06-10 — Fix opening popup preload timing
- Removed the buffer/ready-state gate that could prevent the opening popup from appearing.
- Kept immediate hidden preloading of the no-audio MP4.
- Restored the simple behavior: after the 15-second delay, the popup always appears if the 1-hour cooldown allows it.
- No click-to-play UI or manual play prompt was added.

## 2026-06-11 — Opening popup waits only for full video load
- Confirmed the opening popup ad no longer uses a fixed 15-second delay.
- The app starts preloading the opening MP4 immediately when the local one-hour cooldown allows it.
- The popup appears only after the complete MP4 has downloaded and been converted to a Blob URL, so playback can begin from a fully loaded local object URL.
- The Blob URL is revoked after the popup closes to avoid memory leaks.

## 2026-06-11 — Confirmation before leaving performance report
- Added a confirmation modal when the user tries to leave the `الأداء حسب المهارة` screen through the Home button or the Back/return button.
- Modal text: `هل أنت متأكد من رغبتك بالمغادرة؟`
- `نعم` continues to the requested destination; `لا` closes the modal and keeps the user on the report screen.
- Updated `src/App.jsx` only, reusing the existing modal styling so it matches the app design.

## 2026-06-11 — Confirmation before manual exam submission
- Added a confirmation modal when the user taps `إنهاء الاختبار` on the final question.
- Modal text: `هل أنت متأكد من رغبتك بتسليم الاختبار؟`
- `نعم` submits the exam; `لا` closes the modal and keeps the user in the exam.
- Timers pause while the confirmation modal is open; automatic timer-based submission still submits directly when time runs out.
- Updated `src/components/Quiz.jsx`.

## 2026-06-11 — Replace vocabulary practice bank
- Replaced all previous contents of `src/data/vocab.json` with the final audited JSON file `vocab_manual_audit_final(1).json`.
- New vocabulary bank count: 1,400 active questions total.
- `WT` / `word_translation` questions map to the `ترجمة الكلمة` practice mode.
- `FIB` / `fill_blank` questions map to the `املأ الفراغ` practice mode.
- Removed the previous context-question content by fully replacing the data file instead of merging.
- Bumped active-attempt, history, reserved-set, and last-attempt localStorage keys so old saved vocabulary state does not carry into the new bank.
- Updated `src/data/banks.js` to ignore vocabulary rows marked `active: false` if future audits include inactive rows.

## 2026-06-11 — Confirmation popups for results navigation and mistake practice
- Added a confirmation modal when the user taps Home from the `نتيجة الاختبار` / results page.
- Added a confirmation modal when the user taps Home from `مراجعة الإجابات`.
- Changed `الأداء حسب المهارة` so the confirmation appears only when tapping Home; the Back/return button now goes directly back to the results page.
- Standardized the Home-return confirmation text to: `هل ترغب بالعودة إلى القائمة الرئيسية؟` with `نعم` / `لا` buttons.
- Added a confirmation modal before starting `تدرب على الأخطاء`.
- Mistake-practice confirmation text: `هل ترغب بإعادة الاختبار؟` with the smaller muted note: `سيتم إعادة الأسئلة التي لم تجبها أو الأسئلة التي أجبتها بشكل خاطئ`.
- Updated `src/App.jsx` and `src/styles/app.css`.
