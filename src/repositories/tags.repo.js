const tagsModel = require('../models/tags.model')

class TagsRepo {
	async findTags() {
		const tags = await tagsModel.find({})
		return tags
	}
}

module.exports = new TagsRepo()
