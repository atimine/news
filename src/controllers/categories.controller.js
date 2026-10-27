const categoriesService = require('../services/categories.service')

class CategoriesController {
	async renderCategories(req, res) {
		const categories = await categoriesService.returnCategories()
		res.status(200).json({ success: true, data: categories })
	}
}

module.exports = new CategoriesController()
