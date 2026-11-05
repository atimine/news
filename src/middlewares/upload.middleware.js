const multer = require('multer')
const crypto = require('crypto')
const path = require('path')

const { customAlphabet } = require('nanoid')
const nanoid = customAlphabet('1234567890abcdef', 5)

const filePath = path.join(__dirname, '../', '../', 'uploads')

function fileFilter(req, file, cb) {
	const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/webp']

	if (allowedMimeTypes.includes(file.mimetype)) {
		return cb(null, true)
	}

	return cb(null, false)
}

function uploadMiddleware(req, res, next) {
	const storage = multer.diskStorage({
		destination: function (req, file, cb) {
			cb(null, filePath)
		},
		filename: function (req, file, cb) {
			crypto.randomBytes(16, function (err, raw) {
				if (err) return cb(err)
				cb(null, `${nanoid(10)}.${file.mimetype.slice(6)}`)
			})
		},
		limits: {
			fileSize: 5e6,
			files: 5,
		},
	})

	const upload = multer({ storage, fileFilter, limits })
	return upload.array('images')(req, res, next)
}

module.exports = uploadMiddleware
