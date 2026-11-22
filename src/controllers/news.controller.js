const { customAlphabet } = require('nanoid')
const newsModel = require('../models/news.model')
const slugify = require('slugify')
const categoriesModel = require('../models/categories.model')
const tagsModel = require('../models/tags.model')
const fs = require('fs/promises')
const path = require('path')
const { fileTypeFromBuffer } = require('file-type')
const { mongoose } = require('mongoose')
const { constants } = require('fs/promises')

const nanoid = customAlphabet('1234567890abcdef', 5)
class NewsController {
	async renderNews(req, res) {
		const { page, limit } = req.query

		const news = await newsModel
			.find({ status: 'PUBLISHED' })
			.limit(limit || 10)
			.skip(page || 0)
			.populate(['category', 'tags'])
			.populate('author', 'name')

		res.status(200).json({
			success: true,
			data: news,
			meta: {
				page: page || 0,
				limit: +limit || 10,
				total: news.length,
				totalPages: 0,
			},
		})
	}

	async searchNews(req, res) {
		const { q, category, tag, sort, page, limit } = req.query

		const pipeline = newsModel
			.aggregate()
			.search({
				index: 'news',
				text: { query: q, path: ['title', 'description'] },
			})
			.match({ status: 'PUBLISHED' })
			.lookup({
				from: 'categories',
				localField: 'category',
				foreignField: '_id',
				as: 'category',
			})
			.lookup({
				from: 'tags',
				localField: 'tags',
				foreignField: '_id',
				as: 'tags',
			})
			.lookup({
				from: 'users',
				localField: 'author',
				foreignField: '_id',
				pipeline: [{ $project: { name: 1 } }],
				as: 'author',
			})
			.limit(limit || 10)
			.skip(page || 0)
			.sort({ updatedAt: sort === 'newest' ? 'desc' : 'asc' })

		if (category) {
			pipeline.match({ 'category.name': category })
		}

		if (tag) {
			pipeline.match({ 'category.name': tag })
		}

		const news = await pipeline.exec()

		res
			.status(200)
			.json({ success: true, data: news, meta: { total: news.length } })
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

		if (!req.isGuest) {
			return res.status(200).json({ success: true, data: oneNews })
		}

		if (['PENDING', 'REJECTED'].includes(oneNews.status))
			return res
				.status(403)
				.json({ sucess: false, message: 'This News Is Not Allowed' })

		res.status(200).json({ success: true, data: oneNews })
	}

	async createNews(req, res) {
		let infoOfFiles = []
		// const allowedFileTypes = ['png', 'jpeg', 'jpg', 'webp']
		// const category = await categoriesModel.findOne({ _id: req.body.category })
		let tags = await tagsModel.find().select('_id')
		const isTagExist = []

		console.log(...tags)

		req.body.tags.forEach(tag => {
			isTagExist.push(tags.includes(tag))
		})

		console.log(isTagExist.find(false))

		// if (!category && !isTagExist.find(false)) {
		// 	return res
		// 		.status(404)
		// 		.json({ success: false, message: 'Category or Tag Not Found' })
		// }

		// if (req.files?.length || false) {
		// 	req.files.forEach(async image => {
		// 		const url = path.join(__dirname, '../', '../uploads', image.filename)
		// 		const buffer = await fs.readFile(url)
		// 		const type = await fileTypeFromBuffer(buffer) // watch out there! fileTypeFromBuffer may return undefined and there will be an error !

		// 		if (!allowedFileTypes.includes(type.ext)) {
		// 			await fs.rm(url)
		// 		}
		// 	})
		// }

		// if (req.notAllowedFiles?.length || false) {
		// 	req.files.forEach(async image => {
		// 		const url = path.join(__dirname, '../', '../uploads', image.filename)
		// 		const existingFile = fs.access(url)

		// 		if (existingFile) {
		// 			await fs.rm(url)
		// 		}
		// 	})

		// 	return res.status(400).json({
		// 		success: false,
		// 		message: 'Only these type of files are supported:  png, jpeg, webp',
		// 	})
		// }

		// req.files.forEach(file => {
		// 	const { filename, mimetype, size } = file
		// 	infoOfFiles.push({
		// 		url: `/uploads/${filename}`,
		// 		filename,
		// 		mimetype,
		// 		size,
		// 	})
		// })

		// let slug = slugify(req.body.title).toLowerCase()
		// let result = await newsModel.find({ slug })

		// if (result.length) {
		// 	slug += `-${nanoid()}`
		// }

		// if (req.user.role === 'ADMIN') {
		// 	const news = await newsModel.create({
		// 		...req.body,
		// 		slug,
		// 		images: infoOfFiles,
		// 		status: 'PUBLISHED',
		// 		author: req.user.userId,
		// 	})

		// 	return res.status(201).json({ success: true, data: news })
		// }

		// const news = await newsModel.create({
		// 	...req.body,
		// 	slug,
		// 	images: infoOfFiles,
		// 	author: req.user.userId,
		// })

		res.status(201).json({ success: true, data: 'news' })
	}

