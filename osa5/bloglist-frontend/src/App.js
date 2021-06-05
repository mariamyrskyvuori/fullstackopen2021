import React, {useEffect, useState} from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import axios from 'axios'
import loginService from './services/login'
import CreateBlog from "./components/CreateBlog";

const baseUrl = '/api/login'
const login = async credentials => {
  const response = await axios.post(baseUrl, credentials)
  return response.data
}


//export default { login }

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [addedMessage, setAddedMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  //const [token, setToken] = useState(null)
  const [createVisible, setCreateVisible] = useState(false)


  const Notification = ({message, isError}) => {
    if (message === null) {
      return null
    }

    return (
      <div className={isError ? "error" : "added"}>
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




  const loginForm = () => (
    <>
      <h2>Log in to application</h2>
      <Notification message={errorMessage} isError={true}/>
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

  const createForm = () => {
    const hideWhenVisible = {display: createVisible ? 'none' : ''}
    const showWhenVisible = {display: createVisible ? '' : 'none'}
    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setCreateVisible(true)}>new blog</button>
        </div>
        <div style={showWhenVisible}>
          <CreateBlog
            setAddedMessage={setAddedMessage}
            setBlogs={setBlogs}
            setCreateVisible={setCreateVisible}
          />
          <button onClick={() => setCreateVisible(false)}>cancel</button>
        </div>
      </div>
    )
  }


  const blogList = () => {
    return (
      <div>
        <h2>Blogs</h2>
        <Notification message={addedMessage} isError={false}/>
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
      {user === null && loginForm()}
      {user !== null && blogList()}
    </div>
  )
}


export default App