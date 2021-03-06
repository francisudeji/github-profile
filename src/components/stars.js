import React from 'react'
import { FaStar } from 'react-icons/fa'
import distanceInWords from 'date-fns/distance_in_words'
import { format } from 'date-fns'
import isThisYear from 'date-fns/is_this_year'

function Stars({ starredRepos }) {
  return (
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
                / <span style={{ fontWeight: 600 }}>{starredRepo.name}</span>
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
                    : `Updated on ${format(starredRepo.updated_at, 'D MMM')}`
                  : `Updated ${distanceInWords(
                      new Date().toISOString(),
                      starredRepo.updated_at
                    )} ago`}
              </small>
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
              <FaStar style={{ marginRight: '4px' }} /> Unstar
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Stars
