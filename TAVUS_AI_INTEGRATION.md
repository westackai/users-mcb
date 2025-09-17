# Tavus AI Integration with Custom Daily UI

This document describes the implementation of Tavus AI conversational avatars using Daily.js SDK with custom UI styling.

## Overview

The integration consists of:
1. **API Integration**: Creating conversations via Tavus API
2. **Custom UI Component**: React component using Daily.js for video calls
3. **Page Integration**: Updated video consultation page

## Files Modified/Created

### 1. API Layer (`src/networks/api.ts`)
- Added `createTavusConversationApiRequest` function
- Proper error handling and room URL extraction
- Uses stock replica and persona IDs from Tavus documentation

### 2. Tavus Component (`src/components/Tavus-ai/TavusAiComponent.tsx`)
- Custom React component wrapping Daily.js
- Configurable UI customization (colors, buttons, language)
- Loading and error states
- Event handling for call lifecycle

### 3. Video Consultation Page (`src/app/(dashboard)/video-consultation/[id]/page.tsx`)
- Updated to use Tavus AI instead of previous avatar system
- Integrated TavusAiComponent with custom styling
- Proper session management and error handling

### 4. Example Files
- `public/tavus-example.html`: Simple HTML example following Tavus docs
- This documentation file

## Usage

### 1. API Configuration
Ensure your backend endpoint `/tavus/session/start` is configured to:
- Accept POST requests with `replica_id`, `persona_id`, and optional `voice_id`
- Forward requests to Tavus API: `https://tavusapi.com/v2/conversations`
- Return the room URL in the response

### 2. Stock IDs Used
Following Tavus documentation examples:
- **Replica ID**: `rfe12d8b9597` (Nathan)
- **Persona ID**: `pdced222244b` (Sales Coach)
- **Voice ID**: `s3TPKV1kjDlVtZbl4Ksh` (optional)

### 3. UI Customization
The component supports customization via props:
```typescript
<TavusAiComponent
  roomUrl={roomUrl}
  onCallEnd={handleCallEnd}
  onCallStart={handleCallStart}
  customization={{
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
  }}
/>
```

## Dependencies

- `@daily-co/daily-js`: ^0.84.0 (already installed)
- `@daily-co/daily-react`: ^0.23.2 (already installed)

## API Response Format

Expected response from your backend:
```json
{
  "data": {
    "room_url": "https://your-org.daily.co/room-name",
    // ... other Tavus response data
  }
}
```

## Error Handling

The integration includes comprehensive error handling:
- API request failures
- Missing room URL
- Daily.js connection errors
- Call lifecycle events

## Testing

1. Ensure your Tavus API key is configured in your backend
2. Navigate to `/video-consultation/[id]` page
3. The component will automatically create a Tavus conversation
4. Daily.js iframe will load with custom styling
5. Full-screen video call interface will appear

## Customization Options

Based on Daily.js documentation, you can customize:
- **Colors**: accent, background, baseText
- **Language**: Any supported locale code
- **Buttons**: Leave button, fullscreen button
- **Layout**: iframe styling and positioning

## Next Steps

1. Replace stock IDs with your custom replicas/personas
2. Add more UI customization options
3. Implement conversation history/analytics
4. Add mobile-specific optimizations
5. Integrate with user authentication/profiles

## Troubleshooting

### Common Issues:
1. **No room URL**: Check backend API configuration and Tavus API key
2. **Daily.js errors**: Ensure Daily.js is properly loaded
3. **Styling issues**: Check iframe positioning and z-index
4. **Mobile issues**: Test responsive design and touch interactions

### Debug Mode:
Enable console logging to see detailed error messages and API responses.
