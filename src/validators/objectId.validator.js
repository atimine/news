const Joi = require('joi')

const objectIdSchema = Joi.object({
	reason: Joi.string().min(3).max(300),
})

module.exports = objectIdSchema
