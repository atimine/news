const newsModel = require('../models/news.model')
const tagsModel = require('../models/tags.model')

class TagsController {
	async renderTags(req, res) {
		const tags = await tagsModel.find({})
		res.status(200).json({ success: true, data: tags })
	}

	async getOneTag(req, res) {
		const tag = await tagsModel.findOne({ _id: req.params.id })

		if (!tag)
			return res.status(404).json({ success: false, message: 'Tag Not Found' })

		const ralatedNews = await newsModel
			.find({ tags: tag._id })
			.populate(['category', 'tags'])
			.populate('author', 'name')

		res.status(200).json({ success: true, data: { tag, news: ralatedNews } })
	}
}

module.exports = new TagsController()
