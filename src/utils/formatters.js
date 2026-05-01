import { format, parseISO } from 'date-fns'

export const formatCurrency = (amount, currency = '\u20B9') => {
  return `${currency}${amount.toFixed(2)}`
}

export const formatDate = (dateString) => {
  return format(parseISO(dateString), 'dd MMM yyyy')
}

export const formatDateShort = (dateString) => {
  return format(parseISO(dateString), 'dd MMM')
}

export const formatMonth = (monthString) => {
  return format(parseISO(`${monthString}-01`), 'MMMM yyyy')
}

export const formatMonthShort = (monthString) => {
  return format(parseISO(`${monthString}-01`), 'MMM yy')
}

export const getCurrentMonth = () => {
  return format(new Date(), 'yyyy-MM')
}

export const getCurrentDate = () => {
  return format(new Date(), 'yyyy-MM-dd')
}

export const formatQty = (qty) => {
  return qty.toString()
}

export const formatGreeting = () => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}
