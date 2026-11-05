const categoriesModel = require('../models/categories.model')
const newsModel = require('../models/news.model')
const tagsModel = require('../models/tags.model')
const slugify = require('slugify')
const usersModel = require('../models/users.model')
class AdminController {
	async renderStatistics(req, res) {
		const users = await usersModel.countDocuments({})
		const news = await newsModel.find({})

		const pendingNews = news.filter(news => news.status === 'PENDING').length
		const publishedNews = news.filter(
			news => news.status === 'PUBLISHED',
		).length
		const rejectedNews = news.filter(news => news.status === 'REJECTED').length

		res.status(200).json({
			success: true,
			data: {
				totalUsers: users,
				totalNews: news.length,
				pendingNews,
				publishedNews,
				rejectedNews,
			},
		})
	}

	async renderNews(req, res) {
		const news = await newsModel.find({})
		res.json({ success: true, data: news })
	}

	async approveNews(req, res) {
		const id = req.params.id

		const approvedNews = await newsModel.findByIdAndUpdate(
			{ _id: id },
			{ status: 'PUBLISHED' },
		)

		if (!approvedNews)
			return res.status(404).json({
				success: false,
				message: 'News Not Found',
			})

		res.status(200).json({ success: true, message: 'Welcome to Approve news' })
	}

	async rejectNews(req, res) {
		const id = req.params.id
		const { rejectReason } = req.body

		const rejectedNews = await newsModel.findByIdAndUpdate(
			{ _id: id },
			{ status: 'REJECTED', rejectReason },
		)

		if (!rejectedNews)
			return res.status(404).json({ success: false, message: 'News Not Found' })

		res.status(200).json({ success: true, message: 'Welcome to Rejected news' })
	}

	async renderUsersList(req, res) {
		const users = await usersModel.find({})

		if (!users.length)
			return res
				.status(404)
				.json({ success: false, message: 'Users Not Found' })

		res.status(200).json({ success: true, data: users })
	}

	async renderUsersNews(req, res) {
		const id = req.params.id
		const news = await newsModel.find({ author: id })

		if (!news.length)
			return res.status(404).json({ success: false, message: 'News Not Found' })

		res.status(200).json({ success: true, data: news })
	}

	async blockUser(req, res) {
		const { blockReason } = req.body
		const user = await usersModel.findById({ _id: req.params.id })

		if (!user)
			return res.status(404).json({ success: false, message: 'User Not Found' })

		await usersModel.findByIdAndUpdate(
			{ _id: req.params.id },
			{ isBlocked: true, tokenVersion: ++user.tokenVersion, blockReason },
		)

		res.clearCookie('jwt_refresh_token')

		res.status(200).json({ success: true, message: 'User Was Blocked' })
	}

	async unblockUser(req, res) {
		const user = await usersModel.findById({ _id: req.params.id })

		if (!user)
			return res.status(404).json({ success: false, message: 'User Not Found' })

		await usersModel.findByIdAndUpdate(
			{ _id: req.params.id },
			{ isBlocked: false, $unset: { blockReason: true } },
		)

		res.status(200).json({ success: true, message: 'User Was Unblocked' })
	}

	async createCategory(req, res) {
		const { name } = req.body
		let slug = slugify(name).toLowerCase()

		let result = await newsModel.find({ slug })

		if (result.length) {
			slug += `-${nanoid()}`
		}

		await categoriesModel.create({ ...req.body, slug })

		res
			.status(201)
			.json({ success: true, message: 'Category Was Created Successfully' })
	}

	async updateCategory(req, res) {
		const id = req.params.id
		const { name } = req.body

		const updatedCategory = await categoriesModel.findByIdAndUpdate(id, {
			...req.body,
		})

		if (!updatedCategory)
			return res.status(404).json({ success: false, message: 'News Not Found' })

		res
			.status(200)
			.json({ success: true, message: 'News Was Updated Successfully' })
	}

	async deleteCategory(req, res) {
		const id = req.params.id

		const deletedCategory = await categoriesModel.findByIdAndDelete(id)

		if (!deletedCategory)
			return res.status(404).json({ success: false, message: 'News Not Found' })

		res.status(204).json({
			success: true,
			message: 'Content Was Deleted Succesfully',
		})
	}

	async createTag(req, res) {
		const { name } = req.body
		const slug = slugify(name).toLowerCase()

		let result = await newsModel.find({ name })

		if (result.length)
			return res
				.status(400)
				.json({ success: false, message: 'Tag Already Available' })

		await tagsModel.create({ name, slug })

		res.status(201).json({
			success: true,
			message: 'Tag Was Created Succesfully',
		})
	}

	async updateTag(req, res) {
		const id = req.params.id
		const { name } = req.body

		const updatedTag = await tagsModel.findByIdAndUpdate(id, { name })

		if (!updatedTag)
			return res.status(404).json({ success: false, message: 'Tag Not Found' })

		res.status(200).json({
			success: true,
			message: 'Content Was Updated Succesfully',
		})
	}

	async deleteTag(req, res) {
		const id = req.params.id

		// const deletedTag = await tagsModel.findByIdAndDelete(id)

		// if (!deletedTag)
		// 	return res.status(404).json({ success: false, message: 'Tag Not Found' })

		const result = await newsModel.updateMany(
			{ tags: id },
			{ $pull: { tags: id } },
		)

		console.log(result)

		res.status(204).json({
			success: true,
			message: 'Content Was Deleted Succesfully',
		})
	}
}

module.exports = new AdminController()
