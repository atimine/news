const Joi = require('joi')

const creatingNewsSchema = Joi.object({
	title: Joi.string().min(5).max(200),
	description: Joi.string().min(20),
	images: Joi.array().max(10),
	removeImages: Joi.array(),
	category: Joi.string(),
	tags: Joi.array().items(Joi.string().min(2).max(30)).max(10),
}).with('title', 'description')

module.exports = creatingNewsSchema
