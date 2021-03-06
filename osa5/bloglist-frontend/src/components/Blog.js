import React, {useState} from 'react'
import blogService from "../services/blogs";



const Blog = ({
                blog
              }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  const [visible, setBlogVisible] = useState(false)

  return (
    <div style={blogStyle}>
      {blog.title} {blog.author}
      <button
        onClick={() => setBlogVisible(previousVisible => !previousVisible)}>{visible ? 'hide' : 'view'}</button>

      <div>
        {visible && (<div>
          <div>{blog.url}</div>
          <div>likes {blog.likes}
            <div>{updateForm()}</div>
          </div>
          <div>{blog.user.name}</div>
        </div>)}
      </div>
    </div>

  )


}


export default Blog


