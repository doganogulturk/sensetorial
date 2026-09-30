'use client'

import { useEffect } from 'react'
import { incrementArticleViews } from '@/lib/supabase'

// Görüntülenmeyi tarayıcıda sayar; aynı oturumda aynı makale bir kez sayılır.
export default function ViewCounter({ articleId }: { articleId: string }) {
  useEffect(() => {
    const key = `viewed:${articleId}`
    try {
      if (sessionStorage.getItem(key)) return
      sessionStorage.setItem(key, '1')
    } catch {
      // sessionStorage kullanılamıyorsa yine de say
    }
    incrementArticleViews(articleId).catch(error => {
      console.error('Görüntülenme sayısı güncellenemedi:', error)
    })
  }, [articleId])

  return null
}
