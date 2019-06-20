import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { getUserProfile } from '../utils'
import {
  FaUsers,
  FaMapMarker,
  FaEnvelope,
  FaLink,
  FaBell,
  FaPlus
} from 'react-icons/fa'
import '../styles/profile.css'
import Tabs from '../components/tabs'
import Repositories from '../components/repositories'
import Stars from '../components/stars'
import Followers from '../components/followers'
import Following from '../components/following'

function TabContents({ username, pathname, children }) {
  if (pathname.endsWith(username)) {
    return <div>{children[0]}</div>
  }

  return children.map(
    child =>
      child.props.className === pathname.split('/')[2] && (
        <div key={child.props.className}>{child}</div>
      )
  )
}

function Profile({ match, location }) {
  let username = match.params.username
  const [
    { basicInfo, allRepos, starredRepos, followers, following },
    setState
  ] = useState({})
  const [hasAllData, setHasAllData] = useState(false)
  const [err, setErr] = useState(null)
  const [token, setToken] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('github-token')
    setToken(token)
    loadProfile()
  }, [])

  function loadProfile() {
    setErr(null)
    setHasAllData(false)
    getUserProfile(username)
      .then(data => {
        setState({ ...data })
        setHasAllData(true)
      })
      .catch(err => {
        console.log(err.message)
        setErr(err.message)
        setHasAllData(false)
      })
  }

  function followUser(username) {
    const headers = {
      Authorization: `bearer ${token}`,
      'Content-Length': '0'
    }
    axios
      .put(`https://api.github.com/user/following/${username}`, { headers })
      .then(res => {
        console.log(res)
      })
      .catch(err => {
        console.log(err)
      })
  }

  return (
    <div className='profile'>
      <nav
        className='navbar navbar-expand-lg navbar-dark '
        style={{ background: '#000' }}
      >
        <a className='navbar-brand logo' href={`/${username}`}>
          <img alt='logo' src='/icon.png' height='40' width='40' />
        </a>

        <button
          className='navbar-toggler toggle-btn'
          type='button'
          data-toggle='collapse'
          data-target='#navbarSupportedContent'
          aria-controls='navbarSupportedContent'
          aria-expanded='false'
          aria-label='Toggle navigation'
        >
          <span className='navbar-toggler-icon' />
        </button>

        <div className='collapse navbar-collapse' id='navbarSupportedContent'>
          <form className='form-inline my-2 my-lg-0'>
            <input
              style={{ border: 0, background: '#212529', minWidth: '300px' }}
              className='form-control form-control-sm mr-sm-2 text-white'
              type='search'
              placeholder='Search or jump to'
              aria-label='Search'
            />
          </form>
          <ul className='navbar-nav mr-auto'>
            <li className='nav-item'>
              <a
                className='nav-link white-link'
                href='https://github.com/pulls'
              >
                Pull Requests
              </a>
            </li>
            <li className='nav-item'>
              <a
                className='nav-link white-link'
                href='https://github.com/issues'
              >
                Issues
              </a>
            </li>
            <li className='nav-item'>
              <a
                className='nav-link white-link'
                href='https://github.com/marketplace'
              >
                Marketplace
              </a>
            </li>
            <li className='nav-item'>
              <a
                className='nav-link white-link'
                href='https://github.com/explore'
              >
                Explore
              </a>
            </li>
          </ul>
        </div>
        <div className='ml-auto utils'>
          <span className='pr-2'>
            <FaBell style={{ color: '#fff' }} />{' '}
          </span>{' '}
          <span className='pr-2'>
            <FaPlus style={{ color: '#fff' }} />{' '}
          </span>
        </div>
      </nav>
      <div className='container mt-4'>
        {hasAllData ? (
          <div className='row'>
            <div className='col-xs-12 col-sm-12 col-md-4 col-lg-4'>
              <div className='top-wrapper'>
                <div className='img-container'>
                  <img
                    src={basicInfo.avatar_url}
                    width='270'
                    alt={basicInfo.login}
                  />
                </div>
                <div className='bottom-wrapper mb-2'>
                  <h3 className='mt-3'>{basicInfo.name}</h3>
                  <p className='lead'>{basicInfo.login}</p>
                </div>
              </div>
              <p>{basicInfo.bio}</p>
              {basicInfo.company !== null && (
                <p>
                  <FaUsers /> {basicInfo.company}
                </p>
              )}
              {basicInfo.location !== null && (
                <p>
                  <FaMapMarker /> {basicInfo.location}
                </p>
              )}
              {basicInfo.email !== null && (
                <p>
                  <FaEnvelope /> {basicInfo.email}
                </p>
              )}
              {basicInfo.blog !== '' && (
                <p>
                  <FaLink /> <a href={basicInfo.blog}>{basicInfo.blog}</a>
                </p>
              )}
            </div>
            <div className='col-xs-12 col-sm-12 col-md-8 col-lg-8'>
              <Tabs
                repos={allRepos.length}
                followers={basicInfo.followers}
                following={basicInfo.following}
                stars={starredRepos.length}
                username={username}
                pathname={location.pathname}
              />

              <TabContents username={username} pathname={location.pathname}>
                <Repositories className='repositories' allRepos={allRepos} />
                <Stars className='stars' starredRepos={starredRepos} />
                <Followers
                  className='followers'
                  followers={followers}
                  followUser={followUser}
                />

                <Following className='following' following={following} />
              </TabContents>
            </div>
          </div>
        ) : (
          <div
            className='lead text-center'
            style={{
              marginTop: '50vh'
            }}
          >
            {err === null ? (
              <>
                <p className='lead'>Fetching details for {username}</p>
                <div className='spinner-grow' role='status'>
                  <span className='sr-only'>Loading...</span>
                </div>
              </>
            ) : (
              <>
                <p className='lead'>{err}</p>
                <button onClick={loadProfile} className='btn btn-primary'>
                  Try Again
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile
