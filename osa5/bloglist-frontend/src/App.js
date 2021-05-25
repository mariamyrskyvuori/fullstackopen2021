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
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)


  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {

      const user = await loginService.login({
        username, password,
      })
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const loginForm = () => (
    <>
      <h2>Log in to application</h2>
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

  const blogList = () => {
    return (
      <div>
        <h2>Blogs</h2>
        <div>{user.name} logged in</div>
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