import api from './axios'

// ── Cars ──
export const getAllCarsAPI = (params) => api.get('/get_all_cars', { params })
export const getMyCarsAPI = (params) => api.get('/get_my_cars', { params })
export const getOneCarAPI = (id) => api.get(`/get_one_car/${id}`)
export const addCarAPI = (data) => api.post('/add_car', data)
export const updateCarAPI = (id, data) => api.put(`/update_car/${id}`, data)
export const deleteCarAPI = (id) => api.delete(`/delete_car/${id}`)

// ── Categories ──
export const getAllCategoriesAPI = (params) => api.get('/get_all_categories', { params })
export const getMyCategoriesAPI = (params) => api.get('/get_my_categories', { params })
export const getOneCategoryAPI = (id) => api.get(`/get_one_category/${id}`)
export const addCategoryAPI = (data) => api.post('/add_category', data)
export const updateCategoryAPI = (id, data) => api.put(`/update_category/${id}`, data)
export const deleteCategoryAPI = (id) => api.delete(`/delete_category/${id}`)

// ── Save ──
export const saveCarAPI = (id) => api.post(`/save_car/${id}`)
export const getSavedCarsAPI = () => api.get('/get_saved_cars')
export const clearUnsavedCarsAPI = () => api.delete('/clear_unsaved_car')

// ── Superadmin ──
export const changeRoleAPI = (id) => api.patch(`/change_role_admin/${id}`)
