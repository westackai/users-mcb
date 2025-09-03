'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    Home,
    MessageSquare,
    Calendar,
    FileText,
    Settings,
    User,
    LogOut,
    Menu,
    X,
    Video,
    Stethoscope,
    Bell,
    ChevronLeft,
    ChevronRight,
    CreditCard,
    ChevronDown
} from 'lucide-react'
import { removeToken } from '../../_utils/cookies'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import Image from 'next/image'

const SideBar = () => {
    const router = useRouter()
    const userProfile = useSelector((state: any) => state.user.userProfile)
    console.log("userProfile-----=", userProfile)
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [isMobileOpen, setIsMobileOpen] = useState(false)
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
    const pathname = usePathname()
    const profileRef = useRef<HTMLDivElement>(null)

    // Close profile dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setIsProfileMenuOpen(false)
            }
        }

        if (isProfileMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isProfileMenuOpen])

    const navigationItems = [
        // {
        //     name: 'Dashboard',
        //     href: '/dashboard',
        //     icon: Home,
        //     // description: 'Overview and quick actions'
        // },
        {
            name: 'Video Consultation',
            href: '/video-consultation',
            icon: Video,
            // description: 'Start a session with doctor'
        },
        {
            name: 'Chat History',
            href: '/chat-history',
            icon: MessageSquare,
            // description: 'Previous conversations'
        },
        // {
        //     name: 'Appointments',
        //     href: '/appointments',
        //     icon: Calendar,
        //     // description: 'Schedule and manage sessions'
        // },
        // {
        //     name: 'Medical Records',
        //     href: '/records',
        //     icon: FileText,
        //     // description: 'Health documents and reports'
        // },
        {
            name: 'Health Tips',
            href: '/health-tips',
            icon: Stethoscope,
            // description: 'Wellness advice and articles'
        },
        // {
        //     name: 'Notifications',
        //     href: '/notifications',
        //     icon: Bell,
        //     // description: 'Alerts and updates'
        // },

    ]

    const isActive = (href: string) => {
        if (href === '/dashboard') {
            return pathname === '/dashboard' || pathname === '/'
        }
        return pathname === href
    }

    const handleLogout = () => {
        // TODO: Implement logout functionality
        console.log('Logging out...')
        removeToken()
        router.push('/login')
        setIsProfileMenuOpen(false)
    }

    const toggleProfileMenu = () => {
        setIsProfileMenuOpen(!isProfileMenuOpen)
    }

    useEffect(() => {
        console.log("pathname-----=", pathname)
        if (pathname.startsWith('/video-consultation/') && pathname !== '/video-consultation') {
            setIsCollapsed(true)
        } else {
            setIsCollapsed(false)
        }
    }, [pathname])

    return (
        <>
            {/* Mobile Menu Button */}
            <div className="lg:hidden fixed top-4 left-4 z-50">
                <button
                    onClick={() => setIsMobileOpen(!isMobileOpen)}
                    className="p-2 bg-white rounded-lg shadow-lg border border-gray-200 transition-all duration-300 hover:scale-105 hover:shadow-xl"
                >
                    {isMobileOpen ? (
                        <X className="h-6 w-6 text-gray-600 transition-all duration-300 rotate-180" />
                    ) : (
                        <Menu className="h-6 w-6 text-gray-600 transition-all duration-300" />
                    )}
                </button>
            </div>

            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40 transition-all duration-300 ease-in-out animate-fadeIn"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`
                fixed top-0 left-0 h-full bg-white shadow-xl border-r border-[] z-30
                transition-all duration-500 ease-in-out transform
                ${isCollapsed ? 'w-16' : 'w-64'}
                ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className='flex flex-col h-full'>


                    {/* Header */}
                    <div className="p-4 border-b border-gray-200 transition-all duration-300">
                        <div className="flex items-center justify-between">
                            {!isCollapsed && (<div className={`flex items-center space-x-3 transition-all duration-300 ${isCollapsed ? 'w-0 overflow-hidden' : 'w-auto'}`}>
                                <div className=" flex items-center justify-center transition-all duration-300 hover:scale-110 flex-shrink-0">
                                    <div className='relative h-10 w-10'>

                                    <Image src="/logo.svg" fill alt="logo" />
                                    </div>
                                </div>
                                <span className={`text-lg font-bold text-gray-900 transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}`}>
                                    Dr. MCB
                                </span>
                            </div>)}
                            <button
                                onClick={() => setIsCollapsed(!isCollapsed)}
                                className="hidden lg:block p-1 rounded-lg cursor-pointer hover:bg-gray-100 transition-all duration-300 hover:scale-110 flex-shrink-0"
                            >
                                <svg
                                    className={`h-4 w-4 text-gray-600 transition-all duration-300 ${isCollapsed ? 'rotate-180' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto py-4 transition-all duration-300">
                        <nav className="space-y-1 px-3">
                            {navigationItems.map((item, index) => {
                                const Icon = item.icon
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`
                                        ${isCollapsed ? 'p-[10px]' : 'px-3 py-3 '}
                                        group flex items-center text-sm font-medium rounded-lg transition-all duration-300 ease-in-out
                                        transform hover:scale-105 hover:shadow-md
                                        ${isActive(item.href)
                                                ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600 shadow-sm'
                                                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                            }
                                    `}
                                        onClick={() => setIsMobileOpen(false)}
                                        style={{
                                            animationDelay: `${index * 50}ms`
                                        }}
                                    >
                                        <Icon className={` flex-shrink-0 h-5 w-5 transition-all duration-300
                                        ${isActive(item.href) ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'}
                                        group-hover:scale-110
                                    `} />
                                        {!isCollapsed && (<div className={`ml-3 flex-1 transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto'}`}>
                                            <div className="flex items-center justify-between">
                                                <span className="transition-all duration-300">{item.name}</span>
                                            </div>
                                            {/* <p className="text-xs text-gray-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                            {item?.description}
                                        </p> */}
                                        </div>)}
                                    </Link>
                                )
                            })}
                        </nav>
                    </div>
                    <div>

                    </div>

                    {/* Bottom Section - Profile Tab with Dropdown */}
                    <div className="border-t border-gray-200 p-4 transition-all duration-300">
                        {/* Profile Tab */}
                        <div className="relative" ref={profileRef}>
                            <button
                                onClick={toggleProfileMenu}
                                className={`
                                w-full group flex cursor-pointer items-center justify-between rounded-lg transition-all duration-300 ease-in-out
                                transform hover:scale-105 hover:shadow-md
                                ${isCollapsed ? 'p-2 justify-center' : 'px-3 py-3'}
                                bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-gray-300
                            `}
                            >
                                <div className="flex items-center">
                                    <div className={` ${isCollapsed ? 'bg-transparent ' : 'h-8 w-8 bg-gradient-to-r from-blue-500 to-indigo-600'} rounded-full flex items-center justify-center flex-shrink-0`}>
                                        <User className={`h-4 w-4 ${isCollapsed ? 'text-black' : 'text-white'}`} />
                                    </div>
                                    {!isCollapsed && (
                                        <div className="ml-3 text-left">
                                            <p className="text-sm font-medium text-gray-900">{userProfile?.firstName} {userProfile?.lastName}</p>
                                            <p className="text-xs text-gray-500 truncate max-w-[130px]">{userProfile?.email}</p>
                                        </div>
                                    )}
                                </div>
                                {!isCollapsed && (
                                    <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
                                )}
                            </button>

                            {/* Profile Dropdown Menu */}
                            {!isCollapsed && isProfileMenuOpen && (
                                <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                                    <div className="py-2">
                                        {/* Profile Option */}
                                        <Link
                                            href="/profile"
                                            className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                                            onClick={() => setIsProfileMenuOpen(false)}
                                        >
                                            <User className="h-4 w-4 text-gray-500 mr-3" />
                                            <span>Profile</span>
                                        </Link>

                                        {/* Billing Option */}
                                        <Link
                                            href="/billings"
                                            className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                                            onClick={() => setIsProfileMenuOpen(false)}
                                        >
                                            <CreditCard className="h-4 w-4 text-gray-500 mr-3" />
                                            <span>Billing</span>
                                        </Link>
                                        {/* <Link
                                            href="/settings"
                                            className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                                            onClick={() => setIsProfileMenuOpen(false)}
                                        >
                                            <Settings className="h-4 w-4 text-gray-500 mr-3" />
                                            <span>Settings</span>
                                        </Link> */}

                                        {/* Divider */}
                                        <div className="border-t border-gray-200 my-1"></div>

                                        {/* Logout Option */}
                                        <button
                                            onClick={handleLogout}
                                            className="w-full cursor-pointer flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                                        >
                                            <LogOut className="h-4 w-4 text-red-500 mr-3" />
                                            <span>Logout</span>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Profile Dropdown Menu for Collapsed Sidebar */}
                            {isCollapsed && isProfileMenuOpen && (
                                <div className="absolute left-full top-[-141px] ml-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-48">
                                    <div className="py-2">
                                        {/* Profile Option */}
                                        <Link
                                            href="/profile"
                                            className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                                            onClick={() => setIsProfileMenuOpen(false)}
                                        >
                                            <User className="h-4 w-4 text-gray-500 mr-3" />
                                            <span>Profile</span>
                                        </Link>

                                        {/* Billing Option */}
                                        <Link
                                            href="/billing"
                                            className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                                            onClick={() => setIsProfileMenuOpen(false)}
                                        >
                                            <CreditCard className="h-4 w-4 text-gray-500 mr-3" />
                                            <span>Billing</span>
                                        </Link>

                                        {/* Divider */}
                                        <div className="border-t border-gray-200 my-1"></div>

                                        {/* Logout Option */}
                                        <button
                                            onClick={handleLogout}
                                            className="w-full cursor-pointer flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                                        >
                                            <LogOut className="h-4 w-4 text-red-500 mr-3" />
                                            <span>Logout</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Navigation Items */}

            </div>

            {/* Main Content Spacer */}
            <div className={`${isCollapsed ? 'lg:ml-16' : 'lg:ml-64'} transition-all duration-500 ease-in-out`}>
                {/* This div ensures content doesn't overlap with sidebar */}
            </div>

            {/* Custom CSS for animations */}
            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }
                
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-in-out;
                }
                
                .sidebar-enter {
                    transform: translateX(-100%);
                }
                
                .sidebar-enter-active {
                    transform: translateX(0%);
                    transition: transform 500ms ease-in-out;
                }
                
                .sidebar-exit {
                    transform: translateX(0%);
                }
                
                .sidebar-exit-active {
                    transform: translateX(-100%);
                    transition: transform 500ms ease-in-out;
                }
            `}</style>
        </>
    )
}

export default SideBar