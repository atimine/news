const Joi = require('joi')

const createNewsSchema = Joi.object({
	title: Joi.string()
		.min(5)
		.max(200)
		.required()
		.error(new Error('Title Is Reqired')),
	description: Joi.string()
		.max(300)
		.required()
		.error(new Error('Description Is Reqired')),
	images: Joi.array().max(10),
	category: Joi.array()
		.items(
			Joi.string().min(2).max(50).required(),
			Joi.string().max(300).required(),
		)
		.error(new Error('Categories Are Reqired')),
	tag: Joi.array()
		.items(Joi.string().min(2).max(30).required())
		.error(new Error('Tags Are Reqired')),
	rejectReason: Joi.string().min(3).max(300),
}).with('title', 'description')

module.exports = createNewsSchema
