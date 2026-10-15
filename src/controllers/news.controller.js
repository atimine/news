class NewsController {
	async renderNews(req, res) {
		res.json({ message: 'Welcome to Auth' })
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
		res.json({ message: 'Welcome to Create News' })
	}

	async editNews(req, res) {
		res.json({ message: 'Welcome to Edit News' })
	}

	async removeNews(req, res) {
		res.json({ message: 'Welcome to Remove News' })
	}

	changePassword(req, res) {
		res.json({ message: 'Welcome to Change Password' })
	}
}

module.exports = new NewsController()
