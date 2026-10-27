const tagsRepo = require('../repositories/tags.repo')

class TagsService {
	async returnTagsList(req, res) {
		const tags = await tagsRepo.findTags()
		return tags
	}
}

module.exports = new TagsService()
