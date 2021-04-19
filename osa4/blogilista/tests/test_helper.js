const _ = require('lodash')
const array = require('lodash/array')
const object = require('lodash/fp/object')

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

module.exports = {
  initialBlogs,
}
