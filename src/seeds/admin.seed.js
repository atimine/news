const usersModel = require('../models/users.model')
const bcrypt = require('bcrypt')

async function setDefaultAdmin(name, email, role, password) {
	password = await bcrypt.hash(password, 12)

	const defaultAdmin = await usersModel.findOne({ email, role })

	if (!defaultAdmin) {
		await usersModel.create({ name, email, password, role })
	}

	console.log('Default Admin Is Active')
}

module.exports = setDefaultAdmin
