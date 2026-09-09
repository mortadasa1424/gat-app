// Centralized external/marketing config. Swap the values here, not the call sites.

export const COURSE_URL_BASE = "https://leen.sa/courses/gat-qudrat";
export const UTM_PARAMS = "utm_source=APP&utm_medium=Exam&utm_campaign=GAT26";
export const COURSE_URL = `${COURSE_URL_BASE}?${UTM_PARAMS}`;

export const WHATSAPP_NUMBER = "966557841489";
export const WHATSAPP_URL = `https://api.whatsapp.com/send/?phone=${WHATSAPP_NUMBER}&text&type=phone_number&app_absent=0`;

export const PROMO_ASSETS = {
  openPopupVideo: null, // TODO: provide GAT opening popup video/image once available
  finishPopupImage: null, // TODO: provide GAT finish-exam popup image once available
  footerBanner: "/assets/marketing/gat-course-banner2.png",
};

// Unified overall test timer applied to every test (single timer, no
// per-question timers). Centralized here so it's never hardcoded elsewhere.
export const DEFAULT_TEST_MINUTES = 60;
