import { useState, useCallback, useEffect } from 'react'
import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider,
} from 'react-router-dom'
import { AuthContext } from './shared/context/auth-context'

// pages
import Users from './user/pages/Users'
import NotFoundPage from './places/pages/NotFoundPage'
import NewPlace from './places/pages/NewPlace'
import UserPlaces from './places/pages/UserPlaces'
import UpdatePlace from './places/pages/UpdatePlace'
import Auth from './user/pages/Auth'

// layouts
import RootLayout from './shared/layouts/RootLayout'

let logoutTimer

const App = () => {
  const [token, setToken] = useState(false)
  const [tokenExpiration, setTokenExpiration] = useState()
  const [userId, setUserId] = useState(false)

  const login = useCallback((uid, token, expirationDate) => {
    setToken(token)
    setUserId(uid)

    const tokenExpirationDate =
      expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60)
    setTokenExpiration(tokenExpirationDate)

    localStorage.setItem(
      'userData',
      JSON.stringify({
        userId: uid,
        token: token,
        expiration: tokenExpirationDate.toISOString(),
      })
    )
  }, [])

  const logout = useCallback(() => {
    setToken(null)
    setTokenExpiration(null)
    setUserId(null)
    localStorage.removeItem('userData')
  }, [])

  useEffect(() => {
    if (token && tokenExpiration) {
      const remainingTime = tokenExpiration.getTime() - new Date().getTime()

      logoutTimer = setTimeout(logout, remainingTime)
    } else {
      clearTimeout(logoutTimer)
    }
  }, [token, logout, tokenExpiration])

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('userData'))

    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date()
    ) {
      login(
        storedData.userId,
        storedData.token,
        new Date(storedData.expiration)
      )
    }
  }, [login])

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<RootLayout />}>
        <Route index element={<Users />} />
        <Route path=':userId/places' element={<UserPlaces />} />
        <Route
          path=':userId/places/:placeId'
          element={token ? <UpdatePlace /> : <Navigate replace to='/auth' />}
        />
        <Route
          path='places/new'
          element={token ? <NewPlace /> : <Navigate replace to='/auth' />}
        />
        <Route path='auth' element={!token ? <Auth /> : <Navigate to='/' />} />
        <Route path='*' element={<NotFoundPage />} />
      </Route>
    )
  )

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        login: login,
        logout: logout,
      }}
    >
      <RouterProvider router={router} />
    </AuthContext.Provider>
  )
}

export default App
