const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const Blog = require('../models/blog')

usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({}).populate('notes')

  response.json(users.map(u => u.toJSON()))
})

usersRouter.get('/:id', async (request, response, next) => {
  //const blog = await Blog.findById(request.params.id)
  const user = await User.findById(body.userId)
  if (user) {
    response.json(user.toJSON())
  } else {
    response.status(404).end()
  }
  user.blogs = user.blogs.concat(savedBlog.id)
  await user.save()
})

usersRouter.post('/', async (request, response) => {
  const body = request.body

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
  })

  if (newUser.password.length < 3 || newUser.password === undefined ) {
    return response.status(400).json({ error: 'password missing or too short' })
  }

  const savedUser = await user.save()

  response.json(savedUser)
})

module.exports = usersRouter