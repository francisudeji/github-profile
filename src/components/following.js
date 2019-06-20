import React from 'react'
import { FaUsers, FaMarker } from 'react-icons/fa'

function Following({ following }) {
  return (
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
          <div className='card-header bg-white' style={{ border: 0 }}>
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
          <div className='card-footer bg-white' style={{ border: 0 }}>
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
              Unfollow
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Following
