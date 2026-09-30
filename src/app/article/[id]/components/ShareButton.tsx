'use client'

import { useState } from 'react'
import { Check, Share2 } from 'lucide-react'

export default function ShareButton({ title, className }: { title: string; className: string }) {
  const [copied, setCopied] = useState(false)

  const share = async () => {
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({ title, url })
      } catch {
        // Kullanıcı paylaşımı iptal etti
      }
      return
    }
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      window.prompt('Bağlantıyı kopyalayın:', url)
    }
  }

  return (
    <button type="button" onClick={share} className={className}>
      {copied ? <Check className="h-4 w-4 text-accent" aria-hidden /> : <Share2 className="h-4 w-4" aria-hidden />}
      <span>{copied ? 'Kopyalandı' : 'Paylaş'}</span>
    </button>
  )
}
