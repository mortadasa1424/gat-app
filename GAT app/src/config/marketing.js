// Centralized external/marketing config. Everything here is a placeholder
// until Leen provides the final GAT course URL, UTM values, WhatsApp number,
// and promotional assets — swap the values, not the call sites.

export const COURSE_URL_BASE = "https://leen.sa/courses/gat"; // TODO: confirm final GAT course URL
export const UTM_PARAMS = "utm_source=Exam&utm_medium=APP&utm_campaign=GAT26"; // TODO: confirm final UTM naming
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
