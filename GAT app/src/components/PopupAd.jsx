import { createPortal } from "react-dom";
import { Sound } from "../lib/sound.js";
import { COURSE_URL, PROMO_ASSETS } from "../config/marketing.js";
import { X } from "./icons.jsx";

// Video-only promo popup: the card is nothing but the GAT promo video.
// Clicking anywhere on it opens the course link; the circular X only closes
// the popup. The card has no fixed aspect-ratio of its own — it shrink-wraps
// whatever the <video> renders at (see .ad-pop-card.open-ad/.finish-ad in
// app.css), so the box always matches the video's real proportions instead
// of forcing the video into a preset shape.
//
// Rendered via a portal straight onto document.body (not inside .app-root)
// so its position:fixed overlay is always anchored to the true viewport,
// completely independent of any current or future ancestor CSS (a
// transform/filter/perspective/contain anywhere between here and <body>
// would otherwise re-anchor position:fixed descendants to that ancestor
// instead of the viewport) and of app-root's own stacking context.
export default function PopupAd({ variant = "open", onClose }) {
  const closeAd = () => { Sound.tap(); onClose?.(); };
  const openCourse = () => {
    Sound.tap();
    const opened = window.open(COURSE_URL, "_blank", "noopener,noreferrer");
    if (opened) opened.opener = null;
    onClose?.();
  };

  return createPortal(
    <div className="ad-pop-overlay" role="dialog" aria-modal="true" aria-label="Advertisement">
      <div className={`ad-pop-card ${variant === "finish" ? "finish-ad" : "open-ad"}`}>
        <button className="ad-pop-close" type="button" aria-label="Close ad" onClick={closeAd}>
          <X size={15} aria-hidden="true" />
        </button>

        <button className="ad-pop-media ad-pop-video-btn" type="button" aria-label="Enroll in the GAT course" onClick={openCourse}>
          <video
            className="ad-pop-video"
            src={PROMO_ASSETS.promoVideo}
            autoPlay
            loop
            muted
            playsInline
            webkit-playsinline="true"
            disablePictureInPicture
            preload="auto"
          />
        </button>
      </div>
    </div>,
    document.body
  );
}
