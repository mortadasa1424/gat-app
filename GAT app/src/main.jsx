import ReactDOM from "react-dom/client";
import App from "./App.jsx";

// iOS Chrome (CriOS) draws its own browser chrome outside the private
// dynamic-toolbar API that only Safari's WebKit gets to use, so CSS viewport
// units alone (vh/dvh/svh) can still size a position:fixed shell taller than
// what's actually visible there, even though the same units are correct in
// Safari. window.visualViewport.height reflects the real, live rendering
// surface WKWebView hands to whichever browser hosts it, so mirror it into a
// CSS custom property and let the couple of viewport-height-sensitive rules
// in app.css (the fixed app shell and the promo popup overlay) prefer it
// over the CSS-unit fallbacks that already work everywhere else.
function syncViewportHeight() {
  const h = window.visualViewport?.height ?? window.innerHeight;
  document.documentElement.style.setProperty("--app-viewport-height", `${h}px`);
}
syncViewportHeight();
window.addEventListener("resize", syncViewportHeight);
window.visualViewport?.addEventListener("resize", syncViewportHeight);
window.visualViewport?.addEventListener("scroll", syncViewportHeight);
// A couple of short re-checks after first load, in addition to the resize
// listeners above: a cold-launched browser (e.g. iOS Chrome opened from an
// external deep link) can report a still-settling viewport size on that
// very first frame, before its own UI has finished animating in — often
// without firing a resize event once it does settle. These catch that
// case a moment later without waiting on an event that may not come.
setTimeout(syncViewportHeight, 300);
setTimeout(syncViewportHeight, 1200);

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
