'use client'
export const runtime = 'edge';

import React, { useState } from 'react'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { authRegisterApiRequest, authVerifyOtpApiRequest } from '../../../networks/api'
import { setToken } from '../../../../_utils/cookies'
import { useRouter } from 'next/navigation'

const RegisterPage = () => {
    const router = useRouter()
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        age: '',
        gender: '',
        otp: ''
    })
    const [isLoading, setIsLoading] = useState(false)
    const [otpSent, setOtpSent] = useState(false)
    const [countdown, setCountdown] = useState(0)
    const [currentStep, setCurrentStep] = useState(1)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, '') // Remove non-digits
        if (value.length > 10) value = value.slice(0, 10) // Limit to 10 digits

        // Format as (XXX) XXX-XXXX
        if (value.length >= 6) {
            value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6)}`
        } else if (value.length >= 3) {
            value = `(${value.slice(0, 3)}) ${value.slice(3)}`
        }

        setFormData(prev => ({
            ...prev,
            phoneNumber: value
        }))
    }

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.email || !formData.firstName || !formData.lastName || !formData.phoneNumber || !formData.age || !formData.gender) return

        setIsLoading(true)
        try {
            // TODO: Replace with actual OTP sending API call
            const payload = {
                email: formData.email,
                firstName: formData.firstName,
                lastName: formData.lastName,
                phoneNumber: formData.phoneNumber,
                age: Number(formData.age),
                gender: formData.gender
            }
            const response = await authRegisterApiRequest(payload)
            if(response){
                console.log('Sending OTP to:', formData.email)
                setOtpSent(true)
                setCurrentStep(2)
                setCountdown(30) // 30 seconds countdown
            }


        } catch (error) {
            console.error('Failed to send OTP:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleResendOtp = async () => {
        if (countdown > 0) return

        setIsLoading(true)
        try {
            // TODO: Replace with actual resend OTP API call
            await new Promise(resolve => setTimeout(resolve, 1000))
            console.log('Resending OTP to:', formData.email)
            setCountdown(30)

            // Start countdown timer
            const timer = setInterval(() => {
                setCountdown(prev => {
                    if (prev <= 1) {
                        clearInterval(timer)
                        return 0
                    }
                    return prev - 1
                })
            }, 1000)

        } catch (error) {
            console.error('Failed to resend OTP:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.otp) return

        setIsLoading(true)
        try {
            // TODO: Replace with actual OTP verification and account creation API call
            const response = await authVerifyOtpApiRequest({
                email: formData.email,
                otp: formData.otp
            })
            if(response){
                console.log('Account created successfully')
                console.log("response-----=", response?.data?.data?.access_token)
                setToken(response?.data?.data?.access_token)
                router.push('/onboarding')
            }
            await new Promise(resolve => setTimeout(resolve, 1000))
            console.log('Creating account with:', formData)
            // TODO: Handle successful account creation and redirect to login
        } catch (error) {
            console.error('Account creation failed:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const isFormValid = formData.firstName && formData.lastName && formData.email && formData.phoneNumber && formData.age && formData.gender

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full space-y-4">
                {/* Header */}
                <div className="text-center">
                    <div className="mx-auto h-20 w-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-4">
                        <svg className="h-12 w-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                    </div>
                    <h2 className="text-3xl  font-bold text-gray-900 mb-2">
                        Create Account
                    </h2>
                    {/* <p className="text-gray-600">
                        Join us for your virtual consultation experience
                    </p> */}
                </div>

                {/* Progress Indicator */}
                <div className="flex items-center justify-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${currentStep >= 1 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                    <div className={`w-3 h-3 rounded-full ${currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                </div>

                {/* Registration Form */}
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    {currentStep === 1 ? (
                        // Step 1: User Information
                        <form onSubmit={handleSendOtp} className="space-y-6">
                            <div className='grid grid-cols-2 gap-4'>

                                {/* First Name */}
                                <div>
                                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                                        First Name *
                                    </label>
                                    <input
                                        id="firstName"
                                        name="firstName"
                                        type="text"
                                        required
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border text-gray-700 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        placeholder="Enter your first name"
                                    />
                                </div>

                                {/* Last Name */}
                                <div>
                                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                                        Last Name *
                                    </label>
                                    <input
                                        id="lastName"
                                        name="lastName"
                                        type="text"
                                        required
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border text-gray-700 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        placeholder="Enter your last name"
                                    />
                                </div>
                            </div>

                            <div className='grid grid-cols-2 gap-4'>
                                {/* Age */}
                                <div>
                                    <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
                                        Age *
                                    </label>
                                    <input
                                        id="age"
                                        name="age"
                                        type="number"
                                        min="1"
                                        max="120"
                                        required
                                        value={formData.age}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border text-gray-700 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        placeholder="25"
                                    />
                                </div>

                                {/* Gender */}
                                <div>
                                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                                        Gender *
                                    </label>
                                    <select
                                        id="gender"
                                        name="gender"
                                        required
                                        value={formData.gender}
                                        onChange={handleSelectChange}
                                        className="w-full px-4 py-3 border text-gray-700 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    >
                                        <option value="">Select gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                        
                                    </select>
                                </div>
                            </div>

                            <div className='grid grid-cols-2 gap-4'>

                                {/* Email */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                        Email Address *
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border text-gray-700 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                            placeholder="Enter your email"
                                        />
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Phone Number */}
                                <div>
                                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                                        Phone Number *
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="phoneNumber"
                                            name="phoneNumber"
                                            type="tel"
                                            required
                                            value={formData.phoneNumber}
                                            onChange={handlePhoneChange}
                                            className="w-full px-4 py-3 border text-gray-700 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                            placeholder="(555) 123-4567"
                                        />
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <p className="mt-2 text-sm text-center text-gray-500">
                                We'll send a verification code to your email
                            </p>

                            <button
                                type="submit"
                                disabled={isLoading || !isFormValid}
                                className="w-full bg-gradient-to-r  cursor-pointer from-green-600 to-emerald-600 text-white py-3 px-4 rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Sending OTP...
                                    </div>
                                ) : (
                                    'Continue to Verification'
                                )}
                            </button>
                        </form>
                    ) : (
                        // Step 2: OTP Verification
                        <form onSubmit={handleSubmit} className="space-y-6 relative">
                            <div className="text-center">
                                <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                    <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    Verify Your Email
                                </h3>
                                <p className="text-sm text-gray-600 mb-4">
                                    We've sent a 4-digit code to <span className="font-medium text-gray-900">{formData.email}</span>
                                </p>
                            </div>

                            <div>
                                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                                    Enter OTP
                                </label>
                                <input
                                    id="otp"
                                    name="otp"
                                    type="text"
                                    required
                                    maxLength={4}
                                    value={formData.otp}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 text-center text-2xl font-mono border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-700 focus:border-transparent transition-all placeholder:text-gray-300 duration-200 tracking-widest"
                                    placeholder="0000"
                                />
                                <p className="mt-2 text-sm text-gray-500 text-center">
                                    Enter the 4-digit code from your email
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading || formData.otp.length !== 4}
                                className="w-full bg-gradient-to-r cursor-pointer from-green-600 to-emerald-600 text-white py-3 px-4 rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Creating Account...
                                    </div>
                                ) : (
                                    'Create Account'
                                )}
                            </button>

                            {/* Resend OTP Section */}
                            <div className="text-center">
                                <p className="text-sm text-gray-600 mb-2">
                                    Didn't receive the code?
                                </p>
                                <button
                                    type="button"
                                    onClick={handleResendOtp}
                                    disabled={countdown > 0 || isLoading}
                                    className="text-blue-600 hover:text-blue-500 cursor-pointer font-medium transition-colors duration-200 disabled:text-gray-400 disabled:cursor-not-allowed"
                                >
                                    {countdown > 0 ? `Resend in ${countdown}s` : 'Resend OTP'}
                                </button>
                            </div>

                            {/* Back to User Info */}
                            <div className="text-center absolute top-0 left-0">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setCurrentStep(1)
                                        setOtpSent(false)
                                        setFormData(prev => ({ ...prev, otp: '' }))
                                    }}
                                    className="text-sm cursor-pointer text-gray-600 hover:text-gray-800 transition-colors duration-200"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Divider */}
                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">Already have an account?</span>
                            </div>
                        </div>
                    </div>

                    {/* Login Link */}
                    <div className="mt-6 text-center">
                        <Link
                            href="/login"
                            className="text-blue-600 hover:text-blue-500 cursor-pointer font-medium transition-colors duration-200"
                        >
                            Sign in to your account
                        </Link>
                    </div>
                </div>

                {/* Footer */}
                {/* <div className="text-center text-sm text-gray-500">
                    <p>Secure registration powered by advanced encryption</p>
                    <p className="mt-1">Your health information is protected</p>
                </div> */}
            </div>
        </div>
    )
}

export default RegisterPage
