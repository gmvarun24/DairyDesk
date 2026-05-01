import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useCustomers } from '../hooks/useCustomers'
import CustomerCard from '../components/CustomerCard'
import EmptyState from '../components/EmptyState'
import LoadingSpinner from '../components/LoadingSpinner'
import ModalPortal from '../components/ModalPortal'

const Customers = () => {
  const { addCustomer } = useApp()
  const { customers, loading } = useCustomers()
  const navigate = useNavigate()

  const [search, setSearch] = useState('')
  const [tab, setTab] = useState('active')
  const [showAddForm, setShowAddForm] = useState(false)
  const [newCustomer, setNewCustomer] = useState({ name: '', phone: '', address: '' })

  const filteredCustomers = useMemo(() => {
    const filtered = customers.filter((c) => tab === 'active' ? c.isActive : !c.isActive)
    if (!search.trim()) return filtered
    return filtered.filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.phone && c.phone.includes(search))
    )
  }, [customers, tab, search])

  const handleAddCustomer = async (e) => {
    e.preventDefault()
    if (!newCustomer.name.trim()) return
    await addCustomer({
      name: newCustomer.name.trim(),
      phone: newCustomer.phone.trim(),
      address: newCustomer.address.trim(),
    })
    setNewCustomer({ name: '', phone: '', address: '' })
    setShowAddForm(false)
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-9"
          />
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="btn-primary flex items-center gap-1.5 whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add</span>
        </button>
      </div>

      <div className="flex gap-2 p-1 rounded-xl" style={{ backgroundColor: 'var(--bg-card-alt)' }}>
        <button
          onClick={() => setTab('active')}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === 'active' ? 'shadow-sm' : ''
          }`}
          style={tab === 'active' ? { backgroundColor: 'var(--bg-card)', color: 'var(--color-primary)' } : { color: 'var(--text-muted)' }}
        >
          Active
        </button>
        <button
          onClick={() => setTab('inactive')}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === 'inactive' ? 'shadow-sm' : ''
          }`}
          style={tab === 'inactive' ? { backgroundColor: 'var(--bg-card)', color: 'var(--color-primary)' } : { color: 'var(--text-muted)' }}
        >
          Inactive
        </button>
      </div>

      {filteredCustomers.length === 0 ? (
        <EmptyState
          title={search ? 'No matching customers' : tab === 'active' ? 'No active customers' : 'No inactive customers'}
          description={search ? 'Try a different search term' : tab === 'active' ? 'Add your first customer to get started' : ''}
          action={!search && tab === 'active' && (
            <button onClick={() => setShowAddForm(true)} className="btn-primary">Add Customer</button>
          )}
        />
      ) : (
        <div className="space-y-2">
          {filteredCustomers.map((customer, i) => (
            <div key={customer.id} className="list-item" style={{ animationDelay: `${i * 50}ms` }}>
              <CustomerCard customer={customer} />
            </div>
          ))}
        </div>
      )}

      <button
        onClick={() => setShowAddForm(true)}
        className="fab-fixed w-[52px] h-[52px] rounded-full flex items-center justify-center no-print fab-enter"
        style={{
          backgroundColor: "var(--color-primary)",
          boxShadow: "var(--shadow-fab)",
        }}
        title="Add customer"
      >
        <Plus className="w-[22px] h-[22px] text-white" />
      </button>

      {showAddForm && (
        <ModalPortal>
        <div className="fixed inset-0 z-[80] flex modal-backdrop" onClick={() => setShowAddForm(false)}>
          <div className="modal-panel sm:max-w-md p-5" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-heading font-semibold text-lg mb-4">Add Customer</h2>
            <form onSubmit={handleAddCustomer} className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>Name <span style={{ color: 'var(--color-danger)' }}>*</span></label>
                <input type="text" value={newCustomer.name} onChange={(e) => setNewCustomer((prev) => ({ ...prev, name: e.target.value }))} className="input-field" placeholder="Customer name" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>Phone</label>
                <input type="tel" value={newCustomer.phone} onChange={(e) => setNewCustomer((prev) => ({ ...prev, phone: e.target.value }))} className="input-field" placeholder="Phone number" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>Address</label>
                <input type="text" value={newCustomer.address} onChange={(e) => setNewCustomer((prev) => ({ ...prev, address: e.target.value }))} className="input-field" placeholder="Address" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowAddForm(false)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" className="btn-primary flex-1">Add Customer</button>
              </div>
            </form>
          </div>
        </div>
        </ModalPortal>
      )}
    </div>
  )
}

export default Customers
