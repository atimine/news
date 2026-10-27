const categoriesRepo = require('../repositories/categories.repo')

class CategoriesService {
	async returnCategories() {
		const categories = await categoriesRepo.findCategories()
		return categories
	}
}

module.exports = new CategoriesService()
