import React from 'react'


const Blog = ({
                blog,
                setBlogVisible
              }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }


  return (
    <div>
      <div style={blogStyle}>
        <div style={hideWhenVisible}>
          <div>
            {blog.title} {blog.author}
            <button type="submit">view</button>
          </div>
          <button onClick={() => setBlogVisible(true)}>view</button>
        </div>

        <div style={showWhenVisible}>
          <div>
            {blog.title} {blog.author}
            <button type="submit">hide</button>
          </div>
          <div>{blog.url}</div>
          <div>likes {blog.likes}
          </div>
          <div>{blog.username}</div>
          <button onClick={() => setBlogVisible(false)}>hide</button>
        </div>
      </div>
    </div>
  )
}


export default Blog


