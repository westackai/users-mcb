"use client";

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  DailyAudio,
  useDaily,
  useLocalSessionId,
  useParticipantIds,
  useVideoTrack,
  useAudioTrack,
} from '@daily-co/daily-react';
import { endSessionApiRequest } from '@/networks/api';

interface TavusConversationProps {
  conversationUrl: string;
  onCallEnd?: () => void;
  onCallStart?: () => void;
}

const TavusConversationComponent: React.FC<TavusConversationProps> = ({
  conversationUrl,
  onCallEnd,
  onCallStart,
}) => {
  const daily = useDaily();
  const localSessionId = useLocalSessionId();
  const localVideo = useVideoTrack(localSessionId);
  const localAudio = useAudioTrack(localSessionId);
  const isCameraEnabled = !localVideo.isOff;
  const isMicEnabled = !localAudio.isOff;
  const remoteParticipantIds = useParticipantIds({ filter: 'remote' });
  const remoteVideo = useVideoTrack(remoteParticipantIds[0]);
  const [hasStarted, setHasStarted] = useState(false);

  // Handle remote participant joining
  useEffect(() => {
    if (remoteParticipantIds.length && !hasStarted) {
      setHasStarted(true);
      onCallStart?.();
      // Enable audio after a short delay
      setTimeout(() => daily?.setLocalAudio(true), 2000);
    }
  }, [remoteParticipantIds, hasStarted, daily, onCallStart]);

  // Join the conversation
  useEffect(() => {
    if (conversationUrl && daily) {
      daily
        .join({
          url: conversationUrl,
          startVideoOff: false,
          startAudioOff: true,
        })
        .then(() => {
          console.log('Successfully joined Tavus conversation');
          daily.setLocalAudio(false);
        })
        .catch((error) => {
          console.error('Error joining conversation:', error);
        });
    }
  }, [conversationUrl, daily]);


  const toggleVideo = useCallback(() => {
    daily?.setLocalVideo(!isCameraEnabled);
  }, [daily, isCameraEnabled]);

  const toggleAudio = useCallback(() => {
    daily?.setLocalAudio(!isMicEnabled);
  }, [daily, isMicEnabled]);

  const leaveConversation = useCallback(() => {
    daily?.leave();
    daily?.destroy();
    // endSessionApiRequest()
    onCallEnd?.();
  }, [daily, onCallEnd]);

  return (
    <div className='relative'>

      <div className="fixed inset-0  z-50">
        {/* Background overlay for better contrast */}
        <div className="absolute inset-0 bg-black/20"></div>

        {/* Header with branding and status */}
        <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/50 to-transparent p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <h1 className="text-white text-xl font-semibold">AI Health Consultation</h1>
            </div>
            <div className="flex items-center space-x-2 text-white/80">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="text-sm">Secure Connection</span>
            </div>
          </div>
        </div>

        {/* Remote participant video (AI avatar) - Professional Layout */}
        {remoteParticipantIds?.length > 0 ? (
          <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-90">
            {/* AI Avatar Container with Professional Styling */}
            <div className="relative w-full  h-full  mx-auto flex items-center justify-center">
              {/* Main Avatar Video */}
              <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black/20 backdrop-blur-sm">
                <video
                  ref={(videoEl) => {
                    if (videoEl && remoteVideo.track) {
                      videoEl.srcObject = new MediaStream([remoteVideo.track]);
                    }
                  }}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
                

                {/* Professional Overlay */}
                {/* <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 pointer-events-none"></div> */}

                {/* AI Doctor Info Badge */}
                <div className="absolute top-6 left-6 bg-black/60 backdrop-blur-md rounded-full px-4 py-2 border border-white/20">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <div className="text-white">
                      <p className="text-sm font-medium">Dr. MCB</p>
                      <p className="text-xs text-white/70">psychiatrist Doctor</p>
                    </div>
                  </div>
                </div>

                {/* Connection Quality Indicator */}
                <div className="absolute top-6 right-6 bg-black/60 backdrop-blur-md rounded-full px-3 py-2 border border-white/20">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-1 h-3 bg-green-400 rounded-full"></div>
                      <div className="w-1 h-4 bg-green-400 rounded-full"></div>
                      <div className="w-1 h-5 bg-green-400 rounded-full"></div>
                    </div>
                    <span className="text-white text-xs">HD</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Loading state when AI avatar hasn't joined yet */


          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="w-20 h-20 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <h2 className="text-2xl font-semibold mb-2">Connecting to AI Doctor</h2>
              <p className="text-white/70">Please wait while we establish the connection...</p>
            </div>
          </div>
        )}

        {/* Local participant video (user) - Picture in Picture Style */}
        {localSessionId && (
          <div className="absolute bottom-32 left-6 w-48 h-36 sm:w-56 sm:h-40 lg:w-64 lg:h-44 z-30">
            <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl border-2 border-white/30 backdrop-blur-sm bg-black/30">
              <video
                ref={(videoEl) => {
                  if (videoEl && localVideo.track) {
                    videoEl.srcObject = new MediaStream([localVideo.track]);
                  }
                }}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />

              {/* User video overlay with enhanced styling */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none"></div>

              {/* User label */}
              <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md rounded-full px-3 py-1 border border-white/20">
                <p className="text-white text-xs font-medium">You</p>
              </div>

              {/* Camera status indicator with animation */}
              <div className="absolute top-3 right-3 flex items-center space-x-1">
                <div className={`w-2 h-2 rounded-full ${isCameraEnabled ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
                {!isCameraEnabled && (
                  <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                  </svg>
                )}
              </div>

              {/* Mic status indicator */}
              <div className="absolute top-3 left-3">
                {!isMicEnabled && (
                  <div className="bg-red-600/80 backdrop-blur-md rounded-full p-1 border border-red-400/30">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-3a1 1 0 011-1h1.586l4.707-4.707C10.923 5.663 12 6.109 12 7v10c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Enhanced control panel */}
        <div className="absolute bottom-0 left-0 right-0 z-20">
          <div className="bg-gradient-to-t from-black/80 via-black/60 to-transparent p-8">
            <div className="flex items-center justify-center space-x-6">
              {/* Microphone button */}
              <div className="relative group">
                <button
                  onClick={toggleAudio}
                  className={`relative p-4 rounded-full transition-all duration-200 transform hover:scale-110 ${isMicEnabled
                    ? 'bg-gray-700/80 hover:bg-gray-600/80 shadow-lg shadow-gray-500/20'
                    : 'bg-red-600/90 hover:bg-red-500/90 shadow-lg shadow-red-500/30 animate-pulse'
                    } backdrop-blur-md border border-white/10`}
                >
                  {isMicEnabled ? (
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-3a1 1 0 011-1h1.586l4.707-4.707C10.923 5.663 12 6.109 12 7v10c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                    </svg>
                  )}
                </button>
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-black/80 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {isMicEnabled ? 'Mute' : 'Unmute'}
                </div>
              </div>

              {/* Video button */}
              <div className="relative group">
                <button
                  onClick={toggleVideo}
                  className={`relative p-4 rounded-full transition-all duration-200 transform hover:scale-110 ${isCameraEnabled
                    ? 'bg-gray-700/80 hover:bg-gray-600/80 shadow-lg shadow-gray-500/20'
                    : 'bg-red-600/90 hover:bg-red-500/90 shadow-lg shadow-red-500/30'
                    } backdrop-blur-md border border-white/10`}
                >
                  {isCameraEnabled ? (
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                    </svg>
                  )}
                </button>
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-black/80 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {isCameraEnabled ? 'Turn off camera' : 'Turn on camera'}
                </div>
              </div>

              {/* End call button */}
              <div className="relative group">
                <button
                  onClick={leaveConversation}
                  className="relative p-4 rounded-full bg-red-600/90 hover:bg-red-500 transition-all duration-200 transform hover:scale-110 shadow-lg shadow-red-500/40 backdrop-blur-md border border-red-400/20"
                >
                  <svg className="w-6 h-6 text-white rotate-135" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </button>
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-black/80 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  End consultation
                </div>
              </div>
            </div>

            {/* Additional info */}
            <div className="flex items-center justify-center mt-4 space-x-6 text-white/60 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>HD Quality</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>End-to-end encrypted</span>
              </div>
            </div>
          </div>
        </div>

        {/* Audio component for handling audio streams */}
        <DailyAudio />
      </div>
    </div>
  );
};

export default TavusConversationComponent;
