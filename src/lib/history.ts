'use client'

import { useMemo } from 'react'
import { useLocalStorage, writeLocalStorage } from './useLocalStorage'

const KEY = 'sensetorial:history'
const LIMIT = 8

export type HistoryItem = { id: string; title: string; category: string | null; at: number }

function parse(raw: string | null): HistoryItem[] {
  if (!raw) return []
  try {
    const items = JSON.parse(raw)
    return Array.isArray(items) ? items : []
  } catch {
    return []
  }
}

export function useReadingHistory() {
  const [raw] = useLocalStorage(KEY)
  return useMemo(() => parse(raw), [raw])
}

export function addToHistory(item: Omit<HistoryItem, 'at'>) {
  let current: HistoryItem[] = []
  try {
    current = parse(localStorage.getItem(KEY))
  } catch {
    // okunamazsa boş liste ile devam
  }
  const next = [{ ...item, at: Date.now() }, ...current.filter(i => i.id !== item.id)].slice(0, LIMIT)
  writeLocalStorage(KEY, JSON.stringify(next))
}
