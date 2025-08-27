'use client'
 

import React, { useEffect } from 'react'
import SideBar from '@/components/SideBar'
import { usePathname, useRouter } from 'next/navigation'

import { useDispatch } from "react-redux";
import { getUserDetailsThunk } from '@/lib/Redux/ReduxActions/userActions'
import { getToken } from '../../_utils/cookies'


interface LayoutWraperProps {
    children: React.ReactNode
}

const LayoutWraper = ({ children }: LayoutWraperProps) => {
    const pathName = usePathname()
    const router = useRouter()
    const dispatch = useDispatch()
    const token = getToken()

    // Define public routes that don't require authentication
    const publicRoutes = ['/login', '/register', '/onboarding']

    useEffect(() => {
        // Check if current route is public
        const isPublicRoute = publicRoutes.includes(pathName)

        if (!token && !isPublicRoute) {
            // Redirect to login if no token and trying to access protected route
            router.push('/login')
            return
        }

        // Redirect from root path to video-consultation if user has token
        if (token && pathName === '/') {
            router.push('/video-consultation')
            return
        }

        if (token) {
            dispatch(getUserDetailsThunk() as any)
        }
    }, [token, pathName, router, dispatch])

    // Don't render anything while redirecting
    if (!token && !publicRoutes.includes(pathName)) {
        return null
    }

    if (publicRoutes.includes(pathName)) {
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