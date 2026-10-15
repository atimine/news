class CategoriesController {
	async renderCategories(req, res) {
		res.json({ message: 'Welcome to Categories' })
	}
}

module.exports = new CategoriesController()
