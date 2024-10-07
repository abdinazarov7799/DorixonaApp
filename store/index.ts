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

const calculateFullPrice = (orders) => {
    return Object.values(orders).reduce((total, order) => total + (order.count * order.price), 0);
};

const useStore = create(
    persist(
        (set, get) => ({
            user: null,
            lang: null,
            accessToken: null,
            refreshToken: null,
            orders: {},
            fullPrice: 0,

            setUser: (user) => set((state) => ({ ...state, user })),

            setLang: (lang) => set((state) => ({ ...state, lang })),

            setAccessToken: (accessToken) => set((state) => ({ ...state, accessToken })),

            setRefreshToken: (refreshToken) => set((state) => ({ ...state, refreshToken })),

            clearAuthData: () => set(() => ({
                user: null,
                accessToken: null,
                refreshToken: null,
            })),

            setOrders: (orders) => set((state) => {
                const fullPrice = calculateFullPrice(orders);
                return { ...state, orders, fullPrice };
            }),

            addToOrder: (newOrder) => set((state) => {
                const updatedOrders = { ...state.orders };

                if (newOrder.count === 0 || newOrder.count === null) {
                    delete updatedOrders[newOrder.id];
                } else {
                    updatedOrders[newOrder.id] = newOrder;
                }

                const fullPrice = calculateFullPrice(updatedOrders);
                return { ...state, orders: updatedOrders, fullPrice };
            }),

            increment: (item) => set((state) => {
                const updatedOrders = { ...state.orders };

                if (updatedOrders[item.id]) {
                    updatedOrders[item.id].count++;
                } else {
                    updatedOrders[item.id] = { ...item, count: 1 };
                }

                const fullPrice = calculateFullPrice(updatedOrders);
                return { ...state, orders: updatedOrders, fullPrice };
            }),

            decrement: (id) => set((state) => {
                const updatedOrders = { ...state.orders };

                if (updatedOrders[id]?.count > 1) {
                    updatedOrders[id].count--;
                } else {
                    delete updatedOrders[id];
                }

                const fullPrice = calculateFullPrice(updatedOrders);
                return { ...state, orders: updatedOrders, fullPrice };
            }),
        }),
        {
            name: 'store-storage',
            getStorage: () => mmkvStorage,
        }
    )
);

export default useStore;