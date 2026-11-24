const { RateLimiterMemory } = require('rate-limiter-flexible')

const rateLimiter = new RateLimiterMemory({
	keyPrefix: 'middleware',
	points: 15,
	duration: 60,
	blockDuration: 900,
})

const rateLimiterMiddleware = (req, res, next) => {
	rateLimiter
		.consume(req.ip)
		.then(() => {
			next()
		})
		.catch(() => {
			res
				.status(429)
				.json('You attapted too many requests. Please try again after a minute')
		})
}

module.exports = rateLimiterMiddleware
