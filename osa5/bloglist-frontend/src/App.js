import React, {useEffect, useState} from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import axios from 'axios'
import loginService from './services/login'

const baseUrl = '/api/login'
const login = async credentials => {
  const response = await axios.post(baseUrl, credentials)
  return response.data
}


//export default { login }

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newBlog, setNewBlog] = useState('')
  const [title, setBlogTitle] = useState('')
  const [author, setBlogAuthor] = useState('')
  const [url, setBlogUrl] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
  const [addedMessage, setAddedMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)

  const NotificationError = ({message}) => {
    if (message === null) {
      return null
    }

    return (
      <div className="error">
        {message}
      </div>
    )
  }

  const NotificationAdded = ({message}) => {
    if (message === null) {
      return null
    }

    return (
      <div className="added">
        {message}
      </div>
    )
  }


  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {

      const user = await loginService.login({
        username, password,
      })
      blogService.setToken(user.token)
      setUser(user)
      window.localStorage.setItem('loggedBloglistappUser', JSON.stringify(user))
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 3000)
    }
  }
  const handleLogout = async (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBloglistappUser')
    setUser(null)
    setUsername('')
    setPassword('')
  }

  const handleNewBlog = async (event) => {
    event.preventDefault()
    await blogService.create({title: title, author: author, url: url})
    setAddedMessage(`A new blog ${title} by ${author} added`
    )
    setTimeout(() => {
      setAddedMessage(null)
    }, 3000)
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
    setBlogTitle('')
    setBlogAuthor('')
    setBlogUrl('')
  }


  const loginForm = () => (
    <>
      <h2>Log in to application</h2>
      <NotificationError message={errorMessage}/>
      <form onSubmit={handleLogin}>
        <div>
          Username
          <input
            type="text"
            value={username}
            name="username"
            onChange={({target}) => setUsername(target.value)}
          />
        </div>
        <div>
          Password
          <input
            type="password"
            value={password}
            name="password"
            onChange={({target}) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </>
  )

  const createForm = () => (
    <>
      <h2>Create new blog</h2>
      <form onSubmit={handleNewBlog}>
        <div>
          Title
          <input
            type="text"
            value={title}
            name="title"
            onChange={({target}) => setBlogTitle(target.value)}
          />
        </div>
        <div>
          Author
          <input
            type="text"
            value={author}
            name="author"
            onChange={({target}) => setBlogAuthor(target.value)}
          />
        </div>
        <div>
          Url
          <input
            type="text"
            value={url}
            name="url"
            onChange={({target}) => setBlogUrl(target.value)}
          />
        </div>
        <button type="submit">create</button>
      </form>
    </>
  )

  const blogList = () => {
    return (
      <div>
        <h2>Blogs</h2>
        <NotificationAdded message={addedMessage}/>
        <div>{user.name} logged in</div>
        <button type="submit" onClick={handleLogout}>logout</button>
        {createForm()}
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog}/>
        )}
      </div>
    )
  }

  return (
    <div>
      {/*<Notification message={errorMessage} />*/}

      {user === null && loginForm()}
      {user !== null && blogList()}


    </div>
  )


}


export default App