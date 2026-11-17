const path = require('path')
const fs = require('fs')

function validateSchema(req, res, next, schema) {
	const { error } = schema.validate({ ...req.body }, { abortEarly: false })

	if (error) {
		if (req.files) {
			req.files.forEach(image => {
				const url = path.join(__dirname, '../', '../uploads', image.filename)
				const existingFile = fs.existsSync(url)

				if (existingFile) {
					fs.rm(url, err => {
						if (err) {
							throw new Error(err)
						}
					})
				}
			})
		}
		return res.status(400).json({ success: false, message: error.message })
	}
	next()
}

function validate(schema) {
	return (req, res, next) => validateSchema(req, res, next, schema)
}

module.exports = validate
