const { customAlphabet } = require('nanoid')
const newsModel = require('../models/news.model')
const slugify = require('slugify')
const categoriesModel = require('../models/categories.model')
const tagsModel = require('../models/tags.model')
const fs = require('fs')
const path = require('path')

const nanoid = customAlphabet('1234567890abcdef', 5)
class NewsController {
	async renderNews(req, res) {
		const news = await newsModel.find({ status: 'PUBLISHED' })
		res.status(200).json({ success: true, data: news })
	}

	async searchNews(req, res) {
		const { q, category, tag, sort, page, limit } = req.query

		const existingCategory = await categoriesModel.findOne({
			name: { $regex: category, $options: 'i' },
		}) // suppose you will be recieved exact category name!!

		if (!existingCategory)
			return res.status(404).json({ success: false, message: 'News Not Found' })

		const existingTags = await tagsModel.findOne({
			name: { $regex: tag, $options: 'i' },
		})

		const results = await newsModel
			.find({
				$text: {
					$search: q,
				},
				status: 'PUBLISHED',
				category: existingCategory.id,
				tags: existingTags.id,
			})
			.limit(limit || 10)
			.sort({ createdAt: sort == 'newest' ? -1 : 1 })
			.skip(page || 1)
			.populate(['category', 'tags'])
			.populate('author', 'name')

		res
			.status(200)
			.json({ success: true, data: results, meta: { total: results.length } })
	}

	async getMyNews(req, res) {
		const id = req.user.userId
		const newsOfUser = await newsModel
			.find({
				author: id,
			})
			.populate(['category', 'tags'])

		res.status(200).json({ success: true, data: newsOfUser })
	}

	async getOneNews(req, res) {
		const slug = req.params.slug

		const oneNews = await newsModel
			.findOne({ slug })
			.populate(['category', 'tags'])

		if (!oneNews)
			return res.status(404).json({ sucess: false, message: 'Not Found' })

		if (['PENDING', 'REJECTED'].includes(oneNews.status))
			return res
				.status(403)
				.json({ sucess: false, message: 'This News Is Not Allowed' })

		res.status(200).json({ success: true, data: oneNews })
	}

	async createNews(req, res) {
		// check tags and categories existing in the db!!!
		let infoOfFiles = []

		req.files.forEach(file => {
			const { filename, mimetype, size } = file
			infoOfFiles.push({
				url: `/uploads/${filename}`,
				filename,
				mimetype,
				size,
			})
		})

		let slug = slugify(req.body.title).toLowerCase()
		let result = await newsModel.find({ slug })

		if (result.length) {
			slug += `-${nanoid()}`
		}

		if (req.user.role === 'ADMIN') {
			const news = await newsModel.create({
				...req.body,
				slug,
				images: infoOfFiles,
				status: 'PUBLISHED',
				author: req.user.userId,
			})

			return res.status(201).json({ success: true, data: news })
		}

		const news = await newsModel.create({
			...req.body,
			slug,
			images: infoOfFiles,
			author: req.user.userId,
		})

		res.status(201).json({ success: true, data: news })
	}

	async editNews(req, res) {
		const id = req.params.id
		const { error, value } = creatingNewsSchema.validate({ ...req.body })
		let infoOfFiles = []

		let existingNews = await newsModel.findById({ _id: id })

		if (!existingNews)
			return res.status(404).json({ success: false, message: 'News Not Found' })

		if (error) {
			return res.status(400).json({
				success: false,
				message: error.message,
				errors: [
					{
						fields: { ...req.body },
						message: error.message,
					},
				],
			})
		}

		if (req.files.length) {
			req.files.forEach(file => {
				const { path, filename, mimetype, size } = file
				infoOfFiles.push({
					url: `/uploads/${filename}`,
					filename,
					mimetype,
					size,
				})
			})

			value.images = infoOfFiles
		}

		if (req.user.role === 'ADMIN') {
			const news = await newsModel.findByIdAndUpdate(
				{ _id: id },
				{
					...value,
					author: req.user.userId,
				},
			)

			return res.status(200).json({ success: true, data: news })
		}

		existingNews = await newsModel.findByIdAndUpdate(
			{ _id: id },
			{
				...value,
				status: 'PENDING',
				author: req.user.userId,
			},
		)

		res.status(200).json({ success: true, data: existingNews })
	}

	async deleteNews(req, res) {
		const id = req.params.id
		const existingNews = await newsModel.findByIdAndDelete(id)

		if (!existingNews)
			return res.status(404).json({ success: false, message: 'News Not Found' })

		existingNews.images.forEach(image => {
			const url = path.join(__dirname, '../', '../', image.url)
			const existingFile = fs.existsSync(url)

			if (existingFile) {
				fs.rm(url, err => {
					if (err) {
						throw new Error(err)
					}
				})
			}
		})

		res.status(200).json({ success: true, data: existingNews })
	}
}

module.exports = new NewsController()
