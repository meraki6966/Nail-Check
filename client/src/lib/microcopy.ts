// ============================================
// NAIL CHECK — LEVEL-UP UX MICRO-COPY SYSTEM
// ============================================
// Purpose: Defines Nail Check's emotional UX language.
// All interface messages reinforce a luxury, supportive,
// beauty-focused digital environment.
// ============================================

export const MICROCOPY = {
  // ============================================
  // 2. LOGIN & AUTHENTICATION
  // ============================================
  LOGIN_SUCCESS: [
    "Welcome back, gorgeous."
  ],
  LOGIN_ERROR: [
    "Deep breath, babes — let's try again.",
    "Almost there. Check your details.",
    "No stress, we'll get you in."
  ],
  PASSWORD_ERROR: [
    "Tiny typo moment — try again."
  ],
  ACCOUNT_CREATED: [
    "Your nail era begins now."
  ],

  // ============================================
  // 3. AI NAIL SEARCH & CREATION BAR
  // ============================================
  AI_IDLE: [
    "Describe your dream set…"
  ],
  AI_PROCESSING: [
    "Designing magic…"
  ],
  AI_GENERATING: [
    "Designing magic…",
    "Bringing your vision to life.",
    "Creating your dream set…"
  ],
  AI_SUCCESS: [
    "Your set is ready ✦"
  ],
  AI_NO_RESULT: [
    "Let's tweak the vibe and try again."
  ],

  // ============================================
  // 4. SAVING & COLLECTIONS
  // ============================================
  SAVE_SUCCESS: [
    "Added to your obsession folder.",
    "Saved for your next set.",
    "This one's a keeper."
  ],
  COLLECTION_CREATED: [
    "Your mood board just got prettier."
  ],
  SAVE_ERROR: [
    "Hmm… let's try saving that again."
  ],

  // ============================================
  // 5. UPLOADING USER DESIGNS
  // ============================================
  UPLOAD_START: [
    "Uploading beauty…"
  ],
  UPLOAD_PROGRESS: [
    "Show us the artistry."
  ],
  UPLOAD_SUCCESS: [
    "She's live ✦"
  ],
  UPLOAD_ERROR: [
    "Almost perfect — try again."
  ],

  // ============================================
  // 6. BROWSING & DISCOVERY
  // ============================================
  NO_RESULTS: [
    "Nothing here yet — try a new vibe."
  ],
  FILTER_APPLIED: [
    "Taste level: immaculate."
  ],
  LOADING_FEED: [
    "Curating inspiration…"
  ],

  // ============================================
  // 7. MEMBERSHIP & PAYMENTS
  // ============================================
  PAYMENT_SUCCESS: [
    "Access unlocked ✦"
  ],
  PAYMENT_FAIL: [
    "Almost there… check your details."
  ],
  PREMIUM_UNLOCK: [
    "Welcome to premium, babe."
  ],

  // ============================================
  // 8. SYSTEM & CONNECTIVITY
  // ============================================
  GENERIC_ERROR: [
    "Oops — tiny glitch moment."
  ],
  NETWORK_ERROR: [
    "Connection taking a beauty break."
  ],
  RETRY_ACTION: [
    "Let's try that again."
  ],
};

// ============================================
// HELPER FUNCTION - Get Random Message
// ============================================
export function getRandomMessage(category: keyof typeof MICROCOPY): string {
  const messages = MICROCOPY[category];
  if (!messages || messages.length === 0) {
    return "";
  }
  const randomIndex = Math.floor(Math.random() * messages.length);
  return messages[randomIndex];
}

// ============================================
// HELPER FUNCTION - Get All Messages for Category
// ============================================
export function getAllMessages(category: keyof typeof MICROCOPY): string[] {
  return MICROCOPY[category] || [];
}

// ============================================
// BRAND LANGUAGE RULES (For Reference)
// ============================================
// 1. Never use harsh technical system language.
// 2. Messages must feel like a stylish best friend speaking.
// 3. Encouraging tone only — never blame the user.
// 4. Short phrases (3–8 words preferred).
// 5. Beauty vocabulary encouraged (polish, glow, vibe, curate, create).
// 6. Rotate phrases randomly to create a premium experience.