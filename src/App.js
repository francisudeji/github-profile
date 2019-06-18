import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { AppProvider } from './context'
import Home from './pages/home'
import Profile from './pages/profile'

function App() {
  return (
    <AppProvider>
      <Router>
        <Switch>
          <Route exact path='/' component={Home} />
          <Route path='/:username' component={Profile} />
        </Switch>
      </Router>
    </AppProvider>
  )
}

export default App
