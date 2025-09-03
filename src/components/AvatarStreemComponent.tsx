'use client';

import { useState, useEffect, useRef } from 'react';

import {
    Mic,
    MicOff,
    Video,
    VideoOff,
    Phone,
    PhoneOff,
    Send,
    MessageCircle,
    Settings,
    Volume2,
    VolumeX,
    Maximize,
    Minimize,
    Bot,
    User,
    Clock,
    Loader2,
    AlertCircle,
    Square
} from 'lucide-react';
import { conversationSummaryApiRequest, endSessionApiRequest, sendMessageToAvatarApiRequest } from '@/networks/api';
import { LiveTranscriptionEvents, createClient } from '@deepgram/sdk';
import { toast } from 'react-toastify';

// Dynamically import Agora SDK to avoid SSR issues
let AgoraRTC: any = null;

interface SessionData {
    session_id: string;
    credentials: {
        agora_app_id: string;
        agora_channel: string;
        agora_token: string;
        agora_uid: number;
    };
}

interface ChatMessage {
    type: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

interface AvatarCallComponentProps {
    sessionData: SessionData;
    onRestartSession: () => void;
}

// Type definitions for Agora
interface AgoraClient {
    connectionState: string;
    uid: number | null;
    join: (appId: string, channel: string, token: string, uid: number) => Promise<void>;
    leave: () => Promise<void>;
    subscribe: (user: any, mediaType: string) => Promise<any>;
    unsubscribe: (user: any, mediaType: string) => Promise<void>;
    publish: (track: any) => Promise<void>;
    unpublish: (track: any) => Promise<void>;
    sendStreamMessage: (message: string, reliable: boolean) => Promise<void>;
    on: (event: string, callback: (...args: any[]) => void) => void;
    removeAllListeners: (event: string) => void;
    remoteUsers: any[];
}

// Type definitions for Deepgram
interface DeepgramConnection {
    getReadyState: () => number;
    send: (data: ArrayBuffer) => void;
    finish: () => void;
    on: (event: string, callback: (data: any) => void) => void;
}

// Type definitions for audio processing
interface AudioProcessor {
    onaudioprocess: ((event: any) => void) | null;
    connect: (destination: any) => void;
    disconnect: () => void;
}

interface MediaStreamSource {
    connect: (processor: AudioProcessor) => void;
    disconnect: () => void;
}

const AvatarCallComponent: React.FC<AvatarCallComponentProps> = ({ sessionData , onRestartSession }) => {
    // Deepgram state management
    const [isListening, setIsListening] = useState(false);
    const [currentTranscript, setCurrentTranscript] = useState('');
    const [interimTranscript, setInterimTranscript] = useState('');
    const [finalTranscript, setFinalTranscript] = useState('');

    // State management following the implementation guide
    const [isConnected, setIsConnected] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState('disconnected');
    const [audioMuted, setAudioMuted] = useState(true); // Mic disabled by default
    const [videoEnabled, setVideoEnabled] = useState(false);
    const [volumeMuted, setVolumeMuted] = useState(false);
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [agoraLoaded, setAgoraLoaded] = useState(false);
    const [isAvatarSpeaking, setIsAvatarSpeaking] = useState(false);
    const [avatarResponse, setAvatarResponse] = useState('');
    const [conversationId, setConversationId] = useState<string | null>(null);
    const conversationIdRef = useRef<string | null>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [callDuration, setCallDuration] = useState(0);

    // Refs following the implementation guide
    const agoraClient = useRef<AgoraClient | null>(null);
    const localAudioTrack = useRef<any>(null);
    const localVideoTrack = useRef<any>(null);
    const remoteVideoContainer = useRef<HTMLDivElement | null>(null);
    const localVideoContainer = useRef<HTMLDivElement | null>(null);
    const chatContainerRef = useRef<HTMLDivElement | null>(null);
    const audioControls = useRef<any>(null);
    const videoControls = useRef<any>(null);
    const microphoneStream = useRef<MediaStream | null>(null);

    // Deepgram refs
    const deepgramConnection = useRef<DeepgramConnection | null>(null);
    const mediaRecorder = useRef<any>(null);
    const audioContext = useRef<AudioContext | null>(null);
    const processor = useRef<AudioProcessor | null>(null);
    const microphone = useRef<MediaStreamSource | null>(null);

    // Speech completion tracking
    const speechBuffer = useRef('');
    const speechTimeout = useRef<NodeJS.Timeout | null>(null);
    const [isWaitingForSpeechCompletion, setIsWaitingForSpeechCompletion] = useState(false);
    const SPEECH_COMPLETION_DELAY = 1500; // Wait 1.5 seconds after final transcript for more natural flow

    // Deepgram API key
    const DEEPGRAM_API_KEY = process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY || 'YOUR_DEEPGRAM_API_KEY_HERE';

    // Utility functions for Agora messaging
    const generateMessageId = () => {
        return `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    };

    const createAgoraCommand = (command: string, data?: any) => {
        return {
            v: 2,
            type: 'command',
            mid: generateMessageId(),
            pld: {
                cmd: command,
                ...(data && { data })
            }
        };
    };

    const sendMessageToAvatar = async (client: AgoraClient, message: string, messageId?: string) => {
        try {
            if (!client || client.connectionState !== 'CONNECTED') {
                throw new Error('Client not connected');
            }

            const chatMessage = {
                v: 2,
                type: 'chat',
                mid: messageId || generateMessageId(),
                pld: {
                    from: 'user',
                    text: message,
                    fin: true
                }
            };

            await client.sendStreamMessage(JSON.stringify(chatMessage), false);
            console.log('✅ Message sent to avatar:', message);
        } catch (error) {
            console.error('Error sending message to avatar:', error);
            throw error;
        }
    };

    // Enhanced audio configuration for optimal speech recognition and echo cancellation
    const getOptimalAudioConfig = () => ({
        audio: {
            echoCancellation: true,        // AEC3 in modern browsers - critical for preventing feedback
            noiseSuppression: true,        // Reduces background noise
            autoGainControl: true,         // Automatically adjusts microphone sensitivity
            channelCount: 1,               // Mono audio for speech recognition
            sampleRate: 16000,             // Optimal for speech recognition and reduces processing load
            latency: 0.1,                  // Low latency for real-time interaction
        }
    });

    // Check if Deepgram API key is configured
    useEffect(() => {
        if (!DEEPGRAM_API_KEY || DEEPGRAM_API_KEY === 'YOUR_DEEPGRAM_API_KEY_HERE') {
            setError('Deepgram API key not configured. Please add NEXT_PUBLIC_DEEPGRAM_API_KEY to your environment variables.');
        }
    }, []);

    // Load Agora SDK dynamically
    useEffect(() => {
        if (typeof window !== 'undefined') {
            import('agora-rtc-sdk-ng').then((module) => {
                AgoraRTC = module.default;
                console.log('Agora SDK loaded successfully');
                setAgoraLoaded(true);
            }).catch((error) => {
                console.error('Failed to load Agora SDK:', error);
                setError('Failed to load video SDK');
            });
        }
        return () => {
            if (agoraClient.current) {
                performClientCleanup();
            }
        };
    }, []);

    // Auto-scroll chat
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chatHistory]);

    // Simulate call duration timer
    useEffect(() => {
        if (isConnected) {
            const timer = setInterval(() => {
                setCallDuration(prev => prev + 1);
            }, 1000);
            return () => clearInterval(timer);
        } else {
            setCallDuration(0);
        }
    }, [isConnected]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Deepgram real-time speech recognition functions
    const initializeDeepgram = async () => {
        try {
            if (!DEEPGRAM_API_KEY || DEEPGRAM_API_KEY === 'YOUR_DEEPGRAM_API_KEY_HERE') {
                throw new Error('Deepgram API key not configured');
            }
            // Create Deepgram client
            const deepgram = createClient(DEEPGRAM_API_KEY);
            // Create WebSocket connection to Deepgram
            const connection = deepgram.listen.live({
                model: 'nova-3',
                language: 'en-US',
                smart_format: true,
                interim_results: true,
                endpointing: 300,
                utterance_end_ms: 1000,
                vad_events: true,
                punctuate: true,
                diarize: false,
                multichannel: false,
                sample_rate: 16000,
                channels: 1,
                encoding: 'linear16',
            });
            deepgramConnection.current = connection;
            // Set up event listeners
            connection.on(LiveTranscriptionEvents.Open, () => {
                console.log('Deepgram connection opened');
                setIsListening(true);
            });
            connection.on(LiveTranscriptionEvents.Transcript, (data: any) => {
                const transcript = data.channel?.alternatives?.[0]?.transcript;
                if (transcript && transcript.trim() !== '') {
                    if (data.is_final) {
                        console.log('Final transcript:', transcript);
                        setFinalTranscript(transcript);
                        setInterimTranscript('');
                        setCurrentTranscript('');
                        // Process final transcript
                        processFinalTranscript(transcript);
                    } else {
                        console.log('Interim transcript:', transcript);
                        setInterimTranscript(transcript);
                        setCurrentTranscript(transcript);
                        // Check for interruption on interim results
                        if (isAvatarSpeaking && transcript.trim().length > 2) {
                            if (!isLikelyAvatarVoice(transcript)) {
                                handleInterrupt();
                            }
                        }
                    }
                }
            });
            connection.on(LiveTranscriptionEvents.Error, (error: any) => {
                console.error('Deepgram error:', error);
                setError('Speech recognition error occurred');
            });
            connection.on(LiveTranscriptionEvents.Close, () => {
                console.log('Deepgram connection closed');
                setIsListening(false);
            });
            connection.on(LiveTranscriptionEvents.Metadata, (data: any) => {
                console.log('Deepgram metadata:', data);
            });
            return connection;
        } catch (error) {
            console.error('Error initializing Deepgram:', error);
            throw error;
        }
    };

    const startMicrophone = async () => {
        try {
            // Get microphone stream with enhanced audio config
            const stream = await navigator.mediaDevices.getUserMedia(getOptimalAudioConfig());
            microphoneStream.current = stream;
            // Create audio context for processing
            audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)({
                sampleRate: 16000
            });
            // Create source from microphone
            microphone.current = audioContext.current.createMediaStreamSource(stream) as any;
            // Create processor for real-time audio processing
            processor.current = audioContext.current.createScriptProcessor(4096, 1, 1);
            processor.current.onaudioprocess = (event: any) => {
                if (deepgramConnection.current && deepgramConnection.current.getReadyState() === 1) {
                    const inputBuffer = event.inputBuffer.getChannelData(0);
                    // Convert Float32Array to Int16Array for Deepgram
                    const int16Buffer = new Int16Array(inputBuffer.length);
                    for (let i = 0; i < inputBuffer.length; i++) {
                        int16Buffer[i] = Math.max(-32768, Math.min(32767, inputBuffer[i] * 32768));
                    }
                    // Send audio data to Deepgram
                    deepgramConnection.current.send(int16Buffer.buffer);
                }
            };
            // Connect the audio processing chain
            if (microphone.current && processor.current && audioContext.current) {
                microphone.current.connect(processor.current);
                processor.current.connect(audioContext.current.destination);
            }
            console.log('Microphone started and connected to Deepgram');
            return true;
        } catch (error) {
            console.error('Error starting microphone:', error);
            setError('Failed to access microphone');
            return false;
        }
    };

    const stopMicrophone = () => {
        try {
            console.log('🎤 Disconnecting microphone...');
            // Stop microphone stream
            if (microphoneStream.current) {
                microphoneStream.current.getTracks().forEach((track: any) => track.stop());
                microphoneStream.current = null;
            }
            // Disconnect audio processing
            if (processor.current) {
                processor.current.disconnect();
                processor.current = null;
            }
            if (microphone.current) {
                microphone.current.disconnect();
                microphone.current = null;
            }
            if (audioContext.current) {
                audioContext.current.close();
                audioContext.current = null;
            }
            console.log('✅ Microphone disconnected and all audio processing stopped');
        } catch (error) {
            console.error('Error stopping microphone:', error);
        }
    };

    const startDeepgramListening = async () => {
        try {
            if (!deepgramConnection.current) {
                await initializeDeepgram();
            }
            const microphoneStarted = await startMicrophone();
            if (!microphoneStarted) {
                throw new Error('Failed to start microphone');
            }
            console.log('Deepgram listening started');
            return true;
        } catch (error) {
            console.error('Error starting Deepgram listening:', error);
            setError('Failed to start speech recognition');
            return false;
        }
    };

    const stopDeepgramListening = () => {
        try {
            // Close Deepgram connection
            if (deepgramConnection.current) {
                deepgramConnection.current.finish();
                deepgramConnection.current = null;
            }
            // Stop microphone
            stopMicrophone();
            setIsListening(false);
            setCurrentTranscript('');
            setInterimTranscript('');
            console.log('Deepgram listening stopped');
        } catch (error) {
            console.error('Error stopping Deepgram listening:', error);
        }
    };

    // Smart filtering to detect avatar's own voice
    const isLikelyAvatarVoice = (text: string) => {
        if (!isAvatarSpeaking || !avatarResponse) return false;
        // If avatar is speaking and the transcript matches part of avatar's current response
        const avatarWords = avatarResponse.toLowerCase().split(' ');
        const transcriptWords = text.toLowerCase().split(' ');
        // Check if more than 50% of transcript words are in avatar's current response
        let matchCount = 0;
        for (const word of transcriptWords) {
            if (word.length > 2 && avatarWords.some(avatarWord =>
                avatarWord.includes(word) || word.includes(avatarWord)
            )) {
                matchCount++;
            }
        }
        const matchRatio = matchCount / transcriptWords.length;
        return matchRatio > 0.5 && transcriptWords.length > 2;
    };

    // Process final transcript from Deepgram
    const processFinalTranscript = async (transcript: string) => {
        if (!transcript || !transcript.trim()) return;
        // Smart filtering: Check if this might be avatar's own voice
        if (isLikelyAvatarVoice(transcript.trim())) {
            console.log('Ignoring transcript - likely avatar voice:', transcript);
            return;
        }
        // Always interrupt if avatar is speaking (user speech detected)
        if (isAvatarSpeaking) {
            await handleInterrupt();
        }
        // Add to speech buffer and reset timeout
        speechBuffer.current += (speechBuffer.current ? ' ' : '') + transcript.trim();
        // Clear any existing timeout
        if (speechTimeout.current) {
            clearTimeout(speechTimeout.current);
        }
        // Set waiting state
        setIsWaitingForSpeechCompletion(true);
        // Set a new timeout to wait for speech completion
        speechTimeout.current = setTimeout(async () => {
            const completeSpeech = speechBuffer.current.trim();
            speechBuffer.current = ''; // Clear buffer
            setIsWaitingForSpeechCompletion(false);
            if (!completeSpeech) return;
            console.log('Processing complete speech:', completeSpeech);
            // Add user message to chat
            setChatHistory(prev => [...prev, {
                type: 'user',
                content: completeSpeech,
                timestamp: new Date()
            }]);
            // Process with LLM
            try {
                setIsTyping(true);
                await sendMessageToAvatarWithLLM(agoraClient.current as AgoraClient, completeSpeech);
            } catch (error) {
                console.error('Error processing voice input:', error);
                setError('Failed to process voice input');
                setIsTyping(false);
            }
        }, SPEECH_COMPLETION_DELAY);
    };

    // Initialize Agora Client
    const initializeAgoraClient = async (credentials: any) => {
        try {
            if (!AgoraRTC) {
                throw new Error('Agora SDK not loaded');
            }
            const appId = credentials.agora_app_id;
            const channel = credentials.agora_channel;
            const token = credentials.agora_token;
            const uid = credentials.agora_uid;
            if (!appId || !channel || !token || uid === undefined) {
                throw new Error(`Missing required credentials: appId=${!!appId}, channel=${!!channel}, token=${!!token}, uid=${uid !== undefined}`);
            }
            const client = AgoraRTC.createClient({
                mode: 'rtc',
                codec: 'vp8'
            });
            await client.join(appId, channel, token, uid);
            return client;
        } catch (error) {
            console.error('Error joining channel:', error);
            throw error;
        }
    };

    // Subscribe Audio and Video Stream (Avatar only)
    const subscribeToAvatarStream = async (client: AgoraClient) => {
        const onUserPublish = async (user: any, mediaType: string) => {
            try {
                const remoteTrack = await client.subscribe(user, mediaType);
                if (mediaType === 'video' && remoteVideoContainer.current) {
                    remoteTrack.play(remoteVideoContainer.current);
                }
                if (mediaType === 'audio') {
                    remoteTrack.play();
                    if (volumeMuted) {
                        remoteTrack.setVolume(0);
                    }
                }
            } catch (error) {
                console.error('Error subscribing to user:', error);
            }
        };
        const onUserUnpublish = async (user: any, mediaType: string) => {
            await client.unsubscribe(user, mediaType);
        };
        const onConnectionStateChange = (curState: string, prevState: string, reason: string) => {
            console.log(`Connection state changed: ${prevState} -> ${curState}, reason: ${reason}`);
            if (curState === 'DISCONNECTED' || curState === 'FAILED') {
                console.log('Connection lost, resetting state...');
                setError('Connection lost. Please reconnect.');
                performClientCleanup();
            }
        };
        const onTokenPrivilegeDidExpire = () => {
            console.log('Token expired, resetting state...');
            setError('Session expired. Please reconnect.');
            performClientCleanup();
        };
        const onUserLeft = (user: any, reason: string) => {
            console.log(`Avatar user left: ${reason}`);
            if (reason === 'Timeout' || reason === 'ServerTimeOut') {
                setError('Avatar session ended. Please reconnect.');
                performClientCleanup();
            }
        };
        client.on('user-published', onUserPublish);
        client.on('user-unpublished', onUserUnpublish);
        client.on('connection-state-change', onConnectionStateChange);
        client.on('token-privilege-did-expire', onTokenPrivilegeDidExpire);
        client.on('user-left', onUserLeft);
    };

    // Set Up Message Handling - ENHANCED with AKOOL Built-in Detection
    const setupMessageHandlers = (client: AgoraClient) => {
        let answer = '';
        client.on('stream-message', (uid: any, message: any) => {
            try {
                const parsedMessage = JSON.parse(new TextDecoder().decode(message));
                if (parsedMessage.type === 'chat') {
                    const payload = parsedMessage.pld;
                    if (payload.from === 'bot') {
                        // Process bot responses (should be our custom LLM in retelling mode)
                        if (!payload.fin) {
                            // Add the text to the answer accumulator
                            answer += payload.text;
                            setAvatarResponse(answer);
                            setIsAvatarSpeaking(true);
                        } else {
                            // Final chunk - use the complete answer
                            setChatHistory(prev => [...prev, {
                                type: 'assistant',
                                content: answer,
                                timestamp: new Date()
                            }]);
                            setAvatarResponse('');
                            answer = '';
                            setIsTyping(false);
                            setIsAvatarSpeaking(false);
                            // Resume listening after avatar finishes speaking
                            setIsAvatarSpeaking(false);
                            // Multiple restart attempts to ensure speech recognition resumes
                            if (!audioMuted && deepgramConnection.current) {
                                setTimeout(() => {
                                    if (!isListening) startDeepgramListening();
                                }, 500);
                                setTimeout(() => {
                                    if (!isListening) startDeepgramListening();
                                }, 1500);
                                setTimeout(() => {
                                    if (!isListening) startDeepgramListening();
                                }, 3000);
                            }
                        }
                    }
                } else if (parsedMessage.type === 'command') {
                    const payload = parsedMessage.pld;
                    if (payload.code !== 1000) {
                        console.error('❌ AKOOL Command Failed:', payload.msg);
                        // If parameter setting failed, try alternative methods
                        if (payload.msg?.includes('param') || payload.msg?.includes('mode')) {
                            setTimeout(async () => {
                                try {
                                    await setAvatarParams(client, {
                                        mode: 1,
                                        lang: "en",
                                        voice_mode: "retelling",
                                        enable_asr: false,
                                        enable_llm: false,
                                        custom_llm: true
                                    });
                                } catch (error) {
                                    console.error('Alternative parameter setting failed:', error);
                                }
                            }, 1000);
                        }
                    }
                }
            } catch (error) {
                console.error('Error parsing message:', error);
            }
        });
    };

    // Enhanced Avatar Parameters Control
    const setAvatarParams = async (client: AgoraClient, params: any) => {
        try {
            if (!client || client.connectionState !== 'CONNECTED') {
                console.warn('Cannot set avatar params - client not ready');
                return;
            }
            // Method 1: Standard command
            const message = {
                v: 2,
                type: 'command',
                mid: `msg-${Date.now()}`,
                pld: {
                    cmd: 'set-params',
                    data: params
                }
            };
            await client.sendStreamMessage(JSON.stringify(message), false);
            // Method 2: Alternative format (some AKOOL versions need this)
            await new Promise(resolve => setTimeout(resolve, 500));
            const altMessage = {
                v: 2,
                type: 'command',
                mid: `msg-${Date.now()}`,
                pld: {
                    cmd: 'config',
                    mode: params.mode,
                    lang: params.lang,
                    voice_mode: 'retelling',
                    enable_asr: false,
                    enable_llm: false,
                    custom_llm: true
                }
            };
            await client.sendStreamMessage(JSON.stringify(altMessage), false);
            // Method 3: Direct parameter message
            await new Promise(resolve => setTimeout(resolve, 500));
            const directMessage = {
                v: 2,
                type: 'params',
                mid: `msg-${Date.now()}`,
                pld: params
            };
            await client.sendStreamMessage(JSON.stringify(directMessage), false);
        } catch (error) {
            console.error('Failed to set avatar params:', error);
        }
    };

    // Enhanced interrupt function
    const interruptAvatar = async (client: AgoraClient) => {
        try {
            if (!client || client.connectionState !== 'CONNECTED') {
                console.warn('Cannot interrupt avatar - client not ready');
                return;
            }
            // Send multiple interrupt commands to ensure AKOOL stops processing
            const interruptCommands = [
                {
                    v: 2,
                    type: 'command',
                    mid: `interrupt-${Date.now()}`,
                    pld: { cmd: 'interrupt' }
                },
                {
                    v: 2,
                    type: 'command',
                    mid: `stop-${Date.now()}`,
                    pld: { cmd: 'stop' }
                },
                {
                    v: 2,
                    type: 'command',
                    mid: `abort-${Date.now()}`,
                    pld: { cmd: 'abort' }
                }
            ];
            for (const command of interruptCommands) {
                await client.sendStreamMessage(JSON.stringify(command), false);
                await new Promise(resolve => setTimeout(resolve, 50)); // Small delay between commands
            }
        } catch (error) {
            console.error('Failed to send interrupt commands:', error);
        }
    };

    // Custom LLM Processing with Enhanced Interrupt
    const sendMessageToAvatarWithLLM = async (client: AgoraClient, question: string) => {
        try {
            if (!client || client.connectionState !== 'CONNECTED') {
                toast.error('Connection lost. Please reconnect to continue.');
                conversationSummaryApiRequest({
                    conversation_id: conversationId
                });
                return;
            }
            // Step 1: Interrupt any ongoing avatar speech
            await interruptAvatar(client);
        
            await new Promise(resolve => setTimeout(resolve, 100));
         
            let payload = {};
            let response;
            // Step 2: Process the question with your LLM service
            const currentConversationId = conversationIdRef.current || conversationId;
            
            if (!currentConversationId || currentConversationId === '') {
                payload = {
                    user_message: question,
                    knowledgeBase_id: "12c0b2b7-4673-468a-b0ce-26b374ab08b7"
                }
                response = await sendMessageToAvatarApiRequest(payload);
                const newConversationId = response.data.data.conversation_id;
                setConversationId(newConversationId);
                conversationIdRef.current = newConversationId;
            } else {
                payload = {
                    user_message: question,
                    conversation_id: currentConversationId,
                    knowledgeBase_id: "12c0b2b7-4673-468a-b0ce-26b374ab08b7"
                }
                response = await sendMessageToAvatarApiRequest(payload);
            }
            console.log('LLM Response:', response);



            if (response && response.data) {

                // Extract the response text (handle both 'response' and 'message' fields)
                const responseText = response.data.response ||response?.data?.data?.response;

                if (responseText) {
                    // Step 3: Send one more interrupt before sending LLM response
                    await interruptAvatar(client);
                    await new Promise(resolve => setTimeout(resolve, 100));

                    // Step 4: Send the LLM response to avatar
                    const messageId = generateMessageId();
                    await sendMessageToAvatar(client, responseText, messageId);

                    // Add assistant response to chat
                    setChatHistory(prev => [...prev, {
                        type: 'assistant',
                        content: responseText,
                        timestamp: new Date()
                    }]);
                } else {
                    throw new Error('No response text found in LLM response');
                }
            } else {
                throw new Error('Failed to get response from LLM');
            }
        } catch (error) {
            console.error('Error in enhanced LLM message sending:', error);
            setError('Failed to process message with LLM');
            throw error;
        }
    };

    // Cleanup
    const performClientCleanup = async () => {
        try {
            // Clear speech timeout to prevent processing after disconnect
            if (speechTimeout.current) {
                clearTimeout(speechTimeout.current);
                speechTimeout.current = null;
            }
            speechBuffer.current = '';
            setIsWaitingForSpeechCompletion(false);
            // Stop Deepgram speech recognition and disconnect microphone
            stopDeepgramListening();
            // Additional explicit microphone cleanup for safety
            if (microphoneStream.current) {
                microphoneStream.current.getTracks().forEach((track: any) => track.stop());
                microphoneStream.current = null;
                console.log('✅ Microphone disconnected successfully');
            }
            // Ensure all audio processing is stopped
            stopMicrophone();
            // Stop video if enabled
            if (videoControls.current && agoraClient.current) {
                await videoControls.current.stopVideo();
            }
            // Remove event listeners and leave channel
            if (agoraClient.current) {
                agoraClient.current.removeAllListeners('user-published');
                agoraClient.current.removeAllListeners('user-unpublished');
                agoraClient.current.removeAllListeners('stream-message');
                agoraClient.current.removeAllListeners('connection-state-change');
                agoraClient.current.removeAllListeners('token-privilege-did-expire');
                agoraClient.current.removeAllListeners('user-left');
                try {
                    await agoraClient.current.leave();
                } catch (error) {
                    console.warn('Error leaving Agora channel:', error);
                }
                agoraClient.current = null;
            }
            // Close session
            if (sessionData?.session_id) {
                try {
                    await endSessionApiRequest({session_id : sessionData.session_id});
                    console.log('Conversation ID:-=-=-=-', conversationId);
                    await conversationSummaryApiRequest({conversation_id : conversationId});
                } catch (error) {
                    console.error('Error closing session:', error);
                }
            }
            // Reset state (but preserve chat history)
            setIsConnected(false);
            setIsConnecting(false);
            setConnectionStatus('disconnected');
            setAudioMuted(true);
            setVideoEnabled(false);
            setVolumeMuted(false);
            // setChatHistory([]); // Don't clear chat history
            setIsAvatarSpeaking(false);
            setAvatarResponse('');
            setIsTyping(false);
            setError(null);
            setIsListening(false);
            setCurrentTranscript('');
            setInterimTranscript('');
            setFinalTranscript('');
            audioControls.current = null;
            videoControls.current = null;
            deepgramConnection.current = null;
            audioContext.current = null;
            processor.current = null;
            microphone.current = null;
            speechTimeout.current = null;
        } catch (error) {
            console.error('Error during cleanup:', error);
        }
    };

    // Initialize Streaming Avatar - ENHANCED
    const initializeStreamingAvatar = async () => {
        if (!agoraLoaded || !AgoraRTC) {
            setError('Video SDK not loaded yet. Please wait and try again.');
            return;
        }
        
        // Validate sessionData
        if (!sessionData) {
            setError('Session data is missing. Please try refreshing the page.');
            return;
        }
        
        // Validate credentials
        if (!sessionData.credentials) {
            setError('Session credentials are missing. Please check your avatar configuration.');
            return;
        }
        
        console.log('Initializing streaming avatar with session data:', sessionData);
        
        let client: any = null;
        try {
            setIsConnecting(true);
            setConnectionStatus('connecting');
            setError(null);
            // Use sessionData from parent component
            const credentials = sessionData.credentials;
            // Initialize Agora client
            client = await initializeAgoraClient(credentials);
            agoraClient.current = client;
            // Subscribe to avatar streams only
            await subscribeToAvatarStream(client as AgoraClient);
            // Set up message handlers
            setupMessageHandlers(client as AgoraClient);
            // CRITICAL: Set avatar to retelling mode MULTIPLE times with different approaches
            const retellingParams = {
                mode: 1, // Retelling mode
                lang: "en",
                voice_mode: "retelling",
                enable_asr: false, // Disable AKOOL's built-in ASR
                enable_llm: false, // Disable AKOOL's built-in LLM
                custom_llm: true   // Enable custom LLM mode
            };
            try {
                // Attempt 1: Immediate after connection
                await setAvatarParams(client as AgoraClient, retellingParams);
                // Attempt 2: After a short delay for backup
                setTimeout(async () => {
                    try {
                        await setAvatarParams(client as AgoraClient, retellingParams);
                    } catch (error) {
                        console.warn('Failed to set params on attempt 2:', error);
                    }
                }, 1000);
                // Attempt 3: Final confirmation
                setTimeout(async () => {
                    try {
                        await setAvatarParams(client as AgoraClient, retellingParams);
                    } catch (error) {
                        console.warn('Failed to set params on attempt 3:', error);
                    }
                }, 2500);
            } catch (error) {
                console.error('Failed to set avatar to retelling mode:', error);
                setError('Failed to configure avatar for custom LLM mode');
            }
            setIsConnected(true);
            setIsConnecting(false);
            setConnectionStatus('connected');
            // Send greeting immediately after connection is established
            const greetingMessage = "Hello, I'm Dr. Marie, nice to meet you, how can I help you today?";
            // Add welcome message to chat history
            setChatHistory([{
                type: 'assistant',
                content: greetingMessage,
                timestamp: new Date()
            }]);
            // Send greeting IMMEDIATELY - no delay
            try {
                const messageId = generateMessageId();
                await sendMessageToAvatar(client, greetingMessage, messageId);
                console.log('✅ Direct greeting sent successfully', greetingMessage);
            } catch (error) {
                console.error('Failed to send immediate greeting:', error);
            }
            // Enable voice mode automatically after connection
            try {
                const micStream = await navigator.mediaDevices.getUserMedia(getOptimalAudioConfig());
                if (micStream) {
                    microphoneStream.current = micStream;
                }
                setAudioMuted(false);
                // Start Deepgram speech recognition immediately after connection
                setTimeout(async () => {
                    const listeningStarted = await startDeepgramListening();
                    if (listeningStarted) {
                        console.log('Deepgram voice input started automatically');
                    }
                }, 1000);
            } catch (error) {
                console.error('Failed to enable voice mode:', error);
                if ((error as any).name === 'NotAllowedError') {
                    setError('Microphone access denied. Click the microphone button to enable voice chat.');
                } else {
                    setError('Failed to initialize voice recognition. You can still use text chat.');
                }
            }
            return client;
        } catch (error) {
            console.error('Error initializing streaming avatar:', error);
            setError(`Connection failed: ${(error as any).message}`);
            setIsConnecting(false);
            setConnectionStatus('disconnected');
            if (client) {
                try {
                    await client.leave();
                } catch (cleanupError) {
                    console.error('Error during cleanup:', cleanupError);
                }
            }
            throw error;
        }
    };

    // Connect to avatar
    const connectToAvatar = async () => {
        try {
            await initializeStreamingAvatar();
        } catch (error) {
            console.error('Failed to connect:', error);
        }
    };

    // Disconnect from avatar
    const disconnectFromAvatar = async () => {
        await performClientCleanup();
    };

    // Interrupt avatar - ENHANCED
    const handleInterrupt = async () => {
        if (!agoraClient.current) {
            console.warn('No Agora client available for interrupt');
            return;
        }
        try {
            if (isAvatarSpeaking) {
                await interruptAvatar(agoraClient.current);
            }
            // Always reset avatar state on interrupt
            setIsAvatarSpeaking(false);
            setAvatarResponse('');
            setIsTyping(false);
            // Ensure speech recognition continues after interrupt
            if (!audioMuted && !isListening) {
                setTimeout(async () => {
                    if (!isListening) {
                        const listeningStarted = await startDeepgramListening();
                        if (!listeningStarted) {
                            console.warn('Failed to restart Deepgram listening after interrupt');
                        }
                    }
                }, 200);
            }
        } catch (error) {
            console.error('Failed to interrupt avatar:', error);
            // Reset state anyway
            setIsAvatarSpeaking(false);
            setAvatarResponse('');
            setIsTyping(false);
        }
    };

    // Toggle audio (speech recognition)
    const toggleAudio = async () => {
        if (!isConnected) {
            console.warn('Cannot toggle audio - not connected');
            return;
        }
        if (audioMuted) {
            // Enable speech recognition
            try {
                try {
                    await navigator.mediaDevices.getUserMedia(getOptimalAudioConfig());
                } catch (permError) {
                    console.error('Microphone permission denied:', permError);
                    setError('Microphone access denied. Please allow microphone access and try again.');
                    return;
                }
                setAudioMuted(false);
                // Start Deepgram listening
                const listeningStarted = await startDeepgramListening();
                if (!listeningStarted) {
                    console.warn('Failed to start Deepgram listening');
                    setError('Failed to start speech recognition');
                }
            } catch (error) {
                console.error('Failed to start speech recognition:', error);
                setError('Failed to access microphone');
            }
        } else {
            // Disable speech recognition
            stopDeepgramListening();
            setAudioMuted(true);
        }
    };

    // Toggle video
    const toggleVideo = async () => {
        if (!isConnected) return;
        if (!localVideoTrack.current) {
            try {
                const videoTrack = await AgoraRTC.createCameraVideoTrack();
                if (agoraClient.current) {
                    await agoraClient.current.publish(videoTrack);
                }
                if (localVideoContainer.current) {
                    videoTrack.play(localVideoContainer.current);
                }
                localVideoTrack.current = videoTrack;
                setVideoEnabled(true);
            } catch (error) {
                console.error('Failed to start video:', error);
                setError('Failed to access camera');
            }
            return;
        }
        if (videoEnabled) {
            localVideoTrack.current.setEnabled(false);
            setVideoEnabled(false);
        } else {
            localVideoTrack.current.setEnabled(true);
            setVideoEnabled(true);
        }
    };

    // Toggle volume
    const toggleVolume = () => {
        setVolumeMuted(!volumeMuted);
        // Apply to remote tracks if available
        if (agoraClient.current) {
            const remoteUsers = agoraClient.current.remoteUsers;
            remoteUsers.forEach((user: any) => {
                if (user.audioTrack) {
                    user.audioTrack.setVolume(volumeMuted ? 100 : 0);
                }
            });
        }
    };

    // Send text message
    const sendMessage = async () => {
        if (!message.trim() || !isConnected || !agoraClient.current) return;
        const userMessage = message.trim();
        setMessage('');
        setIsTyping(true);
        // Add user message to chat
        setChatHistory(prev => [...prev, {
            type: 'user',
            content: userMessage,
            timestamp: new Date()
        }]);
        // Interrupt avatar if speaking
        if (isAvatarSpeaking) {
            await handleInterrupt();
        }
        // Send to avatar with LLM processing
        try {
            await sendMessageToAvatarWithLLM(agoraClient.current as AgoraClient, userMessage);
        } catch (error) {
            console.error('Failed to send message:', error);
            setError('Failed to send message');
            setIsTyping(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const toggleFullscreen = () => setIsFullscreen(!isFullscreen);

    // Initialize connection when sessionData is available
    useEffect(() => {
        if (sessionData && agoraLoaded && !isConnected && !isConnecting) {
            connectToAvatar();
        }
    }, [sessionData, agoraLoaded]);

    return (
        <div className="h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex">
            {/* Error Banner */}
            {error && (
                <div className="fixed top-0 left-0 right-0 z-50 bg-red-50 border-l-4 border-red-400 p-4">
                    <div className="flex items-center">
                        <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
                        <span className="text-red-700">{error}</span>
                        <button
                            onClick={() => setError(null)}
                            className="ml-auto text-red-400 hover:text-red-600"
                        >
                            ×
                        </button>
                    </div>
                </div>
            )}

            {/* Left Side - Video Stream */}
            <div className="flex-1 flex flex-col">
                {/* Video Header */}
                <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200/50 text-slate-900 p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <Bot className="h-5 w-5 text-emerald-500" />
                            <span className="font-medium text-slate-900">Dr. Marie Claire Bourque</span>
                        </div>
                        {isConnected && (
                            <div className="flex items-center space-x-2 text-sm text-slate-600">
                                <Clock className="h-4 w-4" />
                                <span>{formatTime(callDuration)}</span>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={toggleVolume}
                            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            {volumeMuted ? <VolumeX className="h-5 w-5 text-slate-600" /> : <Volume2 className="h-5 w-5 text-slate-600" />}
                        </button>
                        <button
                            onClick={toggleFullscreen}
                            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            {isFullscreen ? <Minimize className="h-5 w-5 text-slate-600" /> : <Maximize className="h-5 w-5 text-slate-600" />}
                        </button>
                        <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                            <Settings className="h-5 w-5 text-slate-600" />
                        </button>
                    </div>
                </div>

                {/* Video Stream */}
                <div className="flex-1 bg-gradient-to-br from-slate-100 to-blue-100 relative flex items-center justify-center">
                    <div className="relative w-full h-full">
                        {/* Avatar Video */}
                        <div className="w-full h-full relative">
                            <div
                                ref={remoteVideoContainer}
                                className="w-full h-full"
                            />

                            {!isConnected && (
                                <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
                                    <div className="text-center text-slate-900">
                                        <div className="w-32 h-32 bg-white border-2 border-slate-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow">
                                            <Bot className="h-16 w-16 text-blue-600" />
                                        </div>
                                        <h2 className="text-2xl font-semibold mb-2">Dr. Marie Claire Bourque</h2>
                                        <p className="text-lg text-slate-600 opacity-90">AI Psychiatrist</p>
                                        <div className="mt-4 flex items-center justify-center space-x-2">
                                            <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                                            <span className="text-sm text-slate-700">Ready to Connect</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Local Video Preview */}
                            {videoEnabled && (
                                <div className="absolute bottom-4 right-4 w-32 h-24 bg-gray-800 rounded-lg overflow-hidden border-2 border-white">
                                    <div
                                        ref={localVideoContainer}
                                        className="w-full h-full"
                                    />
                                </div>
                            )}

                            {/* Interrupt Button */}
                            {isAvatarSpeaking && (
                                <button
                                    onClick={handleInterrupt}
                                    className="absolute top-4 left-4 p-2 bg-red-500 bg-opacity-80 text-white rounded-full hover:bg-opacity-100 transition-all animate-pulse"
                                    title="Interrupt Dr. Marie"
                                >
                                    <Square className="w-5 h-5" />
                                </button>
                            )}

                            {/* Speaking Indicator */}
                            {isAvatarSpeaking && (
                                <div className="absolute bottom-4 left-4 bg-green-500 bg-opacity-80 text-white px-3 py-1 rounded-full text-sm">
                                    Dr. Marie is speaking...
                                </div>
                            )}

                            {/* Status Information */}
                            {/* {isConnected && (
                                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-center text-sm text-slate-600 space-y-2">
                                    {!audioMuted && !isListening && !isAvatarSpeaking && (
                                        <p className="text-emerald-600">Ready to listen - Custom LLM active</p>
                                    )}
                                    {isListening && !isAvatarSpeaking && (
                                        <div className="flex items-center justify-center space-x-2">
                                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                                            <span className="text-emerald-600 font-medium">Listening for speech...</span>
                                        </div>
                                    )}
                                    {isListening && isAvatarSpeaking && (
                                        <div className="flex items-center justify-center space-x-2">
                                            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                                            <span className="text-orange-600 font-medium">Listening (can interrupt)...</span>
                                        </div>
                                    )}
                                    {interimTranscript && (
                                        <div className="p-2 bg-blue-50 border border-blue-200 rounded-lg max-w-md mx-auto">
                                            <p className="text-blue-800 text-sm">
                                                <span className="font-medium">{isAvatarSpeaking ? 'Interrupting:' : 'Listening:'}</span> "{interimTranscript}"
                                            </p>
                                        </div>
                                    )}
                                    {speechBuffer.current && !interimTranscript && (
                                        <div className="p-2 bg-green-50 border border-green-200 rounded-lg max-w-md mx-auto">
                                            <div className="text-green-800 text-sm">
                                                <span className="font-medium">Speech so far:</span> "{speechBuffer.current}"
                                                {isWaitingForSpeechCompletion && (
                                                    <div className="text-green-600 text-xs mt-1 flex items-center justify-between">
                                                        <span className="flex items-center">
                                                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2 inline-block"></span>
                                                            Waiting for you to finish speaking... (2s)
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )} */}
                        </div>
                    </div>
                </div>

                {/* Video Controls */}
                <div className="bg-white/80 backdrop-blur-sm border-t border-slate-200/50 p-6 flex items-center justify-center space-x-4">
                    {!isConnected ? (
                        <button
                            onClick={connectToAvatar}
                            disabled={isConnecting || !agoraLoaded}
                            className="flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-400 text-white px-6 py-3 rounded-full font-medium transition-all transform hover:scale-105"
                        >
                            {isConnecting ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Connecting...</span>
                                </>
                            ) : !agoraLoaded ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Loading SDK...</span>
                                </>
                            ) : (
                                <>
                                    <Phone className="w-5 h-5" />
                                    <span>Connect to Dr. Marie</span>
                                </>
                            )}
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={toggleAudio}
                                disabled={!isConnected}
                                className={`p-4 rounded-full transition-all duration-200 ${audioMuted
                                    ? 'bg-red-500 hover:bg-red-600'
                                    : 'bg-slate-200 hover:bg-slate-300'
                                    }`}
                                title={audioMuted ? 'Enable Speech Recognition' : 'Disable Speech Recognition'}
                            >
                                {audioMuted ? <MicOff className="h-6 w-6 text-white" /> : <Mic className="h-6 w-6 text-slate-700" />}
                            </button>

                            <button
                                onClick={toggleVideo}
                                disabled={!isConnected}
                                className={`p-4 rounded-full transition-all duration-200 ${!videoEnabled
                                    ? 'bg-red-500 hover:bg-red-600'
                                    : 'bg-slate-200 hover:bg-slate-300'
                                    }`}
                                title={videoEnabled ? 'Disable Camera' : 'Enable Camera'}
                            >
                                {videoEnabled ? <Video className="h-6 w-6 text-slate-700" /> : <VideoOff className="h-6 w-6 text-white" />}
                            </button>

                            <button
                                onClick={disconnectFromAvatar}
                                className="p-6 rounded-full transition-all duration-200 bg-red-500 hover:bg-red-600"
                                title="Disconnect"
                            >
                                <PhoneOff className="h-8 w-8 text-white" />
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Right Side - Chat */}
            <div className="w-96 bg-white/80 backdrop-blur-sm flex flex-col border-l border-slate-200/50">
                {/* Chat Header */}
                <div className="bg-white border-b border-gray-300 p-3">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center">
                            <Bot className="h-5 w-5 text-black" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-black">Dr. Marie Claire Bourque</h3>
                            <p className="text-sm text-gray-600">AI Psychiatrist</p>
                        </div>
                    </div>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {chatHistory.map((msg, index) => (
                        <div
                            key={index}
                            className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-xs px-4 py-2 rounded-lg ${msg.type === 'user'
                                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
                                    : 'bg-slate-100 text-slate-900'
                                    }`}
                            >
                                <p className="text-sm">{msg.content}</p>
                                <p className={`text-xs mt-1 ${msg.type === 'user' ? 'text-blue-100' : 'text-slate-500'
                                    }`}>
                                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </div>
                    ))}

                    {/* Typing indicator */}
                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="bg-slate-100 px-4 py-2 rounded-lg">
                                <div className="flex space-x-1">
                                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Current avatar response */}
                    {/* {avatarResponse && (
                        <div className="flex justify-start">
                            <div className="bg-yellow-50 text-gray-900 border-yellow-200 border px-4 py-2 rounded-lg max-w-xs">
                                <p className="text-sm">{avatarResponse}</p>
                                <span className="text-xs text-yellow-600 mt-1 block">Dr. Marie speaking (Custom LLM)...</span>
                            </div>
                        </div>
                    )} */}

                    <div ref={chatContainerRef} />
                </div>

                {/* Chat Input */}
                <div className="p-4 border-t border-slate-200/50">
                    <div className="flex space-x-2">
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder={isConnected ? "Type your message..." : "Connect first to chat"}
                            disabled={!isConnected}
                            className="flex-1 resize-none border placeholder:text-slate-400 text-slate-900 border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                            rows={2}
                        />
                        <button
                            onClick={sendMessage}
                            disabled={!isConnected || !message.trim()}
                            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        >
                            <Send className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AvatarCallComponent;
