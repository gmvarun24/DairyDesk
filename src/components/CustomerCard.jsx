import { Phone, MapPin, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const CustomerCard = ({ customer }) => {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(`/customers/${customer.id}`)}
      className="card card-interactive flex items-start justify-between gap-4 py-4 px-5"
    >
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'var(--color-primary)' }}>
          <span className="text-sm font-semibold text-white" style={{ fontFamily: 'Sora' }}>
            {customer.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-heading font-semibold text-sm truncate" style={{ color: 'var(--text-primary)' }}>{customer.name}</h3>
            <span className={`px-2 py-0.5 text-[10px] rounded-full font-medium flex-shrink-0 ${
              customer.isActive ? '' : ''
            }`}
            style={customer.isActive ? { backgroundColor: 'var(--color-primary-muted)', color: 'var(--color-primary)' } : { backgroundColor: 'var(--bg-card-alt)', color: 'var(--text-muted)' }}>
              {customer.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
          <div className="space-y-1">
            {customer.phone && (
              <div className="flex items-center gap-1.5 text-sm" style={{ color: 'var(--text-secondary)' }}>
                <Phone className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
                <span>{customer.phone}</span>
              </div>
            )}
            {customer.address && (
              <div className="flex items-center gap-1.5 text-sm" style={{ color: 'var(--text-secondary)' }}>
                <MapPin className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
                <span className="truncate">{customer.address}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      <ChevronRight className="w-5 h-5 flex-shrink-0 mt-1" style={{ color: 'var(--text-muted)' }} />
    </div>
  )
}

export default CustomerCard
