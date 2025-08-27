'use client'
export const runtime = 'edge';

import React, { useState } from 'react'
import {
    User,
    Edit2,
    Save,
    X,
    Phone,
    Mail,
    Calendar,
    MapPin,
    Heart,
    Shield,
    FileText,
    Camera
} from 'lucide-react'

const ProfilePage = () => {
    const [isEditing, setIsEditing] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phoneNumber: '(555) 123-4567',
        age: 25,
        gender: 'male',
    })
    const [originalData, setOriginalData] = useState({ ...formData })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, '')
        if (value.length > 10) value = value.slice(0, 10)

        if (value.length >= 6) {
            value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6)}`
        } else if (value.length >= 3) {
            value = `(${value.slice(0, 3)}) ${value.slice(3)}`
        }

        setFormData(prev => ({
            ...prev,
            phoneNumber: value
        }))
    }

    const handleEmergencyPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, '')
        if (value.length > 10) value = value.slice(0, 10)

        if (value.length >= 6) {
            value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6)}`
        } else if (value.length >= 3) {
            value = `(${value.slice(0, 3)}) ${value.slice(3)}`
        }

        setFormData(prev => ({
            ...prev,
            emergencyPhone: value
        }))
    }

    const handleEdit = () => {
        setIsEditing(true)
        setOriginalData({ ...formData })
    }

    const handleCancel = () => {
        setIsEditing(false)
        setFormData({ ...originalData })
    }

    const handleSave = async () => {
        setIsLoading(true)
        try {
            await new Promise(resolve => setTimeout(resolve, 1000))
            console.log('Updating profile with:', formData)
            setOriginalData({ ...formData })
            setIsEditing(false)
        } catch (error) {
            console.error('Profile update failed:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const hasChanges = JSON.stringify(formData) !== JSON.stringify(originalData)

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 px-6 py-4">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-2xl font-bold text-slate-900">Profile & Medical Information</h1>
                    {/* <p className="text-slate-600">Manage your personal and medical details</p> */}
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Profile Header */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-6">
                            <div className="relative">
                                <div className="h-20 w-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                    <User className="h-10 w-10 text-white" />
                                </div>
                                {/* {isEditing && (
                                    <button className="absolute -bottom-1 -right-1 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
                                        <Camera className="h-4 w-4" />
                                    </button>
                                )} */}
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900">{formData.firstName} {formData.lastName}</h2>
                                <p className="text-slate-600">{formData.email}</p>
                                <p className="text-sm text-slate-500">Member since January 2024</p>
                            </div>
                        </div>
                        <div className="flex space-x-3">
                            {!isEditing ? (
                                <button
                                    onClick={handleEdit}
                                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    <Edit2 className="h-4 w-4" />
                                    <span>Edit Profile</span>
                                </button>
                            ) : (
                                <>
                                    <button
                                        onClick={handleCancel}
                                        className="flex items-center space-x-2 bg-slate-500 text-white px-4 py-2 rounded-lg hover:bg-slate-600 transition-colors"
                                    >
                                        <X className="h-4 w-4" />
                                        <span>Cancel</span>
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        disabled={!hasChanges || isLoading}
                                        className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                <span>Saving...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Save className="h-4 w-4" />
                                                <span>Save Changes</span>
                                            </>
                                        )}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Profile Form */}
                <div className="w-full">
                    {/* Personal Information */}
                    <div className="space-y-6 w-full">
                        {/* Basic Information */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                                <User className="h-5 w-5 text-blue-600 mr-2" />
                                Personal Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">First Name</label>
                                    <input
                                        name="firstName"
                                        type="text"
                                        disabled={!isEditing}
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        className={`w-full px-3 py-2 text-black border rounded-lg transition-colors ${isEditing
                                                ? 'border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                                : 'border-slate-200 bg-slate-50 text-slate-500'
                                            }`}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Last Name</label>
                                    <input
                                        name="lastName"
                                        type="text"
                                        disabled={!isEditing}
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        className={`w-full px-3 py-2 text-black border rounded-lg transition-colors ${isEditing
                                                ? 'border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                                : 'border-slate-200 bg-slate-50 text-slate-500'
                                            }`}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Age</label>
                                    <input
                                        name="age"
                                        type="number"
                                        disabled={!isEditing}
                                        value={formData.age}
                                        onChange={handleInputChange}
                                        className={`w-full px-3 py-2 text-black border rounded-lg transition-colors ${isEditing
                                                ? 'border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                                : 'border-slate-200 bg-slate-50 text-slate-500'
                                            }`}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Gender</label>
                                    <select
                                        name="gender"
                                        disabled={!isEditing}
                                        value={formData.gender}
                                        onChange={handleSelectChange}
                                        className={`w-full px-3 py-2 text-black border rounded-lg transition-colors ${isEditing
                                                ? 'border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                                : 'border-slate-200 bg-slate-50 text-slate-500'
                                            }`}
                                    >
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                        <option value="prefer-not-to-say">Prefer not to say</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                                <Phone className="h-5 w-5 text-blue-600 mr-2" />
                                Contact Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                                    <input
                                        name="email"
                                        type="email"
                                        disabled={true}
                                        value={formData.email}
                                        className="w-full px-3 py-2 text-black border border-slate-200 bg-slate-50 text-slate-500 rounded-lg"
                                    />
                                    <p className="mt-1 text-xs text-slate-500">Email cannot be changed</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
                                    <input
                                        name="phoneNumber"
                                        type="tel"
                                        disabled={!isEditing}
                                        value={formData.phoneNumber}
                                        onChange={handlePhoneChange}
                                        className={`w-full px-3 py-2 border text-black rounded-lg transition-colors ${isEditing
                                                ? 'border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                                : 'border-slate-200 bg-slate-50 text-slate-500'
                                            }`}
                                    />
                                </div>
                            </div>
                        </div>


                    </div>

                    {/* Right Sidebar */}

                </div>
            </div>
        </div>
    )
}

export default ProfilePage
