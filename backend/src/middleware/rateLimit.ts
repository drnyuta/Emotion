import rateLimit from "express-rate-limit";

export const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 min
  max: 5, 
  message: {
    success: false,
    error: "Too many requests. Please slow down.",
  },
  standardHeaders: true, 
  legacyHeaders: false,  
});
