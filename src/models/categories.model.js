const mongoose = require('mongoose')

const Categories = new mongoose.Schema(
	{
		name: {
			type: String,
			unique: true,
			required: true,
			minLength: 2,
			maxLength: 50,
		},
		slug: { type: String, unique: true },
		description: { type: String, maxLength: 300 },
	},
	{ timestamps: true },
)

module.exports = mongoose.model('Categories', Categories)
