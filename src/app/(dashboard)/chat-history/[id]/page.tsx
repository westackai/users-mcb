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

// Mock data - replace with actual API calls
const chatSessions = [
    {
        id: 1,
        folder: 'Anxiety & Depression Treatment',
        date: '2024-01-15',
        duration: '45 min',
        doctor: 'Dr. Marie Claire Bourque',
        specialty: 'Psychiatrist',
        summary: 'Discussed anxiety symptoms, depression episodes, and stress management techniques. Reviewed medication effectiveness and coping strategies for daily challenges. Patient reported improvement in symptoms and better sleep quality. Recommended continued use of prescribed medications and daily mindfulness exercises.',
        chatCount: 23,
        lastMessage: 'Thank you for the consultation, doctor. I feel much better now.',
        status: 'completed',
        tags: ['anxiety', 'depression', 'stress management', 'medication'],
        chat: [
            {
                id: 1,
                sender: 'user',
                message: 'Hello Dr. Bourque, I\'ve been feeling really anxious lately and my depression seems to be getting worse.',
                timestamp: '10:00 AM',
                avatar: '/user-avatar.jpg'
            },
            {
                id: 2,
                sender: 'ai',
                message: 'Hello! I\'m Dr. Marie Claire Bourque. I\'m here to help you with your anxiety and depression. Can you tell me more about what you\'ve been experiencing? How long have these symptoms been affecting you?',
                timestamp: '10:01 AM',
                avatar: '/dr-avatar.jpg'
            },
            {
                id: 3,
                sender: 'user',
                message: 'It\'s been about 3 weeks now. I can\'t sleep properly, I\'m constantly worried about everything, and I feel like I have no energy to do anything.',
                timestamp: '10:02 AM',
                avatar: '/user-avatar.jpg'
            },
            {
                id: 4,
                sender: 'ai',
                message: 'I understand this is very difficult for you. These are common symptoms of anxiety and depression. Let\'s work together to find solutions. Have you noticed any specific triggers or situations that make these feelings worse?',
                timestamp: '10:03 AM',
                avatar: '/dr-avatar.jpg'
            },
            {
                id: 5,
                sender: 'user',
                message: 'Work stress mostly. I have a big project deadline coming up and I feel like I\'m going to fail. Also, I\'ve been avoiding social situations because I feel like people will judge me.',
                timestamp: '10:04 AM',
                avatar: '/user-avatar.jpg'
            },
            {
                id: 6,
                sender: 'ai',
                message: 'Thank you for sharing that. Work stress and social anxiety are very common triggers. Let me ask you about your current medications - are you still taking the sertraline I prescribed last month?',
                timestamp: '10:05 AM',
                avatar: '/dr-avatar.jpg'
            },
            {
                id: 7,
                sender: 'user',
                message: 'Yes, I\'ve been taking it daily as prescribed, but I don\'t feel like it\'s helping much anymore.',
                timestamp: '10:06 AM',
                avatar: '/user-avatar.jpg'
            },
            {
                id: 8,
                sender: 'ai',
                message: 'I see. Sometimes medications need adjustment as our bodies and circumstances change. Let\'s discuss some coping strategies first, and then we can talk about medication options. What relaxation techniques have you tried?',
                timestamp: '10:07 AM',
                avatar: '/dr-avatar.jpg'
            },
            {
                id: 9,
                sender: 'user',
                message: 'I tried deep breathing, but I get frustrated when it doesn\'t work immediately. I also tried meditation apps but I can\'t focus.',
                timestamp: '10:08 AM',
                avatar: '/user-avatar.jpg'
            },
            {
                id: 10,
                sender: 'ai',
                message: 'That\'s completely normal! These techniques take practice. Let me teach you a simple 4-7-8 breathing technique that you can use anywhere. Breathe in for 4 counts, hold for 7, exhale for 8. Try it with me now.',
                timestamp: '10:09 AM',
                avatar: '/dr-avatar.jpg'
            },
            {
                id: 11,
                sender: 'user',
                message: 'Okay, I\'ll try... *takes deep breath*',
                timestamp: '10:10 AM',
                avatar: '/user-avatar.jpg'
            },
            {
                id: 12,
                sender: 'ai',
                message: 'Perfect! How does that feel? Remember, it\'s okay if it feels awkward at first. Practice this 3-4 times daily, especially before stressful situations. Now, let\'s talk about your medication - I think we should increase your sertraline dosage.',
                timestamp: '10:11 AM',
                avatar: '/dr-avatar.jpg'
            },
            {
                id: 13,
                sender: 'user',
                message: 'Will that help with the anxiety too? I\'m worried about side effects.',
                timestamp: '10:12 AM',
                avatar: '/user-avatar.jpg'
            },
            {
                id: 14,
                sender: 'ai',
                message: 'Yes, sertraline helps with both anxiety and depression. The side effects are usually mild and temporary. We\'ll start with a small increase and monitor how you feel. I\'ll also prescribe a short-term anxiety medication for immediate relief.',
                timestamp: '10:13 AM',
                avatar: '/dr-avatar.jpg'
            },
            {
                id: 15,
                sender: 'user',
                message: 'That sounds good. What else can I do to help myself?',
                timestamp: '10:14 AM',
                avatar: '/user-avatar.jpg'
            },
            {
                id: 16,
                sender: 'ai',
                message: 'Great question! I recommend: 1) Daily exercise, even just a 20-minute walk, 2) Regular sleep schedule, 3) Limiting caffeine and alcohol, 4) Journaling your thoughts, 5) Reaching out to friends/family. Start small and build up gradually.',
                timestamp: '10:15 AM',
                avatar: '/dr-avatar.jpg'
            },
            {
                id: 17,
                sender: 'user',
                message: 'I can try the walking and journaling. The social part is harder for me right now.',
                timestamp: '10:16 AM',
                avatar: '/user-avatar.jpg'
            },
            {
                id: 18,
                sender: 'ai',
                message: 'That\'s perfectly fine! Start with what feels manageable. Social connections can come later when you\'re feeling stronger. For now, focus on self-care and the techniques we discussed. How does this plan sound to you?',
                timestamp: '10:17 AM',
                avatar: '/dr-avatar.jpg'
            },
            {
                id: 19,
                sender: 'user',
                message: 'It sounds doable. I feel a bit more hopeful now. When should I see you again?',
                timestamp: '10:18 AM',
                avatar: '/user-avatar.jpg'
            },
            {
                id: 20,
                sender: 'ai',
                message: 'I\'m glad you\'re feeling more hopeful! Let\'s schedule a follow-up in 2 weeks to see how the medication adjustment and new techniques are working. If you need me before then, you can message me anytime.',
                timestamp: '10:19 AM',
                avatar: '/dr-avatar.jpg'
            },
            {
                id: 21,
                sender: 'user',
                message: 'Thank you, Dr. Bourque. This has been really helpful.',
                timestamp: '10:20 AM',
                avatar: '/user-avatar.jpg'
            },
            {
                id: 22,
                sender: 'ai',
                message: 'You\'re very welcome! Remember, recovery takes time and it\'s okay to have ups and downs. You\'re taking important steps by seeking help. I\'ll see you in 2 weeks. Take care!',
                timestamp: '10:21 AM',
                avatar: '/dr-avatar.jpg'
            },
            {
                id: 23,
                sender: 'user',
                message: 'Thank you for the consultation, doctor. I feel much better now.',
                timestamp: '10:22 AM',
                avatar: '/user-avatar.jpg'
            }
        ]
    }
]

