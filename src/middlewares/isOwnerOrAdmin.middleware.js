const newsModel = require('../models/news.model')

async function isOwnerOrAdmin(req, res, next) {
	const id = req.params.id
	let news = ''

	if (req.user.role === 'USER') {
		news = await newsModel.findById({ _id: id })

		if (news.author.toString() !== req.user.userId)
			return res.status(403).json({ success: false, message: 'Not Allowed' })

		return next()
	}

	if (req.user.role !== 'ADMIN')
		return res
			.status(403)
			.json({ success: false, message: 'You Are Not Allowed' })

	next()
}

module.exports = isOwnerOrAdmin
