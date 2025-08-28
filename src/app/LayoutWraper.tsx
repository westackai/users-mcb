'use client'
export const runtime = 'edge';

import React, { useEffect, useState } from 'react'
import SideBar from '@/components/SideBar'
import { usePathname, useRouter } from 'next/navigation'

import { useDispatch, useSelector } from "react-redux";
import { getUserDetailsThunk } from '@/lib/Redux/ReduxActions/userActions'
import { getToken } from '../../_utils/cookies'


interface LayoutWraperProps {
    children: React.ReactNode
}

const LayoutWraper = ({ children }: LayoutWraperProps) => {
    const pathName = usePathname()
    const router = useRouter()
    const dispatch = useDispatch()
    const userProfile = useSelector((state: any) => state.user.userProfile)
    const token = getToken()
    const [isInitializing, setIsInitializing] = useState(true)

    // Define public routes that don't require authentication
    const publicRoutes = ['/login', '/register']

    useEffect(() => {
        // Check if current route is public
        const isPublicRoute = publicRoutes.includes(pathName)

        // If no token and trying to access protected route, redirect to login
        if (!token && !isPublicRoute) {
            router.push('/login')
            setIsInitializing(false)
            return
        }

        // If no token and on login/register page, stay there
        if (!token && (pathName === '/login' || pathName === '/register')) {
            setIsInitializing(false)
            return
        }

        // If we have a token, fetch user details
        if (token) {
            dispatch(getUserDetailsThunk() as any)
        }
        
        setIsInitializing(false)
    }, [token, pathName, router, dispatch])

    // Separate useEffect for onboarding check - runs after userProfile is loaded
    useEffect(() => {
        console.log("userProfile", userProfile?.is_onbording_completed)
        
        // Only check onboarding if userProfile is loaded and we have a token
        if (token && userProfile && userProfile.is_onbording_completed === false && pathName !== '/onboarding') {
            router.push('/onboarding')
        }
    }, [userProfile, token, pathName, router])

    // Show loading state while initializing
    if (isInitializing) {
        return (
            <div className="h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        )
    }

    // Don't render anything while redirecting
    if (!token && !publicRoutes.includes(pathName)) {
        return null
    }

    if (publicRoutes.includes(pathName) || pathName === '/onboarding') {
        return (
            <div className=''>
                {children}
            </div>
        )
    }

    return (
        <div className='flex h-screen w-full'>
            <SideBar />
            <div className='w-full mx-auto overflow-y-auto'>
                {children}
            </div>
        </div>
    )
}

export default LayoutWraper