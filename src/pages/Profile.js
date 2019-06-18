import React, { useEffect, useState } from 'react'
import { getUserProfile } from '../utils'
import { Link } from 'react-router-dom'
import { FaUsers, FaMapMarker, FaEnvelope, FaLink } from 'react-icons/fa'
import '../styles/profile.css'

function Profile({ match, location }) {
  let username = match.params.username
  const [{ basicInfo, allRepos, starredRepos }, setState] = useState({})
  const [hasAllData, setHasAllData] = useState(false)

  useEffect(() => {
    getUserProfile(username)
      .then(data => {
        setState({ ...data })
        setHasAllData(true)
      })
      .catch(err => console.log(err))
  }, [username])

  return (
    <div className='profile'>
      <div className='container mt-5'>
        {hasAllData ? (
          <div className='row'>
            <div className='col-xs-12 col-sm-12 col-md-4 col-lg-4'>
              <pre>{JSON.stringify(allRepos, null, 2)}</pre>
              {/* <div className='img-container'>
                <img
                  src={basicInfo.avatar_url}
                  style={{ maxWidth: '270px', width: '100%' }}
                  width='270'
                  alt={basicInfo.login}
                />
              </div>
              <h3 className='mt-3'>{basicInfo.name}</h3>
              <p className='lead'>{basicInfo.login}</p>
              <button className='btn btn-secondary btn-block mb-3'>
                Follow
              </button>
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
              )} */}
            </div>
            <div className='col-xs-12 col-sm-12 col-md-8 col-lg-8'>
              {/* {hasAllData && <pre>{JSON.stringify(basicInfo, null, 2)}</pre>} */}

              <ul className='nav nav-tabs'>
                <li className='nav-item'>
                  <Link
                    className='nav-link text-dark active-tab'
                    to={`/${username}/repositories`}
                  >
                    Repositories{' '}
                    <span className='badge badge-light'>{allRepos.length}</span>
                  </Link>
                </li>
                <li className='nav-item'>
                  <Link
                    className='nav-link text-dark'
                    to={`/${username}/stars`}
                  >
                    Stars{' '}
                    <span className='badge badge-light'>
                      {starredRepos.length}
                    </span>
                  </Link>
                </li>
                <li className='nav-item'>
                  <Link
                    className='nav-link text-dark'
                    to={`/${username}/followers`}
                  >
                    Followers{' '}
                    <span className='badge badge-light'>
                      {basicInfo.followers}
                    </span>
                  </Link>
                </li>
                <li className='nav-item'>
                  <Link
                    className='nav-link text-dark'
                    to={`/${username}/following`}
                  >
                    Following{' '}
                    <span className='badge badge-light'>
                      {basicInfo.following}
                    </span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <p className='lead'>Loading...</p>
        )}
      </div>
    </div>
  )
}

export default Profile
