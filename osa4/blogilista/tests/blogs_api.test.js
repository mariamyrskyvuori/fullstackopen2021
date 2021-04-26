const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
require('express-async-errors')
const api = supertest(app)
const bcrypt = require('bcrypt')
const User = require('../models/user')
const Blog = require('../models/blog')
const jwt = require('jsonwebtoken')

const getToken = () => {
  const userForToken = {
    username: 'testuser',
    id: '1234567',
  }

  return jwt.sign(userForToken, process.env.SECRET)
}

describe('when there is initially some blogs saved', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .set('Authorization', 'bearer ' + getToken())
      .set('Accept', 'application/json')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api
      .get('/api/blogs')
      .set('Authorization', 'bearer ' + getToken())
      .set('Accept', 'application/json')

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('a specific blog is within the returned blogs', async () => {
    const response = await api
      .get('/api/blogs')
      .set('Authorization', 'bearer ' + getToken())
      .set('Accept', 'application/json')

    const titles = response.body.map(r => r.title)

    expect(titles).toContain('Näin lauletaan')
  })

  test('all blogs have id', async () => {
    const response = await api
      .get('/api/blogs')
      .set('Authorization', 'bearer ' + getToken())
      .set('Accept', 'application/json')
    expect(response.body[0].id).toBeDefined()
  })


  describe('viewing a specific blog', () => {
    test('a blog is added', async () => {
      const response = await api
        .post('/api/users')
        .send({
          username: 'terotestaaja',
          name: 'Tero Testaaja',
          password: 'salasana'
        })
        .set('Accept', 'application/json')
        .set('Authorization', 'bearer ' + getToken())

      const blogObject = {
        title: 'Näin leikitään',
        author: 'Maria Myrskyvuori',
        url: 'www.leikintä.fi',
        likes: 14,
        user: response.body.id
      }

      await api
        .post('/api/blogs')
        .send(blogObject)
        .set('Authorization', 'bearer ' + getToken())
        .set('Accept', 'application/json')
        .expect(201)
        .expect('Content-Type', /application\/json/)


      const blogsAtEnd = await api
        .get('/api/blogs')
        .set('Authorization', 'bearer ' + getToken())
        .set('Accept', 'application/json')
      expect(blogsAtEnd.body).toHaveLength(helper.initialBlogs.length + 1)

    })

    test('likes is 0', async () => {
      const response = await api
        .post('/api/users')
        .send({
          username: 'kalletestaaja',
          name: 'Kalle Testaaja',
          password: 'salasana'
        })
        .set('Accept', 'application/json')
        .set('Authorization', 'bearer ' + getToken())

      const blogObject = {
        title: 'Näin lallatellaan',
        author: 'Maria Myrskyvuori',
        url: 'www.lallattelu.fi',
        user: response.body.id
      }

      await api
        .post('/api/blogs')
        .send(blogObject)
        .set('Authorization', 'bearer ' + getToken())
        .set('Accept', 'application/json')
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const newResponse = await api
        .get('/api/blogs')
        .set('Authorization', 'bearer ' + getToken())
        .set('Accept', 'application/json')
      expect(newResponse.body[2].likes).toEqual(0)
    })

    test('title and url doesnt exist', async () => {
      const response = await api
        .post('/api/users')
        .send({
          username: 'kalletestaaja',
          name: 'Kalle Testaaja',
          password: 'salasana'
        })
        .set('Accept', 'application/json')
        .set('Authorization', 'bearer ' + getToken())

      const blogObject = {
        author: 'Maria Myrskyvuori',
        likes: 14,
        user: response.body.id
      }

      await api
        .post('/api/blogs')
        .send(blogObject)
        .set('Authorization', 'bearer ' + getToken())
        .set('Accept', 'application/json')
        .expect(400)

      const blogsResponse = await api
        .get('/api/blogs')
        .set('Authorization', 'bearer ' + getToken())
        .set('Accept', 'application/json')

      expect(blogsResponse.body).toHaveLength(helper.initialBlogs.length)
    })


    describe('deletion of a blog', () => {
      test('succeeds with status code 404 if id is valid', async () => {
        const blogsAtStart = await api
          .get('/api/blogs')
          .set('Authorization', 'bearer ' + getToken())
          .set('Accept', 'application/json')
        const blogToDelete = blogsAtStart.body[0].id

        await api
          .delete(`/api/notes/${blogToDelete}`)
          .set('Authorization', 'bearer ' + getToken())
          .set('Accept', 'application/json')
          .expect(404)

        const blogsAtEnd = await api
          .get('/api/blogs')
          .set('Authorization', 'bearer ' + getToken())
          .set('Accept', 'application/json')
        expect(blogsAtEnd.body).toHaveLength(helper.initialBlogs.length)

      })
    })
    describe('updating a blog', () => {
      test('succeeds with status code 200 if id is valid', async () => {
        const blog = await api
          .get('/api/blogs')
          .set('Authorization', 'bearer ' + getToken())
          .set('Accept', 'application/json')
        const blogToUpdate = blog.body[0]
        blogToUpdate.likes = 20
        await api
          .put(`/api/blogs/` + blogToUpdate.id)
          .send(blogToUpdate)
          .set('Authorization', 'bearer ' + getToken())
          .set('Accept', 'application/json')
          .expect(200)
          .expect('Content-Type', /application\/json/)

        const newResponse = await api
          .get('/api/blogs')
          .set('Authorization', 'bearer ' + getToken())
          .set('Accept', 'application/json')
        expect(newResponse.body[0].likes).toEqual(20)

      })
    })
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
