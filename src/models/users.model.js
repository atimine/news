const mongoose = require('mongoose')

const Users = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			minLength: 2,
			maxLength: 50,
		},
		email: { type: String, required: true, unique: true, lowercase: true },
		password: { type: String, required: true },
		role: { type: String, enum: ['ADMIN', 'USER'], default: 'User' },
		isBlocked: { type: Boolean, default: false },
		blockReason: { type: String, maxLength: 300 },
		tokenVersion: { type: Number, default: 0 },
	},
	{ timestamps: true },
)

module.exports = mongoose.model('Users', Users)
