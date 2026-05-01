import { createPortal } from 'react-dom'
import { useEffect } from 'react'

const ModalPortal = ({ children }) => {
  useEffect(() => {
    document.body.classList.add('modal-open')
    return () => document.body.classList.remove('modal-open')
  }, [])

  return createPortal(children, document.body)
}

export default ModalPortal
