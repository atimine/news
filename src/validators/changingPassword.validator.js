const Joi = require('joi')

const changingPasswordSchema = Joi.object({
	currentPassword: Joi.string()
		.min(8)
		.max(64)
		.pattern(/^(?=.*[a-zA-Z])(?=.*\d).*$/),
	newPassword: Joi.string()
		.min(8)
		.max(64)
		.pattern(/^(?=.*[a-zA-Z])(?=.*\d).*$/),
}).with('currentPassword', 'newPassword')

module.exports = changingPasswordSchema
