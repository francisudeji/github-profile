import React from 'react'

function HomeWrapper({ children }) {
  return (
    <div className='home'>
      <div className='container'>
        <div className='row'>
          <div className='col-xs-12 col-sm-12 col-md-6 col-lg-6 mx-auto wrapper'>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomeWrapper
