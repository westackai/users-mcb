"use client"
import { avatarOnboardingApiRequest } from '@/networks/api'
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

type Props = {}

const AvatarOnboardingPage = (props: Props) => {
    const searchParams = useSearchParams()
    const avatar_id = searchParams.get('avatar_id')
    const [avatarId, setAvatarId] = useState(avatar_id)
    
    const fetchAvatarOnboarding = async () => {
        const response = await avatarOnboardingApiRequest(avatarId || '')
        if (response) {
            console.log('Avatar onboarding response:', response)
        }
    }
    useEffect(() => {
        fetchAvatarOnboarding()
    }, [avatar_id])
  return (
    <div>Avatar</div>
  )
}

export default AvatarOnboardingPage