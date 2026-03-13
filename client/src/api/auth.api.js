import api from './axios'

export const registerAPI = (data) => api.post('/register', data)
export const loginAPI = (data) => api.post('/login', data)
export const verifyAPI = (data) => api.post('/verify', data)
export const logoutAPI = () => api.post('/logout')
export const resendOtpAPI = (email) => api.post('/resend_otp', { email })
export const forgotPasswordAPI = (email) => api.post('/forgot_password', { email })
export const forgotPasswordVerifyAPI = (data) => api.post('/forgot_password_verify', data)
export const changePasswordAPI = (data) => api.patch('/change_password', data)
export const deleteAccountAPI = (password) => api.delete('/delete_account', { data: { password } })
