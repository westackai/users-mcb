'use client'
 
import React, { useState } from 'react'
import { 
    FileText, 
    Search, 
    Filter, 
    Download, 
    Eye, 
    ChevronRight,
    ChevronDown,
    Pill,
    Heart,
    Brain,
    Activity,
    CheckCircle,
    Clock as ClockIcon,
    Stethoscope,
    TrendingUp
} from 'lucide-react'

// Mock data - replace with actual API calls
const medicalRecords = [
    {
        id: 1,
        sessionId: 1,
        sessionName: 'Anxiety & Depression Treatment',
        date: '2024-01-15',
        duration: '45 min',
        doctor: 'Dr. Marie Claire Bourque',
        specialty: 'Psychiatry',
        status: 'completed',
        diagnosis: {
            primary: 'Major Depressive Disorder (F32.1)',
            secondary: 'Generalized Anxiety Disorder (F41.1)',
            severity: 'Moderate',
            duration: '3 weeks'
        },
        symptoms: [
            'Persistent low mood',
            'Excessive worry',
            'Sleep disturbances',
            'Low energy',
            'Social withdrawal',
            'Difficulty concentrating'
        ],
        medications: [
            {
                name: 'Sertraline',
                dosage: '50mg',
                frequency: 'Once daily',
                purpose: 'Antidepressant',
                startDate: '2024-01-01',
                status: 'Active',
                sideEffects: ['Mild nausea', 'Insomnia']
            },
            {
                name: 'Alprazolam',
                dosage: '0.5mg',
                frequency: 'As needed',
                purpose: 'Anxiety relief',
                startDate: '2024-01-15',
                status: 'Active',
                sideEffects: ['Drowsiness', 'Dependency risk']
            }
        ],
        treatmentPlan: {
            goals: [
                'Reduce depressive symptoms by 50% within 4 weeks',
                'Improve sleep quality and duration',
                'Develop healthy coping mechanisms',
                'Increase social engagement gradually'
            ],
            interventions: [
                'Cognitive Behavioral Therapy (CBT)',
                'Mindfulness and meditation practices',
                'Regular exercise routine',
                'Sleep hygiene education',
                'Social skills training'
            ],
            timeline: '8-12 weeks with bi-weekly follow-ups'
        },
        progressNotes: [
            {
                date: '2024-01-15',
                note: 'Patient presents with moderate depression and anxiety. Started on sertraline 50mg daily and alprazolam PRN. Recommended daily breathing exercises and 20-minute walks.',
                mood: 'Depressed',
                energy: 'Low',
                sleep: 'Poor'
            },
            {
                date: '2024-01-08',
                note: 'Initial consultation. Patient reported worsening symptoms over past 3 weeks. Previous medication ineffective. New treatment plan initiated.',
                mood: 'Very depressed',
                energy: 'Very low',
                sleep: 'Very poor'
            }
        ],
        labResults: [
            {
                test: 'Complete Blood Count (CBC)',
                date: '2024-01-10',
                status: 'Normal',
                results: 'All values within normal range',
                notes: 'No abnormalities detected'
            },
            {
                test: 'Thyroid Function Tests',
                date: '2024-01-10',
                status: 'Normal',
                results: 'TSH: 2.1 mIU/L, T4: 1.2 ng/dL',
                notes: 'Thyroid function normal'
            }
        ],
        recommendations: [
            'Continue current medication regimen',
            'Practice 4-7-8 breathing technique 3x daily',
            'Maintain regular sleep schedule (10 PM - 6 AM)',
            'Daily 20-minute walks',
            'Journal thoughts and feelings',
            'Limit caffeine and alcohol intake',
            'Follow-up in 2 weeks'
        ]
    },
    {
        id: 2,
        sessionId: 2,
        sessionName: 'PTSD & Trauma Therapy',
        date: '2024-01-12',
        duration: '60 min',
        doctor: 'Dr. Marie Claire Bourque',
        specialty: 'Psychiatry',
        status: 'completed',
        diagnosis: {
            primary: 'Post-Traumatic Stress Disorder (F43.1)',
            secondary: 'Complex Trauma',
            severity: 'Moderate to Severe',
            duration: '6 months'
        },
        symptoms: [
            'Intrusive memories',
            'Nightmares',
            'Hypervigilance',
            'Emotional numbness',
            'Avoidance behaviors',
            'Flashbacks'
        ],
        medications: [
            {
                name: 'Prazosin',
                dosage: '2mg',
                frequency: 'Once daily at bedtime',
                purpose: 'Nightmare suppression',
                startDate: '2024-01-05',
                status: 'Active',
                sideEffects: ['Dizziness', 'Low blood pressure']
            }
        ],
        treatmentPlan: {
            goals: [
                'Reduce PTSD symptoms by 40% within 8 weeks',
                'Improve sleep quality and reduce nightmares',
                'Develop grounding techniques for flashbacks',
                'Process trauma memories safely'
            ],
            interventions: [
                'Eye Movement Desensitization and Reprocessing (EMDR)',
                'Trauma-focused Cognitive Behavioral Therapy',
                'Grounding and mindfulness exercises',
                'Progressive muscle relaxation',
                'Safe place visualization'
            ],
            timeline: '12-16 weeks with weekly sessions'
        },
        progressNotes: [
            {
                date: '2024-01-12',
                note: 'EMDR session 3 completed. Patient showing improvement in flashback frequency. Grounding techniques effective. Nightmares reduced with prazosin.',
                mood: 'Anxious but hopeful',
                energy: 'Moderate',
                sleep: 'Improving'
            }
        ],
        labResults: [],
        recommendations: [
            'Continue EMDR therapy weekly',
            'Practice grounding techniques daily',
            'Use safe place visualization before sleep',
            'Maintain medication compliance',
            'Avoid trauma triggers when possible',
            'Follow-up in 1 week'
        ]
    }
]

