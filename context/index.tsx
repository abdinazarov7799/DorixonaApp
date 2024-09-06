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

    const {data, isLoading: isLoadingGetMe} = useFetchRequest({
        queryKey: KEYS.getMe,
        endpoint: ENDPOINTS.getMe,
        params: {include: 'checkpoint,employee.staff.department.rootParent,access,userPost.post,filialBank.title,rootDep.title'},
        headers: {'Authorization': `Bearer ${token}`},
        enabled: !!(token)
    })

    const logout = () => {
        setIsLoading(true);
        setToken(null);
        setUser(null);
        AsyncStorage.removeItem('token');
        AsyncStorage.removeItem('user');
        AsyncStorage.removeItem('certInfo');
        setIsLoading(false);
    }

    const isLoggedIn = async () => {
        try {
            setIsLoading(true)
            let userToken = await AsyncStorage.getItem('token');
            let userInfo = await AsyncStorage.getItem('user');
            // @ts-ignore
            userInfo = JSON?.parse(userInfo);
            if (userInfo) {
                setToken(userToken);
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
            AsyncStorage.setItem('user', JSON.stringify(data));
        }
    }, [data]);

    useEffect(() => {
        if (!token) {
            isLoggedIn()
        }
    }, []);

    return (
        <Context.Provider value={{user, setUser, token, isLoading: isLoading, logout, setToken}}>
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