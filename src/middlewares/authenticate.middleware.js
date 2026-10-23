const jwt = require('jsonwebtoken')

function authenticateToken(req, res, next) {
	const token = req.cookies.jwt_refresh_token
	try {
		const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET)
		req.user = decoded
		next()
	} catch {
		return res.status(401).json({
			message: 'Invalid or expired token',
		})
	}
}

module.exports = authenticateToken
