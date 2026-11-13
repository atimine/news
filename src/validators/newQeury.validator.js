const Joi = require('joi')

const updatingNewsSchema = Joi.object({
	page: Joi.string()
		.pattern(/^[2-9]\d*$/)
		.error(new Error('Page Is Reqired')),
	limit: Joi.string()
		.pattern(/^[1-9]\d*$/)
		.min(1)
		.max(50)
		.error(new Error('Limit Is Reqired')),
	q: Joi.string().max(100),
	category: Joi.string(),
	tags: Joi.string().error(new Error('Tags Are Reqired')),
	slug: Joi.string(),
})

module.exports = updatingNewsSchema
