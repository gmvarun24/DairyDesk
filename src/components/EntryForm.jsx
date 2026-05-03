import { useState, useEffect } from 'react'
import { X, Calculator } from 'lucide-react'
import { useSettings } from '../hooks/useSettings'
import { useCustomers } from '../hooks/useCustomers'
import { formatCurrency, getCurrentDate } from '../utils/formatters'
import ModalPortal from './ModalPortal'

const EntryForm = ({ isOpen, onClose, onSave, initialData, mode = 'add' }) => {
  const { settings } = useSettings()
  const { customers, activeCustomers } = useCustomers()
  const selectableCustomers = mode === 'edit' ? customers : activeCustomers
  const [formData, setFormData] = useState({
    customerId: '',
    customerName: '',
    date: getCurrentDate(),
    milkQty: '',
    curdQty: '',
    note: '',
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (initialData) {
      setFormData({
        customerId: initialData.customerId || '',
        customerName: initialData.customerName || '',
        date: initialData.date || getCurrentDate(),
        milkQty: initialData.milkQty?.toString() || '',
        curdQty: initialData.curdQty?.toString() || '',
        note: initialData.note || '',
      })
    } else {
      setFormData({
        customerId: '',
        customerName: '',
        date: getCurrentDate(),
        milkQty: '',
        curdQty: '',
        note: '',
      })
    }
    setErrors({})
  }, [initialData, isOpen])

  const handleCustomerChange = (e) => {
    const customerId = e.target.value
    const customer = selectableCustomers.find((c) => c.id === customerId)
    setFormData((prev) => ({ ...prev, customerId, customerName: customer?.name || '' }))
  }

  const subtotal = (() => {
    const milk = parseInt(formData.milkQty) || 0
    const curd = parseInt(formData.curdQty) || 0
    return milk * (settings?.milkRatePerPacket || 0) + curd * (settings?.curdRatePerPacket || 0)
  })()

  const validate = () => {
    const newErrors = {}
    if (!formData.customerId) newErrors.customerId = 'Please select a customer'
    if (!formData.date) newErrors.date = 'Date is required'
    const milk = parseInt(formData.milkQty) || 0
    const curd = parseInt(formData.curdQty) || 0
    if (milk <= 0 && curd <= 0) newErrors.quantity = 'Enter milk or curd quantity'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    onSave({
      customerId: formData.customerId,
      customerName: formData.customerName,
      date: formData.date,
      milkQty: parseInt(formData.milkQty) || 0,
      curdQty: parseInt(formData.curdQty) || 0,
      note: formData.note,
    })
    onClose()
  }

  if (!isOpen) return null

  return (
    <ModalPortal>
    <div className="fixed inset-0 z-[80] flex modal-backdrop" onClick={onClose}>
      <div className="modal-panel sm:max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 px-5 py-4 border-b flex items-center justify-between" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-light)' }}>
          <h2 className="font-heading font-semibold text-lg">{mode === 'add' ? 'Add Entry' : 'Edit Entry'}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg" style={{ color: 'var(--text-muted)' }}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>Customer</label>
            <select value={formData.customerId} onChange={handleCustomerChange} className="input-field">
              <option value="">Select customer</option>
              {selectableCustomers.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            {errors.customerId && <p className="text-xs mt-1" style={{ color: 'var(--color-danger)' }}>{errors.customerId}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>Date</label>
            <input type="date" value={formData.date} onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))} className="input-field" />
            {errors.date && <p className="text-xs mt-1" style={{ color: 'var(--color-danger)' }}>{errors.date}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>Milk (packets)</label>
              <input type="number" inputMode="numeric" step="1" min="0" placeholder="0" value={formData.milkQty} onChange={(e) => setFormData((prev) => ({ ...prev, milkQty: e.target.value }))} className="input-field font-mono" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>Curd (packets)</label>
              <input type="number" inputMode="numeric" step="1" min="0" placeholder="0" value={formData.curdQty} onChange={(e) => setFormData((prev) => ({ ...prev, curdQty: e.target.value }))} className="input-field font-mono" />
            </div>
          </div>
          {errors.quantity && <p className="text-xs -mt-2" style={{ color: 'var(--color-danger)' }}>{errors.quantity}</p>}

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>Note <span style={{ color: 'var(--text-muted)' }}>(optional)</span></label>
            <input type="text" placeholder="Morning delivery, etc." value={formData.note} onChange={(e) => setFormData((prev) => ({ ...prev, note: e.target.value }))} className="input-field" />
          </div>

          <div className="rounded-lg p-3 flex items-center gap-2" style={{ backgroundColor: 'var(--bg-card-alt)' }}>
            <Calculator className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Subtotal:</span>
            <span className="font-mono font-semibold ml-auto" style={{ color: 'var(--color-primary)' }}>
              {formatCurrency(subtotal, settings?.currency)}
            </span>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" className="btn-primary flex-1">{mode === 'add' ? 'Add Entry' : 'Save Changes'}</button>
          </div>
        </form>
      </div>
    </div>
    </ModalPortal>
  )
}

export default EntryForm
