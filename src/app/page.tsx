'use client'

import { Suspense } from 'react'
import HomeContent from '@/components/HomeContent'
import Loading from '@/components/Loading'

export default function Home() {
  return (
    <Suspense fallback={<Loading />}>
      <HomeContent />
    </Suspense>
  )
}