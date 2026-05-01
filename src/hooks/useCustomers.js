import { useMemo } from 'react'
import { useApp } from '../context/AppContext'

export const useCustomers = () => {
  const { state, addCustomer, updateCustomer } = useApp()

  const activeCustomers = useMemo(
    () => state.customers.filter((c) => c.isActive),
    [state.customers]
  )

  const inactiveCustomers = useMemo(
    () => state.customers.filter((c) => !c.isActive),
    [state.customers]
  )

  const getCustomer = (id) => state.customers.find((c) => c.id === id)

  return {
    customers: state.customers,
    activeCustomers,
    inactiveCustomers,
    loading: state.loading.customers,
    getCustomer,
    addCustomer,
    updateCustomer,
  }
}
