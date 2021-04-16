//const middleware = require('utils/middleware')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')


const api = supertest(app)

const Blog = require('../models/blog')
const initialBlogs = [
  {
    title: 'Näin leivotaan',
    author: 'Maria Myrskyvuori',
    url: 'www.leivonta.fi',
    likes: 4,
  },
  {
    title: 'Näin lauletaan',
    author: 'Maria Myrskyvuori',
    url: 'www.laulanta.fi',
    likes: 6,
  },
]

beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
})


test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(initialBlogs.length)
})

test('a specific blog is within the returned blogs', async () => {
  const response = await api.get('/api/blogs')

  const titles = response.body.map(r => r.title)

  expect(titles).toContain(
    'Näin lauletaan'
  )
})

test('all blogs have id', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body[0].id).toBeDefined()
  console.log(response.body)
})

test('a blog is added', async () => {
  const response = await api.post('/api/blogs')
  const blogObject = new Blog({
    title: 'Näin leikitään',
    author: 'Maria Myrskyvuori',
    url: 'www.leikintä.fi',
    likes: 14,
  })
  try {
    const savedBlog = await blogObject.save()
    //response.json(savedBlog.toJSON())
    console.log(savedBlog)
  } catch (exception) {
    console.log(exception)
  }
  console.log(initialBlogs)
  const newResponse = await api.get('/api/blogs')
  expect(newResponse.body).toHaveLength(initialBlogs.length + 1)
  //console.log(initialBlogs.length)
  console.log(newResponse)
})

test('likes is 0', async () => {

  const blogObject = new Blog({
    title: 'Näin lallatellaan',
    author: 'Maria Myrskyvuori',
    url: 'www.lallattelu.fi',
  })
  if(!blogObject.hasOwnProperty("likes"))
    blogObject.likes = 0
  console.log(blogObject)
  const response = await api.post('/api/blogs')
  const savedBlog = await blogObject.save()
  console.log(savedBlog)

  const newResponse = await api.get('/api/blogs')
  expect(newResponse.body[2].likes).toEqual(0)
  console.log(newResponse)
})

test('title and url doesnt exist', async () => {

  const blogObject = new Blog({
    author: 'Maria Myrskyvuori',
    likes: 14,
  })
  try {
    await api
      .post('/api/blogs')
      .send(blogObject)
      .expect(400)

  } catch (exception) {
    console.log(exception)
  }
  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(initialBlogs.length)
})

afterAll(() => {
  mongoose.connection.close()
})