function authorize(req, res, next) {
	if (req.user.role === 'ADMIN') {
		return next()
	}

	res.status(403).json({ success: false, message: 'You Are Not Allowed' })
}

module.exports = authorize