const RecordsPage = () => {
    const [searchQuery, setSearchQuery] = useState('')
    const [filterStatus, setFilterStatus] = useState('all')
    const [expandedRecords, setExpandedRecords] = useState<Set<number>>(new Set())
    const [selectedRecord, setSelectedRecord] = useState<any>(null)

    const toggleRecord = (recordId: number) => {
        const newExpanded = new Set(expandedRecords)
        if (newExpanded.has(recordId)) {
            newExpanded.delete(recordId)
        } else {
            newExpanded.add(recordId)
        }
        setExpandedRecords(newExpanded)
    }

    const filteredRecords = medicalRecords.filter(record => {
        const matchesSearch = record.sessionName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            record.diagnosis.primary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            record.doctor.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesStatus = filterStatus === 'all' || record.status === filterStatus
        return matchesSearch && matchesStatus
    })

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Medical Records</h1>
                    <p className="text-gray-600">View your complete medical history and treatment records</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Search and Filter Bar */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search records, diagnoses, or medications..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        
                        {/* Filter */}
                        <div className="flex gap-3">
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="all">All Records</option>
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

                {/* Medical Records */}
                <div className="space-y-6">
                    {filteredRecords.map((record) => (
                        <div key={record.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            {/* Record Header */}
                            <div 
                                className="p-6 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                                onClick={() => toggleRecord(record.id)}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <FileText className="h-6 w-6 text-blue-500" />
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">{record.sessionName}</h3>
                                            <p className="text-sm text-gray-600">{record.diagnosis.primary}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <div className="text-right">
                                            <div className="text-sm text-gray-500">{record.date}</div>
                                            <div className="text-xs text-gray-400">{record.duration}</div>
                                        </div>
                                        {expandedRecords.has(record.id) ? (
                                            <ChevronDown className="h-5 w-5 text-gray-400" />
                                        ) : (
                                            <ChevronRight className="h-5 w-5 text-gray-400" />
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Record Content */}
                            {expandedRecords.has(record.id) && (
                                <div className="border-t border-gray-100">
                                    <div className="p-6 space-y-6">
                                        {/* Diagnosis Section */}
                                        <div>
                                            <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                                                <Stethoscope className="h-5 w-5 text-blue-600 mr-2" />
                                                Diagnosis & Assessment
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="bg-blue-50 p-4 rounded-lg">
                                                    <h5 className="font-medium text-blue-900 mb-2">Primary Diagnosis</h5>
                                                    <p className="text-blue-800">{record.diagnosis.primary}</p>
                                                    <p className="text-sm text-blue-600 mt-1">Severity: {record.diagnosis.severity}</p>
                                                </div>
                                                <div className="bg-green-50 p-4 rounded-lg">
                                                    <h5 className="font-medium text-green-900 mb-2">Secondary Diagnosis</h5>
                                                    <p className="text-green-800">{record.diagnosis.secondary}</p>
                                                    <p className="text-sm text-green-600 mt-1">Duration: {record.diagnosis.duration}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Symptoms */}
                                        <div>
                                            <h4 className="text-lg font-semibold text-gray-900 mb-3">Symptoms</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {record.symptoms.map((symptom, index) => (
                                                    <span 
                                                        key={index}
                                                        className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full"
                                                    >
                                                        {symptom}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Medications */}
                                        <div>
                                            <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                                                <Pill className="h-5 w-5 text-purple-600 mr-2" />
                                                Current Medications
                                            </h4>
                                            <div className="space-y-3">
                                                {record.medications.map((med, index) => (
                                                    <div key={index} className="bg-purple-50 p-4 rounded-lg">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <h5 className="font-medium text-purple-900">{med.name}</h5>
                                                            <span className={`px-2 py-1 text-xs rounded-full ${
                                                                med.status === 'Active' 
                                                                    ? 'bg-green-100 text-green-800' 
                                                                    : 'bg-gray-100 text-gray-800'
                                                            }`}>
                                                                {med.status}
                                                            </span>
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                                            <div>
                                                                <span className="text-purple-700">Dosage:</span> {med.dosage}
                                                            </div>
                                                            <div>
                                                                <span className="text-purple-700">Frequency:</span> {med.frequency}
                                                            </div>
                                                            <div>
                                                                <span className="text-purple-700">Purpose:</span> {med.purpose}
                                                            </div>
                                                            <div>
                                                                <span className="text-purple-700">Started:</span> {med.startDate}
                                                            </div>
                                                        </div>
                                                        {med.sideEffects.length > 0 && (
                                                            <div className="mt-2">
                                                                <span className="text-purple-700 text-sm">Side Effects:</span>
                                                                <div className="flex flex-wrap gap-1 mt-1">
                                                                    {med.sideEffects.map((effect, idx) => (
                                                                        <span key={idx} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">
                                                                            {effect}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Treatment Plan */}
                                        <div>
                                            <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                                                <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
                                                Treatment Plan
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <h5 className="font-medium text-gray-900 mb-2">Treatment Goals</h5>
                                                    <ul className="space-y-2">
                                                        {record.treatmentPlan.goals.map((goal, index) => (
                                                            <li key={index} className="flex items-start">
                                                                <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                                                                <span className="text-gray-700">{goal}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                                <div>
                                                    <h5 className="font-medium text-gray-900 mb-2">Interventions</h5>
                                                    <ul className="space-y-2">
                                                        {record.treatmentPlan.interventions.map((intervention, index) => (
                                                            <li key={index} className="flex items-start">
                                                                <Activity className="h-4 w-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                                                                <span className="text-gray-700">{intervention}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                                                <span className="text-blue-800 font-medium">Timeline:</span> {record.treatmentPlan.timeline}
                                            </div>
                                        </div>

                                        {/* Progress Notes */}
                                        <div>
                                            <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                                                <FileText className="h-5 w-5 text-orange-600 mr-2" />
                                                Progress Notes
                                            </h4>
                                            <div className="space-y-3">
                                                {record.progressNotes.map((note, index) => (
                                                    <div key={index} className="bg-orange-50 p-4 rounded-lg">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <span className="text-sm font-medium text-orange-800">{note.date}</span>
                                                            <div className="flex items-center space-x-3 text-xs">
                                                                <span className="flex items-center">
                                                                    <Heart className="h-3 w-3 mr-1" />
                                                                    {note.mood}
                                                                </span>
                                                                <span className="flex items-center">
                                                                    <Activity className="h-3 w-3 mr-1" />
                                                                    {note.energy}
                                                                </span>
                                                                <span className="flex items-center">
                                                                    <ClockIcon className="h-3 w-3 mr-1" />
                                                                    {note.sleep}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <p className="text-orange-800">{note.note}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Lab Results */}
                                        {record.labResults.length > 0 && (
                                            <div>
                                                <h4 className="text-lg font-semibold text-gray-900 mb-3">Lab Results</h4>
                                                <div className="space-y-3">
                                                    {record.labResults.map((lab, index) => (
                                                        <div key={index} className="bg-gray-50 p-4 rounded-lg">
                                                            <div className="flex items-center justify-between mb-2">
                                                                <h5 className="font-medium text-gray-900">{lab.test}</h5>
                                                                <span className={`px-2 py-1 text-xs rounded-full ${
                                                                    lab.status === 'Normal' 
                                                                        ? 'bg-green-100 text-green-800' 
                                                                        : 'bg-yellow-100 text-yellow-800'
                                                                }`}>
                                                                    {lab.status}
                                                                </span>
                                                            </div>
                                                            <p className="text-gray-700 text-sm">{lab.results}</p>
                                                            {lab.notes && (
                                                                <p className="text-gray-600 text-xs mt-1">{lab.notes}</p>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Recommendations */}
                                        <div>
                                            <h4 className="text-lg font-semibold text-gray-900 mb-3">Recommendations</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                {record.recommendations.map((rec, index) => (
                                                    <div key={index} className="flex items-start">
                                                        <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                                                        <span className="text-gray-700">{rec}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                            <div className="text-sm text-gray-600">
                                                Record ID: {record.id} | Session: {record.sessionId}
                                            </div>
                                            <div className="flex space-x-2">
                                                <button className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200 flex items-center">
                                                    <Eye className="h-4 w-4 mr-1" />
                                                    View Full Record
                                                </button>
                                                <button className="px-4 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200 flex items-center">
                                                    <Download className="h-4 w-4 mr-1" />
                                                    Download PDF
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {filteredRecords.length === 0 && (
                    <div className="text-center py-12">
                        <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No medical records found</h3>
                        <p className="text-gray-600">Try adjusting your search or filters to find your records.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default RecordsPage