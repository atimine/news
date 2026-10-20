const newsModel = require('../models/news.model')
const slugify = require('slugify')

class NewsController {
	async renderNews(req, res) {
		const news = await newsModel.find({})
		res.status(200).json({ success: true, data: news })
	}

	async searchNews(req, res) {
		res.json({ message: 'Welcome to Searching news' })
	}

	async getMyNews(req, res) {
		res.json({ message: 'Welcome to My news' })
	}

	async getOneNews(req, res) {
		res.json({ message: 'Welcome to One news' })
	}

	async createNews(req, res) {
		const { title, description, category, author, tags } = req.body

		if (!title && !description && !category && !author && !tags) {
			return res.status(400).json({
				success: false,
				message: 'Validation error',
				errors: [
					{
						fields: [title, description, category, author, tags],
						message: 'Fields are wrong',
					},
				],
			})
		}

		const slug = slugify(title).toLowerCase()

		const news = await newsModel.create({
			title,
			description,
			slug,
			category,
			author,
			tags,
		})

		res.status(201).json({ success: true, data: news })
	}

	async editNews(req, res) {
		res.json({ message: 'Welcome to Edit News' })
	}

	async deleteNews(req, res) {
		const id = req.params.id
		const deletedNews = await newsModel.findByIdAndDelete(id)
		res.status(200).json({ success: true, data: deletedNews })
	}

	changePassword(req, res) {
		res.json({ message: 'Welcome to Change Password' })
	}
}

module.exports = new NewsController()
