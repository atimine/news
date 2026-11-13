const Joi = require('joi')

const registerSchema = Joi.object({
	name: Joi.string()
		.min(2)
		.max(50)
		.required()
		.error(new Error('Name Is Reqired')),
	email: Joi.string()
		.email()
		.required() //.message
		.error(new Error('Email Is Reqired')),
	password: Joi.string()
		.min(8)
		.max(64)
		.pattern(/^(?=.*[a-zA-Z])(?=.*\d).*$/)
		.required(),
	role: Joi.string().forbidden(),
}).with('name', 'email')

module.exports = registerSchema
