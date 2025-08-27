'use client'
import React from 'react'
import { CheckCircle, User, Brain, FileText } from 'lucide-react'
import type { OnboardingData } from '@/app/(authentication)/onboarding/page'

interface ReviewStepProps {
  data: OnboardingData
  updateData: (data: Partial<OnboardingData>) => void
}

const ReviewStep: React.FC<ReviewStepProps> = ({ data }) => {
  const formatBoolean = (value: boolean) => value ? 'Yes' : 'No'
  
  const formatField = (value: string | number | boolean) => {
    if (typeof value === 'boolean') return formatBoolean(value)
    if (typeof value === 'number') return value === 0 ? 'Not specified' : value.toString()
    return value || 'Not specified'
  }

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Review Your Information</h3>
        <p className="text-gray-600">Please review all the information you've provided before completing onboarding</p>
      </div>

      <div className="space-y-6">
        {/* Basic Information */}
        <div className="bg-blue-50 p-6 rounded-lg">
          <div className="flex items-center mb-4">
            <User className="h-6 w-6 text-blue-600 mr-3" />
            <h4 className="text-lg font-semibold text-blue-900">Basic Information</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm font-medium text-blue-700">Full Name:</span>
              <p className="text-blue-900">{formatField(data.name)}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-blue-700">Age:</span>
              <p className="text-blue-900">{formatField(data.age)}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-blue-700">Gender:</span>
              <p className="text-blue-900">{formatField(data.gender)}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-blue-700">Date of Birth:</span>
              <p className="text-blue-900">{formatField(data.dateOfBirth)}</p>
            </div>
          </div>
        </div>

        {/* Health & Symptoms */}
        <div className="bg-purple-50 p-6 rounded-lg">
          <div className="flex items-center mb-4">
            <Brain className="h-6 w-6 text-purple-600 mr-3" />
            <h4 className="text-lg font-semibold text-purple-900">Health & Symptoms</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm font-medium text-purple-700">Medication Side Effects:</span>
              <p className="text-purple-900">{formatField(data.medicationSideEffects)}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-purple-700">Organization Difficulty:</span>
              <p className="text-purple-900">{formatField(data.organizationDifficulty)}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-purple-700">Memory Issues:</span>
              <p className="text-purple-900">{formatField(data.memoryIssues)}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-purple-700">Sleep Quality:</span>
              <p className="text-purple-900">{formatField(data.sleepQuality)}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-purple-700">Substance Use:</span>
              <p className="text-purple-900">{formatField(data.substanceUse)}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-purple-700">Other Conditions:</span>
              <p className="text-purple-900">{formatField(data.otherConditions)}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-purple-700">Mood Patterns:</span>
              <p className="text-purple-900">{formatField(data.moodPatterns)}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-purple-700">Losing Items:</span>
              <p className="text-purple-900">{formatField(data.losingItems)}</p>
            </div>
          </div>
        </div>

        {/* Medical History */}
        <div className="bg-green-50 p-6 rounded-lg">
          <div className="flex items-center mb-4">
            <FileText className="h-6 w-6 text-green-600 mr-3" />
            <h4 className="text-lg font-semibold text-green-900">Medical History</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm font-medium text-green-700">Sleep Disorders:</span>
              <p className="text-green-900">{formatField(data.sleepDisorders)}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-green-700">Asthma:</span>
              <p className="text-green-900">{formatField(data.asthma)}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-green-700">Anxiety:</span>
              <p className="text-green-900">{formatField(data.anxiety)}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-green-700">Depression:</span>
              <p className="text-green-900">{formatField(data.depression)}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-green-700">Personality Disorders:</span>
              <p className="text-green-900">{formatField(data.personalityDisorders)}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-green-700">Hypertension:</span>
              <p className="text-green-900">{formatField(data.hypertension)}</p>
            </div>
            <div className="md:col-span-2">
              <span className="text-sm font-medium text-green-700">Other Medical Conditions:</span>
              <p className="text-green-900">{data.hasOtherMedicalConditions ? (data.otherMedicalConditions || 'Yes, but details not provided') : 'No'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 p-4 rounded-lg">
        <p className="text-sm text-yellow-800">
          <strong>Important:</strong> Please review all information carefully. Once you submit, you'll be able to update your information through your profile settings.
        </p>
      </div>
    </div>
  )
}

export default ReviewStep 