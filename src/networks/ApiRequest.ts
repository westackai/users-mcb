import { axiosClient } from "./ApiClient";
import { getToken } from "../../_utils/cookies";

export const getRequest = (url:string, payload?:any) => {
  return axiosClient.get(url, {params: payload});
};

export const postRequest = (url:string, payload:any) => {
  return axiosClient.post(url, payload);
};

export const putRequest = (url:string, payload:any) => {
  return axiosClient.put(url, payload);
};

export const deleteRequest = (url:string) => {
  return axiosClient.delete(url);
};

export const patchRequest = (url:string, payload:any) => {
  return axiosClient.patch(url, payload);
};

export const getDownloadRequest = (url:string, payload:any) => {
  return axiosClient.get(url, {
    responseType: "blob",
  });
};

export const getSubscriptionType = (url:string) => {
  return axiosClient.get(url);
};

export const bulkUploadRequest = (url:string, payload:any) => {
  return axiosClient.post(url, payload, {
    timeout: 1200000, // 20 minutes timeout
  });
};

export const distributionRequest = (url:string, payload:any) => {
  return axiosClient.post(url, payload, {
    timeout: 1200000, // 20 minutes timeout
  });
};

export const customAssistantPrepareRequest = (url:string, payload:any) => {
  return axiosClient.post(url, payload, {
    timeout: 120000, // 20 minutes timeout
  });
};

export const streamingPostRequest = async (url: string, payload: any, onChunk: (chunk: any) => void) => {
  try {
    const fullUrl = `${process.env.NEXT_PUBLIC_API_URL}${url}`;
    console.log('Streaming request to:', fullUrl);
    console.log('Payload:', payload);
    
    // Get headers from axios client (including auth token)
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    
    // Add authorization header if token exists
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    console.log('Request headers:', headers);
    console.log('Request body:', JSON.stringify(payload));
    
    const response = await fetch(fullUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No reader available');
    }

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      
      // Handle different streaming formats
      // Check for SSE format first
      if (buffer.includes('data: ')) {
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // Keep incomplete line in buffer

        for (const line of lines) {
          if (line.trim()) {
            try {
              if (line.startsWith('data: ')) {
                const data = line.slice(6); // Remove 'data: ' prefix
                if (data.trim() === '[DONE]') {
                  return;
                }
                const chunk = JSON.parse(data);
                onChunk(chunk);
              }
            } catch (e) {
              console.warn('Failed to parse SSE chunk:', line, e);
            }
          }
        }
      } else {
        // Handle direct JSON chunks (your API format)
        // Look for complete JSON objects in the buffer
        let startIndex = 0;
        while (startIndex < buffer.length) {
          const openBrace = buffer.indexOf('{', startIndex);
          if (openBrace === -1) break;
          
          let braceCount = 0;
          let endIndex = openBrace;
          
          for (let i = openBrace; i < buffer.length; i++) {
            if (buffer[i] === '{') braceCount++;
            if (buffer[i] === '}') braceCount--;
            if (braceCount === 0) {
              endIndex = i;
              break;
            }
          }
          
          if (braceCount === 0) {
            // Found complete JSON object
            const jsonStr = buffer.slice(openBrace, endIndex + 1);
            try {
              const chunk = JSON.parse(jsonStr);
              console.log('Parsed chunk:', chunk);
              onChunk(chunk);
              
              // Remove processed JSON from buffer
              buffer = buffer.slice(endIndex + 1);
              startIndex = 0;
            } catch (e) {
              console.warn('Failed to parse JSON chunk:', jsonStr, e);
              startIndex = endIndex + 1;
            }
          } else {
            // Incomplete JSON, wait for more data
            break;
          }
        }
      }
    }
  } catch (error) {
    console.error('Streaming request error:', error);
    throw error;
  }
};

