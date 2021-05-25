const mongoose = require('mongoose')

if (process.argv.length < 4) {
  console.log('give password as argument')
  process.exit(1)
}
const password = process.argv[2]
const title = process.argv[3]
const author = process.argv[4]
const url = process.argv[5]
const likes = process.argv[6]

const url =
  `mongodb+srv://fullstack2021:${password}@cluster0.ezdss.mongodb.net/osa4?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
})


const Blog = mongoose.model('Blog', blogSchema)

const blog = new Blog({ title, author, url, likes })
blog._id instanceof mongoose.Types.ObjectId


Blog.find({}).then(result => {
  console.log('bloglist:')
  result.forEach(blog => {

    console.log(`${blog.title} ${blog.author} ${blog.url} ${blog.likes}`)
  })
  mongoose.connection.close()
})

blog.save().then(response => {
  console.log(`added ${blog.title} from ${blog.author} in ${blog.url} with ${blog.likes} likes`)
  mongoose.connection.close()
})


