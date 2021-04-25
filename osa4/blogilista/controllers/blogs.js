const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', {username: 1, name: 1})
  response.json(blogs.map(note => note.toJSON()))
})

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}


blogsRouter.get('/:id', async (request, response, next) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog.toJSON())
  } else {
    response.status(404).end()
  }
})


blogsRouter.post('/' ,async (request, response, next) => {
  const body = request.body
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!request.token || !decodedToken.id) {
    return response.status(401).json({error: 'token missing or invalid'})
  }
  const user = await User.findById(body.user)

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: !!body.likes ? body.likes : 0,
    user: user.id,
  })
  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog.id)
  await user.save()
  response.status(201).json(savedBlog.toJSON())
})


blogsRouter.delete('/:id', async (request, response, next) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  const blog = await Blog.findById(request.params.id)
  const user = request.user
  if ( blog.user.toString() === user.id ) {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(404).end()
  }

  return response.status(401).json({error: 'token missing or invalid'})
})


blogsRouter.put('/:id', async (request, response, next) => {
  const body = request.body
  const blog = {
    likes: body.likes,
  }
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {new: true})
  response.json(updatedBlog)
})


module.exports = blogsRouter