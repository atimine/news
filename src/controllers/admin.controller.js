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
		res.json({ message: 'Welcome to User List' })
	}

	async renderUsersNews() {
		res.json({ message: 'Welcome to User List' })
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
			{ isBlocked: false },
		)

		res.status(200).json({ success: true, message: 'User Was Unblocked' })
	}

	async createCategory(req, res) {
		const { name, description } = req.body
		const slug = slugify(name).toLowerCase()

		const createdCategory = await categoriesModel.create({
			name,
			slug,
			description,
		})
		res.status(201).json(createdCategory)
	}

	async updateCategory(req, res) {
		const id = req.params.id
		const { name, description } = req.body
		const slug = slugify(name).toLowerCase()

		const updatedCategory = await categoriesModel.findByIdAndUpdate(id, {
			name,
			slug,
			description,
		})
		res.status(200).json(updatedCategory)
	}

	async deleteCategory(req, res) {
		const id = req.params.id

		const deletedCategory = await categoriesModel.findByIdAndDelete(id)

		res.status(204).json({
			message: 'Content Was Deleted Succesfully',
			data: deletedCategory,
		})
	}

	async createTag(req, res) {
		const { name } = req.body
		const slug = slugify(name).toLowerCase()

		const createdTag = await tagsModel.create({
			name,
			slug,
		})
		res.status(201).json(createdTag)
	}

	async updateTag(req, res) {
		const id = req.params.id
		const { name } = req.body
		const slug = slugify(name).toLowerCase()

		const updatedTag = await tagsModel.findByIdAndUpdate(id, {
			name,
			slug,
		})
		res.status(200).json(updatedTag)
	}

	async deleteTag(req, res) {
		const id = req.params.id

		const deletedTag = await tagsModel.findByIdAndDelete(id) //remove & delete

		res.status(204).json({
			message: 'Content Was Deleted Succesfully',
			data: deletedTag,
		})
	}
}

module.exports = new AdminController()
