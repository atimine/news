const usersModel = require('../models/users.model')

class AdminController {
	async renderStatistics(req, res) {
		res.json({ message: 'Welcome to Statistics' })
	}

	async renderNews(req, res) {
		res.json({ message: 'Welcome to Admin News' })
	}

	async approveNews() {
		res.json({ message: 'Welcome to Approve news' })
	}

	async rejectNews() {
		res.json({ message: 'Welcome to Reject news' })
	}

	async renderUsersList(req, res) {
		const users = await usersModel.create({
			_id: 1,
			name: 'Adham Khudayberganov',
			email: 'adham@example.com',
			password: 'hashed_password_123',
			role: 'ADMIN',
			isBlocked: false,
			blockReason: '',
		})
		console.log(users)
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

	async createCategory() {
		res.json({ message: 'Welcome to Create Category' })
	}

	async createTag() {
		res.json({ message: 'Welcome to Create Tag' })
	}

	async updateCategory() {
		res.json({ message: 'Welcome to Update Category' })
	}

	async updateTag() {
		res.json({ message: 'Welcome to Update Tag' })
	}

	async deleteCategory() {
		res.json({ message: 'Welcome to Delete Category' })
	}

	async deleteTag() {
		res.json({ message: 'Welcome to Delete Tag' })
	}
}

module.exports = new AdminController()
