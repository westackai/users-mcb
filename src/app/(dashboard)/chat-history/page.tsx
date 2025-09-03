'use client'
export const runtime = 'edge';
import React, { useEffect, useState } from 'react'
import { 
    Folder, 
    MessageSquare, 
    Clock, 
    Calendar, 
    Search, 
    Filter, 
    MoreVertical, 
    Play,
    FileText,
    User,
    Bot,
    ChevronRight,
    ChevronDown,
    Eye,
    Download,
    Share2,
    Trash2
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { getConversationsApiRequest } from '@/networks/api';

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
    created_at?: string // Optional field if API provides it
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
    uuid: string
    title: string
    onbording_data: any
    created_at: string
    formattedDate: string
    formattedTime: string
}

const ChatHistoryPage = () => {
    const router = useRouter()
    const [selectedFolder, setSelectedFolder] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [filterStatus, setFilterStatus] = useState('all')
    const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())
    const [conversations, setConversations] = useState<Conversation[]>([])
    const [loading, setLoading] = useState(true)

    const toggleFolder = (folderName: string) => {
        const newExpanded = new Set(expandedFolders)
        if (newExpanded.has(folderName)) {
            newExpanded.delete(folderName)
        } else {
            newExpanded.add(folderName)
        }
        setExpandedFolders(newExpanded)
    }

    const transformConversationsToSessions = (conversations: Conversation[]): ChatSession[] => {
        return conversations.map((conv, index) => {
            const lastMessage = conv.history.length > 0 ? conv.history[conv.history.length - 1].content : 'No messages'
            const firstMessage = conv.history.length > 0 ? conv.history[0].content : ''
            
            // Extract tags from conversation content
            const tags = extractTagsFromConversation(conv)
            
            // Generate creation date - since API doesn't provide created_at, we'll use a reverse chronological order
            // Newest conversations first (index 0 = most recent)
            const daysAgo = index * 2; // Spread conversations over time
            const creationDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000)
            
            // Format date and time
            const formattedDate = creationDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            })
            
            const formattedTime = creationDate.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            })
            
            return {
                id: conv.uuid,
                folder: conv.title || 'General Consultation',
                date: formattedDate,
                duration: `${conv.history.length * 2} min`, // Estimate based on message count
                doctor: `Dr. MCB`,
                specialty: 'AI Psychiatrist',
                summary: conv.summary || firstMessage.substring(0, 100) + '...',
                chatCount: conv.history.length,
                lastMessage: lastMessage,
                status: 'completed',
                tags: tags,
                uuid: conv.uuid,
                title: conv.title,
                onbording_data: conv.onbording_data,
                created_at: creationDate.toISOString(),
                formattedDate: formattedDate,
                formattedTime: formattedTime
            }
        })
    }

    const extractTagsFromConversation = (conversation: Conversation): string[] => {
        const tags: string[] = []
        const content = conversation.history.map(msg => msg.content).join(' ').toLowerCase()
        
        // Extract tags based on content
        if (content.includes('anxiety') || content.includes('stress')) tags.push('anxiety')
        if (content.includes('depression') || content.includes('mood')) tags.push('depression')
        if (content.includes('adhd') || content.includes('focus')) tags.push('ADHD')
        if (content.includes('sleep') || content.includes('insomnia')) tags.push('sleep')
        if (content.includes('trauma') || content.includes('ptsd')) tags.push('trauma')
        if (content.includes('relationship') || content.includes('family')) tags.push('relationships')
        if (content.includes('addiction') || content.includes('substance')) tags.push('addiction')
        
        // Add patient info tags
        if (conversation.onbording_data) {
            if (conversation.onbording_data.mood_on_most_days?.includes('unstable')) tags.push('mood swings')
            if (conversation.onbording_data.memory_issues?.includes('poor')) tags.push('memory')
            if (conversation.onbording_data.difficulty_organizing?.includes('difficult')) tags.push('organization')
        }
        
        return tags.slice(0, 4) // Limit to 4 tags
    }

    const getAllConversations = async () => {
        try {
            setLoading(true)
            const response = await getConversationsApiRequest()
            console.log('Conversations response:', response?.data?.data?.Conversation)
            
            if (response?.data?.data?.Conversation && Array.isArray(response?.data?.data?.Conversation)) {
                // Sort conversations by newest first (assuming the API returns them in chronological order)
                // If API provides created_at, we can sort by that instead
                const sortedConversations = response.data.data.Conversation.sort((a: Conversation, b: Conversation) => {
                    // If both have created_at, sort by that
                    if (a.created_at && b.created_at) {
                        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                    }
                    // Otherwise, assume the order from API is correct (newest first)
                    return 0
                })
                setConversations(sortedConversations)
            } else {
                console.error('Invalid response format:', response)
                setConversations([])
            }
        } catch (error) {
            console.error('Error fetching conversations:', error)
            setConversations([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getAllConversations()
    }, [])

    const chatSessions = transformConversationsToSessions(conversations)

    const filteredSessions = chatSessions.filter(session => {
        const matchesSearch = session.folder.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            session.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            session.summary.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesStatus = filterStatus === 'all' || session.status === filterStatus
        return matchesSearch && matchesStatus
    })

    const groupedSessions = filteredSessions.reduce((acc, session) => {
        if (!acc[session.folder]) {
            acc[session.folder] = []
        }
        acc[session.folder].push(session)
        return acc
    }, {} as Record<string, typeof chatSessions>)

    return (
        <div className="">
            <div className="">
                {/* Header */}
                <div className="bg-white border-b border-gray-300 px-6 py-4">
                  <div className="max-w-7xl mx-auto">
                      <h1 className="text-2xl font-bold text-black">Chat History</h1>
                      {/* <p className="text-gray-600">Choose your AI psychologist for specialized mental health consultation</p> */}
                  </div>
              </div>

                {/* Search and Filter Bar */}
                <div className='max-w-7xl mx-auto px-6 py-8'>
                <div className=" bg-white px-6 py-4 rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search conversations, topics, or session details..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 text-gray-700 placeholder:text-gray-400 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        
                        {/* Filter */}
                        <div className="flex gap-3">
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="all">All Sessions</option>
                                <option value="completed">Completed</option>
                                <option value="ongoing">Ongoing</option>
                                <option value="scheduled">Scheduled</option>
                            </select>
                            <button className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center">
                                <Filter className="h-4 w-4 mr-2" />
                                More Filters
                            </button>
                        </div>
                    </div>
                </div>

                {/* Chat Sessions */}
                {loading ? (
                    <div className="space-y-6">
                        {[1, 2, 3].map((index) => (
                            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
                                <div className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-6 h-6 bg-gray-200 rounded"></div>
                                            <div>
                                                <div className="h-5 bg-gray-200 rounded w-48 mb-2"></div>
                                                <div className="h-4 bg-gray-200 rounded w-24"></div>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <div className="h-4 bg-gray-200 rounded w-20"></div>
                                            <div className="w-5 h-5 bg-gray-200 rounded"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-6">
                        {Object.entries(groupedSessions).map(([folderName, sessions]) => (
                        <div key={folderName} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            {/* Folder Header */}
                            <div 
                                className="p-6 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                                onClick={() => toggleFolder(folderName)}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <Folder className="h-6 w-6 text-blue-500" />
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">{folderName}</h3>
                                            <p className="text-sm text-gray-600">{sessions.length} session{sessions.length !== 1 ? 's' : ''}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <span className="text-sm text-gray-500">
                                            Latest: {sessions[0]?.formattedDate} at {sessions[0]?.formattedTime}
                                        </span>
                                        {expandedFolders.has(folderName) ? (
                                            <ChevronDown className="h-5 w-5 text-gray-400" />
                                        ) : (
                                            <ChevronRight className="h-5 w-5 text-gray-400" />
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Folder Content */}
                            {expandedFolders.has(folderName) && (
                                <div className="border-t border-gray-100">
                                    {sessions.map((session) => (
                                        <div key={session.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    {/* Session Header */}
                                                    <div className="flex items-center space-x-3 mb-3">
                                                        <div className="p-2 bg-blue-100 rounded-lg">
                                                            <MessageSquare className="h-4 w-4 text-blue-600" />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-medium text-gray-900">{session.doctor}</h4>
                                                            <p className="text-sm text-gray-600">{session.specialty}</p>
                                                        </div>
                                                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                                                            <Calendar className="h-3 w-3" />
                                                            <span>{session.formattedDate}</span>
                                                            <Clock className="h-3 w-3 ml-2" />
                                                            <span>{session.formattedTime}</span>
                                                            <span className="ml-2">•</span>
                                                            <span>{session.duration}</span>
                                                        </div>
                                                    </div>

                                                    {/* Summary */}
                                                    <div className="mb-4">
                                                        <div className="flex items-center space-x-2 mb-2">
                                                            <FileText className="h-4 w-4 text-green-600" />
                                                            <span className="text-sm font-medium text-gray-700">Session Summary</span>
                                                        </div>
                                                        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                                                            {session.summary}
                                                        </p>
                                                    </div>

                                                    {/* Tags */}
                                                    <div className="flex flex-wrap gap-2 mb-4">
                                                        {session.tags.map((tag, index) => (
                                                            <span 
                                                                key={index}
                                                                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                                                            >
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>

                                                    {/* Last Message Preview */}
                                                    <div className="bg-blue-50 p-3 rounded-lg">
                                                        <div className="flex items-start space-x-2">
                                                            <User className="h-4 w-4 text-blue-600 mt-0.5" />
                                                            <div className="flex-1">
                                                                <p className="text-xs text-gray-500 mb-1">Last message from you:</p>
                                                                <p className="text-sm text-gray-700">{session.lastMessage}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="flex flex-col space-y-2 ml-4">
                                                    <button onClick={() => router.push(`/chat-history/${session.uuid}`)} className="p-2 cursor-pointer text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200" title="View Chat">
                                                        <Eye className="h-4 w-4" />
                                                    </button>
                                                    {/* <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200" title="Download Transcript">
                                                        <Download className="h-4 w-4" />
                                                    </button> */}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                )}

                {/* Empty State */}
                {!loading && Object.keys(groupedSessions).length === 0 && (
                    <div className="text-center py-12">
                        <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No chat sessions found</h3>
                        <p className="text-gray-600">Try adjusting your search or filters to find your conversations.</p>
                    </div>
                )}
                </div>
            </div>
        </div>
    )
}

export default ChatHistoryPage