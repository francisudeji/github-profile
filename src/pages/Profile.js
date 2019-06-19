import React, { useEffect, useState } from 'react'
import { getUserProfile } from '../utils'
import {
  FaUsers,
  FaMapMarker,
  FaEnvelope,
  FaLink,
  FaStar,
  FaMarker
} from 'react-icons/fa'
import distanceInWords from 'date-fns/distance_in_words'
import isThisYear from 'date-fns/is_this_year'
import '../styles/profile.css'
import Tabs from '../components/tabs'
import { format } from 'date-fns'

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

  useEffect(() => {
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

  return (
    <div className='profile'>
      <div className='container mt-5'>
        {hasAllData ? (
          <div className='row'>
            <div className='col-xs-12 col-sm-12 col-md-4 col-lg-4'>
              {console.log(followers, following)}
              <div className='img-container'>
                <img
                  src={basicInfo.avatar_url}
                  style={{ width: '100%', maxWidth: '270px' }}
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
                <div className='repositories'>
                  {allRepos.map(repo => (
                    <div
                      className='card'
                      key={repo.id}
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderLeft: 0,
                        borderTop: 0,
                        borderRight: 0
                      }}
                    >
                      <div className='card-body'>
                        <h3 style={{ fontSize: '1.2rem' }}>
                          <a href={repo.html_url}>{repo.name}</a>
                        </h3>
                        <p className='d-inline-block text-gray mb-2 pr-4'>
                          {repo.description}
                        </p>
                        <p>
                          <small className='small-text'>
                            <FaStar style={{ marginBottom: '2px' }} />{' '}
                            {repo.stargazers_count}
                          </small>{' '}
                          <small className='small-text'>
                            {String(
                              distanceInWords(
                                new Date().toISOString(),
                                repo.updated_at
                              )
                            ).indexOf('months') > 0
                              ? !isThisYear(repo.updated_at)
                                ? `Updated on ${format(
                                    repo.updated_at,
                                    'D MMM YYYY'
                                  )}`
                                : `Updated on ${format(
                                    repo.updated_at,
                                    'D MMM'
                                  )}`
                              : `Updated ${distanceInWords(
                                  new Date().toISOString(),
                                  repo.updated_at
                                )} ago`}
                          </small>
                        </p>
                      </div>
                      <div
                        className='card-footer bg-white'
                        style={{ border: 0 }}
                      >
                        <button
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            color: '#24292e',
                            backgroundColor: '#eff3f6'
                          }}
                          className='btn btn-light btn-sm'
                        >
                          <FaStar style={{ marginRight: '4px' }} /> Star
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className='stars'>
                  {starredRepos.map(starredRepo => (
                    <div
                      className='card'
                      key={starredRepo.id}
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderLeft: 0,
                        borderTop: 0,
                        borderRight: 0
                      }}
                    >
                      <div className='card-body'>
                        <h3 style={{ fontSize: '1.2rem' }}>
                          <a href={starredRepo.html_url}>
                            <span style={{ fontWeight: 400 }}>
                              {starredRepo.owner.login}
                            </span>{' '}
                            /{' '}
                            <span style={{ fontWeight: 600 }}>
                              {starredRepo.name}
                            </span>
                          </a>
                        </h3>
                        <p className='d-inline-block text-gray mb-2 pr-4'>
                          {starredRepo.description}
                        </p>
                        <p>
                          <small className='small-text'>
                            <FaStar style={{ marginBottom: '2px' }} />{' '}
                            {starredRepo.stargazers_count}
                          </small>{' '}
                          <small className='small-text'>
                            {String(
                              distanceInWords(
                                new Date().toISOString(),
                                starredRepo.updated_at
                              )
                            ).indexOf('months') > 0
                              ? !isThisYear(starredRepo.updated_at)
                                ? `Updated on ${format(
                                    starredRepo.updated_at,
                                    'D MMM YYYY'
                                  )}`
                                : `Updated on ${format(
                                    starredRepo.updated_at,
                                    'D MMM'
                                  )}`
                              : `Updated ${distanceInWords(
                                  new Date().toISOString(),
                                  starredRepo.updated_at
                                )} ago`}
                          </small>
                        </p>
                      </div>
                      <div
                        className='card-footer bg-white'
                        style={{ border: 0 }}
                      >
                        <button
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            color: '#24292e',
                            backgroundColor: '#eff3f6'
                          }}
                          className='btn btn-light btn-sm'
                        >
                          <FaStar style={{ marginRight: '4px' }} /> Unstar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className='followers'>
                  {followers.map(follower => (
                    <div
                      className='card'
                      key={follower.id}
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderLeft: 0,
                        borderTop: 0,
                        borderRight: 0
                      }}
                    >
                      <div
                        className='card-header bg-white'
                        style={{ border: 0 }}
                      >
                        <img
                          src={follower.avatar_url}
                          height='50'
                          width='50'
                          alt={follower.login}
                        />
                      </div>
                      <div className='card-body'>
                        <h3 style={{ fontSize: '1.2rem' }}>
                          <a href={follower.html_url}>
                            <strong>{follower.name}</strong>{' '}
                            <span>{follower.login}</span>
                          </a>
                        </h3>
                        <p className='d-inline-block text-gray mb-2 pr-4'>
                          {follower.bio}
                        </p>
                        <p>
                          {follower.company && (
                            <small className='small-text'>
                              <FaUsers style={{ marginBottom: '2px' }} />{' '}
                              {follower.company}
                            </small>
                          )}
                          {follower.location && (
                            <small className='small-text'>
                              <FaMarker style={{ marginBottom: '2px' }} />{' '}
                              {follower.location}
                            </small>
                          )}
                        </p>
                      </div>
                      <div
                        className='card-footer bg-white'
                        style={{ border: 0 }}
                      >
                        <button
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            color: '#24292e',
                            backgroundColor: '#eff3f6'
                          }}
                          className='btn btn-light btn-sm'
                        >
                          Follow
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className='following'>
                  {following.map((_following, i) => (
                    <div
                      className='card'
                      key={i}
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderLeft: 0,
                        borderTop: 0,
                        borderRight: 0
                      }}
                    >
                      {console.log({ _following })}
                      <div
                        className='card-header bg-white'
                        style={{ border: 0 }}
                      >
                        <img
                          src={_following.avatar_url}
                          height='50'
                          width='50'
                          alt={_following.login}
                        />
                      </div>
                      <div className='card-body'>
                        <h3 style={{ fontSize: '1.2rem' }}>
                          <a href={_following.html_url}>
                            <strong>{_following.name}</strong>{' '}
                            <span>{_following.login}</span>
                          </a>
                        </h3>
                        <p className='d-inline-block text-gray mb-2 pr-4'>
                          {_following.bio}
                        </p>
                        <p>
                          {_following.company && (
                            <small className='small-text'>
                              <FaUsers style={{ marginBottom: '2px' }} />{' '}
                              {_following.company}
                            </small>
                          )}
                          {_following.location && (
                            <small className='small-text'>
                              <FaMarker style={{ marginBottom: '2px' }} />{' '}
                              {_following.location}
                            </small>
                          )}
                        </p>
                      </div>
                      <div
                        className='card-footer bg-white'
                        style={{ border: 0 }}
                      >
                        <button
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            color: '#24292e',
                            backgroundColor: '#eff3f6'
                          }}
                          className='btn btn-light btn-sm'
                        >
                          Follow
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
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
