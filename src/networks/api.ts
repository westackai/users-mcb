import { getRequest, postRequest, putRequest, streamingPostRequest } from "./ApiRequest";
import { ENDPOINTS } from "./EndPoints";


// Authentication API Requests
export const authLoginApiRequest = async (payload :any) => {
    const response = await postRequest(ENDPOINTS.LOGIN, payload);
    return response;
}

export const authVerifyOtpApiRequest = async (payload :any) => {
    const response = await postRequest(ENDPOINTS.VERIFY_OTP, payload);
    return response;
}

export const authRegisterApiRequest = async (payload :any) => {
    const response = await postRequest(ENDPOINTS.REGISTER, payload);
    return response;
}



// User Profile API Requests
export const getUserDetailsApiRequest = async () => {
    const response = await getRequest(ENDPOINTS.GET_USER_DETAILS);
    return response;
}


export const updateUserDetailsApiRequest = async (Id :string, payload :any) => {
    const response = await postRequest(ENDPOINTS.UPDATE_USER_DETAILS + Id, payload);
    return response;
}



// Onboarding API Requests
export const onboardingCreateApiRequest = async (payload :any) => {
  return await postRequest(ENDPOINTS.ONBOARDING, payload);
  
}

export const getOnboardingApiRequest = async (Id :string) => {
    const response = await getRequest(ENDPOINTS.GET_ONBOARDING + Id);
    return response;
}

export const onboardingUpdateApiRequest = async (Id :string, payload :any) => {
    const response = await postRequest(ENDPOINTS.UPDATE_ONBOARDING + Id, payload);
    return response;
}

// Avatar List API Requests
export const avatarListApiRequest = async () => {
    const response = await getRequest(ENDPOINTS.AVATAR_LIST);
    return response;
}


export const createSessionApiRequest = (payload: any) => {
    return postRequest(ENDPOINTS.AVATAR_SESSION_CREATE, payload);
  };

export const avatarEndSessionApiRequest = async (payload :any) => {
    const response = await postRequest(ENDPOINTS.AVATAR_END_SESSION, payload);
    return response;
}

export const endSessionApiRequest = async (payload :any) => {
    const response = await postRequest(ENDPOINTS.AVATAR_END_SESSION, payload);
    return response;
}

export const sendMessageToAvatarApiRequest = async (payload :any) => {
    const response = await postRequest(ENDPOINTS.AVATAR_MESSAGE, payload);
    return response;
}

export const sendStreamingMessageToAvatarApiRequest = async (payload: any, onChunk: (chunk: any) => void) => {
    await streamingPostRequest(ENDPOINTS.AVATAR_MESSAGE, payload, onChunk);
}

export const getAvatarDetilasByIdApiRequest = async (avatarId: string) => {
    const response = await getRequest(ENDPOINTS.AVATAR_DETAILS + avatarId);
    return response;
}

// Conversation Summary API Requests
export const conversationSummaryApiRequest = async (payload :any) => {
    const response = await postRequest(ENDPOINTS.CONVERSATION_SUMMARY, payload);
    return response;
}

export const getConversationsApiRequest = async () => {
    const response = await getRequest(ENDPOINTS.GET_CONVERSATIONS);
    return response;
}

export const getConversationByIdApiRequest = async (conversationId :string) => {
    const response = await getRequest(ENDPOINTS.GET_CONVERSATION_BY_ID + conversationId);
    return response;
}

// Knowledge Base API Requests
export const getAllKnowledgeBasesApiRequest = async () => {
    const response = await getRequest(ENDPOINTS.GET_ALL_KNOWLEDGE_BASES);
    return response;
}

// Health Tip API Requests
export const getAllHealthTipsApiRequest = () => {
    return getRequest(ENDPOINTS.HEALTH_TIP);
  };
  
  export const getHealthTipByIdApiRequest = (Id: string) => { 
    return getRequest(ENDPOINTS.HEALTH_TIP_DETAILS_BY_ID + Id);
  }
  
  // Avatar Onboarding API Requests
  export const avatarOnboardingApiRequest = (avatarId: string) => {
    return getRequest(ENDPOINTS.AVATAR_ONBOARDING + avatarId);
  }

  export const updateAvatarOnboardingApiRequest = (avatarId: string, payload: any) => {
    return postRequest(ENDPOINTS.AVATAR_ONBOARDING_CREATE + avatarId, payload);
  }


//   Tavus Avatar AI
export const tavusAiApiRequest = (payload: any) => {
    return postRequest(ENDPOINTS.TAVUS_AI, payload);
}

// Create Tavus conversation with proper error handling
export const createTavusConversationApiRequest = async (payload: {
    replica_id: string;
    persona_id: string;
    voice_id?: string;
}) => {
    try {
        console.log('Creating Tavus conversation with payload:', payload);
        const response = await postRequest(ENDPOINTS.TAVUS_AI, JSON.stringify(payload));
        
        // Log the response for debugging
        console.log('Tavus API Response:', response);
        
        // Check if response has the expected structure
        if (!response || !response.data) {
            throw new Error('Invalid API response: No data received from Tavus API');
        }

        // Extract room URL from nested response structure
        const roomUrl = response.data?.data?.data?.room_url || response.data?.data?.room_url || response.data?.room_url;
        
        if (!roomUrl) {
            console.error('No room URL in Tavus response:', response.data);
            throw new Error('No room URL received from Tavus API. Please check your configuration.');
        }

        return {
            success: true,
            roomUrl: roomUrl,
            conversationId: response.data?.data?.data?.conversation_id,
            data: response.data
        };
        
    } catch (error) {
        console.error('Error creating Tavus conversation:', error);
        throw new Error(
            error instanceof Error 
                ? error.message 
                : 'Failed to create Tavus conversation. Please try again.'
        );
    }
}