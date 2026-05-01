import { createContext, useContext, useReducer, useEffect, useCallback } from 'react'
import { useAuth } from './AuthContext'
import { customers as customerApi, entries as entryApi, settings as settingsApi, payments as paymentApi, monthlyRates as monthlyRatesApi } from '../firebase/firestore'
import toast from 'react-hot-toast'

const AppContext = createContext(null)

const initialState = {
  customers: [],
  entries: [],
  settings: null,
  payments: {},
  monthlyRates: {},
  loading: {
    customers: true,
    entries: true,
    settings: true,
    monthlyRates: true,
  },
}

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_CUSTOMERS':
      return { ...state, customers: action.payload, loading: { ...state.loading, customers: false } }
    case 'SET_ENTRIES':
      return { ...state, entries: action.payload, loading: { ...state.loading, entries: false } }
    case 'SET_SETTINGS':
      return { ...state, settings: action.payload, loading: { ...state.loading, settings: false } }
    case 'SET_MONTHLY_RATES':
      return { ...state, monthlyRates: action.payload, loading: { ...state.loading, monthlyRates: false } }
    case 'SET_PAYMENT':
      return { ...state, payments: { ...state.payments, [action.payload.id]: action.payload } }
    case 'SET_LAST_ENTRY':
      return { ...state, lastEntry: action.payload }
    case 'ADD_CUSTOMER':
      return { ...state, customers: [action.payload, ...state.customers] }
    case 'UPDATE_CUSTOMER':
      return {
        ...state,
        customers: state.customers.map((c) =>
          c.id === action.payload.id ? { ...c, ...action.payload } : c
        ),
      }
    case 'ADD_ENTRY':
      return { ...state, entries: [action.payload, ...state.entries], lastEntry: action.payload }
    case 'UPDATE_ENTRY':
      return {
        ...state,
        entries: state.entries.map((e) =>
          e.id === action.payload.id ? { ...e, ...action.payload } : e
        ),
      }
    case 'DELETE_ENTRY':
      return { ...state, entries: state.entries.filter((e) => e.id !== action.payload) }
    default:
      return state
  }
}

export const AppProvider = ({ children }) => {
  const { user } = useAuth()
  const [state, dispatch] = useReducer(appReducer, initialState)

  const loadCustomers = useCallback(async () => {
    if (!user) return
    try {
      const data = await customerApi.getAll(user.uid)
      dispatch({ type: 'SET_CUSTOMERS', payload: data })
    } catch (error) {
      toast.error('Failed to load customers')
    }
  }, [user])

  const loadEntries = useCallback(async () => {
    if (!user) return
    try {
      const data = await entryApi.getAll(user.uid)
      dispatch({ type: 'SET_ENTRIES', payload: data })
    } catch (error) {
      toast.error('Failed to load entries')
    }
  }, [user])

  const loadSettings = useCallback(async () => {
    if (!user) return
    try {
      const data = await settingsApi.get(user.uid)
      dispatch({ type: 'SET_SETTINGS', payload: data || {
        milkRatePerPacket: 30,
        curdRatePerPacket: 40,
        vendorName: '',
        vendorPhone: '',
        currency: '\u20B9',
      }})
    } catch (error) {
      toast.error('Failed to load settings')
    }
  }, [user])

  const loadMonthlyRates = useCallback(async () => {
    if (!user) return
    try {
      const data = await monthlyRatesApi.getAll(user.uid)
      const ratesMap = {}
      data.forEach((r) => { ratesMap[r.month] = r })
      dispatch({ type: 'SET_MONTHLY_RATES', payload: ratesMap })
    } catch (error) {
      toast.error('Failed to load monthly rates')
    }
  }, [user])

  useEffect(() => {
    if (user) {
      loadCustomers()
      loadEntries()
      loadSettings()
      loadMonthlyRates()
    }
  }, [user, loadCustomers, loadEntries, loadSettings, loadMonthlyRates])

  const addCustomer = async (data) => {
    try {
      const id = await customerApi.create(user.uid, data)
      dispatch({ type: 'ADD_CUSTOMER', payload: { id, ...data, isActive: true } })
      toast.success('Customer added')
      return id
    } catch (error) {
      toast.error('Failed to add customer')
      throw error
    }
  }

  const updateCustomer = async (id, data) => {
    try {
      await customerApi.update(user.uid, id, data)
      dispatch({ type: 'UPDATE_CUSTOMER', payload: { id, ...data } })
      toast.success('Customer updated')
    } catch (error) {
      toast.error('Failed to update customer')
      throw error
    }
  }

  const addEntry = async (data) => {
    try {
      const id = await entryApi.create(user.uid, data)
      dispatch({ type: 'ADD_ENTRY', payload: { id, ...data } })
      toast.success('Entry added')
      return id
    } catch (error) {
      toast.error('Failed to add entry')
      throw error
    }
  }

  const updateEntry = async (id, data) => {
    try {
      await entryApi.update(user.uid, id, data)
      dispatch({ type: 'UPDATE_ENTRY', payload: { id, ...data } })
      toast.success('Entry updated')
    } catch (error) {
      toast.error('Failed to update entry')
      throw error
    }
  }

  const deleteEntry = async (id) => {
    try {
      await entryApi.delete(user.uid, id)
      dispatch({ type: 'DELETE_ENTRY', payload: id })
      toast.success('Entry deleted')
    } catch (error) {
      toast.error('Failed to delete entry')
      throw error
    }
  }

  const saveSettings = async (data) => {
    try {
      await settingsApi.save(user.uid, data)
      dispatch({ type: 'SET_SETTINGS', payload: { ...state.settings, ...data } })
      toast.success('Settings saved')
    } catch (error) {
      toast.error('Failed to save settings')
      throw error
    }
  }

  const saveMonthlyRate = async (month, data) => {
    try {
      await monthlyRatesApi.save(user.uid, month, data)
      dispatch({ type: 'SET_MONTHLY_RATES', payload: { ...state.monthlyRates, [month]: { ...data, month } } })
      toast.success(`Rates set for ${month}`)
    } catch (error) {
      toast.error('Failed to save monthly rate')
      throw error
    }
  }

  const savePayment = async (paymentId, data) => {
    try {
      await paymentApi.save(user.uid, paymentId, data)
      dispatch({ type: 'SET_PAYMENT', payload: { id: paymentId, ...data } })
      toast.success('Payment status updated')
    } catch (error) {
      toast.error('Failed to update payment')
      throw error
    }
  }

  return (
    <AppContext.Provider
      value={{
        state,
        addCustomer,
        updateCustomer,
        addEntry,
        updateEntry,
        deleteEntry,
        saveSettings,
        saveMonthlyRate,
        savePayment,
        refresh: { loadCustomers, loadEntries, loadSettings },
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
