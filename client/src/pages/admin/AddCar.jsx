import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import { addCarAPI, updateCarAPI, getOneCarAPI, getAllCategoriesAPI } from '../../api/index'
import { useToast } from '../../context/ToastContext'

const COLORS = ['white','black','red','blue','gray','silver','yellow','green','brown','orange','purple','other']
const GEARBOOKS = ['avtomat karobka','mexanik karobka']

function CarForm({ initial = {}, onSubmit, loading, title }) {
  const [form, setForm] = useState({
    name: '', category: '', tan: false, motor: '', year: '',
    color: 'white', distance: '', gearbook: GEARBOOKS[0],
    price: '', description: '', ...initial
  })
  const [categories, setCategories] = useState([])
  const [files, setFiles] = useState({ car_main_image: null, car_inner_image: null, car_outer_image: null })
  const toast = useToast()

  useEffect(() => {
    getAllCategoriesAPI({ limit: 100 })
      .then(r => setCategories(r.data.data))
      .catch(() => toast.error('Kategoriyalar yuklanmadi'))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const set = f => e => setForm(p => ({ ...p, [f]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    const fd = new FormData()
    Object.entries(form).forEach(([k, v]) => fd.append(k, v))
    Object.entries(files).forEach(([k, v]) => { if (v) fd.append(k, v) })
    onSubmit(fd)
  }

  return (
    <>
      <Navbar />
      <div className="page">
        <div className="container" style={{ maxWidth: 700 }}>
          <div className="page-header">
            <div className="breadcrumb"><Link to="/admin">Admin panel</Link><span>›</span><span>{title}</span></div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700 }}>{title}</h1>
          </div>

          <form onSubmit={handleSubmit} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 32 }}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Nomi</label>
                <input className="form-input" value={form.name} onChange={set('name')} required placeholder="Toyota Camry" />
              </div>
              <div className="form-group">
                <label className="form-label">Kategoriya</label>
                <select className="form-select" value={form.category} onChange={set('category')} required>
                  <option value="">Tanlang...</option>
                  {categories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Motor (L)</label>
                <input className="form-input" type="number" step="0.1" min="0.5" max="8" value={form.motor} onChange={set('motor')} required />
              </div>
              <div className="form-group">
                <label className="form-label">Yil</label>
                <input className="form-input" type="number" min="1970" max={new Date().getFullYear()} value={form.year} onChange={set('year')} required />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Rang</label>
                <select className="form-select" value={form.color} onChange={set('color')}>
                  {COLORS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Karobka</label>
                <select className="form-select" value={form.gearbook} onChange={set('gearbook')}>
                  {GEARBOOKS.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Yurgan (km)</label>
                <input className="form-input" type="number" min="0" value={form.distance} onChange={set('distance')} required />
              </div>
              <div className="form-group">
                <label className="form-label">Narx ($)</label>
                <input className="form-input" type="number" min="0" value={form.price} onChange={set('price')} required />
              </div>
            </div>

            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                <input type="checkbox" checked={form.tan} onChange={set('tan')} />
                <span className="form-label" style={{ margin: 0 }}>TAN mavjud</span>
              </label>
            </div>

            <div className="form-group">
              <label className="form-label">Tavsif</label>
              <textarea className="form-textarea" value={form.description} onChange={set('description')} required minLength={25} placeholder="Avtomobil haqida batafsil ma'lumot..." />
            </div>

            <div className="divider" />
            <p style={{ color: 'var(--text3)', fontSize: 13, marginBottom: 16 }}>Rasmlar (JPEG, PNG, WebP — max 20MB)</p>

            {['car_main_image', 'car_inner_image', 'car_outer_image'].map(field => (
              <div className="form-group" key={field}>
                <label className="form-file-label">
                  <span>{field === 'car_main_image' ? '📷 Asosiy rasm' : field === 'car_inner_image' ? '🪑 Ichki rasm' : '🚗 Tashqi rasm'}</span>
                  {files[field] ? <span style={{ color: 'var(--success)' }}>✓ {files[field].name}</span> : <span>Fayl tanlang</span>}
                  <input type="file" accept="image/*" onChange={e => setFiles(p => ({ ...p, [field]: e.target.files[0] }))} />
                </label>
              </div>
            ))}

            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ flex: 1 }}>
                {loading ? 'Saqlanmoqda...' : 'Saqlash'}
              </button>
              <Link to="/admin" className="btn btn-outline btn-lg">Bekor qilish</Link>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export function AddCar() {
  const [loading, setLoading] = useState(false)
  const toast = useToast()
  const navigate = useNavigate()

  const handleSubmit = async (fd) => {
    setLoading(true)
    try {
      await addCarAPI(fd)
      toast.success('Avtomobil qo\'shildi')
      navigate('/admin')
    } catch (e) { toast.error(e.response?.data?.message || 'Xato') }
    finally { setLoading(false) }
  }

  return <CarForm title="Avtomobil qo'shish" onSubmit={handleSubmit} loading={loading} />
}

export function EditCar() {
  const { id } = useParams()
  const [initial, setInitial] = useState(null)
  const [loading, setLoading] = useState(false)
  const toast = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    getOneCarAPI(id).then(r => {
      const car = r.data
      setInitial({ ...car, category: car.category?.name || '' })
    }).catch(() => toast.error('Yuklanmadi'))
  }, [id]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = async (fd) => {
    setLoading(true)
    try {
      await updateCarAPI(id, fd)
      toast.success('Yangilandi')
      navigate('/admin')
    } catch (e) { toast.error(e.response?.data?.message || 'Xato') }
    finally { setLoading(false) }
  }

  if (!initial) return <><Navbar /><div className="page"><div className="loading"><div className="spinner" /></div></div></>
  return <CarForm title="Avtomobilni tahrirlash" initial={initial} onSubmit={handleSubmit} loading={loading} />
}

export default AddCar