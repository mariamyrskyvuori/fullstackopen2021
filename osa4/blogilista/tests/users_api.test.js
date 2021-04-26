const bcrypt = require('bcrypt')
const helper = require('./test_helper')
const User = require('../models/user')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

//...

const getToken = (username) => {
  const userForToken = {
    username: username,
    id: '1234567',
  }

  return jwt.sign(userForToken, process.env.SECRET)
}

describe('when there is initially one user at db', () => {
  beforeEach(async done => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'testuser', passwordHash })
    await user.save()
    done()
  })

  test('creation succeeds with a fresh username', async done => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mattitestaaja',
      name: 'Matti Testaaja',
      password: 'salasana',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .set('Accept', 'application/json')
      .set('Authorization', 'bearer ' + getToken('mattitestaaja'))
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
    done()
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'testuser',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .set('Accept', 'application/json')
      .set('Authorization', 'bearer ' + getToken('testuser'))
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('`username` to be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
})

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  usersInDb,
}
afterAll(async () => {
  await mongoose.connection.close()
})