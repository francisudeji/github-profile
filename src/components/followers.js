import React from 'react'
import { FaUsers, FaMarker } from 'react-icons/fa'

function Followers({ followers, followUser }) {
  return (
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
          <div className='card-header bg-white' style={{ border: 0 }}>
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
                <strong>{follower.name}</strong> <span>{follower.login}</span>
              </a>
            </h3>
            <p className='d-inline-block text-gray mb-2 pr-4'>{follower.bio}</p>
            <p>
              {follower.company && (
                <small className='small-text'>
                  <FaUsers style={{ marginBottom: '2px' }} /> {follower.company}
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
          <div className='card-footer bg-white' style={{ border: 0 }}>
            <button
              onClick={e => followUser(follower.login)}
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
  )
}

export default Followers
