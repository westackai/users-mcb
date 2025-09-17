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

import { createTavusConversationApiRequest } from "@/networks/api";
import { useRouter } from "next/navigation";
import TavusConversationComponent from "@/components/Tavus-ai/TavusConversationComponent";
import { DailyProvider } from '@daily-co/daily-react';

// Inner component that has access to the streaming avatar context
function TalkPageContent({ avatarData, avatarId }: { avatarData: any, avatarId: string }) {
    const router = useRouter();
    const [roomUrl, setRoomUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const sessionRunSingle = useRef(false);

    const createSession = async () => {
        try {
            setIsLoading(true);
            setError(null);

            // Use stock replica and persona IDs as per Tavus documentation
            const payload = {
                "replica_id": "rfe12d8b9597", // Nathan (stock replica)
                "persona_id": "pdced222244b", // Sales Coach (stock persona)
                "voice_id": "uKG8deEEmpcJpHA3BEdW", // Optional voice ID
                "start_pipeline": true,
                "max_call_duration": 10,
                "participant_absent_timeout": 5,
                // "callback_url": "string"
            };

            console.log('Creating Tavus conversation with payload:', payload);

            // Use the new API function with proper error handling
            const response = await createTavusConversationApiRequest(payload);

            console.log('Tavus conversation created successfully:', response);
            setRoomUrl(response.roomUrl);

        } catch (err) {
            console.error('Error creating Tavus session:', err);
            const errorMessage = err instanceof Error ? err.message : 'Failed to create Tavus session. Please try again.';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }

    // Function to restart session
    const restartSession = async () => {
        console.log('Restarting Tavus session...');
        sessionRunSingle.current = false;
        setRoomUrl(null);
        setError(null);
        await createSession();
        console.log('Tavus session restart completed');
    }

    // Handle call end
    const handleCallEnd = () => {
        console.log('Tavus call ended');
        router.push('/video-consultation'); // Navigate back to dashboard
    }

    // Handle call start
    const handleCallStart = () => {
        console.log('Tavus call started successfully');
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
                    <h2 className="text-xl font-semibold mb-2">Creating Tavus Session</h2>
                    <p className="text-slate-500">Please wait while we set up your AI conversation...</p>
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
                    <h2 className="text-xl font-semibold mb-2 text-red-600">Tavus Session Failed</h2>
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

    // Render Tavus conversation component when room URL is available
    if (roomUrl) {
        return (
            <DailyProvider>
                <TavusConversationComponent
                    conversationUrl={roomUrl}
                    onCallEnd={handleCallEnd}
                    onCallStart={handleCallStart}
                />
            </DailyProvider>
        );
    }

    return null;
}

export default function TalkWithAvatarPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = React.use(params);
    const searchParams = useSearchParams();
    const avatarId = searchParams.get('avatar_id') || 'dvp_Alinna_emotionsit_20250116'; // Default fallback
    const avatarData = getAvatarData(avatarId);

    return (
        <div className="w-full min-h-screen bg-gray-50 chat-interface-active">
            <TalkPageContent avatarData={avatarData} avatarId={avatarId} />
        </div>
    );
} 