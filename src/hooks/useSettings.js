import { useApp } from '../context/AppContext'

export const useSettings = () => {
  const { state, saveSettings, saveMonthlyRate } = useApp()

  const settings = state.settings || {
    milkRatePerPacket: 30,
    curdRatePerPacket: 40,
    vendorName: '',
    vendorPhone: '',
    currency: '\u20B9',
  }

  const getRateForMonth = (month) => {
    if (state.monthlyRates && state.monthlyRates[month]) {
      return state.monthlyRates[month]
    }
    return {
      milkRatePerPacket: settings.milkRatePerPacket,
      curdRatePerPacket: settings.curdRatePerPacket,
    }
  }

  return {
    settings,
    monthlyRates: state.monthlyRates || {},
    getRateForMonth,
    loading: state.loading.settings,
    saveSettings,
    saveMonthlyRate,
  }
}
