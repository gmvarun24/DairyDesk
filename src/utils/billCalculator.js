export const calculateBill = (entries, milkRate, curdRate) => {
  let totalMilk = 0
  let totalCurd = 0

  const itemized = entries.map((entry) => {
    const milkAmount = (entry.milkQty || 0) * milkRate
    const curdAmount = (entry.curdQty || 0) * curdRate
    const amount = milkAmount + curdAmount

    totalMilk += entry.milkQty || 0
    totalCurd += entry.curdQty || 0

    return {
      ...entry,
      milkAmount,
      curdAmount,
      amount,
    }
  })

  const milkAmount = totalMilk * milkRate
  const curdAmount = totalCurd * curdRate
  const totalAmount = milkAmount + curdAmount

  return {
    totalMilk,
    totalCurd,
    milkAmount,
    curdAmount,
    totalAmount,
    entries: itemized,
  }
}

export const calculateTotals = (entries, milkRate, curdRate) => {
  let totalMilk = 0
  let totalCurd = 0

  entries.forEach((entry) => {
    totalMilk += entry.milkQty || 0
    totalCurd += entry.curdQty || 0
  })

  const milkAmount = totalMilk * milkRate
  const curdAmount = totalCurd * curdRate
  const totalAmount = milkAmount + curdAmount

  return { totalMilk, totalCurd, milkAmount, curdAmount, totalAmount }
}
