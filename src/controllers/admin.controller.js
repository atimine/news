const categoriesModel = require('../models/categories.model')
const newsModel = require('../models/news.model')
const tagsModel = require('../models/tags.model')
const usersModel = require('../models/users.model')
const slugify = require('slugify')
class AdminController {
	async renderStatistics(req, res) {
		res.json({ message: 'Welcome to Statistics' })
	}

	async renderNews(req, res) {
		const news = await newsModel.find({})
		res.json({ success: true, data: news })
	}

	async approveNews(req, res) {
		res.json({ message: 'Welcome to Approve news' })
	}

	async rejectNews() {
		res.json({ message: 'Welcome to Reject news' })
	}

	async renderUsersList(req, res) {
		res.json({ message: 'Welcome to User List' })
	}

	async renderUsersNews() {
		res.json({ message: 'Welcome to User List' })
	}

	async blockUser() {
		res.json({ message: 'Welcome to Block User' })
	}

	async unblockUser() {
		res.json({ message: 'Welcome to Unblock User' })
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