	async editNews(req, res) {
		let infoOfFiles = []
		const id = req.params.id
		const allowedFileTypes = ['png', 'jpeg', 'jpg', 'webp']
		if (!mongoose.isObjectIdOrHexString(id)) {
			return res
				.status(400)
				.json({ success: false, message: 'Given ID is not in right format' })
		}

		const category = await categoriesModel.findOne()
		const tag = await tagsModel.findOne()

		if (category && tag) {
			return res
				.status(404)
				.json({ success: false, message: 'Category or Tag Not Found' })
		}

		//  response with error when user uploads invalid file or edited file
		if (req.files?.length || false) {
			req.files.forEach(async image => {
				const url = path.join(__dirname, '../', '../uploads', image.filename)
				const buffer = await fs.readFile(url)
				const type = await fileTypeFromBuffer(buffer) // watch out there! fileTypeFromBuffer may return undefined and there will be an error !

				if (!allowedFileTypes.includes(type.ext)) {
					await fs.rm(url)
				}
			})
		}

		if (req.notAllowedFiles?.length || false) {
			req.files.forEach(async image => {
				const url = path.join(__dirname, '../', '../uploads', image.filename)
				const existingFile = fs.access(url)

				if (existingFile) {
					await fs.rm(url)
				}
			})

			return res.status(400).json({
				success: false,
				message: 'Only these type of files are supported:  png, jpeg, webp',
			})
		}

		let existingNews = await newsModel.findById({ _id: id })

		if (!existingNews)
			return res.status(404).json({ success: false, message: 'News Not Found' })

		if (existingNews.images.length) {
			existingNews.images.forEach(async image => {
				const url = path.join(__dirname, '../', '../uploads', image.filename)
				await fs.rm(url)
			})
		}

		if (req.files?.length || false) {
			req.files.forEach(file => {
				const { filename, mimetype, size } = file
				infoOfFiles.push({
					url: `/uploads/${filename}`,
					filename,
					mimetype,
					size,
				})
			})

			req.body.images = infoOfFiles
		}

		if (req.user.role === 'ADMIN') {
			const news = await newsModel.findByIdAndUpdate(
				{ _id: id },
				{
					...req.body,
					author: req.user.userId,
				},
			)

			return res.status(200).json({ success: true, data: news })
		}

		existingNews = await newsModel.findByIdAndUpdate(
			{ _id: id },
			{
				...req.body,
				status: 'PENDING',
				author: req.user.userId,
			},
			{ returnDocument: 'after' },
		)

		res.status(200).json({ success: true, data: existingNews })
	}

	async deleteNews(req, res) {
		if (!mongoose.isObjectIdOrHexString(req.params.id)) {
			return res
				.status(400)
				.json({ success: false, message: 'Given ID is not in right format' })
		}

		const id = req.params.id
		const existingNews = await newsModel.findByIdAndDelete(id)

		if (!existingNews)
			return res.status(404).json({ success: false, message: 'News Not Found' })

		existingNews.images.forEach(async image => {
			const url = path.join(__dirname, '../', '../', image.url)
			const existingFile = ''
			try {
				existingFile = await fs.access(url, constants.F_OK)
			} catch (error) {
				console.log(error)
			}

			if (existingFile) {
				await fs.rm(url)
			}
		})

		res.status(200).json({ success: true, data: existingNews })
	}
}

module.exports = new NewsController()
