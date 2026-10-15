class TagsController {
	async renderTags(req, res) {
		res.json({ message: 'Welcome to Auth' })
	}
}

module.exports = new TagsController()
