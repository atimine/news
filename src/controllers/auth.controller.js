class AuthController {
	renderNews(req, res) {
		res.json({ message: 'List of news' })
	}

	async register(req, res) {
		res.json({ message: 'Welcome to Register' })
	}

	async login(req, res) {
		res.json({ message: 'Welcome to Login' })
	}

	logout(req, res) {
		res.json({ message: 'Welcome to Logout' })
	}

	getCurrentUser(req, res) {
		res.json({ message: 'Welcome to Current User' })
	}

	refreshCookie(req, res) {
		res.json({ message: 'Welcome to Refresh Cookie' })
	}

	editProfile(req, res) {
		res.json({ message: 'Welcome to Edit Profile' })
	}

	changePassword(req, res) {
		res.json({ message: 'Welcome to Change Password' })
	}
}

module.exports = new AuthController()
