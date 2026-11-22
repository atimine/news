function authGuest(req, res, next) {
	console.log(req.cookies)
	req.cookies.jwt_refresh_token === ''
		? (req.isGuest = true)
		: (req.isGuest = false)

	next()
}

module.exports = authGuest
