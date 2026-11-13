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

		res.status(201).json({ success: true, data: registeredUser })
	}

	async login(req, res) {
		const { email, password } = req.body
		const existingUser = await usersModel.findOne({ email })

		const checkedPass = await bcrypt.compare(
			password,
			existingUser?.password ?? '',
		)

		if (!checkedPass || !existingUser)
			return res
				.status(400)
				.json({ success: false, message: 'Email Or Password is wrong' })

		const token = signRefreshJwt(existingUser)

		res.cookie('jwt_refresh_token', token, {
			httpOnly: true,
			secure: true,
			sameSite: true,
			maxAge: 6.048e8,
		})

		return res
			.status(200)
			.json({ success: true, message: 'You Logged In Successfullly' })
	}

	logout(req, res) {
		res.clearCookie('jwt_refresh_token')
		res.status(200).json({ success: true, message: 'You Logged out' })
	}

	getCurrentUser(req, res) {
		res.status(200).json({ success: true, data: req.user })
	}

	async refreshAccessToken(req, res) {
		const accessToken = req.cookies.jwt_access_token

		if (!accessToken)
			return res
				.status(500)
				.json({ success: false, message: "Can't find access token" })

		const userData = jwt.decode(accessToken)

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
		let { email, password } = req.body
		password = await bcrypt.hash(password, 12)

		const existingUser = await usersModel.findOne({ email }).select('-password')

		if (existingUser)
			if (existingUser.id !== req.user.userId)
				return res
					.status(409)
					.json({ success: false, message: 'Email already taken!' })

		const updatedUser = await usersModel.findOneAndUpdate(
			{ _id: req.user.userId },
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
		let { currentPassword, newPassword } = req.body
		const id = req.user.userId

		const existingUser = await usersModel
			.findOne({ _id: id })
			.select('password')

		if (!existingUser)
			return res.status(404).json({ success: false, message: 'User Not Fund' })

		const result = await bcrypt.compare(currentPassword, existingUser.password)

		if (!result)
			return res
				.status(400)
				.json({ success: false, message: 'Current Password Is Wrong ' })

		newPassword = await bcrypt.hash(newPassword, 12)

		await usersModel
			.findByIdAndUpdate({ _id: id }, { password: newPassword })
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
