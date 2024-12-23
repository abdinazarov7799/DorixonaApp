import { MMKV } from 'react-native-mmkv';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const storage = new MMKV();

const mmkvStorage = {
    getItem: (key) => {
        const value = storage.getString(key);
        return Promise.resolve(value || null);
    },
    setItem: (key, value) => {
        storage.set(key, value);
        return Promise.resolve();
    },
    removeItem: (key) => {
        storage.delete(key);
        return Promise.resolve();
    }
};

export const useAuthStore = create(
    persist(
        (set) => ({
            user: null,
            accessToken: null,
            refreshToken: null,
            lang: 'uz',

            setUser: (user) => set({ user }),

            setAccessToken: (accessToken) => set({ accessToken }),

            setRefreshToken: (refreshToken) => set({ refreshToken }),

            setLang: (lang) => set({ lang }),

            clearAuthData: () => set({
                user: null,
                accessToken: null,
                refreshToken: null,
            }),
        }),
        {
            name: 'auth-storage',
            getStorage: () => mmkvStorage,
        }
    )
);


const calculateFullPrice = (orders) => {
    return Object.values(orders).reduce((total, order) => total + (order.count * order.price), 0);
};

export const useStore = create((set) => ({
    orders: {},
    fullPrice: 0,

    setOrders: (orders) => set(() => {
        const fullPrice = calculateFullPrice(orders);
        return { orders, fullPrice };
    }),

    addToOrder: (newOrder) => set((state) => {
        const updatedOrders = { ...state.orders };

        if (newOrder.count === 0 || newOrder.count === null) {
            delete updatedOrders[newOrder.id];
        } else {
            updatedOrders[newOrder.id] = newOrder;
        }

        const fullPrice = calculateFullPrice(updatedOrders);
        return { orders: updatedOrders, fullPrice };
    }),

    increment: (item) => set((state) => {
        const updatedOrders = { ...state.orders };

        if (updatedOrders[item.id]) {
            updatedOrders[item.id].count++;
        } else {
            updatedOrders[item.id] = { ...item, count: 1 };
        }

        const fullPrice = calculateFullPrice(updatedOrders);
        return { orders: updatedOrders, fullPrice };
    }),

    decrement: (id) => set((state) => {
        const updatedOrders = { ...state.orders };

        if (updatedOrders[id]?.count > 1) {
            updatedOrders[id].count--;
        } else {
            delete updatedOrders[id];
        }

        const fullPrice = calculateFullPrice(updatedOrders);
        return { orders: updatedOrders, fullPrice };
    }),
}));