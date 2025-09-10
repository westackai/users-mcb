'use client'
export const runtime = 'edge';

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
    Search, 
    Heart, 
    Brain, 
    Baby, 
    Eye, 
    Stethoscope, 
    Bone, 
    Activity,
    BookOpen,
    Filter,
    ArrowRight,
    Clock,
    Star,
    TrendingUp,
    Edit,
    Trash2,
    Plus,
    AlertTriangle,
    X
} from 'lucide-react'
import { getAllHealthTipsApiRequest  } from '@/networks/api'

interface PersonalInfo {
    specialization: string
    image: string
    experience: number
}

interface HealthTip {
    uuid: string
    title: string
    category?: string
    description: string
    short_description: string
    key_points: string[]
    related_topics: string[]
    personal_info: PersonalInfo
    created_at: string
    is_active: boolean
    read_time?: number
    important_points?: string[]
}

const HealthTipsManagementPage = () => {
    const router = useRouter()
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [healthTips, setHealthTips] = useState<HealthTip[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [tipToDelete, setTipToDelete] = useState<HealthTip | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)


    const categories = [
        { id: 'all', name: 'All Topics', icon: BookOpen, color: 'bg-blue-500' },
        { id: 'mental-health', name: 'Mental Health', icon: Brain, color: 'bg-purple-500' },
        { id: 'cardiovascular', name: 'Heart & Vascular', icon: Heart, color: 'bg-red-500' },
        { id: 'pediatrics', name: 'Children\'s Health', icon: Baby, color: 'bg-pink-500' },
        { id: 'neurology', name: 'Brain & Nervous System', icon: Brain, color: 'bg-indigo-500' },
        { id: 'ophthalmology', name: 'Eye & Vision', icon: Eye, color: 'bg-cyan-500' },
        { id: 'dental', name: 'Oral Health', icon: Stethoscope, color: 'bg-teal-500' },
        { id: 'orthopedics', name: 'Bones & Joints', icon: Bone, color: 'bg-orange-500' }
    ]


    const filteredTips = healthTips.filter(tip => {
        const matchesSearch = tip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             tip.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             tip.short_description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             tip.key_points.some(point => point.toLowerCase().includes(searchQuery.toLowerCase())) ||
                             tip.related_topics.some(topic => topic.toLowerCase().includes(searchQuery.toLowerCase()))
        
        const matchesCategory = selectedCategory === 'all' || tip.category === selectedCategory
        
        return matchesSearch && matchesCategory && tip.is_active // Show both active and inactive tips
    })


 

    const handleGetAllHealthTips = async () => {
        try {
            setLoading(true)
            setError(null)
            const response = await getAllHealthTipsApiRequest()
            console.log("response scsnjfsd" , response)
            if (response?.data?.data) {
                setHealthTips(response?.data.data)
            } else {
                setError('Failed to fetch health tips')
            }
        } catch (err) {
            setError('Error loading health tips')
            console.error('Error fetching health tips:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleAddNew = () => {
        router.push('/health-tips/new')
    }


    const handleTipSelect = (tip: HealthTip) => {
        router.push(`/health-tips/${tip.uuid}`)
    }


    useEffect(() => {
        handleGetAllHealthTips()
    }, [])

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 px-6 py-4">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">Health Tips & Education</h1>
                            <p className="text-slate-600">Learn about health topics and get expert advice</p>
                        </div>

                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Search and Filter */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-8">
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search health tips..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 placeholder:text-gray-500 cursor-pointer text-gray-700 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        
                        {/* Category Filter */}
                        <div className="flex items-center space-x-2">
                            <Filter className="h-5 w-5 text-slate-400" />
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="px-4 py-3 border cursor-pointer placeholder:text-gray-500 text-gray-700 border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-slate-600">Loading health tips...</p>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="text-center py-12">
                        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                            <div className="text-red-600 mb-2">⚠️ Error</div>
                            <p className="text-red-700">{error}</p>
                            <button
                                onClick={handleGetAllHealthTips}
                                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                )}

                {/* Health Tips Grid */}
                {!loading && !error && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredTips.map((tip) => (
                            <div
                                key={tip.uuid}
                                className={`bg-white rounded-xl border shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group relative ${
                                    tip.is_active 
                                        ? 'border-slate-200 opacity-100' 
                                        : 'border-slate-100 opacity-60 bg-slate-50'
                                }`}
                                onClick={() => handleTipSelect(tip)}
                            >
                                {/* Action Buttons */}

                                <div className="p-6">
                                    {/* Category Badge and Read Time */}
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2">

                                        <span className={`px-3 py-1 ${tip?.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} text-xs font-medium rounded-full`}>
                                            {/* {tip.category ? tip.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Health'} */}
                                            {tip?.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                        </div>
                                        <div className={`flex items-center space-x-2 text-sm ${
                                            tip.is_active ? 'text-slate-500' : 'text-slate-400'
                                        }`}>
                                            <Clock className="h-4 w-4" />
                                            <span>{tip.read_time ? `${tip.read_time} min read` : '5 min read'}</span>
                                        </div>
                                    </div>

                                    {/* Title and Description */}
                                    <h3 className={`font-semibold mb-3 text-lg leading-tight transition-colors ${
                                        tip.is_active 
                                            ? 'text-slate-900 group-hover:text-blue-600' 
                                            : 'text-slate-500'
                                    }`}>
                                        {tip.title}
                                    </h3>
                                    <p className={`text-sm mb-4 leading-relaxed ${
                                        tip.is_active ? 'text-slate-600' : 'text-slate-400'
                                    }`}>
                                        {tip.short_description || tip.description}
                                    </p>

                                    {/* Key Points */}
                                    {tip.key_points && tip.key_points.length > 0 && (
                                        <div className="mb-4">
                                            <h4 className={`text-xs font-medium mb-2 ${
                                                tip.is_active ? 'text-slate-500' : 'text-slate-400'
                                            }`}>Key Points:</h4>
                                            <div className="flex flex-wrap gap-1">
                                                {tip.key_points.slice(0, 3).map((point, index) => (
                                                    <span
                                                        key={index}
                                                        className={`px-2 py-1 text-xs rounded-md ${
                                                            tip.is_active 
                                                                ? 'bg-green-100 text-green-700' 
                                                                : 'bg-slate-100 text-slate-500'
                                                        }`}
                                                    >
                                                        {point}
                                                    </span>
                                                ))}
                                                {tip.key_points.length > 3 && (
                                                    <span className={`px-2 py-1 text-xs rounded-md ${
                                                        tip.is_active 
                                                            ? 'bg-green-100 text-green-700' 
                                                            : 'bg-slate-100 text-slate-500'
                                                    }`}>
                                                        +{tip.key_points.length - 3}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Related Topics */}
                                    {tip.related_topics && tip.related_topics.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {tip.related_topics.slice(0, 3).map((topic, index) => (
                                                <span
                                                    key={index}
                                                    className={`px-2 py-1 text-xs rounded-md ${
                                                        tip.is_active 
                                                            ? 'bg-slate-100 text-slate-600' 
                                                            : 'bg-slate-50 text-slate-400'
                                                    }`}
                                                >
                                                    {topic}
                                                </span>
                                            ))}
                                            {tip.related_topics.length > 3 && (
                                                <span className={`px-2 py-1 text-xs rounded-md ${
                                                    tip.is_active 
                                                        ? 'bg-slate-100 text-slate-600' 
                                                        : 'bg-slate-50 text-slate-400'
                                                }`}>
                                                    +{tip.related_topics.length - 3}
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    {/* Author Info */}
                                    {/* <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center space-x-2">
                                            <img
                                                src={tip.personal_info.image}
                                                alt={tip.personal_info.specialization}
                                                className="w-8 h-8 rounded-full object-cover"
                                                onError={(e) => {
                                                    e.currentTarget.src = '/avatar-1.png'
                                                }}
                                            />
                                            <div>
                                                <p className="text-xs font-medium text-slate-700">{tip.personal_info.specialization}</p>
                                                <p className="text-xs text-slate-500">{tip.personal_info.experience} years exp.</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center text-blue-600 text-sm font-medium group-hover:text-blue-700">
                                            Read More
                                            <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
                                        </div>
                                    </div> */}

                                    {/* Created Date */}
                                    <div className={`text-xs ${
                                        tip.is_active ? 'text-slate-400' : 'text-slate-300'
                                    }`}>
                                        Created: {new Date(tip.created_at).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* No Results */}
                {!loading && !error && filteredTips.length === 0 && (
                    <div className="text-center py-12">
                        <BookOpen className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-slate-900 mb-2">No health tips found</h3>
                        <p className="text-slate-600">Try adjusting your search or category filter.</p>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && tipToDelete && (
                <div className="fixed inset-0 z-50 bg-white/50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
                        {/* Header */}
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-red-100 rounded-lg">
                                <AlertTriangle className="h-6 w-6 text-red-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-slate-900">Delete Health Tip</h3>
                                <p className="text-sm text-slate-600">This action cannot be undone</p>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="mb-6">
                            <p className="text-slate-700 mb-3">
                                Are you sure you want to delete the health tip:
                            </p>
                            <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                                <h4 className="font-medium text-slate-900 mb-1">{tipToDelete.title}</h4>
                                <p className="text-sm text-slate-600">
                                    {tipToDelete.short_description || tipToDelete.description}
                                </p>
                                <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                                    <span>Category: {tipToDelete.category || 'Health'}</span>
                                    <span>Created: {new Date(tipToDelete.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>


                    </div>
                </div>
            )}
        </div>
    )
}

export default HealthTipsManagementPage
