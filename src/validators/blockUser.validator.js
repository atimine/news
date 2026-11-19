const Joi = require('joi')

const blockUserSchema = Joi.object({
	blockReason: Joi.string().min(3).max(300),
})

module.exports = blockUserSchema
