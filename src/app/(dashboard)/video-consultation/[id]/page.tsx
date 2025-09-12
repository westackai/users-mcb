"use client";
export const runtime = 'edge';

import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

// Mock data for avatar information
const getAvatarData = (id: string) => {
    const avatars = [
        {
            "avatar_id": "2d1ed29014374809a9a8eab28b6aaa5f",
            "created_at": 1749719385,
            "is_public": false,
            "status": "ACTIVE",
            "name": "Mental Health Assistant",
            "image": "/avatar-1.png"
        },
        {
            "avatar_id": "Thaddeus_ProfessionalLook2_public",
            "created_at": 1744264310,
            "is_public": true,
            "status": "ACTIVE",
            "name": "Dr. Thaddeus",
            "image": "/avatar-2.avif"
        }
    ];

    return avatars.find(avatar => avatar.avatar_id === id) || avatars[0];
};

import { StreamingAvatarProvider } from '@/components/logic';
import AvatarCallComponent from "@/components/AvatarStreemComponent";
import { createSessionApiRequest } from "@/networks/api";

// Inner component that has access to the streaming avatar context
function TalkPageContent({ avatarData, avatarId }: { avatarData: any, avatarId: string }) {
    const [sessionData, setSessionData] = useState<any>(null);
    const [sessionId, setSessionId] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const sessionRunSingle = useRef(false);

    const createSession = async () => {
        try {
            setIsLoading(true);
            setError(null);
            
            const payload = {
                avatar_id: 'dvp_Melisha_cloth3_pd',
                duration: 120,
                language: "en", 
            }

            console.log('Creating session with payload:', payload);
            const response = await createSessionApiRequest(JSON.stringify(payload));
            console.log('API Response:', response);
            
            // Check if response has the expected structure
            if (!response || !response.data) {
                throw new Error('Invalid API response: No data received');
            }

            // Log the full response structure for debugging
            console.log('Response data structure:', JSON.stringify(response.data, null, 2));

            // Handle nested response structure: response.data.data.credentials
            const responseData = response.data.data || response.data;
            
            // Check if credentials exist
            if (!responseData.credentials) {
                console.error('No credentials in response:', responseData);
                throw new Error('No credentials received from API. Please check your avatar configuration.');
            }

            // Validate required credential fields
            const credentials = responseData.credentials;
            const requiredFields = ['agora_app_id', 'agora_channel', 'agora_token', 'agora_uid'];
            const missingFields = requiredFields.filter(field => !credentials[field]);
            
            if (missingFields.length > 0) {
                console.error('Missing credential fields:', missingFields);
                throw new Error(`Missing required credentials: ${missingFields.join(', ')}`);
            }

            // Structure the session data to match AvatarCallComponent expectations
            const sessionData = {
                session_id: responseData._id || responseData.session_id,
                credentials: credentials
            };
            
            console.log('Structured session data:', sessionData);
            setSessionData(sessionData);
            setSessionId(responseData._id);
        } catch (err) {
            console.error('Error creating session:', err);
            const errorMessage = err instanceof Error ? err.message : 'Failed to create session. Please try again.';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }

    // Function to restart session - will be called from AvatarCallComponent
    const restartSession = async () => {
        console.log('Restarting session...');
        sessionRunSingle.current = false;
        setSessionData(null);
        setSessionId(null);
        setError(null);
        await createSession();
        console.log('Session restart completed');
    }

    useEffect(() => {
        if (!sessionRunSingle.current) {
            createSession();
            sessionRunSingle.current = true;
        }
    }, []); // Empty dependency array ensures it runs only once

    // Loading state
    if (isLoading) {
        return (
            <div className="h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
                <div className="text-center text-slate-600">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <h2 className="text-xl font-semibold mb-2">Creating Session</h2>
                    <p className="text-slate-500">Please wait while we set up your avatar session...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
                <div className="text-center text-slate-600 max-w-md mx-auto">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-semibold mb-2 text-red-600">Session Creation Failed</h2>
                    <p className="text-slate-500 mb-4">{error}</p>
                    <button
                        onClick={() => {
                            sessionRunSingle.current = false;
                            createSession();
                        }}
                        className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div>
            {
                sessionData && (
                    <AvatarCallComponent 
                        sessionData={sessionData} 
                        onRestartSession={restartSession}
                    />
                )
            }
        </div>
    );
}

export default function TalkWithAvatarPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = React.use(params);
    const searchParams = useSearchParams();
    const avatarId = searchParams.get('avatar_id') || 'dvp_Alinna_emotionsit_20250116'; // Default fallback
    const avatarData = getAvatarData(avatarId);

    return (
        <div className="w-full min-h-screen bg-gray-50 chat-interface-active">
            <StreamingAvatarProvider basePath={process.env.NEXT_PUBLIC_BASE_API_URL}>
                <TalkPageContent avatarData={avatarData} avatarId={avatarId} />
            </StreamingAvatarProvider>
        </div>
    );
} 