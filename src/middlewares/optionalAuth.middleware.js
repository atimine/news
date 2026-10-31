function authGuest(req, res, next) {
	req.cookies.jwt_refresh_token === ''
		? (req.isGuest = true)
		: (req.isGuest = false)

	next()
}

module.exports = authGuest
