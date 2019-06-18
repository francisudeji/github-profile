import React, { useContext, createContext, useReducer, useMemo } from 'react'

const AppContext = createContext()

function reducer(state, { type, payload }) {
  switch (type) {
    case 'SET_USER': {
      return { ...state, user: payload }
    }
    default:
      return state
  }
}

function AppProvider({ children }) {
  const initialState = {
    APP_NAME: 'GITHUB PROFILE',
    token: null,
    user: null
  }

  useMemo(() => initialState, [initialState])

  const [state, dispatch] = useReducer(reducer, initialState)
  const value = { state, dispatch }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

function useAppContext() {
  const { state, dispatch } = useContext(AppContext)
  return { state, dispatch }
}

export { AppProvider, useAppContext }
