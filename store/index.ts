import {create} from 'zustand';

const useStore = create((set) => ({
    user: null,
    accessToken: null,
    refreshToken: null,
    setUser: (user: any) => set((state: any) => ({...state, user})),
    setAccessToken: (accessToken: any) => set((state: any) => ({...state, accessToken})),
    setRefreshToken: (refreshToken: any) => set((state: any) => ({...state, refreshToken})),
    clearAuthData: () => set({
        user: null,
        accessToken: null,
        refreshToken: null,
    }),
}));

export default useStore;