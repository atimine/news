const usersModel = require('../models/users.model')

async function checkBlocked(req, res, next) {
	const { email } = req.body

	const user = await usersModel.findOne({ email }).select('-password')

	if (user.isBlocked)
		return res.status(403).json({
			success: false,
			message: 'You Are Blocked!',
			blockReason: user.blockReason,
		})

	next()
}

module.exports = checkBlocked
