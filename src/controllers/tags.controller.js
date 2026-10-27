const tagsService = require('../services/tags.service')
class TagsController {
	async renderTags(req, res) {
		const tags = await tagsService.returnTagsList()
		res.status(200).json({ success: true, data: tags })
	}
}

module.exports = new TagsController()
