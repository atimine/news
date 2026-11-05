const usersModel = require('../models/users.model')
const bcrypt = require('bcrypt')
const { signAccessJwt, signRefreshJwt } = require('../utils/signJwt')
const jwt = require('jsonwebtoken')

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
						message: 'There is an error. Please try with different fields',
					},
				],
			})
		}

		const registeredUser = await usersModel.create({ name, email, password })
		registeredUser.password = null

		const token = signAccessJwt(registeredUser)

		res.cookie('jwt_access_token', token, {
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
		if (!req.cookies.jwt_refresh_token)
			return res
				.status(200)
				.json({ success: true, message: 'You Already Loged out' })

		res.clearCookie('jwt_refresh_token')
		res.status(200).json({ message: 'You Loged out' })
	}

	async getCurrentUser(req, res) {
		res.status(200).json({ success: true, data: req.user })
	}

	async refreshAccessToken(req, res) {
		const accessToken = req.cookies.jwt_access_token

		// console.log(req.cookies)
		console.log(accessToken)

		if (!accessToken)
			return res
				.status(500)
				.json({ success: false, message: "Can't find access token" })

		const userData = jwt.decode(accessToken)

		console.log(userData)

		const existingUser = await usersModel.findById({ _id: userData.userId })

		if (!existingUser.length)
			return res.status(404).json({ success: false, message: 'User Not Found' })

		const token = signRefreshJwt(existingUser)

		res.cookie('jwt_refresh_token', token, {
			httpOnly: true,
			secure: true,
			sameSite: true,
			maxAge: 6.048e8,
		})

		res.status(200).json({
			success: true,
			message: 'Access Token Was Refreshed Successfully',
		})
	}

	async editProfile(req, res) {
		let { name, email, password } = req.body
		const currentUser = req.user
		password = await bcrypt.hash(password, 12)

		//check existing email and user's email if its not changed

		const updatedUser = await usersModel.findOneAndUpdate(
			{ _id: currentUser.userId },
			{
				...req.body,
				password,
			},
		)

		const token = signRefreshJwt(updatedUser)

		res.cookie('jwt_refresh_token', token, {
			httpOnly: true,
			secure: true,
			sameSite: true,
			maxAge: 6.048e8,
		})

		res
			.status(200)
			.json({ success: true, message: 'Profile Was Updated Successfully' })
	}

	async changePassword(req, res) {
		let { password } = req.body
		const id = req.user.userId
		password = await bcrypt.hash(password, 12)

		await usersModel
			.findByIdAndUpdate({ _id: id }, { password })
			.select('-password')

		res
			.status(200)
			.json({ success: true, message: 'Password Was Updated Successfully' })
	}

	async updatePassword(req, res) {
		let { email, password } = req.body
		password = await bcrypt.hash(password, 12)

		const existingUser = await usersModel.find({ email })

		if (!existingUser.length)
			return res.status(404).json({ success: false, message: 'User Not Found' })

		const result = await usersModel
			.updateOne({ email }, { password })
			.select('-password')
		res.status(200).json({ success: true, message: result })
	}
}

module.exports = new AuthController()
