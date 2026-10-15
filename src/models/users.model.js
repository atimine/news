const mongoose = require('mongoose')

const Users = new mongoose.Schema({
	_id: '',
	name: { type: String, required: true, minLength: 2, maxLength: 50 },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	role: { type: String, enum: ['ADMIN', 'USER'], default: 'User' },
	isBlocked: { type: Boolean, default: false },
	blockReason: { type: String, maxLength: 300 },
})

module.exports = mongoose.model('Users', Users)
