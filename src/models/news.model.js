const mongoose = require('mongoose')
// const Images = require('./images.model')
const { Schema } = mongoose

const Images = new Schema({
	url: String,
	filename: String,
	mimetype: String,
	size: String,
})

const News = new Schema(
	{
		title: { type: String, required: true, minLength: 5, maxLength: 200 },
		description: { type: String, required: true },
		slug: { type: String, unique: true },
		images: {
			type: [Images],
			validate: [
				images => {
					return images.length <= 10
				},
				'10 images allowed maximum',
			],
		},
		category: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Categories',
			required: true,
		},
		author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Users',
			required: true,
		},
		tags: { type: mongoose.Schema.Types.ObjectId, ref: 'Tags', required: true },
		status: {
			type: String,
			enum: ['PENDING', 'PUBLISHED', 'REJECTED'],
			default: 'PENDING',
		},
		rejectReason: { type: String },
		reviewdAt: { type: Date },
		reviewdBy: { type: mongoose.Types.ObjectId, ref: 'Users' },
		publishedAt: { type: Date },
	},
	{ timestamps: true, autoSearchIndex: true },
)

News.index({
	title: 'text',
	content: 'text',
})

module.exports = new mongoose.model('News', News)
