'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import ChatInterface from '@/components/ChatInterface'
import ChatHistorySidebar from '@/components/ChatHistorySidebar'
import ChatBotLayout from '@/components/ChatBotLayout'
import { getConversationsApiRequest, getConversationByIdApiRequest } from '@/networks/api'

interface Message {
    id: string
    content: string
    role: 'user' | 'assistant'
    timestamp: Date
}

interface ChatSession {
    id: string
    title: string
    messages: Message[]
    createdAt: Date
    updatedAt: Date
}

const ChatBotIdPage = () => {
    const params = useParams()
    const router = useRouter()
    const chatId = params.id as string
    
    const loadSingleTime = useRef(false)
    const [sessions, setSessions] = useState<ChatSession[]>([])
    const [currentSession, setCurrentSession] = useState<ChatSession | null>(null)
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Load conversations and specific chat
    useEffect(() => {
        if (!loadSingleTime.current) {
            loadConversationsAndChat()
            loadSingleTime.current = true
        }
    }, [chatId])

    const loadConversationsAndChat = async () => {
        try {
            setLoading(true)
            setError(null)
            
            // Load all conversations first
            const conversationsResponse = await getConversationsApiRequest()
            let allSessions: ChatSession[] = []
            
            if (conversationsResponse?.data?.data?.Conversation && Array.isArray(conversationsResponse.data.data.Conversation)) {
                const apiConversations = conversationsResponse.data.data.Conversation
                
                // Transform API conversations to our ChatSession format
                allSessions = apiConversations.map((conv: any) => ({
                    id: conv.uuid,
                    title: conv.title || 'Untitled Chat',
                    messages: conv.history?.map((msg: any, index: number) => ({
                        id: `${conv.uuid}-${index}`,
                        content: msg.content,
                        role: msg.role === 'user' ? 'user' : 'assistant',
                        timestamp: new Date(conv.created_at || Date.now())
                    })) || [],
                    createdAt: new Date(conv.created_at || Date.now()),
                    updatedAt: new Date(conv.created_at || Date.now())
                }))

                // Sort by updatedAt (newest first)
                allSessions.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
                setSessions(allSessions)
            }

            // Try to find the specific chat in the loaded sessions
            const foundSession = allSessions.find(session => session.id === chatId)
            
            if (foundSession) {
                setCurrentSession(foundSession)
            } else {
                // If not found in sessions, try to load it directly from API
                try {
                    const chatResponse = await getConversationByIdApiRequest(chatId)
                    
                    if (chatResponse?.data?.data) {
                        const conv = chatResponse.data.data
                        const specificSession: ChatSession = {
                            id: conv.uuid,
                            title: conv.title || 'Untitled Chat',
                            messages: conv.history?.map((msg: any, index: number) => ({
                                id: `${conv.uuid}-${index}`,
                                content: msg.content,
                                role: msg.role === 'user' ? 'user' : 'assistant',
                                timestamp: new Date(conv.created_at || Date.now())
                            })) || [],
                            createdAt: new Date(conv.created_at || Date.now()),
                            updatedAt: new Date(conv.created_at || Date.now())
                        }
                        
                        setCurrentSession(specificSession)
                        
                        // Add to sessions if not already there
                        if (!allSessions.find(s => s.id === chatId)) {
                            setSessions(prev => [specificSession, ...prev])
                        }
                    } else {
                        setError('Chat not found')
                    }
                } catch (apiError) {
                    console.error('Error loading specific chat:', apiError)
                    setError('Failed to load chat')
                }
            }

        } catch (error) {
            console.error('Error loading conversations:', error)
            setError('Failed to load conversations')
        } finally {
            setLoading(false)
        }
    }

    const handleNewSession = () => {
        setCurrentSession(null)
        router.push('/chat-bot')
    }

    const handleSessionSelect = (session: ChatSession) => {
        setCurrentSession(session)
        router.push(`/chat-bot/${session.id}`)
    }

    const handleSessionUpdate = (updatedSession: ChatSession) => {
        setSessions(prevSessions => {
            const existingIndex = prevSessions.findIndex(s => s.id === updatedSession.id)
            
            if (existingIndex >= 0) {
                // Update existing session
                const newSessions = [...prevSessions]
                newSessions[existingIndex] = updatedSession
                // Move to top
                newSessions.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
                return newSessions
            } else {
                // Add new session - always add to the beginning for new chats
                const newSessions = [updatedSession, ...prevSessions]
                return newSessions
            }
        })
        
        setCurrentSession(updatedSession)
    }

    const handleSessionDelete = (sessionId: string) => {
        setSessions(prevSessions => prevSessions.filter(s => s.id !== sessionId))
        
        // If deleted session was current, redirect to main chat page
        if (currentSession?.id === sessionId) {
            router.push('/chat-bot')
        }
    }

    const handleSessionRename = (sessionId: string, newTitle: string) => {
        setSessions(prevSessions => 
            prevSessions.map(session => 
                session.id === sessionId 
                    ? { ...session, title: newTitle }
                    : session
            )
        )
        
        // Update current session if it's the one being renamed
        if (currentSession?.id === sessionId) {
            setCurrentSession(prev => prev ? { ...prev, title: newTitle } : null)
        }
    }

    const toggleSidebar = () => {
        setSidebarCollapsed(!sidebarCollapsed)
    }


    if (error) {
        return (
            <ChatBotLayout>
                <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                        <div className="p-4 bg-red-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Chat Not Found</h3>
                        <p className="text-gray-600 mb-4">{error}</p>
                        <button
                            onClick={() => router.push('/chat-bot')}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                        >
                            Go to Chat Bot
                        </button>
                    </div>
                </div>
            </ChatBotLayout>
        )
    }

    return (
        <ChatBotLayout>
            <div className="flex h-full">
                {/* Chat History Sidebar */}
                <ChatHistorySidebar
                    sessions={sessions}
                    currentSessionId={currentSession?.id}
                    onSessionSelect={handleSessionSelect}
                    onNewSession={handleNewSession}
                    onSessionDelete={handleSessionDelete}
                    onSessionRename={handleSessionRename}
                    isCollapsed={sidebarCollapsed}
                    onToggleCollapse={toggleSidebar}
                    loading={loading}
                />

                {/* Main Chat Interface */}
                <div className="flex-1 flex flex-col">
                    <ChatInterface
                        currentSession={currentSession}
                        onNewSession={handleNewSession}
                        onSessionUpdate={handleSessionUpdate}
                        onSessionDelete={handleSessionDelete}
                        loading={loading}
                    />
                </div>
            </div>
        </ChatBotLayout>
    )
}

export default ChatBotIdPage
