import React, { useEffect, useState } from 'react'
import netlify from 'netlify-auth-providers'
import { FaGithub } from 'react-icons/fa'
import '../styles/home.css'

function HomeWrapper({ children }) {
  return (
    <div className='home'>
      <div className='container'>
        <div className='row'>
          <div className='col-xs-12 col-sm-12 col-md-6 col-lg-6 mx-auto wrapper'>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  async function authWithGitHub() {
    return new Promise((resolve, reject) => {
      var authenticator = new netlify({
        site_id: 'bb636699-af55-440f-84e8-0076e8f1aab5'
      })
      authenticator.authenticate(
        { provider: 'github', scope: 'public_repo,read:org,read:user' },
        function(err, data) {
          if (err) {
            console.log(err)
            reject(err)
          }
          console.log(data)
          resolve(data)
        }
      )
    })
  }

  useEffect(() => {
    const token = localStorage.getItem('github-token')
    if (token !== null) {
      setIsAuthenticated(true)
    }
  }, [isAuthenticated])

  async function getToken() {
    const data = await authWithGitHub().catch(error => {
      console.log({ error })
    })
    localStorage.setItem('github-token', data.token)
    setIsAuthenticated(true)
  }

  if (isAuthenticated) {
    return (
      <HomeWrapper>
        <form>
          <div className='form-group'>
            <input
              type='text'
              className='form-control'
              name='username'
              placeholder='Search by typing a username'
              autoFocus
            />
          </div>
          <input type='submit' className='btn btn-success btn-block' />
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
