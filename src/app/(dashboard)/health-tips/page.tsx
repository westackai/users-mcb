'use client'
export const runtime = 'edge';

import React, { useState } from 'react'
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
    TrendingUp
} from 'lucide-react'

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
}

const HealthTipsPage = () => {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [selectedTip, setSelectedTip] = useState<HealthTip | null>(null)

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
            lastUpdated: '2024-01-15'
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
            lastUpdated: '2024-01-20'
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
            lastUpdated: '2024-01-18'
        },
        {
            id: '4',
            title: 'Bipolar Disorder: Managing Mood Swings',
            category: 'mental-health',
            description: 'Understanding bipolar disorder and strategies for managing extreme mood changes.',
            content: `Bipolar disorder is characterized by extreme mood swings that include emotional highs (mania) and lows (depression).

Types of Bipolar Disorder:
• Bipolar I: Full manic episodes
• Bipolar II: Hypomanic and depressive episodes
• Cyclothymia: Milder mood swings

Manic Episode Symptoms:
• Elevated mood and energy
• Decreased need for sleep
• Racing thoughts and rapid speech
• Impulsive behavior and poor judgment
• Grandiose ideas and inflated self-esteem

Depressive Episode Symptoms:
• Persistent sadness and hopelessness
• Loss of interest in activities
• Changes in appetite and sleep
• Fatigue and low energy
• Thoughts of death or suicide

Management Strategies:
• Medication adherence (mood stabilizers, antipsychotics)
• Regular therapy sessions
• Sleep schedule maintenance
• Stress reduction techniques
• Lifestyle monitoring (exercise, diet, routine)
• Support system involvement

Early Warning Signs:
• Changes in sleep patterns
• Increased energy or irritability
• Changes in social behavior
• Unusual spending or risk-taking

Long-term management requires ongoing treatment and lifestyle adjustments.`,
            readTime: '11 min read',
            difficulty: 'Advanced',
            tags: ['Bipolar Disorder', 'Mood Disorders', 'Mental Health', 'Mania', 'Depression'],
            lastUpdated: '2024-01-22'
        },
        {
            id: '5',
            title: 'Post-Traumatic Stress Disorder (PTSD)',
            category: 'mental-health',
            description: 'Understanding PTSD symptoms and evidence-based treatment approaches.',
            content: `PTSD develops after experiencing or witnessing a traumatic event that threatens life or safety.

Common Causes:
• Military combat
• Sexual assault or violence
• Natural disasters
• Serious accidents
• Childhood abuse or neglect
• Witnessing violence

Core Symptoms:
• Intrusive memories and flashbacks
• Avoidance of trauma-related reminders
• Negative changes in thinking and mood
• Hyperarousal and reactivity
• Sleep disturbances and nightmares

Impact on Daily Life:
• Difficulty maintaining relationships
• Problems at work or school
• Social isolation
• Substance abuse
• Physical health problems

Evidence-Based Treatments:
• Trauma-Focused Cognitive Behavioral Therapy
• Eye Movement Desensitization and Reprocessing (EMDR)
• Prolonged Exposure Therapy
• Medication (SSRIs, SNRIs)
• Group therapy and support

Self-Help Strategies:
• Grounding techniques
• Relaxation exercises
• Regular physical activity
• Maintaining routine
• Connecting with supportive people

Recovery is possible with appropriate treatment and support.`,
            readTime: '12 min read',
            difficulty: 'Advanced',
            tags: ['PTSD', 'Trauma', 'Mental Health', 'Treatment', 'Recovery'],
            lastUpdated: '2024-01-25'
        },
        {
            id: '6',
            title: 'Obsessive-Compulsive Disorder (OCD)',
            category: 'mental-health',
            description: 'Understanding OCD symptoms and effective treatment strategies.',
            content: `OCD is characterized by unwanted, intrusive thoughts (obsessions) and repetitive behaviors (compulsions).

Common Obsessions:
• Fear of contamination
• Unwanted sexual or violent thoughts
• Need for symmetry and order
• Fear of harming others
• Religious or moral concerns
• Doubt and uncertainty

Common Compulsions:
• Excessive cleaning and washing
• Checking and rechecking
• Counting and repeating
• Arranging and organizing
• Mental rituals
• Seeking reassurance

Impact on Daily Life:
• Time-consuming rituals
• Interference with work and relationships
• Significant distress and anxiety
• Avoidance of triggering situations
• Financial burden from compulsions

Treatment Approaches:
• Exposure and Response Prevention (ERP)
• Cognitive Behavioral Therapy
• Medication (SSRIs, clomipramine)
• Mindfulness and acceptance strategies
• Family therapy and support

Recovery Strategies:
• Gradual exposure to fears
• Delaying or reducing compulsions
• Stress management techniques
• Building healthy routines
• Support group participation

OCD is highly treatable with the right approach.`,
            readTime: '10 min read',
            difficulty: 'Intermediate',
            tags: ['OCD', 'Anxiety', 'Mental Health', 'Treatment', 'Behavioral Therapy'],
            lastUpdated: '2024-01-28'
        },
        {
            id: '7',
            title: 'Eating Disorders: Recognition and Recovery',
            category: 'mental-health',
            description: 'Understanding different types of eating disorders and the path to recovery.',
            content: `Eating disorders are serious mental health conditions that affect eating behaviors and body image.

Types of Eating Disorders:
• Anorexia Nervosa: Restriction of food intake
• Bulimia Nervosa: Binge eating followed by purging
• Binge Eating Disorder: Uncontrolled overeating
• Avoidant/Restrictive Food Intake Disorder
• Other Specified Feeding or Eating Disorders

Warning Signs:
• Significant weight changes
• Preoccupation with food and body
• Avoidance of social eating
• Excessive exercise
• Use of laxatives or diet pills
• Distorted body image

Physical Complications:
• Heart problems
• Bone density loss
• Digestive issues
• Hormonal imbalances
• Dental problems
• Organ damage

Treatment Approaches:
• Medical monitoring and stabilization
• Nutritional counseling
• Individual and family therapy
• Group therapy and support
• Medication when appropriate
• Inpatient or outpatient programs

Recovery Support:
• Building healthy relationships with food
• Addressing underlying emotional issues
• Developing coping skills
• Creating support networks
• Long-term maintenance strategies

Early intervention significantly improves recovery outcomes.`,
            readTime: '11 min read',
            difficulty: 'Advanced',
            tags: ['Eating Disorders', 'Mental Health', 'Body Image', 'Recovery', 'Nutrition'],
            lastUpdated: '2024-01-30'
        },
        {
            id: '8',
            title: 'Schizophrenia: Understanding and Support',
            category: 'mental-health',
            description: 'Learn about schizophrenia symptoms, treatment, and how to support affected individuals.',
            content: `Schizophrenia is a complex mental health condition that affects how a person thinks, feels, and behaves.

Positive Symptoms (Added behaviors):
• Hallucinations (hearing voices, seeing things)
• Delusions (false beliefs)
• Disorganized thinking and speech
• Movement disorders

Negative Symptoms (Reduced behaviors):
• Reduced emotional expression
• Decreased motivation
• Social withdrawal
• Difficulty with daily activities
• Reduced speech

Cognitive Symptoms:
• Problems with attention and memory
• Difficulty processing information
• Poor decision-making
• Problems with executive function

Treatment Approaches:
• Antipsychotic medications
• Psychosocial interventions
• Cognitive behavioral therapy
• Family therapy and education
• Supported employment and housing
• Social skills training

Support Strategies:
• Medication adherence support
• Creating stable environments
• Building social connections
• Stress reduction
• Crisis planning
• Family education and support

Recovery is possible with comprehensive treatment and support.`,
            readTime: '13 min read',
            difficulty: 'Advanced',
            tags: ['Schizophrenia', 'Mental Health', 'Psychosis', 'Treatment', 'Support'],
            lastUpdated: '2024-02-01'
        },
        {
            id: '9',
            title: 'Borderline Personality Disorder (BPD)',
            category: 'mental-health',
            description: 'Understanding BPD symptoms and evidence-based treatment approaches.',
            content: `Borderline Personality Disorder is characterized by emotional instability, relationship difficulties, and impulsive behavior.

Core Symptoms:
• Intense emotional reactions
• Unstable relationships
• Impulsive behaviors
• Identity disturbance
• Fear of abandonment
• Chronic feelings of emptiness
• Difficulty regulating emotions

Relationship Patterns:
• Idealization and devaluation
• Fear of rejection
• Intense but unstable connections
• Difficulty maintaining boundaries
• Emotional dependency

Impulsive Behaviors:
• Risky sexual behavior
• Substance abuse
• Self-harm and suicidal thoughts
• Reckless driving
• Spending sprees

Treatment Approaches:
• Dialectical Behavior Therapy (DBT)
• Mentalization-Based Treatment
• Schema-Focused Therapy
• Medication for specific symptoms
• Group therapy and skills training

Recovery Strategies:
• Learning emotion regulation skills
• Building healthy relationships
• Developing distress tolerance
• Creating stable routines
• Building support networks

BPD is highly treatable with specialized therapy approaches.`,
            readTime: '12 min read',
            difficulty: 'Advanced',
            tags: ['BPD', 'Personality Disorders', 'Mental Health', 'Emotional Regulation', 'DBT'],
            lastUpdated: '2024-02-03'
        },
        {
            id: '10',
            title: 'Autism Spectrum Disorder (ASD)',
            category: 'mental-health',
            description: 'Understanding ASD characteristics and strategies for support and development.',
            content: `Autism Spectrum Disorder is a neurodevelopmental condition that affects social communication and behavior.

Core Characteristics:
• Social communication challenges
• Restricted and repetitive behaviors
• Sensory sensitivities
• Different ways of learning and thinking
• Unique strengths and abilities

Social Communication:
• Difficulty with social cues
• Challenges in conversation
• Different understanding of relationships
• Preference for routine
• Special interests and passions

Sensory Processing:
• Hypersensitivity to sounds, lights, textures
• Hyposensitivity to pain or temperature
• Seeking or avoiding sensory input
• Difficulty with transitions
• Need for predictability

Support Strategies:
• Early intervention programs
• Speech and language therapy
• Occupational therapy
• Social skills training
• Educational accommodations
• Family support and education

Strengths and Abilities:
• Attention to detail
• Pattern recognition
• Deep knowledge in areas of interest
• Honesty and directness
• Unique problem-solving approaches

Every person with ASD is unique with their own strengths and challenges.`,
            readTime: '10 min read',
            difficulty: 'Intermediate',
            tags: ['Autism', 'ASD', 'Neurodevelopmental', 'Social Skills', 'Support'],
            lastUpdated: '2024-02-05'
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
            lastUpdated: '2024-01-10'
        },
        {
            id: '12',
            title: 'Child Development Milestones',
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
            lastUpdated: '2024-01-12'
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
            lastUpdated: '2024-01-08'
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
            lastUpdated: '2024-01-05'
        }
    ]

    const filteredTips = healthTips.filter(tip => {
        const matchesSearch = tip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             tip.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             tip.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        
        const matchesCategory = selectedCategory === 'all' || tip.category === selectedCategory
        
        return matchesSearch && matchesCategory
    })

    const handleTipSelect = (tip: HealthTip) => {
        setSelectedTip(tip)
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 px-6 py-4">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-2xl font-bold text-slate-900">Health Tips & Education</h1>
                    <p className="text-slate-600">Learn about health topics and get expert advice</p>
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
                                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        
                        {/* Category Filter */}
                        <div className="flex items-center space-x-2">
                            <Filter className="h-5 w-5 text-slate-400" />
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

                {/* Health Tips Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTips.map((tip) => (
                        <div
                            key={tip.id}
                            className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group"
                            onClick={() => handleTipSelect(tip)}
                        >
                            <div className="p-6">
                                {/* Category Badge */}
                                <div className="flex items-center justify-between mb-4">
                                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                                        {tip.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                    </span>
                                    <div className="flex items-center space-x-2 text-sm text-slate-500">
                                        <Clock className="h-4 w-4" />
                                        <span>{tip.readTime}</span>
                                    </div>
                                </div>

                                {/* Title and Description */}
                                <h3 className="font-semibold text-slate-900 mb-3 text-lg leading-tight group-hover:text-blue-600 transition-colors">
                                    {tip.title}
                                </h3>
                                <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                                    {tip.description}
                                </p>

                                {/* Tags */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {tip.tags.slice(0, 3).map((tag, index) => (
                                        <span
                                            key={index}
                                            className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                    {tip.tags.length > 3 && (
                                        <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md">
                                            +{tip.tags.length - 3}
                                        </span>
                                    )}
                                </div>

                                {/* Difficulty and Read More */}
                                <div className="flex items-center justify-between">
                                    <span className={`px-2 py-1 text-xs font-medium rounded-md ${
                                        tip.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
                                        tip.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                                        'bg-red-100 text-red-700'
                                    }`}>
                                        {tip.difficulty}
                                    </span>
                                    <div className="flex items-center text-blue-600 text-sm font-medium group-hover:text-blue-700">
                                        Read More
                                        <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* No Results */}
                {filteredTips.length === 0 && (
                    <div className="text-center py-12">
                        <BookOpen className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-slate-900 mb-2">No health tips found</h3>
                        <p className="text-slate-600">Try adjusting your search or category filter.</p>
                    </div>
                )}
            </div>

            {/* Tip Details Modal */}
            {selectedTip && (
                <div className="fixed inset-0 bg-gray-500/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-8">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-3xl font-bold text-slate-900">{selectedTip.title}</h2>
                                <button
                                    onClick={() => setSelectedTip(null)}
                                    className="text-slate-400 hover:text-slate-600"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Tip Meta */}
                            <div className="flex items-center space-x-6 mb-6 text-sm text-slate-600">
                                <span className="flex items-center">
                                    <Clock className="h-4 w-4 mr-2" />
                                    {selectedTip.readTime}
                                </span>
                                <span className={`px-2 py-1 rounded-md font-medium ${
                                    selectedTip.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
                                    selectedTip.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-red-100 text-red-700'
                                }`}>
                                    {selectedTip.difficulty}
                                </span>
                                <span>Updated {selectedTip.lastUpdated}</span>
                            </div>

                            {/* Content */}
                            <div className="prose prose-slate max-w-none">
                                <div className="whitespace-pre-line text-slate-700 leading-relaxed">
                                    {selectedTip.content}
                                </div>
                            </div>

                            {/* Tags */}
                            <div className="mt-8 pt-6 border-t border-slate-200">
                                <h4 className="font-medium text-slate-900 mb-3">Related Topics:</h4>
                                <div className="flex flex-wrap gap-2">
                                    {selectedTip.tags.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 bg-slate-100 text-slate-700 text-sm rounded-full"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default HealthTipsPage
