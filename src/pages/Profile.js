import React, { useEffect, useState } from 'react'
import { getUserProfile } from '../utils'
import { Link } from 'react-router-dom'
import { FaUsers, FaMapMarker, FaEnvelope, FaLink } from 'react-icons/fa'
import distanceInWords from 'date-fns/distance_in_words'
import '../styles/profile.css'
import Tabs from '../components/tabs'
import { format } from 'date-fns'

function Profile({ match, location }) {
  let username = match.params.username
  const [{ basicInfo, allRepos, starredRepos }, setState] = useState({})
  const [hasAllData, setHasAllData] = useState(false)

  console.log(location)

  useEffect(() => {
    getUserProfile(username)
      .then(data => {
        setState({ ...data })
        setHasAllData(true)
      })
      .catch(err => console.log(err))
  }, [username, location])

  return (
    <div className='profile'>
      <div className='container mt-5'>
        {hasAllData ? (
          <div className='row'>
            <div className='col-xs-12 col-sm-12 col-md-8 col-lg-8'>
              <pre className='pr-5'>{JSON.stringify(allRepos, null, 2)}</pre>
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
            <div className='col-xs-12 col-sm-12 col-md-4 col-lg-4'>
              <Tabs
                repos={allRepos.length}
                followers={basicInfo.followers}
                following={basicInfo.following}
                stars={starredRepos.length}
                username={username}
                pathname={location.pathname}
              />

              {allRepos.map(repo => (
                <div
                  className='card card-body'
                  key={repo.id}
                  style={{
                    borderLeft: 0,
                    borderTop: 0,
                    borderRight: 0
                  }}
                >
                  <h3 style={{ fontSize: '1.2rem' }}>
                    <a href={repo.html_url}>{repo.name}</a>
                  </h3>
                  <p className='d-inline-block text-gray mb-2 pr-4'>
                    {repo.description}
                  </p>
                  <p>
                    <small>
                      {/* {console.log(
                        String(
                          distanceInWords(
                            new Date().toISOString(),
                            repo.updated_at
                          )
                        ).indexOf('months')
                      )} */}
                      {String(
                        distanceInWords(
                          new Date().toISOString(),
                          repo.updated_at
                        )
                      ).indexOf('months') > 0
                        ? `Updated on ${format(repo.updated_at, 'D MMM')}`
                        : `Updated ${distanceInWords(
                            new Date().toISOString(),
                            repo.updated_at
                          )} ago`}
                    </small>
                  </p>
                </div>
              ))}
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
