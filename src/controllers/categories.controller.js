const mongoose = require('mongoose')
const categoriesModel = require('../models/categories.model')
const newsModel = require('../models/news.model')

class CategoriesController {
	async renderCategories(req, res) {
		const categories = await categoriesModel.find({})
		res.status(200).json({ success: true, data: categories })
	}

	async getOneCategory(req, res) {
		if (!mongoose.isObjectIdOrHexString(req.params.id)) {
			return res
				.status(400)
				.json({ success: false, message: 'Given ID is not in right format' })
		}

		const category = await categoriesModel
			.findOne({ _id: req.params.id })
			.populate('news')

		if (!category)
			return res
				.status(404)
				.json({ success: false, message: 'Category Not Found' })

		res.status(200).json({ success: true, data: category })
	}
}

module.exports = new CategoriesController()
