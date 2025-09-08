'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
    MessageSquare,
    Plus,
    Search,
    MoreVertical,
    Trash2,
    Edit3,
    Calendar,
    Clock,
    ChevronRight,
    ChevronDown,
    Folder,
    Bot,
    User
} from 'lucide-react'

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

interface ChatHistorySidebarProps {
    sessions: ChatSession[]
    currentSessionId?: string | null
    onSessionSelect: (session: ChatSession) => void
    onNewSession: () => void
    onSessionDelete: (sessionId: string) => void
    onSessionRename: (sessionId: string, newTitle: string) => void
    isCollapsed?: boolean
    onToggleCollapse?: () => void
    loading?: boolean
}

const ChatHistorySidebar: React.FC<ChatHistorySidebarProps> = ({
    sessions,
    currentSessionId,
    onSessionSelect,
    onNewSession,
    onSessionDelete,
    onSessionRename,
    isCollapsed = false,
    onToggleCollapse,
    loading = false
}) => {
    const router = useRouter()
    const [searchQuery, setSearchQuery] = useState('')
    const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['Today']))
    const [showSessionMenu, setShowSessionMenu] = useState<string | null>(null)
    const [editingSession, setEditingSession] = useState<string | null>(null)
    const [editTitle, setEditTitle] = useState('')

    // Group sessions by date
    const groupedSessions = sessions.reduce((acc, session) => {
        const date = session.updatedAt.toDateString()
        const today = new Date().toDateString()
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString()

        let folderName: string
        if (date === today) {
            folderName = 'Today'
        } else if (date === yesterday) {
            folderName = 'Yesterday'
        } else {
            const daysDiff = Math.floor((Date.now() - session.updatedAt.getTime()) / (24 * 60 * 60 * 1000))
            if (daysDiff <= 7) {
                folderName = 'This Week'
            } else if (daysDiff <= 30) {
                folderName = 'This Month'
            } else {
                folderName = 'Older'
            }
        }

        if (!acc[folderName]) {
            acc[folderName] = []
        }
        acc[folderName].push(session)
        return acc
    }, {} as Record<string, ChatSession[]>)

    // Ensure Today folder is always expanded for new chats
    useEffect(() => {
        if (sessions.length > 0) {
            const hasTodaySessions = sessions.some(session => {
                const date = session.updatedAt.toDateString()
                const today = new Date().toDateString()
                return date === today
            })

            if (hasTodaySessions && !expandedFolders.has('Today')) {
                setExpandedFolders(prev => new Set([...prev, 'Today']))
            }
        }
    }, [sessions, expandedFolders])

    // Sort sessions within each group by updatedAt (newest first)
    Object.keys(groupedSessions).forEach(folderName => {
        groupedSessions[folderName].sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    })

    const filteredSessions = Object.keys(groupedSessions).reduce((acc, folderName) => {
        const folderSessions = groupedSessions[folderName].filter(session =>
            session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            session.messages.some(msg =>
                msg.content.toLowerCase().includes(searchQuery.toLowerCase())
            )
        )

        if (folderSessions.length > 0) {
            acc[folderName] = folderSessions
        }

        return acc
    }, {} as Record<string, ChatSession[]>)

    const toggleFolder = (folderName: string) => {
        console.log('toggleFolderkjbfkwbfb', folderName)
        const newExpanded = new Set(expandedFolders)
        if (newExpanded.has(folderName)) {
            newExpanded.delete(folderName)
        } else {
            newExpanded.add(folderName)
        }
        setExpandedFolders(newExpanded)
        console.log('newExpandedkjbfkwbfb', newExpanded)
    }

    const handleSessionMenu = (sessionId: string, event: React.MouseEvent) => {
        event.stopPropagation()
        setShowSessionMenu(showSessionMenu === sessionId ? null : sessionId)
    }

    const handleRename = (session: ChatSession) => {
        setEditingSession(session.id)
        setEditTitle(session.title)
        setShowSessionMenu(null)
    }

    const handleRenameSubmit = () => {
        if (editTitle.trim() && editingSession) {
            onSessionRename(editingSession, editTitle.trim())
            setEditingSession(null)
            setEditTitle('')
        }
    }

    const handleRenameCancel = () => {
        setEditingSession(null)
        setEditTitle('')
    }

    const formatTime = (date: Date) => {
        const now = new Date()
        const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

        if (diffInHours < 1) {
            return 'Just now'
        } else if (diffInHours < 24) {
            return `${diffInHours}h ago`
        } else {
            return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
        }
    }

    const getLastMessagePreview = (session: ChatSession) => {
        const lastMessage = session.messages[session.messages.length - 1]
        if (!lastMessage) return 'No messages'

        const preview = lastMessage.content.substring(0, 50)
        return preview + (lastMessage.content.length > 50 ? '...' : '')
    }

    const isNewSession = (session: ChatSession) => {
        const today = new Date().toDateString()
        const sessionDate = session.createdAt.toDateString()
        return sessionDate === today
    }

    return (
        <div className={`bg-white border-r border-gray-200 transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-80'
            } flex flex-col h-full`}>
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    {!isCollapsed && (
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg">
                                <MessageSquare className="h-5 w-5 text-white" />
                            </div>
                            <h2 className="text-lg font-semibold text-gray-900">Chat </h2>
                        </div>
                    )}

                    <div className="flex items-center space-x-2">
                       

                        {onToggleCollapse && (
                            <button
                                onClick={onToggleCollapse}
                                className="hidden lg:block p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                                title={isCollapsed ? "Expand" : "Collapse"}
                            >
                                <ChevronRight className={`h-4 w-4 transition-transform duration-300 ${isCollapsed ? 'rotate-0' : 'rotate-180'
                                    }`} />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Search */}
            {!isCollapsed && (
                <div className="p-4 border-b border-gray-200">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            id='searchConversations'
                            name='searchConversations'
                            placeholder="Search conversations..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>
            )}

            {/* Sessions List */}
            <div className="flex-1 overflow-y-auto">
                {!isCollapsed ? (
                    <div className="p-2">
                        
                         {/* <button
                            onClick={() => {
                                onNewSession()
                                router.push('/chat-bot')
                            }}
                            className="!text-black my-2 pl-1 cursor-pointer rounded-xl py-1 w-full hover:bg-gray-100  flex items-center space-x-2"
                            title="New Chat"
                        >
                            <Plus className="h-5 w-5" />  New Chat
                            <span className="text-sm font-medium">New Chat</span>
                        </button> */}
                        {loading ? (
                            <div className="text-center py-8">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-3"></div>
                                <p className="text-gray-500 text-sm">Loading conversations...</p>
                            </div>
                        ) : Object.keys(filteredSessions).length === 0 ? (
                            <div className="text-center py-8">
                                <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500 text-sm">No conversations yet</p>
                                <p className="text-gray-400 text-xs mt-1">Start a new chat to begin</p>
                            </div>
                        ) : (
                            Object.entries(filteredSessions).map(([folderName, folderSessions]) => (
                                <div key={folderName} className="mb-4">
                                    {/* Folder Header */}
                                    <button
                                        onClick={() => toggleFolder(folderName)}
                                        className="w-full flex items-center justify-between p-2 text-left hover:bg-gray-50 rounded-lg transition-colors duration-200"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <Folder className="h-4 w-4 text-gray-500" />
                                            <span className="text-sm font-medium text-gray-700">{folderName}</span>
                                            <span className="text-xs text-gray-500">({folderSessions.length})</span>
                                        </div>
                                        {expandedFolders.has(folderName) ? (
                                            <ChevronDown className="h-4 w-4 text-gray-400" />
                                        ) : (
                                            <ChevronRight className="h-4 w-4 text-gray-400" />
                                        )}
                                    </button>

                                    {/* Folder Sessions */}
                                    {expandedFolders.has(folderName) && (
                                        <div className="ml-4 space-y-1">
                                            {folderSessions.map((session) => (
                                                <div
                                                    key={session.id}
                                                    className={`group relative p-3 rounded-lg cursor-pointer transition-all duration-200 ${currentSessionId === session.id
                                                            ? 'bg-blue-50 border border-blue-200'
                                                            : 'hover:bg-gray-50'
                                                        }`}
                                                    onClick={() => {
                                                        onSessionSelect(session)
                                                        router.push(`/chat-bot?chat-id=${session.id}`)
                                                    }}
                                                >
                                                    <div className="flex items-start space-x-3">
                                                        <div className="flex-shrink-0 mt-1">
                                                            <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                                                                <Bot className="h-3 w-3 text-white" />
                                                            </div>
                                                        </div>

                                                        <div className="flex-1 min-w-0">
                                                            {editingSession === session.id ? (
                                                                <input
                                                                    value={editTitle}
                                                                    onChange={(e) => setEditTitle(e.target.value)}
                                                                    onBlur={handleRenameSubmit}
                                                                    onKeyPress={(e) => {
                                                                        if (e.key === 'Enter') {
                                                                            handleRenameSubmit()
                                                                        } else if (e.key === 'Escape') {
                                                                            handleRenameCancel()
                                                                        }
                                                                    }}
                                                                    className="w-full text-sm font-medium text-gray-900 bg-transparent border-none outline-none"
                                                                    autoFocus
                                                                />
                                                            ) : (
                                                                <div className="flex items-center space-x-2">
                                                                    <h4 className="text-sm font-medium text-gray-900 truncate">
                                                                        {session.title}
                                                                    </h4>
                                                                    {isNewSession(session) && (
                                                                        <span className="px-1.5 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                                                                            NEW
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            )}

                                                            <p className="text-xs text-gray-500 mt-1 truncate">
                                                                {getLastMessagePreview(session)}
                                                            </p>

                                                            <div className="flex items-center space-x-2 mt-1">
                                                                <span className="text-xs text-gray-400">
                                                                    {formatTime(session.updatedAt)}
                                                                </span>
                                                                <span className="text-xs text-gray-400">•</span>
                                                                <span className="text-xs text-gray-400">
                                                                    {session.messages.length} messages
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <button
                                                            onClick={(e) => handleSessionMenu(session.id, e)}
                                                            className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-all duration-200"
                                                        >
                                                            <MoreVertical className="h-4 w-4" />
                                                        </button>
                                                    </div>

                                                    {/* Session Menu */}
                                                    {showSessionMenu === session.id && (
                                                        <div className="absolute right-2 top-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-32">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    handleRename(session)
                                                                }}
                                                                className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                                                            >
                                                                <Edit3 className="h-3 w-3" />
                                                                <span>Rename</span>
                                                            </button>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    onSessionDelete(session.id)
                                                                    setShowSessionMenu(null)
                                                                }}
                                                                className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                                                            >
                                                                <Trash2 className="h-3 w-3" />
                                                                <span>Delete</span>
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                ) : (
                    // Collapsed view
                    <div className="p-2 space-y-2">
                        {sessions.slice(0, 8).map((session) => (
                            <button
                                key={session.id}
                                onClick={() => {
                                    onSessionSelect(session)
                                    router.push(`/chat-bot/${session.id}`)
                                }}
                                className={`w-full p-2 rounded-lg transition-colors duration-200 ${currentSessionId === session.id
                                        ? 'bg-blue-100'
                                        : 'hover:bg-gray-100'
                                    }`}
                                title={session.title}
                            >
                                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto">
                                    <Bot className="h-4 w-4 text-white" />
                                </div>
                            </button>
                        ))}

                        <button
                            onClick={() => {
                                onNewSession()
                                router.push('/chat-bot')
                            }}
                            className="w-full p-2 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                            title="New Chat"
                        >
                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                                <Plus className="h-4 w-4 text-white" />
                            </div>
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ChatHistorySidebar
