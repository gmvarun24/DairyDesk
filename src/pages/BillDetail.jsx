import { useState, useMemo, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Printer, Share2, CheckCircle, Circle } from 'lucide-react'
import toast from 'react-hot-toast'
import { useEntries } from '../hooks/useEntries'
import { useCustomers } from '../hooks/useCustomers'
import { useSettings } from '../hooks/useSettings'
import { useApp } from '../context/AppContext'
import { calculateBill } from '../utils/billCalculator'
import { formatCurrency, formatMonth, formatDateShort } from '../utils/formatters'
import LoadingSpinner from '../components/LoadingSpinner'

const BillDetail = () => {
  const { customerId, month } = useParams()
  const navigate = useNavigate()
  const { getEntriesByCustomerAndMonth } = useEntries()
  const { getCustomer } = useCustomers()
  const { settings, getRateForMonth } = useSettings()
  const { state, savePayment } = useApp()

  const customer = getCustomer(customerId)
  const customerEntries = getEntriesByCustomerAndMonth(customerId, month)
  const rates = getRateForMonth(month)

  const bill = useMemo(() => calculateBill(customerEntries, rates.milkRatePerPacket || 0, rates.curdRatePerPacket || 0), [customerEntries, rates])

  const paymentId = `${customerId}_${month}`
  const payment = state.payments[paymentId]
  const isPaid = payment?.isPaid || false

  const handleTogglePaid = async () => {
    await savePayment(paymentId, { customerId, month, isPaid: !isPaid, paidAmount: bill.totalAmount, paidAt: !isPaid ? new Date().toISOString() : null })
  }

  const handlePrint = () => { window.print() }

  const handleShare = async () => {
    const billText = generateBillText()
    
    // Check if Web Share API is supported AND we are in a secure context
    if (navigator.share && navigator.canShare && navigator.canShare({ text: billText })) {
      try {
        await navigator.share({
          title: `Bill - ${customer?.name}`,
          text: billText
        })
        return
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Share failed:', error)
        } else {
          return // User cancelled, don't fallback to copy
        }
      }
    }
    
    // Fallback to clipboard
    copyToClipboard(billText)
  }

  const generateBillText = () => {
    let text = `${settings?.vendorName || 'Milk & Curd Bill'}\nBill for ${customer?.name}\nPeriod: ${formatMonth(month)}\n${'─'.repeat(30)}\n\n`
    bill.entries.forEach((entry) => {
      text += `${formatDateShort(entry.date)}\n`
      if (entry.milkQty > 0) text += `  Milk: ${entry.milkQty} pkts\n`
      if (entry.curdQty > 0) text += `  Curd: ${entry.curdQty} pkts\n`
      text += `  Amount: ${formatCurrency(entry.amount, settings?.currency)}\n\n`
    })
    text += `${'─'.repeat(30)}\nTotal Milk: ${bill.totalMilk} pkts\nTotal Curd: ${bill.totalCurd} pkts\nTotal Amount: ${formatCurrency(bill.totalAmount, settings?.currency)}\n\nRates: Milk @ ${formatCurrency(rates.milkRatePerPacket || 0, settings?.currency)}/pkt | Curd @ ${formatCurrency(rates.curdRatePerPacket || 0, settings?.currency)}/pkt`
    return text
  }

  const copyToClipboard = async (text) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text)
        toast.success('Bill copied to clipboard!')
      } else {
        // Fallback for non-secure contexts (like local IP testing)
        const textArea = document.createElement('textarea')
        textArea.value = text
        textArea.style.position = 'fixed'
        textArea.style.left = '-9999px'
        textArea.style.top = '0'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        try {
          document.execCommand('copy')
          toast.success('Bill copied to clipboard!')
        } catch (err) {
          toast.error('Failed to copy bill')
        }
        document.body.removeChild(textArea)
      }
    } catch (err) {
      toast.error('Failed to copy bill')
    }
  }

  if (!customer) return <LoadingSpinner />

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between no-print">
        <button onClick={() => navigate('/bills')} className="flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back to Bills</span>
        </button>
        <div className="flex items-center gap-2">
          <button onClick={handlePrint} className="p-2 rounded-lg" style={{ color: 'var(--text-muted)' }} title="Print"><Printer className="w-5 h-5" /></button>
          <button onClick={handleShare} className="p-2 rounded-lg" style={{ color: 'var(--text-muted)' }} title="Share"><Share2 className="w-5 h-5" /></button>
        </div>
      </div>

      <div id="bill-content" className="card">
        <div className="text-center mb-6 pb-6 border-b" style={{ borderColor: 'var(--border-light)' }}>
          <h1 className="font-heading text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{settings?.vendorName || 'Milk & Curd Bill'}</h1>
          {settings?.vendorPhone && <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{settings.vendorPhone}</p>}
          <h2 className="font-heading text-lg font-semibold mt-4" style={{ color: 'var(--text-primary)' }}>Monthly Bill</h2>
          <p style={{ color: 'var(--text-secondary)' }}>{formatMonth(month)}</p>
        </div>

        <div className="mb-6 pb-4 border-b" style={{ borderColor: 'var(--border-light)' }}>
          <h3 className="font-heading font-semibold" style={{ color: 'var(--text-primary)' }}>{customer.name}</h3>
          {customer.phone && <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{customer.phone}</p>}
          {customer.address && <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{customer.address}</p>}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b" style={{ borderColor: 'var(--border-light)' }}>
              <th className="text-left py-2 font-semibold text-xs" style={{ color: 'var(--text-muted)' }}>Date</th>
              <th className="text-right py-2 font-semibold text-xs" style={{ color: 'var(--text-muted)' }}>Milk (pkts)</th>
              <th className="text-right py-2 font-semibold text-xs" style={{ color: 'var(--text-muted)' }}>Curd (pkts)</th>
              <th className="text-right py-2 font-semibold text-xs" style={{ color: 'var(--text-muted)' }}>Amount</th>
            </tr></thead>
            <tbody>
              {bill.entries.map((entry) => (
                <tr key={entry.id} className="border-b" style={{ borderColor: 'var(--border-light)' }}>
                  <td className="py-2" style={{ color: 'var(--text-primary)' }}>{formatDateShort(entry.date)}</td>
                  <td className="py-2 text-right font-mono" style={{ color: 'var(--text-primary)' }}>{entry.milkQty > 0 ? entry.milkQty : '-'}</td>
                  <td className="py-2 text-right font-mono" style={{ color: 'var(--text-primary)' }}>{entry.curdQty > 0 ? entry.curdQty : '-'}</td>
                  <td className="py-2 text-right font-mono font-semibold" style={{ color: 'var(--text-primary)' }}>{formatCurrency(entry.amount, settings?.currency)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2" style={{ borderColor: 'var(--text-primary)' }}>
                <td className="py-3 font-semibold" style={{ color: 'var(--text-primary)' }}>Total</td>
                <td className="py-3 text-right font-mono font-semibold" style={{ color: 'var(--text-primary)' }}>{bill.totalMilk} pkts</td>
                <td className="py-3 text-right font-mono font-semibold" style={{ color: 'var(--text-primary)' }}>{bill.totalCurd} pkts</td>
                <td className="py-3 text-right font-mono font-bold text-lg" style={{ color: 'var(--color-primary)' }}>{formatCurrency(bill.totalAmount, settings?.currency)}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="mt-6 pt-4 border-t text-sm" style={{ borderColor: 'var(--border-light)', color: 'var(--text-secondary)' }}>
          <p>Milk @ {formatCurrency(rates.milkRatePerPacket || 0, settings?.currency)}/pkt | Curd @ {formatCurrency(rates.curdRatePerPacket || 0, settings?.currency)}/pkt</p>
        </div>

        <div className="mt-6 flex items-center justify-between no-print">
          <button onClick={handleTogglePaid} className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-colors ${isPaid ? '' : ''}`}
            style={isPaid ? { backgroundColor: 'var(--color-primary-muted)', color: 'var(--color-primary)' } : { backgroundColor: 'var(--bg-card-alt)', color: 'var(--text-secondary)' }}>
            {isPaid ? <CheckCircle className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
            {isPaid ? 'Paid' : 'Mark as Paid'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default BillDetail
