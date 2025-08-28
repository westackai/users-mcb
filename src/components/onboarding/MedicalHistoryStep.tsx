'use client'
import React from 'react'
import { FileText, CheckSquare, Square, AlertCircle, Heart, Brain, Activity, Clock, Droplets } from 'lucide-react'

interface MedicalHistoryStepProps {
  data: {
    none: boolean
    sleepDisorders: boolean
    asthma: boolean
    anxiety: boolean
    depression: boolean
    personalityDisorders: boolean
    hypertension: boolean
    hasOtherMedicalConditions: boolean
    otherMedicalConditions: string
  }
  updateData: (data: Partial<{
    none: boolean
    sleepDisorders: boolean
    asthma: boolean
    anxiety: boolean
    depression: boolean
    personalityDisorders: boolean
    hypertension: boolean
    hasOtherMedicalConditions: boolean
    otherMedicalConditions: string
  }>) => void
}

const MedicalHistoryStep: React.FC<MedicalHistoryStepProps> = ({ data, updateData }) => {
  const handleCheckboxChange = (field: string, checked: boolean) => {
    if (field === 'none') {
      if (checked) {
        // If "None" is selected, uncheck all other conditions
        updateData({
          none: true,
          sleepDisorders: false,
          asthma: false,
          anxiety: false,
          depression: false,
          personalityDisorders: false,
          hypertension: false,
          hasOtherMedicalConditions: false,
          otherMedicalConditions: ''
        })
      } else {
        // If "None" is unchecked, just uncheck it
        updateData({ none: false })
      }
    } else {
      // If any other condition is selected, uncheck "None"
      const updateDataObj: any = { [field]: checked, none: false }
      updateData(updateDataObj)
    }
  }

  const handleTextChange = (field: string, value: string) => {
    updateData({ [field]: value })
  }

  const medicalConditions = [
    {
      key: 'none',
      label: 'None',
      description: 'I do not have any of the medical conditions listed below',
      icon: <CheckSquare className="h-5 w-5 text-green-500" />,
      category: 'General'
    },
    {
      key: 'sleepDisorders',
      label: 'Sleep Disorders',
      description: 'Insomnia, sleep apnea, restless leg syndrome',
      icon: <Clock className="h-5 w-5 text-indigo-500" />,
      category: 'Sleep & Rest'
    },
    {
      key: 'asthma',
      label: 'Asthma',
      description: 'Respiratory condition causing breathing difficulties',
      icon: <Activity className="h-5 w-5 text-blue-500" />,
      category: 'Respiratory'
    },
    {
      key: 'anxiety',
      label: 'Anxiety Disorders',
      description: 'Generalized anxiety, panic attacks, social anxiety',
      icon: <Brain className="h-5 w-5 text-purple-500" />,
      category: 'Mental Health'
    },
    {
      key: 'depression',
      label: 'Depression',
      description: 'Major depressive disorder, persistent depressive disorder',
      icon: <Heart className="h-5 w-5 text-red-500" />,
      category: 'Mental Health'
    },
    {
      key: 'personalityDisorders',
      label: 'Personality Disorders',
      description: 'Borderline, narcissistic, or other personality disorders',
      icon: <Brain className="h-5 w-5 text-orange-500" />,
      category: 'Mental Health'
    },
    {
      key: 'hypertension',
      label: 'Hypertension',
      description: 'High blood pressure or cardiovascular conditions',
      icon: <Droplets className="h-5 w-5 text-red-600" />,
      category: 'Cardiovascular'
    }
  ]



  return (
    <div className="max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <FileText className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Medical History</h3>
        <p className="text-gray-600">
          Please select any medical conditions that apply to you.
        </p>
      </div>

      {/* Medical Conditions List */}
      <div className="space-y-3 mb-8">
        {medicalConditions.map((condition) => (
          <div 
            key={condition.key} 
            className="bg-white border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
            onClick={() => handleCheckboxChange(condition.key, !data[condition.key as keyof typeof data])}
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-1">
                {data[condition.key as keyof typeof data] ? (
                  <CheckSquare className="h-5 w-5 text-green-600" />
                ) : (
                  <Square className="h-5 w-5 text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="font-medium text-gray-900">{condition.label}</h4>
                </div>
                <p className="text-sm text-gray-600">{condition.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Other Medical Conditions Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Additional Medical Conditions</h4>
        
        <div className="space-y-4">
          {/* Checkbox */}
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={data.hasOtherMedicalConditions}
              onChange={(e) => handleCheckboxChange('hasOtherMedicalConditions', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="text-gray-900 cursor-pointer">
              I have other medical conditions
            </label>
          </div>

          {/* Textarea */}
          <div>
            <textarea
              value={data.otherMedicalConditions || ''}
              onChange={(e) => {
                const value = e.target.value
                handleTextChange('otherMedicalConditions', value)
                handleCheckboxChange('hasOtherMedicalConditions', value.trim().length > 0)
              }}
              className="w-full px-3 py-3 border text-gray-700 placeholder:text-gray-400 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Please describe any other medical conditions, medications, or relevant health information..."
              rows={3}
              onClick={(e) => e.stopPropagation()}
            />
            <p className="text-sm text-gray-500 mt-2">
              Start typing to automatically check the box above
            </p>
          </div>
        </div>
      </div>

      {/* Information Note */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <p className="text-sm text-gray-700">
          <strong>Note:</strong> This information helps us provide safer, more effective treatment recommendations. 
          All information is kept confidential and protected by HIPAA regulations.
        </p>
      </div>
    </div>
  )
}

export default MedicalHistoryStep 