import React, {createContext, useContext, useEffect, useState} from 'react';
import {ChildProps, IContext, IUser} from "@/types";
import useFetchRequest from "@/hooks/api/useFetchRequest";
import {ENDPOINTS, KEYS} from "@/constants";
import {isEmpty, isNil} from "lodash";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Context = createContext<IContext | null>(null);
export const Provider = ({children}: ChildProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState<IUser | null | any>(null);
    const [token, setToken] = useState<string | null | any>(null);
    const [refreshToken, setRefreshToken] = useState<string | null | any>(null);

    const {data, isLoading: isLoadingGetMe} = useFetchRequest({
        queryKey: KEYS.getMe,
        endpoint: ENDPOINTS.getMe,
        headers: {'Authorization': `Bearer ${token}`},
        enabled: !!(token)
    })

    const logout = () => {
        setIsLoading(true);
        setToken(null);
        setRefreshToken(null);
        setUser(null);
        AsyncStorage.removeItem('token');
        AsyncStorage.removeItem('refreshToken');
        AsyncStorage.removeItem('user');
        setIsLoading(false);
    }

    const isLoggedIn = async () => {
        try {
            setIsLoading(true)
            let userToken = await AsyncStorage.getItem('token');
            let refreshToken = await AsyncStorage.getItem('refreshToken');
            let userInfo = await AsyncStorage.getItem('user');
            // @ts-ignore
            userInfo = JSON?.parse(userInfo);
            if (userInfo) {
                setToken(userToken);
                setRefreshToken(refreshToken);
                setUser(userInfo);
            }
        } catch (e) {
            console.log('isLoggedIn', e)
        } finally {
            setIsLoading(false);
        }
    }
    useEffect(() => {
        if (!isEmpty(data) && !isNil(data)) {
            setUser(data);
            AsyncStorage.setItem('token', token);
            AsyncStorage.setItem('refreshToken', refreshToken);
            AsyncStorage.setItem('user', JSON.stringify(data));
        }
    }, [data]);

    useEffect(() => {
        if (!token) {
            isLoggedIn()
        }
    }, []);

    return (
        <Context.Provider value={{user, setUser, token, refreshToken,setRefreshToken, isLoading: isLoading, logout, setToken}}>
            {children}
        </Context.Provider>
    );
};

export const useGlobalContext = () => {
    const context = useContext(Context);
    if (!context)
        throw new Error("useGlobalContext must be used within a Provider");
    return context;
};