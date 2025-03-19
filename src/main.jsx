import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home'
import Profile from './pages/Profile'
import ProfileData from './pages/ProfileData'
import Register from './pages/Register'
import Purchases from './pages/Purchases'
import Recovery from './pages/Recovery'
import ChangePassword from './pages/ChangePassword'
import EmailConfirmed from './pages/EmailConfirmed'
import Addresses from './pages/Addresses'
import Cart from './pages/Cart'

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/forgot-password',
    element: <Recovery />,
  },
  {
    path: '/change-password',
    element: <ChangePassword />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/profile',
    element: <Profile />,
  },
  {
    path: '/profile-data',
    element: <ProfileData />,
  },
  {
    path: '/my-orders',
    element: <Purchases />,
  },
  {
    path: '/verify-email',
    element: <EmailConfirmed />,
  },
  {
    path: '/profile-address',
    element: <Addresses />,
  },
  {
    path: '/cart',
    element: <Cart />,
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
