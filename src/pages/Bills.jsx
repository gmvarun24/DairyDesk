import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEntries } from '../hooks/useEntries'
import { useCustomers } from '../hooks/useCustomers'
import { useSettings } from '../hooks/useSettings'
import { useApp } from '../context/AppContext'
import { calculateBill, calculateTotals } from '../utils/billCalculator'
import { formatCurrency, getCurrentMonth, formatMonth } from '../utils/formatters'
import BillCard from '../components/BillCard'
import EmptyState from '../components/EmptyState'
import LoadingSpinner from '../components/LoadingSpinner'

const Bills = () => {
  const navigate = useNavigate()
  const { entries, loading: entriesLoading } = useEntries()
  const { activeCustomers } = useCustomers()
  const { settings, getRateForMonth } = useSettings()
  const { state, savePayment } = useApp()

  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth())
  const [sortBy, setSortBy] = useState('name')

  const monthEntries = useMemo(() => entries.filter((e) => e.date.startsWith(selectedMonth)), [entries, selectedMonth])
  const rates = getRateForMonth(selectedMonth)
  const monthTotals = useMemo(() => calculateTotals(monthEntries, rates.milkRatePerPacket || 0, rates.curdRatePerPacket || 0), [monthEntries, rates])

  const customerBills = useMemo(() => {
    const bills = []
    activeCustomers.forEach((customer) => {
      const customerEntries = monthEntries.filter((e) => e.customerId === customer.id)
      const bill = calculateBill(customerEntries, rates.milkRatePerPacket || 0, rates.curdRatePerPacket || 0)
      bill.month = selectedMonth
      const paymentId = `${customer.id}_${selectedMonth}`
      const isPaid = state.payments[paymentId]?.isPaid || false
      bills.push({ customer, bill, isPaid })
    })
    if (sortBy === 'name') bills.sort((a, b) => a.customer.name.localeCompare(b.customer.name))
    else if (sortBy === 'amount') bills.sort((a, b) => b.bill.totalAmount - a.bill.totalAmount)
    return bills
  }, [activeCustomers, monthEntries, rates, selectedMonth, sortBy, state.payments])

  const navigateMonth = (direction) => {
    const date = new Date(`${selectedMonth}-01`)
    date.setMonth(date.getMonth() + direction)
    setSelectedMonth(date.toISOString().slice(0, 7))
  }

  const handleTogglePaid = async (customerId, isCurrentlyPaid) => {
    const paymentId = `${customerId}_${selectedMonth}`
    const customerEntries = monthEntries.filter((e) => e.customerId === customerId)
    const bill = calculateBill(customerEntries, rates.milkRatePerPacket || 0, rates.curdRatePerPacket || 0)
    await savePayment(paymentId, { customerId, month: selectedMonth, isPaid: !isCurrentlyPaid, paidAmount: bill.totalAmount, paidAt: !isCurrentlyPaid ? new Date().toISOString() : null })
  }

  if (entriesLoading) return <LoadingSpinner />

  const hasAnyEntries = customerBills.some((b) => b.bill.totalAmount > 0)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button onClick={() => navigateMonth(-1)} className="p-2 rounded-lg" style={{ color: 'var(--text-secondary)' }}><ChevronLeft className="w-5 h-5" /></button>
        <h2 className="font-heading font-semibold text-lg">{formatMonth(selectedMonth)}</h2>
        <button onClick={() => navigateMonth(1)} className="p-2 rounded-lg" style={{ color: 'var(--text-secondary)' }}><ChevronRight className="w-5 h-5" /></button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="card text-center py-4">
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Total Milk</p>
          <p className="font-mono text-lg font-semibold" style={{ color: 'var(--color-primary)' }}>{monthTotals.totalMilk} <span className="text-xs" style={{ color: 'var(--text-muted)' }}>pkts</span></p>
        </div>
        <div className="card text-center py-4">
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Total Curd</p>
          <p className="font-mono text-lg font-semibold" style={{ color: 'var(--color-accent)' }}>{monthTotals.totalCurd} <span className="text-xs" style={{ color: 'var(--text-muted)' }}>pkts</span></p>
        </div>
        <div className="card text-center py-4">
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Total</p>
          <p className="font-mono text-lg font-semibold" style={{ color: 'var(--color-success)' }}>{formatCurrency(monthTotals.totalAmount, settings?.currency)}</p>
        </div>
      </div>

      {rates.milkRatePerPacket !== settings?.milkRatePerPacket && (
        <div className="rounded-xl px-4 py-2.5 text-sm flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 border" style={{ backgroundColor: 'var(--color-accent-muted)', borderColor: 'var(--color-accent-light)', color: 'var(--color-accent)' }}>
          <span>Custom rates for this month:</span>
          <span className="font-mono font-medium">Milk ₹{rates.milkRatePerPacket}/pkt • Curd ₹{rates.curdRatePerPacket}/pkt</span>
        </div>
      )}

      <div className="flex gap-2 p-1 rounded-xl" style={{ backgroundColor: 'var(--bg-card-alt)' }}>
        <button onClick={() => setSortBy('name')} className={`flex-1 px-3 py-1.5 rounded-lg text-sm font-medium ${sortBy === 'name' ? 'shadow-sm' : ''}`}
          style={sortBy === 'name' ? { backgroundColor: 'var(--bg-card)', color: 'var(--color-primary)' } : { color: 'var(--text-muted)' }}>By Name</button>
        <button onClick={() => setSortBy('amount')} className={`flex-1 px-3 py-1.5 rounded-lg text-sm font-medium ${sortBy === 'amount' ? 'shadow-sm' : ''}`}
          style={sortBy === 'amount' ? { backgroundColor: 'var(--bg-card)', color: 'var(--color-primary)' } : { color: 'var(--text-muted)' }}>By Amount</button>
      </div>

      {!hasAnyEntries ? (
        <EmptyState title="No bills for this month" description="Add entries to generate bills" />
      ) : (
        <div className="space-y-3">
          {customerBills.map(({ customer, bill, isPaid }) => (
            <div key={customer.id} className="relative">
              <BillCard customer={customer} bill={bill} isPaid={isPaid} currency={settings?.currency} />
              <button onClick={() => handleTogglePaid(customer.id, isPaid)} className={`absolute top-4 right-4 sm:top-5 sm:right-5 px-2.5 py-1 text-xs rounded-full font-medium transition-colors ${isPaid ? '' : ''}`}
                style={isPaid ? { backgroundColor: 'var(--color-primary-muted)', color: 'var(--color-primary)' } : { backgroundColor: 'var(--bg-card-alt)', color: 'var(--text-muted)' }}>
                {isPaid ? 'Paid' : 'Mark Paid'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Bills
