const { mongoose } = require('mongoose')
const tagsModel = require('../models/tags.model')

class TagsController {
	async getTags(req, res) {
		const tags = await tagsModel.find()
		res.status(200).json({ success: true, data: tags })
	}

	async getOneTag(req, res) {
		if (!mongoose.isObjectIdOrHexString(req.params.id)) {
			return res
				.status(400)
				.json({ success: false, message: 'Given ID is not in right format' })
		}

		const tag = await tagsModel
			.findOne({ _id: req.params.id })
			.populate('news_tags')

		if (!tag)
			return res.status(404).json({ success: false, message: 'Tag Not Found' })

		res.status(200).json({ success: true, data: tag })
	}
}

module.exports = new TagsController()
