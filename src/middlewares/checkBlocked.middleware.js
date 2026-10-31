const usersModel = require('../models/users.model')

async function checkBlocked(req, res, next) {
	const { email } = req.body

	const user = await usersModel.find({ email }).select('-password')

	if (user[0].isBlocked)
		return res.status(403).json({
			success: false,
			message: 'You Are Blocked!',
			blockReason: user[0].blockReason,
		})

	next()
}

module.exports = checkBlocked
