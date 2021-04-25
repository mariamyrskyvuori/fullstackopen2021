const Blog = require('../models/blog')
const User = require('../models/user')


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

const nonExistingId = async () => {
  const blog = new Blog({ title: 'Opi leipomaan', author: 'Marika Sundgren',
    url: 'www.leivotaan.fi',
    likes: 16 })
  await blog.save()
  await blog.remove()
  return blog.id.toString()
}
const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
  usersInDb,
}


