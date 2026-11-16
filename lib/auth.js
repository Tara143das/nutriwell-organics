'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  createUserWithEmailAndPassword,
} from 'firebase/auth'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'

const AuthContext = createContext(null)

export const ROLES = {
  ADMIN: 'admin',
  EMPLOYEE: 'employee',
  CUSTOMER: 'customer',
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!auth) {
      setLoading(false)
      return
    }

    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser)
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
          if (userDoc.exists()) {
            setRole(userDoc.data().role || ROLES.CUSTOMER)
          } else {
            await setDoc(doc(db, 'users', firebaseUser.uid), {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              name: firebaseUser.displayName || '',
              role: ROLES.CUSTOMER,
              createdAt: serverTimestamp(),
            })
            setRole(ROLES.CUSTOMER)
          }
        } catch (err) {
          console.error('Role fetch error:', err)
          setRole(ROLES.CUSTOMER)
        }
      } else {
        setUser(null)
        setRole(null)
      }
      setLoading(false)
    })
    return () => unsub()
  }, [])

  const login = async (email, password) => {
    if (!auth) throw new Error('Firebase not initialized')
    const cred = await signInWithEmailAndPassword(auth, email, password)
    return cred.user
  }

  const signup = async (email, password, name = '') => {
    if (!auth) throw new Error('Firebase not initialized')
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    await setDoc(doc(db, 'users', cred.user.uid), {
      uid: cred.user.uid,
      email,
      name,
      role: ROLES.CUSTOMER,
      createdAt: serverTimestamp(),
    })
    return cred.user
  }

  const googleLogin = async () => {
    if (!auth) throw new Error('Firebase not initialized')
    const provider = new GoogleAuthProvider()
    const cred = await signInWithPopup(auth, provider)
    return cred.user
  }

  const logout = async () => {
    if (!auth) return
    await signOut(auth)
    setUser(null)
    setRole(null)
  }

  const isAdmin = role === ROLES.ADMIN
  const isEmployee = role === ROLES.EMPLOYEE
  const isCustomer = role === ROLES.CUSTOMER
  const isStaff = isAdmin || isEmployee

  return (
    <AuthContext.Provider
      value={{
        user, role, loading,
        login, signup, googleLogin, logout,
        isAdmin, isEmployee, isCustomer, isStaff,
        ROLES,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}