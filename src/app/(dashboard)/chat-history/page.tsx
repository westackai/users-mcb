'use client'
export const runtime = 'edge';
import React, { useState } from 'react'
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

// Mock data - replace with actual API calls
const chatSessions = [
    {
        id: 1,
        folder: 'Anxiety & Depression Treatment',
        date: '2024-01-15',
        duration: '45 min',
        doctor: 'Dr. Marie Claire Bourque',
        specialty: 'Psychiatry',
        summary: 'Discussed anxiety symptoms, depression episodes, and stress management techniques. Reviewed medication effectiveness and coping strategies for daily challenges.',
        chatCount: 23,
        lastMessage: 'Thank you for the consultation, doctor. I feel much better now.',
        status: 'completed',
        tags: ['anxiety', 'depression', 'stress management', 'medication']
    },
    {
        id: 2,
        folder: 'ADHD & Focus Issues',
        date: '2024-01-03',
        duration: '40 min',
        doctor: 'Dr. Marie Claire Bourque',
        specialty: 'Psychiatry',
        summary: 'Evaluated ADHD symptoms and medication effectiveness. Discussed organizational strategies, time management techniques, and workplace accommodations.',
        chatCount: 20,
        lastMessage: 'The organizational apps you recommended are really helping.',
        status: 'completed',
        tags: ['ADHD', 'focus', 'organization', 'time management']
    }
]

const ChatHistoryPage = () => {
    const router = useRouter()
    const [selectedFolder, setSelectedFolder] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [filterStatus, setFilterStatus] = useState('all')
    const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())

    const toggleFolder = (folderName: string) => {
        const newExpanded = new Set(expandedFolders)
        if (newExpanded.has(folderName)) {
            newExpanded.delete(folderName)
        } else {
            newExpanded.add(folderName)
        }
        setExpandedFolders(newExpanded)
    }

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
                                            Last: {sessions[0]?.date}
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
                                                            <span>{session.date}</span>
                                                            <Clock className="h-3 w-3 ml-2" />
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
                                                    <button onClick={() => router.push(`/chat-history/${session.id}`)} className="p-2 cursor-pointer text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200" title="View Chat">
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

                </div>

                {/* Empty State */}
                {Object.keys(groupedSessions).length === 0 && (
                    <div className="text-center py-12">
                        <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No chat sessions found</h3>
                        <p className="text-gray-600">Try adjusting your search or filters to find your conversations.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ChatHistoryPage