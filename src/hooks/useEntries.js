import { useMemo } from 'react'
import { useApp } from '../context/AppContext'

export const useEntries = () => {
  const { state, addEntry, updateEntry, deleteEntry } = useApp()

  const getEntriesByDate = (date) =>
    state.entries.filter((e) => e.date === date)

  const getEntriesByMonth = (month) =>
    state.entries.filter((e) => e.date.startsWith(month))

  const getEntriesByCustomer = (customerId) =>
    state.entries.filter((e) => e.customerId === customerId)

  const getEntriesByCustomerAndMonth = (customerId, month) =>
    state.entries.filter(
      (e) => e.customerId === customerId && e.date.startsWith(month)
    )

  const getEntry = (id) => state.entries.find((e) => e.id === id)

  return {
    entries: state.entries,
    loading: state.loading.entries,
    getEntriesByDate,
    getEntriesByMonth,
    getEntriesByCustomer,
    getEntriesByCustomerAndMonth,
    getEntry,
    addEntry,
    updateEntry,
    deleteEntry,
  }
}
