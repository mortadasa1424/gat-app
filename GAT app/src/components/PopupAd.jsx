import { createPortal } from "react-dom";
import { Sound } from "../lib/sound.js";
import { COURSE_URL, PROMO_ASSETS } from "../config/marketing.js";
import { X } from "./icons.jsx";

// Simple image/placeholder promo popup. ITC's video-preload/blob-URL machinery
// is intentionally not ported yet — there is no GAT promo video to preload.
// Add that mechanism back if/when a GAT video asset is provided.
//
// Rendered via a portal straight onto document.body (not inside .app-root)
// so its position:fixed overlay is always anchored to the true viewport,
// completely independent of any current or future ancestor CSS (a
// transform/filter/perspective/contain anywhere between here and <body>
// would otherwise re-anchor position:fixed descendants to that ancestor
// instead of the viewport) and of app-root's own stacking context.
export default function PopupAd({ variant = "open", onClose }) {
  const asset = variant === "finish" ? PROMO_ASSETS.finishPopupImage : PROMO_ASSETS.openPopupVideo;

  const closeAd = () => { Sound.tap(); onClose?.(); };
  const openCourse = () => {
    Sound.tap();
    const opened = window.open(COURSE_URL, "_blank", "noopener,noreferrer");
    if (opened) opened.opener = null;
    onClose?.();
  };

  return createPortal(
    <div className="ad-pop-overlay" role="dialog" aria-modal="true" aria-label="Advertisement">
      {/* has-media only when there's an actual video/image asset — that's
          the one case the fixed 9:16 aspect-ratio below makes sense for.
          Right now PROMO_ASSETS.openPopupVideo/finishPopupImage are both
          null, so every live popup is the plain-text placeholder branch,
          which sizes to its own (small) content instead. */}
      <div className={`ad-pop-card ${variant === "finish" ? "finish-ad" : "open-ad"}${asset ? " has-media" : ""}`}>
        <button className="ad-pop-close" type="button" aria-label="Close ad" onClick={closeAd}>
          <X size={20} aria-hidden="true" />
        </button>

        {asset ? (
          <button className="ad-pop-media ad-pop-image-ad" type="button" aria-label="Enroll in the GAT course" onClick={openCourse}>
            <img className="ad-pop-finish-img" src={asset} alt="Join the GAT course" draggable="false" />
          </button>
        ) : (
          <div className="ad-pop-media ad-pop-placeholder">
            <p>The complete GAT course is coming soon</p>
            <button className="btn-primary" type="button" onClick={openCourse}>Register Your Interest</button>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
