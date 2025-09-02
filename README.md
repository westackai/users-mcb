# Dr. MCB User Application

A comprehensive healthcare application with AI-powered video consultation capabilities.

## Features

### Video Consultation with AI Avatars
- **Real-time Video Streaming**: Connect with AI healthcare professionals through live video calls
- **Voice Recognition**: Advanced speech-to-text using Deepgram for natural conversations
- **Custom LLM Integration**: AI-powered responses with conversation memory
- **Interruption Support**: Users can interrupt AI responses for more natural interactions
- **Text Chat Fallback**: Text-based chat when voice is not available

### Available AI Avatars
- **Dr. Marie Claire Bourque**: AI Psychiatrist specializing in mental health and emotional support
- **Dr. Thaddeus**: AI Therapist expert in cognitive behavioral therapy

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Environment variables configured

### Environment Variables
Create a `.env.local` file with the following variables:

```env
NEXT_PUBLIC_BASE_API_URL=your_api_base_url
NEXT_PUBLIC_DEEPGRAM_API_KEY=your_deepgram_api_key
```

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd users-mcb
```

2. Install dependencies
```bash
npm install
```

3. Run the development server
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Video Consultation

1. **Navigate to Video Consultation**: Go to `/video-consultation`
2. **Select an Avatar**: Choose from available AI healthcare professionals
3. **Start Session**: Click "Start Consultation" to begin
4. **Connect**: The system will automatically create a session and connect to the avatar
5. **Interact**: Use voice or text to communicate with the AI

### Direct Access
You can also access specific avatars directly:
- Dr. Marie: `/video-consultation/dr-marie?avatar_id=dvp_Alinna_emotionsit_20250116`
- Dr. Thaddeus: `/video-consultation/dr-thaddeus?avatar_id=Thaddeus_ProfessionalLook2_public`

## Technical Architecture

### Components
- **AvatarStreemComponent**: Main video consultation component with real-time streaming
- **StreamingAvatarProvider**: Context provider for avatar session management
- **Video Consultation Pages**: Route-based pages for different consultation types

### Technologies Used
- **Next.js 15**: React framework with App Router
- **Agora RTC**: Real-time video communication
- **Deepgram**: Speech recognition and transcription
- **Tailwind CSS**: Styling and UI components
- **TypeScript**: Type safety and development experience

### API Integration
- **Session Management**: Create and manage avatar sessions
- **LLM Processing**: Custom AI responses through API integration
- **Message Handling**: Real-time message exchange with avatars

## Features in Detail

### Voice Recognition
- Real-time speech-to-text conversion
- Automatic interruption detection
- Speech completion waiting
- Echo cancellation and noise suppression

### Video Streaming
- High-quality video streaming
- Automatic connection management
- Fallback handling for connection issues
- Session cleanup on disconnect

### Chat Interface
- Real-time message exchange
- Typing indicators
- Message history
- Voice and text input support

## Troubleshooting

### Common Issues

1. **Microphone Access Denied**
   - Ensure browser permissions are granted
   - Check if microphone is available and working

2. **Connection Issues**
   - Verify environment variables are set correctly
   - Check network connectivity
   - Ensure API endpoints are accessible

3. **Video Not Loading**
   - Check browser compatibility
   - Ensure camera permissions are granted
   - Verify Agora credentials are valid

### Debug Mode
Enable debug logging by checking browser console for detailed error messages and connection status.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
