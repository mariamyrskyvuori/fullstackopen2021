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
})

test('a blog is added', async () => {
  const response = await api.post('/api/blogs')
  let blogObject = new Blog({
    title: 'Näin leikitään',
    author: 'Maria Myrskyvuori',
    url: 'www.leikintä.fi',
    likes: 14,
  })
  console.log(blogObject)
  await blogObject.save()
  console.log(initialBlogs)
  const newResponse = await api.get('/api/blogs')
  expect(newResponse.body).toHaveLength(initialBlogs.length + 2)
  console.log(initialBlogs.length)
  console.log(newResponse)
})


afterAll(() => {
  mongoose.connection.close()
})