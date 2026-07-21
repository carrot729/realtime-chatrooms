import rateLimit from "express-rate-limit";

/**
 * Rate limiting middleware.
 *
 * Currently applied to:
 *   - send-message: prevents chat spam
 *
 * To add rate limiting to other endpoints, create a new limiter using rateLimit()
 * and apply it in the corresponding route file, following the same pattern as
 * messageLimiter below.
 */

// Window duration in milliseconds (default: 1 minute)
const WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS) || 1 * 60 * 1000;

// Max messages per window (default: 10 messages)
const MESSAGE_MAX = Number(process.env.RATE_LIMIT_MESSAGES) || 10;

/**
 * Message limiter — applied to POST /chatroom/send-message.
 * Prevents users from flooding the chat with rapid-fire messages.
 */
export const messageLimiter = rateLimit({
  windowMs: WINDOW_MS,
  limit: MESSAGE_MAX,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    success: false,
    message: "You are sending messages too fast. Please slow down.",
  },
});
