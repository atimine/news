const Joi = require('joi')

const adminNewsQuery = Joi.object({
	// newsQuery qoidalari
	status: Joi.string().allow(['PENDING', 'PUBLISHED', 'REJECTED']),
}).with('status')

module.exports = adminNewsQuery
