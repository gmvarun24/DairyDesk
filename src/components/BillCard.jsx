import { CheckCircle, Circle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { formatCurrency } from '../utils/formatters'

const BillCard = ({ customer, bill, isPaid, currency }) => {
  const navigate = useNavigate()

  return (
    <div className="card card-interactive" onClick={() => navigate(`/bills/${customer.id}/${bill.month}`)}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'var(--color-primary)' }}>
            <span className="text-sm font-semibold text-white" style={{ fontFamily: 'Sora' }}>
              {customer.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-heading font-semibold text-sm truncate" style={{ color: 'var(--text-primary)' }}>{customer.name}</h3>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              {bill.totalMilk} milk + {bill.totalCurd} curd pkts
            </p>
          </div>
        </div>
        {isPaid ? (
          <CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--color-success)' }} />
        ) : (
          <Circle className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
        )}
      </div>
      <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: 'var(--border-light)' }}>
        <p className="font-mono font-bold text-lg" style={{ color: 'var(--color-primary)' }}>
          {formatCurrency(bill.totalAmount, currency)}
        </p>
        <span className="text-sm font-medium" style={{ color: 'var(--color-primary)' }}>View Bill</span>
      </div>
    </div>
  )
}

export default BillCard
