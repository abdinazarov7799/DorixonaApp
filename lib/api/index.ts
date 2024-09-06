import {BASE_URL} from "@/constants";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const request = axios.create({
    baseURL: BASE_URL,
    params: {
        _f: 'json',
    },
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
    async config => {
        const token = await AsyncStorage.getItem('token')
        console.log('Bearer',token)
        if (token) {
            config.headers.Authorization = "Bearer "+token
        }
        return config
    },
    error => {
        return Promise.reject(error)
    }
);

export {request};