'use client'
export const runtime = 'edge';
import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { 
    ArrowLeft, 
    Calendar, 
    Clock, 
    FileText, 
    User, 
    Bot, 
    Play, 
    Pause,
    Volume2,
    VolumeX,
    Download,
    Share2,
    MessageSquare,
    Heart,
    Brain,
    Activity,
    ChevronLeft
} from 'lucide-react'
import { getConversationByIdApiRequest } from '@/networks/api';

interface Conversation {
    uuid: string
    title: string
    prompt: string
    opening: string
    history: Array<{
        content: string
        role: string
    }>
    onbording_data: {
        name: string
        age: number
        gender: string
        mood_on_most_days: string
        memory_issues: string
        difficulty_organizing: string
        sleep_quality: string
        substance_use: string
        other_medical_conditions: string
        history_of_medical: string[]
        side_effects_of_medicines: string
        lose_essential_items: string
        date_of_birth: string
    }
    summary?: string
    knowledgeBase_id: string
    user_uuid: string
    chunks: any[]
}

interface ChatSession {
    id: string
    folder: string
    date: string
    duration: string
    doctor: string
    specialty: string
    summary: string
    chatCount: number
    lastMessage: string
    status: string
    tags: string[]
    chat: Array<{
        id: number
        sender: string
        message: string
        timestamp: string
        avatar: string
    }>
}

