const Joi = require('joi')

const categorySchema = Joi.object({
	name: Joi.string().min(2).max(50).required(),
	description: Joi.string().max(300).required(),
}).with('name', 'description')

module.exports = categorySchema
