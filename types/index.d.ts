import { ReactNode,SetStateAction,Dispatch } from "react";
export interface ChildProps {
    children: ReactNode;
}
export interface IUser {
    id: string;
    name: string;
}

export interface IContext {
    user: IUser | null;
    setUser: Dispatch<SetStateAction<IUser | null>>;
    token: string;
    refreshToken: string;
    logout: Dispatch<SetStateAction<any>>;
    setToken: Dispatch<SetStateAction<any>>;
    setRefreshToken: Dispatch<SetStateAction<any>>;
    isLoading: boolean;
}