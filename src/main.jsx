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
import Payment from './pages/Payment'
import Confirmation from './pages/Confirmation'
import UploadImage from './pages/UploadImage'
import AdminPanel from './pages/AdminPanel'
import CreateProduct from './pages/CreateProduct'
import UpdateProduct from './pages/UpdateProduct'
import DeleteProduct from './pages/DeleteProduct'
import ProductDetails from './pages/ProductDetails'

const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  { path: '/forgot-password', element: <Recovery /> },
  { path: '/change-password', element: <ChangePassword /> },
  { path: '/verify-email', element: <EmailConfirmed /> },
  { path: '/profile-address', element: <Addresses /> },
  { path: '/cart', element: <Cart /> },
  { path: '/product/:productId', element: <ProductDetails /> },
  { path: '/payment', element: <Payment /> },
  { path: '/confirmation', element: <Confirmation /> },
  { path: '/profile', element: <Profile /> },
  { path: '/profile-data', element: <ProfileData /> },
  { path: '/my-orders', element: <Purchases /> },
  { path: '/admin', element: <AdminPanel /> },
  { path: '/admin/create-product', element: <CreateProduct /> },
  { path: '/admin/update-product', element: <UpdateProduct /> },
  { path: '/admin/delete-product', element: <DeleteProduct /> },
  { path: '/admin/upload-image', element: <UploadImage /> },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
