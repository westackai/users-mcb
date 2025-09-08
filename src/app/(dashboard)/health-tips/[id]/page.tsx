'use client'
export const runtime = 'edge';

import React, { useState } from 'react'
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
    ExternalLink
} from 'lucide-react'
import Link from 'next/link';
import Image from 'next/image';
import { doctorImage2 } from '@/assets';

interface HealthTip {
    id: string
    title: string
    category: string
    description: string
    content: string
    readTime: string
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
    tags: string[]
    lastUpdated: string
    author?: {
        name: string
        title: string
        experience: string
        rating: number
        patients: number
    }
    keyPoints?: string[]
    warnings?: string[]
}

const HealthTipDetailPage = () => {
    const params = useParams()
    const router = useRouter()
    const tipId = params.id as string
    const [isBookmarked, setIsBookmarked] = useState(false)
    const [showShareMenu, setShowShareMenu] = useState(false)

    // Health tips data
    const healthTips: HealthTip[] = [
        {
            id: '1',
            title: 'Understanding ADHD: A Comprehensive Guide',
            category: 'mental-health',
            description: 'Learn about ADHD symptoms, diagnosis, and treatment options for children and adults.',
            content: `ADHD (Attention Deficit Hyperactivity Disorder) is a neurodevelopmental condition that affects attention, impulse control, and activity levels.

Key Symptoms:
• Inattention: Difficulty focusing, forgetfulness, disorganization
• Hyperactivity: Excessive movement, restlessness, talking excessively
• Impulsivity: Acting without thinking, interrupting others

Diagnosis involves:
1. Comprehensive assessment by healthcare professionals
2. Rating scales and questionnaires
3. Medical evaluation to rule out other conditions
4. Consideration of family history and developmental milestones

Treatment approaches include:
• Behavioral therapy and parent training
• Medication when appropriate
• School and workplace accommodations
• Lifestyle modifications

Early diagnosis and intervention can significantly improve outcomes and quality of life.`,
            readTime: '8 min read',
            difficulty: 'Intermediate',
            tags: ['ADHD', 'Mental Health', 'Children', 'Adults', 'Behavior'],
            lastUpdated: '2024-01-15',
            author: {
                name: 'Dr. MCB',
                title: 'Psychiatrist',
                experience: '20+ Years',
                rating: 4.9,
                patients: 2500
            },
            keyPoints: [
                'ADHD affects 5-7% of children worldwide',
                'Early intervention improves outcomes by 70%',
                'Combination therapy is most effective',
                'Support systems are crucial for success'
            ],
            warnings: [
                'Seek professional diagnosis before self-treatment',
                'Medication should be monitored by healthcare provider',
                'Behavioral changes take time to develop'
            ]
        },
        {
            id: '2',
            title: 'Depression: Signs, Symptoms, and Treatment',
            category: 'mental-health',
            description: 'Recognize the signs of depression and learn about effective treatment approaches.',
            content: `Depression is a serious mental health condition that affects millions of people worldwide.

Common Symptoms:
• Persistent sadness or emptiness
• Loss of interest in activities once enjoyed
• Changes in appetite and sleep patterns
• Fatigue and low energy
• Difficulty concentrating and making decisions
• Feelings of worthlessness or guilt
• Thoughts of death or suicide

Types of Depression:
• Major Depressive Disorder
• Persistent Depressive Disorder (Dysthymia)
• Seasonal Affective Disorder
• Postpartum Depression
• Bipolar Disorder

Treatment Options:
• Psychotherapy (Cognitive Behavioral Therapy, Interpersonal Therapy)
• Antidepressant medications
• Lifestyle changes (exercise, diet, sleep)
• Support groups and social connections
• Mindfulness and meditation practices

When to Seek Help:
• Symptoms lasting more than 2 weeks
• Interference with daily functioning
• Thoughts of self-harm
• Impact on relationships and work

Remember: Depression is treatable, and seeking help is a sign of strength.`,
            readTime: '10 min read',
            difficulty: 'Intermediate',
            tags: ['Depression', 'Mental Health', 'Mood Disorders', 'Treatment', 'Symptoms'],
            lastUpdated: '2024-01-20',
            author: {
                name: 'Dr. MCB',
                title: 'Psychologist',
                experience: '20+ Years',
                rating: 4.8,
                patients: 1800
            },
            keyPoints: [
                'Depression affects 280 million people globally',
                'Treatment success rate is 80-90%',
                'Early intervention prevents complications',
                'Social support is crucial for recovery'
            ],
            warnings: [
                'Suicidal thoughts require immediate help',
                'Medication effects vary by individual',
                'Recovery is a gradual process'
            ]
        },
        {
            id: '3',
            title: 'Anxiety Disorders: Understanding and Coping',
            category: 'mental-health',
            description: 'Learn about different types of anxiety disorders and effective coping strategies.',
            content: `Anxiety disorders are among the most common mental health conditions, affecting people of all ages.

Types of Anxiety Disorders:
• Generalized Anxiety Disorder (GAD)
• Panic Disorder
• Social Anxiety Disorder
• Specific Phobias
• Obsessive-Compulsive Disorder (OCD)
• Post-Traumatic Stress Disorder (PTSD)

Physical Symptoms:
• Rapid heartbeat and breathing
• Sweating and trembling
• Nausea and dizziness
• Muscle tension and headaches
• Sleep disturbances

Cognitive Symptoms:
• Excessive worry and rumination
• Difficulty concentrating
• Irritability and restlessness
• Catastrophic thinking
• Fear of losing control

Coping Strategies:
• Deep breathing exercises
• Progressive muscle relaxation
• Cognitive restructuring
• Exposure therapy
• Regular exercise and meditation
• Limiting caffeine and alcohol

Professional Treatment:
• Cognitive Behavioral Therapy (CBT)
• Medication when appropriate
• Support groups
• Stress management techniques

Early intervention can prevent anxiety from becoming debilitating.`,
            readTime: '9 min read',
            difficulty: 'Intermediate',
            tags: ['Anxiety', 'Mental Health', 'Stress', 'Coping', 'Treatment'],
            lastUpdated: '2024-01-18',
            author: {
                name: 'Dr. MCB',
                title: 'Anxiety Specialist',
                experience: '20+ Years',
                rating: 4.9,
                patients: 1200
            },
            keyPoints: [
                'Anxiety affects 40 million adults in the US',
                'CBT is 70-80% effective',
                'Lifestyle changes reduce symptoms by 50%',
                'Support networks are essential'
            ],
            warnings: [
                'Avoid self-medication with alcohol',
                'Panic attacks are not dangerous',
                'Professional help is recommended'
            ]
        },
        {
            id: '11',
            title: 'Heart Health: Prevention and Management',
            category: 'cardiovascular',
            description: 'Essential tips for maintaining a healthy heart and preventing cardiovascular disease.',
            content: `Maintaining heart health is crucial for overall well-being and longevity.

Prevention Strategies:
• Regular exercise (150 minutes moderate activity weekly)
• Heart-healthy diet (Mediterranean diet recommended)
• Maintain healthy weight and blood pressure
• Avoid smoking and limit alcohol
• Regular health check-ups

Risk Factors to Monitor:
• High blood pressure
• High cholesterol
• Diabetes
• Family history
• Age and gender

Warning Signs:
• Chest pain or discomfort
• Shortness of breath
• Fatigue
• Swelling in legs/ankles
• Irregular heartbeat

Lifestyle Changes:
• Increase physical activity gradually
• Reduce sodium intake
• Eat more fruits, vegetables, and whole grains
• Manage stress through relaxation techniques
• Get adequate sleep (7-9 hours nightly)

Remember: Small changes can make a big difference in heart health!`,
            readTime: '6 min read',
            difficulty: 'Beginner',
            tags: ['Heart Health', 'Prevention', 'Exercise', 'Diet', 'Cardiovascular'],
            lastUpdated: '2024-01-10',
            author: {
                name: 'Dr. MCB',
                title: 'Cardiologist',
                experience: '20+ Years',
                rating: 4.8,
                patients: 3500
            },
            keyPoints: [
                'Heart disease is the leading cause of death',
                'Prevention reduces risk by 80%',
                'Exercise improves heart function',
                'Diet changes have immediate benefits'
            ],
            warnings: [
                'Chest pain requires immediate attention',
                'Start exercise gradually',
                'Monitor blood pressure regularly'
            ]
        },
        {
            id: '12',
            title: 'Development Milestones',
            category: 'pediatrics',
            description: 'Track your child\'s development with age-appropriate milestones and when to seek help.',
            content: `Understanding child development milestones helps parents track their child's progress and identify potential concerns early.

Infant Development (0-12 months):
• 2 months: Smiles, follows objects with eyes
• 4 months: Rolls over, babbles, reaches for objects
• 6 months: Sits without support, responds to name
• 9 months: Crawls, stands with support, says "mama/dada"
• 12 months: Walks with support, says 2-3 words

Toddler Development (1-3 years):
• 18 months: Walks independently, says 10+ words
• 2 years: Runs, climbs stairs, 2-word phrases
• 3 years: Jumps, dresses self, 3-word sentences

Preschool Development (3-5 years):
• 4 years: Hops on one foot, counts to 10
• 5 years: Rides tricycle, tells stories, knows colors

When to Seek Help:
• Not reaching milestones within expected timeframe
• Loss of previously acquired skills
• Concerns about hearing, vision, or movement
• Behavioral or social difficulties

Early intervention can address many developmental concerns effectively.`,
            readTime: '7 min read',
            difficulty: 'Beginner',
            tags: ['Child Development', 'Milestones', 'Infants', 'Toddlers', 'Preschool'],
            lastUpdated: '2024-01-12',
            author: {
                name: 'Dr. MCB',
                title: 'Pediatrician',
                experience: '20+ Years',
                rating: 4.8,
                patients: 2800
            },
            keyPoints: [
                'Each child develops at their own pace',
                'Early intervention is most effective',
                'Parent involvement is crucial',
                'Regular check-ups catch issues early'
            ],
            warnings: [
                'Don\'t compare children directly',
                'Seek help if concerned',
                'Trust your instincts as a parent'
            ]
        },
        {
            id: '13',
            title: 'Sleep Hygiene: Better Sleep for Better Health',
            category: 'mental-health',
            description: 'Improve your sleep quality with proven techniques and healthy sleep habits.',
            content: `Quality sleep is essential for physical and mental health, affecting everything from mood to immune function.

Sleep Hygiene Practices:
• Maintain consistent sleep schedule
• Create relaxing bedtime routine
• Optimize sleep environment (cool, dark, quiet)
• Avoid screens 1 hour before bed
• Limit caffeine after 2 PM

Bedroom Environment:
• Temperature: 65-68°F (18-20°C)
• Darkness: Use blackout curtains
• Noise: White noise machine if needed
• Comfort: Quality mattress and pillows

Pre-Bedtime Activities:
• Reading (physical books, not screens)
• Gentle stretching or yoga
• Warm bath or shower
• Meditation or deep breathing
• Journaling to clear mind

Avoid Before Bed:
• Large meals
• Intense exercise
• Alcohol and nicotine
• Stressful conversations
• Work-related activities

Sleep Disorders to Watch For:
• Insomnia
• Sleep apnea
• Restless leg syndrome
• Narcolepsy

Consult healthcare provider if sleep problems persist.`,
            readTime: '5 min read',
            difficulty: 'Beginner',
            tags: ['Sleep', 'Mental Health', 'Wellness', 'Habits', 'Health'],
            lastUpdated: '2024-01-08',
            author: {
                name: 'Dr. MCB',
                title: 'Sleep Medicine Specialist',
                experience: '20+ Years',
                rating: 4.9,
                patients: 2000
            },
            keyPoints: [
                'Sleep affects all body systems',
                'Consistency is key to good sleep',
                'Environment matters more than duration',
                'Technology disrupts sleep patterns'
            ],
            warnings: [
                'Sleep medications can be addictive',
                'Chronic insomnia needs medical attention',
                'Sleep apnea is serious and treatable'
            ]
        },
        {
            id: '14',
            title: 'Nutrition Basics for Optimal Health',
            category: 'all',
            description: 'Fundamental nutrition principles to support your overall health and well-being.',
            content: `Good nutrition is the foundation of health, providing energy and nutrients your body needs to function properly.

Macronutrients:
• Proteins: Build and repair tissues (lean meats, fish, legumes)
• Carbohydrates: Primary energy source (whole grains, fruits, vegetables)
• Fats: Essential for hormone production and nutrient absorption (healthy oils, nuts, avocados)

Micronutrients:
• Vitamins: Support various body functions
• Minerals: Essential for bone health, muscle function, and more

Daily Recommendations:
• Fruits: 2-3 servings
• Vegetables: 3-5 servings
• Whole grains: 6-8 servings
• Protein: 2-3 servings
• Dairy: 2-3 servings
• Healthy fats: Moderate amounts

Hydration:
• Drink 8-10 glasses of water daily
• More if exercising or in hot weather
• Limit sugary drinks and alcohol

Meal Planning Tips:
• Plan meals ahead
• Include variety of colors
• Cook at home when possible
• Practice portion control
• Listen to hunger cues

Remember: Small, sustainable changes are more effective than drastic diets.`,
            readTime: '6 min read',
            difficulty: 'Beginner',
            tags: ['Nutrition', 'Health', 'Diet', 'Wellness', 'Food'],
            lastUpdated: '2024-01-05',
            author: {
                name: 'Dr. MCB',
                title: 'Nutritionist',
                experience: '12+ Years',
                rating: 4.8,
                patients: 2200
            },
            keyPoints: [
                'Balanced nutrition prevents disease',
                'Whole foods are most beneficial',
                'Hydration affects all body functions',
                'Meal planning saves time and money'
            ],
            warnings: [
                'Avoid extreme diets',
                'Consult doctor before major changes',
                'Supplements don\'t replace food'
            ]
        }
    ]

    const selectedTip = healthTips.find(tip => tip.id === tipId)

    if (!selectedTip) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center bg-white rounded-xl shadow-sm border border-slate-200 p-12 max-w-md mx-4">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <AlertCircle className="h-8 w-8 text-red-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Health Tip Not Found</h2>
                    <p className="text-slate-600 mb-8">The health tip you're looking for doesn't exist or may have been moved.</p>
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

    const getCategoryIcon = (category: string) => {
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
            default:
                return BookOpen
        }
    }

    const getCategoryColor = (category: string) => {
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
            default:
                return 'bg-blue-500'
        }
    }

    const CategoryIcon = getCategoryIcon(selectedTip.category)
    const categoryColor = getCategoryColor(selectedTip.category)

    const handleShare = (method: string) => {
        const url = window.location.href
        const title = selectedTip.title

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
            <div className="bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-6 py-6">

                    {/* Category and Title Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            {/* Category Badge */}
                            <div className="flex items-center gap-2 mb-6">
                                <div className='flex items-center'>
                                    <button
                                        onClick={() => router.back()}
                                        className="flex items-center text-slate-600 hover:text-slate-900 px-2 transition-colors py-2 rounded-lg hover:bg-slate-100 !cursor-pointer"
                                    >
                                        <ArrowLeft className="h-5 w-5" />
                                    </button>
                                </div>
                                <div className={`p-2 rounded-lg ${categoryColor} mr-3`}>
                                    <CategoryIcon className="h-5 w-5 text-white" />
                                </div>
                                <span className="px-3 py-1 bg-slate-100 text-slate-700 text-sm font-medium rounded-full">
                                    {selectedTip.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                </span>
                            </div>

                            {/* Title */}
                            <h1 className="text-4xl font-bold text-slate-900 mb-4 leading-tight">
                                {selectedTip.title}
                            </h1>

                            {/* Description */}
                            <p className="text-xl text-slate-600 mb-6 leading-relaxed">
                                {selectedTip.description}
                            </p>

                            {/* Meta Information */}
                            <div className="flex flex-wrap items-center gap-4">
                                <div className="flex items-center text-slate-500">
                                    <Clock className="h-4 w-4 mr-2" />
                                    <span className="text-sm">{selectedTip.readTime}</span>
                                </div>
                                <div className="flex items-center text-slate-500">
                                    <Calendar className="h-4 w-4 mr-2" />
                                    <span className="text-sm">Updated {selectedTip.lastUpdated}</span>
                                </div>
                                <span className={`px-3 py-1 text-sm font-medium rounded-md ${selectedTip.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
                                    selectedTip.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                                        'bg-red-100 text-red-700'
                                    }`}>
                                    {selectedTip.difficulty}
                                </span>
                            </div>
                        </div>

                        {/* Doctor Profile */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                            <div className="text-center">
                                <div className="w-20 h-20 bg-blue-100 relative rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Image fill className='object-cover' src={doctorImage2} alt="" />
                                    {/* <User className="h-10 w-10 text-blue-600" /> */}
                                </div>

                                <h3 className="text-lg font-semibold text-slate-900 mb-1">{selectedTip.author?.name}</h3>
                                <p className="text-slate-600 mb-4">{selectedTip.author?.title}</p>

                                <div className="space-y-2 mb-6">
                                    <div className="flex items-center justify-center">
                                        <Star className="h-4 w-4 text-yellow-500 mr-1" />
                                        <span className="text-sm font-medium text-slate-700">{selectedTip.author?.rating}</span>
                                        <span className="text-sm text-slate-500 ml-1">({selectedTip.author?.patients?.toLocaleString()} patients)</span>
                                    </div>
                                    <div className="flex items-center justify-center">
                                        <Award className="h-4 w-4 text-blue-500 mr-1" />
                                        <span className="text-sm text-slate-600">{selectedTip.author?.experience}</span>
                                    </div>
                                </div>

                                {/* <button className="w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                                    <MessageCircle className="h-4 w-4 inline mr-2" />
                                    Consult Doctor
                                </button> */}
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
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                                <Tag className="h-5 w-5 mr-2 text-blue-500" />
                                Related Topics
                            </h3>
                            <div className="grid grid-cols-3 gap-2">
                                {selectedTip.tags.map((tag, index) => (
                                    <div
                                        key={index}
                                        className="px-3 py-2 bg-slate-50 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer border border-slate-100"
                                    >
                                        <span className="text-sm font-medium">{tag}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">Detailed Information</h2>

                            <div className="prose prose-slate max-w-none">
                                <div className="whitespace-pre-line text-slate-700 leading-relaxed">
                                    {selectedTip.content.split('\n\n').map((paragraph, index) => (
                                        <div key={index} className="mb-6">
                                            {paragraph.split('\n').map((line, lineIndex) => (
                                                <p key={lineIndex} className={line.startsWith('•') ? 'flex items-start mb-2' : 'mb-4'}>
                                                    {line.startsWith('•') && (
                                                        <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                                    )}
                                                    <span className={line.startsWith('•') ? 'flex-1' : ''}>{line}</span>
                                                </p>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sticky Sidebar */}
                    <div className="lg:sticky lg:top-8 lg:h-fit">
                        <div className="space-y-6">
                            {/* Key Points */}
                            {selectedTip.keyPoints && (
                                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                                    <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                                        <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
                                        Key Points
                                    </h3>
                                    <div className="space-y-3">
                                        {selectedTip.keyPoints.map((point, index) => (
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

                            {/* Warnings */}
                            {selectedTip.warnings && (
                                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                                    <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                                        <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
                                        Important Warnings
                                    </h3>
                                    <div className="space-y-3">
                                        {selectedTip.warnings.map((warning, index) => (
                                            <div
                                                key={index}
                                                className="px-3 py-2 bg-red-50 text-slate-700 rounded-lg border border-red-100"
                                            >
                                                <span className="text-sm font-medium">{warning}</span>
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