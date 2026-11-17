const Joi = require('joi')

const tagSchema = Joi.object({
	name: Joi.string().min(2).max(30).required(),
})

module.exports = tagSchema
