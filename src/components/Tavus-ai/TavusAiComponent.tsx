"use client";

import React, { useEffect, useRef, useState } from 'react';

interface TavusAiComponentProps {
  roomUrl: string;
  onCallEnd?: () => void;
  onCallStart?: () => void;
  customization?: {
    showLeaveButton?: boolean;
    showFullscreenButton?: boolean;
    language?: string;
    theme?: {
      colors?: {
        accent?: string;
        background?: string;
        baseText?: string;
      };
    };
  };
}

const TavusAiComponent: React.FC<TavusAiComponentProps> = ({
  roomUrl,
  onCallEnd,
  onCallStart,
  customization = {}
}) => {
  const callFrameRef = useRef<any>(null);
  const [isJoining, setIsJoining] = useState(false);
  const [isInCall, setIsInCall] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Default customization settings
  const defaultCustomization = {
    showLeaveButton: true,
    showFullscreenButton: true,
    language: "en",
    theme: {
      colors: {
        accent: "#2F80ED",
        background: "#F8F9FA",
        baseText: "#1A1A1A",
      },
    },
    ...customization
  };

  useEffect(() => {
    if (!roomUrl) {
      setError('Room URL is required');
      return;
    }

    // Prevent duplicate instances
    if (callFrameRef.current) {
      return;
    }

    // Load Daily.js dynamically and initialize call
    const initializeCall = async () => {
      try {
        setIsJoining(true);
        setError(null);

        // Dynamically import Daily.js
        const DailyIframe = (await import('@daily-co/daily-js')).default;

        // Ensure no existing instances
        try {
          const existingFrame = document.querySelector('iframe[src*="daily.co"]');
          if (existingFrame) {
            existingFrame.remove();
          }
        } catch (e) {
          // Ignore cleanup errors
        }

        // Create Daily call frame with customization
        const callFrame = DailyIframe.createFrame(null as any, {
          showLeaveButton: defaultCustomization.showLeaveButton,
          lang: defaultCustomization.language as any,
          showFullscreenButton: defaultCustomization.showFullscreenButton,
          iframeStyle: {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            border: 'none',
            borderRadius: '0',
          },
          theme: defaultCustomization.theme as any,
        });

        callFrameRef.current = callFrame;

        // Set up event listeners
        callFrame
          .on('joined-meeting', () => {
            console.log('Successfully joined Tavus conversation');
            setIsJoining(false);
            setIsInCall(true);
            onCallStart?.();
          })
          .on('left-meeting', () => {
            console.log('Left Tavus conversation');
            setIsInCall(false);
            onCallEnd?.();
          })
          .on('error', (error: any) => {
            console.error('Daily call error:', error);
            setError(error.errorMsg || error.error || 'An error occurred during the call');
            setIsJoining(false);
          })
          .on('call-instance-destroyed', () => {
            console.log('Call instance destroyed');
            setIsInCall(false);
          });

        // Join the room
        await callFrame.join({ url: roomUrl });

      } catch (err) {
        console.error('Error initializing Tavus call:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize call');
        setIsJoining(false);
      }
    };

    initializeCall();

    // Cleanup function
    return () => {
      if (callFrameRef.current) {
        try {
          callFrameRef.current.destroy();
        } catch (e) {
          console.error('Error destroying call frame:', e);
        }
        callFrameRef.current = null;
      }
    };
  }, [roomUrl]);

  const leaveCall = async () => {
    if (callFrameRef.current) {
      try {
        await callFrameRef.current.leave();
      } catch (err) {
        console.error('Error leaving call:', err);
      }
    }
  };

  const toggleFullscreen = async () => {
    if (callFrameRef.current) {
      try {
        const currentState = await callFrameRef.current.requestFullscreen();
        console.log('Fullscreen state:', currentState);
      } catch (err) {
        console.error('Error toggling fullscreen:', err);
      }
    }
  };

  // Loading state
  if (isJoining) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center z-50">
        <div className="text-center text-slate-600">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold mb-2">Connecting to Tavus AI</h2>
          <p className="text-slate-500">Please wait while we connect you to your AI conversation...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center z-50">
        <div className="text-center text-slate-600 max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2 text-red-600">Connection Failed</h2>
          <p className="text-slate-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // The Daily iframe will be rendered by the Daily SDK
  return null;
};

export default TavusAiComponent;