function authorize(req, res, next) {
	const user = req.user

	if (user.role === 'ADMIN') {
		console.log(user.role)

		return next()
	}
}

module.exports = authorize
