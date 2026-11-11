const Joi = require('joi')

const loginSchema = Joi.object({
	email: Joi.string().email().required().error(new Error('Email Is Reqired')),
	password: Joi.string()
		.min(8)
		.pattern(/^(?=.*[a-zA-Z])(?=.*\d).*$/)
		.max(64)
		.required(),
}).with('email', 'password')

module.exports = loginSchema
