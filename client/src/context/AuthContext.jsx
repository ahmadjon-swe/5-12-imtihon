import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

const getInitialAuth = () => {
const saved = localStorage.getItem('access_token')
const savedUser = localStorage.getItem('user')

if (saved && savedUser) {
const u = JSON.parse(savedUser)
return {
token: saved,
user: u,
viewMode: (u.role === 'admin' || u.role === 'superadmin') ? 'admin' : 'user'
}
}

return {
token: null,
user: null,
viewMode: 'user'
}
}

export function AuthProvider({ children }) {

const initial = getInitialAuth()

const [user, setUser] = useState(initial.user)
const [token, setToken] = useState(initial.token)
const [viewMode, setViewMode] = useState(initial.viewMode)
const [pendingEmail, setPendingEmail] = useState(null)

const login = (accessToken, userData) => {
localStorage.setItem('access_token', accessToken)
localStorage.setItem('user', JSON.stringify(userData))
setToken(accessToken)
setUser(userData)
setViewMode(
userData.role === 'admin' || userData.role === 'superadmin'
? 'admin'
: 'user'
)
}

const logout = () => {
localStorage.removeItem('access_token')
localStorage.removeItem('user')
setToken(null)
setUser(null)
setViewMode('user')
setPendingEmail(null)
}

const toggleViewMode = () => {
setViewMode(prev => prev === 'admin' ? 'user' : 'admin')
}

const isAdmin = user?.role === 'admin' || user?.role === 'superadmin'
const isActingAsAdmin = isAdmin && viewMode === 'admin'

return (
<AuthContext.Provider
value={{
user,
token,
viewMode,
pendingEmail,
isAdmin,
isActingAsAdmin,
login,
logout,
toggleViewMode,
setPendingEmail
}}
>
{children}
</AuthContext.Provider>
)
}


// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext)
