import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import { addCategoryAPI, updateCategoryAPI, getOneCategoryAPI } from '../../api/index'
import { useToast } from '../../context/ToastContext'

function CategoryForm({ initial = {}, onSubmit, loading, title }) {
  const [name, setName] = useState(initial.name || '')
  const [file, setFile] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    const fd = new FormData()
    fd.append('name', name)
    if (file) fd.append('category_image', file)
    onSubmit(fd)
  }

  return (
    <>
      <Navbar />
      <div className="page">
        <div className="container" style={{ maxWidth: 500 }}>
          <div className="page-header">
            <div className="breadcrumb"><Link to="/admin">Admin panel</Link><span>›</span><span>{title}</span></div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700 }}>{title}</h1>
          </div>

          <form onSubmit={handleSubmit} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 32 }}>
            <div className="form-group">
              <label className="form-label">Kategoriya nomi</label>
              <input className="form-input" value={name} onChange={e => setName(e.target.value)} required placeholder="Sedan" />
            </div>

            <div className="form-group">
              <label className="form-file-label">
                <span>🖼 Rasm</span>
                {file ? <span style={{ color: 'var(--success)' }}>✓ {file.name}</span> : <span>Fayl tanlang</span>}
                <input type="file" accept="image/*" onChange={e => setFile(e.target.files[0])} />
              </label>
              {initial.imageUrl && !file && (
                <div style={{ marginTop: 8 }}>
                  <img src={`/${initial.imageUrl}`} alt="current"
                    style={{ height: 80, borderRadius: 8, objectFit: 'cover' }} />
                  <p className="form-hint">Hozirgi rasm. Yangi tanlasangiz almashtiriladi.</p>
                </div>
              )}
            </div>

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

export function AddCategory() {
  const [loading, setLoading] = useState(false)
  const toast = useToast()
  const navigate = useNavigate()

  const handleSubmit = async (fd) => {
    setLoading(true)
    try {
      await addCategoryAPI(fd)
      toast.success('Kategoriya qo\'shildi')
      navigate('/admin')
    } catch (e) { toast.error(e.response?.data?.message || 'Xato') }
    finally { setLoading(false) }
  }

  return <CategoryForm title="Kategoriya qo'shish" onSubmit={handleSubmit} loading={loading} />
}

export function EditCategory() {
  const { id } = useParams()
  const [initial, setInitial] = useState(null)
  const [loading, setLoading] = useState(false)
  const toast = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    getOneCategoryAPI(id).then(r => setInitial(r.data.category)).catch(() => toast.error('Yuklanmadi'))
  }, [id]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = async (fd) => {
    setLoading(true)
    try {
      await updateCategoryAPI(id, fd)
      toast.success('Yangilandi')
      navigate('/admin')
    } catch (e) { toast.error(e.response?.data?.message || 'Xato') }
    finally { setLoading(false) }
  }

  if (!initial) return <><Navbar /><div className="page"><div className="loading"><div className="spinner" /></div></div></>
  return <CategoryForm title="Kategoriyani tahrirlash" initial={initial} onSubmit={handleSubmit} loading={loading} />
}

export default AddCategory
