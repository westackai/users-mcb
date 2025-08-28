import { getRequest, postRequest, putRequest } from "./ApiRequest";
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
    const payload = {
        form : 2
    }
    const response = await getRequest(ENDPOINTS.AVATAR_LIST , payload);
    return response;
}