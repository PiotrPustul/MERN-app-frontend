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

// hooks
import { useAuth } from './shared/hooks/auth-hook'

// layouts
import RootLayout from './shared/layouts/RootLayout'

const App = () => {
  const { token, login, logout, userId } = useAuth()

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
