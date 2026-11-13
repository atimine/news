const changingPasswordSchema = require('../validators/changingPassword.validator')
const creatingNewsSchema = require('../validators/creatingNews.validator')
const loginSchema = require('../validators/login.validator')
const registerSchema = require('../validators/register.validator')
const updateProfileSchema = require('../validators/updateProfile.validator')
class ValidateMiddleware {
	checkRegister(req, res, next) {
		const { error } = registerSchema.validate({ ...req.body })

		if (error)
			return res.status(400).json({ success: false, message: error.message })

		next()
	}

	checkLogin(req, res, next) {
		const { error } = loginSchema.validate({ ...req.body })

		if (error)
			return res.status(400).json({ success: false, message: error.message })

		next()
	}

	checkUpdateProfile(req, res, next) {
		const { error } = updateProfileSchema.validate({ ...req.body })

		if (error)
			return res.status(400).json({ success: false, message: error.message })

		next()
	}

	checkChangingPassword(req, res, next) {
		const { error } = changingPasswordSchema.validate({ ...req.body })

		if (error)
			return res.status(400).json({ success: false, message: error.message })

		next()
	}

	checkCreatingNewsSchema(req, res, next) {
		const { error } = creatingNewsSchema.validate({ ...req.body })

		if (error)
			return res.status(400).json({ success: false, message: error.message })

		next()
	}

	checkUpdatingNewsSchema(req, res, next) {
		const { error } = creatingNewsSchema.validate({ ...req.body })

		if (error)
			return res.status(400).json({ success: false, message: error.message })

		next()
	}
}

module.exports = new ValidateMiddleware()
