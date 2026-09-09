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

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
