'use client'
export const runtime = 'edge';

import React, { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
    ArrowLeft,
    Clock,
    Calendar,
    Tag,
    Heart,
    Brain,
    Baby,
    Eye,
    Stethoscope,
    Bone,
    Activity,
    BookOpen,
    User,
    Award,
    CheckCircle,
    Star,
    MessageCircle,
    ThumbsUp,
    Share2,
    Bookmark,
    Printer,
    Mail,
    Copy,
    AlertCircle,
    Lightbulb,
    Target,
    ArrowRight,
    ChevronRight,
    ExternalLink,
    ChevronLeft
} from 'lucide-react'
import Link from 'next/link';
import Image from 'next/image';
import dynamic from "next/dynamic";
import { getHealthTipByIdApiRequest } from '@/networks/api'
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

// Import MDEditor dynamically to avoid SSR issues
const MDEditor = dynamic(
  () => import("@uiw/react-md-editor"),
  { ssr: false }
);

// Import MarkdownPreview for read-only display
const MarkdownPreview = dynamic(
  () => import("@uiw/react-markdown-preview").then((mod) => ({ default: mod.default })),
  { ssr: false }
);

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

const HealthTipDetailPage = () => {
    const params = useParams()
    const router = useRouter()
    const tipId = params.id as string
    const [healthTip, setHealthTip] = useState<HealthTip | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isBookmarked, setIsBookmarked] = useState(false)
    const [showShareMenu, setShowShareMenu] = useState(false)
    const shareMenuRef = useRef<HTMLDivElement>(null)

const getHealthTipDetails = async () => {
        try {
            setLoading(true)
            setError(null)
            const response = await getHealthTipByIdApiRequest(tipId)
            if (response?.data?.data) {
                setHealthTip(response.data.data)
            } else {
                setError('Health tip not found')
            }
        } catch (err) {
            setError('Error loading health tip')
            console.error('Error fetching health tip:', err)
        } finally {
            setLoading(false)
        }
}

useEffect(() => {
        if (tipId) {
  getHealthTipDetails()
        }
    }, [tipId])

    // Close share menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (shareMenuRef.current && !shareMenuRef.current.contains(event.target as Node)) {
                setShowShareMenu(false)
            }
        }

        if (showShareMenu) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [showShareMenu])

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-slate-600">Loading health tip...</p>
                </div>
            </div>
        )
    }

    if (error || !healthTip) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center bg-white rounded-xl shadow-sm border border-slate-200 p-12 max-w-md mx-4">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <AlertCircle className="h-8 w-8 text-red-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Health Tip Not Found</h2>
                    <p className="text-slate-600 mb-8">{error || "The health tip you're looking for doesn't exist or may have been moved."}</p>
                    <button
                        onClick={() => router.back()}
                        className="px-6 py-3 !cursor-pointer bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center mx-auto"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Health Tips
                    </button>
                </div>
            </div>
        )
    }

    const getCategoryIcon = (category?: string) => {
        switch (category) {
            case 'mental-health':
                return Brain
            case 'cardiovascular':
                return Heart
            case 'pediatrics':
                return Baby
            case 'ophthalmology':
                return Eye
            case 'dental':
                return Stethoscope
            case 'orthopedics':
                return Bone
            case 'neurology':
                return Activity
            case 'health':
                return BookOpen
            default:
                return BookOpen
        }
    }

    const getCategoryColor = (category?: string) => {
        switch (category) {
            case 'mental-health':
                return 'bg-purple-500'
            case 'cardiovascular':
                return 'bg-red-500'
            case 'pediatrics':
                return 'bg-pink-500'
            case 'ophthalmology':
                return 'bg-cyan-500'
            case 'dental':
                return 'bg-teal-500'
            case 'orthopedics':
                return 'bg-orange-500'
            case 'neurology':
                return 'bg-indigo-500'
            case 'health':
                return 'bg-blue-500'
            default:
                return 'bg-blue-500'
        }
    }

    const CategoryIcon = getCategoryIcon(healthTip.category)
    const categoryColor = getCategoryColor(healthTip.category)

    const handleShare = (method: string) => {
        const url = window.location.href
        const title = healthTip.title

        switch (method) {
            case 'copy':
                navigator.clipboard.writeText(url)
                alert('Link copied to clipboard!')
                break
            case 'email':
                window.open(`mailto:?subject=${title}&body=Check out this health tip: ${url}`)
                break
            case 'print':
                window.print()
                break
        }
        setShowShareMenu(false)
    }

  return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="bg-gradient-to-br from-blue-50 via-white to-slate-50 border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    {/* Navigation */}
                    <div className="flex items-center justify-between gap-3 mb-8">
                        <button
                            onClick={() => router.back()}
                            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg hover:bg-white/80 transition-all duration-200 !cursor-pointer border border-slate-200 hover:border-slate-300"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        
                        <div className="flex items-center gap-2">
                            <div className={`p-2 rounded-lg ${categoryColor} shadow-sm`}>
                                <CategoryIcon className="h-4 w-4 text-white" />
                            </div>
                            <span className="px-3 py-1 bg-white/80 text-slate-700 text-sm font-medium rounded-full border border-slate-200 shadow-sm">
                                {healthTip.category ? healthTip.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Health'}
                            </span>
                        </div>
                    </div>

                    {/* Main Header Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                     
                        <div className="lg:col-span-1">
                            <div className="p-">
                                <div className="text-center">
                                    {/* Doctor Image */}
                                    <div className="relative w-48 h-48 mx-auto mb-4">
                                        <div className="w-full h-full rounded-full overflow-hidden border-4 border-white shadow-lg">
                                            <img
                                                src={healthTip.personal_info.image}
                                                alt={healthTip.personal_info.specialization}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.currentTarget.src = '/avatar-1.png'
                                                }}
                                            />
                                        </div>
                                        <div className="absolute bottom-2 right-4 w-8 h-8 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                                            <CheckCircle className="h-4 w-4 text-white" />
                                        </div>
                                    </div>

                                    {/* Doctor Info */}
                                    <h3 className="text-xl font-bold text-slate-900 mb-1">{healthTip.personal_info.specialization}</h3>
                                    <p className="text-slate-600 mb-4 font-medium">Medical Specialist</p>

                                    {/* Experience */}
                                    <div className="flex items-center justify-center gap-2 mb-6">
                                        <Award className="h-5 w-5 text-blue-500" />
                                        <span className="text-sm font-medium text-slate-700">{healthTip.personal_info.experience} years experience</span>
                                    </div>

                                    {/* Action Button */}
                                    {/* <Link 
                                        href="/video-consultation" 
                                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium py-3 px-4 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                                    >
                                        <MessageCircle className="h-4 w-4" />
                                        Consult Doctor
                                    </Link> */}
                                </div>
                            </div>
                        </div>
                        <div className="lg:col-span-2">
                            {/* Title */}
                            <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                                {healthTip.title}
                            </h1>

                            {/* Description */}
                            <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-3xl">
                                {healthTip.short_description || healthTip.description}
                            </p>

                            {/* Meta Information */}
                            <div className="flex flex-wrap items-center gap-6 mb-6">
                                <div className="flex items-center text-slate-500 bg-white/60 px-4 py-2 rounded-lg border border-slate-200">
                                    <Clock className="h-4 w-4 mr-2 text-blue-500" />
                                    <span className="text-sm font-medium">{healthTip.read_time ? `${healthTip.read_time} min read` : '5 min read'}</span>
                                </div>
                                <div className="flex items-center text-slate-500 bg-white/60 px-4 py-2 rounded-lg border border-slate-200">
                                    <Calendar className="h-4 w-4 mr-2 text-green-500" />
                                    <span className="text-sm font-medium">Posted on {new Date(healthTip.created_at).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center text-slate-500 bg-white/60 px-4 py-2 rounded-lg border border-slate-200">
                                    <User className="h-4 w-4 mr-2 text-purple-500" />
                                    <span className="text-sm font-medium">By {healthTip.personal_info.specialization}</span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap items-center gap-3">
                                {/* <button
                                    onClick={() => setIsBookmarked(!isBookmarked)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 ${
                                        isBookmarked 
                                            ? 'bg-blue-600 text-white border-blue-600' 
                                            : 'bg-white text-slate-600 border-slate-200 hover:bg-blue-50 hover:border-blue-300'
                                    }`}
                                >
                                    <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
                                    <span className="text-sm font-medium">{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
                                </button>
                                 */}
                                <div className="relative" ref={shareMenuRef}>
                                    {/* <button
                                        onClick={() => setShowShareMenu(!showShareMenu)}
                                        className="flex items-center gap-2 px-4 py-2 bg-white text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-all duration-200"
                                    >
                                        <Share2 className="h-4 w-4" />
                                        <span className="text-sm font-medium">Share</span>
                                    </button> */}
                                    
                                    {showShareMenu && (
                                        <div className="absolute top-full left-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-lg p-2 z-10 min-w-[140px]">
                                            <button
                                                onClick={() => handleShare('copy')}
                                                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-md"
                                            >
                                                <Copy className="h-4 w-4" />
                                                Copy Link
                                            </button>
                                            <button
                                                onClick={() => handleShare('email')}
                                                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-md"
                                            >
                                                <Mail className="h-4 w-4" />
                                                Email
                                            </button>
                                            <button
                                                onClick={() => handleShare('print')}
                                                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-md"
                                            >
                                                <Printer className="h-4 w-4" />
                                                Print
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                      
                     
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
                    {/* Main Content */}
                    <div className="lg:col-span-3 space-y-5">
                        {/* Related Topics */}
                        {healthTip.related_topics && healthTip.related_topics.length > 0 && (
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                                    <Tag className="h-5 w-5 mr-2 text-blue-500" />
                                    Related Topics
                                </h3>
                                <div className="grid grid-cols-3 gap-2">
                                    {healthTip.related_topics.map((topic, index) => (
                                        <div
                                            key={index}
                                            className="px-3 py-2 bg-slate-50 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer border border-slate-100"
                                        >
                                            <span className="text-sm font-medium">{topic}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Main Content with MDEditor */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">Detailed Information</h2>
                            
                            <div className="prose prose-slate max-w-none">
                                <MarkdownPreview 
                                    className="markdown-body !bg-white !text-slate-700"
                                    data-color-mode="light" 
                                    source={healthTip.description}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Sticky Sidebar */}
                    <div className="lg:sticky lg:top-8 lg:h-fit">
                        <div className="space-y-6">
                            {/* Key Points */}
                            {healthTip.key_points && healthTip.key_points.length > 0 && (
                                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                                    <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                                        <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
                                        Key Points
                                    </h3>
                                    <div className="space-y-3">
                                        {healthTip.key_points.map((point, index) => (
                                            <div
                                                key={index}
                                                className="px-3 py-2 bg-yellow-50 text-slate-700 rounded-lg border border-yellow-100"
                                            >
                                                <span className="text-sm font-medium">{point}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Important Points */}
                            {healthTip.important_points && healthTip.important_points.length > 0 && (
                                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                                    <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                                        <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
                                        Important Warnings
                                    </h3>
                                    <div className="space-y-3">
                                        {healthTip.important_points.map((point, index) => (
                                            <div
                                                key={index}
                                                className="px-3 py-2 bg-red-50 text-slate-700 rounded-lg border border-red-100"
                                            >
                                                <span className="text-sm font-medium">{point}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Quick Actions */}
                            <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
                                <h3 className="text-lg font-semibold text-slate-900 mb-3">Need Help?</h3>
                                <p className="text-slate-600 mb-4 text-sm">If you have questions about this topic, our medical team is here to help.</p>
                                <Link href="/video-consultation" className="w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                                    <MessageCircle className="h-4 w-4 inline mr-2" />
                                    Consult with Doctor
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HealthTipDetailPage