'use client'
 

import React from 'react'
import { 
    Calendar, 
    Video,
    FileText, 
    MessageSquare,
    User,
    Bell,
    ArrowRight,
    Sparkles
} from 'lucide-react'

const DashboardPage = () => {
    const quickActions = [
        { 
            name: 'Book Appointment', 
            icon: Calendar, 
            href: '/appointments', 
            color: 'from-blue-500 to-blue-600',
            bgColor: 'bg-blue-50',
            iconColor: 'text-blue-600',
            description: 'Schedule your next consultation'
        },
        { 
            name: 'AI Consultation', 
            icon: Video, 
            href: '/video-consultation', 
            color: 'from-emerald-500 to-emerald-600',
            bgColor: 'bg-emerald-50',
            iconColor: 'text-emerald-600',
            description: 'Talk to AI doctor avatars'
        },
        { 
            name: 'Medical Records', 
            icon: FileText, 
            href: '/records', 
            color: 'from-violet-500 to-violet-600',
            bgColor: 'bg-violet-50',
            iconColor: 'text-violet-600',
            description: 'View your health history'
        },
        { 
            name: 'Get Support', 
            icon: MessageSquare, 
            href: '/chat', 
            color: 'from-orange-500 to-orange-600',
            bgColor: 'bg-orange-50',
            iconColor: 'text-orange-600',
            description: 'Chat with support team'
        }
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200/50 px-6 py-8">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-2">
                                Welcome back! 👋
                            </h1>
                            <p className="text-lg text-slate-600">Ready to take care of your health today?</p>
                        </div>
                        <div className="hidden md:flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                                <User className="h-6 w-6 text-white" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-6 py-12">
                {/* Quick Actions */}
                <div className="mb-16">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center space-x-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-200/50 mb-4">
                            <Sparkles className="h-4 w-4 text-blue-500" />
                            <span className="text-sm font-medium text-slate-700">Quick Access</span>
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900 mb-3">What would you like to do?</h2>
                        <p className="text-lg text-slate-600">Choose from your most important features</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {quickActions.map((action, index) => {
                            const Icon = action.icon
                            return (
                                <div
                                    key={index}
                                    className="group relative bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                                >
                                    <div className="p-6">
                                        <div className={`w-16 h-16 ${action.bgColor} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                            <Icon className={`h-8 w-8 ${action.iconColor}`} />
                                        </div>
                                        <h3 className="text-xl font-semibold text-slate-900 mb-2">{action.name}</h3>
                                        <p className="text-slate-600 text-sm mb-4 leading-relaxed">{action.description}</p>
                                        <button className="w-full bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 py-3 px-4 rounded-xl font-medium hover:from-slate-200 hover:to-slate-300 transition-all duration-200 flex items-center justify-center group/btn">
                                            Get Started
                                            <ArrowRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-200" />
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Health Overview */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-sm p-8">
                    <div className="text-center mb-8">
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">Your Health Overview</h3>
                        <p className="text-slate-600">Stay on top of your health journey</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center group">
                            <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                                <Calendar className="h-10 w-10 text-white" />
                            </div>
                            <h4 className="text-lg font-semibold text-slate-900 mb-2">Next Visit</h4>
                            <p className="text-2xl font-bold text-green-600">Tomorrow</p>
                            <p className="text-sm text-slate-500 mt-1">10:00 AM</p>
                        </div>
                        
                        <div className="text-center group">
                            <div className="w-20 h-20 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                                <Video className="h-10 w-10 text-white" />
                            </div>
                            <h4 className="text-lg font-semibold text-slate-900 mb-2">Total Consultations</h4>
                            <p className="text-2xl font-bold text-blue-600">12</p>
                            <p className="text-sm text-slate-500 mt-1">This month</p>
                        </div>
                        
                        <div className="text-center group">
                            <div className="w-20 h-20 bg-gradient-to-r from-purple-400 to-violet-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                                <FileText className="h-10 w-10 text-white" />
                            </div>
                            <h4 className="text-lg font-semibold text-slate-900 mb-2">Health Records</h4>
                            <p className="text-2xl font-bold text-purple-600">24</p>
                            <p className="text-sm text-slate-500 mt-1">Up to date</p>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="mt-12 bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-sm p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-semibold text-slate-900">Recent Activity</h3>
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
                            View All
                            <ArrowRight className="h-4 w-4 ml-1" />
                        </button>
                    </div>
                    
                    <div className="space-y-4">
                        <div className="flex items-center p-4 bg-slate-50/50 rounded-xl">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                                <Calendar className="h-5 w-5 text-blue-600" />
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-slate-900">Appointment scheduled</p>
                                <p className="text-sm text-slate-600">Cardiology consultation for tomorrow</p>
                            </div>
                            <span className="text-xs text-slate-500">2 hours ago</span>
                        </div>
                        
                        <div className="flex items-center p-4 bg-slate-50/50 rounded-xl">
                            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mr-4">
                                <Video className="h-5 w-5 text-emerald-600" />
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-slate-900">AI consultation completed</p>
                                <p className="text-sm text-slate-600">Heart health assessment with Dr. Sarah AI</p>
                            </div>
                            <span className="text-xs text-slate-500">1 day ago</span>
                        </div>
                        
                        <div className="flex items-center p-4 bg-slate-50/50 rounded-xl">
                            <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center mr-4">
                                <FileText className="h-5 w-5 text-violet-600" />
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-slate-900">Health records updated</p>
                                <p className="text-sm text-slate-600">Blood pressure readings uploaded</p>
                            </div>
                            <span className="text-xs text-slate-500">3 days ago</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DashboardPage