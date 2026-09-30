'use client'

import { useEffect } from 'react'
import { addToHistory } from '@/lib/history'
import { incrementArticleViews } from '@/lib/supabase'

type Props = { id: string; title: string; category: string | null }

// Okuma geçmişine ekler ve görüntülenmeyi sayar (aynı oturumda aynı doküman bir kez sayılır).
export default function ReadingTracker({ id, title, category }: Props) {
  useEffect(() => {
    addToHistory({ id, title, category })

    const key = `viewed:${id}`
    try {
      if (sessionStorage.getItem(key)) return
      sessionStorage.setItem(key, '1')
    } catch {
      // sessionStorage kullanılamıyorsa yine de say
    }
    incrementArticleViews(id).catch(error => {
      console.error('Görüntülenme sayısı güncellenemedi:', error)
    })
  }, [id, title, category])

  return null
}