const ChatSessionPage = () => {
    const params = useParams()
    const router = useRouter()
    const [session, setSession] = useState<ChatSession | null>(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [isMuted, setIsMuted] = useState(false)
    const [loading, setLoading] = useState(true)

    const transformConversationToSession = (conversation: Conversation): ChatSession => {
        // Extract tags from conversation content and patient data
        const tags = extractTagsFromConversation(conversation)
        
        // Generate estimated date (you might want to add actual date field to your API)
        const date = new Date().toISOString().split('T')[0]
        
        // Transform history to chat format
        const chat = conversation.history.map((msg, index) => ({
            id: index + 1,
            sender: msg.role === 'user' ? 'user' : 'ai',
            message: msg.content,
            timestamp: `${10 + Math.floor(index / 2)}:${(index % 2) * 10 + index % 10} AM`,
            avatar: msg.role === 'user' ? '/user-avatar.jpg' : '/dr-avatar.jpg'
        }))

        return {
            id: conversation.uuid,
            folder: conversation.title || 'General Consultation',
            date: date,
            duration: `${conversation.history.length * 2} min`,
            doctor: `Dr. ${conversation.onbording_data?.name || 'AI Specialist'}`,
            specialty: 'AI Psychiatrist',
            summary: generateSummaryFromConversation(conversation),
            chatCount: conversation.history.length,
            lastMessage: conversation.history.length > 0 ? conversation.history[conversation.history.length - 1].content : 'No messages',
            status: 'completed',
            tags: tags,
            chat: chat
        }
    }

    const extractTagsFromConversation = (conversation: Conversation): string[] => {
        const tags: string[] = []
        const content = conversation.history.map(msg => msg.content).join(' ').toLowerCase()
        
        // Extract tags based on content
        if (content.includes('adhd') || content.includes('focus') || content.includes('attention')) tags.push('ADHD')
        if (content.includes('anxiety') || content.includes('stress')) tags.push('anxiety')
        if (content.includes('depression') || content.includes('mood')) tags.push('depression')
        if (content.includes('sleep') || content.includes('insomnia')) tags.push('sleep')
        if (content.includes('trauma') || content.includes('ptsd')) tags.push('trauma')
        if (content.includes('relationship') || content.includes('family')) tags.push('relationships')
        if (content.includes('addiction') || content.includes('substance')) tags.push('addiction')
        
        // Add patient info tags
        if (conversation.onbording_data) {
            if (conversation.onbording_data.mood_on_most_days?.includes('unstable')) tags.push('mood swings')
            if (conversation.onbording_data.memory_issues?.includes('rarely')) tags.push('memory')
            if (conversation.onbording_data.difficulty_organizing?.includes('struggle')) tags.push('organization')
            if (conversation.onbording_data.other_medical_conditions?.includes('Diabetes')) tags.push('diabetes')
        }
        
        return tags.slice(0, 4) // Limit to 4 tags
    }

    const generateSummaryFromConversation = (conversation: Conversation): string => {
        if (conversation.summary) {
            return conversation.summary
        }
        
        // Generate summary from conversation content
        const userMessages = conversation.history.filter(msg => msg.role === 'user')
        const assistantMessages = conversation.history.filter(msg => msg.role === 'assistant')
        
        if (userMessages.length === 0) {
            return 'Conversation initiated with AI specialist.'
        }
        
        const firstUserMessage = userMessages[0].content
        const lastAssistantMessage = assistantMessages.length > 0 ? assistantMessages[assistantMessages.length - 1].content : ''
        
        return `Patient initiated conversation with "${firstUserMessage}". The AI specialist provided guidance and support throughout the session. ${lastAssistantMessage ? `Final response: "${lastAssistantMessage}"` : ''}`
    }

    const getSessionById = async () => {
        try {
            setLoading(true)
            const response = await getConversationByIdApiRequest(params.id as string)
            console.log('Session response:', response?.data?.data?.Conversation)
            
            if (response?.data?.data?.Conversation) {
                const conversation = response.data.data.Conversation
                const transformedSession = transformConversationToSession(conversation)
                setSession(transformedSession)
            } else {
                console.error('Invalid response format:', response)
                setSession(null)
            }
        } catch (error) {
            console.error('Error fetching conversation:', error)
            setSession(null)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getSessionById()
    }, [params.id])

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="">
                    <div className="bg-white border-b border-gray-200 px-6 py-4 mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
                            <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
                        </div>
                    </div>
                    <div className="space-y-6 px-6 py-8">
                        <div className="h-20 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                </div>
            </div>
        )
    }

    if (!session) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Session not found</h1>
                    <p className="text-gray-600 mb-6">The conversation you're looking for doesn't exist or has been removed.</p>
                    <button 
                        onClick={() => router.back()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className=" px-6 py-4">
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => router.back()}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                        >
                            <ChevronLeft className="h-5 w-5 text-gray-600" />
                        </button>
                        <div>
                            <h1 className="text-xl font-semibold text-gray-900">{session.folder}</h1>
                            <p className="text-sm text-gray-500">Conversation with {session.doctor}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="     px-6 py-8">
                {/* Session Info */}
                <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-6 text-sm text-gray-600">
                            <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-2" />
                                {session.date}
                            </div>
                            <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-2" />
                                {session.duration}
                            </div>
                            <div className="flex items-center">
                                <MessageSquare className="h-4 w-4 mr-2" />
                                {session.chatCount} messages
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {session.tags.map((tag: string, index: number) => (
                                <span 
                                    key={index}
                                    className="px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full font-medium"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Summary Section */}
                <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <FileText className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">Session Summary</h2>
                            <p className="text-sm text-gray-500">AI-generated summary of your consultation</p>
                        </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-700 leading-relaxed">{session.summary}</p>
                    </div>
                </div>

                {/* Chat Section */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    {/* Chat Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 text-white">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                    <Bot className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">{session.doctor}</h3>
                                    <p className="text-blue-100 text-sm">{session.specialty}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button 
                                    onClick={() => setIsPlaying(!isPlaying)}
                                    className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors duration-200"
                                >
                                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                                </button>
                                <button 
                                    onClick={() => setIsMuted(!isMuted)}
                                    className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors duration-200"
                                >
                                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Chat Messages */}
                    <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
                        {session.chat.map((message: any) => (
                            <div 
                                key={message.id} 
                                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`flex items-start space-x-3 max-w-xs lg:max-w-md ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                        message.sender === 'user' 
                                            ? 'bg-blue-500' 
                                            : 'bg-gray-500'
                                    }`}>
                                        {message.sender === 'user' ? (
                                            <User className="h-4 w-4 text-white" />
                                        ) : (
                                            <Bot className="h-4 w-4 text-white" />
                                        )}
                                    </div>
                                    <div className={`${
                                        message.sender === 'user' 
                                            ? 'bg-blue-600 text-white' 
                                            : 'bg-gray-100 text-gray-900'
                                    } rounded-lg px-4 py-2`}>
                                        <p className="text-sm">{message.message}</p>
                                        <p className={`text-xs mt-1 ${
                                            message.sender === 'user' 
                                                ? 'text-blue-100' 
                                                : 'text-gray-500'
                                        }`}>
                                            {message.timestamp}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Chat Actions */}
                    <div className="border-t border-gray-100 p-4 bg-gray-50">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                                Session completed on {session.date}
                            </div>
                            <div className="flex space-x-2">
                                <button className="px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200 flex items-center">
                                    <Download className="h-4 w-4 mr-1" />
                                    Download
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChatSessionPage
