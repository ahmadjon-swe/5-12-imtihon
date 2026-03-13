import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'

import Home from './pages/Home'
import CategoryCars from './pages/user/CategoryCars'
import CarDetail from './pages/user/CarDetail'
import SavedCars from './pages/user/SavedCars'

import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Verify from './pages/auth/Verify'
import { ForgotPassword, ForgotPasswordVerify } from './pages/auth/ForgotPassword'

import AdminDashboard from './pages/admin/AdminDashboard'
import { AddCar } from './pages/admin/AddCar'
import EditCar from './pages/admin/EditCar'
import { AddCategory } from './pages/admin/AddCategory'
import EditCategory from './pages/admin/EditCategory'

import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute'

function AppRoutes() {
  const { user } = useAuth()

  return (
    <Routes>
      {/* ── Public ── */}
      <Route path="/" element={<Home />} />
      <Route path="/category/:id" element={<CategoryCars />} />
      <Route path="/car/:id" element={<CarDetail />} />

      {/* ── Auth ── */}
      <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
      <Route path="/verify" element={<Verify />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/forgot-password-verify" element={<ForgotPasswordVerify />} />

      {/* ── User (login kerak) ── */}
      <Route path="/saved" element={<ProtectedRoute><SavedCars /></ProtectedRoute>} />

      {/* ── Admin ── */}
      <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      <Route path="/admin/add-car" element={<AdminRoute><AddCar /></AdminRoute>} />
      <Route path="/admin/edit-car/:id" element={<AdminRoute><EditCar /></AdminRoute>} />
      <Route path="/admin/add-category" element={<AdminRoute><AddCategory /></AdminRoute>} />
      <Route path="/admin/edit-category/:id" element={<AdminRoute><EditCategory /></AdminRoute>} />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}