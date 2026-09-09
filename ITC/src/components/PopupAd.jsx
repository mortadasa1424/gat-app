import { useEffect, useRef, useState } from "react";
import { Sound } from "../lib/sound.js";

const COURSE_URL = "https://leen.sa/courses/itc?utm_source=Exam&utm_medium=APP&utm_campaign=ITC26";
export const OPEN_VIDEO_SRC = "/assets/ads/itc-popup-open.mp4?v=8";
const FINISH_IMAGE_SRC = "/assets/ads/itc-popup-finish.png?v=4";
const AUTO_CLOSE_AFTER_END_MS = 5000;

function openCourse() {
  const opened = window.open(COURSE_URL, "_blank", "noopener,noreferrer");
  if (opened) opened.opener = null;
}

export function prepareAdVideoForAutoplay(video) {
  if (!video) return;
  // The popup video is intentionally a no-audio MP4. Keep it muted and inline to maximize autoplay reliability across iOS Safari and Chromium browsers.
  video.muted = true;
  video.defaultMuted = true;
  video.volume = 0;
  video.setAttribute("muted", "");
  video.setAttribute("playsinline", "");
  video.setAttribute("webkit-playsinline", "");
  video.removeAttribute("controls");
}

function reportPreloadStatus(onStatus, status) {
  onStatus?.({
    ready: false,
    loadedBytes: 0,
    totalBytes: 0,
    ratio: 0,
    ...status,
  });
}

async function fetchVideoAsObjectUrl({ signal, onStatus }) {
  reportPreloadStatus(onStatus, { phase: "fetching" });

  const response = await fetch(OPEN_VIDEO_SRC, { signal, cache: "force-cache" });
  if (!response.ok) throw new Error(`Failed to preload opening ad video: ${response.status}`);

  const contentLength = Number(response.headers.get("content-length")) || 0;

  if (!response.body?.getReader) {
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    reportPreloadStatus(onStatus, {
      phase: "complete",
      ready: true,
      loadedBytes: blob.size,
      totalBytes: blob.size || contentLength,
      ratio: 1,
      objectUrl,
    });
    return objectUrl;
  }

  const reader = response.body.getReader();
  const chunks = [];
  let loadedBytes = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    loadedBytes += value.byteLength;

    reportPreloadStatus(onStatus, {
      phase: "fetching",
      loadedBytes,
      totalBytes: contentLength,
      ratio: contentLength > 0 ? Math.min(0.99, loadedBytes / contentLength) : 0,
    });
  }

  const blob = new Blob(chunks, { type: response.headers.get("content-type") || "video/mp4" });
  const objectUrl = URL.createObjectURL(blob);
  reportPreloadStatus(onStatus, {
    phase: "complete",
    ready: true,
    loadedBytes: blob.size,
    totalBytes: blob.size || contentLength,
    ratio: 1,
    objectUrl,
  });

  return objectUrl;
}

