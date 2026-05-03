import { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Edit, Phone, MapPin, Check, X } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useEntries } from '../hooks/useEntries'
import { useCustomers } from '../hooks/useCustomers'
import { useSettings } from '../hooks/useSettings'
import { calculateBill } from '../utils/billCalculator'
import { formatCurrency, formatDateShort, getCurrentMonth, formatMonth } from '../utils/formatters'
import ConfirmDialog from '../components/ConfirmDialog'
import EntryForm from '../components/EntryForm'
import LoadingSpinner from '../components/LoadingSpinner'

const CustomerDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { updateCustomer, updateEntry } = useApp()
  const { customers } = useCustomers()
  const { getEntriesByCustomerAndMonth } = useEntries()
  const { settings, getRateForMonth } = useSettings()

  const customer = customers.find((c) => c.id === id)
  const currentMonth = getCurrentMonth()
  const rates = getRateForMonth(currentMonth)

  const customerEntries = useMemo(() => getEntriesByCustomerAndMonth(id, currentMonth), [id, currentMonth])
  const bill = useMemo(() => calculateBill(customerEntries, rates.milkRatePerPacket || 0, rates.curdRatePerPacket || 0), [customerEntries, rates])

  const [editing, setEditing] = useState(false)
  const [editData, setEditData] = useState({ name: '', phone: '', address: '' })
  const [editingEntry, setEditingEntry] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(false)

  if (!customer) return <LoadingSpinner />

  const handleSaveEdit = async () => {
    await updateCustomer(id, editData)
    setEditing(false)
  }

  const handleToggleActive = async () => {
    await updateCustomer(id, { isActive: !customer.isActive })
  }

  const handleDelete = async () => {
    if (customerEntries.length > 0) {
      await updateCustomer(id, { isActive: false })
    }
    setConfirmDelete(false)
    navigate('/customers')
  }

  return (
    <div className="space-y-5">
      <button onClick={() => navigate('/customers')} className="flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm">Back to Customers</span>
      </button>

      <div className="card">
        {editing ? (
          <div className="space-y-3">
            <input type="text" value={editData.name} onChange={(e) => setEditData((prev) => ({ ...prev, name: e.target.value }))} className="input-field font-heading font-semibold text-lg" placeholder="Name" />
            <input type="tel" value={editData.phone} onChange={(e) => setEditData((prev) => ({ ...prev, phone: e.target.value }))} className="input-field" placeholder="Phone" />
            <input type="text" value={editData.address} onChange={(e) => setEditData((prev) => ({ ...prev, address: e.target.value }))} className="input-field" placeholder="Address" />
            <div className="flex gap-2">
              <button onClick={handleSaveEdit} className="btn-primary flex-1 flex items-center justify-center gap-1"><Check className="w-4 h-4" /> Save</button>
              <button onClick={() => setEditing(false)} className="btn-secondary flex-1 flex items-center justify-center gap-1"><X className="w-4 h-4" /> Cancel</button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'var(--color-primary)' }}>
                  <span className="text-lg font-semibold text-white" style={{ fontFamily: 'Sora' }}>{customer.name.charAt(0).toUpperCase()}</span>
                </div>
                <div>
                  <h2 className="font-heading text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>{customer.name}</h2>
                  <span className={`inline-block mt-1 px-2 py-0.5 text-[10px] rounded-full font-medium ${customer.isActive ? '' : ''}`}
                    style={customer.isActive ? { backgroundColor: 'var(--color-primary-muted)', color: 'var(--color-primary)' } : { backgroundColor: 'var(--bg-card-alt)', color: 'var(--text-muted)' }}>
                    {customer.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              <button onClick={() => { setEditData({ name: customer.name, phone: customer.phone || '', address: customer.address || '' }); setEditing(true) }} className="p-2 rounded-lg" style={{ color: 'var(--text-muted)' }}>
                <Edit className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-1.5 text-sm" style={{ color: 'var(--text-secondary)' }}>
              {customer.phone && (
                <div className="flex items-center gap-2"><Phone className="w-4 h-4" style={{ color: 'var(--text-muted)' }} /><span>{customer.phone}</span></div>
              )}
              {customer.address && (
                <div className="flex items-center gap-2"><MapPin className="w-4 h-4" style={{ color: 'var(--text-muted)' }} /><span>{customer.address}</span></div>
              )}
            </div>
          </>
        )}
      </div>

      <div>
        <h3 className="text-[11px] font-medium uppercase tracking-[0.08em] mb-3" style={{ color: 'var(--text-muted)' }}>{formatMonth(currentMonth)} Summary</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="card text-center py-4">
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Milk</p>
            <p className="font-mono text-lg font-semibold" style={{ color: 'var(--color-primary)' }}>{bill.totalMilk} <span className="text-xs" style={{ color: 'var(--text-muted)' }}>pkts</span></p>
          </div>
          <div className="card text-center py-4">
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Curd</p>
            <p className="font-mono text-lg font-semibold" style={{ color: 'var(--color-accent)' }}>{bill.totalCurd} <span className="text-xs" style={{ color: 'var(--text-muted)' }}>pkts</span></p>
          </div>
          <div className="card text-center py-4">
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Amount</p>
            <p className="font-mono text-lg font-semibold" style={{ color: 'var(--color-success)' }}>{formatCurrency(bill.totalAmount, settings?.currency)}</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-[11px] font-medium uppercase tracking-[0.08em] mb-3" style={{ color: 'var(--text-muted)' }}>This Month's Entries</h3>
        {customerEntries.length === 0 ? (
          <div className="card text-center py-8">
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>No entries this month</p>
          </div>
        ) : (
          <div className="space-y-2">
            {customerEntries.map((entry) => {
              const amount = (entry.milkQty || 0) * (rates.milkRatePerPacket || 0) + (entry.curdQty || 0) * (rates.curdRatePerPacket || 0)
              return (
                <button
                  key={entry.id}
                  onClick={() => setEditingEntry(entry)}
                  className="card card-interactive w-full flex items-center justify-between gap-3 py-3 px-5 text-left"
                >
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{formatDateShort(entry.date)}</span>
                  <div className="flex items-center gap-3 text-sm">
                    {entry.milkQty > 0 && <span className="font-mono" style={{ color: 'var(--text-muted)' }}>{entry.milkQty}M</span>}
                    {entry.curdQty > 0 && <span className="font-mono" style={{ color: 'var(--text-muted)' }}>{entry.curdQty}C</span>}
                    <span className="font-mono font-semibold" style={{ color: 'var(--color-primary)' }}>{formatCurrency(amount, settings?.currency)}</span>
                    <Edit className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--text-muted)' }} aria-hidden="true" />
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>

      <div className="pt-4 border-t" style={{ borderColor: 'var(--border-light)' }}>
        <button onClick={handleToggleActive} className={`w-full py-2.5 rounded-lg text-sm font-medium transition-colors ${customer.isActive ? '' : ''}`}
          style={customer.isActive ? { backgroundColor: 'var(--bg-card-alt)', color: 'var(--text-muted)' } : { backgroundColor: 'var(--color-primary-muted)', color: 'var(--color-primary)' }}>
          {customer.isActive ? 'Deactivate Customer' : 'Activate Customer'}
        </button>
        <button onClick={() => setConfirmDelete(true)} className="w-full py-2.5 mt-2 rounded-lg text-sm font-medium transition-colors" style={{ color: 'var(--color-danger)' }}>
          Delete Customer
        </button>
      </div>

      <ConfirmDialog isOpen={confirmDelete} title="Delete Customer" message={`Are you sure you want to delete "${customer.name}"? ${customerEntries.length > 0 ? 'This will deactivate the customer.' : 'This cannot be undone.'}`} confirmText="Delete" onConfirm={handleDelete} onCancel={() => setConfirmDelete(false)} />

      <EntryForm
        isOpen={!!editingEntry}
        onClose={() => setEditingEntry(null)}
        onSave={async (data) => {
          if (!editingEntry) return
          await updateEntry(editingEntry.id, data)
          setEditingEntry(null)
        }}
        initialData={editingEntry}
        mode="edit"
      />
    </div>
  )
}

export default CustomerDetail
