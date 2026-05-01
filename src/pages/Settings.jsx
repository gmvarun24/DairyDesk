import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useSettings } from '../hooks/useSettings'
import { useTheme } from '../context/ThemeContext'
import { LogOut, ChevronDown, ChevronUp, Calendar, Sun, Moon, Monitor } from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'
import toast from 'react-hot-toast'

const Settings = () => {
  const { user, logout } = useAuth()
  const { settings, loading, saveSettings, monthlyRates, saveMonthlyRate } = useSettings()
  const { theme, setTheme } = useTheme()

  const [formData, setFormData] = useState({
    milkRatePerPacket: '',
    curdRatePerPacket: '',
    vendorName: '',
    vendorPhone: '',
    currency: '\u20B9',
  })
  const [monthRate, setMonthRate] = useState({ month: '', milk: '', curd: '' })
  const [expandedSection, setExpandedSection] = useState('pricing')

  useEffect(() => {
    if (settings) {
      setFormData({
        milkRatePerPacket: settings.milkRatePerPacket?.toString() || '',
        curdRatePerPacket: settings.curdRatePerPacket?.toString() || '',
        vendorName: settings.vendorName || '',
        vendorPhone: settings.vendorPhone || '',
        currency: settings.currency || '\u20B9',
      })
    }
  }, [settings])

  const handleSave = async (e) => {
    e.preventDefault()
    await saveSettings({
      milkRatePerPacket: parseFloat(formData.milkRatePerPacket) || 0,
      curdRatePerPacket: parseFloat(formData.curdRatePerPacket) || 0,
      vendorName: formData.vendorName,
      vendorPhone: formData.vendorPhone,
      currency: formData.currency,
    })
  }

  const handleSaveMonthlyRate = async (e) => {
    e.preventDefault()
    if (!monthRate.month) { toast.error('Please select a month'); return }
    await saveMonthlyRate(monthRate.month, { milkRatePerPacket: parseFloat(monthRate.milk) || 0, curdRatePerPacket: parseFloat(monthRate.curd) || 0 })
    setMonthRate({ month: '', milk: '', curd: '' })
  }

  const handleLogout = async () => { await logout(); window.location.href = '/login' }

  if (loading) return <LoadingSpinner />

  const SectionHeader = ({ id, icon: Icon, title }) => (
    <button onClick={() => setExpandedSection(expandedSection === id ? '' : id)} className="w-full flex items-center justify-between px-5 py-4">
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
        <h2 className="font-heading font-semibold" style={{ color: 'var(--text-primary)' }}>{title}</h2>
      </div>
      {expandedSection === id ? <ChevronUp className="w-4 h-4" style={{ color: 'var(--text-muted)' }} /> : <ChevronDown className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />}
    </button>
  )

  return (
    <div className="space-y-4 max-w-lg">
      <div className="card overflow-hidden p-0">
        <SectionHeader id="pricing" icon={Calendar} title="Default Pricing Rates" />
        {expandedSection === 'pricing' && (
          <div className="px-5 pb-5 space-y-3 border-t pt-4" style={{ borderColor: 'var(--border-light)' }}>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>Milk Rate (per packet)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono" style={{ color: 'var(--text-muted)' }}>{formData.currency}</span>
                <input type="number" step="1" min="0" value={formData.milkRatePerPacket} onChange={(e) => setFormData((prev) => ({ ...prev, milkRatePerPacket: e.target.value }))} className="input-field pl-8 font-mono" placeholder="30" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>Curd Rate (per packet)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono" style={{ color: 'var(--text-muted)' }}>{formData.currency}</span>
                <input type="number" step="1" min="0" value={formData.curdRatePerPacket} onChange={(e) => setFormData((prev) => ({ ...prev, curdRatePerPacket: e.target.value }))} className="input-field pl-8 font-mono" placeholder="40" />
              </div>
            </div>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Default rate used when no month-specific rate is set.</p>
          </div>
        )}
      </div>

      <div className="card overflow-hidden p-0">
        <SectionHeader id="monthly" icon={Calendar} title="Month-specific Rates" />
        {expandedSection === 'monthly' && (
          <div className="px-5 pb-5 space-y-3 border-t pt-4" style={{ borderColor: 'var(--border-light)' }}>
            <form onSubmit={handleSaveMonthlyRate} className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>Month</label>
                <input type="month" value={monthRate.month} onChange={(e) => setMonthRate((prev) => ({ ...prev, month: e.target.value }))} className="input-field" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>Milk Rate</label>
                  <input type="number" step="1" min="0" value={monthRate.milk} onChange={(e) => setMonthRate((prev) => ({ ...prev, milk: e.target.value }))} className="input-field font-mono" placeholder="30" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>Curd Rate</label>
                  <input type="number" step="1" min="0" value={monthRate.curd} onChange={(e) => setMonthRate((prev) => ({ ...prev, curd: e.target.value }))} className="input-field font-mono" placeholder="40" />
                </div>
              </div>
              <button type="submit" className="btn-primary w-full">Set Rate</button>
            </form>
            {Object.keys(monthlyRates).length > 0 && (
              <div className="space-y-2 pt-2">
                <p className="text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Configured Months</p>
                {Object.entries(monthlyRates).map(([month, rates]) => (
                  <div key={month} className="flex items-center justify-between px-3 py-2 rounded-lg text-sm" style={{ backgroundColor: 'var(--bg-card-alt)' }}>
                    <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{month}</span>
                    <span className="font-mono" style={{ color: 'var(--text-secondary)' }}>Milk ₹{rates.milkRatePerPacket} / Curd ₹{rates.curdRatePerPacket}</span>
                  </div>
                ))}
              </div>
            )}
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Month-specific rates override the default for that month's bills.</p>
          </div>
        )}
      </div>

      <div className="card">
        <h2 className="font-heading font-semibold text-lg mb-4">Vendor Info</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>Vendor / Shop Name</label>
            <input type="text" value={formData.vendorName} onChange={(e) => setFormData((prev) => ({ ...prev, vendorName: e.target.value }))} className="input-field" placeholder="Your shop name" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>Phone Number</label>
            <input type="tel" value={formData.vendorPhone} onChange={(e) => setFormData((prev) => ({ ...prev, vendorPhone: e.target.value }))} className="input-field" placeholder="Contact number" />
          </div>
        </div>
      </div>

      <button onClick={handleSave} className="btn-primary w-full">Save Settings</button>

      <div className="card">
        <h2 className="font-heading font-semibold text-lg mb-4">Appearance</h2>
        <div className="flex gap-2">
          {[{ value: 'light', icon: Sun, label: 'Light' }, { value: 'dark', icon: Moon, label: 'Dark' }, { value: 'system', icon: Monitor, label: 'System' }].map(({ value, icon: Icon, label }) => (
            <button key={value} onClick={() => { setTheme(value); localStorage.setItem('theme', value) }} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-colors ${theme === value ? '' : ''}`}
              style={theme === value ? { backgroundColor: 'var(--color-primary)', color: 'white' } : { backgroundColor: 'var(--bg-card-alt)', color: 'var(--text-muted)' }}>
              <Icon className="w-4 h-4" />{label}
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 className="font-heading font-semibold text-lg mb-4">Account</h2>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--color-primary)' }}>
            <span className="text-sm font-semibold text-white">{user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate" style={{ color: 'var(--text-primary)' }}>{user?.displayName || 'User'}</p>
            <p className="text-sm truncate" style={{ color: 'var(--text-secondary)' }}>{user?.email}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-colors" style={{ color: 'var(--color-danger)' }}>
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  )
}

export default Settings
