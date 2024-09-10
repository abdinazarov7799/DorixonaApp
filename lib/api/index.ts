import { BASE_URL } from "@/constants";
import axios from "axios";
import useStore from "@/store";
import {router} from "expo-router";

// Axios instans yaratish
const request = axios.create({
    baseURL: BASE_URL,
    headers: {
        common: {
            Accept: 'application/json',
            'Content-Type': 'application/json; charset=utf-8',
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'no-cache',
        },
    },
});

request.interceptors.request.use(
    async (config) => {
        const accessToken = useStore.getState().accessToken; // Hooks o'rniga getState ishlatish
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

request.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        const refreshToken = useStore.getState().refreshToken; // Hooks o'rniga getState ishlatish
        const setAccessToken = useStore.getState().setAccessToken;
        const clearAuthData = useStore.getState().clearAuthData;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const { data } = await axios.post(`${BASE_URL}/auth/refresh-token`, {}, {
                    headers: {
                        Authorization: `Bearer ${refreshToken}`,
                    },
                });
                console.log(refreshToken,'refreshToken')
                console.log(data,'refreshToken data')

                if (data?.accessToken) {
                    setAccessToken(data.accessToken); // Access tokenni yangilash
                    originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
                    return axios(originalRequest);
                }
            } catch (refreshError) {
                console.log("Refresh token xatosi:", refreshError);
                clearAuthData()
                router.push("/auth")
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export { request };
