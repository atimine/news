const Joi = require('joi')

const updateProfileSchema = Joi.object({
	name: Joi.string().required().error(new Error('Name Is Reqired')),
	email: Joi.string().error(new Error('Email Is Reqired')),
	password: Joi.string().required(),
}).with('name', 'email')

module.exports = updateProfileSchema
