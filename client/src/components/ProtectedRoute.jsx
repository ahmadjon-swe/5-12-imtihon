import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function ProtectedRoute({ children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/" replace />
  return children
}

export function AdminRoute({ children }) {
  const { user, isActingAsAdmin } = useAuth()
  if (!user) return <Navigate to="/" replace />
  if (!isActingAsAdmin) return <Navigate to="/user" replace />
  return children
}
