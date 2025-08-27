import { axiosClient } from "./ApiClient";

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

