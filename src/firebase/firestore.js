import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore'
import { db } from './config'

const USERS = 'users'

const getUserRef = (userId) => doc(db, USERS, userId)

export const customers = {
  getAll: async (userId) => {
    const q = query(
      collection(getUserRef(userId), 'customers'),
      orderBy('createdAt', 'desc')
    )
    const snapshot = await getDocs(q)
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  },

  getById: async (userId, customerId) => {
    const snapshot = await getDoc(doc(getUserRef(userId), 'customers', customerId))
    return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null
  },

  create: async (userId, data) => {
    const ref = await addDoc(collection(getUserRef(userId), 'customers'), {
      ...data,
      isActive: true,
      createdAt: serverTimestamp(),
    })
    return ref.id
  },

  update: async (userId, customerId, data) => {
    await updateDoc(doc(getUserRef(userId), 'customers', customerId), data)
  },

  delete: async (userId, customerId) => {
    await deleteDoc(doc(getUserRef(userId), 'customers', customerId))
  },
}

export const entries = {
  getAll: async (userId) => {
    const q = query(
      collection(getUserRef(userId), 'entries'),
      orderBy('date', 'desc'),
      limit(500)
    )
    const snapshot = await getDocs(q)
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  },

  getByDate: async (userId, date) => {
    const q = query(
      collection(getUserRef(userId), 'entries'),
      where('date', '==', date),
      orderBy('createdAt', 'desc')
    )
    const snapshot = await getDocs(q)
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  },

  getByMonth: async (userId, month) => {
    const q = query(
      collection(getUserRef(userId), 'entries'),
      where('date', '>=', `${month}-01`),
      where('date', '<=', `${month}-31`)
    )
    const snapshot = await getDocs(q)
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  },

  getByCustomer: async (userId, customerId) => {
    const q = query(
      collection(getUserRef(userId), 'entries'),
      where('customerId', '==', customerId),
      orderBy('date', 'desc')
    )
    const snapshot = await getDocs(q)
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  },

  getByCustomerAndMonth: async (userId, customerId, month) => {
    const q = query(
      collection(getUserRef(userId), 'entries'),
      where('customerId', '==', customerId),
      where('date', '>=', `${month}-01`),
      where('date', '<=', `${month}-31`)
    )
    const snapshot = await getDocs(q)
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  },

  create: async (userId, data) => {
    const ref = await addDoc(collection(getUserRef(userId), 'entries'), {
      ...data,
      createdAt: serverTimestamp(),
    })
    return ref.id
  },

  update: async (userId, entryId, data) => {
    await updateDoc(doc(getUserRef(userId), 'entries', entryId), data)
  },

  delete: async (userId, entryId) => {
    await deleteDoc(doc(getUserRef(userId), 'entries', entryId))
  },
}

export const settings = {
  get: async (userId) => {
    const snapshot = await getDoc(doc(getUserRef(userId), 'settings', userId))
    return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null
  },

  save: async (userId, data) => {
    await setDoc(doc(getUserRef(userId), 'settings', userId), {
      ...data,
      updatedAt: serverTimestamp(),
    })
  },
}

export const payments = {
  getById: async (userId, paymentId) => {
    const snapshot = await getDoc(doc(getUserRef(userId), 'payments', paymentId))
    return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null
  },

  save: async (userId, paymentId, data) => {
    await setDoc(doc(getUserRef(userId), 'payments', paymentId), {
      ...data,
      updatedAt: serverTimestamp(),
    })
  },
}

export const monthlyRates = {
  getAll: async (userId) => {
    const q = query(
      collection(getUserRef(userId), 'monthlyRates'),
      orderBy('month', 'desc')
    )
    const snapshot = await getDocs(q)
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  },

  save: async (userId, month, data) => {
    await setDoc(doc(getUserRef(userId), 'monthlyRates', month), {
      ...data,
      month,
      updatedAt: serverTimestamp(),
    })
  },

  delete: async (userId, month) => {
    await deleteDoc(doc(getUserRef(userId), 'monthlyRates', month))
  },
}
