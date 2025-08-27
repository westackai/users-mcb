'use client'
 

import React, { useState } from 'react'
import { ChevronLeft } from 'lucide-react'
import { authLoginApiRequest, authVerifyOtpApiRequest } from '../../../networks/api'
import { toast } from 'react-toastify'
import { setToken } from '../../../../_utils/cookies'
import { useRouter } from 'next/navigation'


const LoginPage = () => {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    otp: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [countdown, setCountdown] = useState(0)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.email) return

    setIsLoading(true)
    try {
      // TODO: Replace with actual OTP sending API call
      
      const response = await authLoginApiRequest({ email: formData.email })
      if (response) {
        setOtpSent(true)
        setCountdown(60) // 30 seconds countdown

      }

    } catch (error :any) {
      console.error('Failed to send OTP:', error?.message)
      toast.error(error?.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOtp = async () => {
    if (countdown > 0) return

    setIsLoading(true)
    try {
      const payload = {
        email: formData.email,
      }
      
      const response = await authLoginApiRequest(payload)
     if(response){
      toast.success('OTP sent successfully')
      setCountdown(60)
     }


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
      // TODO: Replace with actual OTP verification API call
      const payload = {
        email: formData.email,
        otp: formData.otp
      }
      const response = await authVerifyOtpApiRequest(payload)
      if(response){
       setToken(response?.data?.data?.access_token)
       if(response?.data?.data?.is_onbording_completed === false){
        router.push('/onboarding')
       }else{
        router.push('/video-consultation')
       }
      }
      await new Promise(resolve => setTimeout(resolve, 1000))
      // TODO: Handle successful login
    } catch (error) {
      console.error('OTP verification failed:', error)
    } finally {
      setIsLoading(false)
    }
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-4">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-20 w-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-4">
            <svg className="h-12 w-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-600">
            Sign in to continue to your virtual consultation
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {!otpSent ? (
            // Step 1: Email Input
            <form onSubmit={handleSendOtp} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
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
                <p className="mt-2 text-sm text-gray-500">
                  We'll send a one-time password to your email
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading || !formData.email}
                className="w-full bg-gradient-to-r cursor-pointer from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
                  'Send OTP'
                )}
              </button>
            </form>
          ) : (
            // Step 2: OTP Input
            <form onSubmit={handleSubmit} className="space-y-6 relative">
              <div className="text-center">
                {/* <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div> */}
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  Check Your Email
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
                className="w-full bg-gradient-to-r cursor-pointer from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verifying...
                  </div>
                ) : (
                  'Verify & Sign In'
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

              {/* Back to Email */}
              <div className="text-center absolute top-0 left-0">
                <button
                  type="button"
                  onClick={() => {
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
                <span className="px-2 bg-white text-gray-500">New to the platform?</span>
              </div>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <a
              href="/register"
              className="text-blue-600 hover:text-blue-500 font-medium transition-colors duration-200"
            >
              Create an account
            </a>
          </div>
        </div>

        {/* Footer */}
        {/* <div className="text-center text-sm text-gray-500">
          <p>Secure login powered by advanced encryption</p>
          <p className="mt-1">Your health information is protected</p>
        </div> */}
      </div>
    </div>
  )
}

export default LoginPage