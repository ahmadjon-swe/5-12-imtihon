import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { logoutAPI } from '../api/auth.api'
import ProfileModal from './ProfileModal'

export default function Navbar() {
  const { user, isAdmin, isActingAsAdmin, toggleViewMode, logout } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const [showProfile, setShowProfile] = useState(false)

  const handleLogout = async () => {
    try { await logoutAPI() } catch (e) { void e }
    navigate('/')
    logout()
    toast.success('Chiqildi')
  }

  const handleToggleMode = () => {
    toggleViewMode()
    if (!isActingAsAdmin) {
      navigate('/admin')
    } else {
      navigate('/')
    }
  }

  const homeLink = isActingAsAdmin ? '/admin' : '/'

  return (
    <>
      <nav className="navbar">
        <div className="container">
          <Link to={homeLink} className="navbar-logo">
            AUTO<span>BAZAR</span>
          </Link>

          <div className="navbar-actions">
            {user ? (
              <>
                {isAdmin && (
                  <button className="mode-toggle" onClick={handleToggleMode}>
                    {isActingAsAdmin ? '👤 Foydalanuvchi rejimi' : '⚡ Admin rejimi'}
                  </button>
                )}

                {!isActingAsAdmin && (
                  <Link to="/saved" className="btn btn-ghost btn-sm">
                    🔖 Saqlangan
                  </Link>
                )}

                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => setShowProfile(true)}
                  title="Profil"
                >
                  {user?.username?.[0].toUpperCase()}
                </button>

                <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
                  Chiqish
                </button>
              </>
            ) : (
              <Link to="/login" className="btn btn-primary btn-sm">
                Kirish
              </Link>
            )}
          </div>
        </div>
      </nav>

      {showProfile && <ProfileModal onClose={() => setShowProfile(false)} />}
    </>
  )
}