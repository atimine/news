const categoriesModel = require('../models/categories.model')

class CategoriesController {
	async renderCategories(req, res) {
		const categories = await categoriesModel.find({})
		res.status(200).json({ success: true, data: categories })
	}
}

module.exports = new CategoriesController()
