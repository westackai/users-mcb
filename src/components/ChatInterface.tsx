'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
    Send,
    Bot,
    User,
    Plus,
    MoreVertical,
    Trash2,
    Edit3,
    Copy,
    ThumbsUp,
    ThumbsDown,
    Loader2,
    MessageSquare,
    Sparkles
} from 'lucide-react'
import { sendMessageToAvatarApiRequest, sendStreamingMessageToAvatarApiRequest, getAllKnowledgeBasesApiRequest } from '@/networks/api'

interface KnowledgeBase {
    id: string
    title: string
}

interface Message {
    id: string
    content: string
    role: 'user' | 'assistant'
    timestamp: Date
    isTyping?: boolean
    isStreaming?: boolean
    conversationId?: string
}

interface ChatSession {
    id: string
    title: string
    messages: Message[]
    createdAt: Date
    updatedAt: Date
}

interface ChatInterfaceProps {
    currentSession?: ChatSession | null
    onNewSession: () => void
    onSessionUpdate: (session: ChatSession) => void
    onSessionDelete: (sessionId: string) => void
    loading?: boolean
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
    currentSession,
    onNewSession,
    onSessionUpdate,
    onSessionDelete,
    loading = false
}) => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const chatId = searchParams.get('chat-id')
    const [messages, setMessages] = useState<Message[]>([])
    const [inputMessage, setInputMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [showSessionMenu, setShowSessionMenu] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>([])
    const [selectedKnowledgeBase, setSelectedKnowledgeBase] = useState<KnowledgeBase | null>(null)

    // Initialize messages when session changes
    useEffect(() => {
        if (currentSession) {
            setMessages(currentSession.messages)
            setSelectedKnowledgeBase(null) // Reset knowledge base selection for existing sessions
        } else {
            setMessages([])
            setSelectedKnowledgeBase(null) // Reset knowledge base selection for new sessions
        }
    }, [currentSession])

    useEffect(() => {
        const fetchKnowledgeBases = async () => {
            const response = await getAllKnowledgeBasesApiRequest()
            console.log(response?.data?.data)
            setKnowledgeBases(response.data.data)
        }
        fetchKnowledgeBases()
    }, [])

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
        }
    }, [inputMessage])

    const handleSendMessage = async () => {
        if (!inputMessage.trim() || isLoading) return
        
        // For new sessions (no chatId), require knowledge base selection
        if (!chatId && !selectedKnowledgeBase) return

        const userMessage: Message = {
            id: Date.now().toString(),
            content: inputMessage.trim(),
            role: 'user',
            timestamp: new Date()
        }

        const newMessages = [...messages, userMessage]
        setMessages(newMessages)
        setInputMessage('')
        setIsLoading(true)

        // Add typing indicator
        const typingMessage: Message = {
            id: 'typing',
            content: '',
            role: 'assistant',
            timestamp: new Date(),
            isTyping: true
        }

        setMessages([...newMessages, typingMessage])

        try {
            // Create initial streaming message
            const streamingMessageId = (Date.now() + 1).toString()
            const initialStreamingMessage: Message = {
                id: streamingMessageId,
                content: '',
                role: 'assistant',
                timestamp: new Date(),
                isStreaming: true
            }

            setMessages([...newMessages, initialStreamingMessage])

            // Call streaming LLM API
            const response = await getStreamingLLMResponse(
                inputMessage.trim(), 
                selectedKnowledgeBase?.id,
                (chunk) => {
                    // Handle streaming chunks
                    setMessages(prevMessages => {
                        const messageIndex = prevMessages.findIndex(msg => msg.id === streamingMessageId)
                        if (messageIndex >= 0) {
                            const updatedMessages = [...prevMessages]
                            updatedMessages[messageIndex] = {
                                ...updatedMessages[messageIndex],
                                content: updatedMessages[messageIndex].content + chunk.text,
                                conversationId: chunk.conversationId || updatedMessages[messageIndex].conversationId,
                                isStreaming: !chunk.done
                            }
                            return updatedMessages
                        }
                        return prevMessages
                    })
                }
            )

            // Finalize the streaming message
            setMessages(prevMessages => {
                const messageIndex = prevMessages.findIndex(msg => msg.id === streamingMessageId)
                if (messageIndex >= 0) {
                    const updatedMessages = [...prevMessages]
                    updatedMessages[messageIndex] = {
                        ...updatedMessages[messageIndex],
                        content: response.fullResponse,
                        isStreaming: false,
                        conversationId: response.conversationId
                    }
                    return updatedMessages
                }
                return prevMessages
            })

            // Update session with final messages
            const finalMessages = [...newMessages, {
                id: streamingMessageId,
                content: response.fullResponse,
                role: 'assistant' as const,
                timestamp: new Date(),
                conversationId: response.conversationId
            }]

            // Update session if it exists (using chatId from URL)
            if (chatId) {
                // Update existing session
                const updatedSession: ChatSession = {
                    ...currentSession!,
                    messages: finalMessages,
                    updatedAt: new Date()
                }
                onSessionUpdate(updatedSession)
            } else {
                // Create new session with unique ID
                const sessionId = response.conversationId || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
                const newSession: ChatSession = {
                    id: sessionId,
                    title: selectedKnowledgeBase?.title || inputMessage.trim().substring(0, 50) + (inputMessage.trim().length > 50 ? '...' : ''),
                    messages: finalMessages,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
                onSessionUpdate(newSession)
                // Navigate to the new chat URL with query parameter
                router.push(`/chat-bot?chat-id=${sessionId}`)
            }

        } catch (error) {
            console.error('Error sending message:', error)
            // Remove typing indicator on error
            setMessages(newMessages)
        } finally {
            setIsLoading(false)
        }
    }

    const getStreamingLLMResponse = async (
        message: string, 
        knowledgeBaseId?: string,
        onChunk?: (chunk: { text: string; done: boolean; conversationId?: string }) => void
    ): Promise<{ conversationId: string; fullResponse: string }> => {
        // Prepare the payload for the API
        let payload = {};
        console.log('currentSession?.id', currentSession)
        console.log('chatId from URL', chatId)
        
        // Use chatId from URL for existing chats, or create new conversation
        if (chatId) {
            payload = {
                user_message: message,
                conversation_type: "chat",
                conversation_id: chatId,
                knowledgeBase_id: knowledgeBaseId || "23e620d9-ade8-4978-a91e-02856c461607",
            }
        } else {
            payload = {
                user_message: message,
                conversation_type: "chat",
                knowledgeBase_id: knowledgeBaseId || "23e620d9-ade8-4978-a91e-02856c461607",
            }
        }

        try {
            let conversationId = ''
            let fullResponse = ''

            // Use streaming API
            await sendStreamingMessageToAvatarApiRequest(payload, (chunk) => {
                console.log('Received chunk:', chunk)
                
                // Handle conversation_id from initial response
                if (chunk.conversation_id) {
                    conversationId = chunk.conversation_id
                    onChunk?.({ text: '', done: false, conversationId })
                }
                
                // Handle text chunks
                if (chunk.text !== undefined) {
                    fullResponse += chunk.text
                    onChunk?.({ text: chunk.text, done: chunk.done, conversationId })
                }
                
                // Handle done flag
                if (chunk.done) {
                    console.log('Streaming completed')
                }
            })

            return { conversationId, fullResponse }
        } catch (error) {
            console.error('Error calling streaming LLM API:', error)

            // Fallback to regular API if streaming fails
            try {
                const response = await sendMessageToAvatarApiRequest(payload)
                console.log('Fallback response from chat', response?.data)

                if (response?.data?.data?.response) {
                    return { conversationId: '', fullResponse: response.data.data.response }
                } else if (response?.data?.response) {
                    return { conversationId: '', fullResponse: response.data.response }
                }
            } catch (fallbackError) {
                console.error('Fallback API also failed:', fallbackError)
            }

            // Final fallback responses if all APIs fail
            const fallbackResponses = [
                "I understand your concern. Let me help you work through this step by step.",
                "That's an interesting perspective. Can you tell me more about how you're feeling about this?",
                "I appreciate you sharing this with me. It sounds like you're going through a challenging time.",
                "Let's explore this together. What do you think might be contributing to these feelings?",
                "I hear you. It's important to acknowledge these emotions. How long have you been experiencing this?",
                "Thank you for being open with me. This kind of self-reflection is very valuable.",
                "I can see this is affecting you significantly. What coping strategies have you tried so far?",
                "Your feelings are valid. Let's work on understanding what's behind this pattern."
            ]

            const fallbackResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)]
            return { conversationId: '', fullResponse: fallbackResponse }
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    const copyMessage = (content: string) => {
        navigator.clipboard.writeText(content)
    }

    const handleNewChat = () => {
        setMessages([])
        setInputMessage('')
        setSelectedKnowledgeBase(null)
        onNewSession()
        router.push('/chat-bot')
    }

    const handleDeleteSession = () => {
        if (currentSession) {
            onSessionDelete(currentSession.id)
        }
        setShowSessionMenu(false)
    }

    return (
        <div className="flex flex-col h-full bg-white">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg">
                        <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-lg font-semibold text-gray-900">
                            {currentSession ? currentSession.title : 'New Chat'}
                        </h1>
                        <p className="text-sm text-gray-500">
                            {currentSession ? `${currentSession.messages.length} messages` : 'Start a new conversation'}
                        </p>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <button
                        onClick={handleNewChat}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                        title="New Chat"
                    >
                        <Plus className="h-5 w-5" />
                    </button>

                    {currentSession && (
                        <div className="relative">
                            <button
                                onClick={() => setShowSessionMenu(!showSessionMenu)}
                                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                                title="Session Options"
                            >
                                <MoreVertical className="h-5 w-5" />
                            </button>

                            {showSessionMenu && (
                                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                    <button
                                        onClick={handleDeleteSession}
                                        className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center space-x-2"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                        <span>Delete Session</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                            <p className="text-gray-600">Loading chat...</p>
                        </div>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <div className="p-4 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full mb-4">
                            <MessageSquare className="h-12 w-12 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            Welcome to Dr. MCB AI Assistant
                        </h3>
                        <p className="text-gray-600 mb-6 max-w-md">
                            Choose your topic of concern to start a conversation with our expert AI assistant.
                        </p>
                        
                        {!selectedKnowledgeBase ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl">
                                {knowledgeBases?.length > 0 ? (
                                    knowledgeBases?.map((knowledgeBase) => (
                                        <button
                                            key={knowledgeBase.id}
                                            onClick={() => setSelectedKnowledgeBase(knowledgeBase)}
                                            className="p-4 text-left bg-white border border-gray-200 hover:border-blue-300 hover:bg-blue-50 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                                                    <MessageSquare className="h-5 w-5 text-white" />
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-gray-900">{knowledgeBase.title}</h4>
                                                    <p className="text-sm text-gray-500">Click to start conversation</p>
                                                </div>
                                            </div>
                                        </button>
                                    ))
                                ) : (
                                    <div className="col-span-full text-center py-8">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                        <p className="text-gray-600">Loading topics...</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="max-w-2xl">
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                                                <MessageSquare className="h-5 w-5 text-white" />
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-900">Selected Topic</h4>
                                                <p className="text-sm text-blue-600">{selectedKnowledgeBase.title}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setSelectedKnowledgeBase(null)}
                                            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                <p className="text-gray-600 mb-4">
                                    You can now start typing your message below. The AI assistant will provide specialized guidance for <strong>{selectedKnowledgeBase.title}</strong>.
                                </p>
                            </div>
                        )}
                    </div>
                ) : (
                    messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`flex max-w-3xl ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                {/* Avatar */}
                                <div className={`flex-shrink-0 ${message.role === 'user' ? 'ml-3' : 'mr-3'}`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${message.role === 'user'
                                            ? 'bg-blue-600'
                                            : 'bg-gradient-to-r from-purple-500 to-pink-500'
                                        }`}>
                                        {message.role === 'user' ? (
                                            <User className="h-4 w-4 text-white" />
                                        ) : (
                                            <Bot className="h-4 w-4 text-white" />
                                        )}
                                    </div>
                                </div>

                                {/* Message Content */}
                                <div className={`flex-1 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                                    <div className={`inline-block p-4 rounded-2xl ${message.role === 'user'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-900'
                                        }`}>
                                        {message.isTyping ? (
                                            <div className="flex items-center space-x-1">
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                <span className="text-sm">AI is thinking...</span>
                                            </div>
                                        ) : (
                                            <div>
                                                <p className="whitespace-pre-wrap">
                                                    {message.content}
                                                    {message.isStreaming && (
                                                        <span className="inline-block w-2 h-4 bg-gray-400 ml-1 animate-pulse"></span>
                                                    )}
                                                </p>
                                                <div className={`flex items-center mt-2 space-x-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'
                                                    }`}>
                                                    <span className={`text-xs ${message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                                                        }`}>
                                                        {message.timestamp.toLocaleTimeString([], {
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </span>
                                                    {message.role === 'assistant' && !message.isTyping && !message.isStreaming && (
                                                        <div className="flex items-center space-x-1">
                                                            <button
                                                                onClick={() => copyMessage(message.content)}
                                                                className="p-1 hover:bg-gray-200 rounded transition-colors duration-200"
                                                                title="Copy message"
                                                            >
                                                                <Copy className="h-3 w-3 text-gray-500" />
                                                            </button>
                                                            <button
                                                                className="p-1 hover:bg-gray-200 rounded transition-colors duration-200"
                                                                title="Good response"
                                                            >
                                                                <ThumbsUp className="h-3 w-3 text-gray-500" />
                                                            </button>
                                                            <button
                                                                className="p-1 hover:bg-gray-200 rounded transition-colors duration-200"
                                                                title="Poor response"
                                                            >
                                                                <ThumbsDown className="h-3 w-3 text-gray-500" />
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-200 p-4 bg-white">
                <div className="flex items-end space-x-3">
                    <div className="flex-1 relative">
                        <textarea
                            ref={textareaRef}
                            id="inputMessage"
                            name="inputMessage"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder={
                                loading 
                                    ? "Loading chat..." 
                                    : !chatId && !selectedKnowledgeBase
                                        ? "Please select a topic above to start chatting..."
                                        : "Type your message here... (Press Enter to send, Shift+Enter for new line)"
                            }
                            className={`w-full px-4 py-3 text-gray-900 placeholder:text-gray-500 pr-12 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent max-h-32 ${
                                !chatId && !selectedKnowledgeBase 
                                    ? 'border-gray-200 bg-gray-50 cursor-not-allowed' 
                                    : 'border-gray-300'
                            }`}
                            rows={1}
                            disabled={isLoading || loading || (!chatId && !selectedKnowledgeBase)}
                        />
                    </div>
                    <button
                        onClick={handleSendMessage}
                        disabled={!inputMessage.trim() || isLoading || loading || (!chatId && !selectedKnowledgeBase)}
                        className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
                    >
                        {isLoading ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            <Send className="h-5 w-5" />
                        )}
                    </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                    {!chatId && !selectedKnowledgeBase ? (
                        "Select a topic above to enable chat input."
                    ) : (
                        "Dr. MCB AI Assistant is designed to provide supportive mental health guidance. For serious concerns, please consult with a healthcare professional."
                    )}
                </p>
            </div>
        </div>
    )
}

export default ChatInterface
