const rateLimit = require('express-rate-limit')

const limiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    error: 'Rate limit exceeded. Upgrade your plan for more requests.'
  },
  standardHeaders: true,
  legacyHeaders: false
})

module.exports = limiter