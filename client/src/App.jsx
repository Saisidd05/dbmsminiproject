import { useState, useEffect, useCallback, createContext, useContext } from 'react'
import {
  Tag, Plus, Search, Trash2, Edit2, CheckCircle, XCircle, ShoppingCart,
  Zap, TrendingUp, ToggleLeft, ToggleRight, X, LogOut, Shield, User, Eye,
  EyeOff, TicketPercent, Gift, Percent, DollarSign, Activity, Layers
} from 'lucide-react'
import axios from 'axios'
import './index.css'

const API = 'http://localhost:3000'

axios.interceptors.request.use(cfg => {
  const t = localStorage.getItem('cv_token')
  if (t) cfg.headers.Authorization = `Bearer ${t}`
  return cfg
})

// ── Contexts ──────────────────────────────────────────────────────────────
const AuthCtx = createContext(null)
const ToastCtx = createContext(null)
const useAuth = () => useContext(AuthCtx)
const useToast = () => useContext(ToastCtx)

function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const t = localStorage.getItem('cv_token')
    if (t) {
      axios.get(`${API}/auth/me`).then(r => setUser(r.data.user)).catch(() => localStorage.removeItem('cv_token')).finally(() => setLoading(false))
    } else setLoading(false)
  }, [])
  const login = (token, u) => { localStorage.setItem('cv_token', token); setUser(u) }
  const logout = () => { localStorage.removeItem('cv_token'); setUser(null) }
  return <AuthCtx.Provider value={{ user, login, logout }}>{!loading && children}</AuthCtx.Provider>
}

