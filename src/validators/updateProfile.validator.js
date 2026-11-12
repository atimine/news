const Joi = require('joi')

const updateProfileSchema = Joi.object({
	name: Joi.string().required().error(new Error('Name Is Reqired')),
	email: Joi.string().email().error(new Error('Email Is Not In Right Form')),
	password: Joi.string()
		.min(8)
		.pattern(/^(?=.*[a-zA-Z])(?=.*\d).*$/)
		.max(64)
		.required(),
}).with('name', 'password')

module.exports = updateProfileSchema
