'use client'
 

import { redirect } from 'next/navigation'
import { useState } from 'react'

export default function Home() {
  const [loading, setLoading] = useState(true)
  setLoading(false)
  if(loading) {
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    )
  }
  redirect('/video-consultation')
}
