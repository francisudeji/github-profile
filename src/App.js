import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import Home from './pages/Home'
import Login from './pages/Login.js'
import Profile from './pages/Profile'

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path='/' component={Home} />
        <Route exact path='/login' component={Login} />
        <Route exact path='/profile' component={Profile} />
      </Switch>
    </Router>
  )
}

export default App
