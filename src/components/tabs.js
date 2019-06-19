import React from 'react'
import { Link } from 'react-router-dom'
import '../styles/tab.css'

function Tabs({ repos, followers, following, stars, username, pathname }) {
  const routes = [
    { count: repos, text: 'Repositories', path: `/${username}/repositories` },
    { count: stars, text: 'Stars', path: `/${username}/stars` },
    { count: followers, text: 'Followers', path: `/${username}/followers` },
    { count: following, text: 'Following', path: `/${username}/following` }
  ]

  return (
    <ul className='nav nav-tabs mb-3'>
      {routes.map(route => (
        <li
          className='nav-item pb-1'
          key={route.text}
          style={{
            display: 'flex'
          }}
        >
          <Link
            className={
              route.path === pathname
                ? 'nav-link text-dark pb-3 active-tab'
                : 'nav-link text-dark pb-3'
            }
            to={route.path}
          >
            {route.text}{' '}
            <span className='badge badge-light'>{route.count}</span>
          </Link>
        </li>
      ))}
    </ul>
  )
}

export default Tabs
