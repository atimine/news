const jwt = require('jsonwebtoken')

function signAccessJwt(user) {
	const access_token = jwt.sign(
		{
			userId: user.id,
			userEmail: user.email,
			role: user.role,
			tokenVersion: user.tokenVersion,
		},
		process.env.JWT_ACCESS_SECRET,
		{ expiresIn: process.env.JWT_ACCESS_EXPIRES },
	)

	return access_token
}

function signRefreshJwt(user) {
	const refresh_token = jwt.sign(
		{
			userId: user.id,
			userEmail: user.email,
			role: user.role,
			tokenVersion: user.tokenVersion,
		},
		process.env.JWT_REFRESH_SECRET,
		{ expiresIn: process.env.JWT_REFRESH_EXPIRES },
	)

	return refresh_token
}

module.exports = { signAccessJwt, signRefreshJwt }
