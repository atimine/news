require('dotenv').config()

const express = require('express')
const connectionDB = require('./config/db')
const authRouter = require('./routes/auth.route')
const newsRouter = require('./routes/news.route')
const categoriesRouter = require('./routes/categories.route')
const tagsRouter = require('./routes/tags.route')
const adminRoute = require('./routes/admin.route')
const app = express()

const PORT = process.env.PORT

// MIDDLEWARES
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// ROUTES
app.get('/', (req, res) => {
	res.status(200)
	res.json({ message: 'Welcome to News API' })
})
app.use('/api/news', newsRouter)
app.use('/api/categories', categoriesRouter)
app.use('/api/auth', authRouter)
app.use('/api/tags', tagsRouter)
app.use('/api/admin', adminRoute)

connectionDB().then(() => {
	app.listen(PORT, err => {
		if (err) {
			console.log(err)
		}

		console.log('Express App running on: ', PORT)
	})
})