export function OpenAdVideoPreloader({ enabled = true, onReady, onError, onStatus }) {
  useEffect(() => {
    if (!enabled) return undefined;

    let active = true;
    const controller = new AbortController();

    let preloadLink = document.querySelector(`link[data-leen-open-ad-preload="true"]`);
    if (!preloadLink) {
      preloadLink = document.createElement("link");
      preloadLink.rel = "preload";
      preloadLink.as = "fetch";
      preloadLink.href = OPEN_VIDEO_SRC;
      preloadLink.crossOrigin = "anonymous";
      preloadLink.setAttribute("data-leen-open-ad-preload", "true");
      preloadLink.setAttribute("fetchpriority", "high");
      document.head.appendChild(preloadLink);
    }

    fetchVideoAsObjectUrl({ signal: controller.signal, onStatus })
      .then((objectUrl) => {
        if (!active) {
          URL.revokeObjectURL(objectUrl);
          return;
        }

        // The parent now owns this object URL and must revoke it after the popup closes.
        onReady?.({ src: objectUrl });
      })
      .catch((error) => {
        if (controller.signal.aborted) return;
        reportPreloadStatus(onStatus, { phase: "error", error, ratio: 0 });
        onError?.(error);
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [enabled, onError, onReady, onStatus]);

  return null;
}

export default function PopupAd({ variant = "open", onClose, videoSrc = OPEN_VIDEO_SRC }) {
  const isFinish = variant === "finish";
  const videoRef = useRef(null);
  const [videoEnded, setVideoEnded] = useState(false);

  useEffect(() => {
    if (isFinish || !videoEnded) return undefined;
    const timer = window.setTimeout(() => onClose?.(), AUTO_CLOSE_AFTER_END_MS);
    return () => window.clearTimeout(timer);
  }, [isFinish, onClose, videoEnded]);

  const tryPlayVideo = () => {
    if (isFinish) return;
    const video = videoRef.current;
    if (!video) return;

    prepareAdVideoForAutoplay(video);
    const playAttempt = video.play?.();
    if (playAttempt && typeof playAttempt.catch === "function") {
      playAttempt.catch(() => {
        // Do not show a click-to-play prompt. Some browsers/users can still block autoplay despite a no-audio muted inline video.
      });
    }
  };

  useEffect(() => {
    if (isFinish) return undefined;
    const video = videoRef.current;
    if (!video) return undefined;

    prepareAdVideoForAutoplay(video);

    const retryAutoplay = () => tryPlayVideo();
    const autoplayEvents = ["loadedmetadata", "loadeddata", "canplay", "canplaythrough"];
    autoplayEvents.forEach((eventName) => {
      video.addEventListener(eventName, retryAutoplay);
    });

    const retryTimers = [0, 250, 750, 1500].map((delay) => window.setTimeout(retryAutoplay, delay));
    window.addEventListener("pageshow", retryAutoplay);
    window.addEventListener("focus", retryAutoplay);
    document.addEventListener("visibilitychange", retryAutoplay);

    return () => {
      autoplayEvents.forEach((eventName) => {
        video.removeEventListener(eventName, retryAutoplay);
      });
      retryTimers.forEach((timerId) => window.clearTimeout(timerId));
      window.removeEventListener("pageshow", retryAutoplay);
      window.removeEventListener("focus", retryAutoplay);
      document.removeEventListener("visibilitychange", retryAutoplay);
    };
  }, [isFinish]);

  const closeAd = () => {
    Sound.tap();
    onClose?.();
  };

  const handleVideoClick = () => {
    Sound.tap();
    openCourse();
  };

  const handleFinishAdClick = () => {
    Sound.tap();
    openCourse();
    onClose?.();
  };

  return (
    <div className="ad-pop-overlay" role="dialog" aria-modal="true" aria-label="إعلان">
      <div className={`ad-pop-card ${isFinish ? "finish-ad" : "open-ad"}`}>
        <button
          className="ad-pop-close"
          type="button"
          aria-label="إغلاق الإعلان"
          onClick={closeAd}
        >
          ×
        </button>

        {isFinish ? (
          <button
            className="ad-pop-media ad-pop-image-ad"
            type="button"
            aria-label="للتسجيل في دورة ITC"
            onClick={handleFinishAdClick}
          >
            <img
              className="ad-pop-finish-img"
              src={FINISH_IMAGE_SRC}
              alt="انضم لدورة ITC - تأسيس وتدريب وتجميعات حديثة وبث مباشر ومسجل"
              draggable="false"
            />
          </button>
        ) : (
          <div className="ad-pop-media ad-pop-video-ad">
            <video
              ref={videoRef}
              className="ad-pop-video"
              key={videoSrc}
              src={videoSrc}
              autoPlay
              muted
              defaultMuted
              playsInline
              webkit-playsinline="true"
              preload="auto"
              controls={false}
              controlsList="nodownload nofullscreen noremoteplayback"
              disablePictureInPicture
              disableRemotePlayback
              onClick={handleVideoClick}
              onLoadedMetadata={tryPlayVideo}
              onLoadedData={tryPlayVideo}
              onCanPlay={tryPlayVideo}
              onEnded={() => setVideoEnded(true)}
              aria-label="إعلان دورة ITC"
            />
          </div>
        )}
      </div>
    </div>
  );
}
