// Mock streaming response for testing the streaming functionality
// This simulates the data format you described

export const mockStreamingResponse = [
    { conversation_id: "38ccba17-88cd-4e07-8b5b-6a6f25fbd99d", done: false },
    { text: "Hello!  It's good to see you. ", done: false },
    { text: "What brings you in today?. ", done: false },
    { text: "", done: true }
];

export const simulateStreamingResponse = async (
    onChunk: (chunk: any) => void,
    delay: number = 100
): Promise<void> => {
    for (const chunk of mockStreamingResponse) {
        await new Promise(resolve => setTimeout(resolve, delay));
        onChunk(chunk);
    }
};

// Example usage in ChatInterface:
// await simulateStreamingResponse((chunk) => {
//     console.log('Received chunk:', chunk);
//     // Handle the chunk data
// });
