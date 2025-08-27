'use client'
 
import React, { useState } from 'react'
import { 
    Check, 
    CreditCard, 
    Calendar, 
    Download, 
    Receipt,
    Star,
    Zap,
    Crown,
    Shield,
    Users,
    Clock,
    MessageSquare
} from 'lucide-react'

const BillingPage = () => {
    const [selectedPlan, setSelectedPlan] = useState('standard')

    const plans = [
        {
            id: 'base',
            name: 'Base',
            price: 0,
            description: 'Perfect for trying out our service',
            features: [
                '5 minutes consultation per month',
                'Email support',
                'Standard response time'
            ],
            icon: Shield,
            popular: false
        },
        {
            id: 'standard',
            name: 'Standard',
            price: 99,
            description: 'Ideal for regular consultations',
            features: [
                '30 minutes consultation per month',
                'Priority support',
                'Video consultations',
                'Prescription management',
                'Health analytics'
            ],
            icon: Zap,
            popular: true
        },
        {
            id: 'pro',
            name: 'Pro',
            price: 189,
            description: 'For families and businesses',
            features: [
                '90 minutes consultation per month',
                '24/7 premium support',
                'Video consultations',
                'Advanced diagnostics',
                'Prescription management',
                'Priority scheduling',
                
            ],
            icon: Crown,
            popular: false
        }
    ]

    const billingHistory = [
        {
            id: 1,
            date: '2024-01-15',
            amount: 99.00,
            status: 'Paid',
            description: 'Standard Plan - Monthly',
            invoice: 'INV-2024-001'
        },
        {
            id: 2,
            date: '2024-01-01',
            amount: 99.00,
            status: 'Paid',
            description: 'Standard Plan - Monthly',
            invoice: 'INV-2024-002'
        },
        {
            id: 3,
            date: '2023-12-01',
            amount: 99.00,
            status: 'Paid',
            description: 'Standard Plan - Monthly',
            invoice: 'INV-2023-012'
        }
    ]

    const paymentMethods = [
        {
            id: 1,
            type: 'Visa',
            last4: '4242',
            expiry: '12/25',
            isDefault: true
        },
        {
            id: 2,
            type: 'Mastercard',
            last4: '8888',
            expiry: '08/26',
            isDefault: false
        }
    ]

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 px-6 py-4">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-2xl font-bold text-slate-900">Billing & Subscription</h1>
                    {/* <p className="text-slate-600">Manage your subscription and billing preferences</p> */}
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Current Plan */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-xl font-semibold text-slate-900">Current Plan</h2>
                            <p className="text-slate-600">You're currently on the Standard plan</p>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-bold text-slate-900">$99.00</p>
                            <p className="text-slate-600">per month</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center text-sm text-slate-600">
                            <Calendar className="h-4 w-4 mr-2" />
                            Next billing: January 1, 2024
                        </div>
                        <div className="flex items-center space-x-4">
                            <Clock className="h-4 w-4 mr-2" />
                            30 minutes remaining
                        </div>
                    </div>
                </div>

                {/* Subscription Plans */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-slate-900">Choose Your Plan</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {plans.map((plan) => {
                            const Icon = plan.icon
                            return (
                                <div
                                    key={plan.id}
                                    className={`relative bg-white rounded-xl border-2 p-6 transition-all duration-200 hover:shadow-lg flex flex-col ${
                                        selectedPlan === plan.id
                                            ? 'border-blue-500 shadow-lg'
                                            : 'border-slate-200 hover:border-slate-300'
                                    }`}
                                >
                                    {plan.popular && (
                                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                            <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                                                Most Popular
                                            </span>
                                        </div>
                                    )}
                                    
                                    <div className="text-center mb-6">
                                        <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                                            <Icon className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-slate-900 mb-2">{plan.name}</h3>
                                        <p className="text-slate-600 text-sm mb-4">{plan.description}</p>
                                        <div className="mb-4">
                                            <span className="text-3xl font-bold text-slate-900">
                                                {plan.price === 0 ? 'Free' : `$${plan.price}`}
                                            </span>
                                            <span className="text-slate-600">/month</span>
                                        </div>
                                    </div>

                                    <ul className="space-y-3 mb-6 flex-grow">
                                        {plan.features.map((feature, index) => (
                                            <li key={index} className="flex items-start">
                                                <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                                <span className="text-sm text-slate-700">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <div className="mt-auto">
                                        <button
                                            onClick={() => setSelectedPlan(plan.id)}
                                            className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                                                selectedPlan === plan.id
                                                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                            }`}
                                        >
                                            {selectedPlan === plan.id ? 'Current Plan' : 'Select Plan'}
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>


                {/* Billing History */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-slate-900">Billing History</h2>
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
                            <Download className="h-4 w-4 mr-2" />
                            Download All
                        </button>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-200">
                                    <th className="text-left py-3 px-4 font-medium text-slate-700">Date</th>
                                    <th className="text-left py-3 px-4 font-medium text-slate-700">Description</th>
                                    <th className="text-left py-3 px-4 font-medium text-slate-700">Amount</th>
                                    <th className="text-left py-3 px-4 font-medium text-slate-700">Status</th>
                                    <th className="text-left py-3 px-4 font-medium text-slate-700">Invoice</th>
                                    <th className="text-left py-3 px-4 font-medium text-slate-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {billingHistory.map((item) => (
                                    <tr key={item.id} className="border-b border-slate-100">
                                        <td className="py-3 px-4 text-sm text-slate-600">{item.date}</td>
                                        <td className="py-3 px-4 text-sm text-slate-900">{item.description}</td>
                                        <td className="py-3 px-4 text-sm font-medium text-slate-900">${item.amount.toFixed(2)}</td>
                                        <td className="py-3 px-4">
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-sm text-slate-600">{item.invoice}</td>
                                        <td className="py-3 px-4">
                                            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
                                                <Receipt className="h-4 w-4 mr-1" />
                                                Download
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BillingPage
