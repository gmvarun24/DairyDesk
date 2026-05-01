import { AlertTriangle } from 'lucide-react'
import ModalPortal from './ModalPortal'

const ConfirmDialog = ({ isOpen, title, message, confirmText = 'Delete', cancelText = 'Cancel', onConfirm, onCancel }) => {
  if (!isOpen) return null

  return (
    <ModalPortal>
    <div className="fixed inset-0 z-[80] flex modal-backdrop" onClick={onCancel}>
      <div className="w-full max-w-sm p-6 sm:rounded-2xl rounded-t-2xl" style={{ backgroundColor: 'var(--bg-card)' }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-full" style={{ backgroundColor: 'rgba(192,57,43,0.1)' }}>
            <AlertTriangle className="w-5 h-5" style={{ color: 'var(--color-danger)' }} />
          </div>
          <h3 className="font-heading font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>{title}</h3>
        </div>
        <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="btn-secondary flex-1">{cancelText}</button>
          <button onClick={onConfirm} className="flex-1 font-medium py-2.5 px-4 rounded-lg transition-colors" style={{ backgroundColor: 'var(--color-danger)', color: 'white' }}>{confirmText}</button>
        </div>
      </div>
    </div>
    </ModalPortal>
  )
}

export default ConfirmDialog
