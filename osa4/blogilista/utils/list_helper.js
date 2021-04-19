const _ = require('lodash')
const array = require('lodash/array')
const object = require('lodash/fp/object')

const dummy = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item
  }
  return 1
}


const totalLikes = (blogs) => {
  const allLikes = (sum, blog) => {
    return sum + blog.likes
  }
  return blogs.reduce(allLikes, 0)

}

const favoriteBlog = (blogs) => {
  const mostLikes = blogs.reduce(function (prev, current) {
    return (prev.likes > current.likes) ? prev : current
  })
  return {
    title: mostLikes.title,
    author: mostLikes.author,
    likes: mostLikes.likes
  }
}

const mostBlogs = (blogs) => {
  const newArray = _.map(blogs, 'author')
  const hasMostBlogs = _.chain(newArray).countBy().toPairs().max(_.last).head().value()
  const howManyBlogs = blogs.filter(function(blog) {
    return blog.author === hasMostBlogs.toString()
  })
  console.log(hasMostBlogs)

  return {
    author: hasMostBlogs,
    blogs: howManyBlogs.length
  }
}


module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
}

