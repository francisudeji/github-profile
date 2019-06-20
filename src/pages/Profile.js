import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { getUserProfile } from '../utils'
import {
  FaUsers,
  FaMapMarker,
  FaEnvelope,
  FaLink,
  FaBell,
  FaPlus,
  FaCaretDown
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

function Profile({ match, location, history }) {
  let username = match.params.username
  const [
    { basicInfo, allRepos, starredRepos, followers, following },
    setState
  ] = useState({})
  const [hasAllData, setHasAllData] = useState(false)
  const [err, setErr] = useState(null)
  const [token, setToken] = useState(null)

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
  useEffect(() => {
    const token = localStorage.getItem('github-token')
    setToken(token)
    loadProfile()
  }, [])

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
          <div className='dropdown' style={{ display: 'inline' }}>
            <button
              style={{ background: 'transparent', color: '#fff' }}
              type='button'
              className='btn dropdown-toggle'
              role='button'
              id='dropdownMenuLink'
              data-toggle='dropdown'
              aria-haspopup='true'
              aria-expanded='false'
            >
              {hasAllData && (
                <>
                  <img
                    src={basicInfo.avatar_url}
                    width='20'
                    alt={basicInfo.login}
                  />
                </>
              )}
            </button>

            <div className='dropdown-menu' aria-labelledby='dropdownMenuLink'>
              <a
                className='dropdown-item'
                href={`https://github.com/${hasAllData && basicInfo.login}`}
              >
                <div>Signed in as</div>
                <strong>{hasAllData && basicInfo.login}</strong>
              </a>
              <div className='dropdown-divider' />
              <a
                className='dropdown-item'
                href={`https://github.com/${hasAllData && basicInfo.login}`}
              >
                Your Profile
              </a>
              <a
                className='dropdown-item'
                href={`https://github.com/${hasAllData &&
                  basicInfo.login}?tab=repositories`}
              >
                Your Repositories
              </a>
              <a
                className='dropdown-item'
                href={`https://github.com/${hasAllData &&
                  basicInfo.login}?tab=projects`}
              >
                Your Projects
              </a>
              <a
                className='dropdown-item'
                href={`https://github.com/${hasAllData &&
                  basicInfo.login}?tab=stars`}
              >
                Your Stars
              </a>
              <a
                className='dropdown-item'
                href={`https://gist.github.com/mine`}
              >
                Your Gists
              </a>
              <div className='dropdown-divider' />
              <a className='dropdown-item' href={`https://help.github.com`}>
                Help
              </a>
              <a
                className='dropdown-item'
                href={`https://github.com/settings/profile`}
              >
                Settings
              </a>
              <button
                className='dropdown-item'
                onClick={e => {
                  localStorage.removeItem('github-token')
                  history.push(`/`)
                }}
              >
                Signout
              </button>
            </div>
          </div>
        </div>
      </nav>
      <div className='container mt-4 mb-5'>
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
      <footer className='py-5'>
        <div className='container'>
          <div className='row'>
            <ul
              style={{ listStyle: 'none' }}
              className='mb-2 list-style-none d-flex flex-wrap col-12 col-lg-5 flex-justify-center flex-lg-justify-between mb-2 mb-lg-0'
            >
              <li className='mr-3 px-2 mr-lg-0'>
                © 2019 <span>GitHub</span>, Inc.
              </li>
              <li className='mr-3 px-2 mr-lg-0'>
                <a
                  data-ga-click='Footer, go to terms, text:terms'
                  href='https://github.com/site/terms'
                >
                  Terms
                </a>
              </li>
              <li className='mr-3 px-2 mr-lg-0'>
                <a
                  data-ga-click='Footer, go to privacy, text:privacy'
                  href='https://github.com/site/privacy'
                >
                  Privacy
                </a>
              </li>
              <li className='mr-3 px-2 mr-lg-0'>
                <a
                  data-ga-click='Footer, go to security, text:security'
                  href='https://github.com/security'
                >
                  Security
                </a>
              </li>
              <li className='mr-3 px-2 mr-lg-0'>
                <a
                  href='https://githubstatus.com/'
                  data-ga-click='Footer, go to status, text:status'
                >
                  Status
                </a>
              </li>
              <li>
                <a
                  data-ga-click='Footer, go to help, text:help'
                  href='https://help.github.com'
                >
                  Help
                </a>
              </li>
            </ul>

            <a
              aria-label='Homepage'
              title='GitHub'
              className='footer-octicon d-none d-lg-block mx-lg-4'
              href='https://github.com'
            >
              <svg
                height='24'
                className='octicon octicon-mark-github'
                viewBox='0 0 16 16'
                version='1.1'
                width='24'
                aria-hidden='true'
              >
                <path
                  fill-rule='evenodd'
                  d='M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z'
                />
              </svg>
            </a>

            <ul
              style={{ listStyle: 'none' }}
              className='mb-2 list-style-none d-flex flex-wrap col-12 col-lg-5 flex-justify-center flex-lg-justify-between mb-2 mb-lg-0 ml-auto'
            >
              <li className='mr-3 px-2 mr-lg-0'>
                <a
                  data-ga-click='Footer, go to contact, text:contact'
                  href='https://github.com/contact'
                >
                  Contact GitHub
                </a>
              </li>
              <li className='mr-3 px-2 mr-lg-0'>
                <a
                  href='https://github.com/pricing'
                  data-ga-click='Footer, go to Pricing, text:Pricing'
                >
                  Pricing
                </a>
              </li>
              <li className='mr-3 px-2 mr-lg-0'>
                <a
                  href='https://developer.github.com'
                  data-ga-click='Footer, go to api, text:api'
                >
                  API
                </a>
              </li>
              <li className='mr-3 px-2 mr-lg-0'>
                <a
                  href='https://training.github.com'
                  data-ga-click='Footer, go to training, text:training'
                >
                  Training
                </a>
              </li>
              <li className='mr-3 px-2 mr-lg-0'>
                <a
                  href='https://github.blog'
                  data-ga-click='Footer, go to blog, text:blog'
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  data-ga-click='Footer, go to about, text:about'
                  href='https://github.com/about'
                >
                  About
                </a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Profile
