const mongoose = require('mongoose')
const categoriesModel = require('../models/categories.model')
const newsModel = require('../models/news.model')

class CategoriesController {
	async getCategories(req, res) {
		const categories = await categoriesModel.find({})
		res.status(200).json({ success: true, data: categories })
	}

	async getOneCategory(req, res) {
		if (!mongoose.isObjectIdOrHexString(req.params.id)) {
			return res
				.status(400)
				.json({ success: false, message: 'Given ID is not in right format' })
		}

		const existingCategory = await categoriesModel.findOne({
			_id: req.params.id,
		})

		if (!existingCategory)
			return res
				.status(404)
				.json({ success: false, message: 'Category Not Found' })

		const category = await categoriesModel
			.aggregate()
			.match({ _id: new mongoose.Types.ObjectId(req.params.id) })
			.lookup({
				from: 'news',
				localField: '_id',
				foreignField: 'category',
				pipeline: [
					{
						$lookup: {
							from: 'tags',
							localField: 'tags',
							foreignField: '_id',
							as: 'tags',
						},
					},
					{
						$lookup: {
							from: 'users',
							localField: 'author',
							foreignField: '_id',
							pipeline: [{ $project: { name: 1 } }],
							as: 'author',
						},
					},
				],
				as: 'news',
			})

		res.status(200).json({ success: true, data: category })
	}
}

module.exports = new CategoriesController()
