'use client'
export const runtime = 'edge';
import React, { useEffect, useState } from 'react'
import { 
    Video, 
    Clock, 
    Star, 
    MessageCircle, 
    Heart, 
    Brain, 
    Baby, 
    Eye,
    Stethoscope,
    Bone,
    Activity,
    User,
    Calendar,
    MapPin,
    Bot,
    Sparkles
} from 'lucide-react'
import { avatarListApiRequest, avatarOnboardingApiRequest } from '@/networks/api'
import { useRouter } from 'next/navigation'

interface AIAvatar {
    id: string
    name: string
    specialty: string
    diseaseFocus: string[]
    avatarImage: string
    personality: string
    expertise: string
    consultationTypes: string[]
    availability: string
    description: string
    aiTraining: string
    // Additional fields from API
    uuid?: string
    _id?: string
    avatar_id?: string
    status?: number
    url?: string
    questions?: any[]
}

const VideoConsultationPage = () => {
    const [selectedSpecialty, setSelectedSpecialty] = useState('all')
    const [selectedAvatar, setSelectedAvatar] = useState<AIAvatar | null>(null)
    const [showDetails, setShowDetails] = useState(false)
    const [avatarList, setAvatarList] = useState<AIAvatar[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const specialties = [
        { id: 'all', name: 'All Conditions', icon: Activity, color: 'bg-blue-500' },
        { id: 'anxiety', name: 'Anxiety & Stress', icon: Brain, color: 'bg-purple-500' },
        { id: 'depression', name: 'Depression & Mood', icon: Heart, color: 'bg-blue-500' },
        { id: 'trauma', name: 'Trauma & PTSD', icon: Brain, color: 'bg-red-500' },
        { id: 'relationships', name: 'Relationships', icon: User, color: 'bg-pink-500' },
        { id: 'addiction', name: 'Addiction & Recovery', icon: Activity, color: 'bg-orange-500' },
        { id: 'sleep', name: 'Sleep Disorders', icon: Brain, color: 'bg-indigo-500' }
    ]

    // Default avatar data structure
    const defaultAvatarData: AIAvatar[] = [
        {
            id: 'dr-marie',
            name: 'Dr. Marie Claire Bourque',
            specialty: 'Psychiatrist',
            diseaseFocus: ['Anxiety Disorders', 'Depression', 'Stress Management', 'Cognitive Behavioral Therapy'],
            avatarImage: '/api/placeholder/150/150',
            personality: 'Compassionate and empathetic',
            expertise: 'Mental health assessment and therapeutic interventions',
            consultationTypes: ['Anxiety Assessment', 'Depression Screening', 'Stress Management', 'CBT Sessions'],
            availability: 'Available 24/7',
            description: 'AI-powered clinical psychologist specializing in anxiety, depression, and stress-related disorders. Provides evidence-based therapeutic approaches and mental health support.',
            aiTraining: 'Trained on 50,000+ psychological cases and latest therapeutic techniques'
        }
    ]

    const filteredAvatars = selectedSpecialty === 'all' 
        ? avatarList 
        : avatarList.filter(avatar => {
           
            return true
        })

    const handleAvatarSelect = (avatar: AIAvatar) => {
        setSelectedAvatar(avatar)
        setShowDetails(true)
    }

    const handleStartConsultation = () => {
        if (selectedAvatar) {
            // TODO: Implement AI consultation start logic
            console.log('Starting AI consultation with:', selectedAvatar.name)
        }
    }

    const getAvatarList = async () => {
        try {
            setLoading(true)
            const response = await avatarListApiRequest()
            console.log('Avatar list response:', response?.data?.data)
            
            if (response?.data?.data && Array.isArray(response.data.data)) {
                // Transform API data to match our interface
                const transformedAvatars: AIAvatar[] = response.data.data.map((avatar: any, index: number) => ({
                    id: avatar.avatar_id || `avatar-${index}`,
                    name: avatar.name || `Dr. ${avatar.name || 'AI Specialist'}`,
                    specialty: 'AI Psychiatrist', // Default specialty
                    diseaseFocus: ['Mental Health', 'Emotional Support', 'Stress Management', 'Wellness'],
                    avatarImage: avatar.thumbnailUrl || '/api/placeholder/150/150',
                    personality: 'Compassionate and empathetic',
                    expertise: 'AI-powered mental health assessment and therapeutic interventions',
                    consultationTypes: ['General Consultation', 'Mental Health Assessment', 'Emotional Support', 'Wellness Guidance'],
                    availability: 'Available 24/7',
                    description: `AI-powered specialist ${avatar.name} providing mental health support and therapeutic guidance.`,
                    aiTraining: 'Trained on comprehensive mental health cases and therapeutic techniques',
                    // Additional fields from API
                    uuid: avatar.uuid,
                    _id: avatar._id,
                    avatar_id: avatar.avatar_id,
                    status: avatar.status,
                    url: avatar.url,
                    questions: avatar.questions
                }))
                
                setAvatarList(transformedAvatars)
            } else {
                // Fallback to default data if API doesn't return expected format
                setAvatarList(defaultAvatarData)
            }
        } catch (error) {
            console.error('Error fetching avatar list:', error)
            // Fallback to default data on error
            setAvatarList(defaultAvatarData)
        } finally {
            setLoading(false)
        }
    }

    const handleRedirectPage = async (avatarId: string) => {

        try{
            const response = await avatarOnboardingApiRequest(avatarId)
            if (response?.data?.success === false) {
                console.log('Avatar onboarding response:', response?.data?.success)
                router.push(`/video-consultation/onboarding?avatar_id=${avatarId}`)
                // router.push(`/video-consultation/onboarding?avatar_id=${avatarId}`)
            }
            else{
                router.push(`/video-consultation/${avatarId}`)
            }
        }
         catch (error:any) {
            console.error('Error redirecting page:', error)
        }
        // router.push(`/video-consultation/onboarding?avatar_id=${avatarId}`)
    }

    useEffect(() => {
        getAvatarList()
    }, [])

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
              <div className="bg-white border-b border-gray-300 px-6 py-4">
                  <div className="max-w-7xl mx-auto">
                      <h1 className="text-2xl font-bold text-black">AI Consultation</h1>
                      {/* <p className="text-gray-600">Choose your AI psychologist for specialized mental health consultation</p> */}
                  </div>
              </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Specialty Filter */}
                {/* <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-8">
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">Select Mental Health Focus</h2>
                    <div className="flex flex-wrap gap-3">
                        {specialties.map((specialty) => {
                            const Icon = specialty.icon
                            return (
                                <button
                                    key={specialty.id}
                                    onClick={() => setSelectedSpecialty(specialty.id)}
                                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all duration-200 ${
                                        selectedSpecialty === specialty.id
                                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                    }`}
                                >
                                    <div className={`w-3 h-3 rounded-full ${specialty.color}`}></div>
                                    <span className="text-sm text-black font-medium">{specialty.name}</span>
                                </button>
                            )
                        })}
                    </div>
                </div> */}

                {/* AI Avatar Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((index) => (
                            <div key={index} className="bg-white rounded-xl border border-gray-200 flex flex-col h-[500px] animate-pulse">
                                <div className="p-6 border-b border-gray-200">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                                            <div>
                                                <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                                                <div className="h-3 bg-gray-200 rounded w-24"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="h-3 bg-gray-200 rounded w-20 mb-3"></div>
                                    <div className="space-y-2">
                                        <div className="h-2 bg-gray-200 rounded w-16"></div>
                                        <div className="flex gap-1">
                                            <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                                            <div className="h-6 bg-gray-200 rounded-full w-24"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 flex-1">
                                    <div className="h-4 bg-gray-200 rounded w-40 mb-3"></div>
                                    <div className="space-y-2 mb-4">
                                        <div className="h-3 bg-gray-200 rounded w-32"></div>
                                        <div className="h-3 bg-gray-200 rounded w-36"></div>
                                        <div className="h-3 bg-gray-200 rounded w-28"></div>
                                    </div>
                                    <div className="h-10 bg-gray-200 rounded w-full"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredAvatars.map((avatar) => (
                        <div
                            key={avatar.id}
                            className="bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-200  group flex flex-col h-[500px]"
                            onClick={() => handleAvatarSelect(avatar)}
                        >
                            {/* Avatar Header */}
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-16 h-16 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center relative">
                                            <Bot className="h-8 w-8 text-black" />
                                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-black">{avatar.name}</h3>
                                            <p className="text-sm text-gray-600">{avatar.specialty}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <Sparkles className="h-4 w-4 text-black" />
                                        <span className="text-xs text-black font-medium">AI</span>
                                    </div>
                                </div>
                                
                                <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                                    <span className="text-green-600 font-medium">{avatar.availability}</span>
                                </div>
                                
                                <div className="mb-3">
                                    <p className="text-sm text-gray-600 mb-2">Specialized in:</p>
                                    <div className="flex flex-wrap gap-1">
                                        {avatar.diseaseFocus.slice(0, 2).map((disease, index) => (
                                            <span
                                                key={index}
                                                className="px-2 py-1 bg-gray-100 text-black text-xs rounded-full border border-gray-300"
                                            >
                                                {disease}
                                            </span>
                                        ))}
                                        {avatar.diseaseFocus.length > 2 && (
                                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full border border-gray-300">
                                                +{avatar.diseaseFocus.length - 2} more
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Consultation Types */}
                            <div className="p-6 flex-1 flex flex-col">
                                <h4 className="text-sm font-medium text-black mb-3">Available Consultations:</h4>
                                <div className="space-y-2 mb-4 flex-1">
                                    {avatar.consultationTypes.slice(0, 3).map((type, index) => (
                                        <div key={index} className="flex items-center text-sm text-gray-600">
                                            <div className="w-2 h-2 bg-black rounded-full mr-2"></div>
                                            {type}
                                        </div>
                                    ))}
                                </div>
                                
                                <div className="mt-auto">
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handleRedirectPage(avatar?.uuid || '')
                                           
                                            // const avatarId = avatar.avatar_id || avatar.id
                                            // router.push(`/video-consultation/${avatar.id}?avatar_id=${avatarId}`)
                                        }}
                                        className=" group flex items-center text-sm  font-medium rounded-full w-full justify-center py-4 cursor-pointer transition-all duration-300 ease-in-out
                                        transform hover:scale-105 hover:shadow-md bg-blue-50 text-blue-700 border-r-2 border-blue-600 shadow-sm"
                                    >
                                        Start Consultation
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                )}

                {/* No Results */}
                {!loading && filteredAvatars.length === 0 && (
                    <div className="text-center py-12">
                        <Bot className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-black mb-2">No AI available</h3>
                        <p className="text-gray-600">Try selecting a different mental health focus or check back later.</p>
                    </div>
                )}
            </div>

        </div>
    )
}

export default VideoConsultationPage