function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const add = useCallback((type, msg) => {
    const id = Date.now()
    setToasts(t => [...t, { id, type, msg }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500)
  }, [])
  return (
    <ToastCtx.Provider value={add}>
      {children}
      <div className="toast-wrap">
        {toasts.map(t => (
          <div key={t.id} className={`toast-item ${t.type === 'success' ? 'ok' : 'err'}`}>
            {t.type === 'success' ? <CheckCircle size={15} /> : <XCircle size={15} />}
            <span style={{ flex: 1 }}>{t.msg}</span>
            <button onClick={() => setToasts(p => p.filter(x => x.id !== t.id))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', lineHeight: 1 }}><X size={13} /></button>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  )
}

// ── Components ────────────────────────────────────────────────────────────
function CornerEffect() {
  return (
    <>
      <div className="corner tl" style={{ zIndex: 10 }} />
      <div className="corner tr" style={{ zIndex: 10 }} />
      <div className="corner bl" style={{ zIndex: 10 }} />
      <div className="corner br" style={{ zIndex: 10 }} />
      <div className="scan-line" style={{ zIndex: 10 }} />
    </>
  )
}

// ── Auth Page ─────────────────────────────────────────────────────────────
function AuthPage() {
  const [mode, setMode] = useState('login')
  const [role, setRole] = useState('customer')
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')
  const { login } = useAuth()
  const toast = useToast()
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const submit = async e => {
    e.preventDefault(); setErr(''); setLoading(true)
    try {
      const body = mode === 'login'
        ? { email: form.email, password: form.password }
        : { name: form.name, email: form.email, password: form.password, role }
      const res = await axios.post(`${API}/auth/${mode === 'login' ? 'login' : 'register'}`, body)
      login(res.data.token, res.data.user)
      toast('success', `Welcome${res.data.user.name ? ', ' + res.data.user.name : ''}! 🎉`)
    } catch (e) { setErr(e.response?.data?.error || 'Something went wrong.') }
    finally { setLoading(false) }
  }

  return (
    <div className="auth-root">
      {/* Hero Left */}
      <div className="auth-left">
        <div className="orb orb1" /><div className="orb orb2" /><div className="orb orb3" />
        <div className="auth-left-content">
          <div className="auth-hero-badge"><TicketPercent size={13} /> Promotional Manager</div>
          <h1 className="auth-hero-title">Manage Discounts<br />Like a Pro</h1>
          <p className="auth-hero-sub">Create, distribute, and track discount coupons with a professional dashboard. Real-time analytics for every promotional offer.</p>
          <div className="auth-features">
            <div className="auth-feature"><div className="auth-feature-dot" /><span>Admin panel to create &amp; manage coupons</span></div>
            <div className="auth-feature"><div className="auth-feature-dot" /><span>Customer portal to browse &amp; redeem offers</span></div>
            <div className="auth-feature"><div className="auth-feature-dot" /><span>Real-time usage tracking &amp; expiry alerts</span></div>
          </div>
          <div className="auth-ticket-preview">
            <div className="mini-ticket">
              <span className="mini-ticket-badge v">SAVE20</span>
              <span className="mini-ticket-info">20% off on all orders</span>
              <span className="mini-ticket-discount">-₹200</span>
            </div>
            <div className="mini-ticket">
              <span className="mini-ticket-badge c">WELCOME10</span>
              <span className="mini-ticket-info">New customer offer</span>
              <span className="mini-ticket-discount">-₹50</span>
            </div>
            <div className="mini-ticket">
              <span className="mini-ticket-badge p">FLASH500</span>
              <span className="mini-ticket-info">Flash sale — limited</span>
              <span className="mini-ticket-discount">-₹500</span>
            </div>
          </div>
        </div>
      </div>

      {/* Form Right */}
      <div className="auth-right">
        <div className="corner-frame auth-form-box">
          {/* Animated corner brackets */}
          <CornerEffect />

          <div className="auth-logo">
            <div className="auth-logo-icon">🎟️</div>
            <div><div className="auth-logo-name">discokart</div><div className="auth-logo-tag">Discount &amp; Promotions Manager</div></div>
          </div>

          <h2 className="auth-heading">{mode === 'login' ? 'Sign in' : 'Create account'}</h2>
          <p className="auth-sub">{mode === 'login' ? 'Welcome back! Enter your credentials.' : 'Join discokart — choose your role below.'}</p>

          {mode === 'register' && (
            <div className="role-tabs">
              <button className={`role-tab ${role === 'customer' ? 'active' : ''}`} onClick={() => setRole('customer')} type="button"><User size={14} /> Customer</button>
              <button className={`role-tab ${role === 'admin' ? 'active' : ''}`} onClick={() => setRole('admin')} type="button"><Shield size={14} /> Admin</button>
            </div>
          )}

          <form onSubmit={submit}>
            {mode === 'register' && (
              <div className="f-group">
                <div className="f-label">Full Name</div>
                <div className="f-wrap">
                  <User size={15} className="f-icon" style={{ position: 'absolute', left: '.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)', pointerEvents: 'none' }} />
                  <input className="f-input" value={form.name} onChange={set('name')} placeholder="Your name" required />
                </div>
              </div>
            )}
            <div className="f-group">
              <div className="f-label">Email</div>
              <div className="f-wrap">
                <span style={{ position: 'absolute', left: '.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)', pointerEvents: 'none', fontSize: '14px' }}>✉</span>
                <input className="f-input" type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" required />
              </div>
            </div>
            <div className="f-group">
              <div className="f-label">Password</div>
              <div className="f-wrap">
                <span style={{ position: 'absolute', left: '.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)', pointerEvents: 'none', fontSize: '14px' }}>🔒</span>
                <input className="f-input" type={showPw ? 'text' : 'password'} value={form.password} onChange={set('password')} placeholder="••••••••" required style={{ paddingRight: '2.5rem' }} />
                <button type="button" className="pw-toggle" onClick={() => setShowPw(v => !v)}>{showPw ? <EyeOff size={15} /> : <Eye size={15} />}</button>
              </div>
            </div>
            {err && <div className="f-error">{err}</div>}
            <button className="auth-btn" type="submit" disabled={loading}>
              {loading ? 'Please wait…' : mode === 'login' ? '→ Sign in' : '→ Create Account'}
            </button>
          </form>
          <div className="auth-switch">
            {mode === 'login' ? <>No account? <a onClick={() => { setMode('register'); setErr('') }}>Register here</a></> : <>Have an account? <a onClick={() => { setMode('login'); setErr('') }}>Sign in</a></>}
          </div>
        </div>
      </div>

    </div>
  )
}

// ── Top Bar ───────────────────────────────────────────────────────────────
function TopBar({ stats }) {
  const { user, logout } = useAuth()
  return (
    <header className="topbar">
      <div className="topbar-brand">
        <div className="tb-icon">🎟️</div>
        <div><div className="tb-name">discokart</div><div className="tb-sub">{user?.role === 'admin' ? 'Admin Dashboard' : 'Customer Portal'}</div></div>
      </div>
      {stats && (
        <div className="tb-center">
          <div className="tb-stat"><div className="tb-stat-dot violet" /><span>Total: <span className="tb-stat-val">{stats.total}</span></span></div>
          <div className="tb-stat"><div className="tb-stat-dot green" /><span>Active: <span className="tb-stat-val">{stats.active}</span></span></div>
          <div className="tb-stat"><div className="tb-stat-dot cyan" /><span>Redeemed: <span className="tb-stat-val">{stats.redeemed}</span></span></div>
        </div>
      )}
      <div className="tb-right">
        <div className="user-chip">
          <div className="user-avatar">{user?.name?.[0]?.toUpperCase() || '?'}</div>
          <div><div className="user-name">{user?.name}</div><span className={`user-role ${user?.role}`}>{user?.role}</span></div>
        </div>
        <button className="btn btn-outline btn-sm" onClick={logout}><LogOut size={13} /> Logout</button>
      </div>
    </header>
  )
}

// ── Status Badge ──────────────────────────────────────────────────────────
function StatusBadge({ c }) {
  const today = new Date().toISOString().split('T')[0]
  const pct = Math.min(100, Math.round((c.usage_count / c.usage_limit) * 100))
  if (!c.is_active) return <span className="badge2 inactive">● Inactive</span>
  if (today > c.valid_until) return <span className="badge2 expired">⌛ Expired</span>
  if (today < c.valid_from) return <span className="badge2 upcoming">⏳ Upcoming</span>
  if (pct >= 100) return <span className="badge2 full">✗ Exhausted</span>
  return <span className="badge2 active">● Active</span>
}

// ── Admin Ticket Card ─────────────────────────────────────────────────────
function AdminTicket({ c, onEdit, onDelete, onToggle }) {
  const [copied, setCopied] = useState(false)
  const pct = Math.min(100, Math.round((c.usage_count / c.usage_limit) * 100))
  const today = new Date().toISOString().split('T')[0]
  const expired = today > c.valid_until

  const copy = () => { navigator.clipboard.writeText(c.code); setCopied(true); setTimeout(() => setCopied(false), 1500) }

  return (
    <div className={`ticket ${!c.is_active ? 'inactive' : ''}`}>
      <div className={`ticket-stripe ${c.discount_type === 'fixed' ? 'fixed-stripe' : ''}`} />
      <div className="ticket-body">
        <div className="ticket-top">
          <div>
            <div className="ticket-code" onClick={copy}>{c.code}</div>
            {copied && <div className="copy-flash">✓ Copied!</div>}
          </div>
          <div className="ticket-badges">
            <StatusBadge c={c} />
            <span className={`badge2 ${c.discount_type === 'percentage' ? 'pct' : 'fix'}`}>
              {c.discount_type === 'percentage' ? `${c.discount_value}% OFF` : `₹${c.discount_value} OFF`}
            </span>
          </div>
        </div>

        <div className="ticket-desc">{c.description}</div>

        <div className="ticket-perf">
          <div className="perf-circle" />
          <div className="perf-line" />
          <div className="perf-circle" />
        </div>

        <div className="ticket-meta">
          <div className="tm-item"><span className="tm-label">Min Order</span><span className="tm-value">₹{c.min_order_value}</span></div>
          <div className="tm-item"><span className="tm-label">Usage</span><span className="tm-value">{c.usage_count} / {c.usage_limit}</span></div>
          <div className="tm-item"><span className="tm-label">From</span><span className="tm-value">{c.valid_from}</span></div>
          <div className="tm-item"><span className="tm-label">Until</span><span className="tm-value" style={{ color: expired ? 'var(--red)' : 'inherit' }}>{c.valid_until}</span></div>
        </div>

        <div className="u-bar-wrap">
          <div className="u-bar-top"><span>Usage</span><span>{pct}%</span></div>
          <div className="u-bar-bg"><div className={`u-bar-fill ${pct > 75 ? 'warning' : 'normal'}`} style={{ width: `${pct}%` }} /></div>
        </div>

        <div className="ticket-actions">
          <button className="btn btn-outline btn-sm" onClick={() => onEdit(c)}><Edit2 size={12} /> Edit</button>
          <button className="btn btn-red btn-sm" onClick={() => onDelete(c._id)}><Trash2 size={12} /></button>
          <button className={`btn btn-sm ${c.is_active ? 'btn-outline' : 'btn-green'}`} onClick={() => onToggle(c)}>
            {c.is_active ? <><ToggleLeft size={12} />Deactivate</> : <><ToggleRight size={12} />Activate</>}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Coupon Form ───────────────────────────────────────────────────────────
const blankForm = () => ({ code: '', description: '', discount_type: 'percentage', discount_value: '', min_order_value: '', valid_from: '', valid_until: '', usage_limit: '', is_active: true })

function CouponForm({ form, onChange, onSubmit, onCancel, isEdit }) {
  const set = k => e => onChange(k, e.target.type === 'checkbox' ? e.target.checked : e.target.value)
  const today = new Date().toISOString().split('T')[0]
  return (
    <div className="form-grid">
      <div className="f-group"><div className="f-label">Code *</div><input className="gf-input" value={form.code} onChange={set('code')} placeholder="e.g. SUMMER25" style={{ textTransform: 'uppercase' }} /></div>
      <div className="f-group"><div className="f-label">Description *</div><textarea className="gf-input" value={form.description} onChange={set('description')} placeholder="Brief description" style={{ resize: 'vertical', minHeight: '58px', fontFamily: 'inherit', fontSize: '.875rem' }} /></div>
      <div className="form-row">
        <div className="f-group"><div className="f-label">Type *</div>
          <select className="gf-select" value={form.discount_type} onChange={set('discount_type')} style={{ width: '100%' }}>
            <option value="percentage">% Percentage</option>
            <option value="fixed">₹ Fixed Amount</option>
          </select>
        </div>
        <div className="f-group"><div className="f-label">Value *</div><input className="gf-input" type="number" min="0" max={form.discount_type === 'percentage' ? 100 : undefined} value={form.discount_value} onChange={set('discount_value')} placeholder={form.discount_type === 'percentage' ? '20' : '150'} /></div>
      </div>
      <div className="form-row">
        <div className="f-group"><div className="f-label">Min Order (₹)</div><input className="gf-input" type="number" min="0" value={form.min_order_value} onChange={set('min_order_value')} placeholder="0" /></div>
        <div className="f-group"><div className="f-label">Usage Limit *</div><input className="gf-input" type="number" min="1" value={form.usage_limit} onChange={set('usage_limit')} placeholder="100" /></div>
      </div>
      <div className="form-row">
        <div className="f-group"><div className="f-label">Valid From *</div><input className="gf-input" type="date" value={form.valid_from} onChange={set('valid_from')} /></div>
        <div className="f-group"><div className="f-label">Valid Until *</div><input className="gf-input" type="date" value={form.valid_until} onChange={set('valid_until')} min={form.valid_from || today} /></div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
        <input type="checkbox" id="ia" checked={!!form.is_active} onChange={set('is_active')} style={{ accentColor: 'var(--violet)' }} />
        <label htmlFor="ia" style={{ fontSize: '.84rem', color: 'var(--text2)', cursor: 'pointer' }}>Active immediately</label>
      </div>
      <div style={{ display: 'flex', gap: '.5rem' }}>
        <button className="btn btn-violet btn-full" onClick={onSubmit}>{isEdit ? <><Edit2 size={13} />Update</> : <><Plus size={13} />Add Coupon</>}</button>
        {onCancel && <button className="btn btn-outline" onClick={onCancel}><X size={13} /></button>}
      </div>
    </div>
  )
}

// ── Edit Modal ────────────────────────────────────────────────────────────
function EditModal({ c, onClose, onSave }) {
  const [form, setForm] = useState({ ...c })
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-head"><span className="modal-title">✏️ Edit Coupon</span><button className="btn btn-outline btn-sm" onClick={onClose}><X size={13} /></button></div>
        <CouponForm form={form} onChange={(k, v) => setForm(f => ({ ...f, [k]: v }))} onSubmit={() => onSave(form)} onCancel={onClose} isEdit />
      </div>
    </div>
  )
}

// ── Redeem Panel ──────────────────────────────────────────────────────────
function RedeemPanel({ prefillCode, onRedeemed }) {
  const [code, setCode] = useState(prefillCode || '')
  const [orderVal, setOrderVal] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const toast = useToast()
  useEffect(() => { if (prefillCode) setCode(prefillCode) }, [prefillCode])

  const redeem = async () => {
    if (!code.trim()) return; setLoading(true); setResult(null)
    try {
      const res = await axios.post(`${API}/api/coupons/${code.trim()}/redeem`, { order_value: Number(orderVal) || 0 })
      setResult({ ok: true, ...res.data })
      toast('success', res.data.message)
      if (onRedeemed) onRedeemed()
    } catch (e) {
      const msg = e.response?.data?.error || 'Redemption failed.'
      setResult({ ok: false, message: msg })
      toast('error', msg)
    } finally { setLoading(false) }
  }

  return (
    <div className="corner-frame" style={{ padding: 0, position: 'sticky', top: '1.5rem', height: 'fit-content' }}>
      <CornerEffect />
      <div className="redeem-panel" style={{ position: 'relative', top: 0, margin: 0 }}>
        <div className="redeem-panel-header">
          <div className="redeem-panel-title"><Zap size={16} /> Apply a Coupon</div>
        </div>
        <div className="redeem-panel-body">
          <div className="f-group">
            <div className="f-label">Coupon Code</div>
            <input className="gf-input" value={code} onChange={e => setCode(e.target.value.toUpperCase())} placeholder="Enter code..." onKeyDown={e => e.key === 'Enter' && redeem()} />
          </div>
          <div className="f-group">
            <div className="f-label">Cart Total (₹)</div>
            <input className="gf-input" type="number" min="0" value={orderVal} onChange={e => setOrderVal(e.target.value)} placeholder="e.g. 1500" onKeyDown={e => e.key === 'Enter' && redeem()} />
          </div>
          <button className="btn btn-violet btn-full" onClick={redeem} disabled={loading || !code.trim()}>
            <ShoppingCart size={15} />{loading ? 'Applying…' : 'Apply Coupon'}
          </button>
          {result && (
            <div className={`redeem-result ${result.ok ? 'ok' : 'err'}`}>
              <div className={`rr-title ${result.ok ? 'ok' : 'err'}`}>{result.ok ? `✅ ${result.message}` : `❌ ${result.message}`}</div>
              {result.ok && result.data && (
                <div className="rr-rows">
                  <div className="rr-row"><span>Order Value</span><strong>₹{result.data.order_value}</strong></div>
                  <div className="rr-row saved">
                    <span>Discount ({result.data.discount_type === 'percentage' ? `${result.data.discount_value}%` : `₹${result.data.discount_value}`})</span>
                    <strong>− ₹{result.data.discount_amount}</strong>
                  </div>
                  <div className="rr-divider" />
                  <div className="rr-row total"><span>You Pay</span><strong>₹{result.data.final_amount}</strong></div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Admin Dashboard ───────────────────────────────────────────────────────
function AdminDashboard() {
  const [coupons, setCoupons] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [activeFilter, setActiveFilter] = useState('all')
  const [form, setForm] = useState(blankForm())
  const [editC, setEditC] = useState(null)
  const toast = useToast()

  const fetch = useCallback(async () => {
    try {
      const params = {}
      if (search) params.search = search
      if (typeFilter !== 'all') params.type = typeFilter
      if (activeFilter !== 'all') params.active = activeFilter
      const res = await axios.get(`${API}/api/coupons`, { params })
      setCoupons(res.data.data)
    } catch { toast('error', 'Failed to load.') } finally { setLoading(false) }
  }, [search, typeFilter, activeFilter])

  useEffect(() => { fetch() }, [fetch])

  const handleAdd = async () => {
    try { await axios.post(`${API}/api/coupons`, form); toast('success', `"${form.code.toUpperCase()}" created!`); setForm(blankForm()); fetch() }
    catch (e) { toast('error', e.response?.data?.error || 'Failed.') }
  }
  const handleDelete = async id => {
    if (!confirm('Delete this coupon?')) return
    try { await axios.delete(`${API}/api/coupons/${id}`); toast('success', 'Deleted.'); fetch() } catch { toast('error', 'Failed.') }
  }
  const handleToggle = async c => {
    try { await axios.put(`${API}/api/coupons/${c._id}`, { is_active: !c.is_active }); fetch(); toast('success', `${!c.is_active ? 'Activated' : 'Deactivated'}.`) } catch { toast('error', 'Failed.') }
  }
  const handleSave = async data => {
    try { await axios.put(`${API}/api/coupons/${data._id}`, data); toast('success', 'Updated!'); setEditC(null); fetch() }
    catch (e) { toast('error', e.response?.data?.error || 'Failed.') }
  }

  const today = new Date().toISOString().split('T')[0]
  const active = coupons.filter(c => c.is_active && today >= c.valid_from && today <= c.valid_until && c.usage_count < c.usage_limit).length
  const redeemed = coupons.reduce((s, c) => s + c.usage_count, 0)
  const expiring = coupons.filter(c => c.is_active && c.valid_until >= today && c.valid_until <= (new Date(Date.now() + 7 * 864e5).toISOString().split('T')[0])).length

  return (
    <div className="app">
      <TopBar stats={{ total: coupons.length, active, redeemed }} />
      <div className="admin-layout">
        <div className="stats-band">
          <div className="stat-block"><div className="stat-icon-box v"><Layers size={18} /></div><div><div className="stat-num">{coupons.length}</div><div className="stat-lbl">Total Coupons</div></div></div>
          <div className="stat-block"><div className="stat-icon-box g"><Activity size={18} /></div><div><div className="stat-num">{active}</div><div className="stat-lbl">Active Now</div></div></div>
          <div className="stat-block"><div className="stat-icon-box c"><TrendingUp size={18} /></div><div><div className="stat-num">{redeemed}</div><div className="stat-lbl">Times Redeemed</div></div></div>
          <div className="stat-block"><div className="stat-icon-box a"><Zap size={18} /></div><div><div className="stat-num">{expiring}</div><div className="stat-lbl">Expiring (7 days)</div></div></div>
        </div>
        <div className="admin-body">
          <div className="corner-frame" style={{ padding: 0, display: 'flex', flexDirection: 'column' }}>
            <CornerEffect />
            <aside className="admin-sidebar" style={{ flex: 1 }}>
              <div className="panel-title"><Plus size={14} /> New Coupon</div>
              <CouponForm form={form} onChange={(k, v) => setForm(f => ({ ...f, [k]: v }))} onSubmit={handleAdd} />
            </aside>
          </div>
          <main className="admin-content">
            <div className="filters-bar">
              <div className="search-box"><Search size={14} /><input className="gf-input" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search coupons…" /></div>
              <select className="gf-select" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
                <option value="all">All Types</option><option value="percentage">% Percentage</option><option value="fixed">₹ Fixed</option>
              </select>
              <select className="gf-select" value={activeFilter} onChange={e => setActiveFilter(e.target.value)}>
                <option value="all">All Status</option><option value="true">Active</option><option value="false">Inactive</option>
              </select>
            </div>
            <div className="coupon-grid">
              {loading ? <div className="empty"><TicketPercent size={48} /><p>Loading…</p></div>
                : coupons.length === 0 ? <div className="empty"><TicketPercent size={48} /><h3>No coupons yet</h3><p>Add your first coupon using the sidebar form.</p></div>
                  : coupons.map(c => <AdminTicket key={c._id} c={c} onEdit={setEditC} onDelete={handleDelete} onToggle={handleToggle} />)}
            </div>
          </main>
        </div>
      </div>
      {editC && <EditModal c={editC} onClose={() => setEditC(null)} onSave={handleSave} />}
    </div>
  )
}

// ── Customer Dashboard ────────────────────────────────────────────────────
function CustomerDashboard() {
  const [tab, setTab] = useState('shop') // 'shop' | 'coupons'
  const [products, setProducts] = useState([])
  const [coupons, setCoupons] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [cart, setCart] = useState([])          // [{...product, qty}]
  const [couponCode, setCouponCode] = useState('')
  const [applied, setApplied] = useState(null)  // {code, discount_type, discount_value, discount_amount}
  const [applyLoading, setApplyLoading] = useState(false)
  const toast = useToast()

  // load products
  const fetchProducts = useCallback(async () => {
    try {
      const params = {}
      if (search) params.search = search
      if (catFilter !== 'all') params.category = catFilter
      const res = await axios.get(`${API}/api/products`, { params })
      setProducts(res.data.data)
    } catch { toast('error', 'Failed to load products.') } finally { setLoading(false) }
  }, [search, catFilter])

  // load coupons
  const fetchCoupons = useCallback(async () => {
    try {
      const params = {}
      if (typeFilter !== 'all') params.type = typeFilter
      const res = await axios.get(`${API}/api/coupons`, { params })
      setCoupons(res.data.data)
    } catch { }
  }, [typeFilter])

  useEffect(() => { fetchProducts() }, [fetchProducts])
  useEffect(() => { fetchCoupons() }, [fetchCoupons])

  // Cart helpers
  const cartCount = cart.reduce((s, i) => s + i.qty, 0)
  const cartSubtotal = cart.reduce((s, i) => s + (i.price * i.qty), 0)

  const addToCart = p => {
    setApplied(null); setCouponCode('')
    setCart(c => {
      const ex = c.find(x => x._id === p._id)
      if (ex) return c.map(x => x._id === p._id ? { ...x, qty: x.qty + 1 } : x)
      toast('success', `${p.emoji} ${p.name} added to cart!`)
      return [...c, { ...p, qty: 1 }]
    })
  }
  const updateQty = (id, delta) => setCart(c => {
    const updated = c.map(x => x._id === id ? { ...x, qty: Math.max(0, x.qty + delta) } : x)
    return updated.filter(x => x.qty > 0)
  })
  const removeItem = id => setCart(c => c.filter(x => x._id !== id))
  const clearCart = () => { setCart([]); setApplied(null); setCouponCode('') }

  // Apply coupon to cart
  const applyCoupon = async () => {
    if (!couponCode.trim() || cart.length === 0) return
    setApplyLoading(true)
    try {
      const res = await axios.post(`${API}/api/coupons/${couponCode.trim()}/redeem`, { order_value: cartSubtotal })
      setApplied({ code: res.data.data.coupon_code, discount_type: res.data.data.discount_type, discount_value: res.data.data.discount_value, discount_amount: res.data.data.discount_amount })
      toast('success', `Coupon "${res.data.data.coupon_code}" applied! You save ₹${res.data.data.discount_amount}`)
    } catch (e) {
      toast('error', e.response?.data?.error || 'Invalid coupon.')
      setApplied(null)
    } finally { setApplyLoading(false) }
  }
  const removeCoupon = () => { setApplied(null); setCouponCode('') }

  const finalTotal = applied ? Math.max(0, cartSubtotal - applied.discount_amount) : cartSubtotal

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category))).sort()]

  return (
    <div className="app">
      <TopBar />
      <div className="customer-root">
        <div className="customer-inner">
          {/* Hero */}
          <div className="cp-hero">
            <div className="cp-hero-left">
              <h1>🛍️ <span>discokart</span> Shop</h1>
              <p>Add items to your cart, apply a coupon, and save big on your order!</p>
            </div>
            <div className="cp-hero-right">
              <div className="cp-tabs">
                <button className={`cp-tab ${tab === 'shop' ? 'active' : ''}`} onClick={() => { setTab('shop'); setSearch('') }}>🛍️ Shop</button>
                <button className={`cp-tab ${tab === 'coupons' ? 'active' : ''}`} onClick={() => setTab('coupons')}>🎟️ Coupons</button>
              </div>
            </div>
          </div>

          {tab === 'shop' ? (
            /* ── Shop Tab ── */
            <div className="customer-layout" style={{ gridTemplateColumns: '1fr 320px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* Filters */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '.65rem' }}>
                  <div className="search-box"><Search size={13} /><input className="gf-input" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products…" /></div>
                  <div className="cat-pills">
                    {categories.map(c => (
                      <button key={c} className={`cat-pill ${catFilter === c ? 'active' : ''}`} onClick={() => setCatFilter(c)}>
                        {c === 'all' ? 'All' : c}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Product Grid */}
                <div className="product-grid">
                  {loading ? <div className="empty" style={{ gridColumn: '1/-1' }}><p>Loading products…</p></div>
                    : products.length === 0 ? <div className="empty" style={{ gridColumn: '1/-1' }}><h3>No products found</h3></div>
                      : products.map(p => {
                        const inCart = cart.some(x => x._id === p._id)
                        return (
                          <div key={p._id} className="prod-card">
                            <div className="prod-emoji-box">{p.emoji}</div>
                            <div className="prod-info">
                              <div className="prod-cat">{p.category}</div>
                              <div className="prod-name">{p.name}</div>
                              <div className="prod-stars">{'★'.repeat(Math.round(p.rating))} <span style={{ color: 'var(--text3)' }}>({p.reviews})</span></div>
                              <div className="prod-price">₹{p.price.toLocaleString()}</div>
                            </div>
                            <div className="prod-footer">
                              <button className={`prod-add-btn ${inCart ? 'in-cart' : ''}`} onClick={() => addToCart(p)}>
                                {inCart ? '✓ In Cart' : <><Plus size={13} />Add to Cart</>}
                              </button>
                            </div>
                          </div>
                        )
                      })}
                </div>
              </div>

              {/* ── Cart Sidebar ── */}
              <div className="corner-frame" style={{ padding: 0, position: 'sticky', top: '1.5rem', height: 'fit-content', display: 'flex', flexDirection: 'column', maxHeight: 'calc(100vh - 90px)' }}>
                <CornerEffect />
                <div className="cart-panel" style={{ position: 'relative', top: 0, margin: 0, flex: 1, maxHeight: 'none' }}>
                  <div className="cart-panel-header">
                    <div className="cart-panel-title">
                      <ShoppingCart size={16} /> Your Cart {cartCount > 0 && <span className="cart-count-badge">{cartCount}</span>}
                    </div>
                    {cart.length > 0 && <button className="btn btn-red btn-sm" onClick={clearCart}><Trash2 size={11} /> Clear</button>}
                  </div>

                  <div className="cart-items">
                    {cart.length === 0 ? (
                      <div className="cart-empty"><div className="cart-empty-icon">🛒</div><div>Your cart is empty</div><div style={{ fontSize: '.75rem', marginTop: '.3rem' }}>Add products from the shop</div></div>
                    ) : cart.map(item => (
                      <div key={item._id} className="cart-item">
                        <div className="cart-item-emoji">{item.emoji}</div>
                        <div className="cart-item-info">
                          <div className="cart-item-name">{item.name}</div>
                          <div className="cart-item-price">₹{item.price} each</div>
                        </div>
                        <div className="qty-controls">
                          <button className="qty-btn" onClick={() => updateQty(item._id, -1)}>−</button>
                          <span className="qty-val">{item.qty}</span>
                          <button className="qty-btn" onClick={() => updateQty(item._id, +1)}>+</button>
                        </div>
                        <div className="cart-item-total">₹{(item.price * item.qty).toLocaleString()}</div>
                      </div>
                    ))}
                  </div>

                  {cart.length > 0 && (
                    <div className="cart-footer">
                      {/* Coupon apply */}
                      {!applied ? (
                        <div className="coupon-input-row">
                          <input className="gf-input" value={couponCode} onChange={e => setCouponCode(e.target.value.toUpperCase())} placeholder="Coupon code…" onKeyDown={e => e.key === 'Enter' && applyCoupon()} />
                          <button className="btn btn-violet btn-sm" onClick={applyCoupon} disabled={applyLoading || !couponCode.trim()}>
                            {applyLoading ? '…' : <Zap size={13} />}
                          </button>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div className="coupon-applied-chip"><CheckCircle size={13} /> {applied.code} — −₹{applied.discount_amount}</div>
                          <button className="btn btn-red btn-sm" onClick={removeCoupon}><X size={11} /></button>
                        </div>
                      )}

                      {/* Totals */}
                      <div className="cart-totals-row"><span>Subtotal</span><strong>₹{cartSubtotal.toLocaleString()}</strong></div>
                      {applied && <div className="cart-totals-row discount"><span>Coupon ({applied.code})</span><strong>−₹{applied.discount_amount}</strong></div>}
                      <div className="cart-totals-row final"><span>Total</span><strong>₹{finalTotal.toLocaleString()}</strong></div>

                      <button className="btn btn-violet btn-full" onClick={() => { toast('success', `✅ Order placed! Total: ₹${finalTotal}`); clearCart() }}>
                        <ShoppingCart size={15} /> Place Order
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* ── Coupons Tab ── */
            <div className="customer-layout">
              <div className="coupon-grid">
                {coupons.length === 0 ? <div className="empty"><Gift size={48} /><h3>No active offers</h3></div>
                  : coupons.map(c => <CustomerTicket key={c._id} c={c} onApply={code => { setTab('shop'); setCouponCode(code); toast('success', 'Switch to Shop tab to apply!') }} />)}
              </div>
              <RedeemPanel prefillCode={''} onRedeemed={fetchCoupons} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Customer Ticket Card ──────────────────────────────────────────────────
function CustomerTicket({ c, onApply }) {
  const [copied, setCopied] = useState(false)
  const pct = Math.min(100, Math.round((c.usage_count / c.usage_limit) * 100))
  const today = new Date().toISOString().split('T')[0]
  const canRedeem = today >= c.valid_from && today <= c.valid_until && pct < 100

  const copy = () => { navigator.clipboard.writeText(c.code); setCopied(true); setTimeout(() => setCopied(false), 1500) }

  return (
    <div className="c-ticket">
      <div className={`ticket-stripe ${c.discount_type === 'fixed' ? 'fixed-stripe' : ''}`} />
      <div className="c-ticket-left">
        <div className="c-ticket-main">
          <div className={`c-discount-pill ${c.discount_type === 'fixed' ? 'fixed-pct' : ''}`}>
            {c.discount_type === 'percentage' ? `${c.discount_value}% OFF` : `₹${c.discount_value} OFF`}
          </div>
          <div className="c-code-wrap">
            <div className="c-code" onClick={copy}>{c.code}</div>
            {copied && <div className="copy-flash" style={{ fontSize: '.68rem', color: 'var(--green)', animation: 'popIn .2s' }}>✓ Copied!</div>}
          </div>
        </div>
        <div className="c-desc">{c.description}</div>
        <div className="c-meta">
          <div className="c-meta-item"><div className="c-meta-label">Min Order</div><div className="c-meta-value">₹{c.min_order_value || 0}</div></div>
          <div className="c-meta-item"><div className="c-meta-label">Expires</div><div className="c-meta-value">{c.valid_until}</div></div>
          <div className="c-meta-item"><div className="c-meta-label">Available</div><div className="c-meta-value">{c.usage_limit - c.usage_count} left</div></div>
        </div>
        <div className="c-avail-bar">
          <div className="c-avail-row"><span>Availability</span><span>{100 - pct}% remaining</span></div>
          <div className="u-bar-bg"><div className={`u-bar-fill ${pct > 75 ? 'warning' : 'normal'}`} style={{ width: `${pct}%` }} /></div>
        </div>
        <button className="btn btn-violet btn-full btn-sm" disabled={!canRedeem} onClick={() => onApply(c.code)}>
          <Zap size={13} />{canRedeem ? 'Apply This Coupon' : 'Not Available'}
        </button>
      </div>
    </div>
  )
}

// ── Root ──────────────────────────────────────────────────────────────────
function AppInner() {
  const { user } = useAuth()
  if (!user) return <AuthPage />
  if (user.role === 'admin') return <AdminDashboard />
  return <CustomerDashboard />
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <div className="global-edge-lighting" />
        <AppInner />
      </ToastProvider>
    </AuthProvider>
  )
}
