import { Sound } from "../lib/sound.js";
import { COURSE_URL, PROMO_ASSETS } from "../config/marketing.js";
import { X } from "./icons.jsx";

// Simple image/placeholder promo popup. ITC's video-preload/blob-URL machinery
// is intentionally not ported yet — there is no GAT promo video to preload.
// Add that mechanism back if/when a GAT video asset is provided.
export default function PopupAd({ variant = "open", onClose }) {
  const asset = variant === "finish" ? PROMO_ASSETS.finishPopupImage : PROMO_ASSETS.openPopupVideo;

  const closeAd = () => { Sound.tap(); onClose?.(); };
  const openCourse = () => {
    Sound.tap();
    const opened = window.open(COURSE_URL, "_blank", "noopener,noreferrer");
    if (opened) opened.opener = null;
    onClose?.();
  };

  return (
    <div className="ad-pop-overlay" role="dialog" aria-modal="true" aria-label="Advertisement">
      <div className={`ad-pop-card ${variant === "finish" ? "finish-ad" : "open-ad"}`}>
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
    </div>
  );
}
