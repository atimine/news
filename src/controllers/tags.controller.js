const tagsModel = require('../models/tags.model')
class TagsController {
	async renderTags(req, res) {
		const tags = await tagsModel.find({})
		res.status(200).json({ success: true, data: tags })
	}
}

module.exports = new TagsController()
