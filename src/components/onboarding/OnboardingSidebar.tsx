'use client'
import React from 'react'
import { CheckCircle, User, Brain, FileText, ClipboardCheck } from 'lucide-react'

export interface OnboardingStep {
  id: number
  title: string
  description: string
  icon: React.ReactNode
  status: 'pending' | 'current' | 'completed'
}

interface OnboardingSidebarProps {
  steps: OnboardingStep[]
  currentStep: number
  totalSteps: number
  onStepClick: (stepNumber: number) => void
  isStepValid: (stepNumber: number) => boolean
}

const OnboardingSidebar: React.FC<OnboardingSidebarProps> = ({
  steps,
  currentStep,
  totalSteps,
  onStepClick,
  isStepValid
}) => {
  const getStepStatus = (stepNumber: number) => {
    if (stepNumber < currentStep) return 'completed'
    if (stepNumber === currentStep) return 'current'
    return 'pending'
  }

  const getStepIcon = (stepId: number) => {
    switch (stepId) {
      case 1:
        return <User className="h-5 w-5" />
      case 2:
        return <Brain className="h-5 w-5" />
      case 3:
        return <FileText className="h-5 w-5" />
      case 4:
        return <ClipboardCheck className="h-5 w-5" />
      default:
        return <User className="h-5 w-5" />
    }
  }

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex-shrink-0">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Onboarding Progress</h2>

        {/* Steps List */}
        <div className="space-y-3">
          {steps.map((step) => {
            const status = getStepStatus(step.id)
            const isClickable = step.id <= currentStep || isStepValid(step.id - 1)

            return (
              <div
                key={step.id}
                onClick={() => isClickable && onStepClick(step.id)}
                className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${status === 'completed'
                    ? 'bg-green-50 border border-green-200 hover:bg-green-100'
                    : status === 'current'
                      ? 'bg-blue-50 border border-blue-200'
                      : isClickable
                        ? 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                        : 'bg-gray-50 border border-gray-200 opacity-50 cursor-not-allowed'
                  }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${status === 'completed'
                      ? 'bg-green-500 text-white'
                      : status === 'current'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-300 text-gray-600'
                    }`}>
                    {status === 'completed' ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <div className={`text-gray-600 ${status === 'completed' ? 'text-green-600' : status === 'current' ? 'text-blue-600' : 'text-gray-500'
                        }`}>
                        {getStepIcon(step.id)}
                      </div>
                      <h3 className={`font-medium text-sm ${status === 'completed' ? 'text-green-900' : status === 'current' ? 'text-blue-900' : 'text-gray-700'
                        }`}>
                        {step.title}
                      </h3>
                    </div>
                    <p className={`text-xs mt-1 ${status === 'completed' ? 'text-green-700' : status === 'current' ? 'text-blue-700' : 'text-gray-500'
                      }`}>
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Progress Summary */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Overall Progress</span>
            <span className="text-sm text-gray-600">{Math.round((currentStep / totalSteps) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Step {currentStep} of {totalSteps} completed
          </p>
        </div>
      </div>
    </div>
  )
}

export default OnboardingSidebar