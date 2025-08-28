'use client'
export const runtime = 'edge';

import React, { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, CheckCircle, User, Brain, FileText } from 'lucide-react'
import PersonalInfoStep from '@/components/onboarding/PersonalInfoStep'
import MentalHealthAssessmentStep from '@/components/onboarding/MentalHealthAssessmentStep'
import MedicalHistoryStep from '@/components/onboarding/MedicalHistoryStep'
import OnboardingSidebar from '@/components/onboarding/OnboardingSidebar'
import type { OnboardingStep } from '@/components/onboarding/OnboardingSidebar'
import ReviewStep from '@/components/onboarding/ReviewStep'
import { getOnboardingApiRequest, onboardingCreateApiRequest, onboardingUpdateApiRequest } from '@/networks/api'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { calculateDateOfBirthFromAge } from '../../../../_utils/general'
import { toast } from 'react-toastify'

export interface OnboardingData {
    // Basic Information
    name: string
    age: number
    gender: string
    dateOfBirth: string

    // Health & Symptoms
    medicationSideEffects: string
    organizationDifficulty: string
    memoryIssues: string
    sleepQuality: string
    substanceUse: string
    otherConditions: string
    moodPatterns: string
    losingItems: string

    // Medical History
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

const OnboardingPage = () => {
    const router = useRouter()
    const userProfile = useSelector((state: any) => state.user.userProfile)
   
    const [currentStep, setCurrentStep] = useState(1)
    const [isLoading, setIsLoading] = useState(false)
    const [onboardingId, setOnboardingId] = useState(userProfile?.onbording_uuid || '')
    const [onboardingData, setOnboardingData] = useState<OnboardingData>({
        name: "",
        age: 0,
        gender: 'male',
        dateOfBirth: '',
        medicationSideEffects: '',
        organizationDifficulty: '',
        memoryIssues: '',
        sleepQuality: '',
        substanceUse: '',
        otherConditions: '',
        moodPatterns: '',
        losingItems: '',
        none: false,
        sleepDisorders: false,
        asthma: false,
        anxiety: false,
        depression: false,
        personalityDisorders: false,
        hypertension: false,
        hasOtherMedicalConditions: false,
        otherMedicalConditions: ''
    })

    const totalSteps = 4

    const steps: OnboardingStep[] = [
        {
            id: 1,
            title: 'Basic Information',
            description: 'Your personal details',
            icon: <User className="h-5 w-5" />,
            status: 'pending'
        },
        {
            id: 2,
            title: 'Health & Symptoms',
            description: 'Your health background and symptoms',
            icon: <Brain className="h-5 w-5" />,
            status: 'pending'
        },
        {
            id: 3,
            title: 'Medical History',
            description: 'Your medical conditions',
            icon: <FileText className="h-5 w-5" />,
            status: 'pending'
        },
        {
            id: 4,
            title: 'Review & Complete',
            description: 'Review your information',
            icon: <CheckCircle className="h-5 w-5" />,
            status: 'pending'
        }
    ]

    const updateOnboardingData = (data: Partial<OnboardingData>) => {
        setOnboardingData(prev => ({ ...prev, ...data }))
    }

    const nextStep = async () => {
        if (currentStep < totalSteps) {
            setIsLoading(true)
            try {

                let payload = {}

                if (currentStep === 1) {
                    payload = {
                        name: onboardingData.name,
                        age: onboardingData.age,
                        gender: onboardingData.gender,
                        date_of_birth: onboardingData.dateOfBirth
                    }
                }
                else if (currentStep === 2) {
                    payload = {
                        side_effects_of_medicines: onboardingData.medicationSideEffects,
                        difficulty_organizing: onboardingData.organizationDifficulty,
                        memory_issues: onboardingData.memoryIssues,
                        sleep_quality: onboardingData.sleepQuality,
                        substance_use: onboardingData.substanceUse,
                        other_medical_conditions: onboardingData.otherConditions,
                        mood_on_most_days: onboardingData.moodPatterns,
                        lose_essential_items: onboardingData.losingItems,

                    }
                }
                else if (currentStep === 3) {
                    const checkedConditions = []

                    if (onboardingData.none) {
                        checkedConditions.push("None")
                    } else {
                        if (onboardingData.sleepDisorders) checkedConditions.push("Sleep Disorders")
                        if (onboardingData.asthma) checkedConditions.push("Asthma")
                        if (onboardingData.anxiety) checkedConditions.push("Anxiety Disorders")
                        if (onboardingData.depression) checkedConditions.push("Depression")
                        if (onboardingData.personalityDisorders) checkedConditions.push("Personality Disorders")
                        if (onboardingData.hypertension) checkedConditions.push("Hypertension")
                        if (onboardingData.hasOtherMedicalConditions && onboardingData.otherMedicalConditions.trim()) {
                            checkedConditions.push(onboardingData.otherMedicalConditions)
                        }
                    }

                    payload = {
                        history_of_medical: checkedConditions
                    }
                }
                let response
                if (currentStep === 1 && !onboardingId) {
                    response = await onboardingCreateApiRequest(payload)
                    setOnboardingId(response?.data?.data?.uuid)
                    console.log("response ----", response)
                } else {
                    response = await onboardingUpdateApiRequest(onboardingId, payload)
                }

                if (response) {
                    setCurrentStep(currentStep + 1)
                }
            } catch (error) {
                console.error(`Error saving step ${currentStep} data:`, error)
                setCurrentStep(currentStep + 1)
            } finally {
                setIsLoading(false)
            }
        }
    }

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1)
        }
    }

    const goToStep = (stepNumber: number) => {
        if (stepNumber <= currentStep || isStepValid(stepNumber - 1)) {
            setCurrentStep(stepNumber)
        }
    }

    const handleSubmit = async () => {
        setIsLoading(true)
        try {
            // Create the final payload with all data properly formatted
            const finalPayload = {
                name: onboardingData.name,
                age: onboardingData.age,
                gender: onboardingData.gender,
                date_of_birth: onboardingData.dateOfBirth,
                side_effects_of_medicines: onboardingData.medicationSideEffects,
                difficulty_organizing: onboardingData.organizationDifficulty,
                memory_issues: onboardingData.memoryIssues,
                sleep_quality: onboardingData.sleepQuality,
                substance_use: onboardingData.substanceUse,
                other_medical_conditions: onboardingData.otherConditions,
                mood_on_most_days: onboardingData.moodPatterns,
                lose_essential_items: onboardingData.losingItems,
                history_of_medical: (() => {
                    const checkedConditions = []
                    if (onboardingData.none) {
                        checkedConditions.push("None")
                    } else {
                        if (onboardingData.sleepDisorders) checkedConditions.push("Sleep Disorders")
                        if (onboardingData.asthma) checkedConditions.push("Asthma")
                        if (onboardingData.anxiety) checkedConditions.push("Anxiety Disorders")
                        if (onboardingData.depression) checkedConditions.push("Depression")
                        if (onboardingData.personalityDisorders) checkedConditions.push("Personality Disorders")
                        if (onboardingData.hypertension) checkedConditions.push("Hypertension")
                        if (onboardingData.hasOtherMedicalConditions && onboardingData.otherMedicalConditions.trim()) {
                            checkedConditions.push(onboardingData.otherMedicalConditions)
                        }
                    }
                    return checkedConditions
                })()
            }

            const response = await onboardingUpdateApiRequest(onboardingId, finalPayload)
            console.log("response", response)
            if (response) {
                if (response?.data?.message === "Onboarding updated successfully" && response?.data?.data?.uuid) {
                    toast.success('Your onboarding is completed successfully!')
                    // Redirect to home page after a short delay to show the toast
                    setTimeout(() => {
                        router.push('/')
                    }, 1500)
                } else {
                    toast.error('Failed to complete onboarding. Please try again.')
                }
            } else {
                toast.error('Failed to complete onboarding. Please try again.')
            }
        } catch (error) {
            console.error('Error completing onboarding:', error)
            toast.error('An error occurred while completing onboarding. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <PersonalInfoStep
                        data={onboardingData}
                        updateData={updateOnboardingData}
                    />
                )
            case 2:
                return (
                    <MentalHealthAssessmentStep
                        data={onboardingData}
                        updateData={updateOnboardingData}
                    />
                )
            case 3:
                return (
                    <MedicalHistoryStep
                        data={onboardingData}
                        updateData={updateOnboardingData}
                    />
                )
            case 4:
                return (
                    <ReviewStep
                        data={onboardingData}
                        updateData={updateOnboardingData}
                    />
                )
            default:
                return null
        }
    }

    const isStepValid = (step: number): boolean => {
        switch (step) {
            case 1:
                return !!(onboardingData.name && onboardingData.age > 0 && onboardingData.gender && onboardingData.dateOfBirth)
            case 2:
                return !!(onboardingData.medicationSideEffects && onboardingData.organizationDifficulty && onboardingData.memoryIssues && onboardingData.sleepQuality && onboardingData.substanceUse && onboardingData.otherConditions && onboardingData.moodPatterns && onboardingData.losingItems)
            case 3:
                // Medical history requires at least one condition to be selected
                return onboardingData.none || 
                       onboardingData.sleepDisorders || 
                       onboardingData.asthma || 
                       onboardingData.anxiety || 
                       onboardingData.depression || 
                       onboardingData.personalityDisorders || 
                       onboardingData.hypertension || 
                       (onboardingData.hasOtherMedicalConditions && onboardingData.otherMedicalConditions.trim().length > 0)
            case 4:
                return true // Review step is always valid
            default:
                return false
        }
    }

    useEffect(() => {
        if(userProfile?.is_onbording_completed){
            router.push('/')
        }
        if (userProfile?.onbording_uuid) {
            const fetchOnboarding = async () => {
                console.log("userProfile?.uuid", userProfile?.onbording_uuid)
                setOnboardingId(userProfile?.onbording_uuid)
                const response: any = await getOnboardingApiRequest(userProfile?.onbording_uuid)
                if (response) {
                    console.log("response", response?.data?.data)


                    // Handle DOB from response - use existing DOB or calculate from age
                    let responseDateOfBirth = response?.data?.data?.date_of_birth || '';
                    if (!responseDateOfBirth && response?.data?.data?.age) {
                        responseDateOfBirth = calculateDateOfBirthFromAge(response.data.data.age);
                    }

                    setOnboardingData({
                        name: response?.data?.data?.name,
                        age: response?.data?.data?.age,
                        gender: response?.data?.data?.gender || '',
                        dateOfBirth: responseDateOfBirth,
                        medicationSideEffects: response?.data?.data?.side_effects_of_medicines,
                        organizationDifficulty: response?.data?.data?.difficulty_organizing,
                        memoryIssues: response?.data?.data?.memory_issues,
                        sleepQuality: response?.data?.data?.sleep_quality,
                        substanceUse: response?.data?.data?.substance_use,
                        otherConditions: response?.data?.data?.other_medical_conditions,
                        moodPatterns: response?.data?.data?.mood_on_most_days,
                        losingItems: response?.data?.data?.lose_essential_items,
                        none: response?.data?.data?.history_of_medical?.includes("None") || false,
                        sleepDisorders: response?.data?.data?.history_of_medical?.includes("Sleep Disorders") || false,
                        asthma: response?.data?.data?.history_of_medical?.includes("Asthma") || false,
                        anxiety: response?.data?.data?.history_of_medical?.includes("Anxiety Disorders") || false,
                        depression: response?.data?.data?.history_of_medical?.includes("Depression") || false,
                        personalityDisorders: response?.data?.data?.history_of_medical?.includes("Personality Disorders") || false,
                        hypertension: response?.data?.data?.history_of_medical?.includes("Hypertension") || false,
                        otherMedicalConditions: response?.data?.data?.history_of_medical?.find((condition: string) => 
                            condition !== "None" &&
                            condition !== "Sleep Disorders" && 
                            condition !== "Asthma" && 
                            condition !== "Anxiety Disorders" && 
                            condition !== "Depression" && 
                            condition !== "Personality Disorders" && 
                            condition !== "Hypertension"
                        ) || "",
                        hasOtherMedicalConditions: (() => {
                            const otherCondition = response?.data?.data?.history_of_medical?.find((condition: string) => 
                                condition !== "None" &&
                                condition !== "Sleep Disorders" && 
                                condition !== "Asthma" && 
                                condition !== "Anxiety Disorders" && 
                                condition !== "Depression" && 
                                condition !== "Personality Disorders" && 
                                condition !== "Hypertension"
                            )
                            return otherCondition ? otherCondition.trim().length > 0 : false
                        })()
                    })
                }
            }
            fetchOnboarding()
        }
    }, [userProfile?.onbording_uuid
    ])
    useEffect(() => {
        if (!userProfile?.onbording_uuid) {
            // Calculate DOB from age if date_of_birth is not available
            let calculatedDateOfBirth = userProfile?.date_of_birth || '';
            if (!calculatedDateOfBirth && userProfile?.age) {
                calculatedDateOfBirth = calculateDateOfBirthFromAge(userProfile.age);
            }

            setOnboardingData({
                name: userProfile?.firstName + ' ' + userProfile?.lastName,
                age: userProfile?.age || 0,
                gender: userProfile?.gender || 'male',
                dateOfBirth: calculatedDateOfBirth,
                medicationSideEffects: '',
                organizationDifficulty: '',
                memoryIssues: '',
                sleepQuality: '',
                substanceUse: '',
                otherConditions: '',
                moodPatterns: '',
                losingItems: '',
                none: false,
                sleepDisorders: false,
                asthma: false,
                anxiety: false,
                depression: false,
                personalityDisorders: false,
                hypertension: false,
                hasOtherMedicalConditions: false,
                otherMedicalConditions: ''
            })
        }
    }, [userProfile?.onbording_uuid])


    return (
        <div className="h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50">
            {/* Header */}
            <div className="bg-white border-b flex justify-between items-center border-gray-200 px-6 py-4">
                <div className="">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Dr. MCB</h1>
                    <p className="text-gray-600">Let's get to know you better to provide personalized care</p>
                </div>
                <div className="flex items-center gap-4 ">
                    <button
                        onClick={prevStep}
                        disabled={currentStep === 1}
                        className={`px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center ${currentStep === 1
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        <ChevronLeft className="h-4 w-4 mr-2" />
                        Previous
                    </button>

                    <div className="flex items-center space-x-3">
                        {currentStep < totalSteps ? (
                            <button
                                onClick={nextStep}
                                disabled={!isStepValid(currentStep) || isLoading}
                                className={`px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center ${isStepValid(currentStep) && !isLoading
                                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                {isLoading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        Next
                                        <ChevronRight className="h-4 w-4 ml-2" />
                                    </>
                                )}
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                disabled={isLoading}
                                className={`px-8 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center ${isLoading
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-green-600 text-white hover:bg-green-700'
                                    }`}
                            >
                                {isLoading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Completing...
                                    </>
                                ) : (
                                    <>
                                        Complete Onboarding
                                        <CheckCircle className="h-4 w-4 ml-2" />
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex">
                {/* Sidebar Component */}
                <OnboardingSidebar
                    steps={steps}
                    currentStep={currentStep}
                    totalSteps={totalSteps}
                    onStepClick={goToStep}
                    isStepValid={isStepValid}
                />

                {/* Main Content */}
                <div className="pb-20 overflow-y-auto w-full h-screen">
                    {/* Step Content */}
                    <div className='px-8 py-8'>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                            {renderStep()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OnboardingPage