const ChatSessionPage = () => {
    const params = useParams()
    const router = useRouter()
    const [session, setSession] = useState<any>(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [isMuted, setIsMuted] = useState(false)
    const [showSummary, setShowSummary] = useState(true)

    useEffect(() => {
        const sessionId = params.id
        const foundSession = chatSessions.find(s => s.id.toString() === sessionId)
        setSession(foundSession)
    }, [params.id])

    if (!session) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6">
                <div className=" text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Session not found</h1>
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
        <div className="">
            <div className="">
                {/* Header */}
                <div>
                <div className="bg-white border-b border-gray-300 px-6 py-4">
                  <div className="max-w-7xl mx-auto flex items-center gap-2">
                  <button 
                        onClick={() => router.back()}
                        className="flex items-center justify-center cursor-pointer  duration-200"
                    >
                        <ChevronLeft className="h-6 w-6  text-black" />
                       
                    </button>
                    <div>

                    <h1 className="text-2xl font-bold text-gray-900">{session.folder}</h1>
                    </div>
                     
                      {/* <p className="text-gray-600">Choose your AI psychologist for specialized mental health consultation</p> */}
                  </div>
                  </div>
                </div>
                <div className='max-w-7xl mx-auto px-6 py-8'>

                <div className="mb-6">
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {session.date}
                        </div>
                        <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {session.duration}
                        </div>
                        <div className="flex items-center">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            {session.chatCount} messages
                        </div>
                    </div>
                </div>

                {/* Toggle Buttons */}
                <div className="flex space-x-2 mb-6">
                    <button
                        onClick={() => setShowSummary(true)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                            showSummary 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        <FileText className="h-4 w-4 inline mr-2" />
                        Session Summary
                    </button>
                    <button
                        onClick={() => setShowSummary(false)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                            !showSummary 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        <MessageSquare className="h-4 w-4 inline mr-2" />
                        Full Chat
                    </button>
                </div>

                {/* Summary Section */}
                {showSummary && (
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <FileText className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">Session Summary</h2>
                                <p className="text-sm text-gray-600">AI-generated summary of your consultation</p>
                            </div>
                        </div>
                        
                        <div className="bg-gray-50 p-4 rounded-lg mb-4">
                            <p className="text-gray-700 leading-relaxed">{session.summary}</p>
                        </div>

                        {/* Key Points */}
                        <div className="mb-4">
                            <h3 className="font-medium text-gray-900 mb-3">Key Discussion Points:</h3>
                            <div className="flex flex-wrap gap-2">
                                {session.tags.map((tag: string, index: number) => (
                                    <span 
                                        key={index}
                                        className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Recommendations */}
                        <div>
                            <h3 className="font-medium text-gray-900 mb-3">Recommendations:</h3>
                            <ul className="space-y-2 text-gray-700">
                                <li className="flex items-start">
                                    <Heart className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                                    <span>Increase sertraline dosage for better symptom control</span>
                                </li>
                                <li className="flex items-start">
                                    <Brain className="h-4 w-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                                    <span>Practice 4-7-8 breathing technique daily</span>
                                </li>
                                <li className="flex items-start">
                                    <Activity className="h-4 w-4 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
                                    <span>Daily 20-minute walks and regular sleep schedule</span>
                                </li>
                                <li className="flex items-start">
                                    <FileText className="h-4 w-4 text-orange-600 mr-2 mt-0.5 flex-shrink-0" />
                                    <span>Journal thoughts and practice mindfulness exercises</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                )}

                {/* Chat Section */}
                {!showSummary && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
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
                        <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
                            {session.chat.map((message: any) => (
                                <div 
                                    key={message.id} 
                                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`flex items-start space-x-3 max-w-xs lg:max-w-md ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                            message.sender === 'user' 
                                                ? 'bg-blue-500' 
                                                : 'bg-green-500'
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
                                {/* <div className="flex space-x-2">
                                    <button className="px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200 flex items-center">
                                        <Download className="h-4 w-4 mr-1" />
                                        Download
                                    </button>
                                    <button className="px-3 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200 flex items-center">
                                        <Share2 className="h-4 w-4 mr-1" />
                                        Share
                                    </button>
                                </div> */}
                            </div>
                        </div>
                    </div>
                )}
                </div>
            </div>
        </div>
    )
}

export default ChatSessionPage
