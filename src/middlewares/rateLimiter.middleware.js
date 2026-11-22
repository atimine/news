const { rateLimit } = require('express-rate-limit')

const rateLimiter = rateLimit({
	windowMs: 15 * 60 * 100, // 15 minutes
	limit: 1,
	standardHeaders: 'draft-8',
	legacyHeaders: false,
	ipv6Subnet: 56,
	handler: (req, res, next) => {
		res.status(429).json({
			success: false,
			message: 'You attamped too many requests. Try again after 15 minutes',
		})
	},
})

module.exports = rateLimiter
