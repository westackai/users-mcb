'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import ChatInterface from '@/components/ChatInterface'
import ChatHistorySidebar from '@/components/ChatHistorySidebar'
import ChatBotLayout from '@/components/ChatBotLayout'
import { getConversationsApiRequest } from '@/networks/api'

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

const ChatBotPage = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const loadSingleTime = useRef(false)
    const [sessions, setSessions] = useState<ChatSession[]>([])
    const [currentSession, setCurrentSession] = useState<ChatSession | null>(null)
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
    const [loading, setLoading] = useState(true)

    // Load existing conversations from API
    useEffect(() => {
        if (!loadSingleTime.current) {
          loadConversations()
            loadSingleTime.current = true
        }
        // loadConversations()
    }, [])

    // Handle chat-id query parameter
    useEffect(() => {
        const chatId = searchParams.get('chat-id')
        if (chatId && sessions.length > 0) {
            const session = sessions.find(s => s.id === chatId)
            if (session && (!currentSession || currentSession.id !== chatId)) {
                setCurrentSession(session)
            }
        } else if (!chatId && currentSession) {
            setCurrentSession(null)
        }
    }, [searchParams, sessions, currentSession])

    const loadConversations = async () => {
        try {
            setLoading(true)
            const response = await getConversationsApiRequest()
            
            if (response?.data?.data?.Conversation && Array.isArray(response.data.data.Conversation)) {
                const apiConversations = response.data.data.Conversation
                
                // Transform API conversations to our ChatSession format
                const transformedSessions: ChatSession[] = apiConversations.map((conv: any) => ({
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
                transformedSessions.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
                
                setSessions(transformedSessions)
                
                // Don't auto-select any session - let user start fresh or choose
                // This ensures new chats are always visible
                setCurrentSession(null)
            }
        } catch (error) {
            console.error('Error loading conversations:', error)
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
        router.push(`/chat-bot?chat-id=${session.id}`)
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
        
        // Update URL with the new session ID - use replace instead of push to avoid history issues
        router.replace(`/chat-bot?chat-id=${updatedSession.id}`)
    }

    const handleSessionDelete = (sessionId: string) => {
        setSessions(prevSessions => prevSessions.filter(s => s.id !== sessionId))
        
        // If deleted session was current, clear current session and URL
        if (currentSession?.id === sessionId) {
            setCurrentSession(null)
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

export default ChatBotPage