const usersModel = require('../models/users.model')
const bcrypt = require('bcrypt')
const { signAccessJwt, signRefreshJwt } = require('../utils/signJwt')
class AuthController {
	async register(req, res) {
		let { name, email, password } = req.body
		password = await bcrypt.hash(password, 12)

		const existUser = await usersModel.findOne({ email })

		if (existUser) {
			res.status(409).json({
				success: false,
				message: 'Validation Error',
				errors: [
					{
						field: 'email',
						message: 'Email is taken. Please choose another one',
					},
				],
			})
		}

		const registeredUser = await usersModel.create({ name, email, password })
		registeredUser.password = null

		const token = signAccessJwt(registeredUser)

		res.cookie('jwt_token', token, {
			httpOnly: true,
			secure: true,
			sameSite: true,
			maxAge: 900000,
		})

		res.status(201).json({ data: registeredUser })
	}

	async login(req, res) {
		const { email, password } = req.body
		const existingUser = await usersModel.findOne({ email })

		if (!existingUser) {
			return res.status(404).json({ message: 'Email Or Password is wrong' })
		}

		const checkedPass = await bcrypt.compare(password, existingUser.password)

		if (!checkedPass) {
			return res.status(404).json({ message: 'Email Or Password is wrong' })
		}

		const token = signRefreshJwt(existingUser)

		res.cookie('jwt_refresh_token', token, {
			httpOnly: true,
			secure: true,
			sameSite: true,
			maxAge: 6.048e8,
		})

		return res.status(200).json({ message: 'Welcome to Login' })
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

	async editProfile(req, res) {
		const { name, email, password } = req.body
		const updatedUser = await usersModel.findOneAndUpdate(
			{
				email,
				password,
			},
			{ name, email, password },
		)

		console.log(updatedUser)

		res.status(200).json({ message: 'Welcome to Edit Profile' })
	}

	changePassword(req, res) {
		res.json({ message: 'Welcome to Change Password' })
	}
}

module.exports = new AuthController()
