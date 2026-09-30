'use client'

import { useCallback, useSyncExternalStore } from 'react'

const EVENT = 'local-storage-change'

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback)
  window.addEventListener(EVENT, callback)
  return () => {
    window.removeEventListener('storage', callback)
    window.removeEventListener(EVENT, callback)
  }
}

function read(key: string) {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

export function writeLocalStorage(key: string, value: string) {
  try {
    localStorage.setItem(key, value)
  } catch {
    // Gizli sekme vb. durumlarda kaydedilemeyebilir
  }
  window.dispatchEvent(new Event(EVENT))
}

/** localStorage'daki ham değeri okur; sunucuda ve ilk render'da null döner. */
export function useLocalStorage(key: string) {
  const value = useSyncExternalStore(
    subscribe,
    () => read(key),
    () => null
  )
  const setValue = useCallback((next: string) => writeLocalStorage(key, next), [key])
  return [value, setValue] as const
}
