'use client'
import React from 'react'
import { Brain, AlertCircle, Clock, Heart, Coffee, Pill, Users } from 'lucide-react'

interface HealthSymptomsStepProps {
  data: {
    medicationSideEffects: string
    organizationDifficulty: string
    memoryIssues: string
    moodPatterns: string
    sleepQuality: string
    substanceUse: string
    otherConditions: string
    losingItems: string
  }
  updateData: (data: Partial<{
    medicationSideEffects: string
    organizationDifficulty: string
    memoryIssues: string
    moodPatterns: string
    sleepQuality: string
    substanceUse: string
    otherConditions: string
    losingItems: string
  }>) => void
}

const HealthSymptomsStep: React.FC<HealthSymptomsStepProps> = ({ data, updateData }) => {
  const handleInputChange = (field: string, value: string) => {
    updateData({ [field]: value })
  }

  const renderRadioGroup = (field: string, options: string[], label: string, icon: React.ReactNode) => (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
        {icon}
        <span className="ml-2">{label}</span>
      </label>
      <div className="grid grid-cols-1 gap-3">
        {options.map((option) => (
          <label key={option} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
            <input
              type="radio"
              name={field}
              value={option}
              checked={data[field as keyof typeof data] === option}
              onChange={(e) => handleInputChange(field, e.target.value)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <span className="ml-3 text-gray-700">{option}</span>
          </label>
        ))}
      </div>
    </div>
  )

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <Brain className="h-16 w-16 text-purple-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Health & Symptoms</h3>
        <p className="text-gray-600">Help us understand your health background and current symptoms</p>
      </div>

      <div className="space-y-8">
        {/* Medication Side Effects */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            What side effects do you experience from your current medications?
          </label>
          <div className="grid grid-cols-1 gap-3">
            {['None', 'Mild side effects', 'Moderate side effects', 'Severe side effects', 'I don\'t take medications'].map((option) => (
              <label key={option} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="medicationSideEffects"
                  value={option}
                  checked={data.medicationSideEffects === option}
                  onChange={(e) => handleInputChange('medicationSideEffects', e.target.value)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-3 text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Organization Difficulty */}
        {renderRadioGroup(
          'organizationDifficulty',
          ['Very difficult - I struggle daily', 'Somewhat difficult - I have challenges', 'Moderate - Sometimes I struggle', 'Easy - I stay organized well', 'Not sure'],
          'Do you find it hard to stay organized or complete tasks on time?',
          <Clock className="h-5 w-5 text-blue-500" />
        )}

        {/* Memory Issues */}
        {renderRadioGroup(
          'memoryIssues',
          ['Very poor - I forget things constantly', 'Poor - I often forget appointments', 'Moderate - Sometimes I forget', 'Good - I rarely forget things', 'Not sure'],
          'How is your memory? Do you forget appointments, tasks, or conversations?',
          <Brain className="h-5 w-5 text-green-500" />
        )}

        {/* Mood Patterns */}
        {renderRadioGroup(
          'moodPatterns',
          ['Very unstable - Frequent mood swings', 'Unstable - Regular mood changes', 'Moderate - Some mood variations', 'Stable - Generally consistent mood', 'Not sure'],
          'How is your mood most days? Do you experience sadness, anxiety, or irritability?',
          <Heart className="h-5 w-5 text-red-500" />
        )}

        {/* Sleep Quality */}
        {renderRadioGroup(
          'sleepQuality',
          ['Very poor - I have severe sleep issues', 'Poor - I often have trouble sleeping', 'Fair - Sometimes I have sleep issues', 'Good - I generally sleep well', 'Not sure'],
          'How is your sleep? Do you have trouble falling or staying asleep?',
          <Clock className="h-5 w-5 text-indigo-500" />
        )}

        {/* Substance Use */}
        {renderRadioGroup(
          'substanceUse',
          ['Yes, frequently - I use substances daily', 'Yes, sometimes - I use substances occasionally', 'Rarely - I use substances infrequently', 'No, I don\'t use any substances', 'Not sure'],
          'Do you use alcohol, caffeine, marijuana, or other substances to cope?',
          <Coffee className="h-5 w-5 text-brown-500" />
        )}

        {/* Other Conditions */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
            <Pill className="h-5 w-5 text-purple-500 mr-2" />
            Do you have any other medical conditions or take any medications?
          </label>
          <textarea
            value={data.otherConditions}
            onChange={(e) => handleInputChange('otherConditions', e.target.value)}
            className="w-full text-gray-700 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Please describe any other medical conditions, medications, or relevant health information... (or type 'None' if not applicable)"
            rows={3}
          />
          <p className="text-sm text-gray-500 mt-2">
            If you don't have any other conditions or medications, simply type "None" in the field above.
          </p>
        </div>

        {/* Losing Items */}
        {renderRadioGroup(
          'losingItems',
          ['Very often - I lose items daily', 'Often - I lose items weekly', 'Sometimes - I lose items occasionally', 'Rarely - I rarely lose items', 'Not sure'],
          'Do you frequently lose essential items like your keys, wallet, or phone?',
          <AlertCircle className="h-5 w-5 text-orange-500" />
        )}
      </div>

      <div className="bg-purple-50 p-4 rounded-lg">
        <p className="text-sm text-purple-800">
          <strong>Privacy Note:</strong> All information shared is confidential and protected by HIPAA regulations. This helps us provide the most appropriate care for your needs.
        </p>
      </div>
    </div>
  )
}

export default HealthSymptomsStep 