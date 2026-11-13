const Joi = require('joi')

const updatingNewsSchema = Joi.object({
	title: Joi.string()
		.min(5)
		.max(200)
		.required()
		.error(new Error('Title Is Reqired')),
	description: Joi.string()
		.min(20)
		.required()
		.error(new Error('Description Is Reqired')),
	images: Joi.array().max(10),
	category: Joi.string(),
	tags: Joi.array()
		.items(Joi.string())
		.max(10)
		.required()
		.error(new Error('Tags Are Reqired')),
}).with('title', 'description')

module.exports = updatingNewsSchema
