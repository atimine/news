const { customAlphabet } = require('nanoid')
const newsModel = require('../models/news.model')
const slugify = require('slugify')

const nanoid = customAlphabet('1234567890abcdef', 5)
class NewsController {
	async renderNews(req, res) {
		const news = await newsModel.find({ status: 'PUBLISHED' })
		res.status(200).json({ success: true, data: news })
	}

	async searchNews(req, res) {
		const { q, category, tag, sort, page, limit } = req.query
		const results = await newsModel
			.find({
				$text: {
					$search: q,
				},
				status: 'PUBLISHED',
			})
			.limit(limit || 10)
			.sort({ createdAt: sort == 'newest' ? -1 : 1 })
			.skip(page || 1)

		res.status(200).json({ success: true, data: results })
	}

	async getMyNews(req, res) {
		const id = req.user.userId
		const newsOfUser = await newsModel.find({
			author: id,
		})

		res.status(200).json({ success: true, data: newsOfUser })
	}

	async getOneNews(req, res) {
		const slug = req.params.slug

		const oneNews = await newsModel.findOne({ slug, status: 'PUBLISHED' })

		if (!oneNews)
			return res.status(404).json({ success: false, message: 'News Not Found' })

		res.status(200).json({ success: true, data: oneNews })
	}

	async createNews(req, res) {
		const { title, description, category, author, tags, images } = req.body

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

		let slug = slugify(title).toLowerCase()

		let result = await newsModel.find({ slug })

		if (result.length) {
			slug += `-${nanoid()}`
		}
		console.log(slug)

		if (req.user.role === 'ADMIN') {
			const news = await newsModel.create({
				title,
				description,
				slug,
				category,
				author,
				tags,
				images,
				status: 'PUBLISHED',
			})

			return res.status(201).json({ success: true, data: news })
		}

		const news = await newsModel.create({
			title,
			description,
			slug,
			category,
			author,
			tags,
			images,
		})

		res.status(201).json({ success: true, data: news })
	}

	async editNews(req, res) {
		const id = req.params.id
		const { title, description, category, author, tags, images } = req.body

		let existingNews = await newsModel.findById({ _id: id })

		if (!existingNews)
			return res.status(404).json({ success: false, message: 'News Not Found' })

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

		let slug = slugify(title).toLowerCase()

		let result = await newsModel.find({ slug })

		if (result.length) {
			slug += `-${nanoid()}`
		}

		if (req.user.role === 'ADMIN') {
			const news = await newsModel.findByIdAndUpdate(
				{ _id: id },
				{
					title,
					description,
					slug,
					category,
					author,
					tags,
					images,
				},
			)

			return res.status(200).json({ success: true, data: news })
		}

		existingNews = await newsModel.findByIdAndUpdate(
			{ _id: id },
			{
				title,
				description,
				slug,
				category,
				author,
				tags,
				images,
				status: 'PENDING',
			},
		)

		res.status(201).json({ success: true, data: existingNews })
	}

	async deleteNews(req, res) {
		const id = req.params.id
		const existingNews = await newsModel.findByIdAndDelete(id)
		res.status(200).json({ success: true, data: existingNews })
	}

	changePassword(req, res) {
		res.json({ message: 'Welcome to Change Password' })
	}
}

module.exports = new NewsController()
