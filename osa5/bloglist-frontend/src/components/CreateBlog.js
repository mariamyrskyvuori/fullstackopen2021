import React, {useState} from 'react'
import blogService from "../services/blogs"

const CreateBlog = ({
                      setAddedMessage,
                      setBlogs,
                      setCreateVisible
                    }) => {
  const [title, setBlogTitle] = useState('')
  const [author, setBlogAuthor] = useState('')
  const [url, setBlogUrl] = useState('')
  const handleNewBlog = async (event) => {
    event.preventDefault()
    await blogService.create({title: title, author: author, url: url})
    setAddedMessage(`A new blog ${title} by ${author} added`)
    setTimeout(() => {
      setAddedMessage(null)
    }, 3000)
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
    setCreateVisible(false)
  }
  return (
    <div>
      <h2>Create new blog</h2>
      <form onSubmit={handleNewBlog}>
        <div>
          Title
          <input
            value={title}
            onChange={({target}) => setBlogTitle(target.value)}
          />
        </div>
        <div>
          Author
          <input
            value={author}
            onChange={({target}) => setBlogAuthor(target.value)}
          />
        </div>
        <div>
          Url
          <input
            value={url}
            onChange={({target}) => setBlogUrl(target.value)}
          />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}


export default CreateBlog

