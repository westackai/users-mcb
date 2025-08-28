'use client'
import React, { useEffect, useState } from 'react'
import { User, Calendar, Clock, VenusAndMars, AlertCircle } from 'lucide-react'
import { toast } from 'react-toastify'

interface PersonalInfoStepProps {
  data: {
    name: string
    age: number
    gender: string
    dateOfBirth: string
  }
  updateData: (data: Partial<{
    name: string
    age: number
    gender: string
    dateOfBirth: string
  }>) => void
}

const PersonalInfoStep: React.FC<PersonalInfoStepProps> = ({ data, updateData }) => {
  const [showAgeError, setShowAgeError] = useState(false)
  

  const handleInputChange = (field: string, value: string | number) => {
    updateData({ [field]: value })
  }

  const calculateAge = (dateOfBirth: string) => {
    if (!dateOfBirth) return 0
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  const handleDateChange = (dateOfBirth: string) => {
    const age = calculateAge(dateOfBirth)
    
    if (age < 1) {
      setShowAgeError(true)
      // Hide the error after 5 seconds
      setTimeout(() => setShowAgeError(false), 5000)
      return
    }
    
    setShowAgeError(false)
    updateData({ dateOfBirth, age })
  }
  useEffect(() => {
    if(showAgeError){
      toast.error('Age must be at least 1 year old')
      setShowAgeError(false)
    }
  }, [showAgeError])

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <User className="h-16 w-16 text-blue-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Personal Information</h3>
        <p className="text-gray-600">Let's start with some basic information about you</p>
      </div>

      {/* Age Error Toast */}
      

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Name */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            value={data.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="w-full px-4 py-3 border placeholder:text-gray-400 text-gray-700 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your full name"
            required
          />
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date of Birth *
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="date"
              value={data.dateOfBirth}
              onChange={(e) => handleDateChange(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className="w-full pl-10 pr-4 py-3 border placeholder:text-gray-400 text-gray-700 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          {data.age > 0 && data.age < 1 && (
            <p className="text-sm text-red-600 mt-1">
              Age must be at least 1 year old
            </p>
          )}
        </div>

        {/* Age (Auto-calculated) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Age
          </label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="number"
              value={data.age || ''}
              readOnly
              className={`w-full pl-10 pr-4 py-3 border rounded-lg placeholder:text-gray-400 text-gray-700 ${
                data.age > 0 && data.age < 1 
                  ? 'bg-red-50 border-red-300 text-red-700' 
                  : 'bg-gray-50 border-gray-200 text-gray-600'
              }`}
              placeholder="Auto-calculated"
            />
          </div>
        </div>

        {/* Gender */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gender *
          </label>
          <div className="grid grid-cols-3 gap-3">
            {['Male', 'Female', 'Other'].map((gender) => (
              <button
                key={gender}
                type="button"
                onClick={() => handleInputChange('gender', gender.toLowerCase())}
                className={`p-3 border rounded-lg text-center transition-colors duration-200 placeholder:text-gray-400 text-gray-700 ${
                  data.gender === gender.toLowerCase()
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <VenusAndMars className="h-5 w-5 mx-auto mb-1" />
                {gender}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> Your personal information helps us provide personalized care and ensure accurate medical records. You must be at least 1 year old to use this service.
        </p>
      </div>
    </div>
  )
}

export default PersonalInfoStep 