import React, { useEffect, useState } from 'react'
import { FaGithub } from 'react-icons/fa'
import axios from 'axios'
import { authenticateWithGithub } from '../utils'
import HomeWrapper from '../components/home-wrapper'
import '../styles/home.css'

function Home({ history }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [token, setToken] = useState(null)
  const [username, setUsername] = useState('')
  const [error, setError] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('github-token')
    if (token !== null) {
      setIsAuthenticated(true)
      setToken(token)
    }
  }, [isAuthenticated])

  async function getToken() {
    const data = await authenticateWithGithub().catch(error => {
      console.log({ error })
    })
    localStorage.setItem('github-token', data.token)
    setIsAuthenticated(true)
  }

  function handleChange(e) {
    setUsername(e.target.value)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const baseURL = 'https://api.github.com/users'
    const headers = { Authorization: `bearer ${token}` }
    setError(null)
    setUsername('')

    axios
      .get(`${baseURL}/${username}`, { headers })
      .then(res => {
        history.push(`/${username}/repositories`)
      })
      .catch(({ response }) => {
        setUsername('')
        setError(response.statusText)
      })
  }

  if (isAuthenticated) {
    return (
      <HomeWrapper>
        {error !== null && (
          <div className='alert alert-danger fade show' role='alert'>
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className='form-group'>
            <label htmlFor='username'>Username</label>
            <input
              type='search'
              className='form-control'
              id='username'
              value={username}
              onChange={handleChange}
              placeholder='Search by typing a username'
              autoFocus
            />
          </div>
          <input
            type='submit'
            value='Search'
            className='btn btn-success btn-block'
          />
        </form>
      </HomeWrapper>
    )
  }

  return (
    <HomeWrapper>
      <h3>Github Profile</h3>
      <br />
      <p className='lead'>Login with your Github account to continue</p>
      <button onClick={getToken} className='btn btn-success'>
        <FaGithub /> Login With Github
      </button>
    </HomeWrapper>
  )
}

export default Home
