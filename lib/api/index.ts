import { BASE_URL } from "@/constants";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

// Interceptor to include token in request
request.interceptors.request.use(
    async config => {
        const token = await AsyncStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// Response interceptor for token refresh
request.interceptors.response.use(
    response => {
        return response;
    },
    async error => {
        const originalRequest = error.config;

        // Agar 401 xatolik bo'lsa va hali tokenni yangilashga urinish qilinmagan bo'lsa:
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = await AsyncStorage.getItem('refreshToken');

                // Refresh token orqali yangi access token olish
                const { data } = await axios.post(`${BASE_URL}/auth/refresh-token`, { refreshToken });

                if (data?.accessToken) {
                    // Yangi access tokenni saqlash
                    await AsyncStorage.setItem('token', data.accessToken);

                    // So'rovni qayta yuborish uchun yangi tokenni qo'shish
                    originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;

                    // Qayta so'rovni yuborish
                    return axios(originalRequest);
                }
            } catch (refreshError) {
                console.log("Refresh token xatosi:", refreshError);
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export { request };
