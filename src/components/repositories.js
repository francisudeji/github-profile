import React from 'react'
import { FaStar } from 'react-icons/fa'
import distanceInWords from 'date-fns/distance_in_words'
import { format } from 'date-fns'
import isThisYear from 'date-fns/is_this_year'

function Repositories({ allRepos }) {
  return (
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
                  distanceInWords(new Date().toISOString(), repo.updated_at)
                ).indexOf('months') > 0
                  ? !isThisYear(repo.updated_at)
                    ? `Updated on ${format(repo.updated_at, 'D MMM YYYY')}`
                    : `Updated on ${format(repo.updated_at, 'D MMM')}`
                  : `Updated ${distanceInWords(
                      new Date().toISOString(),
                      repo.updated_at
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
              <FaStar style={{ marginRight: '4px' }} /> Star
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Repositories
