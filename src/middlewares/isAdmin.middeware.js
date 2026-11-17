const authenticateToken = require('./authenticate.middleware')
const jwt = require('jsonwebtoken')

function isAdmin(req, res, next) {
	const decoded = jwt.decode(
		req.cookies.jwt_refresh_token,
		process.env.JWT_REFRESH_SECRET,
	)

	if (decoded) {
		if (decoded.role === 'ADMIN') {
			authenticateToken(req, res, next)
		}
	} else {
		next()
	}
}

module.exports = isAdmin
