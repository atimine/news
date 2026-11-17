const Joi = require('joi')

const rejectNewsSchema = Joi.object({
	reason: Joi.string().min(3).max(300),
})

module.exports = rejectNewsSchema
