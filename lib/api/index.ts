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
        const accessToken = useStore.getState().accessToken;
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

const refreshToken = async () => {
    try {
        const refreshToken = await useStore.getState().refreshToken;
        console.log(refreshToken,'refreshToken')
        const response = await axios.post(`${BASE_URL}api/refresh-token`, {}, {
            headers: {
                'Authorization': `Bearer ${refreshToken}`
            }
        });
        console.log(response,'response')
        const newToken = response?.data?.accessToken;
        const newRefreshToken = response?.data?.refreshToken;
        useStore.getState().setAccessToken(newToken);
        useStore.getState().setRefreshToken(newRefreshToken);

        return newToken;
    } catch (error) {
        console.error("Error refreshing token:", error);
        return null;
    }
};
request.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const statusCode = error.response ? error.response.status : null;
        if (statusCode === 401) {
            const originalRequest = error.config;
            const newToken = await refreshToken();
            console.log(newToken,'newToken')
            if (newToken) {
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return axios(originalRequest);
            }else {
                useStore.getState().clearAuthData()
                router.push("/auth");
            }
        return Promise.reject(error);
    }
    }
)

export { request };
