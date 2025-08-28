'use client'
export const runtime = 'edge';

import React, { useState, useEffect, useRef } from 'react'
import { 
    Mic, 
    MicOff, 
    Video, 
    VideoOff, 
    Phone, 
    PhoneOff, 
    MessageCircle, 
    Send,
    Settings,
    Volume2,
    VolumeX,
    Maximize,
    Minimize,
    Bot,
    User,
    Clock
} from 'lucide-react'

interface Message {
    id: string
    text: string
    sender: 'user' | 'ai'
    timestamp: Date
}



const VideoConsultationPage = () => {
    const [isMuted, setIsMuted] = useState(false)
    const [isVideoOn, setIsVideoOn] = useState(true)
    const [isCallActive, setIsCallActive] = useState(true)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [isVolumeOn, setIsVolumeOn] = useState(true)
    const [chatMessage, setChatMessage] = useState('')
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: 'Hello! I\'m Dr. Marie Claire Bourque. How can I help you today?',
            sender: 'ai',
            timestamp: new Date()
        }
    ])
    const [callDuration, setCallDuration] = useState(0)
    const [isTyping, setIsTyping] = useState(false)

    const videoRef = useRef<HTMLVideoElement>(null)
    const chatEndRef = useRef<HTMLDivElement>(null)

    // Simulate call duration timer
    useEffect(() => {
        const timer = setInterval(() => {
            setCallDuration(prev => prev + 1)
        }, 1000)

        return () => clearInterval(timer)
    }, [])

    // Auto-scroll chat to bottom
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    const handleSendMessage = () => {
        if (chatMessage.trim()) {
            const newMessage: Message = {
                id: Date.now().toString(),
                text: chatMessage,
                sender: 'user',
                timestamp: new Date()
            }
            setMessages(prev => [...prev, newMessage])
            setChatMessage('')
            
            // Simulate AI response
            setIsTyping(true)
            setTimeout(() => {
                const aiResponse: Message = {
                    id: (Date.now() + 1).toString(),
                    text: 'Thank you for sharing that. I understand how challenging this situation must be for you. Let me ask you a few more questions to better understand your needs.',
                    sender: 'ai',
                    timestamp: new Date()
                }
                setMessages(prev => [...prev, aiResponse])
                setIsTyping(false)
            }, 2000)
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    const toggleMute = () => setIsMuted(!isMuted)
    const toggleVideo = () => setIsVideoOn(!isVideoOn)
    const toggleCall = () => setIsCallActive(!isCallActive)
    const toggleFullscreen = () => setIsFullscreen(!isFullscreen)
    const toggleVolume = () => setIsVolumeOn(!isVolumeOn)

    return (
        <div className="h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex">
            {/* Left Side - Video Stream */}
            <div className="flex-1 flex flex-col">
                {/* Video Header */}
                <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200/50 text-slate-900 p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <Bot className="h-5 w-5 text-emerald-500" />
                            <span className="font-medium text-slate-900">Dr. Marie Claire Bourque</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-slate-600">
                            <Clock className="h-4 w-4" />
                            <span>{formatTime(callDuration)}</span>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={toggleVolume}
                            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            {isVolumeOn ? <Volume2 className="h-5 w-5 text-slate-600" /> : <VolumeX className="h-5 w-5 text-slate-600" />}
                        </button>
                        <button
                            onClick={toggleFullscreen}
                            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            {isFullscreen ? <Minimize className="h-5 w-5 text-slate-600" /> : <Maximize className="h-5 w-5 text-slate-600" />}
                        </button>
                        <button
                            onClick={toggleFullscreen}
                            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            <Settings className="h-5 w-5 text-slate-600" />
                        </button>
                    </div>
                </div>

                {/* Video Stream */}
                <div className="flex-1 bg-gradient-to-br from-slate-100 to-blue-100 relative flex items-center justify-center">
                    <div className="relative w-full h-full">
                        {/* Avatar Video Placeholder */}
                        <div className="w-full h-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
                            <div className="text-center text-slate-900">
                                <div className="w-32 h-32 bg-white border-2 border-slate-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow">
                                    <Bot className="h-16 w-16 text-blue-600" />
                                </div>
                                <h2 className="text-2xl font-semibold mb-2">Dr. Marie Claire Bourque</h2>
                                <p className="text-lg text-slate-600 opacity-90">AI Psychiatrist</p>
                                <div className="mt-4 flex items-center justify-center space-x-2">
                                    <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                                    <span className="text-sm text-slate-700">Live</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Video Controls */}
                <div className="bg-white/80 backdrop-blur-sm border-t border-slate-200/50 p-6 flex items-center justify-center space-x-4">
                    <button
                        onClick={toggleMute}
                        className={`p-4 rounded-full transition-all duration-200 ${
                            isMuted 
                                ? 'bg-red-500 hover:bg-red-600' 
                                : 'bg-slate-200 hover:bg-slate-300'
                        }`}
                    >
                        {isMuted ? <MicOff className="h-6 w-6 text-white" /> : <Mic className="h-6 w-6 text-slate-700" />}
                    </button>

                    <button
                        onClick={toggleVideo}
                        className={`p-4 rounded-full transition-all duration-200 ${
                            !isVideoOn 
                                ? 'bg-red-500 hover:bg-red-600' 
                                : 'bg-slate-200 hover:bg-slate-300'
                        }`}
                    >
                        {isVideoOn ? <Video className="h-6 w-6 text-slate-700" /> : <VideoOff className="h-6 w-6 text-white" />}
                    </button>

                    <button
                        onClick={toggleCall}
                        className={`p-6 rounded-full transition-all duration-200 ${
                            isCallActive 
                                ? 'bg-red-500 hover:bg-red-600' 
                                : 'bg-emerald-500 hover:bg-emerald-600'
                        }`}
                    >
                        {isCallActive ? <PhoneOff className="h-8 w-8 text-white" /> : <Phone className="h-8 w-8 text-white" />}
                    </button>
                </div>
            </div>

            {/* Right Side - Chat */}
            <div className="w-96 bg-white/80 backdrop-blur-sm flex flex-col border-l border-slate-200/50">
                {/* Chat Header */}
                <div className="bg-white border-b border-gray-300 p-3">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center">
                            <Bot className="h-5 w-5 text-black" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-black">Dr. Marie Claire Bourque</h3>
                            <p className="text-sm text-gray-600">AI Psychiatrist</p>
                        </div>
                    </div>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-xs px-4 py-2 rounded-lg ${
                                    message.sender === 'user'
                                        ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
                                        : 'bg-slate-100 text-slate-900'
                                }`}
                            >
                                <p className="text-sm">{message.text}</p>
                                <p className={`text-xs mt-1 ${
                                    message.sender === 'user' ? 'text-blue-100' : 'text-slate-500'
                                }`}>
                                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </div>
                    ))}
                    
                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="bg-slate-100 px-4 py-2 rounded-lg">
                                <div className="flex space-x-1">
                                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    <div ref={chatEndRef} />
                </div>

                {/* Chat Input */}
                <div className="p-4 border-t border-slate-200/50">
                    <div className="flex space-x-2">
                        <textarea
                            id="chatMessage"
                            value={chatMessage}
                            onChange={(e) => setChatMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Type your message..."
                            className="flex-1 resize-none border placeholder:text-slate-400 text-slate-900 border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                            rows={2}
                        />
                        <button
                            onClick={handleSendMessage}
                            disabled={!chatMessage.trim()}
                            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        >
                            <Send className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VideoConsultationPage
