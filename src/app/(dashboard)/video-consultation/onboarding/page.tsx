"use client"
import { avatarOnboardingApiRequest, getAvatarDetilasByIdApiRequest, updateAvatarOnboardingApiRequest } from '@/networks/api'
import { useSearchParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight, CheckCircle, User, MessageSquare, HelpCircle } from 'lucide-react'

interface Question {
    type: number
    question: string
    options: string[] | null
}

interface OnboardingData {
    avatar_id: string
    user_id: string
    avatar_onbording: boolean
    questions: Question[]
}

interface Answer {
    question: string
    answer: string
}

type Props = {}

const AvatarOnboardingPage = (props: Props) => {
    const searchParams = useSearchParams()
    const router = useRouter()
    const avatar_id = searchParams.get('avatar_id')
    const [avatarId, setAvatarId] = useState(avatar_id)
    const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(null)
    const [answers, setAnswers] = useState<Record<string, string>>({})
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [currentStep, setCurrentStep] = useState(1)
    
    const getDummyOnboardingData = (): OnboardingData => {
        return {
            avatar_id: avatarId || "2712ea00-7c5b-4f41-bb87-79a440cf2bba",
            user_id: "352f5a76-851f-4094-aa7c-9301052200a0",
            avatar_onbording: false,
            questions: [
                {
                    type: 1,
                    question: "What is your name?",
                    options: null
                },
                {
                    type: 3,
                    question: "Do you have past experience with therapy?",
                    options: null
                },
                {
                    type: 2,
                    question: "What brings you here?",
                    options: [
                        "Stress management",
                        "ADHD",
                        "Therapy",
                        "Anxiety",
                        "Depression",
                        "Relationship issues"
                    ]
                },
                {
                    type: 1,
                    question: "Tell us about your current situation and what you hope to achieve through therapy.",
                    options: null
                },
                {
                    type: 2,
                    question: "How would you describe your current stress level?",
                    options: [
                        "Very low",
                        "Low",
                        "Moderate",
                        "High",
                        "Very high"
                    ]
                },
                {
                    type: 3,
                    question: "Have you tried therapy or counseling before?",
                    options: null
                },
                {
                    type: 2,
                    question: "What time of day works best for your sessions?",
                    options: [
                        "Morning (8 AM - 12 PM)",
                        "Afternoon (12 PM - 5 PM)",
                        "Evening (5 PM - 9 PM)",
                        "Flexible"
                    ]
                },
                {
                    type: 1,
                    question: "Is there anything specific you'd like your therapist to know about you?",
                    options: null
                }
            ]
        }
    }

    const fetchAvatarOnboarding = async () => {
        try {
            setLoading(true)
            setError(null)
            
            const response = await avatarOnboardingApiRequest(avatarId || '')
            console.log('Full API response:', response?.data?.data[0]?.avatar_onbording)
            if(response?.data?.data[0]?.avatar_onbording === true){
                router.push(`/video-consultation`)
            }
            
            // Handle different response structures
            let onboardingData = null
            if (response?.data?.data) {
                onboardingData = response.data.data
            } else if (response?.data) {
                onboardingData = response.data
            } else if (response) {
                onboardingData = response
            }
            
            if (onboardingData && onboardingData.questions && onboardingData.questions.length > 0) {
                setOnboardingData(onboardingData)
                console.log('Avatar onboarding response:', onboardingData)
            } else {
                // Use dummy data for testing
                console.log('Using dummy data for testing')
                setOnboardingData(getDummyOnboardingData())
            }
        } catch (err) {
            console.error('Error fetching onboarding data:', err)
            // Use dummy data when API fails
            console.log('API failed, using dummy data for testing')
            setOnboardingData(getDummyOnboardingData())
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (avatar_id) {
            fetchAvatarOnboarding()
        }
    }, [avatar_id])

    const getQuestionTypeIcon = (type: number) => {
        switch (type) {
            case 1:
                return <User className="h-6 w-6 text-blue-600" />
            case 2:
                return <MessageSquare className="h-6 w-6 text-green-600" />
            case 3:
                return <HelpCircle className="h-6 w-6 text-purple-600" />
            default:
                return <HelpCircle className="h-6 w-6 text-gray-600" />
        }
    }

    const getQuestionTypeLabel = (type: number) => {
        switch (type) {
            case 1:
                return 'Text Input'
            case 2:
                return 'Multiple Choice'
            case 3:
                return 'Yes/No Question'
            default:
                return 'Question'
        }
    }

    const handleAnswerChange = (questionIndex: number, answer: string) => {
        setAnswers(prev => ({
            ...prev,
            [questionIndex]: answer
        }))
    }

    // Helper functions for step management
    const getQuestionsByType = (type: number) => {
        if (!onboardingData?.questions) return []
        return onboardingData.questions.filter(q => q.type === type)
    }

    const getStepInfo = () => {
        const textQuestions = getQuestionsByType(1)
        const yesNoQuestions = getQuestionsByType(3)
        const multipleChoiceQuestions = getQuestionsByType(2)

        const steps = []
        
        if (textQuestions.length > 0) {
            steps.push({
                number: steps.length + 1,
                type: 1,
                title: 'Personal Information',
                description: 'Tell us about yourself',
                questions: textQuestions,
                icon: '📝'
            })
        }
        
        if (yesNoQuestions.length > 0) {
            steps.push({
                number: steps.length + 1,
                type: 3,
                title: 'Quick Questions',
                description: 'Answer yes or no',
                questions: yesNoQuestions,
                icon: '✅'
            })
        }
        
        if (multipleChoiceQuestions.length > 0) {
            steps.push({
                number: steps.length + 1,
                type: 2,
                title: 'Preferences',
                description: 'Choose your options',
                questions: multipleChoiceQuestions,
                icon: '🎯'
            })
        }

        return steps
    }

    const steps = getStepInfo()
    const currentStepData = steps.find(step => step.number === currentStep)
    const totalSteps = steps.length

    const handleNext = () => {
        if (currentStep < totalSteps) {
            setCurrentStep(currentStep + 1)
        }
    }

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1)
        }
    }

    const isStepComplete = (step: any) => {
        return step.questions.every((question: Question, index: number) => {
            const questionIndex = onboardingData?.questions.findIndex(q => q === question)
            return questionIndex !== undefined && questionIndex !== -1 && questionIndex >= 0 && answers[questionIndex]
        })
    }

    const isCurrentStepComplete = () => {
        if (!currentStepData) return false
        return isStepComplete(currentStepData)
    }

    const handleStepSubmit = () => {
        if (currentStep < totalSteps) {
            handleNext()
        } else {
            handleSubmit()
        }
    }

    const handleSubmit = () => {
        if (!onboardingData || !onboardingData.questions) return

        // Check if all questions are answered
        const unansweredQuestions = onboardingData.questions.filter((_, index) => !answers[index]?.trim())
        
        if (unansweredQuestions.length > 0) {
            setError(`Please answer all questions. ${unansweredQuestions.length} question(s) remaining.`)
            return
        }

        // Convert answers to the expected format
        const formattedAnswers: Answer[] = onboardingData.questions.map((question, index) => ({
            question: question.question,
            answer: answers[index]
        }))

        submitOnboarding(formattedAnswers)
    }

    const submitOnboarding = async (finalAnswers: Answer[]) => {
        try {
            setSubmitting(true)
            setError(null)

            const payload = {
                answers: finalAnswers,
                completed: true
            }

            const response = await updateAvatarOnboardingApiRequest(avatarId || '', payload)
            
            if (response?.data?.success) {
                // Redirect to video consultation
                router.push(`/video-consultation/${avatarId}`)
            } else {
                setError('Failed to submit onboarding. Please try again.')
            }
        } catch (err) {
            console.error('Error submitting onboarding:', err)
            setError('Failed to submit onboarding. Please try again.')
        } finally {
            setSubmitting(false)
        }
    }

    const renderQuestionInput = (question: Question, questionIndex: number) => {
        const currentAnswer = answers[questionIndex] || ''

        switch (question.type) {
            case 1: // Text Input
                return (
                    <div className="relative">
                        <textarea
                            value={currentAnswer}
                            onChange={(e) => handleAnswerChange(questionIndex, e.target.value)}
                            placeholder="Share your thoughts here..."
                            className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all duration-200 placeholder:text-gray-400 text-gray-700 bg-gray-50 hover:bg-white focus:bg-white"
                            rows={4}
                        />
                        <div className="absolute bottom-3 right-3 text-xs text-gray-400 bg-white px-2 py-1 rounded">
                            {currentAnswer.length}/500
                        </div>
                    </div>
                )

            case 2: // Multiple Choice
                return (
                    <div className="space-y-3">
                        {question.options?.map((option, index) => (
                            <label
                                key={index}
                                className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md ${
                                    currentAnswer === option
                                        ? 'border-blue-500 bg-blue-50 shadow-md'
                                        : 'border-gray-200 hover:border-gray-300 bg-gray-50 hover:bg-white'
                                }`}
                            >
                                <div className="relative">
                                    <input
                                        type="radio"
                                        name={`question-${questionIndex}`}
                                        value={option}
                                        checked={currentAnswer === option}
                                        onChange={(e) => handleAnswerChange(questionIndex, e.target.value)}
                                        className="sr-only"
                                    />
                                    <div className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center transition-all duration-200 ${
                                        currentAnswer === option
                                            ? 'border-blue-500 bg-blue-500'
                                            : 'border-gray-300 group-hover:border-gray-400'
                                    }`}>
                                        {currentAnswer === option && (
                                            <div className="w-2 h-2 bg-white rounded-full"></div>
                                        )}
                                    </div>
                                </div>
                                <span className={`text-gray-700 font-medium transition-colors duration-200 ${
                                    currentAnswer === option ? 'text-blue-700' : ''
                                }`}>
                                    {option}
                                </span>
                            </label>
                        ))}
                    </div>
                )

            case 3: // Yes/No
                return (
                    <div className="grid grid-cols-2 gap-4">
                        {['Yes', 'No'].map((option) => (
                            <label
                                key={option}
                                className={`flex items-center justify-center p-6 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md ${
                                    currentAnswer === option
                                        ? 'border-blue-500 bg-blue-50 shadow-md'
                                        : 'border-gray-200 hover:border-gray-300 bg-gray-50 hover:bg-white'
                                }`}
                            >
                                <div className="text-center">
                                    <input
                                        type="radio"
                                        name={`question-${questionIndex}`}
                                        value={option}
                                        checked={currentAnswer === option}
                                        onChange={(e) => handleAnswerChange(questionIndex, e.target.value)}
                                        className="sr-only"
                                    />
                                    <div className={`w-8 h-8 rounded-full border-2 mx-auto mb-3 flex items-center justify-center transition-all duration-200 ${
                                        currentAnswer === option
                                            ? 'border-blue-500 bg-blue-500'
                                            : 'border-gray-300 group-hover:border-gray-400'
                                    }`}>
                                        {currentAnswer === option && (
                                            <CheckCircle className="w-5 h-5 text-white" />
                                        )}
                                    </div>
                                    <span className={`text-lg font-semibold transition-colors duration-200 ${
                                        currentAnswer === option ? 'text-blue-700' : 'text-gray-700'
                                    }`}>
                                        {option}
                                    </span>
                                </div>
                            </label>
                        ))}
                    </div>
                )

            default:
                return (
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <span className="text-gray-500">Unknown question type</span>
                    </div>
                )
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-6 shadow-lg">
                        <User className="h-8 w-8 text-white" />
                    </div>
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Your Profile Setup</h2>
                    <p className="text-lg text-gray-600">Preparing personalized questions for you...</p>
                </div>
            </div>
        )
    }

    if (error && !onboardingData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-2xl mb-6 shadow-lg">
                        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Failed to Load Questions</h2>
                    <p className="text-lg text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={fetchAvatarOnboarding}
                        className="px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold text-lg hover:bg-blue-700 transition-all duration-200 hover:shadow-lg"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        )
    }

    if (!onboardingData || !onboardingData.questions || onboardingData.questions.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-2xl mb-6 shadow-lg">
                        <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">No Questions Available</h2>
                    <p className="text-lg text-gray-600 mb-6">There are no onboarding questions to complete at the moment.</p>
                    <button
                        onClick={() => router.push(`/video-consultation/${avatarId}`)}
                        className="px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold text-lg hover:bg-blue-700 transition-all duration-200 hover:shadow-lg"
                    >
                        Continue to Video Consultation
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="max-w-4xl mx-auto px-4 py-12">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                        Avatar Onboarding
                    </h1>
                    <p className="text-gray-600">
                        Complete your profile in {totalSteps} step{totalSteps !== 1 ? 's' : ''}
                    </p>
                </div>

                {/* Step Progress */}
                <div className="mb-8">
                    <div className="flex items-center justify-center space-x-2">
                        {steps.map((step, index) => (
                            <div key={step.number} className="flex items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 ${
                                    currentStep > step.number
                                        ? 'bg-green-500 text-white'
                                        : currentStep === step.number
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200 text-gray-500'
                                }`}>
                                    {currentStep > step.number ? (
                                        <CheckCircle className="h-4 w-4" />
                                    ) : (
                                        step.number
                                    )}
                                </div>
                                {index < steps.length - 1 && (
                                    <div className={`w-6 h-0.5 mx-2 ${
                                        currentStep > step.number ? 'bg-green-500' : 'bg-gray-200'
                                    }`}></div>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="text-center mt-3">
                        <span className="text-sm text-gray-600">
                            Step {currentStep} of {totalSteps}
                        </span>
                    </div>
                </div>

                {/* Current Step Content */}
                {currentStepData && (
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                            <div className="flex items-center space-x-3">
                                <span className="text-lg">{currentStepData.icon}</span>
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900">
                                        {currentStepData.title}
                                    </h2>
                                    <p className="text-sm text-gray-600 mt-1">
                                        {currentStepData.description} • {currentStepData.questions.length} question{currentStepData.questions.length !== 1 ? 's' : ''}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="p-8">
                            <div className="space-y-6">
                                {currentStepData.questions.map((question, index) => {
                                    const questionIndex = onboardingData?.questions.findIndex(q => q === question) || 0
                                    return (
                                        <div key={questionIndex} className="border-b border-gray-100 pb-6 last:border-b-0 last:pb-0">
                                            <div className="flex items-start space-x-4">
                                                <div className="flex-shrink-0">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                                                        answers[questionIndex] 
                                                            ? 'bg-green-100 text-green-700 border-2 border-green-300' 
                                                            : 'bg-gray-100 text-gray-600 border-2 border-gray-200'
                                                    }`}>
                                                        {answers[questionIndex] ? (
                                                            <CheckCircle className="h-4 w-4" />
                                                        ) : (
                                                            index + 1
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                                                        {question.question}
                                                    </h3>
                                                    <div>
                                                        {renderQuestionInput(question, questionIndex)}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            {error && (
                                <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-lg">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm text-red-700 font-medium">{error}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Navigation Buttons */}
                            <div className="mt-10 flex justify-between">
                                <button
                                    type="button"
                                    onClick={handlePrevious}
                                    disabled={currentStep === 1}
                                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2"
                                >
                                    <ArrowRight className="h-4 w-4 rotate-180" />
                                    <span>Previous</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={handleStepSubmit}
                                    disabled={!isCurrentStepComplete() || submitting}
                                    className="px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-lg flex items-center space-x-2"
                                >
                                    {submitting ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            <span>Submitting...</span>
                                        </>
                                    ) : currentStep === totalSteps ? (
                                        <>
                                            <span>Complete Profile</span>
                                            <CheckCircle className="h-4 w-4" />
                                        </>
                                    ) : (
                                        <>
                                            <span>Next Step</span>
                                            <ArrowRight className="h-4 w-4" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AvatarOnboardingPage