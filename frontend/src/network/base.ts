import axios from "axios";

import { auth } from "@/network/firebase";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const getIdToken = async () => {
  if (!auth?.currentUser) {
    throw new Error("User is not authenticated");
  }

  return await auth.currentUser.getIdToken(true);
};

export const get = async <TResponse>(url: string): Promise<TResponse> => {
  const token = await getIdToken();

  const response = await axiosInstance.get<TResponse>(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const mutate = async <TResponse, TPayload = unknown>(
  url: string,
  {
    method = "POST",
    payload,
    unauthenticatedRequest = false,
  }: {
    method?: "POST" | "PUT" | "PATCH" | "DELETE";
    payload?: TPayload;
    unauthenticatedRequest?: boolean;
  },
): Promise<TResponse> => {
  const response = await axiosInstance.request<TResponse>({
    url,
    method,
    data: payload,
    headers: {
      ...(unauthenticatedRequest
        ? {}
        : {
            Authorization: `Bearer ${await getIdToken()}`,
          }),
    },
  });

  return response.data;
};
