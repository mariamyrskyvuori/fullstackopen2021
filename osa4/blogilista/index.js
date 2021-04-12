const http = require('http')
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()
const Blog = require('./models/blog')

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

let morgan = require('morgan')
morgan.token('type', function (req, res) {
  return req.headers['content-type']
})

app.use(express.static('build'))
app.use(cors())
app.use(express.json())
morgan.token('person', (request, response) => {
  return JSON.stringify(request.body)
})

app.use(morgan('tiny'))

/*const blogSchema = mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
})

const Blog = mongoose.model('Blog', blogSchema)

const mongoUrl = `mongodb+srv://fullstack2021:${password}@cluster0.ezdss.mongodb.net/osa4?retryWrites=true&w=majority`
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

*/
app.get('/api/blogs', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
})

app.post('/api/blogs', (request, response) => {
  const body = request.body
  const blog = new Blog( {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  })

  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    }).catch((err) => {
      console.log(err)
    })
})

