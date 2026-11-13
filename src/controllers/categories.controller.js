const categoriesModel = require('../models/categories.model')
const newsModel = require('../models/news.model')

class CategoriesController {
	async renderCategories(req, res) {
		const categories = await categoriesModel.find({})
		res.status(200).json({ success: true, data: categories })
	}

	async getOneCategory(req, res) {
		const category = await categoriesModel.findOne({ _id: req.params.id })

		if (!category)
			return res
				.status(404)
				.json({ success: false, message: 'Category Not Found' })

		const ralatedNews = await newsModel
			.find({ category: category._id })
			.populate('tags')
			.populate('author', 'name')

		res
			.status(200)
			.json({ success: true, data: { category, news: ralatedNews } })
	}
}

module.exports = new CategoriesController()
