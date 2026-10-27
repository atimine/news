const categoriesModel = require('../models/categories.model')

class CategoriesRepo {
	async findCategories() {
		const categories = await categoriesModel.find({})
		return categories
	}
}

module.exports = new CategoriesRepo()
