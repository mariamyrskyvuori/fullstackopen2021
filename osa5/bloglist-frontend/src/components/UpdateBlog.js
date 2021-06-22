import React, {useState} from 'react'
import blogService from "../services/blogs"

const UpdateBlog = () => {
  const handleUpdate = async (event) => {
    event.preventDefault()
    await blogService.update({title: title, author: author, url: url, likes: likes + 1})
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }
  return (
    <form onSubmit={handleUpdate}>
    <button type="submit">like</button>
    </form>
  )

}






export default UpdateBlog